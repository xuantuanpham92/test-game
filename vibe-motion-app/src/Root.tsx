import { Composition } from "remotion";
import { FuyaoDemo } from "./compositions/FuyaoDemo";

/**
 * 根组件 - 注册所有 Composition
 */
export const Root: React.FC = () => {
  return (
    <>
      {/* 扶摇弱科人格测试 - 6秒样片 */}
      <Composition
        id="FuyaoDemo"
        component={FuyaoDemo}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
