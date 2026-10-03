// Observe Copilot — redesigned observability page
// Split: dashboard (KPIs + breakdowns) on top, enriched trace cards below

const KPI_CARDS = [
  { id: "volume",  label: "Suggestions",        value: "12,847", delta: "+8.2%", trend: "up",   tone: "neutral" },
  { id: "accept",  label: "Accept rate",        value: "62.4%",  delta: "+4.1%", trend: "up",   tone: "good" },
  { id: "reject",  label: "Reject rate",        value: "21.8%",  delta: "−2.0%", trend: "down", tone: "good" },
  { id: "latency", label: "Median latency",     value: "412 ms", delta: "−38 ms", trend: "down", tone: "good" },
];

const AGENT_PERF = [
  { name: "Customer Expert Agent", calls: 4218, accept: 78, reject: 12, color: "#3F8CFF" },
  { name: "Task Expert",           calls: 2934, accept: 71, reject: 18, color: "#3F8CFF" },
  { name: "General Knowledge Agent", calls: 3851, accept: 54, reject: 28, color: "#6E79E0" },
  { name: "Refund Order Agent",    calls: 1844, accept: 38, reject: 44, color: "#FF8186" },
];

const SOURCE_PERF = [
  { name: "Help Center",           cited: 5640, accept: 74, color: "#16A36B" },
  { name: "Past Conversations",    cited: 3127, accept: 68, color: "#3F8CFF" },
  { name: "Product Docs",          cited: 2455, accept: 61, color: "#6E79E0" },
  { name: "Internal Wiki",         cited: 1820, accept: 47, color: "#E89B1F" },
  { name: "Refund Policy v2",      cited: 612,  accept: 29, color: "#D84A3B" },
];

const REJECT_REASONS = [
  { reason: "Wrong tone for customer", count: 412, share: 32 },
  { reason: "Outdated info",           count: 268, share: 21 },
  { reason: "Hallucinated detail",     count: 189, share: 15 },
  { reason: "Missing context",         count: 154, share: 12 },
  { reason: "Other",                   count: 261, share: 20 },
];

const CUSTOMER_OPTIONS = ["Amisha Sharma", "Marcus Lee", "Rachel Wong", "Tom Patel", "Lin Zhao"];
const USER_OPTIONS = ["Jordan Kim", "Priya Shah"];
const SOURCE_OPTIONS = ["Order #45821", "Order #45810", "Order #45799", "Refund Policy v2", "Help Center", "Past Conversations", "Internal Wiki", "Customer Profile"];

const SUGGESTIONS = [
  { id: "s1", severity: "high", title: "Refund Policy v2 has the lowest accept rate", desc: "Cited in 612 suggestions over the last 7 days, only 29% accepted. The next-worst source sits at 47%. Consider re-indexing or reviewing the content.", action: "Open source" },
  { id: "s2", severity: "med",  title: "General Knowledge Agent has the lowest accept rate", desc: "Cited in 3,851 suggestions; 54% accepted vs. 71% for Customer Expert Agent. Review its instructions, tools, or knowledge sources.", action: "Open agent" },
  { id: "s3", severity: "med",  title: "Reps frequently edit suggestions before sending", desc: "Reps edited 38% of suggestions over the last 7 days — up from 24% the prior period. Writing guidance hasn't been updated in 47 days.", action: "Edit guidance" },
];

