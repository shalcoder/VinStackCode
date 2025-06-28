import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, Search, Filter, Grid, List } from 'lucide-react-native';
import { useAuth } from '../store/authStore';
import { useSnippets } from '../store/snippetStore';
import SnippetCardMobile from '../components/snippets/SnippetCardMobile';
import GameBannerMobile from '../components/game/GameBannerMobile';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { snippets, loading, fetchSnippets } = useSnippets();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');

  useEffect(() => {
    fetchSnippets({
      visibility: activeTab === 'my-snippets' ? undefined : 'public',
      ownerId: activeTab === 'my-snippets' ? user?.id : undefined,
    });
  }, [activeTab, fetchSnippets, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSnippets({
      visibility: activeTab === 'my-snippets' ? undefined : 'public',
      ownerId: activeTab === 'my-snippets' ? user?.id : undefined,
    });
    setRefreshing(false);
  };

  const handleViewSnippet = (snippet: any) => {
    // @ts-ignore
    navigation.navigate('SnippetView', { snippetId: snippet.id });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-700 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold">CodeQuest</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="p-2">
              <Search size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-700 bg-gray-900">
        {['explore', 'my-snippets', 'favorites'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`py-3 px-4 ${activeTab === tab ? 'border-b-2 border-primary-500' : ''}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`${activeTab === tab ? 'text-primary-500' : 'text-gray-400'} capitalize`}>
              {tab.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <FlatList
        data={snippets}
        renderItem={({ item }) => (
          <SnippetCardMobile
            snippet={item}
            onPress={() => handleViewSnippet(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<GameBannerMobile />}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-400 text-lg">No snippets found</Text>
            <Text className="text-gray-500 mt-2">
              {activeTab === 'my-snippets' 
                ? "Create your first snippet to get started!"
                : "Try adjusting your search filters."
              }
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0066cc"
            colors={["#0066cc"]}
          />
        }
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;