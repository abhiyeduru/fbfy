import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/2244", "/api/"],
      },
      // Give full access to AI Search Crawlers (AEO for GPTBot, Perplexity, Claude, Applebot)
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Applebot"],
        allow: "/",
        disallow: ["/2244"],
      },
    ],
    sitemap: "https://www.fbfy.in/sitemap.xml",
  };
}
