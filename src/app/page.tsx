import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { countObjectives, countTopics, getUnits } from "@/lib/syllabus/loader";
import { formatCount } from "@/lib/utils";

export default function LandingPage() {
  const units = getUnits();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            GCSE App
          </p>
          <p className="text-lg font-bold text-slate-900">AQA Mathematics</p>
        </div>
        <div className="flex gap-2">
          <Button href="/login" variant="ghost">
            Sign in
          </Button>
          <Button href="/dashboard">Open app</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Revise smarter, not just harder
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Map your syllabus, follow a daily 55-minute plan, practise exam-style
            questions, and get AI hints that follow the mark scheme — without being
            given the answer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/onboarding">Set up my profile</Button>
            <Button href="/map" variant="secondary">
              Explore topic map
            </Button>
          </div>
        </section>

        <section className="mb-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Specification map",
              body: `${formatCount(countTopics(), "topic")} · ${formatCount(countObjectives(), "learning objective")} — see what you know at a glance.`,
            },
            {
              title: "Daily study loop",
              body: "10 min mistakes · 20 min weak topics · 20 min exam practice · 5 min summary.",
            },
            {
              title: "AI tutor hints",
              body: "Three levels of guidance aligned to GCSE marking — units, steps, concepts.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{card.body}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Syllabus units
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((unit) => (
              <Link
                key={unit.id}
                href={`/map#${unit.id}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-indigo-300 hover:shadow-sm"
              >
                {unit.title}
                <span className="ml-2 text-slate-400">{unit.topics.length} topics</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
