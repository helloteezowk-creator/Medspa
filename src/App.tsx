import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustPillars } from './components/TrustPillars';
import { MachineShowcase } from './components/MachineShowcase';
import { PopularProcedures } from './components/PopularProcedures';
import { AboutClinic } from './components/AboutClinic';
import { TreatmentJourney } from './components/TreatmentJourney';
import { SpecialOfferBanner } from './components/SpecialOfferBanner';
import { TechnologySection } from './components/TechnologySection';
import { TreatmentCalculator } from './components/TreatmentCalculator';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ClinicTourModal } from './components/ClinicTourModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { LuxuryPageLoader } from './components/LuxuryPageLoader';
import { businessConfig, ServiceItem } from './data/businessConfig';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [clinicTourModalOpen, setClinicTourModalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingPreSelectedId, setBookingPreSelectedId] = useState<string | undefined>(undefined);
  const [bookingPreSelectedIds, setBookingPreSelectedIds] = useState<string[] | undefined>(undefined);

  const handleOpenBooking = (serviceId?: string) => {
    setBookingPreSelectedId(serviceId);
    setBookingPreSelectedIds(undefined);
    setBookingModalOpen(true);
  };

  const handleBookProtocol = (serviceIds: string[]) => {
    setBookingPreSelectedIds(serviceIds);
    setBookingPreSelectedId(undefined);
    setBookingModalOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
  };

  const handleSelectServiceById = (serviceId: string) => {
    const s = businessConfig.services.find((item) => item.id === serviceId);
    if (s) {
      setSelectedService(s);
    } else {
      handleOpenBooking(serviceId);
    }
  };

  const handleScrollToTreatments = () => {
    const el = document.getElementById('treatments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-stone-900 w-full max-w-full overflow-x-hidden">
      
      {/* Silk Luxury Preloader Animation */}
      <LuxuryPageLoader />

      {/* 1. Sticky Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTour={() => setClinicTourModalOpen(true)}
      />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenTour={() => setClinicTourModalOpen(true)}
          onExploreTreatments={handleScrollToTreatments}
        />

        {/* 3. Trust Indicators Bar */}
        <TrustPillars />

        {/* 3.5. Clinical Medical Machine Slider */}
        <MachineShowcase
          onBookMachine={(machineName) => {
            if (machineName.includes('InfraBaldan')) {
              handleOpenBooking('body-contouring');
            } else if (machineName.includes('TriLaser')) {
              handleOpenBooking('laser-hair-removal');
            } else if (machineName.includes('Cryo-RF')) {
              handleOpenBooking('skin-tightening');
            } else {
              handleOpenBooking();
            }
          }}
        />

        {/* 4. Popular Procedures / Treatments Grid */}
        <PopularProcedures
          onSelectService={handleSelectService}
          onBookService={(id) => handleOpenBooking(id)}
        />

        {/* 5. About Clinic Section */}
        <AboutClinic
          onOpenTour={() => setClinicTourModalOpen(true)}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 6. Treatment Journey */}
        <TreatmentJourney />

        {/* 7. Special Welcome Offer Banner */}
        <SpecialOfferBanner
          onClaimOffer={() => handleOpenBooking()}
        />

        {/* 8. FDA-Cleared Technology Platform Showcase */}
        <TechnologySection />

        {/* 9. Interactive Treatment & Financing Calculator */}
        <TreatmentCalculator
          onBookProtocol={handleBookProtocol}
        />

        {/* 10. Verified Patient Reviews */}
        <ReviewsSection />

        {/* 11. Frequently Asked Questions */}
        <FAQSection
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* 12. Footer with Admin Portal Access */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onSelectTreatment={handleSelectServiceById}
        onOpenAdmin={() => setAdminPortalOpen(true)}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preSelectedServiceId={bookingPreSelectedId}
        preSelectedServiceIds={bookingPreSelectedIds}
      />

      <ClinicTourModal
        isOpen={clinicTourModalOpen}
        onClose={() => setClinicTourModalOpen(false)}
        onBookAppointment={() => setBookingModalOpen(true)}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBook={(id) => {
          setSelectedService(null);
          handleOpenBooking(id);
        }}
      />

      {/* Supabase-Powered Admin Portal (Single Slot Protected) */}
      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
      />

    </div>
  );
}
