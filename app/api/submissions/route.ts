import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, category, difficulty, aiTools, description, promptBody, authorRole, tips, variables } = body;

  if (!title || !category || !difficulty || !aiTools || !description || !promptBody) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  // 変数定義とヒントを body 末尾に付与（既存DBスキーマを変えずに保持）
  let bodyWithMeta = promptBody;

  if (variables && variables.length > 0) {
    bodyWithMeta += `\n\n---VARIABLES_JSON---\n${JSON.stringify(variables)}`;
  }

  if (tips && tips.trim()) {
    bodyWithMeta += `\n\n---TIPS---\n${tips}`;
  }

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .insert({
      title,
      category,
      difficulty,
      ai_tools: aiTools,
      description,
      body: bodyWithMeta,
      author_role: authorRole ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
