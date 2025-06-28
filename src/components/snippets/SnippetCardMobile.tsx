import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, Heart, Calendar, User } from 'lucide-react-native';
import { formatRelativeTime, truncateText } from '../../utils';
import { CODE_LANGUAGES } from '../../utils/constants';

interface SnippetCardMobileProps {
  snippet: any;
  onPress: () => void;
}

const SnippetCardMobile: React.FC<SnippetCardMobileProps> = ({
  snippet,
  onPress,
}) => {
  const language = CODE_LANGUAGES.find(lang => lang.id === snippet.language);
  const likesCount = snippet.snippet_likes?.[0]?.count || 0;
  const viewsCount = snippet.snippet_views?.[0]?.count || 0;
  
  return (
    <TouchableOpacity
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"
      onPress={onPress}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white font-bold text-lg flex-1">{snippet.title}</Text>
        {language && (
          <View className="px-2 py-1 rounded bg-opacity-20" style={{ backgroundColor: `${language.color}20` }}>
            <Text style={{ color: language.color }}>{language.name}</Text>
          </View>
        )}
      </View>
      
      {/* Description */}
      {snippet.description && (
        <Text className="text-gray-400 mb-3">{truncateText(snippet.description, 100)}</Text>
      )}
      
      {/* Tags */}
      {snippet.tags && snippet.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {snippet.tags.slice(0, 3).map((tag: string) => (
            <View key={tag} className="bg-gray-700 rounded-full px-2 py-1 mr-2 mb-1">
              <Text className="text-gray-300 text-xs">#{tag}</Text>
            </View>
          ))}
          {snippet.tags.length > 3 && (
            <View className="bg-gray-700 rounded-full px-2 py-1">
              <Text className="text-gray-300 text-xs">+{snippet.tags.length - 3}</Text>
            </View>
          )}
        </View>
      )}
      
      {/* Code Preview */}
      <View className="bg-gray-900 rounded-lg p-3 mb-3">
        <Text className="text-gray-300 font-mono">
          {truncateText(snippet.content, 100)}
        </Text>
      </View>
      
      {/* Footer */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <User size={14} color="#9ca3af" />
          <Text className="text-gray-400 ml-1 text-sm">{snippet.profiles?.username || 'Unknown'}</Text>
        </View>
        
        <View className="flex-row space-x-3">
          <View className="flex-row items-center">
            <Eye size={14} color="#9ca3af" />
            <Text className="text-gray-400 ml-1 text-sm">{viewsCount}</Text>
          </View>
          <View className="flex-row items-center">
            <Heart size={14} color="#9ca3af" />
            <Text className="text-gray-400 ml-1 text-sm">{likesCount}</Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={14} color="#9ca3af" />
            <Text className="text-gray-400 ml-1 text-sm">{formatRelativeTime(new Date(snippet.updated_at))}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SnippetCardMobile;