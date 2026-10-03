// ============================================================
// Shared primitives — sparkline, status pill, chip, etc.
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
    AIC: { label: "AIC", cls: "blue", full: "AI for Customers" },
    AIR: { label: "AIR", cls: "purple", full: "AI for Reps" },
    "AIC+AIR": { label: "AIC + AIR", cls: "purple", full: "Both" },
    "Human Reps": { label: "Human", cls: "gray", full: "Human Reps" },
    Sales: { label: "Sales", cls: "yellow", full: "Sales" },
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

const PageHeader = ({ crumbs, title, answers, actions }) => {
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
        <div>
          <h1>{title}</h1>
          {answers && <div className="answers"><b>Answers:</b> {answers}</div>}
        </div>
        {actions && <div className="page-head-actions">{actions}</div>}
      </div>
    </div>
  );
};

// Audience filter row used across many screens
const AudienceFilter = ({ value, onChange, counts }) => (
  <>
    {window.MOCK.AUDIENCES.map((a) => (
      <Facet
        key={a.id}
        active={value === a.id}
        onClick={() => onChange(a.id)}
        count={counts ? counts[a.id] : undefined}
      >
        {a.label}
      </Facet>
    ))}
  </>
);

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
const TopicMulti = ({ selected, onChange }) => (
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

// Goal target chip
const GoalChip = ({ name, onClick }) => (
  <button className="chip yellow" onClick={onClick} style={{ cursor: "pointer", fontWeight: 500 }}>
    <Icon name="target" size={11} />
    {name}
  </button>
);

Object.assign(window, {
  Sparkline, StatusPill, AudienceChip, Toolbar, Facet,
  SearchInput, EmptyState, PageHeader, AudienceFilter,
  TonePicker, TopicMulti, GoalChip,
});
