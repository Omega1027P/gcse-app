#!/usr/bin/env npx tsx
/**
 * Generates extension question batches (+200 questions).
 * Assigns unique IDs, writes JSON, syncs imports.
 * Run: npm run generate:ext
 */
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import { NUMBER_EXT } from "./question-data/number-ext";
import { ALGEBRA_EXT } from "./question-data/algebra-ext";
import { RATIO_EXT } from "./question-data/ratio-ext";
import { GEOMETRY_EXT } from "./question-data/geometry-ext";
import { PROBABILITY_STATISTICS_EXT } from "./question-data/probability-statistics-ext";
import type { QSpec } from "./question-data/types";

const ROOT = join(import.meta.dirname, "..");
const QUESTIONS_DIR = join(ROOT, "content/questions");

function makeQuestion(s: QSpec & { id: string }) {
  return {
    id: s.id,
    objectiveId: s.objectiveId,
    tier: s.tier,
    difficulty: s.difficulty,
    questionType: s.questionType,
    marks: s.marks,
    examStyle: s.examStyle,
    calculatorAllowed: s.calculatorAllowed,
    questionText: s.questionText,
    finalAnswer: s.finalAnswer,
    solutionSteps: s.solutionSteps,
    markScheme: [
      {
        stepOrder: 1,
        markCode: s.marks > 1 ? "M1" : "B1",
        description: "Correct method or partial working",
        points: Math.max(1, s.marks - 1),
      },
      ...(s.marks > 1
        ? [{ stepOrder: 2, markCode: "A1", description: s.finalAnswer, points: 1 }]
        : []),
    ],
    hints: s.hints.map((text, i) => ({ level: i + 1, text })),
    status: "published",
  };
}

function loadExistingIds(): Set<string> {
  const ids = new Set<string>();
  for (const file of readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(readFileSync(join(QUESTIONS_DIR, file), "utf-8"));
    if (Array.isArray(data)) {
      for (const q of data) ids.add(q.id);
    }
  }
  return ids;
}

function nextId(objectiveId: string, existingIds: Set<string>): string {
  const prefix = `${objectiveId}-q`;
  let max = 0;
  for (const id of existingIds) {
    if (id.startsWith(prefix)) {
      const num = parseInt(id.slice(prefix.length), 10);
      if (!Number.isNaN(num) && num > max) max = num;
    }
  }
  const id = `${prefix}${String(max + 1).padStart(2, "0")}`;
  existingIds.add(id);
  return id;
}

function assignIds(specs: QSpec[], existingIds: Set<string>): (QSpec & { id: string })[] {
  return specs.map((s) => ({ ...s, id: nextId(s.objectiveId, existingIds) }));
}

const BATCHES: { file: string; specs: QSpec[] }[] = [
  { file: "number-ext.json", specs: NUMBER_EXT },
  { file: "algebra-ext.json", specs: ALGEBRA_EXT },
  { file: "ratio-ext.json", specs: RATIO_EXT },
  { file: "geometry-ext.json", specs: GEOMETRY_EXT },
  { file: "probability-statistics-ext.json", specs: PROBABILITY_STATISTICS_EXT },
];

function main() {
  const existingIds = loadExistingIds();
  let total = 0;

  for (const { file, specs } of BATCHES) {
    const withIds = assignIds(specs, existingIds);
    const questions = withIds.map(makeQuestion);
    const path = join(QUESTIONS_DIR, file);
    writeFileSync(path, JSON.stringify(questions, null, 2) + "\n");
    console.log(`Wrote ${questions.length} questions → ${file}`);
    total += questions.length;
  }

  console.log(`\nTotal extension questions: ${total}`);

  // Sync imports
  execSync("npx tsx scripts/sync-question-imports.ts", { cwd: ROOT, stdio: "inherit" });
}

main();
