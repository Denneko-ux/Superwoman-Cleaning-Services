import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Printer,
} from 'lucide-react';
import {
  CLEANING_ADDONS,
  CLEANING_PACKAGES,
  COMPANIES_OFFICE_DISCLAIMER,
  CONTACT_INFO,
  FREQUENCY_OPTIONS,
  HOME_SIZE_OPTIONS,
  SPECIAL_HOURLY_RATE,
  calculatePriceBreakdown,
  formatJmd,
} from '../data/catalog.ts';
import type {
  BookingConfirmation,
  DayAvailability,
  FrequencyId,
  HomeSizeId,
} from '../types/cleaning.ts';

interface BookingCheckoutSectionProps {
  selectedPackageId: string;
  selectedHomeSize: HomeSizeId;
  selectedFrequency: FrequencyId;
  selectedAddonIds: string[];
  additionalHours: number;
  onSelectPackage: (id: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatReadableDate(iso: string): string {
  if (!iso) return 'Select a date';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function downloadIcsFile(booking: BookingConfirmation) {
  const [y, m, d] = booking.date.split('-');
  const startMatch = booking.timeWindow.match(/(\d{2}):(\d{2})\s*(AM|PM)/);
  let hour = 9;
  let minute = 0;
  if (startMatch) {
    hour = Number(startMatch[1]);
    minute = Number(startMatch[2]);
    if (startMatch[3] === 'PM' && hour < 12) hour += 12;
    if (startMatch[3] === 'AM' && hour === 12) hour = 0;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  const dtStart = `${y}${m}${d}T${pad(hour)}${pad(minute)}00`;
  const dtEnd = `${y}${m}${d}T${pad(Math.min(23, hour + 3))}${pad(minute)}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Superwoman Cleaning Services//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${booking.bookingId}@superwomancleaning.com`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Superwoman Cleaning Services — ${booking.packageName}`,
    `LOCATION:${booking.serviceAddress}`,
    `DESCRIPTION:Booking Reference: ${booking.bookingId}\\nPackage: ${booking.packageName}\\nWindow: ${booking.timeWindow}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${booking.bookingId}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function BookingCheckoutSection({
  selectedPackageId,
  selectedHomeSize,
  selectedFrequency,
  selectedAddonIds,
  additionalHours,
  onSelectPackage,
}: BookingCheckoutSectionProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [monthDays, setMonthDays] = useState<DayAvailability[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  // Customer & Service Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [cityZip, setCityZip] = useState('');
  const [entryNotes, setEntryNotes] = useState('Smart lock / Door code provided');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const monthKey = formatMonthKey(currentMonthDate);

  const fetchAvailability = async (targetMonthKey: string) => {
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      const res = await fetch(`/api/availability?month=${encodeURIComponent(targetMonthKey)}`);
      if (!res.ok) {
        throw new Error('Could not load schedule calendar.');
      }
      const data = (await res.json()) as { days: DayAvailability[] };
      setMonthDays(data.days);

      const currentStillValid = data.days.find(
        (d) => d.date === selectedDate && d.status !== 'past'
      );
      if (!currentStillValid) {
        const firstOpenDay = data.days.find((d) => d.status !== 'past');
        if (firstOpenDay) {
          setSelectedDate(firstOpenDay.date);
          const firstSlot = firstOpenDay.slots.find((s) => s.available);
          setSelectedSlotId(firstSlot?.id ?? '');
        }
      }
    } catch (err) {
      setCalendarError(
        err instanceof Error ? err.message : 'Unable to reach scheduling server.'
      );
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability(monthKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const selectedDayObj = useMemo(
    () => monthDays.find((d) => d.date === selectedDate) ?? null,
    [monthDays, selectedDate]
  );

  const activePackage =
    CLEANING_PACKAGES.find((p) => p.id === selectedPackageId) ?? CLEANING_PACKAGES[1];
  const activeSize =
    HOME_SIZE_OPTIONS.find((s) => s.id === selectedHomeSize) ?? HOME_SIZE_OPTIONS[1];
  const activeFrequency =
    FREQUENCY_OPTIONS.find((f) => f.id === selectedFrequency) ?? FREQUENCY_OPTIONS[0];
  const activeAddons = CLEANING_ADDONS.filter((a) => selectedAddonIds.includes(a.id));

  const breakdown = useMemo(
    () =>
      calculatePriceBreakdown(
        selectedPackageId,
        selectedHomeSize,
        selectedFrequency,
        selectedAddonIds,
        0,
        additionalHours
      ),
    [selectedPackageId, selectedHomeSize, selectedFrequency, selectedAddonIds, additionalHours]
  );

  const firstWeekdayOffset = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    const today = new Date();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const prev = new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth() - 1,
      1
    );
    if (prev >= minMonth) {
      setCurrentMonthDate(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!selectedDate || !selectedSlotId) {
      setBookingError('Please select a date and 24-hour arrival window on the calendar.');
      return;
    }
    if (!customerName.trim()) {
      setBookingError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setBookingError('Please enter a valid email address for your booking confirmation.');
      return;
    }
    if (!serviceAddress.trim()) {
      setBookingError('Please enter your street address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackageId,
          homeSizeId: selectedHomeSize,
          frequencyId: selectedFrequency,
          addonIds: selectedAddonIds,
          additionalHours,
          date: selectedDate,
          slotId: selectedSlotId,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: serviceAddress,
            cityZip,
            entryNotes,
          },
        }),
      });

      const data = (await res.json()) as {
        booking?: BookingConfirmation;
        error?: string;
      };
      if (!res.ok || !data.booking) {
        throw new Error(data.error || 'Unable to confirm booking right now.');
      }

      setConfirmation(data.booking);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : 'Unable to confirm booking right now.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-16 lg:py-20 border-b border-[#E4E2DA] bg-[#F2F1EC]/55">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2
              className="font-display text-3xl lg:text-4xl font-medium tracking-tight text-[#14211D]"
              style={{ textWrap: 'balance' }}
            >
              24-Hour Booking Calendar
            </h2>
            <p className="mt-2.5 text-base text-[#4E5D57] max-w-[60ch]">
              All upcoming dates and 24-hour arrival windows are open 7 days a week. Reserve
              your preferred slot now—no online payment required.
            </p>
          </div>
          <p className="text-xs font-medium text-[#115E46]">
            Open 24 Hours · 7 Days a Week · Pay Upon Completion or Invoice
          </p>
        </div>

        {confirmation ? (
          <div className="bg-white border border-[#115E46] rounded-xl p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 border-b border-[#E4E2DA]">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#115E46]">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>Booking Confirmed · 24/7 Dispatch Scheduled</span>
                </div>
                <h3 className="mt-2 font-display text-2xl lg:text-3xl font-medium text-[#14211D]">
                  Scheduled for {formatReadableDate(confirmation.date)}
                </h3>
                <p className="mt-1.5 text-sm text-[#4E5D57]">
                  Confirmation sent to <strong className="text-[#14211D]">{confirmation.customerEmail}</strong> ·
                  Arrival window: <strong className="text-[#14211D]">{confirmation.timeWindow}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => downloadIcsFile(confirmation)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#14211D] bg-[#F2F1EC] hover:bg-[#E4E2DA] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Add to Calendar (.ics)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#14211D] bg-[#F2F1EC] hover:bg-[#E4E2DA] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print Summary</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmation(null);
                    setBookingError(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#115E46] hover:bg-[#0D4A37] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Book Another Clean
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div>
                <p className="text-xs font-semibold text-[#4E5D57]">Reservation Reference</p>
                <p className="mt-1 font-mono text-lg font-medium text-[#14211D] tabular-nums">
                  {confirmation.bookingId}
                </p>
                <p className="mt-3 text-xs text-[#4E5D57]">Service Address</p>
                <p className="mt-0.5 text-sm font-medium text-[#14211D]">
                  {confirmation.serviceAddress}
                </p>
                {confirmation.entryNotes && (
                  <p className="mt-1 text-xs text-[#4E5D57]">
                    Access: {confirmation.entryNotes}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#4E5D57]">Service Scope</p>
                <p className="mt-1 text-sm font-semibold text-[#14211D]">
                  {confirmation.packageName}
                </p>
                <p className="mt-0.5 text-xs text-[#4E5D57]">
                  {confirmation.homeSizeLabel} · {confirmation.frequencyLabel}
                </p>
                {confirmation.addonNames.length > 0 && (
                  <p className="mt-2 text-xs text-[#4E5D57]">
                    Add-ons: {confirmation.addonNames.join(', ')}
                  </p>
                )}
                {confirmation.additionalHours > 0 && (
                  <p className="mt-1 text-xs text-[#4E5D57] font-mono tabular-nums">
                    Additional Services: {confirmation.additionalHours} hr @ {formatJmd(SPECIAL_HOURLY_RATE)}/hr ({formatJmd(confirmation.breakdown.additionalHourlyTotal, true)})
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[#4E5D57]">Estimated Service Quote</p>
                <p className="mt-1 font-mono text-lg font-medium text-[#115E46] tabular-nums">
                  {formatJmd(confirmation.breakdown.total, true)} JMD
                </p>
                <p className="mt-1 text-xs text-[#4E5D57]">
                  No online charge captured. Settle upon completion or by invoice.
                </p>
                <p className="mt-2 text-xs text-[#4E5D57]">
                  Questions? Call / WhatsApp{' '}
                  <a
                    href={CONTACT_INFO.phoneHref}
                    className="font-semibold text-[#115E46] hover:underline font-mono tabular-nums"
                  >
                    {CONTACT_INFO.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleBookingSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Open 24/7 Calendar + Arrival Windows + Property Details */}
            <div className="lg:col-span-7 bg-white border border-[#E4E2DA] rounded-xl p-6 lg:p-8 space-y-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon className="w-4 h-4 text-[#115E46]" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-[#14211D]">
                      01. Select Any Date &amp; 24-Hour Arrival Window
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Previous month"
                      className="w-9 h-9 rounded-lg border border-[#E4E2DA] flex items-center justify-center text-[#14211D] hover:bg-[#F2F1EC] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-[136px] text-center text-sm font-semibold text-[#14211D]">
                      {currentMonthDate.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Next month"
                      className="w-9 h-9 rounded-lg border border-[#E4E2DA] flex items-center justify-center text-[#14211D] hover:bg-[#F2F1EC] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {calendarError ? (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
                    {calendarError}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                      {WEEKDAYS.map((day) => (
                        <div
                          key={day}
                          className="text-xs font-medium text-[#4E5D57] py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: firstWeekdayOffset }).map((_, i) => (
                        <div key={`pad-${i}`} className="h-11" aria-hidden="true" />
                      ))}

                      {calendarLoading
                        ? Array.from({ length: 30 }).map((_, idx) => (
                            <div
                              key={`skel-${idx}`}
                              className="h-11 rounded-lg bg-[#F2F1EC] animate-pulse"
                            />
                          ))
                        : monthDays.map((day) => {
                            const dayNumber = Number(day.date.split('-')[2]);
                            const isSelected = selectedDate === day.date;
                            const isPast = day.status === 'past';

                            return (
                              <button
                                key={day.date}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  setSelectedDate(day.date);
                                  if (!selectedSlotId && day.slots.length > 0) {
                                    setSelectedSlotId(day.slots[0].id);
                                  }
                                }}
                                aria-label={`${formatReadableDate(day.date)}, ${isPast ? 'past' : 'open 24 hours'}`}
                                className={`h-11 rounded-lg border text-sm font-mono tabular-nums flex flex-col items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-[#115E46] border-[#115E46] text-white font-semibold'
                                    : isPast
                                      ? 'bg-[#FAF9F6] border-transparent text-[#A8B0AC] cursor-not-allowed'
                                      : 'bg-white border-[#E4E2DA] text-[#14211D] hover:border-[#115E46] cursor-pointer'
                                }`}
                              >
                                <span>{dayNumber}</span>
                                {!isPast && !isSelected && (
                                  <span className="text-[9px] leading-none font-sans text-[#115E46]">
                                    Open
                                  </span>
                                )}
                              </button>
                            );
                          })}
                    </div>

                    <p className="mt-4 text-xs text-[#4E5D57]">
                      Every date from today onward is open 24 hours a day, including weekends and
                      overnight shifts.
                    </p>
                  </>
                )}

                {/* 24-Hour Arrival Windows */}
                <div className="mt-6 pt-6 border-t border-[#E4E2DA]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#14211D]">
                      <Clock className="w-4 h-4 text-[#115E46]" aria-hidden="true" />
                      <span>
                        24-Hour Arrival Windows for {formatReadableDate(selectedDate)}
                      </span>
                    </div>
                    <span className="text-xs text-[#4E5D57] font-mono tabular-nums">
                      Est. {breakdown.estimatedHours} hrs on-site
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(selectedDayObj?.slots ?? []).map((slot) => {
                      const active = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-3.5 rounded-lg border text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                            active
                              ? 'bg-[#F0F7F4] border-[#115E46] text-[#14211D]'
                              : 'bg-white border-[#E4E2DA] hover:border-[#115E46] text-[#14211D]'
                          }`}
                        >
                          <div>
                            <p className="font-mono text-sm font-medium tabular-nums">
                              {slot.window}
                            </p>
                            <p className="text-xs text-[#4E5D57] mt-0.5">{slot.label}</p>
                          </div>
                          <span className="text-xs font-medium text-[#115E46] shrink-0">
                            Open
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Property & Contact Info */}
              <div className="pt-8 border-t border-[#E4E2DA]">
                <h3 className="text-base font-semibold text-[#14211D] mb-4">
                  02. Property &amp; Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cust-name"
                      className="block text-xs font-semibold text-[#4E5D57] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="cust-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jordan Avery"
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D] focus:outline-none focus:border-[#115E46]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cust-email"
                      className="block text-xs font-semibold text-[#4E5D57] mb-1.5"
                    >
                      Email for Confirmation
                    </label>
                    <input
                      id="cust-email"
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D] focus:outline-none focus:border-[#115E46]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cust-phone"
                      className="block text-xs font-semibold text-[#4E5D57] mb-1.5"
                    >
                      Mobile Number (WhatsApp / SMS Updates)
                    </label>
                    <input
                      id="cust-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(876) 555-0194"
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D] focus:outline-none focus:border-[#115E46]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="entry-notes"
                      className="block text-xs font-semibold text-[#4E5D57] mb-1.5"
                    >
                      Property Access Method
                    </label>
                    <select
                      id="entry-notes"
                      value={entryNotes}
                      onChange={(e) => setEntryNotes(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D] focus:outline-none focus:border-[#115E46]"
                    >
                      <option value="Smart lock / Door code provided">
                        Smart lock / Door code provided
                      </option>
                      <option value="I will be home to greet the crew">
                        I will be home to greet the crew
                      </option>
                      <option value="Airbnb / Vacation lockbox code">
                        Airbnb / Vacation lockbox code
                      </option>
                      <option value="Office reception / Building security key">
                        Office reception / Building security key
                      </option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="svc-address"
                        className="block text-xs font-semibold text-[#4E5D57] mb-1.5"
                      >
                        Street Address &amp; Unit
                      </label>
                      <input
                        id="svc-address"
                        type="text"
                        required
                        value={serviceAddress}
                        onChange={(e) => setServiceAddress(e.target.value)}
                        placeholder="14 Gloucester Ave, Villa 2"
                        className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D] focus:outline-none focus:border-[#115E46]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="svc-zip"
                        className="block text-xs font-semibold text-[#4E5D57] mb-1.5"
                      >
                        Town / Parish
                      </label>
                      <input
                        id="svc-zip"
                        type="text"
                        value={cityZip}
                        onChange={(e) => setCityZip(e.target.value)}
                        placeholder="Montego Bay, St. James"
                        className="w-full h-11 px-3.5 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D] focus:outline-none focus:border-[#115E46]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Estimate & Direct Reservation (No Online Payment) */}
            <div className="lg:col-span-5 bg-white border border-[#E4E2DA] rounded-xl p-6 lg:p-8 lg:sticky lg:top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-base font-semibold text-[#14211D]">
                    Booking Summary
                  </h3>
                  <select
                    aria-label="Change selected package"
                    value={selectedPackageId}
                    onChange={(e) => onSelectPackage(e.target.value)}
                    className="text-xs font-semibold text-[#115E46] bg-[#F0F7F4] border border-[#115E46]/25 rounded-md px-2.5 py-1.5 cursor-pointer"
                  >
                    {CLEANING_PACKAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#4E5D57]">
                      {activePackage.name} ({activeSize.label})
                    </dt>
                    <dd className="font-mono text-[#14211D] tabular-nums">
                      {formatJmd(breakdown.sizeAdjusted, true)}
                    </dd>
                  </div>

                  {breakdown.frequencyDiscount > 0 && (
                    <div className="flex justify-between gap-4 text-[#115E46]">
                      <dt>{activeFrequency.label}</dt>
                      <dd className="font-mono tabular-nums">
                        -{formatJmd(breakdown.frequencyDiscount, true)}
                      </dd>
                    </div>
                  )}

                  {activeAddons.map((addon) => (
                    <div key={addon.id} className="flex justify-between gap-4">
                      <dt className="text-[#4E5D57]">+ {addon.name}</dt>
                      <dd className="font-mono text-[#14211D] tabular-nums">
                        {formatJmd(addon.price, true)}
                      </dd>
                    </div>
                  ))}

                  {additionalHours > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#4E5D57]">
                        Additional Services ({additionalHours} hr @ {formatJmd(SPECIAL_HOURLY_RATE)}/hr)
                      </dt>
                      <dd className="font-mono text-[#14211D] tabular-nums">
                        {formatJmd(breakdown.additionalHourlyTotal, true)}
                      </dd>
                    </div>
                  )}

                  <div className="flex justify-between gap-4 pt-2 border-t border-[#E4E2DA]">
                    <dt className="text-[#4E5D57]">Scheduled Date</dt>
                    <dd className="font-medium text-[#14211D]">
                      {formatReadableDate(selectedDate)}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="text-[#4E5D57]">Arrival Window</dt>
                    <dd className="font-mono text-xs text-[#14211D] tabular-nums">
                      {selectedDayObj?.slots.find((s) => s.id === selectedSlotId)?.window ||
                        'Select time'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 pt-4 border-t border-[#E4E2DA] space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#4E5D57]">
                    <span>Service Tax (8.25%)</span>
                    <span className="font-mono tabular-nums">
                      {formatJmd(breakdown.taxAmount, true)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-base font-semibold text-[#14211D]">
                      Estimated Total (JMD)
                    </span>
                    <span className="font-mono text-2xl font-medium text-[#14211D] tabular-nums">
                      {selectedHomeSize === 'large-villa' ? 'From ' : ''}
                      {formatJmd(breakdown.total, true)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-[#E4E2DA] space-y-4">
                {bookingError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800"
                  >
                    {bookingError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || calendarLoading}
                  className="w-full h-12 px-5 text-sm font-semibold text-white bg-[#115E46] hover:bg-[#0D4A37] disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {isSubmitting
                      ? 'Confirming Reservation...'
                      : 'Confirm 24-Hour Booking'}
                  </span>
                </button>

                <p className="text-[11px] text-[#4E5D57] text-center leading-relaxed">
                  {COMPANIES_OFFICE_DISCLAIMER} Need assistance? Call/WhatsApp{' '}
                  <a
                    href={CONTACT_INFO.phoneHref}
                    className="font-semibold text-[#115E46] hover:underline font-mono tabular-nums"
                  >
                    {CONTACT_INFO.phoneDisplay}
                  </a>{' '}
                  or email{' '}
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="font-semibold text-[#115E46] hover:underline break-all"
                  >
                    {CONTACT_INFO.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
