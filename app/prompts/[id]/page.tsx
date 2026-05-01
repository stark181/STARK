import { Metadata } from "next";
import { notFound } from "next/navigation";
import promptsData from "@/data/prompts.json";
import { Prompt } from "@/types";
import PromptDetailClient from "@/components/PromptDetailClient";

const allPrompts = promptsData as Prompt[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = allPrompts.find((p) => p.id === id);

  if (!prompt) {
    return { title: "ページが見つかりません | PromptBase" };
  }

  return {
    title: `${prompt.title} | PromptBase`,
    description: prompt.description,
    openGraph: {
      title: `${prompt.title} | PromptBase`,
      description: prompt.description,
      type: "article",
      siteName: "PromptBase",
    },
    twitter: {
      card: "summary",
      title: `${prompt.title} | PromptBase`,
      description: prompt.description,
    },
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = allPrompts.find((p) => p.id === id);

  if (!prompt) notFound();

  return <PromptDetailClient id={id} />;
}
