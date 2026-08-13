/**
 * 「この由来、どのことわざ？」のゲームロジック。
 * 問題データは proverbs/*.ts に分離してあります（200問・300問へ増やせます）。
 */

import { easyProverbs } from "./proverbs/easy";
import { mediumProverbs } from "./proverbs/medium";
import { hardProverbs } from "./proverbs/hard";
import {
  proverbDifficultyLabel,
  type ProverbDifficulty,
  type ProverbQuestion,
} from "./proverbs/types";

export { proverbDifficultyLabel };
export type { ProverbDifficulty, ProverbQuestion };

export const allProverbQuestions: ProverbQuestion[] = [
  ...easyProverbs,
  ...mediumProverbs,
  ...hardProverbs,
];

export const PROVERB_QUESTIONS_PER_GAME = 10;

export type ProverbRound = {
  q: ProverbQuestion;
  /** 表示順にシャッフルした4択 */
  choices: string[];
};

function shuffle<T>(list: T[]): T[] {
  const r = [...list];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j]!, r[i]!];
  }
  return r;
}

/* ---------- 直近の出題を記録して重複を避ける ---------- */

const RECENT_KEY = "pixelpop:proverb:recent";
const RECENT_LIMIT = 40;

function readRecent(): number[] {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function writeRecent(ids: number[]) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(-RECENT_LIMIT)));
  } catch {
    /* プライベートモードでは無視 */
  }
}

function drawFrom(
  pool: ProverbQuestion[],
  count: number,
  recent: Set<number>,
  used: Set<number>,
) {
  const available = pool.filter((q) => !used.has(q.id));
  const fresh = shuffle(available.filter((q) => !recent.has(q.id)));
  const rest = shuffle(available.filter((q) => recent.has(q.id)));
  const picked = [...fresh, ...rest].slice(0, count);
  picked.forEach((q) => used.add(q.id));
  return picked;
}

/** 難易度の配分（毎回すこし変化する） */
const MIXES: Array<Record<ProverbDifficulty, number>> = [
  { easy: 3, medium: 4, hard: 3 },
  { easy: 4, medium: 4, hard: 2 },
  { easy: 3, medium: 5, hard: 2 },
  { easy: 2, medium: 4, hard: 4 },
];

export function pickProverbRounds(count = PROVERB_QUESTIONS_PER_GAME): ProverbRound[] {
  const recent = new Set(readRecent());
  const used = new Set<number>();
  const mix = MIXES[Math.floor(Math.random() * MIXES.length)]!;

  const picked: ProverbQuestion[] = [
    ...drawFrom(easyProverbs, mix.easy, recent, used),
    ...drawFrom(mediumProverbs, mix.medium, recent, used),
    ...drawFrom(hardProverbs, mix.hard, recent, used),
  ];
  if (picked.length < count) {
    picked.push(...drawFrom(allProverbQuestions, count - picked.length, recent, used));
  }

  const list = shuffle(picked).slice(0, count);
  writeRecent([...readRecent(), ...list.map((q) => q.id)]);

  return list.map((q) => ({ q, choices: shuffle(q.options) }));
}

/* ---------- 称号 ---------- */

export type ProverbRank = { min: number; title: string; emoji: string; comment: string };

export const proverbRanks: ProverbRank[] = [
  {
    min: 10,
    title: "ことわざ博士",
    emoji: "📚",
    comment: "全問正解。もう古典の先生と世間話ができます。",
  },
  {
    min: 8,
    title: "かなりのことわざ通",
    emoji: "🎓",
    comment: "由来まで語れるタイプ。テストでも強いはず。",
  },
  {
    min: 5,
    title: "まあまあことわざ通",
    emoji: "🍡",
    comment: "半分わかれば立派。あと少しで自慢できます。",
  },
  {
    min: 3,
    title: "ことわざ、雰囲気で使ってます",
    emoji: "🌀",
    comment: "使えてはいる。由来はこれから覚えましょう。",
  },
  {
    min: 0,
    title: "まずは『犬も歩けば』から始めよう",
    emoji: "🐕",
    comment: "大丈夫、千里の道も一歩から。もう一回いこう。",
  },
];

export function proverbRankFor(correct: number) {
  return (
    [...proverbRanks].sort((a, b) => b.min - a.min).find((r) => correct >= r.min) ??
    proverbRanks[proverbRanks.length - 1]!
  );
}
