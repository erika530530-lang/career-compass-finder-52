import { quizzes } from "@/lib/quizzes/data";
import { categoryMap } from "@/lib/quizzes/types";

export type AnalyzeInput = {
  name: string;
  genre?: string | undefined;
  reward?: string | undefined;
  conditions?: string | undefined;
  offerUrl?: string | undefined;
  asp: string;
};

export type AnalyzeMatch = { quizId: string; quizTitle: string; score: number; reason: string };

export type AnalyzeResult = {
  bestScore: number;
  bestQuizId: string;
  clickQuizId: string;
  summary: string;
  matches: AnalyzeMatch[];
};

function quizCatalog() {
  return quizzes.map((q) => ({
    id: q.id,
    title: q.title,
    category: categoryMap[q.category]?.label ?? q.category,
    description: q.description,
  }));
}

export async function analyzeOfferWithAI(input: AnalyzeInput): Promise<AnalyzeResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI機能が利用できません（APIキー未設定）");

  const catalog = quizCatalog();

  const system = [
    "あなたは日本の診断コンテンツサイト「ピクセルポップ」のアフィリエイト広告プランナーです。",
    "与えられた広告案件と、サイトに存在する診断コンテンツの一覧を読み、相性を判定してください。",
    "相性スコアは0〜100の整数。ユーザーの診断結果の文脈と広告内容が自然につながる場合のみ高くしてください。",
    "無関係な組み合わせは40点未満にしてください。理由は日本語で1〜2文、具体的に書いてください。",
    "出力はJSONのみ。形式: {\"matches\":[{\"quizId\":\"...\",\"score\":0,\"reason\":\"...\"}],\"clickQuizId\":\"...\",\"summary\":\"...\"}",
    "matchesは相性の高い順に最大5件。quizIdは必ず一覧のidを使うこと。",
  ].join("\n");

  const user = [
    `【広告案件】\nASP: ${input.asp}\n案件名: ${input.name}\nジャンル: ${input.genre ?? "未設定"}\n報酬額: ${input.reward ?? "未設定"}\n成果条件: ${input.conditions ?? "未設定"}\nURL: ${input.offerUrl ?? "未設定"}`,
    `【診断一覧】\n${JSON.stringify(catalog)}`,
  ].join("\n\n");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    if (res.status === 429) throw new Error("AI分析のリクエストが多すぎます。少し待ってからお試しください。");
    if (res.status === 402) throw new Error("AIの利用枠が上限に達しました。");
    throw new Error(`AI分析に失敗しました (${res.status}): ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  let parsed: { matches?: { quizId?: string; score?: number; reason?: string }[]; clickQuizId?: string; summary?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AIの回答を解析できませんでした。もう一度お試しください。");
  }

  const matches: AnalyzeMatch[] = (parsed.matches ?? [])
    .map((m) => {
      const quiz = catalog.find((q) => q.id === m.quizId);
      if (!quiz) return null;
      return {
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
        reason: String(m.reason ?? "").slice(0, 400),
      };
    })
    .filter((m): m is AnalyzeMatch => m !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (matches.length === 0) throw new Error("相性のよい診断が見つかりませんでした。案件情報を追記してお試しください。");

  const best = matches[0]!;
  const clickQuizId = catalog.some((q) => q.id === parsed.clickQuizId) ? parsed.clickQuizId! : best.quizId;

  return {
    bestScore: best.score,
    bestQuizId: best.quizId,
    clickQuizId,
    summary: String(parsed.summary ?? best.reason).slice(0, 600),
    matches,
  };
}
