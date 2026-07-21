# Storyboard

**Format:** 1080x1440, vertical 3:4 like the reference video.  
**Audio:** Silent preview-first build. Timing is visual-led; MP4 render can add BGM later if desired.  
**VO direction:** If narration is added later, use calm confident Chinese product-demo delivery with short pauses.  
**Style basis:** DESIGN.md plus reference video: big tilted phone, soft background, quick zooms, sticker callouts, cutout UI details.

## Asset Audit

| Asset | Type | Assign to Beat | Role |
| --- | --- | --- | --- |
| `capture/screenshots/scroll-000.png` | Desktop site screenshot | Beat 1 | Source brand hero and visual palette |
| `product-screens/generating-large.png` | Product screenshot | Beat 3 | Real dark generating state |
| `product-screens/result-large.png` | Product screenshot | Beat 4 | Real result reveal page |
| `reference/frames/reference-contact-sheet.jpg` | Reference frames | Direction only | Validate phone close-up style; not used in final video |
| Rebuilt profile/test cards | HTML UI | Beat 2 | Stable product flow reconstruction |

## Beat 1 - Hook / Hero Phone (0.00-3.60s)

**Concept:** The video opens like the reference: already close to a product phone, not a static website. A tilted phone slides into view on a clean white-blue background. The first message is the product promise: identify the weak-subject personality, not just "math is bad".

**Visual:** A large 3D phone shell floats from the right. Inside is a simplified home page with the gradient headline, CTA, and three stats. Study stickers drift around the phone: ruler, calculator, progress bars, x mark. A small label says "AI学习诊断".

**Animation:** Phone zooms in from scale 0.72 with rotation. Headline slams in word by word. Stickers drift and rotate slowly. CTA pops with a soft shadow pulse.

**Transition:** Zoom through to Beat 2 with blur and scale.

## Beat 2 - Profile + Test Flow (3.40-7.40s)

**Concept:** The user moves fast through the setup and test, like the reference video's fast app walkthrough. The phone becomes a carousel of UI states: profile form, question card, option selected, progress dots.

**Visual:** Two stacked UI cards slide inside the phone. First: "年级 / 薄弱科目 / 目标分数". Then it flips into a test card: "第 1 / 24 题" with four answer buttons. Sticker callouts orbit: "24题", "3min", "真实场景".

**Animation:** Form fields cascade in. The selected answer fills purple. Progress dots draw left to right. Callouts bounce lightly.

**Transition:** Directional blur into the dark analyzer.

## Beat 3 - Analyzer / Generating (7.10-10.80s)

**Concept:** A visual shift from soft data entry into analysis. The phone is now dark and quiet; the ring analyzer scans the student's answers.

**Visual:** Deep `#111827` background, purple analysis ring, scanning line, small chips for "条件识别", "公式唤醒", "计算稳定", "复盘转化". Use the real generating screenshot as a texture inside the phone, with extra SVG rings drawn over it.

**Animation:** Rings rotate in opposite directions. A scanning line sweeps down. Chips light one by one. Tiny deterministic particles move around the core.

**Transition:** Light flash / overexposure into the result reveal.

## Beat 4 - Result Reveal (10.50-15.20s)

**Concept:** The payoff. The result page fills the phone, then the personality result pops out as a sticker, like a food or metric callout in the reference.

**Visual:** The real result page screenshot sits inside the phone. A cutout card floats out: "计算翻车型". Three mini metrics appear: "思路对", "细节断链", "优先训练". A small radar mini-card and "7天提升计划" sticker slide in.

**Animation:** Result screenshot zooms subtly. The car emoji and result label pop out with back easing. Metric cards count/slide. Radar lines draw as SVG.

**Transition:** Soft blur crossfade into final CTA.

## Beat 5 - CTA / Close (14.90-18.80s)

**Concept:** End clean and useful. The phone settles, product promise returns, and the CTA is clear.

**Visual:** Two overlapping phone cards recede into the background. Large text: "3分钟，看清失分机制". CTA button: "开始测试 · 免费生成画像". Bottom brand line: "扶摇弱科人格画像".

**Animation:** Phones drift backward. Headline types in two chunks. CTA glows once. Final fade to soft white.

**Transition:** Final fade only.

## Production Architecture

```
fuyao-hyperframes-video/
├── index.html
├── DESIGN.md
├── SCRIPT.md
├── STORYBOARD.md
├── capture/
├── product-screens/
└── reference/
```
