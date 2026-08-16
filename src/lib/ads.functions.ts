import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { analyzeOfferWithAI } from "@/lib/ads/analyze.server";
import { assertAdmin, claimAdminRole } from "@/lib/ads/admin.server";

const analyzeSchema = z.object({
  name: z.string().trim().min(1).max(200),
  genre: z.string().trim().max(120).optional(),
  reward: z.string().trim().max(120).optional(),
  conditions: z.string().trim().max(600).optional(),
  offerUrl: z.string().trim().max(500).optional(),
  asp: z.enum(["a8", "afb"]),
});

export const analyzeOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => analyzeSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    return analyzeOfferWithAI(data);
  });

/** 管理者がまだ1人もいない場合のみ、自分を管理者にする（初期セットアップ用） */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => claimAdminRole(context.userId));
