import { furiganaFor } from "@/lib/games/proverbs/furigana";

/**
 * 「漢字{よみ}」記法を <ruby> に変換して表示する。
 * 辞書に無い文字列はそのまま表示される。
 */
export function RubyText({ text, className }: { text: string; className?: string }) {
  const annotated = furiganaFor(text);
  const parts = annotated.split(/([\u3400-\u9fff々]+\{[^{}]+\})/g).filter(Boolean);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const m = /^([\u3400-\u9fff々]+)\{([^{}]+)\}$/.exec(part);
        if (!m) return <span key={i}>{part}</span>;
        return (
          <ruby key={i} className="ruby-text">
            {m[1]}
            <rt>{m[2]}</rt>
          </ruby>
        );
      })}
    </span>
  );
}
