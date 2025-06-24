import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Lightbulb, Trophy, Star, Zap, Clock, CheckCircle } from 'lucide-react';
import { Quest, QuestAttempt } from '../../types/game';
import { useGameStore } from '../../store/gameStore';
import CodeEditor from '../editor/CodeEditor';
import Button from '../ui/Button';

interface QuestModalProps {
  quest: Quest;
  isOpen: boolean;
  onClose: () => void;
}

const QuestModal: React.FC<QuestModalProps> = ({ quest, isOpen, onClose }) => {
  const { player, completeQuest, checkPremiumAccess } = useGameStore();
  const [code, setCode] = useState(quest.starterCode);
  const [attempts, setAttempts] = useState<QuestAttempt[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(quest.starterCode);
      setAttempts([]);
      setCurrentScore(0);
      setUsedHints([]);
      setTestResults([]);
      setIsCompleted(false);
    }
  }, [isOpen, quest]);

  const runCode = async () => {
    setIsRunning(true);
    
    try {
      // Simulate code execution and testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock test results
      const mockResults = quest.tests.map(test => ({
        testId: test.id,
        passed: Math.random() > 0.3, // 70% pass rate for demo
        output: test.expectedOutput,
        executionTime: Math.random() * 100
      }));

      const passedTests = mockResults.filter(r => r.passed).length;
      const score = Math.round((passedTests / quest.tests.length) * 100);
      
      setTestResults(mockResults);
      setCurrentScore(score);
      
      const newAttempt: QuestAttempt = {
        id: `attempt_${Date.now()}`,
        code,
        timestamp: new Date(),
        testResults: mockResults,
        score,
        feedback: score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good progress!' : 'Keep trying!'
      };
      
      setAttempts(prev => [...prev, newAttempt]);
      
      if (score >= 80) {
        setIsCompleted(true);
        setTimeout(() => {
          completeQuest(quest.id, score);
          onClose();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Code execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const useHint = (hintId: string) => {
    if (!player || usedHints.includes(hintId)) return;
    
    const hint = quest.hints.find(h => h.id === hintId);
    if (!hint) return;
    
    if (player.codeCoins >= hint.cost) {
      setUsedHints(prev => [...prev, hintId]);
      // Deduct coins (would update in store)
      console.log(`Used hint: ${hint.content}`);
    }
  };

  const isPremiumQuest = quest.isPremium;
  const hasAccess = !isPremiumQuest || checkPremiumAccess('unlimited-quests');

  if (!hasAccess) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-yellow-500 mb-4">
                <Trophy className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Premium Quest</h2>
              <p className="text-gray-300 mb-6">
                This quest requires a premium subscription to access advanced coding challenges and AI mentorship.
              </p>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Upgrade to Premium
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Back to Free Quests
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-white">{quest.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quest.difficulty === 'beginner' ? 'bg-green-600 text-green-100' :
                  quest.difficulty === 'intermediate' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-red-600 text-red-100'
                }`}>
                  {quest.difficulty}
                </span>
                {isPremiumQuest && (
                  <span className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded-full text-sm font-medium">
                    Premium
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Star className="w-4 h-4" />
                    <span>{quest.xpReward} XP</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    <span>{quest.coinReward} Coins</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>~{quest.estimatedTime}min</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Instructions & Tests */}
              <div className="w-1/3 p-6 border-r border-gray-700 overflow-y-auto">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Quest Description</h3>
                    <p className="text-gray-300">{quest.description}</p>
                  </div>

                  {/* Test Cases */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Test Cases</h3>
                    <div className="space-y-2">
                      {quest.tests.map((test, index) => {
                        const result = testResults.find(r => r.testId === test.id);
                        return (
                          <div
                            key={test.id}
                            className={`p-3 rounded-lg border ${
                              result
                                ? result.passed
                                  ? 'border-green-500 bg-green-500/10'
                                  : 'border-red-500 bg-red-500/10'
                                : 'border-gray-700 bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-white">
                                Test {index + 1}
                              </span>
                              {result && (
                                <CheckCircle className={`w-4 h-4 ${
                                  result.passed ? 'text-green-500' : 'text-red-500'
                                }`} />
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{test.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hints */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">Hints</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHints(!showHints)}
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        {showHints ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    
                    {showHints && (
                      <div className="space-y-2">
                        {quest.hints.map((hint) => (
                          <div
                            key={hint.id}
                            className={`p-3 rounded-lg border ${
                              usedHints.includes(hint.id)
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">
                                Hint {hint.level}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-yellow-400">
                                  {hint.cost} coins
                                </span>
                                {!usedHints.includes(hint.id) && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => useHint(hint.id)}
                                    disabled={!player || player.codeCoins < hint.cost}
                                  >
                                    Use
                                  </Button>
                                )}
                              </div>
                            </div>
                            {usedHints.includes(hint.id) && (
                              <p className="text-sm text-gray-300">{hint.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {attempts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Best Score:</span>
                          <span className="text-sm font-medium text-white">
                            {Math.max(...attempts.map(a => a.score))}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Attempts:</span>
                          <span className="text-sm font-medium text-white">
                            {attempts.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Code Editor */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    language={quest.language}
                    height="100%"
                  />
                </div>

                {/* Bottom Panel - Controls & Results */}
                <div className="border-t border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="primary"
                        onClick={runCode}
                        disabled={isRunning}
                        isLoading={isRunning}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? 'Running...' : 'Run Tests'}
                      </Button>
                      
                      {currentScore > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">Score:</span>
                          <span className={`text-lg font-bold ${
                            currentScore >= 80 ? 'text-green-500' :
                            currentScore >= 60 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {currentScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center space-x-2 text-green-500"
                      >
                        <Trophy className="w-6 h-6" />
                        <span className="font-bold">Quest Completed!</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Test Results */}
                  {testResults.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Test Results</h4>
                      <div className="space-y-1">
                        {testResults.map((result, index) => (
                          <div
                            key={result.testId}
                            className={`flex items-center justify-between text-sm ${
                              result.passed ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            <span>Test {index + 1}</span>
                            <span>{result.passed ? '✓ Passed' : '✗ Failed'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestModal;