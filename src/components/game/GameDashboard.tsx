import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Trophy, 
  Users, 
  Star, 
  Zap, 
  Crown, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Book,
  Settings
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import GameWorld from './GameWorld';
import QuestModal from './QuestModal';
import Button from '../ui/Button';

const GameDashboard: React.FC = () => {
  const {
    player,
    availableQuests,
    currentQuest,
    isGameWorldOpen,
    isQuestModalOpen,
    openGameWorld,
    closeGameWorld,
    closeQuestModal,
    initializePlayer,
    checkPremiumAccess
  } = useGameStore();

  const [selectedTab, setSelectedTab] = useState<'world' | 'quests' | 'progress' | 'multiplayer'>('world');

  useEffect(() => {
    // Initialize player if not exists
    if (!player) {
      initializePlayer('CodeWarrior');
    }
  }, [player, initializePlayer]);

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to VinStack Code!</h1>
          <p className="text-gray-400 mb-6">Your AI-powered coding adventure awaits</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => initializePlayer('CodeWarrior')}
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    );
  }

  const freeQuests = availableQuests.filter(q => !q.isPremium);
  const premiumQuests = availableQuests.filter(q => q.isPremium);
  const completedQuests = availableQuests.filter(q => player.completedQuests.includes(q.id));
  const nextLevel = Math.floor(player.experience / 1000) + 1;
  const progressToNextLevel = (player.experience % 1000) / 1000 * 100;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white">VinStack Code</h1>
            
            {/* Navigation */}
            <nav className="flex space-x-1">
              {[
                { id: 'world', label: 'Game World', icon: Play },
                { id: 'quests', label: 'Quests', icon: Book },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'multiplayer', label: 'Multiplayer', icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Player Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-medium">Level {player.level}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-white">{player.experience} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-white">{player.codeCoins} Coins</span>
              </div>
            </div>
            
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">{player.avatar}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {selectedTab === 'world' && (
          <div className="h-[calc(100vh-80px)]">
            <GameWorld width={1200} height={800} />
          </div>
        )}

        {selectedTab === 'quests' && (
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Coding Quests</h2>
                <p className="text-gray-400">Master programming through interactive challenges</p>
              </div>

              {/* Quest Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Free Quests */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Book className="w-5 h-5 text-green-500" />
                    <h3 className="text-xl font-semibold text-white">Free Quests</h3>
                    <span className="px-2 py-1 bg-green-600 text-green-100 rounded-full text-xs">
                      {freeQuests.length} Available
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {freeQuests.map(quest => (
                      <motion.div
                        key={quest.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          player.completedQuests.includes(quest.id)
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 bg-gray-800 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white">{quest.title}</h4>
                          <div className="flex items-center space-x-2">
                            {player.completedQuests.includes(quest.id) && (
                              <Trophy className="w-4 h-4 text-green-500" />
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              quest.difficulty === 'beginner' ? 'bg-green-600 text-green-100' :
                              quest.difficulty === 'intermediate' ? 'bg-yellow-600 text-yellow-100' :
                              'bg-red-600 text-red-100'
                            }`}>
                              {quest.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">{quest.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-blue-400">
                              <Star className="w-3 h-3" />
                              <span>{quest.xpReward} XP</span>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Zap className="w-3 h-3" />
                              <span>{quest.coinReward} Coins</span>
                            </div>
                            <span className="text-gray-400">~{quest.estimatedTime}min</span>
                          </div>
                          
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={player.completedQuests.includes(quest.id)}
                          >
                            {player.completedQuests.includes(quest.id) ? 'Completed' : 'Start Quest'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Premium Quests */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-xl font-semibold text-white">Premium Quests</h3>
                    <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded-full text-xs">
                      Premium Only
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {premiumQuests.map(quest => (
                      <motion.div
                        key={quest.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          checkPremiumAccess('unlimited-quests')
                            ? player.completedQuests.includes(quest.id)
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-yellow-500 bg-yellow-500/10 hover:border-yellow-400'
                            : 'border-gray-700 bg-gray-800 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white">{quest.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            {player.completedQuests.includes(quest.id) && (
                              <Trophy className="w-4 h-4 text-green-500" />
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              quest.difficulty === 'beginner' ? 'bg-green-600 text-green-100' :
                              quest.difficulty === 'intermediate' ? 'bg-yellow-600 text-yellow-100' :
                              'bg-red-600 text-red-100'
                            }`}>
                              {quest.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">{quest.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-blue-400">
                              <Star className="w-3 h-3" />
                              <span>{quest.xpReward} XP</span>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Zap className="w-3 h-3" />
                              <span>{quest.coinReward} Coins</span>
                            </div>
                            <span className="text-gray-400">~{quest.estimatedTime}min</span>
                          </div>
                          
                          <Button
                            variant={checkPremiumAccess('unlimited-quests') ? 'primary' : 'outline'}
                            size="sm"
                            disabled={!checkPremiumAccess('unlimited-quests') || player.completedQuests.includes(quest.id)}
                          >
                            {!checkPremiumAccess('unlimited-quests') ? 'Upgrade Required' :
                             player.completedQuests.includes(quest.id) ? 'Completed' : 'Start Quest'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {!checkPremiumAccess('unlimited-quests') && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-center">
                      <Crown className="w-12 h-12 mx-auto mb-3 text-white" />
                      <h3 className="text-xl font-bold text-white mb-2">Unlock Premium Quests</h3>
                      <p className="text-yellow-100 mb-4">
                        Get access to advanced coding challenges, AI mentorship, and unlimited practice
                      </p>
                      <Button variant="secondary" size="lg">
                        Upgrade to Premium - $9.99/month
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'progress' && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your Progress</h2>
                <p className="text-gray-400">Track your coding journey and achievements</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Level Progress */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-white">Level Progress</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">Level {player.level}</div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressToNextLevel}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      {player.experience % 1000}/1000 XP to Level {nextLevel}
                    </div>
                  </div>
                </div>

                {/* Quest Stats */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-white">Quest Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-white font-medium">{completedQuests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available:</span>
                      <span className="text-white font-medium">{availableQuests.length - completedQuests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-white font-medium">
                        {availableQuests.length > 0 ? Math.round((completedQuests.length / availableQuests.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-white">Coding Streak</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{player.stats.streakDays} Days</div>
                    <div className="text-sm text-gray-400">
                      Keep coding daily to maintain your streak!
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gray-800 rounded-lg p-6 lg:col-span-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-6 h-6 text-purple-500" />
                    <h3 className="text-lg font-semibold text-white">Achievements</h3>
                  </div>
                  
                  {player.achievements.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {player.achievements.map(achievement => (
                        <div
                          key={achievement.id}
                          className="bg-gray-700 rounded-lg p-4 text-center"
                        >
                          <div className="text-2xl mb-2">{achievement.icon}</div>
                          <div className="font-medium text-white mb-1">{achievement.title}</div>
                          <div className="text-xs text-gray-400">{achievement.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No achievements yet</p>
                      <p className="text-sm">Complete quests to earn achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'multiplayer' && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Multiplayer Arena</h2>
                <p className="text-gray-400">Compete and collaborate with other coders</p>
              </div>

              {/* Multiplayer Modes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code Race */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-white">Code Race</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Race against other players to solve coding challenges the fastest. Earn bonus XP and coins for top placements!
                  </p>
                  <Button variant="primary" disabled={!checkPremiumAccess('multiplayer')}>
                    {checkPremiumAccess('multiplayer') ? 'Join Race' : 'Premium Feature'}
                  </Button>
                </div>

                {/* Collaborative Coding */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-white">Collaborative Coding</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Team up with other players to tackle complex challenges together. Learn from each other and share knowledge.
                  </p>
                  <Button variant="primary" disabled={!checkPremiumAccess('multiplayer')}>
                    {checkPremiumAccess('multiplayer') ? 'Find Team' : 'Premium Feature'}
                  </Button>
                </div>

                {/* Leaderboard */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 md:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-white">Global Leaderboard</h3>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="pb-2 font-medium">Rank</th>
                          <th className="pb-2 font-medium">Player</th>
                          <th className="pb-2 font-medium">Level</th>
                          <th className="pb-2 font-medium">XP</th>
                          <th className="pb-2 font-medium">Quests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Sample leaderboard data */}
                        {[
                          { rank: 1, name: 'CodeMaster', level: 42, xp: 42500, quests: 87 },
                          { rank: 2, name: 'AlgorithmWizard', level: 38, xp: 38200, quests: 76 },
                          { rank: 3, name: 'ByteNinja', level: 35, xp: 35100, quests: 72 },
                          { rank: 4, name: 'DevGenius', level: 31, xp: 31800, quests: 65 },
                          { rank: 5, name: player.username, level: player.level, xp: player.experience, quests: player.stats.questsCompleted }
                        ].map((entry, index) => (
                          <tr 
                            key={index} 
                            className={`border-b border-gray-700 ${entry.name === player.username ? 'bg-primary-900/20' : ''}`}
                          >
                            <td className="py-3 font-medium text-white">{entry.rank}</td>
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs">
                                  {entry.rank === 1 ? '👑' : entry.name.charAt(0)}
                                </div>
                                <span className={entry.name === player.username ? 'text-primary-400 font-medium' : 'text-white'}>
                                  {entry.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-white">{entry.level}</td>
                            <td className="py-3 text-white">{entry.xp.toLocaleString()}</td>
                            <td className="py-3 text-white">{entry.quests}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quest Modal */}
      {currentQuest && (
        <QuestModal
          quest={currentQuest}
          isOpen={isQuestModalOpen}
          onClose={closeQuestModal}
        />
      )}
    </div>
  );
};

export default GameDashboard;