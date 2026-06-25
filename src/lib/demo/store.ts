import type { DailyPlan, DailyPlanTask, Mistake, UserProfile } from "@/lib/types";
import { generateDailyPlanTasks } from "@/lib/plan/generate-daily-plan";
import { todayISO } from "@/lib/utils";

const KEYS = {
  profile: "gcse_demo_profile",
  mastery: "gcse_demo_mastery",
  mistakes: "gcse_demo_mistakes",
  plan: "gcse_demo_plan",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDemoProfile(): UserProfile | null {
  return read<UserProfile | null>(KEYS.profile, null);
}

export function saveDemoProfile(
  profile: Omit<UserProfile, "user_id" | "created_at" | "updated_at">
) {
  const now = new Date().toISOString();
  write(KEYS.profile, {
    ...profile,
    user_id: "demo",
    created_at: now,
    updated_at: now,
  });
}

export function getDemoMastery(): Record<string, number> {
  return read<Record<string, number>>(KEYS.mastery, {});
}

export function updateDemoMastery(topicId: string, correct: boolean) {
  const map = getDemoMastery();
  const current = map[topicId] ?? 0;
  const delta = correct ? 8 : -4;
  map[topicId] = Math.max(0, Math.min(100, current + delta));
  write(KEYS.mastery, map);
}

export function getDemoMistakes(): Mistake[] {
  return read<Mistake[]>(KEYS.mistakes, []);
}

export function addDemoMistake(mistake: Omit<Mistake, "id" | "created_at" | "updated_at">) {
  const list = getDemoMistakes();
  const now = new Date().toISOString();
  list.unshift({
    ...mistake,
    id: `demo-${Date.now()}`,
    created_at: now,
    updated_at: now,
  });
  write(KEYS.mistakes, list.slice(0, 50));
}

export function markDemoMistakeReviewed(id: string) {
  const list = getDemoMistakes().map((m) =>
    m.id === id ? { ...m, reviewed: true } : m
  );
  write(KEYS.mistakes, list);
}

export function getDemoPlan(): DailyPlan | null {
  return read<DailyPlan | null>(KEYS.plan, null);
}

export function generateDemoPlan(): DailyPlan {
  const mistakes = getDemoMistakes();
  const masteryMap = getDemoMastery();
  const mastery = Object.entries(masteryMap).map(([topic_id, mastery_score]) => ({
    id: topic_id,
    user_id: "demo",
    topic_id,
    mastery_score,
    attempts_count: 0,
    correct_count: 0,
    last_practiced_at: null,
  }));

  const tasks = generateDailyPlanTasks({
    userId: "demo",
    mistakes,
    mastery,
    examQuestionIds: [],
  });

  const plan: DailyPlan = {
    id: "demo-plan",
    user_id: "demo",
    plan_date: todayISO(),
    mistake_review_minutes: 10,
    weak_topic_minutes: 20,
    exam_practice_minutes: 20,
    summary_minutes: 5,
    tasks,
    completed: tasks.every((t) => t.completed),
  };

  write(KEYS.plan, plan);
  return plan;
}

export function toggleDemoTask(taskId: string): DailyPlan | null {
  const plan = getDemoPlan();
  if (!plan) return null;
  const tasks = plan.tasks.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  ) as DailyPlanTask[];
  const updated = {
    ...plan,
    tasks,
    completed: tasks.every((t) => t.completed),
  };
  write(KEYS.plan, updated);
  return updated;
}
