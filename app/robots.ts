import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/otherworld/", "/api/"],
      },
    ],
    sitemap: "https://scidust.art/sitemap.xml",
    host: "https://scidust.art",
  }
}
