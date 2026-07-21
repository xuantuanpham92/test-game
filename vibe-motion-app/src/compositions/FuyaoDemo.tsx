import React from "react";
import { Sequence, useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";
import Scene01Hero from "../scenes/Scene01Hero";
import Scene02Question from "../scenes/Scene02Question";
import Scene03Analyzing from "../scenes/Scene03Analyzing";
import Scene04ResultReveal from "../scenes/Scene04ResultReveal";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/**
 * 扶摇弱科人格测试 - 6秒质感样片
 * 总帧数：180帧 @ 30fps = 6秒
 *
 * Sequence 有 3f 转场重叠:
 * - Scene 1: 0-38   (0.00-1.27s) Hero Phone Intro
 * - Scene 2: 36-78  (1.20-2.60s) Question Flow
 * - Scene 3: 75-128 (2.50-4.27s) Dark AI Analyzer
 * - Scene 4: 126-180(4.20-6.00s) Result Reveal
 */
export const FuyaoDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // ====== 转场交叉淡入淡出参数 ======
  // 每个转场 6 帧: 前半段旧场景 blur 增加, 后半段新场景淡入

  // Scene 1→2 (frame 33-39)
  const s1FadeOut = interpolate(frame, [34, 39], [1, 0], CLAMP);
  const s2FadeIn = interpolate(frame, [34, 39], [0, 1], CLAMP);
  const s1s2Blur = interpolate(frame, [34, 39], [0, 8], CLAMP);

  // Scene 2→3 (frame 72-78) — 浅色→深色，更大 blur
  const s2FadeOut = interpolate(frame, [72, 78], [1, 0], CLAMP);
  const s3FadeIn = interpolate(frame, [72, 78], [0, 1], CLAMP);
  const s2s3Blur = interpolate(frame, [72, 78], [0, 12], CLAMP);

  // Scene 3→4 (frame 123-129) — 深色→浅色
  const s3FadeOut = interpolate(frame, [123, 129], [1, 0], CLAMP);
  const s4FadeIn = interpolate(frame, [123, 129], [0, 1], CLAMP);
  const s3s4Blur = interpolate(frame, [123, 129], [0, 8], CLAMP);

  // ====== 全局背景层（底层，持续渲染） ======
  const getBgGradient = (): string => {
    if (frame < 75) {
      return `radial-gradient(ellipse at 50% 20%, ${theme.background.lightAlt} 0%, ${theme.background.light} 40%, ${theme.background.pure} 100%)`;
    } else if (frame < 126) {
      return `radial-gradient(ellipse at 50% 40%, ${theme.background.darkAlt} 0%, ${theme.background.dark} 55%, #050508 100%)`;
    } else {
      return `radial-gradient(ellipse at 50% 25%, ${theme.background.lightAlt} 0%, ${theme.background.light} 40%, ${theme.background.pure} 100%)`;
    }
  };

  // ====== 计算当前场景的模糊和透明度覆盖 ======
  let sceneOverlay: { blur: number; opacity: number } = { blur: 0, opacity: 0 };

  if (frame >= 34 && frame <= 39) {
    sceneOverlay = { blur: s1s2Blur, opacity: 0.3 };
  } else if (frame >= 72 && frame <= 78) {
    sceneOverlay = { blur: s2s3Blur, opacity: 0.4 };
  } else if (frame >= 123 && frame <= 129) {
    sceneOverlay = { blur: s3s4Blur, opacity: 0.25 };
  }

  // 场景整体透明度（Scene 级别的 Sequence 交叉淡入淡出）
  const getSceneOpacity = (sceneNum: number): number => {
    if (sceneNum === 1) return frame < 34 ? 1 : s1FadeOut;
    if (sceneNum === 2) return frame < 34 ? 0 : frame < 72 ? s2FadeIn : s2FadeOut;
    if (sceneNum === 3) return frame < 72 ? 0 : frame < 123 ? s3FadeIn : s3FadeOut;
    if (sceneNum === 4) return frame < 123 ? 0 : s4FadeIn;
    return 1;
  };

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: getBgGradient(),
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ====== 转场模糊覆盖层 ====== */}
      {sceneOverlay.blur > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 90,
            backdropFilter: `blur(${sceneOverlay.blur}px)`,
            WebkitBackdropFilter: `blur(${sceneOverlay.blur}px)`,
            opacity: sceneOverlay.opacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Scene 1: Hero */}
      <div style={{ opacity: getSceneOpacity(1) }}>
        <Sequence from={0} durationInFrames={45}>
          <Scene01Hero />
        </Sequence>
      </div>

      {/* Scene 2: Question */}
      <div style={{ opacity: getSceneOpacity(2) }}>
        <Sequence from={34} durationInFrames={50}>
          <Scene02Question />
        </Sequence>
      </div>

      {/* Scene 3: AI Analyzer */}
      <div style={{ opacity: getSceneOpacity(3) }}>
        <Sequence from={72} durationInFrames={60}>
          <Scene03Analyzing />
        </Sequence>
      </div>

      {/* Scene 4: Result */}
      <div style={{ opacity: getSceneOpacity(4) }}>
        <Sequence from={123} durationInFrames={60}>
          <Scene04ResultReveal />
        </Sequence>
      </div>
    </div>
  );
};

export default FuyaoDemo;
