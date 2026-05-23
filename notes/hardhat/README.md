# Hardhat 学习模块

本模块配合 [`projects/hardhat-learning`](../../projects/hardhat-learning) 动手练习，建议按顺序阅读笔记并在项目中执行对应命令。

## 学习路径

| 顺序 | 笔记 | 实践要点 |
|------|------|----------|
| 1 | [01-环境与安装](01-setup.md) | Node.js、初始化项目、`npm install` |
| 2 | [02-项目结构](02-project-layout.md) | `contracts/`、`test/`、`scripts/`、`hardhat.config` |
| 3 | [03-编译与测试](03-compile-test.md) | `npx hardhat compile`、`npx hardhat test` |
| 4 | [04-网络与部署](04-networks-deploy.md) | 本地节点、部署脚本、测试网（可选） |

## 快速开始（实践项目）

```bash
cd projects/hardhat-learning
npm install
npx hardhat compile
npx hardhat test
```

## 关联资料

- [Hardhat 官方文档](https://hardhat.org/docs)
- 仓库索引：[`docs/learning-resources.md`](../../docs/learning-resources.md)
