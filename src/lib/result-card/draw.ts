import { resultCardTheme, type ResultCardTheme } from "@/lib/result-card/themes";

export type ResultCardData = {
  quizId: string;
  /** 診断名（上部の小見出し） */
  quizTitle: string;
  /** 大きく出す値（例: "72%" や "研究×創造タイプ"） */
  headline: string;
  /** 結果のタイトル（例: "決断力モンスター"） */
  resultTitle: string;
  /** 結果の一言コメント */
  comment: string;
  /** 絵文字 */
  emoji?: string;
  /** 指標名（例: 決断力） */
  metricLabel?: string;
};

const W = 1200;
const H = 630;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fontStack(weight: number, size: number) {
  return `${weight} ${size}px "Zen Maru Gothic", "Zen Kaku Gothic New", sans-serif`;
}

/** 幅に収まるように改行して行配列を返す（日本語は文字単位で折る） */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const lines: string[] = [];
  let line = "";
  for (const ch of text) {
    if (ch === "\n") {
      lines.push(line);
      line = "";
      continue;
    }
    const next = line + ch;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = next;
    }
    if (lines.length >= maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1]!;
    if (ctx.measureText(last).width > maxWidth - 20) {
      lines[maxLines - 1] = last.slice(0, Math.max(1, last.length - 1)) + "…";
    }
  }
  return lines;
}

/** 自動縮小しつつ中央寄せで1行描画 */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  weight: number,
  startSize: number,
  minSize: number,
) {
  let size = startSize;
  ctx.font = fontStack(weight, size);
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 4;
    ctx.font = fontStack(weight, size);
  }
  ctx.fillText(text, x, y);
  return size;
}

function drawBackground(ctx: CanvasRenderingContext2D, t: ResultCardTheme) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, t.bg[0]);
  g.addColorStop(0.5, t.bg[1]);
  g.addColorStop(1, t.bg[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // ポップな装飾ドット
  ctx.fillStyle = t.dot;
  const dots: [number, number, number][] = [
    [90, 90, 46],
    [1120, 120, 66],
    [1060, 540, 38],
    [140, 560, 28],
    [1160, 320, 18],
    [40, 330, 22],
  ];
  for (const [x, y, r] of dots) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawResultCard(canvas: HTMLCanvasElement, data: ResultCardData) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const t = resultCardTheme(data.quizId);
  canvas.width = W;
  canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  drawBackground(ctx, t);

  // 中央の白パネル
  const px = 70;
  const py = 116;
  const pw = W - px * 2;
  const ph = H - py - 96;
  ctx.save();
  ctx.shadowColor = "rgba(60,30,80,0.25)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = t.panel;
  roundRect(ctx, px, py, pw, ph, 40);
  ctx.fill();
  ctx.restore();

  // 上部：診断名
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = t.text;
  fitText(ctx, data.quizTitle, W / 2, 62, pw - 40, 700, 40, 24);

  // 絵文字
  let cursor = py + 74;
  if (data.emoji) {
    ctx.font = `700 64px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", ${'"Zen Maru Gothic"'}, sans-serif`;
    ctx.fillStyle = t.panelText;
    ctx.fillText(data.emoji, W / 2, cursor);
    cursor += 66;
  } else {
    cursor += 10;
  }

  // メトリクスラベル
  if (data.metricLabel) {
    ctx.fillStyle = t.panelText + "";
    ctx.globalAlpha = 0.65;
    ctx.font = fontStack(700, 28);
    ctx.fillText(`あなたの${data.metricLabel}`, W / 2, cursor);
    ctx.globalAlpha = 1;
    cursor += 44;
  }

  // ヘッドライン（大きい数値・タイプ名）
  ctx.fillStyle = t.panelText;
  const hlSize = fitText(ctx, data.headline, W / 2, cursor + 44, pw - 100, 900, 116, 52);
  cursor += hlSize * 0.55 + 60;

  // 結果タイトル
  ctx.fillStyle = t.panelText;
  fitText(ctx, data.resultTitle, W / 2, cursor + 12, pw - 100, 900, 52, 30);
  cursor += 66;

  // 一言コメント
  ctx.font = fontStack(500, 28);
  ctx.fillStyle = t.panelText;
  ctx.globalAlpha = 0.75;
  const lines = wrap(ctx, data.comment, pw - 140, 2);
  lines.forEach((l, i) => ctx.fillText(l, W / 2, cursor + 24 + i * 40));
  ctx.globalAlpha = 1;

  // フッター
  ctx.fillStyle = t.text;
  ctx.font = fontStack(900, 34);
  ctx.fillText("ピクセルポップ  pixelpop.jp", W / 2, H - 46);
}

export async function resultCardBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
