/*
  # Hackathon Enhancements for VinStackCode

  1. New Tables
    - `user_follows` - User follow system
    - `snippet_collections` - Snippet collections/playlists
    - `snippet_forks` - Snippet forking system
    - `user_badges` - Gamification badges
    - `snippet_analytics` - Analytics tracking

  2. Enhanced Features
    - Social following system
    - Collection management
    - Fork tracking
    - Badge system
    - Analytics

  3. Security
    - RLS policies for all new tables
    - Proper access controls
*/

-- User follows table for social features
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Snippet collections/playlists
CREATE TABLE IF NOT EXISTS snippet_collections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collection items (many-to-many relationship)
CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id uuid REFERENCES snippet_collections(id) ON DELETE CASCADE NOT NULL,
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, snippet_id)
);

-- Snippet forks
CREATE TABLE IF NOT EXISTS snippet_forks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  forked_snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  forked_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(original_snippet_id, forked_snippet_id)
);

-- User badges for gamification
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id text NOT NULL,
  badge_name text NOT NULL,
  badge_description text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Snippet analytics
CREATE TABLE IF NOT EXISTS snippet_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('view', 'like', 'fork', 'comment', 'share')),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_forks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_analytics ENABLE ROW LEVEL SECURITY;

-- User follows policies
CREATE POLICY "Users can view public follows" ON user_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON user_follows
  FOR ALL USING (auth.uid() = follower_id);

-- Snippet collections policies
CREATE POLICY "Users can view public collections" ON snippet_collections
  FOR SELECT USING (is_public = true OR auth.uid() = owner_id);

CREATE POLICY "Users can manage own collections" ON snippet_collections
  FOR ALL USING (auth.uid() = owner_id);

-- Collection items policies
CREATE POLICY "Users can view items in accessible collections" ON collection_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippet_collections
      WHERE id = collection_items.collection_id
      AND (is_public = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage items in own collections" ON collection_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM snippet_collections
      WHERE id = collection_items.collection_id
      AND owner_id = auth.uid()
    )
  );

-- Snippet forks policies
CREATE POLICY "Users can view public forks" ON snippet_forks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE id = snippet_forks.original_snippet_id
      AND (visibility = 'public' OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can create forks" ON snippet_forks
  FOR INSERT WITH CHECK (auth.uid() = forked_by);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public badges" ON user_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = user_badges.user_id
      AND is_public = true
    )
  );

-- Snippet analytics policies
CREATE POLICY "Users can view analytics for own snippets" ON snippet_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE id = snippet_analytics.snippet_id
      AND owner_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_snippet_collections_owner ON snippet_collections(owner_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_snippet ON collection_items(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_forks_original ON snippet_forks(original_snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_forks_forked ON snippet_forks(forked_snippet_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_snippet_analytics_snippet ON snippet_analytics(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_analytics_event ON snippet_analytics(event_type, created_at);

-- Triggers for updated_at
CREATE TRIGGER update_snippet_collections_updated_at
  BEFORE UPDATE ON snippet_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user stats for badges
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid uuid)
RETURNS TABLE (
  snippets_count bigint,
  likes_received bigint,
  followers_count bigint,
  collaborations_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM snippets WHERE owner_id = user_uuid AND is_archived = false) as snippets_count,
    (SELECT COUNT(*) FROM snippet_likes sl 
     JOIN snippets s ON sl.snippet_id = s.id 
     WHERE s.owner_id = user_uuid) as likes_received,
    (SELECT COUNT(*) FROM user_follows WHERE following_id = user_uuid) as followers_count,
    (SELECT COUNT(*) FROM snippet_collaborators 
     WHERE user_id = user_uuid AND accepted_at IS NOT NULL) as collaborations_count;
END;
$$;

-- Function to track snippet analytics
CREATE OR REPLACE FUNCTION track_snippet_event(
  snippet_uuid uuid,
  event_type_param text,
  user_uuid uuid DEFAULT NULL,
  metadata_param jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO snippet_analytics (snippet_id, event_type, user_id, metadata)
  VALUES (snippet_uuid, event_type_param, user_uuid, metadata_param);
END;
$$;

-- Function to fork a snippet
CREATE OR REPLACE FUNCTION fork_snippet(
  original_snippet_uuid uuid,
  forker_uuid uuid,
  new_title text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  original_snippet snippets%ROWTYPE;
  new_snippet_id uuid;
  final_title text;
BEGIN
  -- Get original snippet
  SELECT * INTO original_snippet
  FROM snippets
  WHERE id = original_snippet_uuid
  AND (visibility = 'public' OR owner_id = forker_uuid);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Snippet not found or not accessible';
  END IF;

  -- Generate title for fork
  final_title := COALESCE(new_title, 'Fork of ' || original_snippet.title);

  -- Create new snippet
  INSERT INTO snippets (
    title, description, content, language, tags, visibility,
    owner_id, is_template, custom_fields
  ) VALUES (
    final_title,
    original_snippet.description,
    original_snippet.content,
    original_snippet.language,
    original_snippet.tags,
    'private', -- Forks start as private
    forker_uuid,
    original_snippet.is_template,
    original_snippet.custom_fields
  ) RETURNING id INTO new_snippet_id;

  -- Record the fork relationship
  INSERT INTO snippet_forks (original_snippet_id, forked_snippet_id, forked_by)
  VALUES (original_snippet_uuid, new_snippet_id, forker_uuid);

  -- Track analytics
  PERFORM track_snippet_event(original_snippet_uuid, 'fork', forker_uuid, 
    jsonb_build_object('forked_snippet_id', new_snippet_id));

  RETURN new_snippet_id;
END;
$$;