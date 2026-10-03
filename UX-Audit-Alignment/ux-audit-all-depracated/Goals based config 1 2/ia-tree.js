// =============================================================
// IA tree renderer + detail-panel + scorecard pip filler
// =============================================================

// Lucide-style icon paths used for node glyphs.
const IA_ICONS = {
  home:      '<path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/>',
  target:    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  activity:  '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  chartLine: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  inbox:     '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  building:  '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>',
  search:    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  listSearch:'<path d="M3 6h13"/><path d="M3 12h7"/><path d="M3 18h7"/><circle cx="17" cy="15" r="3"/><path d="m21 19-1.9-1.9"/>',
  pieChart:  '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  sparkles:  '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275z"/>',
  cog:       '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  wand:      '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>',
  chat:      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  headset:   '<path d="M3 14a9 9 0 0 1 18 0v3a3 3 0 0 1-3 3h-1v-7h4"/><path d="M3 14v3a3 3 0 0 0 3 3h1v-7H3"/>',
  bookOpen:  '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  server:    '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01"/><path d="M6 17h.01"/>',
  grid:      '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  bolt:      '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  wrench:    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  bell:      '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  user:      '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  flask:     '<path d="M9 3h6"/><path d="M10 3v6L4.5 19a2 2 0 0 0 1.73 3h11.54A2 2 0 0 0 19.5 19L14 9V3"/>',
  searchCode: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="m9.5 11.5 1.5-1.5-1.5-1.5"/><path d="m12.5 8.5 1.5 1.5-1.5 1.5"/>',
  moreH:     '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  help:      '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
};

function iaIconSvg(name) {
  const paths = IA_ICONS[name];
  if (!paths) return "";
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
}

