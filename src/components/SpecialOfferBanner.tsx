import React from 'react';
import { ArrowRight, Tag, Sparkles, CheckCircle2 } from 'lucide-react';

interface SpecialOfferBannerProps {
  onClaimOffer: () => void;
}

export const SpecialOfferBanner: React.FC<SpecialOfferBannerProps> = ({ onClaimOffer }) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rounded Promo Container matching reference */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#EBE5DC] border border-[#E0D8CC] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/60 text-[11px] font-semibold tracking-wider uppercase text-[#8C6D45] mb-6">
                  <Tag className="w-3 h-3 text-[#A6855B]" />
                  <span>Welcome Patient Privilege</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight mb-4">
                  Enjoy 15% Off Your First Aesthetic Treatment
                </h3>

                <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-lg mb-8">
                  Your journey to healthy, timeless radiance begins with a dedicated clinical assessment. Schedule your introductory consultation to receive personalized treatment planning and preferred introductory rates.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-700 font-medium mb-8">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A6855B]" />
                    Comprehensive 3D Skin Scan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A6855B]" />
                    Custom Physician Roadmap
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onClaimOffer}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs font-semibold tracking-wider text-white bg-stone-900 hover:bg-stone-800 shadow-md transition-all duration-200 active:scale-95 group"
                >
                  <span>CLAIM YOUR OFFER</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#C5A880]" />
                </button>
              </div>
            </div>

            {/* Right Photo Column: Macro Skin Glow */}
            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full">
              <img
                src="/src/assets/images/promo_macro_radiance_1794044958044.jpg"
                alt="Radiant dewy skin close up at Lumina Medical Spa"
                className="w-full h-full object-cover object-center absolute inset-0"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EBE5DC] via-[#EBE5DC]/20 to-transparent lg:block hidden pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent lg:hidden pointer-events-none" />

              {/* Subtle bottom navigation dots/tag */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-stone-800 border border-white/60">
                  Limited Availability This Month
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
