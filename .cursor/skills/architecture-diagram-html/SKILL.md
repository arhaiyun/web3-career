---
name: architecture-diagram-html
description: >-
  Creates system and software architecture diagrams as standalone HTML files
  with embedded CSS (and SVG arrows when needed). Use when the user asks for
  architecture diagrams, system design visuals, component maps, deployment
  views, data-flow diagrams, or explicitly requests HTML format diagrams.
disable-model-invocation: true
---

# Architecture Diagram (HTML)

## When to use

Apply when the user wants an **architecture / system / deployment / data-flow** diagram and output must be **HTML** (not Mermaid-only markdown, not PNG, not Canvas unless they also want HTML).

## Output contract

1. Deliver a **single self-contained `.html` file** (UTF-8, `lang` set appropriately).
2. **All styles in `<style>`** inside the file; no external CSS/CDN unless the user asks.
3. **No build step** — opening the file in a browser must render the diagram.
4. Prefer **semantic class names** (`layer`, `component`, `group`, `arrow`, `legend`) over inline styles except one-off tweaks.
5. Default save path: `docs/diagrams/<slug>.html` in the current project; if missing, create `docs/diagrams/`. Use another path only when the user specifies.

## Workflow

1. **Clarify scope** (briefly; do not block on perfect input):
   - Diagram type: system context | containers | components | deployment | data flow | sequence-style flow
   - Audience: technical doc vs presentation
   - Language for labels (match the user's message language)
2. **Inventory** on paper (in comments at top of HTML or in reply):
   - Nodes (systems, services, stores, actors)
   - Edges (calls, async, reads/writes) with direction
   - Boundaries (VPC, k8s cluster, trust zone) if relevant
3. **Lay out** top-to-bottom or left-to-right; group related nodes in `.group` / `.layer`.
4. **Implement** using the template patterns in [examples.md](examples.md).
5. **Validate mentally**: every edge has a clear source/target; legend explains line styles; title + optional subtitle present.
6. **Tell the user** the file path and: "在浏览器中打开该 HTML 文件即可查看。"

## HTML structure (required skeleton)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><!-- diagram title --></title>
  <style>
    /* tokens + layout — see examples.md */
  </style>
</head>
<body>
  <header class="diagram-header">...</header>
  <main class="diagram-canvas" role="img" aria-label="...">
    <!-- groups, components, svg arrows -->
  </main>
  <footer class="diagram-legend">...</footer>
</body>
</html>
```

## Layout rules

| Rule | Guidance |
|------|----------|
| Boxes | Rounded rects; min-width ~120px; padding 12–16px |
| Groups | Dashed border + label (e.g. "链下", "AWS VPC") |
| Arrows | SVG `<line>` / `<path>` with `marker-end`; or CSS border tricks only for simple cases |
| Colors | Neutral background; 2–4 accent hues; ensure **4.5:1** text contrast |
| Density | Max ~12 primary nodes per view; split into multiple HTML files if larger |
| Text | Short labels; put details in `title` attribute or legend |

## Diagram-type hints

- **System context**: actors on edges; one central system; few external systems.
- **Containers**: layers (UI → API → workers → DB); show protocols on edges (`HTTPS`, `gRPC`).
- **Deployment**: regions/hosts as groups; replicas as stacked or repeated boxes.
- **Data flow**: label edges with data names (`OrderCreated`, `events`).

## Do not

- Rely on Mermaid/PlantUML as the **only** deliverable when HTML was requested.
- Use JavaScript frameworks or npm-only assets for static diagrams.
- Put secrets, real API keys, or internal URLs the user did not provide.

## Additional resources

- Copy-paste templates and a minimal example: [examples.md](examples.md)
