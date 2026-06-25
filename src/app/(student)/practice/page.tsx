"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, LoadingState, ErrorState } from "@/components/layout/PageHeader";
import { answersMatch } from "@/lib/grading/aqa-boundaries";
import { findTopicById } from "@/lib/syllabus/loader";
import type { Question } from "@/lib/types";

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const topic = topicId ? findTopicById(topicId) : null;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase.from("questions").select("*").eq("status", "published");

      if (topicId && topic) {
        const objectiveIds = topic.learningObjectives.map((lo) => lo.id);
        query = query.in("objective_id", objectiveIds);
      }

      const { data, error: qError } = await query.limit(10);
      if (qError) {
        setError(qError.message);
        setLoading(false);
        return;
      }
      setQuestions(data ?? []);
      setLoading(false);
    }

    load();
  }, [topicId, topic]);

  async function submitAnswer() {
    const q = questions[current];
    if (!q) return;

    const correct = answersMatch(answer, q.final_answer);
    setFeedback(correct ? "Correct! Well done." : "Not quite — try a hint or check your working.");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("attempts").insert({
      user_id: user.id,
      question_id: q.id,
      student_answer: answer,
      is_correct: correct,
      marks_awarded: correct ? q.marks : 0,
      marks_available: q.marks,
      hints_used: hintLevel,
    });

    if (!correct) {
      await supabase.from("mistakes").insert({
        user_id: user.id,
        question_id: q.id,
        topic_id: topicId,
        cause: "working",
        explanation: `Incorrect answer for: ${q.question_text.slice(0, 80)}…`,
      });
    }
  }

  async function requestHint() {
    const q = questions[current];
    if (!q || hintLevel >= 3) return;

    const nextLevel = hintLevel + 1;
    setHintLevel(nextLevel);

    const res = await fetch("/api/tutor/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, hintLevel: nextLevel, studentAnswer: answer }),
    });

    const data = await res.json();
    setFeedback(data.message ?? data.hint ?? "Think about the first step.");
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const q = questions[current];

  return (
    <div>
      <PageHeader
        title={topic ? `Practice: ${topic.title}` : "Practice"}
        description={
          topic
            ? `${topic.learningObjectives.length} learning objectives`
            : "Exam-style questions from your syllabus"
        }
      />

      {!q ? (
        <Card>
          <p className="text-sm text-slate-600">
            No published questions yet for this topic. Add content in{" "}
            <code className="text-xs">content/questions/</code> and publish via Supabase.
          </p>
        </Card>
      ) : (
        <Card>
          <p className="mb-2 text-xs font-medium uppercase text-slate-500">
            Question {current + 1} of {questions.length} · {q.marks} mark{q.marks > 1 ? "s" : ""}
          </p>
          <p className="mb-6 text-lg text-slate-900">{q.question_text}</p>
          <textarea
            className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={3}
            placeholder="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={submitAnswer}>Check answer</Button>
            <Button variant="secondary" onClick={requestHint} disabled={hintLevel >= 3}>
              Hint {hintLevel > 0 ? `(${hintLevel}/3)` : ""}
            </Button>
            {current < questions.length - 1 && (
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrent(current + 1);
                  setAnswer("");
                  setFeedback("");
                  setHintLevel(0);
                }}
              >
                Next question
              </Button>
            )}
          </div>
          {feedback && (
            <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {feedback}
            </p>
          )}
        </Card>
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
