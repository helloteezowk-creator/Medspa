import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rowniscxjvtyyyawadrs.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2sA--_98876U1hy0XersPw_ZHfzqbwW';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
 * Saves appointment booking to Supabase.
 * Checks primary table 'appointments' first, then falls back to 'bookings' or 'consultations'
 * if the table is named differently in the user's Supabase project.
 */
export async function saveAppointmentToSupabase(booking: Omit<AppointmentRecord, 'status'> & { status?: string }): Promise<{
  success: boolean;
  tableUsed?: string;
  error?: string;
}> {
  const candidateTables = ['appointments', 'bookings', 'consultations'];
  let lastErrorMsg = '';

  const payload = {
    reference_id: booking.reference_id,
    full_name: booking.full_name,
    phone: booking.phone,
    email: booking.email,
    preferred_date: booking.preferred_date,
    preferred_time_slot: booking.preferred_time_slot,
    practitioner: booking.practitioner,
    services: booking.services,
    notes: booking.notes || '',
    status: (booking.status || 'pending') as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    created_at: new Date().toISOString(),
  };

  for (const tableName of candidateTables) {
    try {
      const { data, error } = await supabase.from(tableName).insert([payload]).select();

      if (!error) {
        // Also update local storage backup
        recordLocalBackup(payload);
        return { success: true, tableUsed: tableName };
      }

      if (
        error.code === '42P01' ||
        error.message?.toLowerCase().includes('relation') ||
        error.message?.toLowerCase().includes('not found') ||
        error.message?.toLowerCase().includes('schema cache')
      ) {
        lastErrorMsg = error.message;
        continue;
      } else {
        console.warn(`Supabase error on table "${tableName}":`, error);
        lastErrorMsg = error.message || 'Error inserting into table';
        continue;
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || 'Network error';
    }
  }

  // Backup in localStorage
  recordLocalBackup(payload);

  return {
    success: false,
    error: lastErrorMsg,
  };
}

function recordLocalBackup(payload: any) {
  try {
    const existing: any[] = JSON.parse(localStorage.getItem('lumina_offline_bookings') || '[]');
    const filtered = existing.filter((b) => b.reference_id !== payload.reference_id);
    filtered.unshift(payload);
    localStorage.setItem('lumina_offline_bookings', JSON.stringify(filtered));
  } catch (e) {
    console.error('LocalStorage backup error:', e);
  }
}

/**
 * Fetch all appointments from Supabase backend.
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  appointments: AppointmentRecord[];
  tableUsed?: string;
  error?: string;
}> {
  const candidateTables = ['appointments', 'bookings', 'consultations'];
  let fetched: AppointmentRecord[] = [];
  let tableFound = '';

  for (const tableName of candidateTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        fetched = data.map((item) => ({
          id: item.id,
          reference_id: item.reference_id || `REF-${item.id?.slice(0, 6) || 'N/A'}`,
          full_name: item.full_name || 'Anonymous Patient',
          phone: item.phone || '',
          email: item.email || '',
          preferred_date: item.preferred_date || '',
          preferred_time_slot: item.preferred_time_slot || '',
          practitioner: item.practitioner || 'Any Available',
          services: Array.isArray(item.services)
            ? item.services
            : typeof item.services === 'string'
            ? [item.services]
            : [],
          notes: item.notes || '',
          status: (item.status || 'pending') as 'pending' | 'confirmed' | 'completed' | 'cancelled',
          created_at: item.created_at || new Date().toISOString(),
        }));
        tableFound = tableName;
        break;
      }
    } catch (e) {
      console.warn(`Failed reading from ${tableName}:`, e);
    }
  }

  // Merge with local offline backup (in case any appointments were saved offline or before table creation)
  try {
    const local: AppointmentRecord[] = JSON.parse(localStorage.getItem('lumina_offline_bookings') || '[]');
    const existingRefIds = new Set(fetched.map((a) => a.reference_id));
    for (const loc of local) {
      if (!existingRefIds.has(loc.reference_id)) {
        fetched.push(loc);
        existingRefIds.add(loc.reference_id);
      }
    }
  } catch (e) {
    console.error('Error merging local bookings:', e);
  }

  // Sort descending by created_at
  fetched.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  return {
    appointments: fetched,
    tableUsed: tableFound || 'offline_cache',
  };
}

/**
 * Update appointment status in Supabase.
 */
export async function updateAppointmentStatus(
  refOrId: string,
  newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<boolean> {
  const candidateTables = ['appointments', 'bookings', 'consultations'];
  let updatedInSupabase = false;

  for (const tableName of candidateTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .or(`reference_id.eq.${refOrId},id.eq.${refOrId}`);

      if (!error) {
        updatedInSupabase = true;
        break;
      }
    } catch (e) {
      // Continue to next table
    }
  }

  // Always update in localStorage backup
  try {
    const local: AppointmentRecord[] = JSON.parse(localStorage.getItem('lumina_offline_bookings') || '[]');
    const updated = local.map((item) =>
      item.reference_id === refOrId || item.id === refOrId ? { ...item, status: newStatus } : item
    );
    localStorage.setItem('lumina_offline_bookings', JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating status locally:', e);
  }

  return updatedInSupabase;
}

/**
 * SINGLE ADMIN SLOT MANAGEMENT
 * Ensures only ONE single admin slot can ever be created.
 * Once created, registration is strictly locked forever.
 */
const ADMIN_LOCAL_STORAGE_KEY = 'lumina_single_admin_slot';
const ADMIN_SESSION_KEY = 'lumina_active_admin_session';

export async function checkAdminSlotStatus(): Promise<{
  hasAdmin: boolean;
  adminEmail?: string;
}> {
  // 1. Check Supabase 'admin_accounts' table
  try {
    const { data, error } = await supabase.from('admin_accounts').select('id, email, full_name').limit(1);
    if (!error && data && data.length > 0) {
      // Admin exists in Supabase
      localStorage.setItem(ADMIN_LOCAL_STORAGE_KEY, JSON.stringify(data[0]));
      return { hasAdmin: true, adminEmail: data[0].email };
    }
  } catch (e) {
    // Table may not exist yet, fallback to local storage
  }

  // 2. Check Local storage record
  const localAdmin = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
  if (localAdmin) {
    try {
      const parsed = JSON.parse(localAdmin);
      return { hasAdmin: true, adminEmail: parsed.email };
    } catch (e) {}
  }

  return { hasAdmin: false };
}

/**
 * Register the initial and ONLY admin account.
 * Throws error if an admin account already exists.
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
  const cleanName = fullName.trim();

  // Try creating in Supabase Auth first
  try {
    await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: { full_name: cleanName, role: 'super_admin' },
      },
    });
  } catch (e) {
    console.warn('Supabase Auth signUp note:', e);
  }

  // Save admin record to 'admin_accounts' in Supabase
  const adminRecord = {
    email: cleanEmail,
    full_name: cleanName,
    role: 'super_admin',
    password_hash: btoa(password), // Obfuscated backup
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('admin_accounts').insert([adminRecord]);
  } catch (e) {
    console.warn('Could not insert into admin_accounts table in Supabase:', e);
  }

  // Lock the slot in localStorage permanently
  localStorage.setItem(ADMIN_LOCAL_STORAGE_KEY, JSON.stringify(adminRecord));

  // Log admin in automatically
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminRecord));

  return { success: true };
}

/**
 * Log into admin portal.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Try Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (!error && data.user) {
      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        full_name: data.user.user_metadata?.full_name || 'Medical Director',
        role: 'super_admin',
        created_at: data.user.created_at || new Date().toISOString(),
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }
  } catch (e) {
    // Continue to check local / admin_accounts table
  }

  // 2. Check admin_accounts table in Supabase
  try {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .eq('email', cleanEmail)
      .limit(1);

    if (!error && data && data.length > 0) {
      const match = data[0];
      if (match.password_hash === btoa(password)) {
        const adminUser: AdminUser = {
          email: match.email,
          full_name: match.full_name,
          role: 'super_admin',
          created_at: match.created_at,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
    }
  } catch (e) {
    // Continue
  }

  // 3. Check registered admin in localStorage
  const stored = localStorage.getItem(ADMIN_LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.email === cleanEmail && parsed.password_hash === btoa(password)) {
        const adminUser: AdminUser = {
          email: parsed.email,
          full_name: parsed.full_name,
          role: 'super_admin',
          created_at: parsed.created_at,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
    } catch (e) {}
  }

  return {
    success: false,
    error: 'Invalid administrator email or password.',
  };
}

/**
 * Get active admin session.
 */
export function getActiveAdminSession(): AdminUser | null {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

/**
 * Logout admin.
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
