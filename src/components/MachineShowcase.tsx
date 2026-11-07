import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Zap, Calendar, ArrowRight } from 'lucide-react';

interface MachineShowcaseProps {
  onBookMachine: (machineName: string) => void;
}

export const MachineShowcase: React.FC<MachineShowcaseProps> = ({ onBookMachine }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 3 Clinical Machines matching the user's uploaded reference screenshot
  const machines = [
    {
      id: 'infrabaldan',
      name: 'InfraBaldan 3.0™',
      subTitle: 'Infrared Metabolic Slimming Pod',
      headline: 'Synchronized Aerobic Movement & Infrared Photobiomodulation',
      centerImage: '/src/assets/images/machine_infrabaldan_infrared_1794056127227.jpg',
      vignettes: [
        {
          id: 'v1',
          image: '/src/assets/images/machine_red_light_action_1794056129311.jpg',
          title: 'Infrared Lamps',
          desc: 'Selected biological infrared rays activate lipolysis.',
        },
        {
          id: 'v2',
          image: '/src/assets/images/treatment_body_contouring_1794044977358.jpg',
          title: 'Aerobic Activation',
          desc: 'Targeted continuous pedaling accelerates fat burning.',
        },
        {
          id: 'v3',
          image: '/src/assets/images/promo_macro_radiance_1794044958044.jpg',
          title: 'Mitochondrial ATP',
          desc: 'Deep cellular photobiomodulation & tissue toning.',
        },
      ],
      leftPreview: {
        name: 'TriLaser™ Platform',
        image: '/src/assets/images/machine_aesthetic_laser_tower_1794056127293.jpg',
      },
      rightPreview: {
        name: 'FibraDFA / Cryo-RF',
        image: '/src/assets/images/machine_cryo_rf_tower_1794056128491.jpg',
      },
      description:
        'InfraBaldan 3.0 is a patented medical device that synchronizes gentle aerobic physical activity with selected infrared radiation. By maintaining heart rate in the aerobic fat-burning zone while bathing target zones in deep therapeutic infrared light, it re-educates metabolism to consume stubborn fat reserves.',
      specs: [
        { label: 'Technology', value: 'Infrared Radiation + Aerobic Fat Burn' },
        { label: 'Session Duration', value: '40 Minutes' },
        { label: 'Downtime', value: 'Zero Recovery Time' },
        { label: 'Target Areas', value: 'Visceral & Subcutaneous Fat' },
      ],
      indicationTags: ['Metabolic Jumpstart', 'Visceral Abdomen Fat', 'Cellulite Smoothing', 'Skin Tightening'],
    },
    {
      id: 'trilaser',
      name: 'TriLaser™ Medical Platform',
      subTitle: 'Triple-Wavelength Aesthetic Laser',
      headline: '755nm Alexandrite · 808nm Diode · 1064nm Nd:YAG Laser',
      centerImage: '/src/assets/images/machine_aesthetic_laser_tower_1794056127293.jpg',
      vignettes: [
        {
          id: 'v1',
          image: '/src/assets/images/treatment_laser_rejuvenation_1794044956801.jpg',
          title: 'Sapphire Chill-Tip',
          desc: 'Continuous -4°C contact cooling for painless pulses.',
        },
        {
          id: 'v2',
          image: '/src/assets/images/machine_red_light_action_1794056129311.jpg',
          title: 'Multi-Depth Beam',
          desc: 'Targets superficial and deep hair follicle stems.',
        },
        {
          id: 'v3',
          image: '/src/assets/images/hero_medspa_radiance_1794044954858.jpg',
          title: 'All Skin Types',
          desc: 'Safe for Fitzpatrick phototypes I through VI.',
        },
      ],
      leftPreview: {
        name: 'FibraDFA / Cryo-RF',
        image: '/src/assets/images/machine_cryo_rf_tower_1794056128491.jpg',
      },
      rightPreview: {
        name: 'InfraBaldan 3.0™',
        image: '/src/assets/images/machine_infrabaldan_infrared_1794056127227.jpg',
      },
      description:
        'The TriLaser platform combines three distinct wavelengths into a single synchronized handpiece. By targeting follicle structures at varying anatomical depths simultaneously, it delivers superior hair clearance and epidermal smoothing with high patient comfort.',
      specs: [
        { label: 'Wavelengths', value: '755nm / 808nm / 1064nm' },
        { label: 'Session Duration', value: '15–30 Minutes' },
        { label: 'Cooling System', value: 'Sapphire Contact Chill-Tip' },
        { label: 'Clearance', value: 'FDA-Cleared Class II Medical Laser' },
      ],
      indicationTags: ['Permanent Hair Reduction', 'Texture Refinement', 'Folliculitis Prevention', 'Epidermal Tone'],
    },
    {
      id: 'fibra-rf',
      name: 'FibraDFA™ Cryo-RF Tower',
      subTitle: 'Thermal Shock & Multipolar RF',
      headline: 'Synergistic Deep Dermal Heating & Cryogenic Sculpting',
      centerImage: '/src/assets/images/machine_cryo_rf_tower_1794056128491.jpg',
      vignettes: [
        {
          id: 'v1',
          image: '/src/assets/images/treatment_body_contouring_1794044977358.jpg',
          title: 'Thermal Shock Head',
          desc: 'Contrast therapy triggers micro-vascular contraction.',
        },
        {
          id: 'v2',
          image: '/src/assets/images/treatment_injectable_aesthetics_1794044956255.jpg',
          title: 'Multipolar RF',
          desc: 'Contracts dermal collagen fibrils up to 15mm deep.',
        },
        {
          id: 'v3',
          image: '/src/assets/images/treatment_hydrafacial_glow_1794044958347.jpg',
          title: 'Vacuum Drainage',
          desc: 'Enhances lymphatic clearance and tissue detox.',
        },
      ],
      leftPreview: {
        name: 'InfraBaldan 3.0™',
        image: '/src/assets/images/machine_infrabaldan_infrared_1794056127227.jpg',
      },
      rightPreview: {
        name: 'TriLaser™ Platform',
        image: '/src/assets/images/machine_aesthetic_laser_tower_1794056127293.jpg',
      },
      description:
        'FibraDFA Cryo-RF combines subdermal radiofrequency with thermal shock cooling to stimulate immediate collagen contraction and long-term neocollagenesis. Safely sculpts delicate facial contours and tones lax body tissues without surgical recovery.',
      specs: [
        { label: 'Modality', value: 'Cryo Thermal Shock + RF Vacuum' },
        { label: 'Session Duration', value: '30–50 Minutes' },
        { label: 'Downtime', value: 'Zero (Immediate return to routine)' },
        { label: 'Target Areas', value: 'Jawline, Neck, Abdomen, Thighs' },
      ],
      indicationTags: ['Jawline Definition', 'Cellulite Smoothing', 'Neck Laxity', 'Post-Liposuction Smoothing'],
    },
  ];

  const current = machines[activeSlide];

  const goToSlide = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(newIndex);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = () => {
    const nextIdx = activeSlide > 0 ? activeSlide - 1 : machines.length - 1;
    goToSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = activeSlide < machines.length - 1 ? activeSlide + 1 : 0;
    goToSlide(nextIdx);
  };

  return (
    <section id="equipment" className="py-20 bg-white border-b border-[#EDE8E0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] text-[11px] font-semibold tracking-wider uppercase text-[#8C6D45] mb-3">
            <Zap className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>State-of-the-Art Aesthetic Fleet</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
            Our Clinical Medical Machines
          </h2>

          <p className="text-sm text-stone-600 font-light mt-3 max-w-2xl mx-auto leading-relaxed">
            Directly from our Beverly Hills treatment suites: authentic, physician-calibrated systems engineered for non-invasive fat reduction, laser resurfacing, and skin tightening.
          </p>
        </div>

        {/* PANORAMIC EQUIPMENT SLIDER STAGE — REPLICATING THE USER'S REFERENCE SCREENSHOT */}
        <div className="relative bg-[#FAFAFA] rounded-[36px] sm:rounded-[48px] border border-[#EDE8E0] p-6 sm:p-10 lg:p-12 mb-12 shadow-sm overflow-hidden">
          
          {/* Machine Carousel Selector Bar */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {machines.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeSlide === idx
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-[#EDE8E0]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeSlide === idx ? 'bg-[#C5A880]' : 'bg-stone-300'}`} />
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          {/* MAIN PANORAMIC STAGE WITH 3 MACHINES AND CIRCULAR ACTION VIGNETTES */}
          <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-between">
            
            {/* LEFT MACHINE PREVIEW (Clickable to switch) */}
            <div
              onClick={handlePrev}
              className="hidden lg:flex flex-col items-center justify-center w-1/5 opacity-50 hover:opacity-90 transition-opacity cursor-pointer select-none group"
            >
              <div className="h-56 xl:h-64 w-full flex items-center justify-center">
                <img
                  src={current.leftPreview.image}
                  alt={current.leftPreview.name}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none"
                />
              </div>
              <span className="text-xs text-stone-500 font-medium mt-3 text-center group-hover:text-stone-900">
                {current.leftPreview.name}
              </span>
            </div>

            {/* PREV ARROW BUTTON `<` */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Machine"
              className="absolute left-2 sm:left-4 lg:left-[22%] z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-[#EDE8E0] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2]" />
            </button>

            {/* CENTER SPOTLIGHT STAGE (Circular spotlight with high-def machine and 3 circular action bubbles) */}
            <div className="relative w-full lg:w-3/5 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 z-10 px-4 sm:px-8">
              
              {/* Circular Spotlight Disk */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-white shadow-inner border border-stone-200/60 flex items-center justify-center shrink-0">
                
                {/* Background decorative concentric ring */}
                <div className="absolute inset-4 rounded-full bg-stone-50/70 border border-stone-100 pointer-events-none" />

                {/* Machine product image isolated without glitching */}
                <div className="relative z-10 w-full h-full p-6 flex items-center justify-center">
                  <img
                    key={current.id}
                    src={current.centerImage}
                    alt={current.name}
                    className="max-h-full max-w-full object-contain transition-all duration-300 pointer-events-none"
                    style={{ maxHeight: '85%', maxWidth: '85%' }}
                  />
                </div>

                {/* Machine Name Badge on circle */}
                <div className="absolute -bottom-3 px-4 py-1.5 rounded-full bg-stone-900 text-white text-[11px] font-semibold tracking-wider uppercase shadow-md flex items-center gap-1.5 z-20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{current.name}</span>
                </div>
              </div>

              {/* 3 CIRCULAR ACTION VIGNETTES (Exact feature from user reference screenshot) */}
              <div className="flex md:flex-col items-center justify-center gap-3 sm:gap-4 shrink-0">
                {current.vignettes.map((v) => (
                  <div
                    key={v.id}
                    className="group relative flex items-center gap-3"
                    title={v.title}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#EDE8E0] group-hover:ring-[#C5A880] transition-all duration-200 shrink-0 bg-stone-100">
                      <img
                        src={v.image}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                      />
                    </div>
                    <div className="hidden xl:block max-w-[130px]">
                      <div className="text-[11px] font-semibold text-stone-900 leading-tight">
                        {v.title}
                      </div>
                      <div className="text-[10px] text-stone-500 leading-tight mt-0.5 line-clamp-1">
                        {v.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* NEXT ARROW BUTTON `>` */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Machine"
              className="absolute right-2 sm:right-4 lg:right-[22%] z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-[#EDE8E0] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2]" />
            </button>

            {/* RIGHT MACHINE PREVIEW (Clickable to switch) */}
            <div
              onClick={handleNext}
              className="hidden lg:flex flex-col items-center justify-center w-1/5 opacity-50 hover:opacity-90 transition-opacity cursor-pointer select-none group"
            >
              <div className="h-56 xl:h-64 w-full flex items-center justify-center">
                <img
                  src={current.rightPreview.image}
                  alt={current.rightPreview.name}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none"
                />
              </div>
              <span className="text-xs text-stone-500 font-medium mt-3 text-center group-hover:text-stone-900">
                {current.rightPreview.name}
              </span>
            </div>

          </div>

          {/* Machine Info Bar Below Carousel */}
          <div className="mt-10 pt-8 border-t border-[#EDE8E0] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#B09167] mb-1">
                {current.subTitle}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight mb-2">
                {current.headline}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-3xl">
                {current.description}
              </p>

              {/* Indication Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {current.indicationTags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-full text-[11px] font-medium bg-white border border-[#EDE8E0] text-stone-700 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA & Booking for this machine */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 justify-center">
              <button
                type="button"
                onClick={() => onBookMachine(current.name)}
                className="w-full sm:w-auto lg:w-full px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK TREATMENT ON THIS SYSTEM</span>
              </button>
              <span className="text-[11px] text-stone-400">
                Complimentary 3D body & facial mapping included
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
