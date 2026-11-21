import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  CLEANING_ADDONS,
  CLEANING_PACKAGES,
  FREQUENCY_OPTIONS,
  HOME_SIZE_OPTIONS,
  INITIAL_REVIEWS,
  TIME_SLOT_TEMPLATES,
  calculatePriceBreakdown,
} from './src/data/catalog.ts';
import type {
  BookingConfirmation,
  CustomerReview,
  DayAvailability,
  FrequencyId,
  HomeSizeId,
} from './src/types/cleaning.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const confirmedBookings = new Map<string, BookingConfirmation>();
const reviewsStore: CustomerReview[] = [...INITIAL_REVIEWS];

function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDayAvailability(isoDate: string): DayAvailability {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = isoDate.split('-').map(Number);
  const target = new Date(y, m - 1, d);

  if (target < today) {
    return {
      date: isoDate,
      status: 'past',
      slots: TIME_SLOT_TEMPLATES.map((t) => ({
        ...t,
        spotsRemaining: 0,
        available: false,
      })),
    };
  }

  // Open 24 hours a day, 7 days a week across every upcoming date and time window
  return {
    date: isoDate,
    status: 'available',
    slots: TIME_SLOT_TEMPLATES.map((template) => ({
      ...template,
      spotsRemaining: 1,
      available: true,
    })),
  };
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      mode: 'booking-24h',
    });
  });

  app.get('/api/packages', (_req, res) => {
    res.json({
      packages: CLEANING_PACKAGES,
      addons: CLEANING_ADDONS,
      homeSizes: HOME_SIZE_OPTIONS,
      frequencies: FREQUENCY_OPTIONS,
    });
  });

  app.get('/api/availability', (req, res) => {
    const monthParam = String(req.query.month || '');
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    if (/^\d{4}-\d{2}$/.test(monthParam)) {
      const [parsedYear, parsedMonth] = monthParam.split('-').map(Number);
      if (parsedMonth >= 1 && parsedMonth <= 12) {
        year = parsedYear;
        month = parsedMonth;
      }
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const days: DayAvailability[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(getDayAvailability(iso));
    }

    res.json({
      month: `${year}-${String(month).padStart(2, '0')}`,
      days,
    });
  });

  app.post('/api/bookings', (req, res) => {
    try {
      const {
        packageId,
        homeSizeId,
        frequencyId,
        addonIds = [],
        additionalHours = 0,
        date,
        slotId,
        customer,
      } = req.body ?? {};

      if (!packageId || !homeSizeId || !frequencyId || !date || !slotId) {
        res.status(400).json({
          error: 'Please select a package, property size, date, and arrival window.',
        });
        return;
      }

      if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.address?.trim()) {
        res.status(400).json({
          error: 'Customer name, email, and service street address are required.',
        });
        return;
      }

      const dayInfo = getDayAvailability(String(date));
      const targetSlot = dayInfo.slots.find((s) => s.id === slotId);
      if (dayInfo.status === 'past' || !targetSlot || !targetSlot.available) {
        res.status(400).json({
          error: 'Please choose today or an upcoming date and arrival window.',
        });
        return;
      }

      const safeExtraHours = Math.max(
        0,
        Math.min(12, Math.floor(Number(additionalHours) || 0))
      );

      const breakdown = calculatePriceBreakdown(
        String(packageId),
        homeSizeId as HomeSizeId,
        frequencyId as FrequencyId,
        Array.isArray(addonIds) ? addonIds.map(String) : [],
        0,
        safeExtraHours
      );

      const pkg =
        CLEANING_PACKAGES.find((p) => p.id === String(packageId)) ?? CLEANING_PACKAGES[1];
      const homeSize =
        HOME_SIZE_OPTIONS.find((h) => h.id === homeSizeId) ?? HOME_SIZE_OPTIONS[1];
      const frequency =
        FREQUENCY_OPTIONS.find((f) => f.id === frequencyId) ?? FREQUENCY_OPTIONS[0];
      const addonNames = CLEANING_ADDONS.filter((a) =>
        Array.isArray(addonIds) ? addonIds.map(String).includes(a.id) : false
      ).map((a) => a.name);

      const bookingId = `SW-${new Date().getFullYear()}-${crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase()}`;

      const confirmation: BookingConfirmation = {
        bookingId,
        status: 'confirmed',
        packageName: pkg.name,
        homeSizeLabel: homeSize.label,
        frequencyLabel: frequency.label,
        addonNames,
        additionalHours: safeExtraHours,
        date: String(date),
        timeWindow: targetSlot.window,
        customerName: String(customer.name).trim(),
        customerEmail: String(customer.email).trim(),
        serviceAddress: `${String(customer.address).trim()}, ${String(
          customer.cityZip || ''
        ).trim()}`.replace(/,\s*$/, ''),
        entryNotes: String(customer.entryNotes || '').trim(),
        bookedAt: new Date().toISOString(),
        breakdown,
      };

      confirmedBookings.set(bookingId, confirmation);
      res.status(201).json({ booking: confirmation });
    } catch (error) {
      console.error('booking error:', error);
      res.status(500).json({ error: 'Unable to confirm booking right now.' });
    }
  });

  app.get('/api/reviews', (req, res) => {
    const packageFilter = String(req.query.packageId || 'all');
    const filtered =
      packageFilter === 'all'
        ? reviewsStore
        : reviewsStore.filter((r) => r.packageId === packageFilter);

    const totalCount = reviewsStore.length;
    const avgRating =
      totalCount > 0
        ? Number(
            (reviewsStore.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(2)
          )
        : 5.0;

    res.json({
      reviews: filtered,
      summary: {
        averageRating: avgRating,
        totalReviews: 414 + totalCount,
        onTimeRate: '98.4%',
        recleanClaimRate: '< 0.8%',
      },
    });
  });

  app.post('/api/reviews', (req, res) => {
    const { authorName, authorLocation, packageId, rating, headline, body } = req.body ?? {};
    if (!authorName?.trim() || !headline?.trim() || !body?.trim()) {
      res.status(400).json({
        error: 'Please enter your name, a brief headline, and your review details.',
      });
      return;
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const pkg =
      CLEANING_PACKAGES.find((p) => p.id === packageId) ?? CLEANING_PACKAGES[0];

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      authorName: String(authorName).trim(),
      authorLocation: String(authorLocation || 'Verified Residence').trim(),
      packageId: pkg.id,
      packageName: pkg.name,
      rating: numericRating,
      dateLabel: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      headline: String(headline).trim(),
      body: String(body).trim(),
      outcomeMetric: 'Recently submitted client review',
      verifiedBooking: true,
    };

    reviewsStore.unshift(newReview);
    res.status(201).json({ review: newReview });
  });

  app.post('/api/chat', async (req, res) => {
    const { message, history = [] } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Please enter a message.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Live AI concierge requires GEMINI_API_KEY in Settings > Secrets. You can still browse packages and book directly using the calendar below.',
      });
      return;
    }

    try {
      const catalogContext = CLEANING_PACKAGES.map(
        (p) =>
          `- ${p.name} (id: ${p.id}): Starts at J$${p.basePrice.toLocaleString('en-US')} JMD for 1 Bed / 1 Bath (~${p.baseHours} hrs, ${p.teamSize} cleaners). ${p.description} Includes: ${p.checklist.join('; ')}`
      ).join('\n');

      const addonsContext = CLEANING_ADDONS.map(
        (a) => `- ${a.name}: +J$${a.price.toLocaleString('en-US')} JMD (+${a.minutes} mins) — ${a.detail}`
      ).join('\n');

      const systemInstruction = `You are the live booking specialist and customer concierge for Superwoman Cleaning Services Trelawny, a 5-star cleaning company registered with the Companies Office of Jamaica, based in Duncans and operating 24 hours a day, 7 days a week across Trelawny Parish, Ocho Rios, and Montego Bay.
Our mission is to transform homes, offices, and short-term rentals into pristine sanctuaries—restoring peace to weekends, enhancing productivity in workspaces, and guaranteeing five-star reviews for rental properties.
All prices are in Jamaican Dollars (JMD / J$). Answer concisely in 2-4 helpful sentences. Never use markdown tables or robotic jargon. Be warm, factual, and practical.

Services Offered:
- Residence Services (Residential Cleaning)
- Airbnb Services (Vacation & Short-Term Rental Turnarounds)
- Office Services (Office & Commercial Cleaning)
- Detailed Deep Cleaning for kitchens, bathrooms, living areas, and windows

Official Deep Cleaning Service Rate Sheet (JMD):
- 1 Bedroom 1 Bathroom: J$10,000
- 2 Bedrooms 2 Bathrooms: J$14,000
- 3 Bedrooms 3 Bathrooms: J$24,000
- 4 Bedrooms 4 Bathrooms: J$34,000
- 5 Bedrooms 5 Bathrooms: J$45,000
- Large House and Vacation Rental: Starts at J$60,000 (depends on size and condition).

Special Hourly Rate:
- J$780/hour for additional services such as washing, changing linen, folding, and etc.

Packages (Bi-weekly saves 15%; Weekly saves 20%):
${catalogContext}

Optional Add-Ons:
${addonsContext}

Key Policies & Direct Contact:
- Call / WhatsApp: (876) 474-0899
- Email: missdiandrosuperwomancleaning@gmail.com
- Operating Hours: Open 24 hours a day, 7 days a week — all dates and 24-hour arrival windows are open for scheduling.
- Registration: Fully registered Cleaning Company with the Companies Office of Jamaica.
- Service Areas: Trelawny, Montego Bay, and Ocho Rios.
- Supplies: We bring HEPA vacuums and EPA Safer Choice / botanical, pet-safe, stone-safe supplies.
- Guarantee: 100% 24-Hour Re-Clean Guarantee at no cost if anything is missed.
- Rescheduling: Free rescheduling or cancellation up to 24 hours before arrival.
- Payment: No online payment required when booking on the website; clients pay upon service completion or via invoice.
- Today's date: ${formatIsoDate(new Date())}.`;

      const contents = [
        ...(Array.isArray(history)
          ? history.slice(-8).map((item: { role: string; content: string }) => ({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(item.content || '') }],
            }))
          : []),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const replyText =
        response.text?.trim() ||
        'I can help you pick the right cleaning package or check 24-hour arrival windows. Which space are you booking for?';

      let suggestedPackageId: string | undefined;
      const lower = replyText.toLowerCase();
      if (lower.includes('vacation') || lower.includes('short-term rental') || lower.includes('airbnb')) {
        suggestedPackageId = 'vacation-rental-turnaround';
      } else if (lower.includes('detailed deep') || lower.includes('kitchens, bathrooms')) {
        suggestedPackageId = 'detailed-deep-clean';
      } else if (lower.includes('office') || lower.includes('commercial')) {
        suggestedPackageId = 'office-commercial';
      } else if (lower.includes('residential')) {
        suggestedPackageId = 'residential-cleaning';
      }

      res.json({
        reply: replyText,
        suggestedPackageId,
      });
    } catch (error: unknown) {
      console.error('Gemini chat error:', error);
      const errObj = error as { status?: number; message?: string };
      const status = errObj?.status || 500;
      if (status === 403 || status === 400) {
        res.status(status).json({
          error:
            'Unable to reach the AI concierge. Please verify GEMINI_API_KEY in Settings > Secrets.',
        });
        return;
      }
      if (status === 429) {
        res.status(429).json({
          error: 'Live chat is experiencing high traffic right now. Please try again in a moment.',
        });
        return;
      }
      res.status(500).json({
        error: 'Live chat encountered a temporary issue. Please try sending your question again.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Superwoman Cleaning Services server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
