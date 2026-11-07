export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  treatments: string[];
  clinician: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'archived';
  source: string;
  estimatedValue: number;
  createdAt: string;
}

const STORAGE_KEY = 'lumina_medspa_leads';

const INITIAL_LEADS: Lead[] = [
  {
    id: 'LUM-849201',
    fullName: 'Sophia Martinez',
    phone: '+1 (310) 555-8921',
    email: 'sophia.m@example.com',
    treatments: ['Botox & Injectable Treatments', 'Hydrafacial Treatments'],
    clinician: 'Dr. Elena Vance, MD',
    preferredDate: '2026-11-12',
    preferredTime: '11:00 AM',
    notes: 'Interested in preventive forehead wrinkle smoothing and pre-event facial glow.',
    status: 'scheduled',
    source: 'Website Hero Form',
    estimatedValue: 575,
    createdAt: '2026-11-06T14:32:00Z',
  },
  {
    id: 'LUM-721940',
    fullName: 'Alexander Wright',
    phone: '+1 (424) 555-3184',
    email: 'alex.wright@corporate.io',
    treatments: ['InfraBaldan 3.0™ Body Sculpting', 'Skin Tightening'],
    clinician: 'Marcus Sterling, CLT',
    preferredDate: '2026-11-14',
    preferredTime: '03:00 PM',
    notes: 'Looking to target stubborn lower abdomen fat before holiday travel.',
    status: 'new',
    source: 'Equipment Carousel',
    estimatedValue: 1250,
    createdAt: '2026-11-07T03:15:00Z',
  },
  {
    id: 'LUM-603185',
    fullName: 'Claire Dupont',
    phone: '+1 (310) 555-9012',
    email: 'claire.dupont@artgallery.com',
    treatments: ['Skin Rejuvenation & Resurfacing (BBL/Halo)'],
    clinician: 'Sarah Lin, BSN, RN',
    preferredDate: '2026-11-16',
    preferredTime: '01:30 PM',
    notes: 'Sun spot pigmentation on cheeks and décolleté from outdoor tennis.',
    status: 'contacted',
    source: 'Treatment Calculator',
    estimatedValue: 650,
    createdAt: '2026-11-05T18:45:00Z',
  },
  {
    id: 'LUM-512093',
    fullName: 'Jessica Miller',
    phone: '+1 (818) 555-4429',
    email: 'jess.miller@creative.co',
    treatments: ['Dermal Fillers', 'Chemical Peels'],
    clinician: 'First Available Master Clinician',
    preferredDate: '2026-11-18',
    preferredTime: '04:30 PM',
    notes: 'Interested in subtle lip contouring and brightening dull skin texture.',
    status: 'scheduled',
    source: 'Welcome Offer (15% Off)',
    estimatedValue: 845,
    createdAt: '2026-11-04T10:20:00Z',
  },
  {
    id: 'LUM-439124',
    fullName: 'David Thorne',
    phone: '+1 (310) 555-7811',
    email: 'dthorne@beverlyhills.net',
    treatments: ['TriLaser Permanent Hair Removal'],
    clinician: 'Marcus Sterling, CLT',
    preferredDate: '2026-11-19',
    preferredTime: '09:30 AM',
    notes: 'Neck and shoulder laser hair reduction series consultation.',
    status: 'completed',
    source: 'Website Header',
    estimatedValue: 900,
    createdAt: '2026-11-02T16:10:00Z',
  },
  {
    id: 'LUM-381029',
    fullName: 'Camilla Rossi',
    phone: '+1 (310) 555-6673',
    email: 'crossi@luxurypr.com',
    treatments: ['Microneedling (Collagen Induction)', 'Hydrafacial Treatments'],
    clinician: 'Dr. Elena Vance, MD',
    preferredDate: '2026-11-20',
    preferredTime: '06:00 PM',
    notes: 'Acne scarring refinement and deep moisture barrier repair.',
    status: 'new',
    source: 'Treatment Details Modal',
    estimatedValue: 600,
    createdAt: '2026-11-07T04:50:00Z',
  },
];

export const getLeads = (): Lead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading leads from storage', e);
    return INITIAL_LEADS;
  }
};

export const saveLeads = (leads: Lead[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving leads to storage', e);
  }
};

export const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'status' | 'estimatedValue'>): Lead => {
  const currentLeads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: 'LUM-' + Math.floor(100000 + Math.random() * 900000),
    status: 'new',
    estimatedValue: Math.max(350, lead.treatments.length * 350),
    createdAt: new Date().toISOString(),
  };

  const updated = [newLead, ...currentLeads];
  saveLeads(updated);
  return newLead;
};

export const updateLeadStatus = (id: string, status: Lead['status'], notes?: string): Lead[] => {
  const currentLeads = getLeads();
  const updated = currentLeads.map((l) => {
    if (l.id === id) {
      return {
        ...l,
        status,
        notes: notes !== undefined ? notes : l.notes,
      };
    }
    return l;
  });
  saveLeads(updated);
  return updated;
};

export const deleteLead = (id: string): Lead[] => {
  const currentLeads = getLeads();
  const updated = currentLeads.filter((l) => l.id !== id);
  saveLeads(updated);
  return updated;
};

export const exportLeadsToCSV = (leads: Lead[]): void => {
  const headers = [
    'Lead ID',
    'Full Name',
    'Phone',
    'Email',
    'Treatments Requested',
    'Preferred Clinician',
    'Preferred Date',
    'Preferred Time',
    'Status',
    'Estimated Pipeline ($)',
    'Lead Source',
    'Clinical Notes',
    'Date Submitted',
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.fullName.replace(/"/g, '""')}"`,
    `"${l.phone}"`,
    `"${l.email}"`,
    `"${l.treatments.join('; ').replace(/"/g, '""')}"`,
    `"${l.clinician}"`,
    `"${l.preferredDate}"`,
    `"${l.preferredTime}"`,
    `"${l.status.toUpperCase()}"`,
    `"${l.estimatedValue}"`,
    `"${l.source}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
    `"${new Date(l.createdAt).toLocaleString()}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `lumina_medspa_leads_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
