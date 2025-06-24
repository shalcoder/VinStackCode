import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { useAuth } from '../store/authStore';
import { useSnippets, useSnippetStore } from '../store/snippetStore';
import { debounce } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SnippetList from '../components/snippets/SnippetList';
import AdvancedSearch from '../components/advanced/AdvancedSearch';
import NotificationCenter from '../components/notifications/NotificationCenter';
import CommandPalette from '../components/ui/CommandPalette';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import GameBanner from '../components/game/GameBanner';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { snippets, loading, fetchSnippets, deleteSnippet, likeSnippet } = useSnippets();
  const {
    searchQuery,
    selectedLanguage,
    selectedTags,
    sortBy,
    setSearchQuery,
    setSelectedLanguage,
    setSelectedTags,
    setSortBy,
  } = useSnippetStore();

  const [activeTab, setActiveTab] = useState('explore');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      fetchSnippets({
        search: query,
        language: selectedLanguage,
        tags: selectedTags,
        visibility: activeTab === 'my-snippets' ? undefined : 'public',
        ownerId: activeTab === 'my-snippets' ? user?.id : undefined,
      });
    }, 300),
    [fetchSnippets, selectedLanguage, selectedTags, activeTab, user?.id]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    fetchSnippets({
      visibility: activeTab === 'my-snippets' ? undefined : 'public',
      ownerId: activeTab === 'my-snippets' ? user?.id : undefined,
    });
  }, [activeTab, fetchSnippets, user?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsCommandPaletteOpen(true);
            break;
          case 'n':
            e.preventDefault();
            navigate('/editor');
            break;
          case '/':
            e.preventDefault();
            setIsAdvancedSearchOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'teams') {
      navigate('/teams');
    } else if (tab === 'integrations') {
      navigate('/integrations');
    } else if (tab === 'pricing') {
      navigate('/pricing');
    } else if (tab === 'game') {
      navigate('/game');
    }
  };

  const handleEditSnippet = (snippet: any) => {
    navigate(`/editor/${snippet.id}`);
  };

  const handleViewSnippet = (snippet: any) => {
    navigate(`/snippet/${snippet.id}`);
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

  const handleLikeSnippet = async (snippetId: string) => {
    if (!user) return;
    try {
      await likeSnippet(snippetId, user.id);
    } catch (error) {
      showToast('Failed to toggle like', 'error');
    }
  };

  const handleAdvancedSearch = (filters: any) => {
    setSearchQuery(filters.query);
    setSelectedLanguage(filters.language);
    setSelectedTags(filters.tags);
    setSortBy(filters.sortBy);
    
    fetchSnippets({
      search: filters.query,
      language: filters.language,
      tags: filters.tags,
      visibility: filters.visibility === 'all' ? undefined : filters.visibility,
      ownerId: activeTab === 'my-snippets' ? user?.id : undefined,
    });
  };

  const filteredSnippets = useMemo(() => {
    let filtered = [...snippets];

    // Sort snippets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (b.snippet_likes?.[0]?.count || 0) - (a.snippet_likes?.[0]?.count || 0);
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [snippets, sortBy]);

  return (
    <div className="h-screen flex bg-gray-950">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          rightContent={<NotificationCenter />}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Game Banner */}
            <GameBanner />
            
            {/* Tab Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
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

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdvancedSearchOpen(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Search
                </Button>
                
                <div className="flex items-center border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  variant="primary"
                  onClick={() => navigate('/editor')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Snippet
                </Button>
              </div>
            </div>

            {/* Snippet List */}
            <SnippetList
              snippets={filteredSnippets}
              isLoading={loading}
              onEdit={handleEditSnippet}
              onDelete={handleDeleteSnippet}
              onView={handleViewSnippet}
              onLike={handleLikeSnippet}
              showActions={activeTab === 'my-snippets'}
              viewMode={viewMode}
            />
          </motion.div>
        </main>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleAdvancedSearch}
        initialFilters={{
          query: searchQuery,
          language: selectedLanguage,
          tags: selectedTags,
          sortBy,
        }}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          if (tab.startsWith('/')) {
            navigate(tab);
          } else {
            handleTabChange(tab);
          }
        }}
      />

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

export default DashboardPage;