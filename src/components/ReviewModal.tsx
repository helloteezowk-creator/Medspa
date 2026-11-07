import React, { useState } from 'react';
import { X, Star, ShieldCheck, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { submitPatientReview, UserProfile, loginWithGoogle } from '../services/firebaseService';
import { submitReviewHostinger } from '../services/hostingerService';
import { businessConfig } from '../data/businessConfig';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onReviewSubmitted,
}) => {
  const [treatment, setTreatment] = useState<string>('Hydrafacial Treatments');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [location, setLocation] = useState<string>('Beverly Hills, CA');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('Please sign in with Google to verify your patient identity.');
      return;
    }

    if (comment.trim().length < 10) {
      setErrorMsg('Please enter at least 10 characters detailing your experience.');
      return;
    }

    if (comment.trim().length > 500) {
      setErrorMsg('Review must be 500 characters or fewer.');
      return;
    }

    // Check for spam links
    if (/(https?:\/\/[^\s]+|www\.[^\s]+)/i.test(comment)) {
      setErrorMsg('Promotional URLs and links are prohibited to prevent spam.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPatientReview({
        treatment,
        rating,
        comment: comment.trim(),
        authorLocation: location.trim() || 'Beverly Hills, CA',
      });

      // Also persist to Hostinger MySQL
      try {
        submitReviewHostinger({
          userId: currentUser?.uid,
          authorName: currentUser?.displayName || 'Verified Patient',
          authorLocation: location.trim() || 'Beverly Hills, CA',
          treatment,
          rating,
          comment: comment.trim(),
        }).catch((e) => console.log('Hostinger review optional sync:', e));
      } catch (hErr) {
        // Optional sync
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      onReviewSubmitted();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl border border-[#EDE8E0] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E0] mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#A6855B] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Patient Review</span>
            </div>
            <h2 className="font-display text-2xl font-medium text-stone-900 mt-1">
              Share Your Clinical Reflection
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-medium text-stone-900">
              Thank You for Your Feedback
            </h3>
            <p className="text-xs text-stone-600 font-light max-w-sm mx-auto">
              Your verified review has been securely recorded on our clinical backend and published to the patient testimonials slider.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : !currentUser ? (
          /* Authentication Gate to Prevent Spam */
          <div className="text-center py-6 space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center text-[#B09167] mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display text-xl font-medium text-stone-900">
                Patient Authentication Required
              </h3>
              <p className="text-xs text-stone-500 font-light mt-1.5 max-w-md mx-auto leading-relaxed">
                To maintain authentic clinical transparency and strictly prevent spam or automated bots, only verified patient accounts may submit treatment reviews.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>SIGN IN WITH GOOGLE TO REVIEW</span>
              </button>
            </div>
          </div>
        ) : (
          /* Review Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Author indicator */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-between">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Posting As:</span>
                <span className="font-semibold text-stone-900">{currentUser.displayName}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Verified Account
              </span>
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-stone-600 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Your Rating:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#C5A880] text-[#C5A880]'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-stone-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Treatment Selector */}
            <div>
              <label className="block text-stone-600 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Treatment Experienced:
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs font-medium text-stone-800 focus:outline-none focus:border-[#C5A880]"
              >
                {businessConfig.services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="InfraBaldan 3.0™ Body Sculpting">InfraBaldan 3.0™ Body Sculpting</option>
                <option value="TriLaser Permanent Hair Removal">TriLaser Permanent Hair Removal</option>
                <option value="Bespoke Combination Protocol">Bespoke Combination Protocol</option>
              </select>
            </div>

            {/* City / Location */}
            <div>
              <label className="block text-stone-600 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Location (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Beverly Hills, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs"
              />
            </div>

            {/* Comment */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
                  Clinical Experience & Result (10–500 chars):
                </label>
                <span className="text-[10px] text-stone-400">
                  {comment.length} / 500
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Describe your treatment comfort, clinician attentiveness, and aesthetic outcome..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                required
                className="w-full p-3 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            {/* Anti-spam notice */}
            <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Reviews are verified by Google Auth and protected against duplicate bot submissions.</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'VERIFYING & POSTING...' : 'SUBMIT VERIFIED REVIEW'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
