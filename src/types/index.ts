export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  preferredLanguages: string[];
  theme: 'dark' | 'light';
  createdAt: Date;
  subscription?: Subscription;
  settings?: UserSettings;
}

export interface UserSettings {
  autoSave: boolean;
  keyboardShortcuts: boolean;
  notifications: boolean;
  defaultVisibility: 'public' | 'private';
  editorTheme: string;
  fontSize: number;
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
  forks: number;
  versions?: SnippetVersion[];
  comments?: Comment[];
  isArchived?: boolean;
  isFavorited?: boolean;
  folder?: string;
  customFields?: Record<string, any>;
}

export interface SnippetVersion {
  id: string;
  snippetId: string;
  content: string;
  title: string;
  description: string;
  authorId: string;
  author: User;
  createdAt: Date;
  changeMessage?: string;
  diff?: string;
}

export interface Comment {
  id: string;
  snippetId: string;
  authorId: string;
  author: User;
  content: string;
  lineNumber?: number;
  selection?: { start: number; end: number };
  parentId?: string;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
  isResolved?: boolean;
  mentions?: string[];
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  snippetCount: number;
  children?: Folder[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
  settings: TeamSettings;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  permissions: string[];
}

export interface TeamSettings {
  defaultSnippetVisibility: 'public' | 'private';
  allowPublicSnippets: boolean;
  requireApprovalForPublic: boolean;
  enableComments: boolean;
  enableVersionHistory: boolean;
}

export interface CodeLanguage {
  id: string;
  name: string;
  extension: string;
  monacoId: string;
  color: string;
  category: string;
  isPopular: boolean;
}

export interface SearchFilters {
  query: string;
  language: string;
  tags: string[];
  visibility: 'all' | 'public' | 'private';
  sortBy: 'newest' | 'oldest' | 'popular' | 'updated' | 'views' | 'likes';
  dateRange?: { start: Date; end: Date };
  author?: string;
  folder?: string;
  hasComments?: boolean;
  isArchived?: boolean;
}

export interface SearchResult {
  snippets: Snippet[];
  totalCount: number;
  facets: {
    languages: { [key: string]: number };
    tags: { [key: string]: number };
    authors: { [key: string]: number };
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'mention' | 'collaboration' | 'like' | 'fork' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  user: User;
  type: 'create' | 'update' | 'delete' | 'comment' | 'like' | 'fork' | 'share';
  entityType: 'snippet' | 'comment' | 'user' | 'team';
  entityId: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'vscode' | 'webhook';
  userId: string;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  lastSyncAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateSubscription: (subscription: Subscription) => void;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

export interface SnippetState {
  snippets: Snippet[];
  currentSnippet: Snippet | null;
  folders: Folder[];
  isLoading: boolean;
  filters: SearchFilters;
  searchResults: SearchResult | null;
  recentSnippets: Snippet[];
  favoriteSnippets: Snippet[];
  createSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'forks' | 'owner'>) => Promise<void>;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  forkSnippet: (id: string) => Promise<Snippet>;
  likeSnippet: (id: string) => Promise<void>;
  favoriteSnippet: (id: string) => Promise<void>;
  archiveSnippet: (id: string) => Promise<void>;
  setCurrentSnippet: (snippet: Snippet | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  searchSnippets: (query: string, filters?: Partial<SearchFilters>) => Promise<void>;
  fetchSnippets: () => Promise<void>;
  fetchRecentSnippets: () => Promise<void>;
  fetchFavoriteSnippets: () => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveSnippetToFolder: (snippetId: string, folderId?: string) => Promise<void>;
}

export interface CollaborationState {
  activeCollaborators: { [snippetId: string]: User[] };
  comments: { [snippetId: string]: Comment[] };
  isConnected: boolean;
  addComment: (snippetId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => Promise<void>;
  updateComment: (commentId: string, updates: Partial<Comment>) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
  joinSnippetSession: (snippetId: string) => void;
  leaveSnippetSession: (snippetId: string) => void;
  sendCursorPosition: (snippetId: string, position: { line: number; column: number }) => void;
}

export interface PaymentState {
  plans: PricingPlan[];
  isLoading: boolean;
  createCheckoutSession: (priceId: string) => Promise<string>;
  createPortalSession: () => Promise<string>;
  fetchPlans: () => Promise<void>;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  fetchActivities: () => Promise<void>;
  fetchUserActivities: (userId: string) => Promise<void>;
}

export interface IntegrationState {
  integrations: Integration[];
  isLoading: boolean;
  fetchIntegrations: () => Promise<void>;
  createIntegration: (integration: Omit<Integration, 'id' | 'createdAt'>) => Promise<void>;
  updateIntegration: (id: string, updates: Partial<Integration>) => Promise<void>;
  deleteIntegration: (id: string) => Promise<void>;
  syncIntegration: (id: string) => Promise<void>;
}