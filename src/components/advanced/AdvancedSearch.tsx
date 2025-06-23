import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, User, Tag, Code, Eye, Lock, Globe } from 'lucide-react';
import { CODE_LANGUAGES } from '../../utils/constants';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SearchFilters {
  query: string;
  language: string;
  tags: string[];
  visibility: 'all' | 'public' | 'private';
  author: string;
  dateRange: {
    start: string;
    end: string;
  };
  hasComments: boolean;
  isArchived: boolean;
  sortBy: 'newest' | 'oldest' | 'popular' | 'updated' | 'views';
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    language: '',
    tags: [],
    visibility: 'all',
    author: '',
    dateRange: {
      start: '',
      end: '',
    },
    hasComments: false,
    isArchived: false,
    sortBy: 'newest',
    ...initialFilters,
  });

  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      query: '',
      language: '',
      tags: [],
      visibility: 'all',
      author: '',
      dateRange: {
        start: '',
        end: '',
      },
      hasComments: false,
      isArchived: false,
      sortBy: 'newest',
    });
    setTagInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-4xl rounded-lg bg-gray-900 border border-gray-700 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Filter className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-white">Advanced Search</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Search Query */}
            <div>
              <Input
                label="Search Query"
                icon={<Search className="w-4 h-4" />}
                placeholder="Search in title, description, content..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Code className="w-4 h-4 inline mr-2" />
                  Programming Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="">All Languages</option>
                  {CODE_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Eye className="w-4 h-4 inline mr-2" />
                  Visibility
                </label>
                <select
                  value={filters.visibility}
                  onChange={(e) => setFilters(prev => ({ ...prev, visibility: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="all">All Snippets</option>
                  <option value="public">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Public Only
                  </option>
                  <option value="private">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Private Only
                  </option>
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <Input
                  label="Author"
                  icon={<User className="w-4 h-4" />}
                  placeholder="Filter by username..."
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="updated">Recently Updated</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Tags
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full flex items-center"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-200 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                />
              </div>
            </div>

            {/* Additional Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Additional Filters
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasComments}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasComments: e.target.checked }))}
                    className="mr-3 rounded border-gray-600 bg-gray-800 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-300">Has comments</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isArchived}
                    onChange={(e) => setFilters(prev => ({ ...prev, isArchived: e.target.checked }))}
                    className="mr-3 rounded border-gray-600 bg-gray-800 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-300">Include archived</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-700">
            <Button variant="ghost" onClick={handleReset}>
              Reset Filters
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedSearch;