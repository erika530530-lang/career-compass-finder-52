/**
 * ピクセルポップ サイト設定
 * ここの値を書き換えるだけで、GA4 / Search Console / 連絡先を差し替えできます。
 */

/** 本番URL（canonical・sitemap で使用） */
export const SITE_URL = "https://career-compass-finder-52.lovable.app";

export const SITE_NAME = "ピクセルポップ";
export const SITE_TAGLINE = "暇つぶしできる診断、いっぱいあります。";

/**
 * Google Analytics 4 の測定ID。
 * 例: "G-XXXXXXXXXX"
 * 空文字のあいだはGA4スクリプトを読み込みません（＝本番前は無効）。
 */
export const GA4_MEASUREMENT_ID = "";

/**
 * Google Search Console の所有権確認コード（HTMLタグ方式の content の値だけ）。
 * 例: "abcdEFGh1234..."
 * 空文字のあいだは meta タグを出力しません。
 */
export const GSC_VERIFICATION_CODE = "";

/**
 * お問い合わせの通知先メールアドレス（後から設定）。
 * 例: "hello@example.com"
 */
export const CONTACT_EMAIL = "【メールアドレス】";

/** プライバシーポリシー等に表示する運営者名（後から設定） */
export const SITE_OWNER = "【運営者名】";

/** 利用規約ページを追加したらここを true にするとフッターにリンクが出ます */
export const HAS_TERMS_PAGE = false;

export const canonical = (path: string) => `${SITE_URL}${path}`;
