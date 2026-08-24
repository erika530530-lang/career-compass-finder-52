import { useEffect, useRef, useState } from "react";
import { Download, Image as ImageIcon, Share2 } from "lucide-react";
import { drawResultCard, resultCardBlob, type ResultCardData } from "@/lib/result-card/draw";
import { trackShareClick } from "@/lib/analytics";

/**
 * 診断結果のSNSシェア用画像（1200x630）をブラウザ上で自動生成して表示する。
 * デザインは src/lib/result-card/themes.ts のテーマで診断ごとに切り替わる。
 */
export function ResultShareCard({ data, shareText }: { data: ResultCardData; shareText: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [canShareFile, setCanShareFile] = useState(false);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await document.fonts?.ready;
      } catch {
        /* フォント未対応でも描画は続行 */
      }
      if (cancelled) return;
      drawResultCard(canvas, data);
      const blob = await resultCardBlob(canvas);
      if (cancelled || !blob) return;
      const objectUrl = URL.createObjectURL(blob);
      revoked = objectUrl;
      setUrl(objectUrl);
    }

    void render();
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [data]);

  useEffect(() => {
    try {
      const file = new File([new Blob()], "t.png", { type: "image/png" });
      setCanShareFile(Boolean(navigator.canShare?.({ files: [file] })));
    } catch {
      setCanShareFile(false);
    }
  }, []);

  const fileName = `pixelpop-${data.quizId}.png`;

  async function shareImage() {
    trackShareClick("image", data.quizId);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await resultCardBlob(canvas);
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: shareText, title: data.quizTitle });
        return;
      } catch {
        /* キャンセル時は何もしない */
      }
    }
  }

  function download() {
    if (!url) return;
    trackShareClick("download", data.quizId);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  }

  return (
    <div className="card-surface mt-5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4">
        <ImageIcon className="size-4 text-primary" />
        <p className="text-xs font-black text-foreground">シェア用の結果画像</p>
      </div>
      <div className="px-4 pt-3">
        <div className="overflow-hidden rounded-2xl bg-soft">
          {/* 実際の生成用canvas（そのまま表示） */}
          <canvas
            ref={canvasRef}
            width={1200}
            height={630}
            aria-label={`${data.quizTitle}の結果画像`}
            className="block h-auto w-full"
          />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          画像を長押し（PCは右クリック）で保存できます。Xに投稿するときは画像を添付すると結果が一目で伝わります。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        {canShareFile && (
          <button
            onClick={shareImage}
            className="flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-black text-primary-foreground active:scale-95"
          >
            <Share2 className="size-4" />
            画像をシェア
          </button>
        )}
        <button
          onClick={download}
          className={`flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-border bg-card text-xs font-black text-foreground active:scale-95 ${
            canShareFile ? "" : "col-span-2"
          }`}
        >
          <Download className="size-4" />
          画像を保存
        </button>
      </div>
    </div>
  );
}
