/*
  # Fix RLS Policies

  1. Security
     - Safely enables RLS on all tables
     - Adds policies with existence checks to prevent duplicate policy errors

  This migration achieves the same security goals as the original but uses IF NOT EXISTS
  checks to prevent duplicate policy errors.
*/

-- Enable RLS on all tables (this operation is idempotent)
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS snippet_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS snippet_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS snippet_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS snippet_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS snippet_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$
BEGIN

-- Profiles policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
) THEN
    CREATE POLICY "Public profiles are viewable by everyone"
        ON profiles FOR SELECT
        TO public
        USING (is_public = true);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
) THEN
    CREATE POLICY "Users can view own profile"
        ON profiles FOR SELECT
        TO public
        USING (auth.uid() = id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
) THEN
    CREATE POLICY "Users can insert own profile"
        ON profiles FOR INSERT
        TO public
        WITH CHECK (auth.uid() = id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
) THEN
    CREATE POLICY "Users can update own profile"
        ON profiles FOR UPDATE
        TO public
        USING (auth.uid() = id);
END IF;

-- Folders policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'folders' AND policyname = 'Users can view own folders'
) THEN
    CREATE POLICY "Users can view own folders"
        ON folders FOR SELECT
        TO public
        USING (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'folders' AND policyname = 'Users can create own folders'
) THEN
    CREATE POLICY "Users can create own folders"
        ON folders FOR INSERT
        TO public
        WITH CHECK (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'folders' AND policyname = 'Users can update own folders'
) THEN
    CREATE POLICY "Users can update own folders"
        ON folders FOR UPDATE
        TO public
        USING (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'folders' AND policyname = 'Users can delete own folders'
) THEN
    CREATE POLICY "Users can delete own folders"
        ON folders FOR DELETE
        TO public
        USING (auth.uid() = owner_id);
END IF;

-- Teams policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teams' AND policyname = 'Users can view teams they belong to'
) THEN
    CREATE POLICY "Users can view teams they belong to"
        ON teams FOR SELECT
        TO public
        USING (
            auth.uid() = owner_id OR
            EXISTS (
                SELECT 1 FROM team_members
                WHERE team_id = teams.id AND user_id = auth.uid()
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teams' AND policyname = 'Users can create teams'
) THEN
    CREATE POLICY "Users can create teams"
        ON teams FOR INSERT
        TO public
        WITH CHECK (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teams' AND policyname = 'Team owners can update teams'
) THEN
    CREATE POLICY "Team owners can update teams"
        ON teams FOR UPDATE
        TO public
        USING (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teams' AND policyname = 'Team owners can delete teams'
) THEN
    CREATE POLICY "Team owners can delete teams"
        ON teams FOR DELETE
        TO public
        USING (auth.uid() = owner_id);
END IF;

-- Team members policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_members' AND policyname = 'Users can view team members of their teams'
) THEN
    CREATE POLICY "Users can view team members of their teams"
        ON team_members FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM teams
                WHERE id = team_members.team_id AND (
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM team_members tm
                        WHERE tm.team_id = teams.id AND tm.user_id = auth.uid()
                    )
                )
            )
        );
END IF;

-- Snippets policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Public snippets are viewable by everyone'
) THEN
    CREATE POLICY "Public snippets are viewable by everyone"
        ON snippets FOR SELECT
        TO public
        USING (visibility = 'public' AND is_archived = false);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Users can view own snippets'
) THEN
    CREATE POLICY "Users can view own snippets"
        ON snippets FOR SELECT
        TO public
        USING (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Collaborators can view snippets'
) THEN
    CREATE POLICY "Collaborators can view snippets"
        ON snippets FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippet_collaborators
                WHERE snippet_id = snippets.id 
                AND user_id = auth.uid() 
                AND accepted_at IS NOT NULL
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Users can create snippets'
) THEN
    CREATE POLICY "Users can create snippets"
        ON snippets FOR INSERT
        TO public
        WITH CHECK (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Users can update own snippets'
) THEN
    CREATE POLICY "Users can update own snippets"
        ON snippets FOR UPDATE
        TO public
        USING (auth.uid() = owner_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Collaborators can update snippets'
) THEN
    CREATE POLICY "Collaborators can update snippets"
        ON snippets FOR UPDATE
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippet_collaborators
                WHERE snippet_id = snippets.id 
                AND user_id = auth.uid() 
                AND role IN ('owner', 'editor')
                AND accepted_at IS NOT NULL
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippets' AND policyname = 'Users can delete own snippets'
) THEN
    CREATE POLICY "Users can delete own snippets"
        ON snippets FOR DELETE
        TO public
        USING (auth.uid() = owner_id);
END IF;

