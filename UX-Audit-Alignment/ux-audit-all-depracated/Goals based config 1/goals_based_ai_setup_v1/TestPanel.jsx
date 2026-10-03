// Test page — evaluation categories table for the current automation.
// Mirrors the design of Build, with a right-side Test Channel rail.

const TEST_CATEGORIES = [
  { id: "standard",   name: "Standard Refund Requests",       cases: 5, audience: ["aic"],        status: "current", lastRun: null,                            score: null },
  { id: "damaged",    name: "Damaged or Defective Items",     cases: 4, audience: ["aic"],        status: "current", lastRun: null,                            score: null },
  { id: "late",       name: "Late Delivery Refunds",          cases: 3, audience: ["aic", "air"], status: "current", lastRun: null,                            score: null },
  { id: "partial",    name: "Partial Refund Negotiation",     cases: 6, audience: ["air"],        status: "current", lastRun: null,                            score: null },
  { id: "eligibility", name: "Refund Eligibility Verification", cases: 4, audience: ["aic", "air"], status: "current", lastRun: { date: "May 14, 2026", label: "Draft" }, score: 100 },
];

const TestPanel = ({ rightCollapsed, onToggleRight }) => {
  return (
    <div data-screen-label="02 Test · Evaluations" style={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0 }}>
      {/* Main column */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px 24px 80px", minWidth: 0 }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          {/* Heading */}
          <h1 style={{
            margin: 0,
            fontFamily: "var(--font-sans)", fontWeight: 700,
            fontSize: 20, color: "#1F242D", letterSpacing: "-0.005em",
            marginBottom: 6,
          }}>Refund Order Evaluation Categories</h1>
          <p style={{
            margin: 0,
            fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.55,
            color: "#5F6675",
            maxWidth: 640,
          }}>
            AI outputs may vary across runs. Evaluations test the same scenarios
            repeatedly to measure consistency before deploying to production.
          </p>

          {/* Header row: count + add */}
          <div style={{
            marginTop: 28, marginBottom: 12,
            display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12,
          }}>
            <span style={{
              padding: "5px 12px",
              background: "#F2F3F7",
              border: "1px solid #E8EAF0",
              borderRadius: 999,
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#5F6675",
              whiteSpace: "nowrap",
            }}>{TEST_CATEGORIES.length}/30 categories</span>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px",
              border: "1.5px solid #0165E4",
              background: "#fff",
              color: "#0165E4",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 8, cursor: "pointer",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#EBF1FF"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add category
            </button>
          </div>

          {/* Categories table */}
          <div style={{
            border: "1px solid #E8EAF0",
            borderRadius: 10,
            overflowX: "auto",
            overflowY: "hidden",
            background: "#fff",
          }}>
            <table style={{
              width: "100%",
              minWidth: 560,
              borderCollapse: "collapse",
              tableLayout: "fixed",
              fontFamily: "var(--font-sans)",
            }}>
              <colgroup>
                <col style={{ width: "auto" }}/>
                <col style={{ width: 100 }}/>
                <col style={{ width: 130 }}/>
                <col style={{ width: 80 }}/>
              </colgroup>
              <thead>
                <tr style={{ background: "#FAFBFD", borderBottom: "1px solid #E8EAF0" }}>
                  <th style={tableHeadStyle}>Category name</th>
                  <th style={tableHeadStyle}>Status</th>
                  <th style={tableHeadStyle}>Last run</th>
                  <th style={tableHeadStyle}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Score
                      <InfoCircle/>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {TEST_CATEGORIES.map((c, i) => (
                  <TestCategoryRow key={c.id} category={c} isLast={i === TEST_CATEGORIES.length - 1}/>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Test Channel rail */}
      <TestChannelRail collapsed={rightCollapsed} onToggle={onToggleRight}/>
    </div>
  );
};

const tableHeadStyle = {
  padding: "10px 14px",
  textAlign: "left",
  fontFamily: "var(--font-sans)",
  fontSize: 12, fontWeight: 700, color: "#697182",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
};

const TestCategoryRow = ({ category, isLast }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: isLast ? "none" : "1px solid #E8EAF0",
        background: hover ? "#FAFBFD" : "#fff",
        cursor: "pointer",
        transition: "background 120ms",
      }}>
      <td style={{ padding: "14px 14px", verticalAlign: "middle" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{category.name}</div>
          {(category.audience || []).map(a => {
            const palette = a === "air"
              ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" }
              : { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" };
            return (
              <span key={a} style={{
                display: "inline-flex", alignItems: "center",
                padding: "1px 7px",
                background: palette.bg, color: palette.fg,
                fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.02em",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}>{palette.label}</span>
            );
          })}
        </div>
      </td>
      <td style={{ padding: "14px 14px", verticalAlign: "middle" }}>
        <StatusBadge status={category.status}/>
      </td>
      <td style={{ padding: "14px 14px", verticalAlign: "middle", fontFamily: "var(--font-sans)", fontSize: 13, color: "#3F4654" }}>
        {category.lastRun ? (
          <>
            <div style={{ whiteSpace: "nowrap" }}>{category.lastRun.date}</div>
            <div style={{ fontSize: 12, color: "#697182", marginTop: 1 }}>{category.lastRun.label}</div>
          </>
        ) : (
          <span style={{ color: "#697182", whiteSpace: "nowrap" }}>No prior runs</span>
        )}
      </td>
      <td style={{ padding: "14px 14px", verticalAlign: "middle", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D" }}>
        {category.score != null ? `${category.score}%` : <span style={{ color: "#B3BBCB" }}>—</span>}
      </td>
    </tr>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    current:  { label: "Current",  bg: "#EBF1FF", fg: "#0165E4" },
    outdated: { label: "Outdated", bg: "#FFF4E6", fg: "#8A5A08" },
    running:  { label: "Running",  bg: "#F5EBFD", fg: "#7B22A4" },
  };
  const s = map[status] || map.current;
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      background: s.bg, color: s.fg,
      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
      borderRadius: 6,
    }}>{s.label}</span>
  );
};

const InfoCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9099AB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

// — Right rail: Assistant + Test Console toggle and channel picker
const TestChannelRail = ({ collapsed, onToggle }) => {
  const [mode, setMode] = React.useState("test"); // "assistant" | "test"
  const [channel, setChannel] = React.useState("");

  if (collapsed) {
    return (
      <aside style={{
        width: 48, flexShrink: 0,
        borderLeft: "1px solid #E8EAF0", background: "#fff",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 12, gap: 8,
      }}>
        <button onClick={onToggle} title="Expand"
          style={{
            width: 30, height: 30, border: 0, background: "transparent",
            color: "#697182", cursor: "pointer", borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
          <PanelRightIcon/>
        </button>
      </aside>
    );
  }

  return (
    <aside style={{
      width: 280, flexShrink: 0,
      borderLeft: "1px solid #E8EAF0", background: "#fff",
      display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      {/* Top toolbar */}
      <div style={{
        height: 56, padding: "10px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        borderBottom: "1px solid #E8EAF0",
        flexShrink: 0,
      }}>
        <div style={{ display: "inline-flex", gap: 6 }}>
          <ModePill active={mode === "assistant"} onClick={() => setMode("assistant")}
            tone="assistant" icon={<AssistantIcon/>} label="Assistant"/>
          <ModePill active={mode === "test"} onClick={() => setMode("test")}
            tone="test" icon={<PlayIcon/>} label="Test Console"/>
        </div>
        <button onClick={onToggle} title="Collapse"
          style={{
            width: 30, height: 30, border: 0, background: "transparent",
            color: "#697182", cursor: "pointer", borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <PanelRightIcon/>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D", marginBottom: 4,
        }}>Test Channel</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.5, marginBottom: 14,
        }}>
          Select a channel for your conversation with a test customer
        </div>

        <ChannelSelect value={channel} onChange={setChannel}/>

        {/* Empty / instructional state */}
        <div style={{
          flex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 20px",
          color: "#9099AB",
          fontFamily: "var(--font-sans)", fontSize: 13, textAlign: "center",
        }}>
          {channel
            ? `Connected to ${channel}. Send a message to begin testing.`
            : "Select a channel above to start testing"}
        </div>
      </div>
    </aside>
  );
};

const ModePill = ({ active, onClick, tone, icon, label }) => {
  const palettes = {
    assistant: { activeBg: "#F5EBFD", activeFg: "#7B22A4", border: "#EBD2FF" },
    test:      { activeBg: "#DBE7FF", activeFg: "#0165E4", border: "#BBD1FF" },
  };
  const p = palettes[tone];
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 12px",
      border: active ? `1px solid ${p.border}` : "1px solid transparent",
      background: active ? p.activeBg : "transparent",
      color: active ? p.activeFg : "#5F6675",
      fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
      borderRadius: 8, cursor: "pointer",
      transition: "all 120ms",
    }}>
      {icon}
      {label}
    </button>
  );
};

const ChannelSelect = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const options = [
    "Email — support@acmeoutdoors.com",
    "Chat — Web widget",
    "SMS — +1 (555) 010-2244",
    "Instagram DM — @acmeoutdoors",
    "WhatsApp — Acme Outdoors",
  ];

  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "10px 12px",
          border: "1px solid #DCE0E9", borderRadius: 8,
          background: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13,
          color: value ? "#1F242D" : "#9099AB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
          outline: "none",
        }}>
        <span style={{
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          maxWidth: "calc(100% - 20px)",
        }}>{value || "Select channel..."}</span>
        <RailIcon name="chevronDown" size={14} strokeWidth={2} color="#697182"/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10,
          maxHeight: 260, overflow: "auto",
        }}>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "9px 12px",
              border: 0, background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AssistantIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
    <path d="M9 15c1 1 2 1.4 3 1.4S13.5 16 14.5 15"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PanelRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M15 3v18"/>
  </svg>
);

Object.assign(window, { TestPanel });
