import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_OWNER, canonical } from "@/lib/site-config";

const TITLE = "プライバシーポリシー｜ピクセルポップ（PixelPop）";
const DESC =
  "PixelPopにおけるCookie、アクセス解析（Google Analytics 4）、広告配信（Google AdSense・A8.net・afb）、お問い合わせ情報の取り扱いについて説明します。";

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
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-6">
        <SiteHeader tagline={false} />

        <h1 className="font-display mt-5 text-2xl font-black leading-snug text-foreground">
          プライバシーポリシー
        </h1>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          PixelPop（ピクセルポップ／{SITE_URL}）における個人情報・Cookieの取り扱いについて定めます。
        </p>

        <Section title="1. 基本方針">
          <p>
            PixelPop（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。当サイトは
            診断・クイズ・ミニゲームを提供するサイトで、会員登録は不要です。閲覧や診断の利用にあたって、
            氏名・住所・電話番号などの入力は必要ありません。
          </p>
        </Section>

        <Section title="2. 取得する情報">
          <p>当サイトでは、次の情報を取得する場合があります。</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              アクセス解析・広告配信に伴う閲覧情報（閲覧ページ、参照元、端末・ブラウザの種類、おおよその地域など）
            </li>
            <li>お問い合わせの際に利用者ご自身が送信された、お名前・メールアドレス・お問い合わせ内容</li>
          </ul>
          <p>
            診断・クイズ・ゲームの回答内容や記録（スコアや連続プレイ日数など）は、利用者のブラウザ内で計算・保存
            しており、当サイトのサーバーに送信・保存することはありません。
          </p>
        </Section>

        <Section title="3. Cookieおよび類似技術について">
          <p>
            Cookieとは、Webサイトが利用者のブラウザに保存する小さなデータのことです。当サイトおよび第三者
            （広告配信事業者・アクセス解析事業者）は、広告配信、アクセス解析、サイトの改善などの目的でCookieや
            類似の技術を利用する場合があります。
          </p>
          <p>
            Cookieの利用を望まない場合は、お使いのブラウザの設定からCookieを無効化・削除できます。ただし、
            Cookieを無効にすると一部の機能（記録の保存など）が正しく動作しない場合があります。
          </p>
        </Section>

        <Section title="4. アクセス解析（Google Analytics 4）について">
          <p>
            当サイトでは、サイトの改善を目的として Google LLC が提供する Google Analytics 4
            を利用する場合があります。Google Analytics
            はCookie等の技術を用いて閲覧情報を収集しますが、収集される情報は個人を直接特定するものでは
            ありません。当サイトからは、氏名・メールアドレス等の個人を特定できる情報や、診断の回答内容そのものを
            Google Analytics に送信しません。
          </p>
          <p>
            Cookieの利用を望まない場合は、ブラウザの設定によりCookieを無効化できます。また、Google
            が提供するオプトアウト用アドオンを利用して収集を拒否することもできます。
          </p>
        </Section>

        <Section title="5. Google Search Console について">
          <p>
            検索エンジンにおける当サイトの表示状況や検索からの流入状況を確認するため、Google が提供する
            Google Search Console を利用する場合があります。
          </p>
        </Section>

        <Section title="6. 広告配信（Google AdSense）について">
          <p>
            当サイトでは、第三者配信の広告サービスである Google AdSense
            を利用して広告を掲載します。Google
            などの第三者配信事業者は、Cookie等の技術を使用して広告を配信する場合があります。
          </p>
          <p>
            これにより、利用者の過去の当サイトや他サイトへのアクセス情報にもとづいて、利用者の興味・関心に
            応じた広告（パーソナライズド広告）が表示される場合があります。これらの情報から、当サイトが利用者
            個人を特定することはできません。
          </p>
          <p>
            パーソナライズド広告は、Google の「広告設定」ページ（
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-bold text-primary"
            >
              https://myadcenter.google.com/
            </a>
            ）から利用者ご自身で管理・無効化できます。また、
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-bold text-primary"
            >
              Google の広告に関するポリシー
            </a>
            もあわせてご確認ください。
          </p>
        </Section>

        <Section title="7. アフィリエイトプログラム（A8.net・afb）について">
          <p>
            当サイトでは、株式会社ファンコミュニケーションズが運営する「A8.net」および株式会社フォーイットが
            運営する「afb（アフィビー）」のアフィリエイトプログラムを利用（または今後利用）します。
          </p>
          <p>
            当サイトに掲載された広告リンクを経由して、商品の購入やサービスの申し込み等が行われた場合、
            当サイト運営者に成果報酬が支払われる場合があります。報酬の有無によって、診断結果やゲームの内容が
            変わることはありません。
          </p>
          <p>
            これらのアフィリエイトサービスでは、成果の計測のためにCookie等の技術を利用する場合があります。
            Cookieにより取得される情報に、氏名や住所などの個人を特定する情報は含まれません。Cookieの利用は
            ブラウザの設定から無効にできます。
          </p>
        </Section>

        <Section title="8. 診断・コンテンツについて（免責事項）">
          <p>
            当サイトで提供する心理テスト、性格診断、職業診断、占い、クイズ、ミニゲーム等は、娯楽および
            自己理解の参考を目的としたものです。医学的・心理学的な診断や、専門家による職業適性判定を行うもの
            ではなく、進路・就職・健康等の結果を保証するものでもありません。
          </p>
          <p>
            掲載情報の正確性には努めていますが、その利用により生じた損害について当サイトは責任を負いかねます。
            また、外部サイトへのリンク先の内容についても責任を負いません。
          </p>
        </Section>

        <Section title="9. SNSシェア機能について">
          <p>
            当サイトには X（旧Twitter）やLINE等へ結果を共有するリンクを設置しています。共有される内容は
            利用者が操作した時点の結果テキストとページURLのみで、個人情報は含まれません。共有先SNSでの
            情報の取り扱いは、各SNSのプライバシーポリシーに従います。
          </p>
        </Section>

        <Section title="10. 個人情報の利用目的と第三者提供">
          <p>
            お問い合わせ等で利用者から提供された情報は、次の目的の範囲内で利用します。
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>お問い合わせへの回答・ご連絡</li>
            <li>サービスの提供および運営</li>
            <li>サイトやコンテンツの改善</li>
            <li>不正利用・規約違反への対応</li>
          </ul>
          <p>
            法令に基づく場合や、人の生命・身体・財産の保護のために必要な場合等を除き、ご本人の同意なく個人情報を
            第三者に提供することはありません。取得した情報は、利用目的の達成に必要な期間を超えて保有しません。
          </p>
        </Section>

        <Section title="11. 著作権">
          <p>
            当サイトに掲載する質問文・結果文・解説・デザインの著作権は当サイトに帰属します。無断での複製・
            転載はご遠慮ください。引用の際は出典として当サイトへのリンクをお願いします。
          </p>
        </Section>

        <Section title="12. ポリシーの変更">
          <p>
            本ポリシーの内容は、法令の変更やサービス内容の変更に応じて改定される場合があります。改定後の内容は
            本ページに掲載した時点から適用されます。
          </p>
        </Section>

        <Section title="13. お問い合わせ先">
          <ul className="space-y-1">
            <li>サイト名：PixelPop（ピクセルポップ）</li>
            <li>
              メールアドレス：
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-primary">
                {CONTACT_EMAIL}
              </a>
            </li>
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
