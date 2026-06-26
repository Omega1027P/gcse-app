import type { Difficulty, GcseTier } from "@/lib/types";

export type GradeBand = "1-3" | "4-5" | "6-7" | "8-9";

export const GRADE_BANDS: GradeBand[] = ["1-3", "4-5", "6-7", "8-9"];

export const GRADE_BAND_LABELS: Record<GradeBand, string> = {
  "1-3": "Grade 1–3",
  "4-5": "Grade 4–5",
  "6-7": "Grade 6–7",
  "8-9": "Grade 8–9",
};

/** Map question difficulty + tier to indicative GCSE grade band */
export function questionToGradeBand(
  difficulty: Difficulty,
  tier: GcseTier
): GradeBand {
  if (difficulty === "Easy") {
    return tier === "Higher" ? "4-5" : "1-3";
  }
  if (difficulty === "Medium") {
    return "4-5";
  }
  return tier === "Higher" ? "8-9" : "6-7";
}

/** Default band when no questions exist yet (Higher-only objectives skew harder) */
export function defaultGradeBandsForTiers(tiers: GcseTier[]): GradeBand[] {
  if (tiers.length === 1 && tiers[0] === "Higher") {
    return ["6-7", "8-9"];
  }
  if (tiers.length === 1 && tiers[0] === "Foundation") {
    return ["1-3", "4-5"];
  }
  return ["1-3", "4-5", "6-7", "8-9"];
}

export function gradeBandSort(a: GradeBand, b: GradeBand): number {
  return GRADE_BANDS.indexOf(a) - GRADE_BANDS.indexOf(b);
}
