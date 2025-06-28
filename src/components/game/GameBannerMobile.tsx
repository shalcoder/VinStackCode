import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Gamepad2, Trophy, Star, Zap, ArrowRight } from 'lucide-react-native';

const GameBannerMobile = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden mb-6">
      <View className="p-6">
        <View className="flex-row items-center space-x-2 mb-3">
          <Gamepad2 size={20} color="#fff" />
          <Text className="text-white font-bold">CodeQuest Game</Text>
          <View className="px-2 py-1 bg-green-600 rounded-full">
            <Text className="text-white text-xs">New!</Text>
          </View>
        </View>
        
        <Text className="text-white text-xl font-bold mb-3">
          Learn to Code Through Play
        </Text>
        
        <Text className="text-blue-100 mb-4">
          Master programming concepts through interactive quests, earn rewards, and get real-time AI mentorship.
        </Text>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="bg-white px-4 py-2 rounded-lg flex-row items-center"
            // @ts-ignore
            onPress={() => navigation.navigate('Game')}
          >
            <Text className="text-blue-600 font-bold">Start Playing</Text>
            <ArrowRight size={16} color="#2563eb" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
        
        <View className="mt-4 bg-white/10 rounded-lg p-3 border border-white/20">
          <Text className="text-white font-bold mb-2">Game Features:</Text>
          <View className="space-y-1">
            <View className="flex-row items-center">
              <Trophy size={14} color="#fbbf24" style={{ marginRight: 6 }} />
              <Text className="text-blue-100">Interactive coding quests</Text>
            </View>
            <View className="flex-row items-center">
              <Star size={14} color="#93c5fd" style={{ marginRight: 6 }} />
              <Text className="text-blue-100">Level up your coding skills</Text>
            </View>
            <View className="flex-row items-center">
              <Zap size={14} color="#fbbf24" style={{ marginRight: 6 }} />
              <Text className="text-blue-100">AI-powered mentorship</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GameBannerMobile;