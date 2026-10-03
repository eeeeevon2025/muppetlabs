// =============================================================
// Shell: outer Rail, NavSection, persistent Assistant panel
// =============================================================

// ── Outer Rail (56px, white) ─────────────────────────────────
const Rail = ({ active, onChange }) => {
  const top = [
    { id: "home",   icon: "home" },
    { id: "ai",     icon: "sparkles" },
    { id: "inbox",  icon: "inbox",   badge: 1 },
    { id: "lists",  icon: "lists" },
    { id: "reports",icon: "pieChart" },
    { id: "pulse",  icon: "pulse" },
    { id: "apps",   icon: "grid",    badge: 2 },
    { id: "kset",   icon: "cog" },
  ];
  const bot = [
    { id: "search", icon: "search" },
    { id: "kb",     icon: "bookOpen" },
    { id: "screen", icon: "monitor" },
    { id: "bell",   icon: "bell" },
    { id: "help",   icon: "help" },
  ];
  const RailItem = ({ it }) => {
    const isActive = active === it.id;
    return (
      <button
        onClick={() => onChange(it.id)}
        style={{
          position: "relative",
          width: 36, height: 36,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: isActive ? "#F2F3F7" : "transparent",
          color: isActive ? T.ink : "#5F6675",
          border: 0, borderRadius: 8, cursor: "pointer",
          transition: "background 100ms, color 100ms",
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(31,42,46,0.04)"; e.currentTarget.style.color = T.ink; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5F6675"; } }}
        title={it.id}
      >
        <Icon name={it.icon} size={17} strokeWidth={1.7}/>
        {it.badge != null && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            minWidth: 14, height: 14, borderRadius: 999,
            background: "#3F8CFF", color: "#fff",
            fontSize: 9, fontWeight: 700,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>{it.badge}</span>
        )}
      </button>
    );
  };
  return (
    <aside style={{
      width: 56, background: "#fff",
      borderRight: `1px solid ${T.rule}`,
      padding: "10px 0 12px",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, flexShrink: 0,
    }}>
      {/* Kusty mark */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 6 }}>
        <img src="hybrid_v2/kusty-logomark.svg" alt="Kusty" style={{ width: 32, height: 30, display: "block" }}/>
        <div style={{
          fontSize: 8.5, fontWeight: 800, color: "#3F8CFF",
          letterSpacing: "0.08em", padding: "1px 5px",
          border: "1px solid #3F8CFF", borderRadius: 999, marginTop: 4,
        }}>CLASSIC</div>
      </div>
      {top.map(it => <RailItem key={it.id} it={it}/>)}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {bot.map(it => <RailItem key={it.id} it={it}/>)}
        <div style={{
          width: 28, height: 28, borderRadius: 999,
          background: T.yellow, display: "inline-flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: T.ink,
          marginTop: 4,
        }}>AS</div>
      </div>
    </aside>
  );
};

