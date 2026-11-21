export type HomeSizeId = '1bed' | '2bed' | '3bed' | '4bed' | '5bed' | 'large-villa';
export type FrequencyId = 'one-time' | 'bi-weekly' | 'weekly';
export type PaymentMethodType = 'card' | 'wallet' | 'ach';

export interface HomeSizeOption {
  id: HomeSizeId;
  label: string;
  spec: string;
  hoursOffset: number;
}

export interface FrequencyOption {
  id: FrequencyId;
  label: string;
  discountRate: number;
  summary: string;
}

export interface CleaningPackage {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  basePrice: number;
  baseHours: number;
  teamSize: number;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  checklist: string[];
  idealFor: string;
}

export interface CleaningAddon {
  id: string;
  name: string;
  detail: string;
  price: number;
  minutes: number;
}

export interface TimeSlotAvailability {
  id: string;
  label: string;
  window: string;
  spotsRemaining: number;
  available: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  status: 'available' | 'limited' | 'full' | 'past';
  slots: TimeSlotAvailability[];
}

export interface CustomerReview {
  id: string;
  authorName: string;
  authorLocation: string;
  packageId: string;
  packageName: string;
  rating: number;
  dateLabel: string;
  headline: string;
  body: string;
  outcomeMetric: string;
  verifiedBooking: boolean;
}

export interface PriceBreakdown {
  packageBase: number;
  sizeAdjusted: number;
  frequencyDiscount: number;
  addonsTotal: number;
  additionalHourlyTotal: number;
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  estimatedHours: number;
}

export interface BookingConfirmation {
  bookingId: string;
  status: 'confirmed';
  packageName: string;
  homeSizeLabel: string;
  frequencyLabel: string;
  addonNames: string[];
  additionalHours: number;
  date: string;
  timeWindow: string;
  customerName: string;
  customerEmail: string;
  serviceAddress: string;
  entryNotes: string;
  bookedAt: string;
  breakdown: PriceBreakdown;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPackageId?: string;
}
