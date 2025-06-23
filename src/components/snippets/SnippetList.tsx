import React from 'react';
import { motion } from 'framer-motion';
import { Snippet } from '../../types';
import SnippetCard from './SnippetCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SnippetListProps {
  snippets: Snippet[];
  isLoading: boolean;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onView: (snippet: Snippet) => void;
  showActions?: boolean;
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  isLoading,
  onEdit,
  onDelete,
  onView,
  showActions = true
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No snippets found</div>
        <p className="text-gray-500 mt-2">
          {showActions 
            ? "Create your first snippet to get started!"
            : "Try adjusting your search filters."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {snippets.map((snippet, index) => (
        <motion.div
          key={snippet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SnippetCard
            snippet={snippet}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            showActions={showActions}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SnippetList;