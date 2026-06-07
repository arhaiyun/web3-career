export const STORAGE_KEY = "web3CareerProgress.demo";

export const statusCycle = ["todo", "doing", "done"];
export const statusLabels = {
  todo: "未开始",
  doing: "进行中",
  done: "已完成",
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
        "这段回答已经有可执行的面试价值。继续补一个真实案例、指标口径或复盘闭环。",
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

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function loadPlan() {
  const response = await fetch("../data/web3-transition-plan.json");
  if (!response.ok) throw new Error("无法加载学习数据");
  return response.json();
}

export function activeModule(track, progress) {
  return (
    track.modules.find(
      (module) => progress[moduleKey(track.id, module.id)] !== "done",
    ) || track.modules[track.modules.length - 1]
  );
}
