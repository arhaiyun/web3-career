# Dify 与 Cursor 协作

**标签：** #dify #cursor

## 分工

| 步骤 | 工具 | 示例 |
|------|------|------|
| 设计/运行固定流程 | Dify | 批量出题、笔记初稿 |
| 改仓库、跑测试 | Cursor Agent | `npm test`、改 Greeter.sol |
| 架构图、Skills | Cursor + 本仓库 skill | `architecture-diagram-html` |
| 审定与版本管理 | git | 只提交审定后的 `notes/` |

## 推荐工作流（单次学习会话）

1. **Dify**：用「章节笔记生成器」得到 Markdown 草稿。  
2. **Cursor**：`@notes/dify/02-workflow-recipes.md` + 草稿 →「对照 hardhat 笔记纠错并合并」。  
3. **Cursor**：在 `projects/hardhat-learning` 完成配套练习并 `npm test`。  
4. **git**：commit 笔记与代码（不说「gitpush」则只本地 commit）。

## 复制即用：Cursor 提示词

**审定 Dify 笔记：**

```text
以下是 Dify「章节笔记生成器」的输出。请对照 @notes/hardhat/03-compile-test.md
与 @projects/hardhat-learning/test/Greeter.js，修正事实错误并统一术语，
写入 notes/hardhat/05-xxx.md，保留 note-template 结构。
```

**把测验落盘：**

```text
将下面 Dify 自测题输出整理为 notes/hardhat/quiz-03.md，
每题包含：题干、选项、正确答案、解析、关联笔记章节。
```

**API 联调（可选）：**

本地 `.env` 参考 `docs/dify.env.example`，用 curl 调用 Dify 已发布应用的 completion API；
不要把 `DIFY_APP_API_KEY` 提交到 GitHub。

## 和 Claude Cowork / Claude Code

- **Cowork** 适合整文件夹整理 `notes/`；**Dify** 适合已编排好的重复流程。  
- 同一主题避免三处同时改：优先 **git 里的 markdown 为准**。

## 关联

- [`docs/cursor-skills.md`](../../docs/cursor-skills.md)  
- [`docs/dify.md`](../../docs/dify.md)
