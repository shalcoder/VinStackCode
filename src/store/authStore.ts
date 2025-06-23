import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface AuthState {
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isInitialized: false,
      setInitialized: (initialized) => set({ isInitialized: initialized }),
    }),
    {
      name: 'vinstack-auth',
    }
  )
);

// Re-export the Supabase auth hook as the main auth interface
export { useSupabaseAuth as useAuth };