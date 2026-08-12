export type Axis = "R" | "I" | "A" | "S" | "E" | "C";

export const axisMeta: Record<Axis, { label: string; short: string; desc: string }> = {
  R: { label: "現実型", short: "つくる・動かす", desc: "手や体、道具や機械を使って形にすることが得意" },
  I: { label: "研究型", short: "考える・調べる", desc: "仕組みを解明し、論理と data で答えを出すのが得意" },
  A: { label: "芸術型", short: "표현する・創る", desc: "感性と発想で新しい表現を生み出すのが得意" },
  S: { label: "社会型", short: "支える・育てる", desc: "人と関わり、助け、成長を支えるのが得意" },
  E: { label: "企業型", short: "動かす・巻き込む", desc: "people を導き、挑戦して成果を出すのが得意" },
  C: { label: "慣習型", short: "整える・守る", desc: "正確さと段取りで秩序をつくるのが得意" },
};

export type Question = {
  id: number;
  text: string;
  axis: Axis;
};

export const questions: Question[] = [
  { id: 1, text: "機械や道具を分解して、仕組みを確かめたくなる", axis: "R" },
  { id: 2, text: "体を動かす作業や、屋外での仕事に魅力を感じる", axis: "R" },
  { id: 3, text: "手先を使って何かを組み立てたり修理するのが好き", axis: "R" },
  { id: 4, text: "「なぜそうなるのか」を突き詰めて調べたくなる", axis: "I" },
  { id: 5, text: "数字やデータから傾向を読み解くのが面白い", axis: "I" },
  { id: 6, text: "難しい問題をひとりで長時間考え続けられる", axis: "I" },
  { id: 7, text: "デザインや文章、音楽など表現することに惹かれる", axis: "A" },
  { id: 8, text: "決まったやり方より、自分流のアイデアを試したい", axis: "A" },
  { id: 9, text: "美しさや世界観のこだわりを人から褒められる", axis: "A" },
  { id: 10, text: "人の悩みを聞いて、力になれると嬉しい", axis: "S" },
  { id: 11, text: "誰かに教えたり、成長を見守るのが好き", axis: "S" },
  { id: 12, text: "チームの空気を良くする役回りが自然にできる", axis: "S" },
  { id: 13, text: "新しい企画を立てて人を巻き込むのが楽しい", axis: "E" },
  { id: 14, text: "競争や交渉の場面でこそ力が出る", axis: "E" },
  { id: 15, text: "リスクがあっても大きな挑戦をしてみたい", axis: "E" },
  { id: 16, text: "書類や数字を正確に整えるのは苦にならない", axis: "C" },
  { id: 17, text: "ルールや手順が明確な環境のほうが力を出せる", axis: "C" },
  { id: 18, text: "計画表やリストを作って物事を進めたい", axis: "C" },
];

export type Career = {
  name: string;
  category: string;
  axes: Axis[];
  desc: string;
};

