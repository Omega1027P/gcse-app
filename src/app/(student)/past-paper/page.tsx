"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { estimateGrade } from "@/lib/grading/aqa-boundaries";

export default function PastPaperPage() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState<{ earned: number; total: number } | null>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startMiniPaper() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("status", "published")
      .eq("exam_style", true)
      .limit(5);

    const qs = questions ?? [];
    const total = qs.reduce((s, q) => s + q.marks, 0);
    const earned = Math.round(total * 0.6);

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("tier")
      .eq("user_id", user?.id ?? "")
      .single();

    const tier = (profile?.tier ?? "Foundation") as "Foundation" | "Higher";
    const estimated = estimateGrade(tier, earned, total);

    if (user) {
      await supabase.from("past_paper_sessions").insert({
        user_id: user.id,
        title: "Mini mock (5 questions)",
        tier,
        total_marks: total,
        earned_marks: earned,
        estimated_grade: estimated,
        weakness_snapshot: [],
        completed_at: new Date().toISOString(),
      });
    }

    setScore({ earned, total });
    setGrade(estimated);
    setStarted(true);
    setLoading(false);
  }

  return (
    <div>
      <PageHeader
        title="Past paper mode"
        description="MVP: mini mock paper. Full timed papers coming soon."
      />

      <Card>
        <CardHeader title="Mini mock (5 questions)" />
        {!started ? (
          <>
            <p className="mb-4 text-sm text-slate-600">
              Simulates exam conditions with published exam-style questions. After completion
              you get a score, grade estimate, and topic weaknesses.
            </p>
            <Button onClick={startMiniPaper} disabled={loading}>
              {loading ? "Loading…" : "Start mini mock"}
            </Button>
          </>
        ) : score && grade ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold text-slate-900">
              {score.earned} / {score.total} marks
            </p>
            <p className="text-lg text-indigo-600">Estimated grade: {grade}</p>
            <p className="text-sm text-slate-500">
              Full interactive paper UI will replace this placeholder in the next sprint.
            </p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
