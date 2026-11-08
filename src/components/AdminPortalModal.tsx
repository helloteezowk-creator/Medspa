import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  UserCheck,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileText,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  AppointmentRecord,
  AdminUser,
  fetchAppointmentsFromSupabase,
  updateAppointmentStatus,
  checkAdminSlotStatus,
  registerSingleAdminSlot,
  loginAdmin,
  getActiveAdminSession,
  logoutAdmin,
} from '../lib/supabase';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [hasAdminAccount, setHasAdminAccount] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);

  // Dashboard states
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tableSource, setTableSource] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Initial check on modal open
  useEffect(() => {
    if (isOpen) {
      checkAuthAndStatus();
    }
  }, [isOpen]);

  const checkAuthAndStatus = async () => {
    setAuthLoading(true);
    setAuthError('');

    // Check if user already logged in
    const session = getActiveAdminSession();
    if (session) {
      setCurrentUser(session);
      loadAppointments();
      setAuthLoading(false);
      return;
    }

    // Check if slot has been registered
    const status = await checkAdminSlotStatus();
    setHasAdminAccount(status.hasAdmin);
    setAuthLoading(false);
  };

  const loadAppointments = async () => {
    setLoadingData(true);
    try {
      const res = await fetchAppointmentsFromSupabase();
      setAppointments(res.appointments);
      setTableSource(res.tableUsed || 'appointments');
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!fullName.trim()) {
      setAuthError('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthSubmitting(true);
    const res = await registerSingleAdminSlot(fullName, email, password);
    setAuthSubmitting(false);

    if (res.success) {
      const session = getActiveAdminSession();
      setCurrentUser(session);
      setHasAdminAccount(true);
      loadAppointments();
    } else {
      setAuthError(res.error || 'Failed to create admin account.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthSubmitting(true);
    const res = await loginAdmin(email, password);
    setAuthSubmitting(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      loadAppointments();
    } else {
      setAuthError(res.error || 'Invalid credentials.');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
    checkAuthAndStatus();
  };

  const handleStatusChange = async (
    booking: AppointmentRecord,
    newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ) => {
    setUpdatingId(booking.reference_id);
    const targetKey = booking.id || booking.reference_id;
    await updateAppointmentStatus(targetKey, newStatus);

    // Optimistically update local state
    setAppointments((prev) =>
      prev.map((item) =>
        item.reference_id === booking.reference_id ? { ...item, status: newStatus } : item
      )
    );
    setUpdatingId(null);
    setFeedbackMsg(`Updated ${booking.reference_id} to ${newStatus}`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleExportCSV = () => {
    if (appointments.length === 0) return;

    const headers = [
      'Reference ID',
      'Patient Name',
      'Phone',
      'Email',
      'Preferred Date',
      'Time Slot',
      'Practitioner',
      'Services',
      'Status',
      'Created At',
      'Notes',
    ];

    const rows = appointments.map((a) => [
      `"${a.reference_id}"`,
      `"${a.full_name}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.preferred_date}"`,
      `"${a.preferred_time_slot}"`,
      `"${a.practitioner}"`,
      `"${(a.services || []).join(', ')}"`,
      `"${a.status}"`,
      `"${a.created_at}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lumina_appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      app.full_name.toLowerCase().includes(query) ||
      app.reference_id.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.phone.includes(query) ||
      app.services.some((s) => s.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });

  // Calculate metrics
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-[32px] overflow-hidden shadow-2xl border border-[#EDE8E0] flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#EDE8E0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#B09167]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#A6855B] font-bold">
                Clinical Concierge Management
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-2">
                <span>Lumina Admin Portal</span>
                {currentUser && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Live Supabase
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-stone-100 transition-colors mr-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {authLoading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-8 h-8 text-[#C5A880] animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500 font-medium">Verifying administrator credentials...</p>
            </div>
          ) : !currentUser ? (
            /* =========================================================================
               AUTH VIEW: Either Single Slot Registration OR Administrator Login
               ========================================================================= */
            <div className="max-w-md mx-auto py-8">
              {!hasAdminAccount ? (
                /* SINGLE SLOT REGISTRATION */
                <div className="bg-white rounded-[28px] border border-[#EDE8E0] p-6 sm:p-8 shadow-lumina-card text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#B09167] mb-4">
                    <UserCheck className="w-6 h-6" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Single Admin Slot Available</span>
                  </div>

                  <h3 className="font-display text-2xl font-normal text-stone-900 tracking-tight">
                    Initialize Administrator Account
                  </h3>

                  <p className="text-xs text-stone-500 font-light mt-1 mb-6 leading-relaxed">
                    Set up your master administrative credentials. Once created, this registration slot will permanently lock and no other admin accounts can be created.
                  </p>

                  {authError && (
                    <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Sarah Lin"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        placeholder="admin@lumina-medspa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Password (Min 6 Characters)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-3.5 mt-2 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authSubmitting ? (
                        <span>INITIALIZING ACCOUNT...</span>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>CLAIM ADMIN SLOT & SIGN IN</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* ADMIN LOGIN ONLY (REGISTRATION STRICTLY LOCKED) */
                <div className="bg-white rounded-[28px] border border-[#EDE8E0] p-6 sm:p-8 shadow-lumina-card text-left">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 mb-4">
                    <Lock className="w-6 h-6" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                    <Lock className="w-3 h-3 text-stone-500" />
                    <span>Single Admin Slot Claimed</span>
                  </div>

                  <h3 className="font-display text-2xl font-normal text-stone-900 tracking-tight">
                    Administrator Sign In
                  </h3>

                  <p className="text-xs text-stone-500 font-light mt-1 mb-6 leading-relaxed">
                    Sign in to manage patient consultation requests retrieved from your Supabase backend.
                  </p>

                  {authError && (
                    <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        placeholder="admin@lumina-medspa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE8E0] text-xs focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-3.5 mt-2 rounded-full text-xs font-semibold tracking-wider text-white bg-stone-900 hover:bg-stone-800 shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authSubmitting ? (
                        <span>AUTHENTICATING...</span>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>SIGN IN TO ADMIN PORTAL</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               LOGGED IN: DASHBOARD & SUPABASE BOOKINGS VIEWER
               ========================================================================= */
            <div className="space-y-6">
              
              {/* Executive Welcome & Supabase Pipeline Status */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A6855B]">
                    Welcome Back, {currentUser.full_name}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-normal text-stone-900 mt-0.5">
                    Clinical Bookings & Consultation Pipeline
                  </h3>
                  <div className="text-xs text-stone-500 font-light mt-1 flex flex-wrap items-center gap-3">
                    <span>Database: <strong className="text-stone-800 font-medium">Supabase ({tableSource})</strong></span>
                    <span>·</span>
                    <span>Admin: <strong className="text-stone-800 font-medium">{currentUser.email}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={loadAppointments}
                    disabled={loadingData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-stone-800 bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Feedback toast */}
              {feedbackMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0]">
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Total Inquiries
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                    {totalCount}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Recorded in Supabase</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0]">
                  <div className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">
                    Pending Review
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-normal text-amber-900 mt-1">
                    {pendingCount}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Awaiting coordinator</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0]">
                  <div className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold">
                    Confirmed
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-normal text-blue-900 mt-1">
                    {confirmedCount}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Scheduled on calendar</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0]">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                    Completed
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-normal text-emerald-900 mt-1">
                    {completedCount}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Consultation finalized</div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#EDE8E0]">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by patient name, reference ID, phone, email, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                        statusFilter === tab
                          ? 'bg-stone-900 text-white shadow-2xs'
                          : 'bg-[#FAF8F5] text-stone-600 hover:text-stone-900 border border-[#EDE8E0]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of Appointments */}
              <div className="bg-white rounded-2xl border border-[#EDE8E0] overflow-hidden shadow-2xs">
                {loadingData ? (
                  <div className="py-16 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#C5A880] animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-stone-800">Synchronizing with Supabase...</p>
                    <p className="text-xs text-stone-500 font-light">
                      Retrieving real-time patient appointments and consultations
                    </p>
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="py-16 text-center">
                    <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-800">No consultation requests found</p>
                    <p className="text-xs text-stone-500 font-light mt-1">
                      {searchQuery
                        ? 'Try adjusting your search query or status filter.'
                        : 'New appointment submissions on the website will appear here in real-time.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-700">
                      <thead className="bg-[#FAF8F5] border-b border-[#EDE8E0] text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                        <tr>
                          <th className="py-3.5 px-4">Ref & Date</th>
                          <th className="py-3.5 px-4">Patient Information</th>
                          <th className="py-3.5 px-4">Preferred Slot</th>
                          <th className="py-3.5 px-4">Services Requested</th>
                          <th className="py-3.5 px-4">Practitioner</th>
                          <th className="py-3.5 px-4">Status & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDE8E0]">
                        {filteredAppointments.map((booking) => (
                          <tr key={booking.reference_id} className="hover:bg-stone-50/70 transition-colors">
                            {/* Ref & Date */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-semibold text-stone-900 block font-mono">
                                {booking.reference_id}
                              </span>
                              <span className="text-[10px] text-stone-400 block mt-0.5">
                                {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'Recent'}
                              </span>
                            </td>

                            {/* Patient Info */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-stone-900 block text-sm">
                                {booking.full_name}
                              </span>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[11px] text-stone-500 mt-0.5">
                                <a
                                  href={`tel:${booking.phone}`}
                                  className="hover:text-[#B09167] flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-[#C5A880]" />
                                  <span>{booking.phone}</span>
                                </a>
                                <a
                                  href={`mailto:${booking.email}`}
                                  className="hover:text-[#B09167] flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3 text-stone-400" />
                                  <span>{booking.email}</span>
                                </a>
                              </div>
                            </td>

                            {/* Preferred Slot */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 font-medium text-stone-800">
                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                <span>{booking.preferred_date || 'Flexible'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                                <Clock className="w-3 h-3 text-stone-400" />
                                <span>{booking.preferred_time_slot || 'Anytime'}</span>
                              </div>
                            </td>

                            {/* Services */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(booking.services || []).map((s, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-800 font-medium"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Practitioner */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-stone-700">
                              {booking.practitioner || 'Any Specialist'}
                            </td>

                            {/* Status & Actions */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <select
                                  value={booking.status}
                                  disabled={updatingId === booking.reference_id}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      booking,
                                      e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled'
                                    )
                                  }
                                  className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                                    booking.status === 'confirmed'
                                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                                      : booking.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : booking.status === 'cancelled'
                                      ? 'bg-stone-100 text-stone-500 border-stone-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => setSelectedAppointment(booking)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                                  title="View Full Notes & Clinical Details"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Selected Appointment Detail Inspector Modal */}
        {selectedAppointment && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setSelectedAppointment(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#EDE8E0] shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E0]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A6855B]">
                    Consultation Dossier
                  </span>
                  <h4 className="font-display text-xl font-semibold text-stone-900">
                    {selectedAppointment.full_name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Reference ID</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {selectedAppointment.reference_id}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Phone</span>
                  <a href={`tel:${selectedAppointment.phone}`} className="font-semibold text-[#8C6D45] hover:underline">
                    {selectedAppointment.phone}
                  </a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Email</span>
                  <a href={`mailto:${selectedAppointment.email}`} className="font-semibold text-stone-800 hover:underline">
                    {selectedAppointment.email}
                  </a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Preferred Slot</span>
                  <span className="font-medium text-stone-900">
                    {selectedAppointment.preferred_date} at {selectedAppointment.preferred_time_slot}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-500">Preferred Clinician</span>
                  <span className="font-medium text-stone-900">
                    {selectedAppointment.practitioner}
                  </span>
                </div>
                <div className="py-1.5 border-b border-stone-100">
                  <span className="text-stone-500 block mb-1">Requested Treatments</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedAppointment.services || []).map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] font-medium text-stone-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-stone-500 block mb-1">Patient Aesthetic Notes & Goals</span>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] text-stone-700 leading-relaxed font-light">
                    {selectedAppointment.notes || 'No specific notes provided.'}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
