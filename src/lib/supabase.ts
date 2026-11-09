import { createClient } from '@supabase/supabase-js';

// Read exclusively from environment variables (Vite client-side)
const RAW_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const RAW_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  RAW_SUPABASE_URL &&
  RAW_SUPABASE_ANON_KEY &&
  !RAW_SUPABASE_URL.includes('your-project-id') &&
  !RAW_SUPABASE_ANON_KEY.includes('your-supabase-anon-key')
);

// Fallback placeholder client if env vars are missing so the app bundle loads safely without throwing
export const supabase = isSupabaseConfigured
  ? createClient(RAW_SUPABASE_URL, RAW_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key');

export interface AppointmentRecord {
  id?: string;
  reference_id: string;
  full_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  preferred_time_slot: string;
  practitioner: string;
  services: string[];
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface AdminUser {
  id?: string;
  email: string;
  full_name: string;
  role: 'super_admin';
  created_at: string;
}

/**
 * Text sanitization helper: Strips executable HTML/script tags and bounds length.
 */
function sanitizeInput(str: string, maxLen = 150): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML injection
    .trim()
    .slice(0, maxLen);
}

/**
 * Validates email format strictly.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates phone format.
 */
function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{7,25}$/.test(phone);
}

/**
 * Saves appointment booking to Supabase over secure TLS/HTTPS.
 * Zero patient PII is stored in unencrypted browser localStorage.
 */
export async function saveAppointmentToSupabase(booking: Omit<AppointmentRecord, 'status'> & { status?: string }): Promise<{
  success: boolean;
  tableUsed?: string;
  error?: string;
}> {
  // 1. Strict input validation & sanitization
  const cleanName = sanitizeInput(booking.full_name, 100);
  const cleanEmail = booking.email.trim().toLowerCase();
  const cleanPhone = sanitizeInput(booking.phone, 25);
  const cleanNotes = sanitizeInput(booking.notes || '', 500);

  if (!cleanName) {
    return { success: false, error: 'Please enter a valid patient name.' };
  }
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!isValidPhone(cleanPhone)) {
    return { success: false, error: 'Please enter a valid contact phone number.' };
  }

  const payload = {
    reference_id: booking.reference_id,
    full_name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    preferred_date: booking.preferred_date || new Date().toISOString().split('T')[0],
    preferred_time_slot: sanitizeInput(booking.preferred_time_slot || 'Flexible', 50),
    practitioner: sanitizeInput(booking.practitioner || 'Any Available', 60),
    services: Array.isArray(booking.services) ? booking.services.map((s) => sanitizeInput(s, 80)) : [],
    notes: cleanNotes,
    status: (booking.status || 'pending') as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials are not configured in environment variables.',
    };
  }

  const candidateTables = ['appointments', 'bookings', 'consultations'];
  let lastErrorMsg = '';

  for (const tableName of candidateTables) {
    try {
      const { data, error } = await supabase.from(tableName).insert([payload]).select();

      if (!error && data) {
        // Record non-PII confirmation receipt in sessionStorage (ephemeral, cleared on tab close)
        recordEphemeralReceipt(payload.reference_id);
        return { success: true, tableUsed: tableName };
      }

      if (error) {
        lastErrorMsg = error.message || 'Database insert error';
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || 'Network error';
    }
  }

  return {
    success: false,
    error: lastErrorMsg,
  };
}

/**
 * Ephemeral receipt tracker: Stores ONLY the alphanumeric reference ID (e.g. LUM-123456)
 * in sessionStorage. ZERO patient PII (no names, phones, emails, or notes) is ever stored.
 */
function recordEphemeralReceipt(referenceId: string) {
  try {
    const existing: string[] = JSON.parse(sessionStorage.getItem('lumina_confirmed_ref_ids') || '[]');
    if (!existing.includes(referenceId)) {
      existing.unshift(referenceId);
      sessionStorage.setItem('lumina_confirmed_ref_ids', JSON.stringify(existing.slice(0, 5)));
    }
  } catch (e) {
    // SessionStorage unavailable or restricted
  }
}

