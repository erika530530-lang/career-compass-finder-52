export type CategoryId =
  | "work"
  | "personality"
  | "love"
  | "money"
  | "social"
  | "fun"
  | "future";

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  tagline: string;
};

export const categories: Category[] = [
  { id: "work", label: "仕事", emoji: "🔨", tagline: "働き方と適職のこと" },
  { id: "personality", label: "性格", emoji: "🧠", tagline: "自分の取扱説明書" },
  { id: "love", label: "恋愛", emoji: "❤️", tagline: "好きの傾向を可視化" },
  { id: "money", label: "お金", emoji: "💰", tagline: "お金とのつきあい方" },
  { id: "social", label: "人間関係", emoji: "👥", tagline: "友だち・家族・学校" },
  { id: "fun", label: "ネタ", emoji: "😂", tagline: "笑える系だけ集めた" },
  { id: "future", label: "将来", emoji: "🔮", tagline: "これからの自分を占う" },
];

export const categoryMap: Record<CategoryId, Category> = categories.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, Category>,
);

export type Choice = { label: string; score: number };

export type QuizQuestion = {
  id: number;
  text: string;
  choices: Choice[];
};

export type ResultBand = {
  /** この帯の下限（%）。降順で評価される */
  min: number;
  title: string;
  emoji: string;
  description: string;
  features: string[];
  good: string[];
  caution: string[];
};

export type Quiz = {
  id: string;
  title: string;
  /** 診断コンテンツとしての愛称（例: てきしょく） */
  nickname?: string;
  description: string;
  category: CategoryId;
  emoji: string;
  /** 結果の数値につく名前（例: 社不度） */
  metricLabel: string;
  questionCount: number;
  estimatedTime: string;
  /** プレイ回数（表示用） */
  plays: number;
  createdAt: string;
  /** percent = 汎用スコア診断 / custom = 専用ページを持つ診断 */
  kind: "percent" | "custom";
  /** custom の場合の遷移先 */
  customPath?: string;
  questions: QuizQuestion[];
  results: ResultBand[];
  recommendedDiagnoses: string[];
};

/** 5段階の選択肢を作るヘルパー（左が高スコア） */
export function scale5(a: string, b: string, c: string, d: string, e: string): Choice[] {
  return [
    { label: a, score: 4 },
    { label: b, score: 3 },
    { label: c, score: 2 },
    { label: d, score: 1 },
    { label: e, score: 0 },
  ];
}

export const defaultScale = () =>
  scale5("めちゃくちゃそう", "まあまあそう", "どちらとも言えない", "あまり違う", "全然違う");

export function scoreQuiz(quiz: Quiz, answers: Record<number, number>) {
  const max = quiz.questions.reduce(
    (sum, q) => sum + Math.max(...q.choices.map((c) => c.score)),
    0,
  );
  const total = quiz.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const percent = max === 0 ? 0 : Math.round((total / max) * 100);
  const band =
    [...quiz.results].sort((a, b) => b.min - a.min).find((r) => percent >= r.min) ??
    quiz.results[0]!;
  return { percent, band };
}
