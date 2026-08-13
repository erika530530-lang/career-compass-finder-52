import type { ReactNode } from "react";
import { furiganaFor } from "@/lib/games/proverbs/furigana";

const TOKEN = /([^\s{}]+?)\{([^{}]+)\}/g;

/**
 * 「漢字{よみ}」記法を <ruby> に変換して表示する。
 * 辞書に無い文字列はそのまま表示される。
 */
export function RubyText({ text, className }: { text: string; className?: string }) {
  const annotated = furiganaFor(text);
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(annotated))) {
    if (m.index > last) nodes.push(annotated.slice(last, m.index));
    nodes.push(
      <ruby key={m.index} className="ruby-text">
        {m[1]}
        <rt>{m[2]}</rt>
      </ruby>,
    );
    last = m.index + m[0].length;
  }
  if (last < annotated.length) nodes.push(annotated.slice(last));

  return <span className={className}>{nodes}</span>;
}
