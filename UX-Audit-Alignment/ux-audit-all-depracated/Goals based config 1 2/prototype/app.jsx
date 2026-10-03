// ============================================================
// App — router + top-level state
// ============================================================

const App = () => {
  // Route is a string like "goals", "goal:refund-20", "automation:refund-order:build"
  const [route, setRouteState] = useState(() => {
    const hash = window.location.hash.replace(/^#/, "");
    return parseRoute(hash || "goals");
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !window.localStorage.getItem("kustomer-onboarded");
  });
  const [companyProfileSet, setCompanyProfileSet] = useState(() => {
    return Boolean(window.localStorage.getItem("kustomer-company-set"));
  });

  const [goals, setGoals] = useState(window.MOCK.GOALS);
  const [automations, setAutomations] = useState(window.MOCK.AUTOMATIONS);
  const [createGoalOpen, setCreateGoalOpen] = useState(false);
  const [applySuggestionFor, setApplySuggestionFor] = useState(null);
  const [activatedAutomationId, setActivatedAutomationId] = useState(null);

  function parseRoute(str) {
    const parts = str.split(":");
    return { path: parts[0], id: parts[1] || null, sub: parts[2] || null };
  }

  const navigate = (target) => {
    const next = parseRoute(target);
    setRouteState(next);
    window.location.hash = target;
    document.querySelector(".work")?.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      setRouteState(parseRoute(hash || "goals"));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    window.localStorage.setItem("kustomer-onboarded", "1");
  };

  const saveNewGoal = (data) => {
    const id = `goal-${Date.now()}`;
    const newGoal = {
      id,
      name: data.name,
      description: data.description,
      audience: data.audience,
      owner: "Amisha Sharma",
      state: "draft",
      target: { value: Number(data.target.value) || 0, unit: data.target.unit, direction: data.target.direction, window: data.target.window },
      progress: 0,
      deltaPct: 0,
      trend: "flat",
      points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      topics: data.topics.map((t) => window.MOCK.TOPICS.find((x) => x.id === t)?.label).filter(Boolean),
      coverage: { topics: `${data.topics.length} of 5`, volume: "—", deflectable: 0 },
      attached: { automations: [], monitors: [], humanWorkflows: [], blocks: { procedures: 0, kb: 0, tools: 0, guardrails: 0 } },
      activity: [{ when: "just now", what: "Goal created" }],
    };
    setGoals([newGoal, ...goals]);
    if (data.company) {
      setCompanyProfileSet(true);
      window.localStorage.setItem("kustomer-company-set", "1");
    }
    setCreateGoalOpen(false);
    navigate(`goal:${id}`);
  };

  const handleApplySuggestion = (suggestion) => {
    setApplySuggestionFor(null);
    // toast or feedback could go here
    alert("Applied! The procedure has been updated and a new draft version was saved.");
  };

  const startNewAutomation = () => {
    // Find a draft automation or create one
    const draftAuto = automations.find((a) => a.firstRunMode);
    if (draftAuto) {
      navigate(`automation:${draftAuto.id}:build`);
    } else {
      const id = `auto-${Date.now()}`;
      const newAuto = {
        id,
        name: "Untitled automation",
        audience: "AIC",
        version: "draft",
        status: "draft",
        type: "Conversational",
        drives: [],
        modified: "just now",
        modifiedBy: "Amisha",
        topics: [],
        attachedBlocks: { procedures: 0, kb: 0, tools: 0, guardrails: 0 },
        lastEval: null,
        firstRunMode: true,
      };
      setAutomations([newAuto, ...automations]);
      navigate(`automation:${id}:build`);
    }
  };

  const automation = automations.find((a) => a.id === route.id);

  const advanceFirstRun = (toTab) => {
    if (!automation) return;
    navigate(`automation:${automation.id}:${toTab}`);
  };

  const activateAutomation = () => {
    if (!automation) return;
    setAutomations(
      automations.map((a) =>
        a.id === automation.id ? { ...a, firstRunMode: false, status: "live", version: "v1" } : a
      )
    );
    setActivatedAutomationId(automation.id);
    navigate(`automation:${automation.id}:analyze`);
  };

  let main;
  if (route.path === "goals") {
    main = <GoalsHome goals={goals} navigate={navigate} onNewGoal={() => setCreateGoalOpen(true)} />;
  } else if (route.path === "goal") {
    const g = goals.find((x) => x.id === route.id);
    if (g) main = <GoalDetail goal={g} navigate={navigate} onApplySuggestion={setApplySuggestionFor} />;
    else main = <NotFound navigate={navigate} thing="Goal" />;
  } else if (route.path === "automations") {
    main = <AutomationsList automations={automations} navigate={navigate} onNewAutomation={startNewAutomation} />;
  } else if (route.path === "automation") {
    if (!automation) main = <NotFound navigate={navigate} thing="Automation" />;
    else {
      const tab = route.sub || "analyze";
      const next = { build: "test", test: "deploy", deploy: "analyze" }[tab];
      const body =
        tab === "build" ? <BuildScreen automation={automation} navigate={navigate} onAdvance={() => advanceFirstRun(next)} /> :
        tab === "test" ? <TestScreen automation={automation} navigate={navigate} onAdvance={() => advanceFirstRun(next)} /> :
        tab === "deploy" ? <DeployScreen automation={automation} navigate={navigate} onActivate={activateAutomation} /> :
        tab === "analyze" ? <AnalyzeScreen automation={automation} navigate={navigate} onApplySuggestion={setApplySuggestionFor} /> :
        tab === "settings" ? <AutomationSettings automation={automation} /> :
        null;

      const wantsRail = tab === "build" || tab === "test";
      main = <AutomationShell automation={automation} tab={tab} navigate={navigate} rightRail={wantsRail}>{body}</AutomationShell>;
    }
  } else if (route.path === "performance") {
    main = <PerformanceScreen navigate={navigate} onApplySuggestion={setApplySuggestionFor} />;
  } else {
    main = <SimpleStub path={route.path} navigate={navigate} />;
  }

  return (
    <div className="app">
      <Rail route={route} navigate={navigate} automations={automations} />
      <div className="work">{main}</div>

      <OnboardingModal open={showOnboarding} onClose={dismissOnboarding} />
      <CreateGoalSlideout
        open={createGoalOpen}
        onClose={() => setCreateGoalOpen(false)}
        onSave={saveNewGoal}
        companyProfileSet={companyProfileSet}
      />
      <ApplySuggestionSlideout
        open={Boolean(applySuggestionFor)}
        suggestion={applySuggestionFor}
        onClose={() => setApplySuggestionFor(null)}
        onApply={handleApplySuggestion}
      />

      {activatedAutomationId && <ActivationToast onClose={() => setActivatedAutomationId(null)} />}
    </div>
  );
};

const NotFound = ({ navigate, thing }) => (
  <>
    <PageHeader crumbs={[{ label: "Not found" }]} title={`${thing} not found`} />
    <div className="page-body">
      <button className="btn" onClick={() => navigate("goals")}>← Back to Goals</button>
    </div>
  </>
);

const SimpleStub = ({ path, navigate }) => {
  const titles = {
    home: "Rep Dashboard",
    inbox: "Inbox",
    teampulse: "TeamPulse",
    reporting: "Reporting",
    "aic-settings": "AI for Customers — Settings",
    "air-settings": "AI for Reps — Settings",
    "blocks-procedures": "Building Blocks · Procedures",
    "blocks-knowledge": "Building Blocks · Knowledge Sources",
    "blocks-tools": "Building Blocks · Tools",
    "blocks-guardrails": "Building Blocks · Shared Guardrails",
    connections: "Connections",
    search: "Search",
    notifications: "Notifications",
    more: "More",
    profile: "Profile",
  };
  return (
    <>
      <PageHeader crumbs={[{ label: titles[path] || path }]} title={titles[path] || path} />
      <div className="page-body">
        <div className="empty">
          This screen is a stub in the prototype.<br />
          The structure is in the IA recommendation; the clickable depth lives in Goals → Automations → Build / Test / Deploy / Analyze and Performance.
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={() => navigate("goals")}>← Back to Goals</button>
          </div>
        </div>
      </div>
    </>
  );
};

const AutomationSettings = ({ automation }) => (
  <div className="card" style={{ marginTop: 8 }}>
    <h3>Settings</h3>
    <p style={{ color: "var(--gray-95)" }}>
      Per-automation settings — Display Name, Per-automation Guardrails (Competitors, Secrets, Tone), Email Template, Verification, Business Hours, Routing, Fallback.
      Shared guardrails attach inline from Building Blocks → Shared Guardrails.
    </p>
    <p style={{ color: "var(--gray-90)", fontSize: 12, fontStyle: "italic" }}>(Stub — focus screens are Build / Test / Deploy / Analyze.)</p>
  </div>
);

const ActivationToast = ({ onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 300, background: "var(--gray-120)", color: "#fff", padding: "12px 18px", borderRadius: 10, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 12px 32px rgba(15,23,42,0.3)", animation: "slideIn 240ms" }}>
      <Icon name="check" size={16} />
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>You're live</div>
        <div style={{ fontSize: 11.5, opacity: 0.85 }}>The automation is now handling matched conversations.</div>
      </div>
      <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4, marginLeft: 8 }}>
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

Object.assign(window, { App, NotFound, SimpleStub, AutomationSettings, ActivationToast });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
