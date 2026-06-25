"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            GCSE App
          </p>
          <p className="font-bold text-slate-800">AQA Maths</p>
        </div>
        <button
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          aria-expanded={navOpen}
        >
          {navOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div className={cn("lg:block", navOpen ? "block" : "hidden")}>
        <Sidebar onNavigate={() => setNavOpen(false)} />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
