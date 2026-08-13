/**
 * ことわざの「情景イラスト」レジストリ。
 *
 * 問題ID → 画像URL のマップです。ここに追加するだけで問題画面にイラストが出ます。
 * （イラストが未登録の問題は、これまでどおりイラストなしで表示されます）
 *
 * 画像を差し替えるときは src/assets/proverbs/ のファイルを置き換えるか、
 * このマップの値を別の import / URL に変えてください。
 *
 * ルール：答えの文字（ことわざそのもの）を画像に描かないこと。
 * 情景から「連想できる」レベルにとどめます。
 */
import p2001 from "@/assets/proverbs/p2001.jpg";
import p2002 from "@/assets/proverbs/p2002.jpg";
import p2003 from "@/assets/proverbs/p2003.jpg";
import p2004 from "@/assets/proverbs/p2004.jpg";
import p2005 from "@/assets/proverbs/p2005.jpg";
import p2006 from "@/assets/proverbs/p2006.jpg";
import p2007 from "@/assets/proverbs/p2007.jpg";
import p2008 from "@/assets/proverbs/p2008.jpg";
import p2009 from "@/assets/proverbs/p2009.jpg";
import p2010 from "@/assets/proverbs/p2010.jpg";
import p2011 from "@/assets/proverbs/p2011.jpg";
import p2012 from "@/assets/proverbs/p2012.jpg";
import p2013 from "@/assets/proverbs/p2013.jpg";
import p2014 from "@/assets/proverbs/p2014.jpg";
import p2015 from "@/assets/proverbs/p2015.jpg";
import p2016 from "@/assets/proverbs/p2016.jpg";
import p2017 from "@/assets/proverbs/p2017.jpg";
import p2018 from "@/assets/proverbs/p2018.jpg";
import p2019 from "@/assets/proverbs/p2019.jpg";
import p2020 from "@/assets/proverbs/p2020.jpg";
import p2021 from "@/assets/proverbs/p2021.jpg";
import p2022 from "@/assets/proverbs/p2022.jpg";
import p2023 from "@/assets/proverbs/p2023.jpg";
import p2024 from "@/assets/proverbs/p2024.jpg";
import p2025 from "@/assets/proverbs/p2025.jpg";
import p2026 from "@/assets/proverbs/p2026.jpg";
import p2027 from "@/assets/proverbs/p2027.jpg";
import p2028 from "@/assets/proverbs/p2028.jpg";
import p2029 from "@/assets/proverbs/p2029.jpg";
import p2030 from "@/assets/proverbs/p2030.jpg";
import p2031 from "@/assets/proverbs/p2031.jpg";
import p2032 from "@/assets/proverbs/p2032.jpg";
import p2033 from "@/assets/proverbs/p2033.jpg";
import p2034 from "@/assets/proverbs/p2034.jpg";
import p2035 from "@/assets/proverbs/p2035.jpg";
import p2036 from "@/assets/proverbs/p2036.jpg";
import p3001 from "@/assets/proverbs/p3001.jpg";
import p3002 from "@/assets/proverbs/p3002.jpg";
import p3003 from "@/assets/proverbs/p3003.jpg";
import p3004 from "@/assets/proverbs/p3004.jpg";
import p3005 from "@/assets/proverbs/p3005.jpg";
import p3006 from "@/assets/proverbs/p3006.jpg";
import p3007 from "@/assets/proverbs/p3007.jpg";
import p3008 from "@/assets/proverbs/p3008.jpg";
import p3009 from "@/assets/proverbs/p3009.jpg";
import p3010 from "@/assets/proverbs/p3010.jpg";
import p3011 from "@/assets/proverbs/p3011.jpg";
import p3012 from "@/assets/proverbs/p3012.jpg";
import p3013 from "@/assets/proverbs/p3013.jpg";
import p3014 from "@/assets/proverbs/p3014.jpg";
import p3015 from "@/assets/proverbs/p3015.jpg";
import p3016 from "@/assets/proverbs/p3016.jpg";
import p3017 from "@/assets/proverbs/p3017.jpg";
import p3018 from "@/assets/proverbs/p3018.jpg";
import p3019 from "@/assets/proverbs/p3019.jpg";
import p3020 from "@/assets/proverbs/p3020.jpg";
import p3021 from "@/assets/proverbs/p3021.jpg";
import p3022 from "@/assets/proverbs/p3022.jpg";
import p3023 from "@/assets/proverbs/p3023.jpg";
import p3024 from "@/assets/proverbs/p3024.jpg";
import p3025 from "@/assets/proverbs/p3025.jpg";
import p3026 from "@/assets/proverbs/p3026.jpg";
import p3027 from "@/assets/proverbs/p3027.jpg";
import p3028 from "@/assets/proverbs/p3028.jpg";
import p3029 from "@/assets/proverbs/p3029.jpg";
import p3030 from "@/assets/proverbs/p3030.jpg";
import p3031 from "@/assets/proverbs/p3031.jpg";
import p3032 from "@/assets/proverbs/p3032.jpg";
import p3033 from "@/assets/proverbs/p3033.jpg";
import p3034 from "@/assets/proverbs/p3034.jpg";
import p3035 from "@/assets/proverbs/p3035.jpg";
import p3036 from "@/assets/proverbs/p3036.jpg";

