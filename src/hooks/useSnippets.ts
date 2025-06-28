import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Snippet = Database['public']['Tables']['snippets']['Row'];
type SnippetInsert = Database['public']['Tables']['snippets']['Insert'];
type SnippetUpdate = Database['public']['Tables']['snippets']['Update'];

export const useSnippets = (userId?: string) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('snippets')
        .select(`
          *,
          profiles:owner_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.eq('owner_id', userId);
      } else {
        // If no userId provided, show public snippets
        query = query.eq('visibility', 'public');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        // Handle specific RLS policy errors gracefully
        if (fetchError.message?.includes('infinite recursion') || fetchError.code === '42P17') {
          console.warn('Database policy error detected, using fallback query');
          
          // Fallback to a simpler query without joins that might trigger RLS issues
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('snippets')
            .select('*')
            .eq('is_archived', false)
            .eq('visibility', 'public')
            .order('updated_at', { ascending: false });

          if (fallbackError) {
            throw fallbackError;
          }

          setSnippets(fallbackData || []);
          return;
        }
        
        throw fetchError;
      }

      setSnippets(data || []);
    } catch (err: any) {
      console.error('Error fetching snippets:', err);
      setError(err.message || 'Failed to fetch snippets');
      
      // If it's a network error or policy error, set empty array instead of keeping loading state
      if (err.message?.includes('Failed to fetch') || 
          err.name === 'TypeError' || 
          err.message?.includes('infinite recursion') ||
          err.code === '42P17') {
        setSnippets([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createSnippet = async (snippet: SnippetInsert) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .insert(snippet)
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating snippet:', err);
      throw err;
    }
  };

  const updateSnippet = async (id: string, updates: SnippetUpdate) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => 
        prev.map(snippet => 
          snippet.id === id ? data : snippet
        )
      );
      return data;
    } catch (err: any) {
      console.error('Error updating snippet:', err);
      throw err;
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
    } catch (err: any) {
      console.error('Error deleting snippet:', err);
      throw err;
    }
  };

  const searchSnippets = async (query: string, filters?: {
    language?: string;
    tags?: string[];
    visibility?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      let supabaseQuery = supabase
        .from('snippets')
        .select(`
          *,
          profiles:owner_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('is_archived', false);

      if (query) {
        supabaseQuery = supabaseQuery.textSearch('search_vector', query);
      }

      if (filters?.language) {
        supabaseQuery = supabaseQuery.eq('language', filters.language);
      }

      if (filters?.tags && filters.tags.length > 0) {
        supabaseQuery = supabaseQuery.overlaps('tags', filters.tags);
      }

      if (filters?.visibility) {
        supabaseQuery = supabaseQuery.eq('visibility', filters.visibility);
      } else if (!userId) {
        // Default to public if no user context
        supabaseQuery = supabaseQuery.eq('visibility', 'public');
      }

      if (userId) {
        supabaseQuery = supabaseQuery.eq('owner_id', userId);
      }

      const { data, error: searchError } = await supabaseQuery
        .order('updated_at', { ascending: false });

      if (searchError) {
        // Handle RLS policy errors in search as well
        if (searchError.message?.includes('infinite recursion') || searchError.code === '42P17') {
          console.warn('Database policy error in search, using fallback');
          
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('snippets')
            .select('*')
            .eq('is_archived', false)
            .eq('visibility', 'public')
            .order('updated_at', { ascending: false });

          if (fallbackError) throw fallbackError;
          
          setSnippets(fallbackData || []);
          return fallbackData || [];
        }
        
        throw searchError;
      }

      setSnippets(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error searching snippets:', err);
      setError(err.message || 'Failed to search snippets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [userId]);

  return {
    snippets,
    loading,
    error,
    fetchSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    searchSnippets,
  };
};