# HTML architecture diagram — examples

## CSS tokens (reuse in every diagram)

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #cbd5e1;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #2563eb;
  --accent-2: #059669;
  --group-bg: #f1f5f9;
  --radius: 8px;
  --font: system-ui, -apple-system, "Segoe UI", sans-serif;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 24px;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
}
.diagram-header h1 { margin: 0 0 4px; font-size: 1.25rem; }
.diagram-header p { margin: 0 0 20px; color: var(--muted); font-size: 0.875rem; }
.diagram-canvas {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
}
.layer {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
}
.group {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 16px;
  background: var(--group-bg);
}
.group-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.component {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  min-width: 140px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
}
.component small {
  display: block;
  font-weight: 400;
  color: var(--muted);
  margin-top: 4px;
  font-size: 0.75rem;
}
.component.primary { border-color: var(--accent); }
.component.store { border-color: var(--accent-2); }
.diagram-legend {
  margin-top: 24px;
  font-size: 0.75rem;
  color: var(--muted);
}
.diagram-legend dt { font-weight: 600; display: inline; }
.diagram-legend dd { display: inline; margin: 0 16px 0 4px; }
.arrows {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}
.arrows line, .arrows path {
  stroke: var(--muted);
  stroke-width: 2;
  fill: none;
  marker-end: url(#arrowhead);
}
```

## Minimal three-tier example (structure)

```html
<main class="diagram-canvas" role="img" aria-label="三层 Web 应用架构">
  <div class="layer">
    <div class="component primary">Web 前端<small>React</small></div>
  </div>
  <div class="layer">
    <div class="group">
      <div class="group-label">后端</div>
      <div class="layer">
        <div class="component">API<small>Node.js</small></div>
        <div class="component store">PostgreSQL<small>持久化</small></div>
      </div>
    </div>
  </div>
  <svg class="arrows" aria-hidden="true">
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" fill="#64748b" />
      </marker>
    </defs>
    <!-- position lines after layout or use flex + separate row connectors -->
  </svg>
</main>
```

For arrows between flex rows, either:
- Use a **column flex** with small `→` text rows between layers, or
- Set `.diagram-canvas { position: relative }` and compute SVG coordinates (acceptable for fixed layouts).

Prefer **text connectors** (`↓ HTTPS`) between `.layer` blocks when SVG positioning is fragile.

## Edge label pattern

```html
<div class="layer connector" style="justify-content:center;color:var(--muted);font-size:0.75rem;">
  ↓ REST / JSON
</div>
```

## File naming

| User topic | Filename |
|------------|----------|
| DEX 架构 | `docs/diagrams/dex-architecture.html` |
| 登录流程 | `docs/diagrams/auth-flow.html` |

Use lowercase kebab-case; ASCII slug unless the project uses Chinese filenames.

## Checklist before handing off

- [ ] Single `.html`, opens offline
- [ ] Title + legend
- [ ] Groups match real boundaries
- [ ] Edge labels show protocol or data
- [ ] No secrets in diagram text
