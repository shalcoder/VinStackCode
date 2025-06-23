import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Eye, Edit, Crown, Shield, User as UserIcon } from 'lucide-react';
import { User, Comment } from '../../types';
import { COLLABORATION_COLORS } from '../../utils/constants';
import Button from '../ui/Button';

interface CollaborationPanelProps {
  snippetId: string;
  collaborators: User[];
  comments: Comment[];
  currentUser: User;
  onAddComment: (content: string, lineNumber?: number) => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onResolveComment: (commentId: string) => void;
  onInviteCollaborator: (email: string) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  snippetId,
  collaborators,
  comments,
  currentUser,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onResolveComment,
  onInviteCollaborator,
}) => {
  const [activeTab, setActiveTab] = useState<'collaborators' | 'comments'>('collaborators');
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editingComment && editContent.trim()) {
      onUpdateComment(editingComment, editContent.trim());
      setEditingComment(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteCollaborator(inviteEmail.trim());
      setInviteEmail('');
    }
  };

  const getCollaboratorColor = (userId: string) => {
    const index = collaborators.findIndex(c => c.id === userId);
    return COLLABORATION_COLORS[index % COLLABORATION_COLORS.length];
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-green-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const unresolvedComments = comments.filter(c => !c.isResolved);
  const resolvedComments = comments.filter(c => c.isResolved);

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('collaborators')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'collaborators'
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Collaborators</span>
            <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
              {collaborators.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'comments'
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comments</span>
            <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
              {unresolvedComments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'collaborators' ? (
            <motion.div
              key="collaborators"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              {/* Invite Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Invite Collaborator</h3>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                  >
                    Invite
                  </Button>
                </div>
              </div>

              {/* Collaborators List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Active Collaborators</h3>
                <div className="space-y-2">
                  {collaborators.map((collaborator) => (
                    <motion.div
                      key={collaborator.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: getCollaboratorColor(collaborator.id) }}
                      >
                        {collaborator.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-200 truncate">
                            {collaborator.username}
                          </span>
                          {getRoleIcon('editor')}
                        </div>
                        <span className="text-xs text-gray-400 truncate">
                          {collaborator.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">Online</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="comments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              {/* Add Comment */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Add Comment</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none text-sm resize-none"
                    rows={3}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {unresolvedComments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">
                      Open Comments ({unresolvedComments.length})
                    </h3>
                    <div className="space-y-3">
                      {unresolvedComments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                              style={{ backgroundColor: getCollaboratorColor(comment.authorId) }}
                            >
                              {comment.author.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-gray-200">
                                  {comment.author.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                {comment.lineNumber && (
                                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                                    Line {comment.lineNumber}
                                  </span>
                                )}
                              </div>
                              {editingComment === comment.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm resize-none"
                                    rows={2}
                                  />
                                  <div className="flex space-x-2">
                                    <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                                      Save
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                              )}
                              {editingComment !== comment.id && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <button
                                    onClick={() => onResolveComment(comment.id)}
                                    className="text-xs text-green-400 hover:text-green-300"
                                  >
                                    Resolve
                                  </button>
                                  {comment.authorId === currentUser.id && (
                                    <>
                                      <button
                                        onClick={() => handleEditComment(comment)}
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => onDeleteComment(comment.id)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {resolvedComments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">
                      Resolved Comments ({resolvedComments.length})
                    </h3>
                    <div className="space-y-3">
                      {resolvedComments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-gray-800 rounded-lg border border-gray-700 opacity-60"
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                              style={{ backgroundColor: getCollaboratorColor(comment.authorId) }}
                            >
                              {comment.author.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium text-gray-200">
                                  {comment.author.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs bg-green-700 text-green-300 px-2 py-0.5 rounded">
                                  Resolved
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet</p>
                    <p className="text-sm">Start a discussion about this snippet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollaborationPanel;