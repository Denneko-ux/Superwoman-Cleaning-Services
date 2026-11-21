import { useState } from 'react';
import {
  KITCHEN_BEFORE_AFTER,
  REAL_WORK_GALLERY,
  type WorkGalleryItem,
} from '../data/catalog.ts';
import { ResilientImage } from './ResilientImage.tsx';

type GalleryFilter = 'All' | WorkGalleryItem['category'];

const FILTER_OPTIONS: GalleryFilter[] = [
  'All',
  'Living & Bedrooms',
  'Kitchens',
  'Bathrooms & Showers',
  'Windows & Details',
];

export function WorkGallerySection() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('All');

  const visibleItems =
    activeFilter === 'All'
      ? REAL_WORK_GALLERY
      : REAL_WORK_GALLERY.filter((item) => item.category === activeFilter);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="py-16 lg:py-20 border-b border-[#E4E2DA] bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#115E46]">
              Completed Work · Trelawny, Ocho Rios &amp; Montego Bay
            </p>
            <h2
              id="gallery-heading"
              className="mt-2 font-display text-3xl lg:text-4xl font-medium tracking-tight text-[#14211D]"
              style={{ textWrap: 'balance' }}
            >
              Real Spaces Cleaned by Our Team
            </h2>
            <p className="mt-2.5 text-base text-[#4E5D57] max-w-[58ch]">
              Actual homes, kitchens, marble showers, guest bedrooms, and window frames
              detailed by Superwoman Cleaning Services.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter completed cleaning gallery"
            className="flex flex-wrap items-center gap-1.5 bg-[#F2F1EC] border border-[#E4E2DA] p-1 rounded-lg self-start lg:self-auto"
          >
            {FILTER_OPTIONS.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#115E46] text-white'
                      : 'text-[#4E5D57] hover:text-[#14211D]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Kitchen Before & After Spotlight */}
        {activeFilter === 'All' || activeFilter === 'Kitchens' ? (
          <div className="mb-8 p-5 lg:p-6 rounded-xl border border-[#E4E2DA] bg-[#FAF9F6]">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
              <h3 className="text-sm font-semibold text-[#14211D]">
                Kitchen Deep Clean Transformation
              </h3>
              <span className="text-xs text-[#4E5D57]">
                Degreased countertops, range, cabinets, window &amp; floor tile
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <figure className="space-y-2">
                <div className="h-64 rounded-lg overflow-hidden border border-[#E4E2DA] bg-[#F2F1EC]">
                  <ResilientImage
                    src={KITCHEN_BEFORE_AFTER.beforeSrc}
                    alt={KITCHEN_BEFORE_AFTER.beforeAlt}
                    fallbackTitle="Kitchen Before"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-xs font-medium text-[#4E5D57]">
                  Before — Dusty countertop corner &amp; cabinet grime
                </figcaption>
              </figure>
              <figure className="space-y-2">
                <div className="h-64 rounded-lg overflow-hidden border border-[#115E46]/40 bg-[#F2F1EC]">
                  <ResilientImage
                    src={KITCHEN_BEFORE_AFTER.afterSrc}
                    alt={KITCHEN_BEFORE_AFTER.afterAlt}
                    fallbackTitle="Kitchen After"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="text-xs font-semibold text-[#115E46]">
                  After — Sanitized surfaces, polished appliances &amp; spotless tile
                </figcaption>
              </figure>
            </div>
          </div>
        ) : null}

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleItems.map((item) => (
            <figure
              key={item.id}
              className="rounded-xl border border-[#E4E2DA] bg-[#FAF9F6] overflow-hidden flex flex-col"
            >
              <div className="h-64 bg-[#F2F1EC] overflow-hidden">
                <ResilientImage
                  src={item.src}
                  alt={item.alt}
                  fallbackTitle={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#14211D]">
                  {item.title}
                </span>
                <span className="text-xs text-[#4E5D57] shrink-0">
                  {item.category}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
