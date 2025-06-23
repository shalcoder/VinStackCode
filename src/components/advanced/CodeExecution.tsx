import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Terminal, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  status: 'success' | 'error' | 'timeout';
}

interface CodeExecutionProps {
  code: string;
  language: string;
  onExecute?: (result: ExecutionResult) => void;
}

const CodeExecution: React.FC<CodeExecutionProps> = ({
  code,
  language,
  onExecute,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const supportedLanguages = ['javascript', 'python', 'typescript'];
  const isSupported = supportedLanguages.includes(language);

  const executeCode = async () => {
    if (!isSupported || !code.trim()) return;

    setIsExecuting(true);
    setResult(null);

    try {
      const startTime = Date.now();
      
      // Mock execution - in production, this would call a secure sandboxed execution service
      const mockResult = await mockCodeExecution(code, language);
      const executionTime = Date.now() - startTime;

      const executionResult: ExecutionResult = {
        ...mockResult,
        executionTime,
      };

      setResult(executionResult);
      onExecute?.(executionResult);
    } catch (error) {
      const executionResult: ExecutionResult = {
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        executionTime: 0,
        status: 'error',
      };
      setResult(executionResult);
      onExecute?.(executionResult);
    } finally {
      setIsExecuting(false);
    }
  };

  const mockCodeExecution = async (code: string, language: string): Promise<Omit<ExecutionResult, 'executionTime'>> => {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    if (language === 'javascript' || language === 'typescript') {
      try {
        // Create a safe execution context
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map(arg => String(arg)).join(' ')),
          error: (...args: any[]) => logs.push('ERROR: ' + args.map(arg => String(arg)).join(' ')),
          warn: (...args: any[]) => logs.push('WARN: ' + args.map(arg => String(arg)).join(' ')),
        };

        // Simple evaluation for demo purposes
        // In production, use a proper sandboxed environment
        const wrappedCode = `
          (function() {
            const console = arguments[0];
            ${code}
          })
        `;

        const func = eval(wrappedCode);
        func(mockConsole);

        return {
          output: logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)',
          status: 'success',
        };
      } catch (error) {
        return {
          output: '',
          error: error instanceof Error ? error.message : 'Runtime error',
          status: 'error',
        };
      }
    } else if (language === 'python') {
      // Mock Python execution
      if (code.includes('print(')) {
        const printMatches = code.match(/print\((.*?)\)/g);
        const output = printMatches?.map(match => {
          const content = match.replace(/print\(|\)/g, '').replace(/['"]/g, '');
          return content;
        }).join('\n') || 'Hello, World!';
        
        return {
          output,
          status: 'success',
        };
      } else {
        return {
          output: 'Code executed successfully (no output)',
          status: 'success',
        };
      }
    }

    return {
      output: '',
      error: 'Language not supported for execution',
      status: 'error',
    };
  };

  const getStatusIcon = () => {
    if (isExecuting) return <LoadingSpinner size="sm" />;
    if (!result) return <Play className="w-4 h-4" />;
    
    switch (result.status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'timeout':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return 'text-gray-400';
    
    switch (result.status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'timeout':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Terminal className="w-5 h-5 text-primary-500" />
          <span className="font-medium text-white">Code Execution</span>
          {!isSupported && (
            <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded-full">
              Not Supported
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {result && (
            <div className="flex items-center space-x-2 text-sm">
              <span className={getStatusColor()}>
                {result.executionTime}ms
              </span>
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={executeCode}
            disabled={!isSupported || !code.trim() || isExecuting}
          >
            {getStatusIcon()}
            <span className="ml-2">
              {isExecuting ? 'Running...' : 'Run Code'}
            </span>
          </Button>
        </div>
      </div>

      {/* Results */}
      {(result || isExecuting) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-700"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">Output</span>
                {result && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    result.status === 'success' 
                      ? 'bg-green-600 text-green-100'
                      : result.status === 'error'
                      ? 'bg-red-600 text-red-100'
                      : 'bg-yellow-600 text-yellow-100'
                  }`}>
                    {result.status}
                  </span>
                )}
              </div>
              
              {result && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              )}
            </div>

            <div className={`bg-gray-900 rounded-lg p-3 font-mono text-sm ${
              isExpanded ? 'max-h-none' : 'max-h-32'
            } overflow-y-auto`}>
              {isExecuting ? (
                <div className="flex items-center space-x-2 text-gray-400">
                  <LoadingSpinner size="sm" />
                  <span>Executing code...</span>
                </div>
              ) : result ? (
                <div className="space-y-2">
                  {result.output && (
                    <div className="text-gray-100 whitespace-pre-wrap">
                      {result.output}
                    </div>
                  )}
                  {result.error && (
                    <div className="text-red-400 whitespace-pre-wrap">
                      Error: {result.error}
                    </div>
                  )}
                  {!result.output && !result.error && (
                    <div className="text-gray-400 italic">
                      No output
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {result && (
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>Execution time: {result.executionTime}ms</span>
                <span>Language: {language}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      {!isSupported && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-start space-x-2 text-sm text-gray-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="mb-1">Code execution is not supported for {language}.</p>
              <p>Supported languages: {supportedLanguages.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExecution;