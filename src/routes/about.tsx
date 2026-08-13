import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { quizzes } from "@/lib/quizzes/data";
import { categories } from "@/lib/quizzes/types";
import { canonical } from "@/lib/site-config";

const TITLE = "ピクセルポップとは？｜サイトについて｜ピクセルポップ";
const DESC =
  "ピクセルポップは、暇つぶし感覚で楽しめる診断コンテンツを集めたサイトです。診断の作り方、使い方、楽しみ方を紹介します。";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/about") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        <h1 className="font-display mt-5 text-2xl font-black leading-snug text-foreground">
          ピクセルポップとは？ 🎈
        </h1>

        <section className="card-surface mt-4 space-y-3 p-5 text-[13px] leading-relaxed text-muted-foreground">
          <p className="text-sm font-black text-foreground">
            ピクセルポップは、暇つぶし感覚で楽しめる診断コンテンツを集めたサイトです。
          </p>
          <p>
            通学中の電車、授業の合間、寝る前のちょっとした時間。そんな「なんとなく暇」なタイミングに、
            1〜3分でサクッと終わる診断を無料・登録不要で遊べます。
          </p>
          <p>
            全{quizzes.length}種類の診断は、仕事・性格・恋愛・お金・人間関係・ネタ・将来の
            {categories.length}カテゴリーに分かれています。結果はそのままスクショしたり、
            X（旧Twitter）やLINEでシェアして友だちと見せ合えます。
          </p>
        </section>

        <h2 className="font-display mt-6 px-1 text-base font-black text-foreground">
          大事にしていること 💡
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {[
            "登録なし・無料。開いたらすぐ遊べる",
            "スマホで片手で終わる質問数（10〜18問）",
            "結果は読み物として面白い長さで書く",
            "笑えるけど、誰かを傷つけない表現にする",
          ].map((t) => (
            <li
              key={t}
              className="rounded-2xl bg-secondary px-4 py-3 text-[13px] font-bold text-secondary-foreground"
            >
              {t}
            </li>
          ))}
        </ul>

        <section className="card-surface mt-6 space-y-2 p-5 text-[13px] leading-relaxed text-muted-foreground">
          <p className="text-sm font-black text-foreground">診断結果の扱いについて</p>
          <p>
            各診断はエンタメを目的としたもので、医学的・心理学的な判定や、進路・就職の合否を保証するもの
            ではありません。「そういう見方もあるかも」くらいの軽い気持ちで楽しんでください。
          </p>
          <p>
            回答内容はブラウザの中だけで計算しており、個人を特定できる情報を送信することはありません。
            詳しくはプライバシーポリシーをご覧ください。
          </p>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
