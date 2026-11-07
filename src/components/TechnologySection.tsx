import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Check } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export const TechnologySection: React.FC = () => {
  return (
    <section id="technology" className="py-20 bg-white border-b border-[#EDE8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
            Clinical Rigor & Equipment
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
            FDA-Cleared Aesthetic Technologies
          </h2>
          <p className="text-sm text-stone-600 font-light mt-3">
            We invest exclusively in authentic, medical-grade platforms that provide predictable clinical results, maximum patient comfort, and proven safety records.
          </p>
        </div>

        {/* 4 Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessConfig.technologies.map((tech, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[24px] bg-[#FAF8F5] border border-[#EDE8E0] hover:border-[#C5A880]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EDE8E0] flex items-center justify-center text-[#B09167] mb-5 shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>

                <div className="text-[11px] font-semibold text-[#A6855B] uppercase tracking-wider mb-1">
                  {tech.purpose}
                </div>

                <h3 className="font-display text-lg font-medium text-stone-900 mb-3">
                  {tech.name}
                </h3>

                <p className="text-xs text-stone-500 font-light leading-relaxed mb-6">
                  {tech.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EDE8E0] flex items-center gap-2 text-[11px] font-medium text-stone-700">
                <ShieldCheck className="w-4 h-4 text-[#B09167]" />
                <span>{tech.clearance}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
