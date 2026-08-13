/**
 * 「今日のピクセルクイズ」＝日付をシードにして、既存ゲームの問題から1問だけ選ぶ仕組み。
 *
 * 既存の問題データをそのまま利用しているので、ゲーム側のデータを増やせば
 * 今日の1問のバリエーションも自動的に増えます。サーバー・ログイン不要。
 */

import { allGlyphQuestions } from "./data";
import { allCountryQuestions } from "./country-data";
import { allProverbQuestions } from "./proverb-data";

export type DailyVisual =
  | { type: "glyph"; paths: string[]; dots?: [number, number, number?][] | undefined }
  | { type: "flag"; code: string; name: string }
  | { type: "text"; text: string };

export type DailyQuestion = {
  /** 元になったゲーム */
  gameId: string;
  gamePath: string;
  gameLabel: string;
  /** ジャンル表示（🧠 漢字 など） */
  genre: string;
  /** 出題文 */
  prompt: string;
  answer: string;
  /** 4択（日付シードでシャッフル済み） */
  options: string[];
  explanation: string;
  trivia?: string | undefined;
  visual: DailyVisual;
};

/* ---------- 日付シードの乱数 ---------- */

/** 日本時間の日付キー（YYYY-MM-DD） */
export function jstDateKey(now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(list: T[], rnd: () => number): T[] {
  const r = [...list];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [r[i], r[j]] = [r[j]!, r[i]!];
  }
  return r;
}

function pickDistinct(pool: string[], exclude: string, count: number, rnd: () => number) {
  const candidates = seededShuffle(
    pool.filter((v) => v !== exclude),
    rnd,
  );
  return candidates.slice(0, count);
}

/* ---------- 今日の1問 ---------- */

export function getDailyQuestion(dateKey = jstDateKey()): DailyQuestion {
  const rnd = mulberry32(hash(dateKey));
  const kind = ["glyph", "country", "proverb"][Math.floor(rnd() * 3)] ?? "glyph";

  if (kind === "glyph") {
    const q = allGlyphQuestions[Math.floor(rnd() * allGlyphQuestions.length)]!;
    const options = seededShuffle(
      [q.answer, ...pickDistinct(allGlyphQuestions.map((x) => x.answer), q.answer, 3, rnd)],
      rnd,
    );
    return {
      gameId: "kanji-glyph",
      gamePath: "/game/kanji",
      gameLabel: "象形文字クイズ",
      genre: "🪨 漢字のルーツ",
      prompt: "この形は、いまのどの漢字になった？",
      answer: q.answer,
      options,
      explanation: q.explanation,
      trivia: q.hint1,
      visual: { type: "glyph", paths: q.paths, dots: q.dots },
    };
  }

  if (kind === "country") {
    const q = allCountryQuestions[Math.floor(rnd() * allCountryQuestions.length)]!;
    const options = seededShuffle(
      [q.name, ...pickDistinct(allCountryQuestions.map((x) => x.name), q.name, 3, rnd)],
      rnd,
    );
    return {
      gameId: "flag-country",
      gamePath: "/game/kokki",
      gameLabel: "国名当てクイズ",
      genre: "🌍 地理",
      prompt: "この国旗の国はどこ？",
      answer: q.name,
      options,
      explanation: `首都は${q.capital}、地域は${q.region}（英語名：${q.nameEn}）。`,
      trivia: q.trivia,
      visual: { type: "flag", code: q.code, name: q.name },
    };
  }

  const q = allProverbQuestions[Math.floor(rnd() * allProverbQuestions.length)]!;
  const options = seededShuffle(q.options, rnd);
  return {
    gameId: "proverb-origin",
    gamePath: "/game/kotowaza",
    gameLabel: "ことわざ由来クイズ",
    genre: "📚 ことわざ",
    prompt: "この由来から生まれたことわざは？",
    answer: q.proverb,
    options,
    explanation: `${q.meaning} ${q.usage}`,
    trivia: q.trivia,
    visual: { type: "text", text: q.origin },
  };
}

/* ---------- 今日の1問を解いたかどうか ---------- */

const DAILY_KEY = "pixelpop:daily:v1";

type DailyRecord = { date: string; answered: boolean; correct: boolean };

export function readDailyRecord(dateKey = jstDateKey()): DailyRecord | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyRecord;
    return parsed?.date === dateKey ? parsed : null;
  } catch {
    return null;
  }
}

export function writeDailyRecord(correct: boolean, dateKey = jstDateKey()) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify({ date: dateKey, answered: true, correct } satisfies DailyRecord),
    );
  } catch {
    /* 無視 */
  }
}
