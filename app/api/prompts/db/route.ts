import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// DB上の全プロンプトを取得
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }

  return NextResponse.json({ prompts: data });
}
