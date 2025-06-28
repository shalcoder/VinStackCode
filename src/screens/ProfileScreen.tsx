import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Trophy, Star, Zap, LogOut, Settings, Crown } from 'lucide-react-native';
import { useAuth } from '../store/authStore';
import { useGameStore } from '../store/gameStore';

const ProfileScreen = () => {
  const { user, profile, signOut } = useAuth();
  const { player } = useGameStore();

  const handleLogout = async () => {
    await signOut();
  };

  if (!user || !player) {
    return (
      <SafeAreaView className="flex-1 bg-gray-950 items-center justify-center">
        <Text className="text-white">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-gray-900 p-6 border-b border-gray-700">
          <View className="items-center">
            <View className="w-24 h-24 bg-primary-600 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-4xl">{player.avatar}</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{player.username}</Text>
            <Text className="text-gray-400">{user.email}</Text>
            
            <View className="flex-row mt-4 space-x-4">
              <View className="items-center">
                <Text className="text-white font-bold text-lg">{player.level}</Text>
                <Text className="text-gray-400 text-xs">Level</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg">{player.experience}</Text>
                <Text className="text-gray-400 text-xs">XP</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg">{player.codeCoins}</Text>
                <Text className="text-gray-400 text-xs">Coins</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg">{player.completedQuests.length}</Text>
                <Text className="text-gray-400 text-xs">Quests</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription */}
        <View className="p-4">
          <View className="bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Crown size={20} color="#f59e0b" />
                <Text className="text-white font-bold ml-2">Free Plan</Text>
              </View>
              <TouchableOpacity className="bg-primary-600 px-3 py-1 rounded-lg">
                <Text className="text-white">Upgrade</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-400 mt-2">Access to 2 free quests. Upgrade to unlock all premium features.</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-3">Your Stats</Text>
          <View className="bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Trophy size={18} color="#f59e0b" />
                <Text className="text-white ml-2">Completed Quests</Text>
              </View>
              <Text className="text-white font-bold">{player.completedQuests.length}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Star size={18} color="#3b82f6" />
                <Text className="text-white ml-2">Total XP Earned</Text>
              </View>
              <Text className="text-white font-bold">{player.experience}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Zap size={18} color="#f59e0b" />
                <Text className="text-white ml-2">CodeCoins Balance</Text>
              </View>
              <Text className="text-white font-bold">{player.codeCoins}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Settings size={18} color="#9ca3af" />
                <Text className="text-white ml-2">Streak Days</Text>
              </View>
              <Text className="text-white font-bold">{player.stats.streakDays}</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-3">Achievements</Text>
          <View className="bg-gray-800 rounded-lg p-4">
            {player.achievements.length > 0 ? (
              <View className="flex-row flex-wrap">
                {player.achievements.map(achievement => (
                  <View key={achievement.id} className="w-1/3 p-2 items-center">
                    <Text className="text-2xl">{achievement.icon}</Text>
                    <Text className="text-white text-center mt-1">{achievement.title}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-6">
                <Trophy size={40} color="#6b7280" />
                <Text className="text-gray-400 mt-2">No achievements yet</Text>
                <Text className="text-gray-500 text-sm">Complete quests to earn achievements</Text>
              </View>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View className="p-4 mb-6">
          <TouchableOpacity 
            className="bg-red-600 rounded-lg py-3 items-center flex-row justify-center"
            onPress={handleLogout}
          >
            <LogOut size={18} color="#fff" />
            <Text className="text-white font-bold ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;