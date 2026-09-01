/**
 * ピクセルポップ サイト設定
 * ここの値を書き換えるだけで、GA4 / Search Console / 連絡先を差し替えできます。
 */

/** 本番URL（canonical・sitemap で使用） */
export const SITE_URL = "https://pixelpop.jp";

export const SITE_NAME = "ピクセルポップ";
export const SITE_TAGLINE = "暇つぶしできる診断、いっぱいあります。";

/**
 * Google Analytics 4 の測定ID。
 * 例: "G-XXXXXXXXXX"
 * 空文字のあいだはGA4スクリプトを読み込みません（＝本番前は無効）。
 *
 * GTM 経由で GA4 を計測する場合は、ここを空のままにし、
 * GTM コンテナ内で GA4 タグを設定してください。
 * 両方を同時に有効にすると計測が重複する可能性があります。
 */
export const GA4_MEASUREMENT_ID = "";

/**
 * Google Tag Manager のコンテナID。
 * 例: "GTM-XXXXXX"
 * 空文字のあいだはGTMスクリプトを読み込みません。
 */
export const GTM_CONTAINER_ID = "GTM-NBSWTC3K";

/**
 * Google Search Console の所有権確認コード（HTMLタグ方式の content の値だけ）。
 * 例: "abcdEFGh1234..."
 * 空文字のあいだは meta タグを出力しません。
 */
export const GSC_VERIFICATION_CODE = "9vTOqJh5kKGk78XMqDQGp6owuNd5owcO3dQTIa61Y4A";

/**
 * お問い合わせの通知先メールアドレス（後から設定）。
 * 例: "hello@example.com"
 */
export const CONTACT_EMAIL = "erika530530@yahoo.co.jp";

/** プライバシーポリシー等に表示する運営者名（個人名は掲載しない） */
export const SITE_OWNER = "ピクセルポップ運営";

/** Google AdSense のパブリッシャーID（全ページの<head>で読み込む） */
export const ADSENSE_CLIENT_ID = "ca-pub-4125685680865875";

/** 利用規約ページを追加したらここを true にするとフッターにリンクが出ます */
export const HAS_TERMS_PAGE = true;

export const canonical = (path: string) => `${SITE_URL}${path}`;
