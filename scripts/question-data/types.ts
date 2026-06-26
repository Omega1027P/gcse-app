export interface QSpec {
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
