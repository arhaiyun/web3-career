import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteFiles = [
  "index.html",
  "assets/styles.css",
  "assets/app.mjs",
  "data/web3-transition-plan.json",
  "data/resources.json",
  "data/portfolio.json",
];

for (const file of siteFiles) {
  assert.ok(existsSync(resolve(root, file)), `${file} should exist`);
}

const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");
assert.match(indexHtml, /Web3 Career OS/);
assert.match(indexHtml, /assets\/styles\.css/);
assert.match(indexHtml, /assets\/app\.mjs/);
assert.match(indexHtml, /id="app"/);

const plan = JSON.parse(
  readFileSync(resolve(root, "data/web3-transition-plan.json"), "utf8"),
);
const resources = JSON.parse(
  readFileSync(resolve(root, "data/resources.json"), "utf8"),
);
const portfolio = JSON.parse(
  readFileSync(resolve(root, "data/portfolio.json"), "utf8"),
);

assert.equal(plan.persona.name, "arhaiyun");
assert.match(plan.persona.positioning, /Risk AI|风控|合规/);
assert.ok(plan.profileSignals.includes("北京理工大学 985 本硕"));
assert.ok(plan.profileSignals.includes("阿里巴巴 4 年"));
assert.ok(plan.profileSignals.includes("小红书 2.5-3 年"));
assert.ok(Array.isArray(plan.weeklyGoals) && plan.weeklyGoals.length >= 2);

const trackIds = plan.tracks.map((track) => track.id);
assert.deepEqual(trackIds, [
  "web3-foundation",
  "exchange-risk",
  "onchain-data",
  "compliance-aml",
  "ai-agent-risk",
  "portfolio-career",
]);

for (const track of plan.tracks) {
  assert.ok(track.title, `${track.id} should have a title`);
  assert.ok(track.outcome, `${track.id} should have an outcome`);
  assert.ok(track.whyLearn, `${track.id} should have whyLearn`);
  assert.ok(track.modules.length >= 3, `${track.id} should have modules`);
  for (const module of track.modules) {
    assert.ok(module.id, `${track.id} module should have id`);
    assert.ok(module.title, `${module.id} should have title`);
    assert.ok(module.task, `${module.id} should have an applied task`);
    assert.ok(module.feedbackPrompt, `${module.id} should have feedback prompt`);
    assert.ok(module.outputs?.length, `${module.id} should have outputs`);
    assert.ok(module.answerPath, `${module.id} should have answerPath`);
    assert.ok(
      existsSync(resolve(root, module.answerPath)),
      `${module.answerPath} should exist`,
    );
    const answerMd = readFileSync(resolve(root, module.answerPath), "utf8");
    assert.match(answerMd, /##.*架构图|```mermaid/);
  }
}

assert.ok(existsSync(resolve(root, "notes/answers/README.md")));
assert.ok(existsSync(resolve(root, "notes/answers/view.html")));

assert.ok(resources.resources.length >= 10);
for (const resource of resources.resources) {
  assert.ok(resource.id);
  assert.ok(resource.title);
  assert.ok(resource.type);
  assert.ok(resource.trackId);
}

assert.equal(portfolio.projects.length, 3);
for (const project of portfolio.projects) {
  assert.ok(project.title);
  assert.ok(project.targetRoles?.length);
  assert.ok(project.nextTasks?.length);
}

const app = await import(pathToFileURL(resolve(root, "assets/app.mjs")));

assert.equal(app.STORAGE_KEY, "web3CareerProgress.v1");
assert.equal(
  app.calculateTrackProgress(plan.tracks[0], {
    "web3-foundation.ethereum-basics": "done",
    "web3-foundation.wallets-transactions": "done",
  }),
  67,
);
assert.equal(app.calculateOverallProgress(plan.tracks, {}), 0);
assert.ok(app.getNextModule(plan.tracks, {}).id.startsWith("web3-foundation."));

const strongFeedback = app.scoreReflection(
  "我会把提现风控拆成账户、设备、链上地址和交易行为四类信号，并用人工复核闭环校准策略。CEX 场景下先拦截再升级。",
  ["提现", "账户", "链上地址", "人工复核"],
);
assert.ok(strongFeedback.score >= 50);
assert.ok(strongFeedback.dimensions?.length === 5);
assert.ok(strongFeedback.nextSteps?.length >= 1);

const weakFeedback = app.scoreReflection("看资料", ["链上地址"]);
assert.ok(weakFeedback.score < 50);
assert.match(weakFeedback.message, /具体|场景|信号/);

const analyzed = app.analyzeReflection(
  "在 CEX 提现场景，我会监控链上地址关联与异常行为信号，触发拦截后进入人工复核闭环，并记录审计日志用于复盘。",
  ["提现", "链上地址", "人工复核"],
);
assert.equal(analyzed.dimensions.length, 5);
assert.ok(analyzed.dimensions.every((d) => typeof d.score === "number"));
assert.ok(analyzed.overall >= 0 && analyzed.overall <= 100);

assert.ok(app.VIEWS.some((v) => v.id === "dashboard"));
assert.ok(app.VIEWS.some((v) => v.id === "path"));
assert.ok(app.statusLabels.review === "需要复盘");

const sample = plan.tracks[0].modules[0];
assert.match(
  app.answerViewerUrl(sample.answerPath),
  /notes\/answers\/view\.html\?f=/,
);
