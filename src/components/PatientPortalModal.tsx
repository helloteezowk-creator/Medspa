import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, LogOut, Phone, ShieldCheck, Plus } from 'lucide-react';
import { UserProfile, FirestoreConsultation, subscribeUserConsultations, logoutUser } from '../services/firebaseService';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onBookNew: () => void;
}

export const PatientPortalModal: React.FC<PatientPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onBookNew,
}) => {
  const [consultations, setConsultations] = useState<FirestoreConsultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setLoading(true);
    const unsub = subscribeUserConsultations(currentUser.uid, (data) => {
      setConsultations(data);
      setLoading(false);
    });
    return () => unsub();
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-[#EDE8E0] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE8E0] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-display text-sm font-semibold">
              {currentUser.displayName ? currentUser.displayName[0] : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-stone-900">
                  {currentUser.displayName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase">
                  Verified Patient
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                await logoutUser();
                onClose();
              }}
              className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Consultations Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-medium text-stone-900">
                Your Scheduled Consultations
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Saved securely on Lumina Cloud Firestore.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onBookNew();
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Another</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-stone-400">
              Fetching your consultation records from clinical database...
            </div>
          ) : consultations.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center mx-auto text-stone-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-stone-800">
                No active consultations found
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Ready to begin your aesthetic journey? Schedule an individualized 3D facial and skin analysis.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookNew();
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] transition-colors"
                >
                  Book Your First Consultation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-[#8C6D45] uppercase">
                        {c.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          c.status === 'scheduled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-stone-900">
                      {c.treatments.join(', ')}
                    </h4>

                    <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {c.preferredDate} at {c.preferredTime}
                      </span>
                      <span>·</span>
                      <span>Clinician: {c.preferredClinician}</span>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EDE8E0] flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-xs font-semibold text-stone-900">
                      Beverly Hills Flagship
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Booked {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>
              All appointments are synchronized in real-time with our clinical scheduling system.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
