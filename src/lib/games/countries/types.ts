/**
 * 「この国、わかる？」の問題データ型。
 *
 * 国旗の画像そのものはデータに含めず、ISO 3166-1 alpha-2 のコード（code）だけを持ちます。
 * 実際の画像URLの組み立ては src/lib/games/flags.ts にまとめてあるので、
 * あとから別の国旗素材に差し替えることができます。
 *
 * 問題を追加したいときは easy.ts / medium.ts / hard.ts のタプルに1行足すだけです。
 */

export type CountryDifficulty = "easy" | "medium" | "hard";

export const countryDifficultyLabel: Record<CountryDifficulty, string> = {
  easy: "初級",
  medium: "中級",
  hard: "上級",
};

export type CountryQuestion = {
  /** 一意なID（難易度ごとに番号帯を分けています） */
  id: number;
  /** 日本語の通称（表示・正解の代表表記） */
  name: string;
  /** 英語名 */
  nameEn: string;
  /** ISO 3166-1 alpha-2（国旗画像のキー） */
  code: string;
  /** 首都 */
  capital: string;
  /** 地域 */
  region: string;
  /** 豆知識（事実として確認できる内容のみ） */
  trivia: string;
  /** 正解として認める表記 */
  acceptedAnswers: string[];
  difficulty: CountryDifficulty;
  /** ヒント1（地域レベルのゆるいヒント） */
  hint1: string;
  /** ヒント2（首都など、もう少し具体的なヒント） */
  hint2: string;
};

/** データ定義用のタプル：[id, 日本語名, 英語名, コード, 首都, 地域, 豆知識, 別表記...] */
export type CountryTuple = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  ...string[],
];

const KANJI = /[\u4e00-\u9fff]/;

/** カタカナをひらがなに変換する */
export function kataToHira(s: string) {
  return s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/**
 * 国名から、ひらがなの正解候補をつくる。
 * - カタカナだけの表記 → そのままひらがなへ
 * - 漢字を含む表記 → 読み辞書、または「カタカナ部分＋語尾の読み」で組み立て
 */
export function hiraganaVariants(name: string): string[] {
  const out = new Set<string>();
  if (!KANJI.test(name)) {
    out.add(kataToHira(name));
    return [...out];
  }
  for (const r of kanjiReadings[name] ?? []) out.add(r);
  for (const [suffix, reading] of suffixReadings) {
    if (name.length > suffix.length && name.endsWith(suffix)) {
      const head = name.slice(0, -suffix.length);
      if (!KANJI.test(head)) out.add(kataToHira(head) + reading);
      else {
        for (const hr of hiraganaVariants(head)) out.add(hr + reading);
      }
      break;
    }
  }
  return [...out];
}

export function buildCountries(
  rows: CountryTuple[],
  difficulty: CountryDifficulty,
): CountryQuestion[] {
  return rows.map(([id, name, nameEn, code, capital, region, trivia, ...accepted]) => {
    const base = [name, ...accepted];
    const answers = new Set(base);
    for (const a of base) for (const h of hiraganaVariants(a)) answers.add(h);
    return {
      id,
      name,
      nameEn,
      code,
      capital,
      region,
      trivia,
      difficulty,
      acceptedAnswers: [...answers],
      hint1: `${region}にある国です。`,
      hint2: `首都は${capital}です。`,
    };
  });
}

