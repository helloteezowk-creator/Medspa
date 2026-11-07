/**
 * Hostinger MySQL Integration Service
 * Connects the Lumina Medical Spa frontend to Hostinger hPanel MySQL via api.php
 */

import { FirestoreConsultation, PatientReview } from './firebaseService';

// Detect whether we have a custom Hostinger API URL or use relative path when hosted on Hostinger
export const getHostingerApiUrl = (): string => {
  // Check local storage override set in Admin Portal
  const customUrl = localStorage.getItem('lumina_hostinger_api_url');
  if (customUrl && customUrl.trim()) {
    return customUrl.trim().replace(/\/+$/, '');
  }

  // If deployed directly on Hostinger, api.php is located in /hostinger/api.php or /api.php
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('run.app')) {
    return `${window.location.origin}/hostinger/api.php`;
  }

  // Fallback to local / preview path
  return '/hostinger/api.php';
};

export const setHostingerApiUrl = (url: string) => {
  localStorage.setItem('lumina_hostinger_api_url', url);
};

export const isHostingerConfigured = (): boolean => {
  const url = localStorage.getItem('lumina_hostinger_api_url');
  return !!(url && url.length > 5);
};

/**
 * 1. Book a Consultation in Hostinger MySQL
 */
export const bookConsultationHostinger = async (data: {
  userId?: string;
  patientName: string;
  phone: string;
  email: string;
  treatments: string[];
  preferredClinician?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  source?: string;
}): Promise<{ success: boolean; id: string; message: string }> => {
  const apiUrl = getHostingerApiUrl();

  const response = await fetch(`${apiUrl}?action=book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to save to Hostinger database' }));
    throw new Error(errorData.error || `Hostinger server error HTTP ${response.status}`);
  }

  return await response.json();
};

/**
 * 2. Fetch all consultations from Hostinger MySQL
 */
export const fetchConsultationsHostinger = async (
  userId?: string
): Promise<FirestoreConsultation[]> => {
  const apiUrl = getHostingerApiUrl();
  const endpoint = userId
    ? `${apiUrl}?action=consultations&userId=${encodeURIComponent(userId)}`
    : `${apiUrl}?action=consultations`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch consultations from Hostinger (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.consultations) return [];

  // Map Hostinger MySQL columns to standard consultation structure
  return data.consultations.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    patientName: row.patient_name,
    phone: row.phone,
    email: row.email,
    treatments: typeof row.treatments === 'string' ? row.treatments.split('; ') : row.treatments,
    preferredClinician: row.preferred_clinician,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    notes: row.notes,
    status: row.status,
    source: row.source,
    estimatedValue: parseFloat(row.estimated_value) || 450,
    createdAt: row.created_at,
  }));
};

/**
 * 3. Submit a Verified Review to Hostinger MySQL
 */
export const submitReviewHostinger = async (review: {
  userId?: string;
  authorName: string;
  authorLocation?: string;
  treatment: string;
  rating: number;
  comment: string;
}): Promise<{ success: boolean; id: string; message: string }> => {
  const apiUrl = getHostingerApiUrl();

  const response = await fetch(`${apiUrl}?action=review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed to submit review to Hostinger' }));
    throw new Error(err.error || `Hostinger server error HTTP ${response.status}`);
  }

  return await response.json();
};

/**
 * 4. Fetch Reviews from Hostinger MySQL
 */
export const fetchReviewsHostinger = async (): Promise<PatientReview[]> => {
  const apiUrl = getHostingerApiUrl();
  const response = await fetch(`${apiUrl}?action=reviews`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews from Hostinger (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.reviews) return [];

  return data.reviews.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name,
    authorLocation: row.author_location,
    treatment: row.treatment,
    rating: Number(row.rating),
    comment: row.comment,
    isVerified: Boolean(row.is_verified),
    status: row.status,
    createdAt: row.created_at,
  }));
};

/**
 * 5. Test Hostinger Connection
 */
export const testHostingerConnection = async (customUrl?: string): Promise<{
  success: boolean;
  message: string;
  version?: string;
}> => {
  const url = customUrl || getHostingerApiUrl();
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      return {
        success: false,
        message: `Connected, but server returned HTTP error ${response.status}. Check your config.php database credentials.`,
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: 'Successfully connected to Hostinger MySQL API!',
      version: data.version || '1.0',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Could not connect to ${url}. Make sure api.php and config.php are uploaded to Hostinger public_html. Details: ${err.message}`,
    };
  }
};
