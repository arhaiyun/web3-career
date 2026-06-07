/**
 * 生成各模块题库 JSON（每模块 100 题，按 rank 重要性排序）
 * 运行: node scripts/generate-question-banks.mjs
 */
const QUESTION_COUNT = 100;
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "data/questions");

const TIERS = [
  { max: 20, tier: "P0", label: "必考核心" },
  { max: 45, tier: "P1", label: "岗位常用" },
  { max: 75, tier: "P2", label: "深化理解" },
  { max: 100, tier: "P3", label: "扩展场景" },
];

function tierForRank(rank) {
  return TIERS.find((t) => rank <= t.max)?.tier ?? "P3";
}

function q(rank, category, title, prompt, keywords = []) {
  return {
    id: `q${String(rank).padStart(3, "0")}`,
    rank,
    tier: tierForRank(rank),
    category,
    title,
    prompt,
    keywords,
  };
}

/** @type {Record<string, { trackId: string, moduleId: string, title: string, items: ReturnType<typeof q>[] }>} */
const BANKS = {};

function register(trackId, moduleId, title, items) {
  const seed = [...items].sort((a, b) => a.rank - b.rank);
  const expanded = [...seed];
  while (expanded.length < QUESTION_COUNT) {
    const rank = expanded.length + 1;
    const base = seed[(rank - 1) % seed.length];
    expanded.push(
      q(
        rank,
        rank <= 20 ? base.category : rank <= 45 ? base.category : rank <= 75 ? "深化" : "扩展",
        `${base.title.replace(/ · .*$/, "").replace(/（.*?）$/, "")} · 训练 ${rank}`,
        `${base.prompt} 请补充业务场景、风险信号与可执行动作。`,
        base.keywords,
      ),
    );
  }
  const normalized = expanded.slice(0, QUESTION_COUNT).map((item, index) => ({
    ...item,
    rank: index + 1,
    id: `q${String(index + 1).padStart(3, "0")}`,
    tier: tierForRank(index + 1),
  }));
  BANKS[`${trackId}.${moduleId}`] = { trackId, moduleId, title, items: normalized };
}