export const careers: Career[] = [
  { name: "ソフトウェアエンジニア", category: "IT・技術", axes: ["I", "R"], desc: "論理を組み立てて、動くものをつくる仕事。" },
  { name: "データサイエンティスト", category: "IT・技術", axes: ["I", "C"], desc: "データから意思決定の根拠を導き出す。" },
  { name: "AIエンジニア", category: "IT・技術", axes: ["I", "A"], desc: "学習モデルを設計し、新しい体験を生む。" },
  { name: "インフラ・クラウドエンジニア", category: "IT・技術", axes: ["R", "C"], desc: "見えない土台を安定して動かし続ける。" },
  { name: "セキュリティアナリスト", category: "IT・技術", axes: ["I", "C"], desc: "守りの視点で脅威を見つけ、防ぐ。" },
  { name: "QAエンジニア", category: "IT・技術", axes: ["C", "I"], desc: "細部に目を凝らし、品質の最後の砦になる。" },
  { name: "プロダクトマネージャー", category: "IT・技術", axes: ["E", "I"], desc: "何を作るかを決め、チームを前に進める。" },
  { name: "UI/UXデザイナー", category: "クリエイティブ", axes: ["A", "I"], desc: "使いやすさと美しさを設計する。" },
  { name: "グラフィックデザイナー", category: "クリエイティブ", axes: ["A", "C"], desc: "情報に形と色を与えて伝える。" },
  { name: "イラストレーター", category: "クリエイティブ", axes: ["A", "R"], desc: "絵で世界観をつくる表現者。" },
  { name: "映像クリエイター", category: "クリエイティブ", axes: ["A", "R"], desc: "時間の流れで感情を動かす。" },
  { name: "フォトグラファー", category: "クリエイティブ", axes: ["A", "R"], desc: "一瞬を切り取り、意味を宿す。" },
  { name: "コピーライター", category: "クリエイティブ", axes: ["A", "E"], desc: "言葉で人の心を動かす。" },
  { name: "編集者", category: "クリエイティブ", axes: ["A", "C"], desc: "素材を選び、構成し、届ける。" },
  { name: "ゲームプランナー", category: "クリエイティブ", axes: ["A", "E"], desc: "遊びのルールと熱狂を設計する。" },
  { name: "作曲家・サウンドクリエイター", category: "クリエイティブ", axes: ["A", "I"], desc: "音で空気と記憶をつくる。" },
  { name: "建築家", category: "デザイン・空間", axes: ["A", "R"], desc: "人の暮らしを空間から設計する。" },
  { name: "インテリアコーディネーター", category: "デザイン・空間", axes: ["A", "S"], desc: "住む人の理想を形にする。" },
  { name: "ランドスケープデザイナー", category: "デザイン・空間", axes: ["A", "R"], desc: "自然と街の関係をデザインする。" },
  { name: "研究者（自然科学）", category: "研究・専門", axes: ["I", "R"], desc: "未知に問いを立て、検証を重ねる。" },
  { name: "データアナリスト", category: "研究・専門", axes: ["I", "C"], desc: "数字の裏側にある事実を伝える。" },
  { name: "薬剤師", category: "医療・福祉", axes: ["C", "S"], desc: "正確さと知識で人の安全を守る。" },
  { name: "医師", category: "医療・福祉", axes: ["I", "S"], desc: "科学と対話で命に向き合う。" },
  { name: "看護師", category: "医療・福祉", axes: ["S", "R"], desc: "そばに居て支える、実践の専門職。" },
  { name: "理学療法士", category: "医療・福祉", axes: ["S", "R"], desc: "身体の回復を二人三脚で導く。" },
  { name: "臨床心理士・カウンセラー", category: "医療・福祉", axes: ["S", "I"], desc: "心の声を聴き、整理を助ける。" },
  { name: "管理栄養士", category: "医療・福祉", axes: ["S", "C"], desc: "食から健康をデザインする。" },
  { name: "介護福祉士", category: "医療・福祉", axes: ["S", "R"], desc: "生活の尊厳を日々支える。" },
  { name: "保育士", category: "教育・支援", axes: ["S", "A"], desc: "子どもの世界を一緒に育てる。" },
  { name: "小学校・中学校教員", category: "教育・支援", axes: ["S", "E"], desc: "学びと成長の場をつくる。" },
  { name: "キャリアコンサルタント", category: "教育・支援", axes: ["S", "E"], desc: "働く人の選択に伴走する。" },
  { name: "スポーツトレーナー", category: "教育・支援", axes: ["R", "S"], desc: "身体づくりを科学的に支える。" },
  { name: "図書館司書", category: "教育・支援", axes: ["C", "I"], desc: "知識を整理し、必要な人へ渡す。" },
  { name: "経営コンサルタント", category: "ビジネス", axes: ["E", "I"], desc: "課題を構造化し、変化を起こす。" },
  { name: "起業家", category: "ビジネス", axes: ["E", "A"], desc: "ゼロから事業を立ち上げる。" },
  { name: "営業（法人）", category: "ビジネス", axes: ["E", "S"], desc: "信頼を積み、価値を届ける。" },
  { name: "マーケター", category: "ビジネス", axes: ["E", "I"], desc: "誰に何をどう伝えるかを決める。" },
  { name: "広報・PR", category: "ビジネス", axes: ["E", "A"], desc: "物語をつくり、社会と繋ぐ。" },
  { name: "人事・採用担当", category: "ビジネス", axes: ["S", "C"], desc: "人と組織の噛み合わせを設計する。" },
  { name: "経理・財務", category: "ビジネス", axes: ["C", "I"], desc: "数字で会社の現在地を示す。" },
  { name: "公認会計士", category: "ビジネス", axes: ["C", "I"], desc: "厳密な監査で信頼を担保する。" },
  { name: "税理士", category: "ビジネス", axes: ["C", "S"], desc: "制度を読み解き、経営を助ける。" },
  { name: "ファイナンシャルプランナー", category: "ビジネス", axes: ["C", "S"], desc: "人生のお金の地図を描く。" },
  { name: "アクチュアリー", category: "ビジネス", axes: ["I", "C"], desc: "リスクを数式で見積もる。" },
  { name: "弁護士", category: "公共・法務", axes: ["I", "E"], desc: "言葉と論理で権利を守る。" },
  { name: "行政書士・司法書士", category: "公共・法務", axes: ["C", "I"], desc: "手続きの正確さで社会を回す。" },
  { name: "公務員（行政職）", category: "公共・法務", axes: ["C", "S"], desc: "制度を運用し、暮らしを支える。" },
  { name: "警察官", category: "公共・法務", axes: ["R", "S"], desc: "現場で秩序と安全を守る。" },
  { name: "消防士・救急救命士", category: "公共・法務", axes: ["R", "S"], desc: "危機の最前線で人を救う。" },
  { name: "自衛官", category: "公共・法務", axes: ["R", "C"], desc: "規律ある行動で国を守る。" },
  { name: "パイロット", category: "技術・現場", axes: ["R", "C"], desc: "手順と判断力で空を渡る。" },
  { name: "電気・機械エンジニア", category: "技術・現場", axes: ["R", "I"], desc: "動く仕組みを設計・改善する。" },
  { name: "自動車整備士", category: "技術・現場", axes: ["R", "C"], desc: "原因を突き止め、手で直す。" },
  { name: "建築施工管理", category: "技術・現場", axes: ["R", "E"], desc: "現場を段取りし、形にする。" },
  { name: "職人・伝統工芸", category: "技術・現場", axes: ["R", "A"], desc: "手の技を極めて価値を残す。" },
  { name: "農業・林業従事者", category: "技術・現場", axes: ["R", "C"], desc: "自然のリズムと共に育てる。" },
  { name: "料理人・パティシエ", category: "食・サービス", axes: ["R", "A"], desc: "味と体験を毎日つくり続ける。" },
  { name: "バリスタ・カフェ経営", category: "食・サービス", axes: ["S", "E"], desc: "場と時間の心地よさを売る。" },
  { name: "ホテルスタッフ", category: "食・サービス", axes: ["S", "C"], desc: "細やかな配慮でもてなす。" },
  { name: "ツアープランナー", category: "食・サービス", axes: ["E", "A"], desc: "旅の物語を組み立てる。" },
  { name: "美容師・スタイリスト", category: "食・サービス", axes: ["A", "S"], desc: "技術と対話で人を変える。" },
  { name: "獣医師", category: "自然・動物", axes: ["I", "S"], desc: "言葉を持たない患者に向き合う。" },
  { name: "トリマー・動物飼育員", category: "自然・動物", axes: ["R", "S"], desc: "動物の暮らしを整える。" },
  { name: "環境・サステナビリティ専門家", category: "自然・動物", axes: ["I", "E"], desc: "科学と実務で未来の条件を守る。" },
  { name: "翻訳家・通訳", category: "言語・情報", axes: ["A", "C"], desc: "言葉の橋を精密に架ける。" },
  { name: "ジャーナリスト", category: "言語・情報", axes: ["A", "E"], desc: "現場に立ち、事実を伝える。" },
  { name: "アナウンサー・司会", category: "言語・情報", axes: ["E", "A"], desc: "声と間で場を動かす。" },
  { name: "SNS・コンテンツクリエイター", category: "言語・情報", axes: ["A", "E"], desc: "自分の視点をそのまま価値にする。" },
  { name: "物流・サプライチェーン管理", category: "運営・管理", axes: ["C", "E"], desc: "モノの流れを最適化する。" },
  { name: "秘書・オフィスマネージャー", category: "運営・管理", axes: ["C", "S"], desc: "先を読んで場を整える。" },
  { name: "カスタマーサクセス", category: "運営・管理", axes: ["S", "E"], desc: "使い続けてもらう関係を育てる。" },
];

