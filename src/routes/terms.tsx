import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_OWNER, SITE_URL, canonical } from "@/lib/site-config";

const TITLE = "利用規約｜ピクセルポップ（PixelPop）";
const DESC =
  "PixelPop（ピクセルポップ）の利用規約です。診断・クイズ・ミニゲームのご利用条件、禁止事項、著作権、免責事項、広告の取り扱いについて定めています。";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/terms") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/terms") }],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-surface mt-4 space-y-2 p-5 text-[13px] leading-relaxed text-muted-foreground">
      <h2 className="text-sm font-black text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function TermsPage() {
  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        <h1 className="font-display mt-5 text-2xl font-black leading-snug text-foreground">
          利用規約
        </h1>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          PixelPop（ピクセルポップ／{SITE_URL}）のご利用条件を定めます。ご利用の前にお読みください。
        </p>

        <Section title="1. 適用">
          <p>
            本規約は、{SITE_OWNER}
            が運営する当サイト（診断・クイズ・ミニゲームを含むすべてのコンテンツ）の利用条件を定めるものです。
            当サイトを利用された時点で、本規約に同意いただいたものとみなします。
          </p>
        </Section>

        <Section title="2. 利用について">
          <p>
            当サイトは会員登録なしで、誰でも無料でご利用いただけます。診断の回答内容は主に閲覧中の端末で
            処理され、氏名や住所などの個人情報の入力は必要ありません。通信環境やメンテナンスにより、
            予告なく内容の変更・提供の中断を行う場合があります。
          </p>
        </Section>

        <Section title="3. 診断・クイズの内容について">
          <p>
            当サイトの診断・クイズ・ミニゲームは、エンターテインメントを目的としたコンテンツです。
            医学的・心理学的・法的な診断や、進路・就職・恋愛・金銭に関する専門的な助言ではありません。
            結果は目安として楽しんでいただき、重要な判断は必ずご自身や専門家の判断で行ってください。
          </p>
        </Section>

        <Section title="4. 禁止事項">
          <ul className="list-disc space-y-1 pl-5">
            <li>法令または公序良俗に反する行為</li>
            <li>当サイトのサーバーやネットワークの機能を破壊・妨害する行為</li>
            <li>自動化ツール等による過度なアクセスやデータの大量取得</li>
            <li>コンテンツを無断で複製・転載・改変し、公開または販売する行為</li>
            <li>他の利用者、第三者、当サイト運営者の権利や利益を侵害する行為</li>
          </ul>
        </Section>

        <Section title="5. 著作権">
          <p>
            当サイトに掲載している文章、診断の問題文・結果文、イラスト、画像、デザイン等の著作権は、
            運営者または正当な権利者に帰属します。引用の範囲を超える無断転載はご遠慮ください。
            SNSでの結果シェアや、当サイトへのリンク（URLの掲載）は自由に行っていただけます。
          </p>
        </Section>

        <Section title="6. 広告・アフィリエイトについて">
          <p>
            当サイトでは、運営費用にあてるため Google AdSense
            などの広告配信サービス、およびアフィリエイトプログラム（A8.net・afb
            など）を利用する場合があります。広告リンクには「PR」と表記します。広告主の商品・サービスに関する
            お問い合わせやお支払い等は、各広告主・提供事業者へ直接お願いいたします。詳細は
            プライバシーポリシーもご確認ください。
          </p>
        </Section>

        <Section title="7. 免責事項">
          <p>
            当サイトの情報については正確性に努めていますが、その完全性・有用性を保証するものではありません。
            当サイトの利用、または利用できないことにより生じたいかなる損害についても、運営者は責任を負いません。
            外部サイトへのリンク先の内容についても責任を負いかねます。
          </p>
        </Section>

        <Section title="8. 規約の変更">
          <p>
            本規約は必要に応じて予告なく変更する場合があります。変更後の内容は、当ページに掲載した時点から
            適用されます。
          </p>
        </Section>

        <Section title="9. お問い合わせ">
          <p>
            本規約に関するご質問は、お問い合わせページ、または {CONTACT_EMAIL}{" "}
            までご連絡ください。
          </p>
        </Section>

        <SiteFooter />
      </div>
    </main>
  );
}