// ─── web3-foundation / ethereum-basics ───
register("web3-foundation", "ethereum-basics", "Ethereum 账户、交易与 Gas", [
  q(1, "核心概念", "EOA 与合约账户的本质区别", "从资产控制、签名主体、风控调查入口三个角度对比 EOA 与 Contract Account。", ["EOA", "合约", "账户"]),
  q(2, "核心概念", "私钥、公钥、地址的推导关系", "说明三者关系，并解释为何链上风控主要追踪地址而非私钥。", ["私钥", "地址"]),
  q(3, "核心概念", "Nonce 如何防止重放攻击", "解释账户 nonce 递增规则，以及异常 nonce 可能意味什么风险。", ["nonce", "重放"]),
  q(4, "交易机制", "一笔以太坊交易的完整生命周期", "从构造、签名、广播、mempool、打包到确认，画出时序。", ["交易", "签名", "确认"]),
  q(5, "Gas", "Gas Limit 与 Gas Used 的区别", "说明为何失败交易仍消耗 gas，以及对用户资损分析的意义。", ["gas", "limit"]),
  q(6, "Gas", "EIP-1559 基础费与小费机制", "解释 base fee、priority fee 如何影响交易确认速度与成本。", ["EIP-1559", "gas"]),
  q(7, "风控应用", "CEX 充值为何需要确认数", "从链重组概率、双花风险解释不同币种/链的确认数策略。", ["充值", "确认数"]),
  q(8, "风控应用", "异常高 Gas 竞价的可能风险含义", "列举抢跑、紧急转出、被勒索付款等场景及检测思路。", ["gas", "异常"]),
  q(9, "交易机制", "交易哈希能证明什么、不能证明什么", "说明 tx hash 在审计、报案、交易所申诉中的作用与局限。", ["交易哈希"]),
  q(10, "核心概念", "calldata 在合约调用中的作用", "解释 data 字段与函数选择器，为何授权类攻击常出现在 calldata。", ["calldata", "合约"]),
  q(11, "风控应用", "pending 交易对提现风控的影响", "说明未确认交易、内存池可见性带来的抢跑与风控窗口。", ["pending", "mempool"]),
  q(12, "核心概念", "链重组对入账业务的影响", "解释 reorg 如何导致充值回滚，风控应如何处理。", ["重组", "充值"]),
  q(13, "面试实战", "如何向面试官口述 EOA 转账流程", "用 2 分钟口述，包含签名、gas、nonce、确认。", ["面试", "EOA"]),
  q(14, "交易机制", "Legacy 与 Type-2 交易差异", "对比传统 gasPrice 与 EIP-1559 交易结构。", ["EIP-1559"]),
  q(15, "风控应用", "大额转账与历史基线偏离", "设计如何基于地址历史行为识别异常转出。", ["异常", "基线"]),
  q(16, "核心概念", "状态根与 Merkle Patricia Trie 直觉", "不用数学推导，说明状态如何在区块头中承诺。", ["状态", "MPT"]),
  q(17, "Gas", "合约执行为何比转账更耗 gas", "解释 SSTORE、LOG、CALL 的成本直觉。", ["gas", "合约"]),
  q(18, "风控应用", "内部交易与外部交易的调查差异", "说明 trace 在资金追踪中的必要性。", ["trace", "内部交易"]),
  q(19, "交易机制", "交易失败常见原因分类", "列举 revert、out of gas、nonce 错误等及用户侧表现。", ["revert", "失败"]),
  q(20, "风控应用", "热钱包运营方的链上监控要点", "说明交易所热钱包余额、出金频率、异常合约交互监控。", ["热钱包", "CEX"]),
  q(21, "核心概念", "创世账户与预分配是否影响风控", "说明早期地址标签在调查中的参考价值。", ["标签"]),
  q(22, "Gas", "L2 上 gas 费与 L1 的差异", "解释 Rollup 场景下 gas 组成及对账要点。", ["L2", "gas"]),
  q(23, "面试实战", "把 nonce 机制类比到传统幂等设计", "用你熟悉的风控/支付系统经验做类比。", ["nonce", "幂等"]),
  q(24, "交易机制", "区块时间戳可信度与风控", "说明矿工可操纵范围及对时间敏感策略的影响。", ["时间戳"]),
  q(25, "风控应用", "如何设计充值延迟入账规则", "给出基于确认数+地址风险分的组合策略框架。", ["充值", "延迟"]),
  q(26, "扩展", "EIP-7702 对账户抽象的潜在影响", "简述未来账户模型变化可能对风控入口的影响。", ["账户抽象"]),
  q(27, "扩展", "MEV 与交易排序对用户的风险", "说明 sandwich、frontrun 与风控可见性。", ["MEV"]),
  q(28, "扩展", "批量交易 batch 在交易所归集场景", "说明 batch transfer 在资金链上的识别特征。", ["batch"]),
  q(29, "扩展", "JSON-RPC 常用查询在调查中的用法", "列举 eth_getTransaction、getReceipt、getBalance 场景。", ["RPC"]),
  q(30, "扩展", "事件日志 Logs 在风控中的价值", "说明如何通过 Transfer 事件构建资金链。", ["事件", "日志"]),
  q(31, "深化", "RBF 替换交易的风险含义", "解释 replace-by-fee 对充值追踪的干扰。", ["RBF"]),
  q(32, "深化", "合约创建交易识别", "如何通过合约创建定位新恶意合约。", ["合约创建"]),
  q(33, "深化", "自毁 SELFDESTRUCT 后的资金去向", "说明调查时如何处理合约自毁场景。", ["自毁"]),
  q(34, "深化", "零值转账 spam 的信号意义", "解释 dusting attack 原理与标记策略。", ["dusting"]),
  q(35, "深化", "同一区块多笔关联交易的聚类", "说明如何从共现区块提取关联信号。", ["聚类"]),
  q(36, "岗位应用", "链上索引延迟对实时风控的影响", "说明 indexer lag 下的产品降级策略。", ["索引", "延迟"]),
  q(37, "岗位应用", "多链地址格式差异带来的运营风险", "以 EVM 同名地址误区为例说明。", ["多链", "地址"]),
  q(38, "岗位应用", "测试网交易与主网混淆风险", "说明内部环境隔离与链 ID 校验。", ["测试网"]),
  q(39, "岗位应用", "钱包 SDK 集成中的签名透明化", "产品应如何向用户展示将签名的内容。", ["钱包", "签名"]),
  q(40, "岗位应用", "链上证明在合规案件中的证据力", "说明 tx 作为电子证据的保存要点。", ["证据"]),
  q(41, "扩展场景", "Staking 提款与提现风控异同", "对比质押提款与普通转账的风控点。", ["staking"]),
  q(42, "扩展场景", "LST 再质押产品的资金流复杂性", "说明多层凭证对追踪的挑战。", ["LST"]),
  q(43, "扩展场景", "账户抽象钱包的签名验证变化", "说明 ERC-4337 UserOperation 调查入口变化。", ["4337"]),
  q(44, "扩展场景", "跨链消息与原生资产转账区别", "避免在调查中混淆 messaging 与 asset bridge。", ["跨链"]),
  q(45, "扩展场景", "Flashbots 私有交易对可见性影响", "说明私有 mempool 对监控盲区。", ["Flashbots"]),
  q(46, "复盘", "画出你理解的充值入账时序图", "包含链上确认、地址筛查、账本入账。", ["复盘", "充值"]),
  q(47, "复盘", "解释一次 gas 费诈骗用户案例", "用业务语言复盘用户为何被诱导支付高 gas。", ["案例"]),
  q(48, "复盘", "若 nonce 卡住，客服应如何指引", "给出非技术用户可操作 checklist。", ["客服"]),
  q(49, "复盘", "比较 ETH 与 ERC20 转账调查差异", "说明 token contract 介入后的额外字段。", ["ERC20"]),
  q(50, "复盘", "设计链上交易异常告警 5 条", "列出告警名、触发条件、处置动作。", ["告警"]),
  q(51, "边缘", "叔块奖励是否影响风控统计", "说明 PoW 遗留概念在以太坊历史上的调查注意点。", ["叔块"]),
  q(52, "边缘", "硬分叉前后双花历史案例启示", "总结对确认策略的产品教训。", ["硬分叉"]),
  q(53, "边缘", "离线签名交易广播延迟风险", "说明冷签名流程对时效的影响。", ["离线签名"]),
  q(54, "边缘", "同一 EOA 多设备钱包并发发送", "nonce 冲突如何表现为用户侧失败。", ["并发"]),
  q(55, "边缘", "链上随机性对活动风控的干扰", "说明 blockhash 误用与博彩类风险。", ["随机性"]),
  q(56, "边缘", "矿工可提取价值与用户损失边界", "区分用户被夹与用户主动滑点。", ["MEV"]),
  q(57, "边缘", "历史交易归档节点查询成本", "调查旧案时数据源选择。", ["归档"]),
  q(58, "边缘", "RPC 供应商故障时的风控降级", "设计只读模式与队列重试。", ["RPC", "降级"]),
  q(59, "边缘", "钱包地址 checksum 错误导致的问题", "说明 EIP-55 与误转账追回难度。", ["checksum"]),
  q(60, "边缘", "总结本模块对 CEX 风控的三条最重要启示", "用面试语言归纳 rank1-12 的精髓。", ["总结"]),
]);

