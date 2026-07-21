import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface PrimaryButtonProps {
  children: React.ReactNode;
  start?: number;
  duration?: number;
  yOffset?: number;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "outline";
}

/**
 * 主按钮组件
 * 支持多种变体和上浮动画
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  start = 0,
  duration = 18,
  yOffset = 24,
  style = {},
  variant = "primary",
}) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: frame - start,
    fps: 30,
    config: { damping: 180, stiffness: 200, mass: 0.8 },
  });
  const opacity = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const translateY = interpolate(progress, [0, 1], [yOffset, 0]);
  const scaleValue = interpolate(progress, [0, 0.6, 1], [0.92, 1.02, 1]);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          background: theme.brand.gradient,
          color: theme.text.inverse,
          border: "none",
          boxShadow: "0 8px 28px rgba(98, 91, 255, 0.45)",
        };
      case "secondary":
        return {
          background: "rgba(255, 255, 255, 0.92)",
          color: theme.text.primary,
          border: `1.5px solid ${theme.border.subtle}`,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        };
      case "outline":
        return {
          background: "transparent",
          color: theme.text.primary,
          border: `1.5px solid ${theme.border.subtle}`,
          boxShadow: "none",
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 36px",
        borderRadius: 999,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: 0.3,
        cursor: "pointer",
        transform: `translateY(${translateY}px) scale(${scaleValue})`,
        opacity,
        ...getVariantStyles(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PrimaryButton;
