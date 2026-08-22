import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ShareRow } from "@/components/share-row";
import { BestScorePanel, NextUp } from "@/components/game-extras";
import { RubyText } from "@/components/ruby-text";
import {
  PROVERB_QUESTIONS_PER_GAME,
  allProverbQuestions,
  pickProverbRounds,
  proverbDifficultyLabel,
  proverbRankFor,
  type ProverbDifficulty,
  type ProverbRound,
} from "@/lib/games/proverb-data";
import { games } from "@/lib/games/data";
import { canonical } from "@/lib/site-config";
import { trackGameComplete, trackGameStart } from "@/lib/analytics";
import { gameThumbnail } from "@/lib/games/thumbnails";

export const Route = createFileRoute("/game/kotowaza")({
  head: () => ({
    meta: [
      { title: "この由来、どのことわざ？｜ことわざの由来クイズ｜ピクセルポップ" },
      {
        name: "description",
        content:
          "ことわざ・故事成語の由来を読んで、元のことわざを4択で当てる無料クイズゲーム。100問以上からランダムに10問出題。意味・由来・豆知識つきで、結果は称号つきでシェアできます。",
      },
      { property: "og:title", content: "この由来、どのことわざ？｜ピクセルポップ" },
      {
        property: "og:description",
        content: "由来を読んで元のことわざを当てよう。あなたは10問中何問わかる？",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/game/kotowaza") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/game/kotowaza") }],
  }),
  component: KotowazaGame,
});

type Phase = "intro" | "play" | "done";
type Log = { round: ProverbRound; chosen: string; cleared: boolean };

function KotowazaGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [rounds, setRounds] = useState<ProverbRound[]>([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const game = games.find((g) => g.id === "proverb-origin") ?? games[0]!;

  const total = rounds.length || PROVERB_QUESTIONS_PER_GAME;
  const round = rounds[index];
  const q = round?.q;

  const correctCount = logs.filter((l) => l.cleared).length;
  const percent = logs.length ? Math.round((correctCount / logs.length) * 100) : 0;
  const bestStreak = logs.reduce(
    (acc, l) => {
      const cur = l.cleared ? acc.cur + 1 : 0;
      return { cur, best: Math.max(acc.best, cur) };
    },
    { cur: 0, best: 0 },
  ).best;
  const byDifficulty = (d: ProverbDifficulty) => {
    const list = logs.filter((l) => l.round.q.difficulty === d);
    return { total: list.length, correct: list.filter((l) => l.cleared).length };
  };
  const rank = proverbRankFor(correctCount);

  function begin(again: boolean) {
    setRounds(pickProverbRounds());
    setIndex(0);
    setChosen(null);
    setLogs([]);
    setPhase("play");
    trackGameStart(game.id, again);
  }

  function answer(choice: string) {
    if (!round || chosen) return;
    setChosen(choice);
    setLogs((l) => [...l, { round, chosen: choice, cleared: choice === round.q.proverb }]);
  }

  function next() {
    if (index + 1 >= rounds.length) {
      trackGameComplete(game.id, correctCount, percent);
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
  }

  const lastLog = logs[logs.length - 1];

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        {phase === "intro" && (
          <section className="card-surface animate-pop mt-5 overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden bg-soft">
              <img
                src={gameThumbnail({ id: "proverb-origin" })}
                alt="このゲームのイメージ画像"
                width={1024}
                height={576}
                className="size-full object-cover"
              />
            </div>
            <div className="bg-story px-5 py-8 text-center">
              <p className="text-[11px] font-bold tracking-widest text-primary-foreground/90">
                ミニゲーム・毎回10問・{game.estimatedTime}
              </p>
              <h1 className="font-display mt-2 text-2xl font-black leading-snug text-primary-foreground">
                この由来、どのことわざ？
              </h1>
            </div>
            <div className="p-5">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                ことわざ・故事成語の
                <span className="font-bold text-foreground">由来（故事や背景）</span>
                を読んで、それがどのことわざなのかを4択で当てるゲームです。
                <br />全{allProverbQuestions.length}
                問のなかから毎回ランダムに10問出題。初級・中級・上級がまざり、答えたあとには意味・由来・現代での使い方・豆知識が読めます。
              </p>
              <button
                onClick={() => begin(false)}
                className="shadow-lift mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
              >
                ゲームスタート 📚
              </button>
            </div>
          </section>
        )}

        {phase === "play" && round && q && (
          <section className="mt-5">
            <div className="flex items-center justify-between px-1 md:mx-auto md:max-w-lg">
              <p className="font-display text-sm font-black text-foreground">
                第{index + 1}問 / {rounds.length}問
              </p>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                {proverbDifficultyLabel[q.difficulty]}
              </span>
            </div>
            <div className="mt-2 flex gap-1 md:mx-auto md:max-w-lg">
              {rounds.map((item, i) => (
                <span
                  key={item.q.id}
                  className={`h-1 flex-1 rounded-full ${i <= index ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <div className="card-surface animate-pop mt-3 p-5 md:mx-auto md:max-w-lg md:p-7">
              {q.illustration && (
                <img
                  src={q.illustration.url}
                  alt={q.illustration.alt}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="mb-4 h-36 w-full rounded-2xl border border-border bg-secondary/40 object-contain sm:h-44 md:h-56"
                />
              )}
              <p className="text-[11px] font-black tracking-widest text-primary">由来</p>
              <p className="mt-2 text-[14px] leading-loose text-foreground">{q.origin}</p>

              <p className="font-display mt-5 text-center text-base font-black text-foreground">
                この由来のことわざはどれ？
              </p>

              <div className="mt-3 flex flex-col gap-2.5">
                {round.choices.map((c, i) => {
                  const isAnswer = c === q.proverb;
                  const picked = chosen === c;
                  const style = !chosen
                    ? "border-border bg-card text-foreground"
                    : isAnswer
                      ? "border-primary bg-primary text-primary-foreground"
                      : picked
                        ? "border-border bg-secondary text-secondary-foreground"
                        : "border-border bg-card text-muted-foreground opacity-70";
                  return (
                    <button
                      key={c}
                      onClick={() => answer(c)}
                      disabled={!!chosen}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] font-black active:scale-95 disabled:active:scale-100 ${style}`}
                    >
                      <span className="text-[11px] opacity-70">
                        {["A", "B", "C", "D"][i]}
                      </span>
                      <RubyText text={c} />
                    </button>
                  );
                })}
              </div>

              {chosen && (
                <div className="animate-pop mt-4 space-y-2 rounded-2xl bg-secondary/60 p-4">
                  <p className="font-display text-xl font-black text-foreground">
                    {lastLog?.cleared ? "正解！🎉" : "惜しい！"}
                  </p>
                  <p className="font-display text-2xl font-black leading-loose text-foreground">
                    <RubyText text={q.proverb} />
                  </p>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    <span className="font-black">意味：</span>
                    {q.meaning}
                  </p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    <span className="font-black">由来：</span>
                    {q.origin}
                  </p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    <span className="font-black">現代での使い方：</span>
                    {q.usage}
                  </p>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">💡 {q.trivia}</p>
                  <button
                    onClick={next}
                    className="shadow-lift mt-2 w-full rounded-full bg-foreground py-3.5 text-sm font-black text-background active:scale-95"
                  >
                    {index + 1 >= rounds.length ? "結果を見る 🏁" : "次の問題へ →"}
                  </button>
                </div>
              )}
            </div>

            <p className="mt-3 px-1 text-[11px] text-muted-foreground md:mx-auto md:max-w-lg md:text-center">
              ここまでの正解：{correctCount}問
            </p>
          </section>
        )}

        {phase === "done" && (
          <section className="mt-5">
            <div className="card-surface animate-pop overflow-hidden">
              <div className="bg-story px-5 py-8 text-center">
                <p className="text-[11px] font-bold tracking-widest text-primary-foreground/90">
                  結果発表！
                </p>
                <p className="font-display mt-1 text-4xl font-black text-primary-foreground">
                  {total}問中{correctCount}問正解
                </p>
                <p className="font-display mt-1 text-2xl font-black text-primary-foreground">
                  正答率 {percent}%
                </p>
              </div>
              <div className="p-5 text-center">
                <p className="text-5xl">{rank.emoji}</p>
                <h2 className="font-display mt-2 text-xl font-black leading-snug text-foreground">
                  「{rank.title}」
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {rank.comment}
                </p>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  最高連続正解：{bestStreak}問
                  <br />
                  初級 {byDifficulty("easy").correct}/{byDifficulty("easy").total}・中級{" "}
                  {byDifficulty("medium").correct}/{byDifficulty("medium").total}・上級{" "}
                  {byDifficulty("hard").correct}/{byDifficulty("hard").total}
                </p>
                <ShareRow
                  text={`ことわざ由来クイズ📚\n${total}問中${correctCount}問正解（正答率${percent}%）\n称号は「${rank.title}」！あなたは何問わかる？`}
                />
                <BestScorePanel
                  gameId={game.id}
                  score={correctCount}
                  total={total}
                  streak={bestStreak}
                />
              </div>
            </div>

            <h3 className="font-display mt-7 px-1 text-base font-black text-foreground">
              今回の10問をふりかえる 📖
            </h3>
            <div className="mt-3 flex flex-col gap-3 md:grid md:grid-cols-2">
              {logs.map((log, i) => (
                <div key={log.round.q.id} className="card-surface p-4">
                  {log.round.q.illustration && (
                    <img
                      src={log.round.q.illustration.url}
                      alt={log.round.q.illustration.alt}
                      loading="lazy"
                      width={1024}
                      height={640}
                      className="mb-2 h-28 w-full rounded-xl border border-border bg-secondary/40 object-contain"
                    />
                  )}
                  <p className="text-[11px] font-bold text-muted-foreground">
                    第{i + 1}問・{proverbDifficultyLabel[log.round.q.difficulty]}・
                    {log.cleared ? "正解 ⭕️" : "不正解 ❌"}
                  </p>
                  <p className="font-display text-lg font-black leading-loose text-foreground">
                    <RubyText text={log.round.q.proverb} />
                  </p>
                  <p className="text-[11px] text-muted-foreground">あなたの回答：<RubyText text={log.chosen} /></p>
                  <p className="mt-1 text-[12px] leading-relaxed text-foreground">
                    意味：{log.round.q.meaning}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    由来：{log.round.q.origin}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => begin(true)}
              className="shadow-lift mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
            >
              <RotateCcw className="size-4" />
              もう一度遊ぶ（新しい10問）
            </button>

            <NextUp gameId={game.id} />
          </section>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
