import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("forks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }

  return NextResponse.json({ forks: data });
}

// フォーク削除
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from("forks")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "削除失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
