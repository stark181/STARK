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
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-14 z-40">
        <div className="max-w-6xl mx-auto px-6 py-2.5">

          {/* PC：カテゴリ＋絞り込みボタン＋ソート */}
          <div className="hidden sm:flex gap-2 items-center">
            <div className="flex gap-1.5 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* 絞り込みボタン（難易度・AIツール） */}
              <button
                onClick={() => setDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeCount > 1 || (activeCount === 1 && selectedCategory === "すべて")
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white border-transparent"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                絞り込み
                {(selectedDifficulty !== "すべて" || selectedAiTool !== "すべて") && (
                  <span className="w-4 h-4 bg-white/30 rounded-full text-[10px] flex items-center justify-center font-bold">
                    {[selectedDifficulty !== "すべて", selectedAiTool !== "すべて"].filter(Boolean).length}
                  </span>
                )}
              </button>
              <div className="h-4 w-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">{totalCount}件</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 font-medium"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* モバイル */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCount > 0
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              フィルター
              {activeCount > 0 && (
                <span className="w-4 h-4 bg-white/30 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </button>
            <div className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-hide">
              {selectedCategory !== "すべて" && (
                <span className="shrink-0 flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  {selectedCategory}
                  <button onClick={() => onCategoryChange("すべて")} className="text-blue-400 hover:text-blue-700">×</button>
                </span>
              )}
              {selectedDifficulty !== "すべて" && (
                <span className="shrink-0 flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
                  {selectedDifficulty}
                  <button onClick={() => onDifficultyChange("すべて")} className="text-teal-400 hover:text-teal-700">×</button>
                </span>
              )}
              {selectedAiTool !== "すべて" && (
                <span className="shrink-0 flex items-center gap-1 text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                  {selectedAiTool}
                  <button onClick={() => onAiToolChange("すべて")} className="text-violet-400 hover:text-violet-700">×</button>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 font-medium">{totalCount}件</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="text-xs border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 bg-white focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ドロワー（全画面共通） */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">フィルター</h3>
              {activeCount > 0 && (
                <button onClick={resetAll} className="text-xs text-violet-600 hover:text-violet-700 font-semibold">
                  すべてリセット
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">カテゴリ</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">難易度</p>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      onClick={() => onDifficultyChange(d)}
                      className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedDifficulty === d
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">対応 AI ツール</p>
                <div className="flex flex-wrap gap-2">
                  {aiTools.map((t) => (
                    <button
                      key={t}
                      onClick={() => onAiToolChange(t)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        selectedAiTool === t
                          ? "bg-violet-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
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
