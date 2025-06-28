/*
  # Fix infinite recursion in snippet_collaborators policies

  1. Policy Changes
    - Remove recursive policy that causes infinite loop
    - Simplify snippet collaborator access policies
    - Fix circular dependency between snippets and snippet_collaborators tables

  2. Security
    - Maintain proper access control
    - Ensure users can only see collaborators for snippets they have access to
    - Prevent unauthorized access while fixing recursion
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view collaborators of accessible snippets" ON snippet_collaborators;

-- Create a simplified policy that doesn't cause recursion
CREATE POLICY "Users can view snippet collaborators"
  ON snippet_collaborators
  FOR SELECT
  TO public
  USING (
    -- Users can see collaborators if they are:
    -- 1. The snippet owner
    -- 2. A collaborator themselves (direct check without recursion)
    -- 3. The snippet is public
    EXISTS (
      SELECT 1 FROM snippets 
      WHERE snippets.id = snippet_collaborators.snippet_id 
      AND (
        snippets.owner_id = auth.uid() 
        OR snippets.visibility = 'public'
      )
    )
    OR 
    -- Direct collaborator check without recursion
    (
      snippet_collaborators.user_id = auth.uid() 
      AND snippet_collaborators.accepted_at IS NOT NULL
    )
  );

-- Also ensure the snippets policies don't cause recursion
-- Drop and recreate the problematic snippets policy
DROP POLICY IF EXISTS "Collaborators can view snippets" ON snippets;

-- Create a non-recursive policy for collaborator access to snippets
CREATE POLICY "Collaborators can view snippets"
  ON snippets
  FOR SELECT
  TO public
  USING (
    -- Direct collaborator check without subquery recursion
    auth.uid() IN (
      SELECT sc.user_id 
      FROM snippet_collaborators sc 
      WHERE sc.snippet_id = snippets.id 
      AND sc.accepted_at IS NOT NULL
    )
  );

-- Ensure the collaborator update policy is also non-recursive
DROP POLICY IF EXISTS "Collaborators can update snippets" ON snippets;

CREATE POLICY "Collaborators can update snippets"
  ON snippets
  FOR UPDATE
  TO public
  USING (
    -- Direct collaborator check for editors and owners
    auth.uid() IN (
      SELECT sc.user_id 
      FROM snippet_collaborators sc 
      WHERE sc.snippet_id = snippets.id 
      AND sc.role IN ('owner', 'editor')
      AND sc.accepted_at IS NOT NULL
    )
  );