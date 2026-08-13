import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, Play, Send } from "lucide-react";
import { quizPath } from "@/lib/quizzes/data";
import { categoryMap, type Quiz } from "@/lib/quizzes/types";

export function QuizCard({ quiz, rank }: { quiz: Quiz; rank?: number }) {
  const cat = categoryMap[quiz.category];
  return (
    <article className="card-surface animate-pop overflow-hidden">
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
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
          {Math.round(quiz.plays / 1000)}k
        </span>
      </div>

      <Link to={quizPath(quiz)} className="block bg-story px-5 py-8 text-center">
        <p className="text-[11px] font-bold tracking-widest text-primary-foreground/90">
          {quiz.questionCount}問・{quiz.estimatedTime}・登録なし
        </p>
        <h3 className="font-display mt-2 text-xl font-black leading-snug text-primary-foreground">
          {quiz.title}
        </h3>
      </Link>

      <div className="p-4">
        <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {quiz.description}
        </p>
        <Link
          to={quizPath(quiz)}
          className="shadow-lift mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Play className="size-4" />
          診断スタート
        </Link>
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

export function QuizRow({ quiz }: { quiz: Quiz }) {
  const cat = categoryMap[quiz.category];
  return (
    <Link to={quizPath(quiz)} className="card-surface flex items-center gap-3 p-3">
      <div className="story-ring shrink-0">
        <div className="flex size-11 items-center justify-center rounded-full bg-card text-xl">
          {quiz.emoji}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-foreground">{quiz.title}</p>
        <p className="text-[11px] text-muted-foreground">
          {cat.emoji} {cat.label}・{quiz.questionCount}問・{quiz.estimatedTime}
        </p>
      </div>
      <span className="text-gradient font-display text-xs font-black">やる →</span>
    </Link>
  );
}
