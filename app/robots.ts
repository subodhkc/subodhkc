import { MetadataRoute } from "next";

const USER_AGENTS = [
  "*",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Applebot",
  "Applebot-Extended",
  "Bytespider",
  "Diffbot",
  "Omgilibot",
  "Omgili",
  "YouBot",
  "Amazonbot",
  "AI2Bot",
  "PiplBot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://subodhkc.com";
  const disallow = ["/api/", "/private/", "/dashboard/", "/centaurus/", "/app/", "/heb-chamber"];

  return {
    rules: USER_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
