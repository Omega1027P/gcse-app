#!/usr/bin/env npx tsx
/**
 * Generates fill question batches to reach 3 questions per learning objective.
 * Run: npx tsx scripts/generate-question-fill.ts
 */
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..");
const QUESTIONS_DIR = join(ROOT, "content/questions");

interface QSpec {
  id: string;
  objectiveId: string;
  tier: "Foundation" | "Higher";
  difficulty: "Easy" | "Medium" | "Hard";
  questionType: string;
  marks: number;
  examStyle: boolean;
  calculatorAllowed: boolean;
  questionText: string;
  finalAnswer: string;
  solutionSteps: string;
  hints: [string, string, string];
}

function makeQuestion(s: QSpec) {
  return {
    ...s,
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

const FILL_SPECS: QSpec[] = [
  // ── Number (17) ──────────────────────────────────────────
  {
    id: "n-sc-01-q04", objectiveId: "n-sc-01", tier: "Foundation", difficulty: "Easy",
    questionType: "comparison", marks: 1, examStyle: false, calculatorAllowed: false,
    questionText: "Write =, < or > to make a true statement: 0.7 ___ 7/10",
    finalAnswer: "=", solutionSteps: "7/10 = 0.7, so 0.7 = 7/10",
    hints: ["Convert the fraction to a decimal.", "7 ÷ 10 = 0.7.", "B1: they are equal, so use =."],
  },
  {
    id: "n-sc-02-q02", objectiveId: "n-sc-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "Work out 18 ÷ 0.3",
    finalAnswer: "60", solutionSteps: "18 ÷ 0.3 = 180 ÷ 3 = 60",
    hints: ["Multiply top and bottom by 10 to remove the decimal.", "18 ÷ 0.3 = 180 ÷ 3.", "M1: equivalent division. A1: 60."],
  },
  {
    id: "n-sc-02-q03", objectiveId: "n-sc-02", tier: "Foundation", difficulty: "Hard",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Work out 3/4 − 1/3 + 1/6. Give your answer as a fraction in simplest form.",
    finalAnswer: "7/12", solutionSteps: "LCD 12: 9/12 − 4/12 + 2/12 = 7/12",
    hints: ["Find a common denominator of 12.", "Convert each fraction: 9/12, 4/12, 2/12.", "M1: common denominator. M1: combine. A1: 7/12."],
  },
  {
    id: "n-sc-03-q03", objectiveId: "n-sc-03", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Work out 5² − 2³",
    finalAnswer: "17", solutionSteps: "5² = 25, 2³ = 8, 25 − 8 = 17",
    hints: ["Evaluate each power first.", "5² = 25 and 2³ = 8.", "M1: 25 and 8. A1: 17."],
  },
  {
    id: "n-sc-04-q03", objectiveId: "n-sc-04", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Find the LCM of 12 and 18.",
    finalAnswer: "36", solutionSteps: "12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 36",
    hints: ["Prime factorise both numbers.", "Take the highest power of each prime.", "M1: factorise. M1: combine. A1: 36."],
  },
  {
    id: "n-fdp-01-q04", objectiveId: "n-fdp-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Work out 1 2/3 × 3/4. Give your answer as a mixed number in simplest form.",
    finalAnswer: "1 1/4", solutionSteps: "5/3 × 3/4 = 15/12 = 5/4 = 1 1/4",
    hints: ["Convert the mixed number to an improper fraction.", "5/3 × 3/4 — cancel the 3s if you can.", "M1: 15/12. A1: 1 1/4."],
  },
  {
    id: "n-fdp-01-q03", objectiveId: "n-fdp-01", tier: "Foundation", difficulty: "Hard",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Work out 2/5 ÷ 3/10",
    finalAnswer: "4/3", solutionSteps: "2/5 ÷ 3/10 = 2/5 × 10/3 = 20/15 = 4/3",
    hints: ["Keep, change, flip: multiply by the reciprocal.", "2/5 × 10/3.", "M1: correct flip. M1: multiply. A1: 4/3."],
  },
  {
    id: "n-fdp-02-q03", objectiveId: "n-fdp-02", tier: "Foundation", difficulty: "Easy",
    questionType: "conversion", marks: 2, examStyle: false, calculatorAllowed: false,
    questionText: "Write 0.375 as a fraction in its simplest form.",
    finalAnswer: "3/8", solutionSteps: "0.375 = 375/1000 = 3/8",
    hints: ["Write as a fraction over 1000 first.", "375/1000 — simplify by dividing by 125.", "M1: 375/1000. A1: 3/8."],
  },
  {
    id: "n-fdp-03-q02", objectiveId: "n-fdp-03", tier: "Foundation", difficulty: "Medium",
    questionType: "word_problem", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "After a 20% pay rise, Tom earns £24 000 per year. What was his salary before the rise?",
    finalAnswer: "20000", solutionSteps: "120% = 24000, so 100% = 24000 ÷ 1.2 = £20 000",
    hints: ["£24 000 represents 120% of the original salary.", "Divide by 1.2 to find 100%.", "M1: identifies 120%. M1: ÷1.2. A1: £20 000."],
  },
  {
    id: "n-fdp-03-q03", objectiveId: "n-fdp-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A population increases by 5% each year. It is now 21 000. What was it 2 years ago?",
    finalAnswer: "19048", solutionSteps: "After 2 rises: P × 1.05² = 21000, P = 21000/1.1025 ≈ 19048",
    hints: ["Two successive 5% increases multiply by 1.05 twice.", "Divide 21 000 by 1.05².", "M1: 1.05². M1: divide. A1: 19 048 (accept 19 047–19 049)."],
  },
  {
    id: "n-ma-01-q02", objectiveId: "n-ma-01", tier: "Foundation", difficulty: "Medium",
    questionType: "conversion", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "Write 4 500 000 in standard form.",
    finalAnswer: "4.5×10^6", solutionSteps: "4 500 000 = 4.5 × 10⁶",
    hints: ["Move the decimal point so one digit is before it.", "4.5 — how many places did you move?", "M1: 4.5. A1: ×10⁶."],
  },
  {
    id: "n-ma-01-q03", objectiveId: "n-ma-01", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Work out (3 × 10⁴) × (2 × 10⁻³). Give your answer in standard form.",
    finalAnswer: "6×10^1", solutionSteps: "3×2 = 6, 10⁴ × 10⁻³ = 10¹, answer 6 × 10¹ = 60",
    hints: ["Multiply the numbers and the powers of 10 separately.", "10⁴ × 10⁻³ = 10¹.", "M1: 6. M1: 10¹. A1: 6×10¹ or 60."],
  },
  {
    id: "n-ma-02-q02", objectiveId: "n-ma-02", tier: "Foundation", difficulty: "Easy",
    questionType: "estimation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Round 4.683 to 2 decimal places.",
    finalAnswer: "4.68", solutionSteps: "Third decimal is 3 < 5, so 4.68",
    hints: ["Look at the third decimal place.", "3 is less than 5, so do not round up.", "M1: identifies 3rd dp. A1: 4.68."],
  },
  {
    id: "n-ma-02-q03", objectiveId: "n-ma-02", tier: "Foundation", difficulty: "Medium",
    questionType: "estimation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Estimate the value of (49.8 × 6.1) ÷ 2.9",
    finalAnswer: "100", solutionSteps: "≈ (50 × 6) ÷ 3 = 300 ÷ 3 = 100",
    hints: ["Round each number to 1 significant figure.", "50 × 6 = 300, then divide by 3.", "M1: rounds. M1: calculates. A1: 100."],
  },
  {
    id: "n-ma-03-q01", objectiveId: "n-ma-03", tier: "Higher", difficulty: "Medium",
    questionType: "reasoning", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A rod has length 15 cm correct to the nearest cm. Write the error interval for the length.",
    finalAnswer: "14.5≤l<15.5", solutionSteps: "Lower bound 14.5 cm, upper bound 15.5 cm",
    hints: ["±0.5 cm from the rounded value.", "Lower bound is 0.5 below, upper is 0.5 below next integer.", "M1: 14.5. M1: 15.5. A1: 14.5 ≤ l < 15.5."],
  },
  {
    id: "n-ma-03-q02", objectiveId: "n-ma-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "a = 5.2 to 1 dp and b = 3.1 to 1 dp. Work out the upper bound of a − b.",
    finalAnswer: "2.20", solutionSteps: "Upper a = 5.25, lower b = 3.05. Upper bound of a−b = 5.25 − 3.05 = 2.20",
    hints: ["Upper bound of a difference uses upper a and lower b.", "a: 5.15–5.25, b: 3.05–3.15.", "M1: bounds. M1: subtract. A1: 2.20."],
  },
  {
    id: "n-ma-03-q03", objectiveId: "n-ma-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "A rectangle has width 4 cm (to nearest cm) and length 7 cm (to nearest cm). Work out the lower bound of its area.",
    finalAnswer: "22.75", solutionSteps: "LB width = 3.5, LB length = 6.5. Min area = 3.5 × 6.5 = 22.75 cm²",
    hints: ["Use lower bound of each measurement.", "Width: 3.5 to 4.5, length: 6.5 to 7.5.", "M1: 3.5 and 6.5. M1: multiply. A1: 22.75 cm²."],
  },

  // ── Algebra (25) ─────────────────────────────────────────
  {
    id: "a-nm-01-q02", objectiveId: "a-nm-01", tier: "Foundation", difficulty: "Easy",
    questionType: "calculation", marks: 2, examStyle: false, calculatorAllowed: false,
    questionText: "If x = 4, work out the value of 3x² − 5",
    finalAnswer: "43", solutionSteps: "3(4)² − 5 = 3(16) − 5 = 48 − 5 = 43",
    hints: ["Substitute x = 4 into the expression.", "Work out 4² first, then multiply by 3.", "M1: 48. A1: 43."],
  },
  {
    id: "a-nm-01-q03", objectiveId: "a-nm-01", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Write an expression for the perimeter of a rectangle with width w and length 2w + 3.",
    finalAnswer: "6w+6", solutionSteps: "P = 2(w + 2w + 3) = 2(3w + 3) = 6w + 6",
    hints: ["Perimeter = 2 × (width + length).", "Sum of sides: w + (2w + 3).", "M1: 2(3w+3). A1: 6w + 6."],
  },
  {
    id: "a-nm-02-q03", objectiveId: "a-nm-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Expand and simplify 3(2x − 4) + 5x",
    finalAnswer: "11x-12", solutionSteps: "6x − 12 + 5x = 11x − 12",
    hints: ["Expand the bracket first.", "3×2x = 6x and 3×(−4) = −12.", "M1: 6x−12. A1: 11x − 12."],
  },
  {
    id: "a-nm-03-q02", objectiveId: "a-nm-03", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Factorise fully 6x + 15",
    finalAnswer: "3(2x+5)", solutionSteps: "HCF is 3: 3(2x + 5)",
    hints: ["Find the highest common factor of 6 and 15.", "The HCF is 3.", "M1: factor 3. A1: 3(2x + 5)."],
  },
  {
    id: "a-nm-03-q03", objectiveId: "a-nm-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Factorise x² + 7x + 12",
    finalAnswer: "(x+3)(x+4)", solutionSteps: "Find two numbers that multiply to 12 and add to 7: 3 and 4",
    hints: ["You need two numbers that multiply to 12.", "They must also add to 7.", "M1: identifies 3,4. A1: (x+3)(x+4)."],
  },
  {
    id: "a-nm-04-q01", objectiveId: "a-nm-04", tier: "Higher", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Simplify (x² − 9)/(x + 3)",
    finalAnswer: "x-3", solutionSteps: "x² − 9 = (x+3)(x−3), so (x+3)(x−3)/(x+3) = x − 3",
    hints: ["Factorise the numerator — difference of two squares.", "x² − 9 = (x+3)(x−3).", "M1: factorise. M1: cancel. A1: x − 3."],
  },
  {
    id: "a-nm-04-q02", objectiveId: "a-nm-04", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Simplify (2x)/(3) + (x)/(6)",
    finalAnswer: "5x/6", solutionSteps: "4x/6 + x/6 = 5x/6",
    hints: ["Use a common denominator of 6.", "2x/3 = 4x/6.", "M1: common denominator. M1: add. A1: 5x/6."],
  },
  {
    id: "a-nm-04-q03", objectiveId: "a-nm-04", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: false,
    questionText: "Simplify (x² − 4x)/(x² − 16)",
    finalAnswer: "x/(x+4)", solutionSteps: "x(x−4)/((x+4)(x−4)) = x/(x+4)",
    hints: ["Factorise numerator and denominator.", "Numerator: x(x−4). Denominator: (x+4)(x−4).", "M1: factorise num. M1: factorise den. A1: x/(x+4)."],
  },
  {
    id: "a-gr-01-q02", objectiveId: "a-gr-01", tier: "Foundation", difficulty: "Medium",
    questionType: "graph", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "The graph of y = 2x − 1 passes through (0, c). What is c?",
    finalAnswer: "-1", solutionSteps: "When x = 0, y = 2(0) − 1 = −1, so c = −1",
    hints: ["c is the y-intercept.", "Substitute x = 0 into y = 2x − 1.", "M1: substitutes. A1: c = −1."],
  },
  {
    id: "a-gr-01-q03", objectiveId: "a-gr-01", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "A line has gradient 3. Which table shows a relationship with gradient 3? (A) x:1,2,3 y:4,5,6  (B) x:1,2,3 y:3,6,9",
    finalAnswer: "B", solutionSteps: "B: change in y / change in x = 6/2 = 3. A: gradient = 1.",
    hints: ["Gradient = change in y ÷ change in x.", "Check each table using two points.", "M1: calculates gradient. A1: B."],
  },
  {
    id: "a-gr-02-q02", objectiveId: "a-gr-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Find the equation of the line passing through (0, 2) and (3, 8).",
    finalAnswer: "y=2x+2", solutionSteps: "Gradient = (8−2)/(3−0) = 2. y-intercept = 2. y = 2x + 2",
    hints: ["Find gradient first, then y-intercept.", "m = (8−2)/(3−0).", "M1: m=2. M1: c=2. A1: y=2x+2."],
  },
  {
    id: "a-gr-02-q03", objectiveId: "a-gr-02", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A line passes through (2, 5) and (6, 13). Find its equation in the form y = mx + c.",
    finalAnswer: "y=2x+1", solutionSteps: "m = (13−5)/(6−2) = 2. 5 = 2(2) + c → c = 1. y = 2x + 1",
    hints: ["Gradient m = rise over run.", "Substitute one point to find c.", "M1: m=2. M1: finds c. A1: y=2x+1."],
  },
  {
    id: "a-gr-03-q01", objectiveId: "a-gr-03", tier: "Higher", difficulty: "Medium",
    questionType: "graph", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "The graph of y = x² − 4 crosses the x-axis at two points. Write the x-coordinates.",
    finalAnswer: "-2,2", solutionSteps: "x² − 4 = 0, (x+2)(x−2) = 0, x = −2 or 2",
    hints: ["Set y = 0 and solve.", "This is a difference of two squares.", "M1: factorise. A1: x = −2, 2."],
  },
  {
    id: "a-gr-03-q02", objectiveId: "a-gr-03", tier: "Higher", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "Which shape describes the graph y = 1/x?",
    finalAnswer: "reciprocal", solutionSteps: "y = 1/x is a reciprocal graph (hyperbola)",
    hints: ["Think about what happens as x gets very large.", "It is not a straight line or parabola.", "B1: reciprocal (hyperbola)."],
  },
  {
    id: "a-gr-03-q03", objectiveId: "a-gr-03", tier: "Higher", difficulty: "Hard",
    questionType: "reasoning", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "y = x³ passes through (2, 8). What is the y-coordinate when x = −2?",
    finalAnswer: "-8", solutionSteps: "(−2)³ = −8",
    hints: ["Substitute x = −2 into y = x³.", "A negative number cubed is negative.", "M1: (−2)³. A1: −8."],
  },
  {
    id: "a-ei-01-q03", objectiveId: "a-ei-01", tier: "Foundation", difficulty: "Medium",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Solve 5x − 3 = 2x + 9",
    finalAnswer: "4", solutionSteps: "5x − 2x = 9 + 3, 3x = 12, x = 4",
    hints: ["Collect x terms on one side, numbers on the other.", "3x = 12.", "M1: collects terms. M1: 3x=12. A1: x=4."],
  },
  {
    id: "a-ei-02-q01", objectiveId: "a-ei-02", tier: "Higher", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Solve x² − 5x + 6 = 0",
    finalAnswer: "2,3", solutionSteps: "(x−2)(x−3) = 0, x = 2 or x = 3",
    hints: ["Try to factorise the quadratic.", "Two numbers multiply to 6 and add to −5.", "M1: factorise. A1: x=2,3."],
  },
  {
    id: "a-ei-02-q02", objectiveId: "a-ei-02", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "Solve x² − 6x + 2 = 0. Give answers correct to 2 decimal places.",
    finalAnswer: "0.54,5.46", solutionSteps: "x = (6 ± √(36−8))/2 = (6 ± √28)/2 ≈ 0.54, 5.46",
    hints: ["Use the quadratic formula.", "a=1, b=−6, c=2.", "M1: formula. M1: √28. A1: 0.54 and 5.46."],
  },
  {
    id: "a-ei-02-q03", objectiveId: "a-ei-02", tier: "Higher", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Solve x² = 49",
    finalAnswer: "-7,7", solutionSteps: "x = ±√49 = ±7",
    hints: ["Take the square root of both sides.", "Remember both positive and negative roots.", "M1: √49. A1: x = −7, 7."],
  },
  {
    id: "a-ei-03-q02", objectiveId: "a-ei-03", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Solve simultaneously: y = 2x + 1 and y = 7 − x",
    finalAnswer: "x=2,y=5", solutionSteps: "2x + 1 = 7 − x, 3x = 6, x = 2, y = 5",
    hints: ["Set the two expressions for y equal.", "2x + 1 = 7 − x.", "M1: equates. M1: x=2. A1: y=5."],
  },
  {
    id: "a-ei-03-q03", objectiveId: "a-ei-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: false,
    questionText: "Solve: x + y = 10 and x² + y² = 58",
    finalAnswer: "x=3,y=7", solutionSteps: "y = 10−x. x²+(10−x)²=58 → 2x²−20x+42=0 → x²−10x+21=0 → (x−3)(x−7)=0. Pairs: (3,7) and (7,3)",
    hints: ["Substitute y = 10 − x into the second equation.", "Expand and simplify to a quadratic in x.", "M1: substitutes. M1: quadratic. A1: (3,7) and (7,3)."],
  },
  {
    id: "a-ei-04-q01", objectiveId: "a-ei-04", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Solve 3x + 4 < 16",
    finalAnswer: "x<4", solutionSteps: "3x < 12, x < 4",
    hints: ["Treat like an equation but keep the inequality sign.", "Subtract 4, then divide by 3.", "M1: 3x<12. A1: x<4."],
  },
  {
    id: "a-ei-04-q02", objectiveId: "a-ei-04", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Solve −2x + 6 ≥ 0",
    finalAnswer: "x≤3", solutionSteps: "−2x ≥ −6, x ≤ 3 (inequality flips when dividing by negative)",
    hints: ["Isolate x.", "When dividing by −2, reverse the inequality.", "M1: −2x≥−6. M1: flip sign. A1: x≤3."],
  },
  {
    id: "a-ei-04-q03", objectiveId: "a-ei-04", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Write the integer values of x that satisfy 1 ≤ 2x − 3 < 7",
    finalAnswer: "2,3,4", solutionSteps: "Add 3: 4 ≤ 2x < 10. Divide by 2: 2 ≤ x < 5. Integers: 2, 3, 4",
    hints: ["Solve the double inequality in two steps.", "Add 3 throughout, then divide by 2.", "M1: 2≤x<5. A1: 2, 3, 4."],
  },
  {
    id: "a-sq-01-q02", objectiveId: "a-sq-01", tier: "Foundation", difficulty: "Easy",
    questionType: "calculation", marks: 2, examStyle: false, calculatorAllowed: false,
    questionText: "The nth term of a sequence is 3n + 1. Write the first 4 terms.",
    finalAnswer: "4,7,10,13", solutionSteps: "n=1→4, n=2→7, n=3→10, n=4→13",
    hints: ["Substitute n = 1, 2, 3, 4.", "3(1)+1 = 4 for the first term.", "M1: first two terms. A1: 4,7,10,13."],
  },
  {
    id: "a-sq-01-q03", objectiveId: "a-sq-01", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "A sequence starts 5, 8, 11, 14, … Write the term-to-term rule.",
    finalAnswer: "add 3", solutionSteps: "Each term increases by 3",
    hints: ["Find the difference between consecutive terms.", "8 − 5 = 3.", "B1: add 3 (or +3)."],
  },
  {
    id: "a-sq-02-q02", objectiveId: "a-sq-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Find the nth term of the sequence 7, 10, 13, 16, …",
    finalAnswer: "3n+4", solutionSteps: "Common difference 3, nth term = 3n + 4",
    hints: ["Find the common difference.", "Compare with 3n: when n=1, 3(1)=3 but first term is 7.", "M1: d=3. M1: offset. A1: 3n+4."],
  },
  {
    id: "a-sq-02-q03", objectiveId: "a-sq-02", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: false,
    questionText: "The nth term of a sequence is n² + 1. Which term has value 50?",
    finalAnswer: "7", solutionSteps: "n² + 1 = 50, n² = 49, n = 7",
    hints: ["Set n² + 1 = 50.", "Solve n² = 49.", "M1: n²=49. A1: n=7."],
  },

  // ── Ratio (12) ─────────────────────────────────────────────
  {
    id: "r-rp-01-q02", objectiveId: "r-rp-01", tier: "Foundation", difficulty: "Easy",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Simplify the ratio 18 : 24",
    finalAnswer: "3:4", solutionSteps: "HCF 6: 18/6 : 24/6 = 3 : 4",
    hints: ["Find the HCF of 18 and 24.", "Divide both parts by 6.", "M1: HCF. A1: 3:4."],
  },
  {
    id: "r-rp-01-q03", objectiveId: "r-rp-01", tier: "Foundation", difficulty: "Medium",
    questionType: "word_problem", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Share £120 in the ratio 2 : 3 : 5",
    finalAnswer: "24,36,60", solutionSteps: "Total parts = 10. £12 per part. Shares: £24, £36, £60",
    hints: ["Add the ratio parts: 2+3+5.", "Divide £120 by total parts.", "M1: 10 parts. M1: £12 each. A1: 24,36,60."],
  },
  {
    id: "r-rp-02-q02", objectiveId: "r-rp-02", tier: "Foundation", difficulty: "Medium",
    questionType: "word_problem", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "y is directly proportional to x. When x = 4, y = 20. Find y when x = 7.",
    finalAnswer: "35", solutionSteps: "y = kx, 20 = 4k, k = 5. y = 5(7) = 35",
    hints: ["Direct proportion: y = kx.", "Find k using x=4, y=20.", "M1: k=5. M1: substitute. A1: 35."],
  },
  {
    id: "r-rp-02-q03", objectiveId: "r-rp-02", tier: "Higher", difficulty: "Hard",
    questionType: "word_problem", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "y is inversely proportional to x. When x = 5, y = 8. Find y when x = 10.",
    finalAnswer: "4", solutionSteps: "y = k/x, 8 = k/5, k = 40. y = 40/10 = 4",
    hints: ["Inverse proportion: y = k/x.", "k = xy = 5 × 8 = 40.", "M1: k=40. M1: substitute. A1: 4."],
  },
  {
    id: "r-rp-03-q02", objectiveId: "r-rp-03", tier: "Foundation", difficulty: "Medium",
    questionType: "word_problem", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A car travels 180 miles in 3 hours. Work out its average speed in mph.",
    finalAnswer: "60", solutionSteps: "Speed = distance ÷ time = 180 ÷ 3 = 60 mph",
    hints: ["Use speed = distance ÷ time.", "180 ÷ 3.", "M1: formula. M1: divides. A1: 60 mph."],
  },
  {
    id: "r-rp-03-q03", objectiveId: "r-rp-03", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A block has mass 240 g and volume 30 cm³. Work out its density in g/cm³.",
    finalAnswer: "8", solutionSteps: "Density = mass ÷ volume = 240 ÷ 30 = 8 g/cm³",
    hints: ["Density = mass ÷ volume.", "240 ÷ 30.", "M1: formula. M1: divides. A1: 8."],
  },
  {
    id: "r-roc-01-q01", objectiveId: "r-roc-01", tier: "Foundation", difficulty: "Medium",
    questionType: "graph", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "A distance-time graph shows a straight line from (0,0) to (2, 100). What is the speed?",
    finalAnswer: "50", solutionSteps: "Speed = gradient = 100/2 = 50 units per hour",
    hints: ["Speed equals the gradient on a distance-time graph.", "Gradient = rise ÷ run.", "M1: 100/2. A1: 50."],
  },
  {
    id: "r-roc-01-q02", objectiveId: "r-roc-01", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "A line has equation d = 30t. What does 30 represent?",
    finalAnswer: "speed", solutionSteps: "30 is the gradient = speed (distance per unit time)",
    hints: ["d = 30t is like y = mx.", "The coefficient of t is the rate of change.", "B1: speed (30 units of distance per unit time)."],
  },
  {
    id: "r-roc-01-q03", objectiveId: "r-roc-01", tier: "Higher", difficulty: "Hard",
    questionType: "graph", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "On a velocity-time graph, a line goes from (0, 0) to (5, 20). Work out the acceleration.",
    finalAnswer: "4", solutionSteps: "Acceleration = gradient = 20/5 = 4 m/s²",
    hints: ["Acceleration is the gradient on a velocity-time graph.", "20 ÷ 5.", "M1: gradient. A1: 4 m/s²."],
  },
  {
    id: "r-roc-02-q01", objectiveId: "r-roc-02", tier: "Higher", difficulty: "Hard",
    questionType: "estimation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Estimate the gradient of the curve y = x² at x = 3 by using the points (2.9, 8.41) and (3.1, 9.61).",
    finalAnswer: "6", solutionSteps: "Gradient ≈ (9.61 − 8.41)/(3.1 − 2.9) = 1.2/0.2 = 6",
    hints: ["Use gradient = (y₂−y₁)/(x₂−x₁) with points close to x=3.", "Difference in y over difference in x.", "M1: sets up fraction. M1: calculates. A1: 6."],
  },
  {
    id: "r-roc-02-q02", objectiveId: "r-roc-02", tier: "Higher", difficulty: "Hard",
    questionType: "estimation", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "A velocity-time graph shows velocity increasing linearly from 0 to 12 m/s in 6 s. Estimate the distance travelled.",
    finalAnswer: "36", solutionSteps: "Area under graph = ½ × base × height = ½ × 6 × 12 = 36 m",
    hints: ["Distance = area under a velocity-time graph.", "The shape is a triangle.", "M1: identifies triangle. M1: area formula. A1: 36 m."],
  },
  {
    id: "r-roc-02-q03", objectiveId: "r-roc-02", tier: "Higher", difficulty: "Medium",
    questionType: "graph", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "On a distance-time graph, what does a horizontal section indicate?",
    finalAnswer: "stationary", solutionSteps: "Zero gradient means distance not changing — object is stationary",
    hints: ["Horizontal means no change in the y-value.", "Distance is not changing over time.", "B1: stationary / at rest / not moving."],
  },

  // ── Geometry (25) ──────────────────────────────────────────
  {
    id: "g-pc-01-q02", objectiveId: "g-pc-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Two angles on a straight line are (3x + 10)° and (2x + 30)°. Find x.",
    finalAnswer: "28", solutionSteps: "3x+10+2x+30=180, 5x=140, x=28",
    hints: ["Angles on a straight line sum to 180°.", "5x + 40 = 180.", "M1: equation. A1: x=28."],
  },
  {
    id: "g-pc-01-q03", objectiveId: "g-pc-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "In a triangle, two angles are 52° and 71°. Find the third angle.",
    finalAnswer: "57", solutionSteps: "180 − 52 − 71 = 57°",
    hints: ["Angles in a triangle sum to 180°.", "Subtract both angles from 180.", "M1: 180−123. A1: 57°."],
  },
  {
    id: "g-pc-02-q01", objectiveId: "g-pc-02", tier: "Higher", difficulty: "Medium",
    questionType: "reasoning", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "AB is a diameter of a circle. C is a point on the circle. Angle ACB = ?°",
    finalAnswer: "90", solutionSteps: "Angle in a semicircle is 90°",
    hints: ["This uses the angle in a semicircle theorem.", "A diameter subtends a right angle.", "B1: 90°."],
  },
  {
    id: "g-pc-02-q02", objectiveId: "g-pc-02", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Tangent meets radius at point of contact. The angle between tangent and a chord is 38°. Find the angle in the alternate segment.",
    finalAnswer: "38", solutionSteps: "Alternate segment theorem: angle between tangent and chord equals angle in alternate segment",
    hints: ["Use the alternate segment theorem.", "The angle in the alternate segment equals the angle between tangent and chord.", "M1: identifies theorem. A1: 38°."],
  },
  {
    id: "g-pc-02-q03", objectiveId: "g-pc-02", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 4, examStyle: true, calculatorAllowed: false,
    questionText: "In a circle, angle at centre is 110°. Find the angle at the circumference standing on the same arc.",
    finalAnswer: "55", solutionSteps: "Angle at centre = 2 × angle at circumference. 110/2 = 55°",
    hints: ["Angle at centre is twice angle at circumference.", "Divide 110 by 2.", "M1: theorem. A1: 55°."],
  },
  {
    id: "g-pc-03-q01", objectiveId: "g-pc-03", tier: "Foundation", difficulty: "Medium",
    questionType: "construction", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Describe how to construct the perpendicular bisector of a line segment AB.",
    finalAnswer: "arcs from A and B", solutionSteps: "Draw arcs of equal radius from A and B above and below the line; join the intersection points",
    hints: ["You need compasses.", "Arcs from both endpoints with equal radius.", "M1: arcs from A and B. A1: join intersections."],
  },
  {
    id: "g-pc-03-q02", objectiveId: "g-pc-03", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "A locus of points equidistant from A and B is a ___?",
    finalAnswer: "perpendicular bisector", solutionSteps: "Points equidistant from A and B lie on the perpendicular bisector of AB",
    hints: ["Equidistant means equal distance from both points.", "This is a standard locus result.", "B1: perpendicular bisector of AB."],
  },
  {
    id: "g-pc-03-q03", objectiveId: "g-pc-03", tier: "Higher", difficulty: "Hard",
    questionType: "construction", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Describe the locus of points 3 cm from a fixed point P.",
    finalAnswer: "circle radius 3", solutionSteps: "A circle with centre P and radius 3 cm",
    hints: ["Fixed distance from a point.", "All points at distance 3 cm form a circle.", "B1: circle, centre P, radius 3 cm."],
  },
  {
    id: "g-me-01-q02", objectiveId: "g-me-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "A triangle has base 12 cm and height 5 cm. Find its area.",
    finalAnswer: "30", solutionSteps: "Area = ½ × 12 × 5 = 30 cm²",
    hints: ["Area of triangle = ½ × base × height.", "½ × 12 × 5.", "M1: formula. A1: 30 cm²."],
  },
  {
    id: "g-me-01-q03", objectiveId: "g-me-01", tier: "Foundation", difficulty: "Medium",
    questionType: "word_problem", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A parallelogram has base 8 cm and perpendicular height 6 cm. Find its area.",
    finalAnswer: "48", solutionSteps: "Area = base × height = 8 × 6 = 48 cm²",
    hints: ["Area of parallelogram = base × perpendicular height.", "8 × 6.", "M1: formula. A1: 48 cm²."],
  },
  {
    id: "g-me-02-q02", objectiveId: "g-me-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A cuboid is 4 cm by 5 cm by 6 cm. Find its volume.",
    finalAnswer: "120", solutionSteps: "V = 4 × 5 × 6 = 120 cm³",
    hints: ["Volume = length × width × height.", "Multiply all three dimensions.", "M1: multiplies. A1: 120 cm³."],
  },
  {
    id: "g-me-02-q03", objectiveId: "g-me-02", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "A cylinder has radius 3 cm and height 10 cm. Work out its volume. Give your answer in terms of π.",
    finalAnswer: "90π", solutionSteps: "V = πr²h = π × 9 × 10 = 90π cm³",
    hints: ["Use V = πr²h.", "r = 3, so r² = 9.", "M1: πr². M1: ×10. A1: 90π cm³."],
  },
  {
    id: "g-me-03-q01", objectiveId: "g-me-03", tier: "Higher", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A sector has radius 6 cm and angle 60°. Work out the arc length. Give your answer in terms of π.",
    finalAnswer: "2π", solutionSteps: "Arc = (60/360) × 2π × 6 = (1/6) × 12π = 2π cm",
    hints: ["Arc length = (θ/360) × 2πr.", "θ = 60, r = 6.", "M1: formula. M1: substitutes. A1: 2π cm."],
  },
  {
    id: "g-me-03-q02", objectiveId: "g-me-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "A sector has radius 10 cm and angle 90°. Find the area of the sector. Give your answer in terms of π.",
    finalAnswer: "25π", solutionSteps: "Area = (90/360) × π × 100 = ¼ × 100π = 25π cm²",
    hints: ["Sector area = (θ/360) × πr².", "r² = 100, θ/360 = 1/4.", "M1: πr². M1: ×90/360. A1: 25π cm²."],
  },
  {
    id: "g-me-03-q03", objectiveId: "g-me-03", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "An arc has length 5π cm and radius 10 cm. Find the angle of the sector in degrees.",
    finalAnswer: "90", solutionSteps: "5π = (θ/360) × 2π × 10, 5 = (θ/360) × 20, θ = 90°",
    hints: ["Use arc length formula and solve for θ.", "Divide both sides by 2π × 10.", "M1: sets up equation. M1: solves. A1: 90°."],
  },
  {
    id: "g-pt-01-q02", objectiveId: "g-pt-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A right-angled triangle has legs 5 cm and 12 cm. Find the hypotenuse.",
    finalAnswer: "13", solutionSteps: "c² = 5² + 12² = 25 + 144 = 169, c = 13",
    hints: ["Use a² + b² = c².", "5² + 12² = 169.", "M1: 169. A1: 13 cm."],
  },
  {
    id: "g-pt-01-q03", objectiveId: "g-pt-01", tier: "Higher", difficulty: "Hard",
    questionType: "word_problem", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "A ladder 5 m long leans against a wall. The base is 1.5 m from the wall. How high up the wall does it reach?",
    finalAnswer: "4.77", solutionSteps: "h² = 5² − 1.5² = 25 − 2.25 = 22.75, h ≈ 4.77 m",
    hints: ["The ladder is the hypotenuse.", "h² = 5² − 1.5².", "M1: 22.75. A1: 4.77 m (3 sf)."],
  },
  {
    id: "g-pt-02-q02", objectiveId: "g-pt-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "In a right triangle, the opposite side is 8 cm and the hypotenuse is 10 cm. Find sin θ.",
    finalAnswer: "0.8", solutionSteps: "sin θ = opposite/hypotenuse = 8/10 = 0.8",
    hints: ["sin θ = opposite ÷ hypotenuse.", "8/10.", "M1: identifies sides. A1: 0.8."],
  },
  {
    id: "g-pt-02-q03", objectiveId: "g-pt-02", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Find the exact value of sin 30° + cos 60°",
    finalAnswer: "1", solutionSteps: "sin 30° = ½, cos 60° = ½, sum = 1",
    hints: ["Recall exact trig values.", "Both sin 30° and cos 60° equal ½.", "M1: ½+½. A1: 1."],
  },
  {
    id: "g-pt-03-q01", objectiveId: "g-pt-03", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "In triangle ABC, a = 7 cm, b = 9 cm, C = 120°. Find side c correct to 1 decimal place.",
    finalAnswer: "13.9", solutionSteps: "c² = 7² + 9² − 2(7)(9)cos120° = 49+81+63 = 193, c = √193 ≈ 13.9 cm",
    hints: ["Use cosine rule: c² = a²+b²−2ab cos C.", "cos 120° = −0.5.", "M1: substitutes. M1: calculates. A1: 13.9 cm."],
  },
  {
    id: "g-pt-03-q02", objectiveId: "g-pt-03", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "In triangle PQR, p = 10 cm, q = 8 cm, P = 40°. Find angle Q correct to 1 decimal place.",
    finalAnswer: "30.9", solutionSteps: "sin Q / 8 = sin 40° / 10, sin Q = 0.514, Q ≈ 30.9°",
    hints: ["Use sine rule: sin Q / q = sin P / p.", "sin Q = 8 sin 40° / 10.", "M1: sine rule. M1: calculates. A1: 30.9°."],
  },
  {
    id: "g-pt-03-q03", objectiveId: "g-pt-03", tier: "Higher", difficulty: "Hard",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Find the area of a triangle with sides 6 cm and 8 cm and included angle 30°.",
    finalAnswer: "12", solutionSteps: "Area = ½ × 6 × 8 × sin 30° = ½ × 48 × 0.5 = 12 cm²",
    hints: ["Use Area = ½ab sin C.", "sin 30° = 0.5.", "M1: formula. M1: substitutes. A1: 12 cm²."],
  },
  {
    id: "g-ve-01-q01", objectiveId: "g-ve-01", tier: "Higher", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "a = (3, 4) and b = (1, −2). Find a + b.",
    finalAnswer: "(4,2)", solutionSteps: "(3+1, 4+(−2)) = (4, 2)",
    hints: ["Add corresponding components.", "3+1 and 4+(−2).", "M1: adds x. A1: (4, 2)."],
  },
  {
    id: "g-ve-01-q02", objectiveId: "g-ve-01", tier: "Higher", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "Find 3 × (2, −1)",
    finalAnswer: "(6,-3)", solutionSteps: "3(2, −1) = (6, −3)",
    hints: ["Multiply each component by 3.", "3×2 and 3×(−1).", "M1: multiplies. A1: (6, −3)."],
  },
  {
    id: "g-ve-01-q03", objectiveId: "g-ve-01", tier: "Higher", difficulty: "Hard",
    questionType: "reasoning", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Points A(1, 2) and B(4, 6). Write the vector AB.",
    finalAnswer: "(3,4)", solutionSteps: "AB = (4−1, 6−2) = (3, 4)",
    hints: ["Vector AB = B − A.", "Subtract coordinates.", "M1: subtracts x. M1: subtracts y. A1: (3, 4)."],
  },

  // ── Probability & Statistics (18) ──────────────────────────
  {
    id: "p-se-01-q02", objectiveId: "p-se-01", tier: "Foundation", difficulty: "Easy",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "A fair dice is rolled. What is the probability of getting an even number?",
    finalAnswer: "1/2", solutionSteps: "Even numbers: 2, 4, 6. P = 3/6 = 1/2",
    hints: ["List the even outcomes.", "There are 3 even numbers out of 6.", "M1: 3/6. A1: 1/2."],
  },
  {
    id: "p-se-01-q03", objectiveId: "p-se-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "A bag has 5 red and 3 blue counters. Find P(red).",
    finalAnswer: "5/8", solutionSteps: "P(red) = 5/8",
    hints: ["Probability = favourable / total.", "Total counters = 8.", "M1: 5/8. A1: 5/8."],
  },
  {
    id: "p-se-02-q02", objectiveId: "p-se-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: false,
    questionText: "P(A) = 0.3 and P(B) = 0.45. A and B are mutually exclusive. Find P(A or B).",
    finalAnswer: "0.75", solutionSteps: "P(A or B) = 0.3 + 0.45 = 0.75",
    hints: ["For mutually exclusive events, add the probabilities.", "0.3 + 0.45.", "M1: adds. A1: 0.75."],
  },
  {
    id: "p-se-02-q03", objectiveId: "p-se-02", tier: "Foundation", difficulty: "Medium",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "The probability of rain is 0.35. What is the probability it does not rain?",
    finalAnswer: "0.65", solutionSteps: "P(not rain) = 1 − 0.35 = 0.65",
    hints: ["Probabilities sum to 1.", "1 − 0.35.", "M1: 1−0.35. A1: 0.65."],
  },
  {
    id: "p-ce-01-q02", objectiveId: "p-ce-01", tier: "Foundation", difficulty: "Medium",
    questionType: "multi_step", marks: 3, examStyle: true, calculatorAllowed: false,
    questionText: "Two coins are flipped. List all outcomes and find P(both heads).",
    finalAnswer: "1/4", solutionSteps: "Outcomes: HH, HT, TH, TT. P(HH) = 1/4",
    hints: ["Draw a sample space for two coins.", "Only one outcome is HH out of four.", "M1: sample space. A1: 1/4."],
  },
  {
    id: "p-ce-01-q03", objectiveId: "p-ce-01", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: false,
    questionText: "A bag has 4 red and 6 blue. Two counters drawn without replacement. Find P(both red).",
    finalAnswer: "2/15", solutionSteps: "P = 4/10 × 3/9 = 12/90 = 2/15",
    hints: ["Multiply probabilities for successive draws.", "First red: 4/10, second red: 3/9.", "M1: 4/10. M1: ×3/9. A1: 2/15."],
  },
  {
    id: "p-ce-02-q01", objectiveId: "p-ce-02", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "P(A) = 0.4, P(B) = 0.5, A and B independent. Find P(A and B).",
    finalAnswer: "0.2", solutionSteps: "P(A and B) = 0.4 × 0.5 = 0.2",
    hints: ["For independent events, multiply.", "0.4 × 0.5.", "M1: multiplies. A1: 0.2."],
  },
  {
    id: "p-ce-02-q02", objectiveId: "p-ce-02", tier: "Higher", difficulty: "Hard",
    questionType: "multi_step", marks: 4, examStyle: true, calculatorAllowed: true,
    questionText: "In a class, 60% study French and 40% of those also study German. Find P(French and German).",
    finalAnswer: "0.24", solutionSteps: "P(F∩G) = 0.6 × 0.4 = 0.24",
    hints: ["German given French means multiply.", "0.6 × 0.4.", "M1: identifies conditional. A1: 0.24."],
  },
  {
    id: "p-ce-02-q03", objectiveId: "p-ce-02", tier: "Higher", difficulty: "Hard",
    questionType: "reasoning", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "P(A) = 0.3, P(B|A) = 0.6. Find P(A and B).",
    finalAnswer: "0.18", solutionSteps: "P(A∩B) = P(A) × P(B|A) = 0.3 × 0.6 = 0.18",
    hints: ["Use P(A and B) = P(A) × P(B given A).", "0.3 × 0.6.", "M1: formula. A1: 0.18."],
  },
  {
    id: "s-sd-01-q02", objectiveId: "s-sd-01", tier: "Foundation", difficulty: "Medium",
    questionType: "interpretation", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "A pie chart shows Sport 90°, Art 120°, Music 150°. Which activity is most popular?",
    finalAnswer: "Music", solutionSteps: "150° is the largest sector — Music",
    hints: ["Compare the angles.", "Largest angle = most popular.", "B1: Music."],
  },
  {
    id: "s-sd-01-q03", objectiveId: "s-sd-01", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "80 students chose a subject. The pie chart shows Maths at 90°. How many chose Maths?",
    finalAnswer: "20", solutionSteps: "90/360 × 80 = 20 students",
    hints: ["Fraction of circle = angle/360.", "90/360 of 80.", "M1: 90/360. A1: 20."],
  },
  {
    id: "s-sd-02-q01", objectiveId: "s-sd-02", tier: "Foundation", difficulty: "Medium",
    questionType: "interpretation", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "A scatter graph shows points rising from left to right. Describe the correlation.",
    finalAnswer: "positive", solutionSteps: "As x increases, y increases — positive correlation",
    hints: ["Look at the overall trend.", "Rising pattern means positive.", "B1: positive correlation."],
  },
  {
    id: "s-sd-02-q02", objectiveId: "s-sd-02", tier: "Foundation", difficulty: "Medium",
    questionType: "graph", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "On a scatter graph, points are randomly spread with no pattern. What type of correlation?",
    finalAnswer: "none", solutionSteps: "No pattern indicates no correlation",
    hints: ["No trend up or down.", "Random scatter.", "B1: no correlation / zero correlation."],
  },
  {
    id: "s-sd-02-q03", objectiveId: "s-sd-02", tier: "Higher", difficulty: "Hard",
    questionType: "interpretation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "A line of best fit is y = 2x + 5. Estimate y when x = 7.",
    finalAnswer: "19", solutionSteps: "y = 2(7) + 5 = 19",
    hints: ["Substitute x = 7 into the equation.", "2(7) + 5.", "M1: substitutes. A1: 19."],
  },
  {
    id: "s-da-01-q02", objectiveId: "s-da-01", tier: "Foundation", difficulty: "Easy",
    questionType: "calculation", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "Find the median of: 4, 7, 2, 9, 7",
    finalAnswer: "7", solutionSteps: "Ordered: 2, 4, 7, 7, 9. Median = 7",
    hints: ["Put the numbers in order first.", "The middle value of 5 numbers.", "M1: orders. A1: 7."],
  },
  {
    id: "s-da-01-q03", objectiveId: "s-da-01", tier: "Foundation", difficulty: "Medium",
    questionType: "reasoning", marks: 2, examStyle: true, calculatorAllowed: true,
    questionText: "Data: 2, 3, 3, 100. Which average best represents a typical value and why?",
    finalAnswer: "median", solutionSteps: "100 is an outlier; median (3) is not affected",
    hints: ["Look for outliers.", "The mean would be pulled up by 100.", "M1: identifies outlier. A1: median."],
  },
  {
    id: "s-da-02-q02", objectiveId: "s-da-02", tier: "Foundation", difficulty: "Medium",
    questionType: "calculation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Grouped data: 0–10 (freq 5), 10–20 (freq 15). Estimate the mean using midpoints.",
    finalAnswer: "12.5", solutionSteps: "Midpoints 5 and 15. Σfx = 5×5+15×15 = 250. Total=20. Mean=12.5",
    hints: ["Use class midpoints 5 and 15.", "Σfx ÷ Σf.", "M1: midpoints. A1: 12.5."],
  },
  {
    id: "s-da-02-q03", objectiveId: "s-da-02", tier: "Higher", difficulty: "Hard",
    questionType: "interpretation", marks: 3, examStyle: true, calculatorAllowed: true,
    questionText: "Two classes: Class A mean 65, Class B mean 72. Class B has a larger range. Which class is more consistent?",
    finalAnswer: "A", solutionSteps: "Smaller range means more consistent — Class A",
    hints: ["Consistency relates to spread.", "Lower range = less variation.", "B1: Class A (smaller range)."],
  },
];

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

function main() {
  const existingIds = loadExistingIds();
  const toWrite = FILL_SPECS.filter((s) => !existingIds.has(s.id));

  const conflicts = FILL_SPECS.filter((s) => existingIds.has(s.id));
  if (conflicts.length) {
    console.log(`Skipping ${conflicts.length} already-existing IDs`);
  }

  const questions = toWrite.map(makeQuestion);

  const batches: Record<string, typeof questions> = {
    "number-fill.json": [],
    "algebra-fill.json": [],
    "ratio-fill.json": [],
    "geometry-fill.json": [],
    "probability-statistics-fill.json": [],
  };

  for (const q of questions) {
    const oid = q.objectiveId;
    if (oid.startsWith("n-")) batches["number-fill.json"].push(q);
    else if (oid.startsWith("a-")) batches["algebra-fill.json"].push(q);
    else if (oid.startsWith("r-")) batches["ratio-fill.json"].push(q);
    else if (oid.startsWith("g-")) batches["geometry-fill.json"].push(q);
    else batches["probability-statistics-fill.json"].push(q);
  }

  let total = 0;
  for (const [file, qs] of Object.entries(batches)) {
    if (qs.length === 0) continue;
    const path = join(QUESTIONS_DIR, file);
    writeFileSync(path, JSON.stringify(qs, null, 2) + "\n");
    console.log(`Wrote ${qs.length} questions to ${file}`);
    total += qs.length;
  }

  console.log(`\nTotal new questions: ${total}`);
}

main();
