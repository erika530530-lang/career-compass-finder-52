import type { Game } from "@/lib/games/data";

/**
 * ゲームごとのアイキャッチ画像を解決する。
 * 優先順位: game.thumbnailUrl → /images/games/thumb/{id}.jpg → デフォルト画像
 * 新しいゲームを追加するときは同じ命名で画像を置くか thumbnailUrl を指定するだけ。
 */
export const DEFAULT_GAME_THUMBNAIL = "/images/games/thumb/default.jpg";

const KNOWN_IDS = new Set(["proverb-origin", "flag-country", "kanji-glyph"]);

export function gameThumbnail(game: Pick<Game, "id"> & Partial<Game>): string {
  if (game.thumbnailUrl) return game.thumbnailUrl;
  if (KNOWN_IDS.has(game.id)) return `/images/games/thumb/${game.id}.jpg`;
  return DEFAULT_GAME_THUMBNAIL;
}
