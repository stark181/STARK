"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReviewCard from "@/components/ReviewCard";
import ForkCard from "@/components/ForkCard";
import ReviewModal, { ReviewFormData } from "@/components/ReviewModal";
import ForkSubmitModal, { ForkFormData } from "@/components/ForkSubmitModal";
import { Prompt, Review, Fork } from "@/types";
import promptsData from "@/data/prompts.json";

const allPrompts = promptsData as Prompt[];

const categoryColors: Record<string, string> = {
  "営業・提案": "bg-blue-50 text-blue-700 border-blue-200",
  "人事・採用": "bg-green-50 text-green-700 border-green-200",
  "マーケ・SNS": "bg-rose-50 text-rose-700 border-rose-200",
  "経営企画": "bg-violet-50 text-violet-700 border-violet-200",
  "総務・法務": "bg-orange-50 text-orange-700 border-orange-200",
  "その他": "bg-slate-50 text-slate-600 border-slate-200",
};

const difficultyColors: Record<string, string> = {
  初級: "text-teal-700 bg-teal-50 border-teal-200",
  中級: "text-amber-700 bg-amber-50 border-amber-200",
  上級: "text-red-700 bg-red-50 border-red-200",
};

function PromptBodyRenderer({
  body,
  varValues,
}: {
  body: string;
  varValues: Record<string, string>;
}) {
  const parts = body.split(/(\{\{[^}]+\}\})/g);
  return (
    <pre className="bg-slate-900 rounded-xl p-5 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
      {parts.map((part, i) => {
        const match = part.match(/^\{\{([^}]+)\}\}$/);
        if (match) {
          const varName = match[1];
          const value = varValues[varName];
          if (value) {
            return (
              <mark key={i} className="bg-amber-400/30 text-amber-200 rounded px-0.5 not-italic">
                {value}
              </mark>
            );
          }
          return (
            <mark key={i} className="bg-amber-500/20 text-amber-400 rounded px-0.5 not-italic">
              {part}
            </mark>
          );
        }
        return <span key={i} className="text-slate-100">{part}</span>;
      })}
    </pre>
  );
}

