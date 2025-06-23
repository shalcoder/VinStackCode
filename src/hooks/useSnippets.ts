import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Snippet = Database['public']['Tables']['snippets']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
  snippet_likes: { count: number }[];
  snippet_views: { count: number }[];
  snippet_comments: { count: number }[];
};

type SnippetInsert = Database['public']['Tables']['snippets']['Insert'];
type SnippetUpdate = Database['public']['Tables']['snippets']['Update'];

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = async (filters?: {
    visibility?: 'public' | 'private' | 'team';
    language?: string;
    tags?: string[];
    search?: string;
    ownerId?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('snippets')
        .select(`
          *,
          profiles!snippets_owner_id_fkey(username, avatar_url),
          snippet_likes(count),
          snippet_views(count),
          snippet_comments(count)
        `)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (filters?.visibility) {
        query = query.eq('visibility', filters.visibility);
      }

      if (filters?.language) {
        query = query.eq('language', filters.language);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters?.search) {
        query = query.textSearch('search_vector', filters.search);
      }

      if (filters?.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSnippets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSnippet = async (snippet: SnippetInsert) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .insert(snippet)
        .select(`
          *,
          profiles!snippets_owner_id_fkey(username, avatar_url),
          snippet_likes(count),
          snippet_views(count),
          snippet_comments(count)
        `)
        .single();

      if (error) throw error;

      setSnippets(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create snippet');
    }
  };

  const updateSnippet = async (id: string, updates: SnippetUpdate) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles!snippets_owner_id_fkey(username, avatar_url),
          snippet_likes(count),
          snippet_views(count),
          snippet_comments(count)
        `)
        .single();

      if (error) throw error;

      setSnippets(prev => 
        prev.map(snippet => snippet.id === id ? data : snippet)
      );
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update snippet');
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete snippet');
    }
  };

  const likeSnippet = async (snippetId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('snippet_likes')
        .select('id')
        .eq('snippet_id', snippetId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('snippet_likes')
          .delete()
          .eq('snippet_id', snippetId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('snippet_likes')
          .insert({ snippet_id: snippetId, user_id: userId });

        if (error) throw error;
      }

      // Refresh snippets to update like count
      await fetchSnippets();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to toggle like');
    }
  };

  const forkSnippet = async (snippetId: string, userId: string) => {
    try {
      // Get original snippet
      const { data: original, error: fetchError } = await supabase
        .from('snippets')
        .select('*')
        .eq('id', snippetId)
        .single();

      if (fetchError) throw fetchError;

      // Create fork
      const forkData: SnippetInsert = {
        title: `${original.title} (Fork)`,
        description: original.description,
        content: original.content,
        language: original.language,
        tags: original.tags,
        visibility: 'private',
        owner_id: userId,
        custom_fields: {
          ...original.custom_fields,
          forked_from: snippetId,
        },
      };

      return await createSnippet(forkData);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fork snippet');
    }
  };

  const incrementViews = async (snippetId: string, userId?: string) => {
    try {
      await supabase.rpc('increment_snippet_views', {
        snippet_uuid: snippetId,
        user_uuid: userId,
      });
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  return {
    snippets,
    loading,
    error,
    fetchSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    likeSnippet,
    forkSnippet,
    incrementViews,
  };
};