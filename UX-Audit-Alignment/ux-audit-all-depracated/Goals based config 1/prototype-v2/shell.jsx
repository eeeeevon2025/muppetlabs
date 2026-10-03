// ============================================================
// App shell, two-column site nav:
//   • .rail-mini  : narrow icon-only primary nav (top-level apps)
//   • .rail       : full labeled secondary nav (same content as before)
// Matches the production Kustomer layout.
// ============================================================

// ---------- Mini (primary) icon rail -----------------------------------
const RailMini = ({ route, navigate }) => {
  const sectionGoals = ["goals", "goal"].some((p) => route.path.startsWith(p));
  const sectionPerf = route.path.startsWith("performance");
  const sectionAI =
    route.path.startsWith("aic") ||
    route.path.startsWith("air") ||
    route.path === "automations" ||
    route.path === "automation" ||
    route.path.startsWith("blocks") ||
    route.path === "connections";

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Close More popup on click-outside
  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  // Featured destination (orange bullseye) at the top, then a divider, then the rest.
  const featured = {
    id: "goals", icon: "target", title: "Goals",
    helper: "Outcomes you want to drive",
    active: sectionGoals, go: () => navigate("goals"),
  };

  const stack = [
    { id: "ai",        icon: "sparkles",  title: "AI",            helper: "Automations, building blocks, settings", active: sectionAI,    go: () => navigate("automations") },
    { id: "perf",      icon: "gauge",     title: "Performance",   helper: "Live agent health and drift",            active: sectionPerf,                  go: () => navigate("performance") },
    { id: "reporting", icon: "pieChart",  title: "Reporting",     helper: "Dashboards and ad-hoc analysis",         active: route.path === "reporting",   go: () => navigate("reporting") },
    { id: "_divider1", divider: true },
    { id: "home",      icon: "home",      title: "Rep Dashboard", helper: "Your personal queue and KPIs",           active: route.path === "home",        go: () => navigate("home") },
    { id: "inbox",     icon: "inbox",     title: "Inbox",         helper: "Conversations assigned to you",          active: route.path === "inbox",       go: () => navigate("inbox") },
    { id: "searches",  icon: "listSearch",title: "Searches",      helper: "Saved conversation searches",            active: route.path === "search",      go: () => navigate("search") },
    { id: "teampulse", icon: "activity",  title: "TeamPulse",     helper: "Real-time team activity",                active: route.path === "teampulse",   go: () => navigate("teampulse") },
    { id: "globalSearch",  icon: "searchPlus", title: "Global Search", helper: "Search everything (\u2318K)",       active: false, go: () => navigate("search") },
    { id: "notifications", icon: "bell",       title: "Notifications", helper: "Alerts and approvals", badge: 2,    active: route.path === "notifications", go: () => navigate("notifications") },
  ];

  // Bottom utilities
  const bottom = [];

  const moreItems = [
    { id: "knowledge", icon: "book",   label: "Knowledge sources", go: () => navigate("blocks-knowledge") },
    { id: "help",      icon: "help",   label: "Help",              go: () => navigate("more") },
    { id: "apps",      icon: "grid",   label: "Apps",              go: () => navigate("more") },
    { id: "settings",  icon: "gear",   label: "Settings",          hasChildren: true, go: () => navigate("aic-settings") },
    { id: "widgets",   icon: "grid",   label: "Widgets",           go: () => navigate("more") },
  ];

  return (
    <aside className="rail-mini">
      <div className="rail-mini-top">
        <button
          className={`rail-mini-item featured ${featured.active ? "active" : ""}`}
          onClick={featured.go}
          data-tip={featured.title}
          data-tip-sub={featured.helper}
          aria-label={featured.title}
        >
          <Icon name={featured.icon} size={20} />
        </button>
      </div>

      <div className="rail-mini-stack">
        {stack.map((t) => {
          if (t.divider) return <div key={t.id} className="rail-mini-divider" aria-hidden="true"></div>;
          return (
            <button
              key={t.id}
              className={`rail-mini-item ${t.active ? "active" : ""} ${t.tint ? `tint-${t.tint}` : ""}`}
              onClick={t.go}
              data-tip={t.title}
              data-tip-sub={t.helper}
              aria-label={t.title}
            >
              <Icon name={t.icon} size={18} />
              {t.badge ? <span className="rail-mini-badge">{t.badge}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="rail-mini-foot">
        {bottom.map((b) => (
          <button
            key={b.id}
            className="rail-mini-item"
            onClick={b.go}
            title={b.title}
            aria-label={b.title}
          >
            <Icon name={b.icon} size={17} />
            {b.badge ? <span className="rail-mini-badge">{b.badge}</span> : null}
          </button>
        ))}

        {/* More, opens a small popup of relocated items */}
        <div className="rail-mini-more-wrap" ref={moreRef}>
          <button
            className={`rail-mini-item ${moreOpen ? "active" : ""}`}
            onClick={() => setMoreOpen((v) => !v)}
            data-tip="More"
            data-tip-sub="Apps, KB, settings, help"
            aria-label="More"
            aria-haspopup="menu"
            aria-expanded={moreOpen}
          >
            <Icon name="moreH" size={18} />
          </button>
          {moreOpen && (
            <div className="rail-mini-more-popup" role="menu">
              {moreItems.map((m) => (
                <button
                  key={m.id}
                  className="rail-mini-more-item"
                  onClick={() => { setMoreOpen(false); m.go(); }}
                  role="menuitem"
                >
                  <span className="rail-mini-more-ico"><Icon name={m.icon} size={14} /></span>
                  <span className="rail-mini-more-label">{m.label}</span>
                  {m.hasChildren && <Icon name="chevRight" size={11} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="rail-mini-item rail-mini-avatar"
          onClick={() => navigate("profile")}
          data-tip="Amisha Sharma"
          data-tip-sub="AI admin, acmeoutdoors.com"
          aria-label="Profile"
        >
          <Icon name="user" size={17} />
        </button>
      </div>
    </aside>
  );
};

// ---------- Full (secondary) labeled rail, AI section panel ----------
const Rail = ({ route, navigate, automations, suggestionsCount, onNewAutomation, onOpenPrimer }) => {
  // Route truth, derive section flags from canonical route paths only.
  const onAIC = route.path === "automations" || (route.path === "automation" && automations.find(a => a.id === route.id)?.audience === "AIC") || route.path === "aic-settings";
  const onAIR = route.path === "air-automations" || (route.path === "automation" && automations.find(a => a.id === route.id)?.audience === "AIR") || route.path === "air-settings";
  const onBlocks = route.path.startsWith("blocks");
  const onConnections = route.path === "connections";

  // Expansion state for the two parent items with children
  const [aicOpen, setAicOpen] = useState(onAIC);
  const [blocksOpen, setBlocksOpen] = useState(onBlocks);

  // Auto-expand the parent of the current route
  useEffect(() => { if (onAIC) setAicOpen(true); }, [onAIC]);
  useEffect(() => { if (onBlocks) setBlocksOpen(true); }, [onBlocks]);

  // Filter automations into AIC vs AIR for the selector children
  const aicAutos = automations.filter((a) => a.audience === "AIC");

  // Which automation is currently active inside the AIC list?
  const activeAutoId = route.path === "automation" ? route.id : null;

  return (
    <aside className="rail rail-ai">
      <div className="rail-ai-head">
        <h1 className="rail-ai-title">Kustomer AI</h1>
        {typeof onOpenPrimer === "function" && (
          <button
            className="rail-ai-help"
            onClick={onOpenPrimer}
            title="Replay the goals-first primer"
            aria-label="Replay primer"
          >
            <Icon name="help" size={13} />
          </button>
        )}
      </div>

      {/* Section pill removed */}

      <div className="rail-ai-items">
        {/* Manage Automations, top-level destination */}
        <button
          className={`rail-ai-item ${route.path === "automations" ? "active" : ""}`}
          onClick={() => navigate("automations")}
        >
          <span className="rail-ai-item-ico"><Icon name="bolt" size={14} /></span>
          <span className="rail-ai-item-label">All automations</span>
          <span className="rail-ai-item-count">{automations.length}</span>
        </button>

        {/* Customer AI (selector), expandable parent */}
        <button
          className={`rail-ai-item parent ${aicOpen ? "open" : ""} ${route.path === "automations" ? "active" : ""}`}
          onClick={() => { setAicOpen(true); navigate("automations"); }}
          aria-expanded={aicOpen}
        >
          <span className="rail-ai-item-ico tint-green"><Icon name="chat" size={14} /></span>
          <span className="rail-ai-item-label">Customer AI</span>
          <Icon name={aicOpen ? "chevDown" : "chevRight"} size={11} />
        </button>
        {aicOpen && (
          <div className="rail-ai-children">
            {aicAutos.length === 0 ? (
              <div className="rail-ai-child is-empty">No automations yet</div>
            ) : (
              aicAutos.map((a) => (
                <button
                  key={a.id}
                  className={`rail-ai-child ${activeAutoId === a.id ? "active" : ""}`}
                  onClick={() => navigate(`automation:${a.id}:build`)}
                >
                  <span className={`rail-ai-child-dot ${a.status || "draft"}`}></span>
                  <span className="rail-ai-child-label">{a.name}</span>
                </button>
              ))
            )}
            <button
              className={`rail-ai-child sub-action ${route.path === "aic-settings" ? "active" : ""}`}
              onClick={() => navigate("aic-settings")}
            >
              <span className="rail-ai-child-dot ghost"></span>
              <span className="rail-ai-child-label">Settings</span>
            </button>
          </div>
        )}

        {/* Rep AI, single destination */}
        <button
          className={`rail-ai-item ${onAIR ? "active" : ""}`}
          onClick={() => navigate("air-automations")}
        >
          <span className="rail-ai-item-ico tint-orange"><Icon name="headset" size={14} /></span>
          <span className="rail-ai-item-label">Rep AI</span>
        </button>

        {/* Building Blocks, expandable parent */}
        <button
          className={`rail-ai-item parent ${blocksOpen ? "open" : ""} ${route.path === "blocks" ? "active" : ""}`}
          onClick={() => { setBlocksOpen(true); navigate("blocks"); }}
          aria-expanded={blocksOpen}
        >
          <span className="rail-ai-item-ico tint-violet"><Icon name="building" size={14} /></span>
          <span className="rail-ai-item-label">Building Blocks</span>
          <Icon name={blocksOpen ? "chevDown" : "chevRight"} size={11} />
        </button>
        {blocksOpen && (
          <div className="rail-ai-children">
            {[
              { id: "blocks", label: "Overview", icon: "building" },
              { id: "blocks-procedures", label: "Procedures",       icon: "code" },
              { id: "blocks-scenarios",  label: "Scenarios",         icon: "book" },
              { id: "blocks-knowledge",  label: "Knowledge Sources", icon: "book" },
              { id: "blocks-tools",      label: "Tools",             icon: "tool" },
              { id: "blocks-guardrails", label: "Guardrails",         icon: "shield" },
            ].map((b) => (
              <button
                key={b.id}
                className={`rail-ai-child ${route.path === b.id ? "active" : ""}`}
                onClick={() => navigate(b.id)}
              >
                <span className="rail-ai-child-ico"><Icon name={b.icon} size={11} /></span>
                <span className="rail-ai-child-label">{b.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Connections */}
        <button
          className={`rail-ai-item ${onConnections ? "active" : ""}`}
          onClick={() => navigate("connections")}
        >
          <span className="rail-ai-item-ico tint-teal"><Icon name="server" size={14} /></span>
          <span className="rail-ai-item-label">Connections</span>
        </button>

        {/* Advanced, legacy escape hatch */}
        <button
          className="rail-ai-item"
          onClick={() => navigate("more")}
        >
          <span className="rail-ai-item-ico"><Icon name="bolt" size={14} /></span>
          <span className="rail-ai-item-label">Advanced</span>
          <span className="rail-ai-mini-pill legacy">Legacy</span>
        </button>
      </div>
    </aside>
  );
};

window.Rail = Rail;
window.RailMini = RailMini;
