# Dify — Workflow 与 Chatflow 基础

**标签：** #dify #workflow  
**工作空间：** [cloud.dify.ai/apps](https://cloud.dify.ai/apps)

## 背景

Dify Studio 用可视化画布把 **模型调用、检索、分支、代码** 连成可重复流程，适合把「学习助教、出题、摘要」从一次性对话变成可发布应用。

## 核心概念

### Workflow（工作流）

- **一次运行**：从 Start 到 Output，适合批处理、定时任务。  
- **入口**：User Input 或 [Trigger](https://docs.dify.ai/en/use-dify/nodes/trigger/overview)（定时 / Webhook）。  
- **结束**：Output 节点返回结果。  

官方说明：[Workflow & Chatflow](https://docs.dify.ai/en/use-dify/build/workflow-chatflow)

### Chatflow（对话流）

- **每轮消息**触发一次编排，带对话记忆与变量。  
- **结束**：Answer 节点（必填）。  
- 适合：Hardhat 概念追问、按学习进度辅导。  

### 与其他应用类型的关系

Dify 还有 Chatbot、Agent、Text Generator 等简化类型；复杂场景建议直接用 **Workflow / Chatflow**（见 [Key Concepts](https://docs.dify.ai/en/use-dify/getting-started/key-concepts)）。

## 最小 Workflow 结构（示意）

```text
[User Input] → [LLM] → [Template] → [Output]
```

带知识库时：

```text
[User Input] → [Knowledge Retrieval] → [LLM] → [Answer/Output]
```

## 发布与使用方式

| 方式 | 说明 |
|------|------|
| WebApp | 分享链接或嵌入，适合同学/自用复习 |
| API | 脚本批量调用；Key 存本地 `.env` |
| MCP | 供支持 MCP 的客户端当工具调用 |
| DSL 导出 | YAML 备份、迁移到其他 Dify 实例 |

## 要点小结

1. 先配 **Model Provider**，再拖 LLM 节点。  
2. 学习场景：**Chatflow = 问学**，**Workflow = 生成/批处理**。  
3. 仓库 `notes/` 负责真相来源；Dify 知识库负责 **检索增强**，需定期同步。  

## 延伸阅读

- [docs/dify.md](../../docs/dify.md)  
- [30-Minute Quick Start](https://docs.dify.ai/en/use-dify/getting-started/quick-start)
