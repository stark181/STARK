import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ promptId: string }> }
) {
  const { promptId } = await params;

  const { data, error } = await supabaseAdmin
    .from("forks")
    .select("*")
    .eq("original_prompt_id", promptId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }

  return NextResponse.json({ forks: data });
}
