# Hardhat — 项目结构

**标签：** #hardhat #solidity

## 标准目录（本仓库 `hardhat-learning`）

```
projects/hardhat-learning/
├── contracts/          # Solidity 源码
├── test/               # 合约测试（Mocha + Chai + ethers）
├── scripts/            # 部署与运维脚本
├── hardhat.config.js   # 网络、编译器、插件配置
├── package.json
└── README.md
```

## 关键文件说明

| 路径 | 作用 |
|------|------|
| `hardhat.config.js` | 定义 `solidity` 版本、`networks`、插件 |
| `contracts/*.sol` | 智能合约；编译产物在 `artifacts/`（已 gitignore） |
| `test/*.js` | 调用合约方法的自动化测试 |
| `scripts/deploy.js` | 使用 `hardhat run` 执行的部署逻辑 |

## `hardhat.config.js` 常见字段

- **`solidity`**：编译器版本，需与合约 `pragma` 一致。
- **`networks`**：`hardhat`（内存链）、`localhost`（连接 `npx hardhat node`）、测试网 RPC 等。
- **插件**：通过 `require("@nomicfoundation/hardhat-toolbox")` 启用。

## 要点小结

1. 合约、测试、脚本分离，便于 CI 与协作。
2. `artifacts/`、`cache/` 为生成目录，不必入库。
3. 一目录一项目：不要在仓库根目录混放多个 `hardhat.config`。

## 关联实践

- 示例合约：[`projects/hardhat-learning/contracts/Greeter.sol`](../../projects/hardhat-learning/contracts/Greeter.sol)
