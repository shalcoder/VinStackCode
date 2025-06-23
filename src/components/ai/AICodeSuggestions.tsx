import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, X, Check, Copy, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface AICodeSuggestionsProps {
  code: string;
  language: string;
  onApplySuggestion: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface Suggestion {
  id: string;
  type: 'optimization' | 'refactor' | 'documentation' | 'bug-fix';
  title: string;
  description: string;
  code: string;
  confidence: number;
}

const AICodeSuggestions: React.FC<AICodeSuggestionsProps> = ({
  code,
  language,
  onApplySuggestion,
  isVisible,
  onClose,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && code.trim()) {
      generateSuggestions();
    }
  }, [isVisible, code, language]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // Mock AI suggestions - in production, this would call Bolt.new's AI API
      const mockSuggestions = await mockAISuggestions(code, language);
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockAISuggestions = async (code: string, language: string): Promise<Suggestion[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: Suggestion[] = [];

    // Add suggestions based on code analysis
    if (language === 'javascript' || language === 'typescript') {
      if (code.includes('var ')) {
        suggestions.push({
          id: '1',
          type: 'optimization',
          title: 'Use const/let instead of var',
          description: 'Replace var declarations with const or let for better scoping',
          code: code.replace(/var /g, 'const '),
          confidence: 0.95,
        });
      }

      if (code.includes('function') && !code.includes('arrow')) {
        suggestions.push({
          id: '2',
          type: 'refactor',
          title: 'Convert to arrow function',
          description: 'Modern arrow function syntax for cleaner code',
          code: code.replace(/function\s+(\w+)\s*\(/g, 'const $1 = ('),
          confidence: 0.85,
        });
      }

      if (!code.includes('/**') && code.includes('function')) {
        suggestions.push({
          id: '3',
          type: 'documentation',
          title: 'Add JSDoc comments',
          description: 'Improve code documentation with JSDoc comments',
          code: `/**\n * Function description\n * @param {type} param - Parameter description\n * @returns {type} Return description\n */\n${code}`,
          confidence: 0.80,
        });
      }
    }

    if (language === 'python') {
      if (!code.includes('"""') && code.includes('def ')) {
        suggestions.push({
          id: '4',
          type: 'documentation',
          title: 'Add docstrings',
          description: 'Add Python docstrings for better documentation',
          code: code.replace(/def\s+(\w+)\s*\([^)]*\):/g, 'def $1():\n    """\n    Function description\n    """\n'),
          confidence: 0.90,
        });
      }

      if (code.includes('print(')) {
        suggestions.push({
          id: '5',
          type: 'optimization',
          title: 'Use logging instead of print',
          description: 'Replace print statements with proper logging',
          code: 'import logging\n\n' + code.replace(/print\(/g, 'logging.info('),
          confidence: 0.75,
        });
      }
    }

    return suggestions;
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion(suggestion.code);
    setSelectedSuggestion(suggestion.id);
    setTimeout(() => setSelectedSuggestion(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
      case 'refactor':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'documentation':
        return <Wand2 className="w-4 h-4 text-purple-500" />;
      case 'bug-fix':
        return <Check className="w-4 h-4 text-green-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-4 top-20 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-gray-400">Analyzing code...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getSuggestionIcon(suggestion.type)}
                      <h4 className="font-medium text-white">{suggestion.title}</h4>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-400">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                      <div className="w-12 h-1 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${suggestion.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">{suggestion.description}</p>

                  <div className="bg-gray-900 rounded p-3 mb-3">
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {suggestion.code.substring(0, 200)}
                      {suggestion.code.length > 200 && '...'}
                    </pre>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion)}
                      disabled={selectedSuggestion === suggestion.id}
                    >
                      {selectedSuggestion === suggestion.id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Applied
                        </>
                      ) : (
                        'Apply'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(suggestion.code)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No suggestions available</p>
              <p className="text-sm">Try writing some code first</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={generateSuggestions}
            disabled={loading}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Suggestions
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AICodeSuggestions;