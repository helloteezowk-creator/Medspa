import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Calendar } from 'lucide-react';

interface TreatmentCalculatorProps {
  onBookProtocol: (selectedServiceIds: string[]) => void;
}

export const TreatmentCalculator: React.FC<TreatmentCalculatorProps> = ({ onBookProtocol }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['glow', 'wrinkles']);

  const goals = [
    { id: 'glow', label: 'Instant Dewy Skin Glow', serviceId: 'hydrafacial', recName: 'Hydrafacial Rejuvenation', price: 225 },
    { id: 'wrinkles', label: 'Forehead & Eye Wrinkle Smoothing', serviceId: 'botox-injectables', recName: 'Botox / Dysport Neuromodulator', price: 350 },
    { id: 'volume', label: 'Cheek & Lip Volume Enhancement', serviceId: 'dermal-fillers', recName: 'Restylane / Juvéderm Fillers', price: 650 },
    { id: 'pigment', label: 'Sun Spots & Melasma Removal', serviceId: 'pigmentation-treatments', recName: 'BBL Phototherapy', price: 400 },
    { id: 'texture', label: 'Acne Scars & Pore Refinement', serviceId: 'microneedling', recName: 'Medical Microneedling', price: 375 },
    { id: 'firmness', label: 'Jawline & Neck Skin Tightening', serviceId: 'skin-tightening', recName: 'RF Thermal Tightening', price: 500 },
    { id: 'body', label: 'Targeted Body Fat Reduction', serviceId: 'body-contouring', recName: 'Body Sculpting Protocol', price: 750 },
  ];

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== id));
      }
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const selectedItems = goals.filter((g) => selectedGoals.includes(g.id));
  const totalCost = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
  const bundleDiscount = selectedItems.length > 1 ? Math.round(totalCost * 0.1) : 0;
  const finalEstimate = totalCost - bundleDiscount;
  const monthlyEstimate = Math.round(finalEstimate / 12);

  const handleBookProtocol = () => {
    const serviceIds = selectedItems.map((item) => item.serviceId);
    onBookProtocol(serviceIds);
  };

  return (
    <section id="calculator" className="py-20 bg-[#FAF8F5] border-b border-[#EDE8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <div className="text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
            Personalized Estimate & Financing
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
            Curate Your Aesthetic Protocol
          </h2>
          <p className="text-sm text-stone-600 font-light mt-3">
            Select your primary aesthetic priorities to explore synergistic treatment pairings, estimated investment, and flexible 0% APR monthly installments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Goal Selectors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Select Your Aesthetic Goals:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#C5A880] shadow-sm ring-1 ring-[#C5A880]/30 scale-[1.01]'
                        : 'bg-white/70 border-[#EDE8E0] hover:border-stone-400 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-stone-900">
                        {goal.label}
                      </div>
                      <div className="text-[11px] text-[#A6855B] font-medium mt-0.5">
                        {goal.recName}
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-[#C5A880] border-[#C5A880] text-white'
                          : 'border-[#EDE8E0] bg-[#FAF8F5]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#EDE8E0] text-xs text-stone-500 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>
                Tip: Combining treatments in a single clinical visit often maximizes results while qualifying for our multi-modality 10% privilege savings.
              </span>
            </div>
          </motion.div>

          {/* Right Column: Protocol Summary & Investment Estimate Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#EDE8E0] shadow-lumina-card">
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E0]">
                <div>
                  <h3 className="font-display text-xl font-medium text-stone-900">
                    Your Tailored Protocol
                  </h3>
                  <span className="text-xs text-stone-500">
                    {selectedItems.length} {selectedItems.length === 1 ? 'treatment' : 'treatments'} curated
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF8F5] border border-[#EDE8E0] text-stone-700">
                  Complimentary Consultation
                </div>
              </div>

              {/* Selected List */}
              <div className="py-4 space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800">{item.recName}</span>
                    <span className="font-semibold text-stone-900">${item.price}</span>
                  </div>
                ))}

                {bundleDiscount > 0 && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-dashed border-[#EDE8E0] text-[#B09167] font-semibold">
                    <span>Combination Privilege (10% Off)</span>
                    <span>-${bundleDiscount}</span>
                  </div>
                )}
              </div>

              {/* Total & Monthly Financing Breakdown */}
              <div className="pt-4 border-t border-[#EDE8E0] space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    Estimated Starting Total
                  </span>
                  <span className="font-display text-3xl font-normal text-stone-900">
                    ${finalEstimate}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-stone-500 uppercase tracking-wider">
                      Or Flexible 0% APR Financing
                    </div>
                    <div className="text-xs font-bold text-stone-900 mt-0.5">
                      As low as ${monthlyEstimate} / month
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">
                    CareCredit® / Cherry®
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleBookProtocol}
                  className="w-full py-4 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK THIS CUSTOM PROTOCOL</span>
                </button>
                <div className="text-center mt-2.5">
                  <span className="text-[11px] text-stone-400">
                    No charge today. Final protocol confirmed with your clinician.
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
