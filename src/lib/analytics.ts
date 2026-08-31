import { GA4_MEASUREMENT_ID } from "./site-config";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const gaEnabled = () => GA4_MEASUREMENT_ID.length > 0;

/**
 * GA4 / GTM イベント送信。個人を特定できる情報（名前・メール・自由入力文）は
 * 絶対に params に入れないこと。診断ID・結果バンド名などの非個人情報のみ。
 *
 * GTM 導入時は gtag が未定義の場合があるため、dataLayer への push にフォールバックする。
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    window.gtag("event", event, params);
  } else if (window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }
}

export const trackPageView = (path: string) => {
  if (typeof window === "undefined") return;
  const payload = {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  };
  if (window.gtag) {
    window.gtag("event", "page_view", payload);
  } else if (window.dataLayer) {
    window.dataLayer.push({ event: "page_view", ...payload });
  }
};

export const trackQuizStart = (quizId: string) => track("quiz_start", { quiz_id: quizId });
export const trackQuizComplete = (quizId: string, resultLabel: string) =>
  track("quiz_complete", { quiz_id: quizId, result: resultLabel });
export const trackResultView = (quizId: string, resultLabel: string) =>
  track("quiz_result_view", { quiz_id: quizId, result: resultLabel });
export const trackNextQuizClick = (fromId: string, toId: string) =>
  track("next_quiz_click", { from_quiz_id: fromId, to_quiz_id: toId });
export const trackShareClick = (channel: string, quizId?: string) =>
  track("share_click", { channel, quiz_id: quizId });
export const trackOutboundClick = (url: string) => track("outbound_click", { link_url: url });

/** トップページなどの掲載場所（section）付きのカードクリック計測 */
export const trackCardClick = (
  kind: "game" | "quiz",
  id: string,
  location?: string | undefined,
) =>
  track(kind === "game" ? "game_card_click" : "quiz_card_click", {
    [kind === "game" ? "game_id" : "quiz_id"]: id,
    location: location ?? "other",
  });

export const trackGameStart = (gameId: string, replay = false) =>
  track("game_start", { game_id: gameId, replay });
export const trackGameComplete = (gameId: string, score: number, percent: number) =>
  track("game_complete", { game_id: gameId, score, percent });
