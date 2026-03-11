# QuestQuill SQL Reference Guide

This file contains the master list of SQL scripts for database security, activity tracking setup, and business/educational insights.

## 1. Database Security (Row-Level Security)
Run these commands to ensure that parents can only see their own children's data and students are isolated.

### Enable RLS on all tables
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_discoveries ENABLE ROW LEVEL SECURITY;
```

### Core Security Policies
```sql
-- Profiles: Users manage their own
CREATE POLICY "Users can manage own profile" ON public.profiles
FOR ALL TO authenticated USING (id = auth.uid());

-- Children: Parents manage their own children
CREATE POLICY "Parents can manage own children" ON public.children
FOR ALL TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());

-- Stories: Secure management with owner check (using subquery)
CREATE POLICY "Secure story access" ON public.stories
FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.children WHERE id = stories.child_id AND parent_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.children WHERE id = stories.child_id AND parent_id = auth.uid()));

-- Vocabulary: Secure management
CREATE POLICY "Secure vocabulary access" ON public.vocabulary
FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.children WHERE id = vocabulary.child_id AND parent_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.children WHERE id = vocabulary.child_id AND parent_id = auth.uid()));
```

---

## 2. Activity Tracking Setup
Run this block to initialize your internal private analytics system.

```sql
-- 1. Safely add last_seen_at column to profiles for "Who is Online" tracking
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_seen_at') THEN
        ALTER TABLE public.profiles ADD COLUMN last_seen_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 2. Create the internal activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'login', 'page_view', 'story_generated', 'heartbeat', 'conversion_intent', etc.
    path TEXT,                -- The URL where the event happened
    metadata JSONB,           -- Rich data (duration, AI provider, interests, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Secure the logs (only the user can see their own logs, admin sees all)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON public.activity_logs
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. Add performance indexes for fast reporting
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.activity_logs(event_type);
```

---

## 3. Insight Queries (The "Executive Dashboard")

### 🚀 Growth & Conversion
**Daily Active Users (DAU)**
```sql
SELECT count(distinct user_id) as daily_active_users
FROM public.activity_logs
WHERE created_at > now() - interval '24 hours';
```

**Conversion Funnel (Clicks vs. Checkouts)**
```sql
SELECT 
  event_type, 
  count(*) as count,
  metadata->>'button' as source_button
FROM public.activity_logs
WHERE event_type IN ('conversion_intent', 'checkout_initiated')
GROUP BY 1, 3
ORDER BY count DESC;
```

### 🤖 AI Health & Performance
**AI Speed & Provider Reliability**
```sql
SELECT 
  metadata->>'ai_provider' as provider,
  avg((metadata->>'duration_ms')::int) as avg_response_time_ms,
  count(*) as total_generations
FROM public.activity_logs
WHERE event_type = 'story_generated'
GROUP BY 1;
```

**AI Error Report (Top Failures)**
```sql
SELECT 
  metadata->>'error' as error_message,
  count(*) as failure_count
FROM public.activity_logs
WHERE event_type = 'story_generation_failed'
GROUP BY 1;
```

### 📚 Educational Insights
**Top 10 Trending Interests**
```sql
SELECT 
  jsonb_array_elements_text(metadata->'interests') as interest, 
  count(*) as count
FROM public.activity_logs
WHERE event_type = 'story_generated'
GROUP BY 1
ORDER BY count DESC
LIMIT 10;
```

**Usage by Reading Level**
```sql
SELECT 
  metadata->>'level' as level, 
  count(*) as total_stories
FROM public.activity_logs
WHERE event_type = 'story_generated'
GROUP BY 1;
```

**Feature Popularity (Learning Features)**
```sql
SELECT 
  event_type, 
  count(*) as total_actions
FROM public.activity_logs
WHERE event_type IN ('vocabulary_added', 'sticker_claimed', 'mission_completed')
GROUP BY 1
ORDER BY total_actions DESC;
```

---

## 4. Advanced Monitoring (Live Activity Feed)
Run these to see detailed, real-time activity and filter through the metadata.

### The Master "Live Feed"
*See the last 50 actions, including the username of the person who did it:*
```sql
SELECT 
  created_at,
  event_type,
  path,
  (SELECT username FROM public.profiles WHERE id = user_id) as user,
  metadata
FROM public.activity_logs
ORDER BY created_at DESC
LIMIT 50;
```

### Metadata Filtering Examples
*See which words were added to the word bank:*
```sql
SELECT metadata->>'word' as word, created_at
FROM public.activity_logs
WHERE event_type = 'vocabulary_added'
ORDER BY created_at DESC;
```

*See which buttons are being clicked on the landing page:*
```sql
SELECT metadata->>'button' as button_name, count(*)
FROM public.activity_logs
WHERE event_type = 'conversion_intent'
GROUP BY 1
ORDER BY count DESC;
```

---

## 5. Individual User Monitoring
Use these to investigate a specific user's journey or troubleshoot issues.

### Find User ID by Name
```sql
SELECT id, username, role, created_at 
FROM public.profiles 
WHERE username ILIKE '%Name%';
```

### Full Activity Deep Dive
*Replace UUID with the actual user ID. Shows exactly what they did and when.*
```sql
SELECT 
  created_at,
  event_type,
  path,
  CASE 
    WHEN event_type = 'story_generated' THEN metadata->'interests'::text
    WHEN event_type = 'vocabulary_added' THEN metadata->>'word'
    WHEN event_type = 'conversion_intent' THEN metadata->>'button'
    WHEN event_type = 'sticker_claimed' THEN metadata->>'sticker_title'
    ELSE metadata::text
  END as details
FROM public.activity_logs
WHERE user_id = 'USER_UUID_HERE'
ORDER BY created_at DESC;
```

### User Summary (High Level)
```sql
SELECT 
  count(*) filter (where event_type = 'page_view') as total_page_visits,
  count(*) filter (where event_type = 'story_generated') as stories_created,
  count(*) filter (where event_type = 'vocabulary_added') as words_learned,
  max(created_at) as last_activity
FROM public.activity_logs
WHERE user_id = 'USER_UUID_HERE';
```
