# Web3 Career OS — Web3 风控与 AI 转型工作台

本仓库用于支持个人从 **大厂风控 / 内容安全 / Java + Python / AI Agent** 背景转型到 **Web3 Risk AI、Crypto 风控、合规 AML/KYT 与链上风险智能**。

现在仓库包含一个可交互的 **Web3 Career OS 学习工作台**（侧边栏导航 + Dashboard 作战室）：学习路径、资料库、项目实践、多维度反思反馈与作品集管理，进度保存在浏览器 `localStorage`。

## 本地运行

```bash
npm run serve
```

打开 <http://localhost:4174> 查看网站。

界面改版方案（5 套 demo，选定后再正式重构）：

```text
http://localhost:4174/demos/
```

```bash
npm test
```

运行站点契约测试，校验首页、学习数据和进度/反馈核心逻辑。

## 目录说明

| 路径 | 用途 |
|------|------|
| [`index.html`](index.html) | Web3 Career OS 交互式学习工作台入口 |
| [`assets/`](assets/) | 前端样式与交互脚本 |
| [`data/web3-transition-plan.json`](data/web3-transition-plan.json) | 个人职业画像、六条学习轨道、模块任务与输出物 |
| [`data/resources.json`](data/resources.json) | 结构化资料库（类型、Track、难度、阅读状态） |
| [`data/portfolio.json`](data/portfolio.json) | 三个核心作品集项目与下一步任务 |
| [`notes/`](notes/) | 学习笔记与专题整理；**18 模块完整参考答案**见 [`notes/answers/`](notes/answers/) |
| [`docs/`](docs/) | 模板、术语表、长期索引类文档；外部学习资料见 [`docs/learning-resources.md`](docs/learning-resources.md)；Cursor Skills 见 [`docs/cursor-skills.md`](docs/cursor-skills.md)；Dify 工作流见 [`docs/dify.md`](docs/dify.md) |
| [`projects/`](projects/) | 独立实践仓库或子项目（每个实验一个子文件夹） |
| [`notes/hardhat/`](notes/hardhat/) | Hardhat 学习路径（含 [`projects/hardhat-learning`](projects/hardhat-learning) 实践） |
| [`notes/dify/`](notes/dify/) | Dify 工作流学习与 Web3 场景配方（工作空间：[cloud.dify.ai/apps](https://cloud.dify.ai/apps)） |
| [`notes/career/`](notes/career/) | Web3 行业岗位划分与职业路径 |

## 建议使用方式

1. **Dashboard**：打开即见今日推荐模块、本周目标、能力缺口与面试素材积累。
2. **学习路径**：点击模块在页内打开详情，切换「未开始 / 学习中 / 已完成 / 需要复盘」，写笔记并标记面试素材。
3. **资料库**：按 Track、类型、阅读状态筛选资源卡片。
4. **反思反馈**：五维度学习教练式反馈（预留 AI Agent 按钮接口）。
5. **笔记**：在 `notes/` 下按主题建文件夹，单篇笔记可用 `docs/note-template.md` 复制起步。
6. **实践**：每个项目在 `projects/` 下设独立目录，自带 README，说明目标、网络、依赖与运行方式。
7. **Dify 工作流**：在 [Dify 工作空间](https://cloud.dify.ai/apps) 编排 repeatable 流程，审定后写入 `notes/`；说明见 [`docs/dify.md`](docs/dify.md)。
8. **版本管理**：敏感信息（私钥、API Key、Dify App Key）勿提交；使用 `.env` 本地配置并已列入 `.gitignore`。

## 本地环境（按需安装）

实践阶段可按项目选择工具链，例如：

- **Node.js** + Hardhat / Foundry（合约与脚本）
- **钱包与测试网**（Sepolia 等）用于联调

具体版本与命令以各 `projects/<name>/README.md` 为准。

---

欢迎按自己的节奏扩展目录；保持「笔记可追溯、实验可复现」即可。
