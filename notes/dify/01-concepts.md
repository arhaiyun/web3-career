# Dify — 概念与工作流类型

**标签：** #dify #workflow

## 背景

需要在不写完整后端的情况下，把「输入学习材料 → LLM 处理 → 结构化输出」变成**可重复运行**的流程；Dify Studio 提供可视化编排。

## 核心概念

| 概念 | 说明 |
|------|------|
| **App** | Studio 中创建的应用，类型为 Workflow 或 Chatflow 等 |
| **Workflow** | 单次执行：从 User Input / Trigger 到 Output |
| **Chatflow** | 多轮：每轮消息走一遍图，以 Answer 结束 |
| **Node** | 画布上的步骤：LLM、知识库检索、代码、分支等 |
| **Variable** | 节点间传递的数据；Chatflow 可有会话变量 |
| **DSL** | 应用导出为 YAML，便于备份与迁移 |
| **Knowledge** | 上传文档供检索增强（RAG） |

官方索引：[Key Concepts](https://docs.dify.ai/en/use-dify/getting-started/key-concepts)

## Workflow 与 Chatflow 怎么选

- **选 Workflow**：一次输入、一次结果；需要定时/Webhook；批量处理。  
- **选 Chatflow**：连续追问、澄清、辅导式学习；需要对话记忆。

本仓库 Web3 学习场景中：

- **章节测验、笔记生成** → Workflow  
- **概念助教、错题追问** → Chatflow  

## Trigger（仅 Workflow）

- **Schedule**：定时跑（如每周复习提要）  
- **Webhook / Plugin**：外部事件触发  

详见 [Trigger 概述](https://docs.dify.ai/en/use-dify/nodes/trigger/overview)。  
注意：定时任务依赖 Dify 云端与账号能力，关闭或休眠时可能跳过执行。

## 要点小结

1. 先画清「输入 / 输出 / 分支」，再在 Studio 拖节点。  
2. 知识库与 `notes/` 内容对齐，减少模型凭空编造链上细节。  
3. 复杂逻辑用 **Code** 或 **IF/ELSE** 拆开，别堆在一个超长 Prompt 里。

## 延伸阅读

- [`docs/dify.md`](../../docs/dify.md)  
- [Workflow & Chatflow](https://docs.dify.ai/en/use-dify/build/workflow-chatflow)
