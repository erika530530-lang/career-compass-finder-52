import { createFileRoute, Link } from "@tanstack/react-router";
import { newestQuizzes, popularQuizzes } from "@/lib/quizzes/data";
import { QuizCard, QuizRow } from "@/components/quiz-card";
import { CategoryStrip } from "@/components/category-strip";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GameCard, GameRow } from "@/components/game-card";
import { DailyQuiz } from "@/components/daily-quiz";
import { PlayStreakBadge } from "@/components/play-streak";
import { HomeHero } from "@/components/home-hero";
import { PlayPicker } from "@/components/play-picker";
import { publishedGames } from "@/lib/games/data";
import { canonical } from "@/lib/site-config";

const TITLE = "ピクセルポップ｜診断・クイズ・ミニゲームで暇つぶし";
const DESCRIPTION =
  "診断、クイズ、ミニゲームを気軽に楽しめるピクセルポップ。遊んでいるうちに、ちょっと賢くなれる暇つぶしサイトです。登録不要・無料で1分から遊べます。";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
  component: Home,
});

function SectionHead({
  title,
  note,
  moreTo,
  moreLabel,
}: {
  title: string;
  note: string;
  moreTo?: "games" | "quizzes";
  moreLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <h2 className="font-display text-base font-black text-foreground md:text-lg">{title}</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{note}</p>
      </div>
      {moreTo === "games" && (
        <Link
          to="/games"
          search={{ cat: "all" }}
          className="shrink-0 text-[11px] font-black text-primary underline"
        >
          {moreLabel}
        </Link>
      )}
      {moreTo === "quizzes" && (
        <Link
          to="/quizzes"
          search={{ cat: "all", sort: "popular" }}
          className="shrink-0 text-[11px] font-black text-primary underline"
        >
          {moreLabel}
        </Link>
      )}
    </div>
  );
}

function Home() {
  const featured = popularQuizzes.slice(0, 3);
  const shown = new Set(featured.map((q) => q.id));
  const rest = popularQuizzes.filter((q) => !shown.has(q.id));

  // 新着は診断とゲームを混ぜて、新しい順に。
  const newItems = [
    ...publishedGames.map((g) => ({ kind: "game" as const, createdAt: g.createdAt, game: g })),
    ...newestQuizzes
      .slice(0, 6)
      .map((q) => ({ kind: "quiz" as const, createdAt: q.createdAt, quiz: q })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-3xl md:px-6 lg:max-w-[1160px] lg:px-8">
        <SiteHeader tagline={false} />
        <HomeHero />
        <PlayStreakBadge />

        <div className="mt-6">
          <CategoryStrip />
        </div>

        <div className="mt-6 lg:mx-auto lg:max-w-2xl">
          <DailyQuiz />
          <p className="mt-2 px-1 text-center text-[12px] text-muted-foreground">
            1問だけ、やってみる？ 同じ日は同じ問題、明日は別の問題です。
          </p>
        </div>

        <div className="mt-9">
          <SectionHead
            title="🎮 人気のミニゲーム"
            note="遊んでたら、ちょっと賢くなってるやつ。"
            moreTo="games"
            moreLabel="ゲーム一覧へ"
          />
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publishedGames.map((g) => (
              <GameCard key={g.id} game={g} location="home_popular_games" />
            ))}
          </div>
        </div>

        <div className="mt-9">
          <SectionHead
            title="🔮 診断してみる？"
            note="1〜2分で終わる、自分のことがわかる系。"
            moreTo="quizzes"
            moreLabel="診断一覧へ"
          />
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((q, i) => (
              <QuizCard key={q.id} quiz={q} rank={i + 1} location="home_quizzes_featured" />
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((q) => (
              <QuizRow key={q.id} quiz={q} location="home_quizzes_rest" />
            ))}
          </div>
        </div>

        <div className="mt-9">
          <PlayPicker />
        </div>

        <div className="mt-9">
          <SectionHead title="🆕 新着" note="新しく増えたゲームと診断。" />
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {newItems.map((item) =>
              item.kind === "game" ? (
                <GameRow key={`g-${item.game.id}`} game={item.game} location="home_new" />
              ) : (
                <QuizRow key={`q-${item.quiz.id}`} quiz={item.quiz} location="home_new" />
              ),
            )}
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to="/games"
            search={{ cat: "all" }}
            className="shadow-lift flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-primary-foreground sm:min-w-56"
          >
            ゲームで遊ぶ 🕹️
          </Link>
          <Link
            to="/quizzes"
            search={{ cat: "all", sort: "popular" }}
            className="flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-black text-foreground sm:min-w-56"
          >
            診断する 🔮
          </Link>
        </div>

        <p className="mt-8 text-center text-[12px] font-bold text-muted-foreground">
          また暇なときにどうぞ。🎈
        </p>

        <SiteFooter />
      </div>
    </main>
  );
}
