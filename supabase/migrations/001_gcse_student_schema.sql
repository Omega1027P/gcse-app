-- GCSE App — Student-facing schema (AQA Maths MVP)
-- Run in Supabase SQL Editor or via supabase db push

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Content layer (human-reviewed, students read published only)
-- ---------------------------------------------------------------------------

CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'published', 'archived');
CREATE TYPE syllabus_node_type AS ENUM ('board', 'subject', 'unit', 'topic', 'objective');
CREATE TYPE question_type AS ENUM (
  'calculation', 'multi_step', 'word_problem', 'graph', 'reasoning',
  'comparison', 'conversion', 'estimation', 'proof_short', 'construction',
  'diagram', 'interpretation', 'exam_style'
);
CREATE TYPE gcse_tier AS ENUM ('Foundation', 'Higher');
CREATE TYPE mistake_cause AS ENUM ('units', 'keywords', 'working', 'concept', 'exam_technique');

CREATE TABLE syllabus_nodes (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES syllabus_nodes(id) ON DELETE CASCADE,
  node_type syllabus_node_type NOT NULL,
  exam_board TEXT NOT NULL DEFAULT 'AQA',
  spec_code TEXT NOT NULL DEFAULT '8300',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  code TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  tiers gcse_tier[] DEFAULT '{Foundation,Higher}',
  question_types question_type[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_syllabus_nodes_parent ON syllabus_nodes(parent_id);
CREATE INDEX idx_syllabus_nodes_type ON syllabus_nodes(node_type);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id TEXT NOT NULL REFERENCES syllabus_nodes(id) ON DELETE RESTRICT,
  status content_status NOT NULL DEFAULT 'draft',
  tier gcse_tier NOT NULL DEFAULT 'Foundation',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question_type question_type NOT NULL DEFAULT 'calculation',
  marks INT NOT NULL DEFAULT 1 CHECK (marks > 0),
  exam_style BOOLEAN NOT NULL DEFAULT false,
  calculator_allowed BOOLEAN NOT NULL DEFAULT true,
  question_text TEXT NOT NULL,
  final_answer TEXT NOT NULL,
  solution_steps TEXT DEFAULT '',
  common_mistakes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  source_ref TEXT DEFAULT '',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_questions_objective ON questions(objective_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_exam_style ON questions(exam_style) WHERE exam_style = true;

CREATE TABLE mark_scheme_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  mark_code TEXT NOT NULL DEFAULT 'M1',
  description TEXT NOT NULL,
  points INT NOT NULL DEFAULT 1 CHECK (points > 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (question_id, step_order)
);

CREATE TABLE question_hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  level INT NOT NULL CHECK (level BETWEEN 1 AND 3),
  hint_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (question_id, level)
);

CREATE TABLE content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  status content_status NOT NULL DEFAULT 'in_review',
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT DEFAULT '',
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Student layer
-- ---------------------------------------------------------------------------

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  exam_board TEXT NOT NULL DEFAULT 'AQA',
  subject TEXT NOT NULL DEFAULT 'Mathematics',
  spec_code TEXT NOT NULL DEFAULT '8300',
  tier gcse_tier NOT NULL DEFAULT 'Foundation',
  target_grade TEXT NOT NULL DEFAULT '5',
  exam_date DATE,
  weekly_study_minutes INT NOT NULL DEFAULT 300 CHECK (weekly_study_minutes > 0),
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE topic_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES syllabus_nodes(id) ON DELETE CASCADE,
  mastery_score INT NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 100),
  attempts_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

CREATE INDEX idx_topic_mastery_user ON topic_mastery(user_id);

CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('daily', 'topic', 'past_paper', 'mistake_review')),
  topic_id TEXT REFERENCES syllabus_nodes(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_marks INT DEFAULT 0,
  earned_marks INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  session_id UUID REFERENCES practice_sessions(id) ON DELETE SET NULL,
  student_answer TEXT NOT NULL DEFAULT '',
  is_correct BOOLEAN,
  marks_awarded INT DEFAULT 0,
  marks_available INT NOT NULL DEFAULT 1,
  time_spent_seconds INT DEFAULT 0,
  hints_used INT NOT NULL DEFAULT 0 CHECK (hints_used BETWEEN 0 AND 3),
  ai_feedback TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_attempts_user ON attempts(user_id);
CREATE INDEX idx_attempts_question ON attempts(question_id);

CREATE TABLE mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  attempt_id UUID REFERENCES attempts(id) ON DELETE SET NULL,
  topic_id TEXT REFERENCES syllabus_nodes(id) ON DELETE SET NULL,
  cause mistake_cause NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  pattern_note TEXT DEFAULT '',
  reviewed BOOLEAN NOT NULL DEFAULT false,
  next_review_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mistakes_user_review ON mistakes(user_id, next_review_date) WHERE reviewed = false;

CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  mistake_review_minutes INT NOT NULL DEFAULT 10,
  weak_topic_minutes INT NOT NULL DEFAULT 20,
  exam_practice_minutes INT NOT NULL DEFAULT 20,
  summary_minutes INT NOT NULL DEFAULT 5,
  tasks JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, plan_date)
);

CREATE TABLE past_paper_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tier gcse_tier NOT NULL,
  total_marks INT NOT NULL,
  earned_marks INT DEFAULT 0,
  estimated_grade TEXT,
  weakness_snapshot JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE question_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('unclear_explanation', 'wrong_answer', 'too_hard', 'other')),
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'wont_fix')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER syllabus_nodes_updated_at BEFORE UPDATE ON syllabus_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER topic_mastery_updated_at BEFORE UPDATE ON topic_mastery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER mistakes_updated_at BEFORE UPDATE ON mistakes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER daily_plans_updated_at BEFORE UPDATE ON daily_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER question_feedback_updated_at BEFORE UPDATE ON question_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE syllabus_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_scheme_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_paper_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_feedback ENABLE ROW LEVEL SECURITY;

-- Published content readable by all authenticated users
CREATE POLICY "Authenticated read syllabus" ON syllabus_nodes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated read published questions" ON questions
  FOR SELECT TO authenticated USING (status = 'published');

CREATE POLICY "Authenticated read published mark schemes" ON mark_scheme_steps
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM questions q WHERE q.id = question_id AND q.status = 'published'
  ));

CREATE POLICY "Authenticated read published hints" ON question_hints
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM questions q WHERE q.id = question_id AND q.status = 'published'
  ));

-- Students own their data
CREATE POLICY "Users manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own mastery" ON topic_mastery
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own sessions" ON practice_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own attempts" ON attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own mistakes" ON mistakes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own daily plans" ON daily_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own past papers" ON past_paper_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own feedback" ON question_feedback
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Content reviews: service role only (no student policy = no access via anon key)