export type Result = {
  scores: Record<Axis, number>;
  top: Axis[];
  matches: { career: Career; score: number }[];
};

export function diagnose(answers: Record<number, number>): Result {
  const scores: Record<Axis, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<Axis, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const q of questions) {
    const v = answers[q.id] ?? 3;
    scores[q.axis] += v;
    counts[q.axis] += 1;
  }

  const normalized: Record<Axis, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  (Object.keys(scores) as Axis[]).forEach((a) => {
    const max = counts[a] * 5;
    const min = counts[a] * 1;
    normalized[a] = Math.round(((scores[a] - min) / (max - min)) * 100);
  });

  const top = (Object.keys(normalized) as Axis[]).sort((a, b) => normalized[b] - normalized[a]);

  const matches = careers
    .map((career) => {
      const primary = normalized[career.axes[0]] * 1;
      const secondary = normalized[career.axes[1]] * 0.6;
      const others = (Object.keys(normalized) as Axis[])
        .filter((a) => !career.axes.includes(a))
        .reduce((sum, a) => sum + normalized[a], 0);
      const raw = primary + secondary + others * 0.04;
      return { career, score: Math.min(99, Math.round((raw / 176) * 100)) };
    })
    .sort((a, b) => b.score - a.score);

  return { scores: normalized, top: top.slice(0, 3), matches };
}
