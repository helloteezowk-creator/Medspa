import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, ShieldCheck, Sparkles, MapPin, Calendar } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

interface ClinicTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
}

export const ClinicTourModal: React.FC<ClinicTourModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const spaces = [
    {
      title: 'Flagship Reception & Concierge Sanctuary',
      subtitle: 'Serene travertine architecture, warm ambient cove lighting, and private check-in',
      image: '/images/clinic_interior_spa_1794044956038.jpg',
      features: ['Acoustic soundproofing', 'Complimentary wellness teas', 'Zero waiting room exposure'],
    },
    {
      title: 'Advanced Medical Laser & Light Suite',
      subtitle: 'Equipped with Sciton BBL HERO™, Halo, and Candela Alexandrite technologies',
      image: '/images/treatment_laser_rejuvenation_1794044956801.jpg',
      features: ['Dynamic chill-tip patient comfort', 'Certified laser safety optics', 'Medical HEPA ventilation'],
    },
    {
      title: 'Bespoke Injectable & Facial Suite',
      subtitle: 'Ergonomic treatment chairs with multi-axial adjustment and shadowless surgical lighting',
      image: '/images/treatment_injectable_aesthetics_1794044956255.jpg',
      features: ['Multi-spectrum digital skin analysis', 'Physician-supervised protocols', 'Bespoke post-procedure soothing'],
    },
    {
      title: 'Body Contouring & Sculpting Pavilion',
      subtitle: 'Private relaxation environment for non-invasive fat freezing and skin firming',
      image: '/images/treatment_body_contouring_1794044977358.jpg',
      features: ['Private streaming entertainment', 'Heated treatment surfaces', 'Zero-downtime recovery care'],
    },
  ];

  const currentSpace = spaces[currentSlide];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-[#EDE8E0] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div className="p-4 sm:p-6 border-b border-[#EDE8E0] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#B09167]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#A6855B] font-semibold">
                Virtual Walkthrough
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-stone-900">
                Inside Lumina Medical Spa · Beverly Hills Flagship
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media / Carousel Body */}
        <div className="relative overflow-hidden flex-1 bg-stone-950 flex flex-col justify-end min-h-[320px] sm:min-h-[420px]">
          <img
            src={currentSpace.image}
            alt={currentSpace.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : spaces.length - 1))}
              className="p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors pointer-events-auto shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev < spaces.length - 1 ? prev + 1 : 0))}
              className="p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors pointer-events-auto shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Details Overlay */}
          <div className="relative z-10 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A880] text-white">
                Space {currentSlide + 1} of {spaces.length}
              </span>
              <span className="text-xs text-stone-300">
                {businessConfig.address.full}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-white mb-2">
              {currentSpace.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-200 font-light max-w-xl mb-4">
              {currentSpace.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-stone-300">
              {currentSpace.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom thumbnail selector & Booking CTA */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#EDE8E0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {spaces.map((space, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-[#C5A880]' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-700 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors w-full sm:w-auto"
            >
              Close Tour
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookAppointment();
              }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK AN IN-PERSON VISIT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