(function () {
  const tree = window.IA_TREE;
  const treeEl = document.getElementById("tree");
  const detailEl = document.getElementById("detail");

  // ----- scorecard pip filler -----
  document.querySelectorAll(".pips").forEach(el => {
    const score = parseInt(el.dataset.score, 10) || 0;
    el.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("span");
      dot.className = "pip" + (i < score ? " on" : "");
      el.appendChild(dot);
    }
  });

  // ----- build node map + paths for breadcrumbs -----
  const nodeIndex = {};
  function indexNode(node, path) {
    nodeIndex[node.id] = { node, path };
    (node.children || []).forEach(c => indexNode(c, path.concat(node)));
  }
  indexNode(tree, []);

  // ----- chevron svg -----
  const CHEV = `<svg class="chev" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ----- render tree -----
  function renderNode(node, isOpen) {
    const isOverflow = node.id === "overflow";
    const wrap = document.createElement("div");
    wrap.className = "node" + (isOpen ? " open" : "") + (isOverflow ? " is-overflow" : "");
    wrap.dataset.id = node.id;

    const row = document.createElement("div");
    row.className = "node-row";
    row.tabIndex = 0;

    const hasKids = (node.children || []).length > 0;
    const iconInner = node.iconName
      ? iaIconSvg(node.iconName)
      : (node.iconImg ? `<img src="${node.iconImg}" alt="" />` : (node.iconGlyph || ""));

    if (isOverflow) {
      // "More" renders like a normal row: dots are its icon on the left, then label.
      // It has children (the overflow items) but the chevron stays hidden because
      // the children render as a popover, not as an inline expanded list.
      row.innerHTML = `
        <svg class="chev hidden" viewBox="0 0 24 24"></svg>
        <span class="icon ${node.iconClass}">${iconInner}</span>
        <span class="label">${node.label}</span>
        <span class="pills">${(node.pills||[]).map(p => `<span class="meta-pill ${p.kind||''}">${p.text}</span>`).join("")}</span>
      `;
    } else {
      row.innerHTML = `
        ${hasKids ? CHEV : `<svg class="chev hidden" viewBox="0 0 24 24"></svg>`}
        <span class="icon ${node.iconClass}">${iconInner}</span>
        <span class="label">${node.label}</span>
        <span class="pills">${(node.pills||[]).map(p => `<span class="meta-pill ${p.kind||''}">${p.text}</span>`).join("")}</span>
      `;
    }

    row.addEventListener("click", (e) => {
      // For the kebab "More" overflow: just toggle the side popover. Don't
      // hijack the detail panel — leave whatever was previously selected.
      if (isOverflow) {
        const wasOpen = wrap.classList.contains("open");
        wrap.classList.toggle("open");
        if (!wasOpen) {
          // Position the fixed popover relative to the row so it escapes
          // any overflow:auto clipping on ancestors (.tree-col scrolls).
          const popover = wrap.querySelector(":scope > .children");
          if (popover) {
            const rowRect = row.getBoundingClientRect();
            popover.style.left = rowRect.left + "px";
            popover.style.bottom = (window.innerHeight - rowRect.top + 6) + "px";
            popover.style.top = "auto";
            popover.style.right = "auto";
          }
        }
        return;
      }
      // toggle open if has kids; always select
      if (hasKids) {
        wrap.classList.toggle("open");
      }
      selectNode(node.id);
    });

    wrap.appendChild(row);

    if (hasKids) {
      const kids = document.createElement("div");
      kids.className = "children";
      node.children.forEach(c => kids.appendChild(renderNode(c, false)));
      wrap.appendChild(kids);
    }

    return wrap;
  }

  // ----- selection + detail render -----
  function selectNode(id) {
    document.querySelectorAll(".node-row.selected").forEach(el => el.classList.remove("selected"));
    const wrap = treeEl.querySelector(`.node[data-id="${id}"]`);
    if (wrap) wrap.querySelector(":scope > .node-row").classList.add("selected");

    // ensure ancestors are open
    let entry = nodeIndex[id];
    entry.path.forEach(p => {
      const w = treeEl.querySelector(`.node[data-id="${p.id}"]`);
      if (w) w.classList.add("open");
    });

    renderDetail(entry.node, entry.path);
  }

  function renderOverflowMenu(node) {
    // Clear any selected-row highlight in the tree.
    document.querySelectorAll(".node-row.selected").forEach(el => el.classList.remove("selected"));
    // Mark the More row as selected so the user has a visual anchor.
    const wrap = treeEl.querySelector(`.node[data-id="${node.id}"]`);
    if (wrap) wrap.querySelector(":scope > .node-row").classList.add("selected");

    const kids = node.children || [];
    const items = kids.map(c => {
      const iconInner = c.iconName
        ? iaIconSvg(c.iconName)
        : (c.iconImg ? `<img src="${c.iconImg}" alt="" />` : (c.iconGlyph || ""));
      const pills = (c.pills || []).map(p => `<span class="meta-pill ${p.kind||''}">${p.text}</span>`).join("");
      return `<button class="ovm-item" data-id="${c.id}">
        <span class="ovm-icon icon ${c.iconClass}">${iconInner}</span>
        <span class="ovm-label">${c.label}</span>
        <span class="ovm-pills">${pills}</span>
      </button>`;
    }).join("");

    detailEl.innerHTML = `
      <div class="crumbs">
        <span class="crumb">Kustomer Platform</span>
        <span class="sep">›</span>
        <span class="cur" style="color:var(--gray-120);font-weight:600">${node.label}</span>
      </div>
      <h3 class="dtitle">${node.label}</h3>
      <p class="sub">${(node.detail && node.detail.one_liner) || "Low-frequency destinations live here."}</p>
      <div class="ovm-list">${items}</div>
    `;
    detailEl.scrollTop = 0;

    // Wire up clicks on each item to drill in.
    detailEl.querySelectorAll(".ovm-item").forEach(btn => {
      btn.addEventListener("click", () => selectNode(btn.dataset.id));
    });
  }

  function renderDetail(node, path) {
    const d = node.detail || {};
    const crumbs = path.concat(node).map((n, i, arr) =>
      `<span class="${i === arr.length-1 ? 'cur' : 'crumb'}" style="${i===arr.length-1?'color:var(--gray-120);font-weight:600':''}">${n.label}</span>`
    ).join('<span class="sep">›</span>');

    let contentsHtml = "";
    if (Array.isArray(d.contents)) {
      contentsHtml = `<ul>${d.contents.map(c => `<li>${c}</li>`).join("")}</ul>`;
    } else if (typeof d.contents === "string") {
      contentsHtml = `<p>${d.contents}</p>`;
    }

    const kids = node.children || [];
    const hasGoalCards = d.goal_cards && d.goal_cards.length;
    const subpagesHtml = kids.length && !hasGoalCards ? `
      <div class="subpages">
        ${kids.map(c => {
          const iconInner = c.iconName
            ? iaIconSvg(c.iconName)
            : (c.iconImg ? `<img src="${c.iconImg}" alt="" />` : (c.iconGlyph || ""));
          const one = (c.detail && c.detail.one_liner) || "";
          return `<button class="subpage-card" data-id="${c.id}">
            <span class="subpage-icon icon ${c.iconClass}">${iconInner}</span>
            <span class="subpage-body">
              <span class="subpage-label">${c.label}</span>
              <span class="subpage-desc">${one}</span>
            </span>
          </button>`;
        }).join("")}
      </div>
    ` : "";

    const goalCardsHtml = hasGoalCards ? `<div class="goal-cards">${d.goal_cards.map(g => {
      const pts = g.points || [];
      const n = pts.length;
      const max = Math.max(...pts, 1);
      const min = Math.min(...pts, 0);
      const w = 160, h = 36;
      const xs = pts.map((_, i) => (i / Math.max(n - 1, 1)) * w);
      const ys = pts.map(p => h - ((p - min) / Math.max(max - min, 1)) * (h - 4) - 2);
      const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ');
      return `<div class="goal-card">
        <div class="goal-card-head">
          <span class="goal-card-label">${g.label}</span>
          <span class="goal-card-state">${g.state || ''}</span>
        </div>
        <div class="goal-card-subtitle">${g.subtitle || ''}</div>
        <svg class="goal-card-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
          <path d="${path}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="goal-card-foot">
          <span class="goal-card-audience">${g.audience || ''}</span>
          <span class="goal-card-progress">${g.progress != null ? g.progress + '%' : ''}</span>
        </div>
      </div>`;
    }).join("")}</div>` : "";

    const layerInfo = {
      "outcome": { tag: "Outcome layer", cls: "layer-outcome" },
      "operational": { tag: "Operational layer", cls: "layer-operational" },
      "per-automation": { tag: "Per-automation layer", cls: "layer-per-auto" }
    };
    const lyr = d.metric_layer && layerInfo[d.metric_layer];
    const answersHtml = (lyr && d.answers_question)
      ? `<div class="layer-answers ${lyr.cls}"><span class="layer-tag">${lyr.tag}</span><span class="layer-q"><b>Answers:</b> ${d.answers_question}</span></div>`
      : "";

    detailEl.innerHTML = `
      <div class="crumbs">${crumbs}</div>
      <h3 class="dtitle">${node.label}</h3>
      <p class="sub">${d.one_liner || ""}</p>
      ${answersHtml}
      ${goalCardsHtml}
      ${subpagesHtml}
      <div class="blocks">
        ${d.purpose ? `<div class="block"><h4>Purpose</h4><p>${d.purpose}</p></div>` : ""}
        ${d.goals_ref ? `<div class="block block-goals"><h4>🎯 Goals reference</h4><p>${d.goals_ref}</p></div>` : ""}
        ${d.topics_ref ? `<div class="block block-topics"><h4>🗂 Topics reference</h4><p>${d.topics_ref}</p></div>` : ""}
        ${d.suggestions_ref ? `<div class="block block-suggestions"><h4>✨ Suggestions reference</h4><p>${d.suggestions_ref}</p></div>` : ""}
        ${d.touchpoints && d.touchpoints.length ? `<div class="block block-touch"><h4>🔗 Other touchpoints</h4><ul>${d.touchpoints.map(t => `<li>${t}</li>`).join("")}</ul></div>` : ""}
        ${d.goal_attach ? `<div class="block block-goal-attach"><h4>🎯 Attached goals</h4><div class="goal-attach-card"><div class="ga-row"><div class="ga-pill">Refund tickets 20%</div><div class="ga-pill">Speed up rep responses</div></div><div class="ga-actions"><button type="button" class="ga-btn ga-btn-primary">+ Attach goal</button><span class="ga-divider">or</span><button type="button" class="ga-btn">+ Create new goal</button></div><p class="ga-note">${d.goal_attach}</p></div></div>` : ""}
        ${d.ai_creates && d.ai_creates.length ? `<div class="block block-ai-creates"><h4>✨ What AI creates for the automation</h4><ul>${d.ai_creates.map(t => `<li>${t}</li>`).join("")}</ul></div>` : ""}
        ${d.journey && d.journey.length ? `<div class="block"><h4>🧭 Mini end-to-end</h4><div class="flow">${d.journey.map((s, i, arr) => {
          const cls = ['flow-node', s.mode || ''].filter(Boolean).join(' ');
          const node = `<div class="${cls}"><div class="n">${s.n || i+1}</div><div><h5>${s.title}${s.where ? ` <span class="where">${s.where}</span>` : ""}</h5><p>${s.body}</p></div></div>`;
          const arrow = i < arr.length - 1 ? `<div class="flow-arrow"></div>` : '';
          return node + arrow;
        }).join("")}</div></div>` : ""}
        ${(() => {
          const contentsBlock = d.contents ? `<div class="block"><h4>What's in here</h4>${contentsHtml}</div>` : "";
          const ctasBlock = d.ctas && d.ctas.length ? `<div class="block block-ctas"><h4>⚡ What you can do</h4><div class="cta-list">${d.ctas.map(c => {
            const cls = c.primary ? 'primary' : (c.facet ? 'facet' : (c.destructive ? 'destructive' : ''));
            return `<div class="cta-row"><span class="cta-chip ${cls}">${c.label}</span>${c.note ? `<span class="cta-desc">${c.note}</span>` : ''}</div>`;
          }).join("")}</div></div>` : "";
          if (contentsBlock && ctasBlock) return `<div class="blocks-row">${contentsBlock}${ctasBlock}</div>`;
          return contentsBlock + ctasBlock;
        })()}
        ${d.rationale ? `<div class="block"><h4>Why it lives here</h4><p>${d.rationale}</p></div>` : ""}
      </div>
    `;
    detailEl.scrollTop = 0;
    detailEl.querySelectorAll(".subpage-card").forEach(btn => {
      btn.addEventListener("click", () => selectNode(btn.dataset.id));
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  }

  // ----- expand / collapse -----
  document.getElementById("btn-expand").addEventListener("click", () => {
    treeEl.querySelectorAll(".node").forEach(n => n.classList.add("open"));
  });
  document.getElementById("btn-collapse").addEventListener("click", () => {
    treeEl.querySelectorAll(".node").forEach((n, i) => {
      if (i !== 0) n.classList.remove("open");
    });
  });

  // ----- initial render -----
  // open: root + goals + workspace by default (most interesting path)
  const rootEl = renderNode(tree, true);
  treeEl.appendChild(rootEl);
  // open Goals + Workspace by default
  ["goals", "workspace"].forEach(id => {
    const w = treeEl.querySelector(`.node[data-id="${id}"]`);
    if (w) w.classList.add("open");
  });
  // select Goals to land users on the spine
  selectNode("goals");
})();
