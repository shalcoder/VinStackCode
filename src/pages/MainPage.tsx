import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSnippetStore } from '../store/snippetStore';
import { useAuthStore } from '../store/authStore';
import { Snippet } from '../types';
import { debounce } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SnippetList from '../components/snippets/SnippetList';
import SnippetEditor from '../components/snippets/SnippetEditor';
import PricingPage from '../components/payment/PricingPage';
import Modal from '../components/ui/Modal';
import CodeEditor from '../components/editor/CodeEditor';
import Toast from '../components/ui/Toast';

const MainPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    snippets,
    currentSnippet,
    isLoading,
    filters,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    setCurrentSnippet,
    setFilters,
    fetchSnippets,
  } = useSnippetStore();

  const [activeTab, setActiveTab] = useState('explore');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(undefined);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setFilters({ query });
    }, 300),
    [setFilters]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Filter snippets based on current tab and search
  const filteredSnippets = useMemo(() => {
    let filtered = snippets;

    // Filter by tab
    if (activeTab === 'my-snippets') {
      filtered = filtered.filter(snippet => snippet.ownerId === user?.id);
    } else if (activeTab === 'favorites') {
      // TODO: Implement favorites functionality
      filtered = [];
    } else if (activeTab === 'archived') {
      // TODO: Implement archived functionality
      filtered = [];
    } else {
      // Explore - show public snippets
      filtered = filtered.filter(snippet => snippet.visibility === 'public');
    }

    // Apply search filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.content.toLowerCase().includes(query) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort snippets
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [snippets, activeTab, user?.id, filters]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const checkPlanLimits = (action: 'create' | 'collaborate') => {
    const subscription = user?.subscription;
    const plan = subscription?.plan || 'free';
    const userSnippets = snippets.filter(s => s.ownerId === user?.id);

    if (action === 'create') {
      if (plan === 'free' && userSnippets.length >= 10) {
        showToast('Free plan limit reached. Upgrade to Pro for more snippets!', 'warning');
        setActiveTab('pricing');
        return false;
      }
      if (plan === 'pro' && userSnippets.length >= 500) {
        showToast('Pro plan limit reached. Upgrade to Team for unlimited snippets!', 'warning');
        setActiveTab('pricing');
        return false;
      }
    }

    return true;
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'create') {
      if (!checkPlanLimits('create')) return;
      setEditingSnippet(undefined);
      setIsEditorOpen(true);
    }
  };

  const handleCreateSnippet = async (snippetData: Partial<Snippet>) => {
    if (!checkPlanLimits('create')) return;

    try {
      await createSnippet(snippetData as any);
      setIsEditorOpen(false);
      showToast('Snippet created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create snippet', 'error');
    }
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsEditorOpen(true);
  };

  const handleUpdateSnippet = async (snippetData: Partial<Snippet>) => {
    if (!editingSnippet) return;
    
    try {
      await updateSnippet(editingSnippet.id, snippetData);
      setIsEditorOpen(false);
      setEditingSnippet(undefined);
      showToast('Snippet updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update snippet', 'error');
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteSnippet(id);
        showToast('Snippet deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete snippet', 'error');
      }
    }
  };

  const handleViewSnippet = (snippet: Snippet) => {
    setCurrentSnippet(snippet);
    setIsViewModalOpen(true);
  };

  const handleSaveSnippet = editingSnippet ? handleUpdateSnippet : handleCreateSnippet;

  // Render pricing page
  if (activeTab === 'pricing') {
    return <PricingPage onBack={() => setActiveTab('explore')} />;
  }

  return (
    <div className="h-screen flex bg-gray-950">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-gray-400 mt-1">
                {activeTab === 'explore' && 'Discover public code snippets from the community'}
                {activeTab === 'my-snippets' && 'Manage your personal code snippets'}
                {activeTab === 'favorites' && 'Your starred snippets'}
                {activeTab === 'archived' && 'Archived snippets'}
              </p>
            </div>

            {/* Plan Usage Info for My Snippets */}
            {activeTab === 'my-snippets' && user?.subscription && (
              <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">
                      Plan Usage
                    </h3>
                    <p className="text-xs text-gray-400">
                      {filteredSnippets.length} / {user.subscription.plan === 'free' ? '10' : user.subscription.plan === 'pro' ? '500' : '∞'} snippets used
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white capitalize">
                      {user.subscription.plan} Plan
                    </div>
                    {user.subscription.plan === 'free' && (
                      <button
                        onClick={() => setActiveTab('pricing')}
                        className="text-xs text-primary-400 hover:text-primary-300"
                      >
                        Upgrade for more
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Snippet List */}
            <SnippetList
              snippets={filteredSnippets}
              isLoading={isLoading}
              onEdit={handleEditSnippet}
              onDelete={handleDeleteSnippet}
              onView={handleViewSnippet}
              showActions={activeTab === 'my-snippets'}
            />
          </motion.div>
        </main>
      </div>

      {/* Snippet Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingSnippet(undefined);
        }}
        title="Snippet Editor"
        size="xl"
      >
        <SnippetEditor
          snippet={editingSnippet}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingSnippet(undefined);
          }}
          onSave={handleSaveSnippet}
        />
      </Modal>

      {/* Snippet View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setCurrentSnippet(null);
        }}
        title={currentSnippet?.title || 'Snippet'}
        size="xl"
      >
        {currentSnippet && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-4">{currentSnippet.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <span>Language: {currentSnippet.language}</span>
                <span>Views: {currentSnippet.views}</span>
                <span>Likes: {currentSnippet.likes}</span>
              </div>
              {currentSnippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentSnippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <CodeEditor
              value={currentSnippet.content}
              onChange={() => {}}
              language={currentSnippet.language}
              readOnly={true}
              height="400px"
            />
          </div>
        )}
      </Modal>

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

export default MainPage;