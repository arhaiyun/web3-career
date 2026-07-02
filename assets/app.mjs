export const STORAGE_KEY = "web3CareerProgress.v1";

export const statusCycle = ["todo", "doing", "done", "review"];
export const statusLabels = {
  todo: "未开始",
  doing: "学习中",
  done: "已完成",
  review: "需要复盘",
};

export const VIEWS = [
  { id: "study", label: "Study Guides", subtitle: "系统学习" },
  { id: "dashboard", label: "Dashboard", subtitle: "总览" },
  { id: "path", label: "Learning Path", subtitle: "学习路径" },
  { id: "resources", label: "Resources", subtitle: "资料库" },
  { id: "practice", label: "Practice", subtitle: "项目实践" },
  { id: "reflection", label: "Reflection", subtitle: "反思反馈" },
  { id: "portfolio", label: "Portfolio", subtitle: "作品集" },
  { id: "career", label: "Career Map", subtitle: "岗位地图" },
];

const resourceStatusCycle = ["unread", "reading", "done", "reviewed"];
const resourceStatusLabels = {
  unread: "未读",
  reading: "在读",
  done: "已完成",
  reviewed: "已复盘",
};

let state = {
  plan: null,
  resources: null,
  portfolio: null,
  questionManifest: null,
  questionBanks: {},
  view: "study",
  activeTrackId: null,
  selectedModule: null,
  selectedQuestion: null,
  questionTierFilter: "all",
  questionSearch: "",
  storage: null,
  reflectionDraft: "",
  reflectionMode: "module",
  feedback: null,
  resourceFilter: { track: "all", status: "all", type: "all" },
  mobileNavOpen: false,
};

export function moduleKey(trackId, moduleId) {
  return `${trackId}.${moduleId}`;
}

export function answerViewerUrl(answerPath) {
  if (!answerPath) return "";
  const relative = answerPath.replace(/^notes\/answers\//, "");
  return `notes/answers/view.html?f=${encodeURIComponent(relative)}`;
}

export function studyGuideViewerUrl(studyGuidePath) {
  if (!studyGuidePath) return "";
  const relative = studyGuidePath.replace(/^notes\/study-guides\//, "");
  return `notes/study-guides/view.html?f=${encodeURIComponent(relative)}`;
}

export function filterQuestions(questions, { tier = "all", search = "" } = {}) {
  const needle = search.trim().toLowerCase();
  return questions.filter((item) => {
    if (tier !== "all" && item.tier !== tier) return false;
    if (!needle) return true;
    return (
      item.title.toLowerCase().includes(needle) ||
      item.prompt.toLowerCase().includes(needle) ||
      item.category.toLowerCase().includes(needle)
    );
  });
}

export function questionBankPath(trackId, moduleId) {
  return `data/questions/${trackId}/${moduleId}.json`;
}

export function calculateTrackProgress(track, progress) {
  const doneCount = track.modules.filter((module) => {
    const status = progress[moduleKey(track.id, module.id)];
    return status === "done" || status === "review";
  }).length;
  return Math.round((doneCount / track.modules.length) * 100);
}

export function calculateOverallProgress(tracks, progress) {
  const modules = tracks.flatMap((track) =>
    track.modules.map((module) => moduleKey(track.id, module.id)),
  );
  if (modules.length === 0) return 0;
  const doneCount = modules.filter((key) => {
    const status = progress[key];
    return status === "done" || status === "review";
  }).length;
  return Math.round((doneCount / modules.length) * 100);
}

export function getNextModule(tracks, progress) {
  for (const track of tracks) {
    const next = track.modules.find((module) => {
      const status = progress[moduleKey(track.id, module.id)];
      return status !== "done" && status !== "review";
    });
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

export function buildStudyCurriculum(plan) {
  let order = 0;
  return plan.tracks.flatMap((track) =>
    track.modules.map((module) => {
      order += 1;
      return {
        order,
        phase: "先学系统讲义",
        trackId: track.id,
        trackTitle: track.title,
        moduleId: module.id,
        moduleTitle: module.title,
        task: module.task,
        outcome: track.outcome,
        guideUrl: studyGuideViewerUrl(module.studyGuidePath),
        answerUrl: answerViewerUrl(module.answerPath),
        outputs: module.outputs ?? [],
        keywords: module.keywords ?? [],
      };
    }),
  );
}

export function analyzeReflection(text, keywords = []) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) {
    return {
      overall: 0,
      summary: "先写下你的判断。建议按「业务场景 → 风险信号 → 策略动作 → 复盘闭环」组织。",
      dimensions: dimensionTemplate().map((d) => ({ ...d, score: 0 })),
      nextSteps: [
        "补充一个真实业务场景",
        "列出 2-3 个可检测的风险信号",
        "写清楚策略动作与人工复核",
      ],
    };
  }

  const dim = (patterns, keywordSlice, tipLow, tipHigh) => {
    const patternHit = patterns.some((p) => p.test(normalized));
    const kwHits = keywords
      .slice(0, keywordSlice)
      .filter((k) => normalized.includes(k.toLowerCase())).length;
    const score = Math.min(
      100,
      (patternHit ? 45 : 0) + Math.min(35, Math.round(normalized.length / 6)) + kwHits * 12,
    );
    return { score, tip: score >= 60 ? tipHigh : tipLow };
  };

  const dimensions = [
    {
      id: "scenario",
      label: "业务场景",
      ...dim(
        [/场景|业务|用户|提现|充值|交易|案件|审核/],
        1,
        "先说清楚发生在什么业务环节、涉及谁。",
        "场景语境清楚，可继续补充规模或边界条件。",
      ),
    },
    {
      id: "signals",
      label: "风险信号",
      ...dim(
        [/信号|指标|特征|异常|地址|设备|行为|关联/],
        2,
        "把风险信号写具体：什么特征、阈值或组合条件？",
        "信号描述较具体，可补充误伤与召回权衡。",
      ),
    },
    {
      id: "actions",
      label: "策略动作",
      ...dim(
        [/拦截|处置|复核|规则|策略|动作|闭环|升级/],
        2,
        "需要写可执行动作：拦截、降级、人工复核或升级。",
        "策略动作可执行，建议补审计留痕与复盘机制。",
      ),
    },
    {
      id: "web3",
      label: "Web3 语境",
      ...dim(
        [/链上|地址|cex|dex|aml|kyt|钱包|合约|mixer|gas|web3|crypto/],
        2,
        "补充 Web3 特有语境：链上地址、CEX/DEX、AML/KYT 等。",
        "已体现 Web3 语境，可关联到目标岗位场景。",
      ),
    },
    {
      id: "interview",
      label: "面试转化",
      ...dim(
        [/因为|所以|结果|案例|star|规模|指标|迁移|闭环/],
        1,
        "补一个结果指标或 STAR 结构，方便面试讲述。",
        "具备面试讲述结构，可打磨成 2 分钟版本。",
      ),
    },
  ];

  const overall = Math.round(
    dimensions.reduce((sum, item) => sum + item.score, 0) / dimensions.length,
  );

  const nextSteps = [];
  for (const d of dimensions.filter((x) => x.score < 55)) {
    nextSteps.push(d.tip);
  }
  if (nextSteps.length === 0) {
    nextSteps.push("把这段回答整理成 2 分钟面试版", "关联一个作品集 Demo 或真实案例");
  }

  let summary = "方向需要更具体。";
  if (overall >= 75) {
    summary =
      "这段回答已有可执行的面试价值。建议沉淀为 STAR 案例或系统设计附录。";
  } else if (overall >= 50) {
    summary =
      "方向正确。补充风险信号、决策动作、误伤控制和人工复核，会更像资深风控专家。";
  }

  return { overall, summary, dimensions, nextSteps };
}

export function scoreReflection(text, keywords) {
  const result = analyzeReflection(text, keywords);
  return {
    score: result.overall,
    message: result.summary,
    dimensions: result.dimensions,
    nextSteps: result.nextSteps,
  };
}

function defaultStorage() {
  return {
    version: 2,
    progress: {},
    notes: {},
    interviewReady: {},
    resources: {},
    lastFeedback: null,
  };
}

function loadStorage() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!raw) return defaultStorage();
    if (raw.version === 2) return raw;
    return { ...defaultStorage(), progress: raw };
  } catch {
    return defaultStorage();
  }
}

