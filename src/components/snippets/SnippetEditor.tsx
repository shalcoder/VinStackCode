import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Eye, Globe, Lock, Sparkles, Play } from 'lucide-react';
import { Snippet } from '../../types';
import { CODE_LANGUAGES, DEFAULT_SNIPPET_CONTENT, POPULAR_TAGS } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { useSnippetStore } from '../../store/snippetStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import CodeEditor from '../editor/CodeEditor';
import AITagGenerator from '../ai/AITagGenerator';
import AICodeSuggestions from '../ai/AICodeSuggestions';
import CodeExecutionSandbox from '../code/CodeExecutionSandbox';

interface SnippetEditorProps {
  snippet?: Snippet;
  onClose: () => void;
  onSave: (snippet: Partial<Snippet>) => void;
}

interface FormData {
  title: string;
  description: string;
  language: string;
  visibility: 'public' | 'private';
  tags: string[];
}

const SnippetEditor: React.FC<SnippetEditorProps> = ({
  snippet,
  onClose,
  onSave
}) => {
  const { user } = useAuthStore();
  const { isLoading } = useSnippetStore();
  const [code, setCode] = useState(snippet?.content || DEFAULT_SNIPPET_CONTENT.javascript);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showCodeExecution, setShowCodeExecution] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: snippet?.title || '',
      description: snippet?.description || '',
      language: snippet?.language || 'javascript',
      visibility: snippet?.visibility || 'public',
      tags: snippet?.tags || [],
    }
  });

  const selectedLanguage = watch('language');
  const selectedTags = watch('tags');

  useEffect(() => {
    if (!snippet && selectedLanguage) {
      const defaultContent = DEFAULT_SNIPPET_CONTENT[selectedLanguage as keyof typeof DEFAULT_SNIPPET_CONTENT];
      if (defaultContent) {
        setCode(defaultContent);
      }
    }
  }, [selectedLanguage, snippet]);

  const onSubmit = (data: FormData) => {
    onSave({
      ...data,
      content: code,
      ownerId: user?.id || '',
      owner: user!,
      collaborators: [],
    });
  };

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
      setValue('tags', [...selectedTags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput.trim().toLowerCase());
    }
  };

  const handleTagsGenerated = (tags: string[]) => {
    setValue('tags', tags);
  };

  const handleApplySuggestion = (suggestedCode: string) => {
    setCode(suggestedCode);
  };

  const supportedExecutionLanguages = ['javascript', 'html', 'css', 'python'];
  const canExecute = supportedExecutionLanguages.includes(selectedLanguage);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">
          {snippet ? 'Edit Snippet' : 'Create New Snippet'}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAISuggestions(!showAISuggestions)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assist
          </Button>
          {canExecute && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCodeExecution(!showCodeExecution)}
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Metadata Panel */}
          <div className="space-y-6">
            <Input
              label="Title"
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 100, message: 'Title must be less than 100 characters' }
              })}
              error={errors.title?.message}
              placeholder="Enter snippet title..."
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register('description', {
                  maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
                placeholder="Describe your snippet..."
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <select
                {...register('language')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                {CODE_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('visibility')}
                    value="public"
                    className="mr-2"
                  />
                  <Globe className="w-4 h-4 mr-2" />
                  Public
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('visibility')}
                    value="private"
                    className="mr-2"
                  />
                  <Lock className="w-4 h-4 mr-2" />
                  Private
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags ({selectedTags.length}/10)
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Add tags..."
                disabled={selectedTags.length >= 10}
              />
              
              {/* AI Tag Generator */}
              <div className="mt-3">
                <AITagGenerator
                  code={code}
                  language={selectedLanguage}
                  existingTags={selectedTags}
                  onTagsGenerated={handleTagsGenerated}
                />
              </div>

              {/* Popular tags */}
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_TAGS.slice(0, 8).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={selectedTags.includes(tag) || selectedTags.length >= 10}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected tags */}
              {selectedTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full flex items-center"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-primary-200 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Code
            </label>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage}
              readOnly={isPreview}
              height="500px"
            />

            {/* Code Execution */}
            {showCodeExecution && canExecute && (
              <CodeExecutionSandbox
                code={code}
                language={selectedLanguage}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6">
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {snippet ? 'Update' : 'Create'} Snippet
            </Button>
          </div>
        </div>
      </form>

      {/* AI Suggestions Panel */}
      <AICodeSuggestions
        code={code}
        language={selectedLanguage}
        onApplySuggestion={handleApplySuggestion}
        isVisible={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
      />
    </div>
  );
};

export default SnippetEditor;