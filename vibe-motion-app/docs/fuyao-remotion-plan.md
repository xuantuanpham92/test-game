# 扶摇弱科人格测试 — Remotion 产品宣传片完整计划

> **目标**: 从 0 制作一条 1080×1920 / 30fps 的产品展示合成片，复刻原视频的镜头语言、构图、动效节奏和 UI 展示方式，所有内容替换为扶摇弱科人格测试。
> 版本：v2.0 | 状态：待确认后实施 | 日期：2026-07-08

---

## 1. 视频总目标

制作一条「**产品展示合成片**」(product showcase composite)，不是录屏、不是 PPT 翻页。核心感觉：

- 一台 iPhone 始终作为视觉容器，带轻 3D 倾斜和慢速镜头推进
- 浅色柔光背景（前半段）→ 深色 AI 分析（中段）→ 浅蓝紫结果揭晓（后半段）→ 深色 CTA（结尾）
- UI 截图放入手机屏幕内部展示，关键元素从手机中"浮出"或以景深方式单独放大展示
- 所有转场使用 blur + scale + opacity，禁止硬切
- 所有内容替换为"扶摇弱科人格测试"

---

## 2. 视频尺寸、帧率、总时长

| 属性 | 值 |
|------|----|
| 宽度 | 1080px |
| 高度 | 1920px |
| 比例 | 9:16 |
| 帧率 | 30fps |
| 第一阶段（质感样片） | 180 帧 / 6 秒 |
| 第二阶段（完整版） | 600 帧 / 20 秒 |

---

## 3. 原视频风格拆解

原视频（参考 food/nutrition app 宣传片）的视觉特征，从 contact sheet + 18 张关键帧 + motion_lock_spec 中提取：

