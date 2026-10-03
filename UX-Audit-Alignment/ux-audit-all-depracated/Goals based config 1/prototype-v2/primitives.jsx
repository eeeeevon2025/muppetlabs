// ============================================================
// Shared primitives, sparkline, status pill, chip, etc.
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

const Sparkline = ({ points, color = "currentColor", height = 36 }) => {
  if (!points || points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const dx = w / (points.length - 1);
  const pts = points.map((p, i) => {
    const x = i * dx;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return [x, y];
  });
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  return (
    <svg className="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ color }}>
      <path className="area" d={areaPath} />
      <path className="line" d={linePath} />
    </svg>
  );
};

const StatusPill = ({ status }) => {
  const labels = {
    live: "Live",
    testing: "Testing",
    draft: "Draft",
    attention: "Needs attention",
  };
  return (
    <span className={`status-pill ${status}`}>
      <span className="pulse"></span>
      {labels[status] || status}
    </span>
  );
};

const AudienceChip = ({ audience, small }) => {
  const map = {
    AIC: { label: "Customer AI", cls: "blue", full: "Handles customer conversations end-to-end" },
    AIR: { label: "Rep AI", cls: "purple", full: "Assists human reps with drafts and signals" },
    "AIC+AIR": { label: "Customer + Rep AI", cls: "purple", full: "Used by both customers and reps" },
    "Human Reps": { label: "Human", cls: "gray", full: "Handled by human reps" },
    Sales: { label: "Sales", cls: "yellow", full: "Sales team" },
    Other: { label: "Other", cls: "gray", full: "Other" },
  };
  const info = map[audience] || { label: audience, cls: "gray", full: audience };
  return <span className={`chip ${info.cls}`} title={info.full}>{info.label}</span>;
};

const Toolbar = ({ children }) => <div className="toolbar">{children}</div>;

const Facet = ({ active, count, onClick, children, className = "" }) => (
  <button className={`facet ${active ? "active" : ""} ${className}`} onClick={onClick}>
    {children}
    {count !== undefined && <span className="count">{count}</span>}
  </button>
);

const SearchInput = ({ value, onChange, placeholder = "Search…" }) => (
  <div className="search">
    <span className="search-ico"><Icon name="search" size={13} /></span>
    <input
      className="text"
      type="text"
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      style={{ paddingLeft: 30 }}
    />
  </div>
);

const EmptyState = ({ children }) => <div className="empty">{children}</div>;

const PageHeader = ({ crumbs, title, answers, actions, showAnswers = true, onTitleChange, titlePlaceholder }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef(null);

  // Keep local draft in sync when external title changes (e.g. new automation)
  useEffect(() => { setDraft(title); }, [title]);

  // Focus + select-all when entering edit mode
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const next = (draft || "").trim();
    if (next && next !== title && typeof onTitleChange === "function") {
      onTitleChange(next);
    } else {
      // empty or unchanged, reset draft to title
      setDraft(title);
    }
    setEditing(false);
  };
  const cancel = () => { setDraft(title); setEditing(false); };
  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { e.preventDefault(); cancel(); }
  };

  const editable = typeof onTitleChange === "function";
  const isUntitled = editable && (!title || /^untitled/i.test(title));

  return (
    <div className="page-head">
      {crumbs && (
        <div className="page-crumbs">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">›</span>}
              {c.onClick ? <a onClick={c.onClick}>{c.label}</a> : <span>{c.label}</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="page-head-row">
        <div className="page-head-title-wrap">
          {editable && editing ? (
            <input
              ref={inputRef}
              className="page-head-title-input"
              value={draft}
              placeholder={titlePlaceholder || "Untitled"}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={onKey}
              maxLength={80}
            />
          ) : (
            <h1
              className={`page-head-title ${editable ? "editable" : ""} ${isUntitled ? "untitled" : ""}`}
              onClick={editable ? () => setEditing(true) : undefined}
              title={editable ? "Click to rename" : undefined}
            >
              <span className="page-head-title-text">{title}</span>
              {editable && (
                <span className="page-head-title-edit" aria-hidden="true">
                  <Icon name="edit" size={12} />
                </span>
              )}
            </h1>
          )}
          {showAnswers && answers && <div className="answers"><span className="q">{answers}</span></div>}
        </div>
        {actions && <div className="page-head-actions">{actions}</div>}
      </div>
    </div>
  );
};

// Audience filter, dropdown popover with multi-select checkboxes
const AudienceFilter = ({ value, onChange, counts }) => {
  // Normalize incoming value to a Set of selected ids.
  // Legacy callers pass a single string like "all" or "AIC".
  const selected = (() => {
    if (Array.isArray(value)) return new Set(value);
    if (!value || value === "all") return new Set(["all"]);
    return new Set([value]);
  })();

  const isAll = selected.has("all") || selected.size === 0;
  const realSelections = window.MOCK.AUDIENCES.filter((a) => a.id !== "all" && selected.has(a.id));

  // Display label on the trigger button
  const triggerLabel = isAll
    ? "All"
    : realSelections.length === 0
      ? "None"
      : realSelections.length === 1
        ? realSelections[0].label
        : `${realSelections.length} selected`;

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const commit = (next) => {
    // If the caller was using single-select (string), keep emitting strings
    // when the user picks zero or one audience; otherwise emit an array.
    if (!Array.isArray(value)) {
      if (next.has("all") || next.size === 0) onChange("all");
      else if (next.size === 1) {
        const only = Array.from(next)[0];
        onChange(only);
      } else {
        // Caller is single-select; pick the first non-"all" id.
        const first = Array.from(next).find((id) => id !== "all");
        onChange(first || "all");
      }
    } else {
      onChange(Array.from(next));
    }
  };

  const toggle = (id) => {
    const next = new Set(selected);
    if (id === "all") {
      // "All" is an exclusive selection.
      if (next.has("all")) return; // tapping All when already All: no-op
      next.clear();
      next.add("all");
    } else {
      next.delete("all");
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) next.add("all");
    }
    commit(next);
  };

  return (
    <div className="audience-filter" ref={ref}>
      <button className={`audience-filter-trigger ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)}>
        <Icon name="filter" size={12} />
        <span className="audience-filter-label">Filter by</span>
        <span className="audience-filter-value">{triggerLabel}</span>
        <Icon name={open ? "chevDown" : "chevDown"} size={11} />
      </button>
      {open && (
        <div className="audience-filter-pop" role="menu">
          {window.MOCK.AUDIENCES.map((a) => {
            const checked = a.id === "all" ? isAll : selected.has(a.id);
            return (
              <button
                key={a.id}
                className={`audience-filter-opt ${checked ? "checked" : ""}`}
                onClick={() => toggle(a.id)}
                role="menuitemcheckbox"
                aria-checked={checked}
              >
                <span className="audience-filter-check">
                  {checked && <Icon name="check" size={11} />}
                </span>
                <span className="audience-filter-opt-label">{a.label}</span>
                {counts && counts[a.id] != null && (
                  <span className="audience-filter-opt-count">{counts[a.id]}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Tone picker
const TonePicker = ({ value, onChange }) => {
  const tones = ["Friendly", "Professional", "Casual", "Matter of Fact", "Custom"];
  return (
    <div className="tone-row">
      {tones.map((t) => (
        <button key={t} className={`tone-pill ${value === t ? "active" : ""}`} onClick={() => onChange(t)}>
          {t}
        </button>
      ))}
    </div>
  );
};

// Topic multi-select chips
// When __FLAGS__.topicHierarchy is on (C-5), renders parent/child indentation
// + brand/locale scope filters at the top.
//
// The fake hierarchy + brand/locale data live here as a presentation overlay
// (the underlying MOCK.TOPICS schema is unchanged for the demo).
const TOPIC_HIERARCHY = {
  // childId: { parent, brands: [...], locales: [...] }
  "refund-order":     { parent: "returns", brands: ["all"],   locales: ["all"] },
  "cancel-sub":       { parent: "billing", brands: ["all"],   locales: ["all"] },
  "shipping":         { parent: "tracking", brands: ["all"],  locales: ["all"] },
};
const TOPIC_BRANDS  = ["all", "Acme Outdoors US", "Acme Outdoors EU", "Pinecrest"];
const TOPIC_LOCALES = ["all", "en-US", "en-GB", "de-DE", "fr-FR"];

const TopicMulti = ({ selected, onChange }) => {
  const [flags, setFlags] = useState(() => window.__FLAGS__ || {});
  useEffect(() => {
    const onChangeFlags = (e) => setFlags(e.detail || {});
    window.addEventListener("flagschange", onChangeFlags);
    return () => window.removeEventListener("flagschange", onChangeFlags);
  }, []);

  const [brand, setBrand] = useState("all");
  const [locale, setLocale] = useState("all");

  const hierarchyOn = flags.topicHierarchy;

  if (!hierarchyOn) {
    // Original flat rendering, unchanged
    return (
      <div className="topic-multi">
        {window.MOCK.TOPICS.map((t) => (
          <button
            key={t.id}
            className={`topic-opt ${selected.includes(t.id) ? "active" : ""}`}
            onClick={() => {
              if (selected.includes(t.id)) onChange(selected.filter((s) => s !== t.id));
              else onChange([...selected, t.id]);
            }}
          >
            {selected.includes(t.id) && <Icon name="check" size={11} />}
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  // Hierarchy ON, build parent → children groupings on the fly
  const childrenByParent = {};
  const topLevel = [];
  for (const t of window.MOCK.TOPICS) {
    const hier = TOPIC_HIERARCHY[t.id];
    if (hier?.parent) {
      childrenByParent[hier.parent] = childrenByParent[hier.parent] || [];
      childrenByParent[hier.parent].push(t);
    } else {
      topLevel.push(t);
    }
  }

  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  return (
    <div className="topic-multi-scoped">
      <div className="topic-scope-row">
        <span className="flag-pill">C-5</span>
        <span className="topic-scope-label">Brand</span>
        <select className="topic-scope-sel" value={brand} onChange={(e) => setBrand(e.target.value)}>
          {TOPIC_BRANDS.map((b) => <option key={b} value={b}>{b === "all" ? "All brands" : b}</option>)}
        </select>
        <span className="topic-scope-label">Locale</span>
        <select className="topic-scope-sel" value={locale} onChange={(e) => setLocale(e.target.value)}>
          {TOPIC_LOCALES.map((l) => <option key={l} value={l}>{l === "all" ? "All locales" : l}</option>)}
        </select>
        <a className="topic-manage" onClick={(e) => { e.preventDefault(); alert("Manage topics → Settings → Topics (rename · merge · hierarchy)"); }}>
          <Icon name="edit" size={10} /> Manage
        </a>
      </div>
      <div className="topic-tree">
        {topLevel.map((parent) => {
          const kids = childrenByParent[parent.id] || [];
          const isSelected = selected.includes(parent.id);
          return (
            <div className="topic-tree-group" key={parent.id}>
              <button
                className={`topic-opt parent ${isSelected ? "active" : ""}`}
                onClick={() => toggle(parent.id)}
              >
                {isSelected && <Icon name="check" size={11} />}
                {parent.label}
                <span className="topic-volume">{parent.volume}%</span>
              </button>
              {kids.length > 0 && (
                <div className="topic-tree-kids">
                  {kids.map((kid) => {
                    const kidSel = selected.includes(kid.id);
                    return (
                      <button
                        key={kid.id}
                        className={`topic-opt child ${kidSel ? "active" : ""}`}
                        onClick={() => toggle(kid.id)}
                      >
                        <span className="topic-tree-elbow">└</span>
                        {kidSel && <Icon name="check" size={11} />}
                        {kid.label}
                        <span className="topic-volume">{kid.volume}%</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Goal target chip
const GoalChip = ({ name, onClick }) => (
  <button className="goal-chip" onClick={onClick} title={`Goal: ${name} — this feature rolls up to this goal`}>
    <Icon name="target" size={10} />
    {name}
  </button>
);

Object.assign(window, {
  Sparkline, StatusPill, AudienceChip, Toolbar, Facet,
  SearchInput, EmptyState, PageHeader, AudienceFilter,
  TonePicker, TopicMulti, GoalChip,
});
