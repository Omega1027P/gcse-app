export const EXAM_BOARDS = ["AQA"] as const;
export const SUBJECTS = ["Mathematics"] as const;
export const GCSE_TIERS = ["Foundation", "Higher"] as const;
export const TARGET_GRADES = ["4", "5", "6", "7", "8", "9"] as const;

export const DAILY_PLAN_MINUTES = {
  mistakeReview: 10,
  weakTopic: 20,
  examPractice: 20,
  summary: 5,
} as const;

export const MASTERY_WEAK_THRESHOLD = 60;

export const CALCULATOR_FILTER_OPTIONS = [
  { id: "all", label: "All papers" },
  { id: "calculator", label: "Calculator" },
  { id: "non-calculator", label: "Non-calculator" },
  { id: "mixed", label: "Mixed" },
] as const;

export const TIER_FILTER_OPTIONS = [
  { id: "all", label: "All tiers" },
  { id: "Foundation", label: "Foundation" },
  { id: "Higher", label: "Higher" },
] as const;

export const MASTERY_FILTER_OPTIONS = [
  { id: "all", label: "All mastery" },
  { id: "not-started", label: "Not started" },
  { id: "weak", label: "Weak" },
  { id: "ok", label: "OK" },
  { id: "strong", label: "Strong" },
] as const;

export const SRS_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;

export const MISTAKE_CAUSE_LABELS: Record<string, string> = {
  units: "Units / notation",
  keywords: "Keywords / wording",
  working: "Working / steps",
  concept: "Concept understanding",
  exam_technique: "Exam technique",
};
