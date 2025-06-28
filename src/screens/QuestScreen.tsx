import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Play, Lightbulb, Trophy, Star, Zap, Clock, CheckCircle } from 'lucide-react-native';
import { useGameStore } from '../store/gameStore';
import CodeEditorMobile from '../components/editor/CodeEditorMobile';

const QuestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { questId } = route.params as { questId: string };
  
  const { player, availableQuests, completeQuest, checkPremiumAccess } = useGameStore();
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState<any[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Find the quest by ID
  const quest = availableQuests.find(q => q.id === questId);

  useEffect(() => {
    if (quest) {
      setCode(quest.starterCode);
    }
  }, [quest]);

  const runCode = async () => {
    if (!quest) return;
    
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
      
      const newAttempt = {
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
          navigation.goBack();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Code execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const useHint = (hintId: string) => {
    if (!player || !quest || usedHints.includes(hintId)) return;
    
    const hint = quest.hints.find(h => h.id === hintId);
    if (!hint) return;
    
    if (player.codeCoins >= hint.cost) {
      setUsedHints(prev => [...prev, hintId]);
      // Deduct coins (would update in store)
      console.log(`Used hint: ${hint.content}`);
    }
  };

  const isPremiumQuest = quest?.isPremium || false;
  const hasAccess = !isPremiumQuest || checkPremiumAccess('unlimited-quests');

  if (!quest) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950 items-center justify-center">
        <Text className="text-white text-lg">Quest not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-primary-600 px-4 py-2 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!hasAccess) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950">
        <View className="p-6 items-center justify-center flex-1">
          <Trophy size={64} color="#f59e0b" />
          <Text className="text-2xl font-bold text-white mt-4 mb-2 text-center">Premium Quest</Text>
          <Text className="text-gray-300 text-center mb-6">
            This quest requires a premium subscription to access advanced coding challenges and AI mentorship.
          </Text>
          <View className="space-y-3 w-full">
            <TouchableOpacity className="bg-primary-600 rounded-lg py-3 items-center">
              <Text className="text-white font-bold">Upgrade to Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-transparent border border-gray-600 rounded-lg py-3 items-center"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-white">Back to Free Quests</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{quest.title}</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1">
        {/* Quest Info */}
        <View className="p-4 bg-gray-900 mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <View className={`px-2 py-1 rounded ${
                quest.difficulty === 'beginner' ? 'bg-green-600' :
                quest.difficulty === 'intermediate' ? 'bg-yellow-600' :
                'bg-red-600'
              }`}>
                <Text className="text-white text-xs">{quest.difficulty}</Text>
              </View>
              {isPremiumQuest && (
                <View className="ml-2 px-2 py-1 bg-yellow-600 rounded">
                  <Text className="text-white text-xs">Premium</Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <Star size={14} color="#3b82f6" />
                <Text className="text-blue-400 text-xs ml-1">{quest.xpReward} XP</Text>
              </View>
              <View className="flex-row items-center">
                <Zap size={14} color="#f59e0b" />
                <Text className="text-yellow-400 text-xs ml-1">{quest.coinReward}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#9ca3af" />
                <Text className="text-gray-400 text-xs ml-1">~{quest.estimatedTime}min</Text>
              </View>
            </View>
          </View>
          <Text className="text-gray-300 mb-2">{quest.description}</Text>
        </View>

        {/* Code Editor */}
        <View className="p-4">
          <Text className="text-white font-bold mb-2">Your Code:</Text>
          <CodeEditorMobile
            code={code}
            onChangeCode={setCode}
            language={quest.language}
          />
        </View>

        {/* Test Results */}
        {testResults.length > 0 && (
          <View className="p-4 bg-gray-900 mb-2">
            <Text className="text-white font-bold mb-2">Test Results:</Text>
            <View className="space-y-2">
              {testResults.map((result, index) => (
                <View 
                  key={result.testId}
                  className={`p-3 rounded-lg border ${
                    result.passed
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white">Test {index + 1}</Text>
                    {result.passed ? (
                      <CheckCircle size={16} color="#22c55e" />
                    ) : (
                      <CheckCircle size={16} color="#ef4444" />
                    )}
                  </View>
                  <Text className="text-gray-400 text-sm">
                    {result.passed ? 'Passed' : 'Failed'}
                  </Text>
                </View>
              ))}
            </View>
            <View className="mt-3 items-center">
              <Text className="text-white text-lg font-bold">
                Score: {currentScore}%
              </Text>
              {isCompleted && (
                <View className="mt-2 flex-row items-center">
                  <Trophy size={20} color="#22c55e" />
                  <Text className="text-green-500 ml-2 font-bold">Quest Completed!</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Hints */}
        <View className="p-4 bg-gray-900 mb-2">
          <TouchableOpacity 
            className="flex-row items-center justify-between"
            onPress={() => setShowHints(!showHints)}
          >
            <Text className="text-white font-bold">Hints</Text>
            <Lightbulb size={16} color="#fff" />
          </TouchableOpacity>
          
          {showHints && (
            <View className="mt-3 space-y-2">
              {quest.hints.map((hint) => (
                <View
                  key={hint.id}
                  className={`p-3 rounded-lg border ${
                    usedHints.includes(hint.id)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-white font-medium">Hint {hint.level}</Text>
                    <View className="flex-row items-center">
                      <Text className="text-yellow-400 text-xs mr-2">{hint.cost} coins</Text>
                      {!usedHints.includes(hint.id) && (
                        <TouchableOpacity
                          className="bg-primary-600 px-2 py-1 rounded"
                          onPress={() => useHint(hint.id)}
                          disabled={!player || player.codeCoins < hint.cost}
                        >
                          <Text className="text-white text-xs">Use</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {usedHints.includes(hint.id) && (
                    <Text className="text-gray-300 text-sm">{hint.content}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Run Button */}
        <View className="p-4">
          <TouchableOpacity
            className="bg-primary-600 rounded-lg py-3 items-center"
            onPress={runCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center">
                <Play size={18} color="#fff" />
                <Text className="text-white font-bold ml-2">Run Tests</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestScreen;