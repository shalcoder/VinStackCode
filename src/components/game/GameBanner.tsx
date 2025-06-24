import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Star, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const GameBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden mb-8"
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
          <div className="flex items-center space-x-2 mb-4">
            <Gamepad2 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">VinStack Code Game</h2>
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              New!
            </span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Learn to Code Through Play
          </h3>
          
          <p className="text-blue-100 mb-6">
            Master programming concepts through interactive quests, earn rewards, and get real-time AI mentorship. Turn learning to code into an adventure!
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/game')}
            >
              Start Playing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-3">Game Features</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-100">
                <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Interactive coding quests</span>
              </li>
              <li className="flex items-center text-blue-100">
                <Star className="w-4 h-4 mr-2 text-blue-300" />
                <span>Level up your coding skills</span>
              </li>
              <li className="flex items-center text-blue-100">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                <span>AI-powered mentorship</span>
              </li>
              <li className="flex items-center text-blue-100">
                <Gamepad2 className="w-4 h-4 mr-2 text-green-400" />
                <span>Multiplayer challenges</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameBanner;