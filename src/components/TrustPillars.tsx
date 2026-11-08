import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Compass, HeartHandshake } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export const TrustPillars: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'award':
        return <Sparkles className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      case 'shield':
        return <Shield className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      case 'sparkles':
        return <Compass className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      case 'heartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C5A880]" strokeWidth={1.5} />;
    }
  };

  return (
    <section className="py-10 border-y border-[#EDE8E0] bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {businessConfig.trustPillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/70 transition-all duration-200 cursor-default"
            >
              {/* Icon Medallion */}
              <div className="w-10 h-10 rounded-xl bg-white border border-[#EDE8E0] shadow-sm flex items-center justify-center shrink-0">
                {getIcon(pillar.icon)}
              </div>

              {/* Text */}
              <div>
                <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
                  {pillar.title}
                </h2>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
