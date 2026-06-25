import type { DailyPlanTask, Mistake, TopicMastery } from "@/lib/types";
import { DAILY_PLAN_MINUTES, MASTERY_WEAK_THRESHOLD } from "@/lib/constants";
import { todayISO } from "@/lib/utils";
import { getAllTopics } from "@/lib/syllabus/loader";

interface GeneratePlanInput {
  userId: string;
  mistakes: Mistake[];
  mastery: TopicMastery[];
  examQuestionIds?: string[];
}

export function generateDailyPlanTasks(input: GeneratePlanInput): DailyPlanTask[] {
  const today = todayISO();
  const tasks: DailyPlanTask[] = [];

  const dueMistakes = input.mistakes.filter(
    (m) => !m.reviewed && m.next_review_date && m.next_review_date <= today
  );

  tasks.push({
    id: "mistake-review",
    type: "mistake_review",
    title: `Review ${dueMistakes.length || "recent"} mistake${dueMistakes.length === 1 ? "" : "s"}`,
    minutes: DAILY_PLAN_MINUTES.mistakeReview,
    questionIds: dueMistakes.map((m) => m.question_id).filter(Boolean) as string[],
    completed: false,
  });

  const masteryMap = new Map(input.mastery.map((m) => [m.topic_id, m.mastery_score]));
  const weakTopics = getAllTopics()
    .map((t) => ({
      topic: t,
      score: masteryMap.get(t.id) ?? 0,
    }))
    .filter((x) => x.score < MASTERY_WEAK_THRESHOLD)
    .toSorted((a, b) => a.score - b.score)
    .slice(0, 1);

  const weak = weakTopics[0];
  tasks.push({
    id: "weak-topic",
    type: "weak_topic",
    title: weak
      ? `Study: ${weak.topic.title}`
      : "Study a new topic",
    minutes: DAILY_PLAN_MINUTES.weakTopic,
    topicId: weak?.topic.id,
    completed: false,
  });

  tasks.push({
    id: "exam-practice",
    type: "exam_practice",
    title: "Exam-style practice",
    minutes: DAILY_PLAN_MINUTES.examPractice,
    questionIds: input.examQuestionIds ?? [],
    completed: false,
  });

  tasks.push({
    id: "summary",
    type: "summary",
    title: "Summarise today's mistake patterns",
    minutes: DAILY_PLAN_MINUTES.summary,
    completed: false,
  });

  return tasks;
}

export function nextReviewDate(reviewCount: number): string {
  const intervals = [1, 3, 7, 14, 30];
  const days = intervals[Math.min(reviewCount, intervals.length - 1)];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function updateMasteryScore(
  current: number,
  attempts: number,
  correct: number
): number {
  if (attempts === 0) return current;
  const accuracy = (correct / attempts) * 100;
  return Math.round(current * 0.4 + accuracy * 0.6);
}
