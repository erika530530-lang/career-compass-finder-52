import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Send } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { sendContactMessage } from "@/lib/contact.functions";
import { canonical } from "@/lib/site-config";

const TITLE = "お問い合わせ｜ピクセルポップ";
const DESC =
  "ピクセルポップへのご意見・ご感想・掲載や取材のご相談はこちらのフォームからお送りください。";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/contact") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/contact") }],
  }),
  component: ContactPage,
});

type State = "idle" | "sending" | "sent" | "not_configured" | "error";

function ContactPage() {
  const send = useServerFn(sendContactMessage);
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await send({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          message: String(form.get("message") ?? ""),
        },
      });
      setState(res.status === "sent" ? "sent" : "not_configured");
      if (res.status === "sent") e.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary";

  return (
    <main className="min-h-screen bg-hero">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <SiteHeader tagline={false} />

        <h1 className="font-display mt-5 text-2xl font-black leading-snug text-foreground">
          お問い合わせ ✉️
        </h1>
        <p className="mt-2 px-1 text-xs text-muted-foreground">
          診断のリクエスト、感想、掲載・取材のご相談などお気軽にどうぞ。内容によっては返信までお時間を
          いただく場合があります。
        </p>

        <form onSubmit={onSubmit} className="card-surface mt-4 p-5">
          <label className="block">
            <span className="text-xs font-black text-foreground">
              お名前 <span className="text-primary">*</span>
            </span>
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="ピクセル 太郎"
              className={inputClass}
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-black text-foreground">
              メールアドレス <span className="text-primary">*</span>
            </span>
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-black text-foreground">
              お問い合わせ内容 <span className="text-primary">*</span>
            </span>
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              placeholder="10文字以上でご記入ください"
              className={`${inputClass} resize-y`}
            />
          </label>

          <button
            type="submit"
            disabled={state === "sending"}
            className="shadow-lift mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
          >
            <Send className="size-4" />
            {state === "sending" ? "送信中…" : "送信する"}
          </button>

          {state === "sent" && (
            <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-[13px] font-bold text-secondary-foreground">
              送信しました。ありがとうございます！
            </p>
          )}
          {state === "not_configured" && (
            <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-[13px] font-bold text-secondary-foreground">
              現在フォームの送信先が準備中のため、内容は送信されていません。恐れ入りますが、しばらく経って
              から再度お試しください。
            </p>
          )}
          {state === "error" && (
            <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-[13px] font-bold text-secondary-foreground">
              送信に失敗しました。時間をおいてもう一度お試しください。
            </p>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            送信いただいた情報は、お問い合わせ対応の目的のみに利用します。詳しくは
            <a href="/privacy" className="font-bold text-primary">
              プライバシーポリシー
            </a>
            をご覧ください。
          </p>
        </form>

        <SiteFooter />
      </div>
    </main>
  );
}
