import React from 'react';
import { X, Clock, Calendar, Check, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { ServiceItem } from '../data/businessConfig';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
}) => {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-[#EDE8E0] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header photo & badge */}
        <div className="relative h-60 sm:h-72 w-full bg-stone-100 overflow-hidden shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on photo */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-[#C5A880] text-white inline-block mb-2">
              {service.categoryLabel}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-white tracking-tight">
              {service.name}
            </h2>
          </div>
        </div>

        {/* Scrollable details content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Clinical Overview
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              {service.fullDescription}
            </p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8E0]">
            <div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Starting Price</div>
              <div className="text-base font-semibold text-stone-900 mt-0.5">
                ${service.startingPrice}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Duration</div>
              <div className="text-sm font-semibold text-stone-900 mt-0.5">
                {service.duration}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Downtime</div>
              <div className="text-sm font-semibold text-stone-900 mt-0.5">
                {service.downtime}
              </div>
            </div>
          </div>

          {/* Key Clinical Benefits */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Treatment Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                  <div className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-[#B09167]" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal Candidates */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Recommended For
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.idealFor.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-stone-100 text-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#EDE8E0] flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
              Introductory Consultation
            </span>
            <span className="text-xs font-medium text-stone-700">
              Personalized Evaluation Included
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-medium text-stone-700 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(service.id);
              }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-colors flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK THIS TREATMENT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
