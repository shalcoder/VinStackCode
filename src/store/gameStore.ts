import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Quest, GameSession, Achievement, MultiplayerSession } from '../types/game';

interface GameState {
  // Player state
  player: Player | null;
  currentArea: string;
  
  // Quest system
  availableQuests: Quest[];
  currentQuest: Quest | null;
  questHistory: GameSession[];
  
  // Game world
  isGameWorldOpen: boolean;
  isQuestModalOpen: boolean;
  
  // Multiplayer
  multiplayerSessions: MultiplayerSession[];
  currentMultiplayerSession: MultiplayerSession | null;
  
  // AI Mentor
  aiMentorActive: boolean;
  lastAIFeedback: string;
  
  // Monetization
  subscription: 'free' | 'premium';
  premiumFeatures: string[];
  
  // Actions
  initializePlayer: (username: string) => void;
  updatePlayerPosition: (position: { x: number; y: number }) => void;
  updatePlayerStats: (stats: Partial<Player>) => void;
  
  // Quest actions
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, score: number) => void;
  openQuestModal: (quest: Quest) => void;
  closeQuestModal: () => void;
  
  // Game world actions
  openGameWorld: () => void;
  closeGameWorld: () => void;
  changeArea: (areaId: string) => void;
  
  // Multiplayer actions
  joinMultiplayerSession: (sessionId: string) => void;
  leaveMultiplayerSession: () => void;
  
  // AI actions
  activateAIMentor: () => void;
  deactivateAIMentor: () => void;
  setAIFeedback: (feedback: string) => void;
  
  // Monetization actions
  upgradeToPremiun: () => void;
  checkPremiumAccess: (feature: string) => boolean;
}

