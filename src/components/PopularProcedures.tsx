import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Clock, ChevronUp } from 'lucide-react';
import { businessConfig, ServiceItem } from '../data/businessConfig';

interface PopularProceduresProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (serviceId: string) => void;
}

export const PopularProcedures: React.FC<PopularProceduresProps> = ({
  onSelectService,
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllServices, setShowAllServices] = useState<boolean>(false);

  // The 4 marquee cards matching the reference image
  const featuredServices = businessConfig.services.filter((s) => s.popular);

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'injectables', label: 'Injectables & Botox' },
    { id: 'laser', label: 'Laser & Energy' },
    { id: 'skin', label: 'Skin Rejuvenation' },
    { id: 'body', label: 'Body Contouring' },
    { id: 'facials', label: 'Facial Wellness' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? businessConfig.services
      : businessConfig.services.filter((s) => s.category === selectedCategory);

  return (
    <section id="treatments" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
              Clinical Aesthetic Menu
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
              Popular Treatments
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowAllServices(!showAllServices)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-800 hover:text-[#B09167] transition-colors group cursor-pointer"
            >
              <span>{showAllServices ? 'Show Featured Only' : 'View All 14 Treatments'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                if (cat.id !== 'all') setShowAllServices(true);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#EDE8E0] hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Default 4 Feature Cards (exact layout from uploaded reference image) */}
        {!showAllServices && selectedCategory === 'all' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-[28px] border border-[#EDE8E0] p-4 flex flex-col justify-between shadow-lumina-card hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Rounded Arch Photo Container */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-stone-100 mb-4">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Circular Emblem Motif matching reference */}
                    <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-[#C5A880]/90 backdrop-blur-sm border border-white/60 flex items-center justify-center text-white shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Treatment Title */}
                  <h3 className="font-display text-xl font-medium text-stone-900 tracking-tight mb-2 group-hover:text-[#B09167] transition-colors">
                    {service.name}
                  </h3>

                  {/* Brief description */}
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-3 mb-4">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Bottom Row: Price + Round Arrow Button */}
                <div className="pt-4 border-t border-[#EDE8E0]/70 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block">Starting from</span>
                    <span className="text-base font-semibold text-stone-900">
                      ${service.startingPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectService(service)}
                      className="text-xs font-semibold text-[#A6855B] hover:text-stone-900 underline underline-offset-4 mr-1 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookService(service.id)}
                      aria-label={`Book ${service.name}`}
                      className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] text-stone-700 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Extended 14-service treatment catalog */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 6) * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-[24px] border border-[#EDE8E0] p-5 flex flex-col justify-between shadow-lumina-card hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl aspect-[16/10] bg-stone-100 mb-4">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-stone-800 shadow-sm">
                        {service.categoryLabel}
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-medium text-stone-900 mb-2">
                      {service.name}
                    </h3>

                    <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>

                    <div className="space-y-1.5 mb-4 text-[11px] text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Duration: {service.duration} · {service.downtime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EDE8E0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                        From
                      </span>
                      <span className="text-base font-semibold text-stone-900">
                        ${service.startingPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectService(service)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onBookService(service.id)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedCategory === 'all' && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowAllServices(false)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Collapse to Featured Cards</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
