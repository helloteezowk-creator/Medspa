import React from 'react';
import { Check, ArrowRight, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

interface AboutClinicProps {
  onOpenTour: () => void;
  onOpenBooking: () => void;
}

export const AboutClinic: React.FC<AboutClinicProps> = ({ onOpenTour, onOpenBooking }) => {
  return (
    <section id="about" className="py-20 bg-white border-y border-[#EDE8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clinic Interior Photography matching reference */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-[32px] shadow-lg border border-[#EDE8E0] aspect-[4/3] bg-stone-100 group">
              <img
                src="/src/assets/images/clinic_interior_spa_1794044956038.jpg"
                alt="Lumina Medical Spa luxury reception and clinic lounge"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />

              <button
                type="button"
                onClick={onOpenTour}
                className="absolute bottom-4 left-4 right-4 py-2.5 px-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md text-xs font-semibold text-stone-900 flex items-center justify-between hover:bg-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Explore Beverly Hills Flagship Suite</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B09167]" />
              </button>
            </div>
          </div>

          {/* Middle Column: Clinical Narrative & Checkmark Standards */}
          <div className="lg:col-span-4 flex flex-col justify-center text-left">
            <div className="text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
              Clinical Philosophy
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 tracking-tight uppercase mb-4">
              ABOUT OUR CLINIC
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed font-light mb-6">
              Lumina is a sanctuary where board-certified medical precision meets bespoke luxury. We combine cutting-edge FDA-cleared devices, physician-formulated protocols, and an unhurried patient approach to enhance your natural beauty safely and artfully.
            </p>

            <div className="space-y-3.5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#B09167]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  Advanced FDA-Cleared Medical Systems
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#B09167]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  Proprietary Anatomy-Specific Protocols
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#B09167]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  Highest Hospital-Grade Sterilization & Privacy
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#A6855B] hover:text-stone-900 tracking-wider uppercase transition-colors"
              >
                <span>Request Private Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Quantitative Clinical Rigor matching reference */}
          <div className="lg:col-span-3 flex flex-col justify-center divide-y divide-[#EDE8E0] border-t lg:border-t-0 lg:border-l border-[#EDE8E0] pt-6 lg:pt-0 lg:pl-8">
            {businessConfig.stats.map((stat, idx) => (
              <div key={idx} className="py-5 first:pt-0 last:pb-0">
                <div className="font-display text-4xl sm:text-5xl font-light text-stone-900 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-stone-800 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-stone-500 font-light mt-0.5">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
