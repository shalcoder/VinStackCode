import { ExpoConfig, ConfigContext } from 'expo/config';

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const ELEVENLABS_API_KEY = process.env.VITE_ELEVENLABS_API_KEY || '';
const SOCKET_URL = process.env.VITE_SOCKET_URL || '';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CodeQuest',
  slug: 'codequest',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a1a'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.codequest.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1a1a1a'
    },
    package: 'com.codequest.app'
  },
  extra: {
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    elevenLabsApiKey: ELEVENLABS_API_KEY,
    socketUrl: SOCKET_URL,
    eas: {
      projectId: 'codequest-hackathon'
    }
  },
  plugins: [
    'expo-font',
    'expo-av'
  ]
});