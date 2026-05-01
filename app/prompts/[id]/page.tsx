import { Metadata } from "next";
import promptsData from "@/data/prompts.json";
import { Prompt } from "@/types";
import PromptDetailClient from "@/components/PromptDetailClient";

const allStaticPrompts = promptsData as Prompt[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = allStaticPrompts.find((p) => p.id === id);

  if (prompt) {
    return {
      title: `${prompt.title} | AIプロンプト図鑑`,
      description: prompt.description,
      openGraph: {
        title: `${prompt.title} | AIプロンプト図鑑`,
        description: prompt.description,
        type: "article",
        siteName: "AIプロンプト図鑑",
      },
      twitter: {
        card: "summary",
        title: `${prompt.title} | AIプロンプト図鑑`,
        description: prompt.description,
      },
    };
  }

  // DBプロンプト（UUID）はクライアント側でタイトルが決まるためデフォルト値を返す
  return { title: "プロンプト詳細 | AIプロンプト図鑑" };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // JSON・DBどちらの場合もクライアントコンポーネントに委ねる
  return <PromptDetailClient id={id} />;
}
