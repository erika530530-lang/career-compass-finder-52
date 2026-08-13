import { Copy, Link2, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareRow({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "https://pixelpop.app";
  const full = `${text}\n#ピクセルポップ\n${url}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + "\n#ピクセルポップ")}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-full bg-foreground py-3 text-xs font-black text-background active:scale-95"
      >
        <Share2 className="size-4" />X でシェア
      </a>
      <a
        href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-3 text-xs font-black text-primary-foreground active:scale-95"
      >
        <Link2 className="size-4" />LINE
      </a>
      <button
        onClick={copy}
        className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-card py-3 text-xs font-black text-foreground active:scale-95"
      >
        <Copy className="size-4" />
        {copied ? "コピー済" : "結果をコピー"}
      </button>
    </div>
  );
}
