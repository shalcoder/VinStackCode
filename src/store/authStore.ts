import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, Subscription } from '../types';

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'developer',
    email: 'developer@vinstack.com',
    preferredLanguages: ['javascript', 'typescript', 'python'],
    theme: 'dark',
    createdAt: new Date('2024-01-01'),
    subscription: {
      id: 'sub_1',
      userId: '1',
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date('2024-01-01'),
      currentPeriodEnd: new Date('2024-02-01'),
      cancelAtPeriodEnd: false,
    },
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication - in production, this would validate against a real API
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock registration
        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          preferredLanguages: [],
          theme: 'dark',
          createdAt: new Date(),
          subscription: {
            id: `sub_${Date.now()}`,
            userId: Date.now().toString(),
            plan: 'free',
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            cancelAtPeriodEnd: false,
          },
        };
        
        mockUsers.push(newUser);
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      updateSubscription: (subscription: Subscription) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              subscription,
            },
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'vinstack-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);