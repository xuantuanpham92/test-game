# Design System

## Overview

扶摇弱科人格画像是一个轻量、亲和、面向学生和家长的学习诊断产品。页面以浅色背景、白色圆角卡片和靛蓝到紫粉的渐变按钮为主，信息层级清晰，强调“3分钟”“8种人格”“8个诊断维度”等可感知结果。视频会保留产品的浅色可信感，但用参考视频式的手机近景、轻微 3D 倾斜、贴纸漂浮和快速变焦来增强演示感。

## Colors

- **Page Background**: `#F9FAFB` - 主浅色画布
- **Soft Tint**: `#EEF2FF` - 英雄区和浅色渐变底
- **Card Surface**: `#FFFFFF` - 表单、题目和报告卡片
- **Primary Text**: `#111827` - 主标题和关键正文
- **Muted Text**: `#6B7280` - 说明文字
- **Primary Indigo**: `#6366F1` - 主按钮、进度、核心强调
- **Accent Purple**: `#8B5CF6` - 渐变按钮和分析动效
- **Accent Pink**: `#EC4899` - 高光、结果揭晓和 CTA
- **Generating Dark**: `#111827` - 生成页深色分析状态
- **Result Amber**: `#F59E0B` - “计算翻车型”的警示/成绩标签

## Typography

- **Primary UI Font**: system-ui, PingFang SC, Microsoft YaHei. 用于中文界面和按钮，权重 500-800。
- **Video Display**: Arial Black / Microsoft YaHei fallback. 用于视频内大标题，极粗、紧凑、适合短句冲击。
- **Data Labels**: Consolas / monospace fallback. 用于 3min、24题、8维度等小数据标签，开启 tabular numbers。
- **Scale**: 视频主标题 64-92px；界面卡片标题 28-40px；正文和标签 20px 以上。

## Elevation

产品页面使用柔和阴影、浅边框和白色卡片表达可信感。视频里手机外壳和漂浮卡片会加深阴影，制造参考视频那种近景产品感；不使用厚重拟物阴影，保持轻、干净、教育工具气质。

## Components

- **Tilted Phone Showcase**: 大手机壳占据画面 70% 以上，屏幕内展示产品流程。
- **Gradient CTA Button**: `#6366F1` 到 `#8B5CF6` 的圆角按钮，作为每个 beat 的行动焦点。
- **Question Card**: 白色卡片，顶部进度，选项按钮，圆点进度条。
- **Analyzer Ring**: 深色生成页中的双环旋转、扫描线和粒子。
- **Result Reveal Card**: 报告截图加浮出的“计算翻车型”人格贴纸。
- **Sticker Callouts**: 3min、24题、8维度、7天计划等短标签，模仿参考视频的贴纸式信息点。

## Do's and Don'ts

### Do's

- 使用浅色背景和扶摇渐变作为主视觉，不把产品改成纯暗黑科技风。
- 使用大手机近景、轻微 3D 倾斜和产品界面滑动来复刻参考视频节奏。
- 让关键 UI 元素被抠出、放大、漂浮，形成“产品细节特写”。
- 保持文案短，单屏只讲一个动作或结果。

### Don'ts

- 不使用纯营销落地页式 hero，不做长篇讲解。
- 不把所有信息都放在平铺卡片网格里。
- 不使用过多蓝紫渐变背景，全片需要白、深色、粉紫、琥珀色之间有节奏变化。
- 不依赖真实窄屏网页截图的完整性；不稳定页面用重建的真实 UI 卡片呈现。