// Additional modules: use helper to build from templates + module-specific cores
function expandModule(trackId, moduleId, title, cores, extraTemplates) {
  const items = [...cores];
  let rank = cores.length + 1;
  for (const t of extraTemplates) {
    if (rank > 60) break;
    items.push(q(rank++, t.cat, t.title, t.prompt, t.kw ?? []));
  }
  while (rank <= 60) {
    const base = cores[(rank - 1) % cores.length];
    items.push(
      q(
        rank,
        "巩固练习",
        `${base.title}（变体 ${rank - cores.length}）`,
        `${base.prompt} 请补充一个 CEX 或调查场景例子。`,
        base.keywords,
      ),
    );
    rank++;
  }
  register(trackId, moduleId, title, items);
}

// wallets-transactions - 60 core questions (condensed batches)
register("web3-foundation", "wallets-transactions", "钱包、私钥、授权与钓鱼入口", [
  q(1, "核心", "助记词与私钥的保管边界", "说明为何助记词泄露等于全链资产失控。", ["助记词", "私钥"]),
  q(2, "核心", "热钱包 vs 冷钱包运营差异", "从风控角度对比在线签名与离线签名风险面。", ["热钱包", "冷钱包"]),
  q(3, "核心", "Token Approval 无限授权风险", "解释 approve(max) 如何被恶意 spender 利用。", ["approval", "授权"]),
  q(4, "核心", "Permit 离线签名授权链路", "说明无 on-chain approve 的授权如何发生。", ["permit"]),
  q(5, "核心", "钓鱼网站仿冒 DApp 识别", "列举 URL、证书、合约地址不一致等信号。", ["钓鱼"]),
  q(6, "攻击入口", "假客服索要助记词套路", "描述典型话术与用户教育要点。", ["社工"]),
  q(7, "攻击入口", "恶意浏览器扩展窃取签名", "说明扩展权限与风险。", ["扩展"]),
  q(8, "攻击入口", "剪贴板劫持替换地址", "说明复制粘贴转账的高危场景与防护。", ["剪贴板"]),
  q(9, "攻击入口", "假空投诱导授权", "描述空投 scam 的完整链路。", ["空投"]),
  q(10, "攻击入口", "NFT 假 mint 授权盗币", "说明 setApprovalForAll 在 NFT 场景的滥用。", ["NFT"]),
  q(11, "检测", "Approval 事件监控指标", "设计监控哪些 spender、额度、频率。", ["监控", "approval"]),
  q(12, "检测", "新注册域名相似度检测", "说明 homograph 与 typosquatting。", ["域名"]),
  q(13, "检测", "钱包弹窗模拟执行 preview", "产品如何展示将执行的合约调用。", ["模拟"]),
  q(14, "检测", "恶意合约字节码特征", "列举 proxy、自毁、隐藏 mint 等启发式。", ["字节码"]),
  q(15, "检测", "多链同时转出被盗模式", "说明私钥泄露后的典型时间线。", ["盗币"]),
  q(16, "CEX关联", "赃款流入交易所的后续 KYT", "说明平台收到被盗资金后的处置。", ["KYT", "CEX"]),
  q(17, "CEX关联", "用户申诉被盗的举证清单", "平台应要求哪些链上证据。", ["申诉"]),
  q(18, "产品", "风险提示分级设计", "如何区分信息、警告、阻断三级。", ["产品"]),
  q(19, "产品", "授权管理页应展示哪些字段", "spender、额度、链、首次授权时间等。", ["产品"]),
  q(20, "产品", "Revoke 工具集成价值", "说明 revoke.cash 类产品在风控教育中的作用。", ["revoke"]),
  ...Array.from({ length: 40 }, (_, i) => {
    const r = 21 + i;
    const topics = [
      ["硬件钱包", "解释助记词录入仅在设备内完成的安全意义。", ["硬件钱包"]],
      ["多签钱包", "说明 Gnosis Safe 在机构风控中的价值。", ["多签"]],
      ["社交恢复", "讨论恢复机制带来的新攻击面。", ["恢复"]],
      ["WalletConnect", "说明会话劫持与钓鱼风险。", ["WalletConnect"]],
      ["SIWE 登录", "解释 Sign-In With Ethereum 与会话盗用。", ["SIWE"]],
      ["地址簿", "白名单地址对误转账防护。", ["地址簿"]],
      ["生物识别", "移动端钱包生物识别的局限。", ["生物识别"]],
      ["云备份", "iCloud 备份助记词的风险案例。", ["备份"]],
      ["MPC 钱包", "说明 MPC 不等于无单点风险。", ["MPC"]],
      ["托管钱包", "CEX 托管与自托管风控边界。", ["托管"]],
    ];
    const t = topics[i % topics.length];
    return q(r, r <= 30 ? "深化" : "扩展", `${t[0]}（题 ${r}）`, t[1], t[2]);
  }),
]);

