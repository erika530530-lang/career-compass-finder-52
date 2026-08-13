/**
 * 国旗画像のソース。
 *
 * flagcdn.com（各国国旗のパブリックドメイン画像を配信するCDN。商用利用も可、クレジット表記不要）
 * を利用しています。問題データには ISO 3166-1 alpha-2 のコードしか持たせていないので、
 * ここを書き換えるだけで別の国旗素材に差し替えられます。
 */

const BASE = "https://flagcdn.com";

/** SVG（ベクター＝どの解像度でもぼやけない） */
export function flagSvgUrl(code: string) {
  return `${BASE}/${code.toLowerCase()}.svg`;
}

/** PNGのフォールバック（幅指定つき） */
export function flagPngUrl(code: string, width: 320 | 640 | 1280 = 640) {
  return `${BASE}/w${width}/${code.toLowerCase()}.png`;
}
