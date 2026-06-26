"use client";

import { CALCULATOR_FILTER_OPTIONS, MASTERY_FILTER_OPTIONS, TIER_FILTER_OPTIONS } from "@/lib/constants";
import { GRADE_BANDS, GRADE_BAND_LABELS, type GradeBand } from "@/lib/syllabus/grade-bands";

export interface MapFilters {
  search: string;
  tier: "all" | "Foundation" | "Higher";
  calculator: "all" | "calculator" | "non-calculator" | "mixed";
  gradeBand: "all" | GradeBand;
  mastery: "all" | "not-started" | "weak" | "ok" | "strong";
}

export const DEFAULT_MAP_FILTERS: MapFilters = {
  search: "",
  tier: "all",
  calculator: "all",
  gradeBand: "all",
  mastery: "all",
};

interface TopicMapFiltersProps {
  filters: MapFilters;
  onChange: (filters: MapFilters) => void;
  resultCount: number;
  totalCount: number;
}

export function TopicMapFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: TopicMapFiltersProps) {
  function set<K extends keyof MapFilters>(key: K, value: MapFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="map-search" className="mb-1 block text-xs font-medium text-slate-600">
            Search topics & objectives
          </label>
          <input
            id="map-search"
            type="search"
            placeholder="e.g. quadratic, N5, trigonometry…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <p className="text-xs text-slate-500">
          Showing {resultCount} of {totalCount} topics
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <FilterSelect
          label="Tier"
          value={filters.tier}
          options={TIER_FILTER_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          onChange={(v) => set("tier", v as MapFilters["tier"])}
        />
        <FilterSelect
          label="Paper type"
          value={filters.calculator}
          options={CALCULATOR_FILTER_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          onChange={(v) => set("calculator", v as MapFilters["calculator"])}
        />
        <FilterSelect
          label="Grade band"
          value={filters.gradeBand}
          options={[
            { value: "all", label: "All grades" },
            ...GRADE_BANDS.map((b) => ({ value: b, label: GRADE_BAND_LABELS[b] })),
          ]}
          onChange={(v) => set("gradeBand", v as MapFilters["gradeBand"])}
        />
        <FilterSelect
          label="Mastery"
          value={filters.mastery}
          options={MASTERY_FILTER_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          onChange={(v) => set("mastery", v as MapFilters["mastery"])}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