export default function PromptDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [localForks, setLocalForks] = useState<Fork[]>([]);
  const [dbForks, setDbForks] = useState<Fork[]>([]);
  // DBから取得したプロンプト（JSONにない場合）
  const [dbPrompt, setDbPrompt] = useState<Prompt | null>(null);
  const [promptLoading, setPromptLoading] = useState(false);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  // JSONにないIDの場合DBから取得
  const staticPrompt = allPrompts.find((p) => p.id === id);
  useEffect(() => {
    if (!staticPrompt) {
      setPromptLoading(true);
      fetch(`/api/prompts/db/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.prompt) {
            const p = data.prompt;
            setDbPrompt({
              id: p.id,
              title: p.title,
              category: p.category,
              difficulty: p.difficulty,
              aiTools: p.ai_tools ?? [],
              badges: p.badges ?? [],
              description: p.description,
              body: p.body,
              variables: [],
              tips: p.tips ?? [],
              usageCount: p.usage_count ?? 0,
              reviews: [],
              forks: [],
              createdAt: p.created_at.split("T")[0],
            });
          }
        })
        .catch(() => {})
        .finally(() => setPromptLoading(false));
    }
  }, [id, staticPrompt]);

  // Supabaseからレビューとフォークを取得
  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          const reviews: Review[] = data.reviews.map((r: {
            id: string; prompt_id: string; role: string; industry: string;
            comment: string; result: string; rating: number; created_at: string;
          }) => ({
            id: r.id,
            promptId: r.prompt_id,
            authorRole: r.role,
            authorIndustry: r.industry,
            customization: r.comment,
            outcome: r.result,
            aiTool: "ChatGPT" as const,
            rating: r.rating,
            helpfulCount: 0,
            createdAt: r.created_at.split("T")[0],
          }));
          setDbReviews(reviews);
        }
      })
      .catch(() => {});

    fetch(`/api/forks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.forks) {
          const forks: Fork[] = data.forks.map((f: {
            id: string; original_prompt_id: string; title: string;
            body: string; diff_summary: string; author_role: string; created_at: string;
          }) => ({
            id: f.id,
            parentId: f.original_prompt_id,
            title: f.title,
            body: f.body,
            diffSummary: f.diff_summary,
            authorRole: f.author_role,
            usageCount: 0,
            createdAt: f.created_at.split("T")[0],
          }));
          setDbForks(forks);
        }
      })
      .catch(() => {});
  }, [id]);

  const prompt = staticPrompt ?? dbPrompt;

  const filledPrompt = useMemo(() => {
    if (!prompt) return "";
    let result = prompt.body;
    Object.entries(varValues).forEach(([key, value]) => {
      if (value) result = result.replaceAll(`{{${key}}}`, value);
    });
    return result;
  }, [prompt, varValues]);

  const filledCount = useMemo(
    () => Object.values(varValues).filter(Boolean).length,
    [varValues]
  );

  if (promptLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          読み込み中...
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">プロンプトが見つかりませんでした</p>
          <Link href="/" className="text-amber-600 hover:underline">トップに戻る</Link>
        </div>
      </div>
    );
  }

  const allReviews = [...prompt.reviews, ...dbReviews, ...localReviews];
  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      : 0;
  const allForks = [...prompt.forks, ...dbForks, ...localForks];

  const handleCopy = () => {
    navigator.clipboard.writeText(filledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // コピー数をSupabaseに記録
    fetch("/api/prompts/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId: prompt.id }),
    }).catch(() => {});
  };

  const handleReviewSubmit = (data: ReviewFormData) => {
    const newReview: Review = {
      id: `local-${Date.now()}`,
      promptId: prompt.id,
      authorRole: data.authorRole,
      authorIndustry: data.authorIndustry,
      aiTool: data.aiTool,
      outcome: data.outcome,
      customization: data.customization,
      rating: data.rating,
      helpfulCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    // 少し待ってからDBを再取得
    setTimeout(() => {
      fetch(`/api/reviews/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.reviews) {
            const reviews: Review[] = data.reviews.map((r: {
              id: string; prompt_id: string; role: string; industry: string;
              comment: string; result: string; rating: number; created_at: string;
            }) => ({
              id: r.id,
              promptId: r.prompt_id,
              authorRole: r.role,
              authorIndustry: r.industry,
              customization: r.comment,
              outcome: r.result,
              aiTool: "ChatGPT" as const,
              rating: r.rating,
              helpfulCount: 0,
              createdAt: r.created_at.split("T")[0],
            }));
            setDbReviews(reviews);
            setLocalReviews([]);
          }
        })
        .catch(() => {});
    }, 1000);
  };

  const handleForkSubmit = (data: ForkFormData) => {
    const newFork: Fork = {
      id: `fork-local-${Date.now()}`,
      parentId: prompt.id,
      title: data.title,
      body: data.body,
      diffSummary: data.diffSummary,
      authorRole: data.authorRole,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setLocalForks((prev) => [newFork, ...prev]);
    // 少し待ってからDBを再取得
    setTimeout(() => {
      fetch(`/api/forks/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.forks) {
            const forks: Fork[] = data.forks.map((f: {
              id: string; original_prompt_id: string; title: string;
              body: string; diff_summary: string; author_role: string; created_at: string;
            }) => ({
              id: f.id,
              parentId: f.original_prompt_id,
              title: f.title,
              body: f.body,
              diffSummary: f.diff_summary,
              authorRole: f.author_role,
              usageCount: 0,
              createdAt: f.created_at.split("T")[0],
            }));
            setDbForks(forks);
            setLocalForks([]);
          }
        })
        .catch(() => {});
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo-icon.png" alt="AIプロンプト図鑑" className="w-8 h-8" />
            <span className="font-bold text-base">AIプロンプト図鑑</span>
          </Link>
          <span className="text-slate-500">/</span>
          <span className="text-slate-300 text-sm truncate max-w-xs">{prompt.title}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          一覧に戻る
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${categoryColors[prompt.category] ?? categoryColors["その他"]}`}>
                {prompt.category}
              </span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${difficultyColors[prompt.difficulty]}`}>
                {prompt.difficulty}
              </span>
              {prompt.badges.includes("編集部ピック") && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  編集部ピック
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{prompt.title}</h1>
            <p className="text-slate-500 text-sm leading-relaxed">{prompt.description}</p>
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-bold text-slate-900">{allReviews.length}</span>
                <span className="text-slate-500 text-sm">件の成功事例</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {prompt.usageCount.toLocaleString()}回使用
              </div>
              <div className="flex flex-wrap gap-1">
                {prompt.aiTools.map((tool) => (
                  <span key={tool} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">{tool}</span>
                ))}
              </div>
            </div>
          </div>

          {prompt.variables.length > 0 && (
            <div className="px-6 py-5 border-b border-slate-100 bg-amber-50/50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                  変数に値を入力する
                </h2>
                {filledCount > 0 && (
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                    {filledCount}/{prompt.variables.length} 入力済み
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-4">
                入力した値がプロンプト本文にリアルタイムで反映されます。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompt.variables.map((v) => (
                  <div key={v.name} className="bg-white rounded-lg border border-amber-100 p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <code className="text-xs font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {`{{${v.name}}}`}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{v.description}</p>
                    <input
                      type="text"
                      value={varValues[v.name] ?? ""}
                      onChange={(e) => setVarValues((prev) => ({ ...prev, [v.name]: e.target.value }))}
                      placeholder={v.example}
                      className="w-full text-sm border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-slate-300 transition"
                    />
                  </div>
                ))}
              </div>
              {filledCount > 0 && (
                <button onClick={() => setVarValues({})} className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  ✕ 入力をリセット
                </button>
              )}
            </div>
          )}

          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                プロンプト本文
                {filledCount > 0 && (
                  <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    値を反映中
                  </span>
                )}
              </h2>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-all ${
                  copied ? "bg-amber-500 text-white scale-95" : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
                </svg>
                {copied ? "コピーしました！" : filledCount > 0 ? "完成版をコピー" : "コピー"}
              </button>
            </div>
            <PromptBodyRenderer body={prompt.body} varValues={varValues} />
          </div>

          {prompt.tips.length > 0 && (
            <div className="px-6 py-5 border-t border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm mb-3">使い方のヒント</h2>
              <ul className="space-y-2">
                {prompt.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              成功事例レビュー
              <span className="text-base text-slate-500 font-normal">（{allReviews.length}件）</span>
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              事例を投稿
            </button>
          </div>
          {allReviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400">
              <p className="text-sm">まだ成功事例がありません。最初の投稿者になりましょう！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allReviews.map((review) => <ReviewCard key={review.id} review={review} />)}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              派生プロンプト
              <span className="text-base text-slate-500 font-normal">（{allForks.length}件）</span>
            </h2>
            <button
              onClick={() => setShowForkModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              派生版を投稿
            </button>
          </div>
          {allForks.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400">
              <p className="text-sm">まだ派生プロンプトがありません。</p>
              <p className="text-xs mt-1">このプロンプトを改良した版を投稿しましょう。</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">このプロンプトをベースに、別のユーザーがカスタマイズした派生版です。</p>
              <div className="space-y-4">
                {allForks.map((fork) => <ForkCard key={fork.id} fork={fork} />)}
              </div>
            </>
          )}
        </section>
      </main>

      {showModal && (
        <ReviewModal promptId={prompt.id} promptTitle={prompt.title} onClose={() => setShowModal(false)} onSubmit={handleReviewSubmit} />
      )}
      {showForkModal && (
        <ForkSubmitModal originalPromptId={prompt.id} originalTitle={prompt.title} originalBody={prompt.body} onClose={() => setShowForkModal(false)} onSubmit={handleForkSubmit} />
      )}
    </div>
  );
}
