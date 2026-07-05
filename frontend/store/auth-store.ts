import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'DISTRICT_ADMIN' | 'FACILITY_ADMIN' | 'HEALTHCARE_STAFF' | 'OPERATIONS_STAFF';
  facilityId: string | null;
  status: 'Active' | 'Inactive';
}

interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  token: null,
  loading: true,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, firebaseUser: null, token: null, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Fetch additional user profile from backend database using resolved token
          const response = await api.get('/auth/me');
          const data = response.data?.data;
          if (!data) {
            throw new Error('User profile record not found in backend');
          }
          const userProfile: UserProfile = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            facilityId: data.facility_id || null,
            status: data.status,
          };
          set({
            firebaseUser,
            token,
            user: userProfile,
            loading: false,
            initialized: true,
          });
        } catch (error) {
          console.error('[Auth Store] Profile fetch failed:', error);
          await signOut(auth);
          set({
            firebaseUser: null,
            token: null,
            user: null,
            loading: false,
            initialized: true,
          });
        }
      } else {
        set({
          firebaseUser: null,
          token: null,
          user: null,
          loading: false,
          initialized: true,
        });
      }
    });

    return unsubscribe;
  },
}));
