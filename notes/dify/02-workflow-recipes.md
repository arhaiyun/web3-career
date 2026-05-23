# Dify — Web3 学习向工作流配方

**标签：** #dify #web3

在 [cloud.dify.ai/apps](https://cloud.dify.ai/apps) 创建应用时可按下列配方搭建（节点名为 Dify 英文界面常用叫法）。

---

## 配方 1：章节笔记生成器（Workflow）

**目标：** 输入「章节标题 + 要点草稿」→ 输出符合本仓库模板的 Markdown。

```text
User Input（title, bullet_points）
    → LLM「按 docs/note-template 结构写笔记，中文，代码用 solidity 围栏」
    → Template（Jinja2 套页眉：日期、标签 #hardhat）
    → Output
```

**技巧：**

- 在 LLM 系统提示中粘贴 `docs/note-template.md` 的章节标题列表（勿含隐私）。  
- 温度偏低；要求「无内容处写 TODO，勿编造 Gas 具体数值」。  

**落地：** 复制 Output → `notes/hardhat/xx-*.md` → Cursor 校对后 git commit。

---

## 配方 2：Hardhat 自测题（Workflow）

**目标：** 输入章节名 → 10 道选择题 + 解析。

```text
User Input（chapter_name）
    → Knowledge Retrieval（挂载 notes/hardhat 知识库）
    → LLM「仅根据检索内容出题；每题 4 选项；附解析与笔记章节引用」
    → Output
```

**技巧：**

- 检索为空时，IF/ELSE 走分支提示「请先上传该章笔记到知识库」。  
- 输出 JSON 或固定 Markdown 标题，方便后续用脚本解析（可选 Code 节点校验 JSON）。

---

## 配方 3：Web3 概念助教（Chatflow）

**目标：** 多轮问答，适合学完一节后追问。

```text
每轮用户消息
    → Knowledge Retrieval（notes/ + 可选 docs/learning-resources 摘要）
    → LLM（记忆开启，窗口 5–10 轮）
    → Answer
```

**系统提示要点：**

- 先给结论，再展开；涉及操作步骤时指向本仓库 `projects/hardhat-learning`。  
- 不生成真实私钥；测试网说明用 Sepolia 等公开网络。  

---

## 配方 4：术语中英对照表（Workflow）

**目标：** 输入多个中文术语 → 表格：英文 | 中文 | 一句话类比 | 本仓库链接。

```text
User Input（terms，逗号分隔）
    → Iteration（对每个 term）
        → LLM「一项术语一行，类比避免误导」
    → Template「Markdown 表格」
    → Output
```

**技巧：** Iteration 内控制 max tokens，避免单项过长拖垮整批。

---

## 配方 5（进阶）：学习周报 Trigger

**目标：** 每周自动汇总 `notes/hardhat` 学习进度（需 Schedule Trigger）。

```text
Schedule Trigger（每周一 9:00）
    → HTTP Request（可选：读 GitHub API 私有库 commit，Key 放 Dify 密钥库）
    → LLM「生成周报：本周新增笔记、待办、下周建议」
    → Output → 邮件/Slack（若已接插件）
```

**注意：** 私有仓库 token 勿写入本 git 仓库；仅在 Dify 配置。

---

## 关联实践

- 总览：[`docs/dify.md`](../../docs/dify.md)  
- Hardhat 笔记：[`notes/hardhat/`](../hardhat/)  
- Cursor 衔接：[`03-cursor-integration.md`](03-cursor-integration.md)
