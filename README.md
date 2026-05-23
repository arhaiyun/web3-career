# Web3 Career — 区块链学习与知识库

本仓库用于系统化记录 **Web3 / 区块链** 相关概念、协议与安全要点，并承载 **动手实践** 的小型项目（合约、脚本、前端交互等）。

## 目录说明

| 路径 | 用途 |
|------|------|
| [`notes/`](notes/) | 学习笔记与专题整理（按主题自建子目录） |
| [`docs/`](docs/) | 模板、术语表、长期索引类文档；外部学习资料见 [`docs/learning-resources.md`](docs/learning-resources.md) |
| [`projects/`](projects/) | 独立实践仓库或子项目（每个实验一个子文件夹） |
| [`notes/hardhat/`](notes/hardhat/) | Hardhat 学习路径（含 [`projects/hardhat-learning`](projects/hardhat-learning) 实践） |

## 建议使用方式

1. **笔记**：在 `notes/` 下按主题建文件夹（例如 `ethereum/`、`solidity/`、`defi/`），单篇笔记可用 `docs/note-template.md` 复制起步。
2. **实践**：每个项目在 `projects/` 下设独立目录，自带 README，说明目标、网络、依赖与运行方式。
3. **版本管理**：敏感信息（私钥、API Key）勿提交；使用 `.env` 本地配置并已列入 `.gitignore`。

## 本地环境（按需安装）

实践阶段可按项目选择工具链，例如：

- **Node.js** + Hardhat / Foundry（合约与脚本）
- **钱包与测试网**（Sepolia 等）用于联调

具体版本与命令以各 `projects/<name>/README.md` 为准。

---

欢迎按自己的节奏扩展目录；保持「笔记可追溯、实验可复现」即可。
