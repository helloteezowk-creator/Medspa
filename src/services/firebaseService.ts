import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { Lead } from '../data/leadsStore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'patient' | 'admin';
  createdAt: string;
}

export interface FirestoreConsultation {
  id: string;
  userId: string;
  patientName: string;
  phone: string;
  email: string;
  treatments: string[];
  preferredClinician: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  source: string;
  estimatedValue: number;
  createdAt: string;
}

export interface PatientReview {
  id: string;
  userId: string;
  authorName: string;
  authorLocation: string;
  treatment: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  status: 'published' | 'pending' | 'flagged';
  createdAt: string;
}

// Check if user is admin
export const checkIsAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return email.toLowerCase() === 'helloteezowk@gmail.com';
};

// 1. Google Authentication
export const loginWithGoogle = async (): Promise<UserProfile> => {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;
    const role: 'patient' | 'admin' = checkIsAdmin(user.email) ? 'admin' : 'patient';

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Valued Patient',
      photoURL: user.photoURL || undefined,
      role,
      createdAt: new Date().toISOString(),
    };

    // Save or update user doc
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, profile, { merge: true });
    } catch (e) {
      console.warn('User profile sync error', e);
    }

    return profile;
  } catch (error) {
    console.error('Google Sign-in failed', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeAuth = (callback: (user: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }

    const role: 'patient' | 'admin' = checkIsAdmin(fbUser.email) ? 'admin' : 'patient';
    const profile: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: fbUser.displayName || 'Valued Patient',
      photoURL: fbUser.photoURL || undefined,
      role,
      createdAt: new Date().toISOString(),
    };

    callback(profile);
  });
};

// 2. Consultations Management (Firestore)
export const saveConsultationToFirestore = async (
  data: Omit<FirestoreConsultation, 'id' | 'userId' | 'createdAt' | 'status' | 'estimatedValue'>
): Promise<FirestoreConsultation> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required: Please sign in before booking a consultation.');
  }

  const id = 'LUM-' + Math.floor(100000 + Math.random() * 900000);
  const consultation: FirestoreConsultation = {
    ...data,
    id,
    userId: user.uid,
    status: 'new',
    estimatedValue: Math.max(350, data.treatments.length * 350),
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'consultations', id);
    await setDoc(docRef, consultation);
    return consultation;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `consultations/${id}`);
    throw error;
  }
};

export const subscribeUserConsultations = (
  userId: string,
  callback: (consultations: FirestoreConsultation[]) => void
) => {
  const q = query(collection(db, 'consultations'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: FirestoreConsultation[] = [];
      snapshot.forEach((doc) => items.push(doc.data() as FirestoreConsultation));
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'consultations');
    }
  );
};

export const subscribeAllConsultations = (
  callback: (consultations: FirestoreConsultation[]) => void
) => {
  return onSnapshot(
    collection(db, 'consultations'),
    (snapshot) => {
      const items: FirestoreConsultation[] = [];
      snapshot.forEach((doc) => items.push(doc.data() as FirestoreConsultation));
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(items);
    },
    (error) => {
      console.warn('Firestore real-time listener error, fallback to local leads', error);
    }
  );
};

export const updateConsultationStatusInFirestore = async (
  id: string,
  status: FirestoreConsultation['status'],
  notes?: string
) => {
  try {
    const docRef = doc(db, 'consultations', id);
    await updateDoc(docRef, {
      status,
      ...(notes !== undefined ? { notes } : {}),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `consultations/${id}`);
  }
};

// 3. Reviews & Anti-Spam Verification
export const submitPatientReview = async (review: {
  treatment: string;
  rating: number;
  comment: string;
  authorLocation?: string;
}): Promise<PatientReview> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in to share a verified patient review.');
  }

  // Anti-spam validation
  const cleanComment = review.comment.trim();
  if (cleanComment.length < 10) {
    throw new Error('Please provide at least 10 characters detailing your clinical experience.');
  }
  if (cleanComment.length > 500) {
    throw new Error('Review comment cannot exceed 500 characters.');
  }
  if (review.rating < 1 || review.rating > 5) {
    throw new Error('Rating must be between 1 and 5 stars.');
  }

  // Detect spam links
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
  if (urlPattern.test(cleanComment)) {
    throw new Error('Reviews cannot contain external links or promotional URLs.');
  }

  const id = 'REV-' + Math.floor(100000 + Math.random() * 900000);
  const newReview: PatientReview = {
    id,
    userId: user.uid,
    authorName: user.displayName || 'Verified Patient',
    authorLocation: review.authorLocation || 'Beverly Hills, CA',
    treatment: review.treatment,
    rating: review.rating,
    comment: cleanComment,
    isVerified: true,
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'reviews', id);
    await setDoc(docRef, newReview);
    return newReview;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `reviews/${id}`);
    throw error;
  }
};

export const subscribePublishedReviews = (
  callback: (reviews: PatientReview[]) => void
) => {
  const q = query(collection(db, 'reviews'), where('status', '==', 'published'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: PatientReview[] = [];
      snapshot.forEach((doc) => items.push(doc.data() as PatientReview));
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(items);
    },
    (error) => {
      console.warn('Reviews listener notice (falling back to initial verified reviews):', error);
    }
  );
};
