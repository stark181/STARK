import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/design-preview"],
      },
    ],
    sitemap: "https://starkinc.work/sitemap.xml",
    host: "https://starkinc.work",
  };
}
