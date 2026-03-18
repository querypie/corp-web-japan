-- JP_WEB: Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. Users table
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free_trial' CHECK (plan IN ('free_trial', 'basic', 'pro')),
  ai_credits INTEGER NOT NULL DEFAULT 60,
  trial_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. Workspaces table
-- ============================================
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Personal Workspace',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspaces_user ON public.workspaces(user_id);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workspaces" ON public.workspaces
  FOR ALL USING (auth.uid() = user_id);

-- Auto-create default workspace
CREATE OR REPLACE FUNCTION public.handle_new_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspaces (user_id, name)
  VALUES (NEW.id, 'Personal Workspace');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_workspace
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_workspace();

-- ============================================
-- 3. Projects table
-- ============================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_projects_user ON public.projects(user_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

-- Auto-create default project
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.projects (workspace_id, user_id, name)
  VALUES (NEW.id, NEW.user_id, 'General');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workspace_created_project
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_project();

-- ============================================
-- 4. SNS Accounts table
-- ============================================
CREATE TABLE public.sns_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'threads', 'x', 'youtube', 'tiktok')),
  platform_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  ai_style_settings JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sns_accounts_user_platform ON public.sns_accounts(user_id, platform);
CREATE INDEX idx_sns_accounts_project ON public.sns_accounts(project_id);

ALTER TABLE public.sns_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sns accounts" ON public.sns_accounts
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 5. Posts table
-- ============================================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sns_account_id UUID NOT NULL REFERENCES public.sns_accounts(id) ON DELETE CASCADE,
  content TEXT,
  media_urls TEXT[] DEFAULT '{}',
  media_type TEXT CHECK (media_type IN ('image', 'video', 'carousel')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT,
  auto_repost BOOLEAN NOT NULL DEFAULT FALSE,
  auto_repost_hours INTEGER,
  error_message TEXT,
  source_type TEXT CHECK (source_type IN ('manual', 'card_news', 'link_to_content', 'ai_planning', 'blog')),
  source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_user_status ON public.posts(user_id, status);
CREATE INDEX idx_posts_account_status ON public.posts(sns_account_id, status);
CREATE INDEX idx_posts_scheduled ON public.posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_posts_user_created ON public.posts(user_id, created_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own posts" ON public.posts
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 6. Content Ideas table
-- ============================================
CREATE TABLE public.content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sns_account_id UUID REFERENCES public.sns_accounts(id) ON DELETE SET NULL,
  mode TEXT NOT NULL CHECK (mode IN ('creative', 'search', 'knowledge')),
  prompt TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'draft_generated', 'draft_used')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ideas_user_status ON public.content_ideas(user_id, status);

ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ideas" ON public.content_ideas
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 7. Card News Templates table
-- ============================================
CREATE TABLE public.card_news_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  reference_images TEXT[] DEFAULT '{}',
  aspect_ratio TEXT NOT NULL DEFAULT '4:5' CHECK (aspect_ratio IN ('1:1', '4:5', '9:16', '16:9', '3:4')),
  custom_instructions TEXT,
  learned_style JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_user ON public.card_news_templates(user_id);

ALTER TABLE public.card_news_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own templates" ON public.card_news_templates
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 8. Card News table
-- ============================================
CREATE TABLE public.card_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.card_news_templates(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '4:5' CHECK (aspect_ratio IN ('1:1', '4:5', '9:16', '16:9', '3:4')),
  slides JSONB DEFAULT '[]',
  image_urls TEXT[] DEFAULT '{}',
  generation_status TEXT NOT NULL DEFAULT 'pending' CHECK (generation_status IN ('pending', 'generating', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_card_news_user ON public.card_news(user_id, created_at DESC);

ALTER TABLE public.card_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own card news" ON public.card_news
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 9. Blog Posts table
-- ============================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  topic TEXT NOT NULL,
  seo_keywords TEXT[] DEFAULT '{}',
  generation_status TEXT NOT NULL DEFAULT 'pending' CHECK (generation_status IN ('pending', 'generating', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_user ON public.blog_posts(user_id, created_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blog posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 10. Link Content table
-- ============================================
CREATE TABLE public.link_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sns_account_id UUID REFERENCES public.sns_accounts(id) ON DELETE SET NULL,
  original_url TEXT NOT NULL,
  original_title TEXT,
  original_summary TEXT,
  generated_content TEXT,
  generated_images TEXT[] DEFAULT '{}',
  generation_status TEXT NOT NULL DEFAULT 'pending' CHECK (generation_status IN ('pending', 'generating', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_link_contents_user ON public.link_contents(user_id, created_at DESC);

ALTER TABLE public.link_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own link contents" ON public.link_contents
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_sns_accounts_updated_at BEFORE UPDATE ON public.sns_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.content_ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.card_news_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_card_news_updated_at BEFORE UPDATE ON public.card_news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
