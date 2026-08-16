import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { analyzeOffer, claimAdmin } from "@/lib/ads.functions";
import {
  createOffer,
  deleteOffer,
  fetchAllOffers,
  isAdmin as checkAdmin,
  updateOffer,
} from "@/lib/ads/api";
import {
  ASP_LABEL,
  ASP_OPTIONS,
  PARTNER_LABEL,
  PARTNER_OPTIONS,
  SORT_OPTIONS,
  overallScore,
  sortOffers,
  type AdOffer,
  type AdOfferInput,
  type Asp,
  type PartnerStatus,
  type SortKey,
} from "@/lib/ads/types";
import { quizzes } from "@/lib/quizzes/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "広告管理 | ピクセルポップ管理画面" },
      { name: "description", content: "ピクセルポップの管理者用ページです。" },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "広告管理 | ピクセルポップ管理画面" },
      { property: "og:description", content: "ピクセルポップの管理者用ページです。" },
    ],
  }),
  component: AdminPage,
});

const emptyForm: AdOfferInput = {
  asp: "a8",
  name: "",
  offer_url: "",
  genre: "",
  reward: "",
  reward_amount: 0,
  conditions: "",
  ad_link: "",
  partner_status: "none",
  is_active: false,
  quiz_ids: [],
  ai_score: null,
  ai_reason: null,
  ai_click_quiz_id: null,
  notes: "",
};

const inputClass =
  "mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2.5 text-[13px] font-bold text-foreground outline-none focus:border-primary";
const labelClass = "block text-[11px] font-black text-muted-foreground";

function AdminPage() {
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<boolean | null>(null);

  useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user) {
        setSession({ userId: user.id, email: user.email ?? "" });
        setAdmin(await checkAdmin(user.id));
      } else {
        setSession(null);
        setAdmin(null);
      }
      setReady(true);
      return true;
    },
    staleTime: 0,
  });

  if (!ready) {
    return <Shell>読み込み中…</Shell>;
  }

  if (!session) {
    return (
      <Shell>
        <AuthCard
          onSignedIn={async (userId, email) => {
            setSession({ userId, email });
            setAdmin(await checkAdmin(userId));
          }}
        />
      </Shell>
    );
  }

  if (admin === false) {
    return (
      <Shell>
        <NotAdminCard
          email={session.email}
          onBecameAdmin={() => setAdmin(true)}
          onSignOut={async () => {
            await supabase.auth.signOut();
            setSession(null);
            setAdmin(null);
          }}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <OffersManager
        email={session.email}
        onSignOut={async () => {
          await supabase.auth.signOut();
          setSession(null);
          setAdmin(null);
        }}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-6">
      <div className="mx-auto w-full max-w-[1160px]">
        <h1 className="font-display text-xl font-black text-foreground">広告管理 🧩</h1>
        <p className="mt-1 text-[12px] font-bold text-muted-foreground">
          管理者専用ページ（検索エンジンには表示されません）
        </p>
        <div className="mt-5">{children}</div>
      </div>
    </main>
  );
}

function AuthCard({
  onSignedIn,
}: {
  onSignedIn: (userId: string, email: string) => void | Promise<void>;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) await onSignedIn(data.user.id, data.user.email ?? "");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session?.user) await onSignedIn(data.session.user.id, data.session.user.email ?? "");
        else setInfo("確認メールを送信しました。メール内のリンクを開いてから、もう一度ログインしてください。");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card-surface mx-auto max-w-md p-5">
      <p className="text-sm font-black text-foreground">
        {mode === "login" ? "管理者ログイン" : "管理者アカウント作成"}
      </p>
      <div className="mt-4">
        <label className={labelClass}>メールアドレス</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          autoComplete="email"
        />
      </div>
      <div className="mt-3">
        <label className={labelClass}>パスワード</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>
      {error && <p className="mt-3 text-[12px] font-bold text-destructive">{error}</p>}
      {info && <p className="mt-3 text-[12px] font-bold text-primary">{info}</p>}
      <button
        type="submit"
        disabled={busy}
        className="shadow-lift mt-4 w-full rounded-full bg-primary py-3 text-sm font-black text-primary-foreground disabled:opacity-60"
      >
        {busy ? "処理中…" : mode === "login" ? "ログイン" : "アカウントを作る"}
      </button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError("");
          setInfo("");
        }}
        className="mt-3 w-full text-[12px] font-black text-primary"
      >
        {mode === "login" ? "はじめての方（管理者アカウントを作る）" : "ログインに戻る"}
      </button>
    </form>
  );
}

