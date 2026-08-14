import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Quiz } from "@/lib/quizzes/types";
import { trackCardClick, trackNextQuizClick } from "@/lib/analytics";

export function QuizLink({
  quiz,
  className,
  children,
  /** 「次はこれやってみる？」導線から遷移する場合、元の診断IDを渡す */
  fromQuizId,
  /** カードの掲載場所（例: home_popular_quiz） */
  location,
}: {
  quiz: Quiz;
  className?: string;
  children: ReactNode;
  fromQuizId?: string | undefined;
  location?: string;
}) {
  const onClick = () => {
    if (fromQuizId) trackNextQuizClick(fromQuizId, quiz.id);
    else trackCardClick("quiz", quiz.id, location);
  };

  if (quiz.kind === "custom") {
    return (
      <Link to="/quiz/tekishoku" className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/quiz/$id" params={{ id: quiz.id }} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