-- Snippet versions policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_versions' AND policyname = 'Users can view versions of accessible snippets'
) THEN
    CREATE POLICY "Users can view versions of accessible snippets"
        ON snippet_versions FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_versions.snippet_id AND (
                    visibility = 'public' OR
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM snippet_collaborators
                        WHERE snippet_id = snippets.id 
                        AND user_id = auth.uid() 
                        AND accepted_at IS NOT NULL
                    )
                )
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_versions' AND policyname = 'Users can create versions for editable snippets'
) THEN
    CREATE POLICY "Users can create versions for editable snippets"
        ON snippet_versions FOR INSERT
        TO public
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_versions.snippet_id AND (
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM snippet_collaborators
                        WHERE snippet_id = snippets.id 
                        AND user_id = auth.uid() 
                        AND role IN ('owner', 'editor')
                        AND accepted_at IS NOT NULL
                    )
                )
            )
        );
END IF;

-- Snippet collaborators policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_collaborators' AND policyname = 'Users can view collaborators of accessible snippets'
) THEN
    CREATE POLICY "Users can view collaborators of accessible snippets"
        ON snippet_collaborators FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_collaborators.snippet_id AND (
                    visibility = 'public' OR
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM snippet_collaborators sc
                        WHERE sc.snippet_id = snippets.id 
                        AND sc.user_id = auth.uid() 
                        AND sc.accepted_at IS NOT NULL
                    )
                )
            )
        );
END IF;

-- Snippet comments policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_comments' AND policyname = 'Users can view comments on accessible snippets'
) THEN
    CREATE POLICY "Users can view comments on accessible snippets"
        ON snippet_comments FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_comments.snippet_id AND (
                    visibility = 'public' OR
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM snippet_collaborators
                        WHERE snippet_id = snippets.id 
                        AND user_id = auth.uid() 
                        AND accepted_at IS NOT NULL
                    )
                )
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_comments' AND policyname = 'Users can create comments on accessible snippets'
) THEN
    CREATE POLICY "Users can create comments on accessible snippets"
        ON snippet_comments FOR INSERT
        TO public
        WITH CHECK (
            auth.uid() = author_id AND
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_comments.snippet_id AND (
                    visibility = 'public' OR
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM snippet_collaborators
                        WHERE snippet_id = snippets.id 
                        AND user_id = auth.uid() 
                        AND role IN ('owner', 'editor', 'commenter')
                        AND accepted_at IS NOT NULL
                    )
                )
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_comments' AND policyname = 'Users can update own comments'
) THEN
    CREATE POLICY "Users can update own comments"
        ON snippet_comments FOR UPDATE
        TO public
        USING (auth.uid() = author_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_comments' AND policyname = 'Users can delete own comments'
) THEN
    CREATE POLICY "Users can delete own comments"
        ON snippet_comments FOR DELETE
        TO public
        USING (auth.uid() = author_id);
END IF;

-- Snippet likes policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_likes' AND policyname = 'Users can view likes on accessible snippets'
) THEN
    CREATE POLICY "Users can view likes on accessible snippets"
        ON snippet_likes FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_likes.snippet_id AND (
                    visibility = 'public' OR
                    owner_id = auth.uid() OR
                    EXISTS (
                        SELECT 1 FROM snippet_collaborators
                        WHERE snippet_id = snippets.id 
                        AND user_id = auth.uid() 
                        AND accepted_at IS NOT NULL
                    )
                )
            )
        );
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_likes' AND policyname = 'Users can manage own likes'
) THEN
    CREATE POLICY "Users can manage own likes"
        ON snippet_likes FOR ALL
        TO public
        USING (auth.uid() = user_id);
END IF;

-- Snippet views policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'snippet_views' AND policyname = 'Users can view snippet views for own snippets'
) THEN
    CREATE POLICY "Users can view snippet views for own snippets"
        ON snippet_views FOR SELECT
        TO public
        USING (
            EXISTS (
                SELECT 1 FROM snippets
                WHERE id = snippet_views.snippet_id AND owner_id = auth.uid()
            )
        );
END IF;

-- Integrations policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'integrations' AND policyname = 'Users can view own integrations'
) THEN
    CREATE POLICY "Users can view own integrations"
        ON integrations FOR SELECT
        TO public
        USING (auth.uid() = user_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'integrations' AND policyname = 'Users can manage own integrations'
) THEN
    CREATE POLICY "Users can manage own integrations"
        ON integrations FOR ALL
        TO public
        USING (auth.uid() = user_id);
END IF;

-- Notifications policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can view own notifications'
) THEN
    CREATE POLICY "Users can view own notifications"
        ON notifications FOR SELECT
        TO public
        USING (auth.uid() = user_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications'
) THEN
    CREATE POLICY "Users can update own notifications"
        ON notifications FOR UPDATE
        TO public
        USING (auth.uid() = user_id);
END IF;

-- Activities policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'activities' AND policyname = 'Users can view own activities'
) THEN
    CREATE POLICY "Users can view own activities"
        ON activities FOR SELECT
        TO public
        USING (auth.uid() = user_id);
END IF;

-- Subscriptions policies
IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Users can view own subscription'
) THEN
    CREATE POLICY "Users can view own subscription"
        ON subscriptions FOR SELECT
        TO public
        USING (auth.uid() = user_id);
END IF;

IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Users can update own subscription'
) THEN
    CREATE POLICY "Users can update own subscription"
        ON subscriptions FOR UPDATE
        TO public
        USING (auth.uid() = user_id);
END IF;

END $$;