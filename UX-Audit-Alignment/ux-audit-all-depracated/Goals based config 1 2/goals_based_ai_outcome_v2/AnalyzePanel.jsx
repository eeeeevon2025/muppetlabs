// Analyze stage — review automation conversations, filter by version & customer.

const ANALYZE_CONVERSATIONS = [
  {
    id: "c1",
    subject: "Help me with my subscription plan upgrade.",
    snippet: "I'd be happy to help you with your subscription …",
    customer: "Automation Test Customer",
    audience: "aic",
    topics: ["account"],
    date: "Mar 4, 2026",
    isoDate: "2026-03-04",
    time: "4:06 PM",
    tag: null,
  },
  {
    id: "c2",
    subject: "I want help with my subscription",
    snippet: "Got it! You're on Tier 1 and want to upgrade to T…",
    customer: "Automation Test Customer",
    audience: "aic",
    topics: ["account"],
    date: "Mar 4, 2026",
    isoDate: "2026-03-04",
    time: "3:54 PM",
    tag: null,
  },
  {
    id: "c3",
    subject: "Can you route me to a human?",
    snippet: "I appreciate you letting me know! However, disc…",
    customer: "Automation Test Customer",
    audience: "aic",
    topics: [],
    date: "Mar 4, 2026",
    isoDate: "2026-03-04",
    time: "3:51 PM",
    tag: null,
  },
  {
    id: "c4",
    subject: "Hey, I want to speak to a rep.",
    snippet: "I understand you'd prefer to speak with someone…",
    customer: "Automation Test Customer",
    audience: "air",
    topics: [],
    date: "Mar 3, 2026",
    isoDate: "2026-03-03",
    time: "3:43 PM",
    tag: null,
  },
  {
    id: "c5",
    subject: "Hey, I think I want a refund for my shoes.",
    snippet: "Perfect! That's really helpful to …",
    customer: "Automation Test Customer",
    audience: "aic",
    topics: ["returns"],
    date: "Mar 1, 2026",
    isoDate: "2026-03-01",
    time: "3:07 PM",
    tag: "return-request",
  },
];

