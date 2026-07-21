import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface ProductScreenFrameProps {
  children: React.ReactNode;
  rotateZ?: number;
  rotateY?: number;
  shadowIntensity?: number;
  enterStart?: number;
}

/**
 * 产品展示容器组件
 * 比 PhoneFrame 更轻量的替代品
 * 用于展示产品界面时使用
 */
export const ProductScreenFrame: React.FC<ProductScreenFrameProps> = ({
  children,
  rotateZ = 0,
  rotateY = 0,
  shadowIntensity = 1,
  enterStart = 0,
}) => {
  const frame = useCurrentFrame();

  // 进入动画
  const progress = spring({
    frame: frame - enterStart,
    fps: 30,
    config: { damping: 150, stiffness: 200 },
  });
  const opacity = interpolate(frame, [enterStart, enterStart + 10], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const scale = interpolate(progress, [0, 1], [0.95, 1]);
  const y = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 720,
        borderRadius: 32,
        backgroundColor: theme.background.pure,
        boxShadow: `
          0 ${30 * shadowIntensity}px ${60 * shadowIntensity}px rgba(0, 0, 0, ${0.2 * shadowIntensity}),
          0 0 0 1px rgba(0, 0, 0, 0.05)
        `,
        transform: `
          scale(${scale})
          translateY(${y}px)
          rotateZ(${rotateZ}deg)
          rotateY(${rotateY}deg)
        `,
        opacity,
        transformStyle: "preserve-3d",
        perspective: 1000,
        overflow: "hidden",
      }}
    >
      {/* 顶部状态栏占位 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 44,
          backgroundColor: theme.background.pure,
          zIndex: 10,
        }}
      />

      {/* 内容区域 */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* 底部安全区指示 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 34,
          backgroundColor: theme.background.pure,
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default ProductScreenFrame;