function NotAdminCard({
  email,
  onBecameAdmin,
  onSignOut,
}: {
  email: string;
  onBecameAdmin: () => void;
  onSignOut: () => void;
}) {
  const claim = useServerFn(claimAdmin);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="card-surface mx-auto max-w-md p-5 text-center">
      <p className="text-sm font-black text-foreground">このアカウントには管理者権限がありません</p>
      <p className="mt-2 text-[12px] font-bold text-muted-foreground">{email}</p>
      <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
        まだ管理者が登録されていない場合は、下のボタンでこのアカウントを最初の管理者にできます。
      </p>
      {error && <p className="mt-3 text-[12px] font-bold text-destructive">{error}</p>}
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            await claim({});
            onBecameAdmin();
          } catch (err) {
            setError(err instanceof Error ? err.message : "設定に失敗しました");
          } finally {
            setBusy(false);
          }
        }}
        className="shadow-lift mt-4 w-full rounded-full bg-primary py-3 text-sm font-black text-primary-foreground disabled:opacity-60"
      >
        {busy ? "処理中…" : "最初の管理者になる"}
      </button>
      <button
        onClick={onSignOut}
        className="mt-3 w-full rounded-full border border-border bg-card py-2.5 text-[12px] font-black text-foreground"
      >
        ログアウト
      </button>
    </div>
  );
}

