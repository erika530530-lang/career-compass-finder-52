import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, RotateCcw, Send } from "lucide-react";
import { FlagImage } from "@/components/flag-image";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ShareRow } from "@/components/share-row";
import { BestScorePanel, NextUp } from "@/components/game-extras";
import {
  COUNTRY_QUESTIONS_PER_GAME,
  allCountryQuestions,
  countryDifficultyLabel,
  countryRankFor,
  isCountryRoundCorrect,
  pickCountryRounds,
  type CountryRound,
} from "@/lib/games/country-data";
import { games } from "@/lib/games/data";
import { canonical } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { gameThumbnail } from "@/lib/games/thumbnails";

export const Route = createFileRoute("/game/kokki")({
  head: () => ({
    meta: [
      { title: "この国、わかる？｜国旗と穴あき国名から国を当てるゲーム｜ピクセルポップ" },
      {
        name: "description",
        content:
          "国旗を見て、穴あきになった国名を当てる無料ミニゲーム。約160か国からランダムに10問出題、2段階ヒント・首都や豆知識つき。正答率と称号をシェアできます。",
      },
      { property: "og:title", content: "この国、わかる？｜ピクセルポップ" },
      {
        property: "og:description",
        content: "国旗＋穴あき国名から国を当てよう。あなたは何問わかる？",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/game/kokki") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/game/kokki") }],
  }),
  component: KokkiGame,
});

type Phase = "intro" | "play" | "done";
type Log = {
  round: CountryRound;
  cleared: boolean;
  firstTry: boolean;
  usedHint: boolean;
  answerGiven: string;
};

function KokkiGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [rounds, setRounds] = useState<CountryRound[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "correct">("idle");
  const [tries, setTries] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);

  const game = games.find((g) => g.id === "flag-country") ?? games[0]!;
  const total = rounds.length || COUNTRY_QUESTIONS_PER_GAME;
  const round = rounds[index];
  const q = round?.q;

  const correctCount = logs.filter((l) => l.cleared).length;
  const firstTryCount = logs.filter((l) => l.firstTry).length;
  const hintUsed = logs.filter((l) => l.usedHint).length;
  const bestStreak = logs.reduce(
    (acc, l) => {
      const cur = l.cleared ? acc.cur + 1 : 0;
      return { cur, best: Math.max(acc.best, cur) };
    },
    { cur: 0, best: 0 },
  ).best;
  const percent = Math.round((correctCount / total) * 100);
  const rank = countryRankFor(correctCount);
  const lastLog = logs[logs.length - 1];

  function begin(replay = false) {
    setRounds(pickCountryRounds());
    setIndex(0);
    setInput("");
    setState("idle");
    setTries(0);
    setHintLevel(0);
    setLogs([]);
    setPhase("play");
    track("game_start", { game_id: game.id, replay });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!round || state === "correct" || !input.trim()) return;
    if (isCountryRoundCorrect(input, round)) {
      setState("correct");
      setLogs((l) => [
        ...l,
        {
          round,
          cleared: true,
          firstTry: tries === 0 && hintLevel === 0,
          usedHint: hintLevel > 0,
          answerGiven: input.trim(),
        },
      ]);
      track("game_answer", { game_id: game.id, question: round.q.id, result: "correct" });
    } else {
      setState("wrong");
      setTries((t) => t + 1);
      track("game_answer", { game_id: game.id, question: round.q.id, result: "wrong" });
    }
  }

  function giveUp() {
    if (!round) return;
    setState("correct");
    setLogs((l) => [
      ...l,
      {
        round,
        cleared: false,
        firstTry: false,
        usedHint: hintLevel > 0,
        answerGiven: input.trim() || "（こたえを見た）",
      },
    ]);
  }

  function next() {
    if (index + 1 >= rounds.length) {
      track("game_complete", { game_id: game.id, score: correctCount, percent });
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setState("idle");
    setTries(0);
    setHintLevel(0);
  }

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        {phase === "intro" && (
          <section className="card-surface animate-pop mt-5 overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden bg-soft">
              <img
                src={gameThumbnail({ id: "flag-country" })}
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
                この国、わかる？
              </h1>
            </div>
            <div className="p-5">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                国旗と、一部が「□」で隠れた国名が表示されます。どの国かを推理して入力してください（ひらがなでもOK！）。
                <br />
                全{allCountryQuestions.length}か国のなかから
                <span className="font-bold text-foreground">毎回ランダムに10問</span>
                出題。初級・中級・上級がまざるので遊ぶたびに内容が変わります。ヒントは2段階、正解のあとには首都・地域・豆知識も表示されます。
              </p>
              <button
                onClick={() => begin(false)}
                className="shadow-lift mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
              >
                ゲームスタート 🌍
              </button>
            </div>
          </section>
        )}

        {phase === "play" && round && q && (
          <section className="mt-5">
            <div className="flex items-center justify-between px-1 md:mx-auto md:max-w-md">
              <p className="font-display text-sm font-black text-foreground">
                第{index + 1}問 / {rounds.length}問
              </p>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                {countryDifficultyLabel[q.difficulty]}
              </span>
            </div>
            <div className="mt-2 flex gap-1 md:mx-auto md:max-w-md">
              {rounds.map((item, i) => (
                <span
                  key={item.q.id}
                  className={`h-1 flex-1 rounded-full ${i <= index ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <div className="card-surface animate-pop mt-3 p-5 text-center md:mx-auto md:max-w-md md:p-7">
              <div className="mx-auto max-w-[280px]">
                <FlagImage key={q.id} code={q.code} name={q.name} hideName />
              </div>

              <p className="font-display mt-5 text-3xl font-black tracking-[0.15em] text-foreground">
                {round.masked}
              </p>
              <p className="mt-2 text-[13px] font-bold text-muted-foreground">
                □に入る文字だけの入力でもOK！国名ぜんぶでも正解です
              </p>
              <p className="mt-1 text-[12px] font-bold text-primary">ひらがなでもOK！</p>

              <form onSubmit={submit} className="mt-4">
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (state === "wrong") setState("idle");
                  }}
                  disabled={state === "correct"}
                  maxLength={24}
                  placeholder="国名 or □の文字だけ（ひらがなOK）"

                  className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-center text-xl font-black text-foreground outline-none focus:border-primary disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={state === "correct"}
                  className="shadow-lift mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-black text-primary-foreground active:scale-95 disabled:opacity-60"
                >
                  <Send className="size-4" />
                  回答する
                </button>
              </form>

              {state === "wrong" && (
                <p className="animate-pop mt-3 rounded-2xl bg-secondary px-3 py-2.5 text-[13px] font-black text-secondary-foreground">
                  惜しい！もう一度考えてみよう 🤔
                </p>
              )}

              {state === "correct" && (
                <div className="animate-pop mt-4 space-y-2">
                  <p className="font-display text-xl font-black text-foreground">
                    {lastLog?.cleared ? "正解！🎉" : `正解は「${q.name}」でした`}
                  </p>
                  <p className="font-display text-3xl font-black text-foreground">{q.name}</p>
                  <p className="text-[12px] font-bold text-muted-foreground">
                    首都：{q.capital}／地域：{q.region}
                    <br />
                    英語名：{q.nameEn}
                  </p>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">{q.trivia}</p>
                </div>
              )}

              {state !== "correct" && (
                <>
                  <button
                    onClick={() => setHintLevel((h) => Math.min(h + 1, 2))}
                    disabled={hintLevel >= 2}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-card py-3 text-xs font-black text-foreground active:scale-95 disabled:opacity-50"
                  >
                    <Lightbulb className="size-4" />
                    {hintLevel === 0
                      ? "ヒントを見る"
                      : hintLevel === 1
                        ? "もっとヒントを見る"
                        : "ヒントはここまで"}
                  </button>
                  {hintLevel >= 1 && (
                    <p className="animate-pop mt-2 rounded-2xl border border-dashed border-border px-3 py-2.5 text-[12px] font-bold text-muted-foreground">
                      💡 ヒント1：{q.hint1}
                    </p>
                  )}
                  {hintLevel >= 2 && (
                    <>
                      <p className="animate-pop mt-2 rounded-2xl border border-dashed border-border px-3 py-2.5 text-[12px] font-bold text-muted-foreground">
                        💡 ヒント2：{q.hint2}
                      </p>
                      <button
                        onClick={giveUp}
                        className="mt-2 w-full rounded-full py-2 text-[11px] font-bold text-muted-foreground underline"
                      >
                        答えを見て次へ進む
                      </button>
                    </>
                  )}
                </>
              )}

              {state === "correct" && (
                <button
                  onClick={next}
                  className="shadow-lift mt-4 w-full rounded-full bg-foreground py-3.5 text-sm font-black text-background active:scale-95"
                >
                  {index + 1 >= rounds.length ? "結果を見る 🏁" : "次の問題へ →"}
                </button>
              )}
            </div>

            <p className="mt-3 px-1 text-[11px] text-muted-foreground md:mx-auto md:max-w-md md:text-center">
              ここまでの正解：{correctCount}問（一発正解 {firstTryCount}問）
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
                  連続正解：{bestStreak}問／使ったヒント：{hintUsed}回／一発正解：{firstTryCount}問
                </p>
                <ShareRow
                  text={`国名当てクイズ🌍\n${total}問中${correctCount}問正解（正答率${percent}%）\n称号は「${rank.title}」！あなたは何問わかる？`}
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
              今回の10問をふりかえる 🗺️
            </h3>
            <div className="mt-3 flex flex-col gap-3 md:grid md:grid-cols-2">
              {logs.map((log, i) => (
                <div key={log.round.q.id} className="card-surface flex gap-3 p-4">
                  <div className="w-16 shrink-0">
                    <FlagImage code={log.round.q.code} name={log.round.q.name} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground">
                      第{i + 1}問・{countryDifficultyLabel[log.round.q.difficulty]}・
                      {log.cleared ? (log.firstTry ? "一発正解 ⭕️" : "正解 ⭕️") : "不正解 ❌"}
                    </p>
                    <p className="font-display text-lg font-black text-foreground">
                      {log.round.q.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      あなたの回答：{log.answerGiven}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                      {log.round.q.trivia}
                    </p>
                  </div>
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
