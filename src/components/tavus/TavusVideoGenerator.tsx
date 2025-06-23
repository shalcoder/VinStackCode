import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Wand2, Play, Download, Share2, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useAuth } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

interface TavusVideoGeneratorProps {
  snippetId: string;
  snippetTitle: string;
  snippetCode: string;
  snippetLanguage: string;
  onVideoGenerated?: (videoUrl: string) => void;
}

interface VideoGenerationRequest {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress: number;
  estimatedTime?: number;
  error?: string;
}

const TavusVideoGenerator: React.FC<TavusVideoGeneratorProps> = ({
  snippetId,
  snippetTitle,
  snippetCode,
  snippetLanguage,
  onVideoGenerated,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customScript, setCustomScript] = useState('');
  const [videoRequest, setVideoRequest] = useState<VideoGenerationRequest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('b20f93fa0d7f41c4a8030b9139e9fa92');

  useEffect(() => {
    // Check if snippet already has a video
    const checkExistingVideo = async () => {
      try {
        const { data, error } = await supabase
          .from('snippets')
          .select('custom_fields')
          .eq('id', snippetId)
          .single();
          
        if (error) throw error;
        
        if (data?.custom_fields?.video_url) {
          setGeneratedVideoUrl(data.custom_fields.video_url);
        }
      } catch (err) {
        console.error('Error checking for existing video:', err);
      }
    };
    
    checkExistingVideo();
  }, [snippetId]);

  const generateDefaultScript = () => {
    return `Hello! Let me explain this ${snippetLanguage} code snippet titled "${snippetTitle}".

${snippetCode.split('\n').slice(0, 10).map((line, index) => 
  `Line ${index + 1}: ${line}`
).join('\n')}

This code demonstrates key concepts in ${snippetLanguage} programming. Let me walk you through the important parts and explain how it works.

The main functionality includes error handling, best practices, and efficient implementation patterns that you can apply in your own projects.

Feel free to fork this snippet and experiment with the code yourself!`;
  };

  const handleGenerateVideo = async (useCustomScript: boolean = false) => {
    if (!user) return;

    setIsGenerating(true);
    const script = useCustomScript ? customScript : generateDefaultScript();

    try {
      // Create video generation request
      const requestId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newRequest: VideoGenerationRequest = {
        id: requestId,
        status: 'pending',
        progress: 0,
        estimatedTime: 120, // 2 minutes estimated
      };

      setVideoRequest(newRequest);
      setIsModalOpen(false);

      // In a real implementation, this would call the Tavus API with the apiKey
      console.log(`Using Tavus API key: ${apiKey}`);
      
      // Mock Tavus API call - in production, this would call the actual Tavus API
      const videoUrl = await mockTavusVideoGeneration(script, snippetLanguage, requestId);
      
      // Update request status
      setVideoRequest(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        videoUrl,
      } : null);

      setGeneratedVideoUrl(videoUrl);
      
      // Save video URL to database
      await supabase
        .from('snippets')
        .update({ 
          custom_fields: { 
            video_url: videoUrl,
            video_generated_at: new Date().toISOString()
          }
        })
        .eq('id', snippetId);

      // Track video generation analytics
      await supabase
        .from('snippet_analytics')
        .insert({
          snippet_id: snippetId,
          event_type: 'video_generation',
          user_id: user.id,
          metadata: {
            video_url: videoUrl,
            generated_at: new Date().toISOString(),
            language: snippetLanguage
          }
        });

      onVideoGenerated?.(videoUrl);

    } catch (error) {
      console.error('Error generating video:', error);
      setVideoRequest(prev => prev ? {
        ...prev,
        status: 'failed',
        error: 'Failed to generate video. Please try again.',
      } : null);
    } finally {
      setIsGenerating(false);
    }
  };

  const mockTavusVideoGeneration = async (
    script: string, 
    language: string, 
    requestId: string
  ): Promise<string> => {
    // Simulate video generation process with progress updates
    const updateProgress = (progress: number) => {
      setVideoRequest(prev => prev ? { ...prev, progress } : null);
    };

    // Simulate processing stages
    updateProgress(10);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProgress(30);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateProgress(60);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateProgress(85);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateProgress(100);

    // Return mock video URL - in production, this would be the actual Tavus video URL
    return `https://tavus-videos.s3.amazonaws.com/generated/${requestId}.mp4`;
  };

  const handleDownloadVideo = () => {
    if (generatedVideoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `${snippetTitle.replace(/\s+/g, '_')}_tutorial.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareVideo = async () => {
    if (generatedVideoUrl) {
      try {
        await navigator.share({
          title: `${snippetTitle} - Video Tutorial`,
          text: `Check out this AI-generated video tutorial for ${snippetLanguage} code!`,
          url: generatedVideoUrl,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(generatedVideoUrl);
      }
    }
  };

  const getStatusIcon = () => {
    if (!videoRequest) return <Video className="w-4 h-4" />;
    
    switch (videoRequest.status) {
      case 'pending':
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    if (!videoRequest) return 'Generate Tutorial';
    
    switch (videoRequest.status) {
      case 'pending':
        return 'Initializing...';
      case 'processing':
        return `Generating... ${videoRequest.progress}%`;
      case 'completed':
        return 'Video Ready!';
      case 'failed':
        return 'Generation Failed';
      default:
        return 'Generate Tutorial';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Generate Button */}
      <div className="flex items-center space-x-3">
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={isGenerating}
          className="flex items-center space-x-2"
        >
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </Button>

        {generatedVideoUrl && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadVideo}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareVideo}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {videoRequest && videoRequest.status !== 'completed' && videoRequest.status !== 'failed' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Generating AI Video Tutorial
            </span>
            <span className="text-sm text-gray-400">
              {videoRequest.progress}%
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <motion.div
              className="bg-primary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${videoRequest.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {videoRequest.estimatedTime && (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Estimated time: {Math.max(0, videoRequest.estimatedTime - (videoRequest.progress * 1.2))}s remaining</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Display */}
      {videoRequest?.status === 'failed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-900/20 border border-red-700 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{videoRequest.error}</span>
          </div>
        </motion.div>
      )}

      {/* Generated Video Player */}
      {generatedVideoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <h4 className="text-lg font-semibold text-white mb-3">
            AI Generated Tutorial
          </h4>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full"
              poster="/api/placeholder/640/360"
            >
              <source src={generatedVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Generated with Tavus AI
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadVideo}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareVideo}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Custom Script Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate AI Video Tutorial"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Create Video Tutorial for "{snippetTitle}"
            </h3>
            <p className="text-gray-400">
              Generate an AI-powered video explanation of your {snippetLanguage} code snippet using Tavus AI.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Code Preview:</h4>
            <pre className="text-sm text-gray-300 bg-gray-900 rounded p-3 overflow-x-auto max-h-32">
              {snippetCode.substring(0, 300)}
              {snippetCode.length > 300 && '...'}
            </pre>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Script (Optional)
            </label>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder="Enter a custom script for the video explanation, or leave blank to use auto-generated script..."
              rows={6}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tip: Describe what you want the AI presenter to explain about your code
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-300 mb-2">What you'll get:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• AI-generated presenter explaining your code</li>
              <li>• Professional video quality (1080p)</li>
              <li>• Downloadable MP4 format</li>
              <li>• Shareable on social media</li>
              <li>• Perfect for tutorials and documentation</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleGenerateVideo(false)}
              disabled={isGenerating}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Auto-Generate
            </Button>
            <Button
              variant="primary"
              onClick={() => handleGenerateVideo(true)}
              disabled={isGenerating || !customScript.trim()}
            >
              <Video className="w-4 h-4 mr-2" />
              Generate with Script
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TavusVideoGenerator;