/**
 * 「この国、わかる？」のゲームロジック。
 * 問題データは countries/*.ts に分離してあります（将来200問以上に増やせます）。
 */

import { easyCountries } from "./countries/easy";
import { mediumCountries } from "./countries/medium";
import { hardCountries } from "./countries/hard";
import {
  countryDifficultyLabel,
  type CountryDifficulty,
  type CountryQuestion,
} from "./countries/types";

export { countryDifficultyLabel };
export type { CountryDifficulty, CountryQuestion };

export const allCountryQuestions: CountryQuestion[] = [
  ...easyCountries,
  ...mediumCountries,
  ...hardCountries,
];

export const COUNTRY_QUESTIONS_PER_GAME = 10;

/* ---------- 穴あき表示 ---------- */

export type MaskPattern = "ends" | "holes" | "difficulty";

export type CountryRound = {
  q: CountryQuestion;
  /** 表示する穴あき国名（例：「フ□ン□ス」） */
  masked: string;
  pattern: MaskPattern;
};

/** マスクしない文字（記号・長音などは残して問題を成立させる） */
const KEEP = /[・ー－\s]/;

function shuffle<T>(list: T[]): T[] {
  const r = [...list];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j]!, r[i]!];
  }
  return r;
}

/**
 * 国名を穴あきにする。
 * - ends：最初と最後だけ見せる
 * - holes：途中の文字をいくつか隠す
 * - difficulty：難易度が高いほど見せる文字を少なくする
 * 短い国名でも問題が成立するように、隠す数は自動調整します。
 */
export function maskName(name: string, difficulty: CountryDifficulty, pattern: MaskPattern) {
  const chars = [...name];
  const maskable = chars.map((c, i) => (KEEP.test(c) ? -1 : i)).filter((i) => i >= 0);
  const len = maskable.length;
  if (len === 0) return name;

  let hideCount: number;
  if (pattern === "ends") {
    hideCount = Math.max(1, len - 2);
  } else if (pattern === "holes") {
    hideCount = Math.max(1, Math.round(len * 0.4));
  } else {
    const ratio = difficulty === "easy" ? 0.25 : difficulty === "medium" ? 0.5 : 0.85;
    hideCount = Math.max(1, Math.round(len * ratio));
  }
  // 上級の difficulty パターン以外は、必ず1文字以上見えるようにする
  // 上級の difficulty パターンだけは全隠しもあり（ただし短い国名は1文字残す）
  const maxHide =
    difficulty === "hard" && pattern === "difficulty" && len >= 5 ? len : Math.max(1, len - 1);
  hideCount = Math.min(hideCount, maxHide);

  let hidden: number[];
  if (pattern === "ends") {
    hidden = maskable.slice(1, Math.max(1, len - 1));
    if (hidden.length === 0) hidden = [maskable[0]!];
  } else {
    const inner = maskable.slice(1, len - 1);
    const pool = inner.length >= hideCount ? inner : maskable;
    hidden = shuffle(pool).slice(0, hideCount);
  }

  const set = new Set(hidden);
  return chars.map((c, i) => (set.has(i) ? "□" : c)).join("");
}

/* ---------- 正解判定 ---------- */

export function normalizeCountryAnswer(input: string) {
  return input
    .normalize("NFKC")
    .replace(/[\s\u3000・･]/g, "")
    .trim();
}

export function isCountryCorrect(input: string, q: CountryQuestion) {
  const v = normalizeCountryAnswer(input);
  if (!v) return false;
  return q.acceptedAnswers.some((a) => normalizeCountryAnswer(a) === v);
}

/* ---------- ランダム出題 ---------- */

const RECENT_KEY = "pixelpop:country:recent";
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
  pool: CountryQuestion[],
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
const MIXES: Array<Record<CountryDifficulty, number>> = [
  { easy: 4, medium: 4, hard: 2 },
  { easy: 3, medium: 5, hard: 2 },
  { easy: 4, medium: 5, hard: 1 },
  { easy: 3, medium: 6, hard: 1 },
];

const PATTERNS: MaskPattern[] = ["ends", "holes", "difficulty"];

export function pickCountryRounds(count = COUNTRY_QUESTIONS_PER_GAME): CountryRound[] {
  const recent = new Set(readRecent());
  const used = new Set<number>();
  const mix = MIXES[Math.floor(Math.random() * MIXES.length)]!;

  const picked: CountryQuestion[] = [
    ...drawFrom(easyCountries, mix.easy, recent, used),
    ...drawFrom(mediumCountries, mix.medium, recent, used),
    ...drawFrom(hardCountries, mix.hard, recent, used),
  ];
  if (picked.length < count) {
    picked.push(...drawFrom(allCountryQuestions, count - picked.length, recent, used));
  }

  const list = shuffle(picked).slice(0, count);
  writeRecent([...readRecent(), ...list.map((q) => q.id)]);

  return list.map((q) => {
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]!;
    return { q, pattern, masked: maskName(q.name, q.difficulty, pattern) };
  });
}

/* ---------- 称号 ---------- */

export type CountryRank = { min: number; title: string; emoji: string; comment: string };

export const countryRanks: CountryRank[] = [
  {
    min: 10,
    title: "世界地理マスター",
    emoji: "🌍",
    comment: "全問正解。地球儀があなたを先生と呼んでいます。",
  },
  {
    min: 8,
    title: "かなりの地理通",
    emoji: "🌎",
    comment: "旅行番組を見ながら「あ、この国ね」と言えるレベル。",
  },
  {
    min: 5,
    title: "地理はまあまあ",
    emoji: "🗺️",
    comment: "半分わかれば立派。あと少しで自慢できます。",
  },
  {
    min: 0,
    title: "まずは地球儀から始めよう",
    emoji: "🌏",
    comment: "国旗はぜんぶオシャレに見えましたね。もう一回いこう。",
  },
];

/** 正解数（0〜10）から称号を決める */
export function countryRankFor(correct: number) {
  return (
    [...countryRanks].sort((a, b) => b.min - a.min).find((r) => correct >= r.min) ??
    countryRanks[countryRanks.length - 1]!
  );
}
