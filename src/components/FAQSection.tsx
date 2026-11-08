import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, PhoneCall } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

interface FAQSectionProps {
  onOpenBooking: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBooking }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
            Clear Answers
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-600 font-light mt-3">
            Everything you need to know prior to your medical aesthetics appointment.
          </p>
        </motion.div>

        {/* Accordion list */}
        <div className="space-y-4">
          {businessConfig.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl border border-[#EDE8E0] overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#C5A880]/50"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-stone-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#C5A880]/10 text-[#A6855B]' : 'text-stone-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-[#EDE8E0]/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Consultation Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-[#EDE8E0] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm"
        >
          <div>
            <h4 className="font-display text-lg font-medium text-stone-900">
              Have a specific medical or cosmetic question?
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Speak directly with our clinical patient coordinator.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={businessConfig.phoneRaw}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-stone-800 bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{businessConfig.phone}</span>
            </a>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              Ask at Consultation
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
