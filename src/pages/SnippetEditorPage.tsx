import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Play, History, Users, Settings } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useSnippets } from '../store/snippetStore';
import { useComments } from '../hooks/useComments';
import { useCollaboration } from '../hooks/useCollaboration';
import SnippetEditor from '../components/snippets/SnippetEditor';
import CodeExecution from '../components/advanced/CodeExecution';
import VersionHistory from '../components/advanced/VersionHistory';
import RealTimeCollaboration from '../components/advanced/RealTimeCollaboration';
import CollaborationPanel from '../components/collaboration/CollaborationPanel';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

const SnippetEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { snippets, createSnippet, updateSnippet } = useSnippets();
  
  const [snippet, setSnippet] = useState(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as const,
    isVisible: false,
  });

  const { comments, addComment, updateComment, deleteComment, resolveComment } = useComments(id || '');
  const { collaborators, inviteCollaborator } = useCollaboration(id || '');

  useEffect(() => {
    if (id) {
      const foundSnippet = snippets.find(s => s.id === id);
      setSnippet(foundSnippet || null);
    }
  }, [id, snippets]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleSave = async (snippetData: any) => {
    try {
      if (id && snippet) {
        await updateSnippet(id, snippetData);
        showToast('Snippet updated successfully!', 'success');
      } else {
        const newSnippet = await createSnippet({
          ...snippetData,
          owner_id: user?.id,
        });
        navigate(`/editor/${newSnippet.id}`);
        showToast('Snippet created successfully!', 'success');
      }
    } catch (error) {
      showToast('Failed to save snippet', 'error');
    }
  };

  const handleVersionRestore = async (version: any) => {
    if (!id) return;
    
    try {
      await updateSnippet(id, {
        title: version.title,
        description: version.description,
        content: version.content,
      });
      showToast('Version restored successfully!', 'success');
    } catch (error) {
      showToast('Failed to restore version', 'error');
    }
  };

  const handleAddComment = async (content: string, lineNumber?: number) => {
    if (!user || !id) return;
    
    try {
      await addComment({
        snippet_id: id,
        author_id: user.id,
        content,
        line_number: lineNumber,
      });
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  const handleInviteCollaborator = async (email: string) => {
    if (!user || !id) return;
    
    try {
      await inviteCollaborator(email, 'editor', user.id);
      showToast('Collaborator invited successfully!', 'success');
    } catch (error) {
      showToast('Failed to invite collaborator', 'error');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-white">
              {snippet ? 'Edit Snippet' : 'Create New Snippet'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {id && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVersionHistoryOpen(true)}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCollaboration(!showCollaboration)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Collaborate
                </Button>

                <RealTimeCollaboration snippetId={id} />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 flex flex-col ${showCollaboration ? 'mr-80' : ''}`}>
          <div className="flex-1 p-6">
            <SnippetEditor
              snippet={snippet}
              onSave={handleSave}
              onClose={() => navigate('/')}
            />
          </div>

          {/* Code Execution */}
          {snippet && (
            <div className="border-t border-gray-700 p-6">
              <CodeExecution
                code={snippet.content}
                language={snippet.language}
              />
            </div>
          )}
        </div>

        {/* Collaboration Panel */}
        {showCollaboration && id && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="fixed right-0 top-0 h-full w-80 z-40"
          >
            <CollaborationPanel
              snippetId={id}
              collaborators={collaborators}
              comments={comments}
              currentUser={user!}
              onAddComment={handleAddComment}
              onUpdateComment={updateComment}
              onDeleteComment={deleteComment}
              onResolveComment={(commentId) => resolveComment(commentId, user!.id)}
              onInviteCollaborator={handleInviteCollaborator}
            />
          </motion.div>
        )}
      </div>

      {/* Version History Modal */}
      {id && (
        <VersionHistory
          snippetId={id}
          isOpen={isVersionHistoryOpen}
          onClose={() => setIsVersionHistoryOpen(false)}
          onRestore={handleVersionRestore}
        />
      )}

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

export default SnippetEditorPage;