// Continue registering remaining modules with substantive 60-question sets
// cex-dex-map
register("web3-foundation", "cex-dex-map", "CEX / DEX / DeFi 业务地图", [
  q(1, "地图", "CEX 订单簿 vs DEX AMM 定价差异", "说明价格发现机制不同带来的操纵面差异。", ["CEX", "DEX", "AMM"]),
  q(2, "地图", "托管与非托管的本质边界", "用户资产在法律与技术层面分别由谁控制。", ["托管"]),
  q(3, "地图", "充值提现为何是 CEX 风控核心", "对比链上 swap 的风控责任主体。", ["充值", "提现"]),
  q(4, "地图", "DeFi 借贷清算流程", "说明清算 bot 与连锁风险。", ["借贷", "清算"]),
  q(5, "地图", "稳定币在 CEX 与 DeFi 的角色", "说明脱锚事件的风控响应。", ["稳定币"]),
  q(6, "对比", "CEX 内部账本欺诈与链上透明性", "说明各自调查手段。", ["账本"]),
  q(7, "对比", "DEX 滑点保护与用户教育", "产品如何提示 impermanent loss 与滑点。", ["滑点"]),
  q(8, "对比", "上币流程中的合约审计作用", "风控在 listing 中的职责。", ["上币"]),
  q(9, "对比", "Launchpad 与 IEO 套利风险", "关联活动风控经验。", ["Launchpad"]),
  q(10, "对比", "OTC 台与订单簿交易合规差异", "说明场外交易监控难点。", ["OTC"]),
  ...Array.from({ length: 50 }, (_, i) => {
    const r = 11 + i;
    const cats = ["衍生品", "期权", "永续", "网格", "做市", "跨链桥", "包装资产", "LP", "治理", "闪电贷"];
    const c = cats[i % cats.length];
    return q(r, r <= 25 ? "业务" : "扩展", `${c} 业务的风控关注点（${r}）`, `说明 ${c} 在 CEX/DEX/DeFi 中对应的风险信号与调查入口。`, [c]);
  }),
]);

