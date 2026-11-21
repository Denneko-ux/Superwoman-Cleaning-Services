import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { CLEANING_PACKAGES, INITIAL_REVIEWS } from '../data/catalog.ts';
import type { CustomerReview } from '../types/cleaning.ts';

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  onTimeRate: string;
  recleanClaimRate: string;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [summary, setSummary] = useState<ReviewSummary>({
    averageRating: 4.92,
    totalReviews: 418,
    onTimeRate: '98.4%',
    recleanClaimRate: '< 0.8%',
  });
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [showWriteForm, setShowWriteForm] = useState(false);

  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [packageId, setPackageId] = useState('detailed-deep-clean');
  const [rating, setRating] = useState(5);
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadReviews = async (filter: string) => {
    try {
      const res = await fetch(`/api/reviews?packageId=${encodeURIComponent(filter)}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        reviews: CustomerReview[];
        summary: ReviewSummary;
      };
      setReviews(data.reviews);
      setSummary(data.summary);
    } catch {
      // Keep initial fallback reviews if server is temporarily restarting
    }
  };

  useEffect(() => {
    loadReviews(packageFilter);
  }, [packageFilter]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          authorLocation,
          packageId,
          rating,
          headline,
          body,
        }),
      });
      const data = (await res.json()) as { review?: CustomerReview; error?: string };
      if (!res.ok || !data.review) {
        throw new Error(data.error || 'Could not submit review.');
      }

      setAuthorName('');
      setAuthorLocation('');
      setHeadline('');
      setBody('');
      setRating(5);
      setShowWriteForm(false);
      await loadReviews(packageFilter);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to post review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 lg:py-20 border-b border-[#E4E2DA]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E4E2DA]">
          <div>
            <h2
              className="font-display text-3xl lg:text-4xl font-medium tracking-tight text-[#14211D]"
              style={{ textWrap: 'balance' }}
            >
              Verified Client Reviews
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4E5D57]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#14211D]">
                <Star className="w-4 h-4 fill-[#B45309] text-[#B45309]" aria-hidden="true" />
                <span className="font-mono tabular-nums">{summary.averageRating} / 5.0</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{summary.totalReviews} Verified Visits</span>
              <span aria-hidden="true">·</span>
              <span>{summary.onTimeRate} On-Time Arrival</span>
              <span aria-hidden="true">·</span>
              <span>{summary.recleanClaimRate} Re-Clean Claim Rate</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Filter reviews by package"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#F2F1EC] border border-[#E4E2DA] rounded-lg"
            >
              <button
                type="button"
                onClick={() => setPackageFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  packageFilter === 'all'
                    ? 'bg-white text-[#14211D] shadow-xs'
                    : 'text-[#4E5D57] hover:text-[#14211D]'
                }`}
              >
                All Services
              </button>
              {CLEANING_PACKAGES.map((pkg) => {
                const shortLabel =
                  pkg.id === 'residential-cleaning'
                    ? 'Residential'
                    : pkg.id === 'detailed-deep-clean'
                      ? 'Detailed Deep'
                      : pkg.id === 'vacation-rental-turnaround'
                        ? 'Vacation Rentals'
                        : 'Commercial';
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setPackageFilter(pkg.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      packageFilter === pkg.id
                        ? 'bg-white text-[#14211D] shadow-xs'
                        : 'text-[#4E5D57] hover:text-[#14211D]'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowWriteForm((prev) => !prev)}
              className="px-4 py-2 text-xs font-semibold text-[#115E46] bg-[#F0F7F4] border border-[#115E46]/25 hover:bg-[#E2EFE9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {showWriteForm ? 'Close Review Form' : 'Write a Review'}
            </button>
          </div>
        </div>

        {showWriteForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mt-8 p-6 bg-white border border-[#E4E2DA] rounded-xl space-y-4"
          >
            <h3 className="text-base font-semibold text-[#14211D]">
              Share Your Superwoman Cleaning Experience
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="rev-name"
                  className="block text-xs font-semibold text-[#4E5D57] mb-1"
                >
                  Your Name
                </label>
                <input
                  id="rev-name"
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Elena Morales"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D]"
                />
              </div>

              <div>
                <label
                  htmlFor="rev-loc"
                  className="block text-xs font-semibold text-[#4E5D57] mb-1"
                >
                  Neighborhood &amp; Home Type
                </label>
                <input
                  id="rev-loc"
                  type="text"
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  placeholder="Ocho Rios · 2-Bed Villa"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D]"
                />
              </div>

              <div>
                <label
                  htmlFor="rev-pkg"
                  className="block text-xs font-semibold text-[#4E5D57] mb-1"
                >
                  Package Booked
                </label>
                <select
                  id="rev-pkg"
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D]"
                >
                  {CLEANING_PACKAGES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="rev-rating"
                  className="block text-xs font-semibold text-[#4E5D57] mb-1"
                >
                  Rating
                </label>
                <select
                  id="rev-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D]"
                >
                  <option value={5}>5 / 5 Stars</option>
                  <option value={4}>4 / 5 Stars</option>
                  <option value={3}>3 / 5 Stars</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="rev-headline"
                className="block text-xs font-semibold text-[#4E5D57] mb-1"
              >
                Summary Headline
              </label>
              <input
                id="rev-headline"
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Spotless hardwood floors and zero chemical odor"
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D]"
              />
            </div>

            <div>
              <label
                htmlFor="rev-body"
                className="block text-xs font-semibold text-[#4E5D57] mb-1"
              >
                Detailed Review
              </label>
              <textarea
                id="rev-body"
                required
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Tell future neighbors what stood out during your visit..."
                className="w-full p-3 text-sm rounded-lg border border-[#D6D3C9] bg-white text-[#14211D]"
              />
            </div>

            {formError && (
              <p className="text-xs text-red-700" role="alert">
                {formError}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#115E46] hover:bg-[#0D4A37] rounded-lg cursor-pointer"
              >
                {submitting ? 'Publishing...' : 'Publish Review'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-white border border-[#E4E2DA] rounded-xl p-6 lg:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${rev.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'fill-[#B45309] text-[#B45309]'
                            : 'text-[#D6D3C9]'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#4E5D57]">
                    {rev.packageName} · {rev.dateLabel}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-medium text-[#14211D] leading-snug">
                  &ldquo;{rev.headline}&rdquo;
                </h3>

                <p className="mt-3 text-sm text-[#4E5D57] leading-relaxed">{rev.body}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4E2DA] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-semibold text-[#14211D]">{rev.authorName}</span>
                  <span className="text-[#4E5D57]">
                    {' '}
                    · {rev.authorLocation}
                  </span>
                </div>
                <span className="font-mono text-[#115E46]">{rev.outcomeMetric}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
