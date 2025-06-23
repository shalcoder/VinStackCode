/*
  # Database Functions

  1. Utility functions for snippet statistics
  2. Functions for incrementing view counts
  3. Helper functions for search and analytics
*/

-- Function to increment snippet views
CREATE OR REPLACE FUNCTION increment_snippet_views(
    snippet_uuid uuid,
    user_uuid uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO snippet_views (snippet_id, user_id, viewed_at)
    VALUES (snippet_uuid, user_uuid, now())
    ON CONFLICT DO NOTHING;
END;
$$;

-- Function to get snippet statistics
CREATE OR REPLACE FUNCTION get_snippet_stats(snippet_uuid uuid)
RETURNS TABLE (
    views_count bigint,
    likes_count bigint,
    comments_count bigint,
    versions_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM snippet_views WHERE snippet_id = snippet_uuid) as views_count,
        (SELECT COUNT(*) FROM snippet_likes WHERE snippet_id = snippet_uuid) as likes_count,
        (SELECT COUNT(*) FROM snippet_comments WHERE snippet_id = snippet_uuid) as comments_count,
        (SELECT COUNT(*) FROM snippet_versions WHERE snippet_id = snippet_uuid) as versions_count;
END;
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO profiles (id, username, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', 'User')
    );
    
    INSERT INTO subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to search snippets
CREATE OR REPLACE FUNCTION search_snippets(
    search_query text,
    user_uuid uuid DEFAULT NULL,
    limit_count integer DEFAULT 20,
    offset_count integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    language text,
    tags text[],
    visibility text,
    owner_id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.description,
        s.language,
        s.tags,
        s.visibility,
        s.owner_id,
        s.created_at,
        s.updated_at,
        ts_rank(s.search_vector, plainto_tsquery('english', search_query)) as rank
    FROM snippets s
    WHERE 
        s.search_vector @@ plainto_tsquery('english', search_query)
        AND s.is_archived = false
        AND (
            s.visibility = 'public' OR
            (user_uuid IS NOT NULL AND s.owner_id = user_uuid) OR
            (user_uuid IS NOT NULL AND EXISTS (
                SELECT 1 FROM snippet_collaborators sc
                WHERE sc.snippet_id = s.id 
                AND sc.user_id = user_uuid 
                AND sc.accepted_at IS NOT NULL
            ))
        )
    ORDER BY rank DESC, s.updated_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;