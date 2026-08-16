import { supabase } from "@/integrations/supabase/client";
import type { AdOffer, AdOfferInput } from "./types";

export async function fetchAllOffers(): Promise<AdOffer[]> {
  const { data, error } = await supabase
    .from("ad_offers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdOffer[];
}

/** 診断結果ページ用：掲載ONかつその診断に紐づいた案件だけを取得 */
export async function fetchOffersForQuiz(quizId: string): Promise<AdOffer[]> {
  const { data, error } = await supabase
    .from("ad_offers")
    .select("*")
    .eq("is_active", true)
    .contains("quiz_ids", [quizId])
    .order("ai_score", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as AdOffer[];
}

export async function createOffer(input: AdOfferInput) {
  const { error } = await supabase.from("ad_offers").insert(input);
  if (error) throw error;
}

export async function updateOffer(id: string, input: Partial<AdOfferInput>) {
  const { error } = await supabase.from("ad_offers").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteOffer(id: string) {
  const { error } = await supabase.from("ad_offers").delete().eq("id", id);
  if (error) throw error;
}

export async function isAdmin(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}
