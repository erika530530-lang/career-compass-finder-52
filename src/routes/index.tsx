import { createFileRoute, Link } from "@tanstack/react-router";
import { newestQuizzes, popularQuizzes } from "@/lib/quizzes/data";
import { QuizCard, QuizRow } from "@/components/quiz-card";
import { CategoryStrip } from "@/components/category-strip";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GameCard } from "@/components/game-card";
import { DailyQuiz } from "@/components/daily-quiz";
import { PlayStreakBadge } from "@/components/play-streak";
import { publishedGames } from "@/lib/games/data";
import { canonical } from "@/lib/site-config";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ピクセルポップ | 暇つぶしできる診断、いっぱいあります。" },
      {
        name: "description",
        content:
          "診断・漢字・ことわざ・国旗の知識クイズが遊べる暇つぶしサイト。毎日かわる「今日のピクセルクイズ」つき。無料・登録不要で結果をシェアできます。",
      },
      { property: "og:title", content: "ピクセルポップ | 暇つぶしできる診断、いっぱいあります。" },
      {
        property: "og:description",
        content: "1〜3分で終わる診断が集まったサイト。無料・登録不要で結果をシェアしよう。",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
  component: Home,
});

function Home() {
  const featured = popularQuizzes.slice(0, 3);
  const newest = newestQuizzes.filter((q) => !featured.includes(q)).slice(0, 4);
  const shown = new Set([...featured, ...newest].map((q) => q.id));
  const rest = popularQuizzes.filter((q) => !shown.has(q.id));

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-3xl md:px-6 lg:max-w-[1200px] lg:px-8">
        <SiteHeader />
        <PlayStreakBadge />
        <CategoryStrip />

        <h1 className="font-display mt-5 px-1 text-xl font-black leading-snug text-foreground">
          暇つぶしで遊んで、ちょっと賢くなる 🎈
        </h1>
        <p className="mt-1 px-1 text-[12px] text-muted-foreground">
          診断・知識クイズ・ことわざ・漢字・地理。無料・登録不要で、1問からどうぞ。
        </p>

        <div className="mt-4">
          <DailyQuiz />
        </div>

        <div className="mt-7 flex items-end justify-between px-1">
          <h2 className="font-display text-base font-black text-foreground">
            あそべる知識ゲーム 🎮
          </h2>
          <Link
            to="/games"
            search={{ cat: "all" }}
            className="text-[11px] font-black text-primary underline"
          >
            ゲーム一覧へ
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center">
          {publishedGames.map((g) => (
            <div key={g.id} className="w-full md:max-w-sm md:flex-1">
              <GameCard game={g} />
            </div>
          ))}
        </div>

        <h2 className="font-display mt-7 px-1 text-base font-black text-foreground">
          いま人気の診断 🔥
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((q, i) => (
            <QuizCard key={q.id} quiz={q} rank={i + 1} />
          ))}
        </div>


        <h2 className="font-display mt-7 px-1 text-base font-black text-foreground">
          新着の診断 🆕
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {newest.map((q) => (
            <QuizRow key={q.id} quiz={q} />
          ))}
        </div>

        <h2 className="font-display mt-7 px-1 text-base font-black text-foreground">
          ぜんぶの診断 📚
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((q) => (
            <QuizRow key={q.id} quiz={q} />
          ))}
        </div>

        <Link
          to="/quizzes"
          search={{ cat: "all", sort: "popular" }}
          className="shadow-lift mx-auto mt-6 block w-full max-w-sm rounded-full bg-primary py-3.5 text-center text-sm font-black text-primary-foreground"
        >
          カテゴリーから探す
        </Link>
        <Link
          to="/games"
          search={{ cat: "all" }}
          className="mx-auto mt-2 block w-full max-w-sm rounded-full border border-border bg-card py-3.5 text-center text-sm font-black text-foreground"
        >
          知識ゲームを探す 🕹️
        </Link>

        <SiteFooter />
      </div>
    </main>
  );
}
