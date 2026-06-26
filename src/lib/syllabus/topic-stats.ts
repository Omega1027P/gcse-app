import { getAllContentQuestions } from "@/lib/content/questions";
import {
  defaultGradeBandsForTiers,
  gradeBandSort,
  questionToGradeBand,
  type GradeBand,
} from "@/lib/syllabus/grade-bands";
import { getAllTopics, getAllObjectives } from "@/lib/syllabus/loader";
import type { GcseTier, LearningObjectiveJson } from "@/lib/types";

export type CalculatorMode = "calculator" | "non-calculator" | "mixed";

export interface ObjectiveStats {
  objectiveId: string;
  questionCount: number;
  gradeBands: GradeBand[];
  calculatorMode: CalculatorMode | null;
  tiers: GcseTier[];
}

export interface TopicStats {
  topicId: string;
  questionCount: number;
  gradeBands: GradeBand[];
  calculatorMode: CalculatorMode | null;
  tiers: GcseTier[];
  objectives: Record<string, ObjectiveStats>;
}

function calculatorModeFromFlags(calc: number, nonCalc: number): CalculatorMode | null {
  if (calc === 0 && nonCalc === 0) return null;
  if (calc > 0 && nonCalc > 0) return "mixed";
  return calc > 0 ? "calculator" : "non-calculator";
}

function buildObjectiveStats(
  lo: LearningObjectiveJson,
  questionsByObjective: Map<string, ReturnType<typeof getAllContentQuestions>>
): ObjectiveStats {
  const qs = questionsByObjective.get(lo.id) ?? [];
  const gradeBandSet = new Set<GradeBand>();
  let calc = 0;
  let nonCalc = 0;

  for (const q of qs) {
    gradeBandSet.add(questionToGradeBand(q.difficulty, q.tier));
    if (q.calculatorAllowed) calc++;
    else nonCalc++;
  }

  const gradeBands =
    gradeBandSet.size > 0
      ? [...gradeBandSet].toSorted(gradeBandSort)
      : defaultGradeBandsForTiers(lo.tiers);

  return {
    objectiveId: lo.id,
    questionCount: qs.length,
    gradeBands,
    calculatorMode: calculatorModeFromFlags(calc, nonCalc),
    tiers: lo.tiers,
  };
}

function mergeGradeBands(bands: GradeBand[][]): GradeBand[] {
  const set = new Set<GradeBand>();
  for (const list of bands) {
    for (const b of list) set.add(b);
  }
  return [...set].toSorted(gradeBandSort);
}

function mergeCalculatorModes(modes: (CalculatorMode | null)[]): CalculatorMode | null {
  const present = modes.filter((m): m is CalculatorMode => m !== null);
  if (present.length === 0) return null;
  const hasCalc = present.includes("calculator") || present.includes("mixed");
  const hasNon = present.includes("non-calculator") || present.includes("mixed");
  if (hasCalc && hasNon) return "mixed";
  return hasCalc ? "calculator" : "non-calculator";
}

let cachedStats: Map<string, TopicStats> | null = null;

export function getTopicStatsMap(): Map<string, TopicStats> {
  if (cachedStats) return cachedStats;

  const questions = getAllContentQuestions();
  const byObjective = new Map<string, typeof questions>();
  for (const q of questions) {
    const list = byObjective.get(q.objectiveId) ?? [];
    list.push(q);
    byObjective.set(q.objectiveId, list);
  }

  const map = new Map<string, TopicStats>();

  for (const topic of getAllTopics()) {
    const objectiveStats: Record<string, ObjectiveStats> = {};
    for (const lo of topic.learningObjectives) {
      objectiveStats[lo.id] = buildObjectiveStats(lo, byObjective);
    }

    const objList = Object.values(objectiveStats);
    map.set(topic.id, {
      topicId: topic.id,
      questionCount: objList.reduce((n, o) => n + o.questionCount, 0),
      gradeBands: mergeGradeBands(objList.map((o) => o.gradeBands)),
      calculatorMode: mergeCalculatorModes(objList.map((o) => o.calculatorMode)),
      tiers: [...new Set(topic.learningObjectives.flatMap((lo) => lo.tiers))] as GcseTier[],
      objectives: objectiveStats,
    });
  }

  cachedStats = map;
  return map;
}

export function getTopicStats(topicId: string): TopicStats | undefined {
  return getTopicStatsMap().get(topicId);
}

export function getObjectiveStats(objectiveId: string): ObjectiveStats | undefined {
  for (const topic of getAllTopics()) {
    const lo = topic.learningObjectives.find((o) => o.id === objectiveId);
    if (lo) {
      return getTopicStats(topic.id)?.objectives[objectiveId];
    }
  }
  return undefined;
}

export function findWeakestTopicId(
  masteryMap: Record<string, number>
): string | null {
  const stats = getTopicStatsMap();
  const topics = getAllTopics()
    .filter((t) => (stats.get(t.id)?.questionCount ?? 0) > 0)
    .map((t) => ({
      id: t.id,
      mastery: masteryMap[t.id] ?? 0,
    }))
    .toSorted((a, b) => a.mastery - b.mastery);

  return topics[0]?.id ?? null;
}

export function countObjectivesWithQuestions(): number {
  const ids = new Set(getAllContentQuestions().map((q) => q.objectiveId));
  return getAllObjectives().filter((lo) => ids.has(lo.id)).length;
}
