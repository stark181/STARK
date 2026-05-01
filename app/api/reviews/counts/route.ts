import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("prompt_id, rating");

  if (error) {
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }

  // prompt_id ごとの件数・評価合計を集計
  const counts: Record<string, number> = {};
  const ratingTotals: Record<string, { sum: number; count: number }> = {};

  for (const row of data ?? []) {
    counts[row.prompt_id] = (counts[row.prompt_id] ?? 0) + 1;
    if (!ratingTotals[row.prompt_id]) {
      ratingTotals[row.prompt_id] = { sum: 0, count: 0 };
    }
    ratingTotals[row.prompt_id].sum += row.rating;
    ratingTotals[row.prompt_id].count += 1;
  }

  return NextResponse.json({ counts, ratingTotals });
}
