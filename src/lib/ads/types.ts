export type Asp = "a8" | "afb";

export type PartnerStatus = "none" | "applied" | "approved" | "rejected";

export type AdOffer = {
  id: string;
  asp: Asp;
  name: string;
  offer_url: string | null;
  genre: string | null;
  reward: string | null;
  reward_amount: number;
  conditions: string | null;
  ad_link: string | null;
  partner_status: PartnerStatus;
  is_active: boolean;
  quiz_ids: string[];
  ai_score: number | null;
  ai_reason: string | null;
  ai_click_quiz_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AdOfferInput = Omit<AdOffer, "id" | "created_at" | "updated_at">;

export const ASP_OPTIONS: { value: Asp; label: string }[] = [
  { value: "a8", label: "A8.net" },
  { value: "afb", label: "afb" },
];

export const ASP_LABEL: Record<Asp, string> = { a8: "A8.net", afb: "afb" };

export const PARTNER_OPTIONS: { value: PartnerStatus; label: string }[] = [
  { value: "none", label: "未申請" },
  { value: "applied", label: "申請中" },
  { value: "approved", label: "提携済み" },
  { value: "rejected", label: "否認" },
];

export const PARTNER_LABEL: Record<PartnerStatus, string> = {
  none: "未申請",
  applied: "申請中",
  approved: "提携済み",
  rejected: "否認",
};

export type SortKey = "overall" | "score" | "reward" | "quizmatch";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "overall", label: "総合おすすめ" },
  { value: "score", label: "相性が高い順" },
  { value: "reward", label: "報酬額が高い順" },
  { value: "quizmatch", label: "診断との相性が高い順" },
];

/** 報酬額を0〜100に正規化（案件群の最大値基準） */
function rewardPoints(offer: AdOffer, max: number) {
  if (max <= 0) return 0;
  return Math.round((offer.reward_amount / max) * 100);
}

/** 総合おすすめスコア：AI相性60% + 報酬25% + 運用状態15% */
export function overallScore(offer: AdOffer, maxReward: number) {
  const ai = offer.ai_score ?? 0;
  const rw = rewardPoints(offer, maxReward);
  const ops =
    (offer.partner_status === "approved" ? 60 : offer.partner_status === "applied" ? 30 : 0) +
    (offer.is_active ? 20 : 0) +
    (offer.quiz_ids.length > 0 ? 20 : 0);
  return Math.round(ai * 0.6 + rw * 0.25 + ops * 0.15);
}

export function sortOffers(offers: AdOffer[], key: SortKey): AdOffer[] {
  const maxReward = offers.reduce((m, o) => Math.max(m, o.reward_amount), 0);
  const list = [...offers];
  switch (key) {
    case "reward":
      return list.sort((a, b) => b.reward_amount - a.reward_amount);
    case "score":
      return list.sort((a, b) => (b.ai_score ?? -1) - (a.ai_score ?? -1));
    case "quizmatch":
      return list.sort(
        (a, b) =>
          b.quiz_ids.length - a.quiz_ids.length ||
          (b.ai_score ?? -1) - (a.ai_score ?? -1) ||
          b.reward_amount - a.reward_amount,
      );
    default:
      return list.sort((a, b) => overallScore(b, maxReward) - overallScore(a, maxReward));
  }
}
