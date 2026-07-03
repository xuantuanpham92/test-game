export const DIMENSIONS = {
  condition: "条件识别力",
  formula: "公式唤醒力",
  transfer: "题型迁移力",
  calculation: "计算稳定性",
  review: "复盘转化力",
  expression: "表达规范性",
  complex: "压轴拆解力",
  time: "时间控制力",
} as const;

export const DIMENSION_KEYS = Object.keys(DIMENSIONS) as DimensionKey[];

export type DimensionKey = keyof typeof DIMENSIONS;

export const PERSONALITY_BY_DIMENSION: Record<DimensionKey, string> = {
  condition: "condition_leaker",
  formula: "formula_sleeper",
  transfer: "variant_lost",
  calculation: "calculation_crasher",
  review: "review_disconnected",
  expression: "expression_offline",
  complex: "final_boss_lost",
  time: "time_blackhole",
};

export const DEFAULT_SCORE = 70;

export const GRADE_OPTIONS = [
  { value: "JUNIOR_1", label: "初一" },
  { value: "JUNIOR_2", label: "初二" },
  { value: "JUNIOR_3", label: "初三" },
  { value: "SENIOR_1", label: "高一" },
  { value: "SENIOR_2", label: "高二" },
  { value: "SENIOR_3", label: "高三" },
] as const;

export const SUBJECT_OPTIONS = [
  { value: "MATH", label: "数学" },
  { value: "CHINESE", label: "语文" },
  { value: "ENGLISH", label: "英语" },
  { value: "PHYSICS", label: "物理" },
  { value: "CHEMISTRY", label: "化学" },
  { value: "BIOLOGY", label: "生物" },
  { value: "HISTORY", label: "历史" },
  { value: "POLITICS", label: "政治" },
  { value: "GEOGRAPHY", label: "地理" },
] as const;

export const LEAD_STATUS_OPTIONS = [
  { value: "NEW", label: "新线索" },
  { value: "CONTACTED", label: "已联系" },
  { value: "INTERESTED", label: "有兴趣" },
  { value: "CONVERTED", label: "已转化" },
  { value: "INVALID", label: "无效" },
] as const;

export const PERSONALITY_THEME_COLORS: Record<string, string> = {
  condition_leaker: "#6366F1",
  formula_sleeper: "#8B5CF6",
  variant_lost: "#EC4899",
  calculation_crasher: "#F59E0B",
  review_disconnected: "#3B82F6",
  expression_offline: "#10B981",
  final_boss_lost: "#EF4444",
  time_blackhole: "#6366F1",
};
