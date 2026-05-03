import type { MetadataRoute } from "next";
import promptsData from "@/data/prompts.json";
import { Prompt } from "@/types";

const SITE_URL = "https://starkinc.work";

export default function sitemap(): MetadataRoute.Sitemap {
  const prompts = promptsData as Prompt[];

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // 各プロンプト詳細ページ
  const promptPages: MetadataRoute.Sitemap = prompts.map((prompt) => ({
    url: `${SITE_URL}/prompts/${prompt.id}`,
    lastModified: new Date(prompt.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...promptPages];
}
