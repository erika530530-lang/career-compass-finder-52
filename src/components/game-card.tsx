import { Link } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";
import { Glyph } from "@/components/glyph";
import { trackCardClick } from "@/lib/analytics";
import type { Game } from "@/lib/games/data";

export function GameCard({ game, location }: { game: Game; location?: string | undefined }) {
  const onClick = () => trackCardClick("game", game.id, location);
  return (
    <article className="card-surface animate-pop overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="story-ring">
          <div className="flex size-10 items-center justify-center rounded-full bg-card text-lg">
            {game.emoji}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-foreground">{game.nickname}</p>
          <p className="text-[11px] text-muted-foreground">
            🎮 ゲーム・{game.questionCount}問・{game.estimatedTime}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black tracking-wider text-primary-foreground">
          GAME
        </span>

      </div>

      <Link to={game.path} onClick={onClick} className="block bg-story px-5 py-7 text-center">
        {game.id === "kanji-glyph" ? (
          <Glyph name="eye" className="mx-auto size-16 text-primary-foreground" />
        ) : (
          <p className="text-5xl">{game.emoji}</p>
        )}
        <h3 className="font-display mt-3 text-xl font-black leading-snug text-primary-foreground">
          {game.title}
        </h3>
      </Link>

      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{game.description}</p>
        <Link
          to={game.path}
          onClick={onClick}
          className="shadow-lift mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
        >
          <Gamepad2 className="size-4" />
          ゲームをはじめる
        </Link>
      </div>
    </article>
  );
}

export function GameRow({ game, location }: { game: Game; location?: string | undefined }) {
  return (
    <Link
      to={game.path}
      onClick={() => trackCardClick("game", game.id, location)}
      className="card-surface flex items-center gap-3 p-3"
    >
      <div className="story-ring shrink-0">
        <div className="flex size-11 items-center justify-center rounded-full bg-card text-xl">
          {game.emoji}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-foreground">
          <span className="mr-1.5 rounded-full bg-primary px-2 py-0.5 text-[9px] font-black tracking-wider text-primary-foreground">
            GAME
          </span>
          {game.title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          🎮 ゲーム・{game.questionCount}問・{game.estimatedTime}
        </p>
      </div>
      <span className="text-gradient font-display shrink-0 text-xs font-black">あそぶ →</span>

    </Link>
  );
}
