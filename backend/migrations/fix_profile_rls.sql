-- Fix: Add missing INSERT policy for profiles table
-- This allows users to create their profile via upsert

-- Add INSERT policy for profiles
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Optional: Also ensure the trigger is working correctly
-- The handle_new_user() function should auto-create profiles on signup
-- But if it's not working, users need to be able to insert manually

-- Verify existing policies
-- You should now have these policies on profiles:
-- 1. "Users can view own profile" (SELECT)
-- 2. "Users can update own profile" (UPDATE)
-- 3. "Users can insert own profile" (INSERT) <- newly added
