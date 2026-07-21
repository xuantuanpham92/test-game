// Remotion 缓动函数预设
// 基于常见 CSS 缓动函数

export const Easing = {
  // 线性
  linear: (t: number) => t,

  // 缓入
  easeIn: (t: number) => t * t * t,
  easeInQuad: (t: number) => t * t,
  easeInCubic: (t: number) => t * t * t,
  easeInQuart: (t: number) => t * t * t * t,
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),

  // 缓出
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuad: (t: number) => 1 - (1 - t) * (1 - t),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

  // 缓入缓出
  easeInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // 弹簧效果（用于 spring 动画参数）
  spring: {
    gentle: { damping: 200, stiffness: 100, mass: 1 },
    bouncy: { damping: 100, stiffness: 200, mass: 1 },
    stiff: { damping: 300, stiffness: 300, mass: 1 },
    slow: { damping: 150, stiffness: 80, mass: 1 },
  },
} as const;

// 常用缓动组合
export const CommonEasing = {
  // 快速出现
  quickIn: Easing.easeOut,

  // 缓慢消失
  slowOut: Easing.easeInQuad,

  // 弹性出现
  bounceIn: Easing.easeOut,

  // 平滑过渡
  smooth: Easing.easeInOutCubic,

  // 即时反馈
  instant: Easing.linear,
} as const;
