"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import FilterBar, { SortOption } from "@/components/FilterBar";
import PromptCard from "@/components/PromptCard";
import { Category, Difficulty, AiTool, Prompt } from "@/types";
import promptsData from "@/data/prompts.json";

const prompts = promptsData as Prompt[];

const CATEGORY_META: {
  name: Category;
  color: string;
  icon: string;
  desc: string;
}[] = [
  {
    name: "営業・提案",
    color: "blue",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    desc: "提案書・ヒアリング・競合比較など",
  },
  {
    name: "人事・採用",
    color: "green",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    desc: "求人票・面接・オファーレターなど",
  },
  {
    name: "マーケ・SNS",
    color: "rose",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    desc: "SNS投稿・メルマガ・戦略立案など",
  },
  {
    name: "経営企画",
    color: "violet",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    desc: "SWOT分析・KPI・議事録・アジェンダなど",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  violet: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
};

const iconBgMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  rose: "bg-rose-100 text-rose-600",
  violet: "bg-violet-100 text-violet-600",
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "すべて">("すべて");
  const [selectedAiTool, setSelectedAiTool] = useState<AiTool | "すべて">("すべて");
  const [sortBy, setSortBy] = useState<SortOption>("reviews");

  const isDefaultView =
    selectedCategory === "すべて" &&
    selectedDifficulty === "すべて" &&
    selectedAiTool === "すべて" &&
    !searchQuery;

  const filtered = useMemo(() => {
    let result = prompts.filter((p) => {
      if (selectedCategory !== "すべて" && p.category !== selectedCategory) return false;
      if (selectedDifficulty !== "すべて" && p.difficulty !== selectedDifficulty) return false;
      if (selectedAiTool !== "すべて" && !p.aiTools.includes(selectedAiTool)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    if (sortBy === "reviews") {
      result = [...result].sort((a, b) => b.reviews.length - a.reviews.length);
    } else if (sortBy === "usage") {
      result = [...result].sort((a, b) => b.usageCount - a.usageCount);
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return result;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedAiTool, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header onSearch={setSearchQuery} />
      <FilterBar
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        selectedAiTool={selectedAiTool}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        onAiToolChange={setSelectedAiTool}
        onSortChange={setSortBy}
        totalCount={filtered.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== デフォルト表示（フィルターなし） ===== */}
        {isDefaultView ? (
          <>
            {/* ヒーローバナー */}
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 mb-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-amber-400 text-xs font-bold mb-2 tracking-widest uppercase">
                  実践知が集まるプラットフォーム
                </p>
                <h1 className="text-white text-2xl sm:text-3xl font-bold leading-snug mb-3">
                  「実際に試してうまくいった」<br className="hidden sm:block" />
                  AIプロンプトが見つかる場所
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  職種・業種・成果が明記された成功事例レビュー付き。<br />
                  クックパッドのレシピのように、試した人の体験が積み重なります。
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 shrink-0">
                {[
                  { label: "プロンプト数", value: `${prompts.length}件` },
                  { label: "成功事例総数", value: `${prompts.reduce((s, p) => s + p.reviews.length, 0)}件` },
                  { label: "総使用回数", value: `${(prompts.reduce((s, p) => s + p.usageCount, 0) / 1000).toFixed(1)}K` },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* カテゴリ別トップセクション */}
            <div className="space-y-10">
              {CATEGORY_META.map((cat) => {
                const catPrompts = prompts
                  .filter((p) => p.category === cat.name)
                  .sort((a, b) => b.reviews.length - a.reviews.length)
                  .slice(0, 3);

                return (
                  <section key={cat.name}>
                    {/* セクションヘッダー */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBgMap[cat.color]}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={cat.icon} />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900">{cat.name}</h2>
                          <p className="text-xs text-slate-400">{cat.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${colorMap[cat.color]}`}
                      >
                        すべて見る →
                      </button>
                    </div>

                    {/* プロンプトカード（横並び） */}
                    <div className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catPrompts.map((p) => (
                        <PromptCard key={p.id} prompt={p} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          /* ===== フィルター適用時：検索結果グリッド ===== */
          <>
            {/* 検索中ヘッダー */}
            <div className="flex items-center gap-3 mb-6">
              {selectedCategory !== "すべて" && (
                <h2 className="text-lg font-bold text-slate-900">{selectedCategory}</h2>
              )}
              {searchQuery && (
                <p className="text-sm text-slate-500">
                  「<span className="font-medium text-slate-900">{searchQuery}</span>」の検索結果
                </p>
              )}
            </div>

            {filtered.length === 0 ? (
              /* 空状態 */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-700 mb-2">
                  プロンプトが見つかりませんでした
                </p>
                <p className="text-sm text-slate-400 mb-8 max-w-xs">
                  別のキーワードや条件で試してみてください。
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("すべて");
                      setSelectedDifficulty("すべて");
                      setSelectedAiTool("すべて");
                    }}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    条件をリセット
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    トップに戻る
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={`${selectedCategory}-${selectedDifficulty}-${selectedAiTool}-${sortBy}-${searchQuery}`}
                className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((p) => (
                  <PromptCard key={p.id} prompt={p} searchQuery={searchQuery} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-200 mt-16 py-8 text-center text-slate-400 text-sm">
        <p>© 2025 PromptBase. AIを使いこなす実践知が集まる場所。</p>
      </footer>
    </div>
  );
}