// Initial quests data
const initialQuests: Quest[] = [
  {
    id: 'intro-variables',
    title: 'Variables & Data Types',
    description: 'Learn how to declare and use variables in JavaScript',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'fundamentals',
    xpReward: 100,
    coinReward: 50,
    starterCode: `// Welcome to your first coding quest!
// Let's learn about variables

// TODO: Create a variable called 'playerName' and assign it your name
// TODO: Create a variable called 'playerLevel' and assign it the number 1
// TODO: Create a variable called 'hasCompletedTutorial' and assign it false

console.log('Player:', playerName);
console.log('Level:', playerLevel);
console.log('Tutorial completed:', hasCompletedTutorial);`,
    solution: `// Welcome to your first coding quest!
// Let's learn about variables

// TODO: Create a variable called 'playerName' and assign it your name
let playerName = "Coder";

// TODO: Create a variable called 'playerLevel' and assign it the number 1
let playerLevel = 1;

// TODO: Create a variable called 'hasCompletedTutorial' and assign it false
let hasCompletedTutorial = false;

console.log('Player:', playerName);
console.log('Level:', playerLevel);
console.log('Tutorial completed:', hasCompletedTutorial);`,
    tests: [
      {
        id: 'test-1',
        input: null,
        expectedOutput: 'Player: Coder',
        description: 'Should declare playerName variable',
        isHidden: false
      }
    ],
    hints: [
      {
        id: 'hint-1',
        level: 1,
        content: 'Use the "let" keyword to declare a variable: let variableName = value;',
        cost: 10
      },
      {
        id: 'hint-2',
        level: 2,
        content: 'Strings should be wrapped in quotes: "text here"',
        cost: 20
      }
    ],
    prerequisites: [],
    estimatedTime: 5,
    isPremium: false
  },
  {
    id: 'basic-functions',
    title: 'Functions Fundamentals',
    description: 'Master the art of creating and calling functions',
    difficulty: 'beginner',
    language: 'javascript',
    category: 'fundamentals',
    xpReward: 150,
    coinReward: 75,
    starterCode: `// Functions are reusable blocks of code
// Let's create some useful functions!

// TODO: Create a function called 'greetPlayer' that takes a name parameter
// and returns "Hello, [name]! Welcome to VinStack Code!"

// TODO: Create a function called 'calculateXP' that takes level and multiplier parameters
// and returns level * multiplier * 100

// Test your functions
console.log(greetPlayer("Alice"));
console.log("XP for level 5:", calculateXP(5, 1.5));`,
    solution: `// Functions are reusable blocks of code
// Let's create some useful functions!

// TODO: Create a function called 'greetPlayer' that takes a name parameter
// and returns "Hello, [name]! Welcome to VinStack Code!"
function greetPlayer(name) {
  return "Hello, " + name + "! Welcome to VinStack Code!";
}

// TODO: Create a function called 'calculateXP' that takes level and multiplier parameters
// and returns level * multiplier * 100
function calculateXP(level, multiplier) {
  return level * multiplier * 100;
}

// Test your functions
console.log(greetPlayer("Alice"));
console.log("XP for level 5:", calculateXP(5, 1.5));`,
    tests: [
      {
        id: 'test-1',
        input: 'Alice',
        expectedOutput: 'Hello, Alice! Welcome to VinStack Code!',
        description: 'greetPlayer function should work correctly',
        isHidden: false
      }
    ],
    hints: [
      {
        id: 'hint-1',
        level: 1,
        content: 'Function syntax: function functionName(parameters) { return value; }',
        cost: 15
      }
    ],
    prerequisites: ['intro-variables'],
    estimatedTime: 8,
    isPremium: false
  },
  {
    id: 'html-basics',
    title: 'HTML Structure Mastery',
    description: 'Build your first web page with proper HTML structure',
    difficulty: 'beginner',
    language: 'html',
    category: 'web-dev',
    xpReward: 120,
    coinReward: 60,
    starterCode: `<!-- Welcome to HTML! Let's build a player profile page -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player Profile</title>
</head>
<body>
    <!-- TODO: Add a main heading with "Player Profile" -->
    
    <!-- TODO: Create a section with class "player-info" -->
    <!-- Inside the section, add: -->
    <!-- - A subheading "About Me" -->
    <!-- - A paragraph describing yourself as a coder -->
    <!-- - An unordered list of your favorite programming languages -->
    
    <!-- TODO: Add a footer with copyright text -->
</body>
</html>`,
    solution: `<!-- Welcome to HTML! Let's build a player profile page -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player Profile</title>
</head>
<body>
    <!-- TODO: Add a main heading with "Player Profile" -->
    <h1>Player Profile</h1>
    
    <!-- TODO: Create a section with class "player-info" -->
    <section class="player-info">
        <!-- Inside the section, add: -->
        <!-- - A subheading "About Me" -->
        <h2>About Me</h2>
        <!-- - A paragraph describing yourself as a coder -->
        <p>I'm a passionate coder learning through VinStack Code!</p>
        <!-- - An unordered list of your favorite programming languages -->
        <ul>
            <li>JavaScript</li>
            <li>Python</li>
            <li>HTML/CSS</li>
        </ul>
    </section>
    
    <!-- TODO: Add a footer with copyright text -->
    <footer>
        <p>&copy; 2024 VinStack Code Player</p>
    </footer>
</body>
</html>`,
    tests: [
      {
        id: 'test-1',
        input: null,
        expectedOutput: 'Player Profile',
        description: 'Should have main heading',
        isHidden: false
      }
    ],
    hints: [
      {
        id: 'hint-1',
        level: 1,
        content: 'Use <h1> for main headings and <h2> for subheadings',
        cost: 10
      }
    ],
    prerequisites: [],
    estimatedTime: 10,
    isPremium: false
  },
  {
    id: 'css-styling',
    title: 'CSS Styling Magic',
    description: 'Transform your HTML with beautiful CSS styles',
    difficulty: 'intermediate',
    language: 'css',
    category: 'web-dev',
    xpReward: 200,
    coinReward: 100,
    starterCode: `/* Welcome to CSS! Let's style a game character card */

/* TODO: Style the .character-card class */
/* - Set background color to a gradient */
/* - Add padding and border radius */
/* - Center the text */
/* - Add a subtle shadow */

/* TODO: Style the .character-name class */
/* - Make the font size larger */
/* - Change the color to something vibrant */
/* - Add some margin */

/* TODO: Style the .stats class */
/* - Display as flexbox */
/* - Space items evenly */
/* - Add some styling to make it look like a game UI */

/* TODO: Add a hover effect to .character-card */
/* - Scale it slightly larger */
/* - Change the shadow */
/* - Add a smooth transition */`,
    solution: `/* Welcome to CSS! Let's style a game character card */

/* TODO: Style the .character-card class */
.character-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

/* TODO: Style the .character-name class */
.character-name {
  font-size: 24px;
  color: #ffffff;
  margin: 10px 0;
  font-weight: bold;
}

/* TODO: Style the .stats class */
.stats {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
}

/* TODO: Add a hover effect to .character-card */
.character-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}`,
    tests: [
      {
        id: 'test-1',
        input: null,
        expectedOutput: 'gradient background',
        description: 'Should have gradient background',
        isHidden: false
      }
    ],
    hints: [
      {
        id: 'hint-1',
        level: 1,
        content: 'Use linear-gradient() for gradient backgrounds',
        cost: 15
      }
    ],
    prerequisites: ['html-basics'],
    estimatedTime: 15,
    isPremium: true
  },
  {
    id: 'js-dom',
    title: 'DOM Manipulation Quest',
    description: 'Learn to control web pages with JavaScript',
    difficulty: 'intermediate',
    language: 'javascript',
    category: 'web-dev',
    xpReward: 250,
    coinReward: 125,
    starterCode: `// Welcome to DOM manipulation!
// Let's create an interactive game interface

// TODO: Create a function called 'updatePlayerStats'
// It should take parameters: name, level, xp
// Update the HTML elements with IDs: 'player-name', 'player-level', 'player-xp'

// TODO: Create a function called 'addQuestToList'
// It should take a quest name parameter
// Create a new list item and add it to the element with ID 'quest-list'

// TODO: Create a function called 'celebrateVictory'
// It should change the background color of the body to gold
// And show an alert saying "Quest Completed!"

// Test your functions
updatePlayerStats("CodeMaster", 5, 1250);
addQuestToList("Defeat the Bug Dragon");
// celebrateVictory(); // Uncomment to test`,
    solution: `// Welcome to DOM manipulation!
// Let's create an interactive game interface

// TODO: Create a function called 'updatePlayerStats'
function updatePlayerStats(name, level, xp) {
  document.getElementById('player-name').textContent = name;
  document.getElementById('player-level').textContent = level;
  document.getElementById('player-xp').textContent = xp;
}

// TODO: Create a function called 'addQuestToList'
function addQuestToList(questName) {
  const questList = document.getElementById('quest-list');
  const listItem = document.createElement('li');
  listItem.textContent = questName;
  questList.appendChild(listItem);
}

// TODO: Create a function called 'celebrateVictory'
function celebrateVictory() {
  document.body.style.backgroundColor = 'gold';
  alert("Quest Completed!");
}

// Test your functions
updatePlayerStats("CodeMaster", 5, 1250);
addQuestToList("Defeat the Bug Dragon");
// celebrateVictory(); // Uncomment to test`,
    tests: [
      {
        id: 'test-1',
        input: null,
        expectedOutput: 'DOM updated',
        description: 'Should update DOM elements',
        isHidden: false
      }
    ],
    hints: [
      {
        id: 'hint-1',
        level: 1,
        content: 'Use document.getElementById() to select elements',
        cost: 20
      }
    ],
    prerequisites: ['basic-functions', 'html-basics'],
    estimatedTime: 20,
    isPremium: true
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      player: null,
      currentArea: 'tutorial-zone',
      availableQuests: initialQuests,
      currentQuest: null,
      questHistory: [],
      isGameWorldOpen: false,
      isQuestModalOpen: false,
      multiplayerSessions: [],
      currentMultiplayerSession: null,
      aiMentorActive: true,
      lastAIFeedback: '',
      subscription: 'free',
      premiumFeatures: [],

      // Player actions
      initializePlayer: (username: string) => {
        const newPlayer: Player = {
          id: `player_${Date.now()}`,
          username,
          level: 1,
          experience: 0,
          codeCoins: 100,
          position: { x: 150, y: 150 },
          avatar: '🧑‍💻',
          completedQuests: [],
          achievements: [],
          stats: {
            questsCompleted: 0,
            totalXP: 0,
            streakDays: 0,
            averageScore: 0,
            timeSpent: 0,
            languagesMastered: []
          }
        };
        set({ player: newPlayer });
      },

      updatePlayerPosition: (position) => {
        set(state => ({
          player: state.player ? { ...state.player, position } : null
        }));
      },

      updatePlayerStats: (stats) => {
        set(state => ({
          player: state.player ? { ...state.player, ...stats } : null
        }));
      },

      // Quest actions
      startQuest: (questId) => {
        const quest = get().availableQuests.find(q => q.id === questId);
        if (quest) {
          set({ currentQuest: quest });
        }
      },

      completeQuest: (questId, score) => {
        const state = get();
        const quest = state.availableQuests.find(q => q.id === questId);
        
        if (quest && state.player) {
          const xpGained = Math.floor(quest.xpReward * (score / 100));
          const coinsGained = Math.floor(quest.coinReward * (score / 100));
          
          const updatedPlayer = {
            ...state.player,
            experience: state.player.experience + xpGained,
            codeCoins: state.player.codeCoins + coinsGained,
            completedQuests: [...state.player.completedQuests, questId],
            stats: {
              ...state.player.stats,
              questsCompleted: state.player.stats.questsCompleted + 1,
              totalXP: state.player.stats.totalXP + xpGained
            }
          };

          // Level up check
          const newLevel = Math.floor(updatedPlayer.experience / 1000) + 1;
          if (newLevel > updatedPlayer.level) {
            updatedPlayer.level = newLevel;
          }

          set({
            player: updatedPlayer,
            currentQuest: null,
            isQuestModalOpen: false
          });
        }
      },

      openQuestModal: (quest) => {
        set({ currentQuest: quest, isQuestModalOpen: true });
      },

      closeQuestModal: () => {
        set({ isQuestModalOpen: false, currentQuest: null });
      },

      // Game world actions
      openGameWorld: () => set({ isGameWorldOpen: true }),
      closeGameWorld: () => set({ isGameWorldOpen: false }),
      changeArea: (areaId) => set({ currentArea: areaId }),

      // Multiplayer actions
      joinMultiplayerSession: (sessionId) => {
        // Implementation for joining multiplayer sessions
        console.log('Joining multiplayer session:', sessionId);
      },

      leaveMultiplayerSession: () => {
        set({ currentMultiplayerSession: null });
      },

      // AI actions
      activateAIMentor: () => set({ aiMentorActive: true }),
      deactivateAIMentor: () => set({ aiMentorActive: false }),
      setAIFeedback: (feedback) => set({ lastAIFeedback: feedback }),

      // Monetization actions
      upgradeToPremiun: () => {
        set({ 
          subscription: 'premium',
          premiumFeatures: ['unlimited-quests', 'ai-mentor', 'multiplayer', 'advanced-analytics']
        });
      },

      checkPremiumAccess: (feature) => {
        const state = get();
        return state.subscription === 'premium' || state.premiumFeatures.includes(feature);
      }
    }),
    {
      name: 'vinstack-game-storage',
      partialize: (state) => ({
        player: state.player,
        questHistory: state.questHistory,
        subscription: state.subscription,
        premiumFeatures: state.premiumFeatures
      })
    }
  )
);