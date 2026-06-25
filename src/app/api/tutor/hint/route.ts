import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildHintSystemPrompt } from "@/lib/ai/hint-prompt";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { questionId, hintLevel } = body as {
    questionId: string;
    hintLevel: number;
    studentAnswer?: string;
  };

  if (!questionId || !hintLevel || hintLevel < 1 || hintLevel > 3) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const [questionRes, hintsRes, markRes] = await Promise.all([
    supabase.from("questions").select("*").eq("id", questionId).single(),
    supabase.from("question_hints").select("level, hint_text").eq("question_id", questionId),
    supabase
      .from("mark_scheme_steps")
      .select("mark_code, description")
      .eq("question_id", questionId)
      .order("step_order"),
  ]);

  if (questionRes.error || !questionRes.data) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const q = questionRes.data;
  const hints = hintsRes.data ?? [];
  const markScheme = markRes.data ?? [];

  const approvedHint = hints.find((h) => h.level === hintLevel);
  if (approvedHint) {
    return NextResponse.json({
      hint: approvedHint.hint_text,
      message: approvedHint.hint_text,
      level: hintLevel,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: `Hint ${hintLevel}: Break the problem into smaller steps. What information does the question give you?`,
      level: hintLevel,
      fallback: true,
    });
  }

  const systemPrompt = buildHintSystemPrompt({
    questionText: q.question_text,
    hintLevel,
    hints,
    markScheme,
  });

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: body.studentAnswer
              ? `My attempt so far: ${body.studentAnswer}`
              : "I need a hint.",
          },
        ],
        max_tokens: 300,
      }),
    });

    const aiData = await aiRes.json();
    const message =
      aiData.choices?.[0]?.message?.content ??
      "Focus on what the question is asking before calculating.";

    return NextResponse.json({ message, level: hintLevel });
  } catch {
    return NextResponse.json({
      message: "Think about the method before the final answer.",
      level: hintLevel,
      fallback: true,
    });
  }
}
