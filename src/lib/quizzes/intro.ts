import { categoryMap, type Quiz } from "./types";

export type QuizIntro = {
  /** どんな人向けか */
  forWho: string;
  /** 何が分かるか */
  learn: string;
  /** ボリューム */
  volume: string;
};

/**
 * 診断開始前に表示する説明文。診断データから自然な日本語を組み立てる
 * （キーワードの詰め込みはしない）。
 */
export function quizIntro(quiz: Quiz): QuizIntro {
  const cat = categoryMap[quiz.category];
  return {
    forWho: `${cat.label}のこと（${cat.tagline}）が気になる人、自分の${quiz.metricLabel}を客観的に知っておきたい人に向いています。`,
    learn: `質問の答えから${quiz.metricLabel}を0〜100%で計算し、あてはまるタイプの特徴・良いところ・気をつけたい点までまとめて表示します。`,
    volume: `全${quiz.questionCount}問・${quiz.estimatedTime}で終わります。登録もアプリのインストールも不要で、答えはこの端末の中だけで計算されます。`,
  };
}
