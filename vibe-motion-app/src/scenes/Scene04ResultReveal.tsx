import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";
import GradientText from "../components/GradientText";
import PrimaryButton from "../components/PrimaryButton";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/**
 * Scene 4: 结果揭晓页 (本地帧 0-60)
 *
 * 质感要点:
 * - 背景从深色 burst 到浅蓝紫柔光（模拟 AI 分析完成的揭晓感）
 * - 景深 icon: 2 个模糊副本（后层 + 中层）+ 1 清晰主体
 * - Icon 从 blur + scale(0.8) reveal → bounce 弹跳
 * - 副标题从上方滑入
 * - 渐变主标题 "表达掉线型" 从左到右展开
 * - 描述文字延迟淡入
 * - 按钮 stagger 从下方浮入
 */
export const Scene04ResultReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - 123);

  // ====== 背景 burst（从暗到亮） ======
  const bgOpacity = interpolate(localFrame, [0, 20], [0, 1], CLAMP);
  const bgBurstScale = interpolate(localFrame, [0, 25], [0.3, 1], CLAMP);

  // ====== Icon 景深三层 ======
  // 后层: 最模糊, 最先出现
  const backBlur = interpolate(localFrame, [6, 28], [22, 6], CLAMP);
  const backOpacity = interpolate(localFrame, [6, 22], [0, 0.18], CLAMP);

  // 中层: 中等模糊
  const midBlur = interpolate(localFrame, [10, 32], [14, 3.5], CLAMP);
  const midOpacity = interpolate(localFrame, [10, 26], [0, 0.32], CLAMP);

  // 主层: 清晰, 从模糊 reveal
  const mainBlurInit = interpolate(localFrame, [14, 32], [10, 0], CLAMP);
  const mainOpacity = interpolate(localFrame, [14, 32], [0, 1], CLAMP);
  const mainScale = interpolate(localFrame, [14, 32], [0.75, 1], CLAMP);

  // Icon bounce
  const bounceSpring = spring({
    frame: localFrame - 28,
    fps: 30,
    config: { damping: 80, stiffness: 220, mass: 0.7 },
  });
  const bounceScale = interpolate(bounceSpring, [0, 0.3, 1], [1, 1.15, 1]);

  // ====== 文字层 ======
  const subtitleOpacity = interpolate(localFrame, [20, 38], [0, 1], CLAMP);
  const subtitleY = interpolate(localFrame, [20, 38], [18, 0], CLAMP);

  const titleOpacity = interpolate(localFrame, [28, 46], [0, 1], CLAMP);

  const descOpacity = interpolate(localFrame, [38, 54], [0, 1], CLAMP);

  // ====== 按钮 ======
  const btn1Opacity = interpolate(localFrame, [44, 58], [0, 1], CLAMP);
  const btn2Opacity = interpolate(localFrame, [49, 63], [0, 1], CLAMP);

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
      {/* 背景层 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 35%, ${theme.background.lightAlt} 0%, ${theme.background.light} 45%, ${theme.background.pure} 100%)`,
          opacity: bgOpacity,
        }}
      />

      {/* 中央 burst 光晕 */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${bgBurstScale})`,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(98,91,255,0.2) 0%, rgba(240,68,165,0.08) 40%, transparent 70%)",
          opacity: bgOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ====== Icon 景深区 ====== */}
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 30 }}>
        {/* 模糊后层 */}
        <div
          style={{
            position: "absolute",
            inset: -18,
            fontSize: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: `blur(${backBlur}px)`,
            opacity: backOpacity,
            transform: `scale(0.9)`,
          }}
        >
          🧠
        </div>
        {/* 模糊中层 */}
        <div
          style={{
            position: "absolute",
            inset: -9,
            fontSize: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: `blur(${midBlur}px)`,
            opacity: midOpacity,
            transform: `scale(0.95)`,
          }}
        >
          🧠
        </div>
        {/* 清晰主层 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontSize: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            filter: `blur(${mainBlurInit}px)`,
            opacity: mainOpacity,
            transform: `scale(${mainScale * bounceScale})`,
          }}
        >
          <span style={{ filter: "drop-shadow(0 8px 28px rgba(98,91,255,0.35))" }}>
            🧠
          </span>
        </div>
      </div>

      {/* 副标题 */}
      <div
        style={{
          fontSize: 16,
          color: theme.text.secondary,
          marginBottom: 6,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontWeight: 500,
          letterSpacing: 2,
        }}
      >
        你的弱科人格
      </div>

      {/* 渐变主标题 */}
      <div style={{ marginBottom: 20, opacity: titleOpacity }}>
        <GradientText start={135} duration={28}>
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: 3 }}>
            表达掉线型
          </span>
        </GradientText>
      </div>

      {/* 描述 */}
      <div
        style={{
          fontSize: 15,
          color: theme.text.secondary,
          textAlign: "center",
          lineHeight: 1.8,
          padding: "0 52px",
          marginBottom: 48,
          opacity: descOpacity,
          maxWidth: 360,
        }}
      >
        你的脑子里有答案，但卷面没有把它完整表达出来。
      </div>

      {/* 按钮组 */}
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ opacity: btn1Opacity }}>
          <PrimaryButton variant="primary" start={168} duration={16} yOffset={16}>
            保存报告
          </PrimaryButton>
        </div>
        <div style={{ opacity: btn2Opacity }}>
          <PrimaryButton variant="secondary" start={173} duration={16} yOffset={16}>
            分享报告
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Scene04ResultReveal;
