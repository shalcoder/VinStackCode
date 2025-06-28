import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Gamepad2, Trophy, Star, Zap, Crown, Book } from 'lucide-react-native';
import { useGameStore } from '../store/gameStore';
import { useAuth } from '../store/authStore';
import GameWorldMobile from '../components/game/GameWorldMobile';
import AIMentorMobile from '../components/game/AIMentorMobile';

const GameScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { 
    player, 
    availableQuests, 
    initializePlayer, 
    aiMentorActive, 
    activateAIMentor, 
    deactivateAIMentor,
    openQuestModal
  } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);
  const windowWidth = Dimensions.get('window').width;

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

  const handleQuestPress = (quest: any) => {
    openQuestModal(quest);
    // @ts-ignore
    navigation.navigate('Quest', { questId: quest.id });
  };

  if (showIntro) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950">
        <ScrollView className="flex-1 p-6">
          <View className="items-center mb-8">
            <Text className="text-6xl mb-4">🎮</Text>
            <Text className="text-white text-3xl font-bold mb-2 text-center">Welcome to CodeQuest</Text>
            <Text className="text-gray-300 text-xl text-center">The AI-Powered Coding Education Game</Text>
          </View>

          <View className="space-y-6 mb-8">
            <View className="flex-row space-x-3">
              <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                <Star size={16} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">Interactive Learning</Text>
                <Text className="text-gray-400">
                  Master coding through fun, interactive quests and challenges in a gamified environment.
                </Text>
              </View>
            </View>
            
            <View className="flex-row space-x-3">
              <View className="w-8 h-8 bg-green-600 rounded-full items-center justify-center">
                <Zap size={16} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">AI-Powered Mentorship</Text>
                <Text className="text-gray-400">
                  Get personalized guidance from your AI mentor with voice feedback and video tutorials.
                </Text>
              </View>
            </View>
            
            <View className="flex-row space-x-3">
              <View className="w-8 h-8 bg-yellow-600 rounded-full items-center justify-center">
                <Crown size={16} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">Earn & Progress</Text>
                <Text className="text-gray-400">
                  Level up, earn CodeCoins, and unlock achievements as you improve your coding skills.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary-600 rounded-lg py-4 items-center"
            onPress={handleStartGame}
          >
            <Text className="text-white font-bold text-lg">Start Your Coding Adventure</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-xl font-bold">CodeQuest</Text>
            <Text className="text-gray-400">AI-Powered Coding Game</Text>
          </View>
          
          {player && (
            <View className="flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <Crown size={14} color="#f59e0b" />
                <Text className="text-white ml-1">Lvl {player.level}</Text>
              </View>
              <View className="flex-row items-center">
                <Star size={14} color="#3b82f6" />
                <Text className="text-white ml-1">{player.experience} XP</Text>
              </View>
              <View className="flex-row items-center">
                <Zap size={14} color="#f59e0b" />
                <Text className="text-white ml-1">{player.codeCoins}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Game World */}
        <View className="flex-1">
          <GameWorldMobile width={windowWidth} height={300} />
        </View>

        {/* Quests List */}
        <View className="flex-1 p-4">
          <View className="flex-row items-center mb-4">
            <Book size={20} color="#3b82f6" />
            <Text className="text-white text-lg font-bold ml-2">Available Quests</Text>
          </View>
          
          <ScrollView className="flex-1">
            <View className="space-y-3">
              {availableQuests.map(quest => (
                <TouchableOpacity
                  key={quest.id}
                  className={`p-4 rounded-lg border-2 ${
                    quest.isPremium 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-gray-700 bg-gray-800'
                  }`}
                  onPress={() => handleQuestPress(quest)}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-white font-bold text-lg flex-1">{quest.title}</Text>
                    <View className="flex-row items-center">
                      {quest.isPremium && (
                        <Crown size={14} color="#f59e0b" style={{ marginRight: 4 }} />
                      )}
                      <View className={`px-2 py-1 rounded ${
                        quest.difficulty === 'beginner' ? 'bg-green-600' :
                        quest.difficulty === 'intermediate' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}>
                        <Text className="text-white text-xs">{quest.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text className="text-gray-300 mb-3">{quest.description}</Text>
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row space-x-3">
                      <View className="flex-row items-center">
                        <Star size={12} color="#3b82f6" />
                        <Text className="text-blue-400 text-xs ml-1">{quest.xpReward} XP</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Zap size={12} color="#f59e0b" />
                        <Text className="text-yellow-400 text-xs ml-1">{quest.coinReward}</Text>
                      </View>
                      <Text className="text-gray-400 text-xs">~{quest.estimatedTime}min</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* AI Mentor */}
        <AIMentorMobile isActive={aiMentorActive} onToggle={toggleAIMentor} />
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;