function OffersManager({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["ad-offers"],
    queryFn: fetchAllOffers,
  });

  const [search, setSearch] = useState("");
  const [aspFilter, setAspFilter] = useState<"all" | Asp>("all");
  const [sort, setSort] = useState<SortKey>("overall");
  const [editing, setEditing] = useState<AdOffer | "new" | null>(null);

  const offers = data ?? [];
  const maxReward = offers.reduce((m, o) => Math.max(m, o.reward_amount), 0);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = offers.filter((o) => {
      if (aspFilter !== "all" && o.asp !== aspFilter) return false;
      if (!q) return true;
      return [o.name, o.genre, o.reward, o.conditions, o.notes]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
    return sortOffers(filtered, sort);
  }, [offers, search, aspFilter, sort]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["ad-offers"] });
    qc.invalidateQueries({ queryKey: ["quiz-ads"] });
  };

  const toggle = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateOffer(id, { is_active }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteOffer(id),
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-bold text-muted-foreground">ログイン中: {email}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing("new")}
            className="shadow-lift rounded-full bg-primary px-4 py-2.5 text-[12px] font-black text-primary-foreground"
          >
            ＋ 案件を追加
          </button>
          <button
            onClick={onSignOut}
            className="rounded-full border border-border bg-card px-4 py-2.5 text-[12px] font-black text-foreground"
          >
            ログアウト
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div>
          <label className={labelClass}>検索</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="案件名・ジャンルなど"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>ASPで絞り込み</label>
          <select
            value={aspFilter}
            onChange={(e) => setAspFilter(e.target.value as "all" | Asp)}
            className={inputClass}
          >
            <option value="all">すべて</option>
            {ASP_OPTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>ランキング（並べ替え）</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={inputClass}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <p className="mt-6 text-[13px] font-bold text-muted-foreground">読み込み中…</p>}
      {error && (
        <p className="mt-6 text-[13px] font-bold text-destructive">
          読み込みに失敗しました: {error instanceof Error ? error.message : ""}
        </p>
      )}

      {!isLoading && visible.length === 0 && (
        <p className="mt-6 text-[13px] font-bold text-muted-foreground">
          案件がまだありません。「＋ 案件を追加」から登録してください。
        </p>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {visible.map((offer, index) => (
          <div key={offer.id} className="card-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-black text-muted-foreground">
                  #{index + 1} ・ {ASP_LABEL[offer.asp]} ・ {PARTNER_LABEL[offer.partner_status]}
                </p>
                <p className="mt-0.5 text-sm font-black text-foreground">{offer.name}</p>
                <p className="mt-1 text-[11px] font-bold text-muted-foreground">
                  {offer.genre || "ジャンル未設定"} ／ 報酬 {offer.reward || "-"}（
                  {offer.reward_amount.toLocaleString()}円換算）
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-black text-primary">
                  {offer.ai_score ?? "--"}
                </p>
                <p className="text-[10px] font-black text-muted-foreground">AI相性</p>
                <p className="mt-1 text-[10px] font-black text-muted-foreground">
                  総合 {overallScore(offer, maxReward)}
                </p>
              </div>
            </div>

            {offer.ai_reason && (
              <p className="mt-2 rounded-2xl bg-secondary p-3 text-[12px] leading-relaxed text-secondary-foreground">
                {offer.ai_reason}
              </p>
            )}

            <p className="mt-2 text-[11px] font-bold text-muted-foreground">
              紐づけ診断:{" "}
              {offer.quiz_ids.length === 0
                ? "未設定（表示されません）"
                : offer.quiz_ids
                    .map((id) => quizzes.find((q) => q.id === id)?.title ?? id)
                    .join(" / ")}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => toggle.mutate({ id: offer.id, is_active: !offer.is_active })}
                className={`rounded-full px-4 py-2 text-[12px] font-black ${
                  offer.is_active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
              >
                掲載 {offer.is_active ? "ON" : "OFF"}
              </button>
              <button
                onClick={() => setEditing(offer)}
                className="rounded-full border border-border bg-card px-4 py-2 text-[12px] font-black text-foreground"
              >
                編集・AI分析
              </button>
              <button
                onClick={() => {
                  if (confirm(`「${offer.name}」を削除しますか？`)) remove.mutate(offer.id);
                }}
                className="rounded-full border border-border bg-card px-4 py-2 text-[12px] font-black text-destructive"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <OfferEditor
          offer={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            invalidate();
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function OfferEditor({
  offer,
  onClose,
  onSaved,
}: {
  offer: AdOffer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const analyze = useServerFn(analyzeOffer);
  const [form, setForm] = useState<AdOfferInput>(() =>
    offer
      ? {
          asp: offer.asp,
          name: offer.name,
          offer_url: offer.offer_url ?? "",
          genre: offer.genre ?? "",
          reward: offer.reward ?? "",
          reward_amount: offer.reward_amount,
          conditions: offer.conditions ?? "",
          ad_link: offer.ad_link ?? "",
          partner_status: offer.partner_status,
          is_active: offer.is_active,
          quiz_ids: offer.quiz_ids,
          ai_score: offer.ai_score,
          ai_reason: offer.ai_reason,
          ai_click_quiz_id: offer.ai_click_quiz_id,
          notes: offer.notes ?? "",
        }
      : emptyForm,
  );
  const [matches, setMatches] = useState<
    { quizId: string; quizTitle: string; score: number; reason: string }[]
  >([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const set = <K extends keyof AdOfferInput>(key: K, value: AdOfferInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function runAnalysis() {
    setError("");
    if (!form.name.trim()) {
      setError("案件名を入力してからAI分析してください。");
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyze({
        data: {
          name: form.name.trim(),
          genre: form.genre?.trim() || undefined,
          reward: form.reward?.trim() || undefined,
          conditions: form.conditions?.trim() || undefined,
          offerUrl: form.offer_url?.trim() || undefined,
          asp: form.asp,
        },
      });
      setMatches(result.matches);
      setForm((f) => ({
        ...f,
        ai_score: result.bestScore,
        ai_reason: result.summary,
        ai_click_quiz_id: result.clickQuizId,
        quiz_ids: f.quiz_ids.length > 0 ? f.quiz_ids : [result.bestQuizId],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI分析に失敗しました");
    } finally {
      setAnalyzing(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload: AdOfferInput = { ...form, name: form.name.trim() };
      if (offer) await updateOffer(offer.id, payload);
      else await createOffer(payload);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  const toggleQuiz = (id: string) =>
    set(
      "quiz_ids",
      form.quiz_ids.includes(id) ? form.quiz_ids.filter((q) => q !== id) : [...form.quiz_ids, id],
    );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/40 p-3 backdrop-blur-sm">
      <form
        onSubmit={save}
        className="card-surface mx-auto my-6 w-full max-w-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-foreground">
            {offer ? "案件を編集" : "案件を追加"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-black text-foreground"
          >
            閉じる
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>ASP</label>
            <select
              value={form.asp}
              onChange={(e) => set("asp", e.target.value as Asp)}
              className={inputClass}
            >
              {ASP_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>提携状況</label>
            <select
              value={form.partner_status}
              onChange={(e) => set("partner_status", e.target.value as PartnerStatus)}
              className={inputClass}
            >
              {PARTNER_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>案件名</label>
            <input
              required
              maxLength={200}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>案件URL</label>
            <input
              type="url"
              maxLength={500}
              value={form.offer_url ?? ""}
              onChange={(e) => set("offer_url", e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>ジャンル</label>
            <input
              maxLength={120}
              value={form.genre ?? ""}
              onChange={(e) => set("genre", e.target.value)}
              className={inputClass}
              placeholder="転職・美容など"
            />
          </div>
          <div>
            <label className={labelClass}>報酬額（表記）</label>
            <input
              maxLength={120}
              value={form.reward ?? ""}
              onChange={(e) => set("reward", e.target.value)}
              className={inputClass}
              placeholder="1件 3,000円"
            />
          </div>
          <div>
            <label className={labelClass}>報酬額（並べ替え用の数値・円）</label>
            <input
              type="number"
              min={0}
              value={form.reward_amount}
              onChange={(e) => set("reward_amount", Number(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>掲載状態</label>
            <select
              value={form.is_active ? "on" : "off"}
              onChange={(e) => set("is_active", e.target.value === "on")}
              className={inputClass}
            >
              <option value="off">OFF（表示しない）</option>
              <option value="on">ON（診断結果に表示）</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>成果条件</label>
            <textarea
              maxLength={600}
              rows={2}
              value={form.conditions ?? ""}
              onChange={(e) => set("conditions", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>広告リンク（URL または ASPの広告タグ）</label>
            <textarea
              rows={3}
              value={form.ad_link ?? ""}
              onChange={(e) => set("ad_link", e.target.value)}
              className={inputClass}
              placeholder="https://... もしくは <a href=...>...</a>"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>メモ</label>
            <textarea
              rows={2}
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-secondary p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[12px] font-black text-foreground">AI相性分析 🤖</p>
            <button
              type="button"
              onClick={runAnalysis}
              disabled={analyzing}
              className="rounded-full bg-primary px-4 py-2 text-[12px] font-black text-primary-foreground disabled:opacity-60"
            >
              {analyzing ? "分析中…" : "この案件を分析する"}
            </button>
          </div>
          {form.ai_score !== null && (
            <p className="mt-3 text-[12px] font-black text-foreground">
              相性スコア: {form.ai_score}点／クリックされやすい診断:{" "}
              {quizzes.find((q) => q.id === form.ai_click_quiz_id)?.title ?? "-"}
            </p>
          )}
          {form.ai_reason && (
            <p className="mt-2 text-[12px] leading-relaxed text-secondary-foreground">
              {form.ai_reason}
            </p>
          )}
          {matches.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {matches.map((m) => (
                <li key={m.quizId} className="rounded-2xl bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-black text-foreground">{m.quizTitle}</p>
                    <span className="text-[12px] font-black text-primary">{m.score}点</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {m.reason}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.quiz_ids.includes(m.quizId)) toggleQuiz(m.quizId);
                    }}
                    className="mt-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-black text-primary"
                  >
                    {form.quiz_ids.includes(m.quizId) ? "紐づけ済み" : "この診断に紐づける"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5">
          <p className={labelClass}>おすすめ診断（紐づけた診断の結果ページに表示されます）</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {quizzes.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => toggleQuiz(q.id)}
                className={`rounded-full px-3 py-2 text-[11px] font-black ${
                  form.quiz_ids.includes(q.id)
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
              >
                {q.title}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-[12px] font-bold text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="shadow-lift mt-5 w-full rounded-full bg-primary py-3 text-sm font-black text-primary-foreground disabled:opacity-60"
        >
          {busy ? "保存中…" : "保存する"}
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          ※ ASPへの提携申請はA8.net／afbの各サイトでご自身で行ってください。このページは登録した案件情報の管理のみを行います。
        </p>
      </form>
    </div>
  );
}
