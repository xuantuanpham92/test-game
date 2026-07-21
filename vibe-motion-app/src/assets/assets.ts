// 扶摇 UI 截图资源
// 注意：这些是用户提供的参考图，用于展示扶摇产品界面

// 参考包根路径
const REF_PATH = "E:/克劳德的文件/弱科人格画像/reference/fuyao_claude_reference_pack";
const UI_PATH = `${REF_PATH}/user_ui_references`;

// UI 图片路径（本地开发使用 file://）
export const UI_IMAGES = {
  homeHero: `${UI_PATH}/01_home_hero.jpg`,
  questionEmpty: `${UI_PATH}/02_question_empty.jpg`,
  questionSelectedA: `${UI_PATH}/03_question_selected_a.jpg`,
  question2Empty: `${UI_PATH}/04_question_2_empty.jpg`,
  questionSelectedB: `${UI_PATH}/05_question_selected_b.jpg`,
  analysis1: `${UI_PATH}/06_analysis_1.jpg`,
  analysis2: `${UI_PATH}/07_analysis_2.jpg`,
  analysis3: `${UI_PATH}/08_analysis_3.jpg`,
  analysis4: `${UI_PATH}/09_analysis_4.jpg`,
  resultHero: `${UI_PATH}/10_result_hero.jpg`,
  personalityAnalysis: `${UI_PATH}/11_personality_analysis.jpg`,
  radarScores: `${UI_PATH}/12_radar_scores.jpg`,
  diagnosisSummary: `${UI_PATH}/13_diagnosis_summary.jpg`,
  scoreMechanism: `${UI_PATH}/14_score_mechanism.jpg`,
  strengthRisk: `${UI_PATH}/15_strength_risk.jpg`,
  sevenDayPlan: `${UI_PATH}/16_seven_day_plan.jpg`,
  trainingAdvice: `${UI_PATH}/17_training_advice.jpg`,
} as const;

// Local 图片导入（用于 Remotion staticFile / Img 标签）
export const LOCAL_ASSETS = {
  homeHero: "assets/01_home_hero.jpg",
  questionEmpty: "assets/02_question_empty.jpg",
  questionSelectedA: "assets/03_question_selected_a.jpg",
  questionSelectedB: "assets/05_question_selected_b.jpg",
  resultHero: "assets/10_result_hero.jpg",
  personalityAnalysis: "assets/11_personality_analysis.jpg",
  radarScores: "assets/12_radar_scores.jpg",
  diagnosisSummary: "assets/13_diagnosis_summary.jpg",
  sevenDayPlan: "assets/16_seven_day_plan.jpg",
  trainingAdvice: "assets/17_training_advice.jpg",
} as const;

// 浮动学习元素 SVG
export const STUDY_ICONS = {
  ruler: {
    type: "svg" as const,
    content: `<svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="76" height="16" rx="2" fill="#E8E5FF" stroke="#625BFF" stroke-width="1.5"/>
      <line x1="10" y1="4" x2="10" y2="20" stroke="#625BFF" stroke-width="1"/>
      <line x1="20" y1="8" x2="20" y2="20" stroke="#625BFF" stroke-width="1"/>
      <line x1="30" y1="4" x2="30" y2="20" stroke="#625BFF" stroke-width="1"/>
      <line x1="40" y1="8" x2="40" y2="20" stroke="#625BFF" stroke-width="1"/>
      <line x1="50" y1="4" x2="50" y2="20" stroke="#625BFF" stroke-width="1"/>
      <line x1="60" y1="8" x2="60" y2="20" stroke="#625BFF" stroke-width="1"/>
      <line x1="70" y1="4" x2="70" y2="20" stroke="#625BFF" stroke-width="1"/>
    </svg>`,
    width: 80,
    height: 24,
  },
  abacus: {
    type: "svg" as const,
    content: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="40" height="32" rx="4" fill="#FFF5E8" stroke="#F044A5" stroke-width="1.5"/>
      <line x1="4" y1="16" x2="44" y2="16" stroke="#F044A5" stroke-width="1.5"/>
      <line x1="4" y1="24" x2="44" y2="24" stroke="#F044A5" stroke-width="1.5"/>
      <line x1="4" y1="32" x2="44" y2="32" stroke="#F044A5" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="3" fill="#F044A5"/>
      <circle cx="24" cy="12" r="3" fill="#F044A5"/>
      <circle cx="36" cy="12" r="3" fill="#F044A5"/>
      <circle cx="18" cy="20" r="3" fill="#F044A5"/>
      <circle cx="30" cy="20" r="3" fill="#F044A5"/>
      <circle cx="12" cy="28" r="3" fill="#F044A5"/>
      <circle cx="24" cy="28" r="3" fill="#F044A5"/>
      <circle cx="36" cy="28" r="3" fill="#F044A5"/>
    </svg>`,
    width: 48,
    height: 48,
  },
  chart: {
    type: "svg" as const,
    content: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="40" rx="4" fill="#E8FFF0" stroke="#22C55E" stroke-width="1.5"/>
      <rect x="10" y="28" width="6" height="12" rx="1" fill="#22C55E"/>
      <rect x="21" y="20" width="6" height="20" rx="1" fill="#22C55E"/>
      <rect x="32" y="12" width="6" height="28" rx="1" fill="#22C55E"/>
    </svg>`,
    width: 48,
    height: 48,
  },
  cross: {
    type: "svg" as const,
    content: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5"/>
      <path d="M13 13L27 27M27 13L13 27" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    width: 40,
    height: 40,
  },
  check: {
    type: "svg" as const,
    content: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="#DCFCE7" stroke="#22C55E" stroke-width="1.5"/>
      <path d="M12 20L17 25L28 14" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    width: 40,
    height: 40,
  },
  brain: {
    type: "svg" as const,
    content: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z" fill="#EEF2FF" stroke="#625BFF" stroke-width="1.5"/>
      <path d="M16 18C16 18 20 14 24 14C28 14 32 18 32 18" stroke="#625BFF" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 24C12 24 16 20 24 20C32 20 36 24 36 24" stroke="#625BFF" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14 30C14 30 18 26 24 26C30 26 34 30 34 30" stroke="#625BFF" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="18" cy="18" r="2" fill="#F044A5"/>
      <circle cx="30" cy="22" r="2" fill="#F044A5"/>
      <circle cx="22" cy="28" r="2" fill="#F044A5"/>
    </svg>`,
    width: 48,
    height: 48,
  },
} as const;

// 导出所有图标数组（用于 stagger 动画）
export const FLOATING_ICONS_ARRAY = [
  { key: "ruler", ...STUDY_ICONS.ruler },
  { key: "abacus", ...STUDY_ICONS.abacus },
  { key: "brain", ...STUDY_ICONS.brain },
  { key: "chart", ...STUDY_ICONS.chart },
  { key: "cross", ...STUDY_ICONS.cross },
] as const;
