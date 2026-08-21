import type { CategoryId, Quiz } from "@/lib/quizzes/types";

/**
 * 診断ごとのアイキャッチ画像を解決する。
 * 優先順位:
 *  1. quiz.thumbnailUrl（診断データに直接指定）
 *  2. public/images/diagnoses/card/{cardImageId}.png
 *  3. カテゴリ別のデフォルト画像
 *  4. 共通デフォルト画像
 *
 * 新しい診断を追加するときは thumbnailUrl に
 * "/images/diagnoses/thumb/xxx.jpg" のようなパスを書くだけでよい。
 */
const CATEGORY_THUMBS: Partial<Record<CategoryId, string>> = {
  work: "/images/diagnoses/thumb/cat-work.jpg",
  personality: "/images/diagnoses/thumb/cat-personality.jpg",
  love: "/images/diagnoses/thumb/cat-love.jpg",
  money: "/images/diagnoses/thumb/cat-money.jpg",
  social: "/images/diagnoses/thumb/cat-social.jpg",
  fun: "/images/diagnoses/thumb/cat-fun.jpg",
  future: "/images/diagnoses/thumb/cat-future.jpg",
  game: "/images/diagnoses/thumb/cat-fun.jpg",
};

export const DEFAULT_QUIZ_THUMBNAIL = "/images/diagnoses/thumb/default.jpg";

export function quizThumbnail(quiz: Pick<Quiz, "category"> & Partial<Quiz>): string {
  return (
    quiz.thumbnailUrl ??
    (quiz.cardImageId ? `/images/diagnoses/card/${quiz.cardImageId}.png` : undefined) ??
    CATEGORY_THUMBS[quiz.category] ??
    DEFAULT_QUIZ_THUMBNAIL
  );
}
