import { useEffect, useState } from "react";
import { flagPngUrl, flagSvgUrl } from "@/lib/games/flags";

/**
 * 国旗画像。縦横比はそのまま（object-contain / h-auto）で表示し、
 * 角丸と枠でピクセルポップのデザインに馴染ませています。
 */
export function FlagImage({
  code,
  name,
  className = "",
  hideName = false,
}: {
  code: string;
  name: string;
  className?: string;
  /** 出題中は国名をalt等に出さない */
  hideName?: boolean;
}) {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setFallback(false);
  }, [code]);

  return (
    <img
      src={fallback ? flagPngUrl(code, 640) : flagSvgUrl(code)}
      onError={() => setFallback(true)}
      alt={hideName ? "国旗" : `${name}の国旗`}
      loading="lazy"
      className={`h-auto w-full rounded-xl border border-border object-contain shadow-sm ${className}`}
    />
  );
}
