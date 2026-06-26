import { GRADE_BAND_LABELS, type GradeBand } from "@/lib/syllabus/grade-bands";
import type { CalculatorMode } from "@/lib/syllabus/topic-stats";
import { Badge } from "@/components/ui/Badge";
import type { GcseTier } from "@/lib/types";

export function TierBadges({ tiers }: { tiers: GcseTier[] }) {
  return (
    <>
      {tiers.includes("Foundation") && <Badge tone="Foundation">Foundation</Badge>}
      {tiers.includes("Higher") && <Badge tone="Higher">Higher</Badge>}
    </>
  );
}

export function CalculatorBadge({ mode }: { mode: CalculatorMode | null }) {
  if (!mode) return null;
  if (mode === "calculator") {
    return <Badge tone="calculator">Calculator</Badge>;
  }
  if (mode === "non-calculator") {
    return <Badge tone="nonCalculator">Non-calculator</Badge>;
  }
  return <Badge tone="mixed">Mixed</Badge>;
}

const GRADE_TONE = {
  "1-3": "grade13",
  "4-5": "grade45",
  "6-7": "grade67",
  "8-9": "grade89",
} as const;

export function GradeBandBadge({ band }: { band: GradeBand }) {
  return <Badge tone={GRADE_TONE[band]}>{GRADE_BAND_LABELS[band]}</Badge>;
}

export function GradeBandBadges({ bands }: { bands: GradeBand[] }) {
  return (
    <>
      {bands.map((band) => (
        <GradeBandBadge key={band} band={band} />
      ))}
    </>
  );
}
