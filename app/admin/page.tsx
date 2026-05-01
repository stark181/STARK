"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Submission = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  ai_tools: string[];
  description: string;
  body: string;
  author_role: string | null;
  status: string;
  created_at: string;
};

type Review = {
  id: string;
  prompt_id: string;
  rating: number;
  role: string;
  industry: string;
  comment: string;
  result: string;
  created_at: string;
};

type Fork = {
  id: string;
  original_prompt_id: string;
  title: string;
  body: string;
  diff_summary: string;
  author_role: string;
  created_at: string;
};

type DbPrompt = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  ai_tools: string[];
  description: string;
  badges: string[];
  author_role: string | null;
  usage_count: number;
  created_at: string;
};

type Tab = "submissions" | "reviews" | "forks" | "prompts";

const statusLabel: Record<string, { label: string; color: string }> = {
  pending:  { label: "審査中", color: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "承認済", color: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "却下",   color: "bg-red-100 text-red-700 border-red-200" },
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [dbPrompts, setDbPrompts] = useState<DbPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingBadge, setSavingBadge] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [s, r, f, p] = await Promise.all([
      fetch("/api/admin/submissions").then((res) => res.json()),
      fetch("/api/admin/reviews").then((res) => res.json()),
      fetch("/api/admin/forks").then((res) => res.json()),
      fetch("/api/prompts/db").then((res) => res.json()),
    ]);
    if (s.submissions) setSubmissions(s.submissions);
    if (r.reviews) setReviews(r.reviews);
    if (f.forks) setForks(f.forks);
    if (p.prompts) setDbPrompts(p.prompts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const toggleBadge = async (promptId: string, badge: string, currentBadges: string[]) => {
    setSavingBadge(promptId);
    const newBadges = currentBadges.includes(badge)
      ? currentBadges.filter((b) => b !== badge)
      : [...currentBadges, badge];

    await fetch(`/api/prompts/db/${promptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ badges: newBadges }),
    });

    setDbPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, badges: newBadges } : p))
    );
    setSavingBadge(null);
  };

  const deleteReview = async (id: string) => {
    if (!confirm("このレビューを削除しますか？")) return;
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteFork = async (id: string) => {
    if (!confirm("このフォークを削除しますか？")) return;
    await fetch("/api/admin/forks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setForks((prev) => prev.filter((f) => f.id !== id));
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-amber-500 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-bold">AIプロンプト図鑑</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300 text-sm">管理パネル</span>
          </div>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← サイトに戻る
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* サマリーカード */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "投稿プロンプト", value: submissions.length, sub: `${pendingCount}件 審査中`, color: "text-amber-600" },
            { label: "公開中プロンプト", value: dbPrompts.length, sub: "DB登録済み", color: "text-violet-600" },
            { label: "成功事例レビュー", value: reviews.length, sub: "全件", color: "text-blue-600" },
            { label: "派生版（フォーク）", value: forks.length, sub: "全件", color: "text-teal-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm font-medium text-slate-700">{stat.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* タブ */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit">
          {(["submissions", "reviews", "forks", "prompts"] as Tab[]).map((t) => {
            const labels = { submissions: "投稿プロンプト", reviews: "レビュー", forks: "派生版", prompts: "プロンプト管理" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {labels[t]}
                {t === "submissions" && pendingCount > 0 && (
                  <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            読み込み中...
          </div>
        ) : (
          <>
            {/* ===== 投稿プロンプト ===== */}
            {tab === "submissions" && (
              <div className="space-y-3">
                {submissions.length === 0 && (
                  <div className="text-center py-16 text-slate-400">投稿はまだありません</div>
                )}
                {submissions.map((s) => {
                  const isExpanded = expandedId === s.id;
                  const st = statusLabel[s.status] ?? statusLabel.pending;
                  return (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${st.color}`}>
                                {st.label}
                              </span>
                              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{s.category}</span>
                              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{s.difficulty}</span>
                              {s.ai_tools?.map((t) => (
                                <span key={t} className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{t}</span>
                              ))}
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{s.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                              {s.author_role && <span>投稿者：{s.author_role}</span>}
                              <span>{new Date(s.created_at).toLocaleDateString("ja-JP")}</span>
                            </div>
                          </div>
                          {/* アクションボタン */}
                          <div className="flex flex-col gap-2 shrink-0">
                            {s.status !== "approved" && (
                              <button
                                onClick={() => updateStatus(s.id, "approved")}
                                className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                              >
                                承認
                              </button>
                            )}
                            {s.status !== "rejected" && (
                              <button
                                onClick={() => updateStatus(s.id, "rejected")}
                                className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                              >
                                却下
                              </button>
                            )}
                            {s.status !== "pending" && (
                              <button
                                onClick={() => updateStatus(s.id, "pending")}
                                className="text-xs px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                              >
                                保留に戻す
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : s.id)}
                          className="mt-3 text-xs text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                        >
                          <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {isExpanded ? "プロンプト本文を閉じる" : "プロンプト本文を見る"}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                          <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">{s.body}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===== レビュー ===== */}
            {tab === "reviews" && (
              <div className="space-y-3">
                {reviews.length === 0 && (
                  <div className="text-center py-16 text-slate-400">レビューはまだありません</div>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{r.prompt_id}</span>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <svg key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-slate-500 ml-1">{r.rating}/5</span>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-500 mb-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded">{r.role}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">{r.industry}</span>
                          <span className="text-slate-400">{new Date(r.created_at).toLocaleDateString("ja-JP")}</span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">成果：{r.result}</p>
                        {r.comment && <p className="text-sm text-slate-500 mt-1">補足：{r.comment}</p>}
                      </div>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors border border-red-200 shrink-0"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ===== フォーク ===== */}
            {tab === "forks" && (
              <div className="space-y-3">
                {forks.length === 0 && (
                  <div className="text-center py-16 text-slate-400">フォークはまだありません</div>
                )}
                {forks.map((f) => {
                  const isExpanded = expandedId === f.id;
                  return (
                    <div key={f.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">元：{f.original_prompt_id}</span>
                              {f.author_role && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{f.author_role}</span>}
                              <span className="text-xs text-slate-400">{new Date(f.created_at).toLocaleDateString("ja-JP")}</span>
                            </div>
                            <h3 className="font-bold text-slate-900">{f.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{f.diff_summary}</p>
                          </div>
                          <button
                            onClick={() => deleteFork(f.id)}
                            className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors border border-red-200 shrink-0"
                          >
                            削除
                          </button>
                        </div>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : f.id)}
                          className="mt-3 text-xs text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                        >
                          <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {isExpanded ? "本文を閉じる" : "本文を見る"}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                          <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">{f.body}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===== プロンプト管理（バッジ付与） ===== */}
            {tab === "prompts" && (
              <div className="space-y-3">
                {dbPrompts.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <p>DB登録済みプロンプトはまだありません</p>
                    <p className="text-xs mt-1">管理画面から投稿を承認するとここに表示されます</p>
                  </div>
                )}

                {/* バッジの説明 */}
                {dbPrompts.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                    <p className="text-sm font-medium text-amber-800 mb-2">自動バッジのルール</p>
                    <div className="flex flex-wrap gap-4 text-xs text-amber-700">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                        実績バッジ：レビュー2件以上で自動付与
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                        人気バッジ：平均評価4.5以上で自動付与
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                        編集部ピック：手動のみ
                      </span>
                    </div>
                  </div>
                )}

                {dbPrompts.map((p) => {
                  const BADGE_OPTIONS = [
                    { key: "編集部ピック", color: "bg-amber-500", label: "⭐ 編集部ピック", manual: true },
                    { key: "実績バッジ", color: "bg-teal-600", label: "✓ 実績あり", manual: false },
                    { key: "人気バッジ", color: "bg-rose-500", label: "🔥 人気急上昇", manual: false },
                  ];
                  const isSaving = savingBadge === p.id;

                  return (
                    <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{p.category}</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{p.difficulty}</span>
                            {p.ai_tools?.map((t) => (
                              <span key={t} className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                          <h3 className="font-bold text-slate-900">{p.title}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">{p.description}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            {p.author_role && <span>投稿者：{p.author_role}</span>}
                            <span>{new Date(p.created_at).toLocaleDateString("ja-JP")}</span>
                          </div>
                        </div>
                        <a
                          href={`/prompts/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors shrink-0"
                        >
                          表示 →
                        </a>
                      </div>

                      {/* バッジ付与エリア */}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">バッジ管理</p>
                        <div className="flex flex-wrap gap-2">
                          {BADGE_OPTIONS.map(({ key, color, label, manual }) => {
                            const hasBadge = p.badges?.includes(key);
                            return (
                              <button
                                key={key}
                                onClick={() => toggleBadge(p.id, key, p.badges ?? [])}
                                disabled={isSaving}
                                title={manual ? "手動付与のみ" : "自動付与対象（手動でも変更可）"}
                                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${
                                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                                } ${
                                  hasBadge
                                    ? `${color} text-white border-transparent`
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                                }`}
                              >
                                {isSaving ? (
                                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                  </svg>
                                ) : (
                                  <span className={`w-1.5 h-1.5 rounded-full ${hasBadge ? "bg-white" : "bg-slate-300"}`}></span>
                                )}
                                {label}
                                {!manual && (
                                  <span className="text-[10px] opacity-60">自動</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
