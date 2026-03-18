-- Instagram OAuth support + Platform list update

-- 1. Update platform CHECK constraint (threads, tiktok → facebook, note)
ALTER TABLE public.sns_accounts DROP CONSTRAINT IF EXISTS sns_accounts_platform_check;
ALTER TABLE public.sns_accounts ADD CONSTRAINT sns_accounts_platform_check
  CHECK (platform IN ('instagram', 'facebook', 'x', 'youtube', 'note'));

-- 2. Unique constraint: one account per platform per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_sns_accounts_user_platform_uid
  ON public.sns_accounts (user_id, platform, platform_user_id);

-- Storage bucket for post media (run in Supabase Dashboard > Storage)
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'post-media');
-- CREATE POLICY "Allow public read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'post-media');
