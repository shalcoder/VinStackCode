import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Comment = Database['public']['Tables']['snippet_comments']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
  replies?: Comment[];
};

type CommentInsert = Database['public']['Tables']['snippet_comments']['Insert'];
type CommentUpdate = Database['public']['Tables']['snippet_comments']['Update'];

export const useComments = (snippetId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('snippet_comments')
        .select(`
          *,
          profiles!snippet_comments_author_id_fkey(username, avatar_url)
        `)
        .eq('snippet_id', snippetId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize comments into threads
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      // First pass: create comment objects
      data.forEach(comment => {
        const commentWithReplies = { ...comment, replies: [] };
        commentMap.set(comment.id, commentWithReplies);
      });

      // Second pass: organize into threads
      data.forEach(comment => {
        const commentWithReplies = commentMap.get(comment.id)!;
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      });

      setComments(rootComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (comment: CommentInsert) => {
    try {
      const { data, error } = await supabase
        .from('snippet_comments')
        .insert(comment)
        .select(`
          *,
          profiles!snippet_comments_author_id_fkey(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Refresh comments to maintain proper threading
      await fetchComments();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add comment');
    }
  };

  const updateComment = async (id: string, updates: CommentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('snippet_comments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles!snippet_comments_author_id_fkey(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      await fetchComments();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update comment');
    }
  };

  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('snippet_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchComments();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete comment');
    }
  };

  const resolveComment = async (id: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('snippet_comments')
        .update({
          is_resolved: true,
          resolved_by: userId,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await fetchComments();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to resolve comment');
    }
  };

  useEffect(() => {
    fetchComments();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`comments:${snippetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'snippet_comments',
          filter: `snippet_id=eq.${snippetId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [snippetId]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    resolveComment,
    refetch: fetchComments,
  };
};