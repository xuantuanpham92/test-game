import { registerRoot } from "remotion";
import { Root } from "../src/Root";

const RemotionRoot: React.FC = () => {
  return <Root />;
};

registerRoot(RemotionRoot);
