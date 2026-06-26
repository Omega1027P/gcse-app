import { cn } from "@/lib/utils";

const tones = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-rose-100 text-rose-800",
  Foundation: "bg-sky-100 text-sky-800",
  Higher: "bg-violet-100 text-violet-800",
  calculator: "bg-teal-100 text-teal-800",
  nonCalculator: "bg-orange-100 text-orange-800",
  mixed: "bg-cyan-100 text-cyan-800",
  grade13: "bg-lime-100 text-lime-800",
  grade45: "bg-yellow-100 text-yellow-900",
  grade67: "bg-amber-100 text-amber-900",
  grade89: "bg-rose-100 text-rose-900",
} as const;

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone] ?? tones.default,
        className
      )}
    >
      {children}
    </span>
  );
}
