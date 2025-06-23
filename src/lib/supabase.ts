import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
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