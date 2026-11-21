import type {
  CleaningAddon,
  CleaningPackage,
  CustomerReview,
  FrequencyId,
  FrequencyOption,
  HomeSizeId,
  HomeSizeOption,
  PriceBreakdown,
} from '../types/cleaning.ts';

export function formatJmd(amount: number, showDecimals = false): string {
  return `J$${amount.toLocaleString('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}

export const HERO_IMAGE =
  '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.11.11_AM__4__1c92048e.jpeg';

export const SPECIAL_HOURLY_RATE = 780;
export const SPECIAL_HOURLY_DESCRIPTION =
  'Additional services such as washing, changing linen, folding, and etc.';

export const COMPANIES_OFFICE_DISCLAIMER =
  'Rates reflect that Superwoman Cleaning Services is a fully registered cleaning company with the Companies Office of Jamaica.';

export const CONTACT_INFO = {
  email: 'missdiandrosuperwomancleaning@gmail.com',
  phoneDisplay: '(876) 474-0899',
  phoneHref: 'tel:+18764740899',
  whatsappHref: 'https://wa.me/18764740899',
};

export const HOME_SIZE_OPTIONS: HomeSizeOption[] = [
  {
    id: '1bed',
    label: '1 Bed · 1 Bath',
    spec: '1 Bedroom, 1 Bathroom',
    hoursOffset: 0,
  },
  {
    id: '2bed',
    label: '2 Bed · 2 Bath',
    spec: '2 Bedrooms, 2 Bathrooms',
    hoursOffset: 0.5,
  },
  {
    id: '3bed',
    label: '3 Bed · 3 Bath',
    spec: '3 Bedrooms, 3 Bathrooms',
    hoursOffset: 1.5,
  },
  {
    id: '4bed',
    label: '4 Bed · 4 Bath',
    spec: '4 Bedrooms, 4 Bathrooms',
    hoursOffset: 2.5,
  },
  {
    id: '5bed',
    label: '5 Bed · 5 Bath',
    spec: '5 Bedrooms, 5 Bathrooms',
    hoursOffset: 3.5,
  },
  {
    id: 'large-villa',
    label: 'Large House / Rental',
    spec: 'Large House & Vacation Rental (Starting rate · size & condition)',
    hoursOffset: 4.5,
  },
];

export const PACKAGE_PRICE_MATRIX: Record<string, Record<HomeSizeId, number>> = {
  'detailed-deep-clean': {
    '1bed': 10000,
    '2bed': 14000,
    '3bed': 24000,
    '4bed': 34000,
    '5bed': 45000,
    'large-villa': 60000,
  },
  'residential-cleaning': {
    '1bed': 8000,
    '2bed': 11000,
    '3bed': 18500,
    '4bed': 26500,
    '5bed': 35000,
    'large-villa': 48000,
  },
  'vacation-rental-turnaround': {
    '1bed': 12000,
    '2bed': 18000,
    '3bed': 28000,
    '4bed': 38000,
    '5bed': 50000,
    'large-villa': 60000,
  },
  'office-commercial': {
    '1bed': 12000,
    '2bed': 16500,
    '3bed': 26000,
    '4bed': 36000,
    '5bed': 48000,
    'large-villa': 65000,
  },
};

export function getPackageSizePrice(packageId: string, homeSizeId: HomeSizeId): number {
  const pkgMap =
    PACKAGE_PRICE_MATRIX[packageId] ?? PACKAGE_PRICE_MATRIX['detailed-deep-clean'];
  return pkgMap[homeSizeId] ?? pkgMap['2bed'];
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    id: 'one-time',
    label: 'One-Time',
    discountRate: 0,
    summary: 'Single scheduled visit',
  },
  {
    id: 'bi-weekly',
    label: 'Bi-Weekly · Save 15%',
    discountRate: 0.15,
    summary: 'Every 2 weeks, priority slots',
  },
  {
    id: 'weekly',
    label: 'Weekly · Save 20%',
    discountRate: 0.2,
    summary: 'Dedicated team every week',
  },
];

export const CLEANING_PACKAGES: CleaningPackage[] = [
  {
    id: 'residential-cleaning',
    number: '01.',
    name: 'Residential Cleaning',
    subtitle: 'Routine home, living area, kitchen & bath care',
    description:
      'Consistent upkeep for houses, townhouses, and apartments. Our two-person crew resets living areas, kitchens, bathrooms, bedrooms, and high-traffic floors.',
    basePrice: 8000,
    baseHours: 2.0,
    teamSize: 2,
    image: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.32_AM__1__dc70c7ce.jpeg',
    imageAlt:
      'Spotless modern bathroom vanity, mirror, toilet, and glass walk-in shower after residential cleaning',
    idealFor: 'Weekly or bi-weekly home upkeep',
    checklist: [
      'Living areas dusted, upholstery HEPA-vacuumed & floors damp-mopped',
      'Kitchen countertops, stovetop exterior, sink & faucet sanitization',
      'Bathroom vanities, mirrors, glass showers & tile surfaces scrubbed',
      'Bedroom resets, interior window sills wiped & waste liners replaced',
    ],
  },
  {
    id: 'detailed-deep-clean',
    number: '02.',
    name: 'Detailed Deep Cleaning',
    subtitle: 'Kitchens, bathrooms, living areas & windows',
    description:
      'Our flagship deep cleaning service built for kitchens, bathrooms, living areas, and windows. Official rates scale by bedroom and bathroom count from 1 Bed / 1 Bath (J$10,000) to Large Houses & Vacation Rentals (starting at J$60,000).',
    basePrice: 10000,
    baseHours: 3.0,
    teamSize: 3,
    featured: true,
    image: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.29_AM_28b743b1.jpeg',
    imageAlt:
      'Deep-cleaned kitchen with spotless gas stove, refrigerator, wood cabinets, window, and gleaming tile floor',
    idealFor: 'First-time visits & seasonal resets',
    checklist: [
      'Kitchen deep degrease: range hood, backsplash, cabinet faces & sink descaling',
      'Bathroom restoration: tile grout scrubbing, shower glass descaling & chrome polish',
      'Living areas: baseboards, trim, ceiling fans, vents & under-furniture HEPA clean',
      'Detailed window cleaning: interior glass panes, frames, sills & sliding tracks',
    ],
  },
  {
    id: 'vacation-rental-turnaround',
    number: '03.',
    name: 'Vacation & Short-Term Rental Turnaround',
    subtitle: 'Same-day Airbnb & villa guest turnovers',
    description:
      'Fast, inspection-ready turnarounds between guest check-out and check-in for short-term rentals, villas, and large vacation properties (large rental turnarounds start at J$60,000 depending on size and condition).',
    basePrice: 12000,
    baseHours: 3.5,
    teamSize: 3,
    image: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.29_AM__1__ccf5a0d3.jpeg',
    imageAlt:
      'Guest-ready bedroom turnaround with crisply staged bed linens, yellow runner, and freshly mopped tile floors',
    idealFor: 'Airbnb, Vrbo & vacation properties',
    checklist: [
      'Check-out to check-in sanitization of kitchens, bathrooms & living spaces',
      'Fresh bed linen staging, towel folds & surface reset to host standards',
      'Patio glass doors, interior windows & high-touch switches wiped streak-free',
      'Amenity restock verification & photo completion report sent to host',
    ],
  },
  {
    id: 'office-commercial',
    number: '04.',
    name: 'Office & Commercial Cleaning',
    subtitle: 'Offices, studios, retail & workspace care',
    description:
      'Discreet morning or after-hours maintenance for offices, commercial suites, and retail spaces—keeping workstations, conference rooms, glass partitions, and restrooms spotless.',
    basePrice: 12000,
    baseHours: 2.5,
    teamSize: 2,
    image: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.11.11_AM__5__e756ae54.jpeg',
    imageAlt:
      'Spotless wood-tile accent wall, mounted screen, and dusted floating shelves after commercial cleaning',
    idealFor: 'Offices, studios & commercial spaces',
    checklist: [
      'Workstations, conference tables, reception lounges & acoustic panels',
      'Breakroom kitchens, espresso stations, appliances & restroom sanitization',
      'Commercial entry glass doors, interior partition windows & window sills',
      'Registered commercial invoicing & COI available on request',
    ],
  },
];

export interface WorkGalleryItem {
  id: string;
  title: string;
  category: 'Living & Bedrooms' | 'Kitchens' | 'Bathrooms & Showers' | 'Windows & Details';
  src: string;
  alt: string;
}

export const REAL_WORK_GALLERY: WorkGalleryItem[] = [
  {
    id: 'gal-living',
    title: 'Living Room & Sectional Care',
    category: 'Living & Bedrooms',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.11.11_AM__4__1c92048e.jpeg',
    alt: 'Cleaned living room with sectional sofa, throw pillows, glass coffee table, and tile floors',
  },
  {
    id: 'gal-kitchen',
    title: 'Kitchen Full Deep Clean',
    category: 'Kitchens',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.29_AM_28b743b1.jpeg',
    alt: 'Spotless kitchen stove, stainless refrigerator, wood cabinetry, and freshly mopped tile floor',
  },
  {
    id: 'gal-bedroom',
    title: 'Airbnb Guest Bedroom Reset',
    category: 'Living & Bedrooms',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.29_AM__1__ccf5a0d3.jpeg',
    alt: 'Guest-ready bedroom with made bed linens, yellow bed runner, and clean floor tiles',
  },
  {
    id: 'gal-kitchen-sink',
    title: 'Kitchen Sink & Drain Detailing',
    category: 'Kitchens',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.31_AM__1__c7651ff7.jpeg',
    alt: 'Cleaned stainless kitchen sink basin, drain basket, and countertop',
  },
  {
    id: 'gal-shower-glass',
    title: 'Glass Walk-In Shower Descaling',
    category: 'Bathrooms & Showers',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.30_AM_a5f668e9.jpeg',
    alt: 'Streak-free glass shower doors and polished marble wall tiles',
  },
  {
    id: 'gal-jacuzzi',
    title: 'Jetted Spa Tub Sanitization',
    category: 'Bathrooms & Showers',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.11.12_AM__3__cd8740b4.jpeg',
    alt: 'Spotless white whirlpool jacuzzi tub and stone wall tile',
  },
  {
    id: 'gal-window',
    title: 'Sliding Window & Track Care',
    category: 'Windows & Details',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.11.12_AM__1__ad5bc1de.jpeg',
    alt: 'Clean white sliding window panes, frame, and tiled window sill',
  },
  {
    id: 'gal-vanity',
    title: 'Sink & Matte Faucet Polish',
    category: 'Bathrooms & Showers',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.32_AM_e7836a1e.jpeg',
    alt: 'Clean white bathroom basin sink and matte black faucet fixture',
  },
  {
    id: 'gal-coffee-table',
    title: 'Glass Table & Living Floor Polish',
    category: 'Living & Bedrooms',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.11.12_AM_e65b1c94.jpeg',
    alt: 'Polished round glass and wood coffee table over clean floor tile',
  },
];

export const KITCHEN_BEFORE_AFTER = {
  beforeSrc: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.31_AM__2__83871dc9.jpeg',
  beforeAlt: 'Kitchen corner countertop before deep cleaning',
  afterSrc: '/assets/aistudio/WhatsApp_Image_2026-11-21_at_11.15.29_AM_28b743b1.jpeg',
  afterAlt: 'Spotless kitchen after Superwoman deep cleaning service',
};

export const CLEANING_ADDONS: CleaningAddon[] = [
  {
    id: 'inside-oven',
    name: 'Inside Oven Deep Degrease',
    detail: 'Racks soaked, baked-on kitchen grease removed',
    price: 3500,
    minutes: 35,
  },
  {
    id: 'inside-fridge',
    name: 'Inside Refrigerator & Seals',
    detail: 'Shelves removed, washed & sanitized',
    price: 3500,
    minutes: 35,
  },
  {
    id: 'interior-windows',
    name: 'Full Exterior & Track Window Care',
    detail: 'Ground-level exterior panes & deep tracks',
    price: 4500,
    minutes: 45,
  },
  {
    id: 'laundry-fold',
    name: 'Washing, Changing Linen & Folding',
    detail: 'Special rate: J$780/hr (washing, linen change, folding, etc.)',
    price: 780,
    minutes: 60,
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'Claire Thornton',
    authorLocation: 'Montego Bay · 3-Bed 3-Bath Residence',
    packageId: 'detailed-deep-clean',
    packageName: 'Detailed Deep Cleaning',
    rating: 5,
    dateLabel: 'October 2026',
    headline: 'Kitchen counters, bathrooms, and tall windows looked newly installed.',
    body: 'We booked the 3 Bed 3 Bath Detailed Deep Cleaning before hosting family. The Superwoman crew degreased our kitchen cabinetry, scrubbed every bathroom tile grout line, and cleared months of dust from our living area window tracks.',
    outcomeMetric: 'J$24,000 flat rate · Kitchen, 3 baths & 16 windows',
    verifiedBooking: true,
  },
  {
    id: 'rev-2',
    authorName: 'Marcus Delgado',
    authorLocation: 'Montego Bay · Commercial Office',
    packageId: 'office-commercial',
    packageName: 'Office & Commercial Cleaning',
    rating: 5,
    dateLabel: 'November 2026',
    headline: 'Reliable Tuesday mornings before our client reviews.',
    body: 'Our previous janitorial vendor missed glass partition fingerprints and left streaks on our conference table. Superwoman Cleaning Services sends the same two specialists every Tuesday at 7:30 AM with full Companies Office registered invoicing.',
    outcomeMetric: '18 consecutive on-time visits · Weekly plan',
    verifiedBooking: true,
  },
  {
    id: 'rev-3',
    authorName: 'Hannah & Devon Sato',
    authorLocation: 'Ocho Rios · Vacation Rental Villa',
    packageId: 'vacation-rental-turnaround',
    packageName: 'Vacation & Short-Term Rental Turnaround',
    rating: 5,
    dateLabel: 'October 2026',
    headline: 'Guest-ready turnaround completed inside our 3-hour window.',
    body: 'Between back-to-back Airbnb bookings, timing is everything. Superwoman Cleaning Services reset the kitchen and bathrooms, polished the patio glass doors, staged fresh linens, and texted completion photos an hour before check-in.',
    outcomeMetric: '5.0 cleanliness score across 22 guest stays',
    verifiedBooking: true,
  },
  {
    id: 'rev-4',
    authorName: 'Nadia Lindqvist',
    authorLocation: 'Trelawny · 2-Bed 2-Bath Townhouse',
    packageId: 'residential-cleaning',
    packageName: 'Residential Cleaning',
    rating: 5,
    dateLabel: 'November 2026',
    headline: 'Unscented, pet-safe products across our living areas and kitchen.',
    body: 'With two golden retrievers, strong chemical fragrances are a dealbreaker for us. Superwoman uses plant-based formulas that leave zero harsh scent while keeping our living room, bathrooms, and stainless steel spotless every two weeks.',
    outcomeMetric: 'Bi-weekly subscriber · 15% recurring savings',
    verifiedBooking: true,
  },
];

export const TIME_SLOT_TEMPLATES = [
  { id: '0600', label: 'Early Morning', window: '06:00 AM – 10:00 AM' },
  { id: '1000', label: 'Mid-Morning', window: '10:00 AM – 02:00 PM' },
  { id: '1400', label: 'Afternoon', window: '02:00 PM – 06:00 PM' },
  { id: '1800', label: 'Evening', window: '06:00 PM – 10:00 PM' },
  { id: '2200', label: 'Night Shift (Commercial / Rental)', window: '10:00 PM – 02:00 AM' },
  { id: '0200', label: 'Overnight Dispatch', window: '02:00 AM – 06:00 AM' },
];

export function calculatePriceBreakdown(
  packageId: string,
  homeSizeId: HomeSizeId,
  frequencyId: FrequencyId,
  addonIds: string[],
  tipPercent = 0,
  additionalHours = 0
): PriceBreakdown {
  const pkg = CLEANING_PACKAGES.find((p) => p.id === packageId) ?? CLEANING_PACKAGES[1];
  const size = HOME_SIZE_OPTIONS.find((s) => s.id === homeSizeId) ?? HOME_SIZE_OPTIONS[1];
  const freq = FREQUENCY_OPTIONS.find((f) => f.id === frequencyId) ?? FREQUENCY_OPTIONS[0];

  const packageBase = pkg.basePrice;
  const sizeAdjusted = getPackageSizePrice(pkg.id, size.id);
  const frequencyDiscount = Math.round(sizeAdjusted * freq.discountRate);
  const discountedPackage = sizeAdjusted - frequencyDiscount;

  const selectedAddons = CLEANING_ADDONS.filter((a) => addonIds.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const addonsHours = selectedAddons.reduce((sum, a) => sum + a.minutes, 0) / 60;

  const safeExtraHours = Math.max(0, Math.min(12, Math.floor(Number(additionalHours) || 0)));
  const additionalHourlyTotal = safeExtraHours * SPECIAL_HOURLY_RATE;

  const subtotal = discountedPackage + addonsTotal + additionalHourlyTotal;
  const taxAmount = Number((subtotal * 0.0825).toFixed(2));
  const tipAmount = Number((subtotal * (tipPercent / 100)).toFixed(2));
  const total = Number((subtotal + taxAmount + tipAmount).toFixed(2));
  const estimatedHours = Number(
    (pkg.baseHours + size.hoursOffset + addonsHours + safeExtraHours).toFixed(1)
  );

  return {
    packageBase,
    sizeAdjusted,
    frequencyDiscount,
    addonsTotal,
    additionalHourlyTotal,
    subtotal,
    taxAmount,
    tipAmount,
    total,
    estimatedHours,
  };
}
