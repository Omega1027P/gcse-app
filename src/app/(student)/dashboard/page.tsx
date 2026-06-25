"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  generateDemoPlan,
  getDemoMistakes,
  getDemoPlan,
  getDemoProfile,
  getDemoMastery,
  toggleDemoTask,
} from "@/lib/demo/store";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { PageHeader, LoadingState, ErrorState } from "@/components/layout/PageHeader";
import { formatDate, daysUntil, todayISO } from "@/lib/utils";
import { countTopics, countObjectives, getAllTopics } from "@/lib/syllabus/loader";
import { MASTERY_WEAK_THRESHOLD } from "@/lib/constants";
import type { DailyPlan, UserProfile } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        const demoProfile = getDemoProfile();
        setProfile(demoProfile);
        setPlan(getDemoPlan());
        const mastery = getDemoMastery();
        const weak = getAllTopics()
          .filter((t) => (mastery[t.id] ?? 0) < MASTERY_WEAK_THRESHOLD)
          .slice(0, 3)
          .map((t) => t.title);
        setWeakTopics(weak.length ? weak : ["Structure and calculation", "Linear equations"]);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        const demoProfile = getDemoProfile();
        setProfile(demoProfile);
        setPlan(getDemoPlan());
        setLoading(false);
        return;
      }

      const [profileRes, planRes, masteryRes] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
        supabase
          .from("daily_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("plan_date", todayISO())
          .maybeSingle(),
        supabase.from("topic_mastery").select("topic_id, mastery_score").eq("user_id", user.id),
      ]);

      if (profileRes.error) {
        setError(profileRes.error.message);
        setLoading(false);
        return;
      }

      setProfile(profileRes.data);
      setPlan(planRes.data);

      const masteryMap = new Map(
        (masteryRes.data ?? []).map((m) => [m.topic_id, m.mastery_score])
      );
      const weak = getAllTopics()
        .filter((t) => (masteryMap.get(t.id) ?? 0) < MASTERY_WEAK_THRESHOLD)
        .slice(0, 3)
        .map((t) => t.title);
      setWeakTopics(weak);
      setLoading(false);
    }

    load();
  }, []);

  async function generatePlan() {
    if (!isSupabaseConfigured()) {
      setPlan(generateDemoPlan());
      return;
    }
    const res = await fetch("/api/plan/daily", { method: "POST" });
    if (!res.ok) {
      setError("Failed to generate plan");
      return;
    }
    const data = await res.json();
    setPlan(data.plan);
  }

  function handleToggleTask(taskId: string) {
    if (!isSupabaseConfigured()) {
      setPlan(toggleDemoTask(taskId));
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const daysLeft = profile?.exam_date ? daysUntil(profile.exam_date) : null;
  const weakCount =
    weakTopics.length ||
    getDemoMistakes().filter((m) => !m.reviewed).length ||
    countTopics();

  return (
    <div>
      <DemoBanner />
      <PageHeader
        title={`Hi${profile?.display_name ? `, ${profile.display_name}` : ""}`}
        description="Your AQA GCSE Maths study hub"
        action={
          <div className="flex gap-2">
            {!profile?.onboarding_complete && (
              <Button href="/onboarding" variant="secondary">
                Complete profile
              </Button>
            )}
            <Button href="/practice" variant="secondary">
              Start practice
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Target grade</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {profile?.target_grade ?? "—"}
          </p>
          {profile?.tier && <Badge tone={profile.tier}>{profile.tier}</Badge>}
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Days to exam</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {daysLeft !== null ? Math.max(0, daysLeft) : "—"}
          </p>
          {profile?.exam_date && (
            <p className="text-xs text-slate-500">{formatDate(profile.exam_date)}</p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Topics to improve</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{weakCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Syllabus</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{countTopics()} topics</p>
          <p className="text-xs text-slate-500">{countObjectives()} objectives</p>
        </Card>
      </div>

      {weakTopics.length > 0 && (
        <Card className="mb-6">
          <CardHeader title="Focus areas" />
          <ul className="flex flex-wrap gap-2">
            {weakTopics.map((title) => (
              <li key={title}>
                <Badge tone="warning">{title}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Today's plan (~55 min)"
          action={
            !plan ? (
              <Button onClick={generatePlan}>Generate plan</Button>
            ) : (
              <Badge tone={plan.completed ? "success" : "warning"}>
                {plan.completed ? "Done" : "In progress"}
              </Badge>
            )
          }
        />
        {!plan ? (
          <p className="text-sm text-slate-500">
            10 min mistake review · 20 min weak topic · 20 min exam practice · 5 min
            summary
          </p>
        ) : (
          <ul className="space-y-3">
            {plan.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 px-4 py-3"
              >
                <label className="flex flex-1 cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.minutes} minutes</p>
                  </div>
                </label>
                <Link
                  href={
                    task.type === "mistake_review"
                      ? "/mistakes"
                      : task.type === "exam_practice"
                        ? "/past-paper"
                        : task.topicId
                          ? `/practice?topic=${task.topicId}`
                          : "/practice"
                  }
                  className="shrink-0 text-sm font-medium text-indigo-600 hover:underline"
                >
                  Start
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
