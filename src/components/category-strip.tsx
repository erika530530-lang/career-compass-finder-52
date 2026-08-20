import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  CircleDollarSign,
  Gamepad2,
  Heart,
  HeartHandshake,
  Smile,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { categories, type CategoryId } from "@/lib/quizzes/types";

/**
 * カテゴリー選択。絵文字ではなく統一された線画アイコンの小さなカードで並べます。
 * 色は淡いパステルで、カテゴリーごとに少しだけ変えています。
 */
const icons: Record<CategoryId, { Icon: LucideIcon; tint: string }> = {
  work: { Icon: Briefcase, tint: "oklch(0.62 0.11 265)" },
  personality: { Icon: Heart, tint: "oklch(0.64 0.13 300)" },
  love: { Icon: HeartHandshake, tint: "oklch(0.66 0.14 15)" },
  money: { Icon: CircleDollarSign, tint: "oklch(0.68 0.11 75)" },
  social: { Icon: Users, tint: "oklch(0.62 0.1 230)" },
  fun: { Icon: Smile, tint: "oklch(0.68 0.12 40)" },
  future: { Icon: Sparkles, tint: "oklch(0.64 0.12 320)" },
  game: { Icon: Gamepad2, tint: "oklch(0.62 0.1 190)" },
};

export function CategoryStrip({ active }: { active?: CategoryId | "all" }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-border" aria-hidden />
        <p className="text-[11px] font-bold tracking-wider text-muted-foreground">
          よく選ばれるカテゴリ
        </p>
        <span className="h-px w-8 bg-border" aria-hidden />
      </div>

      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:justify-center md:gap-3 md:px-0">
        {categories.map((c) => {
          const { Icon, tint } = icons[c.id];
          const isActive = active === c.id;
          return (
            <Link
              key={c.id}
              to="/quizzes"
              search={{ cat: c.id, sort: "popular" }}
              aria-label={c.label}
              className={`card-surface flex w-[4.75rem] shrink-0 flex-col items-center gap-1.5 px-2 py-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                isActive ? "border-primary/35" : ""
              }`}
              style={active && !isActive ? { opacity: 0.7 } : undefined}
            >
              <Icon className="size-6" strokeWidth={1.6} style={{ color: tint }} aria-hidden />
              <span className="text-[10px] font-bold text-foreground">{c.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
