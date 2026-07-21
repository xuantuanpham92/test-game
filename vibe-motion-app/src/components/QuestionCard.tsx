import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { theme } from "../styles/theme";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  start?: number;
}

/**
 * 答题卡片组件
 * 包含题号、进度条、题目内容
 * 入场：spring + 从左侧滑入
 */
export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  totalQuestions,
  question,
  start = 0,
}) => {
  const frame = useCurrentFrame();

  // 卡片弹簧入场
  const cardProgress = spring({
    frame: frame - start,
    fps: 30,
    config: { damping: 200, stiffness: 180, mass: 0.9 },
  });
  const opacity = interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });
  const translateX = interpolate(cardProgress, [0, 1], [-30, 0]);
  const translateY = interpolate(cardProgress, [0, 1], [10, 0]);

  // 进度
  const progressValue = questionNumber / totalQuestions;

  // 进度条宽度动画
  const barWidth = interpolate(frame, [start, start + 15], [0, progressValue * 100], {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.background.pure,
        padding: "55px 20px 30px",
        opacity,
        transform: `translateX(${translateX}px) translateY(${translateY}px)`,
      }}
    >
      {/* 题号 */}
      <div
        style={{
          fontSize: 13,
          color: theme.text.muted,
          marginBottom: 10,
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        第 {questionNumber} / {totalQuestions} 题
      </div>

      {/* 进度条 */}
      <div
        style={{
          width: "100%",
          height: 4,
          backgroundColor: theme.progress.track,
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: theme.brand.gradient,
            borderRadius: 2,
          }}
        />
      </div>

      {/* 题目 */}
      <div
        style={{
          fontSize: 19,
          fontWeight: 600,
          color: theme.text.primary,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        {question}
      </div>
    </div>
  );
};

export default QuestionCard;