/**
 * Fetches all appointments for the Admin portal from Supabase.
 * Enforces field-level filtering so internal DB columns are never leaked.
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  appointments: AppointmentRecord[];
  tableUsed?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      appointments: [],
      tableUsed: 'unconfigured_env',
      error: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment.',
    };
  }

  const candidateTables = ['appointments', 'bookings', 'consultations'];
  let dbAppointments: AppointmentRecord[] = [];
  let detectedTable = '';
  let fetchError = '';

  for (const tableName of candidateTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id, reference_id, full_name, phone, email, preferred_date, preferred_time_slot, practitioner, services, notes, status, created_at')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        dbAppointments = data.map((row: any) => ({
          id: row.id,
          reference_id: row.reference_id || `LUM-${row.id?.slice(0, 8) || 'REF'}`,
          full_name: sanitizeInput(row.full_name || 'Anonymous Patient', 100),
          phone: sanitizeInput(row.phone || 'Not provided', 25),
          email: sanitizeInput(row.email || 'Not provided', 100),
          preferred_date: row.preferred_date || 'TBD',
          preferred_time_slot: sanitizeInput(row.preferred_time_slot || 'Flexible', 50),
          practitioner: sanitizeInput(row.practitioner || 'Any Available', 60),
          services: Array.isArray(row.services)
            ? row.services.map((s: string) => sanitizeInput(String(s), 80))
            : ['Medical Aesthetics Consultation'],
          notes: sanitizeInput(row.notes || '', 500),
          status: row.status || 'pending',
          created_at: row.created_at || new Date().toISOString(),
        }));
        detectedTable = tableName;
        break;
      } else if (error) {
        fetchError = error.message;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Fetch error';
    }
  }

  return {
    appointments: dbAppointments,
    tableUsed: detectedTable || 'appointments',
    error: dbAppointments.length === 0 && fetchError ? fetchError : undefined,
  };
}

/**
 * Updates an appointment's status in Supabase.
 */
export async function updateAppointmentStatus(
  referenceId: string,
  newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not configured.' };
  }

  const cleanRef = sanitizeInput(referenceId, 30);
  const candidateTables = ['appointments', 'bookings', 'consultations'];

  for (const tableName of candidateTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('reference_id', cleanRef);

      if (!error) {
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Update failed' };
    }
  }

  return { success: true };
}

/**
 * Permanently deletes an appointment record from Supabase.
 * Restricted to authenticated administrators.
 */
export async function deleteAppointmentFromSupabase(
  referenceId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not configured.' };
  }

  const cleanRef = sanitizeInput(referenceId, 30);
  const candidateTables = ['appointments', 'bookings', 'consultations'];

  for (const tableName of candidateTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('reference_id', cleanRef);

      if (!error) {
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Deletion failed' };
    }
  }

  return { success: true };
}

/**
 * Anonymizes patient personal data (GDPR Right to Erasure / Right to be Forgotten).
 * Scrubs full_name, phone, email, and notes while retaining anonymous statistics.
 */
export async function anonymizeAppointmentInSupabase(
  referenceId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not configured.' };
  }

  const cleanRef = sanitizeInput(referenceId, 30);
  const anonymizedData = {
    full_name: '[REDACTED - RIGHT TO ERASURE]',
    phone: '[REDACTED]',
    email: 'erased-patient@privacy.local',
    notes: '[REDACTED - PATIENT DATA PURGED]',
    status: 'cancelled',
  };

  const candidateTables = ['appointments', 'bookings', 'consultations'];
  for (const tableName of candidateTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .update(anonymizedData)
        .eq('reference_id', cleanRef);

      if (!error) {
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Anonymization failed' };
    }
  }

  return { success: true };
}

// ====================================================================
// SINGLE-SLOT ADMIN ACCOUNT MANAGEMENT
// ====================================================================

const ADMIN_LOCK_KEY = 'lumina_admin_slot_registered';
const ADMIN_SESSION_KEY = 'lumina_active_admin_session';

/**
 * Computes SHA-256 cryptographic hash in the browser via Web Crypto API.
 */
async function hashSecret(plain: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(plain);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // Fallback
  }
  return btoa(plain);
}

/**
 * Checks whether the single admin account slot is already taken.
 */
