"use client";

import Link from "next/link";
import { masteryColor, masteryLabel } from "@/lib/utils";
import type { TopicJson } from "@/lib/types";

interface TopicWithMastery extends TopicJson {
  unitId: string;
  unitTitle: string;
  masteryScore: number;
}

export function TopicMapGrid({ topics }: { topics: TopicWithMastery[] }) {
  const byUnit = topics.reduce<Record<string, TopicWithMastery[]>>((acc, t) => {
    (acc[t.unitTitle] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(byUnit).map(([unitTitle, unitTopics]) => (
        <section key={unitTitle} id={unitTopics[0]?.unitId}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {unitTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {unitTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/practice?topic=${topic.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-medium text-slate-900 group-hover:text-indigo-700">
                    {topic.title}
                  </h3>
                  <span
                    className={`h-3 w-3 shrink-0 rounded-full ${masteryColor(topic.masteryScore)}`}
                    title={masteryLabel(topic.masteryScore)}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {topic.learningObjectives.length} objectives ·{" "}
                  {masteryLabel(topic.masteryScore)} ({topic.masteryScore}%)
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
