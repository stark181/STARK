"use client";

import { useState, useEffect, useMemo } from "react";
import { Category, Difficulty, AiTool } from "@/types";

interface PromptSubmitModalProps {
  onClose: () => void;
}

interface VariableDef {
  name: string;
  description: string;
  example: string;
}

interface PromptFormData {
  title: string;
  category: Category;
  difficulty: Difficulty;
  aiTools: AiTool[];
  description: string;
  body: string;
  tips: string;
}

const categories: Category[] = [
  "営業・提案",
  "人事・採用",
  "マーケ・SNS",
  "経営企画",
  "総務・法務",
  "その他",
];

const difficulties: Difficulty[] = ["初級", "中級", "上級"];
const aiToolOptions: AiTool[] = ["ChatGPT", "Claude", "Gemini", "共通"];

// {{変数名}} を本文から自動検出（重複除去）
function detectVariables(body: string): string[] {
  const matches = body.match(/\{\{([^}]+)\}\}/g) ?? [];
  return [...new Set(matches.map((m) => m.replace(/^\{\{|\}\}$/g, "").trim()))];
}

// プレビュー：例文を本文に反映して表示
function BodyPreview({
  body,
  variables,
}: {
  body: string;
  variables: VariableDef[];
}) {
  const parts = body.split(/(\{\{[^}]+\}\})/g);
  return (
    <pre className="bg-slate-900 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono max-h-60">
      {parts.map((part, i) => {
        const match = part.match(/^\{\{([^}]+)\}\}$/);
        if (match) {
          const varName = match[1].trim();
          const varDef = variables.find((v) => v.name === varName);
          const example = varDef?.example?.trim();
          if (example) {
            return (
              <mark key={i} className="bg-amber-400/30 text-amber-300 rounded px-0.5 not-italic">
                {example}
              </mark>
            );
          }
          return (
            <mark key={i} className="bg-amber-500/20 text-amber-400 rounded px-0.5 not-italic">
              {part}
            </mark>
          );
        }
        return <span key={i} className="text-slate-200">{part}</span>;
      })}
    </pre>
  );
}

