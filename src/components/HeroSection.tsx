import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/catalog.ts';
import { ResilientImage } from './ResilientImage.tsx';

interface HeroSectionProps {
  onScheduleClick: () => void;
  onOpenChat: () => void;
}

export function HeroSection({ onScheduleClick, onOpenChat }: HeroSectionProps) {
  return (
    <section id="top" className="border-b border-[#E4E2DA]">
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-10 lg:pt-14 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#115E46] mb-4">
                Trelawny · Montego Bay · Ocho Rios — Residence, Airbnb &amp; Office Services
              </p>

              <h1
                className="font-display font-medium tracking-tight text-[#14211D] leading-[1.08] max-w-[16ch]"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                  textWrap: 'balance',
                }}
              >
                Methodical cleaning for homes, offices, and rentals.
              </h1>

              <p className="mt-6 text-base lg:text-lg text-[#4E5D57] leading-[1.65] max-w-[52ch]">
                Book vetted cleaning specialists 24/7 for residential homes, commercial
                spaces, short-term rental turnarounds, and detailed care for kitchens,
                bathrooms, living areas, and windows—no online prepayment required.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={onScheduleClick}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#115E46] rounded-lg hover:bg-[#0D4A37] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115E46]"
                >
                  <span>Schedule Your Clean</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <a
                  href="#packages"
                  className="text-sm font-semibold text-[#14211D] hover:text-[#115E46] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
                >
                  Compare Packages
                </a>

                <button
                  type="button"
                  onClick={onOpenChat}
                  className="text-sm font-medium text-[#4E5D57] hover:text-[#14211D] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer"
                >
                  Ask Live Concierge
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-[320px] sm:h-[400px] lg:h-full lg:min-h-[460px] rounded-xl overflow-hidden border border-[#E4E2DA] bg-[#F2F1EC]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Spotless living room with brown sectional sofa, throw pillows, glass coffee table, and polished tile floor cleaned by Superwoman Cleaning Services"
                fallbackTitle="Superwoman Cleaning Services"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-column proof strip below hero split */}
        <div
          id="guarantee"
          className="mt-10 pt-8 border-t border-[#E4E2DA] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          <div>
            <p className="font-mono text-2xl font-medium text-[#14211D] tabular-nums">
              4.92 / 5.0
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14211D]">
              Verified Client Rating
            </p>
            <p className="mt-0.5 text-xs text-[#4E5D57]">
              Across 418+ completed residential &amp; studio visits
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl font-medium text-[#14211D] tabular-nums">
              98.4%
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14211D]">
              On-Time Crew Arrival
            </p>
            <p className="mt-0.5 text-xs text-[#4E5D57]">
              Live SMS dispatch notice 20 minutes before entry
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl font-medium text-[#14211D] tabular-nums">
              24 Hours
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14211D]">
              Re-Clean Guarantee
            </p>
            <p className="mt-0.5 text-xs text-[#4E5D57]">
              Missed a detail? We return the next day at zero charge
            </p>
          </div>

          <div>
            <p className="font-mono text-2xl font-medium text-[#14211D] tabular-nums">
              J$780 / hr
            </p>
            <p className="mt-1 text-sm font-semibold text-[#14211D]">
              Special Additional Rate
            </p>
            <p className="mt-0.5 text-xs text-[#4E5D57]">
              Washing, changing linen, folding, and custom extra tasks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
