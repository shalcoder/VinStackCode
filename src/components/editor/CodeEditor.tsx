import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { CODE_LANGUAGES } from '../../utils/constants';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false,
  height = '400px'
}) => {
  const handleEditorChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  const monacoLanguage = CODE_LANGUAGES.find(lang => lang.id === language)?.monacoId || 'javascript';

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={monacoLanguage}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          readOnly,
          cursorBlinking: 'smooth',
          fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontLigatures: true,
          renderWhitespace: 'selection',
          selectOnLineNumbers: true,
          matchBrackets: 'always',
          folding: true,
          foldingHighlight: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
};

export default CodeEditor;