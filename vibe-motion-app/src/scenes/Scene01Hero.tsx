import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";
import PhoneFrame from "../components/PhoneFrame";
import FloatingStudyIcons from "../components/FloatingStudyIcons";
import GradientText from "../components/GradientText";
import PrimaryButton from "../components/PrimaryButton";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/**
 * Scene 1: Hero 首页 Hook (0-38 帧本地)
 *
 * 质感要点:
 * - 三层柔光背景（紫色顶光 + 粉色侧光 + 白色底光）
 * - iPhone 从下方升入，带 rotateX/rotateY/rotateZ 三轴 3D
 * - 浮动学习图标缓慢漂移
 * - 渐变标题从左到右展开
 * - 按钮弹性上浮 + 发光投影
 */
export const Scene01Hero: React.FC = () => {
  const frame = useCurrentFrame();

  // ====== 手机 3D 入场 (spring) ======
  const phoneSpring = spring({
    frame,
    fps: 30,
    config: { damping: 180, stiffness: 160, mass: 0.85 },
  });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.78, 0.9]);
  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);
  const phoneRotateZ = interpolate(phoneSpring, [0, 1], [-7, -2]);
  const phoneRotateX = interpolate(phoneSpring, [0, 1], [8, -2]);
  const phoneOpacity = interpolate(frame, [0, 14], [0, 1], CLAMP);

  // ====== 底部文案 stagger ======
  const titleOpacity = interpolate(frame, [15, 30], [0, 1], CLAMP);
  const titleY = interpolate(frame, [15, 30], [24, 0], CLAMP);

  const subtitleOpacity = interpolate(frame, [22, 36], [0, 1], CLAMP);

  const btnOpacity = interpolate(frame, [27, 40], [0, 1], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* ====== 多层柔光背景 ====== */}
      {/* 紫色顶光 */}
      <div
        style={{
          position: "absolute",
          top: -160,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(98,91,255,0.22) 0%, rgba(98,91,255,0.08) 35%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* 粉色侧光 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: -140,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240,68,165,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* 底部暖光 */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(98,91,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ====== 浮动学习图标 ====== */}
      <FloatingStudyIcons opacity={phoneOpacity} />

      {/* ====== 手机主体 ====== */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          marginTop: -70,
          opacity: phoneOpacity,
        }}
      >
        <div
          style={{
            transform: `
              translateY(${phoneY}px)
              scale(${phoneScale})
              rotateZ(${phoneRotateZ}deg)
              rotateX(${phoneRotateX}deg)
            `,
            transformStyle: "preserve-3d",
          }}
        >
          <PhoneFrame rotateZ={-2} rotateY={-5} scale={0.9} shadowIntensity={1.1}>
            {/* 手机内首页内容 */}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 50,
              }}
            >
              {/* App Logo */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: theme.brand.gradient,
                  marginBottom: 16,
                  boxShadow: "0 8px 28px rgba(98,91,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 24 }}>🧠</span>
              </div>

              {/* 品牌名 */}
              <div style={{
                fontSize: 11,
                color: theme.text.secondary,
                marginBottom: 12,
                letterSpacing: 1.5,
                fontWeight: 500,
              }}>
                扶摇弱科人格测试
              </div>

              {/* Hook */}
              <div style={{
                fontSize: 20,
                fontWeight: 700,
                color: theme.text.primary,
                textAlign: "center",
                padding: "0 26px",
                marginBottom: 16,
                lineHeight: 1.4,
              }}>
                测出你的弱科人格画像
              </div>

              {/* 功能标签 */}
              <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
                {["24题", "3分钟", "AI驱动"].map((tag) => (
                  <div
                    key={tag}
                    style={{
                      padding: "5px 12px",
                      backgroundColor: theme.background.lightAlt,
                      borderRadius: 20,
                      fontSize: 11,
                      color: theme.brand.primary,
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>

              {/* 模拟首页卡片列表 */}
              <div style={{ flex: 1, width: "100%", padding: "0 16px" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: theme.background.lightAlt,
                      borderRadius: 14,
                      padding: 15,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{
                      width: `${55 + i * 12}%`, height: 10,
                      backgroundColor: "#E0E3F0", borderRadius: 5, marginBottom: 8,
                    }} />
                    <div style={{
                      width: `${75 - i * 8}%`, height: 8,
                      backgroundColor: "#E8EBF5", borderRadius: 4,
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>

      {/* ====== 底部文案区 ====== */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* 渐变主标题 */}
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <GradientText start={17} duration={24}>
            <span style={{ fontSize: 35, fontWeight: 800, letterSpacing: 1 }}>
              测出你的弱科人格画像
            </span>
          </GradientText>
        </div>

        {/* 副标题 */}
        <div style={{
          fontSize: 15,
          color: theme.text.secondary,
          opacity: subtitleOpacity,
          letterSpacing: 0.5,
        }}>
          24题 × 3分钟 × AI驱动
        </div>

        {/* CTA 按钮 */}
        <div style={{ opacity: btnOpacity, marginTop: 4 }}>
          <PrimaryButton start={29} duration={16} yOffset={20}>
            开始测试 · 免费生成画像
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Scene01Hero;
