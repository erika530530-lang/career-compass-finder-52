import { SITE_URL } from "@/lib/site-config";

/**
 * トップページ・一覧ページ・各ゲームページのOGP画像。
 * 画像は scripts/gen-og-pages.py で生成し public/og/pages/{key}.jpg に静的配置。
 * SNSクローラーはJSを実行しないため、必ず静的URLを og:image に指定する。
 */
export type OgPageKey = "home" | "quizzes" | "games" | "game-kanji" | "game-kokki" | "game-kotowaza";

export function pageOgImage(key: OgPageKey): string {
  return `${SITE_URL}/og/pages/${key}.jpg`;
}

/** og:image / twitter:image をまとめて返す（各ルートの leaf head で使う） */
export function pageOgImageMeta(key: OgPageKey) {
  const url = pageOgImage(key);
  return [
    { property: "og:image", content: url },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:image", content: url },
  ];
}
