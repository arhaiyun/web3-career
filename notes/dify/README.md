# Dify 学习笔记

配合 [Dify 云工作空间](https://cloud.dify.ai/apps) 与仓库总览 [`docs/dify.md`](../../docs/dify.md)。

## 学习路径

| 顺序 | 笔记 | 内容 |
|------|------|------|
| 1 | [01-概念与工作流类型](01-concepts.md) | Workflow / Chatflow、节点、DSL |
| 2 | [02-Web3 学习向工作流配方](02-workflow-recipes.md) | 可照着在 Studio 搭的 4 个示例 |
| 3 | [03-与 Cursor 协作](03-cursor-integration.md) | 分工、粘贴模板、git 沉淀 |

## 原则

1. **Dify 产出 → 审定 → 写入 `notes/`** 再 commit。  
2. **合约与测试** 仍在 `projects/`，用 Cursor / Hardhat，不依赖 Dify 执行链上命令。  
3. **密钥** 仅 Dify 控制台或 `.env`（见 [`docs/dify.env.example`](../../docs/dify.env.example)）。
