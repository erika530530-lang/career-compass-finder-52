/**
 * 象形文字ゲームの問題データ型。
 * 図形はすべてオリジナルで描いた線画（SVG path）で、実資料のトレースではありません。
 * 問題を追加したいときは easy.ts / medium.ts / hard.ts に要素を足すだけで
 * 自動的にランダム抽選の対象になります。
 */

export type Difficulty = "easy" | "medium" | "hard";

export type GlyphQuestion = {
  /** 一意なID（ファイルごとに番号帯を分けています） */
  id: number;
  /** 代表的な正解（結果画面の表示に使用） */
  answer: string;
  /** 正解として認める表記（旧字体・異体字なども登録可） */
  acceptedAnswers: string[];
  difficulty: Difficulty;
  /** 100x100 の viewBox に描く線（オリジナル図形） */
  paths: string[];
  /** 塗りつぶしの点（[cx, cy, r?]） */
  dots?: [number, number, number?][];
  /** 段階1のヒント（ざっくりしたカテゴリー） */
  hint1: string;
  /** 段階2のヒント（形についてのヒント） */
  hint2: string;
  /** 正解後の解説（断定を避けた表現にする） */
  explanation: string;
};

export const difficultyLabel: Record<Difficulty, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};
