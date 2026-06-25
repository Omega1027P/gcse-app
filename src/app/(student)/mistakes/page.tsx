"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
    const supabase = createClient();
    const { data, error: mError } = await supabase
      .from("mistakes")
      .select("*")
      .order("created_at", { ascending: false });

    if (mError) {
      setError(mError.message);
      setLoading(false);
      return;
    }
    setMistakes(data ?? []);
    setLoading(false);
  }

  async function markReviewed(id: string) {
    const supabase = createClient();
    await supabase.from("mistakes").update({ reviewed: true }).eq("id", id);
    loadMistakes();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const due = mistakes.filter((m) => !m.reviewed);

  return (
    <div>
      <PageHeader
        title="Mistake book"
        description="Review errors by pattern — units, keywords, working, concept, exam technique."
      />

      <Card className="mb-6">
        <CardHeader title={`Due for review (${due.length})`} />
        {due.length === 0 ? (
          <p className="text-sm text-slate-500">No mistakes due. Keep practising!</p>
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
    </div>
  );
}
