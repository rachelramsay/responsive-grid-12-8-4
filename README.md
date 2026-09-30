# Responsive 12 / 8 / 4 grid

A token-driven CSS Grid for the NetSuite `4. Layout — Responsive` collection, with a small vanilla JS helper and an interactive preview.

**Live preview:** https://rachelramsay.github.io/responsive-grid-12-8-4/ (or serve the folder locally, e.g. `python3 -m http.server`). Pick Small / Medium / Large or drag the width slider; the pink bands are the columns.

## Breakpoints and tokens

Values from the NS Tokens registry (reconciled 2026-09-26).

| Token | Large (≥ 1024) | Medium (768–1023) | Small (< 768) |
| --- | --- | --- | --- |
| `grid/columns` | 12 | 8 | 4 |
| `layout/gap` | 32px | 24px | 16px |
| `layout/padding/horizontal` | 136px | 32px | 24px |

CSS custom properties follow the NS naming rule (`--nsds-` + path with `/` → `-`). WEB code syntax for this collection is not yet assigned in Foundations, so treat the names as proposed until confirmed with development.

## Files

```
index.html          preview shell (width controls + scaled iframe)
demo.html           the demo page; uses src/grid.css and src/grid.js
src/grid.css        breakpoint tokens + .grid rules
src/grid.js         initGrid(), watchBreakpoint(), scaleSpan()
tokens/*.tokens.json  DTCG 2025.10: primitives + one Layout file per mode
```

## Usage

```html
<link rel="stylesheet" href="src/grid.css">

<div class="grid">
  <article data-span="12">Hero</article>
  <article data-span="6" data-span-small="4">Half</article>
  <!-- 3-up at Large, one per row centred on columns 2–7 at Medium, full width at Small -->
  <article data-span="4" data-span-medium="6" data-align-medium="center" data-span-small="4">Third</article>
  <article data-span="8">
    <div class="grid" data-columns="3" data-columns-small="1">…</div>
  </article>
</div>

<script type="module">
  import { initGrid, watchBreakpoint } from './src/grid.js';
  initGrid();
  watchBreakpoint((bp) => console.log(bp.name, bp.columns));
</script>
```

| Attribute | Meaning |
| --- | --- |
| `data-span` | Columns at Large (of 12). Medium/Small scale proportionally unless set. |
| `data-span-medium`, `data-span-small` | Explicit span at that breakpoint. |
| `data-start-{large\|medium\|small}` | Explicit start column (1-based). |
| `data-align-{large\|medium\|small}="center"` | Centre the item on that breakpoint's grid. |
| `data-columns`, `data-columns-medium`, `data-columns-small` | Column count of a nested grid. |

With no span, a page-grid child is full width; a nested-grid child fills one column.

## Notes

- Figma grid auto layout can't bind column count or span to variables yet, so the Figma `Grid` component uses a `columns` variant paired with the Large / Medium / Small modes.
- DTCG: `grid.columns` (Layout) and `grid.columns.12` (Primitives) must stay in separate files; merged, `grid.columns` would be both a token and a group.
- Open question: at exactly 1024px, 136px padding leaves ~35px per column.
