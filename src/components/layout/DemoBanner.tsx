"use client";

import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function DemoBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>Demo mode</strong> — progress saves in your browser.{" "}
      <Link href="/login" className="font-medium underline">
        Connect Supabase
      </Link>{" "}
      to sync across devices.
    </div>
  );
}
