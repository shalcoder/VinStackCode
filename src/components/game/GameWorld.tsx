import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image } from 'react-konva';
import { motion } from 'framer-motion';
import { Player, GameArea, NPC, Quest } from '../../types/game';
import { useGameStore } from '../../store/gameStore';
import { Crown, Star, Zap, Trophy, Book, Users } from 'lucide-react';
import Button from '../ui/Button';

interface GameWorldProps {
  width: number;
  height: number;
}

const GameWorld: React.FC<GameWorldProps> = ({ width, height }) => {
  const { 
    player, 
    currentArea, 
    availableQuests, 
    updatePlayerPosition,
    startQuest,
    openQuestModal 
  } = useGameStore();

  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [showQuestHub, setShowQuestHub] = useState(false);

  // Handle keyboard input for player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Player movement logic
  useEffect(() => {
    const movePlayer = () => {
      if (!player) return;

      let newX = player.position.x;
      let newY = player.position.y;
      const speed = 3;

      if (keys.has('w') || keys.has('arrowup')) newY -= speed;
      if (keys.has('s') || keys.has('arrowdown')) newY += speed;
      if (keys.has('a') || keys.has('arrowleft')) newX -= speed;
      if (keys.has('d') || keys.has('arrowright')) newX += speed;

      // Boundary checking
      newX = Math.max(25, Math.min(width - 25, newX));
      newY = Math.max(25, Math.min(height - 25, newY));

      if (newX !== player.position.x || newY !== player.position.y) {
        updatePlayerPosition({ x: newX, y: newY });
      }
    };

    const interval = setInterval(movePlayer, 16); // ~60fps
    return () => clearInterval(interval);
  }, [keys, player, width, height, updatePlayerPosition]);

  const handleNPCClick = useCallback((npc: NPC) => {
    setSelectedNPC(npc);
    if (npc.role === 'quest-giver') {
      setShowQuestHub(true);
    }
  }, []);

  const handleQuestStart = useCallback((quest: Quest) => {
    startQuest(quest.id);
    setShowQuestHub(false);
    openQuestModal(quest);
  }, [startQuest, openQuestModal]);

  // Game areas (different zones)
  const gameAreas: GameArea[] = [
    {
      id: 'tutorial-zone',
      name: 'Tutorial Valley',
      description: 'Learn the basics of coding',
      bounds: { x: 0, y: 0, width: 300, height: 200 },
      background: '#4ade80',
      requiredLevel: 1,
      quests: ['intro-variables', 'basic-functions']
    },
    {
      id: 'web-dev-city',
      name: 'Web Development City',
      description: 'Master HTML, CSS, and JavaScript',
      bounds: { x: 300, y: 0, width: 400, height: 300 },
      background: '#3b82f6',
      requiredLevel: 5,
      quests: ['html-basics', 'css-styling', 'js-dom']
    },
    {
      id: 'algorithm-mountains',
      name: 'Algorithm Mountains',
      description: 'Conquer complex algorithms',
      bounds: { x: 0, y: 200, width: 500, height: 300 },
      background: '#8b5cf6',
      requiredLevel: 10,
      quests: ['sorting-algorithms', 'binary-search', 'dynamic-programming']
    }
  ];

  // NPCs in the game world
  const npcs: NPC[] = [
    {
      id: 'mentor-alice',
      name: 'Alice the Mentor',
      role: 'mentor',
      position: { x: 150, y: 100 },
      sprite: '👩‍🏫',
      dialogue: [
        {
          id: 'welcome',
          text: 'Welcome to VinStack Code! I\'m here to guide you on your coding journey.',
          voiceUrl: '/audio/alice-welcome.mp3'
        }
      ]
    },
    {
      id: 'quest-master-bob',
      name: 'Bob the Quest Master',
      role: 'quest-giver',
      position: { x: 400, y: 150 },
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

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Game Canvas */}
      <Stage width={width} height={height}>
        <Layer>
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
              cornerRadius={10}
            />
          ))}

          {/* Area Labels */}
          {gameAreas.map(area => (
            <Text
              key={`${area.id}-label`}
              x={area.bounds.x + 10}
              y={area.bounds.y + 10}
              text={area.name}
              fontSize={16}
              fontFamily="Arial"
              fill="white"
              fontStyle="bold"
            />
          ))}

          {/* NPCs */}
          {npcs.map(npc => (
            <Text
              key={npc.id}
              x={npc.position.x}
              y={npc.position.y}
              text={npc.sprite}
              fontSize={32}
              onClick={() => handleNPCClick(npc)}
              onTap={() => handleNPCClick(npc)}
            />
          ))}

          {/* Player */}
          {player && (
            <Circle
              x={player.position.x}
              y={player.position.y}
              radius={20}
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth={3}
            />
          )}

          {/* Player Avatar */}
          {player && (
            <Text
              x={player.position.x - 10}
              y={player.position.y - 8}
              text="🧑‍💻"
              fontSize={20}
            />
          )}
        </Layer>
      </Stage>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg">
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center space-x-1">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>Level {player?.level || 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span>{player?.experience || 0} XP</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>{player?.codeCoins || 0} Coins</span>
          </div>
        </div>
        <div className="text-xs text-gray-300">
          Use WASD or arrow keys to move
        </div>
      </div>

      {/* Quest Hub Modal */}
      {showQuestHub && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setShowQuestHub(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Book className="w-6 h-6 mr-2 text-blue-500" />
                Available Quests
              </h2>
              <button
                onClick={() => setShowQuestHub(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4">
              {availableQuests.map(quest => (
                <motion.div
                  key={quest.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    quest.isPremium 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-gray-700 bg-gray-800 hover:border-blue-500'
                  }`}
                  onClick={() => handleQuestStart(quest)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
                    <div className="flex items-center space-x-2">
                      {quest.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        quest.difficulty === 'beginner' ? 'bg-green-600 text-green-100' :
                        quest.difficulty === 'intermediate' ? 'bg-yellow-600 text-yellow-100' :
                        'bg-red-600 text-red-100'
                      }`}>
                        {quest.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{quest.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-blue-400">
                        <Star className="w-3 h-3" />
                        <span>{quest.xpReward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Zap className="w-3 h-3" />
                        <span>{quest.coinReward} Coins</span>
                      </div>
                      <span className="text-gray-400">~{quest.estimatedTime}min</span>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuestStart(quest);
                      }}
                    >
                      Start Quest
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {availableQuests.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No quests available at your current level.</p>
                <p className="text-sm">Complete more quests to unlock new challenges!</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* NPC Dialogue */}
      {selectedNPC && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-gray-900 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{selectedNPC.sprite}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{selectedNPC.name}</h3>
              <p className="text-gray-300 text-sm">
                {selectedNPC.dialogue[0]?.text}
              </p>
            </div>
            <button
              onClick={() => setSelectedNPC(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Controls Help */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs">
        <div className="mb-1">🎮 Controls:</div>
        <div>WASD / Arrow Keys - Move</div>
        <div>Click NPCs - Interact</div>
        <div>Space - Open Quest Hub</div>
      </div>
    </div>
  );
};

export default GameWorld;