你是资深 Motion Designer、Remotion Engineer、产品宣传片导演和高级前端设计工程师。

我要从 0 开始做一个“扶摇弱科人格测试”的产品宣传展示视频。原视频不能直接提交给你，所以我已经给你准备了 reference pack：

references/fuyao_claude_reference_pack/
  original_video_contact_sheet.jpg
  original_video_keyframes/
  user_ui_references/
  docs/motion_lock_spec.md
  docs/shot_map.csv

请先不要写代码。

你的任务：
1. 阅读 `references/fuyao_claude_reference_pack/docs/motion_lock_spec.md`。
2. 阅读 `references/fuyao_claude_reference_pack/docs/shot_map.csv`。
3. 查看 `original_video_contact_sheet.jpg` 和 `original_video_keyframes/`，理解原视频风格。
4. 查看 `user_ui_references/`，理解扶摇产品页面。
5. 生成 `docs/fuyao-remotion-plan.md`。

要求：
- 不是自由发挥，而是尽量复刻原视频的产品展示片感觉。
- 但内容替换成扶摇弱科人格测试。
- 不要做普通录屏。
- 不要做 PPT 翻页。
- 不要直接全屏铺截图。
- 先输出完整计划，等我确认再写代码。

`docs/fuyao-remotion-plan.md` 必须包含：
1. 视频尺寸、帧率、时长。
2. 每一幕的时间轴。
3. 每一幕参考原视频哪个时间段。
4. 每一幕使用扶摇哪张 UI 图。
5. 每一幕的动效：from/to、duration、easing。
6. 图层结构。
7. Remotion 组件结构。
8. 需要重建的组件：PhoneFrame、OrbAnalyzer、FloatingStudyIcons、ReportScroll、CTA SearchBox。
9. 第一阶段 6 秒 demo 方案。
10. 完整 18 秒版本方案。
