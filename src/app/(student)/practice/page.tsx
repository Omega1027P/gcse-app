"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getPracticeQuestions } from "@/lib/content/questions";
import { addDemoMistake, setLastPracticedTopic, updateDemoMastery } from "@/lib/demo/store";
import { classifyMistakeCause } from "@/lib/ai/hint-prompt";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { PageHeader, LoadingState } from "@/components/layout/PageHeader";
import { answersMatch } from "@/lib/grading/aqa-boundaries";
import { findTopicById, getAllObjectives } from "@/lib/syllabus/loader";
import { formatCount } from "@/lib/utils";
import { MISTAKE_CAUSE_LABELS } from "@/lib/constants";
import type { MistakeCause, Question } from "@/lib/types";

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const objectiveId = searchParams.get("objective");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error" | "hint">("hint");
  const [hintLevel, setHintLevel] = useState(0);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const topic = topicId ? findTopicById(topicId) : null;
  const objective = objectiveId
    ? getAllObjectives().find((lo) => lo.id === objectiveId)
    : null;

  useEffect(() => {
    async function load() {
      let contentQs = getPracticeQuestions(topicId);
      if (objectiveId) {
        contentQs = contentQs.filter((q) => q.objective_id === objectiveId);
      }

      if (topicId) {
        setLastPracticedTopic(topicId, objectiveId ?? undefined);
      }

      if (!isSupabaseConfigured()) {
        setQuestions(contentQs);
        setOrder(contentQs.map((_, i) => i).toSorted(() => Math.random() - 0.5));
        setLoading(false);
        return;
      }

      const supabase = createClient();
      let query = supabase.from("questions").select("*").eq("status", "published");

      if (objectiveId) {
        query = query.eq("objective_id", objectiveId);
      } else if (topicId) {
        const t = findTopicById(topicId);
        if (t) {
          const objectiveIds = t.learningObjectives.map((lo) => lo.id);
          query = query.in("objective_id", objectiveIds);
        }
      }

      const { data } = await query.limit(20);
      const qs = data?.length ? data : contentQs;
      setQuestions(qs);
      setOrder(qs.map((_, i) => i).toSorted(() => Math.random() - 0.5));
      setLoading(false);
    }

    setLoading(true);
    setCurrent(0);
    setAnswer("");
    setFeedback("");
    setHintLevel(0);
    setChecked(false);
    load();
  }, [topicId, objectiveId]);

  async function submitAnswer() {
    const q = questions[order[current] ?? current];
    if (!q) return;

    const correct = answersMatch(answer, q.final_answer);
    setChecked(true);
    setFeedbackTone(correct ? "success" : "error");
    setFeedback(
      correct
        ? `Correct! ${q.marks} mark${q.marks > 1 ? "s" : ""} awarded.`
        : "Not quite — use a hint or re-read the question."
    );

    if (topicId) {
      updateDemoMastery(topicId, correct);
    }

    if (!correct) {
      const cause = classifyMistakeCause(answer, q.final_answer) as MistakeCause;
      addDemoMistake({
        user_id: "demo",
        question_id: q.id,
        topic_id: topicId,
        cause,
        explanation: q.question_text.slice(0, 120),
        pattern_note: "",
        reviewed: false,
        next_review_date: new Date().toISOString().split("T")[0],
      });
      setFeedback(
        (f) => `${f} Likely issue: ${MISTAKE_CAUSE_LABELS[cause] ?? cause}.`
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("attempts").insert({
          user_id: user.id,
          question_id: q.id,
          student_answer: answer,
          is_correct: correct,
          marks_awarded: correct ? q.marks : 0,
          marks_available: q.marks,
          hints_used: hintLevel,
        });
      }
    }
  }

  async function requestHint() {
    const q = questions[order[current] ?? current];
    if (!q || hintLevel >= 3) return;

    const nextLevel = hintLevel + 1;
    setHintLevel(nextLevel);

    const res = await fetch("/api/tutor/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, hintLevel: nextLevel, studentAnswer: answer }),
    });

    const data = await res.json();
    setFeedbackTone("hint");
    setFeedback(`Hint ${nextLevel}/3: ${data.message ?? data.hint ?? "Think about the first step."}`);
  }

  function nextQuestion() {
    setCurrent((c) => c + 1);
    setAnswer("");
    setFeedback("");
    setHintLevel(0);
    setChecked(false);
  }

  if (loading) return <LoadingState />;

  const q = questions[order[current] ?? current];
  const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;

  return (
    <div>
      <DemoBanner />
      <PageHeader
        title={
          objective
            ? `${objective.code}: ${objective.title}`
            : topic
              ? `Practice: ${topic.title}`
              : "Practice"
        }
        description={
          objective
            ? `${objective.topicTitle} · ${formatCount(questions.length, "question")}`
            : topic
              ? `${formatCount(topic.learningObjectives.length, "learning objective")} · ${formatCount(questions.length, "question")}`
              : `${formatCount(questions.length, "exam-style question")} available`
        }
      />

      {!q ? (
        <Card>
          <p className="text-sm text-slate-600">
            No questions for this topic yet. Try another topic from the{" "}
            <a href="/map" className="text-indigo-600 hover:underline">
              topic map
            </a>
            .
          </p>
        </Card>
      ) : (
        <>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Card>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="default">
                Q{current + 1}/{questions.length}
              </Badge>
              <Badge tone={q.tier}>{q.tier}</Badge>
              <Badge tone="default">{q.difficulty}</Badge>
              <Badge tone="default">
                {q.marks} mark{q.marks > 1 ? "s" : ""}
              </Badge>
              {q.exam_style && <Badge tone="warning">Exam style</Badge>}
              {!q.calculator_allowed && (
                <Badge tone="danger">Non-calculator</Badge>
              )}
            </div>
            <p className="mb-6 text-lg leading-relaxed text-slate-900">{q.question_text}</p>
            <textarea
              className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              rows={3}
              placeholder="Show your working and final answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={checked}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={submitAnswer} disabled={!answer.trim() || checked}>
                Check answer
              </Button>
              <Button variant="secondary" onClick={requestHint} disabled={hintLevel >= 3}>
                {hintLevel > 0 ? `Hint ${hintLevel}/3` : "Get hint"}
              </Button>
              {checked && current < questions.length - 1 && (
                <Button variant="ghost" onClick={nextQuestion}>
                  Next question
                </Button>
              )}
            </div>
            {feedback && (
              <p
                className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                  feedbackTone === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : feedbackTone === "error"
                      ? "bg-rose-50 text-rose-800"
                      : "bg-indigo-50 text-indigo-900"
                }`}
              >
                {feedback}
              </p>
            )}
            {checked && !answersMatch(answer, q.final_answer) && q.solution_steps && (
              <details className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <summary className="cursor-pointer font-medium">Show worked solution</summary>
                <p className="mt-2">{q.solution_steps}</p>
              </details>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PracticeContent />
    </Suspense>
  );
}
