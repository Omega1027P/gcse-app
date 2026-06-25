export type GcseTier = "Foundation" | "Higher";
export type ContentStatus = "draft" | "in_review" | "published" | "archived";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type MistakeCause =
  | "units"
  | "keywords"
  | "working"
  | "concept"
  | "exam_technique";

export type QuestionType =
  | "calculation"
  | "multi_step"
  | "word_problem"
  | "graph"
  | "reasoning"
  | "comparison"
  | "conversion"
  | "estimation"
  | "proof_short"
  | "construction"
  | "diagram"
  | "interpretation"
  | "exam_style";

export interface UserProfile {
  user_id: string;
  display_name: string;
  exam_board: string;
  subject: string;
  spec_code: string;
  tier: GcseTier;
  target_grade: string;
  exam_date: string | null;
  weekly_study_minutes: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface SyllabusNode {
  id: string;
  parent_id: string | null;
  node_type: "board" | "subject" | "unit" | "topic" | "objective";
  exam_board: string;
  spec_code: string;
  title: string;
  description: string;
  code: string;
  sort_order: number;
  tiers: GcseTier[];
  question_types: QuestionType[];
}

export interface Question {
  id: string;
  objective_id: string;
  status: ContentStatus;
  tier: GcseTier;
  difficulty: Difficulty;
  question_type: QuestionType;
  marks: number;
  exam_style: boolean;
  calculator_allowed: boolean;
  question_text: string;
  final_answer: string;
  solution_steps: string;
  common_mistakes: string;
  tags: string[];
}

export interface MarkSchemeStep {
  id: string;
  question_id: string;
  step_order: number;
  mark_code: string;
  description: string;
  points: number;
}

export interface QuestionHint {
  id: string;
  question_id: string;
  level: number;
  hint_text: string;
}

export interface TopicMastery {
  id: string;
  user_id: string;
  topic_id: string;
  mastery_score: number;
  attempts_count: number;
  correct_count: number;
  last_practiced_at: string | null;
}

export interface Mistake {
  id: string;
  user_id: string;
  question_id: string | null;
  topic_id: string | null;
  cause: MistakeCause;
  explanation: string;
  pattern_note: string;
  reviewed: boolean;
  next_review_date: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DailyPlanTask {
  id: string;
  type: "mistake_review" | "weak_topic" | "exam_practice" | "summary";
  title: string;
  minutes: number;
  topicId?: string;
  questionIds?: string[];
  completed: boolean;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  plan_date: string;
  mistake_review_minutes: number;
  weak_topic_minutes: number;
  exam_practice_minutes: number;
  summary_minutes: number;
  tasks: DailyPlanTask[];
  completed: boolean;
}

export interface LearningObjectiveJson {
  id: string;
  code: string;
  title: string;
  description: string;
  tiers: GcseTier[];
  questionTypes: QuestionType[];
}

export interface TopicJson {
  id: string;
  title: string;
  order: number;
  learningObjectives: LearningObjectiveJson[];
}

export interface UnitJson {
  id: string;
  title: string;
  order: number;
  topics: TopicJson[];
}

export interface SyllabusJson {
  version: string;
  examBoard: string;
  qualification: string;
  subject: string;
  specCode: string;
  tiers: GcseTier[];
  units: UnitJson[];
}
