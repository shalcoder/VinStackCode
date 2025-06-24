/*
  # Row Level Security Policies Setup

  1. Security
    - Enable RLS on all tables
    - Drop existing policies if they exist
    - Create comprehensive RLS policies for all tables
    
  2. Tables covered
    - profiles: Public/private profile access
    - folders: User-owned folder access
    - teams: Team membership-based access
    - team_members: Team visibility controls
    - snippets: Public/private/collaborative access
    - snippet_versions: Version history access
    - snippet_collaborators: Collaboration management
    - snippet_comments: Comment access controls
    - snippet_likes: Like management
    - snippet_views: View analytics
    - integrations: User-specific integrations
    - notifications: Personal notifications
    - activities: User activity logs
    - subscriptions: User subscription data
*/

-- Enable RLS on all tables
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own folders" ON folders;
DROP POLICY IF EXISTS "Users can create own folders" ON folders;
DROP POLICY IF EXISTS "Users can update own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete own folders" ON folders;

DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Team owners can update teams" ON teams;
DROP POLICY IF EXISTS "Team owners can delete teams" ON teams;

DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;

DROP POLICY IF EXISTS "Public snippets are viewable by everyone" ON snippets;
DROP POLICY IF EXISTS "Users can view own snippets" ON snippets;
DROP POLICY IF EXISTS "Collaborators can view snippets" ON snippets;
DROP POLICY IF EXISTS "Users can create snippets" ON snippets;
DROP POLICY IF EXISTS "Users can update own snippets" ON snippets;
DROP POLICY IF EXISTS "Collaborators can update snippets" ON snippets;
DROP POLICY IF EXISTS "Users can delete own snippets" ON snippets;

DROP POLICY IF EXISTS "Users can view versions of accessible snippets" ON snippet_versions;
DROP POLICY IF EXISTS "Users can create versions for editable snippets" ON snippet_versions;

DROP POLICY IF EXISTS "Users can view collaborators of accessible snippets" ON snippet_collaborators;

DROP POLICY IF EXISTS "Users can view comments on accessible snippets" ON snippet_comments;
DROP POLICY IF EXISTS "Users can create comments on accessible snippets" ON snippet_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON snippet_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON snippet_comments;

DROP POLICY IF EXISTS "Users can view likes on accessible snippets" ON snippet_likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON snippet_likes;

DROP POLICY IF EXISTS "Users can view snippet views for own snippets" ON snippet_views;

DROP POLICY IF EXISTS "Users can view own integrations" ON integrations;
DROP POLICY IF EXISTS "Users can manage own integrations" ON integrations;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

DROP POLICY IF EXISTS "Users can view own activities" ON activities;

DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    TO public
    USING (is_public = true);

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO public
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO public
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO public
    USING (auth.uid() = id);

-- Folders policies
CREATE POLICY "Users can view own folders"
    ON folders FOR SELECT
    TO public
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own folders"
    ON folders FOR INSERT
    TO public
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own folders"
    ON folders FOR UPDATE
    TO public
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own folders"
    ON folders FOR DELETE
    TO public
    USING (auth.uid() = owner_id);

-- Teams policies
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

CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    TO public
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update teams"
    ON teams FOR UPDATE
    TO public
    USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete teams"
    ON teams FOR DELETE
    TO public
    USING (auth.uid() = owner_id);

-- Team members policies
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

-- Snippets policies
CREATE POLICY "Public snippets are viewable by everyone"
    ON snippets FOR SELECT
    TO public
    USING (visibility = 'public' AND is_archived = false);

CREATE POLICY "Users can view own snippets"
    ON snippets FOR SELECT
    TO public
    USING (auth.uid() = owner_id);

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

CREATE POLICY "Users can create snippets"
    ON snippets FOR INSERT
    TO public
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own snippets"
    ON snippets FOR UPDATE
    TO public
    USING (auth.uid() = owner_id);

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

CREATE POLICY "Users can delete own snippets"
    ON snippets FOR DELETE
    TO public
    USING (auth.uid() = owner_id);

-- Snippet versions policies
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

-- Snippet collaborators policies
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

-- Snippet comments policies
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

CREATE POLICY "Users can update own comments"
    ON snippet_comments FOR UPDATE
    TO public
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
    ON snippet_comments FOR DELETE
    TO public
    USING (auth.uid() = author_id);

-- Snippet likes policies
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

CREATE POLICY "Users can manage own likes"
    ON snippet_likes FOR ALL
    TO public
    USING (auth.uid() = user_id);

-- Snippet views policies
CREATE POLICY "Users can view snippet views for own snippets"
    ON snippet_views FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM snippets
            WHERE id = snippet_views.snippet_id AND owner_id = auth.uid()
        )
    );

-- Integrations policies
CREATE POLICY "Users can view own integrations"
    ON integrations FOR SELECT
    TO public
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations"
    ON integrations FOR ALL
    TO public
    USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    TO public
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    TO public
    USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view own activities"
    ON activities FOR SELECT
    TO public
    USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    TO public
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
    ON subscriptions FOR UPDATE
    TO public
    USING (auth.uid() = user_id);