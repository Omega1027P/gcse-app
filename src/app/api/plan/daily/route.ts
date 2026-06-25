import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDailyPlanTasks } from "@/lib/plan/generate-daily-plan";
import { todayISO } from "@/lib/utils";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = todayISO();

  const [mistakesRes, masteryRes, questionsRes] = await Promise.all([
    supabase.from("mistakes").select("*").eq("user_id", user.id),
    supabase.from("topic_mastery").select("*").eq("user_id", user.id),
    supabase
      .from("questions")
      .select("id")
      .eq("status", "published")
      .eq("exam_style", true)
      .limit(5),
  ]);

  const tasks = generateDailyPlanTasks({
    userId: user.id,
    mistakes: mistakesRes.data ?? [],
    mastery: masteryRes.data ?? [],
    examQuestionIds: (questionsRes.data ?? []).map((q) => q.id),
  });

  const { data: plan, error } = await supabase
    .from("daily_plans")
    .upsert(
      {
        user_id: user.id,
        plan_date: today,
        mistake_review_minutes: 10,
        weak_topic_minutes: 20,
        exam_practice_minutes: 20,
        summary_minutes: 5,
        tasks,
        completed: false,
      },
      { onConflict: "user_id,plan_date" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: plan } = await supabase
    .from("daily_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("plan_date", todayISO())
    .maybeSingle();

  return NextResponse.json({ plan });
}
