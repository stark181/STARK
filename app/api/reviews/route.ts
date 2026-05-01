import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// レビュー投稿後にバッジを自動計算してDBプロンプトを更新
async function updateBadgesForPrompt(promptId: string) {
  // 全レビューを取得
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("rating")
    .eq("prompt_id", promptId);

  const count = reviews?.length ?? 0;
  const avgRating =
    count > 0
      ? reviews!.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / count
      : 0;

  // DBプロンプトの現在のバッジを取得（編集部ピックは手動付与なので保持する）
  const { data: prompt } = await supabaseAdmin
    .from("prompts")
    .select("badges")
    .eq("id", promptId)
    .single();

  if (!prompt) return; // JSONプロンプトはDBにないのでスキップ

  const currentBadges: string[] = prompt.badges ?? [];
  const newBadges = new Set(currentBadges);

  // ルールに基づき自動バッジを付与・剥奪
  if (count >= 2) {
    newBadges.add("実績バッジ");
  } else {
    newBadges.delete("実績バッジ");
  }

  if (avgRating >= 4.5) {
    newBadges.add("人気バッジ");
  } else {
    newBadges.delete("人気バッジ");
  }

  await supabaseAdmin
    .from("prompts")
    .update({ badges: Array.from(newBadges) })
    .eq("id", promptId);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { promptId, rating, role, industry, comment, result } = body;

  if (!promptId || !rating || !role || !industry || !result) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .insert({
      prompt_id: promptId,
      rating,
      role,
      industry,
      comment,
      result,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  // バッジ自動計算（エラーがあっても投稿自体は成功扱い）
  await updateBadgesForPrompt(promptId).catch(console.error);

  return NextResponse.json({ success: true, data }, { status: 201 });
}
