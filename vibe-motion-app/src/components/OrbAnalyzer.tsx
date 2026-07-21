import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface OrbAnalyzerProps {
  start?: number;
  progressStart?: number;
  progressDuration?: number;
  /** 文案数组，按顺序轮换 */
  textLines?: string[];
  /** 每条文案显示的帧数 */
  textDisplayFrames?: number;
}

/**
 * AI 分析 Orb 组件（纯代码重建）
 * 包含：中心呼吸圆点、三圈旋转圆环、环绕粒子、进度条、文案轮换
 */
export const OrbAnalyzer: React.FC<OrbAnalyzerProps> = ({
  start = 0,
  progressStart = 0,
  progressDuration = 120,
  textLines = [
    "正在分析你的失分模式...",
    "正在匹配弱科人格...",
    "正在生成能力画像...",
  ],
  textDisplayFrames = 45,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - start;

  // ====== 核心圆点 ======
  const coreScale = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  // 核心呼吸（sin 驱动，非随机）
  const coreBreath =
    1 + Math.sin((localFrame / 30) * Math.PI * 2 * 0.5) * 0.08;

  // ====== 圆环旋转 ======
  const innerRingRotation = localFrame * 2; // 顺时针
  const middleRingRotation = localFrame * 1.3; // 顺时针，慢
  const outerRingRotation = -localFrame * 1.5; // 逆时针
  const outerDashedRotation = -localFrame * 0.9; // 逆时针，更慢

  // ====== 进度 ======
  const progress = interpolate(
    frame,
    [progressStart, progressStart + progressDuration],
    [0, 1],
    {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    }
  );

  // ====== 环绕粒子（固定数组） ======
  const particles = [
    { angle: 0, distance: 90, size: 6, speed: 0.022 },
    { angle: 60, distance: 100, size: 5, speed: 0.025 },
    { angle: 120, distance: 85, size: 7, speed: 0.018 },
    { angle: 180, distance: 95, size: 5, speed: 0.022 },
    { angle: 240, distance: 88, size: 6, speed: 0.02 },
    { angle: 300, distance: 92, size: 5, speed: 0.024 },
    // 额外粒子增加密度
    { angle: 30, distance: 82, size: 4, speed: 0.028 },
    { angle: 150, distance: 98, size: 4, speed: 0.019 },
    { angle: 270, distance: 86, size: 5, speed: 0.026 },
  ];

  // ====== 背景静态粒子（固定位置） ======
  const staticParticles = [
    { x: "15%", y: "25%", size: 3, delay: 0 },
    { x: "85%", y: "20%", size: 4, delay: 5 },
    { x: "10%", y: "65%", size: 3, delay: 10 },
    { x: "80%", y: "60%", size: 4, delay: 3 },
    { x: "20%", y: "80%", size: 3, delay: 8 },
    { x: "75%", y: "75%", size: 3, delay: 12 },
    { x: "50%", y: "15%", size: 4, delay: 7 },
    { x: "40%", y: "85%", size: 3, delay: 15 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: 280,
        height: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 外圈光晕 */}
      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orb.glow} 0%, transparent 70%)`,
          opacity: 0.6 * (0.8 + Math.sin(localFrame / 30 * Math.PI * 0.3) * 0.2),
        }}
      />

      {/* 第一圈：最外圈 solid 逆时针 */}
      <div
        style={{
          position: "absolute",
          width: 230,
          height: 230,
          borderRadius: "50%",
          border: `2px solid ${theme.orb.outerRing}`,
          opacity: 0.4,
          transform: `rotate(${outerRingRotation}deg)`,
        }}
      />
      {/* 最外圈：dashed 更慢 */}
      <div
        style={{
          position: "absolute",
          width: 230,
          height: 230,
          borderRadius: "50%",
          border: `1px dashed ${theme.orb.outerRing}`,
          opacity: 0.25,
          transform: `rotate(${outerDashedRotation}deg)`,
        }}
      />

      {/* 第二圈：中圈顺时针 */}
      <div
        style={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: "50%",
          border: `2px solid ${theme.orb.innerRing}`,
          opacity: 0.5,
          transform: `rotate(${middleRingRotation}deg)`,
        }}
      />
      {/* 中圈：内虚线 */}
      <div
        style={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: "50%",
          border: `1px dotted ${theme.orb.innerRing}`,
          opacity: 0.3,
          transform: `rotate(${middleRingRotation * -0.6}deg)`,
        }}
      />

      {/* 第三圈：内圈顺时针 */}
      <div
        style={{
          position: "absolute",
          width: 110,
          height: 110,
          borderRadius: "50%",
          border: `1.5px solid ${theme.orb.core}`,
          opacity: 0.55,
          transform: `rotate(${innerRingRotation}deg)`,
        }}
      />
      {/* 内圈：发光环 */}
      <div
        style={{
          position: "absolute",
          width: 110,
          height: 110,
          borderRadius: "50%",
          border: `1px solid ${theme.orb.core}`,
          opacity: 0.25,
          transform: `rotate(${innerRingRotation * 1.4}deg)`,
          boxShadow: `0 0 15px ${theme.orb.glow}`,
        }}
      />

      {/* 核心圆点（呼吸） */}
      <div
        style={{
          position: "absolute",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: theme.brand.gradient,
          transform: `scale(${coreScale * coreBreath})`,
          boxShadow: [
            `0 0 30px ${theme.orb.core}`,
            `0 0 60px ${theme.orb.glow}`,
            `0 0 90px rgba(98, 91, 255, 0.15)`,
          ].join(", "),
        }}
      />

      {/* 环绕粒子 */}
      {particles.map((particle, index) => {
        const currentAngle =
          particle.angle + localFrame * particle.speed * 180;
        const rad = (currentAngle * Math.PI) / 180;
        const x = Math.cos(rad) * particle.distance;
        const y = Math.sin(rad) * particle.distance;

        const particleOpacity = interpolate(
          localFrame,
          [0 + index * 4, 15 + index * 4],
          [0, 1],
          {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          }
        );

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              backgroundColor: theme.orb.particle,
              boxShadow: `0 0 ${particle.size * 2}px ${theme.orb.particle}`,
              transform: `translate(${x}px, ${y}px)`,
              opacity: particleOpacity,
            }}
          />
        );
      })}

      {/* 进度条 */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          width: 220,
          height: 4,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: theme.brand.gradient,
            borderRadius: 2,
            boxShadow: `0 0 10px ${theme.orb.glow}`,
          }}
        />
      </div>

      {/* 背景静态粒子 */}
      {staticParticles.map((p, index) => {
        const sparkle =
          Math.sin((localFrame + p.delay) / 30 * Math.PI * 1.5) * 0.5 + 0.5;
        return (
          <div
            key={`static-${index}`}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: theme.orb.particle,
              opacity: interpolate(localFrame, [0, 30], [0, 0.5 * sparkle], {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              }),
            }}
          />
        );
      })}
    </div>
  );
};

export default OrbAnalyzer;
