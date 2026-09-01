import type { DeepDive } from "@/lib/quizzes/deep-dive";

/**
 * 結果ページの読み物パート。診断結果ごとの固有解説を表示する。
 * データが無い診断では何も表示しない（既存の見た目を壊さない）。
 */
export function ResultDeepDive({ data, title }: { data?: DeepDive | undefined; title?: string | undefined }) {
  if (!data) return null;
  return (
    <section className="card-surface mt-5 p-5">
      <h2 className="font-display text-base font-black text-foreground">
        {title ?? "この結果をもっと知る"}
      </h2>

      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{data.overview}</p>

      <div className="mt-4">
        <p className="text-xs font-black text-primary">こういう場面で出やすい</p>
        <ul className="mt-2 space-y-1.5">
          {data.scenes.map((s) => (
            <li key={s} className="text-[13px] leading-relaxed text-muted-foreground">
              ・{s}
            </li>
          ))}
        </ul>
      </div>

      <Part label="このタイプの良いところ" text={data.strengths} />
      <Part label="気をつけたいところ" text={data.watch} />
      <Part label="この結果の楽しみ方" text={data.enjoy} />
    </section>
  );
}

function Part({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-black text-primary">{label}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
