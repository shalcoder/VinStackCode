export interface Player {
  id: string;
  username: string;
  level: number;
  experience: number;
  codeCoins: number;
  position: { x: number; y: number };
  avatar: string;
  currentQuest?: string;
  completedQuests: string[];
  achievements: Achievement[];
  stats: PlayerStats;
}

export interface PlayerStats {
  questsCompleted: number;
  totalXP: number;
  streakDays: number;
  averageScore: number;
  timeSpent: number;
  languagesMastered: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  category: 'fundamentals' | 'algorithms' | 'web-dev' | 'data-structures';
  xpReward: number;
  coinReward: number;
  starterCode: string;
  solution: string;
  tests: QuestTest[];
  hints: QuestHint[];
  prerequisites: string[];
  estimatedTime: number;
  isPremium: boolean;
}

export interface QuestTest {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
  isHidden: boolean;
}

export interface QuestHint {
  id: string;
  level: 1 | 2 | 3; // Progressive hints
  content: string;
  voiceContent?: string;
  cost: number; // CodeCoins cost
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  xpBonus: number;
}

export interface GameWorld {
  areas: GameArea[];
  npcs: NPC[];
  interactables: Interactable[];
}

export interface GameArea {
  id: string;
  name: string;
  description: string;
  bounds: { x: number; y: number; width: number; height: number };
  background: string;
  requiredLevel: number;
  quests: string[];
}

export interface NPC {
  id: string;
  name: string;
  role: 'mentor' | 'quest-giver' | 'shop-keeper' | 'challenger';
  position: { x: number; y: number };
  sprite: string;
  dialogue: NPCDialogue[];
  quests?: string[];
}

export interface NPCDialogue {
  id: string;
  text: string;
  voiceUrl?: string;
  videoUrl?: string;
  conditions?: DialogueCondition[];
  actions?: DialogueAction[];
}

export interface DialogueCondition {
  type: 'level' | 'quest-completed' | 'achievement' | 'item';
  value: any;
}

export interface DialogueAction {
  type: 'give-quest' | 'give-item' | 'give-xp' | 'give-coins';
  value: any;
}

export interface Interactable {
  id: string;
  type: 'chest' | 'portal' | 'computer' | 'book' | 'trophy';
  position: { x: number; y: number };
  sprite: string;
  action: InteractableAction;
}

export interface InteractableAction {
  type: 'open-quest' | 'teleport' | 'give-reward' | 'show-info';
  data: any;
}

export interface MultiplayerSession {
  id: string;
  type: 'race' | 'collaboration' | 'tournament';
  participants: Player[];
  quest: Quest;
  startTime: Date;
  endTime?: Date;
  winner?: string;
  status: 'waiting' | 'active' | 'completed';
}

export interface AIFeedback {
  type: 'hint' | 'encouragement' | 'correction' | 'celebration';
  content: string;
  voiceUrl?: string;
  videoUrl?: string;
  timestamp: Date;
}

export interface GameSession {
  id: string;
  playerId: string;
  questId: string;
  startTime: Date;
  endTime?: Date;
  attempts: QuestAttempt[];
  finalScore: number;
  xpEarned: number;
  coinsEarned: number;
  hintsUsed: number;
  aiFeedback: AIFeedback[];
}

export interface QuestAttempt {
  id: string;
  code: string;
  timestamp: Date;
  testResults: TestResult[];
  score: number;
  feedback: string;
}

export interface TestResult {
  testId: string;
  passed: boolean;
  output: any;
  error?: string;
  executionTime: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  features: SubscriptionFeature[];
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'weekly' | 'quest-specific' | 'language-specific';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  score: number;
  level: number;
  avatar: string;
  change: number; // Position change from last update
}