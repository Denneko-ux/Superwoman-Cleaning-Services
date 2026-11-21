import { useState } from 'react';
import { BookingCheckoutSection } from './components/BookingCheckoutSection.tsx';
import { Footer } from './components/Footer.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { LiveChatWidget } from './components/LiveChatWidget.tsx';
import { MissionSection } from './components/MissionSection.tsx';
import { Navbar } from './components/Navbar.tsx';
import { PackagesSection } from './components/PackagesSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { WorkGallerySection } from './components/WorkGallerySection.tsx';
import type { FrequencyId, HomeSizeId } from './types/cleaning.ts';

export default function App() {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('detailed-deep-clean');
  const [selectedHomeSize, setSelectedHomeSize] = useState<HomeSizeId>('2bed');
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyId>('one-time');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [additionalHours, setAdditionalHours] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState(false);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#14211D]">
      <Navbar onBookClick={scrollToBooking} />

      <main className="flex-1">
        <HeroSection
          onScheduleClick={scrollToBooking}
          onOpenChat={() => setChatOpen(true)}
        />

        <MissionSection />

        <PackagesSection
          selectedPackageId={selectedPackageId}
          selectedHomeSize={selectedHomeSize}
          selectedFrequency={selectedFrequency}
          selectedAddonIds={selectedAddonIds}
          additionalHours={additionalHours}
          onSelectPackage={setSelectedPackageId}
          onSelectHomeSize={setSelectedHomeSize}
          onSelectFrequency={setSelectedFrequency}
          onToggleAddon={handleToggleAddon}
          onChangeAdditionalHours={setAdditionalHours}
          onProceedToBooking={(pkgId) => {
            setSelectedPackageId(pkgId);
            scrollToBooking();
          }}
        />

        <WorkGallerySection />

        <BookingCheckoutSection
          selectedPackageId={selectedPackageId}
          selectedHomeSize={selectedHomeSize}
          selectedFrequency={selectedFrequency}
          selectedAddonIds={selectedAddonIds}
          additionalHours={additionalHours}
          onSelectPackage={setSelectedPackageId}
        />

        <ReviewsSection />
      </main>

      <Footer />

      <LiveChatWidget
        isOpen={chatOpen}
        onToggle={setChatOpen}
        onApplyPackage={(pkgId) => {
          setSelectedPackageId(pkgId);
          scrollToBooking();
        }}
      />
    </div>
  );
}
