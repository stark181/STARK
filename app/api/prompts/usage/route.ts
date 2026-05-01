import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// 全プロンプトのコピー数（使用回数）を返す
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("prompt_copies")
    .select("prompt_id");

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }

  const usage: Record<string, number> = {};
  for (const row of data ?? []) {
    usage[row.prompt_id] = (usage[row.prompt_id] ?? 0) + 1;
  }

  return NextResponse.json({ usage });
}
