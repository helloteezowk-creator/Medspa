import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

interface FooterProps {
  onOpenBooking: () => void;
  onSelectTreatment: (serviceId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onSelectTreatment, onOpenAdmin }) => {
  return (
    <footer id="contact" className="bg-[#FAF8F5] border-t border-[#EDE8E0] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#EDE8E0]">
          
          {/* Column 1: Brand Wordmark & Ethics */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <span className="font-display text-2xl font-medium tracking-[0.25em] text-stone-900 uppercase block">
                {businessConfig.name}
              </span>
              <span className="text-[10px] tracking-[0.35em] text-stone-500 uppercase -mt-0.5 block">
                {businessConfig.subName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed max-w-sm mb-6">
              A physician-supervised medical spa dedicated to natural facial harmony, advanced dermal rejuvenation, and non-invasive body contouring.
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Beverly Hills Clinical Facility</span>
            </div>
          </div>

          {/* Column 2: Treatments Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900 mb-4">
              Featured Treatments
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTreatment('botox-injectables')}
                  className="hover:text-stone-900 transition-colors cursor-pointer text-left"
                >
                  Botox & Injectables
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTreatment('hydrafacial')}
                  className="hover:text-stone-900 transition-colors cursor-pointer text-left"
                >
                  Hydrafacial Treatments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTreatment('skin-rejuvenation')}
                  className="hover:text-stone-900 transition-colors cursor-pointer text-left"
                >
                  Laser Skin Rejuvenation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTreatment('body-contouring')}
                  className="hover:text-stone-900 transition-colors cursor-pointer text-left"
                >
                  Body Sculpting & Contouring
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTreatment('microneedling')}
                  className="hover:text-stone-900 transition-colors cursor-pointer text-left"
                >
                  Medical Microneedling
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinic Information */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900 mb-4">
              Clinic
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li>
                <a href="#about" className="hover:text-stone-900 transition-colors">
                  About Our Practice
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-stone-900 transition-colors">
                  FDA-Cleared Technology
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-stone-900 transition-colors">
                  Patient Journey
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-stone-900 transition-colors">
                  Protocol Pricing & Financing
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-stone-900 transition-colors">
                  Verified Reviews
                </a>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-stone-900 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-stone-500 hover:underline"
                >
                  <Lock className="w-3 h-3 text-[#C5A880]" />
                  <span>Admin Sign-Up / Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Quick Consultation Form */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900 mb-4">
              Flagship Clinic
            </h3>
            
            <div className="space-y-3 text-xs text-stone-600 mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{businessConfig.address.full}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={businessConfig.phoneRaw} className="hover:text-stone-900 font-medium">
                  {businessConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>{businessConfig.hours}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full py-3 px-4 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>REQUEST CONSULTATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Compliance & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 {businessConfig.name} {businessConfig.subName}. All rights reserved.</span>
            <span className="text-stone-300">·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer py-1 text-[11px] font-medium hover:underline underline-offset-4"
            >
              <Lock className="w-3 h-3 text-[#C5A880]" />
              <span>Admin Portal (Sign Up / Login)</span>
            </button>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>HIPAA Compliant</span>
            <span>·</span>
            <span>Physician-Supervised Facility</span>
            <span>·</span>
            <span>Licensed Medical Practice</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
