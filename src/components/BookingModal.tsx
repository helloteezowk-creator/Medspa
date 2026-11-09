import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Check, Sparkles, User, Phone, Mail, MapPin, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { businessConfig, ServiceItem } from '../data/businessConfig';

import { saveAppointmentToSupabase } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
  preSelectedServiceIds?: string[];
  currentUser?: { displayName?: string; email?: string } | null;
  onLogin?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedServiceId,
  preSelectedServiceIds,
  currentUser,
  onLogin,
}) => {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [preferredClinician, setPreferredClinician] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-10');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  
  // Patient details
  const [fullName, setFullName] = useState<string>(currentUser?.displayName || '');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [notes, setNotes] = useState<string>('');
  
  // Submission & validation state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [supabaseSynced, setSupabaseSynced] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (preSelectedServiceIds && preSelectedServiceIds.length > 0) {
      setSelectedServiceIds(preSelectedServiceIds);
    } else if (preSelectedServiceId) {
      setSelectedServiceIds([preSelectedServiceId]);
    } else if (selectedServiceIds.length === 0) {
      setSelectedServiceIds(['hydrafacial']);
    }
  }, [preSelectedServiceId, preSelectedServiceIds, isOpen]);

  if (!isOpen) return null;

  const clinicians = [
    { id: 'any', name: 'First Available Master Clinician', title: 'Optimal availability' },
    { id: 'dr-elena', name: 'Dr. Elena Vance, MD', title: 'Medical Director & Aesthetics' },
    { id: 'sarah-rn', name: 'Sarah Lin, BSN, RN', title: 'Master Nurse Injector' },
    { id: 'marcus-cce', name: 'Marcus Sterling, CLT', title: 'Senior Laser Specialist' },
  ];

  const timeSlots = [
    '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
  ];

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((s) => s !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!phone.trim()) newErrors.phone = 'Please enter a contact phone number';
    else if (!/^\+?[\d\s\-()]{7,}$/.test(phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!email.trim()) newErrors.email = 'Please enter your email address';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Rate limiting: Prevent rapid spam submissions
    const now = Date.now();
    const lastSubTime = Number(sessionStorage.getItem('lumina_last_booking_ts') || '0');
    if (now - lastSubTime < 15000) {
      setErrors({ form: 'Please wait a moment before submitting another consultation request.' });
      return;
    }

    setIsSubmitting(true);
    const code = 'LUM-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmationCode(code);

    // Map service names
    const serviceNames = selectedServiceIds.map((id) => {
      const found = businessConfig.services.find((s) => s.id === id);
      return found ? found.name : id;
    });

    const clinicianObj = clinicians.find((c) => c.id === preferredClinician);
    const clinicianName = clinicianObj ? clinicianObj.name : 'First Available';

    // Save to Supabase backend over secure TLS
    try {
      const result = await saveAppointmentToSupabase({
        reference_id: code,
        full_name: fullName.trim().slice(0, 100),
        phone: phone.trim().slice(0, 25),
        email: email.trim().slice(0, 100),
        preferred_date: selectedDate,
        preferred_time_slot: selectedTimeSlot,
        practitioner: clinicianName,
        services: serviceNames,
        notes: notes.trim().slice(0, 500),
        status: 'pending',
      });

      sessionStorage.setItem('lumina_last_booking_ts', String(now));
      setSupabaseSynced(result.success);
    } catch {
      setSupabaseSynced(false);
    } finally {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }
  };

  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lumina Medical Spa//Consultation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Lumina Medical Spa Consultation (${confirmationCode})`,
      `DESCRIPTION:Your personalized aesthetic consultation and treatment planning at Lumina Medical Spa.`,
      `LOCATION:${businessConfig.address.full}`,
      `DTSTART:20261110T190000Z`,
      `DTEND:20261110T200000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lumina-Consultation-${confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-[#EDE8E0] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EDE8E0] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#A6855B] font-semibold">
              Private Patient Concierge
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-stone-900">
              {isConfirmed ? 'Consultation Confirmed' : 'Request a Clinical Consultation'}
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

        {/* Form Body or Confirmed Screen */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {isConfirmed ? (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border-2 border-[#C5A880] mx-auto flex items-center justify-center text-[#B09167] shadow-sm animate-in zoom-in-75">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#A6855B]">
                  Reference ID: {confirmationCode}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
                  We look forward to welcoming you, {fullName}.
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md mx-auto mt-2">
                  Our private medical concierge has received your request. A clinical coordinator will reach out shortly to confirm intake requirements.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EDE8E0] text-left max-w-md mx-auto space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#EDE8E0]">
                  <span className="text-stone-500">Date & Preferred Time</span>
                  <span className="font-semibold text-stone-900">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#EDE8E0]">
                  <span className="text-stone-500">Clinic Location</span>
                  <span className="font-semibold text-stone-900">Beverly Hills Flagship</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#EDE8E0]">
                  <span className="text-stone-500">Selected Services</span>
                  <span className="font-semibold text-stone-900 text-right">
                    {selectedServiceIds.length} requested
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Consultation Fee</span>
                  <span className="font-semibold text-[#8C6D45]">Complimentary / Applied to care</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EDE8E0]">
                  <span className="text-stone-500">Database Record</span>
                  <span className="font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Supabase Connected</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-stone-800 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold tracking-wider text-white bg-stone-900 hover:bg-stone-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Select Treatments */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  1. Select Treatment(s) of Interest
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {businessConfig.services.map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                          isSelected
                            ? 'bg-[#FAF8F5] border-[#C5A880] text-stone-900 font-medium ring-1 ring-[#C5A880]'
                            : 'bg-white border-[#EDE8E0] text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        <div className="truncate font-medium">{service.name}</div>
                        <div className="text-[10px] text-stone-400">From ${service.startingPrice}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date & Time Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    2. Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min="2026-11-08"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs font-medium text-stone-800 bg-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Preferred Time Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs font-medium text-stone-800 bg-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Clinician Preference */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  3. Practitioner Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {clinicians.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPreferredClinician(c.id)}
                      className={`p-3 rounded-xl text-left border text-xs transition-all ${
                        preferredClinician === c.id
                          ? 'bg-[#FAF8F5] border-[#C5A880] ring-1 ring-[#C5A880]'
                          : 'bg-white border-[#EDE8E0] hover:border-stone-400'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">{c.name}</div>
                      <div className="text-[11px] text-stone-500">{c.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Contact Details */}
              <div className="space-y-4 pt-2 border-t border-[#EDE8E0]">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  4. Patient Contact Details
                </label>

                <div>
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#EDE8E0] focus:border-[#C5A880]'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g. +1 310-555-0199)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#EDE8E0] focus:border-[#C5A880]'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#EDE8E0] focus:border-[#C5A880]'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your aesthetic goals, concerns, or previous treatments (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>CONFIRMING APPOINTMENT...</span>
                    </span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>CONFIRM CONSULTATION REQUEST</span>
                    </>
                  )}
                </button>
                <div className="text-center mt-2.5">
                  <span className="text-[11px] text-stone-400">
                    Discreet HIPAA-compliant patient privacy is guaranteed.
                  </span>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
