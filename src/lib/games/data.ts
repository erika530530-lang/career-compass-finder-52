/**
 * ピクセルポップのミニゲームデータ。
 * 診断（Quiz）とは別カテゴリーとして扱う。
 *
 * ゲームのロジックはこのファイル、問題データは questions/*.ts に分離しています。
 * 問題を足したいときは questions/easy|medium|hard.ts に追記するだけで
 * 自動的にランダム抽選の対象になります。
 */

import { easyQuestions } from "./questions/easy";
import { mediumQuestions } from "./questions/medium";
import { hardQuestions } from "./questions/hard";
import type { Difficulty, GlyphQuestion } from "./questions/types";
import { COUNTRY_QUESTIONS_PER_GAME, allCountryQuestions } from "./country-data";

export type { Difficulty, GlyphQuestion };
export { difficultyLabel } from "./questions/types";

export type Game = {
  id: string;
  title: string;
  nickname: string;
  description: string;
  emoji: string;
  path: string;
  questionCount: number;
  estimatedTime: string;
  plays: number;
  createdAt: string;
};

/** 1ゲームの出題数 */
export const QUESTIONS_PER_GAME = 10;

export const allGlyphQuestions: GlyphQuestion[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions,
];

/** 旧名互換（全問リスト） */
export const glyphQuestions = allGlyphQuestions;

export const games: Game[] = [
  {
    id: "flag-country",
    title: "この国、わかる？",
    nickname: "国旗と国名クイズ",
    description: `国旗と穴あき国名から国を当てよう！全${allCountryQuestions.length}か国から毎回ランダムに10問出題。2段階ヒントつきで、正解すると首都・地域・豆知識も読めます。`,
    emoji: "🌍",
    path: "/game/kokki",
    questionCount: COUNTRY_QUESTIONS_PER_GAME,
    estimatedTime: "約3分",
    plays: 3120,
    createdAt: "2026-08-13",
  },
  {
    id: "kanji-glyph",
    title: "この象形文字、何の漢字？",
    nickname: "象形文字クイズ",
    description: `約${allGlyphQuestions.length}問の中から毎回ランダムに10問を出題するミニゲーム。答えは自分で入力、2段階ヒントつき。初級から上級までまざって出るので何度でも遊べます。`,
    emoji: "🪨",
    path: "/game/kanji",
    questionCount: QUESTIONS_PER_GAME,
    estimatedTime: "約2分",
    plays: 4210,
    createdAt: "2026-08-13",
  },
];

/* ---------- 正解判定 ---------- */

/** 全角・半角・空白のゆらぎを吸収して比較する */
export function normalizeAnswer(input: string) {
  return input
    .normalize("NFKC")
    .replace(/[\s\u3000]/g, "")
    .trim();
}

export function isCorrect(input: string, q: GlyphQuestion) {
  const v = normalizeAnswer(input);
  if (!v) return false;
  return q.acceptedAnswers.some((a) => normalizeAnswer(a) === v);
}

/* ---------- ランダム出題 ---------- */

function shuffle<T>(list: T[]): T[] {
  const r = [...list];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j]!, r[i]!];
  }
  return r;
}

const RECENT_KEY = "pixelpop:glyph:recent";
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
    /* プライベートモードなどでは無視 */
  }
}

/** 直近に出た問題を後回しにしつつ、指定数だけ抽選する */
function drawFrom(pool: GlyphQuestion[], count: number, recent: Set<number>, used: Set<number>) {
  const available = pool.filter((q) => !used.has(q.id));
  const fresh = shuffle(available.filter((q) => !recent.has(q.id)));
  const rest = shuffle(available.filter((q) => recent.has(q.id)));
  const picked = [...fresh, ...rest].slice(0, count);
  picked.forEach((q) => used.add(q.id));
  return picked;
}

/** 難易度の配分パターン（毎回すこし変化する） */
const MIXES: Array<Record<Difficulty, number>> = [
  { easy: 4, medium: 4, hard: 2 },
  { easy: 5, medium: 3, hard: 2 },
  { easy: 3, medium: 4, hard: 3 },
  { easy: 4, medium: 3, hard: 3 },
  { easy: 5, medium: 4, hard: 1 },
];

/**
 * 全問題から毎回ランダムに出題分を抽選する。
 * 同一ゲーム内で重複せず、直前のプレイと同じ問題もできるだけ避ける。
 */
export function pickQuestions(count = QUESTIONS_PER_GAME): GlyphQuestion[] {
  const recent = new Set(readRecent());
  const used = new Set<number>();
  const mix = MIXES[Math.floor(Math.random() * MIXES.length)]!;

  const picked: GlyphQuestion[] = [
    ...drawFrom(easyQuestions, mix.easy, recent, used),
    ...drawFrom(mediumQuestions, mix.medium, recent, used),
    ...drawFrom(hardQuestions, mix.hard, recent, used),
  ];

  // 足りない場合（データが少ない難易度がある場合）は全体から補充
  if (picked.length < count) {
    picked.push(...drawFrom(allGlyphQuestions, count - picked.length, recent, used));
  }

  const result = shuffle(picked).slice(0, count);
  writeRecent([...readRecent(), ...result.map((q) => q.id)]);
  return result;
}

/* ---------- 称号 ---------- */

export type GlyphRank = { min: number; title: string; emoji: string; comment: string };

export const glyphRanks: GlyphRank[] = [
  {
    min: 100,
    title: "古代文字マスター（現代に生まれたのが惜しい人）",
    emoji: "🏆",
    comment: "全問正解。もう古代人と文通できます。",
  },
  {
    min: 80,
    title: "考古学部への切符をつかんだ人",
    emoji: "🔍",
    comment: "かなりの目利き。博物館で友だちに解説できるレベルです。",
  },
  {
    min: 60,
    title: "そこそこ読める古代人見習い",
    emoji: "🪶",
    comment: "半分以上わかっているので、あと3000年もあれば余裕です。",
  },
  {
    min: 30,
    title: "石をながめるのが好きな人",
    emoji: "🪨",
    comment: "文字より絵として楽しんでいますね。それも正しい遊び方。",
  },
  {
    min: 0,
    title: "むしろ新しい文字を作れる人",
    emoji: "🖍️",
    comment: "答えは違ったけど発想は自由。次はヒントを使ってみよう。",
  },
];

export function rankFor(percent: number) {
  return (
    [...glyphRanks].sort((a, b) => b.min - a.min).find((r) => percent >= r.min) ??
    glyphRanks[glyphRanks.length - 1]!
  );
}
