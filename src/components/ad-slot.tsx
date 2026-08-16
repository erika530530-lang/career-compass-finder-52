import { useQuery } from "@tanstack/react-query";
import { fetchOffersForQuiz } from "@/lib/ads/api";
import type { AdOffer } from "@/lib/ads/types";

function offerHref(offer: AdOffer) {
  const link = (offer.ad_link ?? "").trim();
  if (link.startsWith("http")) return link;
  return (offer.offer_url ?? "").trim();
}

/** 広告リンク欄にASPのHTMLタグが入っている場合はそのまま埋め込む */
function isHtmlSnippet(offer: AdOffer) {
  const link = (offer.ad_link ?? "").trim();
  return link.startsWith("<");
}

/**
 * 診断結果ページに出す「おすすめ広告」。
 * 管理画面で掲載ONかつこの診断に紐づけた案件だけを表示します。
 */
export function QuizAdSlot({ quizId }: { quizId: string }) {
  const { data } = useQuery({
    queryKey: ["quiz-ads", quizId],
    queryFn: () => fetchOffersForQuiz(quizId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const offers = (data ?? []).slice(0, 3);
  if (offers.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-black text-foreground">おすすめ広告 🎁</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-black text-muted-foreground">
          スポンサー
        </span>
      </div>
      <p className="mt-1 text-[11px] font-bold text-muted-foreground">
        診断結果に関係のあるサービスだけを載せています。
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {offers.map((offer) =>
          isHtmlSnippet(offer) ? (
            <div key={offer.id} className="card-surface p-4">
              <p className="text-[13px] font-black text-foreground">{offer.name}</p>
              {offer.genre && (
                <p className="mt-1 text-[11px] font-bold text-muted-foreground">{offer.genre}</p>
              )}
              <div
                className="mt-3 [&_img]:mx-auto [&_img]:h-auto [&_img]:max-w-full"
                // ASPが発行する広告タグをそのまま掲載するための領域（管理者のみ登録可能）
                dangerouslySetInnerHTML={{ __html: offer.ad_link ?? "" }}
              />
            </div>
          ) : (
            <a
              key={offer.id}
              href={offerHref(offer)}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="card-surface block p-4 transition-transform active:scale-[0.99]"
            >
              <p className="text-[13px] font-black text-foreground">{offer.name}</p>
              {offer.genre && (
                <p className="mt-1 text-[11px] font-bold text-muted-foreground">{offer.genre}</p>
              )}
              {offer.ai_reason && (
                <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">
                  {offer.ai_reason}
                </p>
              )}
              <span className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-[12px] font-black text-primary-foreground">
                くわしく見る →
              </span>
            </a>
          ),
        )}
      </div>
    </section>
  );
}
