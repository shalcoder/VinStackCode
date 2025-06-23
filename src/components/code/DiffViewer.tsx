import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Plus, Minus, Equal } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber?: number;
}

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  language: string;
  title?: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  oldCode,
  newCode,
  language,
  title = 'Code Diff',
}) => {
  const generateDiff = (oldText: string, newText: string): DiffLine[] => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diff: DiffLine[] = [];

    // Simple diff algorithm - in production, use a proper diff library
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === undefined) {
        // Line added
        diff.push({
          type: 'added',
          content: newLine,
          lineNumber: i + 1,
        });
      } else if (newLine === undefined) {
        // Line removed
        diff.push({
          type: 'removed',
          content: oldLine,
          lineNumber: i + 1,
        });
      } else if (oldLine === newLine) {
        // Line unchanged
        diff.push({
          type: 'unchanged',
          content: oldLine,
          lineNumber: i + 1,
        });
      } else {
        // Line modified - show as removed + added
        diff.push({
          type: 'removed',
          content: oldLine,
          lineNumber: i + 1,
        });
        diff.push({
          type: 'added',
          content: newLine,
          lineNumber: i + 1,
        });
      }
    }

    return diff;
  };

  const diffLines = generateDiff(oldCode, newCode);

  const getLineIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-3 h-3 text-green-500" />;
      case 'removed':
        return <Minus className="w-3 h-3 text-red-500" />;
      default:
        return <Equal className="w-3 h-3 text-gray-500" />;
    }
  };

  const getLineClasses = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-900/30 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-900/30 border-l-4 border-red-500';
      default:
        return 'bg-gray-800/50';
    }
  };

  const getLinePrefix = (type: string) => {
    switch (type) {
      case 'added':
        return '+';
      case 'removed':
        return '-';
      default:
        return ' ';
    }
  };

  const stats = {
    added: diffLines.filter(line => line.type === 'added').length,
    removed: diffLines.filter(line => line.type === 'removed').length,
    unchanged: diffLines.filter(line => line.type === 'unchanged').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <GitBranch className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-sm text-gray-400">({language})</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-green-400">
            <Plus className="w-3 h-3" />
            <span>{stats.added}</span>
          </div>
          <div className="flex items-center space-x-1 text-red-400">
            <Minus className="w-3 h-3" />
            <span>{stats.removed}</span>
          </div>
          <div className="text-gray-400">
            {stats.unchanged} unchanged
          </div>
        </div>
      </div>

      {/* Diff Content */}
      <div className="max-h-96 overflow-y-auto">
        <div className="font-mono text-sm">
          {diffLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`flex items-start ${getLineClasses(line.type)}`}
            >
              {/* Line Number */}
              <div className="w-12 px-2 py-1 text-gray-500 text-right border-r border-gray-700 bg-gray-800/50">
                {line.lineNumber}
              </div>
              
              {/* Change Indicator */}
              <div className="w-8 px-2 py-1 flex items-center justify-center">
                {getLineIcon(line.type)}
              </div>
              
              {/* Prefix */}
              <div className="w-4 py-1 text-gray-400">
                {getLinePrefix(line.type)}
              </div>
              
              {/* Code Content */}
              <div className="flex-1 py-1 pr-4 text-gray-100 whitespace-pre-wrap break-all">
                {line.content || ' '}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>
            {stats.added + stats.removed} changes in {diffLines.length} lines
          </span>
          <span>
            Language: {language}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DiffViewer;