### 3.1 画面调性
- **浅色区**: 白色/浅灰/淡米色渐变，非纯白，带径向柔光，顶部淡蓝紫光晕
- **深色区**: 深蓝黑 (#0D0F1A)，中央径向亮光 (#1A1D3A → #050508)，科技感强
- **结尾区**: 深黑 (#0A0B14)，搜索框/输入框式 CTA

### 3.2 主体容器
- 黑色 iPhone 边框 + Dynamic Island
- 手机从不完全正对镜头：rotateZ(-5°→0°) + rotateY(-8°→0°)
- 手机阴影柔和：0 40px 80px rgba(0,0,0,0.25)
- 手机 scale 0.85-0.95，画面占比约 55-65%

### 3.3 镜头运动
- **Slow push in**: scale 0.96 → 1.04 缓慢推近
- **Tilt settle**: rotateZ 从 -5° 收束到 0°
- **Float**: 背景元素持续缓慢漂浮（sin/cos 驱动）
- **Depth blur**: 前景清晰 + 后景模糊（filter: blur）

### 3.4 转场方式
- Scene 间: opacity fade + slight blur + scale(1→1.03)，每次约 6 帧 (0.2s)
- 不硬切，不跳帧
- 背景色渐变切换时叠加 radial-gradient 过渡

### 3.5 文字策略
- 每幕 ≤ 1 句主文案
- 不堆报告原文
- 文字出现 stagger 而非整段同时出现
- 标题使用渐变文字 (#625BFF → #F044A5)

### 3.6 节奏
- 每 1.5-3 秒切换画面重点
- 0-3s: 建立产品感
- 3-7s: 展示核心流程
- 7-11s: 深色 AI 分析 loading
- 11-16s: 结果揭晓 + 报告价值
- 16-20s: CTA 收尾

---

## 4. 扶摇产品内容替换策略

| 原视频元素 | 扶摇替换 | 素材来源 |
|-----------|---------|---------|
| App 首页食物记录 | 扶摇首页 Hero: 测出你的弱科人格画像 | 01_home_hero.jpg |
| 食物详情页 | 答题页: 题目 + 选项 | 02/03/04/05 |
| AI 识别/识别中 | 正在分析你的失分模式 / 匹配弱科人格 | 代码重建 Orb |
| 食物列表滚动 | 报告页滚动展示 | 11/12/13/16/17 |
| 单独浮出的食物 item | 弱科人格 icon + 梯度标题"表达掉线型" | 10_result_hero.jpg |
| 营养/体重/饮水数据 | 八维学习能力画像 / 诊断分析 / 七天计划 | 12/13/16 |
| 深色结尾搜索框 | myfuyao.top / 搜索 扶摇弱科人格测试 | 代码重建 CTA |

---

## 5. 每一幕的时间轴

### 第一阶段：6 秒质感样片 (180 帧)

| 幕 | 帧范围 | 时长 | 场景 | 背景 |
|----|--------|------|------|------|
| Scene 01 | 0-36 | 1.2s | Hero Phone Intro | 浅色柔光 |
| Scene 02 | 36-78 | 1.4s | Question Flow | 浅色柔光 |
| Scene 03 | 78-126 | 1.6s | Dark AI Analyzer | 深蓝黑 |
| Scene 04 | 126-180 | 1.8s | Result Reveal | 浅蓝紫 |

### 第二阶段：20 秒完整版 (600 帧)

| 幕 | 帧范围 | 时长 | 场景 | 背景 |
|----|--------|------|------|------|
| Scene 01 | 0-60 | 2.0s | Hero Phone Intro | 浅色柔光 |
| Scene 02 | 60-150 | 3.0s | Question Flow + Answer | 浅色柔光 |
| Scene 03 | 150-225 | 2.5s | Answer Selection + Progress | 浅色柔光 |
| Scene 04 | 225-345 | 4.0s | Dark AI Analyzer | 深蓝黑 |
| Scene 05 | 345-420 | 2.5s | Result Reveal "表达掉线型" | 浅蓝紫 |
| Scene 06 | 420-510 | 3.0s | Report Scroll (人格分析 + 雷达 + 诊断) | 浅色 |
| Scene 07 | 510-570 | 2.0s | Seven Day Plan + Training | 浅色 |
| Scene 08 | 570-600 | 1.0s | Dark CTA End | 深黑 |

---

## 6. 每一幕参考原视频的哪个镜头

| Scene | 参考原视频时间段 | 原视频画面 | 复刻要点 |
|-------|----------------|-----------|---------|
| 01 Hero | t00-t01 (0-2s) | tilted phone intro with app home | phone scale in + rotateZ settle + floating icons |
| 02 Question | t02-t03 (2-4s) | food detail / recognition page | page in phone + option stagger + progress bar |
| 03 Answer | t03-t04 (4-6s) | selecting items | answer highlight + question number advance |
| 04 AI | t05-t07 (6-10s) | recognizing/loading overlay | orb rings rotate + particles orbit + progress bar |
| 05 Result | t08-t09 (10-13s) | isolated food items on white | depth blur + object float + gradient title reveal |
| 06 Report | t10-t12 (13-15s) | product data / object card scroll | vertical scroll + card parallax + highlight |
| 07 Plan | t13-t14 (15-16s) | card details | card stagger reveal + keyword glow |
| 08 CTA | t15-t17 (16-18.5s) | dark CTA / search ending | dark bg + center search box + CTA text |

---

## 7. 每一幕使用扶摇哪张参考图

| Scene | 主要截图 | 备用截图 |
|-------|---------|---------|
| 01 Hero | `01_home_hero.jpg` | 代码重建 |
| 02 Question | `02_question_empty.jpg` | `03_question_selected_a.jpg` |
| 03 Answer | `03_question_selected_a.jpg` | `05_question_selected_b.jpg` |
| 04 AI | 无截图 — **纯代码重建 Orb** | — |
| 05 Result | `10_result_hero.jpg` | 代码重建标题 |
| 06 Report | `11_personality_analysis.jpg`, `12_radar_scores.jpg`, `13_diagnosis_summary.jpg` | — |
| 07 Plan | `16_seven_day_plan.jpg`, `17_training_advice.jpg` | — |
| 08 CTA | 无截图 — **纯代码重建** | — |

---

## 8. 每一幕的画面构图

### Scene 01 — Hero Phone Intro
```
┌─────────────────────────────────┐
│         柔光光晕 (top)          │
│                                 │
│    漂浮学习图标 (4-5个)         │
│    ┌─────────────────┐          │
│    │    iPhone        │          │  ← 手机从下方升入，rotateZ: -6°→0°
│    │  ┌───────────┐   │          │
│    │  │ Home Hero │   │          │
│    │  │ 扶摇首页   │   │          │
│    │  └───────────┘   │          │
│    └─────────────────┘          │
│                                 │
│    测出你的弱科人格画像           │  ← 渐变主标题
│    24题 × 3分钟 × AI驱动        │  ← 副标题
│    [ 开始测试 · 免费生成画像 ]    │  ← CTA 按钮
└─────────────────────────────────┘
```

### Scene 02 — Question Flow
```
┌─────────────────────────────────┐
│         柔光光晕 (top)          │
│    ┌─────────────────┐          │
│    │    iPhone        │          │  ← 轻微推近 scale: 1→1.03
│    │  [进度条 1/24]   │          │
│    │  题目: 考试遇到   │          │
│    │  难题通常怎么做？  │          │
│    │  ┌─────────────┐ │          │
│    │  │ A. 反复尝试   │ │          │  ← 选项 stagger 出现
│    │  │ B. 看解析     │ │          │
│    │  │ C. 先跳过     │ │          │
│    │  │ D. 问老师     │ │          │
│    │  └─────────────┘ │          │
│    └─────────────────┘          │
│                                 │
│    24 道题，识别你的失分行为模式  │  ← 文案
└─────────────────────────────────┘
```

### Scene 03 — Answer Selection
```
┌─────────────────────────────────┐
│    ┌─────────────────┐          │
│    │    iPhone        │          │  ← rotateY: -3°
│    │  [进度 5/24]     │          │
│    │  题目已切换       │          │
│    │  ┌─────────────┐ │          │
│    │  │ ◆ A. 已选    │ │          │  ← 选中卡片 glow + scale bounce
│    │  │   B.         │ │          │
│    │  │   C.         │ │          │
│    │  │   D.         │ │          │
│    │  └─────────────┘ │          │
│    └─────────────────┘          │
│                                 │
│    题号快速推进 (3→5→8→12...)   │  ← 数字跳动
└─────────────────────────────────┘
```

### Scene 04 — Dark AI Analyzer
```
┌─────────────────────────────────┐
│        ░░░░ 暗色背景 ░░░░       │
│           ·  ·  ·               │  ← 固定位置粒子
│         ╭─────────╮             │
│         │   Orb   │             │  ← 中心圆点 + 三圈圆环旋转
│         │  ╭───╮  │             │      + 环绕粒子 + 底部进度条
│         │  │ ● │  │             │
│         │  ╰───╯  │             │
│         ╰─────────╯             │
│                                 │
│    正在分析你的失分模式...        │  ← 文案轮换 (3-4 条)
│    ┌─────────────────┐          │
│    │ ████░░░░░░░░░░░ │          │  ← Skeleton 报告卡呼吸
│    │ ██████░░░░░░░░░ │          │
│    │ ███░░░░░░░░░░░░ │          │
│    └─────────────────┘          │
└─────────────────────────────────┘
```

### Scene 05 — Result Reveal
```
┌─────────────────────────────────┐
│       浅蓝紫柔光背景              │
│                                 │
│       🧠 (模糊, 后层)            │  ← 景深 icon: 2 个模糊副本 + 1 清晰主体
│      🧠 (半模糊, 中层)           │
│       🧠 (清晰, 主层 + bounce)   │
│                                 │
│        你的弱科人格              │
│      表 达 掉 线 型             │  ← 渐变文字 #625BFF → #F044A5
│                                 │
│  你的脑子里有答案，但卷面没有     │
│  把它完整表达出来。              │
│                                 │
│   [ 保存报告 ]  [ 分享报告 ]     │  ← 按钮组 stagger
└─────────────────────────────────┘
```

### Scene 06 — Report Scroll
```
┌─────────────────────────────────┐
│    ┌─────────────────┐          │
│    │    iPhone        │          │
│    │  ┌───────────┐   │          │  ← 报告长图在手机内滚动
│    │  │ 人格分析页  │   │          │
│    │  │ ·表述规范性  │   │          │     卡片进入画面时局部提亮
│    │  │ ·压轴拆解力  │   │          │     关键词高光
│    │  │ 雷达图     │   │          │
│    │  │ 诊断总结   │   │          │
│    │  └───────────┘   │          │
│    └─────────────────┘          │
│                                 │
│    八维学习能力画像 · 精准诊断   │  ← 文案
└─────────────────────────────────┘
```

### Scene 07 — Seven Day Plan
```
┌─────────────────────────────────┐
│    ┌─────────────────┐          │
│    │    iPhone        │          │
│    │  ┌───────────┐   │          │  ← 七天计划卡片 stagger
│    │  │ Day 1 ████ │   │          │     各天依次滑入
│    │  │ Day 2 ████ │   │          │
│    │  │ Day 3 ████ │   │          │
│    │  │ ...       │   │          │
│    │  └───────────┘   │          │
│    └─────────────────┘          │
│                                 │
│    七天提升计划 · 每日可执行     │  ← 文案
└─────────────────────────────────┘
```

### Scene 08 — Dark CTA End
```
┌─────────────────────────────────┐
│        ░░░░ 深黑背景 ░░░░       │
│                                 │
│                                 │
│    扶摇弱科人格测试              │  ← 顶部品牌名 (小号)
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔍 搜索 扶摇弱科人格测试  │    │  ← 搜索框样式 CTA
│  └─────────────────────────┘    │
│                                 │
│   3 分钟，生成你的弱科人格画像   │  ← 主文案
│   24 题免费测 · myfuyao.top     │  ← 副文案
│                                 │
└─────────────────────────────────┘
```

---

## 9. 每一幕的图层关系

### Scene 01 图层 (从下到上)
1. **Background**: radial-gradient(#EEF2FF → #F7F8FF → #FFFFFF) + 顶部紫色光晕
2. **Floating Icons**: 5 个 SVG 学习图标，sin/cos 浮动，持续循环
3. **Phone Container**: translate(-50%, -50%) 居中，marginTop: -50px
4. **Phone Frame**: 黑色 iPhone 边框 + Dynamic Island + 侧边按键
5. **Screen Content**: 扶摇首页（截图 or 代码重建）
6. **Bottom Text Area**: 渐变标题 + 副标题 + CTA 按钮

### Scene 02 图层
1. **Background**: 同 Scene 01
2. **Phone Container**: 居中，缓慢推近
3. **Phone Frame**: 同上
4. **Screen Content**:
   - 进度条 (top)
   - 题号 + 题目文字
   - 4 个选项卡片 (stagger by index)
5. **Bottom Text**: 文案淡入
6. **Overlay Glow**: 顶部光晕

### Scene 03 图层
1. **Background**: 同 Scene 01
2. **Phone Container**: 居中 + rotateY: -3°
3. **Phone Frame**: 同上
4. **Screen Content**:
   - 进度条更新
   - 新题目文字
   - 选项卡片（A 选中发光）→ 切换到 B 选中发光
   - 题号数字跳动动画
5. **Overlay Glow**: 顶部光晕

### Scene 04 图层
1. **Background**: radial-gradient(#1A1D3A → #0D0F1A → #050508)
2. **Background Particles**: 6 个固定位置静态粒子，淡出淡入
3. **Orb Glow**: 中央 radial 光晕
4. **Orb Outer Rings**: 外圈 (2 条: solid + dashed)，逆时针旋转
5. **Orb Middle Ring**: 中圈，顺时针旋转
6. **Orb Inner Ring**: 内圈，顺时针旋转
7. **Orb Core Dot**: 中心渐变圆点，scale 0→1 spring
8. **Orb Particles**: 6 个环绕粒子，各自轨道旋转
9. **Progress Bar**: 底部渐变进度条
10. **Text**: 分析文案轮换
11. **Skeleton Card**: 报告骨架屏，呼吸效果

### Scene 05 图层
1. **Background**: 浅蓝紫 radial-gradient
2. **Background Glow**: 中央紫色光晕
3. **Icon Back Layer**: 🧠 模糊 15px→8px, opacity 0.25
4. **Icon Mid Layer**: 🧠 模糊 10px→5px, opacity 0.4
5. **Icon Main Layer**: 🧠 清晰, opacity 0→1, scale bounce
6. **Subtitle**: "你的弱科人格" fadeIn + slideUp
7. **Gradient Title**: "表达掉线型" 渐变文字
8. **Description**: 描述文字淡入
9. **Button Group**: 保存报告 + 分享报告 stagger

### Scene 06 图层
1. **Background**: 浅色柔光
2. **Phone Container**: 居中
3. **Screen Content - Scroll Container**:
   - 11_personality_analysis.jpg 截图
   - 12_radar_scores.jpg 截图
   - 13_diagnosis_summary.jpg 截图
   - 每个卡片进入 viewport 时提亮 (brightness: 1→1.05)
4. **Keyword Highlight Overlay**: 半透明高亮遮罩
5. **Bottom Text**: 阶段文案

### Scene 07 图层
1. **Background**: 同 Scene 06
2. **Phone Container**: 居中
3. **Screen Content - Day Cards**:
   - 7 个日期卡片 stagger 从右侧滑入
   - 每个卡片有 brief 文字 + progress bar
4. **Bottom Text**: 文案

### Scene 08 图层
1. **Background**: radial-gradient(#1A1D3A → #0A0B14 → #000000)
2. **Top Brand Name**: 小号文字
3. **Search Box**: 圆角矩形 + 搜索 icon + placeholder 文字
   - inner shadow + border 微光
4. **CTA Text**: 主副文案
5. **Background Particles**: 少量固定粒子

---

## 10. 每一幕的动效 From / To 状态

### Scene 01 — Hero Phone Intro

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 手机容器 | scale: 0.8, Y: +80px, rotateZ: -6° | scale: 1, Y: 0, rotateZ: 0° | spring(damping:150, stiffness:200) |
| 手机透明度 | opacity: 0 | opacity: 1 | interpolate [0→15f] |
| 浮动图标 | opacity: 0 (stagger by 8f each) | opacity: 1 | interpolate [0→30+index*8f] |
| 主标题 | opacity: 0, Y: +15px | opacity: 1, Y: 0 | interpolate [15→30f] |
| 副标题 | opacity: 0 | opacity: 1 | interpolate [22→37f] |
| CTA 按钮 | opacity: 0 | opacity: 1 | interpolate [28→43f] |
| 背景 | opacity: 0 | opacity: 1 | interpolate [0→20f] |

### Scene 02 — Question Flow

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 手机 | scale: 1 | scale: 1.03 | interpolate [36→60f] |
| 题卡(题号+题目) | opacity: 0, X: -20px | opacity: 1, X: 0 | interpolate [36→50f] |
| 进度条 | width: 0% | width: 4.2% (1/24) | interpolate [36→56f] |
| 选项 A | opacity: 0, X: +30px | opacity: 1, X: 0 | interpolate [42→56f] |
| 选项 B | opacity: 0, X: +30px | opacity: 1, X: 0 | interpolate [49→63f] |
| 选项 C | opacity: 0, X: +30px | opacity: 1, X: 0 | interpolate [56→70f] |
| 选项 D | opacity: 0, X: +30px | opacity: 1, X: 0 | interpolate [63→77f] |
| 底部文案 | opacity: 0 | opacity: 1 | interpolate [50→65f] |

### Scene 03 — Answer Selection

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 手机 | rotateY: 0° | rotateY: -3° | interpolate [78→100f] |
| 选中卡片(A) | scale: 1, glow: 0 | scale: 1.025, glow: 1 | spring [85→100f] |
| 选中卡片回到(B) | A 选中的逆过程 | — | interpolate [110→125f] |
| 选中 B 发光 | scale: 1 | scale: 1.025 | spring [125→140f] |
| 进度条 | 4.2% | ~25% | interpolate [78→145f] |
| 题号 | "3" | "8" | 数字跳动 |
| 模糊转场出 | blur: 0, scale: 1 | blur: 8, scale: 1.05 | interpolate [142→150f] |

### Scene 04 — Dark AI Analyzer

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 背景 | opacity: 0 | opacity: 1 | interpolate [150→165f] |
| Orb 核心 | scale: 0 | scale: 1 | spring [155→170f] |
| 内环旋转 | 持续旋转 | — | (frame - start) * 2°/frame |
| 外环旋转 | 持续逆向旋转 | — | -(frame - start) * 1.5°/frame |
| 粒子环绕 | opacity: 0→1 (stagger) | 持续轨道运动 | angle += speed * 180/frame |
| 进度条 | 0% | 100% | interpolate [160→345f] |
| 文案 | opacity: 0→1→0 轮换 | 4 条文案轮换 | 每条 ~60f, fade in/out 10f |
| Skeleton 卡 | opacity: 0.4→0.6→0.4→... | 呼吸循环 | sin 驱动 |

### Scene 05 — Result Reveal

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 背景切换 | opacity: 0 (深色) | opacity: 1 (浅蓝紫) | interpolate [225→245f] |
| Icon 后层 | blur: 15, opacity: 0 | blur: 8, opacity: 0.25 | interpolate [230→250f] |
| Icon 中层 | blur: 10, opacity: 0 | blur: 5, opacity: 0.4 | interpolate [233→253f] |
| Icon 主层 | opacity: 0 | opacity: 1 | interpolate [238→255f] |
| Icon bounce | scale: 1 | scale: 1.12 → back to 1 | interpolate [245,255,265f] |
| 副标题 | opacity: 0, Y: +15 | opacity: 1, Y: 0 | interpolate [240→260f] |
| 渐变标题 | opacity: 0, 渐变从左展开 | opacity: 1, 渐变填满 | interpolate [248→268f] |
| 描述 | opacity: 0 | opacity: 1 | interpolate [260→275f] |
| 按钮 1 | opacity: 0 | opacity: 1 | interpolate [268→283f] |
| 按钮 2 | opacity: 0 | opacity: 1 | interpolate [273→288f] |

### Scene 06 — Report Scroll

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 手机 | scale: 1 | scale: 1.02 | interpolate [345→380f] |
| 报告容器 | Y: 200 | Y: -600 (滚动) | interpolate [355→500f] |
| 人格分析卡片 | brightness: 1.0, opacity: 0.7 | brightness: 1.05, opacity: 1 | 进入中央区域时 |
| 雷达图 | opacity: 0→1, scale: 0.9→1 | — | 进入 viewport 时 |
| 诊断总结 | opacity: 0→1, X: +20→0 | — | 滑入时 |
| 关键词高光 | 背景: transparent | 背景: rgba(98,91,255,0.15) | 卡片在中心时 |

### Scene 07 — Seven Day Plan

| 元素 | From | To | 驱动 |
|------|------|----|------|
| Day 卡片 1-7 | opacity: 0, X: +40px | opacity: 1, X: 0 | stagger [420→480f], gap 8f |
| 每卡进度条 | 0% | 100% | 卡片出现后 5f 内填充 |
| 底部文案 | opacity: 0 | opacity: 1 | interpolate [480→495f] |

### Scene 08 — Dark CTA End

| 元素 | From | To | 驱动 |
|------|------|----|------|
| 背景 | opacity: 0 | opacity: 1 | interpolate [510→525f] |
| 品牌名 | opacity: 0, Y: -10 | opacity: 1, Y: 0 | interpolate [520→535f] |
| 搜索框 | scale: 0.95, opacity: 0 | scale: 1, opacity: 1 | spring [530→550f] |
| 搜索框光标 | — | 闪烁 | opacity: 1→0→1 sin |
| 主文案 | opacity: 0 | opacity: 1 | interpolate [545→560f] |
| 副文案 | opacity: 0 | opacity: 1 | interpolate [555→570f] |

---

## 11. 每一幕的 Duration 和 Easing

| Scene | 帧数 | 时长 | 入场 easing | 出场 easing |
|-------|------|------|------------|------------|
| 01 Hero | 60f | 2.0s | spring(damp:150, stiff:200) | fadeOut blur:8 |
| 02 Question | 90f | 3.0s | fadeIn + slideRight | blur + scale |
| 03 Answer | 75f | 2.5s | spring + fade | blur + scale |
| 04 AI | 120f | 4.0s | fadeIn (慢) | fadeOut (慢) |
| 05 Result | 75f | 2.5s | fadeIn + spring bounce | — |
| 06 Report | 90f | 3.0s | slideUp + fadeIn | blur fade |
| 07 Plan | 60f | 2.0s | stagger slideRight | blur fade |
| 08 CTA | 30f | 1.0s | fadeIn + spring box | — |

**通用 easing 约定:**
- 入场: `easeOutCubic` 或 `spring({damping:150, stiffness:200})`
- 出场: `easeInQuad`
- 持续动画: `sin/cos` 驱动, `linear`
- stagger gap: 6-8 帧 (0.2-0.27s)
- 转场重叠: 6 帧 (0.2s)
- blur 峰值的转场: interpolate [start, start+6f] blur: [0→8]

---

## 12. 每一幕的文字文案

| Scene | 主文案 | 副文案 | 屏内文字 |
|-------|--------|--------|---------|
| 01 Hero | 测出你的弱科人格画像 | 24题 × 3分钟 × AI驱动 | — |
| 02 Question | 24 道题，识别你的失分行为模式 | — | 你在考试中遇到难题时，通常会？ |
| 03 Answer | 你的选择，定义你的学习人格 | — | 题号 5/24 |
| 04 AI | 正在分析你的失分模式... | (轮换) 正在匹配弱科人格... / 正在生成能力画像... / 正在定位最该优先提升的能力... | — |
| 05 Result | 表达掉线型 | 你的脑子里有答案，但卷面没有把它完整表达出来。 | 你的弱科人格 |
| 06 Report | 八维学习能力画像 · 精准诊断 | — | 表达规范性 / 压轴拆解力 / 复盘转化力 |
| 07 Plan | 七天提升计划 · 每日可执行 | — | Day 1-7 |
| 08 CTA | 3 分钟，生成你的弱科人格画像 | 24 题免费测 · myfuyao.top | 🔍 搜索 扶摇弱科人格测试 |

---

## 13. 每一幕的转场方式

| 转场 | 帧范围 | 方式 | 参数 |
|------|--------|------|------|
| Scene 01 → 02 | 57-63f | blur + scale + opacity 交叉淡入淡出 | Scene 01: blur 0→8, opacity 1→0 / Scene 02: opacity 0→1 |
| Scene 02 → 03 | 142-150f | phone rotateY 过渡 + blur | rotateY: 0→-3°, blur 0→5→0 |
| Scene 03 → 04 | 218-228f | 深色背景淡入覆盖 + blur | 背景 opacity 0→1, blur 0→10→0 |
| Scene 04 → 05 | 338-348f | 背景色渐变切换 + 中央 burst light | dark bg → light bg, 中央亮点扩散 |
| Scene 05 → 06 | 412-420f | phone 推近 + 内容 fade 切换 | phone scale 1→1.02, 内容 opacity 交叉 |
| Scene 06 → 07 | 502-510f | blur + slide fade | blur 0→5→0, 内容 Y 偏移 |
| Scene 07 → 08 | 562-570f | 深色背景 fade 覆盖 | 浅色 bg → 深色 bg, opacity 过渡 |

**转场铁律:**
- 不允许直接 sequence 硬切
- 每个转场至少 6 帧 (0.2s) 重叠
- 必须有 opacity/blur/scale 三者中至少两者参与
- Sequence 组件 `from` 要提前 3-6f 开始，`durationInFrames` 要延长 3-6f

---

## 14. Remotion 组件拆分方案

```
src/
├── Root.tsx                          # 注册所有 Composition
├── compositions/
│   ├── FuyaoDemo.tsx                 # 6s 样片 (180f)
│   └── FuyaoPromo.tsx               # 20s 完整版 (600f) [新增]
├── scenes/
│   ├── Scene01Hero.tsx               # [已有，需增强]
│   ├── Scene02Question.tsx           # [已有，需增强]
│   ├── Scene03AnswerSelection.tsx    # [新增]
│   ├── Scene04Analyzing.tsx          # [已有，需增强]
│   ├── Scene05ResultReveal.tsx       # [已有，需增强]
│   ├── Scene06ReportScroll.tsx      # [新增]
│   ├── Scene07SevenDayPlan.tsx       # [新增]
│   └── Scene08CTAEnd.tsx             # [新增]
├── components/
│   ├── PhoneFrame.tsx                # [已有，需增强 3D]
│   ├── FloatingStudyIcons.tsx        # [已有]
│   ├── GradientText.tsx              # [已有]
│   ├── PrimaryButton.tsx             # [已有]
│   ├── QuestionCard.tsx              # [已有]
│   ├── OptionCard.tsx                # [已有，需增强]
│   ├── OrbAnalyzer.tsx               # [已有，需增强]
│   ├── ProgressBar.tsx               # [已有]
│   ├── SearchBox.tsx                 # [新增] CTA 搜索框
│   ├── ReportCard.tsx               # [新增] 报告卡片
│   ├── RadarChart.tsx               # [新增] 雷达图
│   ├── DayPlanCard.tsx              # [新增] 七天计划卡片
│   ├── CountUpNumber.tsx            # [新增] 数字跳动
│   ├── DepthIcon.tsx                # [新增] 景深 icon 效果
│   └── SceneTransition.tsx          # [新增] 通用转场包装器
├── motion/
│   ├── timeline.ts                   # [已有，需扩展到 600f]
│   ├── easing.ts                     # [已有]
│   └── animations.ts                 # [已有，需增强]
├── styles/
│   ├── theme.ts                      # [已有]
│   └── global.css                    # [已有]
└── assets/
    └── assets.ts                     # [已有，需更新路径]
```

---

## 15. 需要重建/增强的组件

| 组件 | 状态 | 说明 |
|------|------|------|
| PhoneFrame | 需增强 | 添加 rotateY 3D 透视、更强阴影、Dynamic Island 细节 |
| OrbAnalyzer | 需增强 | 优化粒子轨道、圆环层次、呼吸光晕、文案轮换逻辑 |
| FloatingStudyIcons | 可用 | 无需改动 |
| GradientText | 需增强 | 优化渐变动画，从左到右的滑动遮罩效果更明显 |
| PrimaryButton | 可用 | 无需改动 |
| QuestionCard | 可用 | 无需改动 |
| OptionCard | 需增强 | 选中 glow 更明显，scale bounce 更精准 |
| ProgressBar | 可用 | 无需改动 |
| **SearchBox** | **新建** | 深色搜索框式 CTA：圆角矩形 + 搜索 icon + placeholder 文字 + 光标闪烁 |
| **ReportCard** | **新建** | 报告卡片组件：图片 + 提取文字 + 局部高光效果 |
| **RadarChart** | **新建** | SVG/CSS 雷达图：六边形 + 数据区域填充 + 标签 |
| **DayPlanCard** | **新建** | 七天计划卡片：日号 + 任务文字 + 微型进度条 |
| **CountUpNumber** | **新建** | 数字跳动动画：题号/分数跳动 |
| **DepthIcon** | **新建** | 景深 icon：1 清晰图层 + 2 模糊副本的包装组件 |
| **SceneTransition** | **新建** | 通用转场包装器：输入 from-scene / to-scene，输出 blur + scale + opacity 过渡 |

---

## 16. 可以直接使用截图的部分

以下场景**可以直接使用用户提供的 UI 截图**放入 PhoneFrame 屏幕内展示：

| 场景 | 截图 | 用法 |
|------|------|------|
| Scene 01 Hero | `01_home_hero.jpg` | 放入 PhoneFrame 作为屏幕内容，也可以继续用代码重建 |
| Scene 02 Question | `02_question_empty.jpg` | 放入 PhoneFrame，叠加代码动画的选中效果 |
| Scene 03 Answer | `03_question_selected_a.jpg` + `05_question_selected_b.jpg` | 切换展示两张截图 |
| Scene 06 Report | `11_personality_analysis.jpg`, `12_radar_scores.jpg`, `13_diagnosis_summary.jpg` | 在 PhoneFrame 内从上到下排列，缓慢滚动 |
| Scene 07 Plan | `16_seven_day_plan.jpg`, `17_training_advice.jpg` | 在 PhoneFrame 内展示 |

**注意**: 截图只能放在 PhoneFrame 屏幕内，不能直接全屏铺满。截图外层必须有手机边框 + 3D 倾斜 + 投影。

---

## 17. 必须代码重建的部分

| 部分 | 原因 |
|------|------|
| **Orb AI 分析器** | 原视频没有对应截图，且需要动画：圆环旋转、粒子环绕、进度条增长、光晕呼吸 |
| **SearchBox CTA** | 原视频对应搜索框式 CTA，扶摇没有对应截图 |
| **背景柔光** | radial-gradient + 关键光位，截图无法表达 |
| **浮动学习图标** | 需要持续漂浮动画 |
| **渐变标题** | 从左到右渐变动画无法用截图表达 |
| **PhoneFrame 3D** | 黑色 iPhone 边框 + Dynamic Island 需要代码绘制 |
| **转场效果** | blur + scale + opacity 需要代码 |
| **粒子** | AI 分析页固定位置粒子 |
| **景深 icon** | 结果揭晓页：模糊副本 + 清晰主体 |
| **进度条动画** | AI 分析底部进度条需要代码 |
| **数字跳动** | 题号/分数跳动 |
| **Option 选中发光** | 选中卡片 glow + scale bounce |

---

## 18. 第一阶段 6 秒质感样片方案

**Composition ID**: `FuyaoDemo`
**帧数**: 180f / 6s
**结构**:

```
Scene 01: 0-36f   (1.2s)  Hero Phone Intro
Scene 02: 36-78f  (1.4s)  Question Flow
Scene 03: 78-126f (1.6s)  Dark AI Analyzer
Scene 04: 126-180f(1.8s)  Result Reveal
```

**样片目标**: 验证核心质感和视觉方向
- ✅ 手机 3D 倾斜入口
- ✅ 选项 stagger 出现
- ✅ 深色 AI 分析 Orb 代码重建
- ✅ 结果揭晓景深 icon + 渐变标题
- ✅ 所有转场 blur + scale + opacity
- ✅ 可导出 MP4

**样片不包含**: Scene 03 Answer Selection / Scene 06 Report Scroll / Scene 07 Plan / Scene 08 CTA

**当前实施状态**: FuyaoDemo.tsx 已存在并可运行，4 个 Scene 已实现初版，需质量 pass。

---

## 19. 第二阶段 20 秒完整版方案

**Composition ID**: `FuyaoPromo`
**帧数**: 600f / 20s
**结构**:

```
Scene 01: 0-60f     (2.0s)  Hero Phone Intro
Scene 02: 60-150f   (3.0s)  Question Flow
Scene 03: 150-225f  (2.5s)  Answer Selection + Progress Advance
Scene 04: 225-345f  (4.0s)  Dark AI Analyzer (延长，4 条文案完整轮换)
Scene 05: 345-420f  (2.5s)  Result Reveal "表达掉线型"
Scene 06: 420-510f  (3.0s)  Report Scroll (人格分析 + 雷达 + 诊断)
Scene 07: 510-570f  (2.0s)  Seven Day Plan + Training Advice
Scene 08: 570-600f  (1.0s)  Dark CTA Search Box
```

**完整版新增**:
- Scene 03: 选择题号推进 + 选项切换动效
- Scene 06: PhoneFrame 内报告截图滚动 + 卡片局部提亮 + 关键词高光
- Scene 07: 七天计划卡片 stagger 滑入
- Scene 08: 深色搜索框 CTA

**与 FuyaoDemo 的关系**: FuyaoDemo 保持独立可运行，FuyaoPromo 独立注册，两者共享组件。

---

## 20. 验收标准

### 样片 (FuyaoDemo) 验收
1. ✅ `npm run dev` 可运行，Composition 可见
2. ✅ 导出 MP4 无报错
3. ✅ 让人感觉是产品合成片，不是网页录屏
4. ✅ 手机有 3D 倾斜 (rotateZ/rotateY) 和投影
5. ✅ 有浅色柔光背景（非纯白）
6. ✅ 深色 AI 分析页对比明显
7. ✅ Orb 是代码重建，有圆环旋转和粒子环绕
8. ✅ 选项有 stagger 入场
9. ✅ 结果页有景深 icon + 渐变标题
10. ✅ 无硬切转场

### 完整版 (FuyaoPromo) 验收
11. ✅ 包含全部 8 个 Scene
12. ✅ Scene 06 报告滚动不是简单截图平移，有局部提亮和关键词高光
13. ✅ Scene 08 结尾呼应原视频深色搜索框
14. ✅ 所有转场 blur + scale + opacity
15. ✅ 所有内容在 PhoneFrame 容器内或符合构图规范
16. ✅ 文字文案与计划文档一致
17. ✅ 粒子/浮动元素使用固定数组，可复现
18. ✅ FuyaoDemo 仍可独立运行
19. ✅ 总时长 20s (±0.5s)
20. ✅ 品牌色符合 theme.ts

---

## 实施优先级

```
Phase 0: 计划确认（当前）           ← 等待用户审阅本文档
Phase 1: 增强现有组件质量           ← PhoneFrame 3D / Orb 优化 / OptionCard glow
Phase 2: 完善 6s 样片              ← FuyaoDemo 质量 pass
Phase 3: 新建缺失组件               ← SearchBox / RadarChart / DayPlanCard 等
Phase 4: 构建 20s 完整版            ← FuyaoPromo 全部 8 scenes
Phase 5: 质量 pass                  ← 复刻原视频质感检查
```

---

> 📅 文档生成时间: 2026-07-08
> 📁 对应项目: vibe-motion-app
> 🎯 下一步: 等待用户确认计划后进入 Phase 1 实施
