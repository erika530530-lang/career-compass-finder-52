import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, Send } from "lucide-react";
import { HAS_TERMS_PAGE } from "@/lib/site-config";

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
  const linkClass = "font-bold text-primary";
  return (
    <footer className="mt-10 space-y-3 text-center text-[11px] leading-relaxed text-muted-foreground">
      <p className="flex flex-wrap justify-center gap-x-3 gap-y-2">
        <Link to="/games" search={{ cat: "all" }} className={linkClass}>
          ゲーム一覧
        </Link>
        <span aria-hidden>·</span>
        <Link to="/quizzes" search={{ cat: "all", sort: "popular" }} className={linkClass}>
          診断をもっと見る
        </Link>
      </p>
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <Link to="/about" className={linkClass}>
          サイトについて
        </Link>
        <span aria-hidden>·</span>
        <Link to="/privacy" className={linkClass}>
          プライバシーポリシー
        </Link>
        <span aria-hidden>·</span>
        <Link to="/contact" className={linkClass}>
          お問い合わせ
        </Link>
        {HAS_TERMS_PAGE && (
          <>
            <span aria-hidden>·</span>
            <a href="/terms" className={linkClass}>
              利用規約
            </a>
          </>
        )}
      </nav>
      <p>ピクセルポップ｜暇なときに遊べる診断とエンタメ 🎈</p>
    </footer>
  );
}