// ── NavSection (232px) — the spine ────────────────────────────
const NavSection = ({ nav, openGoalId, onNav, onStartWizard, goals, perfTab, onPerfTab }) => {
  const [advOpen, setAdvOpen] = React.useState(nav.startsWith("adv"));
  const [perfOpen, setPerfOpen] = React.useState(nav === "performance");
  React.useEffect(() => {
    if (nav.startsWith("adv")) setAdvOpen(true);
    if (nav === "performance") setPerfOpen(true);
  }, [nav]);

  const Row = ({ id, label, icon, sub, badge, badgeTone, pills, indent = 0, onClick, isActive }) => {
    const active = isActive ?? (nav === id);
    const badgeStyle = badgeTone === "yellow" ? {
      background: "rgba(251,236,42,0.35)", color: "#6e5800",
    } : {
      background: "rgba(214,58,67,0.12)", color: T.danger,
    };
    return (
      <button
        onClick={onClick || (() => onNav(id))}
        style={{
          display: "grid",
          gridTemplateColumns: icon ? "16px 1fr auto" : "1fr auto",
          alignItems: "center", gap: 9,
          width: "100%",
          padding: `7px 10px 7px ${10 + indent}px`,
          border: 0,
          background: active ? "#F2F3F7" : "transparent",
          color: active ? T.ink : sub ? T.ink3 : T.ink2,
          borderRadius: 6, cursor: "pointer", textAlign: "left",
          fontFamily: "var(--font-sans)",
          fontSize: indent > 12 ? 12.5 : 13.5,
          fontWeight: active ? 700 : 500,
          transition: "background 100ms",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(31,42,46,0.04)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        {icon && <Icon name={icon} size={15} strokeWidth={1.7} style={{ color: sub ? T.ink3 : T.ink2 }}/>}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
          {pills}
          {badge != null && (
            <span style={{
              minWidth: 16, padding: "0 5px", height: 16, borderRadius: 999,
              fontSize: 10, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              ...badgeStyle,
            }}>{badge}</span>
          )}
        </span>
      </button>
    );
  };

  return (
    <nav style={{
      width: 232, background: "#fff",
      borderRight: `1px solid ${T.rule}`,
      padding: "18px 14px",
      overflowY: "auto", flexShrink: 0,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 14, padding: "0 6px" }}>
        Kustomer AI
      </div>

      {/* Get Started — launcher */}
      <button onClick={onStartWizard}
        style={{
          display: "flex", alignItems: "center", gap: 9,
          width: "100%", padding: "8px 10px",
          background: nav === "wizard" ? "#F2F3F7" : "transparent",
          border: 0, borderRadius: 6, cursor: "pointer",
          fontSize: 13.5, fontWeight: nav === "wizard" ? 700 : 500, color: T.ink,
          fontFamily: "var(--font-sans)",
          marginBottom: 2,
        }}
        onMouseEnter={e => { if (nav !== "wizard") e.currentTarget.style.background = "rgba(31,42,46,0.04)"; }}
        onMouseLeave={e => { if (nav !== "wizard") e.currentTarget.style.background = "transparent"; }}
      >
        <Icon name="wand" size={15} strokeWidth={1.7}/>Get Started
      </button>

      {/* Goals (non-expandable) */}
      <div>
        <button
          onClick={() => onNav("goals")}
          style={{
            display: "grid", gridTemplateColumns: "16px 1fr",
            alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", border: 0,
            background: (nav === "goals" && !openGoalId) ? "#F2F3F7" : "transparent",
            color: T.ink, borderRadius: 6, cursor: "pointer", textAlign: "left",
            fontSize: 13.5, fontWeight: (nav === "goals" && !openGoalId) ? 700 : 500,
            fontFamily: "var(--font-sans)",
          }}
          onMouseEnter={e => { if (!(nav === "goals" && !openGoalId)) e.currentTarget.style.background = "rgba(31,42,46,0.04)"; }}
          onMouseLeave={e => { if (!(nav === "goals" && !openGoalId)) e.currentTarget.style.background = "transparent"; }}
        >
          <Icon name="target" size={15} strokeWidth={1.7}/>
          Goals
        </button>
      </div>

      {/* Performance (expandable) */}
      <div>
        <button
          onClick={() => { onNav("performance"); setPerfOpen(o => !o); }}
          style={{
            display: "grid", gridTemplateColumns: "16px 1fr 14px",
            alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", border: 0,
            background: nav === "performance" ? "#F2F3F7" : "transparent",
            color: T.ink, borderRadius: 6, cursor: "pointer", textAlign: "left",
            fontSize: 13.5, fontWeight: nav === "performance" ? 700 : 500,
            fontFamily: "var(--font-sans)",
          }}
        >
          <Icon name="chartLine" size={15} strokeWidth={1.7}/>
          Performance
          <Icon name={perfOpen ? "chevronDown" : "chevronRight"} size={12} strokeWidth={2}/>
        </button>
        {perfOpen && (
          <div style={{ padding: "2px 0 4px" }}>
            {[
              { id: "dashboard",   label: "Dashboard",        icon: "pieChart" },
              { id: "monitors",    label: "Quality Monitors", icon: "shield" },
              { id: "suggestions", label: "Suggestions",      icon: "sparkles" },
              { id: "anomalies",   label: "Anomalies",        icon: "alert" },
              { id: "reports",     label: "Reports",          icon: "file" },
            ].map(s => {
              const isActive = nav === "performance" && perfTab === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onPerfTab(s.id)}
                  style={{
                    display: "grid", gridTemplateColumns: "15px 1fr",
                    alignItems: "center", gap: 8,
                    width: "100%", padding: "6px 10px 6px 24px",
                    background: isActive ? "#F2F3F7" : "transparent",
                    border: 0, borderRadius: 6, cursor: "pointer", textAlign: "left",
                    fontSize: 12.5, fontWeight: isActive ? 700 : 500,
                    color: isActive ? T.ink : T.ink3, fontFamily: "var(--font-sans)",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(31,42,46,0.04)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon name={s.icon} size={13} strokeWidth={1.7} style={{ color: isActive ? T.ink : T.ink3 }}/>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {/* Improve — promoted to top-level (Action 3 from comparison verdict) */}
      <Row
        id="improve"
        label="Improve"
        icon="sparkles"
        badgeTone="yellow"
        badge={goals.reduce((sum, g) => sum + (g.suggestions || 0), 0) + 4}
      />
      <Row id="resources"   label="Resources"   icon="bookOpen" />
      <Row id="connections" label="Connections" icon="server" />
      <Row id="settings"    label="Settings"    icon="cog" />

      {/* For power users — Advanced */}
      <div style={{ borderTop: `1px solid ${T.rule}`, marginTop: 14, paddingTop: 12 }}>
        <div style={{
          fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
          textTransform: "uppercase", color: T.ink4, padding: "0 10px", marginBottom: 4,
        }}>For power users</div>
        <div>
          <button
            onClick={() => { onNav("advanced"); setAdvOpen(o => !o); }}
            style={{
              display: "grid", gridTemplateColumns: "16px 1fr auto 14px",
              alignItems: "center", gap: 9, width: "100%",
              padding: "8px 10px", border: 0,
              background: nav === "advanced" ? "#F2F3F7" : "transparent",
              color: T.ink2, borderRadius: 6, cursor: "pointer", textAlign: "left",
              fontSize: 13.5, fontWeight: nav === "advanced" ? 700 : 500,
              fontFamily: "var(--font-sans)",
            }}
          >
            <Icon name="wrench" size={14} strokeWidth={1.7}/>
            Advanced
            <span style={{
              fontSize: 9, fontWeight: 700, color: T.ink3,
              background: "rgba(31,42,46,0.06)", padding: "2px 6px",
              borderRadius: 999, letterSpacing: "0.04em",
            }}>LEGACY</span>
            <Icon name={advOpen ? "chevronDown" : "chevronRight"} size={12} strokeWidth={2}/>
          </button>
          {advOpen && (
            <div style={{ padding: "2px 0 4px" }}>
              {[
                { id: "adv-build", label: "Build", icon: "chat" },
                { id: "adv-test", label: "Test", icon: "flask" },
                { id: "adv-deploy", label: "Deploy", icon: "rocket" },
                { id: "adv-automations", label: "Manage Automations", icon: "bolt" },
                { id: "adv-settings", label: "Settings", icon: "cog" },
              ].map(a => (
                <Row key={a.id} id={a.id} label={a.label} icon={a.icon} indent={18} sub />
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// ── AssistantPanel (320px, persistent, purple chrome) ─────────
const AssistantPanel = ({ context, collapsed, onToggle }) => {
  const greetings = {
    "wizard":         { sub: "I'll help you set up your first goal.", prompts: ["Suggest goals for ecommerce", "Set up CSAT monitoring", "What is a goal plan?"] },
    "goals-home":     { sub: "Pick a goal to drill in, or ask me to summarize.", prompts: ["Which goals need attention?", "Summarize live goals", "Top suggestions across goals"] },
    "goal":           { sub: "Tell me about this goal or ask for a tune.", prompts: ["Why is this missing target?", "Suggest a behavior change", "Show recent alerts"] },
    "performance":    { sub: "Cross-goal performance & monitoring.", prompts: ["Compare CSAT to last month", "Why did escalations spike?", "Top failing monitors"] },
    "resources":      { sub: "Procedures, knowledge, tools, guardrails.", prompts: ["Find unused procedures", "What's the blast radius of Refund order?", "Recent KB updates"] },
    "connections":    { sub: "Integrations & MCP servers.", prompts: ["What broke today?", "Are any tools unhealthy?"] },
    "settings":       { sub: "AI surfaces — AIC & AIR settings.", prompts: ["Turn on Copilot", "Configure handoff", "Set business hours"] },
    "advanced":       { sub: "Legacy build / test / deploy.", prompts: ["List my automations", "What's deployed?", "Run all tests"] },
  };
  const g = greetings[context] || greetings["goals-home"];
  if (collapsed) {
    return (
      <aside style={{
        width: 56, background: "#FCFAFD",
        borderLeft: `1px solid ${T.rule}`,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "12px 0", flexShrink: 0,
      }}>
        <button onClick={onToggle} title="Show assistant" style={{
          width: 36, height: 36, borderRadius: 999, border: 0, cursor: "pointer",
          background: "#7B22A4", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="sparkles" size={16} strokeWidth={2}/>
        </button>
      </aside>
    );
  }
  return (
    <aside style={{
      width: 320, background: "#FCFAFD",
      borderLeft: `1px solid ${T.rule}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #F0EAF6" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 999, background: "transparent",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 0 0 1px rgba(123,34,164,0.18)",
            }}>
              <img src="hybrid_v2/kusty-logomark.svg" alt="" style={{ width: 28, height: 27, display: "block" }}/>
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#7B22A4" }}>Goals Assistant</div>
              <div style={{ fontSize: 11, color: "#9A6CB0" }}>Powered by Claude</div>
            </div>
          </div>
          <button onClick={onToggle} title="Collapse" style={{
            width: 26, height: 26, borderRadius: 6, border: 0, cursor: "pointer",
            background: "transparent", color: "#7B22A4",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="chevronRight" size={14} strokeWidth={2}/>
          </button>
        </div>
      </div>

      {/* Greeting + prompts */}
      <div style={{ padding: "16px 18px", overflowY: "auto", flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, color: "#5E1D7D", letterSpacing: "-0.005em", lineHeight: 1.25 }}>
          Hello Amisha, how can I help?
        </div>
        <div style={{ fontSize: 12.5, color: "#7B5A8D", marginTop: 6 }}>{g.sub}</div>

        <div style={{ display: "grid", gap: 8, marginTop: 18 }}>
          {g.prompts.map((p, i) => (
            <button key={i} style={{
              textAlign: "left", padding: "10px 12px",
              background: "#fff", color: "#5E1D7D",
              border: "1px solid #EADCF5", borderRadius: 8,
              fontSize: 12.5, fontWeight: 500, fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}>
              <Icon name="sparkles" size={11} strokeWidth={2} style={{ marginRight: 6, color: "#B31DF0" }}/>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #F0EAF6", background: "#F4EEFA" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#fff", border: "1px solid #E0CFEC", borderRadius: 10,
          padding: "6px 10px",
        }}>
          <input placeholder="Ask Kustomer AI…" style={{
            flex: 1, border: 0, outline: 0, fontFamily: "var(--font-sans)",
            fontSize: 12.5, padding: "6px 0", color: T.ink, background: "transparent",
          }}/>
          <button style={{
            width: 26, height: 26, borderRadius: 6, border: 0, cursor: "pointer",
            background: "#7B22A4", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="arrowRight" size={13} strokeWidth={2.4}/>
          </button>
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { Rail, NavSection, AssistantPanel });
