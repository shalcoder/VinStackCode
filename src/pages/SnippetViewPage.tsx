import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Heart, Copy, Share, Eye, MessageCircle, Calendar, User, GitBranch, Video } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useSnippets } from '../store/snippetStore';
import { useComments } from '../hooks/useComments';
import { formatRelativeTime, copyToClipboard } from '../utils';
import CodeEditor from '../components/editor/CodeEditor';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import TavusVideoComments from '../components/tavus/TavusVideoComments';
import SocialShare from '../components/social/SocialShare';
import FollowSystem from '../components/social/FollowSystem';
import TavusVideoGenerator from '../components/tavus/TavusVideoGenerator';

const SnippetViewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { snippets, likeSnippet, incrementViews } = useSnippets();
  const { comments, addComment } = useComments(id || '');
  
  const [snippet, setSnippet] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as const,
    isVisible: false,
  });

  useEffect(() => {
    if (id) {
      const foundSnippet = snippets.find(s => s.id === id);
      setSnippet(foundSnippet || null);
      
      // Increment view count
      if (foundSnippet && user) {
        incrementViews(id, user.id);
      }
    }
  }, [id, snippets, user, incrementViews]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleLike = async () => {
    if (!user || !id) return;
    
    try {
      await likeSnippet(id, user.id);
      setIsLiked(!isLiked);
      showToast(isLiked ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
      showToast('Failed to toggle like', 'error');
    }
  };

  const handleCopy = async () => {
    if (!snippet) return;
    
    const success = await copyToClipboard(snippet.content);
    if (success) {
      showToast('Code copied to clipboard!', 'success');
    } else {
      showToast('Failed to copy code', 'error');
    }
  };

  const handleAddComment = async () => {
    if (!user || !id || !newComment.trim()) return;
    
    try {
      await addComment({
        snippet_id: id,
        author_id: user.id,
        content: newComment.trim(),
      });
      setNewComment('');
      showToast('Comment added successfully!', 'success');
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  if (!snippet) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Snippet not found</h2>
          <p className="text-gray-400 mb-4">The snippet you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user?.id === snippet.owner_id;
  const likesCount = snippet.snippet_likes?.[0]?.count || 0;
  const viewsCount = snippet.snippet_views?.[0]?.count || 0;
  const commentsCount = comments.length;
  const forksCount = snippet.snippet_forks?.[0]?.count || 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={isLiked ? 'text-red-400' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              {likesCount}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <SocialShare snippet={{
              id: snippet.id,
              title: snippet.title,
              description: snippet.description,
              language: snippet.language,
              author: snippet.profiles?.username || 'Unknown'
            }} />

            {canEdit && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/editor/${id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Snippet Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Snippet Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">{snippet.title}</h1>
                  {snippet.description && (
                    <p className="text-gray-300">{snippet.description}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: '#3b82f6' + '20',
                      color: '#3b82f6'
                    }}
                  >
                    {snippet.language}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{viewsCount} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{likesCount} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{commentsCount} comments</span>
                </div>
                {forksCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-4 h-4" />
                    <span>{forksCount} forks</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatRelativeTime(new Date(snippet.created_at))}</span>
                </div>
              </div>
            </motion.div>

            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CodeEditor
                value={snippet.content}
                onChange={() => {}}
                language={snippet.language}
                readOnly={true}
                height="500px"
              />
            </motion.div>

            {/* Tavus Video Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TavusVideoComments
                snippetId={snippet.id}
                snippetTitle={snippet.title}
                snippetCode={snippet.content}
                snippetLanguage={snippet.language}
                comments={comments}
                onAddComment={addComment}
              />
            </motion.div>

            {/* Add Comment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Add Comment
              </h3>

              {user ? (
                <div>
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <p>Please sign in to add comments</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Author</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    {snippet.profiles?.username || 'Unknown'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {snippet.profiles?.full_name}
                  </p>
                </div>
              </div>

              {/* Follow System */}
              {user && user.id !== snippet.owner_id && (
                <FollowSystem
                  targetUserId={snippet.owner_id}
                  targetUsername={snippet.profiles?.username || 'Unknown'}
                />
              )}
            </motion.div>

            {/* Snippet Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white">{snippet.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">
                    {new Date(snippet.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-white">
                    {new Date(snippet.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Visibility:</span>
                  <span className="text-white capitalize">{snippet.visibility}</span>
                </div>
                {forksCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Forks:</span>
                    <span className="text-white">{forksCount}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Video Tutorial Generator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Video className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-white">Video Tutorial</h3>
              </div>
              
              <p className="text-gray-400 mb-4">
                Generate an AI-powered video explanation of this code snippet using Tavus AI.
              </p>
              
              <TavusVideoGenerator
                snippetId={snippet.id}
                snippetTitle={snippet.title}
                snippetCode={snippet.content}
                snippetLanguage={snippet.language}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default SnippetViewPage;