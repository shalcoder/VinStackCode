import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Zap, Star, Users } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import GameDashboard from '../components/game/GameDashboard';
import AIMentor from '../components/game/AIMentor';
import MultiplayerArena from '../components/game/MultiplayerArena';
import Button from '../components/ui/Button';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { player, initializePlayer, aiMentorActive, activateAIMentor, deactivateAIMentor } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  const [showMultiplayer, setShowMultiplayer] = useState(false);

  useEffect(() => {
    // Initialize player if not exists
    if (!player && user) {
      initializePlayer(user.username || 'CodeWarrior');
    }
  }, [player, user, initializePlayer]);

  const handleStartGame = () => {
    setShowIntro(false);
  };

  const toggleAIMentor = () => {
    if (aiMentorActive) {
      deactivateAIMentor();
    } else {
      activateAIMentor();
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full bg-gray-900 rounded-xl p-8 border border-gray-700"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-6xl mb-4"
            >
              🎮
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to VinStack Code</h1>
            <p className="text-xl text-gray-300">The AI-Powered Coding Education Game</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Interactive Learning</h3>
                  <p className="text-gray-400">
                    Master coding through fun, interactive quests and challenges in a gamified environment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Mentorship</h3>
                  <p className="text-gray-400">
                    Get personalized guidance from your AI mentor with voice feedback and video tutorials.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Earn & Progress</h3>
                  <p className="text-gray-400">
                    Level up, earn CodeCoins, and unlock achievements as you improve your coding skills.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">How to Play</h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">1</span>
                  <span>Explore the game world and talk to NPCs to discover quests</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">2</span>
                  <span>Complete coding challenges to earn XP and CodeCoins</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">3</span>
                  <span>Use your AI mentor for hints and guidance when stuck</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">4</span>
                  <span>Level up to unlock more challenging quests and areas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">5</span>
                  <span>Compete with friends in multiplayer coding races</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartGame}
            >
              Start Your Coding Adventure
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showMultiplayer) {
    return (
      <div className="min-h-screen bg-gray-950">
        <MultiplayerArena onClose={() => setShowMultiplayer(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <GameDashboard />
      <AIMentor isActive={aiMentorActive} onToggle={toggleAIMentor} />
      
      {/* Multiplayer Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 bg-purple-600 text-white rounded-full p-4 shadow-lg z-10"
        onClick={() => setShowMultiplayer(true)}
      >
        <Users className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default GamePage;