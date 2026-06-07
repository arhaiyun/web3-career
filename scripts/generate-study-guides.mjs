/**
 * 从参考答案 + 题库生成「系统学习讲义（含答案）」
 * 运行: node scripts/generate-study-guides.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const plan = JSON.parse(
  readFileSync(resolve(root, "data/web3-transition-plan.json"), "utf8"),
);
const outRoot = resolve(root, "notes/study-guides");

const TIER_GUIDE = [
  { tier: "P0", label: "必考核心", range: "1–20", action: "通读精讲后逐题理解，能口述" },
  { tier: "P1", label: "岗位常用", range: "21–45", action: "结合大厂项目经验举例" },
  { tier: "P2", label: "深化理解", range: "46–75", action: "能画架构图或流程图" },
  { tier: "P3", label: "扩展场景", range: "76–100", action: "了解边界案例与面试加分点" },
];

function answerHints(questions, tier, limit = 20) {
  return questions
    .filter((q) => q.tier === tier)
    .slice(0, limit)
    .map(
      (q) =>
        `### ${q.rank}. ${q.title}\n\n**题目：** ${q.prompt}\n\n**参考答案要点：**\n- 从业务场景出发，明确「谁、在什么环节、发生什么」\n- 列出 2–3 个可检测风险信号或判断依据\n- 给出可执行策略动作（拦截/复核/升级/放行）及人工兜底\n- 如涉及 Web3，补充链上/CEX/合规语境\n- 面试收尾：一个真实或合理虚构的量化结果\n`,
    )
    .join("\n");
}

function tierTable(questions) {
  const counts = { P0: 0, P1: 0, P2: 0, P3: 0 };
  for (const q of questions) counts[q.tier] = (counts[q.tier] ?? 0) + 1;
  return TIER_GUIDE.map(
    (t) =>
      `| ${t.tier} ${t.label} | rank ${t.range} | ${counts[t.tier] ?? 0} 题 | ${t.action} |`,
  ).join("\n");
}

function buildGuide(track, module, bank, answerMd) {
  const body = answerMd.replace(/^# .+\n+/, "").trim();
  const q = bank.questions;

  return `# ${module.title} — 系统学习讲义（含答案）

**所属轨道：** ${track.title}  
**学习阶段：** ① 先学本节讲义 → ② 再做工作台「学后验证题库」100 题

---

## 如何使用本讲义

1. **第一遍（学习）**：按章节通读「系统精讲」与「分 tier 参考答案」，对照架构图理解，不要跳过答案。
2. **第二遍（笔记）**：在工作台模块详情里记笔记，标记「已沉淀面试素材」。
3. **第三遍（验证）**：关闭讲义，在工作台用「学后验证题库」自测；P0 正确率建议 ≥ 80% 再进入 P1。

---

## 一、学习目标

- ${module.task}
- 复盘能力要求：${module.feedbackPrompt}
- 输出物：${(module.outputs ?? []).join("、")}

---

## 二、知识体系地图

\`\`\`mermaid
flowchart TB
  A[${module.title}] --> B[核心概念]
  A --> C[风控应用]
  A --> D[面试/输出物]
  B --> E[精讲章节]
  C --> F[CEX/Web3 场景]
  D --> G[100题验证]
  E --> G
  F --> G
\`\`\`

---

## 三、系统精讲（含答案）

> 以下内容整合模块参考答案，按知识结构编排，**可直接作为学习材料**。

${body}

---

## 四、分优先级参考答案速查（来自 100 题题库）

> 学习阶段可对照阅读；验证阶段请遮住答案自答。

### P0 必考核心（rank 1–20）

${answerHints(q, "P0", 20)}

### P1 岗位常用（rank 21–45）精选

${answerHints(q, "P1", 10)}

### P2 / P3 学习说明

- P2（rank 46–75）：${q.filter((x) => x.tier === "P2").length} 题，侧重深化理解与系统设计
- P3（rank 76–100）：${q.filter((x) => x.tier === "P3").length} 题，侧重扩展场景与边界案例
- 完整题目列表见工作台「学后验证题库」或 \`data/questions/${track.id}/${module.id}.json\`

---

## 五、100 题验证计划

| 优先级 | rank | 题量 | 建议 |
|--------|------|------|------|
${tierTable(q)}

**建议节奏：** 每天 P0 5 题 + P1 5 题，约 2 周完成 100 题首轮；错题回到第三节精讲复查。

---

## 六、学后自测清单

- [ ] 能不看答案口述本模块 3 个核心概念
- [ ] 能画 1 张与本模块相关的架构/流程图
- [ ] 能讲 1 个迁移到 Web3 的大厂风控案例
- [ ] 工作台 P0 题自测完成（${q.filter((x) => x.tier === "P0").length} 题）
- [ ] 工作台 P1–P3 题按需刷完

---

## 七、下一步

- 打开工作台 → 学习路径 → 本模块 → **学后验证题库（100 题）**
- 参考答案库（简版）：[\`notes/answers/${track.id}/${module.id}.md\`](../answers/${track.id}/${module.id === "kyc-kyb-kyc" ? "kyc-kyb-kyt" : module.id}.md)
`;
}

mkdirSync(outRoot, { recursive: true });
const manifest = { version: 1, guides: [] };

for (const track of plan.tracks) {
  const dir = resolve(outRoot, track.id);
  mkdirSync(dir, { recursive: true });

  for (const module of track.modules) {
    const answerFile =
      module.id === "kyc-kyb-kyc"
        ? resolve(root, "notes/answers/compliance-aml/kyc-kyb-kyt.md")
        : resolve(root, `notes/answers/${track.id}/${module.id}.md`);
    const bankFile = resolve(root, `data/questions/${track.id}/${module.id}.json`);

    const answerMd = readFileSync(answerFile, "utf8");
    const bank = JSON.parse(readFileSync(bankFile, "utf8"));
    const md = buildGuide(track, module, bank, answerMd);
    const rel = `${track.id}/${module.id}.md`;
    writeFileSync(resolve(outRoot, rel), md);

    manifest.guides.push({
      trackId: track.id,
      moduleId: module.id,
      path: `notes/study-guides/${rel}`,
      questionCount: bank.questionCount,
    });
  }
}

writeFileSync(resolve(outRoot, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// 更新 plan 中 studyGuidePath
for (const track of plan.tracks) {
  for (const module of track.modules) {
    module.studyGuidePath = `notes/study-guides/${track.id}/${module.id}.md`;
  }
}
writeFileSync(
  resolve(root, "data/web3-transition-plan.json"),
  JSON.stringify(plan, null, 2) + "\n",
);

// 索引 README
const indexRows = manifest.guides
  .map((g) => {
    const track = plan.tracks.find((t) => t.id === g.trackId);
    const mod = track.modules.find((m) => m.id === g.moduleId);
    return `| ${track.title} | ${mod.title} | [系统讲义](view.html?f=${g.trackId}/${g.moduleId}.md) | 100 题验证 |`;
  })
  .join("\n");

writeFileSync(
  resolve(outRoot, "README.md"),
  `# 系统学习讲义（含答案）

> **学习顺序：** 先读本目录讲义（含答案与架构图）→ 再在工作台做「学后验证题库」100 题。

| 轨道 | 模块 | 系统讲义 | 验证 |
|------|------|----------|------|
${indexRows}
`,
);

console.log(`Generated ${manifest.guides.length} study guides.`);
