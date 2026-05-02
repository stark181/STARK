"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import FilterBar, { SortOption } from "@/components/FilterBar";
import PromptCard from "@/components/PromptCard";
import { Category, Difficulty, AiTool, Prompt } from "@/types";
import promptsData from "@/data/prompts.json";

const PromptSubmitModal = dynamic(() => import("@/components/PromptSubmitModal"), { ssr: false });

const staticPrompts = promptsData as Prompt[];

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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "すべて">("すべて");
  const [selectedAiTool, setSelectedAiTool] = useState<AiTool | "すべて">("すべて");
  const [sortBy, setSortBy] = useState<SortOption>("reviews");
  // DBから取得したプロンプト
  const [dbPrompts, setDbPrompts] = useState<Prompt[]>([]);
  // 全プロンプト（静的JSON + DB）
  const prompts = useMemo(() => [...staticPrompts, ...dbPrompts], [dbPrompts]);

  // Supabaseから取得したレビュー件数（prompt_id → 追加件数）
  const [dbReviewCounts, setDbReviewCounts] = useState<Record<string, number>>({});
  // Supabaseから取得した評価合計（prompt_id → { sum, count }）
  const [dbRatingTotals, setDbRatingTotals] = useState<Record<string, { sum: number; count: number }>>({});
  // Supabaseから取得したコピー数（prompt_id → 使用回数）
  const [dbUsageCounts, setDbUsageCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // DBプロンプトを取得
    fetch("/api/prompts/db")
      .then((res) => res.json())
      .then((data) => {
        if (data.prompts) {
          const mapped: Prompt[] = data.prompts.map((p: {
            id: string; title: string; category: string; difficulty: string;
            ai_tools: string[]; description: string; body: string;
            badges: string[]; tips: string[]; usage_count: number; created_at: string;
          }) => ({
            id: p.id,
            title: p.title,
            category: p.category as Prompt["category"],
            difficulty: p.difficulty as Prompt["difficulty"],
            aiTools: p.ai_tools as Prompt["aiTools"],
            badges: (p.badges ?? []) as Prompt["badges"],
            description: p.description,
            body: p.body,
            variables: [],
            tips: p.tips ?? [],
            usageCount: p.usage_count ?? 0,
            reviews: [],
            forks: [],
            createdAt: p.created_at.split("T")[0],
          }));
          setDbPrompts(mapped);
        }
      })
      .catch(() => {});

    fetch("/api/reviews/counts")
      .then((res) => res.json())
      .then((data) => {
        if (data.counts) setDbReviewCounts(data.counts);
        if (data.ratingTotals) setDbRatingTotals(data.ratingTotals);
      })
      .catch(() => {});

    fetch("/api/prompts/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.usage) setDbUsageCounts(data.usage);
      })
      .catch(() => {});
  }, []);

  const isDefaultView =
    selectedCategory === "すべて" &&
    selectedDifficulty === "すべて" &&
    selectedAiTool === "すべて" &&
    sortBy === "reviews" &&
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
      result = [...result].sort(
        (a, b) =>
          (b.reviews.length + (dbReviewCounts[b.id] ?? 0)) -
          (a.reviews.length + (dbReviewCounts[a.id] ?? 0))
      );
    } else if (sortBy === "usage") {
      result = [...result].sort(
        (a, b) =>
          (b.usageCount + (dbUsageCounts[b.id] ?? 0)) -
          (a.usageCount + (dbUsageCounts[a.id] ?? 0))
      );
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return result;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedAiTool, sortBy, dbReviewCounts, dbUsageCounts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ヒーロー */}
      <section className="bg-gradient-to-br from-blue-50 via-violet-50 to-white border-b border-violet-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            {/* 左：テキスト＋検索 */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white border border-violet-200 text-violet-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                実践知が集まるAIプロンプトプラットフォーム
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
                「実際に試して<br />
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                  うまくいった
                </span>」<br />
                プロンプトが集まる場所
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                職種・業種・成果が明記された成功事例レビュー付き。<br className="hidden sm:block" />
                試した人の体験が積み重なる、実践型プロンプト図鑑。
              </p>
              <div className="flex gap-2 max-w-lg">
                <div className="flex-1 relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="職種・用途・キーワードで検索..."
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white shadow-sm"
                  />
                </div>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm">
                  検索
                </button>
              </div>
            </div>
            {/* 右：統計 */}
            <div className="flex sm:flex-col gap-6 sm:gap-4 shrink-0">
              {[
                { label: "プロンプト数", value: `${prompts.length}件`, color: "text-blue-600" },
                { label: "成功事例総数", value: `${prompts.reduce((s, p) => s + p.reviews.length, 0) + Object.values(dbReviewCounts).reduce((s, n) => s + n, 0)}件`, color: "text-violet-600" },
                { label: "総使用回数", value: `${((prompts.reduce((s, p) => s + p.usageCount, 0) + Object.values(dbUsageCounts).reduce((s, n) => s + n, 0)) / 1000).toFixed(1)}K`, color: "text-pink-600" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-right">
                  <div className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ===== デフォルト表示（フィルターなし） ===== */}
        {isDefaultView ? (
          <div className="space-y-10">
            {CATEGORY_META.map((cat) => {
              const catPrompts = prompts
                .filter((p) => p.category === cat.name)
                .sort(
                  (a, b) =>
                    (b.reviews.length + (dbReviewCounts[b.id] ?? 0)) -
                    (a.reviews.length + (dbReviewCounts[a.id] ?? 0))
                )
                .slice(0, 3);

              return (
                <section key={cat.name}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBgMap[cat.color]}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={cat.icon} />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">{cat.name}</h2>
                        <p className="text-xs text-gray-400">{cat.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className="text-xs font-semibold px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                    >
                      すべて見る →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catPrompts.map((p) => (
                      <PromptCard
                        key={p.id}
                        prompt={p}
                        dbReviewCount={dbReviewCounts[p.id] ?? 0}
                        dbRatingTotal={dbRatingTotals[p.id]}
                        dbUsageCount={dbUsageCounts[p.id] ?? 0}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* CTA */}
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 p-10 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -translate-x-10 translate-y-10" />
              <div className="relative">
                <div className="text-3xl mb-3">✦</div>
                <h2 className="text-xl font-extrabold mb-2">あなたの成功事例をシェアしよう</h2>
                <p className="text-white/70 text-sm mb-6">うまくいったプロンプトを投稿して、同じ悩みを持つ人を助けよう。</p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-white text-violet-600 font-bold px-8 py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-lg text-sm"
                >
                  プロンプトを投稿する
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== フィルター適用時：検索結果グリッド ===== */
          <>
            <div className="flex items-center gap-3 mb-6">
              {selectedCategory !== "すべて" && (
                <h2 className="text-lg font-bold text-gray-900">{selectedCategory}</h2>
              )}
              {searchQuery && (
                <p className="text-sm text-gray-500">
                  「<span className="font-medium text-gray-900">{searchQuery}</span>」の検索結果
                </p>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-gray-700 mb-2">プロンプトが見つかりませんでした</p>
                <p className="text-sm text-gray-400 mb-8 max-w-xs">別のキーワードや条件で試してみてください。</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("すべて");
                      setSelectedDifficulty("すべて");
                      setSelectedAiTool("すべて");
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                  >
                    条件をリセット
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                  >
                    トップに戻る
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={`${selectedCategory}-${selectedDifficulty}-${selectedAiTool}-${sortBy}-${searchQuery}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filtered.map((p) => (
                  <PromptCard
                    key={p.id}
                    prompt={p}
                    searchQuery={searchQuery}
                    dbReviewCount={dbReviewCounts[p.id] ?? 0}
                    dbRatingTotal={dbRatingTotals[p.id]}
                    dbUsageCount={dbUsageCounts[p.id] ?? 0}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showSubmitModal && (
        <PromptSubmitModal onClose={() => setShowSubmitModal(false)} />
      )}

      {/* フッター */}
      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-gray-300 text-sm bg-white">
        <p>© 2025 AIプロンプト図鑑</p>
      </footer>
    </div>
  );
}
