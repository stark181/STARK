import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// ステータス更新（承認 / 却下）
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "無効なステータスです" }, { status: 400 });
  }

  // ステータス更新
  const { data: submission, error } = await supabaseAdmin
    .from("submissions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }

  // 承認時：promptsテーブルにも追加（重複チェック付き）
  if (status === "approved" && submission) {
    const { data: existing } = await supabaseAdmin
      .from("prompts")
      .select("id")
      .eq("submission_id", id)
      .single();

    if (!existing) {
      await supabaseAdmin.from("prompts").insert({
        submission_id: id,
        title: submission.title,
        category: submission.category,
        difficulty: submission.difficulty,
        ai_tools: submission.ai_tools,
        description: submission.description,
        body: submission.body,
        author_role: submission.author_role,
        badges: [],
        tips: [],
        usage_count: 0,
      });
    }
  }

  return NextResponse.json({ success: true });
}