function saveStorage(storage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
}

function progressMap() {
  return state.storage.progress;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function dimensionTemplate() {
  return [
    { id: "scenario", label: "业务场景", tip: "" },
    { id: "signals", label: "风险信号", tip: "" },
    { id: "actions", label: "策略动作", tip: "" },
    { id: "web3", label: "Web3 语境", tip: "" },
    { id: "interview", label: "面试转化", tip: "" },
  ];
}

function currentTrack() {
  return state.plan.tracks.find((t) => t.id === state.activeTrackId);
}

function findModule(trackId, moduleId) {
  const track = state.plan.tracks.find((t) => t.id === trackId);
  return track?.modules.find((m) => m.id === moduleId) ?? null;
}

function selectedModuleContext() {
  if (!state.selectedModule) return null;
  const { trackId, moduleId } = state.selectedModule;
  const track = state.plan.tracks.find((t) => t.id === trackId);
  const module = findModule(trackId, moduleId);
  if (!track || !module) return null;
  return { track, module, key: moduleKey(trackId, moduleId) };
}

function getCapabilityGaps() {
  return [...state.plan.tracks]
    .map((track) => ({
      track,
      percent: calculateTrackProgress(track, progressMap()),
    }))
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);
}

function interviewReadyCount() {
  return Object.values(state.storage.interviewReady).filter(Boolean).length;
}

function portfolioAvgProgress() {
  if (!state.portfolio?.projects?.length) return 0;
  const sum = state.portfolio.projects.reduce((acc, p) => acc + p.progress, 0);
  return Math.round(sum / state.portfolio.projects.length);
}

function setView(view) {
  state.view = view;
  state.mobileNavOpen = false;
  render();
}

function selectTrack(trackId) {
  state.activeTrackId = trackId;
  render();
}

function selectModule(trackId, moduleId) {
  state.selectedModule = { trackId, moduleId };
  state.activeTrackId = trackId;
  if (state.view !== "path") state.view = "path";
  ensureQuestionBank(trackId, moduleId).then(() => render());
}

async function ensureQuestionBank(trackId, moduleId) {
  const key = moduleKey(trackId, moduleId);
  if (state.questionBanks[key]) return state.questionBanks[key];
  const response = await fetch(questionBankPath(trackId, moduleId));
  if (!response.ok) return null;
  const bank = await response.json();
  state.questionBanks[key] = bank;
  return bank;
}

function getQuestionBank(trackId, moduleId) {
  return state.questionBanks[moduleKey(trackId, moduleId)] ?? null;
}

function selectQuestion(trackId, moduleId, questionId) {
  const bank = getQuestionBank(trackId, moduleId);
  const question = bank?.questions.find((item) => item.id === questionId);
  if (!question) return;
  state.selectedQuestion = { trackId, moduleId, questionId };
  state.reflectionDraft = "";
  state.feedback = null;
  render();
}

function practiceQuestion(trackId, moduleId, questionId) {
  selectQuestion(trackId, moduleId, questionId);
  state.view = "reflection";
  render();
}

function setModuleStatus(trackId, moduleId, status) {
  const key = moduleKey(trackId, moduleId);
  state.storage.progress[key] = status;
  saveStorage(state.storage);
  render();
}

function cycleModuleStatus(trackId, moduleId) {
  const key = moduleKey(trackId, moduleId);
  const current = state.storage.progress[key] || "todo";
  const next = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length];
  setModuleStatus(trackId, moduleId, next);
}

function updateModuleNote(key, value) {
  state.storage.notes[key] = value;
  saveStorage(state.storage);
}

function toggleInterviewReady(key) {
  state.storage.interviewReady[key] = !state.storage.interviewReady[key];
  saveStorage(state.storage);
  render();
}

function cycleResourceStatus(resourceId) {
  const current = state.storage.resources[resourceId] || "unread";
  const next =
    resourceStatusCycle[
      (resourceStatusCycle.indexOf(current) + 1) % resourceStatusCycle.length
    ];
  state.storage.resources[resourceId] = next;
  saveStorage(state.storage);
  render();
}

