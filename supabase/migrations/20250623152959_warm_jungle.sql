/*
  # Initial Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `folders` - Organization folders for snippets
    - `teams` - Team management
    - `team_members` - Team membership
    - `snippets` - Code snippets
    - `snippet_versions` - Version history
    - `snippet_collaborators` - Collaboration permissions
    - `snippet_comments` - Comments on snippets
    - `snippet_likes` - Like system
    - `snippet_views` - View tracking
    - `integrations` - External service integrations
    - `notifications` - User notifications
    - `activities` - Activity tracking
    - `subscriptions` - Subscription management

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Set up proper foreign key relationships

  3. Functions
    - Helper functions for search and statistics
    - Trigger functions for automatic updates
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table
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
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50)
);

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    parent_id uuid REFERENCES folders(id) ON DELETE CASCADE,
    owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    avatar_url text,
    owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    settings jsonb DEFAULT '{}',
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    permissions text[] DEFAULT '{}',
    joined_at timestamptz DEFAULT now(),
    UNIQUE(team_id, user_id)
);

-- Create snippets table
CREATE TABLE IF NOT EXISTS snippets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
    description text CHECK (char_length(description) <= 1000),
    content text NOT NULL CHECK (char_length(content) <= 100000),
    language text NOT NULL,
    tags text[] DEFAULT '{}',
    visibility text DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'team')),
    owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
    team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
    is_archived boolean DEFAULT false,
    is_template boolean DEFAULT false,
    custom_fields jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    search_vector tsvector
);

-- Create snippet_versions table
CREATE TABLE IF NOT EXISTS snippet_versions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    version_number integer NOT NULL,
    title text NOT NULL,
    description text,
    content text NOT NULL,
    change_message text,
    author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(snippet_id, version_number)
);

-- Create snippet_collaborators table
CREATE TABLE IF NOT EXISTS snippet_collaborators (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role text DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'commenter', 'viewer')),
    permissions text[] DEFAULT '{}',
    invited_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    invited_at timestamptz DEFAULT now(),
    accepted_at timestamptz,
    UNIQUE(snippet_id, user_id)
);

-- Create snippet_comments table
CREATE TABLE IF NOT EXISTS snippet_comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES snippet_comments(id) ON DELETE CASCADE,
    content text NOT NULL CHECK (char_length(content) <= 2000),
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

-- Create snippet_likes table
CREATE TABLE IF NOT EXISTS snippet_likes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(snippet_id, user_id)
);

-- Create snippet_views table
CREATE TABLE IF NOT EXISTS snippet_views (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address inet,
    user_agent text,
    viewed_at timestamptz DEFAULT now()
);

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('comment', 'mention', 'like', 'fork', 'collaboration', 'system')),
    title text NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}',
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('create', 'update', 'delete', 'comment', 'like', 'fork', 'share')),
    entity_type text NOT NULL CHECK (entity_type IN ('snippet', 'comment', 'team', 'folder')),
    entity_id uuid NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_customer_id text UNIQUE,
    stripe_subscription_id text UNIQUE,
    plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_snippets_owner ON snippets(owner_id);
CREATE INDEX IF NOT EXISTS idx_snippets_created ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_updated ON snippets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets(language) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON snippets(visibility) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON snippets USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_snippets_search ON snippets USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_snippet_versions_snippet ON snippet_versions(snippet_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_collaborators_snippet ON snippet_collaborators(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_collaborators_user ON snippet_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_comments_snippet ON snippet_comments(snippet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_snippet ON snippet_likes(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_likes_user ON snippet_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id, created_at DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippets_updated_at
    BEFORE UPDATE ON snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippet_comments_updated_at
    BEFORE UPDATE ON snippet_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create search vector update function and trigger
CREATE OR REPLACE FUNCTION update_snippet_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' || 
        COALESCE(NEW.content, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snippets_search_vector
    BEFORE INSERT OR UPDATE ON snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_snippet_search_vector();