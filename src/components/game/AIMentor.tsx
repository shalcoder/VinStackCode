import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Volume2, VolumeX, Video, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import Button from '../ui/Button';

interface AIMentorProps {
  isActive: boolean;
  onToggle: () => void;
}

const AIMentor: React.FC<AIMentorProps> = ({ isActive, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const { player, currentQuest } = useGameStore();

  // Welcome message when component mounts
  useEffect(() => {
    if (isActive && player) {
      const welcomeMessage = `Welcome back, ${player.username}! I'm your AI coding mentor. How can I help you today?`;
      setCurrentMessage(welcomeMessage);
      setMessageHistory([welcomeMessage]);
    }
  }, [isActive, player]);

  // Generate contextual hints based on current quest
  const generateHint = async () => {
    if (!currentQuest) return;
    
    setIsThinking(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let hint = '';
    
    switch (currentQuest.id) {
      case 'intro-variables':
        hint = "Remember that variables in JavaScript are declared using 'let', 'const', or 'var'. For this quest, try using 'let' for all three variables.";
        break;
      case 'basic-functions':
        hint = "Functions can be declared using the 'function' keyword followed by the function name and parameters in parentheses. Don't forget to use the 'return' keyword to output a value!";
        break;
      case 'html-basics':
        hint = "HTML documents have a structure with nested elements. Make sure you're using the correct tags: <h1> for main headings, <section> for sections, <ul> for unordered lists, and <li> for list items.";
        break;
      default:
        hint = "Look carefully at the requirements and test cases. What is the expected output? Try breaking down the problem into smaller steps.";
    }
    
    setCurrentMessage(hint);
    setMessageHistory(prev => [...prev, hint]);
    setIsThinking(false);
  };

  // Generate encouragement
  const generateEncouragement = async () => {
    setIsThinking(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const encouragements = [
      "You're doing great! Keep going!",
      "I believe in you! This challenge is within your abilities.",
      "Remember, every programmer started somewhere. You're making excellent progress!",
      "Coding is about persistence. You've got this!",
      "You're thinking like a real developer now!",
      "That's a clever approach! Keep building on it.",
      "You're developing skills that will serve you for years to come.",
      "I'm impressed with your problem-solving approach!"
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    setCurrentMessage(randomEncouragement);
    setMessageHistory(prev => [...prev, randomEncouragement]);
    setIsThinking(false);
  };

  // Simulate voice playback
  const playVoice = () => {
    if (isMuted) return;
    
    console.log('Playing voice:', currentMessage);
    // In a real implementation, this would use ElevenLabs API to generate and play voice
  };

  // Play voice when message changes
  useEffect(() => {
    if (currentMessage && isActive && !isMuted) {
      playVoice();
    }
  }, [currentMessage, isActive, isMuted]);

  if (!isActive) return null;

  return (
    <>
      {/* Floating Mentor Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Mentor Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Mentor</h3>
                  <p className="text-xs text-gray-400">Powered by ElevenLabs & Tavus</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 h-64 overflow-y-auto">
              <div className="space-y-4">
                {messageHistory.map((message, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-gray-300 text-sm">
                      {message}
                    </div>
                  </div>
                ))}
                
                {isThinking && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-gray-300 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateHint}
                  disabled={isThinking || !currentQuest}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateEncouragement}
                  disabled={isThinking}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Encouragement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!currentQuest}
                  className="col-span-2"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Generate Video Explanation
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIMentor;