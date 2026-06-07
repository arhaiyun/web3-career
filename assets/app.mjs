export const STORAGE_KEY = "web3CareerProgress.v1";

const statusCycle = ["todo", "doing", "done"];
const statusLabels = {
  todo: "未开始",
  doing: "进行中",
  done: "已完成",
};

let state = {
  plan: null,
  activeTrackId: null,
  progress: {},
  reflection: "",
  feedback: null,
};

export function moduleKey(trackId, moduleId) {
  return `${trackId}.${moduleId}`;
}

export function calculateTrackProgress(track, progress) {
  const doneCount = track.modules.filter(
    (module) => progress[moduleKey(track.id, module.id)] === "done",
  ).length;
  return Math.round((doneCount / track.modules.length) * 100);
}

export function calculateOverallProgress(tracks, progress) {
  const modules = tracks.flatMap((track) =>
    track.modules.map((module) => moduleKey(track.id, module.id)),
  );
  if (modules.length === 0) return 0;
  const doneCount = modules.filter((key) => progress[key] === "done").length;
  return Math.round((doneCount / modules.length) * 100);
}

export function getNextModule(tracks, progress) {
  for (const track of tracks) {
    const next = track.modules.find(
      (module) => progress[moduleKey(track.id, module.id)] !== "done",
    );
    if (next) {
      return {
        ...next,
        id: moduleKey(track.id, next.id),
        trackId: track.id,
        trackTitle: track.title,
      };
    }
  }
  return null;
}

export function scoreReflection(text, keywords) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) {
    return {
      score: 0,
      message: "先写下你的判断。最好包含场景、信号、动作和复盘闭环。",
    };
  }

  const keywordHits = keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase()),
  ).length;
  const lengthScore = Math.min(35, Math.round(normalized.length / 4));
  const keywordScore = Math.round((keywordHits / keywords.length) * 45);
  const structureScore = /因为|所以|如果|然后|闭环|复核|指标|信号|案例/.test(
    normalized,
  )
    ? 20
    : 0;
  const score = Math.min(100, lengthScore + keywordScore + structureScore);

  if (score >= 75) {
    return {
      score,
      message:
        "这段回答已经有可执行的面试价值。继续补一个真实案例、指标口径或复盘闭环，会更像资深风控专家。",
    };
  }

  if (score >= 50) {
    return {
      score,
      message:
        "方向是对的，再具体一点：补充风险信号、决策动作、误伤控制和人工复核机制。",
    };
  }

  return {
    score,
    message:
      "再具体一些。建议按「业务场景 -> 风险信号 -> 策略动作 -> 案例复盘」组织答案。",
  };
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function currentTrack() {
  return state.plan.tracks.find((track) => track.id === state.activeTrackId);
}

function setModuleStatus(trackId, moduleId, status) {
  const key = moduleKey(trackId, moduleId);
  state.progress = { ...state.progress, [key]: status };
  saveProgress(state.progress);
  render();
}

function cycleModuleStatus(trackId, moduleId) {
  const key = moduleKey(trackId, moduleId);
  const current = state.progress[key] || "todo";
  const next = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length];
  setModuleStatus(trackId, moduleId, next);
}

function resetProgress() {
  state.progress = {};
  state.reflection = "";
  state.feedback = null;
  saveProgress(state.progress);
  render();
}

function selectTrack(trackId) {
  state.activeTrackId = trackId;
  state.reflection = "";
  state.feedback = null;
  render();
}

function evaluateActiveReflection() {
  const track = currentTrack();
  const activeModule =
    track.modules.find(
      (module) => state.progress[moduleKey(track.id, module.id)] !== "done",
    ) || track.modules[track.modules.length - 1];
  state.feedback = scoreReflection(state.reflection, activeModule.keywords);
  render();
}

