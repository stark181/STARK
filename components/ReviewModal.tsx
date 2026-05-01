"use client";

import { useState } from "react";
import { AiTool } from "@/types";

interface ReviewModalProps {
  promptId: string;
  promptTitle: string;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
}

export interface ReviewFormData {
  authorRole: string;
  authorIndustry: string;
  aiTool: AiTool;
  outcome: string;
  customization: string;
  rating: number;
}

const roles = [
  "営業担当", "営業マネージャー", "インサイドセールス", "フィールドセールス",
  "マーケター", "マーケティングマネージャー", "採用担当", "HRマネージャー",
  "経営企画", "事業部長", "経営者・CEO", "コンサルタント",
  "プロジェクトマネージャー", "プロダクトマネージャー", "エンジニア", "その他",
];

const industries = [
  "IT・SaaS", "IT・Web", "HR Tech", "FinTech", "コンサルティング",
  "製造業", "小売・EC", "D2C・食品", "スタートアップ", "メガベンチャー",
  "金融・保険", "不動産", "医療・ヘルスケア", "教育・EdTech", "その他",
];

const aiTools: AiTool[] = ["ChatGPT", "Claude", "Gemini", "共通"];

export default function ReviewModal({ promptId, promptTitle, onClose, onSubmit }: ReviewModalProps) {
  const [form, setForm] = useState<ReviewFormData>({
    authorRole: "",
    authorIndustry: "",
    aiTool: "ChatGPT",
    outcome: "",
    customization: "",
    rating: 5,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorRole || !form.authorIndustry || !form.outcome) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId,
          rating: form.rating,
          role: form.authorRole,
          industry: form.authorIndustry,
          comment: form.customization || "",
          result: form.outcome,
        }),
      });
    } catch {
      // API失敗してもUIは成功扱いにする（楽観的更新）
    } finally {
      setSubmitting(false);
    }
    onSubmit(form);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-white text-base">成功事例を投稿する</h2>
            <p className="text-slate-400 text-xs mt-0.5 truncate max-w-xs">{promptTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">投稿ありがとうございます</h3>
            <p className="text-slate-500 text-sm mb-6">あなたの成功事例が他のユーザーの役に立ちます。</p>
            <button onClick={onClose} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              閉じる
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-5">
              {/* 職種・業種 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    あなたの職種 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.authorRole}
                    onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="">選択してください</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    業種 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.authorIndustry}
                    onChange={(e) => setForm({ ...form, authorIndustry: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="">選択してください</option>
                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              {/* AIツール */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  使用したAIツール
                </label>
                <div className="flex gap-2 flex-wrap">
                  {aiTools.map((tool) => (
                    <label key={tool} className="cursor-pointer">
                      <input
                        type="radio"
                        name="aiTool"
                        value={tool}
                        checked={form.aiTool === tool}
                        onChange={() => setForm({ ...form, aiTool: tool })}
                        className="sr-only"
                      />
                      <span className={`block px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        form.aiTool === tool
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}>
                        {tool}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 成功度 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  成功度
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, rating: s })}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 transition-colors ${s <= form.rating ? "text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 成果・気づき */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  成果・気づき <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                  required
                  rows={3}
                  placeholder="例：提案書作成が1時間→15分に短縮。提案通過率も上がった。"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* カスタマイズした点 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  カスタマイズした点
                  <span className="text-slate-400 font-normal ml-1">（任意）</span>
                </label>
                <textarea
                  value={form.customization}
                  onChange={(e) => setForm({ ...form, customization: e.target.value })}
                  rows={2}
                  placeholder="例：{{会社名}}の後に業種も入れるよう変更した"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            {/* フッター */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
              >
                {submitting ? "送信中…" : "投稿する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
