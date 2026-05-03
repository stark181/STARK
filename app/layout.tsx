import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto",
});

const SITE_URL = "https://starkinc.work";
const SITE_NAME = "AIプロンプト図鑑";
const OGP_IMAGE = `${SITE_URL}/ogp.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIプロンプト一覧｜ChatGPT・Claude対応 実践プロンプト図鑑",
    template: "%s | AIプロンプト図鑑",
  },
  description:
    "ChatGPT・Claude・Geminiで使えるビジネスプロンプト一覧。営業・経営・マーケ・日常業務など55種類以上の実践プロンプトを無料公開。成功事例レビュー付きで、そのままコピーして使えます。",
  keywords: [
    "プロンプト一覧",
    "AIプロンプト",
    "ChatGPTプロンプト",
    "Claudeプロンプト",
    "プロンプト集",
    "ビジネスプロンプト",
    "プロンプト 営業",
    "プロンプト 経営",
    "プロンプト マーケティング",
    "プロンプト コピペ",
    "AI活用 仕事",
    "プロンプト サラリーマン",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "AIプロンプト一覧｜ChatGPT・Claude対応 実践プロンプト図鑑",
    description:
      "ChatGPT・Claude・Geminiで使えるビジネスプロンプト一覧。営業・経営・マーケ・日常業務など55種類以上を無料公開。成功事例レビュー付きで、そのままコピーして使えます。",
    images: [
      {
        url: OGP_IMAGE,
        width: 1200,
        height: 630,
        alt: "AIプロンプト図鑑 - 実践プロンプト一覧",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIプロンプト一覧｜ChatGPT・Claude対応 実践プロンプト図鑑",
    description:
      "ChatGPT・Claude・Geminiで使えるビジネスプロンプト一覧。55種類以上を無料公開。成功事例レビュー付き。",
    images: [OGP_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "ChatGPT・Claude・Geminiで使えるビジネスプロンプト一覧。成功事例レビュー付きの実践型プロンプト図鑑。",
      inLanguage: "ja",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-icon.png`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}
