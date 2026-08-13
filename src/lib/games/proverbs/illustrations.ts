/**
 * ことわざの「情景イラスト」レジストリ。
 *
 * 問題ID → 画像URL のマップです。ここに追加するだけで問題画面にイラストが出ます。
 * （イラストが未登録の問題は、これまでどおりイラストなしで表示されます）
 *
 * 画像を差し替えるときは src/assets/proverbs/ のファイルを置き換えるか、
 * このマップの値を別の import / URL に変えてください。
 *
 * ルール：答えの文字（ことわざそのもの）を画像に描かないこと。
 * 情景から「連想できる」レベルにとどめます。
 */
import p2001 from "@/assets/proverbs/p2001.jpg";
import p2002 from "@/assets/proverbs/p2002.jpg";
import p2003 from "@/assets/proverbs/p2003.jpg";
import p2004 from "@/assets/proverbs/p2004.jpg";
import p2005 from "@/assets/proverbs/p2005.jpg";
import p2006 from "@/assets/proverbs/p2006.jpg";

export type ProverbIllustration = {
  /** 画像URL（import した静的アセット、または外部URL） */
  url: string;
  /** alt 用の情景説明。ことわざ名は入れない */
  alt: string;
};

export const proverbIllustrations: Record<number, ProverbIllustration> = {
  2001: { url: p2001, alt: "ほとんど同じ大きさの2匹のうさぎが、ものさしをはさんで得意そうに並んでいる絵" },
  2002: { url: p2002, alt: "井戸の中にすわったカエルが、外に広がる海に気づいていない絵" },
  2003: { url: p2003, alt: "きつねが大きなトラを後ろに連れて、いばって歩いている絵" },
  2004: { url: p2004, alt: "巻物にヘビを描いた人が、余分に足を描き足している絵" },
  2005: { url: p2005, alt: "商人が盾と槍を両手に持ち、客に問い詰められて困っている絵" },
  2006: { url: p2006, alt: "貝と鳥が争っているあいだに、漁師が両方まとめてかごに入れる絵" },
};

export function getProverbIllustration(id: number): ProverbIllustration | undefined {
  return proverbIllustrations[id];
}
