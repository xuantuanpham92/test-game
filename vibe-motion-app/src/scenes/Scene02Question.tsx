import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";
import PhoneFrame from "../components/PhoneFrame";
import QuestionCard from "../components/QuestionCard";
import OptionCard from "../components/OptionCard";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/**
 * Scene 2: 答题页 (本地帧 0-50)
 *
 * 质感要点:
 * - 手机轻微持续推近 (scale 0.9→0.94)
 * - 题目卡片从左侧滑入
 * - 4 个选项 stagger 从右侧滑入 + 淡入
 * - 选中 A 项: 紫色描边 + 外发光 + scale bounce
 * - 进度条真实增长到 1/24
 * - 底部文案淡入
 */
export const Scene02Question: React.FC = () => {
  const frame = useCurrentFrame();
  // 注意: 这个 scene 的 frame 从 Sequence from 开始
  // 但 useCurrentFrame 返回的是全局帧，需要转换
  // Scene02 的 Sequence from=34, 所以本地帧 = frame - 34
  const localFrame = Math.max(0, frame - 34);

  // 手机推近
  const phoneScale = interpolate(localFrame, [0, 35], [0.9, 0.94], CLAMP);
  const phoneRotateY = interpolate(localFrame, [0, 35], [-5, -2], CLAMP);

  // 底部文案
  const captionOpacity = interpolate(localFrame, [18, 32], [0, 1], CLAMP);

  const questionText = "你在考试中遇到难题时，通常会？";
  const options = [
    { label: "A", text: "反复尝试，直到做出来" },
    { label: "B", text: "先看答案解析再练习" },
    { label: "C", text: "先跳过，最后再做" },
    { label: "D", text: "直接问老师或同学" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* 顶部柔光 */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 450,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(98,91,255,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 手机 */}
      <div
        style={{
          transform: `scale(${phoneScale}) rotateY(${phoneRotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <PhoneFrame rotateZ={-2} rotateY={-2} scale={0.92}>
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#FFFFFF",
              position: "relative",
            }}
          >
            {/* 题卡 + 进度条 */}
            <QuestionCard
              questionNumber={1}
              totalQuestions={24}
              question={questionText}
              start={34}
            />

            {/* 选项列表 */}
            <div style={{ position: "absolute", top: 185, left: 16, right: 16 }}>
              {options.map((option, index) => (
                <OptionCard
                  key={option.label}
                  label={option.label}
                  text={option.text}
                  index={index}
                  baseStart={40}
                  staggerGap={7}
                  isSelected={index === 0}
                  selectedStart={56}
                />
              ))}
            </div>

            {/* home indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 55,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: interpolate(localFrame, [20, 32], [0, 0.45], CLAMP),
              }}
            >
              <div style={{
                width: 36, height: 4,
                backgroundColor: theme.border.subtle, borderRadius: 2,
              }} />
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* 底部文案 */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 16,
          color: theme.text.secondary,
          fontWeight: 500,
          opacity: captionOpacity,
          letterSpacing: 0.5,
        }}
      >
        24 道题，识别你的失分行为模式
      </div>
    </div>
  );
};

export default Scene02Question;
