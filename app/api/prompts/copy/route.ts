import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// コピーボタンが押されたら呼ばれる
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { promptId } = body;

  if (!promptId) {
    return NextResponse.json({ error: "promptId is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("prompt_copies")
    .insert({ prompt_id: promptId });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
