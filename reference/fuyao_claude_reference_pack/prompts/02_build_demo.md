现在开始实现 6 秒质感样片。

请新增一个 Remotion Composition：
- ID：FuyaoDemo
- 尺寸：1080x1920
- 帧率：30fps
- 总时长：180 frames

样片结构：

0-36 frames：Hero Phone Intro
- 浅色柔光背景。
- 手机 mockup 从下方进入，带 rotateZ、rotateY、scale。
- 手机内展示 `user_ui_references/01_home_hero.jpg`。
- 浮动学习图标缓慢漂浮。
- 标题：测出你的弱科人格画像。

36-78 frames：Question Flow
- 切到 `02_question_empty.jpg`。
- 选项卡片 stagger 出现。
- 进度条从 0 到 1/24。
- 文案：24 道题，识别你的失分行为模式。

78-126 frames：Dark AI Analyzer
- 深色背景。
- OrbAnalyzer 代码重建，不要只用截图。
- 圆环旋转，粒子环绕，进度条增长。
- 文案轮换：正在分析你的失分模式... / 正在匹配弱科人格...

126-180 frames：Result Reveal
- 背景回到浅蓝紫。
- 展示 `10_result_hero.jpg` 或重建结果页。
- 标题：表达掉线型。
- 渐变文字、icon 景深、按钮依次出现。

技术要求：
1. 使用 Remotion + React + TypeScript。
2. 使用 Sequence、useCurrentFrame、interpolate、spring。
3. 所有时间点放到 `src/motion/timeline.ts`。
4. 所有颜色放到 `src/styles/theme.ts`。
5. 所有素材路径放到 `src/assets/assets.ts`。
6. 不要使用随机不可复现动画。
7. 保证 `npm run dev` 可运行。
8. 完成后告诉我如何预览 FuyaoDemo。
