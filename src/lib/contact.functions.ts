import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
});

/**
 * お問い合わせ送信。
 *
 * 送信手段はまだ未設定です。後から次のどちらかを設定すると有効になります:
 *  - 環境変数 CONTACT_WEBHOOK_URL  … SlackやZapier等のWebhook URLへJSONを転送
 *  - 環境変数 CONTACT_FORWARD_EMAIL + メール送信APIキー … 下のTODO部分を実装
 *
 * どちらも未設定の場合は "not_configured" を返し、UI側で案内を表示します。
 */
export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const webhook = process.env["CONTACT_WEBHOOK_URL"];

    if (!webhook) {
      // TODO: メール送信サービス（Resend等）を使う場合はここに実装する
      return { status: "not_configured" as const };
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "pixelpop-contact",
        name: data.name,
        email: data.email,
        message: data.message,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error(`contact webhook failed: ${res.status}`);
    return { status: "sent" as const };
  });
