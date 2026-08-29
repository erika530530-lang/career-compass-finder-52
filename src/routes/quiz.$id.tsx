import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { getQuiz, quizzes } from "@/lib/quizzes/data";
import { categoryMap, scoreQuiz, type Quiz } from "@/lib/quizzes/types";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { QuizRow } from "@/components/quiz-card";
import { ShareRow } from "@/components/share-row";


import { GameRow } from "@/components/game-card";
import { publishedGames } from "@/lib/games/data";
import { canonical } from "@/lib/site-config";
import { ketsudanLevelFromBand, ketsudanResultPath } from "@/lib/quizzes/ketsudan-og";
import { quizResultPath, resultLevelFromBand } from "@/lib/quizzes/result-og";

import { quizThumbnail } from "@/lib/quizzes/thumbnails";
import { quizIntro } from "@/lib/quizzes/intro";
import { relatedQuizzes } from "@/lib/quizzes/recommend";
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
  const intro = quizIntro(quiz);

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
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        {stage === "intro" && (
          <section className="animate-pop card-surface mt-5 overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden bg-soft">
              <img
                src={quizThumbnail(quiz)}
                alt={`${quiz.title}のイメージ画像`}
                width={1024}
                height={576}
                className="size-full object-cover"
              />
            </div>
            <div className="bg-story px-5 py-8 text-center">
              <p className="text-xs font-bold tracking-widest text-primary-foreground/90">
                {quiz.questionCount}問・{quiz.estimatedTime}・登録なし
              </p>
              <h1 className="font-display mt-3 text-3xl font-black leading-tight text-primary-foreground">
                {quiz.title}
              </h1>
              <p className="mt-3 text-xs font-medium text-primary-foreground/90">
                {cat.emoji} {cat.label}・{quiz.questionCount}問・登録なし
              </p>
            </div>
            <div className="p-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">{quiz.description}</p>

              <div className="mt-4 space-y-3 rounded-2xl bg-secondary/60 p-4">
                <h2 className="text-xs font-black text-foreground">この診断について</h2>
                <IntroItem label="こんな人に向いています" text={intro.forWho} />
                <IntroItem label="わかること" text={intro.learn} />
                <IntroItem label="ボリューム" text={intro.volume} />
              </div>

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
            <div className="rounded-full border border-border bg-card/80 p-1.5 backdrop-blur">
              <div className="flex gap-1">
                {quiz.questions.map((_, i) => (
                  <div key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`bg-story h-full rounded-full transition-all duration-500 ${
                        i <= step ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div key={q.id} className="animate-pop card-surface mt-4 overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="story-ring">
                    <div className="flex size-10 items-center justify-center rounded-full bg-card text-lg">
                      {quiz.emoji}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">
                      {step + 1} / {quiz.questions.length}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{quiz.metricLabel}を測定中</p>
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-black text-secondary-foreground">
                  {Math.round(((step + 1) / quiz.questions.length) * 100)}%
                </span>
              </div>

              <div className="bg-story px-5 py-10 sm:px-6 sm:py-12">
                <h1 className="font-display text-center text-xl font-black leading-relaxed text-primary-foreground sm:text-2xl">
                  {q.text}
                </h1>
              </div>

              <div className="flex flex-col gap-2.5 p-3 sm:p-4">
                {q.choices.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => answer(c.score)}
                    className="min-h-[56px] rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm font-black text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98] sm:min-h-[60px] sm:text-base"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-3 w-full rounded-full bg-card/80 py-3 text-xs font-black text-muted-foreground backdrop-blur transition-colors hover:bg-card"
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

  // 結果画像のパス（resultImageId があれば参照）
  const resultImagePath = band.resultImageId
    ? `/images/diagnoses/result/${band.resultImageId}.png`
    : null;

  return (
    <section className="animate-pop mt-5">
      {/* 結果画像（スマホでスクショしたときに見える位置） */}
      {resultImagePath && (
        <div className="card-surface mb-4 overflow-hidden">
          <img
            src={resultImagePath}
            alt={`${band.title} - ${quiz.metricLabel}の診断結果画像`}
            className="h-auto w-full bg-story object-cover"
            loading="lazy"
          />
        </div>
      )}

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
        shareUrl={(() => {
          if (quiz.id === "ketsudan") {
            const level = ketsudanLevelFromBand(band);
            return level ? canonical(ketsudanResultPath(level)) : undefined;
          }
          const level = resultLevelFromBand(band);
          return level ? canonical(quizResultPath(quiz.id, level)) : undefined;
        })()}
      />




      {quiz.id === "renai-mendo" && (
        <div className="card-surface mt-5 overflow-hidden border border-border p-4">
          <p className="text-[10px] font-bold text-muted-foreground">
            PR
          </p>
          <p className="mt-1 text-sm font-black text-foreground">
            恋愛の悩みを誰かに相談してみる？
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            恋愛や人間関係など、ひとりで抱えている悩みを相談できます。
          </p>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4BACLC+EI572Y+2PEO+BYLJM"
            rel="nofollow sponsored"
            target="_blank"
            className="mt-3 flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-black text-primary-foreground"
          >
            ココナラ電話占いを見てみる
          </a>
          <img
            width="1"
            height="1"
            src="https://www18.a8.net/0.gif?a8mat=4BACLC+EI572Y+2PEO+BYLJM"
            alt=""
          />
        </div>
      )}

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
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {recos.map((r) => (
          <QuizRow key={r.id} quiz={r} fromQuizId={quiz.id} />
        ))}
      </div>
      <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
        次は頭を使うゲームもやってみる？ 🧠
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {publishedGames.slice(0, 2).map((g) => (
          <GameRow key={g.id} game={g} />
        ))}
      </div>
      <Link
        to="/games"
        search={{ cat: "all" }}
        className="mx-auto mt-3 flex min-h-12 w-full max-w-sm items-center justify-center rounded-full border border-border bg-card text-sm font-black text-foreground"
      >
        ゲームを全部見る 🕹️
      </Link>
      <Link
        to="/quizzes"
        search={{ cat: "all", sort: "popular" }}
        className="shadow-lift mx-auto mt-5 block w-full max-w-sm rounded-full bg-primary py-3.5 text-center text-sm font-black text-primary-foreground"
      >
        診断をもっと見る
      </Link>
    </section>
  );
}

function IntroItem({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-primary">{label}</p>
      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
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
