"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormFields";
import { EXAM_BOARDS, GCSE_TIERS, TARGET_GRADES } from "@/lib/constants";

export default function OnboardingPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [tier, setTier] = useState("Foundation");
  const [targetGrade, setTargetGrade] = useState("5");
  const [examDate, setExamDate] = useState("");
  const [weeklyMinutes, setWeeklyMinutes] = useState("300");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        display_name: displayName,
        exam_board: EXAM_BOARDS[0],
        subject: "Mathematics",
        spec_code: "8300",
        tier,
        target_grade: targetGrade,
        exam_date: examDate || null,
        weekly_study_minutes: parseInt(weeklyMinutes, 10),
        onboarding_complete: true,
      })
      .eq("user_id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Set up your study profile</h1>
      <p className="mt-2 text-sm text-slate-600">
        We use this to build your topic map and daily plan.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Your name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Select label="Exam board" value={EXAM_BOARDS[0]} disabled>
          <option value="AQA">AQA</option>
        </Select>
        <Select label="Tier" value={tier} onChange={(e) => setTier(e.target.value)}>
          {GCSE_TIERS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select
          label="Target grade"
          value={targetGrade}
          onChange={(e) => setTargetGrade(e.target.value)}
        >
          {TARGET_GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
        <Input
          label="Exam date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />
        <Input
          label="Weekly study time (minutes)"
          type="number"
          min={60}
          step={30}
          value={weeklyMinutes}
          onChange={(e) => setWeeklyMinutes(e.target.value)}
        />
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving…" : "Start learning"}
        </Button>
      </form>
    </div>
  );
}