function trackStatus(track) {
  const percent = calculateTrackProgress(track, state.progress);
  if (percent === 100) return "ready";
  if (percent > 0) return "active";
  return "queued";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderHero(plan) {
  const overall = calculateOverallProgress(plan.tracks, state.progress);
  const next = getNextModule(plan.tracks, state.progress);
  return `
    <header class="hero">
      <nav class="topbar" aria-label="Primary">
        <a class="brand" href="#top" aria-label="Web3 Career OS">
          <span class="brand-mark">W3</span>
          <span>Web3 Career OS</span>
        </a>
        <div class="top-actions">
          <a href="docs/learning-resources.md">资料库</a>
          <a href="notes/career/web3-job-landscape.md">岗位地图</a>
          <a href="projects/hardhat-learning/">实践项目</a>
        </div>
      </nav>

      <section class="hero-grid" id="top">
        <div class="hero-copy">
          <p class="eyebrow">Risk AI · Crypto Fraud · AML/KYT · Agent</p>
          <h1>${escapeHtml(plan.persona.headline)}</h1>
          <p class="hero-text">${escapeHtml(plan.persona.positioning)}</p>
          <div class="hero-actions">
            <a class="primary-action" href="#tracks">继续学习</a>
            <a class="secondary-action" href="#feedback">写一次反思</a>
          </div>
        </div>
        <aside class="signal-board" aria-label="Career progress summary">
          <div class="signal-header">
            <span>转型进度</span>
            <strong>${overall}%</strong>
          </div>
          <div class="progress-bar"><span style="width:${overall}%"></span></div>
          <div class="signal-map" aria-hidden="true">
            <span class="node node-core">Risk AI</span>
            <span class="node node-left">CEX 风控</span>
            <span class="node node-right">AML/KYT</span>
            <span class="node node-low">链上图谱</span>
            <span class="node node-ai">Agent</span>
          </div>
          <div class="next-step">
            <span>下一步</span>
            <strong>${next ? escapeHtml(next.trackTitle) : "作品集复盘"}</strong>
            <p>${next ? escapeHtml(next.title) : "所有模块已完成，开始整理面试材料。"}</p>
          </div>
        </aside>
      </section>
    </header>
  `;
}

function renderProfile(plan) {
  return `
    <section class="section-band profile-band" aria-label="Career profile">
      <div class="section-heading">
        <p class="eyebrow">你的可迁移优势</p>
        <h2>不是从零转 Web3，而是把风控与 AI 迁移到 Crypto 语境</h2>
      </div>
      <div class="profile-layout">
        <div class="profile-card">
          <h3>目标岗位</h3>
          <div class="role-list">
            ${plan.persona.targetRoles
              .map((role) => `<span>${escapeHtml(role)}</span>`)
              .join("")}
          </div>
        </div>
        <div class="profile-card">
          <h3>背景信号</h3>
          <ul class="compact-list">
            ${plan.profileSignals
              .map((signal) => `<li>${escapeHtml(signal)}</li>`)
              .join("")}
          </ul>
        </div>
        <div class="profile-card">
          <h3>迁移逻辑</h3>
          <ul class="compact-list">
            ${plan.persona.advantages
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderTrackTabs(tracks) {
  return `
    <div class="track-tabs" role="tablist" aria-label="Learning tracks">
      ${tracks
        .map((track) => {
          const percent = calculateTrackProgress(track, state.progress);
          return `
            <button
              class="track-tab ${track.id === state.activeTrackId ? "is-active" : ""}"
              type="button"
              data-track="${track.id}"
              role="tab"
              aria-selected="${track.id === state.activeTrackId}"
            >
              <span>${escapeHtml(track.title)}</span>
              <strong>${percent}%</strong>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderTracks(plan) {
  const track = currentTrack();
  return `
    <section class="section-band" id="tracks">
      <div class="section-heading">
        <p class="eyebrow">学习路线</p>
        <h2>6 条轨道，围绕 Web3 风控专家画像推进</h2>
      </div>
      ${renderTrackTabs(plan.tracks)}
      <div class="track-detail ${trackStatus(track)}">
        <div class="track-summary">
          <span class="track-state">${calculateTrackProgress(track, state.progress)}% · ${escapeHtml(track.outcome)}</span>
          <h3>${escapeHtml(track.title)}</h3>
          <p>${escapeHtml(track.focus)}</p>
        </div>
        <div class="module-list">
          ${track.modules
            .map((module, index) => {
              const status = state.progress[moduleKey(track.id, module.id)] || "todo";
              return `
                <article class="module-row ${status}">
                  <div class="module-index">${String(index + 1).padStart(2, "0")}</div>
                  <div class="module-body">
                    <div class="module-title-line">
                      <h4>${escapeHtml(module.title)}</h4>
                      <button
                        class="status-button ${status}"
                        type="button"
                        data-track="${track.id}"
                        data-module="${module.id}"
                      >${statusLabels[status]}</button>
                    </div>
                    <p>${escapeHtml(module.task)}</p>
                    <span>${escapeHtml(module.feedbackPrompt)}</span>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderFeedback() {
  const track = currentTrack();
  const activeModule =
    track.modules.find(
      (module) => state.progress[moduleKey(track.id, module.id)] !== "done",
    ) || track.modules[track.modules.length - 1];
  const feedback = state.feedback;
  return `
    <section class="section-band feedback-band" id="feedback">
      <div class="section-heading">
        <p class="eyebrow">交互反馈式学习</p>
        <h2>写下你的风控判断，让系统给出面试化反馈</h2>
      </div>
      <div class="feedback-layout">
        <div class="prompt-panel">
          <span>${escapeHtml(track.title)}</span>
          <h3>${escapeHtml(activeModule.title)}</h3>
          <p>${escapeHtml(activeModule.feedbackPrompt)}</p>
          <div class="keyword-line">
            ${activeModule.keywords
              .map((keyword) => `<span>${escapeHtml(keyword)}</span>`)
              .join("")}
          </div>
        </div>
        <div class="answer-panel">
          <textarea id="reflection-input" rows="8" placeholder="按「业务场景 -> 风险信号 -> 策略动作 -> 复盘闭环」写下你的回答。">${escapeHtml(
            state.reflection,
          )}</textarea>
          <div class="answer-actions">
            <button class="primary-action" type="button" id="score-reflection">生成反馈</button>
            <button class="secondary-action" type="button" id="reset-progress">重置进度</button>
          </div>
          ${
            feedback
              ? `<div class="feedback-result">
                  <strong>${feedback.score} 分</strong>
                  <p>${escapeHtml(feedback.message)}</p>
                </div>`
              : `<div class="feedback-empty">反馈会关注关键词覆盖、结构完整度和是否具备业务动作。</div>`
          }
        </div>
      </div>
    </section>
  `;
}

function renderPortfolio(plan) {
  return `
    <section class="section-band project-band">
      <div class="section-heading">
        <p class="eyebrow">作品集导向</p>
        <h2>每条学习轨道都要沉淀成能展示的证据</h2>
      </div>
      <div class="project-grid">
        <article>
          <span>Demo 01</span>
          <h3>链上地址风险画像看板</h3>
          <p>展示地址标签、资金流路径、风险评分和复核记录，服务 On-chain Risk Intelligence 面试。</p>
        </article>
        <article>
          <span>Demo 02</span>
          <h3>Crypto 风控规则引擎</h3>
          <p>把账户、设备、行为、链上地址四类信号组合成提现风控决策链路。</p>
        </article>
        <article>
          <span>Demo 03</span>
          <h3>AI 合规调查助手</h3>
          <p>输入案件信息，输出摘要、风险解释、缺失证据和下一步人工动作。</p>
        </article>
      </div>
      <div class="source-links">
        <a href="notes/career/web3-job-landscape.md">岗位体系说明</a>
        <a href="notes/hardhat/">Hardhat 学习路径</a>
        <a href="notes/dify/">Dify / Agent 笔记</a>
      </div>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-track]").forEach((button) => {
    if (button.classList.contains("status-button")) return;
    button.addEventListener("click", () => selectTrack(button.dataset.track));
  });

  document.querySelectorAll(".status-button").forEach((button) => {
    button.addEventListener("click", () =>
      cycleModuleStatus(button.dataset.track, button.dataset.module),
    );
  });

  const reflectionInput = document.querySelector("#reflection-input");
  if (reflectionInput) {
    reflectionInput.addEventListener("input", (event) => {
      state.reflection = event.target.value;
    });
  }

  document
    .querySelector("#score-reflection")
    ?.addEventListener("click", evaluateActiveReflection);
  document
    .querySelector("#reset-progress")
    ?.addEventListener("click", resetProgress);
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    ${renderHero(state.plan)}
    <main>
      ${renderProfile(state.plan)}
      ${renderTracks(state.plan)}
      ${renderFeedback()}
      ${renderPortfolio(state.plan)}
    </main>
  `;
  bindEvents();
}

async function init() {
  const response = await fetch("data/web3-transition-plan.json");
  state.plan = await response.json();
  state.activeTrackId = state.plan.tracks[0].id;
  state.progress = loadProgress();
  render();
}

if (typeof document !== "undefined") {
  init().catch((error) => {
    document.querySelector("#app").innerHTML = `
      <div class="loading-panel">
        <p>载入失败：${escapeHtml(error.message)}</p>
      </div>
    `;
  });
}
