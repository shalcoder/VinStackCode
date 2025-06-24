import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Clock, Code, Play, Crown, User, ArrowRight, MessageSquare } from 'lucide-react';
import { socketService } from '../../services/socketService';
import { useGameStore } from '../../store/gameStore';
import { MultiplayerSession, Player, Quest } from '../../types/game';
import Button from '../ui/Button';
import CodeEditor from '../editor/CodeEditor';

interface MultiplayerArenaProps {
  onClose: () => void;
}

const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({ onClose }) => {
  const { player, checkPremiumAccess, availableQuests } = useGameStore();
  const [activeSessions, setActiveSessions] = useState<MultiplayerSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<MultiplayerSession | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [sessionType, setSessionType] = useState<'race' | 'collaboration'>('race');
  const [code, setCode] = useState('');
  const [chatMessages, setChatMessages] = useState<{user: string; message: string; timestamp: Date}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Mock multiplayer sessions
  useEffect(() => {
    const mockSessions: MultiplayerSession[] = [
      {
        id: 'session1',
        type: 'race',
        participants: [
          {
            id: 'player1',
            username: 'CodeNinja',
            level: 15,
            experience: 15000,
            codeCoins: 2500,
            position: { x: 0, y: 0 },
            avatar: '👨‍💻',
            completedQuests: [],
            achievements: [],
            stats: {
              questsCompleted: 45,
              totalXP: 15000,
              streakDays: 12,
              averageScore: 85,
              timeSpent: 3600,
              languagesMastered: ['javascript', 'html', 'css']
            }
          },
          {
            id: 'player2',
            username: 'AlgoMaster',
            level: 12,
            experience: 12000,
            codeCoins: 1800,
            position: { x: 0, y: 0 },
            avatar: '👩‍💻',
            completedQuests: [],
            achievements: [],
            stats: {
              questsCompleted: 32,
              totalXP: 12000,
              streakDays: 8,
              averageScore: 78,
              timeSpent: 2800,
              languagesMastered: ['javascript', 'python']
            }
          }
        ],
        quest: availableQuests[0],
        startTime: new Date(Date.now() - 120000), // 2 minutes ago
        status: 'active'
      },
      {
        id: 'session2',
        type: 'collaboration',
        participants: [
          {
            id: 'player3',
            username: 'WebWizard',
            level: 18,
            experience: 18500,
            codeCoins: 3200,
            position: { x: 0, y: 0 },
            avatar: '🧙‍♂️',
            completedQuests: [],
            achievements: [],
            stats: {
              questsCompleted: 52,
              totalXP: 18500,
              streakDays: 15,
              averageScore: 92,
              timeSpent: 4500,
              languagesMastered: ['javascript', 'html', 'css', 'react']
            }
          }
        ],
        quest: availableQuests[3],
        startTime: new Date(Date.now() - 300000), // 5 minutes ago
        status: 'waiting'
      }
    ];
    
    setActiveSessions(mockSessions);
  }, [availableQuests]);

  // Connect to socket service
  useEffect(() => {
    if (player) {
      socketService.connect(player.id, {
        username: player.username,
        level: player.level,
        avatar: player.avatar
      });
      
      // Listen for new sessions
      socketService.on('multiplayer:update', (session) => {
        setActiveSessions(prev => {
          const index = prev.findIndex(s => s.id === session.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = session;
            return updated;
          }
          return [...prev, session];
        });
      });
      
      // Listen for chat messages
      socketService.on('multiplayer:chat', (sessionId, playerId, message) => {
        if (selectedSession?.id === sessionId) {
          const sender = selectedSession.participants.find(p => p.id === playerId);
          if (sender) {
            setChatMessages(prev => [
              ...prev,
              {
                user: sender.username,
                message,
                timestamp: new Date()
              }
            ]);
          }
        }
      });
      
      return () => {
        socketService.off('multiplayer:update');
        socketService.off('multiplayer:chat');
      };
    }
  }, [player, selectedSession]);

  // Create a new multiplayer session
  const createSession = () => {
    if (!player || !selectedQuest) return;
    
    const newSession: MultiplayerSession = {
      id: `session_${Date.now()}`,
      type: sessionType,
      participants: [player],
      quest: selectedQuest,
      startTime: new Date(),
      status: 'waiting'
    };
    
    setActiveSessions(prev => [...prev, newSession]);
    setSelectedSession(newSession);
    setIsCreatingSession(false);
    
    // Emit socket event
    socketService.emit('multiplayer:create', newSession);
  };

  // Join an existing session
  const joinSession = (session: MultiplayerSession) => {
    if (!player) return;
    
    // Add player to session
    const updatedSession = {
      ...session,
      participants: [...session.participants, player]
    };
    
    setActiveSessions(prev => 
      prev.map(s => s.id === session.id ? updatedSession : s)
    );
    
    setSelectedSession(updatedSession);
    
    // Set initial code from quest
    setCode(session.quest.starterCode);
    
    // Emit socket event
    socketService.emit('multiplayer:join', session.id, player);
    
    // Add system message to chat
    setChatMessages(prev => [
      ...prev,
      {
        user: 'System',
        message: `${player.username} joined the session`,
        timestamp: new Date()
      }
    ]);
  };

  // Leave the current session
  const leaveSession = () => {
    if (!player || !selectedSession) return;
    
    // Remove player from session
    const updatedSession = {
      ...selectedSession,
      participants: selectedSession.participants.filter(p => p.id !== player.id)
    };
    
    setActiveSessions(prev => 
      prev.map(s => s.id === selectedSession.id ? updatedSession : s)
    );
    
    setSelectedSession(null);
    
    // Emit socket event
    socketService.emit('multiplayer:leave', selectedSession.id, player.id);
  };

  // Start the session countdown
  const startSession = () => {
    if (!selectedSession) return;
    
    // Start countdown
    setCountdown(5);
    
    // Update session status
    const updatedSession = {
      ...selectedSession,
      status: 'active',
      startTime: new Date(Date.now() + 5000) // Start in 5 seconds
    };
    
    setActiveSessions(prev => 
      prev.map(s => s.id === selectedSession.id ? updatedSession : s)
    );
    
    setSelectedSession(updatedSession);
    
    // Emit socket event
    socketService.emit('multiplayer:update', updatedSession);
    
    // Add system message to chat
    setChatMessages(prev => [
      ...prev,
      {
        user: 'System',
        message: 'The session will start in 5 seconds!',
        timestamp: new Date()
      }
    ]);
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send a chat message
  const sendChatMessage = () => {
    if (!player || !selectedSession || !newMessage.trim()) return;
    
    // Add message to chat
    setChatMessages(prev => [
      ...prev,
      {
        user: player.username,
        message: newMessage.trim(),
        timestamp: new Date()
      }
    ]);
    
    // Emit socket event
    socketService.emit('multiplayer:chat', selectedSession.id, player.id, newMessage.trim());
    
    // Clear input
    setNewMessage('');
  };

  // Check if premium access is required
  const isPremiumRequired = !checkPremiumAccess('multiplayer');

  if (isPremiumRequired) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Multiplayer Arena</h2>
            <p className="text-gray-400">Compete and collaborate with other coders</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-8 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white mb-4">Premium Feature</h3>
            <p className="text-yellow-100 mb-6 max-w-lg mx-auto">
              Multiplayer coding challenges are available exclusively for premium members. Upgrade now to compete and collaborate with coders worldwide!
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" size="lg">
                Upgrade to Premium
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10" onClick={onClose}>
                Back to Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Creating a new session
  if (isCreatingSession) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Multiplayer Session</h2>
              <p className="text-gray-400">Set up a coding challenge for others to join</p>
            </div>
            <Button variant="outline" onClick={() => setIsCreatingSession(false)}>
              Back to Sessions
            </Button>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Session Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  sessionType === 'race' 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
                onClick={() => setSessionType('race')}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h4 className="text-lg font-medium text-white">Code Race</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Race against other players to solve the coding challenge first. The fastest correct solution wins!
                </p>
              </div>
              
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  sessionType === 'collaboration' 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
                onClick={() => setSessionType('collaboration')}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <h4 className="text-lg font-medium text-white">Collaboration</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Work together with other players to solve a complex challenge. Share ideas and code in real-time.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-4">Select Challenge</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableQuests.map(quest => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedQuest?.id === quest.id 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedQuest(quest)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-medium text-white">{quest.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      quest.difficulty === 'beginner' ? 'bg-green-600 text-green-100' :
                      quest.difficulty === 'intermediate' ? 'bg-yellow-600 text-yellow-100' :
                      'bg-red-600 text-red-100'
                    }`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{quest.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-blue-400">
                      <Clock className="w-3 h-3" />
                      <span>~{quest.estimatedTime}min</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Code className="w-3 h-3" />
                      <span>{quest.language}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                onClick={createSession}
                disabled={!selectedQuest}
              >
                Create Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session detail view
  if (selectedSession) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3">
                {selectedSession.type === 'race' ? (
                  <Trophy className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Users className="w-6 h-6 text-green-500" />
                )}
                <h2 className="text-2xl font-bold text-white">
                  {selectedSession.type === 'race' ? 'Code Race' : 'Collaborative Coding'}
                </h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedSession.status === 'waiting' ? 'bg-blue-600 text-blue-100' :
                  selectedSession.status === 'active' ? 'bg-green-600 text-green-100' :
                  'bg-gray-600 text-gray-100'
                }`}>
                  {selectedSession.status === 'waiting' ? 'Waiting for players' :
                   selectedSession.status === 'active' ? 'In progress' :
                   'Completed'}
                </span>
              </div>
              <p className="text-gray-400 mt-1">
                Challenge: {selectedSession.quest.title} ({selectedSession.quest.difficulty})
              </p>
            </div>
            
            <Button variant="outline" onClick={() => {
              leaveSession();
            }}>
              Leave Session
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code Editor */}
            <div className="lg:col-span-2 space-y-4">
              {countdown !== null && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-primary-600 text-white text-center py-4 rounded-lg mb-4"
                >
                  <div className="text-3xl font-bold">Starting in {countdown}</div>
                </motion.div>
              )}
              
              <CodeEditor
                value={code}
                onChange={setCode}
                language={selectedSession.quest.language}
                height="500px"
              />
              
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-gray-300">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {selectedSession.status === 'waiting' ? 'Not started' : 
                     formatElapsedTime(new Date(selectedSession.startTime))}
                  </div>
                  <div className="text-gray-300">
                    <Users className="w-4 h-4 inline mr-1" />
                    {selectedSession.participants.length} participants
                  </div>
                </div>
                
                {selectedSession.status === 'waiting' && 
                 selectedSession.participants.some(p => p.id === player?.id) &&
                 selectedSession.participants[0].id === player?.id && (
                  <Button
                    variant="primary"
                    onClick={startSession}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Challenge
                  </Button>
                )}
                
                {selectedSession.status === 'active' && (
                  <Button
                    variant="primary"
                    disabled={!code.trim()}
                  >
                    Submit Solution
                  </Button>
                )}
              </div>
            </div>
            
            {/* Participants & Chat */}
            <div className="space-y-6">
              {/* Participants */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Participants</h3>
                <div className="space-y-2">
                  {selectedSession.participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-white">{participant.avatar}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-white font-medium">{participant.username}</span>
                            {index === 0 && <Crown className="w-3 h-3 text-yellow-500" />}
                          </div>
                          <span className="text-xs text-gray-400">Level {participant.level}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedSession.status === 'active' ? 'Coding...' : 'Ready'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Chat */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-80">
                <h3 className="text-lg font-semibold text-white mb-3">Chat</h3>
                <div className="flex-1 overflow-y-auto mb-3 space-y-2">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex items-start space-x-2 ${msg.user === 'System' ? 'opacity-70' : ''}`}>
                      {msg.user === 'System' ? (
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-xs">S</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${msg.user === 'System' ? 'text-gray-400' : 'text-white'}`}>
                            {msg.user}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={sendChatMessage}
                    disabled={!newMessage.trim()}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session list view
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Multiplayer Arena</h2>
            <p className="text-gray-400">Compete and collaborate with other coders</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreatingSession(true)}
          >
            Create New Session
          </Button>
        </div>

        {/* Active Sessions */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Active Sessions</h3>
          
          {activeSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.map(session => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {session.type === 'race' ? (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Users className="w-5 h-5 text-green-500" />
                      )}
                      <h4 className="text-lg font-semibold text-white">
                        {session.type === 'race' ? 'Code Race' : 'Collaboration'}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      session.status === 'waiting' ? 'bg-blue-600 text-blue-100' :
                      session.status === 'active' ? 'bg-green-600 text-green-100' :
                      'bg-gray-600 text-gray-100'
                    }`}>
                      {session.status === 'waiting' ? 'Waiting' :
                       session.status === 'active' ? 'In progress' :
                       'Completed'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-white font-medium mb-1">{session.quest.title}</div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={`px-2 py-0.5 rounded ${
                        session.quest.difficulty === 'beginner' ? 'bg-green-600/20 text-green-400' :
                        session.quest.difficulty === 'intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {session.quest.difficulty}
                      </span>
                      <span className="text-gray-400">{session.quest.language}</span>
                      <span className="text-gray-400">~{session.quest.estimatedTime}min</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Participants ({session.participants.length}):</div>
                    <div className="flex -space-x-2">
                      {session.participants.map((participant, index) => (
                        <div
                          key={participant.id}
                          className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center border-2 border-gray-800"
                          title={participant.username}
                        >
                          <span className="text-white text-xs">{participant.avatar}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTimeAgo(session.startTime)}
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => joinSession(session)}
                      disabled={session.status === 'completed' || session.participants.some(p => p.id === player?.id)}
                    >
                      {session.participants.some(p => p.id === player?.id) ? 'Rejoin' : 'Join'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
              <h4 className="text-xl font-semibold text-white mb-2">No Active Sessions</h4>
              <p className="text-gray-400 mb-6">Be the first to create a multiplayer coding session!</p>
              <Button
                variant="primary"
                onClick={() => setIsCreatingSession(true)}
              >
                Create Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format elapsed time
function formatElapsedTime(startTime: Date): string {
  const elapsed = Date.now() - startTime.getTime();
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default MultiplayerArena;