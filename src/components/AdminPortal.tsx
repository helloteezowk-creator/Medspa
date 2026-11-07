import React, { useState, useEffect } from 'react';
import {
  Lock,
  Download,
  Users,
  BarChart3,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Cpu,
  Settings,
  LogOut,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Database,
  Server,
  HardDrive,
  Copy,
  Check,
  FileCode,
  RefreshCw
} from 'lucide-react';
import { Lead, getLeads, addLead, updateLeadStatus, deleteLead, exportLeadsToCSV } from '../data/leadsStore';
import { businessConfig } from '../data/businessConfig';
import { subscribeAllConsultations, FirestoreConsultation, updateConsultationStatusInFirestore } from '../services/firebaseService';
import {
  getHostingerApiUrl,
  setHostingerApiUrl,
  testHostingerConnection,
  fetchConsultationsHostinger
} from '../services/hostingerService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'leads' | 'analytics' | 'services' | 'equipment' | 'hostinger' | 'settings'>('leads');
  
  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Manual new lead form modal
  const [showNewLeadModal, setShowNewLeadModal] = useState<boolean>(false);
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    treatment: 'Botox & Injectable Treatments',
    clinician: 'Dr. Elena Vance, MD',
    preferredDate: '2026-11-12',
    preferredTime: '11:00 AM',
    notes: 'Walk-in / Phone Inquiry',
    source: 'Phone / Concierge Intake',
  });

  // Admin settings
  const [adminPass, setAdminPass] = useState<string>('lumina2026');
  const [savedSettingsMsg, setSavedSettingsMsg] = useState<string>('');

  // Hostinger integration state
  const [hostingerUrl, setHostingerUrl] = useState<string>('');
  const [hostingerTestStatus, setHostingerTestStatus] = useState<{ testing: boolean; result?: { success: boolean; message: string } }>({ testing: false });
  const [hostingerSyncStatus, setHostingerSyncStatus] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  useEffect(() => {
    // Initialize hostinger URL
    setHostingerUrl(getHostingerApiUrl());

    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('lumina_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      const local = getLeads();
      setLeads(local);

      // Listen to live Firestore consultations
      const unsub = subscribeAllConsultations((cloudConsultations) => {
        if (cloudConsultations.length > 0) {
          const cloudMapped: Lead[] = cloudConsultations.map((c) => ({
            id: c.id,
            fullName: c.patientName,
            phone: c.phone,
            email: c.email,
            treatments: c.treatments,
            clinician: c.preferredClinician,
            preferredDate: c.preferredDate,
            preferredTime: c.preferredTime,
            notes: c.notes,
            status: c.status === 'cancelled' ? 'archived' : c.status,
            source: c.source || 'Cloud Firestore Database',
            estimatedValue: c.estimatedValue || 450,
            createdAt: c.createdAt,
          }));

          // Merge without duplicates
          const cloudIds = new Set(cloudMapped.map((c) => c.id));
          const merged = [...cloudMapped, ...local.filter((l) => !cloudIds.has(l.id))];
          setLeads(merged);
        }
      });
      return () => unsub();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('lumina_admin_auth', 'true');
      setLeads(getLeads());
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid administrator password. Try default: lumina2026');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lumina_admin_auth');
    setIsAuthenticated(false);
  };

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    const updated = updateLeadStatus(id, newStatus);
    setLeads(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleSaveNotes = (id: string, notes: string) => {
    const updated = updateLeadStatus(id, selectedLead?.status || 'new', notes);
    setLeads(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this patient inquiry record?')) {
      const updated = deleteLead(id);
      setLeads(updated);
      if (selectedLead && selectedLead.id === id) setSelectedLead(null);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.fullName || !newLeadForm.phone) {
      alert('Please provide patient name and phone number.');
      return;
    }
    addLead({
      fullName: newLeadForm.fullName,
      phone: newLeadForm.phone,
      email: newLeadForm.email || 'concierge@lumina-patient.com',
      treatments: [newLeadForm.treatment],
      clinician: newLeadForm.clinician,
      preferredDate: newLeadForm.preferredDate,
      preferredTime: newLeadForm.preferredTime,
      notes: newLeadForm.notes,
      source: newLeadForm.source,
    });
    setLeads(getLeads());
    setShowNewLeadModal(false);
    setNewLeadForm({
      fullName: '',
      phone: '',
      email: '',
      treatment: 'Botox & Injectable Treatments',
      clinician: 'Dr. Elena Vance, MD',
      preferredDate: '2026-11-12',
      preferredTime: '11:00 AM',
      notes: 'Walk-in / Phone Inquiry',
      source: 'Phone / Concierge Intake',
    });
  };

  const handleTestHostinger = async () => {
    setHostingerTestStatus({ testing: true });
    const result = await testHostingerConnection(hostingerUrl);
    setHostingerTestStatus({ testing: false, result });
  };

  const handleSaveHostingerUrl = () => {
    setHostingerApiUrl(hostingerUrl);
    setSavedSettingsMsg('Hostinger API URL saved successfully!');
    setTimeout(() => setSavedSettingsMsg(''), 3000);
  };

  const handleSyncHostinger = async () => {
    setHostingerSyncStatus('Fetching records from Hostinger MySQL...');
    try {
      const records = await fetchConsultationsHostinger();
      if (records.length > 0) {
        const mapped: Lead[] = records.map((c) => ({
          id: c.id,
          fullName: c.patientName,
          phone: c.phone,
          email: c.email,
          treatments: c.treatments,
          clinician: c.preferredClinician,
          preferredDate: c.preferredDate,
          preferredTime: c.preferredTime,
          notes: c.notes,
          status: c.status === 'cancelled' ? 'archived' : c.status,
          source: c.source || 'Hostinger MySQL Database',
          estimatedValue: c.estimatedValue || 450,
          createdAt: c.createdAt,
        }));

        const existingIds = new Set(leads.map((l) => l.id));
        const newOnes = mapped.filter((m) => !existingIds.has(m.id));
        setLeads((prev) => [...mapped, ...prev.filter((p) => !new Set(mapped.map((m) => m.id)).has(p.id))]);
        setHostingerSyncStatus(`Success! Synced ${records.length} records (${newOnes.length} new) from Hostinger.`);
      } else {
        setHostingerSyncStatus('Connected to Hostinger! 0 records currently in database.');
      }
    } catch (err: any) {
      setHostingerSyncStatus(`Sync notice: ${err.message}`);
    }
    setTimeout(() => setHostingerSyncStatus(''), 5000);
  };

  const downloadSchemaSql = () => {
    const sqlContent = `-- LUMINA MEDICAL SPA - HOSTINGER MySQL DATABASE SCHEMA
-- Run this in Hostinger phpMyAdmin (Databases -> phpMyAdmin -> Import)

CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    treatments TEXT NOT NULL,
    preferred_clinician VARCHAR(100) DEFAULT 'First Available Master Clinician',
    preferred_date VARCHAR(30) NOT NULL,
    preferred_time VARCHAR(30) NOT NULL,
    notes TEXT,
    status ENUM('new', 'contacted', 'scheduled', 'completed', 'cancelled') DEFAULT 'new',
    estimated_value DECIMAL(10,2) DEFAULT 450.00,
    source VARCHAR(100) DEFAULT 'Website Booking Form',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    author_name VARCHAR(60) NOT NULL,
    author_location VARCHAR(60) DEFAULT 'Beverly Hills, CA',
    treatment VARCHAR(100) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(500) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    status ENUM('published', 'pending', 'flagged') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    role ENUM('patient', 'admin') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO users (user_id, email, display_name, role)
VALUES ('admin-root', 'helloteezowk@gmail.com', 'Clinic Administrator', 'admin');
`;
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumina_hostinger_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.treatments.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics computations
  const totalLeadsCount = leads.length;
  const scheduledCount = leads.filter((l) => l.status === 'scheduled' || l.status === 'completed').length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((scheduledCount / totalLeadsCount) * 100) : 0;
  const totalPipeline = leads.reduce((acc, curr) => acc + (curr.estimatedValue || 450), 0);
  const avgTicket = totalLeadsCount > 0 ? Math.round(totalPipeline / totalLeadsCount) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* LOGIN MODAL SCREEN */}
      {!isAuthenticated ? (
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 border border-[#EDE8E0] shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#EDE8E0] flex items-center justify-center text-[#B09167] mx-auto mb-5 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-display text-2xl font-medium text-stone-900 tracking-tight">
            Lumina Clinical Portal
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1 mb-6">
            Enter administrator credential to access patient inquiries, analytics & export CSV data.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password (default: lumina2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#EDE8E0] text-sm focus:outline-none focus:border-[#C5A880] bg-[#FAF8F5] text-center tracking-wider"
              />
              {loginError && (
                <p className="text-xs text-red-500 mt-2 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-800 text-left">
              <span className="font-semibold">Demo Access Key:</span> Use password <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">lumina2026</code>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Return to Site
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 rounded-full text-xs font-semibold tracking-wider text-white bg-[#C5A880] hover:bg-[#B09167] transition-all shadow-sm"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN CONSOLE */
        <div className="w-full max-w-7xl h-[94vh] bg-white rounded-[32px] border border-[#EDE8E0] shadow-2xl flex flex-col overflow-hidden">
          
          {/* Top Bar Navigation */}
          <div className="p-4 sm:p-5 border-b border-[#EDE8E0] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-display font-semibold text-lg">
                L
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-medium tracking-wide text-stone-900">
                    LUMINA ADMIN CONSOLE
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Beverly Hills Flagship Practice · HIPAA Secure Data
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => exportLeadsToCSV(leads)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-stone-800 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>DOWNLOAD CSV</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-medium text-stone-700 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar Tabs */}
          <div className="px-6 py-2 border-b border-[#EDE8E0] bg-white flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setCurrentTab('leads')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'leads'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads & Consultations ({leads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'analytics'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Practice Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('services')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'services'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Services Menu ({businessConfig.services.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('equipment')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'equipment'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Equipment Fleet</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('hostinger')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'hostinger'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Hostinger MySQL Database</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Console Settings</span>
            </button>
          </div>

          {/* MAIN TAB CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
            
            {/* TAB 1: LEADS & CONSULTATIONS */}
            {currentTab === 'leads' && (
              <div className="space-y-6">
                
                {/* Search, Filter & Add Lead Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search patient, phone, email, or procedure..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EDE8E0] bg-white text-xs focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#EDE8E0] bg-white text-xs font-medium text-stone-700 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New Inquiries</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowNewLeadModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Intake Lead</span>
                    </button>
                  </div>
                </div>

                {/* Leads Table & Details Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Table (8 cols or full width) */}
                  <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-[#EDE8E0] shadow-sm overflow-hidden`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF8F5] border-b border-[#EDE8E0] text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Patient</th>
                            <th className="py-3 px-4">Treatments</th>
                            <th className="py-3 px-4">Preferred Time</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EDE8E0]">
                          {filteredLeads.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-stone-400">
                                No patient inquiries match your filters.
                              </td>
                            </tr>
                          ) : (
                            filteredLeads.map((lead) => {
                              const isSelected = selectedLead?.id === lead.id;
                              return (
                                <tr
                                  key={lead.id}
                                  onClick={() => setSelectedLead(lead)}
                                  className={`hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors ${
                                    isSelected ? 'bg-[#FAF8F5]' : ''
                                  }`}
                                >
                                  <td className="py-3.5 px-4">
                                    <div className="font-semibold text-stone-900">{lead.fullName}</div>
                                    <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                                      <span>{lead.phone}</span>
                                    </div>
                                  </td>

                                  <td className="py-3.5 px-4 max-w-[200px]">
                                    <div className="truncate font-medium text-stone-800">
                                      {lead.treatments.join(', ')}
                                    </div>
                                    <div className="text-[10px] text-stone-400">
                                      Source: {lead.source}
                                    </div>
                                  </td>

                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <div className="text-stone-900 font-medium">{lead.preferredDate}</div>
                                    <div className="text-[10px] text-stone-500">{lead.preferredTime}</div>
                                  </td>

                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                        lead.status === 'new'
                                          ? 'bg-amber-100 text-amber-800'
                                          : lead.status === 'contacted'
                                          ? 'bg-blue-100 text-blue-800'
                                          : lead.status === 'scheduled'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : lead.status === 'completed'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-stone-100 text-stone-600'
                                      }`}
                                    >
                                      {lead.status}
                                    </span>
                                  </td>

                                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLead(lead);
                                      }}
                                      className="text-xs font-semibold text-[#B09167] hover:underline mr-2"
                                    >
                                      Inspect
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Detail Panel (5 cols) */}
                  {selectedLead && (
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EDE8E0] p-6 shadow-sm space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E0]">
                        <div>
                          <span className="text-[10px] font-mono font-semibold text-stone-400 uppercase">
                            {selectedLead.id}
                          </span>
                          <h3 className="font-display text-xl font-medium text-stone-900">
                            {selectedLead.fullName}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedLead(null)}
                          className="text-stone-400 hover:text-stone-700 text-xs"
                        >
                          Close
                        </button>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0]">
                          <span className="text-stone-500">Phone:</span>
                          <a
                            href={`tel:${selectedLead.phone}`}
                            className="font-semibold text-stone-900 hover:text-[#B09167] flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>{selectedLead.phone}</span>
                          </a>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0]">
                          <span className="text-stone-500">Email:</span>
                          <a
                            href={`mailto:${selectedLead.email}`}
                            className="font-semibold text-stone-900 hover:text-[#B09167] flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>{selectedLead.email}</span>
                          </a>
                        </div>
                      </div>

                      {/* Appointment & Treatment Details */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase tracking-wider mb-1">
                            Requested Treatments
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedLead.treatments.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EDE8E0] font-medium text-stone-800"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0]">
                            <span className="text-[10px] text-stone-400 block uppercase">Requested Slot</span>
                            <span className="font-semibold text-stone-900 mt-0.5 block">
                              {selectedLead.preferredDate} · {selectedLead.preferredTime}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0]">
                            <span className="text-[10px] text-stone-400 block uppercase">Est. Pipeline Value</span>
                            <span className="font-semibold text-emerald-700 mt-0.5 block">
                              ${selectedLead.estimatedValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Update Control */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                          Inquiry Workflow Status:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['new', 'contacted', 'scheduled', 'completed', 'archived'] as Lead['status'][]).map(
                            (st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(selectedLead.id, st)}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold capitalize border transition-all cursor-pointer ${
                                  selectedLead.status === st
                                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                                    : 'bg-white border-[#EDE8E0] text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                {st}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Clinical Intake Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                          Clinical & Patient Notes:
                        </label>
                        <textarea
                          rows={3}
                          defaultValue={selectedLead.notes || ''}
                          onBlur={(e) => handleSaveNotes(selectedLead.id, e.target.value)}
                          className="w-full p-3 rounded-xl border border-[#EDE8E0] text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#C5A880]"
                          placeholder="Record intake details, medical contraindications, or consultation outcomes..."
                        />
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#EDE8E0]">
                        <button
                          type="button"
                          onClick={() => handleDelete(selectedLead.id)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Record</span>
                        </button>

                        <span className="text-[10px] text-stone-400">
                          Created {new Date(selectedLead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* TAB 2: ANALYTICS & REVENUE PIPELINE */}
            {currentTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* 4 KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Total Inquiries
                    </div>
                    <div className="font-display text-4xl font-light text-stone-900 mt-2">
                      {totalLeadsCount}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+24% vs prior 30 days</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Consultation Conversion
                    </div>
                    <div className="font-display text-4xl font-light text-stone-900 mt-2">
                      {conversionRate}%
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {scheduledCount} scheduled of {totalLeadsCount} inquiries
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Projected Pipeline
                    </div>
                    <div className="font-display text-4xl font-light text-stone-900 mt-2">
                      ${totalPipeline.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      Based on base procedure starting value
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Average Ticket Value
                    </div>
                    <div className="font-display text-4xl font-light text-stone-900 mt-2">
                      ${avgTicket}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      Multi-modality protocols
                    </div>
                  </div>
                </div>

                {/* Analytical Charts & Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Lead Sources Distribution */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm">
                    <h3 className="font-display text-lg font-medium text-stone-900 mb-4">
                      Lead Acquisition Channels
                    </h3>
                    <div className="space-y-3.5">
                      {[
                        { source: 'Website Hero & Navigation CTA', pct: 45, count: 19 },
                        { source: 'Machine & Equipment Slider (InfraBaldan)', pct: 28, count: 12 },
                        { source: 'Welcome Privilege Offer (15% Off)', pct: 17, count: 7 },
                        { source: 'Interactive Protocol Calculator', pct: 10, count: 4 },
                      ].map((ch, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-stone-800">{ch.source}</span>
                            <span className="text-stone-500">{ch.count} leads ({ch.pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#C5A880] rounded-full"
                              style={{ width: `${ch.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Requested Treatment Demand */}
                  <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm">
                    <h3 className="font-display text-lg font-medium text-stone-900 mb-4">
                      Procedure Demand Ranking
                    </h3>
                    <div className="space-y-3.5">
                      {[
                        { name: 'InfraBaldan 3.0™ Body Sculpting', demand: 'Very High', color: 'bg-emerald-500' },
                        { name: 'Botox & Precision Neuromodulators', demand: 'High', color: 'bg-[#C5A880]' },
                        { name: 'Hydrafacial Elite Vortex Rejuvenation', demand: 'High', color: 'bg-[#C5A880]' },
                        { name: 'TriLaser Permanent Hair Removal', demand: 'Moderate', color: 'bg-blue-400' },
                        { name: 'Sciton BBL & Halo Fractional Resurfacing', demand: 'Moderate', color: 'bg-blue-400' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF8F5]">
                          <span className="font-medium text-stone-800">{item.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#EDE8E0] text-stone-700">
                            {item.demand}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: SERVICES MENU MANAGER */}
            {currentTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-xl font-medium text-stone-900">
                      Medical Spa Treatment Catalog
                    </h3>
                    <p className="text-xs text-stone-500">
                      Configured across 14 aesthetic modalities with duration and baseline pricing.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessConfig.services.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-5 rounded-2xl bg-white border border-[#EDE8E0] shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A6855B]">
                            {svc.categoryLabel}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            Active
                          </span>
                        </div>

                        <h4 className="font-display text-base font-medium text-stone-900 mb-1">
                          {svc.name}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                          {svc.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#EDE8E0] flex items-center justify-between text-xs">
                        <span className="text-stone-400">Duration: {svc.duration}</span>
                        <span className="font-semibold text-stone-900">${svc.startingPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CLINICAL EQUIPMENT FLEET */}
            {currentTab === 'equipment' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-xl font-medium text-stone-900">
                      Medical Machines & Technology Fleet
                    </h3>
                    <p className="text-xs text-stone-500">
                      Real-time clinical readiness, maintenance schedules & FDA clearance certification.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'InfraBaldan 3.0™',
                      type: 'Infrared Metabolic Slimming Pod',
                      status: 'Active / Operational',
                      lastCalibration: 'November 2, 2026',
                      dailySessions: '6 sessions today',
                      image: '/src/assets/images/machine_infrabaldan_infrared_1794056127227.jpg',
                    },
                    {
                      name: 'TriLaser™ Advanced System',
                      type: 'Triple Wavelength Laser Resurfacing',
                      status: 'Active / Operational',
                      lastCalibration: 'October 28, 2026',
                      dailySessions: '8 sessions today',
                      image: '/src/assets/images/machine_aesthetic_laser_tower_1794056127293.jpg',
                    },
                    {
                      name: 'FibraDFA / Cryo-RF Elite™',
                      type: 'Subdermal Thermal Shock & RF',
                      status: 'Active / Operational',
                      lastCalibration: 'November 4, 2026',
                      dailySessions: '4 sessions today',
                      image: '/src/assets/images/machine_cryo_rf_tower_1794056128491.jpg',
                    },
                  ].map((eq, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="h-44 w-full bg-[#FAF8F5] rounded-xl overflow-hidden p-3 flex items-center justify-center mb-4 border border-[#EDE8E0]">
                          <img
                            src={eq.image}
                            alt={eq.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-[#8C6D45] uppercase">
                            {eq.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            {eq.status}
                          </span>
                        </div>

                        <h4 className="font-display text-lg font-medium text-stone-900 mb-1">
                          {eq.name}
                        </h4>
                      </div>

                      <div className="pt-3 border-t border-[#EDE8E0] space-y-1 text-xs text-stone-500">
                        <div className="flex justify-between">
                          <span>Last Calibration:</span>
                          <span className="font-medium text-stone-800">{eq.lastCalibration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilization:</span>
                          <span className="font-medium text-stone-800">{eq.dailySessions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: HOSTINGER MySQL DATABASE INTEGRATION */}
            {currentTab === 'hostinger' && (
              <div className="space-y-6">
                
                {/* Header Information Banner */}
                <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#B09167] flex items-center justify-center shrink-0">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-medium text-stone-900">
                          Hostinger MySQL Database Integration
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase tracking-wider">
                          Zero Cloud Billing
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                        Use your existing Hostinger hosting account to store all consultations, patient leads, and verified reviews. No Google Cloud Blaze upgrades, credit card subscriptions, or third-party billing required.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={downloadSchemaSql}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C5A880] hover:bg-[#B09167] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download schema.sql</span>
                    </button>
                  </div>
                </div>

                {/* API Endpoint & Live Connection Tester */}
                <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-base font-medium text-stone-900">
                        Hostinger REST API Endpoint
                      </h4>
                      <p className="text-xs text-stone-500">
                        When hosted on Hostinger, this points to your <code className="font-mono bg-[#FAF8F5] px-1 py-0.5 rounded border border-[#EDE8E0]">/hostinger/api.php</code> file.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSyncHostinger}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-800 bg-[#FAF8F5] border border-[#EDE8E0] hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Pull Hostinger Records</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={hostingerUrl}
                        onChange={(e) => setHostingerUrl(e.target.value)}
                        placeholder="https://yourdomain.com/hostinger/api.php (or /hostinger/api.php)"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs font-mono focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveHostingerUrl}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-800 bg-white border border-[#EDE8E0] hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Save URL
                    </button>

                    <button
                      type="button"
                      onClick={handleTestHostinger}
                      disabled={hostingerTestStatus.testing}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {hostingerTestStatus.testing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <Server className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Test Connection</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Status Banner */}
                  {hostingerTestStatus.result && (
                    <div
                      className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                        hostingerTestStatus.result.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {hostingerTestStatus.result.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold">
                          {hostingerTestStatus.result.success ? 'Connection Operational' : 'Connection Notice'}:
                        </span>{' '}
                        <span>{hostingerTestStatus.result.message}</span>
                      </div>
                    </div>
                  )}

                  {hostingerSyncStatus && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 text-blue-600" />
                      <span>{hostingerSyncStatus}</span>
                    </div>
                  )}
                </div>

                {/* 4 Step Setup Guide */}
                <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm space-y-5">
                  <h4 className="font-display text-lg font-medium text-stone-900">
                    How to Set Up Hostinger MySQL in 4 Steps
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white text-xs font-bold flex items-center justify-center">
                          1
                        </span>
                        <h5 className="font-semibold text-stone-900 text-xs">
                          Create MySQL Database in Hostinger
                        </h5>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-8">
                        Log into your Hostinger account at <strong>hpanel.hostinger.com</strong>. Go to <strong>Databases</strong> &rarr; <strong>MySQL Databases</strong>. Enter a database name (e.g., <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">lumina_medspa</code>), username, and strong password, then click <strong>Create</strong>.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white text-xs font-bold flex items-center justify-center">
                          2
                        </span>
                        <h5 className="font-semibold text-stone-900 text-xs">
                          Import Schema in phpMyAdmin
                        </h5>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-8">
                        On the same page, next to your new database, click <strong>Enter phpMyAdmin</strong>. Select your database name on the left sidebar, click the <strong>Import</strong> tab at the top, choose the downloaded <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">schema.sql</code> file, and click <strong>Go</strong>.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white text-xs font-bold flex items-center justify-center">
                          3
                        </span>
                        <h5 className="font-semibold text-stone-900 text-xs">
                          Update Database Credentials
                        </h5>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-8">
                        Open the file <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">hostinger/config.php</code> and paste your Hostinger database details into <code className="font-mono">DB_NAME</code>, <code className="font-mono">DB_USER</code>, and <code className="font-mono">DB_PASS</code>.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE8E0] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white text-xs font-bold flex items-center justify-center">
                          4
                        </span>
                        <h5 className="font-semibold text-stone-900 text-xs">
                          Upload Files to Hostinger public_html
                        </h5>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed pl-8">
                        Run <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">npm run build</code> in your terminal. Open Hostinger <strong>File Manager</strong>, navigate to <strong>public_html</strong>, and upload the build files along with the <code className="font-mono">hostinger/</code> folder. Your site is live!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Database Tables Overview */}
                <div className="p-6 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm space-y-4">
                  <h4 className="font-display text-base font-medium text-stone-900">
                    Hostinger Database Architecture (Created by schema.sql)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]">
                      <div className="font-mono font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                        <FileCode className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>table: consultations</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mb-2">
                        Stores every consultation booking, patient contact info, requested services, date/time, and status.
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Primary Intake Table
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]">
                      <div className="font-mono font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                        <FileCode className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>table: reviews</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mb-2">
                        Stores patient testimonials with anti-spam length enforcement (10–500 chars) and URL blocking.
                      </p>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Anti-Spam Verified
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]">
                      <div className="font-mono font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                        <FileCode className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>table: users</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mb-2">
                        Stores patient and clinic administrator accounts with role-based access control.
                      </p>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Patient & Admin RBAC
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: CONSOLE SETTINGS */}
            {currentTab === 'settings' && (
              <div className="max-w-2xl bg-white rounded-2xl border border-[#EDE8E0] p-8 shadow-sm space-y-6">
                <h3 className="font-display text-xl font-medium text-stone-900">
                  Console Security & Practice Configuration
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Change Administrator Password
                    </label>
                    <input
                      type="text"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Lead Notification Concierge Email
                    </label>
                    <input
                      type="email"
                      defaultValue={businessConfig.email}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Practice Phone (Direct Click-to-Call)
                    </label>
                    <input
                      type="text"
                      defaultValue={businessConfig.phone}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5] text-xs"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#EDE8E0] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSavedSettingsMsg('Settings updated successfully!');
                        setTimeout(() => setSavedSettingsMsg(''), 3000);
                      }}
                      className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Save Configuration
                    </button>
                    {savedSettingsMsg && (
                      <span className="text-xs text-emerald-600 font-medium">
                        {savedSettingsMsg}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* CREATE NEW LEAD MODAL */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-[#EDE8E0] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E0]">
              <h3 className="font-display text-lg font-medium text-stone-900">
                New Patient Consultation Intake
              </h3>
              <button
                type="button"
                onClick={() => setShowNewLeadModal(false)}
                className="text-stone-400 hover:text-stone-800 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Katherine Vance"
                  value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (310) 555-0199"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="patient@domain.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Requested Treatment</label>
                <select
                  value={newLeadForm.treatment}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, treatment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                >
                  {businessConfig.services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (${s.startingPrice})
                    </option>
                  ))}
                  <option value="InfraBaldan 3.0™ Body Sculpting">InfraBaldan 3.0™ Body Sculpting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={newLeadForm.preferredDate}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Time Slot</label>
                  <select
                    value={newLeadForm.preferredTime}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Intake Notes</label>
                <textarea
                  rows={2}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE8E0] bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#B09167] text-white font-semibold"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
