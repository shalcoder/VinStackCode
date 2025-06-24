import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Volume2, VolumeX, Video, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { elevenLabsService } from '../../services/elevenLabsService';
import Button from '../ui/Button';

interface AIMentorProps {
  isActive: boolean;
  onToggle: () => void;
}

const AIMentor: React.FC<AIMentorProps> = ({ isActive, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<{text: string; voiceUrl?: string}[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const { player, currentQuest, setAIFeedback } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Welcome message when component mounts
  useEffect(() => {
    if (isActive && player) {
      const welcomeMessage = `Welcome back, ${player.username}! I'm your AI coding mentor. How can I help you today?`;
      setCurrentMessage(welcomeMessage);
      generateVoice(welcomeMessage);
    }
  }, [isActive, player]);

  // Generate voice for a message
  const generateVoice = async (text: string) => {
    if (isMuted) {
      setMessageHistory(prev => [...prev, { text }]);
      return;
    }
    
    try {
      setIsGeneratingVoice(true);
      
      // Call ElevenLabs API
      const voiceUrl = await elevenLabsService.textToSpeech({
        text,
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Rachel voice
        stability: 0.5,
        similarityBoost: 0.75
      });
      
      setMessageHistory(prev => [...prev, { text, voiceUrl }]);
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = voiceUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating voice:', error);
      setMessageHistory(prev => [...prev, { text }]);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  // Generate contextual hints based on current quest
  const generateHint = async () => {
    if (!currentQuest) return;
    
    setIsThinking(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let hint = '';
    
    switch (currentQuest.id) {
      case 'intro-variables':
        hint = "Remember that variables in JavaScript are declared using 'let', 'const', or 'var'. For this quest, try using 'let' for all three variables. Make sure to assign the correct data types: a string for playerName, a number for playerLevel, and a boolean for hasCompletedTutorial.";
        break;
      case 'basic-functions':
        hint = "Functions can be declared using the 'function' keyword followed by the function name and parameters in parentheses. Don't forget to use the 'return' keyword to output a value! For the greetPlayer function, you'll need to concatenate the name parameter with the welcome message.";
        break;
      case 'html-basics':
        hint = "HTML documents have a structure with nested elements. Make sure you're using the correct tags: <h1> for main headings, <section> for sections, <h2> for subheadings, <ul> for unordered lists, and <li> for list items. Don't forget to close all your tags properly!";
        break;
      case 'css-styling':
        hint = "For the gradient background, use the linear-gradient() function. For example: background: linear-gradient(direction, color1, color2). The .stats class should use display: flex and justify-content to space items evenly. For the hover effect, remember to use the :hover pseudo-class and include a transition property for smooth animation.";
        break;
      case 'js-dom':
        hint = "To update HTML elements, first select them with document.getElementById(), then modify their properties like textContent. For the addQuestToList function, you'll need to create a new element with document.createElement(), set its content, and append it to the quest list with appendChild().";
        break;
      default:
        hint = "Look carefully at the requirements and test cases. What is the expected output? Try breaking down the problem into smaller steps. Remember to test your code frequently to catch errors early.";
    }
    
    setCurrentMessage(hint);
    setAIFeedback(hint);
    generateVoice(hint);
    setIsThinking(false);
  };

  // Generate encouragement
  const generateEncouragement = async () => {
    setIsThinking(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const encouragements = [
      "You're doing great! Keep going! Remember that every programmer faces challenges, but persistence is key to success.",
      "I believe in you! This challenge is within your abilities. Take a deep breath and approach it step by step.",
      "Remember, every programmer started somewhere. You're making excellent progress! The fact that you're working through these challenges shows real dedication.",
      "Coding is about persistence. You've got this! Even experienced developers encounter problems they need to solve methodically.",
      "You're thinking like a real developer now! Breaking down problems into smaller parts is exactly the right approach.",
      "That's a clever approach! Keep building on it. Your logical thinking is developing nicely.",
      "You're developing skills that will serve you for years to come. Each challenge you overcome makes you stronger.",
      "I'm impressed with your problem-solving approach! You're demonstrating the kind of thinking that makes for excellent developers."
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    setCurrentMessage(randomEncouragement);
    setAIFeedback(randomEncouragement);
    generateVoice(randomEncouragement);
    setIsThinking(false);
  };

  // Generate code explanation
  const generateExplanation = async () => {
    if (!currentQuest) return;
    
    setIsThinking(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let explanation = '';
    
    switch (currentQuest.id) {
      case 'intro-variables':
        explanation = `Let me explain the key concepts in this quest:

1. Variables in JavaScript are containers for storing data values.

2. We use the 'let' keyword to declare variables that can be reassigned:
   - let playerName = "YourName"; // String data type for text
   - let playerLevel = 1; // Number data type for numeric values
   - let hasCompletedTutorial = false; // Boolean data type (true/false)

3. After declaring variables, we can use them in our code, like printing them to the console with console.log().

Try implementing these concepts in your solution!`;
        break;
      case 'basic-functions':
        explanation = `Let me explain functions in JavaScript:

1. Functions are reusable blocks of code that perform specific tasks.

2. To create a function, use the 'function' keyword followed by:
   - The function name (e.g., greetPlayer)
   - Parameters in parentheses (e.g., (name))
   - Code block in curly braces { }
   - A return statement to output a value

3. For the greetPlayer function:
   function greetPlayer(name) {
     return "Hello, " + name + "! Welcome to VinStack Code!";
   }

4. For the calculateXP function:
   function calculateXP(level, multiplier) {
     return level * multiplier * 100;
   }

Functions help make your code modular and reusable!`;
        break;
      default:
        explanation = `Let me explain the key concepts for this quest:

1. First, understand what the quest is asking you to accomplish.

2. Break down the problem into smaller steps.

3. Implement each step one at a time, testing as you go.

4. Look for patterns and use appropriate programming constructs.

5. Don't forget to review your code for errors or improvements.

Remember, coding is a journey of continuous learning and improvement!`;
    }
    
    setCurrentMessage(explanation);
    setAIFeedback(explanation);
    generateVoice(explanation);
    setIsThinking(false);
  };

  if (!isActive) return null;

  return (
    <>
      {/* Audio element for voice playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
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
                    <div className="bg-gray-800 rounded-lg p-3 text-gray-300 text-sm relative group">
                      {message.text}
                      
                      {message.voiceUrl && !isMuted && (
                        <button 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.src = message.voiceUrl!;
                              audioRef.current.play();
                            }
                          }}
                        >
                          <Volume2 className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                      )}
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
                  disabled={isThinking || isGeneratingVoice || !currentQuest}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Hint
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateEncouragement}
                  disabled={isThinking || isGeneratingVoice}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Encouragement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateExplanation}
                  disabled={isThinking || isGeneratingVoice || !currentQuest}
                  className="col-span-2"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Explain Concepts
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