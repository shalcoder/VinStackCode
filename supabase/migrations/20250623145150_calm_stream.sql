/*
  # Complete VinStackCode Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with preferences
    - `snippets` - Code snippets with full metadata
    - `snippet_versions` - Version history for snippets
    - `snippet_collaborators` - Collaboration permissions
    - `snippet_comments` - Comments and discussions
    - `snippet_likes` - User likes/favorites
    - `snippet_views` - View tracking
    - `folders` - Organization folders
    - `teams` - Team management
    - `team_members` - Team membership
    - `integrations` - External service integrations
    - `notifications` - User notifications
    - `activities` - Activity feed
    - `subscriptions` - Stripe subscription data

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Implement role-based permissions

  3. Performance
    - Add indexes for common queries
    - Full-text search capabilities
    - Optimized for real-time collaboration
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  location text,
  preferred_languages text[] DEFAULT '{}',
  theme text DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  editor_settings jsonb DEFAULT '{}',
  notification_settings jsonb DEFAULT '{}',
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Folders for organization
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  avatar_url text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  settings jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions text[] DEFAULT '{}',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Snippets
CREATE TABLE IF NOT EXISTS snippets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL CHECK (length(title) >= 3 AND length(title) <= 200),
  description text CHECK (length(description) <= 1000),
  content text NOT NULL CHECK (length(content) <= 100000),
  language text NOT NULL,
  tags text[] DEFAULT '{}',
  visibility text DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'team')),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  is_archived boolean DEFAULT false,
  is_template boolean DEFAULT false,
  custom_fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content || ' ' || array_to_string(tags, ' '))
  ) STORED
);

-- Snippet versions for version control
CREATE TABLE IF NOT EXISTS snippet_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  change_message text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(snippet_id, version_number)
);

-- Snippet collaborators
CREATE TABLE IF NOT EXISTS snippet_collaborators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'commenter', 'viewer')),
  permissions text[] DEFAULT '{}',
  invited_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(snippet_id, user_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS snippet_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES snippet_comments(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) <= 2000),
  line_number integer,
  selection_start integer,
  selection_end integer,
  is_resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  mentions uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Likes/Favorites
CREATE TABLE IF NOT EXISTS snippet_likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(snippet_id, user_id)
);

-- View tracking
CREATE TABLE IF NOT EXISTS snippet_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket', 'vscode', 'slack')),
  external_id text NOT NULL,
  access_token text,
  refresh_token text,
  config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('comment', 'mention', 'like', 'fork', 'collaboration', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activity feed
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('create', 'update', 'delete', 'comment', 'like', 'fork', 'share')),
  entity_type text NOT NULL CHECK (entity_type IN ('snippet', 'comment', 'team', 'folder')),
  entity_id uuid NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Subscriptions (Stripe integration)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Snippets policies
CREATE POLICY "Public snippets are viewable by everyone" ON snippets
  FOR SELECT USING (visibility = 'public' AND is_archived = false);

CREATE POLICY "Users can view own snippets" ON snippets
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Collaborators can view snippets" ON snippets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippet_collaborators 
      WHERE snippet_id = snippets.id 
      AND user_id = auth.uid()
      AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can create snippets" ON snippets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own snippets" ON snippets
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Collaborators can update snippets" ON snippets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM snippet_collaborators 
      WHERE snippet_id = snippets.id 
      AND user_id = auth.uid()
      AND role IN ('owner', 'editor')
      AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can delete own snippets" ON snippets
  FOR DELETE USING (auth.uid() = owner_id);

-- Snippet versions policies
CREATE POLICY "Users can view versions of accessible snippets" ON snippet_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippets 
      WHERE id = snippet_versions.snippet_id 
      AND (
        visibility = 'public' 
        OR owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM snippet_collaborators 
          WHERE snippet_id = snippets.id 
          AND user_id = auth.uid()
          AND accepted_at IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can create versions for editable snippets" ON snippet_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM snippets 
      WHERE id = snippet_versions.snippet_id 
      AND (
        owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM snippet_collaborators 
          WHERE snippet_id = snippets.id 
          AND user_id = auth.uid()
          AND role IN ('owner', 'editor')
          AND accepted_at IS NOT NULL
        )
      )
    )
  );

-- Comments policies
CREATE POLICY "Users can view comments on accessible snippets" ON snippet_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippets 
      WHERE id = snippet_comments.snippet_id 
      AND (
        visibility = 'public' 
        OR owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM snippet_collaborators 
          WHERE snippet_id = snippets.id 
          AND user_id = auth.uid()
          AND accepted_at IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can create comments on accessible snippets" ON snippet_comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM snippets 
      WHERE id = snippet_comments.snippet_id 
      AND (
        visibility = 'public' 
        OR owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM snippet_collaborators 
          WHERE snippet_id = snippets.id 
          AND user_id = auth.uid()
          AND role IN ('owner', 'editor', 'commenter')
          AND accepted_at IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can update own comments" ON snippet_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON snippet_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Users can view likes on accessible snippets" ON snippet_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippets 
      WHERE id = snippet_likes.snippet_id 
      AND (
        visibility = 'public' 
        OR owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM snippet_collaborators 
          WHERE snippet_id = snippets.id 
          AND user_id = auth.uid()
          AND accepted_at IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can manage own likes" ON snippet_likes
  FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_snippets_owner ON snippets(owner_id);
CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON snippets(visibility) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets(language) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_snippets_created ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_updated ON snippets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_search ON snippets USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON snippets USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_snippet_versions_snippet ON snippet_versions(snippet_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_collaborators_snippet ON snippet_collaborators(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_collaborators_user ON snippet_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_snippet ON snippet_comments(snippet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_snippet ON snippet_likes(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_user ON snippet_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id, created_at DESC);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippets_updated_at BEFORE UPDATE ON snippets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippet_comments_updated_at BEFORE UPDATE ON snippet_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment snippet views
CREATE OR REPLACE FUNCTION increment_snippet_views(snippet_uuid uuid, user_uuid uuid DEFAULT NULL)
RETURNS void AS $$
BEGIN
  INSERT INTO snippet_views (snippet_id, user_id, viewed_at)
  VALUES (snippet_uuid, user_uuid, now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get snippet statistics
CREATE OR REPLACE FUNCTION get_snippet_stats(snippet_uuid uuid)
RETURNS TABLE(
  views_count bigint,
  likes_count bigint,
  comments_count bigint,
  versions_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM snippet_views WHERE snippet_id = snippet_uuid),
    (SELECT COUNT(*) FROM snippet_likes WHERE snippet_id = snippet_uuid),
    (SELECT COUNT(*) FROM snippet_comments WHERE snippet_id = snippet_uuid),
    (SELECT COUNT(*) FROM snippet_versions WHERE snippet_id = snippet_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;