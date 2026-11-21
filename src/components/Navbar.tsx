interface NavbarProps {
  onBookClick: () => void;
}

export function Navbar({ onBookClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E4E2DA]">
      <div className="max-w-[1200px] mx-auto px-6 h-20 sm:h-24 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
        >
          <img
            src="/assets/aistudio/logo_transparent.png"
            alt="Superwoman Cleaning Services logo"
            className="h-16 sm:h-[76px] w-auto object-contain drop-shadow-[0_1px_2px_rgba(20,33,29,0.08)] shrink-0"
          />
          <span className="sr-only">Superwoman Cleaning Services</span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4E5D57]"
        >
          <a
            href="#packages"
            className="hover:text-[#14211D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
          >
            Packages
          </a>
          <a
            href="#booking"
            className="hover:text-[#14211D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
          >
            Schedule
          </a>
          <a
            href="#reviews"
            className="hover:text-[#14211D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
          >
            Reviews
          </a>
          <a
            href="#guarantee"
            className="hover:text-[#14211D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
          >
            Guarantee
          </a>
          <a
            href="#contact"
            className="hover:text-[#14211D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <a
            href="#contact"
            className="md:hidden text-sm font-medium text-[#4E5D57] hover:text-[#14211D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115E46]"
          >
            Contact
          </a>
          <button
            type="button"
            onClick={onBookClick}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#115E46] rounded-lg hover:bg-[#0D4A37] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115E46]"
          >
            Book a Clean
          </button>
        </div>
      </div>
    </header>
  );
}
