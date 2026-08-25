import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { axisMeta } from "@/lib/careers";
import { careerImage } from "@/lib/careers-images";
import { careerBySlug, careerOgImage, careerTypeLabel } from "@/lib/careers-og";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ShareRow } from "@/components/share-row";
import { QuizRow } from "@/components/quiz-card";
import { quizzes } from "@/lib/quizzes/data";
import { canonical } from "@/lib/site-config";

export const Route = createFileRoute("/quiz/tekishoku-result/$slug")({
  loader: ({ params }) => {
    const career = careerBySlug(params.slug);
    if (!career) throw notFound();
    return {
      name: career.name,
      category: career.category,
      desc: career.desc,
      axes: career.axes,
      type: careerTypeLabel(career),
      slug: params.slug,
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
    const title = `10問でわかる！あなたに向いている職業は「${loaderData.name}」｜ピクセルポップ 職業診断`;
    const description = `${loaderData.type}のあなたにおすすめの職業は「${loaderData.name}」。質問に答えるだけで、71職種の中から向いている仕事がわかる無料の適職診断です。`;
    const url = canonical(`/quiz/tekishoku-result/${params.slug}`);
    const image = careerOgImage(params.slug);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "ピクセルポップ 職業診断" },
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
  component: CareerResultPage,
});

function CareerResultPage() {
  const data = Route.useLoaderData();
  const recos = quizzes.filter((q) => q.id !== "tekishoku").slice(0, 4);

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        <section className="animate-pop card-surface mt-5 overflow-hidden">
          <div className="aspect-[4/3] w-full overflow-hidden bg-soft md:aspect-[16/9]">
            <img
              src={careerImage(data.name)}
              alt={`${data.name}の仕事のイメージ`}
              width={1024}
              height={768}
              className="size-full object-cover"
            />
          </div>
          <div className="bg-story px-5 py-8 text-center">
            <p className="text-xs font-bold tracking-widest text-primary-foreground/90">
              10問でわかる！あなたに向いている職業は
            </p>
            <h1 className="font-display mt-2 text-3xl font-black leading-tight text-primary-foreground">
              {data.name}
            </h1>
            <p className="mt-3 inline-block rounded-full bg-primary-foreground/20 px-4 py-1.5 text-xs font-black text-primary-foreground">
              {data.type}
            </p>
          </div>
          <div className="p-5">
            <p className="text-[11px] font-bold text-muted-foreground">{data.category}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{data.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.axes.map((a) => (
                <span key={a} className="text-[11px] font-bold text-primary">
                  #{axisMeta[a].label}
                </span>
              ))}
            </div>

            <ShareRow
              quizId="tekishoku"
              text={`私に向いている職業は「${data.name}」でした（${data.type}）`}
            />

            <Link
              to="/quiz/tekishoku"
              className="shadow-lift mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-black text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="size-5" />
              自分の適職も診断してみる
            </Link>
          </div>
        </section>

        <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
          ほかの診断もやってみる？ 🔮
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {recos.map((r) => (
            <QuizRow key={r.id} quiz={r} fromQuizId="tekishoku" location="career_result" />
          ))}
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
