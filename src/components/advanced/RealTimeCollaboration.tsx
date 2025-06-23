import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wifi, WifiOff, Crown, Edit, Eye, MessageCircle } from 'lucide-react';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { COLLABORATION_COLORS } from '../../utils/constants';

interface RealTimeCollaborationProps {
  snippetId: string;
  onCursorMove?: (position: { line: number; column: number }) => void;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  snippetId,
  onCursorMove,
}) => {
  const { user } = useSupabaseAuth();
  const {
    collaborators,
    activeCursors,
    isConnected,
    loading,
    broadcastCursorPosition,
  } = useCollaboration(snippetId);

  const [showCollaborators, setShowCollaborators] = useState(false);

  const handleCursorMove = useCallback((line: number, column: number) => {
    if (user && isConnected) {
      broadcastCursorPosition({ line, column });
      onCursorMove?.({ line, column });
    }
  }, [user, isConnected, broadcastCursorPosition, onCursorMove]);

  const getCollaboratorColor = (userId: string) => {
    const index = collaborators.findIndex(c => c.user_id === userId);
    return COLLABORATION_COLORS[index % COLLABORATION_COLORS.length];
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'editor':
        return <Edit className="w-3 h-3 text-green-500" />;
      case 'commenter':
        return <MessageCircle className="w-3 h-3 text-blue-500" />;
      default:
        return <Eye className="w-3 h-3 text-gray-500" />;
    }
  };

  const activeCollaborators = collaborators.filter(c => c.accepted_at);
  const onlineCount = activeCursors.length + (user ? 1 : 0);

  return (
    <div className="relative">
      {/* Connection Status & Collaborator Count */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCollaborators(!showCollaborators)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isConnected
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <Users className="w-4 h-4" />
        <span>{onlineCount}</span>
        {onlineCount > 1 && <span>online</span>}
      </motion.button>

      {/* Collaborators Panel */}
      <AnimatePresence>
        {showCollaborators && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Collaborators</h3>
                <div className={`flex items-center space-x-1 text-sm ${
                  isConnected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isConnected ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4 text-gray-400">
                  Loading collaborators...
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Current User */}
                  {user && (
                    <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: getCollaboratorColor(user.id) }}
                      >
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            You
                          </span>
                          {getRoleIcon('owner')}
                        </div>
                        <span className="text-xs text-gray-400">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                  )}

                  {/* Other Collaborators */}
                  {activeCollaborators.map((collaborator) => {
                    const isOnline = activeCursors.some(cursor => cursor.userId === collaborator.user_id);
                    
                    return (
                      <motion.div
                        key={collaborator.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: getCollaboratorColor(collaborator.user_id) }}
                        >
                          {collaborator.profiles.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">
                              {collaborator.profiles.username}
                            </span>
                            {getRoleIcon(collaborator.role)}
                          </div>
                          <span className="text-xs text-gray-400 capitalize">
                            {collaborator.role}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            isOnline ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          <span className={`text-xs ${
                            isOnline ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {activeCollaborators.length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      No other collaborators yet
                    </div>
                  )}
                </div>
              )}

              {/* Active Cursors Info */}
              {activeCursors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Active Cursors
                  </h4>
                  <div className="space-y-1">
                    {activeCursors.map((cursor) => (
                      <div
                        key={cursor.userId}
                        className="flex items-center space-x-2 text-xs"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cursor.color }}
                        ></div>
                        <span className="text-gray-300">{cursor.username}</span>
                        <span className="text-gray-400">
                          Line {cursor.line}, Col {cursor.column}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor Overlays (would be rendered in the editor) */}
      <div className="absolute inset-0 pointer-events-none">
        {activeCursors.map((cursor) => (
          <motion.div
            key={cursor.userId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-0.5 h-5 z-10"
            style={{
              backgroundColor: cursor.color,
              // Position would be calculated based on line/column
              // This is a simplified representation
            }}
          >
            <div
              className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.username}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeCollaboration;