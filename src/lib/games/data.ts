/**
 * ピクセルポップのミニゲームデータ。
 * 診断（Quiz）とは別カテゴリーとして扱う。
 */

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

export const games: Game[] = [
  {
    id: "kanji-glyph",
    title: "この象形文字、何の漢字？",
    nickname: "象形文字クイズ",
    description:
      "むかしの人が描いた絵から生まれた漢字を当てるミニゲーム。全10問、答えは自分で入力。ヒントありなので漢字が苦手でも遊べます。",
    emoji: "🪨",
    path: "/game/kanji",
    questionCount: 10,
    estimatedTime: "約2分",
    plays: 4210,
    createdAt: "2026-08-13",
  },
];

export type GlyphQuestion = {
  id: number;
  /** 描画用のオリジナル図形ID（src/components/glyph.tsx が対応） */
  glyph: string;
  level: "初級" | "中級" | "上級";
  /** 正解として認める漢字（旧字体・異体字も登録する） */
  answers: string[];
  hint: string;
  /** 正解後に表示する解説 */
  note: string;
};

export const glyphQuestions: GlyphQuestion[] = [
  {
    id: 1,
    glyph: "eye",
    level: "初級",
    answers: ["目", "眼"],
    hint: "顔にふたつある、まんなかに黒いまるがあるもの。",
    note: "横に寝かせたまつ毛つきの形が、立ち上がって「目」になりました。",
  },
  {
    id: 2,
    glyph: "mountain",
    level: "初級",
    answers: ["山"],
    hint: "とんがりが3つ並んでいます。登るものです。",
    note: "みっつの峰をそのまま描いた形。ほぼ今の字と同じ形をしています。",
  },
  {
    id: 3,
    glyph: "river",
    level: "初級",
    answers: ["川", "河"],
    hint: "流れています。3本の線がヒント。",
    note: "水の流れる筋を3本で表しました。あいだの線がうねっているのが特徴。",
  },
  {
    id: 4,
    glyph: "tree",
    level: "初級",
    answers: ["木", "樹"],
    hint: "上に枝、下に根っこが伸びています。",
    note: "枝と根をあわせて描いた形。下の根がのちに「はらい」になりました。",
  },
  {
    id: 5,
    glyph: "sun",
    level: "初級",
    answers: ["日", "陽"],
    hint: "まるの中に点。昼に空にあります。",
    note: "太陽のまるの中に点を入れて「ただのまる」と区別しました。",
  },
  {
    id: 6,
    glyph: "moon",
    level: "初級",
    answers: ["月"],
    hint: "夜の空。まるくない日もあります。",
    note: "満ちていない形（三日月）で描くことで「日」と区別しました。",
  },
  {
    id: 7,
    glyph: "rain",
    level: "中級",
    answers: ["雨"],
    hint: "空から落ちてくるもの。かさが必要。",
    note: "空をあらわす横線の下に、しずくを並べた形です。",
  },
  {
    id: 8,
    glyph: "gate",
    level: "中級",
    answers: ["門", "閂"],
    hint: "左右に2枚。開けて中に入ります。",
    note: "左右に開く2枚の扉をそのまま描いた形。今の字にも扉が残っています。",
  },
  {
    id: 9,
    glyph: "horse",
    level: "中級",
    answers: ["馬"],
    hint: "たてがみと4本の脚。走るのが速い動物。",
    note: "たてがみのふさふさが、今の字の上のほうの点や画に化けました。",
  },
  {
    id: 10,
    glyph: "boat",
    level: "上級",
    answers: ["舟", "船"],
    hint: "水の上を進む乗り物。板を組んで作ります。",
    note: "板を組んだ小舟を上から見た形。今の字の中の横線は板の継ぎ目です。",
  },
];

export type GlyphRank = { min: number; title: string; emoji: string; comment: string };

export const glyphRanks: GlyphRank[] = [
  {
    min: 100,
    title: "象形文字マスター（現代に生まれたのが惜しい人）",
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
  return q.answers.some((a) => normalizeAnswer(a) === v);
}

export function rankFor(percent: number) {
  return [...glyphRanks].sort((a, b) => b.min - a.min).find((r) => percent >= r.min) ?? glyphRanks[glyphRanks.length - 1]!;
}
