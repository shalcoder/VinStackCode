/*
  # Add Tavus Video Integration Support

  1. New Features
    - Add video_generation event type to snippet_analytics
    - Create function to track video generation
    - Create function to get video tutorials for a snippet
    - Add support for storing video URLs in snippet custom_fields
*/

-- Add video_generation event type to snippet_analytics
ALTER TABLE snippet_analytics
DROP CONSTRAINT IF EXISTS snippet_analytics_event_type_check;

ALTER TABLE snippet_analytics
ADD CONSTRAINT snippet_analytics_event_type_check 
CHECK (event_type IN ('view', 'like', 'fork', 'comment', 'share', 'video_generation'));

-- Create function to track video generation
CREATE OR REPLACE FUNCTION track_video_generation(
  snippet_uuid uuid,
  user_uuid uuid,
  video_url text,
  metadata jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Track the event
  INSERT INTO snippet_analytics (
    snippet_id, 
    event_type, 
    user_id, 
    metadata
  )
  VALUES (
    snippet_uuid, 
    'video_generation', 
    user_uuid, 
    jsonb_build_object(
      'video_url', video_url,
      'generated_at', now(),
      'custom_data', metadata
    )
  );
  
  -- Update snippet with video URL if not already set
  UPDATE snippets
  SET custom_fields = jsonb_set(
    COALESCE(custom_fields, '{}'::jsonb),
    '{video_url}',
    to_jsonb(video_url),
    true
  )
  WHERE id = snippet_uuid
  AND (
    custom_fields IS NULL 
    OR custom_fields->>'video_url' IS NULL
    OR custom_fields->>'video_url' = ''
  );
  
  -- Check if user has video tutorial badge
  IF NOT EXISTS (
    SELECT 1 FROM user_badges 
    WHERE user_id = user_uuid 
    AND badge_id = 'video_creator'
  ) THEN
    -- Award badge for first video
    INSERT INTO user_badges (
      user_id,
      badge_id,
      badge_name,
      badge_description
    )
    VALUES (
      user_uuid,
      'video_creator',
      'Video Creator',
      'Generated your first AI video tutorial'
    );
  END IF;
END;
$$;

-- Create function to get video tutorials for a snippet
CREATE OR REPLACE FUNCTION get_snippet_videos(snippet_uuid uuid)
RETURNS TABLE (
  video_url text,
  generated_at timestamptz,
  generated_by uuid,
  metadata jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.metadata->>'video_url' as video_url,
    (sa.metadata->>'generated_at')::timestamptz as generated_at,
    sa.user_id as generated_by,
    sa.metadata->'custom_data' as metadata
  FROM snippet_analytics sa
  WHERE sa.snippet_id = snippet_uuid
  AND sa.event_type = 'video_generation'
  AND sa.metadata->>'video_url' IS NOT NULL
  ORDER BY sa.created_at DESC;
END;
$$;