# Web3 Career OS — Web3 风控与 AI 转型工作台

本仓库用于支持个人从 **大厂风控 / 内容安全 / Java + Python / AI Agent** 背景转型到 **Web3 Risk AI、Crypto 风控、合规 AML/KYT 与链上风险智能**。

现在仓库包含一个可交互的静态学习网站：展示职业画像、学习轨道、进度记录、反思反馈和作品集方向。

## 本地运行

```bash
npm run serve
```

打开 <http://localhost:4174> 查看网站。

```bash
npm test
```

运行站点契约测试，校验首页、学习数据和进度/反馈核心逻辑。

## 目录说明

| 路径 | 用途 |
|------|------|
| [`index.html`](index.html) | Web3 Career OS 交互式学习工作台入口 |
| [`assets/`](assets/) | 前端样式与交互脚本 |
| [`data/web3-transition-plan.json`](data/web3-transition-plan.json) | 个人职业画像、学习轨道、模块任务与反馈关键词 |
| [`notes/`](notes/) | 学习笔记与专题整理（按主题自建子目录） |
| [`docs/`](docs/) | 模板、术语表、长期索引类文档；外部学习资料见 [`docs/learning-resources.md`](docs/learning-resources.md)；Cursor Skills 见 [`docs/cursor-skills.md`](docs/cursor-skills.md)；Dify 工作流见 [`docs/dify.md`](docs/dify.md) |
| [`projects/`](projects/) | 独立实践仓库或子项目（每个实验一个子文件夹） |
| [`notes/hardhat/`](notes/hardhat/) | Hardhat 学习路径（含 [`projects/hardhat-learning`](projects/hardhat-learning) 实践） |
| [`notes/dify/`](notes/dify/) | Dify 工作流学习与 Web3 场景配方（工作空间：[cloud.dify.ai/apps](https://cloud.dify.ai/apps)） |
| [`notes/career/`](notes/career/) | Web3 行业岗位划分与职业路径 |

## 建议使用方式

1. **工作台**：从首页查看 6 条学习轨道，按模块切换「未开始 / 进行中 / 已完成」，进度会保存在浏览器 `localStorage`。
2. **反馈式学习**：每个模块都有一个反思 prompt，可用「业务场景 -> 风险信号 -> 策略动作 -> 复盘闭环」写答案并获得即时反馈。
3. **笔记**：在 `notes/` 下按主题建文件夹（例如 `ethereum/`、`solidity/`、`defi/`），单篇笔记可用 `docs/note-template.md` 复制起步。
4. **实践**：每个项目在 `projects/` 下设独立目录，自带 README，说明目标、网络、依赖与运行方式。
5. **Dify 工作流**：在 [Dify 工作空间](https://cloud.dify.ai/apps) 编排 repeatable 流程（出题、笔记草稿等），审定后写入 `notes/`；说明见 [`docs/dify.md`](docs/dify.md)。
6. **版本管理**：敏感信息（私钥、API Key、Dify App Key）勿提交；使用 `.env` 本地配置并已列入 `.gitignore`。

## 本地环境（按需安装）

实践阶段可按项目选择工具链，例如：

- **Node.js** + Hardhat / Foundry（合约与脚本）
- **钱包与测试网**（Sepolia 等）用于联调

具体版本与命令以各 `projects/<name>/README.md` 为准。

---

欢迎按自己的节奏扩展目录；保持「笔记可追溯、实验可复现」即可。
