type GcseTier = "Foundation" | "Higher";

/** AQA GCSE Maths grade boundaries (approximate, Foundation/Higher) — configure per series */
export const AQA_BOUNDARIES: Record<
  GcseTier,
  { grade: string; minPercent: number }[]
> = {
  Foundation: [
    { grade: "5", minPercent: 77 },
    { grade: "4", minPercent: 64 },
    { grade: "3", minPercent: 48 },
    { grade: "2", minPercent: 32 },
    { grade: "1", minPercent: 14 },
  ],
  Higher: [
    { grade: "9", minPercent: 79 },
    { grade: "8", minPercent: 71 },
    { grade: "7", minPercent: 62 },
    { grade: "6", minPercent: 52 },
    { grade: "5", minPercent: 43 },
    { grade: "4", minPercent: 33 },
  ],
};

export function estimateGrade(
  tier: GcseTier,
  earnedMarks: number,
  totalMarks: number
): string {
  if (totalMarks === 0) return "—";
  const percent = (earnedMarks / totalMarks) * 100;
  const boundaries = AQA_BOUNDARIES[tier];
  for (const b of boundaries) {
    if (percent >= b.minPercent) return b.grade;
  }
  return "U";
}

export function normaliseAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, "")
    .replace(/£/g, "")
    .replace(/^x=/, "")
    .replace(/cm$/g, "");
}

export function answersMatch(student: string, expected: string): boolean {
  const s = normaliseAnswer(student);
  const e = normaliseAnswer(expected);
  if (s === e) return true;
  // Accept comma-separated lists in any order
  if (s.includes(",") || e.includes(",")) {
    const sortParts = (v: string) => v.split(/[,/]/).map((p) => p.trim()).filter(Boolean).toSorted().join("|");
    return sortParts(s) === sortParts(e);
  }
  return false;
}
