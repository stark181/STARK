import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIプロンプト図鑑 - 実践プロンプト一覧";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #EC4899 100%)",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 装飾円 */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.08)",
          }}
        />

        {/* ロゴ行 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🐝
          </div>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 22, fontWeight: 700 }}>
            AIプロンプト図鑑
          </span>
        </div>

        {/* メインキャッチ */}
        <div
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-1px",
            marginBottom: 20,
          }}
        >
          AIプロンプト一覧
        </div>

        {/* サブキャッチ */}
        <div
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: 30,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          ChatGPT・Claude・Gemini 対応{"\n"}実践プロンプト図鑑
        </div>

        {/* バッジ行 */}
        <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
          {["55件以上のプロンプト", "成功事例レビュー付き", "コピペですぐ使える"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 28,
                padding: "12px 28px",
                color: "white",
                fontSize: 19,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            color: "rgba(255,255,255,0.5)",
            fontSize: 20,
          }}
        >
          starkinc.work
        </div>
      </div>
    ),
    { ...size }
  );
}
