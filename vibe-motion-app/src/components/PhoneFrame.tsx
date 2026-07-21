import React from "react";
import { theme } from "../styles/theme";

interface PhoneFrameProps {
  children: React.ReactNode;
  rotateZ?: number;
  rotateY?: number;
  scale?: number;
  shadowIntensity?: number;
  style?: React.CSSProperties;
}

/**
 * iPhone Mockup 组件
 * 提供黑色 iPhone 边框和 Dynamic Island
 * 支持 3D 倾斜变换（rotateZ / rotateY），带透视
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  rotateZ = 0,
  rotateY = 0,
  scale = 1,
  shadowIntensity = 1,
  style = {},
}) => {
  const phoneWidth = 340;
  const phoneHeight = 680;
  const islandWidth = 120;
  const islandHeight = 28;
  const borderRadius = 44;

  return (
    <div
      style={{
        // 3D 透视容器
        perspective: 1200,
        perspectiveOrigin: "center center",
        width: phoneWidth,
        height: phoneHeight,
        ...style,
      }}
    >
      {/* 3D 变换层 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `
            scale(${scale})
            rotateZ(${rotateZ}deg)
            rotateY(${rotateY}deg)
          `,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 手机外框 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: theme.phone.frame,
            borderRadius: borderRadius,
            boxShadow: [
              // 主投影
              `0 ${40 * shadowIntensity}px ${80 * shadowIntensity}px rgba(0, 0, 0, ${0.35 * shadowIntensity})`,
              // 近地投影（增强立体感）
              `0 ${15 * shadowIntensity}px ${30 * shadowIntensity}px rgba(0, 0, 0, ${0.2 * shadowIntensity})`,
              // 内框高光
              `inset 0 0 0 1px rgba(255, 255, 255, 0.08)`,
            ].join(", "),
            overflow: "hidden",
          }}
        >
          {/* 屏幕区域 */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 8,
              right: 8,
              bottom: 12,
              backgroundColor: "#000",
              borderRadius: borderRadius - 8,
              overflow: "hidden",
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: islandWidth,
                height: islandHeight,
                backgroundColor: theme.phone.island,
                borderRadius: islandHeight / 2,
                zIndex: 10,
              }}
            />

            {/* 前置摄像头（Dynamic Island 右侧小点） */}
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 96,
                width: 7,
                height: 7,
                backgroundColor: "#1a1a1a",
                borderRadius: "50%",
                zIndex: 11,
                boxShadow: "0 0 2px rgba(0,0,0,0.5)",
              }}
            />

            {/* 内容区域 */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                borderRadius: borderRadius - 8,
              }}
            >
              {children}
            </div>
          </div>

          {/* 侧边按键（装饰） */}
          <div
            style={{
              position: "absolute",
              right: -3,
              top: 120,
              width: 3,
              height: 30,
              backgroundColor: theme.phone.bezel,
              borderRadius: "0 2px 2px 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: -3,
              top: 170,
              width: 3,
              height: 50,
              backgroundColor: theme.phone.bezel,
              borderRadius: "0 2px 2px 0",
            }}
          />
          {/* 左侧按键 */}
          <div
            style={{
              position: "absolute",
              left: -3,
              top: 130,
              width: 3,
              height: 25,
              backgroundColor: theme.phone.bezel,
              borderRadius: "2px 0 0 2px",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -3,
              top: 165,
              width: 3,
              height: 40,
              backgroundColor: theme.phone.bezel,
              borderRadius: "2px 0 0 2px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