const TRACES = [
  {
    id: "t1", time: "2:14 PM · 2m ago",
    query: "Help me draft a reply on the refund status for order #45821",
    customer: "Amisha Sharma", customerNote: "VIP · 8 prior conversations",
    rep: "Jordan Kim",
    verdict: "accepted", verdictNote: "Sent as-is",
    latency: 326, latencyTone: "good",
    sources: [{ label: "Order #45821", kind: "data" }, { label: "Refund Policy v2", kind: "kb", warn: true }, { label: "Past Conversations", kind: "kb" }],
    agents: ["Customer Expert", "Task Expert"],
    response: "Your refund for order #45821 was processed on Apr 28 and should arrive in 3–5 business days. I'll notify you the moment it clears.",
    quality: "good",
  },
  {
    id: "t2", time: "2:11 PM · 5m ago",
    query: "Customer says package never arrived but tracking shows delivered — what's our policy?",
    customer: "Marcus Lee",
    rep: "Priya Shah",
    verdict: "rejected", verdictNote: "Rep cited: outdated info",
    latency: 891, latencyTone: "warn",
    sources: [{ label: "Refund Policy v2", kind: "kb", warn: true }, { label: "Help Center", kind: "kb" }],
    agents: ["General Knowledge"],
    response: "Per our policy, we cannot refund packages marked delivered until 10 business days have passed.",
    quality: "bad",
  },
  {
    id: "t3", time: "2:09 PM · 7m ago",
    query: "Can I still update the shipping address on order #45810? Draft a reply",
    customer: "Rachel Wong",
    rep: "Jordan Kim",
    verdict: "edited", verdictNote: "Rep edited 24 chars before sending",
    latency: 388, latencyTone: "good",
    sources: [{ label: "Order #45810", kind: "data" }, { label: "Help Center", kind: "kb" }],
    agents: ["Customer Expert", "Task Expert"],
    response: "Yes — orders that haven't shipped can be updated. Order #45810 ships tomorrow at 9 AM, so I can change it now if you confirm the new address.",
    quality: "ok",
  },
  {
    id: "t4", time: "2:04 PM · 12m ago",
    query: "Do we carry SKU AS-1024 in blue? Check inventory",
    customer: "Tom Patel",
    rep: "Priya Shah",
    verdict: "no-action", verdictNote: "Rep wrote their own reply",
    latency: 1240, latencyTone: "bad",
    sources: [{ label: "Internal Wiki", kind: "kb", warn: true }],
    agents: ["General Knowledge"],
    response: "I don't have specific stock information for AS-1024 in blue. Let me check with our inventory team and get back to you.",
    quality: "bad",
  },
  {
    id: "t5", time: "1:58 PM · 18m ago",
    query: "Apply customer's $20 store credit to order #45799 and confirm",
    customer: "Lin Zhao",
    rep: "Jordan Kim",
    verdict: "accepted",
    latency: 298, latencyTone: "good",
    sources: [{ label: "Order #45799", kind: "data" }, { label: "Customer Profile", kind: "data" }, { label: "Help Center", kind: "kb" }],
    agents: ["Customer Expert", "Task Expert"],
    response: "Done — I've applied your $20 store credit to order #45799. Your new total is $54.20, and the change is reflected on your receipt.",
    quality: "good",
  },
];

// ─── Components ────────────────────────────────────────────

const KPICard = ({ kpi }) => {
  const toneColor = { good: "#16A36B", bad: "#D84A3B", neutral: "#5F6675" }[kpi.tone];
  return (
    <div style={{
      flex: 1, minWidth: 0,
      padding: "14px 16px",
      border: "1px solid #E8EAF0",
      background: "#fff",
      borderRadius: 8,
    }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#5F6675", marginBottom: 6 }}>
        {kpi.label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "nowrap" }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "#1F242D",
          letterSpacing: "-0.01em", whiteSpace: "nowrap",
        }}>
          {kpi.value}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: toneColor,
          display: "inline-flex", alignItems: "center", gap: 2,
          whiteSpace: "nowrap",
        }}>
          <span style={{ display: "inline-block", transform: kpi.trend === "down" ? "rotate(180deg)" : "none" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8 L6 4 L9 8"/></svg>
          </span>
          {kpi.delta}
        </div>
      </div>
    </div>
  );
};

const StackedBar = ({ accept, reject, height = 8 }) => {
  const noAction = Math.max(0, 100 - accept - reject);
  return (
    <div style={{ display: "flex", height, borderRadius: 999, overflow: "hidden", background: "#F2F3F7" }}>
      <div style={{ width: `${accept}%`, background: "#16A36B" }} title={`Accepted ${accept}%`}/>
      <div style={{ width: `${noAction}%`, background: "#DCE0E9" }} title={`No action ${noAction}%`}/>
      <div style={{ width: `${reject}%`, background: "#FF8186" }} title={`Rejected ${reject}%`}/>
    </div>
  );
};

