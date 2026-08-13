import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, RotateCcw, Send } from "lucide-react";
import { GlyphArt } from "@/components/glyph";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { QuizRow } from "@/components/quiz-card";
import { ShareRow } from "@/components/share-row";
import {
  QUESTIONS_PER_GAME,
  allGlyphQuestions,
  difficultyLabel,
  games,
  isCorrect,
  pickQuestions,
  rankFor,
  type GlyphQuestion,
} from "@/lib/games/data";
import { popularQuizzes } from "@/lib/quizzes/data";
import { canonical } from "@/lib/site-config";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/game/kanji")({
  head: () => ({
    meta: [
      { title: "この象形文字、何の漢字？｜象形文字クイズ｜ピクセルポップ" },
      {
        name: "description",
        content:
          "むかしの絵から生まれた漢字を当てる無料ミニゲーム。約150問からランダムに10問出題、答えは自分で入力・2段階ヒントつき。正答率と称号でシェアできます。",
      },
      { property: "og:title", content: "この象形文字、何の漢字？｜ピクセルポップ" },
      {
        property: "og:description",
        content: "毎回ランダムに10問。あなたは古代文字マスターになれる？",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/game/kanji") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/game/kanji") }],
  }),
  component: KanjiGame,
});

type Phase = "intro" | "play" | "done";
type Log = { q: GlyphQuestion; cleared: boolean; firstTry: boolean; usedHint: boolean };

function KanjiGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<GlyphQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "correct">("idle");
  const [tries, setTries] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);

  const total = questions.length || QUESTIONS_PER_GAME;
  const q = questions[index];
  const game = games[0]!;
  const correctCount = logs.filter((l) => l.cleared).length;
  const firstTryCount = logs.filter((l) => l.firstTry).length;

  function begin(replay = false) {
    setQuestions(pickQuestions());
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
    if (!q || state === "correct") return;
    if (!input.trim()) return;
    if (isCorrect(input, q)) {
      setState("correct");
      setLogs((l) => [
        ...l,
        { q, cleared: true, firstTry: tries === 0 && hintLevel === 0, usedHint: hintLevel > 0 },
      ]);
      track("game_answer", { game_id: game.id, question: q.id, result: "correct" });
    } else {
      setState("wrong");
      setTries((t) => t + 1);
      track("game_answer", { game_id: game.id, question: q.id, result: "wrong" });
    }
  }

  function giveUp() {
    if (!q) return;
    setState("correct");
    setLogs((l) => [...l, { q, cleared: false, firstTry: false, usedHint: hintLevel > 0 }]);
  }

  function next() {
    if (index + 1 >= questions.length) {
      track("game_complete", {
        game_id: game.id,
        score: correctCount,
        percent: Math.round((correctCount / total) * 100),
      });
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setState("idle");
    setTries(0);
    setHintLevel(0);
  }

  const percent = Math.round((correctCount / total) * 100);
  const rank = rankFor(percent);
  const recommended = popularQuizzes.slice(0, 3);
  const lastLog = logs[logs.length - 1];

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader tagline={false} />

        {phase === "intro" && (
          <section className="card-surface animate-pop mt-5 overflow-hidden">
            <div className="bg-story px-5 py-8 text-center">
              <p className="text-[11px] font-bold tracking-widest text-primary-foreground/90">
                ミニゲーム・毎回10問・{game.estimatedTime}
              </p>
              <h1 className="font-display mt-2 text-2xl font-black leading-snug text-primary-foreground">
                この象形文字、何の漢字？
              </h1>
            </div>
            <div className="p-5">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                むかしの人が「絵」として描いた形が、いまの漢字のもとになりました。表示される図形を見て、現代のどの漢字になったかを入力してください。
                <br />
                全{allGlyphQuestions.length}問のなかから
                <span className="font-bold text-foreground">毎回ランダムに10問</span>
                出題。初級・中級・上級がまざって出るので、遊ぶたびに内容が変わります。ヒントは2段階、正解のあとには由来の解説もつきます。
              </p>
              <button
                onClick={() => begin(false)}
                className="shadow-lift mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
              >
                ゲームスタート 🪨
              </button>
            </div>
          </section>
        )}

        {phase === "play" && q && (
          <section className="mt-5">
            <div className="flex items-center justify-between px-1">
              <p className="font-display text-sm font-black text-foreground">
                第{index + 1}問 / {questions.length}問
              </p>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                {difficultyLabel[q.difficulty]}
              </span>
            </div>
            <div className="mt-2 flex gap-1">
              {questions.map((item, i) => (
                <span
                  key={item.id}
                  className={`h-1 flex-1 rounded-full ${i <= index ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <div className="card-surface animate-pop mt-3 p-6 text-center">
              <GlyphArt
                key={q.id}
                paths={q.paths}
                dots={q.dots}
                className="mx-auto size-40 text-foreground"
              />
              <p className="mt-4 text-[13px] font-bold text-muted-foreground">
                これは現代の何という漢字でしょう？
              </p>

              <form onSubmit={submit} className="mt-4">
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (state === "wrong") setState("idle");
                  }}
                  disabled={state === "correct"}
                  inputMode="text"
                  maxLength={8}
                  placeholder="答えの漢字を入力"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-center text-2xl font-black text-foreground outline-none focus:border-primary disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={state === "correct"}
                  className="shadow-lift mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95 disabled:opacity-60"
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
                <div className="animate-pop mt-3 space-y-2">
                  <p className="font-display text-xl font-black text-foreground">
                    {lastLog?.cleared ? "正解！🎉" : `正解は「${q.answer}」でした`}
                  </p>
                  <p className="text-3xl font-black text-foreground">{q.answer}</p>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">
                    {q.explanation}
                  </p>
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
                  className="shadow-lift mt-3 w-full rounded-full bg-foreground py-3.5 text-sm font-black text-background active:scale-95"
                >
                  {index + 1 >= questions.length ? "結果を見る 🏁" : "次の問題へ →"}
                </button>
              )}
            </div>

            <p className="mt-3 px-1 text-[11px] text-muted-foreground">
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
                  ヒントなしの一発正解は {firstTryCount}問でした。
                </p>
                <ShareRow
                  text={`「この象形文字、何の漢字？」で${total}問中${correctCount}問正解（正答率${percent}%）。称号は「${rank.title}」でした！`}
                />
              </div>
            </div>

            <h3 className="font-display mt-7 px-1 text-base font-black text-foreground">
              今回の10問をふりかえる 📜
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              {logs.map((log, i) => (
                <div key={log.q.id} className="card-surface flex gap-3 p-4">
                  <GlyphArt
                    paths={log.q.paths}
                    dots={log.q.dots}
                    className="size-14 shrink-0 text-foreground"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground">
                      第{i + 1}問・{difficultyLabel[log.q.difficulty]}・
                      {log.cleared ? (log.firstTry ? "一発正解 ⭕️" : "正解 ⭕️") : "不正解 ❌"}
                    </p>
                    <p className="font-display text-xl font-black text-foreground">
                      {log.q.answer}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                      {log.q.explanation}
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
            <Link
              to="/quizzes"
              search={{ cat: "game", sort: "popular" }}
              className="mt-2 block rounded-full border border-border bg-card py-3.5 text-center text-sm font-black text-foreground active:scale-95"
            >
              次のゲームを見る 🎮
            </Link>

            <h3 className="font-display mt-7 px-1 text-base font-black text-foreground">
              診断もやってみる？ 🔮
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              {recommended.map((quiz) => (
                <QuizRow key={quiz.id} quiz={quiz} fromQuizId={game.id} />
              ))}
            </div>
          </section>
        )}

        <SiteFooter />
      </div>
    </main>
  );
}
