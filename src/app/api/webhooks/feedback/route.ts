import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.FEEDBACK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { questionId, userId, feedbackType, message } = body as {
    questionId: string;
    userId: string;
    feedbackType: string;
    message: string;
  };

  if (!questionId || !userId || !feedbackType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase
    .from("question_feedback")
    .insert({
      user_id: userId,
      question_id: questionId,
      feedback_type: feedbackType,
      message: message ?? "",
      status: "open",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    feedbackId: data.id,
    task: `Review explanation for question ${questionId}`,
  });
}
