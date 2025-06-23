export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          preferred_languages: string[];
          theme: 'dark' | 'light';
          editor_settings: Record<string, any>;
          notification_settings: Record<string, any>;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          preferred_languages?: string[];
          theme?: 'dark' | 'light';
          editor_settings?: Record<string, any>;
          notification_settings?: Record<string, any>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          preferred_languages?: string[];
          theme?: 'dark' | 'light';
          editor_settings?: Record<string, any>;
          notification_settings?: Record<string, any>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      snippets: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          language: string;
          tags: string[];
          visibility: 'public' | 'private' | 'team';
          owner_id: string;
          folder_id: string | null;
          team_id: string | null;
          is_archived: boolean;
          is_template: boolean;
          custom_fields: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content: string;
          language: string;
          tags?: string[];
          visibility?: 'public' | 'private' | 'team';
          owner_id: string;
          folder_id?: string | null;
          team_id?: string | null;
          is_archived?: boolean;
          is_template?: boolean;
          custom_fields?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content?: string;
          language?: string;
          tags?: string[];
          visibility?: 'public' | 'private' | 'team';
          owner_id?: string;
          folder_id?: string | null;
          team_id?: string | null;
          is_archived?: boolean;
          is_template?: boolean;
          custom_fields?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      snippet_versions: {
        Row: {
          id: string;
          snippet_id: string;
          version_number: number;
          title: string;
          description: string | null;
          content: string;
          change_message: string | null;
          author_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          snippet_id: string;
          version_number: number;
          title: string;
          description?: string | null;
          content: string;
          change_message?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          snippet_id?: string;
          version_number?: number;
          title?: string;
          description?: string | null;
          content?: string;
          change_message?: string | null;
          author_id?: string | null;
          created_at?: string;
        };
      };
      snippet_collaborators: {
        Row: {
          id: string;
          snippet_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'commenter' | 'viewer';
          permissions: string[];
          invited_by: string | null;
          invited_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          snippet_id: string;
          user_id: string;
          role?: 'owner' | 'editor' | 'commenter' | 'viewer';
          permissions?: string[];
          invited_by?: string | null;
          invited_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          id?: string;
          snippet_id?: string;
          user_id?: string;
          role?: 'owner' | 'editor' | 'commenter' | 'viewer';
          permissions?: string[];
          invited_by?: string | null;
          invited_at?: string;
          accepted_at?: string | null;
        };
      };
      snippet_comments: {
        Row: {
          id: string;
          snippet_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          line_number: number | null;
          selection_start: number | null;
          selection_end: number | null;
          is_resolved: boolean;
          resolved_by: string | null;
          resolved_at: string | null;
          mentions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          snippet_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
          line_number?: number | null;
          selection_start?: number | null;
          selection_end?: number | null;
          is_resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          mentions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          snippet_id?: string;
          author_id?: string;
          parent_id?: string | null;
          content?: string;
          line_number?: number | null;
          selection_start?: number | null;
          selection_end?: number | null;
          is_resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          mentions?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      snippet_likes: {
        Row: {
          id: string;
          snippet_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          snippet_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          snippet_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      snippet_views: {
        Row: {
          id: string;
          snippet_id: string;
          user_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          snippet_id: string;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          snippet_id?: string;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          viewed_at?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          owner_id: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          owner_id: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          owner_id?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          owner_id: string;
          settings: Record<string, any>;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          owner_id: string;
          settings?: Record<string, any>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          avatar_url?: string | null;
          owner_id?: string;
          settings?: Record<string, any>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          permissions: string[];
          joined_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          permissions?: string[];
          joined_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member' | 'viewer';
          permissions?: string[];
          joined_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          user_id: string;
          provider: 'github' | 'gitlab' | 'bitbucket' | 'vscode' | 'slack';
          external_id: string;
          access_token: string | null;
          refresh_token: string | null;
          config: Record<string, any>;
          is_active: boolean;
          last_sync_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: 'github' | 'gitlab' | 'bitbucket' | 'vscode' | 'slack';
          external_id: string;
          access_token?: string | null;
          refresh_token?: string | null;
          config?: Record<string, any>;
          is_active?: boolean;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: 'github' | 'gitlab' | 'bitbucket' | 'vscode' | 'slack';
          external_id?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          config?: Record<string, any>;
          is_active?: boolean;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'comment' | 'mention' | 'like' | 'fork' | 'collaboration' | 'system';
          title: string;
          message: string;
          data: Record<string, any>;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'comment' | 'mention' | 'like' | 'fork' | 'collaboration' | 'system';
          title: string;
          message: string;
          data?: Record<string, any>;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'comment' | 'mention' | 'like' | 'fork' | 'collaboration' | 'system';
          title?: string;
          message?: string;
          data?: Record<string, any>;
          is_read?: boolean;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          type: 'create' | 'update' | 'delete' | 'comment' | 'like' | 'fork' | 'share';
          entity_type: 'snippet' | 'comment' | 'team' | 'folder';
          entity_id: string;
          description: string;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'create' | 'update' | 'delete' | 'comment' | 'like' | 'fork' | 'share';
          entity_type: 'snippet' | 'comment' | 'team' | 'folder';
          entity_id: string;
          description: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'create' | 'update' | 'delete' | 'comment' | 'like' | 'fork' | 'share';
          entity_type?: 'snippet' | 'comment' | 'team' | 'folder';
          entity_id?: string;
          description?: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: 'free' | 'pro' | 'team';
          status: 'active' | 'canceled' | 'past_due' | 'incomplete';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: 'free' | 'pro' | 'team';
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: 'free' | 'pro' | 'team';
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_snippet_views: {
        Args: {
          snippet_uuid: string;
          user_uuid?: string;
        };
        Returns: void;
      };
      get_snippet_stats: {
        Args: {
          snippet_uuid: string;
        };
        Returns: {
          views_count: number;
          likes_count: number;
          comments_count: number;
          versions_count: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}