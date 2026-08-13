import { Link } from "@tanstack/react-router";
import { gameCategories, gamesInCategory } from "@/lib/games/data";
import { categories, type CategoryId } from "@/lib/quizzes/types";
import { quizzes } from "@/lib/quizzes/data";

/**
 * 「今日は何で遊ぶ？」回遊セクション。
 * ゲームカテゴリー（実際に遊べるものだけ）＋診断カテゴリーを1つのグリッドに並べます。
 * 将来カテゴリーが増えても、データ側に足せば自動で出ます。
 */

const quizCatsToShow: CategoryId[] = ["fun", "personality", "work", "love", "money"];

export function PlayPicker() {
  const gameCats = gameCategories.filter((c) => gamesInCategory(c.id).length > 0);

  const tileClass =
    "card-surface flex min-h-20 flex-col justify-center gap-0.5 px-4 py-3 text-left active:scale-[0.98]";

  return (
    <section aria-labelledby="play-picker-heading">
      <h2 id="play-picker-heading" className="font-display px-1 text-base font-black text-foreground">
        🧠 今日は何で遊ぶ？
      </h2>
      <p className="mt-1 px-1 text-[12px] text-muted-foreground">
        気分で選ぶだけ。ぜんぶ登録なしで遊べます。
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {gameCats.map((c) => (
          <Link key={c.id} to="/games" search={{ cat: c.id }} className={tileClass}>
            <span className="text-xl" aria-hidden>
              {c.emoji}
            </span>
            <span className="text-sm font-black text-foreground">{c.label}で遊ぶ</span>
            <span className="text-[11px] leading-snug text-muted-foreground">{c.blurb}</span>
          </Link>
        ))}

        {quizCatsToShow.map((id) => {
          const c = categories.find((x) => x.id === id);
          if (!c || !quizzes.some((q) => q.category === id)) return null;
          return (
            <Link
              key={c.id}
              to="/quizzes"
              search={{ cat: c.id, sort: "popular" }}
              className={tileClass}
            >
              <span className="text-xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="text-sm font-black text-foreground">{c.label}を診断する</span>
              <span className="text-[11px] leading-snug text-muted-foreground">{c.tagline}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
