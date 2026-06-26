import type { MapFilters } from "@/components/map/TopicMapFilters";
import type { GradeBand } from "@/lib/syllabus/grade-bands";
import { getTopicStatsMap, type TopicStats } from "@/lib/syllabus/topic-stats";
import type { TopicJson } from "@/lib/types";
import { masteryLabel } from "@/lib/utils";

export interface TopicWithMastery extends TopicJson {
  unitId: string;
  unitTitle: string;
  masteryScore: number;
}

function masteryBucket(score: number): MapFilters["mastery"] {
  if (score >= 80) return "strong";
  if (score >= 60) return "ok";
  if (score > 0) return "weak";
  return "not-started";
}

function matchesSearch(topic: TopicWithMastery, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  if (topic.title.toLowerCase().includes(q)) return true;
  if (topic.unitTitle.toLowerCase().includes(q)) return true;
  return topic.learningObjectives.some(
    (lo) =>
      lo.title.toLowerCase().includes(q) ||
      lo.code.toLowerCase().includes(q) ||
      lo.description.toLowerCase().includes(q)
  );
}

function matchesTier(stats: TopicStats, tier: MapFilters["tier"]): boolean {
  if (tier === "all") return true;
  return stats.tiers.includes(tier);
}

function matchesCalculator(
  stats: TopicStats,
  calc: MapFilters["calculator"]
): boolean {
  if (calc === "all") return true;
  if (!stats.calculatorMode) return false;
  if (calc === "mixed") return stats.calculatorMode === "mixed";
  return stats.calculatorMode === calc || stats.calculatorMode === "mixed";
}

function matchesGradeBand(stats: TopicStats, band: MapFilters["gradeBand"]): boolean {
  if (band === "all") return true;
  return stats.gradeBands.includes(band as GradeBand);
}

export function filterTopics(
  topics: TopicWithMastery[],
  filters: MapFilters
): TopicWithMastery[] {
  const statsMap = getTopicStatsMap();

  return topics.filter((topic) => {
    const stats = statsMap.get(topic.id);
    if (!stats) return false;

    if (!matchesSearch(topic, filters.search)) return false;
    if (!matchesTier(stats, filters.tier)) return false;
    if (!matchesCalculator(stats, filters.calculator)) return false;
    if (!matchesGradeBand(stats, filters.gradeBand)) return false;

    if (filters.mastery !== "all") {
      if (masteryBucket(topic.masteryScore) !== filters.mastery) return false;
    }

    return true;
  });
}

export { masteryBucket, masteryLabel };
