# Fuyao Claude Reference Pack

用途：当 Claude Code 不能直接读取原视频时，用这个包提供“可复刻的视觉依据”。

目录：
- `original_video_contact_sheet.jpg`：原视频每秒关键帧拼图，用于理解镜头结构。
- `original_video_keyframes/`：原视频按时间抽取的关键帧。
- `user_ui_references/`：扶摇弱科人格测试的产品界面参考图。
- `docs/motion_lock_spec.md`：按原视频风格锁定的镜头、节奏、图层和动效规则。
- `docs/shot_map.csv`：原视频镜头到扶摇镜头的替换映射。
- `prompts/01_bootstrap.md`：从 0 启动项目时给 Claude Code 的提示词。
- `prompts/02_build_demo.md`：先做 6 秒质感样片的提示词。
- `prompts/03_build_full_video.md`：扩展为完整 18 秒视频的提示词。
- `prompts/04_quality_pass.md`：质感优化提示词。

使用方式：
1. 新建 Remotion 项目。
2. 把整个 `fuyao_claude_reference_pack` 放入项目根目录的 `references/`。
3. 启动 Claude Code。
4. 先复制 `prompts/01_bootstrap.md` 给 Claude Code。
5. 等它生成 motion spec 后，再执行后续提示词。
