import { Bookmark, Heart, MessageCircle, Play, Send } from "lucide-react";
import { QuizLink } from "@/components/quiz-link";
import { categoryMap, type Quiz } from "@/lib/quizzes/types";
import { quizThumbnail } from "@/lib/quizzes/thumbnails";

export function QuizCard({ quiz, rank, location }: { quiz: Quiz; rank?: number; location?: string | undefined }) {
  const cat = categoryMap[quiz.category];
  const thumb = quizThumbnail(quiz);

  return (
    <article className="card-surface animate-pop overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-18px_oklch(0.64_0.28_338_/_0.36)]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="story-ring">
          <div className="flex size-10 items-center justify-center rounded-full bg-card text-lg">
            {rank ? <span className="text-xs font-black text-foreground">{rank}</span> : quiz.emoji}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-foreground">
            {quiz.nickname ?? cat.label}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {cat.emoji} {cat.label}・{quiz.questionCount}問・{quiz.estimatedTime}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
          {rank ? "人気" : "診断"}
        </span>

      </div>

      <QuizLink quiz={quiz} location={location} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-soft">
          <img
            src={thumb}
            alt={`${quiz.title}のイメージ画像`}
            loading="lazy"
            width={1024}
            height={576}
            className="size-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-3 pt-10">
            <p className="text-[10px] font-bold tracking-widest text-white/85">
              {quiz.questionCount}問・{quiz.estimatedTime}・登録なし
            </p>
            <h3 className="font-display mt-1 text-lg font-black leading-snug text-white drop-shadow-sm">
              {quiz.title}
            </h3>
          </div>
        </div>
      </QuizLink>

      <div className="p-4">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{quiz.description}</p>
        <QuizLink
          quiz={quiz}
          location={location}
          className="shadow-lift mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-18px_oklch(0.64_0.28_338_/_0.42)] active:scale-[0.98]"
        >
          <Play className="size-4" />
          診断スタート
        </QuizLink>
        <div className="mt-3 flex items-center gap-4 text-muted-foreground">
          <Heart className="size-5" />
          <MessageCircle className="size-5" />
          <Send className="size-5" />
          <Bookmark className="ml-auto size-5" />
        </div>
      </div>
    </article>
  );
}

export function QuizRow({
  quiz,
  fromQuizId,
  location,
}: {
  quiz: Quiz;
  fromQuizId?: string | undefined;
  location?: string | undefined;
}) {
  const cat = categoryMap[quiz.category];
  return (
    <QuizLink quiz={quiz} fromQuizId={fromQuizId} location={location} className="card-surface flex items-center gap-3 p-3">
      <div className="story-ring shrink-0">
        <div className="flex size-11 items-center justify-center rounded-full bg-card text-xl">
          {quiz.emoji}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-foreground">
          <span className="mr-1.5 rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-secondary-foreground">
            診断
          </span>
          {quiz.title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {cat.emoji} {cat.label}・{quiz.questionCount}問・{quiz.estimatedTime}
        </p>
      </div>
      <span className="text-gradient font-display shrink-0 text-xs font-black">やる →</span>

    </QuizLink>
  );
}