// exchange-risk modules - 60 each with focused cores + expansion
function makeExchangeRiskBanks() {
  const withdrawal = [
    ["提现决策树", "设计从请求到链上广播的完整决策树。", ["提现", "决策"]],
    ["四信号融合", "账户/设备/行为/链上地址如何加权。", ["信号"]],
    ["人工复核 SLA", "不同风险等级对应的处理时效。", ["SLA", "复核"]],
    ["误伤申诉", "申诉通过后如何回写白名单。", ["误伤"]],
    ["限额体系", "日限额、单笔限额与 VIP 差异。", ["限额"]],
    ["旅行规则", "跨境提现的合规数据交换。", ["旅行规则"]],
    ["地址白名单", "首次提现地址冷却期设计。", ["白名单"]],
    ["API 提现", "API key 权限与提现风控联动。", ["API"]],
    ["批量提现", "机构客户批量付款的风控。", ["批量"]],
    ["夜间规则", "非工作时间加强验证的理由与实现。", ["夜间"]],
  ];
  register("exchange-risk", "withdrawal-risk", "提现风控决策链路",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = withdrawal[i % withdrawal.length];
      return q(r, r <= 12 ? "P0" : r <= 30 ? "策略" : "扩展", `提现风控：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const sybil = [
    ["多账号检测", "设备、IP、证件、行为四要素关联。", ["Sybil", "多账号"]],
    ["空投女巫", "链上领取与链下身份映射难点。", ["空投"]],
    ["返佣套利", "自邀自充模式识别。", ["返佣"]],
    ["Gas 同源", "资助 gas 的地址聚类。", ["gas", "聚类"]],
    ["行为同构", "脚本化任务完成序列相似度。", ["行为"]],
    ["资金归集", "多地址归集到 hub 的图特征。", ["归集"]],
    ["延迟发放", "T+1 回扫取消资格策略。", ["延迟"]],
    ["真人验证", "活体与证件在 Web3 活动的适用边界。", ["KYC"]],
    ["社区举报", "举报信号与自动策略结合。", ["举报"]],
    ["追偿机制", "已发放奖励的追回路径。", ["追偿"]],
  ];
  register("exchange-risk", "sybil-bonus-abuse", "羊毛党、Sybil 与活动套利",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = sybil[i % sybil.length];
      return q(r, r <= 12 ? "P0" : "策略", `活动风控：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const wash = [
    ["自成交定义", "法律与技术层面对 wash trading 的定义。", ["wash trading"]],
    ["对敲检测", "A↔B 往返成交图特征。", ["对敲"]],
    ["净头寸", "高频成交但净风险敞口接近零。", ["净头寸"]],
    ["做市豁免", "合法做市与刷量边界。", ["做市"]],
    ["API 刷量", "程序化对倒的延迟特征。", ["API"]],
    ["关联账户", "充提关联、邀请关联在成交上的应用。", ["关联"]],
    ["价格操纵", "拉盘砸盘与异常成交量联动。", ["操纵"]],
    ["处置梯度", "警告、限频、取消奖励、封号。", ["处置"]],
    ["看板指标", "设计 8 个核心监控指标。", ["看板"]],
    ["监管报送", "何时需要向合规报送市场操纵线索。", ["监管"]],
  ];
  register("exchange-risk", "market-manipulation", "Wash Trading 与市场操纵",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = wash[i % wash.length];
      return q(r, r <= 12 ? "P0" : "监控", `市场操纵：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );
}
makeExchangeRiskBanks();

function makeOnchainBanks() {
  const labeling = [
    ["标签分层", "实体/行为/风险/关系四层标签体系。", ["标签"]],
    ["置信度", "L1-L4 置信度如何影响自动动作。", ["置信度"]],
    ["情报源", "制裁名单、情报商、启发式、众包。", ["情报"]],
    ["误伤处理", "用户申诉与标签降级流程。", ["误伤"]],
    ["标签衰减", "长期无风险行为降低权重。", ["衰减"]],
    ["交易所热钱包", "官方公布地址的维护机制。", ["热钱包"]],
    ["Mixer 标签", "Tornado 等交互如何打分。", ["Mixer"]],
    ["DeFi 协议标签", "Router、Pool 的实体归类。", ["DeFi"]],
    ["钓鱼合约库", "恶意 spender 黑名单运营。", ["钓鱼"]],
    ["标签版本", "审计需记录标签版本号。", ["审计"]],
  ];
  register("onchain-data", "address-labeling", "地址标签与风险画像",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = labeling[i % labeling.length];
      return q(r, r <= 12 ? "P0" : "体系", `地址标签：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const flow = [
    ["资金流追踪", "BFS/DFS 多跳查询策略。", ["资金流"]],
    ["Peel Chain", "剥离链识别与图特征。", ["peel"]],
    ["Mixer 进出", "存款提款时间窗口关联。", ["Mixer"]],
    ["跨链桥追踪", "桥合约锁定与释放映射。", ["跨链"]],
    ["CEX 入金", "终端节点识别与报送。", ["入金"]],
    ["可视化", "调查员视图的节点边设计。", ["可视化"]],
    ["性能", "大图遍历的分页与缓存。", ["性能"]],
    ["证据导出", "PDF 报告包含哪些字段。", ["证据"]],
    ["受害者溯源", "从受害 tx 向后追踪步骤。", ["溯源"]],
    ["误报", "正常聚合器被误判为 hub。", ["误报"]],
  ];
  register("onchain-data", "fund-flow", "资金流追踪与可视化",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = flow[i % flow.length];
      return q(r, r <= 12 ? "P0" : "追踪", `资金流：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const graph = [
    ["图建模", "节点类型与边类型设计。", ["图谱"]],
    ["权重", "金额、次数、时间衰减组合。", ["权重"]],
    ["连通分量", "快速找团伙。", ["连通分量"]],
    ["Louvain", "社区发现算法适用场景。", ["Louvain"]],
    ["中心性", "betweenness 找枢纽地址。", ["中心性"]],
    ["设备图迁移", "把设备关联方法论搬到链上。", ["迁移"]],
    ["实时 vs 离线", "T+0 告警与 T+1 聚类分工。", ["实时"]],
    ["图数据库", "Neo4j vs 自研选型考量。", ["图数据库"]],
    ["查询 API", "调查员 3-hop 查询接口设计。", ["API"]],
    ["隐私", "图数据访问权限分级。", ["权限"]],
  ];
  register("onchain-data", "graph-risk", "图谱风控与关联发现",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = graph[i % graph.length];
      return q(r, r <= 12 ? "P0" : "图谱", `图风控：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );
}
makeOnchainBanks();

function makeComplianceBanks() {
  const kyc = [
    ["KYC 分级", "L1/L2/L3 差异化限额。", ["KYC"]],
    ["KYB UBO", "受益人穿透核实。", ["KYB", "UBO"]],
    ["KYT 交易监控", "链上链下交易关联。", ["KYT"]],
    ["制裁筛查", "OFAC 等名单更新频率。", ["制裁"]],
    ["PEP 识别", "政治公众人物额外尽职。", ["PEP"]],
    ["开户点", "注册、充值、提现检查点列表。", ["开户"]],
    ["持续尽调", "定期复核触发条件。", ["尽调"]],
    ["高风险国家", "地理风险加权。", ["地理"]],
    ["假证件", "OCR+活体+人工抽检。", ["证件"]],
    ["企业客户", "机构账户特殊合规流。", ["机构"]],
  ];
  register("compliance-aml", "kyc-kyb-kyc", "KYC / KYB / KYT 基础",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = kyc[i % kyc.length];
      return q(r, r <= 12 ? "P0" : "合规", `合规基础：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const aml = [
    ["分层转账", "Layering 模式与 hop 特征。", ["分层", "AML"]],
    ["快进快出", "停留时间与金额匹配。", ["快进快出"]],
    ["结构化", "略低于阈值的拆分。", ["结构化"]],
    ["Mixer 使用", "混币前后特征。", ["Mixer"]],
    ["黑名单", "暗网市场关联地址。", ["黑名单"]],
    ["SAR 报送", "可疑活动报告触发条件。", ["SAR"]],
    ["场景库", "维护 6+ 类可疑场景模板。", ["场景"]],
    ["评分卡", "AML 分数与人工升级阈值。", ["评分"]],
    ["跨境", "多司法辖区规则差异。", ["跨境"]],
    ["DeFi 合规", "链上匿名性对 KYC 的挑战。", ["DeFi"]],
  ];
  register("compliance-aml", "aml-scenarios", "AML 可疑场景建模",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = aml[i % aml.length];
      return q(r, r <= 12 ? "P0" : "AML", `AML 场景：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const review = [
    ["案件字段", "Review 台必备字段清单。", ["案件"]],
    ["证据链", "链上证据与链下证据拼接。", ["证据"]],
    ["结论类型", "误报、可疑、确认三级。", ["结论"]],
    ["升级路径", "L1→L2→MLRO。", ["升级"]],
    ["审计日志", "不可篡改操作记录。", ["审计"]],
    ["SLA", "不同优先级处理时限。", ["SLA"]],
    ["协作", "风控与合规分工界面。", ["协作"]],
    ["批量结案", "误报批量关闭的风险控制。", ["批量"]],
    ["质检", "二次抽检比例设计。", ["质检"]],
    ["报表", "监管报表从案件系统导出。", ["报表"]],
  ];
  register("compliance-aml", "case-review", "案件审核与处置工作流",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = review[i % review.length];
      return q(r, r <= 12 ? "P0" : "流程", `案件审核：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );
}
makeComplianceBanks();

function makeAgentBanks() {
  const copilot = [
    ["输入 Schema", "案件上下文 JSON 字段设计。", ["输入", "Agent"]],
    ["工具清单", "链上查询、规则解释、历史案件。", ["工具"]],
    ["输出 Schema", "摘要、建议、缺失证据结构。", ["输出"]],
    ["人工确认闸", "写操作必须 HITL。", ["人工确认"]],
    ["权限", "工具 RBAC 设计。", ["权限"]],
    ["编排", "Dify/LangGraph 选型。", ["编排"]],
    ["多轮对话", "调查员追问上下文保持。", ["对话"]],
    ["Citation", "强制引用 tx/rule。", ["引用"]],
    ["延迟", "SLA 与超时降级。", ["延迟"]],
    ["成本", "Token 成本与案件类型关系。", ["成本"]],
  ];
  register("ai-agent-risk", "risk-copilot", "Risk Copilot 产品形态",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = copilot[i % copilot.length];
      return q(r, r <= 12 ? "P0" : "产品", `Risk Copilot：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const guard = [
    ["自动封禁红线", "Agent 不可自动执行的 6 类动作。", ["红线"]],
    ["幻觉防护", "无数据必须说 unknown。", ["幻觉"]],
    ["提示注入", "恶意案件描述攻击防护。", ["注入"]],
    ["工具越权", "禁止调用未授权 API。", ["越权"]],
    ["PII 脱敏", "输出与日志脱敏规则。", ["PII"]],
    ["红队", "对抗测试用例设计。", ["红队"]],
    ["审计", "prompt/response 全量留存。", ["审计"]],
    ["降级", "模型故障时纯规则模式。", ["降级"]],
    ["多模型", "主备模型切换策略。", ["模型"]],
    ["合规审批", "新工具上线审批流。", ["审批"]],
  ];
  register("ai-agent-risk", "guardrails", "AI 风险护栏与红队",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = guard[i % guard.length];
      return q(r, r <= 12 ? "P0" : "护栏", `AI 护栏：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const eval_ = [
    ["事实准确", "可验证陈述正确率。", ["准确性"]],
    ["信号召回", "关键风险信号覆盖率。", ["召回"]],
    ["引用覆盖", "高影响结论 citation 率。", ["引用"]],
    ["采纳率", "分析师采纳建议比例。", ["采纳"]],
    ["耗时", "有/无 Copilot 处理时长。", ["效率"]],
    ["金标准集", "脱敏案件标注流程。", ["标注"]],
    ["红队集", "对抗样本通过率。", ["红队"]],
    ["发布门禁", "上线前指标阈值。", ["门禁"]],
    ["A/B", "影子模式对比实验。", ["实验"]],
    ["反馈环", "人工纠错回灌训练。", ["反馈"]],
  ];
  register("ai-agent-risk", "evaluation", "AI 反馈质量评估",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = eval_[i % eval_.length];
      return q(r, r <= 12 ? "P0" : "评估", `AI 评估：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );
}
makeAgentBanks();

function makePortfolioBanks() {
  const portfolio = [
    ["选题矩阵", "项目×岗位×业务价值三维选型。", ["作品集"]],
    ["链上看板", "On-chain Intelligence 方向 Demo。", ["看板"]],
    ["规则引擎", "CEX 提现风控 Demo。", ["规则引擎"]],
    ["AI Copilot", "Compliance Agent Demo。", ["Agent"]],
    ["README 标准", "项目文档必含模块清单。", ["README"]],
    ["Demo 视频", "3 分钟演示脚本结构。", ["Demo"]],
    ["里程碑", "6 个月 roadmap 拆解。", ["roadmap"]],
    ["技术债", "MVP 与生产差距说明。", ["技术债"]],
    ["开源策略", "哪些可公开哪些需脱敏。", ["开源"]],
    ["评估反馈", "面试官视角 critique。", ["反馈"]],
  ];
  register("portfolio-career", "portfolio-map", "作品集选题矩阵",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = portfolio[i % portfolio.length];
      return q(r, r <= 12 ? "P0" : "作品集", `作品集：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const resume = [
    ["量化成果", "拦截率、资损、QPS、SLA 数字。", ["量化"]],
    ["Web3 化动词", "把「审核」改成「KYT/链上调查」等。", ["简历"]],
    ["风控引擎", "强调规则引擎与实时特征。", ["引擎"]],
    ["AI 经验", "Agent/质检/摘要项目突出。", ["AI"]],
    ["内容安全", "Trust & Safety 与合规关联。", ["内容安全"]],
    ["规模", "日决策量、覆盖业务线。", ["规模"]],
    ["一页原则", "资深工程师简历结构。", ["结构"]],
    ["项目区", "3 个 Web3 项目 bullet。", ["项目"]],
    ["摘要区", "3 行定位语。", ["摘要"]],
    ["英文版", "外企岗位英文简历要点。", ["英文"]],
  ];
  register("portfolio-career", "resume-rewrite", "简历 Web3 化",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = resume[i % resume.length];
      return q(r, r <= 12 ? "P0" : "简历", `简历：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );

  const star = [
    ["提现峰值", "大促提现风控 STAR。", ["STAR", "提现"]],
    ["活动 Sybil", "多账号团伙识别 STAR。", ["Sybil"]],
    ["内容审核", "机审+人审 STAR。", ["审核"]],
    ["AI 试点", "Agent 辅助调查 STAR。", ["Agent"]],
    ["规则引擎", "DSL 升级 STAR。", ["引擎"]],
    ["误伤治理", "申诉闭环 STAR。", ["误伤"]],
    ["跨团队协作", "风控+产品+法务 STAR。", ["协作"]],
    ["转型项目", "Web3 学习作品集 STAR。", ["转型"]],
    ["2 分钟版", "每个故事压缩口播稿。", ["口播"]],
    ["技术取舍", "每个故事一条取舍亮点。", ["取舍"]],
  ];
  register("portfolio-career", "interview-stories", "面试故事库",
    Array.from({ length: 60 }, (_, i) => {
      const r = i + 1;
      const b = star[i % star.length];
      return q(r, r <= 12 ? "P0" : "STAR", `面试故事：${b[0]}（${r}）`, b[1], b[2]);
    }),
  );
}
makePortfolioBanks();

// Write files
mkdirSync(outDir, { recursive: true });
const manifest = { version: 1, banks: [] };

for (const bank of Object.values(BANKS)) {
  const relPath = `${bank.trackId}/${bank.moduleId}.json`;
  const payload = {
    trackId: bank.trackId,
    moduleId: bank.moduleId,
    moduleTitle: bank.title,
    questionCount: bank.items.length,
    tiers: TIERS.map((t) => ({ tier: t.tier, label: t.label, upToRank: t.max })),
    questions: bank.items,
  };
  const dir = resolve(outDir, bank.trackId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(outDir, relPath), JSON.stringify(payload, null, 2) + "\n");
  manifest.banks.push({
    trackId: bank.trackId,
    moduleId: bank.moduleId,
    path: `data/questions/${relPath}`,
    questionCount: bank.items.length,
  });
}

writeFileSync(resolve(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const total = manifest.banks.reduce((s, b) => s + b.questionCount, 0);
console.log(`Generated ${manifest.banks.length} banks, ${total} questions total.`);
