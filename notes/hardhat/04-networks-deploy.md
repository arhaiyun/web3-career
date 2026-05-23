# Hardhat — 网络与部署

**标签：** #hardhat #deploy

## 内置网络

| 网络名 | 说明 |
|--------|------|
| `hardhat` | 默认：`npx hardhat test` / `run` 时使用的内存链 |
| `localhost` | 连接 `npx hardhat node` 启动的本地 JSON-RPC（8545） |

## 本地部署流程

**终端 1** — 启动持久化本地链：

```bash
cd projects/hardhat-learning
npx hardhat node
```

**终端 2** — 向 localhost 部署：

```bash
npx hardhat run scripts/deploy.js --network localhost
```

仅快速验证（不启 node，使用一次性内存链）：

```bash
npx hardhat run scripts/deploy.js
```

## 测试网（可选）

1. 复制 `.env.example` 为 `.env`，填入 Sepolia RPC 与私钥（勿提交）。
2. 在 `hardhat.config.js` 中已预留 `sepolia` 网络配置（有环境变量时生效）。
3. 部署：

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 部署脚本要点

- 使用 `hre.ethers` 获取 signer 与 `ContractFactory`。
- 部署后打印合约地址，便于在区块浏览器或前端连接。
- 主网/测试网部署前务必在本地与测试网充分测试。

## 要点小结

1. **本地 node + localhost** 最接近真实联调，适合前端 dApp 开发。
2. 测试网需要 **测试 ETH**（水龙头）与可靠 RPC。
3. 生产环境考虑多签、验证合约源码、升级策略等（超出入门范围）。

## 关联实践

- 部署脚本：[`projects/hardhat-learning/scripts/deploy.js`](../../projects/hardhat-learning/scripts/deploy.js)
