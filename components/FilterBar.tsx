"use client";

import { useState } from "react";
import { Category, Difficulty, AiTool } from "@/types";

export type SortOption = "newest" | "reviews" | "usage";

interface FilterBarProps {
  selectedCategory: Category | "すべて";
  selectedDifficulty: Difficulty | "すべて";
  selectedAiTool: AiTool | "すべて";
  sortBy: SortOption;
  onCategoryChange: (v: Category | "すべて") => void;
  onDifficultyChange: (v: Difficulty | "すべて") => void;
  onAiToolChange: (v: AiTool | "すべて") => void;
  onSortChange: (v: SortOption) => void;
  totalCount: number;
}

const categories: (Category | "すべて")[] = [
  "すべて", "営業・提案", "人事・採用", "マーケ・SNS", "経営企画", "総務・法務", "その他",
];
const difficulties: (Difficulty | "すべて")[] = ["すべて", "初級", "中級", "上級"];
const aiTools: (AiTool | "すべて")[] = ["すべて", "ChatGPT", "Claude", "Gemini", "共通"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "新着順" },
  { value: "reviews", label: "成功事例数順" },
  { value: "usage", label: "使用数順" },
];

export default function FilterBar({
  selectedCategory,
  selectedDifficulty,
  selectedAiTool,
  sortBy,
  onCategoryChange,
  onDifficultyChange,
  onAiToolChange,
  onSortChange,
  totalCount,
}: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // アクティブフィルター数（"すべて"以外）
  const activeCount = [
    selectedCategory !== "すべて",
    selectedDifficulty !== "すべて",
    selectedAiTool !== "すべて",
  ].filter(Boolean).length;

  const resetAll = () => {
    onCategoryChange("すべて");
    onDifficultyChange("すべて");
    onAiToolChange("すべて");
  };

  return (
    <>
      {/* ===== バー本体 ===== */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">

          {/* ── PC: 横並びフィルター ── */}
          <div className="hidden sm:flex flex-wrap gap-3 items-center">
            {/* カテゴリ */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-200" />
            {/* 難易度 */}
            <div className="flex gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => onDifficultyChange(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedDifficulty === d
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-200" />
            {/* AI */}
            <div className="flex gap-1.5">
              {aiTools.map((t) => (
                <button
                  key={t}
                  onClick={() => onAiToolChange(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedAiTool === t
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{totalCount}件</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── モバイル: コンパクトバー ── */}
          <div className="flex sm:hidden items-center gap-2">
            {/* フィルターボタン */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeCount > 0
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              フィルター
              {activeCount > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            {/* アクティブフィルタータグ */}
            <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-hide">
              {selectedCategory !== "すべて" && (
                <span className="shrink-0 flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                  {selectedCategory}
                  <button onClick={() => onCategoryChange("すべて")} className="text-slate-400 hover:text-slate-700">×</button>
                </span>
              )}
              {selectedDifficulty !== "すべて" && (
                <span className="shrink-0 flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
                  {selectedDifficulty}
                  <button onClick={() => onDifficultyChange("すべて")} className="text-teal-400 hover:text-teal-700">×</button>
                </span>
              )}
              {selectedAiTool !== "すべて" && (
                <span className="shrink-0 flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                  {selectedAiTool}
                  <button onClick={() => onAiToolChange("すべて")} className="text-amber-400 hover:text-amber-700">×</button>
                </span>
              )}
            </div>

            {/* 件数 + 並び替え */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400">{totalCount}件</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-xs border border-slate-200 rounded-md px-1.5 py-1 text-slate-600 bg-white focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== モバイルドロワー ===== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* オーバーレイ */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* ドロワー本体 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl drawer-slide-up max-h-[85vh] flex flex-col">
            {/* ハンドル */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">フィルター</h3>
              {activeCount > 0 && (
                <button
                  onClick={resetAll}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  すべてリセット
                </button>
              )}
            </div>

            {/* コンテンツ */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">
              {/* カテゴリ */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">カテゴリ</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 難易度 */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">難易度</p>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      onClick={() => onDifficultyChange(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDifficulty === d
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI ツール */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">対応 AI ツール</p>
                <div className="flex flex-wrap gap-2">
                  {aiTools.map((t) => (
                    <button
                      key={t}
                      onClick={() => onAiToolChange(t)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedAiTool === t
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* フッター */}
            <div className="px-5 py-4 border-t border-slate-100">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm transition-colors"
              >
                {totalCount}件を表示する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
