import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ShareRow } from "@/components/share-row";
import { QuizRow } from "@/components/quiz-card";
import { quizzes } from "@/lib/quizzes/data";
import { canonical } from "@/lib/site-config";
import { quizResultBand, quizResultOgImage } from "@/lib/quizzes/result-og";
import { relatedQuizzes } from "@/lib/quizzes/recommend";

export const Route = createFileRoute("/quiz/result/$id/$level")({
  loader: ({ params }) => {
    const found = quizResultBand(params.id, params.level);
    if (!found) throw notFound();
    const { quiz, band } = found;
    return {
      quizId: quiz.id,
      quizTitle: quiz.title,
      metricLabel: quiz.metricLabel,
      questionCount: quiz.questionCount,
      title: band.title,
      emoji: band.emoji,
      description: band.description,
      features: band.features,
      good: band.good,
      caution: band.caution,
      image: `/images/diagnoses/result/${band.resultImageId}.png`,
    };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "結果が見つかりません｜ピクセルポップ" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const d = loaderData;
    const title = `${d.questionCount}問でわかる！あなたの${d.metricLabel}タイプは「${d.title}」｜ピクセルポップ`;
    const description = `${d.metricLabel}タイプは「${d.title}」。${d.questionCount}問で自分の${d.metricLabel}がわかる無料診断です。`;
    const url = canonical(`/quiz/result/${params.id}/${params.level}`);
    const image = quizResultOgImage(params.id, params.level);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "ピクセルポップ" },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: QuizResultPage,
});

function QuizResultPage() {
  const data = Route.useLoaderData();
  const self = quizzes.find((q) => q.id === data.quizId);
  const recos = self ? relatedQuizzes(self, 4) : quizzes.slice(0, 4);

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        <section className="animate-pop card-surface mt-5 overflow-hidden">
          <img
            src={data.image}
            alt={`${data.title}の診断結果イメージ`}
            className="h-auto w-full bg-soft object-cover"
          />
          <div className="bg-story px-5 py-8 text-center">
            <p className="text-xs font-bold tracking-widest text-primary-foreground/90">
              {data.questionCount}問でわかる！あなたの{data.metricLabel}タイプは
            </p>
            <p className="mt-2 text-3xl">{data.emoji}</p>
            <h1 className="font-display mt-1 text-2xl font-black leading-tight text-primary-foreground">
              {data.title}
            </h1>
          </div>
          <div className="p-5">
            <p className="text-sm leading-relaxed text-foreground">{data.description}</p>

            <Block title="このタイプの特徴" items={data.features} />
            <Block title="良いところ" items={data.good} />
            <Block title="注意点" items={data.caution} />

            <ShareRow
              quizId={data.quizId}
              text={`私の${data.metricLabel}タイプは「${data.title}」でした${data.emoji}`}
            />

            <Link
              to="/quiz/$id"
              params={{ id: data.quizId }}
              className="shadow-lift mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-black text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="size-5" />
              自分も診断してみる
            </Link>
          </div>
        </section>

        <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
          「{data.title}」の人におすすめ 👀
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {recos.map((r) => (
            <QuizRow key={r.id} quiz={r} fromQuizId={data.quizId} location="quiz_result" />
          ))}
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-black text-primary">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="text-sm leading-relaxed text-muted-foreground">
            ・{it}
          </li>
        ))}
      </ul>
    </div>
  );
}
