import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Flame, Trophy } from "lucide-react";
import { GameRow } from "@/components/game-card";
import { QuizRow } from "@/components/quiz-card";
import { gameById, otherGames } from "@/lib/games/data";
import { popularQuizzes } from "@/lib/quizzes/data";
import { readPlayStreak, recordGamePlay, type GameStats } from "@/lib/games/scores";
import { track } from "@/lib/analytics";

/**
 * 結果画面の「あなたのベスト／今回」パネル。
 * マウント時に1回だけ記録を保存します（localStorage・ログイン不要）。
 */
export function BestScorePanel({
  gameId,
  score,
  total,
  streak,
}: {
  gameId: string;
  score: number;
  total: number;
  streak: number;
}) {
  const [data, setData] = useState<{
    before: GameStats;
    after: GameStats;
    isNewBest: boolean;
  } | null>(null);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const result = recordGamePlay(gameId, { score, total, streak });
    setData({ before: result.before, after: result.after, isNewBest: result.isNewBest });
    setDays(readPlayStreak());
    // 結果表示時に一度だけ記録する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return null;
  const { before, after, isNewBest } = data;
  const firstPlay = before.plays === 0;
  const toBest = before.bestScore - score;

  return (
    <div className="card-surface mt-4 p-4">
      <p className="flex items-center justify-center gap-1.5 text-xs font-black text-foreground">
        <Trophy className="size-4 text-primary" aria-hidden />
        あなたの記録
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-secondary px-3 py-3">
          <p className="text-[10px] font-bold text-secondary-foreground/80">今回</p>
          <p className="font-display text-xl font-black text-secondary-foreground">
            {total}問中{score}問
          </p>
        </div>
        <div className="rounded-2xl bg-secondary px-3 py-3">
          <p className="text-[10px] font-bold text-secondary-foreground/80">あなたのベスト</p>
          <p className="font-display text-xl font-black text-secondary-foreground">
            {after.bestTotal || total}問中{after.bestScore}問
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-[12px] font-bold text-muted-foreground">
        {firstPlay
          ? "はじめてのプレイ！これがあなたの基準タイムです ⏱️"
          : isNewBest
            ? "自己ベスト更新！おめでとう 🎉"
            : toBest === 1
              ? "ベストスコアまであと1問！おしい 😤"
              : `ベストスコアまであと${toBest}問。`}
      </p>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        プレイ回数 {after.plays}回／最高連続正解 {after.bestStreak}問／最高正答率{" "}
        {after.bestPercent}%
      </p>
      {days >= 2 && (
        <p className="mt-2 flex items-center justify-center gap-1 text-[12px] font-black text-primary">
          <Flame className="size-4" aria-hidden />
          連続プレイ {days}日
        </p>
      )}
    </div>
  );
}

/**
 * 結果画面の回遊導線。ほかのゲーム→診断→解説トピックの順に並べます。
 */
export function NextUp({ gameId }: { gameId: string }) {
  const game = gameById(gameId);
  const nextGames = otherGames(gameId, 3);
  const quizPicks = popularQuizzes.slice(0, 2);

  return (
    <div className="mt-7">
      <h3 className="font-display px-1 text-base font-black text-foreground">
        次はこれやってみる？ 👀
      </h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {nextGames.map((g) => (
          <GameRow key={g.id} game={g} />
        ))}
      </div>

      <h3 className="font-display mt-6 px-1 text-base font-black text-foreground">
        頭を使ったあとは、自分のタイプ診断も 🔮
      </h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {quizPicks.map((q) => (
          <QuizRow key={q.id} quiz={q} fromQuizId={gameId} />
        ))}
      </div>

      {game && (
        <div className="card-surface mt-6 p-4">
          <p className="flex items-center gap-1.5 text-xs font-black text-foreground">
            <BookOpen className="size-4 text-primary" aria-hidden />
            もっと知りたい人へ
          </p>
          {game.topic.href ? (
            <a
              href={game.topic.href}
              onClick={() => track("article_click", { game_id: gameId })}
              className="mt-2 block text-[13px] font-bold text-primary underline"
            >
              {game.topic.label}
            </a>
          ) : (
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              「{game.topic.label}」の解説ページは準備中です。公開までは、ゲーム内の解説と豆知識でおたのしみください。
            </p>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
          to="/games"
          search={{ cat: "all" }}
          className="flex min-h-12 items-center justify-center rounded-full border border-border bg-card text-sm font-black text-foreground active:scale-95"
        >
          ゲームを全部見る 🕹️
        </Link>
        <Link
          to="/quizzes"
          search={{ cat: "all", sort: "popular" }}
          className="flex min-h-12 items-center justify-center rounded-full border border-border bg-card text-sm font-black text-foreground active:scale-95"
        >
          診断をさがす 🔮
        </Link>
      </div>
    </div>
  );
}
