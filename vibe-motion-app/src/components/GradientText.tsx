import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface GradientTextProps {
  children: React.ReactNode;
  start?: number;
  duration?: number;
  style?: React.CSSProperties;
}

/**
 * 渐变文字组件
 * 支持从左到右渐变展开动画（clip-path 实现）
 */
export const GradientText: React.FC<GradientTextProps> = ({
  children,
  start = 0,
  duration = 30,
  style = {},
}) => {
  const frame = useCurrentFrame();

  // 从左到右展开进度
  const revealProgress = interpolate(
    frame,
    [start, start + duration],
    [0, 100],
    {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    }
  );

  // 整体淡入
  const opacity = interpolate(frame, [start, start + duration * 0.4], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity,
        ...style,
      }}
    >
      {/* 渐变底层（最终颜色） */}
      <span
        style={{
          background: theme.brand.gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
        }}
      >
        {children}
      </span>

      {/* 从左到右展开的遮罩层 */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: theme.brand.gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
        }}
        aria-hidden
      >
        {children}
      </span>

      {/* 未展开部分的灰色占位 */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          color: theme.text.muted,
          display: "inline-block",
          clipPath: `inset(0 0 0 ${revealProgress}%)`,
        }}
        aria-hidden
      >
        {children}
      </span>
    </div>
  );
};

export default GradientText;
