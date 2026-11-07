import React, { useState, useRef, useEffect } from 'react';
import { Star, ShieldCheck, Quote, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, PlusCircle } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import { subscribePublishedReviews, PatientReview } from '../services/firebaseService';

interface ReviewsSectionProps {
  onOpenReviewModal: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOpenReviewModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [firestoreReviews, setFirestoreReviews] = useState<PatientReview[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Subscribe to live backend reviews from Firestore
  useEffect(() => {
    const unsub = subscribePublishedReviews((liveReviews) => {
      setFirestoreReviews(liveReviews);
    });
    return () => unsub();
  }, []);

  // Combine initial clinical reviews with live backend reviews
  const allReviews = [
    ...firestoreReviews.map((r) => ({
      name: r.authorName,
      location: r.authorLocation,
      treatment: r.treatment,
      quote: r.comment,
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
      isLive: true,
    })),
    ...businessConfig.testimonials.map((t) => ({ ...t, isLive: false })),
  ];

  // Update itemsPerPage on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalReviews = allReviews.length;
  const maxIndex = Math.max(0, totalReviews - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const cardWidthPercentage = 100 / itemsPerPage;

  return (
    <section id="reviews" className="py-20 bg-white border-b border-[#EDE8E0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-[#A6855B] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Verified Clinical Experiences</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
              Patient Reflections & Outcomes
            </h2>
            <p className="text-sm text-stone-600 font-light mt-2 max-w-xl">
              Authentic reflections from patients who completed personalized treatment protocols at Lumina. Saved securely on our live backend.
            </p>
          </div>

          {/* Action Row: Write Review + Slider Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenReviewModal}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-stone-800 bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-stone-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Write a Review</span>
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Review"
              className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] text-stone-700 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-stone-500 tabular-nums px-2">
              {currentIndex + 1}–{Math.min(currentIndex + itemsPerPage, totalReviews)} of {totalReviews}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Review"
              className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-[#C5A880] hover:text-white hover:border-[#C5A880] text-stone-700 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative overflow-hidden -mx-3 px-3 py-2" ref={containerRef}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidthPercentage}%)`,
            }}
          >
            {allReviews.map((review, idx) => {
              const initials = review.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              return (
                <div
                  key={idx}
                  className="px-3 shrink-0"
                  style={{ width: `${cardWidthPercentage}%` }}
                >
                  <div className="h-full bg-[#FAF8F5] rounded-[28px] border border-[#EDE8E0] p-7 sm:p-8 flex flex-col justify-between shadow-lumina-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    
                    <div>
                      {/* Top Row: Rating & Verified Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-1 text-[#C5A880]">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#EDE8E0] text-[10px] font-semibold text-[#8C6D45] uppercase tracking-wider shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-[#A6855B]" />
                          <span>{review.isLive ? 'Backend Verified' : 'Verified Patient'}</span>
                        </div>
                      </div>

                      {/* Quote Text */}
                      <p className="text-sm text-stone-700 font-light leading-relaxed italic mb-6">
                        "{review.quote}"
                      </p>
                    </div>

                    {/* Bottom Author Section */}
                    <div className="pt-5 border-t border-[#EDE8E0]/80">
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#EAE2D5] to-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center font-display text-xs font-semibold text-stone-800 shadow-sm shrink-0">
                          {initials}
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-stone-900 leading-none">
                            {review.name}
                          </h3>
                          <p className="text-[11px] text-stone-500 font-light mt-1">
                            {review.location} · {review.date}
                          </p>
                        </div>
                      </div>

                      {/* Treatment Pill */}
                      <div className="text-[11px] font-medium text-stone-600 bg-white/80 rounded-xl px-3 py-1.5 border border-[#EDE8E0] truncate">
                        <span className="text-stone-400">Treatment:</span>{' '}
                        <span className="text-[#8C6D45] font-semibold">{review.treatment}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[...Array(maxIndex + 1)].map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === dotIdx ? 'w-8 bg-[#C5A880]' : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
