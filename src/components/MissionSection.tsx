export function MissionSection() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      className="py-14 lg:py-16 border-b border-[#E4E2DA] bg-[#F2F1EC]/55"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#115E46]">
              Our Mission · Based in Duncans, Trelawny Parish
            </p>
            <h2
              id="mission-heading"
              className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#14211D] leading-snug"
              style={{ textWrap: 'balance' }}
            >
              Transforming homes, offices, and short-term rentals into pristine sanctuaries.
            </h2>

            <p className="mt-5 text-base text-[#394842] leading-[1.75]">
              Superwoman Cleaning Services Trelawny is a premium cleaning business dedicated to
              transforming homes, offices, and short-term rentals into pristine sanctuaries.
              Based in Duncans, our professional team serves the Trelawny Parish, Ocho Rios,
              and Montego Bay areas, providing meticulous care that allows you to relax and
              enjoy your immaculate space.
            </p>
            <p className="mt-4 text-base text-[#394842] leading-[1.75]">
              Our mission is to restore peace to your weekends, enhance productivity in your
              workspace, and guarantee five-star reviews for your rental properties through our
              exceptional service. Trust our elite team to deliver a consistently spotless and
              refreshing environment every time.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#E4E2DA] rounded-xl p-6 divide-y divide-[#E4E2DA]">
            <div className="pb-4">
              <p className="font-mono text-xs font-medium text-[#115E46] tabular-nums">
                01 · Residences
              </p>
              <h3 className="mt-1 text-base font-semibold text-[#14211D]">
                Restore Peace to Your Weekends
              </h3>
              <p className="mt-1 text-xs text-[#4E5D57] leading-relaxed">
                Meticulous home care so you can relax and enjoy an immaculate living space.
              </p>
            </div>

            <div className="py-4">
              <p className="font-mono text-xs font-medium text-[#115E46] tabular-nums">
                02 · Workspaces
              </p>
              <h3 className="mt-1 text-base font-semibold text-[#14211D]">
                Enhance Productivity in Your Workspace
              </h3>
              <p className="mt-1 text-xs text-[#4E5D57] leading-relaxed">
                Consistently spotless, refreshing commercial and office environments on any 24-hour schedule.
              </p>
            </div>

            <div className="pt-4">
              <p className="font-mono text-xs font-medium text-[#115E46] tabular-nums">
                03 · Vacation Rentals
              </p>
              <h3 className="mt-1 text-base font-semibold text-[#14211D]">
                Guarantee Five-Star Rental Reviews
              </h3>
              <p className="mt-1 text-xs text-[#4E5D57] leading-relaxed">
                Hospitality-grade turnarounds across Duncans, Trelawny Parish, Ocho Rios, and Montego Bay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
