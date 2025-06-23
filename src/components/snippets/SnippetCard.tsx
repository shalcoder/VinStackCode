import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, Copy, Edit, Trash2, Lock, Globe } from 'lucide-react';
import { Snippet } from '../../types';
import { formatRelativeTime, truncateText, copyToClipboard } from '../../utils';
import { CODE_LANGUAGES } from '../../utils/constants';
import Button from '../ui/Button';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onView: (snippet: Snippet) => void;
  showActions?: boolean;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onEdit,
  onDelete,
  onView,
  showActions = true
}) => {
  const language = CODE_LANGUAGES.find(lang => lang.id === snippet.language);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(snippet.content);
    if (success) {
      // In a real app, show toast notification
      console.log('Copied to clipboard');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(snippet.id);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition-all duration-200"
      onClick={() => onView(snippet)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate mb-1">
            {snippet.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {snippet.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {snippet.visibility === 'private' ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : (
            <Globe className="w-4 h-4 text-gray-400" />
          )}
          {language && (
            <div 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: language.color + '20',
                color: language.color 
              }}
            >
              {language.name}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {snippet.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {snippet.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              +{snippet.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Code Preview */}
      <div className="bg-gray-900 rounded-lg p-3 mb-4 overflow-hidden">
        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
          {truncateText(snippet.content, 200)}
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{snippet.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{snippet.likes}</span>
          </div>
          <span>{formatRelativeTime(snippet.updatedAt)}</span>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="p-1"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="p-1"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SnippetCard;