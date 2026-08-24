/**
 * 結果画像（SNSシェア用アイキャッチ）のデザインテーマ。
 * 診断ごとに見た目を変えられるように、quizId => theme のマップで管理する。
 * 新しい診断を追加したときは、必要なら QUIZ_CARD_THEMES に1行足すだけでよい。
 */
export type ResultCardTheme = {
  /** 背景グラデーション（上→下 or 斜め） */
  bg: [string, string, string];
  /** 大きな数値・アクセント文字の色 */
  accent: string;
  /** メイン文字色 */
  text: string;
  /** カード（白抜きパネル）の色 */
  panel: string;
  /** パネル上の文字色 */
  panelText: string;
  /** 装飾ドットの色 */
  dot: string;
};

export const DEFAULT_CARD_THEME: ResultCardTheme = {
  bg: ["#c9b6f2", "#b79ae8", "#e6a8cf"],
  accent: "#ffffff",
  text: "#ffffff",
  panel: "#fffdf9",
  panelText: "#3b2b4a",
  dot: "rgba(255,255,255,0.35)",
};

const THEMES: Record<string, ResultCardTheme> = {
  pop: DEFAULT_CARD_THEME,
  mint: {
    bg: ["#a8e6d3", "#8fd7cf", "#a9c9f0"],
    accent: "#ffffff",
    text: "#ffffff",
    panel: "#fffdf9",
    panelText: "#1f4a45",
    dot: "rgba(255,255,255,0.4)",
  },
  sunset: {
    bg: ["#ffc9a3", "#ff9fb0", "#f38bc6"],
    accent: "#ffffff",
    text: "#ffffff",
    panel: "#fffaf5",
    panelText: "#5a2b3a",
    dot: "rgba(255,255,255,0.4)",
  },
  sky: {
    bg: ["#a5d8ff", "#8ab6f5", "#b3a9f0"],
    accent: "#ffffff",
    text: "#ffffff",
    panel: "#fbfdff",
    panelText: "#23386b",
    dot: "rgba(255,255,255,0.4)",
  },
  lemon: {
    bg: ["#ffe9a3", "#ffd08a", "#ffb0a8"],
    accent: "#ffffff",
    text: "#ffffff",
    panel: "#fffdf4",
    panelText: "#5c4210",
    dot: "rgba(255,255,255,0.45)",
  },
  night: {
    bg: ["#6f7ce0", "#7a5ecf", "#b364c2"],
    accent: "#ffe98a",
    text: "#ffffff",
    panel: "#fdfaff",
    panelText: "#2c2350",
    dot: "rgba(255,255,255,0.3)",
  },
};

/** 診断ID → テーマ名 */
const QUIZ_CARD_THEMES: Record<string, keyof typeof THEMES> = {
  tekishoku: "sky",
  shafu: "night",
  seikaku: "sunset",
  "renai-mendo": "sunset",
  kyushoku: "lemon",
  sainou: "lemon",
  ningen: "mint",
  kanemochi: "lemon",
  ketsudan: "sky",
  sakinobashi: "night",
  kyujitsu: "mint",
  ryoko: "sky",
  kaimono: "sunset",
  asagata: "lemon",
  leader: "night",
  sns: "sunset",
  kuse: "mint",
  jinsei: "pop",
};

export function resultCardTheme(quizId: string): ResultCardTheme {
  const name = QUIZ_CARD_THEMES[quizId];
  return (name && THEMES[name]) || DEFAULT_CARD_THEME;
}
