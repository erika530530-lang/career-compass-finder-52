import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { getQuiz, quizzes } from "@/lib/quizzes/data";
import { categoryMap, scoreQuiz, type Quiz } from "@/lib/quizzes/types";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { QuizRow } from "@/components/quiz-card";
import { ShareRow } from "@/components/share-row";
import { canonical } from "@/lib/site-config";
import { trackQuizComplete, trackQuizStart, trackResultView } from "@/lib/analytics";

export const Route = createFileRoute("/quiz/$id")({
  loader: ({ params }) => {
    const quiz = getQuiz(params.id);
    if (!quiz || quiz.kind !== "percent") throw notFound();
    return { quiz };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "診断が見つかりません｜ピクセルポップ" }, { name: "robots", content: "noindex" }] };
    }
    const q = loaderData.quiz;
    const title = `${q.title}｜${q.nickname ?? q.metricLabel}診断｜ピクセルポップ`;
    const url = canonical(`/quiz/${params.id}`);
    return {
      meta: [
        { title },
        { name: "description", content: q.description },
        { property: "og:title", content: title },
        { property: "og:description", content: q.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: QuizPage,
});

function QuizPage() {
  const { quiz } = Route.useLoaderData();
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const cat = categoryMap[quiz.category];

  const result = useMemo(
    () => (stage === "result" ? scoreQuiz(quiz, answers) : null),
    [stage, answers, quiz],
  );

  const q = quiz.questions[step]!;

  useEffect(() => {
    if (stage === "result" && result) {
      trackQuizComplete(quiz.id, result.band.title);
      trackResultView(quiz.id, result.band.title);
    }
  }, [stage, result, quiz.id]);

  function answer(score: number) {
    setAnswers({ ...answers, [q.id]: score });
    if (step + 1 >= quiz.questions.length) setStage("result");
    else setStep(step + 1);
  }

  function start() {
    trackQuizStart(quiz.id);
    setStage("quiz");
  }

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader tagline={false} />

        {stage === "intro" && (
          <section className="animate-pop card-surface mt-5 overflow-hidden">
            <div className="bg-story px-5 py-10 text-center">
              <p className="text-xs font-bold tracking-widest text-primary-foreground/90">
                {quiz.questionCount}問・{quiz.estimatedTime}・登録なし
              </p>
              <h1 className="font-display mt-3 text-3xl font-black leading-tight text-primary-foreground">
                {quiz.title}
              </h1>
              <p className="mt-3 text-xs font-medium text-primary-foreground/90">
                {cat.emoji} {cat.label}・{Math.round(quiz.plays / 1000)}k人が診断済み
              </p>
            </div>
            <div className="p-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">{quiz.description}</p>
              <button
                onClick={start}
                className="shadow-lift mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-black text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="size-5" />
                診断スタート
              </button>
            </div>
          </section>
        )}

        {stage === "quiz" && (
          <section className="mt-5">
            <div className="flex gap-1">
              {quiz.questions.map((_, i) => (
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
                    {quiz.emoji}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {step + 1} / {quiz.questions.length}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{quiz.metricLabel}を測定中</p>
                </div>
              </div>

              <div className="bg-story px-6 py-12">
                <h1 className="font-display text-center text-xl font-black leading-relaxed text-primary-foreground">
                  {q.text}
                </h1>
              </div>

              <div className="flex flex-col gap-2 p-4">
                {q.choices.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => answer(c.score)}
                    className="rounded-full border border-border bg-background px-4 py-3.5 text-left text-sm font-bold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-3 w-full rounded-full bg-card/70 py-2.5 text-xs font-bold text-muted-foreground backdrop-blur"
              >
                ← ひとつ戻る
              </button>
            )}
          </section>
        )}

        {stage === "result" && result && (
          <ResultView
            quiz={quiz}
            percent={result.percent}
            band={result.band}
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

function ResultView({
  quiz,
  percent,
  band,
  onRestart,
}: {
  quiz: Quiz;
  percent: number;
  band: NonNullable<ReturnType<typeof scoreQuiz>>["band"];
  onRestart: () => void;
}) {
  const recos = quiz.recommendedDiagnoses
    .map((id) => quizzes.find((x) => x.id === id))
    .filter((x): x is Quiz => Boolean(x));

  return (
    <section className="animate-pop mt-5">
      <div className="card-surface overflow-hidden">
        <div className="bg-story px-5 py-10 text-center">
          <p className="text-xs font-bold tracking-widest text-primary-foreground/90">
            あなたの{quiz.metricLabel}
          </p>
          <p className="font-display text-7xl font-black leading-none text-primary-foreground">
            {percent}%
          </p>
          <p className="mt-4 text-3xl">{band.emoji}</p>
          <h1 className="font-display mt-1 text-2xl font-black text-primary-foreground">
            {band.title}
          </h1>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">{band.description}</p>

          <Block title="あなたの特徴" items={band.features} />
          <Block title="良いところ" items={band.good} />
          <Block title="注意点" items={band.caution} />

          <ShareRow
            quizId={quiz.id}
            text={`私の${quiz.metricLabel}は${percent}%でした${band.emoji}「${band.title}」`}
          />
          <button
            onClick={onRestart}
            className="mt-2 w-full rounded-full border border-border bg-card py-3 text-sm font-black text-foreground"
          >
            もう一回やる 🔁
          </button>
        </div>
      </div>

      <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
        次はこれやってみる？ 👀
      </h2>
      <div className="mt-3 flex flex-col gap-3">
        {recos.map((r) => (
          <QuizRow key={r.id} quiz={r} fromQuizId={quiz.id} />
        ))}
      </div>
      <Link
        to="/quizzes"
        search={{ cat: "all", sort: "popular" }}
        className="shadow-lift mt-4 block rounded-full bg-primary py-3.5 text-center text-sm font-black text-primary-foreground"
      >
        診断をもっと見る
      </Link>
    </section>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-black text-foreground">{title}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((i) => (
          <li
            key={i}
            className="rounded-2xl bg-secondary px-3 py-2 text-[13px] font-bold text-secondary-foreground"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