const AnalyzePanel = ({ onBack }) => {
  const [version, setVersion] = React.useState("current");
  const [query, setQuery] = React.useState("");
  const [customer, setCustomer] = React.useState("");
  const [audience, setAudience] = React.useState("all");  // all | aic | air
  const [dateRange, setDateRange] = React.useState("30d"); // 24h | 7d | 30d | 90d | all

  const inRange = (iso) => {
    if (dateRange === "all") return true;
    const now = new Date("2026-03-04T17:00:00");
    const d = new Date(iso + "T00:00:00");
    const days = (now - d) / (1000 * 60 * 60 * 24);
    return dateRange === "24h" ? days <= 1
         : dateRange === "7d"  ? days <= 7
         : dateRange === "30d" ? days <= 30
         : dateRange === "90d" ? days <= 90 : true;
  };

  const filtered = ANALYZE_CONVERSATIONS.filter(c =>
    (!query || c.subject.toLowerCase().includes(query.toLowerCase()) || c.snippet.toLowerCase().includes(query.toLowerCase()))
    && (!customer || c.customer === customer)
    && (audience === "all" || c.audience === audience)
    && inRange(c.isoDate)
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "40px 48px 80px", minWidth: 520, background: "#fff" }}>
      <div style={{ maxWidth: 1100 }}>
        {/* Step pill */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          padding: "4px 12px",
          background: "#EBF1FF", border: "1px solid #CBDCFF",
          color: "#0E3280",
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.02em",
          borderRadius: 999, marginBottom: 16,
        }}>Step 5 of 5</div>

        {/* Heading */}
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: 22, lineHeight: 1.2, color: "#1F242D",
          letterSpacing: "-0.005em",
          marginBottom: 6,
        }}>Analyze Performance</h1>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, color: "#5F6675", lineHeight: 1.55,
          maxWidth: 720, marginBottom: 28,
        }}>
          Select an automation version to analyze conversations and monitor performance.
        </div>

        {/* Version selector */}
        <div style={{ marginBottom: 28, maxWidth: 320 }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
            marginBottom: 6,
          }}>Version</div>
          <VersionSelect value={version} onChange={setVersion}/>
        </div>

        {/* Conversations header + pager */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          marginBottom: 12,
        }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "#1F242D",
          }}>Conversations</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={pagerBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D", fontWeight: 600,
            }}>1 of 1</span>
            <button style={pagerBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 360, minWidth: 220 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9099AB", display: "inline-flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <path d="m21 21-3.5-3.5"/>
              </svg>
            </span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Conversations"
              style={{
                width: "100%", padding: "9px 12px 9px 32px",
                border: "1px solid #DCE0E9", borderRadius: 6,
                fontFamily: "var(--font-sans)", fontSize: 13,
                outline: "none", background: "#fff", boxSizing: "border-box",
              }}/>
          </div>
          <AudienceFilter value={audience} onChange={setAudience}/>
          <DateRangeFilter value={dateRange} onChange={setDateRange}/>
          <CustomerFilter value={customer} onChange={setCustomer}/>
        </div>

        {/* Conversations table */}
        <div style={{
          border: "1px solid #E8EAF0", borderRadius: 8,
          background: "#fff", overflow: "hidden",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.5fr) minmax(190px, 1fr) minmax(150px, 0.9fr) 130px",
            gap: 16, padding: "10px 16px",
            background: "#FAFBFD", borderBottom: "1px solid #E8EAF0",
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
            color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <div>Conversation</div>
            <div>Customer</div>
            <div>Topics Covered</div>
            <div>Created At</div>
          </div>
          {filtered.map((c, i) => (
            <ConversationRow key={c.id} conversation={c} isFirst={i === 0}/>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182" }}>
              No conversations match your filter.
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          marginTop: 28,
          display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 12,
        }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 8, cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Deploy
          </button>
        </div>
      </div>
    </div>
  );
};

const pagerBtn = {
  width: 28, height: 28, borderRadius: 6,
  border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
  cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

const VersionSelect = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const options = [
    { id: "current", label: "Current Draft" },
    { id: "v3",      label: "v3 — Mar 4, 2026 4:03 PM" },
    { id: "v2",      label: "v2 — Mar 4, 2026 3:42 PM" },
    { id: "v1",      label: "v1 — Mar 1, 2026 2:18 PM" },
  ];
  const current = options.find(o => o.id === value) || options[0];
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        width: "100%", padding: "10px 12px",
        border: "1.5px solid #0165E4",
        background: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        borderRadius: 8, cursor: "pointer", outline: "none",
        boxShadow: "0 0 0 3px rgba(1,101,228,0.12)",
      }}>
        <span>{current.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10, overflow: "hidden",
        }}>
          {options.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "9px 12px",
              border: 0,
              background: o.id === value ? "#EBF1FF" : "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13,
              color: o.id === value ? "#0165E4" : "#1F242D",
              fontWeight: o.id === value ? 600 : 500,
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => { if (o.id !== value) e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { if (o.id !== value) e.currentTarget.style.background = "transparent"; }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomerFilter = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const options = [
    { id: "",                          label: "Filter by Customer" },
    { id: "Automation Test Customer",  label: "Automation Test Customer" },
    { id: "Acme VIP",                  label: "Acme VIP" },
  ];
  const current = options.find(o => o.id === value) || options[0];
  return (
    <div style={{ position: "relative", minWidth: 220 }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        padding: "9px 12px",
        border: "1px solid #DCE0E9", borderRadius: 6,
        background: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 13, color: value ? "#1F242D" : "#697182",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        cursor: "pointer", outline: "none",
        width: "100%",
      }}>
        <span>{current.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 6,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10, overflow: "hidden", minWidth: 220,
        }}>
          {options.map(o => (
            <button key={o.id || "all"} onClick={() => { onChange(o.id); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "9px 12px",
              border: 0,
              background: o.id === value ? "#EBF1FF" : "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13,
              color: o.id === value ? "#0165E4" : "#1F242D",
              fontWeight: o.id === value ? 600 : 500,
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => { if (o.id !== value) e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { if (o.id !== value) e.currentTarget.style.background = "transparent"; }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ConversationRow = ({ conversation, isFirst }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "minmax(280px, 1.5fr) minmax(190px, 1fr) minmax(150px, 0.9fr) 130px",
    gap: 16, padding: "12px 16px",
    alignItems: "center",
    borderTop: isFirst ? 0 : "1px solid #F0F2F6",
    cursor: "pointer",
  }}
    onMouseEnter={e => e.currentTarget.style.background = "#FAFBFD"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
      <span style={{
        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
        background: "#EBF1FF", color: "#0165E4",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
          marginBottom: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{conversation.subject}</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, minWidth: 0,
        }}>
          {conversation.tag && (
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "1px 7px",
              background: "#FFE8D6", color: "#A85100",
              fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
              borderRadius: 4, flexShrink: 0,
            }}>{conversation.tag}</span>
          )}
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182",
            lineHeight: 1.4,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            minWidth: 0,
          }}>{conversation.snippet}</div>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <span style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        background: "#EFEDFF", color: "#3D46A8",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
      }}>AO</span>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D", fontWeight: 600,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{conversation.customer.length > 22 ? conversation.customer.slice(0, 22) + "…" : conversation.customer}</span>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {(() => {
        const TOPIC_OPTIONS = window.TOPIC_OPTIONS || [];
        const convTopics = Array.isArray(conversation.topics)
          ? conversation.topics
          : (conversation.topic ? [conversation.topic] : []);
        if (convTopics.length === 0) {
          return <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB" }}>—</span>;
        }
        return convTopics.map(t => {
          const opt = TOPIC_OPTIONS.find(o => o.id === t);
          const label = opt ? opt.label : t;
          return (
            <span key={t} style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px",
              background: "#F2F3F7", color: "#3F4654",
              fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600,
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}>{label}</span>
          );
        });
      })()}
    </div>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 13, color: "#3F4654",
      whiteSpace: "nowrap",
    }}>
      <div>{conversation.date}</div>
      <div style={{ fontSize: 12, color: "#697182", marginTop: 1 }}>{conversation.time}</div>
    </div>
  </div>
);

