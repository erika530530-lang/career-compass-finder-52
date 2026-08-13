/**
 * 「この由来、どのことわざ？」の問題データ型。
 *
 * 由来（故事・背景）を読んで、元のことわざ・故事成語を4択で当てるゲームです。
 * 問題データは easy.ts / medium.ts / hard.ts に分離してあるので、
 * 将来200問・300問に増やすときはタプルを足すだけで抽選対象になります。
 */

import { getProverbIllustration, type ProverbIllustration } from "./illustrations";

export type ProverbDifficulty = "easy" | "medium" | "hard";

export const proverbDifficultyLabel: Record<ProverbDifficulty, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};

export type ProverbQuestion = {
  /** 一意なID（難易度ごとに番号帯を分けています） */
  id: number;
  /** 正解のことわざ・故事成語 */
  proverb: string;
  /** 由来・故事・背景（事実として確認できる範囲で記述。諸説ある場合は明記） */
  origin: string;
  /** ことわざの意味 */
  meaning: string;
  /** 現代での使い方 */
  usage: string;
  /** 豆知識（主に出典） */
  trivia: string;
  /** 4択のうち、正解以外の3つ */
  distractors: string[];
  /** 4択（正解＋ダミー3つ。表示時にシャッフルします） */
  options: string[];
  difficulty: ProverbDifficulty;
  /** 情景イラスト（未登録の問題は undefined） */
  illustration?: ProverbIllustration;
};

/** データ定義用タプル：[id, ことわざ, 由来, 意味, 現代での使い方, 豆知識, ダミー1, ダミー2, ダミー3] */
export type ProverbTuple = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export function buildProverbs(
  rows: ProverbTuple[],
  difficulty: ProverbDifficulty,
): ProverbQuestion[] {
  return rows.map(([id, proverb, origin, meaning, usage, trivia, d1, d2, d3]) => ({
    id,
    proverb,
    origin,
    meaning,
    usage,
    trivia,
    distractors: [d1, d2, d3],
    options: [proverb, d1, d2, d3],
    difficulty,
    illustration: getProverbIllustration(id),
  }));
}
