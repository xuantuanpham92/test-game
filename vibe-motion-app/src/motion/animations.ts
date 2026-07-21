import { interpolate, spring } from "remotion";

// Extrapolation constant
const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

// ============ 基础插值动画 ============

export const fadeIn = (
  frame: number,
  start: number,
  duration: number,
  from: number = 0,
  to: number = 1
) => {
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

export const fadeOut = (
  frame: number,
  start: number,
  duration: number,
  from: number = 1,
  to: number = 0
) => {
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

export const slideInX = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number = 0
) => {
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

export const slideInY = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number = 0
) => {
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

export const scaleIn = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number = 1
) => {
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

// ============ 弹簧动画 ============

export const springBounce = (
  frame: number,
  start: number,
  config?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  }
) => {
  const { damping = 100, stiffness = 100, mass = 1 } = config || {};
  return spring({
    frame: frame - start,
    fps: 30,
    config: { damping, stiffness, mass },
  });
};

export const springIn = (
  frame: number,
  start: number,
  duration: number,
  from: number = 0,
  to: number = 1
) => {
  return spring({
    frame: frame - start,
    fps: 30,
    config: { damping: 150, stiffness: 200 },
  });
};

// ============ 特殊效果 ============

export const blurTransition = (
  frame: number,
  start: number,
  duration: number,
  maxBlur: number = 10
) => {
  return interpolate(frame, [start, start + duration], [0, maxBlur], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

export const floatY = (
  frame: number,
  baseY: number,
  amplitude: number,
  speed: number = 1
) => {
  return baseY + Math.sin((frame / 30) * speed * Math.PI * 2) * amplitude;
};

export const pulseScale = (frame: number, baseScale: number, amplitude: number) => {
  return baseScale + Math.sin((frame / 30) * Math.PI * 2) * amplitude;
};

export const rotateZ = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number
) => {
  return interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

// ============ 复合动画 ============

export const phoneEnter = (frame: number, start: number) => {
  const progress = spring({
    frame: frame - start,
    fps: 30,
    config: { damping: 150, stiffness: 200 },
  });
  return {
    scale: interpolate(progress, [0, 1], [0.8, 1]),
    y: interpolate(progress, [0, 1], [100, 0]),
    rotateZ: interpolate(progress, [0, 1], [-8, 0]),
    opacity: interpolate(progress, [0, 0.5], [0, 1]),
  };
};

export const optionSelect = (frame: number, start: number) => {
  const progress = spring({
    frame: frame - start,
    fps: 30,
    config: { damping: 100, stiffness: 200 },
  });
  return {
    scale: interpolate(progress, [0, 0.5, 1], [1, 1.025, 1]),
    borderWidth: interpolate(progress, [0, 1], [1, 2]),
  };
};

export const staggerFade = (
  frame: number,
  baseStart: number,
  staggerGap: number,
  index: number
) => {
  const itemStart = baseStart + index * staggerGap;
  return fadeIn(frame, itemStart, 12);
};

// ============ 进度动画 ============

export const progressBar = (frame: number, start: number, duration: number) => {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
};

export const countUp = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number
) => {
  return Math.round(
    interpolate(frame, [start, start + duration], [from, to], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    })
  );
};
