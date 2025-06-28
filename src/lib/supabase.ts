import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from '../types/database';

// Get environment variables from Expo constants
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your app.config.ts file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Real-time subscription helpers
export const subscribeToSnippetChanges = (
  snippetId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`snippet:${snippetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'snippets',
        filter: `id=eq.${snippetId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToComments = (
  snippetId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`comments:${snippetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'snippet_comments',
        filter: `snippet_id=eq.${snippetId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToCollaborators = (
  snippetId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`collaborators:${snippetId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'snippet_collaborators',
        filter: `snippet_id=eq.${snippetId}`,
      },
      callback
    )
    .subscribe();
};