import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Collaborator = Database['public']['Tables']['snippet_collaborators']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type CollaboratorInsert = Database['public']['Tables']['snippet_collaborators']['Insert'];

interface CursorPosition {
  userId: string;
  username: string;
  line: number;
  column: number;
  color: string;
}

export const useCollaboration = (snippetId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [activeCursors, setActiveCursors] = useState<CursorPosition[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCollaborators = async () => {
    try {
      const { data, error } = await supabase
        .from('snippet_collaborators')
        .select(`
          *,
          profiles!snippet_collaborators_user_id_fkey(username, avatar_url)
        `)
        .eq('snippet_id', snippetId)
        .not('accepted_at', 'is', null);

      if (error) throw error;
      setCollaborators(data || []);
    } catch (err) {
      console.error('Error fetching collaborators:', err);
    } finally {
      setLoading(false);
    }
  };

  const inviteCollaborator = async (email: string, role: 'editor' | 'commenter' | 'viewer', invitedBy: string) => {
    try {
      // First, find the user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError) {
        throw new Error('User not found');
      }

      const invitation: CollaboratorInsert = {
        snippet_id: snippetId,
        user_id: profile.id,
        role,
        invited_by: invitedBy,
      };

      const { data, error } = await supabase
        .from('snippet_collaborators')
        .insert(invitation)
        .select(`
          *,
          profiles!snippet_collaborators_user_id_fkey(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Send notification
      await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'collaboration',
          title: 'Collaboration Invitation',
          message: `You've been invited to collaborate on a snippet`,
          data: { snippet_id: snippetId, role },
        });

      await fetchCollaborators();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to invite collaborator');
    }
  };

  const acceptInvitation = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('snippet_collaborators')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', collaboratorId);

      if (error) throw error;
      await fetchCollaborators();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to accept invitation');
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('snippet_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;
      await fetchCollaborators();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to remove collaborator');
    }
  };

  const updateCollaboratorRole = async (collaboratorId: string, role: 'editor' | 'commenter' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('snippet_collaborators')
        .update({ role })
        .eq('id', collaboratorId);

      if (error) throw error;
      await fetchCollaborators();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update collaborator role');
    }
  };

  const broadcastCursorPosition = useCallback((position: Omit<CursorPosition, 'userId' | 'username' | 'color'>) => {
    if (!isConnected) return;

    supabase.channel(`snippet:${snippetId}`).send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: position,
    });
  }, [snippetId, isConnected]);

  const joinCollaborationSession = useCallback(() => {
    const channel = supabase.channel(`snippet:${snippetId}`)
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        const { userId, username, line, column, color } = payload.payload;
        setActiveCursors(prev => {
          const filtered = prev.filter(cursor => cursor.userId !== userId);
          return [...filtered, { userId, username, line, column, color }];
        });
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        setActiveCursors(prev => prev.filter(cursor => cursor.userId !== key));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Track presence
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
      setIsConnected(false);
    };
  }, [snippetId]);

  useEffect(() => {
    fetchCollaborators();

    // Subscribe to collaborator changes
    const subscription = supabase
      .channel(`collaborators:${snippetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'snippet_collaborators',
          filter: `snippet_id=eq.${snippetId}`,
        },
        () => {
          fetchCollaborators();
        }
      )
      .subscribe();

    // Join collaboration session
    const cleanup = joinCollaborationSession();

    return () => {
      subscription.unsubscribe();
      cleanup();
    };
  }, [snippetId, joinCollaborationSession]);

  return {
    collaborators,
    activeCursors,
    isConnected,
    loading,
    inviteCollaborator,
    acceptInvitation,
    removeCollaborator,
    updateCollaboratorRole,
    broadcastCursorPosition,
  };
};