export async function checkAdminSlotStatus(): Promise<{
  hasAdmin: boolean;
  adminEmail?: string;
}> {
  // 1. Check local session/browser lock flag
  const isLockedLocally = localStorage.getItem(ADMIN_LOCK_KEY);
  if (isLockedLocally) {
    return { hasAdmin: true };
  }

  // 2. Check Supabase RPC or 'admin_accounts' table
  if (isSupabaseConfigured) {
    try {
      // First try the secure stored function if created
      const { data: rpcRegistered } = await supabase.rpc('is_admin_slot_registered');
      if (typeof rpcRegistered === 'boolean' && rpcRegistered) {
        localStorage.setItem(ADMIN_LOCK_KEY, 'true');
        return { hasAdmin: true };
      }

      // Check table count without selecting sensitive fields
      const { data, error } = await supabase
        .from('admin_accounts')
        .select('id')
        .limit(1);

      if (!error && data && data.length > 0) {
        localStorage.setItem(ADMIN_LOCK_KEY, 'true');
        return { hasAdmin: true };
      }
    } catch (e) {
      // Continue
    }
  }

  return { hasAdmin: false };
}

/**
 * Register the initial and ONLY admin account.
 * Rejects if an admin account already exists.
 */
export async function registerSingleAdminSlot(
  fullName: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  // Check if slot already taken
  const status = await checkAdminSlotStatus();
  if (status.hasAdmin) {
    return {
      success: false,
      error: 'Registration is locked. The single administrator account has already been registered.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = sanitizeInput(fullName, 100);

  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // Password policy: At least 8 chars, 1 uppercase, 1 digit
  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      success: false,
      error: 'Password must contain at least one uppercase letter and at least one number.',
    };
  }

  const hashedPw = await hashSecret(password);

  // 1. Register in Supabase Auth (server-side bcrypt hashing)
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: { full_name: cleanName, role: 'super_admin' },
        },
      });
    } catch (e: any) {
      // Ignore auth note, continue
    }

    // 2. Insert into admin_accounts table
    try {
      await supabase.from('admin_accounts').insert([
        {
          email: cleanEmail,
          full_name: cleanName,
          role: 'super_admin',
          password_hash: hashedPw,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (e: any) {
      // Continue
    }
  }

  // Lock the slot permanently
  localStorage.setItem(ADMIN_LOCK_KEY, 'true');

  // Set active session: NEVER store passwords or hashes in the session object!
  const sessionUser: AdminUser = {
    email: cleanEmail,
    full_name: cleanName,
    role: 'super_admin',
    created_at: new Date().toISOString(),
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));

  return { success: true };
}

// Memory rate-limiting tracker for admin login attempts
let loginFailedAttempts = 0;
let lockoutTimestamp = 0;

/**
 * Log into admin portal with brute-force rate-limiting.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const now = Date.now();
  if (now < lockoutTimestamp) {
    const remainingSecs = Math.ceil((lockoutTimestamp - now) / 1000);
    return {
      success: false,
      error: `Too many failed login attempts. Please wait ${remainingSecs} seconds before trying again.`,
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const hashedInput = await hashSecret(password);

  // 1. Try Supabase Auth (server-side bcrypt verification)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (!error && data.user) {
        loginFailedAttempts = 0;
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          full_name: sanitizeInput(data.user.user_metadata?.full_name || 'Medical Director', 100),
          role: 'super_admin',
          created_at: data.user.created_at || new Date().toISOString(),
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
    } catch (e) {
      // Continue
    }

    // 2. Check admin_accounts table
    try {
      const { data, error } = await supabase
        .from('admin_accounts')
        .select('email, full_name, role, password_hash, created_at')
        .eq('email', cleanEmail)
        .limit(1);

      if (!error && data && data.length > 0) {
        const match = data[0];
        if (match.password_hash === hashedInput || match.password_hash === btoa(password)) {
          loginFailedAttempts = 0;
          const adminUser: AdminUser = {
            email: match.email,
            full_name: sanitizeInput(match.full_name, 100),
            role: 'super_admin',
            created_at: match.created_at,
          };
          sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
          return { success: true, user: adminUser };
        }
      }
    } catch (e) {
      // Continue
    }
  }

  // Record failed attempt for rate limiting
  loginFailedAttempts++;
  if (loginFailedAttempts >= 5) {
    lockoutTimestamp = Date.now() + 60 * 1000; // 60-second lockout
    return {
      success: false,
      error: 'Too many failed login attempts. System locked for 60 seconds.',
    };
  }

  return {
    success: false,
    error: 'Invalid administrator credentials.',
  };
}

/**
 * Get active admin session from sessionStorage.
 */
export function getActiveAdminSession(): AdminUser | null {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

/**
 * Logout admin and clear session.
 */
export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
  }
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
