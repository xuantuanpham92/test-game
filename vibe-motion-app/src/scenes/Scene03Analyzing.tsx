import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../styles/theme";
import OrbAnalyzer from "../components/OrbAnalyzer";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/**
 * Scene 3: AI 分析页 (本地帧 0-60)
 *
 * 质感要点:
 * - 深蓝黑径向渐变背景 + 中心紫色光晕
 * - 代码重建 Orb: 呼吸核心 + 3圈圆环 + 9个环绕粒子 + 底部进度条
 * - 分析文案带交叉淡入的轮换
 * - 暗色玻璃质感的 skeleton 报告卡呼吸
 * - 背景静态装饰粒子闪烁
 */
export const Scene03Analyzing: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - 72);

  // 背景淡入
  const bgOpacity = interpolate(localFrame, [0, 14], [0, 1], CLAMP);

  // 分析文案轮换
  const texts = [
    "正在分析你的失分模式...",
    "正在匹配弱科人格...",
    "正在生成能力画像...",
  ];
  const cycleLen = 36; // 每条文案约 1.2s
  const fadeLen = 6;   // 交叉淡入淡出 6 帧

  const currentIdx = Math.floor(localFrame / cycleLen) % texts.length;
  const posInCycle = localFrame % cycleLen;
  const nextIdx = (currentIdx + 1) % texts.length;

  // 当前文案透明度
  const currentOpacity = posInCycle < fadeLen
    ? posInCycle / fadeLen
    : posInCycle > cycleLen - fadeLen
      ? (cycleLen - posInCycle) / fadeLen
      : 1;

  // Skeleton 呼吸（sin 驱动）
  const skeletonOpacity = 0.3 + Math.sin((localFrame / 30) * Math.PI * 1.4) * 0.25;

  // 背景粒子
  const bgParticles = [
    { x: "8%", y: "22%", s: 3, d: 0 },
    { x: "88%", y: "18%", s: 4, d: 5 },
    { x: "12%", y: "60%", s: 3, d: 10 },
    { x: "82%", y: "55%", s: 4, d: 3 },
    { x: "15%", y: "82%", s: 3, d: 8 },
    { x: "78%", y: "80%", s: 3, d: 12 },
    { x: "45%", y: "12%", s: 4, d: 6 },
    { x: "55%", y: "88%", s: 3, d: 14 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* 深色背景层 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 38%, ${theme.background.darkAlt} 0%, ${theme.background.dark} 50%, #050508 100%)`,
          opacity: bgOpacity,
        }}
      />

      {/* 中央 Orb 光晕 */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(98,91,255,0.2) 0%, rgba(98,91,255,0.06) 35%, transparent 65%)",
          opacity: bgOpacity,
          pointerEvents: "none",
        }}
      />

      {/* 背景静态粒子 */}
      {bgParticles.map((p, i) => {
        const sparkle = Math.sin((localFrame + p.d) / 30 * Math.PI * 2 * 0.6) * 0.5 + 0.5;
        return (
          <div
            key={`bg-${i}`}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              backgroundColor: theme.orb.particle,
              opacity: bgOpacity * sparkle * 0.5,
            }}
          />
        );
      })}

      {/* Orb 分析器 */}
      <div style={{ marginBottom: 60, opacity: bgOpacity }}>
        <OrbAnalyzer
          start={75}
          progressStart={80}
          progressDuration={120}
          textLines={texts}
          textDisplayFrames={36}
        />
      </div>

      {/* 分析文案 */}
      <div
        style={{
          fontSize: 18,
          color: theme.text.inverse,
          fontWeight: 500,
          opacity: currentOpacity * bgOpacity,
          textAlign: "center",
          marginBottom: 45,
          letterSpacing: 0.8,
          height: 28,
          display: "flex",
          alignItems: "center",
        }}
      >
        {texts[currentIdx]}
      </div>

      {/* Skeleton 暗色玻璃报告卡 */}
      <div
        style={{
          width: 280,
          padding: 24,
          borderRadius: 18,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          opacity: skeletonOpacity * bgOpacity,
        }}
      >
        {[100, 72, 55, 82, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: 10,
              backgroundColor: "rgba(255,255,255,0.07)",
              borderRadius: 5,
              marginBottom: i < 4 ? 14 : 0,
              width: `${w}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Scene03Analyzing;
