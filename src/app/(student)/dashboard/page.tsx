"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader, LoadingState, ErrorState } from "@/components/layout/PageHeader";
import { formatDate, daysUntil, todayISO } from "@/lib/utils";
import { countTopics, countObjectives } from "@/lib/syllabus/loader";
import type { DailyPlan, UserProfile } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [weakCount, setWeakCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, planRes, masteryRes] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
        supabase
          .from("daily_plans")
          .select("*")
          .eq("user_id", user.id)
          .eq("plan_date", todayISO())
          .maybeSingle(),
        supabase.from("topic_mastery").select("mastery_score").eq("user_id", user.id),
      ]);

      if (profileRes.error) {
        setError(profileRes.error.message);
        setLoading(false);
        return;
      }

      setProfile(profileRes.data);
      setPlan(planRes.data);

      const weak =
        masteryRes.data?.filter((m) => m.mastery_score < 60).length ?? countTopics();
      setWeakCount(weak);
      setLoading(false);
    }

    load();
  }, []);

  async function generatePlan() {
    const res = await fetch("/api/plan/daily", { method: "POST" });
    if (!res.ok) {
      setError("Failed to generate plan");
      return;
    }
    const data = await res.json();
    setPlan(data.plan);
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const daysLeft = profile?.exam_date ? daysUntil(profile.exam_date) : null;

  return (
    <div>
      <PageHeader
        title={`Hi${profile?.display_name ? `, ${profile.display_name}` : ""}`}
        description="Your AQA GCSE Maths study hub"
        action={
          <Button href="/practice" variant="secondary">
            Start practice
          </Button>
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
          <p className="text-sm text-slate-500">Syllabus coverage</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {countTopics()} topics
          </p>
          <p className="text-xs text-slate-500">{countObjectives()} objectives</p>
        </Card>
      </div>

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
            {(plan.tasks as DailyPlan["tasks"]).map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.minutes} minutes</p>
                </div>
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
                  className="text-sm font-medium text-indigo-600 hover:underline"
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
