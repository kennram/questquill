-- Profiles table (for parents/teachers)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'parent', -- 'parent' or 'teacher'
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    class_mission TEXT, -- Shared mission/prompt for all students (Teacher only)
    class_code TEXT UNIQUE, -- 6-character code for student login (e.g. LION-92)
    story_count_monthly INTEGER DEFAULT 0,
    last_limit_reset TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children table
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    interests TEXT[] DEFAULT '{}',
    explorer_level INTEGER DEFAULT 1,
    reading_level INTEGER DEFAULT 1, -- 1: Beginner, 2: Intermediate, 3: Advanced
    avatar_url TEXT,
    gems INTEGER DEFAULT 0,
    last_completed_mission TEXT, -- The last teacher mission they finished
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_json JSONB NOT NULL, -- { pages: [{ text: string, challenge: string, answer: string, imagePrompt: string }] }
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vocabulary table (Word Wizard)
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition TEXT,
    sentence_context TEXT,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(child_id, word)
);

-- Track student performance on story challenges
CREATE TABLE challenge_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    challenge_type TEXT NOT NULL, -- 'vocabulary', 'inference', 'literal', 'creative'
    is_success BOOLEAN NOT NULL,
    attempts INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
