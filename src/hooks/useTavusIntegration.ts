import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface TavusConfig {
  apiKey: string;
  baseUrl: string;
  defaultVoice: string;
  defaultAvatar: string;
}

interface VideoGenerationOptions {
  script: string;
  voice?: string;
  avatar?: string;
  background?: string;
  language?: string;
  customizations?: Record<string, any>;
}

interface VideoGenerationResult {
  videoId: string;
  videoUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTime?: number;
  error?: string;
}

export const useTavusIntegration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = useCallback(async (
    options: VideoGenerationOptions
  ): Promise<VideoGenerationResult> => {
    setIsGenerating(true);
    setError(null);

    try {
      // In production, this would call the actual Tavus API
      const response = await mockTavusAPI(options);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const getVideoStatus = useCallback(async (videoId: string): Promise<VideoGenerationResult> => {
    try {
      // Mock status check - in production, this would call Tavus API
      const response = await mockTavusStatusCheck(videoId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get video status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const saveVideoToSnippet = useCallback(async (
    snippetId: string,
    videoUrl: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const { error } = await supabase
        .from('snippets')
        .update({
          custom_fields: {
            video_url: videoUrl,
            video_metadata: metadata,
            video_generated_at: new Date().toISOString(),
          }
        })
        .eq('id', snippetId);

      if (error) throw error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save video';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    generateVideo,
    getVideoStatus,
    saveVideoToSnippet,
    isGenerating,
    error,
  };
};

// Mock Tavus API functions - replace with actual API calls in production
const mockTavusAPI = async (options: VideoGenerationOptions): Promise<VideoGenerationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const videoId = `tavus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    videoId,
    videoUrl: `https://tavus-videos.s3.amazonaws.com/generated/${videoId}.mp4`,
    status: 'processing',
    progress: 0,
    estimatedTime: 120,
  };
};

const mockTavusStatusCheck = async (videoId: string): Promise<VideoGenerationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate different statuses based on videoId
  if (videoId.includes('error')) {
    return {
      videoId,
      videoUrl: '',
      status: 'failed',
      progress: 0,
      error: 'Failed to generate video due to server error',
    };
  }

  // Extract progress from videoId for demo purposes
  const now = Date.now();
  const creationTime = parseInt(videoId.split('_')[1]);
  const elapsedSeconds = (now - creationTime) / 1000;
  
  // Simulate progress over time (complete in about 2 minutes)
  const progress = Math.min(100, Math.floor(elapsedSeconds / 120 * 100));
  
  return {
    videoId,
    videoUrl: `https://tavus-videos.s3.amazonaws.com/generated/${videoId}.mp4`,
    status: progress >= 100 ? 'completed' : 'processing',
    progress,
    estimatedTime: progress < 100 ? Math.ceil(120 - elapsedSeconds) : 0,
  };
};