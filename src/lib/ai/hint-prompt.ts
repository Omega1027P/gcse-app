import type { MarkSchemeStep, QuestionHint, MistakeCause } from "@/lib/types";

export function buildHintSystemPrompt(params: {
  questionText: string;
  hintLevel: number;
  hints: Pick<QuestionHint, "level" | "hint_text">[];
  markScheme: Pick<MarkSchemeStep, "mark_code" | "description">[];
}): string {
  const hint = params.hints.find((h) => h.level === params.hintLevel);
  const markSummary = params.markScheme
    .map((s) => `${s.mark_code}: ${s.description}`)
    .join("; ");

  return `You are a GCSE Maths tutor for AQA. NEVER give the final numerical answer.
Question: ${params.questionText}
Mark scheme summary: ${markSummary}
Hint level ${params.hintLevel}/3.
${hint ? `Use this approved hint as a base: ${hint.hint_text}` : ""}
Rules:
- Level 1: directional nudge only
- Level 2: method/framework without final answer
- Level 3: mark-scheme style feedback on what is missing
- End by asking what step they are stuck on
- If the error is about units, keywords, working, or concept, name it without solving`;
}

export function classifyMistakeCause(studentAnswer: string, expected: string): MistakeCause {
  const s = studentAnswer.toLowerCase();
  if (/cm|mm|m²|kg|°|unit/.test(s) && !studentAnswer.includes(expected.split(",")[0]?.trim() ?? "")) {
    return "units";
  }
  if (studentAnswer.length < 3) return "concept";
  if (Math.abs(studentAnswer.length - expected.length) > 10) return "working";
  return "exam_technique";
}
