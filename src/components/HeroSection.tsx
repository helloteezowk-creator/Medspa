import React from 'react';
import { ArrowRight, Play, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenTour: () => void;
  onExploreTreatments: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenTour,
  onExploreTreatments,
}) => {
  return (
    <section
      id="home"
      className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 overflow-hidden bg-[#FAF8F5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start z-10 text-left">
            
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2 mb-4 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#A6855B] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Medical Aesthetics & Skincare</span>
            </div>

            {/* Display Headline matching reference aesthetic */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-normal tracking-[0.06em] text-stone-900 leading-[1.12] mb-6 text-balance uppercase">
              {businessConfig.headline}
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-xl mb-8">
              {businessConfig.heroSubheadline}
            </p>

            {/* CTA Buttons matching reference design */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-lumina transition-all duration-200 active:scale-95 group"
              >
                <span>BOOK A CONSULTATION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onOpenTour}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-xs font-medium tracking-wide text-stone-800 bg-white hover:bg-stone-50 border border-[#EDE8E0] shadow-sm transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-stone-800 fill-stone-800 ml-0.5" />
                </div>
                <span>Tour Our Clinic</span>
              </button>
            </div>

            {/* Direct Phone & Trust Reassurance */}
            <div className="mt-8 pt-6 border-t border-[#EDE8E0]/80 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Private Inquiries:</span>
                <a
                  href={businessConfig.phoneRaw}
                  className="font-semibold text-stone-800 hover:text-[#B09167] underline-offset-4 hover:underline"
                >
                  {businessConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Physician-Supervised Medical Team</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Definition Portrait of Radiant Skin */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#EFE9DF] to-transparent rounded-[36px] -rotate-1 scale-95 opacity-70 blur-xl pointer-events-none" />

              {/* Portrait container with soft organic corners */}
              <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-2xl border-4 border-white/80 aspect-[3/4]">
                <img
                  src="/src/assets/images/hero_medspa_radiance_1794044954858.jpg"
                  alt="Radiant glowing skin model at Lumina Medical Spa"
                  className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Subtle soft bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating clinical badge on photo */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#A6855B] font-semibold">
                      Signature Result
                    </div>
                    <div className="text-xs font-semibold text-stone-900">
                      Bespoke Facial Rejuvenation
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onExploreTreatments}
                    className="text-[11px] font-semibold text-[#B09167] hover:text-stone-900 flex items-center gap-1 transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
