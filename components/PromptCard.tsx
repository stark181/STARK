import Link from "next/link";
import { Prompt } from "@/types";

interface PromptCardProps {
  prompt: Prompt;
  searchQuery?: string;
  dbReviewCount?: number;
  dbRatingTotal?: { sum: number; count: number };
  dbUsageCount?: number;
}

function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-violet-100 text-violet-800 rounded-sm px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const categoryBar: Record<string, string> = {
  "営業・提案": "from-blue-400 to-violet-500",
  "人事・採用": "from-emerald-400 to-teal-500",
  "マーケ・SNS": "from-orange-400 to-pink-500",
  "経営企画": "from-violet-400 to-purple-500",
  "総務・法務": "from-slate-400 to-gray-500",
  "その他": "from-gray-300 to-slate-400",
};

const categoryColors: Record<string, string> = {
  "営業・提案": "bg-blue-50 text-blue-600",
  "人事・採用": "bg-emerald-50 text-emerald-600",
  "マーケ・SNS": "bg-orange-50 text-orange-600",
  "経営企画": "bg-violet-50 text-violet-600",
  "総務・法務": "bg-slate-50 text-slate-600",
  "その他": "bg-gray-50 text-gray-500",
};

const difficultyColors: Record<string, string> = {
  初級: "bg-green-50 text-green-600",
  中級: "bg-amber-50 text-amber-600",
  上級: "bg-red-50 text-red-600",
};

export default function PromptCard({ prompt, searchQuery, dbReviewCount = 0, dbRatingTotal, dbUsageCount = 0 }: PromptCardProps) {
  const reviewCount = prompt.reviews.length + dbReviewCount;
  const jsonRatingSum = prompt.reviews.reduce((sum, r) => sum + r.rating, 0);
  const totalRatingSum = jsonRatingSum + (dbRatingTotal?.sum ?? 0);
  const avgRating = reviewCount > 0 ? totalRatingSum / reviewCount : 0;
  const totalUsage = prompt.usageCount + dbUsageCount;

  const bar = categoryBar[prompt.category] ?? "from-gray-300 to-slate-400";

  return (
    <Link href={`/prompts/${prompt.id}`} className="block group">
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 h-full flex flex-col">
        {/* カラーバー */}
        <div className={`h-1 rounded-full bg-gradient-to-r ${bar} mb-4`} />

        {/* バッジ行 */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[prompt.category] ?? "bg-gray-50 text-gray-500"}`}>
            {prompt.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[prompt.difficulty] ?? "bg-gray-50 text-gray-500"}`}>
            {prompt.difficulty}
          </span>
          {prompt.badges.includes("編集部ピック") && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-600 flex items-center gap-1">
              ✦ 編集部ピック
            </span>
          )}
          {prompt.badges.includes("実績バッジ") && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600">
              実績あり
            </span>
          )}
          {prompt.badges.includes("人気バッジ") && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600">
              人気急上昇
            </span>
          )}
        </div>

        {/* タイトル */}
        <h2 className="font-bold text-gray-900 text-base mb-2 group-hover:text-violet-600 transition-colors leading-snug">
          <Highlight text={prompt.title} query={searchQuery} />
        </h2>

        {/* 説明文 */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          <Highlight text={prompt.description} query={searchQuery} />
        </p>

        {/* AIタグ */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {prompt.aiTools.map((tool) => (
            <span key={tool} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
              {tool}
            </span>
          ))}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "text-amber-400" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">{reviewCount}</span>
            <span className="text-xs text-gray-400">件の成功事例</span>
          </div>
          <span className="text-xs text-gray-400">{totalUsage.toLocaleString()}回使用</span>
        </div>
      </article>
    </Link>
  );
}
