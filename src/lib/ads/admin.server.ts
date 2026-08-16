import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("権限の確認に失敗しました");
  if (!data) throw new Error("管理者権限がありません");
}

/** 管理者が誰もいない場合のみ、指定ユーザーを管理者にする */
export async function claimAdminRole(userId: string) {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error("権限の確認に失敗しました");

  if ((count ?? 0) > 0) {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (data) return { ok: true as const, alreadyAdmin: true };
    throw new Error("すでに管理者が登録されています。既存の管理者アカウントでログインしてください。");
  }

  const { error: insertError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  if (insertError) throw new Error("管理者登録に失敗しました");
  return { ok: true as const, alreadyAdmin: false };
}
