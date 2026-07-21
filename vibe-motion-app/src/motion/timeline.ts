// 扶摇视频时间轴常量
// 基准：30fps, 1080x1920

// ============ 总时长 ============
export const TOTAL_FRAMES = 180;
export const FPS = 30;

// ============ FuyaoDemo 场景边界 (6s) ============
// Scene 1: Hero 首页 Hook
export const SCENE1_START = 0;
export const SCENE1_END = 38;

// Scene 2: 答题页
export const SCENE2_START = 36;
export const SCENE2_END = 78;

// Scene 3: AI 分析
export const SCENE3_START = 75;
export const SCENE3_END = 128;

// Scene 4: 结果揭晓
export const SCENE4_START = 126;
export const SCENE4_END = 180;

// ============ 转场重叠帧数 ============
export const TRANSITION_OVERLAP = 3;

// ============ Hero 场景动画时间点 ============
export const HERO_PHONE_ENTER = { start: 0, duration: 30 };
export const HERO_ICONS_FADE = { start: 0, duration: 20 };
export const HERO_TITLE_FADE = { start: 16, duration: 22 };
export const HERO_SUBTITLE_FADE = { start: 22, duration: 16 };
export const HERO_BTN_FADE = { start: 28, duration: 16 };

// ============ 答题场景动画时间点 (相对于 scene 开始) ============
export const QUESTION_CARD_IN = { start: 0, duration: 15 };
export const OPTION_STAGGER = { start: 6, duration: 10, gap: 7 };
export const OPTION_SELECT = { start: 22, duration: 12 };

// ============ AI 分析场景动画时间点 ============
export const ANALYZE_BG_FADE = { start: 0, duration: 15 };
export const ORB_CORE_IN = { start: 5, duration: 15 };
export const ORB_RINGS_ROTATE = { start: 5, duration: 48 };
export const PARTICLE_ORBIT = { start: 8, duration: 48 };
export const ANALYZE_TEXT_CYCLE = { duration: 38, fadeTime: 6 };

// ============ 结果揭晓场景动画时间点 ============
export const RESULT_BG_SHIFT = { start: 0, duration: 18 };
export const RESULT_ICON_DEPTH = { start: 4, duration: 28 };
export const RESULT_ICON_BOUNCE = { start: 22, duration: 20 };
export const RESULT_TITLE_FADE = { start: 24, duration: 28 };
export const RESULT_DESC_FADE = { start: 36, duration: 16 };
export const RESULT_BTNS_FADE = { start: 42, duration: 16 };

// ============ 转场时间点 ============
export const TRANSITION_SC1_SC2 = { start: 33, duration: 5 };
export const TRANSITION_SC2_SC3 = { start: 72, duration: 5 };
export const TRANSITION_SC3_SC4 = { start: 123, duration: 5 };
