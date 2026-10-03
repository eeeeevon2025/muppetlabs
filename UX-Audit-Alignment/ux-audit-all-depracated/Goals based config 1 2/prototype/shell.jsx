// ============================================================
// App shell — site rail + page chrome
// ============================================================

const Rail = ({ route, navigate, automations }) => {
  const [aicOpen, setAicOpen] = useState(true);
  const [airOpen, setAirOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);

  const sectionGoals = ["goals", "goal"].some((p) => route.path.startsWith(p));
  const sectionPerf = route.path.startsWith("performance");
  const sectionAIC = route.path.startsWith("aic") || route.path.startsWith("automations");
  const sectionAIR = route.path.startsWith("air");
  const sectionRes = route.path.startsWith("blocks") || route.path.startsWith("connections");

  const aicAutos = automations.filter((a) => a.audience === "AIC");

  return (
    <aside className="rail">
      <div className="rail-brand">
        <div className="rail-brand-mark">K</div>
        <div className="rail-brand-name">
          Kustomer
          <small>Goals-first</small>
        </div>
      </div>

      <div className="rail-section">Primary</div>
      <div className="rail-item" onClick={() => navigate("home")}>
        <Icon name="home" size={15} /> <span className="label">Rep Dashboard</span>
      </div>
      <div className={`rail-item ${sectionGoals ? "active" : ""}`} onClick={() => navigate("goals")}>
        <Icon name="target" size={15} /> <span className="label">Goals</span>
        <span className="badge">6</span>
      </div>
      <div className={`rail-item ${sectionPerf ? "active" : ""}`} onClick={() => navigate("performance")}>
        <Icon name="activity" size={15} /> <span className="label">Performance</span>
        <span className="badge warn">3</span>
      </div>
      <div className="rail-item" onClick={() => navigate("inbox")}>
        <Icon name="inbox" size={15} /> <span className="label">Inbox</span>
      </div>
      <div className="rail-item" onClick={() => navigate("teampulse")}>
        <Icon name="users" size={15} /> <span className="label">TeamPulse</span>
      </div>
      <div className="rail-item" onClick={() => navigate("reporting")}>
        <Icon name="pieChart" size={15} /> <span className="label">Reporting</span>
      </div>

      <div className="rail-section">AI</div>
      <div className={`rail-item ${sectionAIC ? "active" : ""}`} onClick={() => setAicOpen(!aicOpen)}>
        <Icon name="sparkles" size={15} /> <span className="label">AI for Customers</span>
        <Icon name={aicOpen ? "chevDown" : "chevRight"} size={13} />
      </div>
      {aicOpen && (
        <div className="rail-sub">
          <div
            className={`rail-item ${route.path === "automations" ? "active" : ""}`}
            onClick={() => navigate("automations")}
          >
            <Icon name="bolt" size={13} /> <span className="label">Automations</span>
            <span className="badge">{aicAutos.length}</span>
          </div>
          <div
            className={`rail-item ${route.path === "aic-settings" ? "active" : ""}`}
            onClick={() => navigate("aic-settings")}
          >
            <Icon name="sliders" size={13} /> <span className="label">Settings</span>
          </div>
        </div>
      )}

      <div className={`rail-item ${sectionAIR ? "active" : ""}`} onClick={() => setAirOpen(!airOpen)}>
        <Icon name="headset" size={15} /> <span className="label">AI for Reps</span>
        <Icon name={airOpen ? "chevDown" : "chevRight"} size={13} />
      </div>
      {airOpen && (
        <div className="rail-sub">
          <div
            className={`rail-item ${route.path === "air-settings" ? "active" : ""}`}
            onClick={() => navigate("air-settings")}
          >
            <Icon name="sliders" size={13} /> <span className="label">Settings</span>
          </div>
        </div>
      )}

      <div className={`rail-item ${sectionRes ? "active" : ""}`} onClick={() => setResOpen(!resOpen)}>
        <Icon name="building" size={15} /> <span className="label">Building Blocks</span>
        <Icon name={resOpen ? "chevDown" : "chevRight"} size={13} />
      </div>
      {resOpen && (
        <div className="rail-sub">
          <div className={`rail-item ${route.path === "blocks-procedures" ? "active" : ""}`} onClick={() => navigate("blocks-procedures")}>
            <Icon name="code" size={13} /> <span className="label">Procedures</span>
          </div>
          <div className={`rail-item ${route.path === "blocks-knowledge" ? "active" : ""}`} onClick={() => navigate("blocks-knowledge")}>
            <Icon name="book" size={13} /> <span className="label">Knowledge Sources</span>
          </div>
          <div className={`rail-item ${route.path === "blocks-tools" ? "active" : ""}`} onClick={() => navigate("blocks-tools")}>
            <Icon name="tool" size={13} /> <span className="label">Tools</span>
          </div>
          <div className={`rail-item ${route.path === "blocks-guardrails" ? "active" : ""}`} onClick={() => navigate("blocks-guardrails")}>
            <Icon name="shield" size={13} /> <span className="label">Shared Guardrails</span>
          </div>
        </div>
      )}

      <div className={`rail-item`} onClick={() => navigate("connections")}>
        <Icon name="server" size={15} /> <span className="label">Connections</span>
      </div>

      <div className="rail-foot">
        <div className="rail-item" onClick={() => navigate("search")}>
          <Icon name="search" size={15} /> <span className="label">Search</span>
        </div>
        <div className="rail-item" onClick={() => navigate("notifications")}>
          <Icon name="bell" size={15} /> <span className="label">Notifications</span>
        </div>
        <div className="rail-item" onClick={() => navigate("more")}>
          <Icon name="moreH" size={15} /> <span className="label">More</span>
        </div>
        <div className="rail-avatar" onClick={() => navigate("profile")}>
          <div className="rail-avatar-mark">AS</div>
          <div className="rail-avatar-name">Amisha S.<small>AI admin</small></div>
        </div>
      </div>
    </aside>
  );
};

window.Rail = Rail;
