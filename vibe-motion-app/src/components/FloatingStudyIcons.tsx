import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const Extrapolation = {
  CLAMP: "clamp" as const,
  EXTEND: "extend" as const,
  IDENTITY: "identity" as const,
};

interface FloatingStudyIconsProps {
  opacity?: number;
}

interface IconConfig {
  key: string;
  svgContent: string;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  floatSpeed: number;
  floatAmplitude: number;
  rotateRange: number;
}

/**
 * 浮动学习元素组件
 * 包含尺子、算盘、图表、叉号、对号等学习相关图标
 * 使用 sin/cos 固定驱动，非随机，保证每次渲染一致
 */
export const FloatingStudyIcons: React.FC<FloatingStudyIconsProps> = ({
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  const icons: IconConfig[] = [
    {
      key: "ruler",
      svgContent: `<svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="76" height="16" rx="2" fill="#E8E5FF" stroke="#625BFF" stroke-width="1.5"/>
        <line x1="10" y1="4" x2="10" y2="20" stroke="#625BFF" stroke-width="1"/>
        <line x1="20" y1="8" x2="20" y2="20" stroke="#625BFF" stroke-width="1"/>
        <line x1="30" y1="4" x2="30" y2="20" stroke="#625BFF" stroke-width="1"/>
        <line x1="40" y1="8" x2="40" y2="20" stroke="#625BFF" stroke-width="1"/>
        <line x1="50" y1="4" x2="50" y2="20" stroke="#625BFF" stroke-width="1"/>
        <line x1="60" y1="8" x2="60" y2="20" stroke="#625BFF" stroke-width="1"/>
        <line x1="70" y1="4" x2="70" y2="20" stroke="#625BFF" stroke-width="1"/>
      </svg>`,
      width: 80,
      height: 24,
      initialX: 60,
      initialY: 160,
      floatSpeed: 0.035,
      floatAmplitude: 14,
      rotateRange: 5,
    },
    {
      key: "abacus",
      svgContent: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="40" height="32" rx="4" fill="#FFF5E8" stroke="#F044A5" stroke-width="1.5"/>
        <line x1="4" y1="16" x2="44" y2="16" stroke="#F044A5" stroke-width="1.5"/>
        <line x1="4" y1="24" x2="44" y2="24" stroke="#F044A5" stroke-width="1.5"/>
        <line x1="4" y1="32" x2="44" y2="32" stroke="#F044A5" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="3" fill="#F044A5"/>
        <circle cx="24" cy="12" r="3" fill="#F044A5"/>
        <circle cx="36" cy="12" r="3" fill="#F044A5"/>
        <circle cx="18" cy="20" r="3" fill="#F044A5"/>
        <circle cx="30" cy="20" r="3" fill="#F044A5"/>
        <circle cx="12" cy="28" r="3" fill="#F044A5"/>
        <circle cx="24" cy="28" r="3" fill="#F044A5"/>
        <circle cx="36" cy="28" r="3" fill="#F044A5"/>
      </svg>`,
      width: 48,
      height: 48,
      initialX: 760,
      initialY: 120,
      floatSpeed: 0.04,
      floatAmplitude: 18,
      rotateRange: 8,
    },
    {
      key: "brain",
      svgContent: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44Z" fill="#EEF2FF" stroke="#625BFF" stroke-width="1.5"/>
        <path d="M16 18C16 18 20 14 24 14C28 14 32 18 32 18" stroke="#625BFF" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 24C12 24 16 20 24 20C32 20 36 24 36 24" stroke="#625BFF" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M14 30C14 30 18 26 24 26C30 26 34 30 34 30" stroke="#625BFF" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="18" cy="18" r="2" fill="#F044A5"/>
        <circle cx="30" cy="22" r="2" fill="#F044A5"/>
        <circle cx="22" cy="28" r="2" fill="#F044A5"/>
      </svg>`,
      width: 48,
      height: 48,
      initialX: 820,
      initialY: 280,
      floatSpeed: 0.03,
      floatAmplitude: 16,
      rotateRange: 4,
    },
    {
      key: "chart",
      svgContent: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="40" height="40" rx="4" fill="#E8FFF0" stroke="#22C55E" stroke-width="1.5"/>
        <rect x="10" y="28" width="6" height="12" rx="1" fill="#22C55E"/>
        <rect x="21" y="20" width="6" height="20" rx="1" fill="#22C55E"/>
        <rect x="32" y="12" width="6" height="28" rx="1" fill="#22C55E"/>
      </svg>`,
      width: 48,
      height: 48,
      initialX: 100,
      initialY: 380,
      floatSpeed: 0.045,
      floatAmplitude: 12,
      rotateRange: 6,
    },
    {
      key: "cross",
      svgContent: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill="#FEE2E2" stroke="#EF4444" stroke-width="1.5"/>
        <path d="M13 13L27 27M27 13L13 27" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
      width: 40,
      height: 40,
      initialX: 850,
      initialY: 450,
      floatSpeed: 0.05,
      floatAmplitude: 15,
      rotateRange: 10,
    },
    {
      key: "check",
      svgContent: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" fill="#DCFCE7" stroke="#22C55E" stroke-width="1.5"/>
        <path d="M12 20L17 25L28 14" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      width: 40,
      height: 40,
      initialX: 70,
      initialY: 500,
      floatSpeed: 0.038,
      floatAmplitude: 13,
      rotateRange: 7,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {icons.map((icon, index) => {
        // sin/cos 驱动的浮动，非随机，完全可复现
        const t = frame / 30; // 秒为单位
        const phase = index * 1.3;
        const floatY =
          Math.sin(t * Math.PI * 2 * icon.floatSpeed + phase) *
          icon.floatAmplitude;
        const floatX =
          Math.cos(t * Math.PI * 2 * icon.floatSpeed * 0.7 + phase) *
          icon.floatAmplitude *
          0.5;
        const rotate =
          Math.sin(t * Math.PI * 2 * icon.floatSpeed * 0.5 + phase) *
          icon.rotateRange;

        // 淡入 stagger
        const iconOpacity = interpolate(
          frame,
          [0 + index * 8, 20 + index * 8],
          [0, 0.75],
          {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          }
        );

        return (
          <div
            key={icon.key}
            style={{
              position: "absolute",
              left: icon.initialX,
              top: icon.initialY,
              transform: `
                translateY(${floatY}px)
                translateX(${floatX}px)
                rotate(${rotate}deg)
              `,
              opacity: iconOpacity,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))",
            }}
          >
            <img
              src={`data:image/svg+xml,${encodeURIComponent(icon.svgContent)}`}
              width={icon.width}
              height={icon.height}
              alt={icon.key}
              style={{ display: "block" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingStudyIcons;
