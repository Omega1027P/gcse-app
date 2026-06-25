import { NextResponse } from "next/server";
import { getPracticeQuestions } from "@/lib/content/questions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topic");
  const questions = getPracticeQuestions(topicId);
  return NextResponse.json({ questions, count: questions.length });
}
