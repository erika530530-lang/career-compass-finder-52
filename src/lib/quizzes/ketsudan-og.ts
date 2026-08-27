import { SITE_URL } from "@/lib/site-config";
import { getQuiz } from "@/lib/quizzes/data";
import type { ResultBand } from "@/lib/quizzes/types";

/**
 * 決断力診断の結果ごとのOGP。
 * 画像は scripts/gen-og-ketsudan.py で生成し public/og/ketsudan/{level}.jpg に静的配置。
 * SNSクローラーはJSを実行しないため、必ず静的URLを og:image に指定する。
 */
export const KETSUDAN_LEVELS = ["high", "medium", "low", "minimal"] as const;
export type KetsudanLevel = (typeof KETSUDAN_LEVELS)[number];

export function ketsudanLevelFromBand(band: ResultBand): KetsudanLevel | null {
  const id = band.resultImageId ?? "";
  const level = id.replace("ketsudan-result-", "");
  return (KETSUDAN_LEVELS as readonly string[]).includes(level)
    ? (level as KetsudanLevel)
    : null;
}

export function ketsudanBand(level: string): ResultBand | null {
  const quiz = getQuiz("ketsudan");
  if (!quiz) return null;
  return quiz.results.find((r) => r.resultImageId === `ketsudan-result-${level}`) ?? null;
}

export function ketsudanOgImage(level: string): string {
  return `${SITE_URL}/og/ketsudan/${level}.jpg`;
}

export function ketsudanResultPath(level: string): string {
  return `/quiz/ketsudan-result/${level}`;
}
