import { createFileRoute, Link } from "@tanstack/react-router";
import { newestQuizzes, popularQuizzes } from "@/lib/quizzes/data";
import { categories, type CategoryId } from "@/lib/quizzes/types";
import { QuizRow } from "@/components/quiz-card";
import { SiteFooter, SiteHeader } from "@/components/site-header";

type Search = { cat: CategoryId | "all"; sort: "popular" | "new" };

export const Route = createFileRoute("/quizzes")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    cat: (search['cat'] as Search['cat']) ?? "all",
    sort: search['sort'] === 'new' ? "new" : "popular",
  }),
  head: () => ({
    meta: [
      { title: "診断を探す | ピクセルポップ" },
      {
        name: "description",
        content:
          "仕事・性格・恋愛・お金・人間関係・ネタ・将来。ピクセルポップの診断を人気順や新着順、カテゴリー別に探せます。",
      },
      { property: "og:title", content: "診断を探す | ピクセルポップ" },
      {
        property: "og:description",
        content: "暇つぶしにちょうどいい診断を人気順・新着順・カテゴリー別に探そう。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizzesPage,
});

function QuizzesPage() {
  const { cat, sort } = Route.useSearch();
  const base = sort === "new" ? newestQuizzes : popularQuizzes;
  const list = cat === "all" ? base : base.filter((q) => q.category === cat);

  const chip = (activeState: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-xs font-black transition-colors ${
      activeState
        ? "bg-primary text-primary-foreground"
        : "border border-border bg-card text-foreground"
    }`;

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader />

        <h1 className="font-display mt-5 text-2xl font-black text-foreground">診断を探す 🔍</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          全{popularQuizzes.length}件。気になったやつから、どうぞ。
        </p>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Link to="/quizzes" search={{ cat: "all", sort: "popular" }} className={chip(cat === "all" && sort === "popular")}>
            すべて
          </Link>
          <Link to="/quizzes" search={{ cat, sort: "popular" }} className={chip(sort === "popular" && cat !== "all")}>
            🔥 人気順
          </Link>
          <Link to="/quizzes" search={{ cat, sort: "new" }} className={chip(sort === "new")}>
            🆕 新着順
          </Link>
        </div>

        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/quizzes"
              search={{ cat: c.id, sort }}
              className={chip(cat === c.id)}
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {list.map((q) => (
            <QuizRow key={q.id} quiz={q} />
          ))}
          {list.length === 0 && (
            <p className="card-surface p-6 text-center text-sm text-muted-foreground">
              このカテゴリーの診断はまだ準備中。近日追加します 🛠️
            </p>
          )}
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