const BreakdownPanel = ({ title, subtitle, items, valueLabel }) => (
  <div style={{
    flex: 1, minWidth: 0,
    padding: "16px 18px",
    border: "1px solid #E8EAF0",
    background: "#fff",
    borderRadius: 8,
  }}>
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D" }}>{title}</h3>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2 }}>{subtitle}</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: it.color, flexShrink: 0 }}/>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {it.name}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#5F6675", flexShrink: 0 }}>
              <span>{it.calls != null ? it.calls.toLocaleString() : it.cited.toLocaleString()} {valueLabel}</span>
              <span style={{
                fontWeight: 700,
                color: it.accept >= 60 ? "#16A36B" : (it.accept >= 45 ? "#E89B1F" : "#D84A3B"),
                minWidth: 36, textAlign: "right",
              }}>{it.accept}%</span>
            </div>
          </div>
          <StackedBar accept={it.accept} reject={it.reject || (100 - it.accept) * 0.45}/>
        </div>
      ))}
    </div>
  </div>
);

const RejectReasons = () => (
  <div style={{
    padding: "16px 18px",
    border: "1px solid #E8EAF0",
    background: "#fff",
    borderRadius: 8,
    minWidth: 280,
  }}>
    <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D" }}>Why reps reject</h3>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2, marginBottom: 14 }}>
      From rejection feedback this period
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {REJECT_REASONS.map((r, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#1F242D", fontWeight: 500 }}>{r.reason}</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#5F6675", fontWeight: 600 }}>{r.count}</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: "#F2F3F7", overflow: "hidden" }}>
            <div style={{ width: `${r.share * 2.5}%`, height: "100%", background: "#FF8186" }}/>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VerdictPill = ({ verdict, note }) => {
  const styles = {
    accepted:  { bg: "#E5F5EC", fg: "#0F7A4E", icon: "check", label: "Accepted" },
    rejected:  { bg: "#FBE6E3", fg: "#9A2A1F", icon: "x",     label: "Rejected" },
    edited:    { bg: "#FBF0D7", fg: "#8A5A08", icon: "edit",  label: "Edited" },
    "no-action": { bg: "#F2F3F7", fg: "#5F6675", icon: "dash", label: "Not used" },
  }[verdict];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 8px",
        background: styles.bg, color: styles.fg,
        borderRadius: 999,
        fontFamily: "var(--font-sans)",
        fontSize: 11, fontWeight: 700,
      }}>
        <VerdictIcon name={styles.icon}/>
        {styles.label}
      </span>
      {note && <span style={{ fontSize: 11, color: "#697182" }}>{note}</span>}
    </div>
  );
};

const VerdictIcon = ({ name }) => {
  const paths = {
    check: <path d="M20 6 9 17l-5-5"/>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    dash: <path d="M5 12h14"/>,
  };
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const SourceChip = ({ source }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 8px",
    background: source.warn ? "#FBE6E3" : (source.kind === "data" ? "#EBF1FF" : "#F2F3F7"),
    color: source.warn ? "#9A2A1F" : (source.kind === "data" ? "#0165E4" : "#3F444F"),
    borderRadius: 4,
    fontFamily: "var(--font-sans)",
    fontSize: 11, fontWeight: 600,
  }}>
    {source.warn && (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2 1 21h22z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
    )}
    {source.label}
  </span>
);

const LatencyChip = ({ ms, tone }) => {
  const c = { good: "#16A36B", warn: "#E89B1F", bad: "#D84A3B" }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "var(--font-sans)",
      fontSize: 11, fontWeight: 600, color: c,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      {ms} ms
    </span>
  );
};

