# Web3 Risk AI — 4 周聚焦面试计划

**前提：** 主简历 Web3 版已有一稿（[`resume-web3-risk-ai.md`](../resume-web3-risk-ai.md)）  
**节奏：** 每周 5 天 × 25–45 min（见 [Week 01 drill](./week-01-drill.md)）  
**验收：** 每周结束能完成 1 次 45 min 模拟（自问自答 + 录音）

---

## 总验收（第 4 周末）

- [ ] 6 个 STAR 故事（#7 #6 #2 #1 #5 #4）各 2 分钟中文 + 核心句英文  
- [ ] 3 作品集各 2 分钟 + 5 个追问  
- [ ] 2 套 System Design 口述：① 提现风控决策链 ② Compliance Agent 架构  
- [ ] 20 道 Web3 Risk 高频题无停顿要点  
- [ ] 目标公司清单 10 家 + 每家用哪版简历  

---

## Week 1 — 叙事与映射（「为什么是你」）

| 产出 | 动作 |
|------|------|
| Web3 版 2 分钟自我介绍 | 基于 [`job-positioning.md`](../job-positioning.md) 改写 Crypto 关键词 |
| 故事 #7  polished | 迁移叙事：传统风控 → 链上+链下 |
| 故事 #6  polished | 活动反作弊 → Sybil/返佣/空投 |
| 经历映射表背熟 | [`experience-mapping.md`](./experience-mapping.md) 全文 |

**模拟题：** 为什么不做 Solidity？为什么来 Web3 风控？阿里和小红书经历怎么迁移？

---

## Week 2 — 证据链 + Agent（「你怎么做 AI 风控」）

| 产出 | 动作 |
|------|------|
| 故事 #2、#1  polished | 证据链 → AML case；Agent → Copilot |
| 作品集 pitch #3 | AI 合规调查助手（[`portfolio-pitches.md`](./portfolio-pitches.md)） |
| SD 口述 v1 | Compliance Agent：工具边界、人工兜底、审计 |
| 模块学习 | `ai-agent-risk` 讲义 + 20 题验证 |

**模拟题：** Agent 如何防止幻觉自动放行？案件摘要如何评估？和内容审核 Agent 异同？

---

## Week 3 — 实时决策 + 链上（「你怎么做 CEX 风控」）

| 产出 | 动作 |
|------|------|
| 故事 #5、#4  polished | 低延迟特征；误伤/拦截 tradeoff |
| 作品集 pitch #2 | 提现规则引擎 |
| SD 口述 v1 | 提现风控：信号 → 规则 → 人工 → 审计 |
| 模块学习 | `exchange-risk` + `onchain-data` 各 20 题 |

**模拟题：** 提现拦截规则如何排序？链上地址标签如何进策略？误伤升高怎么办？

---

## Week 4 — 整合模拟 + 投递

| 产出 | 动作 |
|------|------|
| 作品集 pitch #1 | 链上地址风险画像 |
| 45 min 完整模拟 × 2 | TDD(作品#2) + 行为(#6,#7) + SD(提现) |
| 追问清单 | [`question-bank.md`](./question-bank.md) 标「已练」 |
| 投递 | 10 家 + 定制 cover 要点各 3 条 |

---

## 与学习工作台的关系

| 轨道 | 面试中的用法 |
|------|----------------|
| `exchange-risk` | Week 3 技术追问 |
| `onchain-data` | Week 3–4 链上图谱题 |
| `compliance-aml` | Week 2 AML/KYT 题 |
| `ai-agent-risk` | Week 2 Agent 题 |
| `portfolio-career` | 全程故事与简历题 |

打开工作台：`npm run serve` → **Portfolio & Career** 轨道

---

## 英文（可选并行）

国际 CEX / 远程岗：同一故事在 `yunmu-english-lab` Week 2–3 用英文 deep dive 复述。  
本计划 **不重复** 教英文，只标记需英文输出的故事编号。
