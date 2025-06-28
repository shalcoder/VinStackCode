import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Volume2, Bell, Moon, Sun, Globe, Code, Info, Shield } from 'lucide-react-native';
import { useAuth } from '../store/authStore';

const SettingsScreen = () => {
  const { user, profile, updateProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(profile?.theme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleToggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    if (profile) {
      try {
        await updateProfile({ theme: value ? 'dark' : 'light' });
      } catch (error) {
        console.error('Failed to update theme:', error);
        // Revert UI state if update fails
        setDarkMode(!value);
      }
    }
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotifications(value);
    // In a real app, would update user preferences in database
  };

  const handleToggleSound = (value: boolean) => {
    setSoundEnabled(value);
    // In a real app, would update user preferences in database
  };

  const handleToggleAutoSave = (value: boolean) => {
    setAutoSave(value);
    // In a real app, would update user preferences in database
  };

  const showAboutInfo = () => {
    Alert.alert(
      'About CodeQuest',
      'Version 1.0.0\n\nCodeQuest is an AI-powered coding education game built for the World\'s Largest Hackathon. Learn to code through interactive quests with AI mentorship.\n\n© 2025 CodeQuest Team',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="bg-gray-900 border-b border-gray-700 px-4 py-3">
        <Text className="text-white text-xl font-bold">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Appearance */}
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-3">Appearance</Text>
          <View className="bg-gray-800 rounded-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
              <View className="flex-row items-center">
                {darkMode ? (
                  <Moon size={20} color="#9ca3af" />
                ) : (
                  <Sun size={20} color="#f59e0b" />
                )}
                <Text className="text-white ml-3">Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: '#4b5563', true: '#0066cc' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-3">Notifications</Text>
          <View className="bg-gray-800 rounded-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
              <View className="flex-row items-center">
                <Bell size={20} color="#9ca3af" />
                <Text className="text-white ml-3">Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#4b5563', true: '#0066cc' }}
                thumbColor="#fff"
              />
            </View>
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center">
                <Volume2 size={20} color="#9ca3af" />
                <Text className="text-white ml-3">Sound Effects</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ false: '#4b5563', true: '#0066cc' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Editor Settings */}
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-3">Editor Settings</Text>
          <View className="bg-gray-800 rounded-lg">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
              <View className="flex-row items-center">
                <Code size={20} color="#9ca3af" />
                <Text className="text-white ml-3">Auto-Save Code</Text>
              </View>
              <Switch
                value={autoSave}
                onValueChange={handleToggleAutoSave}
                trackColor={{ false: '#4b5563', true: '#0066cc' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View className="p-4">
          <Text className="text-white font-bold text-lg mb-3">About</Text>
          <View className="bg-gray-800 rounded-lg">
            <TouchableOpacity 
              className="flex-row justify-between items-center p-4 border-b border-gray-700"
              onPress={showAboutInfo}
            >
              <View className="flex-row items-center">
                <Info size={20} color="#9ca3af" />
                <Text className="text-white ml-3">About CodeQuest</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row justify-between items-center p-4 border-b border-gray-700">
              <View className="flex-row items-center">
                <Shield size={20} color="#9ca3af" />
                <Text className="text-white ml-3">Privacy Policy</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row justify-between items-center p-4">
              <View className="flex-row items-center">
                <Globe size={20} color="#9ca3af" />
                <Text className="text-white ml-3">Terms of Service</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View className="p-4 items-center">
          <Text className="text-gray-500">CodeQuest v1.0.0</Text>
          <Text className="text-gray-500 text-xs mt-1">Built for the World's Largest Hackathon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;