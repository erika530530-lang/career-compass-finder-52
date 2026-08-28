import { SITE_URL } from "@/lib/site-config";
import { getQuiz, quizzes } from "@/lib/quizzes/data";
import type { Quiz, ResultBand } from "@/lib/quizzes/types";

/**
 * percent型診断の結果ごとのOGP。
 * 画像は scripts/gen-og-quiz.py で生成し public/og/quiz/{quizId}/{level}.jpg に静的配置。
 * SNSクローラーはJSを実行しないため、必ず静的URLを og:image に指定する。
 */
export function resultLevelFromBand(band: ResultBand): string | null {
  const id = band.resultImageId ?? "";
  const [, level] = id.split("-result-");
  return level ?? null;
}

export function quizResultBand(quizId: string, level: string): { quiz: Quiz; band: ResultBand } | null {
  const quiz = getQuiz(quizId);
  if (!quiz || quiz.kind !== "percent") return null;
  const band = quiz.results.find((r) => resultLevelFromBand(r) === level);
  return band ? { quiz, band } : null;
}

export function quizResultOgImage(quizId: string, level: string): string {
  return `${SITE_URL}/og/quiz/${quizId}/${level}.jpg`;
}

export function quizResultPath(quizId: string, level: string): string {
  return `/quiz/result/${quizId}/${level}`;
}

/** 結果ページを持つ（＝OGP画像が生成済みの）診断と結果の組み合わせ一覧 */
export function allQuizResultPaths(): string[] {
  const out: string[] = [];
  for (const q of quizzes) {
    if (q.kind !== "percent") continue;
    for (const r of q.results) {
      const level = resultLevelFromBand(r);
      if (level) out.push(quizResultPath(q.id, level));
    }
  }
  return out;
}
