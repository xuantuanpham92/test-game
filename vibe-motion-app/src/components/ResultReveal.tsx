import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";
import GradientText from "./GradientText";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface ResultRevealProps {
  start?: number;
  title: string;
  subtitle: string;
  description: string;
  iconEmoji?: string;
}

/**
 * 结果揭晓组件
 * 包含景深效果、icon弹跳、渐变标题
 */
export const ResultReveal: React.FC<ResultRevealProps> = ({
  start = 0,
  title,
  subtitle,
  description,
  iconEmoji = "🧠",
}) => {
  const frame = useCurrentFrame();

  // Icon 景深效果 - 三层叠加
  const iconDepth1 = interpolate(frame, [start, start + 20], [0.5, 0.3], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const iconDepth2 = interpolate(frame, [start + 5, start + 25], [0.7, 0.6], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const iconMain = interpolate(frame, [start + 10, start + 30], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  // Icon 弹跳
  const bounceProgress = spring({
    frame: frame - (start + 20),
    fps: 30,
    config: { damping: 100, stiffness: 200 },
  });
  const iconScale = interpolate(bounceProgress, [0, 0.5, 1], [1, 1.15, 1]);

  // 标题淡入
  const titleOpacity = interpolate(frame, [start + 15, start + 35], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const titleY = interpolate(frame, [start + 15, start + 35], [20, 0], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  // 描述淡入
  const descOpacity = interpolate(frame, [start + 30, start + 50], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
      }}
    >
      {/* Icon 景深效果 */}
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          marginBottom: 32,
        }}
      >
        {/* 模糊后层 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontSize: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: `blur(${iconDepth1 * 20}px)`,
            opacity: iconDepth1,
          }}
        >
          {iconEmoji}
        </div>

        {/* 模糊中层 */}
        <div
          style={{
            position: "absolute",
            inset: 5,
            fontSize: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: `blur(${iconDepth2 * 10}px)`,
            opacity: iconDepth2,
          }}
        >
          {iconEmoji}
        </div>

        {/* 清晰主层 */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            fontSize: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: iconMain,
            transform: `scale(${iconScale})`,
          }}
        >
          {iconEmoji}
        </div>
      </div>

      {/* 副标题 */}
      <div
        style={{
          fontSize: 16,
          color: theme.text.secondary,
          marginBottom: 8,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontWeight: 500,
        }}
      >
        {subtitle}
      </div>

      {/* 渐变标题 */}
      <div
        style={{
          marginBottom: 20,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <GradientText start={start + 20} duration={25}>
          <span style={{ fontSize: 42, fontWeight: 800 }}>{title}</span>
        </GradientText>
      </div>

      {/* 描述 */}
      <div
        style={{
          fontSize: 16,
          color: theme.text.secondary,
          textAlign: "center",
          lineHeight: 1.6,
          opacity: descOpacity,
          maxWidth: 280,
        }}
      >
        {description}
      </div>
    </div>
  );
};

export default ResultReveal;
