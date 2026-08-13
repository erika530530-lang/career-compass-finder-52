import { Link } from "@tanstack/react-router";
import { categories, type CategoryId } from "@/lib/quizzes/types";

export function CategoryStrip({ active }: { active?: CategoryId | "all" }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:justify-center md:gap-5 md:px-0">
      {categories.map((c) => (
        <Link
          key={c.id}
          to="/quizzes"
          search={{ cat: c.id, sort: "popular" }}
          className="flex w-16 shrink-0 flex-col items-center gap-1.5"
        >
          <div
            className={`story-ring ${active === c.id ? "animate-float" : ""}`}
            style={active && active !== c.id ? { opacity: 0.55 } : undefined}
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-card text-2xl">
              {c.emoji}
            </div>
          </div>
          <span className="text-[10px] font-bold text-foreground">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
