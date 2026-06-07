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

assert.equal(plan.persona.name, "arhaiyun");
assert.match(plan.persona.positioning, /Risk AI|风控|合规/);
assert.ok(plan.profileSignals.includes("北京理工大学 985 本硕"));
assert.ok(plan.profileSignals.includes("阿里巴巴 4 年"));
assert.ok(plan.profileSignals.includes("小红书 2.5-3 年"));

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
  assert.ok(track.modules.length >= 3, `${track.id} should have modules`);
  for (const module of track.modules) {
    assert.ok(module.id, `${track.id} module should have id`);
    assert.ok(module.title, `${module.id} should have title`);
    assert.ok(module.task, `${module.id} should have an applied task`);
    assert.ok(module.feedbackPrompt, `${module.id} should have feedback prompt`);
  }
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
  "我会把提现风控拆成账户、设备、链上地址和交易行为四类信号，并用人工复核闭环校准策略。",
  ["提现", "账户", "链上地址", "人工复核"],
);
assert.ok(strongFeedback.score >= 75);
assert.match(strongFeedback.message, /可执行|面试|闭环/);

const weakFeedback = app.scoreReflection("看资料", ["链上地址"]);
assert.ok(weakFeedback.score < 50);
assert.match(weakFeedback.message, /再具体|信号|案例/);
