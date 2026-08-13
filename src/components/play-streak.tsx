import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { readPlayStreak, totalPlays } from "@/lib/games/scores";

/**
 * ゆるい記録バッジ。遊んだ記録がある人にだけ小さく表示します。
 * （毎日の強制やプッシュ通知はしません）
 */
export function PlayStreakBadge() {
  const [days, setDays] = useState(0);
  const [plays, setPlays] = useState(0);

  useEffect(() => {
    setDays(readPlayStreak());
    setPlays(totalPlays());
  }, []);

  if (plays === 0) return null;

  return (
    <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-black text-muted-foreground">
      {days >= 2 && (
        <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
          <Flame className="size-3.5" aria-hidden />
          連続プレイ {days}日
        </span>
      )}
      <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
        これまでのプレイ {plays}回
      </span>
    </p>
  );
}
