# Motion Lock Spec — 复刻原视频风格，但替换为扶摇产品

## 目标

不是做普通录屏，也不是 PPT 翻页。目标是复刻原视频的“产品展示合成片”感觉：
- iPhone / 手机 mockup 作为核心容器
- 轻 3D 倾斜与镜头推进
- 浅色背景 + 柔光 + 景深模糊
- UI 截图被放入手机屏幕或产品展示容器
- 关键产品元素从手机中“浮出”或被单独放大展示
- 中段有一个深色 AI 分析 / loading 场景
- 结尾使用深色背景 + 搜索框 / CTA 收束

## 原视频风格锁定

### 画幅
- 原视频比例近似 3:4，但扶摇宣传投放建议使用 9:16。
- 输出：1080x1920，30fps。
- 仍然保留原视频的中心构图、产品居中、上下留白和轻微镜头推进。

### 背景
- 原视频前半段：白色 / 浅灰 / 淡米色渐变背景。
- 背景不纯白，带轻微柔光、模糊和空间感。
- 扶摇替换为：#F7F8FF / #EEF2FF / #FFFFFF / 淡紫蓝径向光。

### 主体
- 原视频大量使用黑色 iPhone 边框和 Dynamic Island。
- 手机不是完全正面，经常有 rotateZ / rotateY 倾斜。
- 扶摇也必须使用 PhoneFrame，不允许直接全屏平铺截图。

### 镜头运动
- 常用运动：slow push in、轻微 tilt、scale 0.96 -> 1.04、rotateZ -5deg -> 0deg。
- 转场多用 opacity + blur + scale，不要硬切。

### 景深
- 前景清晰，背景或后景有 blur。
- 关键 icon / 卡片可以有一个清晰主层 + 两个模糊复制层。

### 文字
- 原视频文字少，主要依赖画面展示。
- 扶摇视频每幕最多一句主文案，不要堆报告原文。

### 节奏
- 每 1.5-3 秒切换一个画面重点。
- 0-2s 建立产品感。
- 2-7s 展示流程。
- 7-11s 分析 loading。
- 11-15s 结果揭晓。
- 15-18s 报告价值 + CTA。

## 扶摇内容替换原则

| 原视频元素 | 扶摇替换 |
|---|---|
| 食物记录 App 首页 | 扶摇首页 Hook：测出你的弱科人格画像 |
| 食物详情页 | 答题页 / 选项页 |
| AI 识别 / 识别中 | 正在分析你的失分模式 / 匹配弱科人格 |
| 食物列表滚动 | 测试题推进 / 报告页滚动 |
| 食物 item 单独浮出 | 弱科人格 icon / 表达掉线型结果浮出 |
| 营养/体重/饮水类数据 | 八维学习能力画像 / 诊断分析 / 七天计划 |
| 深色结尾搜索框 | 扶摇 CTA：myfuyao.top / 立即免费测试 |

## 必须实现的核心镜头

### Scene 01 — Hero Phone Intro
- 浅色背景。
- PhoneFrame 从画面下方进入，轻微 rotateZ 和 rotateY。
- 手机中显示 `01_home_hero.jpg` 或重建的首页 Hero。
- 浮动学习元素：尺子、算盘、数字、图表、叉号，缓慢漂浮。
- 文案：测出你的弱科人格画像。

### Scene 02 — Question Flow
- 手机屏幕切到 `02_question_empty.jpg`。
- 题卡从右侧微滑入。
- 选项 A/B/C/D stagger 出现。
- 进度条从 0 到 1/24。

### Scene 03 — Answer Selection
- 使用 `03_question_selected_a.jpg` 和 `05_question_selected_b.jpg`。
- 选中卡片描边发光，scale 1 -> 1.025 -> 1。
- 题号快速推进，模拟用户持续答题。

### Scene 04 — Dark AI Analyzer
- 深蓝黑背景。
- Orb 代码重建：中心圆点、双圆环、粒子环绕、进度条。
- 文案轮换：
  1. 正在分析你的失分模式...
  2. 正在匹配弱科人格...
  3. 正在生成能力画像...
  4. 正在定位最该优先提升的能力...
- 报告 skeleton card 轻微呼吸。

### Scene 05 — Result Reveal
- 背景从深色回到浅蓝紫柔光。
- 展示 `10_result_hero.jpg` 或重建结果页。
- 标题：表达掉线型。
- 渐变文字 #625BFF -> #F044A5。
- icon 以景深方式出现：后方两个模糊副本，前方清晰主 icon。

### Scene 06 — Report Scroll
- 展示 `11_personality_analysis.jpg`、`12_radar_scores.jpg`、`13_diagnosis_summary.jpg`、`16_seven_day_plan.jpg`、`17_training_advice.jpg`。
- 长报告不是普通滚屏，需要放进产品容器，进入画面时局部提亮。
- 关键词高亮：表达规范性、压轴拆解力、复盘转化力、七天提升计划。

### Scene 07 — Dark CTA End
- 复刻原视频结尾深色搜索框感觉。
- 深色背景上方：扶摇弱科人格测试。
- 中间搜索框 / 输入框样式：myfuyao.top 或 “搜索 扶摇弱科人格测试”。
- 主文案：3 分钟，生成你的弱科人格画像。
- CTA：24 题免费测。

## 技术约束

- 使用 Remotion + React + TypeScript。
- 使用 Sequence 组织镜头。
- 使用 useCurrentFrame、interpolate、spring。
- 不允许随机不可复现动画；粒子必须用固定数组。
- 所有时间点集中到 `src/motion/timeline.ts`。
- 所有品牌视觉 token 集中到 `src/styles/theme.ts`。
- 所有参考素材集中到 `src/assets/assets.ts`。
- 先完成 6 秒 demo，再扩展完整版。

## 验收标准

1. 看起来像产品合成片，不像录屏。
2. 有手机 mockup 和轻 3D 倾斜。
3. 有浅色柔光背景和深色分析页对比。
4. 分析页 Orb 是代码重建，有圆环旋转和粒子环绕。
5. 结果揭晓页有仪式感。
6. 报告页有滚动展示，但不是简单平铺截图。
7. 结尾有深色 CTA，呼应原视频结尾搜索框感觉。
8. 能稳定导出 MP4。
