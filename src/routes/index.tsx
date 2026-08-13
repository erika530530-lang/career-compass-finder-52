import { createFileRoute, Link } from "@tanstack/react-router";
import { newestQuizzes, popularQuizzes } from "@/lib/quizzes/data";
import { QuizCard, QuizRow } from "@/components/quiz-card";
import { CategoryStrip } from "@/components/category-strip";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ピクセルポップ | 暇つぶしできる診断、いっぱいあります。" },
      {
        name: "description",
        content:
          "適職・性格・恋愛・お金・人間関係。1〜3分で終わる診断を無料・登録不要で。結果はそのままシェアできます。",
      },
      { property: "og:title", content: "ピクセルポップ | 暇つぶしできる診断、いっぱいあります。" },
      {
        property: "og:description",
        content: "1〜3分で終わる診断が集まったサイト。無料・登録不要で結果をシェアしよう。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = popularQuizzes.slice(0, 3);
  const rest = popularQuizzes.slice(3);

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader />
        <CategoryStrip />

        <h1 className="font-display mt-5 px-1 text-xl font-black leading-snug text-foreground">
          いま人気の診断 🔥
        </h1>
        <div className="mt-3 flex flex-col gap-4">
          {featured.map((q, i) => (
            <QuizCard key={q.id} quiz={q} rank={i + 1} />
          ))}
        </div>

        <h2 className="font-display mt-7 px-1 text-base font-black text-foreground">
          新着の診断 🆕
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {newestQuizzes.slice(0, 4).map((q) => (
            <QuizRow key={q.id} quiz={q} />
          ))}
        </div>

        <h2 className="font-display mt-7 px-1 text-base font-black text-foreground">
          ぜんぶの診断 📚
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {rest.map((q) => (
            <QuizRow key={q.id} quiz={q} />
          ))}
        </div>

        <Link
          to="/quizzes"
          search={{ cat: "all", sort: "popular" }}
          className="shadow-lift mt-5 block rounded-full bg-primary py-3.5 text-center text-sm font-black text-primary-foreground"
        >
          カテゴリーから探す
        </Link>

        <SiteFooter />
      </div>
    </main>
  );
}
