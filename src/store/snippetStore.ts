import { create } from 'zustand';
import { useSnippets } from '../hooks/useSnippets';

interface SnippetState {
  searchQuery: string;
  selectedLanguage: string;
  selectedTags: string[];
  sortBy: 'newest' | 'oldest' | 'popular' | 'updated';
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (language: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'popular' | 'updated') => void;
  clearFilters: () => void;
}

export const useSnippetStore = create<SnippetState>((set) => ({
  searchQuery: '',
  selectedLanguage: '',
  selectedTags: [],
  sortBy: 'newest',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedLanguage: (language) => set({ selectedLanguage: language }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setSortBy: (sortBy) => set({ sortBy }),
  clearFilters: () => set({
    searchQuery: '',
    selectedLanguage: '',
    selectedTags: [],
    sortBy: 'newest',
  }),
}));

// Re-export the Supabase snippets hook
export { useSnippets };