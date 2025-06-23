import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Hash, User, Folder, Settings, Plus, Code, Users, Zap } from 'lucide-react';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      description: 'Go to main dashboard',
      icon: <Folder className="w-4 h-4" />,
      action: () => onNavigate('/'),
      category: 'Navigation',
      keywords: ['dashboard', 'home', 'main'],
    },
    {
      id: 'nav-teams',
      title: 'Team Management',
      description: 'Manage your teams',
      icon: <Users className="w-4 h-4" />,
      action: () => onNavigate('/teams'),
      category: 'Navigation',
      keywords: ['teams', 'collaboration', 'members'],
    },
    {
      id: 'nav-integrations',
      title: 'Integrations',
      description: 'Connect external services',
      icon: <Zap className="w-4 h-4" />,
      action: () => onNavigate('/integrations'),
      category: 'Navigation',
      keywords: ['integrations', 'connect', 'services'],
    },
    {
      id: 'nav-pricing',
      title: 'Pricing',
      description: 'View pricing plans',
      icon: <Settings className="w-4 h-4" />,
      action: () => onNavigate('/pricing'),
      category: 'Navigation',
      keywords: ['pricing', 'plans', 'upgrade'],
    },
    
    // Actions
    {
      id: 'action-create',
      title: 'Create New Snippet',
      description: 'Start coding a new snippet',
      icon: <Plus className="w-4 h-4" />,
      action: () => onNavigate('/editor'),
      category: 'Actions',
      keywords: ['create', 'new', 'add', 'snippet'],
    },
  ], [onNavigate]);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    
    const lowerQuery = query.toLowerCase();
    return commands.filter(command =>
      command.title.toLowerCase().includes(lowerQuery) ||
      command.description?.toLowerCase().includes(lowerQuery) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }, [commands, query]);

  const groupedCommands = useMemo(() => {
    const groups: { [key: string]: Command[] } = {};
    filteredCommands.forEach(command => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-start justify-center p-4 pt-16">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl rounded-lg bg-gray-900 border border-gray-700 shadow-xl"
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-gray-700 px-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent py-4 text-gray-100 placeholder-gray-400 focus:outline-none"
                autoFocus
              />
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600">
                  <Command className="w-3 h-3" />
                </kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600">K</kbd>
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {Object.keys(groupedCommands).length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  No commands found for "{query}"
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {commands.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <motion.button
                            key={command.id}
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            onClick={() => {
                              command.action();
                              onClose();
                            }}
                            className={`
                              w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors
                              ${isSelected 
                                ? 'bg-primary-600 text-white' 
                                : 'text-gray-300 hover:bg-gray-800'
                              }
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                {command.icon}
                              </div>
                              <div>
                                <div className="font-medium">{command.title}</div>
                                {command.description && (
                                  <div className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                                    {command.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 px-4 py-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-600">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-600">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-600">esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                <div>{filteredCommands.length} commands</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;