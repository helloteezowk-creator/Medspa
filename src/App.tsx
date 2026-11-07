import React, { useState, useEffect } from 'react';
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
import { ReviewModal } from './components/ReviewModal';
import { PatientPortalModal } from './components/PatientPortalModal';
import { businessConfig, ServiceItem } from './data/businessConfig';
import { subscribeAuth, loginWithGoogle, UserProfile } from './services/firebaseService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [clinicTourModalOpen, setClinicTourModalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [patientPortalOpen, setPatientPortalOpen] = useState(false);
  
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingPreSelectedId, setBookingPreSelectedId] = useState<string | undefined>(undefined);
  const [bookingPreSelectedIds, setBookingPreSelectedIds] = useState<string[] | undefined>(undefined);

  // Subscribe to persistent Firebase authentication
  useEffect(() => {
    const unsub = subscribeAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.warn('Sign in cancelled or interrupted', e);
    }
  };

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
      
      {/* 1. Sticky Navigation Header with Patient Auth State */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenTour={() => setClinicTourModalOpen(true)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onOpenPatientPortal={() => setPatientPortalOpen(true)}
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

        {/* 3.5. Clinical Medical Machine Slider (Faithfully matching user reference screenshot) */}
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

        {/* 5. About Clinic Section (3-Column Layout from reference) */}
        <AboutClinic
          onOpenTour={() => setClinicTourModalOpen(true)}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 6. Treatment Journey (4-Step Sequential Approach) */}
        <TreatmentJourney />

        {/* 7. Special Welcome Offer Banner (Macro Skin Glow) */}
        <SpecialOfferBanner
          onClaimOffer={() => handleOpenBooking()}
        />

        {/* 8. FDA-Cleared Technology Platform Showcase */}
        <TechnologySection />

        {/* 9. Interactive Treatment & Financing Calculator */}
        <TreatmentCalculator
          onBookProtocol={handleBookProtocol}
        />

        {/* 10. Verified Patient Reviews with Write a Review & Live Backend Sync */}
        <ReviewsSection
          onOpenReviewModal={() => setReviewModalOpen(true)}
        />

        {/* 11. Frequently Asked Questions */}
        <FAQSection
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* 12. Footer */}
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
        currentUser={currentUser}
        onLogin={handleLogin}
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

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onReviewSubmitted={() => setReviewModalOpen(false)}
      />

      <PatientPortalModal
        isOpen={patientPortalOpen}
        onClose={() => setPatientPortalOpen(false)}
        currentUser={currentUser}
        onBookNew={() => handleOpenBooking()}
      />

      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
      />

    </div>
  );
}
