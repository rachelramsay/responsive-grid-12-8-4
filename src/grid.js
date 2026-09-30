// Mirrors the Large / Medium / Small modes of 4. Layout — Responsive
export const BREAKPOINTS = [
  { name: 'small',  min: 0,    columns: 4 },
  { name: 'medium', min: 768,  columns: 8 },
  { name: 'large',  min: 1024, columns: 12 },
];

// 6 of 12 -> 4 of 8 -> 2 of 4; clamped to 1..toCols
export function scaleSpan(span, fromCols, toCols) {
  return Math.max(1, Math.min(toCols, Math.round((span * toCols) / fromCols)));
}

export function initGrid(root = document) {
  root.querySelectorAll('.grid[data-columns]').forEach((el) => {
    const { columns, columnsMedium, columnsSmall } = el.dataset;
    if (columns)       el.style.setProperty('--cols-large', columns);
    if (columnsMedium) el.style.setProperty('--cols-medium', columnsMedium);
    if (columnsSmall)  el.style.setProperty('--cols-small', columnsSmall);
  });

  // children of the page grid: missing Medium/Small spans scale from the 12-column value;
  // data-align-{medium|small|large}="center" centres the item on that breakpoint's grid
  root.querySelectorAll('.grid:not([data-columns]) > [data-span]').forEach((el) => {
    const d = el.dataset;
    const spans = {
      large:  Number(d.span),
      medium: Number(d.spanMedium ?? scaleSpan(Number(d.span), 12, 8)),
      small:  Number(d.spanSmall ?? scaleSpan(Number(d.span), 12, 4)),
    };
    for (const { name, columns } of BREAKPOINTS) {
      const Name = name[0].toUpperCase() + name.slice(1);
      el.style.setProperty(`--span-${name}`, spans[name]);
      const start = d[`start${Name}`] ??
        (d[`align${Name}`] === 'center' ? Math.floor((columns - spans[name]) / 2) + 1 : null);
      if (start) el.style.setProperty(`--start-${name}`, start);
    }
  });

  // children of nested grids: explicit values only, no scaling
  root.querySelectorAll('.grid[data-columns] > [data-span]').forEach((el) => {
    const { span, spanMedium, spanSmall } = el.dataset;
    el.style.setProperty('--span-large', span);
    if (spanMedium) el.style.setProperty('--span-medium', spanMedium);
    if (spanSmall)  el.style.setProperty('--span-small', spanSmall);
  });
}

export function watchBreakpoint(onChange) {
  const queries = BREAKPOINTS.map((bp) => ({ ...bp, mq: matchMedia(`(min-width: ${bp.min}px)`) }));
  let last;
  const update = () => {
    const current = queries.filter((q) => q.mq.matches).at(-1);
    if (current.name === last) return; // several queries can flip at once
    last = current.name;
    document.documentElement.dataset.breakpoint = current.name;
    onChange?.(current);
  };
  queries.forEach((q) => q.mq.addEventListener('change', update));
  update();
}
