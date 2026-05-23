# Dify 工作流与使用技巧

本仓库将 [Dify](https://dify.ai) 作为 **可视化 AI 工作流** 平台，与 Cursor（编码）、`notes/`（知识沉淀）、Hardhat（链上实践）配合使用。

| 项 | 链接 |
|----|------|
| **个人工作空间** | [cloud.dify.ai/apps](https://cloud.dify.ai/apps) |
| **官方文档** | [docs.dify.ai](https://docs.dify.ai) |
| **工作流入门** | [Workflow & Chatflow](https://docs.dify.ai/en/use-dify/build/workflow-chatflow) |
| **30 分钟快速上手** | [Quick Start](https://docs.dify.ai/en/use-dify/getting-started/quick-start) |
| **本仓库笔记** | [`notes/dify/`](../notes/dify/) |

---

## Dify 是什么

Dify 是 **Agent 应用构建平台**：在 Studio 里用拖拽节点编排 **Workflow（单次任务流）** 或 **Chatflow（多轮对话流）**，可发布为 Web 应用、API，或作为 MCP 工具被其他应用调用（见 [Key Concepts](https://docs.dify.ai/en/use-dify/getting-started/key-concepts)）。

与「只在聊天框里问一句」不同，工作流把步骤固定下来：**输入 → 检索/分支 → LLM → 代码或工具 → 输出**，便于复现和迭代。

### Workflow vs Chatflow

| 类型 | 触发方式 | 适用场景 |
|------|----------|----------|
| **Workflow** | 用户输入 / API / **Trigger**（定时、Webhook） | 批量总结、报告生成、定时拉取资料 |
| **Chatflow** | 每轮用户消息 | 学习助教、概念问答、带记忆的辅导 |

Workflow 可从 **User Input** 或 **Trigger** 启动；Chatflow 每轮对话触发，支持记忆与对话变量（[Workflow & Chatflow](https://docs.dify.ai/en/use-dify/build/workflow-chatflow)）。

### 常用节点（编排时）

| 节点 | 作用 |
|------|------|
| **LLM** | 生成、分类、改写（核心） |
| **Knowledge Retrieval** | 挂载知识库（如你自己的 Markdown 导出） |
| **Code** | 轻量脚本处理 JSON / 格式化 |
| **IF/ELSE** | 按条件分支 |
| **Iteration** | 对列表逐项处理（如多章节笔记） |
| **Template** | Jinja2 拼最终输出 |
| **HTTP Request** | 调外部 API（Etherscan 等，注意 Key 放 Dify 密钥库） |
| **Output / Answer** | Workflow 结束输出 / Chatflow 回复用户 |

---

## 与本仓库工具链的分工

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Dify 工作流     │     │  Cursor / Claude  │     │  Hardhat 实践        │
│  复现流程、助教   │ ──► │  写合约、改仓库    │ ──► │  projects/*          │
│  API / 定时任务  │     │  Skills、git      │     │  compile / test       │
└────────┬────────┘     └────────┬─────────┘     └─────────────────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
              notes/  +  docs/
              （单一事实来源，git 管理）
```

| 工具 | 更适合 |
|------|--------|
| **Dify** | 固定流程：出题、摘要、中英术语表、按模板生成笔记草稿 |
| **Cursor** | 改 `notes/` 与 `projects/` 源码、跑测试、画 HTML 架构图 |
| **本仓库 git** | 审定 Dify 产出后写入 `notes/`，避免只在云端对话里留档 |

详细笔记见 [`notes/dify/README.md`](../notes/dify/README.md)。

---

## 实用技巧

### 1. 密钥与模型

- 在 Dify **Settings → Model Provider** 配置 OpenAI / Anthropic / 国内模型等（[Quick Start](https://docs.dify.ai/en/use-dify/getting-started/quick-start)）。
- **API Key、RPC URL 只放在 Dify 密钥管理或本机 `.env`**，勿写入本仓库；参考 [`docs/dify.env.example`](dify.env.example)。

### 2. 和本仓库知识库联动

- 将 `notes/hardhat/*.md` 导出或同步到 Dify **Knowledge**，Chatflow 用 **Knowledge Retrieval** 减少胡编。
- 工作流输出定为 Markdown 结构（标题、要点、代码块），方便粘贴到 `notes/` 再由 Cursor 校对。

### 3. 提示词与参数

- **学习辅导**：模型偏 **Precise**，温度低；系统提示中要求「引用知识库段落，不知道则说明」。
- **创意举例**：可用 **Balanced**；仍建议要求标注「示例非主网地址」。
- 复杂提示用 **Jinja2** 注入变量（章节名、难度、是否含代码）（[LLM 节点](https://docs.dify.ai/en/use-dify/build/orchestration/llm)）。

### 4. 发布与自动化

- **Workflow + API**：脚本或 GitHub Action 调用，批量处理学习资料。
- **Schedule Trigger**：定时生成「本周 Hardhat 复习卡片」（需 Dify 云端计划支持 Trigger；见 [Trigger 概述](https://docs.dify.ai/en/use-dify/nodes/trigger/overview)）。
- 应用可 **导出 DSL（YAML）** 备份到私有仓库（勿把含密钥的 DSL 提交到公开 git）。

### 5. 调试

- 用 Studio **单次运行** 检查每个节点输入/输出。
- 分支先用 **IF/ELSE** 区分「是否有上传文件 / 是否 Web3 相关问题」。
- 失败时缩小 LLM 上下文，避免一次塞入整本笔记。

### 6. 和 Cursor 协作话术

在 Cursor 中可这样衔接 Dify：

```text
我已在 Dify 跑完「Hardhat 章节测验」工作流，输出如下：（粘贴）
请对照 @notes/hardhat/03-compile-test.md 校对，并把错题解析写入 notes/hardhat/quiz-review.md
```

---

## 推荐在本工作空间创建的应用（起步）

在 [cloud.dify.ai/apps](https://cloud.dify.ai/apps) 可新建：

| 应用名（建议） | 类型 | 用途 |
|----------------|------|------|
| Web3 概念助教 | Chatflow | 基于 `notes/` 知识库问答 |
| 章节笔记生成器 | Workflow | 输入 B 站/文章摘要 → 输出符合 `note-template` 的草稿 |
| Hardhat 自测题 | Workflow | 输入章节名 → 10 道选择 + 解析 |
| 术语中英对照 | Workflow | 输入概念列表 → 表格 + 一句类比 |

节点级配方见 [`notes/dify/02-workflow-recipes.md`](../notes/dify/02-workflow-recipes.md)。

---

## 相关文档

- [`docs/cursor-skills.md`](cursor-skills.md) — Cursor Agent Skills
- [`docs/learning-resources.md`](learning-resources.md) — 外部课程链接
- [`notes/hardhat/`](../notes/hardhat/) — Hardhat 学习路径
