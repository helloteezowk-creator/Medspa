import React from 'react';
import { motion } from 'motion/react';
import { FileText, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export const TreatmentJourney: React.FC = () => {
  const getStepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <FileText className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      case 1:
        return <ShieldCheck className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      case 2:
        return <Sparkles className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      case 3:
        return <Smile className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
            The Patient Experience
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
            Our Methodical Approach to Your Natural Beauty
          </h2>
          <p className="text-sm text-stone-600 font-light mt-3">
            Every aesthetic journey at Lumina follows four disciplined clinical milestones to guarantee safety, satisfaction, and effortless elegance.
          </p>
        </motion.div>

        {/* 4-Step Process Grid with Connecting Connectors matching reference */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {businessConfig.journeySteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col items-center text-center group cursor-default"
            >
              
              {/* Connector line for desktop */}
              {idx < businessConfig.journeySteps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-1/2 w-full h-[1px] bg-gradient-to-r from-[#EDE8E0] via-[#C5A880]/40 to-[#EDE8E0] -z-0" />
              )}

              {/* Step Medallion Icon matching reference */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-white border border-[#EDE8E0] shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#C5A880] transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#EDE8E0]/70 flex items-center justify-center">
                  {getStepIcon(idx)}
                </div>
              </div>

              {/* Step name & description */}
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#B09167] mb-1">
                Step {step.number} · {step.step}
              </div>

              <h3 className="font-display text-lg font-medium text-stone-900 mb-2">
                {step.title}
              </h3>

              <p className="text-xs text-stone-500 font-light leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
