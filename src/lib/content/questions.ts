import nSc01 from "../../../content/questions/n-sc-01.json";
import nFdp01 from "../../../content/questions/n-fdp-01.json";
import aEi01 from "../../../content/questions/a-ei-01.json";
import gPt01 from "../../../content/questions/g-pt-01.json";
import pSe01 from "../../../content/questions/p-se-01.json";
import type { ContentQuestion } from "@/lib/content/types";
import { findTopicById } from "@/lib/syllabus/loader";
import type { Question } from "@/lib/types";

const ALL_CONTENT: ContentQuestion[] = [
  ...(nSc01 as ContentQuestion[]),
  ...(nFdp01 as ContentQuestion[]),
  ...(aEi01 as ContentQuestion[]),
  ...(gPt01 as ContentQuestion[]),
  ...(pSe01 as ContentQuestion[]),
];

export function getAllContentQuestions(): ContentQuestion[] {
  return ALL_CONTENT.filter((q) => q.status === "published");
}

export function getContentQuestionById(id: string): ContentQuestion | undefined {
  return ALL_CONTENT.find((q) => q.id === id);
}

export function getContentQuestionsForTopic(topicId: string): ContentQuestion[] {
  const topic = findTopicById(topicId);
  if (!topic) return [];
  const objectiveIds = new Set(topic.learningObjectives.map((lo) => lo.id));
  return getAllContentQuestions().filter((q) => objectiveIds.has(q.objectiveId));
}

export function toPracticeQuestion(q: ContentQuestion): Question {
  return {
    id: q.id,
    objective_id: q.objectiveId,
    status: "published",
    tier: q.tier,
    difficulty: q.difficulty,
    question_type: q.questionType,
    marks: q.marks,
    exam_style: q.examStyle,
    calculator_allowed: q.calculatorAllowed,
    question_text: q.questionText,
    final_answer: q.finalAnswer,
    solution_steps: q.solutionSteps,
    common_mistakes: "",
    tags: [],
  };
}

export function getPracticeQuestions(topicId?: string | null): Question[] {
  const pool = topicId
    ? getContentQuestionsForTopic(topicId)
    : getAllContentQuestions();
  return pool.map(toPracticeQuestion);
}
