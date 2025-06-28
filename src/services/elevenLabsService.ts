import { supabase } from '../lib/supabase';

// ElevenLabs API configuration
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

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
        modelId = 'eleven_multilingual_v2',
        stability = 0.5,
        similarityBoost = 0.75,
        style = 0,
        speakerBoost = true,
      } = request;

      // Check if API key is configured and valid
      if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '' || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key') {
        console.warn('ElevenLabs API key is not configured. Using fallback audio generation.');
        return generateFallbackAudio(text);
      }

      console.log(`Converting text to speech: "${text.substring(0, 50)}..." with voice ${voiceId}`);

      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: { 
            stability, 
            similarity_boost: similarityBoost, 
            style, 
            speaker_boost: speakerBoost 
          },
          optimize_streaming_latency: 2,
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail?.message || errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the status text
        }

        console.warn(`ElevenLabs API error: ${errorMessage}. Using fallback audio generation.`);
        return generateFallbackAudio(text);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      await trackVoiceGeneration(text, voiceId, audioBlob.size);
      return audioUrl;
    } catch (error) {
      console.warn('Error generating speech with ElevenLabs, using fallback:', error);
      return generateFallbackAudio(text);
    }
  },

  /**
   * Get available voices from ElevenLabs
   */
  getVoices: async () => {
    try {
      if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '' || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key') {
        return getDefaultVoices();
      }

      const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      });

      if (!response.ok) {
        console.warn('Failed to fetch ElevenLabs voices, using defaults');
        return getDefaultVoices();
      }

      return await response.json();
    } catch (error) {
      console.warn('Error fetching ElevenLabs voices, using defaults:', error);
      return getDefaultVoices();
    }
  },

  /**
   * Get user's subscription info from ElevenLabs
   */
  getUserSubscription: async () => {
    try {
      if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '' || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key') {
        return getDefaultSubscription();
      }

      const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      });

      if (!response.ok) {
        console.warn('Failed to fetch ElevenLabs subscription, using defaults');
        return getDefaultSubscription();
      }

      const data = await response.json();
      return {
        ...data,
        remainingTokens: data.character_limit - data.character_count,
      };
    } catch (error) {
      console.warn('Error fetching ElevenLabs subscription, using defaults:', error);
      return getDefaultSubscription();
    }
  },
};

// Fallback function for when ElevenLabs API is not available
function generateFallbackAudio(text: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      // Use Web Speech API as fallback if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Find a good voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.includes('Google')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);
        
        // Return a placeholder URL since Web Speech API doesn't return audio data
        resolve('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      } else {
        // If no speech synthesis available, return empty audio
        resolve('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      }
    } catch (error) {
      console.warn('Fallback audio generation failed:', error);
      resolve('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }
  });
}

// Helper function to get default voices when API is not available
function getDefaultVoices() {
  return {
    voices: Object.entries(DEFAULT_VOICES).map(([type, voiceId]) => ({
      voice_id: voiceId,
      name: type === 'male' ? 'Adam' : type === 'female' ? 'Rachel' : 'Domi',
      category: 'premade',
      description: `Default ${type} voice`,
    }))
  };
}

// Helper function to get default subscription when API is not available
function getDefaultSubscription() {
  return {
    tier: 'free',
    character_count: 0,
    character_limit: 10000,
    remainingTokens: 10000,
    next_character_count_reset_unix: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
}

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