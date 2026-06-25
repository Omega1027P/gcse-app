"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getDemoMistakes, markDemoMistakeReviewed } from "@/lib/demo/store";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { PageHeader, LoadingState, ErrorState } from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils";
import { MISTAKE_CAUSE_LABELS } from "@/lib/constants";
import type { Mistake } from "@/lib/types";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMistakes();
  }, []);

  async function loadMistakes() {
    if (!isSupabaseConfigured()) {
      setMistakes(getDemoMistakes());
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMistakes(getDemoMistakes());
      setLoading(false);
      return;
    }

    const { data, error: mError } = await supabase
      .from("mistakes")
      .select("*")
      .order("created_at", { ascending: false });

    if (mError) {
      setError(mError.message);
      setLoading(false);
      return;
    }
    setMistakes([...(data ?? []), ...getDemoMistakes()]);
    setLoading(false);
  }

  async function markReviewed(id: string) {
    if (id.startsWith("demo-")) {
      markDemoMistakeReviewed(id);
      setMistakes(getDemoMistakes());
      return;
    }
    const supabase = createClient();
    await supabase.from("mistakes").update({ reviewed: true }).eq("id", id);
    loadMistakes();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const due = mistakes.filter((m) => !m.reviewed);
  const reviewed = mistakes.filter((m) => m.reviewed).slice(0, 5);

  return (
    <div>
      <DemoBanner />
      <PageHeader
        title="Mistake book"
        description="Review errors by pattern — units, keywords, working, concept, exam technique."
      />

      <Card className="mb-6">
        <CardHeader title={`Due for review (${due.length})`} />
        {due.length === 0 ? (
          <p className="text-sm text-slate-500">
            No mistakes yet — practise on the{" "}
            <a href="/practice" className="text-indigo-600 hover:underline">
              practice page
            </a>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {due.map((m) => (
              <li
                key={m.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {MISTAKE_CAUSE_LABELS[m.cause] ?? m.cause}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{m.explanation}</p>
                  {m.next_review_date && (
                    <p className="mt-1 text-xs text-slate-400">
                      Review by {formatDate(m.next_review_date)}
                    </p>
                  )}
                </div>
                <Button variant="secondary" onClick={() => markReviewed(m.id)}>
                  Mark reviewed
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {reviewed.length > 0 && (
        <Card>
          <CardHeader title="Recently reviewed" />
          <ul className="space-y-2 text-sm text-slate-500">
            {reviewed.map((m) => (
              <li key={m.id} className="border-b border-slate-50 pb-2 last:border-0">
                {MISTAKE_CAUSE_LABELS[m.cause]} — {m.explanation.slice(0, 60)}…
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
