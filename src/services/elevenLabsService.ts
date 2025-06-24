import { supabase } from '../lib/supabase';

// ElevenLabs API configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_62615686dbcdc926805170513cb3078b21762844216790b9';

// Default voice IDs
const DEFAULT_VOICES = {
  male: '21m00Tcm4TlvDq8ikWAM', // Adam
  female: 'EXAVITQu4vr4xnSDxMaL', // Rachel
  neutral: 'onwK4e9ZLuTAKqWW03F9', // Domi
};

interface TextToSpeechRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  speakerBoost?: boolean;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  speaker_boost?: boolean;
}

export const elevenLabsService = {
  /**
   * Convert text to speech using ElevenLabs API
   */
  textToSpeech: async (request: TextToSpeechRequest): Promise<string> => {
    try {
      const {
        text,
        voiceId = DEFAULT_VOICES.neutral,
        modelId = 'eleven_monolingual_v1',
        stability = 0.5,
        similarityBoost = 0.75,
        style = 0,
        speakerBoost = true,
      } = request;

      // For the hackathon, we'll mock the API response
      console.log(`Using ElevenLabs API key: ${ELEVENLABS_API_KEY}`);
      console.log(`Converting text to speech: "${text.substring(0, 50)}..."`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock audio URL
      // In a real implementation, this would be the URL returned by ElevenLabs
      const audioId = `eleven_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const mockAudioUrl = `https://elevenlabs-samples.s3.amazonaws.com/${audioId}.mp3`;
      
      // Track usage in analytics
      await trackVoiceGeneration(text, voiceId);
      
      return mockAudioUrl;
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      throw new Error('Failed to generate speech');
    }
  },
  
  /**
   * Get available voices from ElevenLabs
   */
  getVoices: async () => {
    try {
      // In a real implementation, this would call the ElevenLabs API
      // For the hackathon, we'll return mock data
      
      return [
        {
          voice_id: DEFAULT_VOICES.male,
          name: 'Adam',
          category: 'premade',
          description: 'A professional male voice with a neutral accent',
        },
        {
          voice_id: DEFAULT_VOICES.female,
          name: 'Rachel',
          category: 'premade',
          description: 'A professional female voice with a neutral accent',
        },
        {
          voice_id: DEFAULT_VOICES.neutral,
          name: 'Domi',
          category: 'premade',
          description: 'A neutral voice with a balanced tone',
        },
      ];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  },
  
  /**
   * Get user's subscription info from ElevenLabs
   */
  getUserSubscription: async () => {
    try {
      // Mock subscription data
      return {
        tier: 'free',
        character_count: 10000,
        character_limit: 10000,
        can_extend_character_limit: true,
        allowed_to_extend_character_limit: true,
        next_character_count_reset_unix: Date.now() + 30 * 24 * 60 * 60 * 1000,
        voice_limit: 3,
        professional_voice_limit: 0,
        can_extend_voice_limit: true,
        can_use_instant_voice_cloning: true,
        can_use_professional_voice_cloning: false,
        currency: 'USD',
      };
    } catch (error) {
      console.error('Error fetching ElevenLabs subscription:', error);
      return null;
    }
  },
};

// Helper function to track voice generation in analytics
async function trackVoiceGeneration(text: string, voiceId: string) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    
    await supabase.from('activities').insert({
      user_id: user.id,
      type: 'create',
      entity_type: 'voice',
      entity_id: `voice_${Date.now()}`,
      description: 'Generated voice feedback',
      metadata: {
        text_length: text.length,
        voice_id: voiceId,
        provider: 'elevenlabs',
      },
    });
  } catch (error) {
    console.error('Error tracking voice generation:', error);
    // Non-critical error, don't throw
  }
}

export default elevenLabsService;