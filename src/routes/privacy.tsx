import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_OWNER, canonical } from "@/lib/site-config";

const TITLE = "プライバシーポリシー｜ピクセルポップ";
const DESC =
  "ピクセルポップにおけるアクセス解析（Google Analytics 4）、Cookie、広告配信、お問い合わせ情報の取り扱いについて説明します。";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/privacy") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/privacy") }],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-surface mt-4 space-y-2 p-5 text-[13px] leading-relaxed text-muted-foreground">
      <h2 className="text-sm font-black text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader tagline={false} />

        <h1 className="font-display mt-5 text-2xl font-black leading-snug text-foreground">
          プライバシーポリシー
        </h1>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          本ポリシーは一般的なWebサイト向けの雛形です。実際の運用内容にあわせて加筆・修正のうえ
          ご利用ください（法的な適合性を保証するものではありません）。
        </p>

        <Section title="1. 基本方針">
          <p>
            ピクセルポップ（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。
            当サイトは診断コンテンツを提供するサイトであり、原則として会員登録や個人情報の入力を必要と
            しません。
          </p>
        </Section>

        <Section title="2. 取得する情報">
          <p>当サイトでは、次の情報を取得する場合があります。</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>アクセス解析による閲覧情報（閲覧ページ、参照元、端末・ブラウザの種類、おおよその地域など）</li>
            <li>お問い合わせフォームから送信された、お名前・メールアドレス・お問い合わせ内容</li>
          </ul>
          <p>
            診断の回答内容は利用者のブラウザ内で計算しており、回答そのものを当サイトが保存・送信することは
            ありません。
          </p>
        </Section>

        <Section title="3. アクセス解析ツールについて">
          <p>
            当サイトでは、サイトの改善を目的として Google LLC が提供する Google Analytics 4
            を利用する場合があります。Google Analytics
            はCookie等の技術を用いて閲覧情報を収集しますが、これらの情報は匿名で収集されており、個人を
            特定するものではありません。当サイトからは、氏名・メールアドレス等の個人を特定できる情報を
            Google Analytics に送信しません。
          </p>
          <p>
            Cookieの利用を望まない場合は、ブラウザの設定によりCookieを無効化できます。また、Google
            が提供するオプトアウト用アドオンを利用して収集を拒否することもできます。
          </p>
          <p>
            あわせて、検索エンジンでの表示状況の把握のために Google Search Console
            を利用する場合があります。
          </p>
        </Section>

        <Section title="4. 広告配信・アフィリエイトプログラムについて">
          <p>
            当サイトでは、第三者配信の広告サービスやアフィリエイトプログラム（Amazonアソシエイト、
            Google AdSense、ASP各社など）を利用する場合があります。これらの事業者は、利用者の興味に応じた
            広告を表示するためにCookie等を使用することがあります。
          </p>
          <p>
            利用者は、広告設定ページやブラウザ設定からパーソナライズ広告を無効にできます。なお、現時点で
            どのサービスを導入しているかは変更される可能性があり、本項は将来の利用を想定した記載です。
          </p>
        </Section>

        <Section title="5. SNSシェア機能について">
          <p>
            当サイトには X（旧Twitter）やLINE等へ結果を共有するリンクを設置しています。共有される内容は
            利用者が操作した時点の診断結果テキストとページURLのみで、個人情報は含まれません。共有先SNSでの
            情報の取り扱いは、各SNSのプライバシーポリシーに従います。
          </p>
        </Section>

        <Section title="6. お問い合わせ情報の利用目的">
          <p>
            お問い合わせフォームから取得した情報は、お問い合わせへの返信・対応、および当サイトの改善の
            ためにのみ利用し、ご本人の同意なく第三者へ提供しません。ただし、法令に基づく開示請求がある場合
            は例外とします。
          </p>
        </Section>

        <Section title="7. 免責事項">
          <p>
            当サイトの診断結果はエンタメを目的としたものであり、医学的・心理学的な診断や、進路・就職等の
            結果を保証するものではありません。掲載情報の利用により生じた損害について、当サイトは責任を
            負いかねます。また、外部サイトへのリンク先の内容についても責任を負いません。
          </p>
        </Section>

        <Section title="8. 著作権">
          <p>
            当サイトに掲載する診断の質問文・結果文・デザインの著作権は当サイトに帰属します。無断での複製・
            転載はご遠慮ください。引用の際は出典として当サイトへのリンクをお願いします。
          </p>
        </Section>

        <Section title="9. ポリシーの変更">
          <p>
            本ポリシーの内容は、法令の変更やサービス内容の変更に応じて予告なく改定される場合があります。
            改定後の内容は本ページに掲載した時点から適用されます。
          </p>
        </Section>

        <Section title="10. 運営者情報・お問い合わせ先">
          <ul className="space-y-1">
            <li>運営者名：{SITE_OWNER}</li>
            <li>お問い合わせ先：【お問い合わせ先】</li>
            <li>メールアドレス：{CONTACT_EMAIL}</li>
          </ul>
          <p>
            お問い合わせは
            <a href="/contact" className="font-bold text-primary">
              お問い合わせページ
            </a>
            からもお送りいただけます。
          </p>
        </Section>

        <SiteFooter />
      </div>
    </main>
  );
}
