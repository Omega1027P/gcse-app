"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalculatorBadge,
  GradeBandBadges,
  TierBadges,
} from "@/components/map/ObjectiveBadges";
import type { TopicWithMastery } from "@/lib/syllabus/map-filters";
import { getTopicStatsMap } from "@/lib/syllabus/topic-stats";
import { formatCount, masteryColor, masteryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function TopicMapGrid({ topics }: { topics: TopicWithMastery[] }) {
  const statsMap = getTopicStatsMap();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const byUnit = topics.reduce<Record<string, TopicWithMastery[]>>((acc, t) => {
    (acc[t.unitTitle] ??= []).push(t);
    return acc;
  }, {});

  function toggle(topicId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }

  if (topics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-600">
        No topics match your filters. Try clearing search or filters.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(byUnit).map(([unitTitle, unitTopics]) => (
        <section key={unitTitle} id={unitTopics[0]?.unitId}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {unitTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {unitTopics.map((topic) => {
              const stats = statsMap.get(topic.id);
              const isOpen = expanded.has(topic.id);
              const objectiveCount = topic.learningObjectives.length;

              return (
                <article
                  key={topic.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200"
                >
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggle(topic.id)}
                        className="flex-1 text-left"
                        aria-expanded={isOpen}
                      >
                        <h3 className="font-medium text-slate-900">{topic.title}</h3>
                      </button>
                      <span
                        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${masteryColor(topic.masteryScore)}`}
                        title={masteryLabel(topic.masteryScore)}
                      />
                    </div>

                    <p className="mb-3 text-xs text-slate-500">
                      {formatCount(objectiveCount, "objective")} ·{" "}
                      {formatCount(stats?.questionCount ?? 0, "question")} ·{" "}
                      {masteryLabel(topic.masteryScore)} ({topic.masteryScore}%)
                    </p>

                    {stats && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        <TierBadges tiers={stats.tiers} />
                        <CalculatorBadge mode={stats.calculatorMode} />
                        <GradeBandBadges bands={stats.gradeBands} />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={`/practice?topic=${topic.id}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        Practise topic
                      </Button>
                      <button
                        type="button"
                        onClick={() => toggle(topic.id)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                      >
                        {isOpen ? "Hide objectives" : "Show objectives"}
                      </button>
                    </div>
                  </div>

                  {isOpen && stats && (
                    <ul className="border-t border-slate-100 bg-slate-50/80 px-3 py-2">
                      {topic.learningObjectives.map((lo) => {
                        const loStats = stats.objectives[lo.id];
                        return (
                          <li
                            key={lo.id}
                            className="border-b border-slate-100 py-2 last:border-0"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-800">
                                  <span className="mr-1.5 font-mono text-xs text-indigo-600">
                                    {lo.code}
                                  </span>
                                  {lo.title}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                  {lo.description}
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  <TierBadges tiers={lo.tiers} />
                                  {loStats && (
                                    <>
                                      <CalculatorBadge mode={loStats.calculatorMode} />
                                      <GradeBandBadges bands={loStats.gradeBands} />
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-xs text-slate-500">
                                  {loStats?.questionCount ?? 0} q
                                </p>
                                <Link
                                  href={`/practice?topic=${topic.id}&objective=${lo.id}`}
                                  className="text-xs font-medium text-indigo-600 hover:underline"
                                >
                                  Practise
                                </Link>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
