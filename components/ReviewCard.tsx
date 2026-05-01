"use client";

import { useState } from "react";
import { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

const aiToolColors: Record<string, string> = {
  ChatGPT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Claude: "bg-orange-50 text-orange-700 border-orange-200",
  Gemini: "bg-blue-50 text-blue-700 border-blue-200",
  共通: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (!voted) {
      setHelpfulCount((c) => c + 1);
      setVoted(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      {/* ヘッダー：職種・業種・AI・評価 */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* 職種・業種バッジ */}
          <div className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">{review.authorRole}</span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-xs text-slate-300">{review.authorIndustry}</span>
          </div>
          {/* AIツール */}
          <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${aiToolColors[review.aiTool] ?? aiToolColors["共通"]}`}>
            {review.aiTool}
          </span>
        </div>
        {/* 星評価 */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              className={`w-4 h-4 ${s <= review.rating ? "text-amber-400" : "text-slate-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* 成果・気づき（最も目立たせる） */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-1 h-4 bg-amber-500 rounded-full" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">成果・気づき</span>
        </div>
        <p className="text-slate-800 text-sm leading-relaxed">{review.outcome}</p>
      </div>

      {/* カスタマイズ */}
      {review.customization && (
        <div className="bg-slate-50 rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-semibold text-teal-700">カスタマイズした点</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">{review.customization}</p>
        </div>
      )}

      {/* フッター */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">{review.createdAt}</span>
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            voted
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "text-slate-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill={voted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          役に立った {helpfulCount}
        </button>
      </div>
    </div>
  );
}
