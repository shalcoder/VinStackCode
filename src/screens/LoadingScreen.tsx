import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Code2 } from 'lucide-react-native';

const LoadingScreen = () => {
  return (
    <View className="flex-1 bg-gray-950 items-center justify-center">
      <Code2 size={60} color="#0066cc" />
      <Text className="text-white text-xl font-bold mt-4">CodeQuest</Text>
      <ActivityIndicator size="large" color="#0066cc" className="mt-6" />
    </View>
  );
};

export default LoadingScreen;