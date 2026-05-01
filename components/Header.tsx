"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PromptSubmitModal = dynamic(() => import("./PromptSubmitModal"), { ssr: false });

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <>
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <div className="flex items-center gap-3 shrink-0">
              <img src="/logo-icon.svg" alt="AIプロンプト図鑑" className="w-9 h-9" />
              <div>
                <span className="font-bold text-lg tracking-tight">AIプロンプト図鑑</span>
                <span className="hidden sm:inline text-slate-400 text-xs ml-2">AIを使いこなす実践知が集まる場所</span>
              </div>
            </div>

            {/* 検索バー */}
            <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-4 sm:mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    onSearch(e.target.value);
                  }}
                  placeholder="職種・用途・キーワードで検索..."
                  className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-slate-700"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* ボタン群 */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="hidden sm:block text-slate-300 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
                ログイン
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">投稿する</span>
                <span className="sm:hidden">投稿</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showSubmitModal && (
        <PromptSubmitModal onClose={() => setShowSubmitModal(false)} />
      )}
    </>
  );
}
