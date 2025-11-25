-- Run this to check what policies currently exist on your tables

-- Check profiles policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Check resumes policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'resumes';

-- This will show you all policies and what they allow (SELECT, INSERT, UPDATE, DELETE)
