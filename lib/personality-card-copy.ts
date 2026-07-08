const PERSONALITY_CARD_LINES: Record<string, string> = {
  condition_leaker: "题干里藏了坑，我每次都像在玩盲盒。",
  formula_sleeper: "公式都认识我，考试时我不认识它。",
  variant_lost: "题我见过，分我没见过。",
  calculation_crasher: "思路一路绿灯，计算当场追尾。",
  review_disconnected: "错题本很努力，我的大脑先下班。",
  expression_offline: "脑子里满分答案，卷面上惜字如金。",
  final_boss_lost: "第一问我是学霸，第二问开始迷路。",
  time_blackhole: "时间不是不够，是被我认真花没了。",
  perfect: "我不是没短板，我是短板还没上线。",
};

export function getPersonalityCardLine(typeKey?: string | null, fallback?: string) {
  if (!typeKey) return fallback || "这是一份属于你的学习人格画像。";

  return (
    PERSONALITY_CARD_LINES[typeKey] ||
    fallback ||
    "这是一份属于你的学习人格画像。"
  );
}