Object.assign(window, { AnalyzePanel });

// Segmented audience filter — All / AI for Customers / AI for Reps.
const AudienceFilter = ({ value, onChange }) => {
  const tabs = [
    { id: "all", label: "All" },
    { id: "aic", label: "AI for Customers" },
    { id: "air", label: "AI for Reps" },
  ];
  return (
    <div style={{ display: "inline-flex", gap: 4, padding: 3, background: "#F2F3F7", borderRadius: 999 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: "6px 12px", border: 0,
          background: value === t.id ? "#fff" : "transparent",
          color: value === t.id ? "#1F242D" : "#5F6675",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
          borderRadius: 999, cursor: "pointer",
          boxShadow: value === t.id ? "0 1px 2px rgba(31,42,46,0.08)" : "none",
          whiteSpace: "nowrap",
        }}>{t.label}</button>
      ))}
    </div>
  );
};

// Date-range picker as a styled dropdown with an icon.
const DateRangeFilter = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const options = [
    { id: "24h", label: "Last 24 hours" },
    { id: "7d",  label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
    { id: "all", label: "All time" },
  ];
  const current = options.find(o => o.id === value) || options[2];
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 12px",
        border: "1px solid #DCE0E9", borderRadius: 6,
        background: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
        cursor: "pointer", outline: "none",
        whiteSpace: "nowrap",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#697182" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        {current.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#697182" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 180,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 6,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10, overflow: "hidden",
        }}>
          {options.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "9px 12px",
              border: 0,
              background: o.id === value ? "#EBF1FF" : "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13,
              color: o.id === value ? "#0165E4" : "#1F242D",
              fontWeight: o.id === value ? 600 : 500,
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => { if (o.id !== value) e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { if (o.id !== value) e.currentTarget.style.background = "transparent"; }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
