import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GA4_MEASUREMENT_ID, GSC_VERIFICATION_CODE, SITE_NAME } from "../lib/site-config";
import { trackPageView } from "../lib/analytics";

function NotFoundComponent() {
  return (
    <div className="bg-hero flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="font-display text-6xl font-black text-foreground">404</p>
        <h1 className="font-display mt-3 text-xl font-black text-foreground">
          ページが見つかりません 🫠
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          URLが変わったか、削除された可能性があります。ほかの診断で暇つぶししていきませんか？
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/quizzes"
            search={{ cat: "all", sort: "popular" }}
            className="shadow-lift rounded-full bg-primary py-3.5 text-sm font-black text-primary-foreground"
          >
            診断をさがす
          </Link>
          <Link
            to="/"
            className="rounded-full border border-border bg-card py-3 text-sm font-black text-foreground"
          >
            トップにもどる
          </Link>
        </div>
        <nav className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[11px] font-bold text-primary">
          <Link to="/about">サイトについて</Link>
          <Link to="/privacy">プライバシーポリシー</Link>
          <Link to="/contact">お問い合わせ</Link>
        </nav>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ピクセルポップ | 暇つぶしできる診断、いっぱいあります。" },
      {
        name: "description",
        content:
          "適職・性格・恋愛・お金・人間関係。1〜3分で終わる診断を無料・登録不要で楽しめるサイト、ピクセルポップ。",
      },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(GSC_VERIFICATION_CODE
        ? [{ name: "google-site-verification", content: GSC_VERIFICATION_CODE }]
        : []),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: GA4_MEASUREMENT_ID
      ? [
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`,
            async: true,
          },
          {
            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{anonymize_ip:true,send_page_view:true});`,
          },
        ]
      : [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);

  // SPA遷移時のGA4ページビュー計測（初回表示はgtagのconfigが送信する）
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
