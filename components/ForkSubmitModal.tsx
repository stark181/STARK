"use client";

import { useState } from "react";
import { AiTool } from "@/types";

interface ForkSubmitModalProps {
  originalTitle: string;
  originalBody: string;
  onClose: () => void;
  onSubmit: (data: ForkFormData) => void;
}

export interface ForkFormData {
  title: string;
  body: string;
  diffSummary: string;
  authorRole: string;
}

const roles = [
  "営業担当", "営業マネージャー", "インサイドセールス",
  "マーケター", "採用担当", "HRマネージャー",
  "経営企画", "事業部長", "経営者・CEO", "コンサルタント",
  "プロジェクトマネージャー", "エンジニア", "その他",
];

export default function ForkSubmitModal({ originalTitle, originalBody, onClose, onSubmit }: ForkSubmitModalProps) {
  const [form, setForm] = useState<ForkFormData>({
    title: `${originalTitle}（改良版）`,
    body: originalBody,
    diffSummary: "",
    authorRole: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.diffSummary || !form.authorRole) return;
    onSubmit(form);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="bg-teal-900 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              派生プロンプトを投稿する
            </h2>
            <p className="text-teal-300 text-xs mt-0.5 truncate max-w-xs">元: {originalTitle}</p>
          </div>
          <button onClick={onClose} className="text-teal-300 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">派生プロンプトを投稿しました</h3>
            <p className="text-slate-500 text-sm mb-6">あなたの改良版が他のユーザーの参考になります。</p>
            <button onClick={onClose} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">
              {/* 改良のポイント */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                <p className="text-xs text-teal-700 font-medium mb-1">💡 派生プロンプトとは</p>
                <p className="text-xs text-teal-600">元のプロンプトをベースに、あなたが改良した版を投稿できます。どこをどう変えたか明記することで、他のユーザーの参考になります。</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">タイトル</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  maxLength={60}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  変更内容の要約 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.diffSummary}
                  onChange={(e) => setForm({ ...form, diffSummary: e.target.value })}
                  required
                  placeholder="例：業種別に出力フォーマットを変更し、BtoB向けに特化"
                  maxLength={100}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  派生プロンプト本文 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  required
                  rows={8}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  あなたの職種 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.authorRole}
                  onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">選択してください</option>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
              <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium">
                キャンセル
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors"
              >
                派生版を投稿する
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
