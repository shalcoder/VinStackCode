import { create } from 'zustand';
import { PaymentState, PricingPlan } from '../types';

// Mock pricing plans - in production, these would come from your backend/Stripe
const mockPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    maxSnippets: 10,
    maxCollaborators: 0,
    features: [
      '10 public snippets',
      'Basic syntax highlighting',
      'Community support',
      'Export to GitHub Gist'
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    maxSnippets: 500,
    maxCollaborators: 5,
    isPopular: true,
    stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      '500 private snippets',
      'Real-time collaboration',
      'Advanced search & filters',
      'Version history',
      'Priority support',
      'Custom themes',
      'API access'
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 29.99,
    interval: 'month',
    maxSnippets: -1, // Unlimited
    maxCollaborators: -1, // Unlimited
    stripePriceId: 'price_team_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited snippets',
      'Unlimited collaborators',
      'Team management',
      'Advanced analytics',
      'SSO integration',
      'Custom branding',
      'Dedicated support',
      'Audit logs'
    ],
  },
];

export const usePaymentStore = create<PaymentState>((set, get) => ({
  plans: mockPlans,
  isLoading: false,

  createCheckoutSession: async (priceId: string) => {
    set({ isLoading: true });
    
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      
      const { sessionId } = await response.json();
      set({ isLoading: false });
      return sessionId;
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to create checkout session');
    }
  },

  createPortalSession: async () => {
    set({ isLoading: true });
    
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const { url } = await response.json();
      set({ isLoading: false });
      return url;
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to create portal session');
    }
  },

  fetchPlans: async () => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({ 
      plans: mockPlans,
      isLoading: false 
    });
  },
}));