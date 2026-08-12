import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { axisMeta, careers, diagnose, questions, type Axis } from "@/lib/careers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "向いてる職業診断 | 18の質問で75職業からあなたの適職を判定" },
      {
        name: "description",
        content:
          "18の質問に答えるだけで、6つの適性タイプから75以上の職業の中から向いている仕事をランキング表示。無料・登録不要の適職診断。",
      },
      { property: "og:title", content: "向いてる職業診断 | 18の質問であなたの適職がわかる" },
      {
        property: "og:description",
        content: "6つの適性タイプを測定し、75以上の職業から向いている仕事をランキング表示します。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const scale = [
  { v: 1, label: "全然ちがう" },
  { v: 2, label: "あまり" },
  { v: 3, label: "どちらとも" },
  { v: 4, label: "やや近い" },
  { v: 5, label: "すごく近い" },
];

function Index() {
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const result = useMemo(() => (stage === "result" ? diagnose(answers) : null), [stage, answers]);
  const q = questions[step]!;
  const progress = Math.round((step / questions.length) * 100);

  function answer(v: number) {
    const next = { ...answers, [q.id]: v };
    setAnswers(next);
    if (step + 1 >= questions.length) {
      setStage("result");
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setStage("intro");
  }

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-2xl px-5 pb-20 pt-10 sm:pt-16">
        <header className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-[0.2em] text-primary">TENSHOKU LAB</span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            全{careers.length}職業
          </span>
        </header>

        {stage === "intro" && <Intro onStart={() => setStage("quiz")} />}

        {stage === "quiz" && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between text-sm text-muted-foreground">
              <span>
                Q{step + 1} <span className="text-xs">/ {questions.length}</span>
              </span>
              <span className="text-xs">{axisMeta[q.axis].label}の傾向</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>

            <div key={q.id} className="card-surface animate-rise mt-6 p-6 sm:p-8">
              <h1 className="text-xl font-bold leading-relaxed text-foreground sm:text-2xl">
                {q.text}
              </h1>
              <div className="mt-6 flex flex-col gap-2">
                {scale.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => answer(s.v)}
                    className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 text-left text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.99]"
                  >
                    <span>{s.label}</span>
                    <span className="text-xs text-muted-foreground transition-colors group-hover:text-primary-foreground">
                      {s.v}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                ひとつ前に戻る
              </button>
            )}
          </section>
        )}

        {stage === "result" && result && <ResultView result={result} onRestart={restart} />}

        <footer className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
          職業興味の6タイプ理論（RIASEC）を参考にした簡易診断です。結果はキャリアを考えるきっかけとしてお使いください。
        </footer>
      </div>
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="mt-10 animate-rise">
      <p className="text-sm font-semibold text-accent">18問・約2分・登録不要</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
        あなたに
        <br />
        向いてる職業を
        <br />
        <span className="text-primary">{careers.length}職種</span>から。
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
        質問に直感で答えるだけ。6つの適性タイプを測定し、相性の高い仕事をランキングで表示します。
      </p>

      <button
        onClick={onStart}
        className="shadow-lift mt-8 w-full rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
      >
        診断をはじめる
      </button>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(Object.keys(axisMeta) as Axis[]).map((a) => (
          <div key={a} className="card-surface p-4">
            <p className="text-sm font-bold text-foreground">{axisMeta[a].label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{axisMeta[a].short}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultView({
  result,
  onRestart,
}: {
  result: NonNullable<ReturnType<typeof diagnose>>;
  onRestart: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const top = result.matches.slice(0, showAll ? 20 : 6);

  return (
    <section className="mt-10 animate-rise">
      <p className="text-sm font-semibold text-accent">診断結果</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        あなたは
        <span className="text-primary">
          {result.top.map((a) => axisMeta[a].label).slice(0, 2).join("×")}
        </span>
        タイプ
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {axisMeta[result.top[0]!].desc}。加えて{axisMeta[result.top[1]!].label}
        の要素も強く、{axisMeta[result.top[1]!].short}場面でも力を発揮します。
      </p>

      <div className="card-surface mt-6 p-5">
        <h2 className="text-sm font-bold text-foreground">タイプ別スコア</h2>
        <div className="mt-4 flex flex-col gap-3">
          {(Object.keys(axisMeta) as Axis[])
            .sort((a, b) => result.scores[b] - result.scores[a])
            .map((a) => (
              <div key={a} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs font-medium text-foreground">
                  {axisMeta[a].label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(result.scores[a], 3)}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
                  {result.scores[a]}
                </span>
              </div>
            ))}
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-foreground">向いている職業ランキング</h2>
      <ol className="mt-4 flex flex-col gap-3">
        {top.map((m, i) => (
          <li key={m.career.name} className="card-surface flex gap-4 p-5">
            <span className="mt-0.5 w-7 shrink-0 text-lg font-bold text-primary">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-bold text-foreground">{m.career.name}</h3>
                <span className="shrink-0 text-sm font-bold text-accent">{m.score}%</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.career.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">
                  {m.career.category}
                </span>
                {m.career.axes.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {axisMeta[a].label}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex-1 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
        >
          {showAll ? "上位6件だけ表示" : "上位20件をすべて見る"}
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01]"
        >
          もう一度診断する
        </button>
      </div>
    </section>
  );
}
