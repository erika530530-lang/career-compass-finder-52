import { Link } from "@tanstack/react-router";
import { ArrowDown, Gamepad2 } from "lucide-react";

/**
 * トップページのファーストビュー。
 * ロゴ・キャッチコピー・短い説明・今日の1問への導線だけに絞っています。
 */
export function HomeHero() {
  return (
    <section className="mt-4 text-center">
      <h1 className="font-display text-2xl font-black leading-snug text-foreground md:text-4xl">
        暇つぶしで遊んでたら、
        <br />
        ちょっと賢くなってる。
      </h1>
      <p className="mx-auto mt-2 max-w-md text-[13px] font-bold leading-relaxed text-muted-foreground md:text-sm">
        診断、クイズ、ミニゲーム。気になったものを1分で。
      </p>

      <ul className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-black text-secondary-foreground">
        {["登録不要", "ぜんぶ無料", "1〜3分で遊べる"].map((t) => (
          <li key={t} className="rounded-full bg-secondary px-3 py-1">
            {t}
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href="#daily-quiz-heading"
          className="shadow-lift flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,oklch(0.93_0.18_86),oklch(0.82_0.14_62))] px-5 text-sm font-black text-[oklch(0.27_0.06_40)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_26px_-18px_oklch(0.64_0.28_338_/_0.52)] active:scale-[0.98]"
        >
          今日の1問をやる
          <ArrowDown className="size-4" aria-hidden />
        </a>
        <Link
          to="/games"
          search={{ cat: "all" }}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-black text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[oklch(0.995_0.012_320)] active:scale-[0.98]"
        >
          <Gamepad2 className="size-4" aria-hidden />
          ゲームを見る
        </Link>
      </div>
    </section>
  );
}
