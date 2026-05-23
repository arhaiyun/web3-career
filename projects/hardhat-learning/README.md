# hardhat-learning

Hardhat 入门实践：编译、测试、本地部署。配套笔记见 [`notes/hardhat/`](../../notes/hardhat/)。

## 目标

- 熟悉 Hardhat 项目结构与常用命令
- 编写并测试简单 Solidity 合约（`Greeter`）
- 可选：连接本地节点或 Sepolia 测试网部署

## 前置依赖

- Node.js 20+（建议 LTS）
- npm

## 安装

```bash
cd projects/hardhat-learning
npm install
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run compile` | 编译合约 |
| `npm test` | 运行测试 |
| `npm run node` | 启动本地 JSON-RPC（8545） |
| `npm run deploy` | 在默认 Hardhat 网络上部署 |
| `npm run deploy:local` | 部署到 `localhost`（需先 `npm run node`） |

## 合约说明

- **`Greeter`**：构造函数设置初始问候语；`greet()` 读取；`setGreeting()` 更新并发出 `GreetingUpdated` 事件。

## 测试网（可选）

1. 复制 `.env.example` → `.env`
2. 填入 `SEPOLIA_RPC_URL` 与 `PRIVATE_KEY`
3. `npx hardhat run scripts/deploy.js --network sepolia`

## 网络

- 默认：`hardhat`（内存链，测试与一次性部署）
- 本地：`localhost` + `hardhat node`
- 可选：`sepolia`
