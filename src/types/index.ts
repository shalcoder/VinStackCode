export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  preferredLanguages: string[];
  theme: 'dark' | 'light';
  createdAt: Date;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxSnippets: number;
  maxCollaborators: number;
  isPopular?: boolean;
  stripePriceId?: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  content: string;
  language: string;
  tags: string[];
  visibility: 'public' | 'private';
  ownerId: string;
  owner: User;
  collaborators: User[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
}

export interface CodeLanguage {
  id: string;
  name: string;
  extension: string;
  monacoId: string;
  color: string;
}

export interface SearchFilters {
  query: string;
  language: string;
  tags: string[];
  visibility: 'all' | 'public' | 'private';
  sortBy: 'newest' | 'oldest' | 'popular' | 'updated';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (subscription: Subscription) => void;
}

export interface SnippetState {
  snippets: Snippet[];
  currentSnippet: Snippet | null;
  isLoading: boolean;
  filters: SearchFilters;
  createSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'owner'>) => Promise<void>;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  setCurrentSnippet: (snippet: Snippet | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  fetchSnippets: () => Promise<void>;
}

export interface PaymentState {
  plans: PricingPlan[];
  isLoading: boolean;
  createCheckoutSession: (priceId: string) => Promise<string>;
  createPortalSession: () => Promise<string>;
  fetchPlans: () => Promise<void>;
}