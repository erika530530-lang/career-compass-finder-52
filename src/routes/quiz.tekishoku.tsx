import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { axisMeta, careers, diagnose, questions, type Axis } from "@/lib/careers";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { QuizRow } from "@/components/quiz-card";
import { ShareRow } from "@/components/share-row";
import { quizzes } from "@/lib/quizzes/data";
import { canonical } from "@/lib/site-config";
import { trackQuizComplete, trackQuizStart, trackResultView } from "@/lib/analytics";

export const Route = createFileRoute("/quiz/tekishoku")({
  head: () => ({
    meta: [
      { title: "てきしょく診断 | 18問で70職業からあなたの適職を判定 - ピクセルポップ" },
      {
        name: "description",
        content:
          "18の質問に答えるだけで、6つの適性タイプから70以上の職業の中から向いている仕事をランキング表示。無料・登録不要の適職診断。",
      },
      { property: "og:title", content: "てきしょく診断 | 18問であなたの適職がわかる" },
      {
        property: "og:description",
        content: "6つの適性タイプを測定し、70以上の職業から向いている仕事をランキング表示します。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tekishoku,
});

const scale = [
  { v: 1, label: "ぜんぜん違う", emoji: "🙅" },
  { v: 2, label: "あんまり", emoji: "😐" },
  { v: 3, label: "どっちとも", emoji: "🤔" },
  { v: 4, label: "ちょっと分かる", emoji: "🙂" },
  { v: 5, label: "めっちゃ分かる", emoji: "🔥" },
];

const axisEmoji: Record<Axis, string> = {
  R: "🛠️",
  I: "🔬",
  A: "🎨",
  S: "💗",
  E: "🚀",
  C: "🗂️",
};

function Tekishoku() {
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const result = useMemo(() => (stage === "result" ? diagnose(answers) : null), [stage, answers]);

  useEffect(() => {
    if (stage === "result" && result) {
      const label = result.top?.[0]?.axis ?? "unknown";
      trackQuizComplete("tekishoku", String(label));
      trackResultView("tekishoku", String(label));
    }
  }, [stage, result]);
  const q = questions[step]!;

  function answer(v: number) {
    setAnswers({ ...answers, [q.id]: v });
    if (step + 1 >= questions.length) setStage("result");
    else setStep(step + 1);
  }

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader tagline={false} />

        {stage === "intro" && <Intro onStart={() => { trackQuizStart("tekishoku"); setStage("quiz"); }} />}
        {stage === "quiz" && <Quiz step={step} onAnswer={answer} onBack={() => setStep(step - 1)} />}
        {stage === "result" && result && (
          <ResultView
            result={result}
            onRestart={() => {
              setAnswers({});
              setStep(0);
              setStage("intro");
            }}
          />
        )}

        <SiteFooter />
      </div>
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="animate-pop mt-5">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {(Object.keys(axisMeta) as Axis[]).map((a) => (
          <div key={a} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <div className="story-ring animate-float">
              <div className="flex size-14 items-center justify-center rounded-full bg-card text-2xl">
                {axisEmoji[a]}
              </div>
            </div>
            <span className="text-[10px] font-bold text-foreground">{axisMeta[a].label}</span>
          </div>
        ))}
      </div>

      <div className="card-surface mt-4 overflow-hidden">
        <div className="bg-story px-5 py-10 text-center">
          <p className="text-xs font-bold tracking-widest text-primary-foreground/90">
            18問・約2分・登録なし
          </p>
          <h1 className="font-display mt-3 text-3xl font-black leading-tight text-primary-foreground">
            きみに向いてる
            <br />
            仕事、なに？
          </h1>
          <p className="mt-3 text-xs font-medium text-primary-foreground/90">
            {careers.length}職業からランキングで発表 🏆
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={onStart}
            className="shadow-lift flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-black text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="size-5" />
            診断スタート
          </button>
        </div>
      </div>
    </section>
  );
}

function Quiz({
  step,
  onAnswer,
  onBack,
}: {
  step: number;
  onAnswer: (v: number) => void;
  onBack: () => void;
}) {
  const q = questions[step]!;
  return (
    <section className="mt-5">
      <div className="flex gap-1">
        {questions.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-card/70">
            <div
              className={`bg-story h-full rounded-full transition-all duration-500 ${
                i <= step ? "w-full" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      <div key={q.id} className="animate-pop card-surface mt-4 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="story-ring">
            <div className="flex size-10 items-center justify-center rounded-full bg-card text-lg">
              {axisEmoji[q.axis]}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              Q{step + 1} / {questions.length}
            </p>
            <p className="text-[11px] text-muted-foreground">{axisMeta[q.axis].short}</p>
          </div>
        </div>

        <div className="bg-story px-6 py-12">
          <h1 className="font-display text-center text-xl font-black leading-relaxed text-primary-foreground">
            {q.text}
          </h1>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {scale.map((s) => (
            <button
              key={s.v}
              onClick={() => onAnswer(s.v)}
              className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-left text-sm font-bold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <span className="text-lg">{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button
          onClick={onBack}
          className="mt-3 w-full rounded-full bg-card/70 py-2.5 text-xs font-bold text-muted-foreground backdrop-blur"
        >
          ← ひとつ戻る
        </button>
      )}
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
  const sorted = (Object.keys(axisMeta) as Axis[]).sort(
    (a, b) => result.scores[b] - result.scores[a],
  );
  const recos = quizzes.filter((qz) => qz.id !== "tekishoku").slice(0, 3);

  return (
    <section className="animate-pop mt-5">
      <div className="card-surface p-5">
        <div className="flex items-center gap-4">
          <div className="story-ring">
            <div className="flex size-20 items-center justify-center rounded-full bg-card text-4xl">
              {axisEmoji[result.top[0]!]}
            </div>
          </div>
          <div className="flex flex-1 justify-around text-center">
            {sorted.slice(0, 3).map((a) => (
              <div key={a}>
                <p className="font-display text-lg font-black text-foreground">
                  {result.scores[a]}
                </p>
                <p className="text-[10px] text-muted-foreground">{axisMeta[a].label}</p>
              </div>
            ))}
          </div>
        </div>

        <h1 className="font-display mt-4 text-2xl font-black leading-tight text-foreground">
          きみは
          <span className="text-gradient">
            {result.top.map((a) => axisMeta[a].label).slice(0, 2).join("×")}
          </span>
          タイプ
        </h1>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-bold text-foreground">{axisMeta[result.top[0]!].label}</span>
            が最も強いタイプ。{axisMeta[result.top[0]!].desc}
          </p>
          <p>
            そこに
            <span className="font-bold text-foreground">{axisMeta[result.top[1]!].label}</span>
            の力が加わることで、{axisMeta[result.top[1]!].short}場面でも強みを発揮する。
            {axisMeta[result.top[1]!].desc}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {sorted.map((a) => (
            <span
              key={a}
              className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-foreground"
            >
              #{axisMeta[a].label} {result.scores[a]}
            </span>
          ))}
        </div>

        <ShareRow
          text={`私は${result.top.map((a) => axisMeta[a].label).slice(0, 2).join("×")}タイプ！1位は「${result.matches[0]!.career.name}」`}
        />
      </div>

      <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
        向いてる仕事ランキング 🏆
      </h2>
      <ol className="mt-3 flex flex-col gap-3">
        {top.map((m, i) => (
          <li key={m.career.name} className="card-surface overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="story-ring">
                <div className="flex size-9 items-center justify-center rounded-full bg-card text-xs font-black text-foreground">
                  {i + 1}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-black text-foreground">{m.career.name}</h3>
                <p className="text-[11px] text-muted-foreground">{m.career.category}</p>
              </div>
              <span className="text-gradient font-display text-lg font-black">{m.score}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary">
              <div className="bg-story h-full" style={{ width: `${m.score}%` }} />
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-foreground">{m.career.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.career.axes.map((a) => (
                  <span key={a} className="text-[11px] font-bold text-primary">
                    #{axisMeta[a].label}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={() => setShowAll(!showAll)}
          className="rounded-full border border-border bg-card py-3.5 text-sm font-black text-foreground transition-colors hover:bg-secondary"
        >
          {showAll ? "上位6件だけ見る" : "上位20件をぜんぶ見る"}
        </button>
        <button
          onClick={onRestart}
          className="shadow-lift rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
        >
          もう一回やる 🔁
        </button>
      </div>

      <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
        次はこれやってみる？ 👀
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {recos.map((r) => (
          <QuizRow key={r.id} quiz={r} />
        ))}
      </div>
      <Link
        to="/quizzes"
        search={{ cat: "all", sort: "popular" }}
        className="mt-4 block rounded-full border border-border bg-card py-3.5 text-center text-sm font-black text-foreground"
      >
        診断をもっと見る
      </Link>
    </section>
  );
}
