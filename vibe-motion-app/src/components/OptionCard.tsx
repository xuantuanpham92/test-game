import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface OptionCardProps {
  label: string;
  text: string;
  index: number;
  baseStart: number;
  staggerGap: number;
  isSelected?: boolean;
  selectedStart?: number;
}

/**
 * 选项卡片组件
 * 支持 stagger 滑入动画 + 选中发光 scale bounce
 */
export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  text,
  index,
  baseStart,
  staggerGap,
  isSelected = false,
  selectedStart = 0,
}) => {
  const frame = useCurrentFrame();
  const itemStart = baseStart + index * staggerGap;

  // Stagger 滑入
  const staggerProgress = spring({
    frame: frame - itemStart,
    fps: 30,
    config: { damping: 200, stiffness: 180, mass: 0.8 },
  });
  const opacity = interpolate(frame, [itemStart, itemStart + 12], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const translateX = interpolate(staggerProgress, [0, 1], [40, 0]);
  const translateY = interpolate(staggerProgress, [0, 1], [10, 0]);

  // 选中动效：scale bounce + glow
  const selectedProgress = isSelected
    ? spring({
        frame: frame - selectedStart,
        fps: 30,
        config: { damping: 80, stiffness: 250, mass: 0.6 },
      })
    : 0;

  const selectedScale = isSelected
    ? interpolate(selectedProgress, [0, 0.4, 1], [1, 1.03, 1])
    : 1;

  const glowOpacity = isSelected
    ? interpolate(selectedProgress, [0, 0.5, 1], [0, 1, 0.7])
    : 0;

  // 选中标签颜色过渡
  const labelBgProgress = isSelected
    ? interpolate(selectedProgress, [0, 1], [0, 1])
    : 0;

  return (
    <div
      style={{
        transform: `
          translateX(${translateX}px)
          translateY(${translateY}px)
          scale(${selectedScale})
        `,
        opacity,
        padding: "15px 18px",
        borderRadius: 14,
        border: isSelected
          ? `2px solid ${theme.border.active}`
          : `1.5px solid ${theme.option.default.border}`,
        backgroundColor: isSelected
          ? "#FFFFFF"
          : theme.option.default.bg,
        marginBottom: 10,
        boxShadow: isSelected
          ? `0 0 ${16 + glowOpacity * 20}px ${theme.border.glow}`
          : "0 2px 8px rgba(0, 0, 0, 0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 选中渐变背景 */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(98, 91, 255, 0.06) 0%, rgba(240, 68, 165, 0.04) 100%)",
            opacity: glowOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 选中外发光 */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 18,
            boxShadow: `0 0 ${12 * glowOpacity}px ${theme.orb.glow}`,
            opacity: glowOpacity * 0.5,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 选项标签圆圈 */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: isSelected
              ? theme.brand.primary
              : "#F3F4F6",
            color: isSelected ? theme.text.inverse : theme.text.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            marginRight: 12,
            flexShrink: 0,
          }}
        >
          {label}
        </div>

        {/* 选项文本 */}
        <div
          style={{
            fontSize: 15,
            color: isSelected ? theme.brand.primary : theme.text.primary,
            fontWeight: isSelected ? 600 : 500,
            flex: 1,
            lineHeight: 1.4,
          }}
        >
          {text}
        </div>

        {/* 选中勾号 */}
        {isSelected && (
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: theme.brand.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 8,
              flexShrink: 0,
              opacity: glowOpacity,
              transform: `scale(${0.5 + glowOpacity * 0.5})`,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionCard;
