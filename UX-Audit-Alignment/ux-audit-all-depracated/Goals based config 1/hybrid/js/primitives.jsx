// Shared UI primitives used across the goals-first prototype.

// Tokens (local — also available in colors_and_type.css if needed)
const T = {
  ink:    "#1F242D",
  ink2:   "#3D434F",
  ink3:   "#5F6675",
  ink4:   "#9099AB",
  ink5:   "#B3BBCB",
  rule:   "#E8EAF0",
  rule2:  "#F0F2F6",
  bg:     "#FFFFFF",
  bgSoft: "#FAFAFB",
  cream:  "#FAF7F0",
  yellow: "#FBEC2A",
  yellowSoft: "#FFF6B8",
  yellowDeep: "#E8D200",
  peri:   "#B9C1FF",
  periSoft: "#E2E6FF",
  periDeep: "#6E79E0",
  success:    "#16A36B",
  successBg:  "#E5F5EC",
  warn:       "#C28A12",
  warnBg:     "#FFF4E2",
  danger:     "#D63A43",
  dangerBg:   "#FDECEC",
  blue:       "#0165E4",
  blueSoft:   "#DBE7FF",
};

// ── State pip + label ───────────────────────────────────────────────
const STATE_INFO = {
  draft:     { color: "#9099AB", label: "Draft" },
  planned:   { color: "#B9C1FF", label: "Planned" },
  testing:   { color: "#6E79E0", label: "Testing" },
  limited:   { color: "#FBEC2A", label: "Limited rollout" },
  live:      { color: "#16A36B", label: "Live" },
  attention: { color: "#D63A43", label: "Needs attention" },
  improving: { color: "#B9C1FF", label: "Improving" },
  archived:  { color: "#5F6675", label: "Archived" },
};

const StatePill = ({ state, size = "md" }) => {
  const info = STATE_INFO[state] || STATE_INFO.draft;
  const big = size === "md";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: big ? "4px 10px" : "2px 8px",
      borderRadius: 999,
      background: "rgba(31,42,46,0.04)",
      border: "1px solid rgba(31,42,46,0.08)",
      fontSize: big ? 12 : 11, fontWeight: 600, color: T.ink,
      fontFamily: "var(--font-sans)",
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: big ? 7 : 6, height: big ? 7 : 6, borderRadius: 999,
        background: info.color,
        boxShadow: state === "live" ? "0 0 0 3px rgba(22,163,107,0.18)" : "none",
      }}/>
      {info.label}
    </span>
  );
};

// ── Chip ─────────────────────────────────────────────────────────────
const Chip = ({ children, tone = "default", icon }) => {
  const tones = {
    default: { bg: "rgba(31,42,46,0.05)", fg: T.ink2, bd: "transparent" },
    success: { bg: T.successBg, fg: T.success, bd: "transparent" },
    warn:    { bg: T.warnBg,    fg: T.warn,    bd: "transparent" },
    danger:  { bg: T.dangerBg,  fg: T.danger,  bd: "transparent" },
    peri:    { bg: T.periSoft,  fg: T.periDeep, bd: "transparent" },
    yellow:  { bg: "rgba(251,236,42,0.3)", fg: "#6e5800", bd: "transparent" },
    outline: { bg: "transparent", fg: T.ink2, bd: T.rule },
  }[tone] || {};
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px",
      borderRadius: 999,
      background: tones.bg,
      color: tones.fg,
      border: tones.bd === "transparent" ? "none" : `1px solid ${tones.bd}`,
      fontSize: 12, fontWeight: 600,
      fontFamily: "var(--font-sans)",
      whiteSpace: "nowrap",
    }}>{icon && <Icon name={icon} size={11} strokeWidth={2.2}/>}{children}</span>
  );
};

// ── Buttons ──────────────────────────────────────────────────────────
const Btn = ({ kind = "secondary", icon, iconRight, children, onClick, size = "md", style }) => {
  const sizes = {
    sm: { pad: "5px 10px", fs: 12.5 },
    md: { pad: "8px 14px", fs: 13.5 },
    lg: { pad: "10px 18px", fs: 14 },
  }[size];
  const kinds = {
    primary: { bg: T.blue, fg: "#fff", bd: T.blue, hov: "#014FB3" },
    ink:     { bg: T.ink, fg: "#fff", bd: T.ink, hov: "#2F3742" },
    yellow:  { bg: T.yellow, fg: T.ink, bd: T.yellow, hov: T.yellowDeep },
    secondary: { bg: "#fff", fg: T.ink, bd: T.rule, hov: T.rule2 },
    ghost:   { bg: "transparent", fg: T.ink2, bd: "transparent", hov: T.rule2 },
    danger:  { bg: "#fff", fg: T.danger, bd: "#F3C4C7", hov: T.dangerBg },
  }[kind];
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: sizes.pad,
        background: kinds.bg, color: kinds.fg,
        border: `1px solid ${kinds.bd}`,
        borderRadius: 8,
        fontSize: sizes.fs, fontWeight: 600,
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        transition: "background 140ms",
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = kinds.hov; }}
      onMouseLeave={e => { e.currentTarget.style.background = kinds.bg; }}
    >
      {icon && <Icon name={icon} size={14} strokeWidth={2}/>}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={14} strokeWidth={2}/>}
    </button>
  );
};

