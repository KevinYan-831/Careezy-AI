-- Migration: Optimize Coaching Messages Storage
-- Purpose: Reduce storage usage by keeping only recent messages and using summaries

-- 1. Add new columns to coaching_sessions for context management
ALTER TABLE public.coaching_sessions
ADD COLUMN IF NOT EXISTS context_summary text,
ADD COLUMN IF NOT EXISTS message_count integer DEFAULT 0;

-- 2. Create function to automatically cleanup old messages
-- Keeps only the last 20 messages per session
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS trigger AS $$
BEGIN
  -- Delete messages older than the last 20 for this session
  DELETE FROM public.coaching_messages
  WHERE session_id = NEW.session_id
  AND id NOT IN (
    SELECT id FROM public.coaching_messages
    WHERE session_id = NEW.session_id
    ORDER BY created_at DESC
    LIMIT 20
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to auto-cleanup after each insert
DROP TRIGGER IF EXISTS cleanup_messages_trigger ON public.coaching_messages;
CREATE TRIGGER cleanup_messages_trigger
AFTER INSERT ON public.coaching_messages
FOR EACH ROW
EXECUTE FUNCTION cleanup_old_messages();

-- 4. Optional: One-time cleanup of existing old messages
-- Uncomment if you want to clean up existing data
/*
DO $$
DECLARE
  sess RECORD;
BEGIN
  FOR sess IN SELECT DISTINCT session_id FROM public.coaching_messages
  LOOP
    DELETE FROM public.coaching_messages
    WHERE session_id = sess.session_id
    AND id NOT IN (
      SELECT id FROM public.coaching_messages
      WHERE session_id = sess.session_id
      ORDER BY created_at DESC
      LIMIT 20
    );
  END LOOP;
END $$;
*/

-- 5. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_coaching_messages_session_created
ON public.coaching_messages(session_id, created_at DESC);

-- 6. Update existing sessions with initial message count
UPDATE public.coaching_sessions cs
SET message_count = (
  SELECT COUNT(*)
  FROM public.coaching_messages cm
  WHERE cm.session_id = cs.id
)
WHERE message_count IS NULL OR message_count = 0;

COMMENT ON COLUMN public.coaching_sessions.context_summary IS 'AI-generated summary of conversation context to reduce need for storing all messages';
COMMENT ON COLUMN public.coaching_sessions.message_count IS 'Total number of messages exchanged in this session (for tracking and triggering summary updates)';
