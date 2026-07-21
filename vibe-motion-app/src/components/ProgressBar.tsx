import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface ProgressBarProps {
  progress: number; // 0-1
  start?: number;
  width?: number;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

/**
 * 进度条组件
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  start = 0,
  width = 200,
  height = 4,
  showLabel = false,
  label,
}) => {
  const frame = useCurrentFrame();

  const currentProgress = interpolate(frame, [start, start + 60], [0, progress], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {showLabel && label && (
        <div
          style={{
            fontSize: 12,
            color: theme.text.muted,
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width,
          height,
          backgroundColor: theme.progress.track,
          borderRadius: height / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${currentProgress * 100}%`,
            height: "100%",
            background: theme.brand.gradient,
            borderRadius: height / 2,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
