import { axisMeta, careers, type Career } from "@/lib/careers";
import { CAREER_IMAGE_SLUGS } from "@/lib/careers-images";
import { SITE_URL } from "@/lib/site-config";

/**
 * 職業ごとのOGP画像（1200x630）。
 * 画像は scripts/gen-og-tekishoku.py で生成し、
 * public/og/tekishoku/{slug}.jpg に静的ファイルとして置いている。
 * SNSクローラーはJSを実行しないため、必ず静的URLを og:image に指定する。
 */
export const OG_DEFAULT = `${SITE_URL}/og/tekishoku/default.jpg`;

export function careerSlug(name: string): string | null {
  return CAREER_IMAGE_SLUGS[name] ?? null;
}

const BY_SLUG: Record<string, Career> = (() => {
  const map: Record<string, Career> = {};
  for (const c of careers) {
    const slug = CAREER_IMAGE_SLUGS[c.name];
    if (slug) map[slug] = c;
  }
  return map;
})();

export function careerBySlug(slug: string): Career | null {
  return BY_SLUG[slug] ?? null;
}

export function careerOgImage(slug: string): string {
  return `${SITE_URL}/og/tekishoku/${slug}.jpg`;
}

export function careerTypeLabel(career: Career): string {
  return `${axisMeta[career.axes[0]].label}×${axisMeta[career.axes[1]].label}タイプ`;
}

/** 結果シェア用URL（SNSクローラーがこのURLからOGPを取得する） */
export function careerResultPath(slug: string): string {
  return `/quiz/tekishoku-result/${slug}`;
}
