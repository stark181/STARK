import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, category, difficulty, aiTools, description, promptBody, authorRole, tips, variables } = body;

  if (!title || !category || !difficulty || !aiTools || !description || !promptBody) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  // tips を配列に変換（改行区切りの文字列 or 配列どちらも受け付ける）
  const tipsArray: string[] = Array.isArray(tips)
    ? tips
    : typeof tips === "string" && tips.trim()
    ? tips.split("\n").map((t: string) => t.trim()).filter(Boolean)
    : [];

  // 変数データを body 末尾に JSON エンコードして付与（DB カラムなしでも保持）
  const bodyWithVars =
    variables && variables.length > 0
      ? `${promptBody}\n\n---VARIABLES_JSON---\n${JSON.stringify(variables)}`
      : promptBody;

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .insert({
      title,
      category,
      difficulty,
      ai_tools: aiTools,
      description,
      body: bodyWithVars,
      tips: tipsArray,
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
