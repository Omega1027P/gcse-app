"use client";

import { useState } from "react";
import { getAllContentQuestions } from "@/lib/content/questions";
import { getDemoProfile } from "@/lib/demo/store";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { PageHeader } from "@/components/layout/PageHeader";
import { estimateGrade, answersMatch } from "@/lib/grading/aqa-boundaries";
import { getAllObjectives } from "@/lib/syllabus/loader";

export default function PastPaperPage() {
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{
    earned: number;
    total: number;
    grade: string;
    weaknesses: string[];
  } | null>(null);

  const questions = getAllContentQuestions()
    .filter((q) => q.examStyle)
    .slice(0, 5);

  const profile = getDemoProfile();
  const tier = (profile?.tier ?? "Foundation") as "Foundation" | "Higher";

  function startPaper() {
    setPhase("active");
    setCurrent(0);
    setAnswers({});
    setResults(null);
  }

  function finishPaper() {
    let earned = 0;
    const total = questions.reduce((s, q) => s + q.marks, 0);
    const weakTopics = new Set<string>();

    for (const q of questions) {
      const ans = answers[q.id] ?? "";
      if (answersMatch(ans, q.finalAnswer)) {
        earned += q.marks;
      } else {
        const lo = getAllObjectives().find((o) => o.id === q.objectiveId);
        if (lo) weakTopics.add(lo.topicTitle);
      }
    }

    setResults({
      earned,
      total,
      grade: estimateGrade(tier, earned, total),
      weaknesses: [...weakTopics],
    });
    setPhase("done");
  }

  const q = questions[current];

  return (
    <div>
      <DemoBanner />
      <PageHeader
        title="Past paper mode"
        description="Timed-style mini mock using published exam-style questions."
      />

      <Card>
        <CardHeader
          title={`Mini mock (${questions.length} questions · ${questions.reduce((s, q) => s + q.marks, 0)} marks)`}
        />

        {phase === "idle" && (
          <>
            <p className="mb-4 text-sm text-slate-600">
              Answer all questions, then get a score, grade estimate, and topic weaknesses
              for next week&apos;s plan.
            </p>
            <Button onClick={startPaper}>Start mini mock</Button>
          </>
        )}

        {phase === "active" && q && (
          <div>
            <p className="mb-2 text-xs text-slate-500">
              Question {current + 1} of {questions.length} · {q.marks} marks
            </p>
            <p className="mb-4 text-lg text-slate-900">{q.questionText}</p>
            <textarea
              className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              value={answers[q.id] ?? ""}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
            <div className="flex gap-2">
              {current < questions.length - 1 ? (
                <Button onClick={() => setCurrent(current + 1)}>Next</Button>
              ) : (
                <Button onClick={finishPaper}>Finish & see results</Button>
              )}
              {current > 0 && (
                <Button variant="ghost" onClick={() => setCurrent(current - 1)}>
                  Back
                </Button>
              )}
            </div>
          </div>
        )}

        {phase === "done" && results && (
          <div className="space-y-4">
            <p className="text-3xl font-bold text-slate-900">
              {results.earned} / {results.total} marks
            </p>
            <p className="text-xl text-indigo-600">
              Estimated grade: <strong>{results.grade}</strong> ({tier})
            </p>
            {results.weaknesses.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-slate-700">Review these topics:</p>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                  {results.weaknesses.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-emerald-700">Strong performance across all topics!</p>
            )}
            <Button variant="secondary" onClick={startPaper}>
              Try again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
