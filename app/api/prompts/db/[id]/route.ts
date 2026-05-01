import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// 単一プロンプトを取得
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ prompt: data });
}

// バッジ・その他フィールド更新
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // 許可するフィールドのみ抽出
  const updates: Record<string, unknown> = {};
  if (body.badges !== undefined) updates.badges = body.badges;
  if (body.tips !== undefined) updates.tips = body.tips;
  if (body.usage_count !== undefined) updates.usage_count = body.usage_count;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "更新項目がありません" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("prompts")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
