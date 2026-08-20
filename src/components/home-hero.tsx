import { Link } from "@tanstack/react-router";
import { ArrowDown, Gamepad2 } from "lucide-react";

/**
 * トップページのファーストビュー。
 * ロゴ・キャッチコピー・短い説明・今日の1問への導線だけに絞っています。
 */
export function HomeHero() {
  return (
    <section className="mt-6 text-center">
      <h1 className="font-display text-2xl font-black leading-snug text-foreground md:text-4xl">
        暇つぶしで遊んでたら、
        <br />
        ちょっと賢くなってる。
      </h1>
      <p className="mx-auto mt-2 max-w-md text-[13px] font-bold leading-relaxed text-muted-foreground md:text-sm">
        診断、クイズ、ミニゲーム。気になったものを1分で。
      </p>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] font-black text-secondary-foreground">
        {["登録不要", "ぜんぶ無料", "1〜3分で遊べる"].map((t) => (
          <li key={t} className="rounded-full bg-secondary px-3 py-1">
            {t}
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href="#daily-quiz-heading"
          className="bg-cta shadow-lift flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          今日の1問をやる
          <ArrowDown className="size-4" aria-hidden />
        </a>
        <Link
          to="/games"
          search={{ cat: "all" }}
          className="shadow-soft flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-black text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 active:scale-[0.98]"
        >
          <Gamepad2 className="size-4" aria-hidden />
          ゲームを見る
        </Link>
      </div>
    </section>
  );
}
