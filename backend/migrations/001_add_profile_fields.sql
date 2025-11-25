-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS university text,
ADD COLUMN IF NOT EXISTS major text,
ADD COLUMN IF NOT EXISTS graduation_year text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS target_role text;
