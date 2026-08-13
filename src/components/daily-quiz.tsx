import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { GlyphArt } from "@/components/glyph";
import { FlagImage } from "@/components/flag-image";
import { RubyText } from "@/components/ruby-text";
import { getDailyQuestion, readDailyRecord, writeDailyRecord } from "@/lib/games/daily";
import { track } from "@/lib/analytics";

/**
 * 「今日のピクセルクイズ」カード。
 * 日付シードで1問だけ選び、4択で回答できます（ログイン不要）。
 */
export function DailyQuiz() {
  const daily = useMemo(() => getDailyQuestion(), []);
  const [picked, setPicked] = useState<string | null>(null);
  const [alreadyToday, setAlreadyToday] = useState(false);

  useEffect(() => {
    const rec = readDailyRecord();
    if (rec?.answered) setAlreadyToday(true);
  }, []);

  const answered = picked !== null;
  const correct = picked === daily.answer;
  const isProverb = daily.gameId === "proverb-origin";

  function choose(option: string) {
    if (answered) return;
    setPicked(option);
    const hit = option === daily.answer;
    writeDailyRecord(hit);
    track("daily_quiz_answer", {
      game_id: daily.gameId,
      result: hit ? "correct" : "wrong",
    });
  }

  return (
    <section aria-labelledby="daily-quiz-heading" className="card-surface animate-pop overflow-hidden">
      <div className="bg-story px-5 py-5 text-center">
        <p className="text-[11px] font-bold tracking-widest text-primary-foreground/90">
          {daily.genre}・{alreadyToday && !answered ? "きょうは回答ずみ" : "毎日かわる1問"}
        </p>
        <h2
          id="daily-quiz-heading"
          className="font-display mt-1 flex items-center justify-center gap-1.5 text-xl font-black text-primary-foreground"
        >
          <Sparkles className="size-5" aria-hidden />
          🌞 今日のピクセルクイズ
        </h2>
      </div>

      <div className="p-5">
        {daily.visual.type === "glyph" && (
          <GlyphArt
            paths={daily.visual.paths}
            dots={daily.visual.dots}
            className="mx-auto size-28 text-foreground"
          />
        )}
        {daily.visual.type === "flag" && (
          <div className="mx-auto w-40">
            <FlagImage code={daily.visual.code} name={daily.visual.name} hideName={!answered} />
          </div>
        )}
        {daily.visual.type === "text" && (
          <p className="rounded-2xl bg-secondary px-4 py-3 text-[13px] leading-relaxed text-secondary-foreground">
            {daily.visual.text}
          </p>
        )}

        <p className="mt-3 text-center text-sm font-black text-foreground">{daily.prompt}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {daily.options.map((option) => {
            const isAnswer = option === daily.answer;
            const state = !answered
              ? "border border-border bg-card text-foreground"
              : isAnswer
                ? "bg-primary text-primary-foreground"
                : option === picked
                  ? "border border-border bg-secondary text-secondary-foreground opacity-90"
                  : "border border-border bg-card text-muted-foreground opacity-60";
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={answered}
                aria-pressed={option === picked}
                className={`min-h-12 rounded-2xl px-3 py-3 text-sm font-black active:scale-95 disabled:cursor-default ${state}`}
              >
                {isProverb ? <RubyText text={option} /> : option}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-pop mt-4 rounded-2xl border border-border bg-card p-4">
            <p className="font-display text-lg font-black text-foreground">
              {correct ? "正解！🎉" : "残念…！"}
            </p>
            <p className="mt-1 text-sm font-black text-foreground">
              答え：{isProverb ? <RubyText text={daily.answer} /> : daily.answer}
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              {daily.explanation}
            </p>
            {daily.trivia && (
              <p className="mt-2 rounded-xl bg-secondary px-3 py-2 text-[12px] font-bold text-secondary-foreground">
                💡 {daily.trivia}
              </p>
            )}
            <Link
              to={daily.gamePath}
              onClick={() => track("daily_quiz_to_game", { game_id: daily.gameId })}
              className="shadow-lift mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-black text-primary-foreground active:scale-95"
            >
              「{daily.gameLabel}」を10問あそぶ
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}

        {!answered && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            会員登録なし・1問だけ。答えると解説と豆知識が読めます。
          </p>
        )}
      </div>
    </section>
  );
}
