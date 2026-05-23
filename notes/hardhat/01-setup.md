# Hardhat — 环境与安装

**标签：** #hardhat #tooling

## 背景

Hardhat 是以太坊生态中常用的 **本地开发与测试框架**，提供编译、测试、部署脚本与内置本地区块链节点，适合 Solidity 入门与小型项目迭代。

## 前置条件

- **Node.js** LTS（建议 20.x 或更高）
- 包管理器：`npm`（本仓库实践项目默认使用 npm）

检查版本：

```bash
node -v
npm -v
```

## 安装方式

### 方式 A：使用本仓库实践项目（推荐）

```bash
cd projects/hardhat-learning
npm install
```

### 方式 B：从零新建项目

```bash
mkdir my-hardhat-app && cd my-hardhat-app
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

初始化向导可选 TypeScript 或 JavaScript；本模块实践项目已采用 **JavaScript + hardhat-toolbox**。

## 要点小结

1. Hardhat 以 **npm 包** 形式安装在项目内，而非全局单一二进制。
2. `@nomicfoundation/hardhat-toolbox` 捆绑常用插件（ethers、chai、coverage 等），减少手动配置。
3. 私钥与 RPC URL 放在 `.env`，勿提交仓库（见根目录 `.gitignore`）。

## 关联实践

- 项目：[`projects/hardhat-learning`](../../projects/hardhat-learning)
