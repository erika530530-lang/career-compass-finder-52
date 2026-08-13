import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, RotateCcw, Send } from "lucide-react";
import { Glyph } from "@/components/glyph";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { QuizRow } from "@/components/quiz-card";
import { ShareRow } from "@/components/share-row";
import { glyphQuestions, isCorrect, rankFor, games } from "@/lib/games/data";
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
          "むかしの絵文字みたいな形から生まれた漢字を当てる無料ミニゲーム。全10問・答えは自分で入力・ヒントつき。正答率と称号でシェアできます。",
      },
      { property: "og:title", content: "この象形文字、何の漢字？｜ピクセルポップ" },
      {
        property: "og:description",
        content: "全10問、答えは自分で入力。あなたは象形文字マスターになれる？",
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

function KanjiGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "correct">("idle");
  const [tries, setTries] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);

  const q = glyphQuestions[index]!;
  const total = glyphQuestions.length;
  const game = games[0]!;

  function start() {
    track("game_start", { game_id: game.id });
    setPhase("play");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "correct") return;
    if (!input.trim()) return;
    if (isCorrect(input, q)) {
      setState("correct");
      setCorrectCount((c) => c + 1);
      if (tries === 0 && !hintOpen) setFirstTryCount((c) => c + 1);
      track("game_answer", { game_id: game.id, question: q.id, result: "correct" });
    } else {
      setState("wrong");
      setTries((t) => t + 1);
      track("game_answer", { game_id: game.id, question: q.id, result: "wrong" });
    }
  }

  function next() {
    if (index + 1 >= total) {
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
    setHintOpen(false);
  }

  function replay() {
    setPhase("play");
    setIndex(0);
    setInput("");
    setState("idle");
    setTries(0);
    setHintOpen(false);
    setCorrectCount(0);
    setFirstTryCount(0);
    track("game_start", { game_id: game.id, replay: true });
  }

  const percent = Math.round((correctCount / total) * 100);
  const rank = rankFor(percent);
  const recommended = popularQuizzes.slice(0, 3);

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader tagline={false} />

        {phase === "intro" && (
          <section className="card-surface animate-pop mt-5 overflow-hidden">
            <div className="bg-story px-5 py-8 text-center">
              <p className="text-[11px] font-bold tracking-widest text-primary-foreground/90">
                ミニゲーム・全{total}問・{game.estimatedTime}
              </p>
              <h1 className="font-display mt-2 text-2xl font-black leading-snug text-primary-foreground">
                この象形文字、何の漢字？
              </h1>
            </div>
            <div className="p-5">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                むかしの人が「絵」として描いた形が、いまの漢字のもとになりました。表示される図形を見て、現代のどの漢字になったかを入力してください。
                <br />
                答えは<span className="font-bold text-foreground">漢字1文字（一部は別の言い方もOK）</span>
                。まちがえても正解は出ないので、何度でも考えられます。
              </p>
              <button
                onClick={start}
                className="shadow-lift mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
              >
                ゲームスタート 🪨
              </button>
            </div>
          </section>
        )}

        {phase === "play" && (
          <section className="mt-5">
            <div className="flex items-center justify-between px-1">
              <p className="font-display text-sm font-black text-foreground">
                第{index + 1}問 / {total}問
              </p>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
                {q.level}
              </span>
            </div>
            <div className="mt-2 flex gap-1">
              {glyphQuestions.map((item, i) => (
                <span
                  key={item.id}
                  className={`h-1 flex-1 rounded-full ${i <= index ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>

            <div className="card-surface animate-pop mt-3 p-6 text-center">
              <Glyph name={q.glyph} className="mx-auto size-40 text-foreground" />
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
                  <p className="font-display text-xl font-black text-foreground">正解！🎉</p>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">{q.note}</p>
                </div>
              )}

              {state !== "correct" && (
                <>
                  <button
                    onClick={() => setHintOpen(true)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-card py-3 text-xs font-black text-foreground active:scale-95"
                  >
                    <Lightbulb className="size-4" />
                    ヒントを見る
                  </button>
                  {hintOpen && (
                    <p className="animate-pop mt-2 rounded-2xl border border-dashed border-border px-3 py-2.5 text-[12px] font-bold text-muted-foreground">
                      💡 {q.hint}
                    </p>
                  )}
                </>
              )}

              {state === "correct" && (
                <button
                  onClick={next}
                  className="shadow-lift mt-3 w-full rounded-full bg-foreground py-3.5 text-sm font-black text-background active:scale-95"
                >
                  {index + 1 >= total ? "結果を見る 🏁" : "次の問題へ →"}
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

            <button
              onClick={replay}
              className="shadow-lift mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground active:scale-95"
            >
              <RotateCcw className="size-4" />
              もう一度遊ぶ
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
