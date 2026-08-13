/**
 * ゲームのプレイ記録（ベストスコアなど）を端末内に保存する仕組み。
 * ログイン不要・localStorage のみ。個人情報は一切保存しません。
 *
 * 既存データを壊さないため、キーは新規（pixelpop:stats:v1）に分けています。
 */

export type GameStats = {
  /** プレイ回数 */
  plays: number;
  /** ベストスコア（正解数） */
  bestScore: number;
  /** ベストスコア時の出題数 */
  bestTotal: number;
  /** 最高正答率(%) */
  bestPercent: number;
  /** 最高連続正解数 */
  bestStreak: number;
  /** 最後に遊んだ日（YYYY-MM-DD / ローカル） */
  lastPlayed: string;
};

export type PlayResult = { score: number; total: number; streak: number };

const STATS_KEY = "pixelpop:stats:v1";
const DAYS_KEY = "pixelpop:playdays:v1";

export const emptyStats: GameStats = {
  plays: 0,
  bestScore: 0,
  bestTotal: 0,
  bestPercent: 0,
  bestStreak: 0,
  lastPlayed: "",
};

/** ローカル日付（YYYY-MM-DD） */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* プライベートモードなどでは黙って無視 */
  }
}

type StatsMap = Record<string, Partial<GameStats>>;

export function readGameStats(gameId: string): GameStats {
  const map = readJson<StatsMap>(STATS_KEY, {});
  return { ...emptyStats, ...(map[gameId] ?? {}) };
}

/**
 * 1プレイ分の記録を保存する。
 * 戻り値には「今回の前のベスト」を含むので、結果画面で比較表示できます。
 */
export function recordGamePlay(gameId: string, result: PlayResult) {
  const before = readGameStats(gameId);
  const percent = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  const isNewBest = result.score > before.bestScore || before.plays === 0;

  const after: GameStats = {
    plays: before.plays + 1,
    bestScore: Math.max(before.bestScore, result.score),
    bestTotal: result.score >= before.bestScore ? result.total : before.bestTotal || result.total,
    bestPercent: Math.max(before.bestPercent, percent),
    bestStreak: Math.max(before.bestStreak, result.streak),
    lastPlayed: todayKey(),
  };

  const map = readJson<StatsMap>(STATS_KEY, {});
  map[gameId] = after;
  writeJson(STATS_KEY, map);
  touchPlayDay();

  return { before, after, isNewBest, percent };
}

/* ---------- 連続プレイ日数（ゆるめ） ---------- */

function readDays(): string[] {
  const days = readJson<string[]>(DAYS_KEY, []);
  return Array.isArray(days) ? days.filter((d) => typeof d === "string") : [];
}

/** 今日遊んだことを記録する */
export function touchPlayDay() {
  const days = readDays();
  const today = todayKey();
  if (days[days.length - 1] === today) return;
  writeJson(DAYS_KEY, [...days, today].slice(-60));
}

/** 今日を含む連続プレイ日数（遊んでいなければ0） */
export function readPlayStreak(): number {
  const set = new Set(readDays());
  if (set.size === 0) return 0;
  const d = new Date();
  if (!set.has(todayKey(d))) {
    d.setDate(d.getDate() - 1);
    if (!set.has(todayKey(d))) return 0;
  }
  let streak = 0;
  while (set.has(todayKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** 全ゲームの合計プレイ回数 */
export function totalPlays(): number {
  const map = readJson<StatsMap>(STATS_KEY, {});
  return Object.values(map).reduce((sum, s) => sum + (s.plays ?? 0), 0);
}
