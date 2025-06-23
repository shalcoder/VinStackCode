import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, Copy, Edit, Trash2, Lock, Globe, Calendar, User } from 'lucide-react';
import { formatRelativeTime, truncateText, copyToClipboard } from '../../utils';
import { CODE_LANGUAGES } from '../../utils/constants';
import Button from '../ui/Button';

interface SnippetCardProps {
  snippet: any;
  onEdit: (snippet: any) => void;
  onDelete: (id: string) => void;
  onView: (snippet: any) => void;
  onLike?: (id: string) => void;
  showActions?: boolean;
  viewMode?: 'grid' | 'list';
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onEdit,
  onDelete,
  onView,
  onLike,
  showActions = true,
  viewMode = 'grid',
}) => {
  const language = CODE_LANGUAGES.find(lang => lang.id === snippet.language);
  const likesCount = snippet.snippet_likes?.[0]?.count || 0;
  const viewsCount = snippet.snippet_views?.[0]?.count || 0;
  const commentsCount = snippet.snippet_comments?.[0]?.count || 0;
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(snippet.content);
    if (success) {
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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(snippet.id);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -1 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all duration-200"
        onClick={() => onView(snippet)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white truncate">
                {snippet.title}
              </h3>
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
              {snippet.visibility === 'private' ? (
                <Lock className="w-4 h-4 text-gray-400" />
              ) : (
                <Globe className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {snippet.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{snippet.profiles?.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{viewsCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(new Date(snippet.updated_at))}</span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-1"
              >
                <Copy className="w-4 h-4" />
              </Button>
              {onLike && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className="p-1"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              )}
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
  }

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
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {snippet.tags.slice(0, 3).map((tag: string) => (
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
            <span>{viewsCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{likesCount}</span>
          </div>
          <span>{formatRelativeTime(new Date(snippet.updated_at))}</span>
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
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="p-1"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
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