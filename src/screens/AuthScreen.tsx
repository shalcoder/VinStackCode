import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code2 } from 'lucide-react-native';
import LoginForm from '../components/auth/LoginForm.native';
import RegisterForm from '../components/auth/RegisterForm.native';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 p-6">
            {/* Header */}
            <View className="items-center mb-10 mt-10">
              <Code2 size={60} color="#0066cc" />
              <Text className="text-white text-3xl font-bold mt-4">CodeQuest</Text>
              <Text className="text-primary-400 text-lg">AI-Powered Coding Adventure</Text>
            </View>
            
            {/* Auth Forms */}
            <View className="flex-1 justify-center">
              {isLogin ? (
                <LoginForm onToggleMode={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onToggleMode={() => setIsLogin(true)} />
              )}
            </View>
            
            {/* Features */}
            <View className="mt-8 mb-6">
              <Text className="text-white text-lg font-bold mb-4 text-center">
                Learn to code through play
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
                  <Text className="text-gray-300">Interactive coding quests</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
                  <Text className="text-gray-300">AI-powered voice mentorship</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
                  <Text className="text-gray-300">Earn XP and level up your skills</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
                  <Text className="text-gray-300">Compete in multiplayer challenges</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;