/**
 * オリジナルで描いた「象形文字風」の図形。
 * 実在の資料をトレースしたものではなく、すべて自作の線画です。
 */

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const shapes: Record<string, React.ReactNode> = {
  eye: (
    <>
      <path {...S} d="M10 50c14-22 66-22 80 0-14 22-66 22-80 0z" />
      <circle {...S} cx="50" cy="50" r="10" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </>
  ),
  mountain: (
    <>
      <path {...S} d="M50 12v76" />
      <path {...S} d="M24 40v48" />
      <path {...S} d="M76 40v48" />
      <path {...S} d="M18 86h64" />
    </>
  ),
  river: (
    <>
      <path {...S} d="M22 12c-6 26 6 50 0 76" />
      <path {...S} d="M50 10c8 26-8 52 0 80" />
      <path {...S} d="M78 12c6 26-6 50 0 76" />
    </>
  ),
  tree: (
    <>
      <path {...S} d="M50 8v84" />
      <path {...S} d="M22 30c12 2 20 8 28 16 8-8 16-14 28-16" />
      <path {...S} d="M26 90c8-8 16-12 24-14 8 2 16 6 24 14" />
    </>
  ),
  sun: (
    <>
      <circle {...S} cx="50" cy="50" r="34" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </>
  ),
  moon: (
    <>
      <path {...S} d="M62 12a44 44 0 000 76 36 36 0 010-76z" />
      <path {...S} d="M52 42h10" />
      <path {...S} d="M52 58h10" />
    </>
  ),
  rain: (
    <>
      <path {...S} d="M14 24h72" />
      <path {...S} d="M50 24v14" />
      <path {...S} d="M28 46v10M50 52v10M72 46v10" />
      <path {...S} d="M28 70v8M50 76v8M72 70v8" />
    </>
  ),
  gate: (
    <>
      <path {...S} d="M18 18v72" />
      <path {...S} d="M82 18v72" />
      <path {...S} d="M18 18h22M60 18h22" />
      <path {...S} d="M18 46h22M60 46h22" />
      <path {...S} d="M18 72h22M60 72h22" />
    </>
  ),
  horse: (
    <>
      <path {...S} d="M30 34c8-14 26-20 40-14 8 4 10 12 6 18-6 8-18 10-28 8" />
      <path {...S} d="M30 34c-8 6-12 16-10 26 2 12 10 20 20 24" />
      <path {...S} d="M22 28l8 6M32 22l4 8" />
      <path {...S} d="M40 84v8M56 78v14M70 68v20" />
      <path {...S} d="M48 46c10 4 18 12 22 22" />
    </>
  ),
  boat: (
    <>
      <path {...S} d="M22 24c14 44 42 44 56 0" />
      <path {...S} d="M22 24h56" />
      <path {...S} d="M28 44h44" />
      <path {...S} d="M36 62h28" />
    </>
  ),
};

export function Glyph({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="象形文字" className={className}>
      {shapes[name] ?? shapes["sun"]}
    </svg>
  );
}
