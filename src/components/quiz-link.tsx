import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Quiz } from "@/lib/quizzes/types";

export function QuizLink({
  quiz,
  className,
  children,
}: {
  quiz: Quiz;
  className?: string;
  children: ReactNode;
}) {
  if (quiz.kind === "custom") {
    return (
      <Link to="/quiz/tekishoku" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/quiz/$id" params={{ id: quiz.id }} className={className}>
      {children}
    </Link>
  );
}