export default function PromptSubmitModal({ onClose }: PromptSubmitModalProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState<PromptFormData>({
    title: "",
    category: "営業・提案",
    difficulty: "初級",
    aiTools: ["ChatGPT"],
    description: "",
    body: "",
    tips: "",
  });

  // 変数定義リスト（本文から自動検出 → ユーザーが説明・例を入力）
  const [variables, setVariables] = useState<VariableDef[]>([]);

  // 本文が変わるたびに変数を自動検出・同期
  useEffect(() => {
    const detected = detectVariables(form.body);
    setVariables((prev) =>
      detected.map((name) => {
        const existing = prev.find((v) => v.name === name);
        return existing ?? { name, description: "", example: "" };
      })
    );
  }, [form.body]);

  const hasVariables = variables.length > 0;

  // ステップ定義（変数がある場合のみ「変数設定」ステップを挿入）
  const STEPS = useMemo(
    () =>
      hasVariables
        ? (["基本情報", "プロンプト本文", "変数設定", "確認"] as const)
        : (["基本情報", "プロンプト本文", "確認"] as const),
    [hasVariables]
  );

  const toggleAiTool = (tool: AiTool) => {
    setForm((prev) => ({
      ...prev,
      aiTools: prev.aiTools.includes(tool)
        ? prev.aiTools.filter((t) => t !== tool)
        : [...prev.aiTools, tool],
    }));
  };

  const updateVariable = (name: string, field: "description" | "example", value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.name === name ? { ...v, [field]: value } : v))
    );
  };

  const canGoNext = () => {
    if (step === 0) return form.title.trim() && form.description.trim() && form.aiTools.length > 0;
    if (step === 1) return form.body.trim().length >= 20;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          difficulty: form.difficulty,
          aiTools: form.aiTools,
          description: form.description,
          promptBody: form.body,
          tips: form.tips,
          variables: variables.length > 0 ? variables : undefined,
        }),
      });
      if (!res.ok) throw new Error("送信失敗");
      setSubmitted(true);
    } catch {
      setSubmitError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  // 変数ステップのインデックス（動的）
  const varStepIndex = hasVariables ? 2 : -1;
  const confirmStepIndex = hasVariables ? 3 : 2;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* モーダル本体 */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* ヘッダー */}
        <div className="bg-slate-900 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-base">プロンプトを投稿する</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* ステッパー */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 ${i <= step ? "text-amber-400" : "text-slate-500"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                    i < step
                      ? "bg-amber-500 border-amber-500 text-white"
                      : i === step
                      ? "border-amber-400 text-amber-400"
                      : "border-slate-600 text-slate-600"
                  }`}>
                    {i < step ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 sm:w-8 ${i < step ? "bg-amber-500" : "bg-slate-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          /* 完了画面 */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">投稿ありがとうございます！</h3>
            <p className="text-slate-500 text-sm mb-1">プロンプトを受け付けました。</p>
            <p className="text-slate-400 text-xs mb-8">編集部の審査後、公開されます（通常1〜2営業日）。</p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              閉じる
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">

              {/* ===== STEP 0: 基本情報 ===== */}
              {step === 0 && (
                <div className="px-6 py-5 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="例：提案書エグゼクティブサマリー生成"
                      maxLength={60}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">{form.title.length}/60</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">カテゴリ</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">難易度</label>
                      <select
                        value={form.difficulty}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      対応AIツール <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {aiToolOptions.map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleAiTool(tool)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            form.aiTools.includes(tool)
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      説明文 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      maxLength={120}
                      placeholder="例：商談メモを貼り付けるだけで、意思決定者向けサマリーを自動生成します。"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/120</p>
                  </div>
                </div>
              )}

              {/* ===== STEP 1: プロンプト本文 ===== */}
              {step === 1 && (
                <div className="px-6 py-5 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      プロンプト本文 <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-400 mb-2">
                      変数は{" "}
                      <code className="bg-slate-100 px-1 rounded text-amber-700 font-mono">{`{{変数名}}`}</code>{" "}
                      の形式で記述すると、次のステップで説明・例文を設定できます。
                    </p>
                    <textarea
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      rows={10}
                      placeholder={"例：あなたは一流のビジネスコンサルタントです。\n以下の情報をもとに、{{会社名}}の意思決定者向けサマリーを作成してください。\n\n## 前提情報\n- 製品・サービス: {{製品名}}\n- 相手企業の課題: {{課題}}"}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-mono"
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">{form.body.length}文字</p>
                  </div>

                  {/* 変数検出バッジ */}
                  {variables.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-1">
                          {variables.length}個の変数を検出しました
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {variables.map((v) => (
                            <code key={v.name} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono">
                              {`{{${v.name}}}`}
                            </code>
                          ))}
                        </div>
                        <p className="text-xs text-amber-600 mt-1.5">次のステップで各変数の説明と入力例を設定できます。</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      使い方のヒント
                      <span className="text-slate-400 font-normal ml-1">（任意・改行区切りで複数入力可）</span>
                    </label>
                    <textarea
                      value={form.tips}
                      onChange={(e) => setForm({ ...form, tips: e.target.value })}
                      rows={3}
                      placeholder={"例：\n変数を埋める前に商談メモを整理しておくと精度が上がります\n出力後、数字・固有名詞は必ず確認してください"}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ===== STEP 2（変数あり）: 変数設定 ===== */}
              {step === varStepIndex && varStepIndex !== -1 && (
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-slate-800">変数の説明と入力例を設定</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    各変数の「説明」と「入力例」を設定してください。入力例は確認画面のプレビューに反映されます。
                  </p>

                  <div className="space-y-3">
                    {variables.map((v) => (
                      <div key={v.name} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                        {/* 変数名ラベル */}
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                            {`{{${v.name}}}`}
                          </code>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              説明 <span className="font-normal text-slate-400">（この変数に何を入れるか）</span>
                            </label>
                            <input
                              type="text"
                              value={v.description}
                              onChange={(e) => updateVariable(v.name, "description", e.target.value)}
                              placeholder={`例：提案先の企業名`}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                              入力例 <span className="font-normal text-slate-400">（サンプル値・プレビューに反映）</span>
                            </label>
                            <input
                              type="text"
                              value={v.example}
                              onChange={(e) => updateVariable(v.name, "example", e.target.value)}
                              placeholder={`例：株式会社ABC`}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ライブプレビュー */}
                  {variables.some((v) => v.example) && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                        入力例を反映したプレビュー
                      </p>
                      <BodyPreview body={form.body} variables={variables} />
                    </div>
                  )}
                </div>
              )}

              {/* ===== 確認ステップ ===== */}
              {step === confirmStepIndex && (
                <div className="px-6 py-5 space-y-4">
                  <p className="text-sm text-slate-500">以下の内容で投稿します。確認してください。</p>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                        {form.category}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                        {form.difficulty}
                      </span>
                      {form.aiTools.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">{t}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-slate-900">{form.title}</h3>
                    <p className="text-sm text-slate-500">{form.description}</p>
                  </div>

                  {/* 変数一覧 */}
                  {variables.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">変数設定（{variables.length}個）</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {variables.map((v) => (
                          <div key={v.name} className="bg-amber-50 rounded-lg border border-amber-100 p-2.5">
                            <code className="text-xs font-mono text-amber-700">{`{{${v.name}}}`}</code>
                            {v.description && <p className="text-xs text-slate-500 mt-1">{v.description}</p>}
                            {v.example && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                入力例：<span className="text-amber-700 font-medium">{v.example}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 本文プレビュー（例文反映） */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      プロンプト本文プレビュー
                      {variables.some((v) => v.example) && (
                        <span className="ml-2 text-amber-600 font-normal">（入力例を反映中）</span>
                      )}
                    </p>
                    <BodyPreview body={form.body} variables={variables} />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700">
                      投稿後、編集部の審査を経て公開されます。スパムや著作権侵害コンテンツは掲載できません。
                    </p>
                  </div>
                  {submitError && (
                    <p className="text-xs text-red-600 text-center">{submitError}</p>
                  )}
                </div>
              )}
            </div>

            {/* フッター */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
                className="px-5 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                {step === 0 ? "キャンセル" : "← 戻る"}
              </button>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step ? "bg-amber-500" : i < step ? "bg-amber-300" : "bg-slate-300"}`} />
                  ))}
                </div>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canGoNext()}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    次へ →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    {submitting ? "送信中…" : "投稿する"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
