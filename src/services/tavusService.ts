import { supabase } from '../lib/supabase';

// Tavus API configuration
const TAVUS_API_URL = 'https://api.tavus.io/v1';
const TAVUS_API_KEY = process.env.VITE_TAVUS_API_KEY || 'demo_key_for_hackathon';

interface TavusVideoRequest {
  script: string;
  title?: string;
  language?: string;
  avatar?: string;
  voice?: string;
  background?: string;
  customizations?: Record<string, any>;
}

interface TavusVideoResponse {
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}

export const tavusService = {
  /**
   * Generate a video using Tavus AI
   */
  generateVideo: async (request: TavusVideoRequest): Promise<TavusVideoResponse> => {
    try {
      // In production, this would be a real API call to Tavus
      // For the hackathon, we'll mock the response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const videoId = `tavus_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      return {
        videoId,
        status: 'pending',
      };
    } catch (error) {
      console.error('Error generating Tavus video:', error);
      throw new Error('Failed to generate video');
    }
  },
  
  /**
   * Check the status of a video generation request
   */
  checkVideoStatus: async (videoId: string): Promise<TavusVideoResponse> => {
    try {
      // In production, this would be a real API call to Tavus
      // For the hackathon, we'll mock the response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Extract timestamp from videoId to simulate progress
      const timestamp = videoId.split('_')[1];
      const elapsedTime = Date.now() - parseInt(timestamp);
      
      // Simulate different statuses based on elapsed time
      if (elapsedTime < 5000) {
        return {
          videoId,
          status: 'pending',
        };
      } else if (elapsedTime < 15000) {
        return {
          videoId,
          status: 'processing',
        };
      } else {
        return {
          videoId,
          status: 'completed',
          videoUrl: `https://tavus-videos.s3.amazonaws.com/generated/${videoId}.mp4`,
        };
      }
    } catch (error) {
      console.error('Error checking Tavus video status:', error);
      throw new Error('Failed to check video status');
    }
  },
  
  /**
   * Save video URL to a snippet
   */
  saveVideoToSnippet: async (snippetId: string, videoUrl: string): Promise<void> => {
    try {
      // Get current custom_fields
      const { data: snippet, error: fetchError } = await supabase
        .from('snippets')
        .select('custom_fields')
        .eq('id', snippetId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update with new video URL
      const customFields = {
        ...(snippet.custom_fields || {}),
        video_url: videoUrl,
        video_generated_at: new Date().toISOString(),
      };
      
      const { error: updateError } = await supabase
        .from('snippets')
        .update({ custom_fields: customFields })
        .eq('id', snippetId);
      
      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error saving video to snippet:', error);
      throw new Error('Failed to save video to snippet');
    }
  },
  
  /**
   * Get videos for a snippet
   */
  getVideosForSnippet: async (snippetId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('custom_fields')
        .eq('id', snippetId)
        .single();
      
      if (error) throw error;
      
      const videoUrl = data?.custom_fields?.video_url;
      return videoUrl ? [videoUrl] : [];
    } catch (error) {
      console.error('Error getting videos for snippet:', error);
      return [];
    }
  },
  
  /**
   * Track video generation analytics
   */
  trackVideoGeneration: async (snippetId: string, userId: string): Promise<void> => {
    try {
      await supabase
        .from('snippet_analytics')
        .insert({
          snippet_id: snippetId,
          event_type: 'video_generation',
          user_id: userId,
          metadata: {
            timestamp: new Date().toISOString(),
            provider: 'tavus',
          },
        });
    } catch (error) {
      console.error('Error tracking video generation:', error);
      // Non-critical error, don't throw
    }
  },
};

export default tavusService;