// 扶摇品牌视觉 Token
export const theme = {
  // 品牌色
  brand: {
    primary: "#625BFF", // 品牌紫
    secondary: "#F044A5", // 品牌粉
    gradient: "linear-gradient(135deg, #625BFF 0%, #F044A5 100%)",
  },

  // 背景色
  background: {
    light: "#F7F8FF", // 浅紫白
    lightAlt: "#EEF2FF", // 浅紫蓝
    pure: "#FFFFFF",
    dark: "#0D0F1A", // 深蓝黑
    darkAlt: "#1A1D3A", // 深色光晕
    ctaDark: "#0A0B14", // CTA 深色
  },

  // 文字色
  text: {
    primary: "#1A1A2E", // 主文字
    secondary: "#6B7280", // 次文字
    inverse: "#FFFFFF", // 反色文字
    muted: "#9CA3AF", // 弱化文字
  },

  // 边框与阴影
  border: {
    subtle: "rgba(98, 91, 255, 0.2)",
    active: "#625BFF",
    glow: "rgba(98, 91, 255, 0.5)",
  },

  // 手机框架
  phone: {
    frame: "#1A1A1A",
    island: "#000000",
    bezel: "#2D2D2D",
    shadow: "0 40px 80px rgba(0, 0, 0, 0.25)",
  },

  // Orb 分析器
  orb: {
    core: "#625BFF",
    innerRing: "#8B85FF",
    outerRing: "#F044A5",
    particle: "#FFFFFF",
    glow: "rgba(98, 91, 255, 0.6)",
  },

  // 答题选项
  option: {
    default: {
      bg: "#FFFFFF",
      border: "#E5E7EB",
      text: "#1A1A2E",
    },
    selected: {
      bg: "#FFFFFF",
      border: "#625BFF",
      borderWidth: 2,
      text: "#1A1A2E",
      shadow: "0 0 20px rgba(98, 91, 255, 0.3)",
    },
  },

  // 进度条
  progress: {
    track: "#E5E7EB",
    fill: "#625BFF",
  },

  // 动画时长
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
  },
} as const;

export type Theme = typeof theme;