function generateFeedback() {
  const ctx = selectedModuleContext();
  const question = activeReflectionQuestion();
  const keywords = question?.keywords?.length
    ? question.keywords
    : (ctx?.module.keywords ?? []);
  state.feedback = analyzeReflection(state.reflectionDraft, keywords);
  state.storage.lastFeedback = {
    ...state.feedback,
    at: new Date().toISOString(),
    moduleTitle: question
      ? `#${question.rank} ${question.title}`
      : (ctx?.module.title ?? "通用反思"),
  };
  saveStorage(state.storage);
  render();
}

function resetAllProgress() {
  if (!confirm("确定重置全部进度、笔记与资料状态？")) return;
  state.storage = defaultStorage();
  state.reflectionDraft = "";
  state.feedback = null;
  saveStorage(state.storage);
  render();
}

function renderSidebar() {
  return `
    <aside class="sidebar ${state.mobileNavOpen ? "is-open" : ""}" aria-label="主导航">
      <div class="sidebar-brand">
        <span class="brand-mark">W3</span>
        <div>
          <strong>Web3 Career OS</strong>
          <span>学习工作台</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${VIEWS.map(
          (item) => `
          <button
            type="button"
            class="nav-item ${state.view === item.id ? "is-active" : ""}"
            data-view="${item.id}"
          >
            <span class="nav-label">${escapeHtml(item.label)}</span>
            <span class="nav-sub">${escapeHtml(item.subtitle)}</span>
          </button>
        `,
        ).join("")}
      </nav>
      <div class="sidebar-foot">
        <a href="demos/index.html">界面 demo</a>
        <button type="button" class="text-btn" id="reset-all">重置数据</button>
      </div>
    </aside>
    <div class="sidebar-backdrop ${state.mobileNavOpen ? "is-visible" : ""}" id="sidebar-backdrop"></div>
  `;
}

function renderTopbar(plan) {
  const overall = calculateOverallProgress(plan.tracks, progressMap());
  return `
    <header class="topbar">
      <button type="button" class="menu-btn" id="menu-toggle" aria-label="打开导航">☰</button>
      <div class="identity">
        <p class="identity-name">${escapeHtml(plan.persona.name)} · Web3 Risk AI 转型</p>
        <p class="identity-roles">
          ${plan.persona.targetRoles
            .slice(0, 3)
            .map((r) => `<span>${escapeHtml(r)}</span>`)
            .join("")}
        </p>
      </div>
      <div class="topbar-stats">
        <div class="stat-chip">
          <span>总进度</span>
          <strong>${overall}%</strong>
        </div>
        <div class="stat-chip">
          <span>面试素材</span>
          <strong>${interviewReadyCount()}</strong>
        </div>
      </div>
    </header>
  `;
}

function renderAsidePanel(plan) {
  const next = getNextModule(plan.tracks, progressMap());
  const gaps = getCapabilityGaps();
  const last = state.storage.lastFeedback;

  return `
    <aside class="context-panel" aria-label="辅助信息">
      <section class="panel-block">
        <h3>下一步建议</h3>
        ${
          next
            ? `<p class="panel-lead">${escapeHtml(next.trackTitle)}</p>
               <p><strong>${escapeHtml(next.title)}</strong></p>
               <p class="panel-muted">${escapeHtml(next.task)}</p>
               <button type="button" class="btn btn-sm" data-goto-module="${next.trackId}" data-module-id="${next.id.split(".").pop()}">打开模块</button>`
            : `<p>核心模块已完成，进入作品集与面试故事沉淀。</p>`
        }
      </section>
      <section class="panel-block">
        <h3>能力缺口</h3>
        <ul class="gap-list">
          ${gaps
            .map(
              (g) => `
            <li>
              <span>${escapeHtml(g.track.title)}</span>
              <strong>${g.percent}%</strong>
            </li>
          `,
            )
            .join("")}
        </ul>
      </section>
      <section class="panel-block">
        <h3>面试素材积累</h3>
        <p>已标记 <strong>${interviewReadyCount()}</strong> 个模块可讲述</p>
        <p class="panel-muted">在学习路径中勾选「已沉淀面试素材」</p>
      </section>
      ${
        last
          ? `<section class="panel-block">
              <h3>最近反馈</h3>
              <p><strong>${last.overall ?? last.score} 分</strong> · ${escapeHtml(last.moduleTitle ?? "")}</p>
              <p class="panel-muted">${escapeHtml(last.summary ?? last.message ?? "")}</p>
            </section>`
          : ""
      }
    </aside>
  `;
}

