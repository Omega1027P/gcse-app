"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader, LoadingState } from "@/components/layout/PageHeader";
import { TopicMapGrid } from "@/components/map/TopicMapGrid";
import { getAllTopics } from "@/lib/syllabus/loader";

export default function MapPage() {
  const [masteryMap, setMasteryMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("topic_mastery")
        .select("topic_id, mastery_score")
        .eq("user_id", user.id);

      const map: Record<string, number> = {};
      for (const row of data ?? []) {
        map[row.topic_id] = row.mastery_score;
      }
      setMasteryMap(map);
      setLoading(false);
    }

    load();
  }, []);

  const topics = getAllTopics().map((t) => ({
    ...t,
    masteryScore: masteryMap[t.id] ?? 0,
  }));

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="Specification Map"
        description="See what you know and what needs work. Green = strong, amber = OK, red = weak."
      />
      <div className="mb-4 flex gap-4 text-xs text-slate-600">
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
      <TopicMapGrid topics={topics} />
    </div>
  );
}