const TraceCard = ({ trace, onOpen }) => {
  const qualityBorder = { good: "#E8EAF0", ok: "#E8EAF0", bad: "#FFD0D2" }[trace.quality];
  return (
    <button
      onClick={() => onOpen(trace)}
      style={{
        textAlign: "left",
        width: "100%",
        padding: "14px 16px",
        border: `1px solid ${qualityBorder}`,
        background: "#fff",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex", flexDirection: "column", gap: 10,
        transition: "all 140ms var(--ease-standard)",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#0165E4"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(31,42,46,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = qualityBorder; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top row: time + verdict */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "#697182" }}>{trace.time}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#B3BBCB" }}/>
          <span style={{ fontSize: 11, color: "#697182" }}>
            <span style={{ color: "#1F242D", fontWeight: 600 }}>{trace.customer}</span>
            {trace.customerNote && <span> · {trace.customerNote}</span>}
          </span>
        </div>
        <VerdictPill verdict={trace.verdict} note={trace.verdictNote}/>
      </div>

      {/* Query */}
      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14, fontWeight: 600, color: "#1F242D",
        lineHeight: 1.4,
      }}>"{trace.query}"</div>

      {/* Bottom row: sources + agents + latency */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#697182", fontWeight: 600, marginRight: 2 }}>Sources</span>
          {trace.sources.map((s, i) => <SourceChip key={i} source={s}/>)}
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#DCE0E9", margin: "0 4px" }}/>
          <span style={{ fontSize: 11, color: "#697182", fontWeight: 600, marginRight: 2 }}>Agents</span>
          {trace.agents.map((a, i) => (
            <span key={i} style={{
              padding: "2px 8px", background: "#EBF1FF", color: "#0165E4",
              borderRadius: 4, fontSize: 11, fontWeight: 600,
            }}>{a}</span>
          ))}
        </div>
        <LatencyChip ms={trace.latency} tone={trace.latencyTone}/>
      </div>
    </button>
  );
};

// ─── Suggestions inbox ─────────────────────────────────

const SuggestionInbox = () => {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return (
    <div style={{
      padding: "14px 16px",
      border: "1px solid #FFE8AC",
      background: "linear-gradient(180deg, #FFFCF0 0%, #FFFEF7 100%)",
      borderRadius: 8,
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: "#FFE81A", color: "#1F242D",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m5.6 5.6 2.1 2.1"/><path d="m16.3 16.3 2.1 2.1"/><path d="m5.6 18.4 2.1-2.1"/><path d="m16.3 7.7 2.1-2.1"/></svg>
          </span>
          <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D" }}>
            3 suggestions to improve Copilot
          </h3>
        </div>
        <button onClick={() => setOpen(false)} style={{
          border: 0, background: "transparent", color: "#697182",
          padding: 4, cursor: "pointer", borderRadius: 4,
        }} title="Dismiss inbox">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SUGGESTIONS.map(s => (
          <div key={s.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px",
            background: "#fff",
            border: "1px solid #F0E8C8",
            borderRadius: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: s.severity === "high" ? "#D84A3B" : "#E89B1F",
              flexShrink: 0,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{s.title}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2 }}>{s.desc}</div>
            </div>
            <button style={{
              padding: "5px 10px",
              border: "1px solid #BBD1FF", background: "#fff",
              color: "#0165E4", fontFamily: "var(--font-sans)",
              fontSize: 12, fontWeight: 600, borderRadius: 6, cursor: "pointer",
              flexShrink: 0,
            }}>{s.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Time range tweak ─────────────────────────────────

const TimeRange = ({ value, onChange }) => {
  const opts = [
    { id: "24h", label: "Last 24 hours" },
    { id: "7d",  label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
  ];
  return (
    <div style={{
      display: "inline-flex",
      border: "1px solid #DCE0E9",
      borderRadius: 6,
      overflow: "hidden",
    }}>
      {opts.map(o => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            style={{
              padding: "6px 12px",
              border: 0,
              background: active ? "#1F242D" : "#fff",
              color: active ? "#fff" : "#5F6675",
              fontFamily: "var(--font-sans)",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer",
              transition: "all 120ms",
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
};

// ─── Trace detail drawer ─────────────────────────────────

const TraceDrawer = ({ trace, onClose }) => {
  if (!trace) return null;
  const steps = [
    { kind: "intent",   label: "Intent classified", value: "Refund status inquiry", ms: 42, status: "ok" },
    { kind: "context",  label: "Customer context loaded", value: "VIP · 8 prior conversations · Loyalty Gold", ms: 56, status: "ok" },
    { kind: "agent",    label: "Customer Expert Agent", value: "Looked up customer record + last 5 orders", ms: 88, status: "ok" },
    { kind: "kb",       label: "Knowledge search", value: trace.sources.filter(s=>s.kind==="kb").length + " results · top match: Refund Policy v2", ms: 64, status: trace.sources.some(s=>s.warn) ? "warn" : "ok" },
    { kind: "agent",    label: "Task Expert Agent", value: "Fetched order #45821 status from Shopify", ms: 52, status: "ok" },
    { kind: "compose",  label: "Compose reply", value: "Used writing guidance: \"Warm tone, under 3 sentences\"", ms: 24, status: "ok" },
    { kind: "guardrail", label: "Guardrail check", value: "Passed · no PII leak, no policy violation", ms: 0, status: "ok" },
  ];
  const stepIcon = {
    intent: "tag", context: "user", agent: "sparkles", kb: "bookOpen",
    compose: "edit", guardrail: "shield",
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(31,42,46,0.30)",
        zIndex: 90, animation: "fadeIn 180ms",
      }}/>
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 560, background: "#fff",
        boxShadow: "-12px 0 40px rgba(31,42,46,0.18)",
        zIndex: 100, display: "flex", flexDirection: "column",
        animation: "slideIn 220ms var(--ease-standard)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #E8EAF0",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "#697182", marginBottom: 4 }}>
              Trace · {trace.time}
            </div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "#1F242D", lineHeight: 1.4 }}>
              "{trace.query}"
            </h2>
          </div>
          <button onClick={onClose} style={{
            border: 0, background: "transparent", color: "#697182",
            padding: 6, cursor: "pointer", borderRadius: 6, flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {/* Outcome banner */}
          <div style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: trace.verdict === "accepted" ? "#E5F5EC" : (trace.verdict === "rejected" ? "#FBE6E3" : "#F2F3F7"),
            marginBottom: 18,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <VerdictPill verdict={trace.verdict} note={trace.verdictNote}/>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#5F6675", fontWeight: 600 }}>
              by {trace.rep}
            </span>
          </div>

          {/* Suggestion */}
          <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "#5F6675", letterSpacing: "0.02em", textTransform: "uppercase" }}>
            Copilot's suggestion
          </h3>
          <div style={{
            padding: "12px 14px",
            background: "#FAFBFE",
            border: "1px solid #E8EAF0",
            borderRadius: 6,
            fontFamily: "var(--font-sans)",
            fontSize: 13, color: "#1F242D",
            lineHeight: 1.55,
            marginBottom: 22,
          }}>{trace.response}</div>

          {/* Trace steps */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "#5F6675", letterSpacing: "0.02em", textTransform: "uppercase" }}>
              How Copilot built this
            </h3>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#697182" }}>
              Total {trace.latency} ms
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: 14 }}>
                {/* Spine */}
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", left: 13, top: 28, bottom: 0, width: 1, background: "#DCE0E9" }}/>
                )}
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: step.status === "warn" ? "#FBE6E3" : "#EBF1FF",
                  color: step.status === "warn" ? "#9A2A1F" : "#0165E4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, zIndex: 1,
                }}>
                  <RailIcon name={stepIcon[step.kind] || "info"} size={13} strokeWidth={1.8}/>
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{step.label}</span>
                    {step.ms > 0 && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#697182" }}>{step.ms} ms</span>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#5F6675", marginTop: 2 }}>
                    {step.value}
                  </div>
                  {step.status === "warn" && (
                    <div style={{
                      marginTop: 6, padding: "6px 10px",
                      background: "#FBE6E3", color: "#9A2A1F",
                      borderRadius: 4,
                      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
                    }}>
                      ⚠ Refund Policy v2 hasn't been re-indexed in 47 days. This source has a 71% rejection rate.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

// ─── Filter dropdown ─────────────────────────────────

const FilterDropdown = ({ icon, label, value, onChange, options }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 220 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          width: "100%",
          padding: "7px 10px",
          border: "1px solid #DCE0E9",
          background: "#fff",
          borderRadius: 6,
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: value ? "#1F242D" : "#697182",
          fontWeight: value ? 600 : 500,
        }}
      >
        <RailIcon name={icon} size={14} strokeWidth={1.7}/>
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || label}
        </span>
        <RailIcon name="chevronDown" size={13} strokeWidth={2}/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: "100%",
          background: "#fff",
          border: "1px solid #E8EAF0",
          borderRadius: 6,
          boxShadow: "0 6px 20px rgba(31,42,46,0.10)",
          zIndex: 50,
          padding: 4,
          maxHeight: 240, overflow: "auto",
        }}>
          <button onClick={() => { onChange(""); setOpen(false); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "7px 10px", border: 0, background: "transparent",
              color: "#697182", fontFamily: "var(--font-sans)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              borderRadius: 4,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >All</button>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "7px 10px", border: 0,
                background: opt === value ? "#EBF1FF" : "transparent",
                color: opt === value ? "#0165E4" : "#1F242D",
                fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: opt === value ? 600 : 500,
                cursor: "pointer", borderRadius: 4,
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = "transparent"; }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────

const ObservePanel = ({ onBack }) => {
  const [range, setRange] = React.useState("7d");
  const [filter, setFilter] = React.useState("all");
  const [customerFilter, setCustomerFilter] = React.useState("");
  const [userFilter, setUserFilter] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("");
  const [openTrace, setOpenTrace] = React.useState(null);

  const filteredTraces = TRACES.filter(t => {
    if (filter === "rejected" && !(t.verdict === "rejected" || t.verdict === "no-action")) return false;
    if (filter === "accepted" && t.verdict !== "accepted") return false;
    if (customerFilter && t.customer !== customerFilter) return false;
    if (userFilter && t.rep !== userFilter) return false;
    if (sourceFilter && !t.sources.some(s => s.label === sourceFilter)) return false;
    return true;
  });

  return (
    <div>
      {/* Breadcrumb + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#697182", marginBottom: 8 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          border: 0, background: "transparent", color: "#697182",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
          cursor: "pointer", padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#0165E4"}
        onMouseLeave={e => e.currentTarget.style.color = "#697182"}>
          <RailIcon name="headset" size={12} strokeWidth={1.8}/>
          AI for Reps
        </button>
        <RailIcon name="chevronRight" size={12} strokeWidth={1.8}/>
        <span style={{ color: "#1F242D", fontWeight: 600 }}>Observe Copilot</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 4 }}>
        <div>
          <SectionTitle>Observe Copilot</SectionTitle>
          <Description style={{ marginTop: 6, maxWidth: 700 }}>
            Monitor how Copilot performs in production, find what's hurting accept rate, and act on suggestions to improve it.
          </Description>
        </div>
        <TimeRange value={range} onChange={setRange}/>
      </div>

      <div style={{ height: 22 }}/>

      {/* Suggestions inbox */}
      <SuggestionInbox/>

      {/* KPI strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {KPI_CARDS.map(k => <KPICard key={k.id} kpi={k}/>)}
      </div>

      <div style={{ height: 8 }}/>

      {/* Traces header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "#1F242D" }}>
          Recent traces
        </h2>
        <div style={{ display: "inline-flex", gap: 4, padding: 3, background: "#F2F3F7", borderRadius: 6 }}>
          {[
            { id: "all", label: "All" },
            { id: "rejected", label: "Rejected & not used" },
            { id: "accepted", label: "Accepted" },
          ].map(o => {
            const active = filter === o.id;
            return (
              <button key={o.id} onClick={() => setFilter(o.id)} style={{
                padding: "5px 12px",
                border: 0,
                background: active ? "#fff" : "transparent",
                color: active ? "#1F242D" : "#697182",
                fontFamily: "var(--font-sans)",
                fontSize: 12, fontWeight: 600,
                borderRadius: 4, cursor: "pointer",
                boxShadow: active ? "0 1px 2px rgba(31,42,46,0.06)" : "none",
              }}>{o.label}</button>
            );
          })}
        </div>
      </div>

      {/* Customer + User + Source filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <FilterDropdown icon="user" label="Filter by Customer" value={customerFilter} onChange={setCustomerFilter} options={CUSTOMER_OPTIONS}/>
        <FilterDropdown icon="headset" label="Filter by User" value={userFilter} onChange={setUserFilter} options={USER_OPTIONS}/>
        <FilterDropdown icon="bookOpen" label="Filter by Source" value={sourceFilter} onChange={setSourceFilter} options={SOURCE_OPTIONS}/>
        {(customerFilter || userFilter || sourceFilter) && (
          <button
            onClick={() => { setCustomerFilter(""); setUserFilter(""); setSourceFilter(""); }}
            style={{
              padding: "7px 12px",
              border: 0, background: "transparent",
              color: "#697182",
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              cursor: "pointer", borderRadius: 6,
            }}
          >Clear</button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredTraces.map(t => <TraceCard key={t.id} trace={t} onOpen={setOpenTrace}/>)}
      </div>

      <div style={{ height: 60 }}/>

      <TraceDrawer trace={openTrace} onClose={() => setOpenTrace(null)}/>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
      `}</style>
    </div>
  );
};

Object.assign(window, { ObservePanel });
