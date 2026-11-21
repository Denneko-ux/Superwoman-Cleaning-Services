import { Mail, Phone } from 'lucide-react';
import { CONTACT_INFO } from '../data/catalog.ts';

export function Footer() {
  return (
    <footer id="contact" className="bg-[#FAF9F6] py-12 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-6 space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src="/assets/aistudio/logo_transparent.png"
              alt="Superwoman Cleaning Services official logo"
              className="h-24 sm:h-28 w-auto object-contain shrink-0 self-start sm:self-auto"
            />
            <div>
              <span className="font-display text-lg font-semibold text-[#14211D]">
                Superwoman Cleaning Services
              </span>
              <p className="mt-1 text-xs text-[#4E5D57] max-w-[46ch]">
                Based in Duncans, serving Trelawny Parish, Ocho Rios &amp; Montego Bay 24 hours,
                7 days a week. Residence Services · Airbnb Services · Office Services. Special
                add-on rate: J$780/hr for washing, changing linen, folding, and more.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#115E46]">
              Direct Contact · 24/7 Dispatch
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#14211D] hover:text-[#115E46] transition-colors font-mono tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#115E46] shrink-0" aria-hidden="true" />
                <span>Call / WhatsApp: {CONTACT_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#14211D] hover:text-[#115E46] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#115E46] shrink-0" aria-hidden="true" />
                <span>{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E4E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#4E5D57]">
            <a href="#packages" className="hover:text-[#14211D] transition-colors">
              Packages
            </a>
            <a href="#gallery" className="hover:text-[#14211D] transition-colors">
              Our Work
            </a>
            <a href="#booking" className="hover:text-[#14211D] transition-colors">
              Booking Calendar
            </a>
            <a href="#reviews" className="hover:text-[#14211D] transition-colors">
              Client Reviews
            </a>
            <a href="#guarantee" className="hover:text-[#14211D] transition-colors">
              24h Re-Clean Guarantee
            </a>
          </div>

          <p className="text-xs text-[#78847E]">
            © {new Date().getFullYear()} Superwoman Cleaning Services · Registered with the Companies Office of Jamaica.
          </p>
        </div>
      </div>
    </footer>
  );
}
