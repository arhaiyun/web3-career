# Cursor Agent Skills 清单

本仓库维护 **Web3 学习 + Cursor 协作** 所需的 Agent Skills 索引。Skill 本体安装在本地 `~/.cursor/skills/`（不提交 `node_modules` 级依赖）；仓库内通过 [`.cursor/skills/`](../.cursor/skills/) 保存**自研 skill**，并用 [`scripts/install-cursor-skills.sh`](../scripts/install-cursor-skills.sh) 同步上游推荐 skill。

上游参考：[anthropics/skills](https://github.com/anthropics/skills) · 规范：[agentskills.io](https://agentskills.io)

---

## 已安装 Skill（推荐集）

| Skill | 来源 | 用途（简述） | 与本仓库关系 |
|-------|------|--------------|--------------|
| `architecture-diagram-html` | **本仓库** [`.cursor/skills/`](../.cursor/skills/architecture-diagram-html/) | 输出单文件 HTML 架构图 | `docs/diagrams/` 如 [hardhat-architecture.html](diagrams/hardhat-architecture.html) |
| `skill-creator` | anthropics | 创建/优化 skill、评测与描述调优 | 扩展学习笔记、合约工作流 skill |
| `webapp-testing` | anthropics | Playwright 测本地 Web 应用 | 未来 dApp / 钱包联调前端 |
| `frontend-design` | anthropics | 高质量前端 UI 与页面 | 学习站点、Dashboard |
| `web-artifacts-builder` | anthropics | 复杂 React/HTML 制品（shadcn 等） | 交互式学习页（非简单静态图） |
| `mcp-builder` | anthropics | 搭建 MCP 服务对接外部 API | 链接 Etherscan、RPC、文档等 |
| `doc-coauthoring` | anthropics | 结构化文档共创流程 | `notes/hardhat/` 等长文笔记 |

**未纳入本清单（按需自行安装）：** `pdf`、`docx`、`pptx`、`xlsx`（体积大、许可与依赖不同）、`algorithmic-art`、`internal-comms` 等。见 [anthropics/skills/tree/main/skills](https://github.com/anthropics/skills/tree/main/skills)。

---

## 固定上游版本

| 项 | 值 |
|----|-----|
| 仓库 | https://github.com/anthropics/skills |
| Commit | `690f15c`（2026-05-19） |
| 安装脚本 | [`scripts/install-cursor-skills.sh`](../scripts/install-cursor-skills.sh) |

升级上游时：修改脚本内 `ANTHROPICS_SKILLS_REF`，本地执行脚本后在本表更新 commit，并简要测试常用 skill。

---

## 安装与更新

```bash
# 从仓库根目录执行
chmod +x scripts/install-cursor-skills.sh
./scripts/install-cursor-skills.sh
```

环境变量（可选）：

| 变量 | 默认 | 说明 |
|------|------|------|
| `CURSOR_SKILLS_DIR` | `~/.cursor/skills` | 安装目标 |
| `ANTHROPICS_SKILLS_REF` | `690f15c` | 上游 git ref |

---

## 在 Cursor 中使用

1. Skills 需位于 `~/.cursor/skills/<name>/`（或项目 `.cursor/skills/`）。
2. 对话中 **@skill 名称** 或明确写「使用 `skill-creator` skill …」。
3. 自研 `architecture-diagram-html` 默认 `disable-model-invocation: true`，需显式点名。

---

## 目录结构

```text
web3-career/
├── .cursor/skills/
│   └── architecture-diagram-html/   # 纳入 git，安装脚本会同步到本机
├── docs/
│   ├── cursor-skills.md             # 本文件
│   ├── dify.md                      # Dify 工作流
│   └── diagrams/                    # HTML 架构图产出
└── scripts/
    └── install-cursor-skills.sh
```

---

## 相关文档

- [`docs/dify.md`](dify.md) — Dify 工作流与 Cursor 分工
- [`docs/learning-resources.md`](learning-resources.md) — 外部课程链接
- [`notes/hardhat/`](../notes/hardhat/) — Hardhat 学习路径

---

## 许可说明

- [anthropics/skills](https://github.com/anthropics/skills) 中多数示例为 **Apache 2.0**；`docx` / `pdf` / `pptx` / `xlsx` 等为 **source-available 参考实现**，拷贝前请阅读各目录 `LICENSE`。
- 本仓库 `architecture-diagram-html` 随仓库 MIT/你的仓库许可分发。
