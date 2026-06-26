export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date(todayISO());
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function masteryColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-400";
  if (score > 0) return "bg-rose-400";
  return "bg-slate-200";
}

export function masteryLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "OK";
  if (score > 0) return "Weak";
  return "Not started";
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`
): string {
  return count === 1 ? singular : plural;
}

export function formatCount(count: number, singular: string, plural?: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}
