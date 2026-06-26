"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getDemoMastery, getLastPracticed } from "@/lib/demo/store";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { PageHeader, LoadingState } from "@/components/layout/PageHeader";
import { TopicMapGrid } from "@/components/map/TopicMapGrid";
import {
  DEFAULT_MAP_FILTERS,
  TopicMapFilters,
} from "@/components/map/TopicMapFilters";
import { filterTopics } from "@/lib/syllabus/map-filters";
import { findWeakestTopicId } from "@/lib/syllabus/topic-stats";
import { countObjectives, countTopics, getAllTopics } from "@/lib/syllabus/loader";
import { formatCount } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function MapPage() {
  const [masteryMap, setMasteryMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_MAP_FILTERS);
  const [lastPractice, setLastPractice] = useState<ReturnType<typeof getLastPracticed>>(null);

  useEffect(() => {
    async function load() {
      setLastPractice(getLastPracticed());

      if (!isSupabaseConfigured()) {
        setMasteryMap(getDemoMastery());
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMasteryMap(getDemoMastery());
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("topic_mastery")
        .select("topic_id, mastery_score")
        .eq("user_id", user.id);

      const map: Record<string, number> = { ...getDemoMastery() };
      for (const row of data ?? []) {
        map[row.topic_id] = row.mastery_score;
      }
      setMasteryMap(map);
      setLoading(false);
    }

    load();
  }, []);

  const allTopics = useMemo(
    () =>
      getAllTopics().map((t) => ({
        ...t,
        masteryScore: masteryMap[t.id] ?? 0,
      })),
    [masteryMap]
  );

  const filteredTopics = useMemo(
    () => filterTopics(allTopics, filters),
    [allTopics, filters]
  );

  const weakestTopicId = findWeakestTopicId(masteryMap);
  const continueHref = lastPractice
    ? `/practice?topic=${lastPractice.topicId}${
        lastPractice.objectiveId ? `&objective=${lastPractice.objectiveId}` : ""
      }`
    : null;

  if (loading) return <LoadingState />;

  return (
    <div>
      <DemoBanner />
      <PageHeader
        title="Specification Map"
        description={`${formatCount(countTopics(), "topic")} · ${formatCount(countObjectives(), "learning objective")} — expand each topic to see objectives, tiers, and question counts.`}
        action={
          <div className="flex flex-wrap gap-2">
            {weakestTopicId && (
              <Button href={`/practice?topic=${weakestTopicId}`} variant="secondary">
                Start weakest topic
              </Button>
            )}
            {continueHref ? (
              <Button href={continueHref}>Continue revision</Button>
            ) : (
              <Button href="/practice">Start practice</Button>
            )}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Strong (80%+)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> OK (60–79%)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-400" /> Weak (&lt;60%)
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-200" /> Not started
        </span>
      </div>

      <TopicMapFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filteredTopics.length}
        totalCount={allTopics.length}
      />

      <TopicMapGrid topics={filteredTopics} />
    </div>
  );
}
