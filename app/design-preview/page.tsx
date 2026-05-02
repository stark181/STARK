"use client";

// デザインプレビュー専用ページ（本番には影響しない）

const sampleCards = [
  {
    id: 1,
    category: "営業・提案",
    difficulty: "中級",
    title: "提案書を3分で仕上げるプロンプト",
    description: "競合比較・ベネフィット整理・クロージング文言を自動生成。営業資料作成の時間を80%削減。",
    aiTools: ["ChatGPT", "Claude"],
    reviews: 12,
    usage: 2400,
    badge: "編集部ピック",
    accentFrom: "from-blue-400",
    accentTo: "to-violet-500",
  },
  {
    id: 2,
    category: "人事・採用",
    difficulty: "初級",
    title: "求人票を即戦力に刺さる文章に変換",
    description: "ターゲット人材の言葉に合わせた求人票に自動リライト。応募数が平均2.3倍に。",
    aiTools: ["ChatGPT"],
    reviews: 8,
    usage: 1800,
    badge: "実績あり",
    accentFrom: "from-emerald-400",
    accentTo: "to-teal-500",
  },
  {
    id: 3,
    category: "マーケ・SNS",
    difficulty: "初級",
    title: "バズるX投稿を量産するフレームワーク",
    description: "エンゲージメント率の高い投稿パターンを学習。毎日のSNS運用を10分に圧縮。",
    aiTools: ["ChatGPT", "Gemini"],
    reviews: 21,
    usage: 5200,
    badge: "人気急上昇",
    accentFrom: "from-orange-400",
    accentTo: "to-pink-500",
  },
];

const categoryConfig: Record<string, string> = {
  "営業・提案": "bg-blue-50 text-blue-600",
  "人事・採用": "bg-emerald-50 text-emerald-600",
  "マーケ・SNS": "bg-orange-50 text-orange-600",
};

const badgeConfig: Record<string, string> = {
  "編集部ピック": "bg-violet-50 text-violet-600",
  "実績あり": "bg-teal-50 text-teal-600",
  "人気急上昇": "bg-rose-50 text-rose-600",
};

const difficultyConfig: Record<string, string> = {
  "初級": "bg-green-50 text-green-600",
  "中級": "bg-amber-50 text-amber-600",
  "上級": "bg-red-50 text-red-600",
};

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 flex items-center justify-center shadow-sm">
                <img src="/logo-icon.png" alt="logo" className="w-7 h-7 rounded-md" />
              </div>
              <span className="font-bold text-gray-900 text-base tracking-tight">AIプロンプト図鑑</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {["カテゴリ", "人気順", "新着"].map((item) => (
                <a key={item} href="#" className="px-4 py-2 rounded-full text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-medium">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-all font-medium">
                ログイン
              </button>
              <button className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white hover:opacity-90 transition-opacity shadow-sm">
                + 投稿する
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* 左：テキスト＋検索 */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse"></span>
              実践知が集まるAIプロンプトプラットフォーム
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-3">
              「実際に試して{" "}
              <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                うまくいった
              </span>」<br />
              プロンプトが集まる場所
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              職種・業種・成果が明記された成功事例レビュー付き。試した人の体験が積み重なる、実践型プロンプト図鑑。
            </p>
            {/* 検索バー */}
            <div className="flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="職種・用途・キーワードで検索..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
                />
              </div>
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
                検索
              </button>
            </div>
          </div>

          {/* 右：統計 */}
          <div className="flex sm:flex-col gap-4 sm:gap-3 shrink-0">
            {[
              { label: "プロンプト数", value: "15件", color: "text-blue-500" },
              { label: "成功事例", value: "33件", color: "text-violet-500" },
              { label: "総使用回数", value: "25.8K", color: "text-pink-500" },
            ].map((s) => (
              <div key={s.label} className="text-center sm:text-right">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* カテゴリフィルター */}
      <section className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {["すべて", "営業・提案", "人事・採用", "マーケ・SNS", "経営企画", "総務・法務"].map((cat, i) => (
              <button
                key={cat}
                className={`shrink-0 text-sm px-5 py-2 rounded-full font-semibold transition-all ${
                  i === 0
                    ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 font-medium">15件</span>
              <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white font-medium">
                <option>成功事例数順</option>
                <option>使用回数順</option>
                <option>新着順</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* カードグリッド */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-base font-bold text-gray-900">営業・提案</h2>
          <span className="text-xs font-bold text-violet-500 bg-violet-50 px-2.5 py-0.5 rounded-full">3件</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleCards.map((card) => (
            <article key={card.id} className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200">
              {/* カラーバー */}
              <div className={`h-1 rounded-full bg-gradient-to-r ${card.accentFrom} ${card.accentTo} mb-4 opacity-80`} />

              {/* バッジ行 */}
              <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryConfig[card.category] ?? "bg-gray-50 text-gray-500"}`}>
                  {card.category}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyConfig[card.difficulty] ?? "bg-gray-50 text-gray-500"}`}>
                  {card.difficulty}
                </span>
                {card.badge && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeConfig[card.badge] ?? "bg-gray-50 text-gray-500"}`}>
                    ✦ {card.badge}
                  </span>
                )}
              </div>

              {/* タイトル */}
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-violet-600 transition-colors leading-snug">
                {card.title}
              </h3>

              {/* 説明 */}
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                {card.description}
              </p>

              {/* AIタグ */}
              <div className="flex gap-1.5 mb-4">
                {card.aiTools.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-400 font-medium border border-gray-100">{t}</span>
                ))}
              </div>

              {/* フッター */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{card.reviews}</span>
                  <span className="text-xs text-gray-400">件の成功事例</span>
                </div>
                <span className="text-xs text-gray-400">{card.usage.toLocaleString()}回使用</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -translate-x-12 translate-y-12" />
          <div className="relative">
            <div className="text-4xl mb-4">✦</div>
            <h2 className="text-2xl font-extrabold mb-3">あなたの成功事例をシェアしよう</h2>
            <p className="text-white/70 text-sm mb-8">うまくいったプロンプトを投稿して、同じ悩みを持つ人を助けよう。</p>
            <button className="bg-white text-violet-600 font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-colors shadow-lg">
              プロンプトを投稿する
            </button>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-10 text-center text-gray-300 text-sm">
        © 2025 AIプロンプト図鑑
      </footer>
    </div>
  );
}
