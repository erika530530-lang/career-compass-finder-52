import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { quizzes } from "@/lib/quizzes/data";
import { publishedGames } from "@/lib/games/data";
import { allQuizResultPaths } from "@/lib/quizzes/result-og";

import { SITE_URL } from "@/lib/site-config";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/quizzes", changefreq: "daily", priority: "0.9" },
          { path: "/games", changefreq: "daily", priority: "0.9" },
          ...quizzes.map((q) => ({
            path: q.kind === "custom" && q.customPath ? q.customPath : `/quiz/${q.id}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...allQuizResultPaths().map((path) => ({
            path,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...publishedGames.map((g) => ({
            path: g.path,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),

          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.3" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
