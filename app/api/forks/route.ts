import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { originalPromptId, title, diffSummary, promptBody, authorRole } = body;

  if (!originalPromptId || !title || !diffSummary || !promptBody || !authorRole) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("forks")
    .insert({
      original_prompt_id: originalPromptId,
      title,
      diff_summary: diffSummary,
      body: promptBody,
      author_role: authorRole,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
