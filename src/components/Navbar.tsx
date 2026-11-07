import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Calendar, Clock, ChevronRight, Lock, User, LogIn } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import { UserProfile } from '../services/firebaseService';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenTour: () => void;
  currentUser: UserProfile | null;
  onLogin: () => void;
  onOpenPatientPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenTour,
  currentUser,
  onLogin,
  onOpenPatientPortal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopNavLinks = [
    { name: 'About', href: '#about' },
    { name: 'Treatments', href: '#treatments' },
    { name: 'Equipment', href: '#equipment' },
    { name: 'Calculator', href: '#calculator' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const allNavLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Clinic', href: '#about' },
    { name: 'Treatments & Pricing', href: '#treatments' },
    { name: 'Medical Equipment', href: '#equipment' },
    { name: 'Our Technology', href: '#technology' },
    { name: 'Methodical Approach', href: '#why-us' },
    { name: 'Cost Calculator', href: '#calculator' },
    { name: 'Patient Reviews', href: '#reviews' },
    { name: 'Location & Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full overflow-hidden ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#EDE8E0] py-3'
            : 'bg-[#FAF8F5] py-4 sm:py-5 border-b border-[#EDE8E0]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            
            {/* Zone 1: Brand Wordmark */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="group flex flex-col items-start shrink-0 text-left select-none"
            >
              <span className="font-display text-xl sm:text-2xl lg:text-[26px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-stone-900 uppercase transition-opacity group-hover:opacity-80 leading-none">
                {businessConfig.name}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-stone-500 font-sans uppercase pt-1 leading-none">
                {businessConfig.subName}
              </span>
            </a>

            {/* Zone 2: Curated Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs xl:text-[13px] font-medium tracking-wide text-stone-600">
              {desktopNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#C5A880]/60 py-1"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Zone 3: Direct Phone, Auth State & Consultation CTA */}
            <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
              
              {/* Phone display on wide screens */}
              <div className="hidden 2xl:flex flex-col items-end text-right shrink-0">
                <a
                  href={businessConfig.phoneRaw}
                  className="text-xs font-semibold text-stone-900 hover:text-[#B09167] transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{businessConfig.phone}</span>
                </a>
                <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                  <Clock className="w-2.5 h-2.5 text-stone-400" />
                  {businessConfig.hours}
                </span>
              </div>

              {/* Patient Auth Trigger */}
              {currentUser ? (
                <button
                  type="button"
                  onClick={onOpenPatientPortal}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-800 bg-white border border-[#EDE8E0] hover:border-[#C5A880] transition-colors shadow-2xs shrink-0 cursor-pointer"
                  title="Patient Portal & Appointments"
                >
                  <div className="w-4 h-4 rounded-full bg-[#C5A880] text-white flex items-center justify-center text-[9px]">
                    {currentUser.displayName ? currentUser.displayName[0] : 'P'}
                  </div>
                  <span className="hidden xl:inline max-w-[80px] truncate">
                    {currentUser.displayName?.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLogin}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-900 border border-[#EDE8E0] bg-white hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Primary Consultation CTA */}
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline sm:inline">BOOK A CONSULTATION</span>
                <span className="inline xs:hidden sm:hidden">BOOK</span>
              </button>

              {/* Mobile / Tablet Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-1.5 sm:p-2 text-stone-700 hover:text-stone-900 bg-white border border-[#EDE8E0] rounded-full focus:outline-none lg:hidden shrink-0 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-stone-950/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-[#FAF8F5] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EDE8E0]">
                <div>
                  <div className="font-display text-xl font-medium tracking-[0.2em] text-stone-900">
                    {businessConfig.name}
                  </div>
                  <div className="text-[10px] tracking-[0.3em] text-stone-500 uppercase">
                    {businessConfig.subName}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Profile Bar in Mobile Drawer */}
              <div className="py-3 border-b border-[#EDE8E0]">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPatientPortal();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EDE8E0]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#C5A880] text-white flex items-center justify-center text-xs font-semibold">
                        {currentUser.displayName ? currentUser.displayName[0] : 'P'}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-semibold text-stone-900">{currentUser.displayName}</div>
                        <div className="text-[10px] text-stone-400">View Consultations</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#EDE8E0] text-xs font-medium text-stone-800"
                  >
                    <User className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Sign In with Google</span>
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="py-4 space-y-1">
                {allNavLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium text-stone-700 hover:bg-white hover:text-stone-900 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-[#EDE8E0] space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK A CONSULTATION</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTour();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-medium text-stone-800 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors"
              >
                <span>Tour Our Clinic</span>
              </button>

              <div className="pt-2 text-center">
                <a
                  href={businessConfig.phoneRaw}
                  className="text-xs font-semibold text-stone-900 hover:underline block"
                >
                  {businessConfig.phone}
                </a>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {businessConfig.hours}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
