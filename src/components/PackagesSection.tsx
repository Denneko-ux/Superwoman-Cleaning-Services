import { Check, Minus, Plus } from 'lucide-react';
import {
  CLEANING_ADDONS,
  CLEANING_PACKAGES,
  COMPANIES_OFFICE_DISCLAIMER,
  FREQUENCY_OPTIONS,
  HOME_SIZE_OPTIONS,
  PACKAGE_PRICE_MATRIX,
  SPECIAL_HOURLY_DESCRIPTION,
  SPECIAL_HOURLY_RATE,
  formatJmd,
  getPackageSizePrice,
} from '../data/catalog.ts';
import type { FrequencyId, HomeSizeId } from '../types/cleaning.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface PackagesSectionProps {
  selectedPackageId: string;
  selectedHomeSize: HomeSizeId;
  selectedFrequency: FrequencyId;
  selectedAddonIds: string[];
  additionalHours: number;
  onSelectPackage: (packageId: string) => void;
  onSelectHomeSize: (sizeId: HomeSizeId) => void;
  onSelectFrequency: (freqId: FrequencyId) => void;
  onToggleAddon: (addonId: string) => void;
  onChangeAdditionalHours: (hours: number) => void;
  onProceedToBooking: (packageId: string) => void;
}

export function PackagesSection({
  selectedPackageId,
  selectedHomeSize,
  selectedFrequency,
  selectedAddonIds,
  additionalHours,
  onSelectPackage,
  onSelectHomeSize,
  onSelectFrequency,
  onToggleAddon,
  onChangeAdditionalHours,
  onProceedToBooking,
}: PackagesSectionProps) {
  const sizeObj =
    HOME_SIZE_OPTIONS.find((s) => s.id === selectedHomeSize) ?? HOME_SIZE_OPTIONS[1];
  const freqObj =
    FREQUENCY_OPTIONS.find((f) => f.id === selectedFrequency) ?? FREQUENCY_OPTIONS[0];

  const computePackagePrice = (packageId: string) => {
    const adjusted = getPackageSizePrice(packageId, selectedHomeSize);
    const discounted = adjusted - Math.round(adjusted * freqObj.discountRate);
    return { adjusted, discounted };
  };

  return (
    <section id="packages" className="py-16 lg:py-20 border-b border-[#E4E2DA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h2
              className="font-display text-3xl lg:text-4xl font-medium tracking-tight text-[#14211D]"
              style={{ textWrap: 'balance' }}
            >
              Cleaning Packages &amp; Official Rates
            </h2>
            <p className="mt-3 text-base text-[#4E5D57] max-w-[60ch]">
              Select your bedroom and bathroom count plus cleaning cadence to calculate exact
              JMD rates before choosing an arrival window.
            </p>
          </div>

          {/* Frequency Filter */}
          <div
            role="group"
            aria-label="Cleaning cadence"
            className="inline-flex items-center p-1 bg-[#F2F1EC] border border-[#E4E2DA] rounded-lg self-start lg:self-auto shrink-0"
          >
            {FREQUENCY_OPTIONS.map((freq) => {
              const active = selectedFrequency === freq.id;
              return (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => onSelectFrequency(freq.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#115E46] text-white'
                      : 'text-[#4E5D57] hover:text-[#14211D]'
                  }`}
                >
                  {freq.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6-Tier Official Property Size Selector */}
        <div className="mb-8">
          <div
            role="group"
            aria-label="Property bedrooms and bathrooms"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
          >
            {HOME_SIZE_OPTIONS.map((size) => {
              const active = selectedHomeSize === size.id;
              const deepRate = PACKAGE_PRICE_MATRIX['detailed-deep-clean'][size.id];
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => onSelectHomeSize(size.id)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#14211D] border-[#14211D] text-white'
                      : 'bg-white border-[#E4E2DA] text-[#14211D] hover:border-[#115E46]'
                  }`}
                >
                  <p className="text-xs font-semibold whitespace-nowrap truncate">
                    {size.label}
                  </p>
                  <p
                    className={`mt-1 font-mono text-xs tabular-nums ${
                      active ? 'text-[#C8D3CE]' : 'text-[#4E5D57]'
                    }`}
                  >
                    {size.id === 'large-villa'
                      ? `From ${formatJmd(deepRate)}`
                      : `Deep ${formatJmd(deepRate)}`}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-[#4E5D57]">
            {COMPANIES_OFFICE_DISCLAIMER}
          </p>
        </div>

        {/* Asymmetric Bento Grid of 4 Cleaning Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {CLEANING_PACKAGES.map((pkg, idx) => {
            const isSelected = selectedPackageId === pkg.id;
            const { adjusted, discounted } = computePackagePrice(pkg.id);
            const totalHours = (pkg.baseHours + sizeObj.hoursOffset).toFixed(1);

            const colSpanClass =
              idx === 0
                ? 'lg:col-span-5'
                : idx === 1
                  ? 'lg:col-span-7'
                  : 'lg:col-span-6';

            return (
              <article
                key={pkg.id}
                className={`${colSpanClass} rounded-xl border transition-colors flex flex-col justify-between bg-white ${
                  isSelected
                    ? 'border-[#115E46] ring-1 ring-[#115E46]'
                    : 'border-[#E4E2DA] hover:border-[#C5C2B6]'
                }`}
              >
                <div className="p-6 lg:p-7">
                  {pkg.image && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-[#E4E2DA] bg-[#F2F1EC] h-56">
                      <ResilientImage
                        src={pkg.image}
                        alt={pkg.imageAlt || pkg.name}
                        fallbackTitle={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl lg:text-2xl font-medium text-[#14211D]">
                        {pkg.number} {pkg.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#4E5D57]">
                        {pkg.teamSize} Specialists
                        <span aria-hidden="true"> · </span>
                        <span className="font-mono tabular-nums">Est. {totalHours} hrs</span>
                        <span aria-hidden="true"> · </span>
                        {pkg.idealFor}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-baseline justify-end gap-2">
                        {freqObj.discountRate > 0 && (
                          <span className="font-mono text-sm text-[#78847E] line-through tabular-nums">
                            {formatJmd(adjusted)}
                          </span>
                        )}
                        <span className="font-mono text-2xl font-medium text-[#14211D] tabular-nums">
                          {selectedHomeSize === 'large-villa' ? 'From ' : ''}
                          {formatJmd(discounted)}
                        </span>
                      </div>
                      <p className="text-xs text-[#4E5D57]">{sizeObj.spec}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#4E5D57] leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="mt-5 pt-5 border-t border-[#E4E2DA] space-y-2.5">
                    {pkg.checklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#14211D]"
                      >
                        <Check
                          className="w-4 h-4 text-[#115E46] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6 lg:px-7 lg:pb-7 pt-2 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-[#4E5D57]">
                    {isSelected ? 'Selected for your booking' : pkg.subtitle}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectPackage(pkg.id);
                      onProceedToBooking(pkg.id);
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115E46] ${
                      isSelected
                        ? 'bg-[#115E46] text-white hover:bg-[#0D4A37]'
                        : 'bg-[#F2F1EC] text-[#14211D] hover:bg-[#E4E2DA]'
                    }`}
                  >
                    {isSelected ? 'Selected · Schedule Time' : 'Select Package'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Optional Add-Ons Strip */}
        <div className="mt-10 pt-8 border-t border-[#E4E2DA]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-base font-semibold text-[#14211D]">
                Optional Detail Add-Ons
              </h3>
              <p className="text-xs text-[#4E5D57]">
                Add any extra interior task directly to your scheduled booking.
              </p>
            </div>
            <span className="text-xs font-mono text-[#4E5D57] tabular-nums">
              {selectedAddonIds.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLEANING_ADDONS.map((addon) => {
              const checked = selectedAddonIds.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => onToggleAddon(addon.id)}
                  aria-pressed={checked}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    checked
                      ? 'bg-[#F0F7F4] border-[#115E46]'
                      : 'bg-white border-[#E4E2DA] hover:border-[#C5C2B6]'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#14211D]">{addon.name}</p>
                    <p className="text-xs text-[#4E5D57] mt-1">{addon.detail}</p>
                    <p className="mt-2 font-mono text-xs font-medium text-[#115E46] tabular-nums">
                      +{formatJmd(addon.price)} · +{addon.minutes} min
                    </p>
                  </div>
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                      checked
                        ? 'bg-[#115E46] border-[#115E46] text-white'
                        : 'bg-[#FAF9F6] border-[#D6D3C9] text-[#4E5D57]'
                    }`}
                  >
                    {checked ? (
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Special Rate: J$780/hour for Additional Services */}
          <div className="mt-5 p-4 sm:p-5 rounded-xl border border-[#115E46]/30 bg-[#F0F7F4]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#14211D]">
                Special Rate: <span className="font-mono tabular-nums text-[#115E46]">{formatJmd(SPECIAL_HOURLY_RATE)}/hour</span> for Additional Services
              </p>
              <p className="text-xs text-[#4E5D57] mt-0.5">
                {SPECIAL_HOURLY_DESCRIPTION}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-[#14211D] tabular-nums">
                  {additionalHours > 0
                    ? `+${formatJmd(additionalHours * SPECIAL_HOURLY_RATE)}`
                    : formatJmd(0)}
                </p>
                <p className="text-[11px] text-[#4E5D57] font-mono tabular-nums">
                  {additionalHours} {additionalHours === 1 ? 'hour' : 'hours'} added
                </p>
              </div>

              <div
                className="inline-flex items-center gap-1 bg-white border border-[#D6D3C9] rounded-lg p-1"
                role="group"
                aria-label="Additional service hours at J$780 per hour"
              >
                <button
                  type="button"
                  onClick={() => onChangeAdditionalHours(Math.max(0, additionalHours - 1))}
                  disabled={additionalHours <= 0}
                  aria-label="Decrease additional service hours"
                  className="w-8 h-8 rounded-md flex items-center justify-center text-[#14211D] hover:bg-[#F2F1EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold text-[#14211D] tabular-nums">
                  {additionalHours}h
                </span>
                <button
                  type="button"
                  onClick={() => onChangeAdditionalHours(Math.min(12, additionalHours + 1))}
                  disabled={additionalHours >= 12}
                  aria-label="Increase additional service hours"
                  className="w-8 h-8 rounded-md flex items-center justify-center text-[#14211D] hover:bg-[#F2F1EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
