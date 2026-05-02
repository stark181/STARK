"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PromptSubmitModal = dynamic(() => import("./PromptSubmitModal"), { ssr: false });

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* ロゴ */}
            <div className="flex items-center gap-2.5 shrink-0">
              <img src="/logo-icon.png" alt="AIプロンプト図鑑" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-gray-900 text-base tracking-tight">AIプロンプト図鑑</span>
            </div>

            {/* ボタン群 */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => alert("ログイン機能は準備中です")}
                className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-all font-medium"
              >
                ログイン
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
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
