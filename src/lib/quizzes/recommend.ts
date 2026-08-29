import { popularQuizzes, quizzes } from "./data";
import type { Quiz, ResultBand } from "./types";

/**
 * 結果ページの回遊用おすすめ診断。
 * 1) 同じカテゴリの診断 → 2) 明示的な recommendedDiagnoses → 3) 人気順で補完
 * の優先度で、重複なく count 件返す。
 */
export function relatedQuizzes(quiz: Quiz, count = 4): Quiz[] {
  const picked: Quiz[] = [];
  const seen = new Set<string>([quiz.id]);

  const push = (q: Quiz | undefined) => {
    if (!q || seen.has(q.id) || picked.length >= count) return;
    seen.add(q.id);
    picked.push(q);
  };

  // 1) 同カテゴリ（人気順）
  popularQuizzes.filter((q) => q.category === quiz.category).forEach(push);
  // 2) 制作側のおすすめ
  quiz.recommendedDiagnoses.forEach((id) => push(quizzes.find((q) => q.id === id)));
  // 3) 人気順で穴埋め
  popularQuizzes.forEach(push);

  return picked;
}

/** 結果の帯に合わせた、次の診断へ進みたくなる見出し文言 */
export function recommendHeading(quiz: Quiz, band?: Pick<ResultBand, "title">): string {
  if (band) return `「${band.title}」の人におすすめ 👀`;
  return `${quiz.metricLabel}が気になる人におすすめ 👀`;
}