export type ProverbIllustration = {
  /** 画像URL（import した静的アセット、または外部URL） */
  url: string;
  /** alt 用の情景説明。ことわざ名は入れない */
  alt: string;
};

export const proverbIllustrations: Record<number, ProverbIllustration> = {
  2001: { url: p2001, alt: "ほとんど同じ大きさの2匹のうさぎが、ものさしをはさんで得意そうに並んでいる絵" },
  2002: { url: p2002, alt: "井戸の中にすわったカエルが、外に広がる海に気づいていない絵" },
  2003: { url: p2003, alt: "きつねが大きなトラを後ろに連れて、いばって歩いている絵" },
  2004: { url: p2004, alt: "巻物にヘビを描いた人が、余分に足を描き足している絵" },
  2005: { url: p2005, alt: "商人が盾と槍を両手に持ち、客に問い詰められて困っている絵" },
  2006: { url: p2006, alt: "貝と鳥が争っているあいだに、漁師が両方まとめてかごに入れる絵" },
  2007: { url: p2007, alt: "馬が逃げていくのを、おじいさんが落ち着いた顔で見ている絵" },
  2008: { url: p2008, alt: "晴れた空を心配そうに見上げて、傘を持っている人の絵" },
  2009: { url: p2009, alt: "切り株のそばにすわりこんで、うさぎが来るのを待ち続ける農民の絵" },
  2010: { url: p2010, alt: "朝と夕方でどんぐりの数を入れかえて、サルをごまかす人の絵" },
  2011: { url: p2011, alt: "壁の竜の絵に最後のひと筆で目を入れると、竜が動きだす絵" },
  2012: { url: p2012, alt: "仲の悪い二人の武将が、同じ小舟に気まずく乗り合わせている絵" },
  2013: { url: p2013, alt: "たきぎの上で眠り、苦い肝をなめて悔しさをこらえる王の絵" },
  2014: { url: p2014, alt: "陣の四方を敵に囲まれ、故郷の歌を聞かされて力を落とす将軍の絵" },
  2015: { url: p2015, alt: "背後が川で逃げ道のない兵たちが、前を向いて構えている絵" },
  2016: { url: p2016, alt: "古い書物を読みながら、新しいひらめきが浮かんでいる子の絵" },
  2017: { url: p2017, alt: "二人の職人が原石をみがき合って、宝石に仕上げている絵" },
  2018: { url: p2018, alt: "小さな器はもう完成し、大きな器だけがまだ窯でじっくり焼かれている絵" },
  2019: { url: p2019, alt: "ホタルの光と雪あかりをたよりに、夜おそくまで本を読む子の絵" },
  2020: { url: p2020, alt: "ロバに乗った詩人が、言葉選びに夢中で手ぶりをしながら人にぶつかる絵" },
  2021: { url: p2021, alt: "滝を登った魚が、立派な門をくぐって竜に変わる絵" },
  2022: { url: p2022, alt: "傷ひとつない丸い宝玉を、王の前に堂々と返す使者の絵" },
  2023: { url: p2023, alt: "武将が草ぶきの家を三度たずねて、ていねいに頭を下げている絵" },
  2024: { url: p2024, alt: "小さな人が竜のあごの下にふれてしまい、竜が怒って煙を吐く絵" },
  2025: { url: p2025, alt: "こぼれた水を、器に戻そうとしてもどうにもならない絵" },
  2026: { url: p2026, alt: "眠るトラのいる洞くつへ、こわがりながら踏み込む冒険者の絵" },
  2027: { url: p2027, alt: "藍のそめ液より鮮やかな青に染まった布を、弟子がうれしそうに掲げる絵" },
  2028: { url: p2028, alt: "遠くの山まで続く長い道の、最初の一歩を踏み出す人の絵" },
  2029: { url: p2029, alt: "書の名人が、思わぬ書き損じに気づいて気まずそうにしている絵" },
  2030: { url: p2030, alt: "三人の子が頭を寄せ合い、いいアイデアがひらめいた絵" },
  2031: { url: p2031, alt: "サルがたき火の中の栗を取ろうとして、手を熱がっている絵" },
  2032: { url: p2032, alt: "職人たちが長い時間をかけて、大きな石の都をつくっている絵" },
  2033: { url: p2033, alt: "泥の中の真珠のかざりを、ブタがまったく興味なさそうに嗅いでいる絵" },
  2034: { url: p2034, alt: "目からうろこのようなものが落ちて、急に世界がはっきり見えた人の絵" },
  2035: { url: p2035, alt: "白い羽の矢が家の屋根に突き立ち、家族がおどろいて指さす絵" },
  2036: { url: p2036, alt: "泳ぎ上手なカッパが、川の流れに押し流されてあわてている絵" },
  3001: { url: p3001, alt: "夜の関所で鶏の鳴きまねをする男と、犬のように忍び込む男の絵" },
  3002: { url: p3002, alt: "かたい友情で結ばれた将軍と大臣が、笑って手を取り合う絵" },
  3003: { url: p3003, alt: "苗を引っぱって伸ばそうとして、枯らしてしまった男の絵" },
  3004: { url: p3004, alt: "小さなカマキリが、大きな車の輪に前足を振り上げて立ち向かう絵" },
  3005: { url: p3005, alt: "深い霧に包まれて、進む方向が分からず立ちすくむ旅人の絵" },
  3006: { url: p3006, alt: "暗い部屋で、かけた服を鬼と見まちがえておどろく人の絵" },
  3007: { url: p3007, alt: "木のてっぺんに登って、魚を探している人の絵" },
  3008: { url: p3008, alt: "王の前で「まず私から」と自分を指す家臣と、後ろに続く賢者たちの絵" },
  3009: { url: p3009, alt: "牛の尻の横で、胸を張って先頭に立つニワトリの絵" },
  3010: { url: p3010, alt: "竹が一気に真っすぐ割れていく、勢いのある絵" },
  3011: { url: p3011, alt: "紙の店に人が押し寄せ、白い紙の山が売り切れそうになっている絵" },
  3012: { url: p3012, alt: "大きな青銅の器（鼎）を前に、重さを量ろうとのぞき込む人物の絵" },
  3013: { url: p3013, alt: "同盟の儀式で、牛の耳をつかんで盟主となる人の絵" },
  3014: { url: p3014, alt: "高くそびえる山と、夜空に光る北斗七星の絵" },
  3015: { url: p3015, alt: "五人兄弟のなかで、まゆに白い毛のまじった兄が一歩前に出ている絵" },
  3016: { url: p3016, alt: "気に入らない相手に対して、白目を向けている人の絵" },
  3017: { url: p3017, alt: "まわりに人がいないかのように、市中で歌い笑う男の絵" },
  3018: { url: p3018, alt: "子ザルを追って岸を走り、力尽きる母ザルの絵" },
  3019: { url: p3019, alt: "竹を馬に見立てて、いっしょに走り回る二人の子どもの絵" },
  3020: { url: p3020, alt: "水の中を気持ちよく泳ぐ魚のように、寄り添う君主と軍師の絵" },
  3021: { url: p3021, alt: "土ぼこりを巻き上げて、もう一度攻め寄せようとする軍勢の絵" },
  3022: { url: p3022, alt: "宿で眠る青年の夢に、王冠と豪華な暮らしが浮かんでいる絵" },
  3023: { url: p3023, alt: "チョウになって舞う夢を見ている思想家の絵" },
  3024: { url: p3024, alt: "店先に立派な羊の頭をかざり、下では別の肉を売っている店の絵" },
  3025: { url: p3025, alt: "宝石とただの石が、かごの中で入りまじっている絵" },
  3026: { url: p3026, alt: "決まりを気にせず、いいかげんに詩を書き散らす人の絵" },
  3027: { url: p3027, alt: "立派な上着を脱いで、もとの地味な姿に戻った人の絵" },
  3028: { url: p3028, alt: "隣家との境に立派な小柱が上がった家と、上げられない家の絵" },
  3029: { url: p3029, alt: "小さな魚が大きく育ち、最後の呼び名にたどり着く成長の絵" },
  3030: { url: p3030, alt: "調子がぴたりと合って、気持ちよく声を張り上げる人の絵" },
  3031: { url: p3031, alt: "舞台の板の上で、自然に決めポーズをとる役者の絵" },
  3032: { url: p3032, alt: "得意の演目を、自信たっぷりに演じる歌舞伎役者の絵" },
  3033: { url: p3033, alt: "黒い幕の裏で、こっそり糸を引いている人物の絵" },
  3034: { url: p3034, alt: "囲碁で、相手に敬意をこめて石をひとつ先に置く場面の絵" },
  3035: { url: p3035, alt: "そり具合が合わず、どうしてもかみ合わない二枚の板の絵" },
  3036: { url: p3036, alt: "火が回りすぎて切れ味を失った刃物を前に、困る鍛冶職人の絵" },
};

export function getProverbIllustration(id: number): ProverbIllustration | undefined {
  return proverbIllustrations[id];
}
