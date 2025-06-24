import { supabase } from '../lib/supabase';

// ElevenLabs API configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
// Remove hardcoded fallback for security

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
        modelId = 'eleven_multilingual_v2', // Updated for multilingual support
        stability = 0.5,
        similarityBoost = 0.75,
        style = 0,
        speakerBoost = true,
      } = request;

      if (!ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API key is not configured');
      }

      console.log(`Converting text to speech: "${text.substring(0, 50)}..." with voice ${voiceId}`);

      // Real API call (replace mock for demo)
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: { stability, similarity_boost: similarityBoost, style, speaker_boost: speakerBoost },
          optimize_streaming_latency: 2, // Strong latency optimization
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.message || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await trackVoiceGeneration(text, voiceId, audioBlob.size); // Track usage
      return audioUrl;
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  },

  /**
   * Get available voices from ElevenLabs
   */
  getVoices: async () => {
    try {
      if (!ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API key is not configured');
      }

      const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return Object.values(DEFAULT_VOICES).map(voiceId => ({
        voice_id: voiceId,
        name: voiceId === DEFAULT_VOICES.male ? 'Adam' : voiceId === DEFAULT_VOICES.female ? 'Rachel' : 'Domi',
        category: 'premade',
        description: 'Mock voice',
      }));
    }
  },

  /**
   * Get user's subscription info from ElevenLabs
   */
  getUserSubscription: async () => {
    try {
      if (!ELEVENLABS_API_KEY) {
        throw new Error('ElevenLabs API key is not configured');
      }

      const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        remainingTokens: data.character_limit - data.character_count, // Custom field
      };
    } catch (error) {
      console.error('Error fetching ElevenLabs subscription:', error);
      return {
        tier: 'free',
        character_count: 0,
        character_limit: 599000, // Your custom limit
        remainingTokens: 599000,
        next_character_count_reset_unix: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
    }
  },
};

// Helper function to track voice generation in analytics
async function trackVoiceGeneration(text: string, voiceId: string, byteSize?: number) {
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
        byte_size: byteSize,
        voice_id,
        provider: 'elevenlabs',
      },
    });
  } catch (error) {
    console.error('Error tracking voice generation:', error);
    // Non-critical error, don't throw
  }
}

export default elevenLabsService;