function renderDashboard(plan) {
  const next = getNextModule(plan.tracks, progressMap());
  const overall = calculateOverallProgress(plan.tracks, progressMap());
  const portfolioPct = portfolioAvgProgress();
  const gaps = getCapabilityGaps()[0];

  return `
    <div class="view-header">
      <h1>今日作战室</h1>
      <p>12 年大厂风控 → Web3 Risk AI。打开即知今天学什么、学完沉淀什么。</p>
    </div>
    <div class="dashboard-grid">
      <section class="card span-2">
        <div class="card-label">当前定位</div>
        <div class="tag-row">
          <span class="tag tag-green">Web3 Risk AI</span>
          <span class="tag tag-blue">Crypto Fraud</span>
          <span class="tag tag-amber">AML / KYT</span>
          <span class="tag tag-slate">Compliance Agent</span>
        </div>
        <p class="card-text">${escapeHtml(plan.persona.positioning)}</p>
      </section>
      <section class="card">
        <div class="card-label">总进度</div>
        <div class="metric-lg">${overall}<small>%</small></div>
        <div class="progress-line"><span style="width:${overall}%"></span></div>
      </section>
      <section class="card">
        <div class="card-label">作品集完成度</div>
        <div class="metric-lg">${portfolioPct}<small>%</small></div>
        <button type="button" class="btn btn-sm btn-ghost" data-view-jump="portfolio">查看项目</button>
      </section>
      <section class="card span-2 highlight">
        <div class="card-label">今日推荐模块</div>
        ${
          next
            ? `<h2 class="card-title">${escapeHtml(next.title)}</h2>
               <p class="panel-muted">${escapeHtml(next.trackTitle)} · ${escapeHtml(next.task)}</p>
               <div class="card-actions">
                 <button type="button" class="btn" data-goto-module="${next.trackId}" data-module-id="${next.id.replace(/^[^.]+\./, "")}">开始学习</button>
                 <button type="button" class="btn btn-ghost" data-view-jump="reflection">写反思</button>
               </div>`
            : `<p>进入作品集复盘与面试故事整理阶段。</p>`
        }
      </section>
      <section class="card">
        <div class="card-label">本周重点</div>
        <ul class="check-list">
          ${plan.weeklyGoals.map((g) => `<li>${escapeHtml(g)}</li>`).join("")}
        </ul>
      </section>
      <section class="card">
        <div class="card-label">最大能力缺口</div>
        <p class="card-title-sm">${escapeHtml(gaps?.track.title ?? "—")}</p>
        <p class="panel-muted">完成度 ${gaps?.percent ?? 0}% · ${escapeHtml(gaps?.track.whyLearn ?? "")}</p>
      </section>
      <section class="card">
        <div class="card-label">面试准备</div>
        <p>可讲述模块 <strong>${interviewReadyCount()}</strong> / 18</p>
        <p class="panel-muted">目标：每个核心 Track 至少 1 个 STAR 素材</p>
      </section>
      <section class="card">
        <div class="card-label">可迁移优势</div>
        <ul class="compact-list">
          ${plan.persona.advantages.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;
}

function renderStudyGuides(plan) {
  const curriculum = buildStudyCurriculum(plan);
  const next = getNextModule(plan.tracks, progressMap());
  const nextKey = next ? `${next.trackId}.${next.id.replace(/^[^.]+\./, "")}` : "";
  const completed = curriculum.filter((item) => {
    const status = state.storage.progress[moduleKey(item.trackId, item.moduleId)];
    return status === "done" || status === "review";
  }).length;
  const currentItem =
    curriculum.find(
      (item) => moduleKey(item.trackId, item.moduleId) === nextKey,
    ) ?? curriculum[0];

  return `
    <div class="view-header study-header">
      <div>
        <p class="view-kicker">先完整学习，再做验证</p>
        <h1>系统学习资料</h1>
        <p>当前阶段先不要被交互题库拖慢：按顺序读完 18 节系统讲义，建立 Web3 风控知识框架，再进入题库、反思和作品集验证。</p>
      </div>
      <div class="study-summary-card">
        <span>讲义进度</span>
        <strong>${completed} / ${curriculum.length}</strong>
        <div class="progress-line"><span style="width:${Math.round((completed / curriculum.length) * 100)}%"></span></div>
      </div>
    </div>

    <section class="study-focus card">
      <div>
        <div class="card-label">建议现在学习</div>
        <h2>${escapeHtml(currentItem.moduleTitle)}</h2>
        <p>${escapeHtml(currentItem.trackTitle)} · ${escapeHtml(currentItem.task)}</p>
        <div class="tag-row">
          ${currentItem.outputs.map((item) => `<span class="tag tag-slate">${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
      <div class="study-focus-actions">
        <a class="btn" href="${escapeHtml(currentItem.guideUrl)}">打开系统讲义</a>
        <button type="button" class="btn btn-ghost" data-study-module="${currentItem.trackId}" data-study-mod="${currentItem.moduleId}">查看模块详情</button>
      </div>
    </section>

    <section class="study-protocol">
      <article class="protocol-step is-active">
        <span>01</span>
        <h3>通读系统讲义</h3>
        <p>先看精讲、架构图、参考答案，目标是建立完整知识框架。</p>
      </article>
      <article class="protocol-step">
        <span>02</span>
        <h3>整理学习笔记</h3>
        <p>把关键概念、风控迁移点、面试口述稿记录到模块笔记。</p>
      </article>
      <article class="protocol-step">
        <span>03</span>
        <h3>再做验证题库</h3>
        <p>学完后再进入 100 题验证和反思反馈，避免一开始就被题目打断。</p>
      </article>
    </section>

    <section class="study-track-stack">
      ${plan.tracks
        .map((track) => {
          const lessons = curriculum.filter((item) => item.trackId === track.id);
          const percent = calculateTrackProgress(track, progressMap());
          return `
            <article class="study-track card">
              <header class="study-track-head">
                <div>
                  <span class="card-label">${percent}% · ${escapeHtml(track.outcome)}</span>
                  <h2>${escapeHtml(track.title)}</h2>
                  <p>${escapeHtml(track.whyLearn ?? track.focus)}</p>
                </div>
                <button type="button" class="btn btn-sm btn-ghost" data-study-track="${track.id}">切到路径</button>
              </header>
              <div class="lesson-list">
                ${lessons
                  .map((lesson) => {
                    const key = moduleKey(lesson.trackId, lesson.moduleId);
                    const status = state.storage.progress[key] || "todo";
                    return `
                      <div class="lesson-row ${status}">
                        <div class="lesson-order">${String(lesson.order).padStart(2, "0")}</div>
                        <div class="lesson-main">
                          <div class="lesson-title-line">
                            <strong>${escapeHtml(lesson.moduleTitle)}</strong>
                            <span class="status-pill ${status}">${statusLabels[status]}</span>
                          </div>
                          <p>${escapeHtml(lesson.task)}</p>
                          <div class="lesson-links">
                            <a class="btn btn-sm" href="${escapeHtml(lesson.guideUrl)}">读系统讲义</a>
                            <button type="button" class="btn btn-sm btn-ghost" data-study-module="${lesson.trackId}" data-study-mod="${lesson.moduleId}">模块详情</button>
                            <span class="after-study">学完后：题库验证 / 反思反馈 / 面试素材</span>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderQuestionBank(track, module) {
  const bank = getQuestionBank(track.id, module.id);
  if (!bank) {
    return `
      <section class="card question-bank-card">
        <p class="panel-muted">正在加载题库…</p>
      </section>
    `;
  }

  const filtered = filterQuestions(bank.questions, {
    tier: state.questionTierFilter,
    search: state.questionSearch,
  });
  const tierCounts = bank.questions.reduce((acc, item) => {
    acc[item.tier] = (acc[item.tier] ?? 0) + 1;
    return acc;
  }, {});

  return `
    <section class="card question-bank-card" id="question-bank">
      <div class="qb-header">
        <div>
          <h3 class="section-title">学后验证题库</h3>
          <p class="panel-muted">${bank.questionCount} 题 · 学完讲义后再自测 · 按 rank 排序（P0 必考 1–20 → P3 扩展 76–100）</p>
        </div>
        <div class="qb-filters">
          <select id="question-tier-filter" aria-label="优先级筛选">
            <option value="all" ${state.questionTierFilter === "all" ? "selected" : ""}>全部优先级</option>
            <option value="P0" ${state.questionTierFilter === "P0" ? "selected" : ""}>P0 必考 (${tierCounts.P0 ?? 0})</option>
            <option value="P1" ${state.questionTierFilter === "P1" ? "selected" : ""}>P1 常用 (${tierCounts.P1 ?? 0})</option>
            <option value="P2" ${state.questionTierFilter === "P2" ? "selected" : ""}>P2 深化 (${tierCounts.P2 ?? 0})</option>
            <option value="P3" ${state.questionTierFilter === "P3" ? "selected" : ""}>P3 扩展 (${tierCounts.P3 ?? 0})</option>
          </select>
          <input
            id="question-search"
            type="search"
            placeholder="搜索题目…"
            value="${escapeHtml(state.questionSearch)}"
          />
        </div>
      </div>
      <p class="qb-result-hint">显示 ${filtered.length} / ${bank.questionCount} 题</p>
      <ol class="qb-list">
        ${filtered
          .map((item) => {
            const selected =
              state.selectedQuestion?.trackId === track.id &&
              state.selectedQuestion?.moduleId === module.id &&
              state.selectedQuestion?.questionId === item.id;
            return `
              <li class="qb-item tier-${item.tier} ${selected ? "is-selected" : ""}">
                <div class="qb-rank" aria-label="重要性排序">${item.rank}</div>
                <div class="qb-body">
                  <div class="qb-title-line">
                    <span class="qb-tier">${item.tier}</span>
                    <span class="qb-cat">${escapeHtml(item.category)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                  </div>
                  <p>${escapeHtml(item.prompt)}</p>
                </div>
                <div class="qb-actions">
                  <button
                    type="button"
                    class="btn btn-sm btn-ghost"
                    data-select-question="${item.id}"
                    data-q-track="${track.id}"
                    data-q-module="${module.id}"
                  >选中</button>
                  <button
                    type="button"
                    class="btn btn-sm"
                    data-practice-question="${item.id}"
                    data-q-track="${track.id}"
                    data-q-module="${module.id}"
                  >练习</button>
                </div>
              </li>
            `;
          })
          .join("")}
      </ol>
    </section>
  `;
}

function renderModuleDetail(ctx) {
  if (!ctx) {
    return `<div class="detail-empty"><p>点击左侧模块查看学习任务、输出物与复盘要求。</p></div>`;
  }
  const { track, module, key } = ctx;
  const status = state.storage.progress[key] || "todo";
  const note = state.storage.notes[key] || "";
  const ready = !!state.storage.interviewReady[key];
  const linkedResources = (module.resourceIds ?? [])
    .map((id) => state.resources.resources.find((r) => r.id === id))
    .filter(Boolean);

  return `
    <div class="module-detail">
      <div class="detail-head">
        <div>
          <span class="detail-track">${escapeHtml(track.title)}</span>
          <h2>${escapeHtml(module.title)}</h2>
        </div>
        <select class="status-select ${status}" data-status-track="${track.id}" data-status-module="${module.id}">
          ${statusCycle
            .map(
              (s) =>
                `<option value="${s}" ${s === status ? "selected" : ""}>${statusLabels[s]}</option>`,
            )
            .join("")}
        </select>
      </div>
      <div class="detail-grid">
        <div>
          <h4>学习任务</h4>
          <p>${escapeHtml(module.task)}</p>
        </div>
        <div>
          <h4>复盘问题</h4>
          <p>${escapeHtml(module.feedbackPrompt)}</p>
        </div>
        <div>
          <h4>输出物要求</h4>
          <div class="tag-row">
            ${(module.outputs ?? []).map((o) => `<span class="tag tag-slate">${escapeHtml(o)}</span>`).join("")}
          </div>
        </div>
        <div>
          <h4>推荐资料</h4>
          ${
            linkedResources.length
              ? `<ul class="link-list">${linkedResources.map((r) => `<li><a href="${escapeHtml(r.url)}">${escapeHtml(r.title)}</a></li>`).join("")}</ul>`
              : `<p class="panel-muted">暂无关联资料</p>`
          }
        </div>
      </div>
      <label class="field-label" for="module-note">学习笔记</label>
      <textarea id="module-note" rows="4" data-note-key="${key}" placeholder="记录概念、案例、疑问…">${escapeHtml(note)}</textarea>
      <label class="checkbox-row">
        <input type="checkbox" data-interview-key="${key}" ${ready ? "checked" : ""} />
        已沉淀为面试素材
      </label>
      <section class="learning-flow">
        <h3 class="section-title">学习流程</h3>
        <div class="learning-steps">
          <div class="learning-step is-primary">
            <span class="step-badge">① 先学</span>
            <p>阅读系统学习讲义：精讲、架构图、分 tier 参考答案速查（含答案，用于建立体系）</p>
            ${
              module.studyGuidePath
                ? `<a class="btn btn-sm" href="${escapeHtml(studyGuideViewerUrl(module.studyGuidePath))}">打开系统讲义</a>`
                : `<span class="panel-muted">讲义生成中…</span>`
            }
          </div>
          <div class="learning-step">
            <span class="step-badge">② 后测</span>
            <p>关闭讲义，在下方「学后验证题库」自测 100 题；P0 建议正确率 ≥ 80% 再进入 P1</p>
            <a class="btn btn-sm btn-ghost" href="#question-bank">进入验证题库</a>
          </div>
        </div>
      </section>
      <div class="card-actions">
        ${
          module.answerPath
            ? `<a class="btn btn-sm btn-ghost" href="${escapeHtml(answerViewerUrl(module.answerPath))}">简版参考答案</a>`
            : ""
        }
        <button type="button" class="btn btn-sm" data-reflect-module="${track.id}" data-reflect-mod="${module.id}">写反思反馈</button>
        <button type="button" class="btn btn-sm btn-ghost" data-cycle="${track.id}" data-cycle-mod="${module.id}">切换状态</button>
      </div>
    </div>
  `;
}

function renderPath(plan) {
  const track = currentTrack();
  const ctx = selectedModuleContext();

  return `
    <div class="view-header">
      <h1>学习路径</h1>
      <p>6 条职业能力轨道 — 每条对应岗位能力，模块学完需有输出物。</p>
    </div>
    <div class="path-layout">
      <div class="track-list">
        ${plan.tracks
          .map((t) => {
            const pct = calculateTrackProgress(t, progressMap());
            return `
            <button type="button" class="track-row ${t.id === state.activeTrackId ? "is-active" : ""}" data-track="${t.id}">
              <div>
                <strong>${escapeHtml(t.title)}</strong>
                <span>${pct}% · ${escapeHtml(t.outcome)}</span>
              </div>
            </button>
          `;
          })
          .join("")}
      </div>
      <div class="path-main">
        <section class="card track-overview">
          <h2>${escapeHtml(track.title)}</h2>
          <p><strong>为什么学：</strong>${escapeHtml(track.whyLearn ?? track.focus)}</p>
          <p><strong>对应岗位：</strong>${(track.targetRoles ?? []).map((r) => escapeHtml(r)).join(" · ")}</p>
          <p><strong>前置知识：</strong>${(track.prerequisites ?? []).map((p) => escapeHtml(p)).join("、")}</p>
        </section>
        <section class="card">
          <h3 class="section-title">模块列表</h3>
          <div class="module-table">
            ${track.modules
              .map((m, i) => {
                const key = moduleKey(track.id, m.id);
                const st = state.storage.progress[key] || "todo";
                const selected =
                  state.selectedModule?.trackId === track.id &&
                  state.selectedModule?.moduleId === m.id;
                return `
                <button type="button" class="module-item ${st} ${selected ? "is-selected" : ""}" data-pick="${track.id}" data-pick-mod="${m.id}">
                  <span class="module-num">${String(i + 1).padStart(2, "0")}</span>
                  <div class="module-info">
                    <strong>${escapeHtml(m.title)}</strong>
                    <span>${escapeHtml(m.task)}</span>
                  </div>
                  <span class="status-pill ${st}">${statusLabels[st]}</span>
                </button>
              `;
              })
              .join("")}
          </div>
        </section>
        <section class="card">${renderModuleDetail(ctx)}</section>
        ${ctx ? renderQuestionBank(ctx.track, ctx.module) : ""}
      </div>
    </div>
  `;
}

function filteredResources() {
  const { track, status, type } = state.resourceFilter;
  return state.resources.resources.filter((r) => {
    if (track !== "all" && r.trackId !== track) return false;
    if (type !== "all" && r.type !== type) return false;
    if (status !== "all") {
      const st = state.storage.resources[r.id] || "unread";
      if (st !== status) return false;
    }
    return true;
  });
}

function renderResources(plan) {
  const list = filteredResources();
  const types = [...new Set(state.resources.resources.map((r) => r.type))];

  return `
    <div class="view-header">
      <h1>资料库</h1>
      <p>按 Track、类型与阅读状态管理学习资源，避免「收藏了但没用」。</p>
    </div>
    <div class="filter-bar">
      <select id="filter-track">
        <option value="all">全部 Track</option>
        ${plan.tracks.map((t) => `<option value="${t.id}" ${state.resourceFilter.track === t.id ? "selected" : ""}>${escapeHtml(t.title)}</option>`).join("")}
      </select>
      <select id="filter-type">
        <option value="all">全部类型</option>
        ${types.map((t) => `<option value="${t}" ${state.resourceFilter.type === t ? "selected" : ""}>${escapeHtml(t)}</option>`).join("")}
      </select>
      <select id="filter-status">
        <option value="all">全部状态</option>
        ${Object.entries(resourceStatusLabels)
          .map(
            ([k, v]) =>
              `<option value="${k}" ${state.resourceFilter.status === k ? "selected" : ""}>${v}</option>`,
          )
          .join("")}
      </select>
    </div>
    <div class="resource-grid">
      ${list
        .map((r) => {
          const st = state.storage.resources[r.id] || "unread";
          const track = plan.tracks.find((t) => t.id === r.trackId);
          return `
          <article class="resource-card">
            <div class="resource-meta">
              <span class="tag tag-slate">${escapeHtml(r.type)}</span>
              <span class="tag tag-blue">${escapeHtml(r.difficulty)}</span>
            </div>
            <h3><a href="${escapeHtml(r.url)}">${escapeHtml(r.title)}</a></h3>
            <p>${escapeHtml(r.summary)}</p>
            <div class="resource-foot">
              <span class="panel-muted">${escapeHtml(track?.title ?? "")} · ${escapeHtml(r.purpose)}</span>
              <button type="button" class="status-pill ${st}" data-resource="${r.id}">${resourceStatusLabels[st]}</button>
            </div>
          </article>
        `;
        })
        .join("")}
    </div>
  `;
}

function renderPractice() {
  return `
    <div class="view-header">
      <h1>项目实践</h1>
      <p>动手项目与笔记联动，验证链上工程与风控系统设计能力。</p>
    </div>
    <div class="practice-grid">
      <article class="card">
        <div class="card-label">Hardhat 入门</div>
        <h2 class="card-title-sm">hardhat-learning</h2>
        <p>Greeter 合约编译、测试、部署。配合 notes/hardhat 四篇笔记。</p>
        <div class="card-actions">
          <a class="btn btn-sm" href="projects/hardhat-learning/">打开项目</a>
          <a class="btn btn-sm btn-ghost" href="notes/hardhat/">学习笔记</a>
        </div>
      </article>
      <article class="card">
        <div class="card-label">架构认知</div>
        <h2 class="card-title-sm">Hardhat 架构图</h2>
        <p>理解编译、测试、部署与网络配置关系。</p>
        <a class="btn btn-sm btn-ghost" href="docs/diagrams/hardhat-architecture.html">查看架构图</a>
      </article>
      <article class="card">
        <div class="card-label">Agent 工作流</div>
        <h2 class="card-title-sm">Dify + Cursor</h2>
        <p>编排 repeatable 学习流，服务 Risk Copilot 作品集。</p>
        <div class="card-actions">
          <a class="btn btn-sm btn-ghost" href="docs/dify.md">Dify 说明</a>
          <a class="btn btn-sm btn-ghost" href="notes/dify/">配方笔记</a>
        </div>
      </article>
    </div>
  `;
}

function activeReflectionQuestion() {
  if (!state.selectedQuestion) return null;
  const { trackId, moduleId, questionId } = state.selectedQuestion;
  const bank = getQuestionBank(trackId, moduleId);
  return bank?.questions.find((item) => item.id === questionId) ?? null;
}

function renderReflectionView() {
  const ctx = selectedModuleContext();
  const module = ctx?.module;
  const question = activeReflectionQuestion();
  const keywords = question?.keywords?.length
    ? question.keywords
    : (module?.keywords ?? []);

  return `
    <div class="view-header">
      <h1>反思反馈</h1>
      <p>学习教练式多维度反馈 — 未来可接入 AI Agent 生成深度点评。</p>
    </div>
    <div class="reflection-layout">
      <section class="card">
        <label class="field-label" for="reflection-mode">输入类型</label>
        <select id="reflection-mode">
          <option value="module" ${state.reflectionMode === "module" ? "selected" : ""}>模块反思</option>
          <option value="interview" ${state.reflectionMode === "interview" ? "selected" : ""}>面试回答草稿</option>
          <option value="design" ${state.reflectionMode === "design" ? "selected" : ""}>项目设计思路</option>
          <option value="strategy" ${state.reflectionMode === "strategy" ? "selected" : ""}>风控策略设计</option>
        </select>
        ${
          question
            ? `<p class="panel-muted" style="margin-top:12px">当前题目 #${question.rank} · ${escapeHtml(question.tier)} · ${escapeHtml(module?.title ?? "")}</p>
               <p><strong>${escapeHtml(question.title)}</strong></p>
               <p class="panel-muted">${escapeHtml(question.prompt)}</p>`
            : module
              ? `<p class="panel-muted" style="margin-top:12px">当前模块：${escapeHtml(module.title)}（默认复盘题）</p>
                 <p class="panel-muted">${escapeHtml(module.feedbackPrompt)}</p>
                 <p class="panel-muted">提示：在「学习路径 → 题库」选择具体题目练习。</p>`
              : `<p class="panel-muted" style="margin-top:12px">请先在「学习路径」选择模块或题目。</p>`
        }
        <label class="field-label" for="reflection-input">你的回答</label>
        <textarea id="reflection-input" rows="10" placeholder="业务场景 → 风险信号 → 策略动作 → 复盘闭环">${escapeHtml(state.reflectionDraft)}</textarea>
        <div class="card-actions">
          <button type="button" class="btn" id="generate-feedback">生成学习反馈</button>
          <button type="button" class="btn btn-ghost" id="ai-placeholder-interview" disabled title="预留：接入 AI Agent">转成面试回答</button>
          <button type="button" class="btn btn-ghost" id="ai-placeholder-next" disabled title="预留：接入 AI Agent">生成下一步任务</button>
        </div>
        <p class="panel-muted ai-hint">灰色按钮预留 AI Agent 接口，当前为规则引擎反馈。</p>
      </section>
      <section class="card">
        <h3 class="section-title">多维度反馈</h3>
        ${
          state.feedback
            ? `
          <div class="feedback-overall">
            <strong>${state.feedback.overall}</strong>
            <span>综合分</span>
          </div>
          <p>${escapeHtml(state.feedback.summary)}</p>
          <div class="dimension-list">
            ${state.feedback.dimensions
              .map(
                (d) => `
              <div class="dimension-row">
                <div class="dimension-head">
                  <span>${escapeHtml(d.label)}</span>
                  <strong>${d.score}</strong>
                </div>
                <div class="progress-line thin"><span style="width:${d.score}%"></span></div>
                <p class="panel-muted">${escapeHtml(d.tip)}</p>
              </div>
            `,
              )
              .join("")}
          </div>
          <h4>下一步补强</h4>
          <ul class="check-list">
            ${state.feedback.nextSteps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
          </ul>
        `
            : `<p class="panel-muted">提交内容后，将从业务场景、风险信号、策略动作、Web3 语境、面试转化五个维度给出建议。</p>`
        }
      </section>
    </div>
  `;
}

function renderPortfolioView() {
  return `
    <div class="view-header">
      <h1>作品集</h1>
      <p>3 个核心项目直接服务求职 — 每个都要有业务价值、技术栈与面试讲述角度。</p>
    </div>
    <div class="portfolio-grid">
      ${state.portfolio.projects
        .map(
          (p) => `
        <article class="card portfolio-card">
          <div class="card-label">${escapeHtml(p.targetRoles[0])}</div>
          <h2 class="card-title-sm">${escapeHtml(p.title)}</h2>
          <p>${escapeHtml(p.value)}</p>
          <dl class="meta-dl">
            <div><dt>技术栈</dt><dd>${escapeHtml(p.stack.join(" · "))}</dd></div>
            <div><dt>当前进度</dt><dd>${p.progress}%</dd></div>
            <div><dt>README</dt><dd>${escapeHtml(p.readmeStatus)}</dd></div>
            <div><dt>Demo</dt><dd>${escapeHtml(p.demoStatus)}</dd></div>
          </dl>
          <div class="progress-line"><span style="width:${p.progress}%"></span></div>
          <h4>能力缺口</h4>
          <ul class="compact-list">${p.gaps.map((g) => `<li>${escapeHtml(g)}</li>`).join("")}</ul>
          <h4>面试讲述角度</h4>
          <p class="panel-muted">${escapeHtml(p.interviewAngle)}</p>
          <h4>下一步任务</h4>
          <ul class="check-list">${p.nextTasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
          <a class="btn btn-sm btn-ghost" href="${escapeHtml(p.link)}">查看仓库路径</a>
        </article>
      `,
        )
        .join("")}
    </div>
  `;
}

function renderCareer(plan) {
  return `
    <div class="view-header">
      <h1>岗位地图</h1>
      <p>目标岗位、背景信号与迁移逻辑 — 学习轨道的「为什么」。</p>
    </div>
    <div class="career-grid">
      <section class="card">
        <h3 class="section-title">目标岗位</h3>
        <div class="tag-row">
          ${plan.persona.targetRoles.map((r) => `<span class="tag tag-green">${escapeHtml(r)}</span>`).join("")}
        </div>
      </section>
      <section class="card">
        <h3 class="section-title">背景信号</h3>
        <ul class="check-list">
          ${plan.profileSignals.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
        </ul>
      </section>
      <section class="card span-2">
        <h3 class="section-title">迁移逻辑</h3>
        <ul class="compact-list">
          ${plan.persona.advantages.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}
        </ul>
        <div class="card-actions">
          <a class="btn btn-sm" href="notes/career/web3-job-landscape.md">岗位体系详解</a>
          <a class="btn btn-sm btn-ghost" href="docs/learning-resources.md">外部资料索引</a>
        </div>
      </section>
      <section class="card span-2">
        <h3 class="section-title">Track → 岗位映射</h3>
        <div class="mapping-table">
          ${plan.tracks
            .map(
              (t) => `
            <div class="mapping-row">
              <strong>${escapeHtml(t.title)}</strong>
              <span>${(t.targetRoles ?? []).map((r) => escapeHtml(r)).join(" · ")}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function renderMainContent() {
  const plan = state.plan;
  switch (state.view) {
    case "study":
      return renderStudyGuides(plan);
    case "dashboard":
      return renderDashboard(plan);
    case "path":
      return renderPath(plan);
    case "resources":
      return renderResources(plan);
    case "practice":
      return renderPractice();
    case "reflection":
      return renderReflectionView();
    case "portfolio":
      return renderPortfolioView();
    case "career":
      return renderCareer(plan);
    default:
      return renderStudyGuides(plan);
  }
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });

  document.querySelectorAll("[data-view-jump]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.viewJump));
  });

  document.getElementById("menu-toggle")?.addEventListener("click", () => {
    state.mobileNavOpen = !state.mobileNavOpen;
    render();
  });

  document.getElementById("sidebar-backdrop")?.addEventListener("click", () => {
    state.mobileNavOpen = false;
    render();
  });

  document.getElementById("reset-all")?.addEventListener("click", resetAllProgress);

  document.querySelectorAll("[data-track]").forEach((btn) => {
    btn.addEventListener("click", () => selectTrack(btn.dataset.track));
  });

  document.querySelectorAll("[data-pick]").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectModule(btn.dataset.pick, btn.dataset.pickMod),
    );
  });

  document.querySelectorAll("[data-goto-module]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectModule(btn.dataset.gotoModule, btn.dataset.moduleId);
    });
  });

  document.querySelectorAll("[data-study-module]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectModule(btn.dataset.studyModule, btn.dataset.studyMod);
    });
  });

  document.querySelectorAll("[data-study-track]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeTrackId = btn.dataset.studyTrack;
      state.view = "path";
      render();
    });
  });

  document.querySelectorAll("[data-reflect-module]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectModule(btn.dataset.reflectModule, btn.dataset.reflectMod);
      state.view = "reflection";
      render();
    });
  });

  document.querySelectorAll("[data-cycle]").forEach((btn) => {
    btn.addEventListener("click", () =>
      cycleModuleStatus(btn.dataset.cycle, btn.dataset.cycleMod),
    );
  });

  document.querySelectorAll(".status-select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      setModuleStatus(sel.dataset.statusTrack, sel.dataset.statusModule, e.target.value);
    });
  });

  const noteEl = document.getElementById("module-note");
  if (noteEl) {
    noteEl.addEventListener("input", (e) => {
      updateModuleNote(noteEl.dataset.noteKey, e.target.value);
    });
  }

  document.querySelectorAll("[data-interview-key]").forEach((cb) => {
    cb.addEventListener("change", () => toggleInterviewReady(cb.dataset.interviewKey));
  });

  document.querySelectorAll("[data-resource]").forEach((btn) => {
    btn.addEventListener("click", () => cycleResourceStatus(btn.dataset.resource));
  });

  ["filter-track", "filter-type", "filter-status"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", (e) => {
      const key = id.replace("filter-", "");
      state.resourceFilter[key] = e.target.value;
      render();
    });
  });

  document.getElementById("reflection-input")?.addEventListener("input", (e) => {
    state.reflectionDraft = e.target.value;
  });

  document.getElementById("reflection-mode")?.addEventListener("change", (e) => {
    state.reflectionMode = e.target.value;
  });

  document.getElementById("generate-feedback")?.addEventListener("click", generateFeedback);

  document.getElementById("question-tier-filter")?.addEventListener("change", (e) => {
    state.questionTierFilter = e.target.value;
    render();
  });

  document.getElementById("question-search")?.addEventListener("input", (e) => {
    state.questionSearch = e.target.value;
    render();
  });

  document.querySelectorAll("[data-practice-question]").forEach((btn) => {
    btn.addEventListener("click", () =>
      practiceQuestion(btn.dataset.qTrack, btn.dataset.qModule, btn.dataset.practiceQuestion),
    );
  });

  document.querySelectorAll("[data-select-question]").forEach((btn) => {
    btn.addEventListener("click", () =>
      selectQuestion(btn.dataset.qTrack, btn.dataset.qModule, btn.dataset.selectQuestion),
    );
  });
}

function render() {
  const app = document.querySelector("#app");
  if (!state.plan) return;

  app.innerHTML = `
    <div class="workspace">
      ${renderSidebar()}
      <div class="workspace-main">
        ${renderTopbar(state.plan)}
        <div class="workspace-body">
          <main class="primary-panel">${renderMainContent()}</main>
          ${state.view === "study" || state.view === "dashboard" || state.view === "path" ? renderAsidePanel(state.plan) : ""}
        </div>
      </div>
    </div>
  `;
  bindEvents();
}

async function init() {
  const [planRes, resRes, portRes, manifestRes] = await Promise.all([
    fetch("data/web3-transition-plan.json"),
    fetch("data/resources.json"),
    fetch("data/portfolio.json"),
    fetch("data/questions/manifest.json"),
  ]);
  if (!planRes.ok) throw new Error("无法加载学习计划");
  if (!resRes.ok) throw new Error("无法加载资料库");
  if (!portRes.ok) throw new Error("无法加载作品集");
  if (!manifestRes.ok) throw new Error("无法加载题库索引");

  state.plan = await planRes.json();
  state.resources = await resRes.json();
  state.portfolio = await portRes.json();
  state.questionManifest = await manifestRes.json();
  state.storage = loadStorage();
  state.activeTrackId = state.plan.tracks[0].id;
  state.feedback = state.storage.lastFeedback;
  render();
}

if (typeof document !== "undefined") {
  init().catch((error) => {
    document.querySelector("#app").innerHTML = `
      <div class="loading-panel"><p>载入失败：${escapeHtml(error.message)}</p></div>
    `;
  });
}
