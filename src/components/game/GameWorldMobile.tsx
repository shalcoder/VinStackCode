import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText } from 'react-native-svg';
import { useGameStore } from '../../store/gameStore';
import { Crown, Star, Zap } from 'lucide-react-native';

interface GameWorldMobileProps {
  width: number;
  height: number;
}

const GameWorldMobile: React.FC<GameWorldMobileProps> = ({ width, height }) => {
  const { 
    player, 
    currentArea, 
    updatePlayerPosition,
    changeArea
  } = useGameStore();

  const [selectedNPC, setSelectedNPC] = useState<any | null>(null);

  // Game areas (different zones)
  const gameAreas = [
    {
      id: 'tutorial-valley',
      name: 'Tutorial Valley',
      description: 'Learn the basics of coding',
      bounds: { x: 0, y: 0, width: 150, height: 100 },
      background: '#4ade80',
      requiredLevel: 1,
      quests: ['intro-variables', 'basic-functions']
    },
    {
      id: 'web-dev-city',
      name: 'Web Development City',
      description: 'Master HTML, CSS, and JavaScript',
      bounds: { x: 150, y: 0, width: 200, height: 150 },
      background: '#3b82f6',
      requiredLevel: 5,
      quests: ['html-basics', 'css-styling', 'js-dom']
    },
    {
      id: 'algorithm-mountains',
      name: 'Algorithm Mountains',
      description: 'Conquer complex algorithms',
      bounds: { x: 0, y: 100, width: 250, height: 150 },
      background: '#8b5cf6',
      requiredLevel: 10,
      quests: ['sorting-algorithms', 'binary-search', 'dynamic-programming']
    }
  ];

  // NPCs in the game world
  const npcs = [
    {
      id: 'mentor-alice',
      name: 'Alice the Mentor',
      role: 'mentor',
      position: { x: 75, y: 50 },
      sprite: '👩‍🏫',
      dialogue: [
        {
          id: 'welcome',
          text: 'Welcome to CodeQuest! I\'m here to guide you on your coding journey.',
          voiceUrl: '/audio/alice-welcome.mp3'
        }
      ]
    },
    {
      id: 'quest-master-bob',
      name: 'Bob the Quest Master',
      role: 'quest-giver',
      position: { x: 200, y: 75 },
      sprite: '🧙‍♂️',
      dialogue: [
        {
          id: 'quests-available',
          text: 'Ready for a challenge? I have some exciting coding quests for you!',
          voiceUrl: '/audio/bob-quests.mp3'
        }
      ],
      quests: ['intro-variables', 'basic-functions', 'html-basics']
    }
  ];

  const handleNPCPress = (npc: any) => {
    setSelectedNPC(npc);
  };

  const handleAreaPress = (area: any) => {
    if (player && player.level >= area.requiredLevel) {
      changeArea(area.id);
    }
  };

  return (
    <View className="bg-gray-950 rounded-lg overflow-hidden">
      {/* Game Canvas */}
      <Svg width={width} height={height}>
        {/* Game Areas */}
        {gameAreas.map(area => (
          <Rect
            key={area.id}
            x={area.bounds.x}
            y={area.bounds.y}
            width={area.bounds.width}
            height={area.bounds.height}
            fill={area.background}
            opacity={0.3}
            rx={10}
            ry={10}
            onPress={() => handleAreaPress(area)}
          />
        ))}

        {/* Area Labels */}
        {gameAreas.map(area => (
          <SvgText
            key={`${area.id}-label`}
            x={area.bounds.x + 10}
            y={area.bounds.y + 20}
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {area.name}
          </SvgText>
        ))}

        {/* NPCs */}
        {npcs.map(npc => (
          <SvgText
            key={npc.id}
            x={npc.position.x}
            y={npc.position.y}
            fontSize="32"
            onPress={() => handleNPCPress(npc)}
          >
            {npc.sprite}
          </SvgText>
        ))}

        {/* Player */}
        {player && (
          <Circle
            cx={player.position.x}
            cy={player.position.y}
            r={20}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth={3}
          />
        )}

        {/* Player Avatar */}
        {player && (
          <SvgText
            x={player.position.x - 10}
            y={player.position.y + 8}
            fontSize="20"
          >
            🧑‍💻
          </SvgText>
        )}
      </Svg>

      {/* UI Overlay */}
      <View className="absolute top-4 left-4 bg-black/80 p-3 rounded-lg">
        <View className="flex-row items-center space-x-3 mb-1">
          <View className="flex-row items-center">
            <Crown size={14} color="#f59e0b" />
            <Text className="text-white ml-1">Level {player?.level || 1}</Text>
          </View>
          <View className="flex-row items-center">
            <Star size={14} color="#3b82f6" />
            <Text className="text-white ml-1">{player?.experience || 0} XP</Text>
          </View>
        </View>
        <Text className="text-gray-300 text-xs">Tap NPCs to interact</Text>
      </View>

      {/* NPC Dialogue */}
      {selectedNPC && (
        <View className="absolute bottom-4 left-4 right-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
          <View className="flex-row items-start space-x-3">
            <Text className="text-2xl">{selectedNPC.sprite}</Text>
            <View className="flex-1">
              <Text className="font-bold text-white mb-1">{selectedNPC.name}</Text>
              <Text className="text-gray-300 text-sm">
                {selectedNPC.dialogue[0]?.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedNPC(null)}>
              <Text className="text-gray-400">✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default GameWorldMobile;