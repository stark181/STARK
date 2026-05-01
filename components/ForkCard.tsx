"use client";

import { useState } from "react";
import { Fork } from "@/types";

interface ForkCardProps {
  fork: Fork;
}

export default function ForkCard({ fork }: ForkCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fork.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-teal-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-teal-50 px-5 py-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">派生プロンプト</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{fork.title}</h3>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-slate-500">by {fork.authorRole}</div>
          <div className="text-xs text-slate-400 mt-0.5">{fork.usageCount.toLocaleString()}回使用</div>
        </div>
      </div>

      {/* 差分説明 */}
      <div className="px-5 py-3 border-b border-teal-100">
        <div className="flex items-start gap-2">
          <div className="w-1 h-full min-h-4 bg-teal-400 rounded-full mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">{fork.diffSummary}</p>
        </div>
      </div>

      {/* プロンプト本文 */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-teal-700 font-medium hover:text-teal-900 flex items-center gap-1"
          >
            {expanded ? "▲ 折りたたむ" : "▼ プロンプト本文を見る"}
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
              copied
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
            </svg>
            {copied ? "コピーしました" : "コピー"}
          </button>
        </div>

        {expanded && (
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono mt-2">
            {fork.body}
          </pre>
        )}
      </div>
    </div>
  );
}
