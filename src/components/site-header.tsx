import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, Send } from "lucide-react";

export function SiteHeader({ tagline = true }: { tagline?: boolean }) {
  return (
    <header className="mt-1">
      <div className="flex items-center justify-between rounded-full border border-border bg-card/80 px-4 py-2.5 backdrop-blur">
        <Link to="/" className="font-display text-gradient text-lg font-black tracking-tight">
          ピクセルポップ
        </Link>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Heart className="size-5" />
          <Send className="size-5" />
          <Bookmark className="size-5" />
        </div>
      </div>
      {tagline && (
        <p className="mt-2 px-2 text-center text-[11px] font-bold text-muted-foreground">
          暇つぶしできる診断、いっぱいあります。
        </p>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 space-y-2 text-center text-[11px] leading-relaxed text-muted-foreground">
      <p>
        <Link to="/quizzes" className="font-bold text-primary">
          診断をもっと見る
        </Link>
      </p>
      <p>ピクセルポップ｜暇なときに遊べる診断とエンタメ 🎈</p>
    </footer>
  );
}
