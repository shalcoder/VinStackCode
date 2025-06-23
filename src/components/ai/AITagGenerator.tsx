import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, Plus, X } from 'lucide-react';
import Button from '../ui/Button';

interface AITagGeneratorProps {
  code: string;
  language: string;
  existingTags: string[];
  onTagsGenerated: (tags: string[]) => void;
}

const AITagGenerator: React.FC<AITagGeneratorProps> = ({
  code,
  language,
  existingTags,
  onTagsGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const generateTags = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      // Mock AI tag generation - in production, this would call Bolt.new's AI API
      const tags = await mockAITagGeneration(code, language);
      setSuggestedTags(tags.filter(tag => !existingTags.includes(tag)));
    } catch (error) {
      console.error('Error generating tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockAITagGeneration = async (code: string, language: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const tags: string[] = [language];

    // Analyze code content for relevant tags
    const codeAnalysis = {
      hasAsync: /async|await|Promise/.test(code),
      hasAPI: /fetch|axios|api|endpoint/.test(code),
      hasDatabase: /sql|database|query|select|insert|update|delete/.test(code),
      hasReact: /react|jsx|component|useState|useEffect/.test(code),
      hasNode: /require|module\.exports|express|app\./.test(code),
      hasAuth: /auth|login|password|token|jwt/.test(code),
      hasValidation: /validate|schema|joi|yup/.test(code),
      hasTest: /test|spec|describe|it\(|expect/.test(code),
      hasUtils: /util|helper|function|const|let/.test(code),
      hasHooks: /use[A-Z]|hook/.test(code),
      hasState: /state|setState|useState|redux/.test(code),
      hasForm: /form|input|submit|validation/.test(code),
      hasAnimation: /animation|transition|motion|framer/.test(code),
      hasCSS: /style|css|className|tailwind/.test(code),
      hasPerformance: /performance|optimize|cache|memo/.test(code),
    };

    // Add relevant tags based on analysis
    if (codeAnalysis.hasAsync) tags.push('async', 'promises');
    if (codeAnalysis.hasAPI) tags.push('api', 'http', 'rest');
    if (codeAnalysis.hasDatabase) tags.push('database', 'sql', 'query');
    if (codeAnalysis.hasReact) tags.push('react', 'frontend', 'component');
    if (codeAnalysis.hasNode) tags.push('nodejs', 'backend', 'server');
    if (codeAnalysis.hasAuth) tags.push('authentication', 'security');
    if (codeAnalysis.hasValidation) tags.push('validation', 'forms');
    if (codeAnalysis.hasTest) tags.push('testing', 'unit-test');
    if (codeAnalysis.hasUtils) tags.push('utility', 'helper');
    if (codeAnalysis.hasHooks) tags.push('hooks', 'react-hooks');
    if (codeAnalysis.hasState) tags.push('state-management');
    if (codeAnalysis.hasForm) tags.push('forms', 'input');
    if (codeAnalysis.hasAnimation) tags.push('animation', 'ui');
    if (codeAnalysis.hasCSS) tags.push('styling', 'css');
    if (codeAnalysis.hasPerformance) tags.push('performance', 'optimization');

    // Add language-specific tags
    if (language === 'javascript') {
      tags.push('es6', 'frontend');
    } else if (language === 'typescript') {
      tags.push('types', 'frontend');
    } else if (language === 'python') {
      tags.push('backend', 'scripting');
    } else if (language === 'css') {
      tags.push('styling', 'frontend');
    } else if (language === 'html') {
      tags.push('markup', 'frontend');
    }

    // Remove duplicates and return
    return [...new Set(tags)];
  };

  const addTag = (tag: string) => {
    const newTags = [...existingTags, tag];
    onTagsGenerated(newTags);
    setSuggestedTags(prev => prev.filter(t => t !== tag));
  };

  const addAllTags = () => {
    const newTags = [...existingTags, ...suggestedTags];
    onTagsGenerated(newTags);
    setSuggestedTags([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">AI Tag Suggestions</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateTags}
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="ml-1">Generate</span>
        </Button>
      </div>

      {suggestedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Suggested tags:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={addAllTags}
              className="text-xs"
            >
              Add all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => addTag(tag)}
                className="px-2 py-1 bg-gray-700 hover:bg-primary-600 text-gray-300 hover:text-white text-xs rounded-full transition-colors flex items-center space-x-1"
              >
                <span>#{tag}</span>
                <Plus className="w-3 h-3" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AITagGenerator;