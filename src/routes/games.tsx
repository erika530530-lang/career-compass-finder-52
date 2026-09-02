import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { GameCard, GameRow } from "@/components/game-card";
import { gameCategories, gamesInCategory, publishedGames, type GameCategoryId } from "@/lib/games/data";
import { canonical } from "@/lib/site-config";
import { pageOgImageMeta } from "@/lib/og-pages";

type Search = { cat: GameCategoryId | "all" };

const validCats = new Set<string>(gameCategories.map((c) => c.id));

export const Route = createFileRoute("/games")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const cat = search["cat"];
    return { cat: typeof cat === "string" && validCats.has(cat) ? (cat as GameCategoryId) : "all" };
  },
  head: () => ({
    meta: [
      { title: "ゲーム一覧｜知識・言葉・地理のミニゲーム｜ピクセルポップ" },
      {
        name: "description",
        content:
          "象形文字クイズ・国名当てクイズ・ことわざ由来クイズ。遊んでいたらちょっと賢くなる無料ミニゲームを、知識・言葉・地理などのカテゴリーから選べます。",
      },
      { property: "og:title", content: "ゲーム一覧｜ピクセルポップ" },
      {
        property: "og:description",
        content: "暇つぶしで遊んでいたら、ちょっと賢くなっているミニゲーム集。",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/games") },
      { name: "twitter:card", content: "summary_large_image" },
      ...pageOgImageMeta("games"),
    ],
    links: [{ rel: "canonical", href: canonical("/games") }],
  }),
  component: GamesPage,
});

function GamesPage() {
  const { cat } = Route.useSearch();
  const list = cat === "all" ? publishedGames : gamesInCategory(cat);
  const active = gameCategories.find((c) => c.id === cat);

  const chip = (on: boolean) =>
    `flex min-h-11 shrink-0 items-center rounded-full px-4 text-xs font-black transition-colors ${
      on ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"
    }`;

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-3xl md:px-6 lg:max-w-[1200px] lg:px-8">
        <SiteHeader />

        <h1 className="font-display mt-5 text-2xl font-black text-foreground">ゲームを探す 🕹️</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          遊んでたら、ちょっと賢くなってるやつ。全{publishedGames.length}本。
        </p>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          <Link to="/games" search={{ cat: "all" }} className={chip(cat === "all")}>
            すべて
          </Link>
          {gameCategories.map((c) => (
            <Link key={c.id} to="/games" search={{ cat: c.id }} className={chip(cat === c.id)}>
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>

        {active && (
          <p className="mt-3 px-1 text-[12px] font-bold text-muted-foreground">
            {active.emoji} {active.label}：{active.blurb}
          </p>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="card-surface mt-4 p-6 text-center text-sm text-muted-foreground">
            このカテゴリーのゲームはまだ準備中です。近いうちに増えます 🛠️
            <br />
            とりあえず、こちらでどうぞ。
          </p>
        )}

        {list.length === 0 && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {publishedGames.map((g) => (
              <GameRow key={g.id} game={g} />
            ))}
          </div>
        )}

        <Link
          to="/quizzes"
          search={{ cat: "all", sort: "popular" }}
          className="shadow-lift mx-auto mt-6 flex min-h-12 w-full max-w-sm items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground"
        >
          診断もさがす 🔮
        </Link>

        <SiteFooter />
      </div>
    </main>
  );
}
