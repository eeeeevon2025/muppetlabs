(function () {
  const root = window.IA_TREE;
  const treeEl = document.getElementById("tree");
  const detailEl = document.getElementById("detail");
  if (!root || !treeEl || !detailEl) return;

  const index = new Map();
  const openIds = new Set();

  function walk(node, path) {
    const next = path.concat(node);
    index.set(node.id, { node, path: next });
    (node.children || []).forEach((child) => walk(child, next));
  }
  walk(root, []);
  openIds.add(root.id);
  (root.children || []).forEach((child) => openIds.add(child.id));

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M6 9.5V20h12V9.5"/>',
    quiz: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="M7 7c0 3 2 4 5 4s5-1 5-4"/>',
    users: '<path d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"/><path d="M16 11a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 16 11Z"/><path d="M3 19c.6-2.4 2.4-3.5 5-3.5s4.4 1.1 5 3.5"/><path d="M14 15.6c1.2-.4 2.4-.5 3.5-.1 1.3.5 2.2 1.6 2.5 3.5"/>',
    stage: '<path d="M4 18V8l8-4 8 4v10"/><path d="M8 18v-4h8v4"/>',
    cast: '<circle cx="12" cy="8" r="3"/><path d="M6 19c1-3 3-4.5 6-4.5s5 1.5 6 4.5"/>',
    book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5Z"/><path d="M5 5.5V21"/>',
    pin: '<path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"/><circle cx="12" cy="11" r="2"/>',
    bag: '<path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    dot: '<circle cx="12" cy="12" r="3"/>',
  };

  function icon(node) {
    const path = ICONS[node.iconName] || ICONS.dot;
    return `<span class="ico ${esc(node.iconClass || "")}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg></span>`;
  }

  function pills(node) {
    return (node.pills || [])
      .map((pill) => `<span class="pill ${esc(pill.kind)}">${esc(pill.text)}</span>`)
      .join("");
  }

  function renderNode(node, depth) {
    const hasChildren = Boolean(node.children && node.children.length);
    const open = openIds.has(node.id);
    const selected = detailEl.dataset.id === node.id;
    const chevron = hasChildren
      ? '<svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 4 4 4-4 4"/></svg>'
      : '<svg class="chevron spacer" viewBox="0 0 16 16"></svg>';
    const kids = hasChildren
      ? `<div class="tree-children${open ? " open" : ""}">${node.children.map((child) => renderNode(child, depth + 1)).join("")}</div>`
      : "";
    return `<div class="tree-node">
      <button type="button" class="tree-row${open ? " open" : ""}${selected ? " is-selected" : ""}" data-id="${esc(node.id)}" style="padding-left:${12 + depth * 14}px">
        ${chevron}${icon(node)}<span class="tree-label">${esc(node.label)}</span>${pills(node)}
      </button>
      ${kids}
    </div>`;
  }

  function list(items) {
    if (!items || !items.length) return "";
    return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }

  function renderDetail(node) {
    const detail = node.detail || {};
    const crumbs = (index.get(node.id)?.path || []).map((item) => item.label).join(" → ");
    const blocks = [
      detail.purpose && `<div class="detail-block"><h4>Purpose</h4><p>${esc(detail.purpose)}</p></div>`,
      detail.contents && `<div class="detail-block"><h4>On the screen</h4>${list(detail.contents)}</div>`,
      detail.rationale && `<div class="detail-block"><h4>Why it lives here</h4><p>${esc(detail.rationale)}</p></div>`,
      detail.sketch && `<div class="detail-block"><h4>Sketch</h4><pre class="sketch">${esc(detail.sketch)}</pre></div>`,
      detail.touchpoints && `<div class="detail-block"><h4>Also referenced</h4>${list(detail.touchpoints)}</div>`,
      detail.sources && `<div class="detail-block"><h4>Sources</h4>${list(detail.sources.map((source) => `${source.kind}: ${source.label}${source.note ? " — " + source.note : ""}`))}</div>`,
    ].filter(Boolean);
    detailEl.dataset.id = node.id;
    detailEl.innerHTML = `<p class="detail-kicker">${esc(crumbs)}</p><h3>${esc(node.label)}</h3>${detail.one_liner ? `<p class="one-liner">${esc(detail.one_liner)}</p>` : ""}${blocks.join("")}`;
  }

  function paint(selectedId) {
    if (selectedId) renderDetail(index.get(selectedId).node);
    treeEl.innerHTML = renderNode(root, 0);
  }

  treeEl.addEventListener("click", (event) => {
    const row = event.target.closest(".tree-row");
    if (!row) return;
    const node = index.get(row.dataset.id)?.node;
    if (!node) return;
    if (node.children && node.children.length) {
      if (openIds.has(node.id)) openIds.delete(node.id);
      else openIds.add(node.id);
    }
    paint(node.id);
  });

  document.getElementById("btn-expand")?.addEventListener("click", () => {
    index.forEach(({ node }) => openIds.add(node.id));
    paint(detailEl.dataset.id);
  });
  document.getElementById("btn-collapse")?.addEventListener("click", () => {
    openIds.clear();
    openIds.add(root.id);
    paint(detailEl.dataset.id);
  });

  paint(root.id);
})();
