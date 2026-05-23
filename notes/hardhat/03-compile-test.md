# Hardhat — 编译与测试

**标签：** #hardhat #testing

## 编译

在 `projects/hardhat-learning` 目录：

```bash
npx hardhat compile
```

成功后会生成 `artifacts/` 与 `cache/`（已忽略提交）。修改 Solidity 后需重新编译。

清理缓存（排错时有用）：

```bash
npx hardhat clean
```

## 测试

```bash
npx hardhat test
```

或运行单个文件：

```bash
npx hardhat test test/Greeter.js
```

### 测试在做什么（Greeter 示例）

1. 使用 `ethers.getContractFactory` 获取合约工厂。
2. `deploy()` 部署到 Hardhat 内置网络（内存链，速度快、无需 Gas 费）。
3. 调用 `greet()`、`setGreeting()` 并用 `expect` 断言返回值。

### 常用调试

```bash
npx hardhat test --grep "部署"
```

在测试里可临时 `console.log`（需 `import "hardhat/console.sol"` 仅在合约中；JS 侧直接用 `console.log`）。

## 要点小结

1. **先 compile 再 test**；CI 中通常两条命令顺序执行。
2. Hardhat Network 为每个测试用例提供 **干净状态**，互不影响。
3. 测试即文档：新人可通过 `test/` 理解合约预期行为。

## 关联实践

- 测试文件：[`projects/hardhat-learning/test/Greeter.js`](../../projects/hardhat-learning/test/Greeter.js)
