#!/usr/bin/env bash
# 将本仓库推荐的 Cursor Skills 安装到 ~/.cursor/skills/
# 来源：https://github.com/anthropics/skills （见 docs/cursor-skills.md 固定 commit）

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${CURSOR_SKILLS_DIR:-$HOME/.cursor/skills}"
ANTHROPICS_REPO="${ANTHROPICS_SKILLS_REPO:-https://github.com/anthropics/skills.git}"
ANTHROPICS_REF="${ANTHROPICS_SKILLS_REF:-690f15c}"
TMP_DIR="$(mktemp -d)"

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

ANTHROPICS_SKILLS=(
  skill-creator
  webapp-testing
  frontend-design
  web-artifacts-builder
  mcp-builder
  doc-coauthoring
)

echo "→ 目标目录: $TARGET"
mkdir -p "$TARGET"

echo "→ 克隆 anthropics/skills @ ${ANTHROPICS_REF} ..."
git clone --depth 1 "$ANTHROPICS_REPO" "$TMP_DIR/skills-upstream"
(cd "$TMP_DIR/skills-upstream" && git fetch --depth 1 origin "$ANTHROPICS_REF" && git checkout "$ANTHROPICS_REF")

for name in "${ANTHROPICS_SKILLS[@]}"; do
  echo "→ 安装 $name (anthropics)"
  rm -rf "$TARGET/$name"
  cp -R "$TMP_DIR/skills-upstream/skills/$name" "$TARGET/$name"
done

if [[ -d "$REPO_ROOT/.cursor/skills/architecture-diagram-html" ]]; then
  echo "→ 安装 architecture-diagram-html (本仓库)"
  rm -rf "$TARGET/architecture-diagram-html"
  cp -R "$REPO_ROOT/.cursor/skills/architecture-diagram-html" "$TARGET/architecture-diagram-html"
fi

echo ""
echo "✓ 已安装 $(ls -1 "$TARGET" | wc -l | tr -d ' ') 个 skill 到 $TARGET"
ls -1 "$TARGET"
