import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Terminal, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import Button from '../ui/Button';

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  status: 'success' | 'error' | 'timeout';
  logs: string[];
}

interface CodeExecutionSandboxProps {
  code: string;
  language: string;
  onExecute?: (result: ExecutionResult) => void;
}

const CodeExecutionSandbox: React.FC<CodeExecutionSandboxProps> = ({
  code,
  language,
  onExecute,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const supportedLanguages = ['javascript', 'html', 'css', 'python'];
  const isSupported = supportedLanguages.includes(language);

  const executeCode = async () => {
    if (!isSupported || !code.trim()) return;

    setIsExecuting(true);
    setResult(null);

    try {
      const startTime = Date.now();
      let executionResult: ExecutionResult;

      if (language === 'html' || (language === 'javascript' && code.includes('<'))) {
        executionResult = await executeHTML(code);
      } else if (language === 'javascript') {
        executionResult = await executeJavaScript(code);
      } else if (language === 'python') {
        executionResult = await executePython(code);
      } else {
        throw new Error('Unsupported language');
      }

      executionResult.executionTime = Date.now() - startTime;
      setResult(executionResult);
      onExecute?.(executionResult);
    } catch (error) {
      const executionResult: ExecutionResult = {
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        executionTime: 0,
        status: 'error',
        logs: [],
      };
      setResult(executionResult);
      onExecute?.(executionResult);
    } finally {
      setIsExecuting(false);
    }
  };

  const executeHTML = async (code: string): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
      const iframe = iframeRef.current;
      if (!iframe) {
        resolve({
          output: '',
          error: 'Iframe not available',
          status: 'error',
          executionTime: 0,
          logs: [],
        });
        return;
      }

      // Create a complete HTML document
      const htmlContent = code.includes('<!DOCTYPE') ? code : `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .output { background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0; }
          </style>
        </head>
        <body>
          ${code}
          <script>
            // Capture console output
            const originalLog = console.log;
            const logs = [];
            console.log = function(...args) {
              logs.push(args.join(' '));
              originalLog.apply(console, args);
            };
            
            // Send results back to parent
            window.addEventListener('load', () => {
              setTimeout(() => {
                parent.postMessage({
                  type: 'execution-result',
                  output: document.body.innerHTML,
                  logs: logs,
                  status: 'success'
                }, '*');
              }, 100);
            });
          </script>
        </body>
        </html>
      `;

      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'execution-result') {
          window.removeEventListener('message', handleMessage);
          resolve({
            output: event.data.output,
            status: event.data.status,
            executionTime: 0,
            logs: event.data.logs || [],
          });
        }
      };

      window.addEventListener('message', handleMessage);

      // Set iframe content
      iframe.srcdoc = htmlContent;

      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        resolve({
          output: '',
          error: 'Execution timeout',
          status: 'timeout',
          executionTime: 5000,
          logs: [],
        });
      }, 5000);
    });
  };

  const executeJavaScript = async (code: string): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
      const logs: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      // Override console methods
      console.log = (...args) => {
        logs.push('LOG: ' + args.map(arg => String(arg)).join(' '));
        originalLog.apply(console, args);
      };
      console.error = (...args) => {
        logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        originalError.apply(console, args);
      };
      console.warn = (...args) => {
        logs.push('WARN: ' + args.map(arg => String(arg)).join(' '));
        originalWarn.apply(console, args);
      };

      try {
        // Create a safe execution context
        const func = new Function('console', code);
        func(console);

        // Restore console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        resolve({
          output: logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)',
          status: 'success',
          executionTime: 0,
          logs,
        });
      } catch (error) {
        // Restore console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        resolve({
          output: '',
          error: error instanceof Error ? error.message : 'Runtime error',
          status: 'error',
          executionTime: 0,
          logs,
        });
      }
    });
  };

  const executePython = async (code: string): Promise<ExecutionResult> => {
    // Mock Python execution - in production, use Pyodide or server-side execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    const logs: string[] = [];
    
    // Simple Python simulation
    if (code.includes('print(')) {
      const printMatches = code.match(/print\((.*?)\)/g);
      if (printMatches) {
        printMatches.forEach(match => {
          const content = match.replace(/print\(|\)/g, '').replace(/['"]/g, '');
          logs.push(content);
        });
      }
    }

    return {
      output: logs.length > 0 ? logs.join('\n') : 'Python code executed successfully',
      status: 'success',
      executionTime: 0,
      logs,
    };
  };

  const downloadOutput = () => {
    if (!result) return;

    const content = result.output || result.error || 'No output';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-output-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    if (isExecuting) return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />;
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
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadOutput}
                className="p-1"
              >
                <Download className="w-3 h-3" />
              </Button>
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

            {/* Output Display */}
            <div className={`bg-gray-900 rounded-lg p-3 font-mono text-sm ${
              isExpanded ? 'max-h-none' : 'max-h-32'
            } overflow-y-auto`}>
              {isExecuting ? (
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />
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
                  {result.logs.length > 0 && (
                    <div className="text-blue-400 whitespace-pre-wrap">
                      {result.logs.join('\n')}
                    </div>
                  )}
                  {!result.output && !result.error && result.logs.length === 0 && (
                    <div className="text-gray-400 italic">
                      No output
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* HTML Preview */}
            {language === 'html' && result?.status === 'success' && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Preview:</h4>
                <iframe
                  ref={iframeRef}
                  className="w-full h-64 border border-gray-600 rounded bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            )}

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

export default CodeExecutionSandbox;