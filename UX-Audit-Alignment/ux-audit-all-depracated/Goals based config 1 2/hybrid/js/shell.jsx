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
        <img src="hybrid/kusty-logomark.svg" alt="Kusty" style={{ width: 32, height: 30, display: "block" }}/>
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
const NavSection = ({ nav, openGoalId, onNav, onStartWizard, goals, perfTab, onPerfTab, resTab, onResTab }) => {
  const [advOpen, setAdvOpen] = React.useState(nav.startsWith("adv"));
  const [perfOpen, setPerfOpen] = React.useState(nav === "performance");
  const [resOpen, setResOpen] = React.useState(nav === "resources");
  React.useEffect(() => {
    if (nav.startsWith("adv")) setAdvOpen(true);
    if (nav === "performance") setPerfOpen(true);
    if (nav === "resources") setResOpen(true);
  }, [nav]);

  const Row = ({ id, label, icon, sub, badge, pills, indent = 0, onClick, isActive }) => {
    const active = isActive ?? (nav === id);
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
              background: "rgba(214,58,67,0.12)", color: T.danger,
              fontSize: 10, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
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

      {/* Get Started, launcher */}
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
        <Icon name="wand" size={15} strokeWidth={1.7}/>AI Setup
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

      {/* Resources (expandable) */}
      <div>
        <button
          onClick={() => { onNav("resources"); setResOpen(o => !o); }}
          style={{
            display: "grid", gridTemplateColumns: "16px 1fr 14px",
            alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", border: 0,
            background: "transparent",
            color: T.ink, borderRadius: 6, cursor: "pointer", textAlign: "left",
            fontSize: 13.5, fontWeight: nav === "resources" ? 700 : 500,
            fontFamily: "var(--font-sans)",
          }}
        >
          <Icon name="bookOpen" size={15} strokeWidth={1.7}/>
          Resources
          <Icon name={resOpen ? "chevronDown" : "chevronRight"} size={12} strokeWidth={2}/>
        </button>
        {resOpen && (
          <div style={{ padding: "2px 0 4px" }}>
            {[
              { id: "procedures", label: "Procedures",       icon: "bookOpen" },
              { id: "knowledge",  label: "Knowledge Sources", icon: "folder" },
              { id: "tools",      label: "Tools",            icon: "wrench" },
              { id: "guardrails", label: "Guardrails",       icon: "shield" },
              { id: "computed",   label: "Computed Fields",  icon: "sparkles" },
            ].map(s => {
              const isActive = nav === "resources" && resTab === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onResTab && onResTab(s.id)}
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
      {/* Performance (expandable) */}
      <div>
        <button
          onClick={() => { onNav("performance"); setPerfOpen(o => !o); }}
          style={{
            display: "grid", gridTemplateColumns: "16px 1fr 14px",
            alignItems: "center", gap: 9, width: "100%",
            padding: "8px 10px", border: 0,
            background: "transparent",
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
      <Row id="connections" label="Connections" icon="server" />
      <Row id="settings"    label="Settings"    icon="cog" />

      {/* For power users, Advanced */}
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

// ── AssistantPanel (380px, persistent, gradient-bordered card chrome) ─────────
const AssistantPanel = ({ context, collapsed, closed, onToggle, onClose, onOpen }) => {
  const greetings = {
    "wizard":         { sub: "Describe what you want this AI to do, and I'll suggest a setup.", prompts: [
      { icon: "target",    label: "Suggest goals for an ecommerce team" },
      { icon: "sparkles",  label: "Set up CSAT monitoring" },
      { icon: "info",      label: "Explain what a goal plan covers" },
    ]},
    "goals-home":     { sub: "Describe a goal you want to set up or improve, and I'll suggest next steps.", prompts: [
      { icon: "alert",     label: "Which goals need attention right now?" },
      { icon: "chartLine", label: "Summarize how live goals are trending" },
      { icon: "sparkles",  label: "Show top suggestions across all goals" },
    ]},
    "goal":           { sub: "Describe how you want to tune this goal and I'll suggest changes.", prompts: [
      { icon: "alert",     label: "Why is this goal missing its target?" },
      { icon: "wand",      label: "Suggest a behavior change to try" },
      { icon: "history",   label: "Show recent alerts for this goal" },
    ]},
    "performance":    { sub: "Ask about how your AI is performing across goals.", prompts: [
      { icon: "chartLine", label: "Compare CSAT against last month" },
      { icon: "alert",     label: "Why did escalations spike this week?" },
      { icon: "shield",    label: "List the top failing quality monitors" },
    ]},
    "resources":      { sub: "Ask about procedures, knowledge, tools, and guardrails.", prompts: [
      { icon: "bookOpen",  label: "Find procedures nobody is using" },
      { icon: "wrench",    label: "What is the blast radius of Refund Order?" },
      { icon: "folder",    label: "Show recent knowledge base updates" },
    ]},
    "connections":    { sub: "Ask about integrations and MCP server health.", prompts: [
      { icon: "alert",     label: "What broke today?" },
      { icon: "server",    label: "Are any tools unhealthy?" },
      { icon: "refresh",   label: "Re-sync everything now" },
    ]},
    "settings":       { sub: "Ask me to adjust AI surfaces for Customers or Reps.", prompts: [
      { icon: "headset",   label: "Turn on Rep Copilot for the team" },
      { icon: "users",     label: "Configure handoff to humans" },
      { icon: "clock",     label: "Set business hours for AI coverage" },
    ]},
    "advanced":       { sub: "Ask about your legacy build, test, and deploy flows.", prompts: [
      { icon: "lists",     label: "List all of my automations" },
      { icon: "rocket",    label: "What is currently deployed?" },
      { icon: "flask",     label: "Run every test against the latest plan" },
    ]},
  };
  const g = greetings[context] || greetings["goals-home"];

  // AI gradient text (for "Hello Yvonne")
  const aiText = {
    background: "linear-gradient(135deg, oklch(0.428 0.255 320) 0%, oklch(0.428 0.255 320) 15%, oklch(0.508 0.275 320) 35%, oklch(0.56 0.26 290) 65%, oklch(0.56 0.26 290) 100%)",
    WebkitBackgroundClip: "text", backgroundClip: "text",
    WebkitTextFillColor: "transparent", color: "transparent",
    fontWeight: 700,
  };
  // Rule color used internally
  const ruleSoft = "oklch(0.924 0.022 290)";
  const textSecondary = "oklch(0.372 0.038 288)";
  const hintBg = "oklch(0.988 0.015 290)";

  if (closed) {
    // Fully hidden — show a small floating reopen FAB anchored to viewport
    return (
      <button onClick={onOpen} title="Open Goals Assistant" style={{
        position: "fixed", bottom: 18, right: 18, zIndex: 40,
        height: 44, padding: "0 14px 0 12px", borderRadius: 999,
        border: 0, cursor: "pointer",
        background: "linear-gradient(135deg, oklch(0.428 0.255 320), oklch(0.56 0.26 290))",
        color: "#fff",
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
        boxShadow: "0 8px 24px rgba(123,34,164,0.32), 0 2px 6px rgba(31,42,46,0.10)",
      }}>
        <Icon name="sparkles" size={16} strokeWidth={2}/>
        Assistant
      </button>
    );
  }
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
          background: "linear-gradient(135deg, oklch(0.428 0.255 320), oklch(0.56 0.26 290))",
          color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="sparkles" size={16} strokeWidth={2}/>
        </button>
      </aside>
    );
  }
  return (
    <aside style={{
      width: 400, background: "#fff",
      borderLeft: `1px solid ${T.rule}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
      padding: "14px 14px 14px 14px",
    }}>
      {/* Small chip header outside the card */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px 8px 10px", borderRadius: 10,
          background: "#DCE7FF", color: T.ink,
          fontSize: 14, fontWeight: 700, fontFamily: "var(--font-sans)",
        }}>
          <img src="hybrid/kusty-outline-gradient.svg" alt="" style={{ width: 22, height: 22, display: "block" }}/>
          Assistant
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button onClick={onToggle} title="Collapse" style={{
            width: 26, height: 26, borderRadius: 6, border: 0, cursor: "pointer",
            background: "transparent", color: "#6B7280",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="chevronRight" size={14} strokeWidth={2}/></button>
          <button onClick={onClose} title="Close" style={{
            width: 26, height: 26, borderRadius: 6, border: 0, cursor: "pointer",
            background: "transparent", color: "#6B7280",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="x" size={14} strokeWidth={2}/></button>
        </div>
      </div>

      {/* Gradient-bordered card */}
      <div style={{
        flex: 1,
        minHeight: 0,
        borderRadius: 12,
        border: "2px solid transparent",
        background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, rgba(148,43,239,0.8) 0%, rgba(87,70,238,0.9) 25%, rgba(0,108,236,0.8) 50%, rgba(87,70,238,0.9) 75%, rgba(148,43,239,0.8) 100%) border-box",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Section 1, Header */}
        <div style={{ padding: 12, borderBottom: `1px solid ${ruleSoft}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8,
            border: `1px solid ${ruleSoft}`, borderRadius: 10, padding: "6px 10px",
          }}>
            <Icon name="listSearch" size={16} strokeWidth={2} style={{ color: "#3F8CFF" }}/>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, flex: 1 }}>New thread</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 12, color: "rgba(31,42,46,0.55)" }}>
              5mo ago <Icon name="chevronDown" size={12} strokeWidth={2}/>
            </div>
            <button title="New" style={{ width: 24, height: 24, borderRadius: 6, border: 0, background: "transparent", color: "#6B7280", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="plus" size={14} strokeWidth={2}/>
            </button>
            <button title="More" style={{ width: 24, height: 24, borderRadius: 6, border: 0, background: "transparent", color: "#6B7280", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="moreV" size={14} strokeWidth={2}/>
            </button>
          </div>
        </div>

        {/* Section 2, Greeting */}
        <div style={{ padding: "12px 12px", borderBottom: `1px solid ${ruleSoft}` }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, lineHeight: 1.35 }}>
            <span style={aiText}>Hello Amisha</span><span style={{ color: T.ink }}>, how can I help?</span>
          </div>
          <p style={{ fontSize: 14, color: textSecondary, margin: "6px 0 0", lineHeight: 1.45 }}>
            {g.sub}
          </p>
        </div>

        {/* Section 3, Empty state (scrollable) */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "20px 16px", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0,
          background: "#fff",
        }}>
          {/* AI pill */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 999,
              background: "linear-gradient(135deg, oklch(0.428 0.255 320) 0%, oklch(0.56 0.26 290) 100%)",
              color: "#fff", fontSize: 13, fontWeight: 600,
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="sparkles" size={10} strokeWidth={2.4}/>
              </span>
              Goals Assistant
            </div>
          </div>

          <div style={{ fontSize: 14, color: textSecondary, margin: "0 auto 20px", lineHeight: 1.45, maxWidth: 320, textAlign: "center" }}>
            {g.sub}
          </div>

          {/* Prompt cards */}
          <div style={{ display: "grid", gap: 12, maxWidth: 380, width: "100%", margin: "0 auto" }}>
            {g.prompts.map((p, i) => (
              <button key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fff", border: `1px solid ${ruleSoft}`,
                borderRadius: 8, padding: "8px 12px",
                cursor: "pointer", textAlign: "left",
                fontFamily: "var(--font-sans)",
                transition: "background 100ms, box-shadow 100ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "oklch(0.946 0.02 290)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(31,42,46,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{
                  width: 24, height: 24, flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "oklch(0.508 0.275 320)",
                }}>
                  <Icon name={p.icon} size={18} strokeWidth={1.8}/>
                </span>
                <span style={{ fontSize: 14, color: T.ink, lineHeight: 1.4 }}>{p.label}</span>
              </button>
            ))}
          </div>

          {/* Hint card */}
          <div style={{
            marginTop: 20,
            background: hintBg,
            border: `1px dashed ${ruleSoft}`,
            borderRadius: 8,
            padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Icon name="arrowDown" size={14} strokeWidth={2} style={{ color: "#6B7280", flexShrink: 0 }}/>
            <span style={{ fontSize: 13, color: T.ink2, lineHeight: 1.45, textAlign: "center", flex: 1 }}>
              The Goals Assistant can help you build better goals and understand your results.
            </span>
          </div>
        </div>

        {/* Section 4, Footer */}
        <div style={{
          borderTop: `1px solid ${ruleSoft}`,
          padding: "8px 12px 12px",
          background: "linear-gradient(135deg, oklch(0.428 0.255 320 / 8%) 0%, oklch(0.456 0.24 290 / 8%) 100%)",
        }}>
          <div style={{
            background: "radial-gradient(68.96% 63.94% at 50% 28.85%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.1) 100%)",
            margin: "-8px -12px 0",
            padding: "8px 12px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 20,
                border: `1px solid ${ruleSoft}`, background: "#fff",
                cursor: "pointer", fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 600,
              }}>
                <Icon name="lightbulb" size={14} strokeWidth={2} style={{ color: "oklch(0.508 0.275 320)" }}/>
                <span style={aiText}>Prompts</span>
              </button>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 14px", borderRadius: 20,
                border: 0, cursor: "pointer", fontFamily: "var(--font-sans)",
                background: "oklch(0.56 0.26 270)", color: "#fff",
                fontSize: 13, fontWeight: 600,
              }}>
                <Icon name="help" size={14} strokeWidth={2}/>
                Help
              </button>
            </div>

            <div style={{
              border: `1px solid ${ruleSoft}`, borderRadius: 8,
              background: "#fff", padding: "8px 12px",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <textarea
                placeholder="Describe how to improve or refine this search..."
                rows={2}
                style={{
                  border: 0, outline: 0, resize: "none",
                  fontFamily: "var(--font-sans)", fontSize: 14,
                  color: T.ink, background: "transparent",
                  width: "100%", padding: 0, lineHeight: 1.4,
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                <button title="Voice" style={{
                  width: 24, height: 24, borderRadius: 999, border: 0, background: "transparent",
                  color: T.ink, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="mic" size={16} strokeWidth={2}/>
                </button>
                <button title="Send" disabled style={{
                  width: 28, height: 28, borderRadius: 999, border: 0,
                  background: ruleSoft, color: "rgba(31,42,46,0.4)",
                  cursor: "not-allowed",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="arrowUp" size={14} strokeWidth={2.4}/>
                </button>
              </div>
            </div>

            <div style={{
              fontSize: 12, color: textSecondary, marginTop: 8,
              textAlign: "center",
            }}>
              AI can make mistakes. Please verify important information.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { Rail, NavSection, AssistantPanel });
