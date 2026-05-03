import { Metadata } from "next";
import promptsData from "@/data/prompts.json";
import { Prompt } from "@/types";
import PromptDetailClient from "@/components/PromptDetailClient";

const SITE_URL = "https://starkinc.work";
const allStaticPrompts = promptsData as Prompt[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = allStaticPrompts.find((p) => p.id === id);

  if (prompt) {
    const title = `${prompt.title}【コピペ用プロンプト】`;
    const description = `${prompt.description} 難易度：${prompt.difficulty}。${prompt.aiTools.join("・")}で使えます。成功事例レビュー付き。`;
    const url = `${SITE_URL}/prompts/${id}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: prompt.title,
      description: prompt.description,
      url,
      inLanguage: "ja",
      tool: prompt.aiTools.map((t) => ({ "@type": "HowToTool", name: t })),
      step: prompt.variables.map((v, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: v.name,
        text: v.description,
      })),
    };

    return {
      title,
      description,
      keywords: [
        prompt.title,
        `${prompt.category} プロンプト`,
        ...prompt.aiTools.map((t) => `${t} プロンプト`),
        "プロンプト コピペ",
        "AIプロンプト",
        prompt.difficulty,
      ],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        type: "article",
        url,
        siteName: "AIプロンプト図鑑",
        locale: "ja_JP",
        images: [
          {
            url: `${SITE_URL}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${prompt.title} - AIプロンプト図鑑`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${SITE_URL}/opengraph-image`],
      },
      other: {
        "script:ld+json": JSON.stringify(jsonLd),
      },
    };
  }

  // DBプロンプト（UUID）はクライアント側でタイトルが決まるためデフォルト値を返す
  return {
    title: "プロンプト詳細",
    description: "AIプロンプト図鑑のプロンプト詳細ページです。",
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PromptDetailClient id={id} />;
}
