import type { Difficulty, GcseTier, QuestionType } from "@/lib/types";

export interface ContentMarkStep {
  stepOrder: number;
  markCode: string;
  description: string;
  points: number;
}

export interface ContentHint {
  level: number;
  text: string;
}

export interface ContentQuestion {
  id: string;
  objectiveId: string;
  tier: GcseTier;
  difficulty: Difficulty;
  questionType: QuestionType;
  marks: number;
  examStyle: boolean;
  calculatorAllowed: boolean;
  questionText: string;
  finalAnswer: string;
  solutionSteps: string;
  markScheme: ContentMarkStep[];
  hints: ContentHint[];
  status: string;
}
