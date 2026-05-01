import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* ミニヘッダー */}
      <header className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo-icon.svg" alt="AIプロンプト図鑑" className="w-8 h-8" />
            <span className="font-bold text-white text-base">AIプロンプト図鑑</span>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 イラスト */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-16 h-16 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
              404
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            ページが見つかりません
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            お探しのプロンプトは削除されたか、<br />
            URLが間違っている可能性があります。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              トップに戻る
            </Link>
            <Link
              href="/?category=営業・提案"
              className="inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              人気プロンプトを見る
            </Link>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="py-6 text-center text-slate-400 text-xs">
        © 2025 AIプロンプト図鑑
      </footer>
    </div>
  );
}
