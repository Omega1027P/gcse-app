#!/usr/bin/env npx tsx
/**
 * Content gap checker — run via `npm run check:content`
 * Used by Cursor Automation "Daily content check"
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const SYLLABUS_PATH = join(ROOT, "content/syllabus/aqa-maths-8300.json");
const QUESTIONS_DIR = join(ROOT, "content/questions");
const REPORT_DIR = join(ROOT, "content/reports");

interface LearningObjective {
  id: string;
  code: string;
  title: string;
  questionTypes: string[];
}

interface Topic {
  id: string;
  title: string;
  learningObjectives: LearningObjective[];
}

interface Unit {
  id: string;
  title: string;
  topics: Topic[];
}

interface Syllabus {
  specCode: string;
  units: Unit[];
}

interface ContentQuestion {
  id: string;
  objectiveId: string;
  markScheme?: { stepOrder: number; markCode: string; description: string; points: number }[];
  hints?: { level: number; text: string }[];
  status?: string;
}

function loadSyllabus(): Syllabus {
  return JSON.parse(readFileSync(SYLLABUS_PATH, "utf-8"));
}

function loadQuestions(): ContentQuestion[] {
  if (!existsSync(QUESTIONS_DIR)) return [];
  const files = readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith(".json"));
  const questions: ContentQuestion[] = [];
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(QUESTIONS_DIR, file), "utf-8"));
    if (Array.isArray(data)) {
      questions.push(...data);
    }
  }
  return questions;
}

function main() {
  const syllabus = loadSyllabus();
  const questions = loadQuestions();

  const objectives = syllabus.units.flatMap((u) =>
    u.topics.flatMap((t) =>
      t.learningObjectives.map((lo) => ({
        ...lo,
        unitId: u.id,
        unitTitle: u.title,
        topicId: t.id,
        topicTitle: t.title,
      }))
    )
  );

  const questionsByObjective = new Map<string, ContentQuestion[]>();
  for (const q of questions) {
    const list = questionsByObjective.get(q.objectiveId) ?? [];
    list.push(q);
    questionsByObjective.set(q.objectiveId, list);
  }

  const gaps: string[] = [];

  for (const lo of objectives) {
    const qs = questionsByObjective.get(lo.id) ?? [];
    if (qs.length === 0) {
      gaps.push(`MISSING_QUESTIONS: ${lo.code} ${lo.id} — ${lo.topicTitle} / ${lo.title}`);
      continue;
    }
    if (qs.length < 3) {
      gaps.push(`LOW_COVERAGE: ${lo.code} ${lo.id} — only ${qs.length}/3 questions`);
    }
    for (const q of qs) {
      if (!q.markScheme?.length) {
        gaps.push(`MISSING_MARK_SCHEME: question ${q.id} (${lo.code})`);
      }
      if (!q.hints || q.hints.length < 3) {
        gaps.push(`MISSING_HINTS: question ${q.id} (${lo.code}) — need 3 hint levels`);
      }
      if (!q.status) {
        gaps.push(`MISSING_STATUS: question ${q.id} (${lo.code})`);
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    specCode: syllabus.specCode,
    totalObjectives: objectives.length,
    objectivesWithQuestions: [...questionsByObjective.keys()].length,
    totalQuestions: questions.length,
    gapCount: gaps.length,
    gaps,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  const reportPath = join(REPORT_DIR, `content-gaps-${report.generatedAt.split("T")[0]}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Content gap report: ${report.gapCount} issues`);
  console.log(`Report written to ${reportPath}`);
  for (const g of gaps.slice(0, 20)) {
    console.log(`  - ${g}`);
  }
  if (gaps.length > 20) {
    console.log(`  ... and ${gaps.length - 20} more`);
  }

  process.exit(gaps.length > 0 ? 1 : 0);
}

main();
