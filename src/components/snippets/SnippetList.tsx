import React from 'react';
import { motion } from 'framer-motion';
import SnippetCard from './SnippetCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SnippetListProps {
  snippets: any[];
  isLoading: boolean;
  onEdit: (snippet: any) => void;
  onDelete: (id: string) => void;
  onView: (snippet: any) => void;
  onLike?: (id: string) => void;
  showActions?: boolean;
  viewMode?: 'grid' | 'list';
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onLike,
  showActions = true,
  viewMode = 'grid',
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

  const gridClasses = viewMode === 'grid' 
    ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
    : 'space-y-4';

  return (
    <div className={gridClasses}>
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
            onLike={onLike}
            showActions={showActions}
            viewMode={viewMode}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SnippetList;