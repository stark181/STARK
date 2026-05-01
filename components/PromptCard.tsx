import Link from "next/link";
import { Prompt } from "@/types";

interface PromptCardProps {
  prompt: Prompt;
  searchQuery?: string;
}

/** 検索キーワードにマッチした部分をハイライトして返す */
function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 text-amber-900 rounded-sm px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const categoryColors: Record<string, string> = {
  "営業・提案": "bg-blue-50 text-blue-700 border-blue-200",
  "人事・採用": "bg-green-50 text-green-700 border-green-200",
  "マーケ・SNS": "bg-rose-50 text-rose-700 border-rose-200",
  "経営企画": "bg-violet-50 text-violet-700 border-violet-200",
  "総務・法務": "bg-orange-50 text-orange-700 border-orange-200",
  "その他": "bg-slate-50 text-slate-600 border-slate-200",
};

const difficultyColors: Record<string, string> = {
  初級: "text-teal-700 bg-teal-50",
  中級: "text-amber-700 bg-amber-50",
  上級: "text-red-700 bg-red-50",
};

export default function PromptCard({ prompt, searchQuery }: PromptCardProps) {
  const reviewCount = prompt.reviews.length;
  const avgRating =
    reviewCount > 0
      ? prompt.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  return (
    <Link href={`/prompts/${prompt.id}`} className="block group">
      <article className="bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* バッジ行 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${categoryColors[prompt.category] ?? categoryColors["その他"]}`}>
            {prompt.category}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${difficultyColors[prompt.difficulty]}`}>
            {prompt.difficulty}
          </span>
          {prompt.badges.includes("編集部ピック") && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              編集部ピック
            </span>
          )}
          {prompt.badges.includes("実績バッジ") && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-600 text-white flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              実績あり
            </span>
          )}
          {prompt.badges.includes("人気バッジ") && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              人気急上昇
            </span>
          )}
        </div>

        {/* タイトル */}
        <h2 className="font-bold text-slate-900 text-base mb-2 group-hover:text-amber-700 transition-colors leading-snug">
          <Highlight text={prompt.title} query={searchQuery} />
        </h2>

        {/* 説明文 */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          <Highlight text={prompt.description} query={searchQuery} />
        </p>

        {/* 対応AIタグ */}
        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.aiTools.map((tool) => (
            <span key={tool} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
              {tool}
            </span>
          ))}
        </div>

        {/* フッター統計 */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {/* 成功事例数（目立たせる） */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "text-amber-400" : "text-slate-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-800">{reviewCount}</span>
            <span className="text-xs text-slate-400">件の成功事例</span>
          </div>

          {/* 使用数 */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{prompt.usageCount.toLocaleString()}回使用</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