// ── Card ─────────────────────────────────────────────────────────────
const Card = ({ children, padding = 20, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#fff",
      border: `1px solid ${T.rule}`,
      borderRadius: 12,
      padding,
      cursor: onClick ? "pointer" : "default",
      transition: "border-color 140ms, box-shadow 140ms",
      ...style,
    }}
    onMouseEnter={onClick ? (e => {
      e.currentTarget.style.borderColor = T.ink4;
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(31,42,46,0.06)";
    }) : undefined}
    onMouseLeave={onClick ? (e => {
      e.currentTarget.style.borderColor = T.rule;
      e.currentTarget.style.boxShadow = "none";
    }) : undefined}
  >{children}</div>
);

// ── Section header ───────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <div style={{
    fontSize: "var(--text-accent)", fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "var(--gray-95)",
  }}>{children}</div>
);

const H = ({ children, size = "h2", style }) => {
  const styles = {
    h1: { fontSize: "var(--text-h1)", fontWeight: 700, lineHeight: "var(--leading-h1)", letterSpacing: "-0.01em" },
    h2: { fontSize: "var(--text-h2)", fontWeight: 700, lineHeight: "var(--leading-h2)", letterSpacing: "-0.005em" },
    h3: { fontSize: "var(--text-h3)", fontWeight: 700, lineHeight: "var(--leading-h3)" },
    h4: { fontSize: "var(--text-h4)", fontWeight: 700, lineHeight: "var(--leading-h4)" },
    display: { fontFamily: "var(--font-display)", fontSize: "var(--text-h1)", fontWeight: 500, lineHeight: "var(--leading-h1)", letterSpacing: "-0.01em" },
  }[size];
  const Tag = size === "h1" || size === "display" ? "h1" : size === "h2" ? "h2" : size === "h3" ? "h3" : "h4";
  return <Tag style={{ margin: 0, color: T.ink, fontFamily: "var(--font-sans)", ...styles, ...style }}>{children}</Tag>;
};

// ── KPI block ────────────────────────────────────────────────────────
const KPI = ({ label, value, delta, deltaDir, sub, big }) => (
  <div style={{ minWidth: 0 }}>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
    <div style={{
      fontFamily: "var(--font-display)",
      fontSize: big ? 44 : 28, fontWeight: 500,
      color: T.ink, lineHeight: 1, letterSpacing: "-0.015em",
    }}>{value}</div>
    {(delta || sub) && (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        {delta && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            color: deltaDir === "down" ? T.success : deltaDir === "up" ? T.success : T.ink3,
            fontSize: 12.5, fontWeight: 700,
          }}>
            <Icon name={deltaDir === "down" ? "trendDown" : "trendUp"} size={12} strokeWidth={2.4}/>
            {delta}
          </span>
        )}
        {sub && <span style={{ color: T.ink3, fontSize: 12.5 }}>{sub}</span>}
      </div>
    )}
  </div>
);

// ── Progress bar ─────────────────────────────────────────────────────
const Progress = ({ value, max = 100, color = T.success, height = 6 }) => (
  <div style={{
    width: "100%", height, borderRadius: 999,
    background: "rgba(31,42,46,0.07)", overflow: "hidden",
  }}>
    <div style={{
      width: `${Math.min(100, (value / max) * 100)}%`,
      height: "100%",
      background: color,
      borderRadius: 999,
      transition: "width 280ms var(--ease-standard)",
    }}/>
  </div>
);

// ── Sparkline (CSS) ──────────────────────────────────────────────────
const Sparkline = ({ data, color = T.success, height = 36, fill = true }) => {
  const W = 120, H = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return [x, y];
  });
  const path = "M " + pts.map(p => p.join(",")).join(" L ");
  const fillPath = path + ` L ${W},${H} L 0,${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      {fill && <path d={fillPath} fill={color} opacity="0.12"/>}
      <path d={path} stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ── Surface dot (for Customer AI / Rep AI / Human) ───────────────────
const SurfaceDot = ({ kind, size = 9 }) => {
  const c = kind === "cai" ? T.peri : kind === "rai" ? T.yellow : kind === "human" ? T.ink : T.ink4;
  return <span style={{ width: size, height: size, borderRadius: 999, background: c, flexShrink: 0, display: "inline-block" }}/>;
};

// ── Tab bar ──────────────────────────────────────────────────────────
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    display: "flex", gap: 2, padding: "0 28px",
    background: "#fff",
    overflowX: "auto",
  }}>
    {tabs.map(t => {
      const isActive = active === t.id;
      return (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "12px 12px 11px",
            border: 0, background: "transparent",
            color: isActive ? T.ink : T.ink3,
            fontFamily: "var(--font-sans)",
            fontSize: 13.5, fontWeight: isActive ? 700 : 500,
            cursor: "pointer",
            borderBottom: `2px solid ${isActive ? T.ink : "transparent"}`,
            marginBottom: -1,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.ink; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.ink3; }}
        >
          {t.icon && <Icon name={t.icon} size={14} strokeWidth={1.9}/>}
          {t.label}
          {t.badge != null && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: 16, height: 16, padding: "0 5px", borderRadius: 999,
              fontSize: 10, fontWeight: 700,
              background: isActive ? T.ink : "rgba(31,42,46,0.08)",
              color: isActive ? "#fff" : T.ink2,
            }}>{t.badge}</span>
          )}
        </button>
      );
    })}
  </div>
);

// ── Section block ────────────────────────────────────────────────────
const Section = ({ title, sub, action, children, style }) => (
  <section style={{ marginBottom: 28, ...style }}>
    {(title || action) && (
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
        <div>
          {title && <H size="h3">{title}</H>}
          {sub && <div style={{ fontSize: 13.5, color: T.ink3, marginTop: 4 }}>{sub}</div>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

Object.assign(window, { T, STATE_INFO, StatePill, Chip, Btn, Card, Eyebrow, H, KPI, Progress, Sparkline, SurfaceDot, TabBar, Section });
