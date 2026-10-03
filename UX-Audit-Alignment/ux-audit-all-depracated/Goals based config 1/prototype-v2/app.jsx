// ============================================================
// App, router + top-level state
// ============================================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "accent": "indigo",
  "firstRunMode": true,
  "showAnswers": true,
  "showRailKbd": true,
  "activateSequence": false,
  "previewAgainstEval": false,
  "topicHierarchy": false,
  "reviewerApproval": false,
  "emptyGoals": true,
  "emptyAutomations": true
}/*EDITMODE-END*/;

const ACCENT_MAP = {
  indigo:  { text: "#4538F0", bg: "#EEEBFE", edge: "#C6BFFA", solid: "#5448E8", ai_text: "#5A2BCB", ai_bg: "#F1EBFD", ai_edge: "#DBCBFA" },
  emerald: { text: "#0E7C50", bg: "#E5F4ED", edge: "#B5DDCB", solid: "#118A5C", ai_text: "#0E7C50", ai_bg: "#E5F4ED", ai_edge: "#B5DDCB" },
  amber:   { text: "#8E5A0A", bg: "#FBF0DC", edge: "#EDD6A8", solid: "#B47314", ai_text: "#8E5A0A", ai_bg: "#FBF0DC", ai_edge: "#EDD6A8" },
  slate:   { text: "#1F242D", bg: "#ECECEE", edge: "#D6D6DA", solid: "#1F242D", ai_text: "#1F242D", ai_bg: "#ECECEE", ai_edge: "#D6D6DA" },
};

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent variables to :root
  useEffect(() => {
    const a = ACCENT_MAP[t.accent] || ACCENT_MAP.indigo;
    const r = document.documentElement.style;
    r.setProperty("--accent-text", a.text);
    r.setProperty("--accent-bg", a.bg);
    r.setProperty("--accent-edge", a.edge);
    r.setProperty("--accent-solid", a.solid);
    r.setProperty("--ai-text", a.ai_text);
    r.setProperty("--ai-bg", a.ai_bg);
    r.setProperty("--ai-edge", a.ai_edge);
  }, [t.accent]);

  // Density tweak
  useEffect(() => {
    document.body.dataset.density = t.density;
  }, [t.density]);

  // Expose feature flags globally so components that aren't easily threaded
  // (TopicMulti, etc.) can read them.
  useEffect(() => {
    window.__FLAGS__ = {
      activateSequence: t.activateSequence,
      previewAgainstEval: t.previewAgainstEval,
      topicHierarchy: t.topicHierarchy,
      reviewerApproval: t.reviewerApproval,
    };
    // Fire a custom event so subscribers can re-render if they want.
    window.dispatchEvent(new CustomEvent("flagschange", { detail: window.__FLAGS__ }));
  }, [t.activateSequence, t.previewAgainstEval, t.topicHierarchy, t.reviewerApproval]);

  const [route, setRouteState] = useState(() => {
    const hash = window.location.hash.replace(/^#/, "");
    return parseRoute(hash || "goals");
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !window.localStorage.getItem("v2-onboarded");
  });
  const [companyProfileSet, setCompanyProfileSet] = useState(() => {
    return Boolean(window.localStorage.getItem("v2-company-set"));
  });

  // Patch initial automations with firstRunMode tweak control
  // Goals persist to localStorage so user-created goals survive a refresh.
  const GOALS_KEY = "v2-goals";
  const [goals, setGoals] = useState(() => {
    try {
      const stored = window.localStorage.getItem(GOALS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return t.emptyGoals ? [] : window.MOCK.GOALS;
  });
  const [prefillGoal, setPrefillGoal] = useState(null);
  const [automations, setAutomations] = useState(() => {
    if (t.emptyAutomations) return [];
    const base = window.MOCK.AUTOMATIONS;
    return base.map(a => a.id === "product-questions" ? { ...a, firstRunMode: t.firstRunMode } : a);
  });

  // Live-toggle: when the empty-state toggles flip, re-seed the affected
  // collection. Toggling DISCARDS any user-created records, that's the
  // intended demo behavior, the tweak panel is for previewing states.
  // Skip the very first run so we don't clobber localStorage-loaded goals.
  const goalsToggleRef = useRef(t.emptyGoals);
  useEffect(() => {
    if (goalsToggleRef.current === t.emptyGoals) return;
    goalsToggleRef.current = t.emptyGoals;
    setGoals(t.emptyGoals ? [] : window.MOCK.GOALS);
  }, [t.emptyGoals]);

  // Persist goals to localStorage on every change so user-created goals
  // and edits survive a page refresh.
  useEffect(() => {
    try { window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); } catch (e) {}
  }, [goals]);
  useEffect(() => {
    if (t.emptyAutomations) {
      setAutomations([]);
    } else {
      const base = window.MOCK.AUTOMATIONS;
      setAutomations(base.map(a => a.id === "product-questions" ? { ...a, firstRunMode: t.firstRunMode } : a));
    }
  }, [t.emptyAutomations]);
  // re-sync when first-run tweak flips
  useEffect(() => {
    setAutomations(a => a.map(x => x.id === "product-questions" ? { ...x, firstRunMode: t.firstRunMode, status: t.firstRunMode ? "draft" : x.status } : x));
  }, [t.firstRunMode]);

  const [createGoalOpen, setCreateGoalOpen] = useState(false);
  const [newAutoModalOpen, setNewAutoModalOpen] = useState(false);
  const [applySuggestionFor, setApplySuggestionFor] = useState(null);
  const [activatedAutomationId, setActivatedAutomationId] = useState(null);

  function parseRoute(str) {
    const parts = str.split(":");
    return { path: parts[0], id: parts[1] || null, sub: parts[2] || null, extra: parts[3] || null };
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
    window.localStorage.setItem("v2-onboarded", "1");
  };
  const reopenOnboarding = () => {
    setShowOnboarding(true);
    window.localStorage.removeItem("v2-onboarded");
  };

  // Batch goal creation used by the first-run wizard
  const saveBatchGoals = ({ company, goals: drafts }) => {
    const created = drafts.map((d, i) => ({
      id: `goal-${Date.now()}-${i}`,
      name: d.name,
      description: d.description,
      audience: d.audience,
      owner: "Amisha Sharma",
      state: "draft",
      target: {
        value: Number(d.target.value) || 0,
        unit: d.target.unit,
        direction: d.target.direction,
        window: d.target.window,
      },
      progress: 0,
      deltaPct: 0,
      trend: "flat",
      points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      topics: d.topics
        .map((tid) => window.MOCK.TOPICS.find((x) => x.id === tid)?.label)
        .filter(Boolean),
      coverage: { topics: `${d.topics.length} of 5`, volume: ",", deflectable: 0 },
      attached: {
        automations: [],
        monitors: [],
        humanWorkflows: [],
        blocks: { procedures: 0, kb: 0, tools: 0, guardrails: 0 },
      },
      activity: [{ when: "just now", what: "Goal created from first-run setup" }],
    }));
    setGoals([...created, ...goals]);
    if (company) {
      setCompanyProfileSet(true);
      window.localStorage.setItem("v2-company-set", "1");
    }
    return created.map((g) => g.id);
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
      topics: data.topics.map((id) => window.MOCK.TOPICS.find((x) => x.id === id)?.label).filter(Boolean),
      coverage: { topics: `${data.topics.length} of 5`, volume: ",", deflectable: 0 },
      attached: {
        automations: [],
        // Per M1 canonical doc: creating a goal does NOT auto-generate a monitor.
        // Goals can be linked to existing monitors after creation.
        monitors: [],
        humanWorkflows: [],
        blocks: { procedures: 0, kb: 0, tools: 0, guardrails: 0 },
      },
      activity: [
        { when: "just now", what: "Goal created" },
      ],
    };
    setGoals([newGoal, ...goals]);
    if (data.company) {
      setCompanyProfileSet(true);
      window.localStorage.setItem("v2-company-set", "1");
    }
    setCreateGoalOpen(false);
    navigate(`goal:${id}`);
  };

  const handleApplySuggestion = (suggestion) => {
    setApplySuggestionFor(null);
    setActivatedAutomationId("__suggestion_applied");
  };

  const startNewAutomation = (preset = {}) => {
    // Always create a fresh blank automation when triggered, drafts are
    // managed by the user via the inline rename + draft state on Build.
    const id = `auto-${Date.now()}`;
    const newAuto = {
      id,
      name: preset.name || "Untitled automation",
      audience: preset.audience || null,
      version: "draft",
      status: "draft",
      type: "Conversational",
      drives: preset.drives || [],
      modified: "just now",
      modifiedBy: "Amisha",
      topics: preset.topics || [],
      attachedBlocks: { procedures: 0, kb: 0, tools: 0, guardrails: 0 },
      lastEval: null,
      firstRunMode: true,
    };
    setAutomations([newAuto, ...automations]);
    navigate(`automation:${id}:build`);
  };

  const renameAutomation = (id, name) => {
    setAutomations(automations.map((a) => a.id === id ? { ...a, name } : a));
  };

  const cloneAutomation = (source) => {
    const id = `auto-${Date.now()}`;
    const cloned = {
      ...source,
      id,
      name: `${source.name} (copy)`,
      version: "draft",
      status: "draft",
      modified: "just now",
      modifiedBy: "Amisha",
      lastEval: null,
      firstRunMode: true,
    };
    setAutomations([cloned, ...automations]);
    navigate(`automation:${id}:build`);
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
  if (route.path === "firstrun") {
    main = (
      <FirstRunWizard
        navigate={navigate}
        onSaveBatch={saveBatchGoals}
        onOpenCustomSlideout={() => { setPrefillGoal(null); setCreateGoalOpen(true); }}
        initialStep={Number(route.id) || 1}
      />
    );
  } else if (route.path === "goals") {
    main = <GoalsHome
      goals={goals}
      navigate={navigate}
      onNewGoal={() => { setPrefillGoal(null); setCreateGoalOpen(true); }}
      onUseTemplate={(tpl) => { setPrefillGoal(tpl); setCreateGoalOpen(true); }}
      onStartFirstRun={() => navigate("firstrun")}
      showAnswers={t.showAnswers}
      onCreateAutomation={(preset) => startNewAutomation({ ...preset, force: true })}
    />;
  } else if (route.path === "goal") {
    const g = goals.find((x) => x.id === route.id);
    if (g) main = <GoalDetail goal={g} navigate={navigate} onApplySuggestion={setApplySuggestionFor} showAnswers={t.showAnswers} onAttachAutomation={(chosenName) => startNewAutomation({ name: (chosenName || "").trim() || undefined, audience: g.audience === "AIR" ? "AIR" : "AIC", drives: [g.name], topics: g.topics, force: true })} />;
    else main = <NotFound navigate={navigate} thing="Goal" />;
  } else if (route.path === "automations") {
    main = <AutomationsList automations={automations} navigate={navigate} onNewAutomation={() => setNewAutoModalOpen(true)} onUseTemplate={(tpl) => startNewAutomation({ audience: tpl.audience, name: tpl.name, drives: tpl.drives, force: true })} onCloneAutomation={cloneAutomation} showAnswers={t.showAnswers} />;
  } else if (route.path === "air-automations") {
    main = <AutomationsList automations={automations} navigate={navigate} onNewAutomation={() => startNewAutomation({ audience: "AIR", force: true })} onUseTemplate={(tpl) => startNewAutomation({ audience: tpl.audience, name: tpl.name, drives: tpl.drives, force: true })} onCloneAutomation={cloneAutomation} showAnswers={t.showAnswers} sectionLabel="Rep AI" initialAudience="AIR" />;
  } else if (route.path === "automation") {
    if (!automation) main = <NotFound navigate={navigate} thing="Automation" />;
    else {
      const tab = route.sub || "analyze";
      const next = { build: "test", test: "deploy", deploy: "analyze" }[tab];
      const body =
        tab === "build" ? <BuildScreen automation={automation} navigate={navigate} onAdvance={() => advanceFirstRun(next)} goals={goals} onAttachGoal={(goalName) => {
          setAutomations(automations.map(a => a.id === automation.id ? { ...a, drives: [goalName] } : a));
        }} onSetAudience={(aud) => {
          setAutomations(automations.map(a => a.id === automation.id ? { ...a, audience: aud } : a));
        }} /> :
        tab === "test" ? <TestScreen automation={automation} navigate={navigate} onAdvance={() => advanceFirstRun(next)} resultsView={route.extra === "results"} detailId={route.extra && route.extra !== "results" ? route.extra : null} /> :
        tab === "deploy" ? <DeployScreen automation={automation} navigate={navigate} onActivate={activateAutomation} flags={t} /> :
        tab === "analyze" ? <AnalyzeScreen automation={automation} navigate={navigate} onApplySuggestion={setApplySuggestionFor} /> :
        tab === "settings" ? <AutomationSettings automation={automation} navigate={navigate} /> :
        null;

      const wantsRail = tab === "build" || tab === "test";
      main = <AutomationShell automation={automation} tab={tab} navigate={navigate} rightRail={wantsRail} showAnswers={t.showAnswers} onRenameAutomation={(name) => renameAutomation(automation.id, name)}>{body}</AutomationShell>;
    }
  } else if (route.path === "performance") {
    main = <PerformanceScreen navigate={navigate} onApplySuggestion={setApplySuggestionFor} showAnswers={t.showAnswers} />;
  } else if (route.path === "blocks") {
    main = <BlocksOverview navigate={navigate} />;
  } else if (route.path === "blocks-procedures") {
    main = <BlocksProcedures navigate={navigate} />;
  } else if (route.path === "blocks-knowledge") {
    main = <BlocksKnowledge navigate={navigate} />;
  } else if (route.path === "blocks-tools") {
    main = <BlocksTools navigate={navigate} />;
  } else if (route.path === "blocks-guardrails") {
    main = <BlocksGuardrails navigate={navigate} />;
  } else if (route.path === "blocks-scenarios") {
    main = <BlocksScenarios navigate={navigate} />;
  } else {
    main = <SimpleStub path={route.path} navigate={navigate} />;
  }

  // Compute whether the AI section panel should be visible.
  // The panel shows for any AI-section route; clicking a non-AI item in the
  // mini rail navigates away from these routes, so the panel collapses.
  const aiRoutes = new Set([
    "automations", "automation",
    "aic-settings", "air-settings", "air-automations",
    "blocks", "blocks-procedures", "blocks-knowledge", "blocks-tools", "blocks-guardrails", "blocks-scenarios",
    "connections",
  ]);
  const inAISection = aiRoutes.has(route.path);

  return (
    <div className={`app ${inAISection ? "" : "rail-collapsed"}`}>
      <RailMini route={route} navigate={navigate} />
      {inAISection && (
        <Rail route={route} navigate={navigate} automations={automations} suggestionsCount={window.MOCK.SUGGESTIONS.length} onNewAutomation={() => setNewAutoModalOpen(true)} onOpenPrimer={reopenOnboarding} />
      )}
      <div className="work">{main}</div>

      <OnboardingModal open={showOnboarding} onClose={dismissOnboarding} navigate={navigate} />
      <NewAutomationModal
        open={newAutoModalOpen}
        onClose={() => setNewAutoModalOpen(false)}
        onChoose={(audience) => { setNewAutoModalOpen(false); startNewAutomation({ audience, force: true }); }}
      />
      <CreateGoalSlideout
        open={createGoalOpen}
        onClose={() => { setCreateGoalOpen(false); setPrefillGoal(null); }}
        onSave={saveNewGoal}
        companyProfileSet={companyProfileSet}
        prefill={prefillGoal}
        existingGoals={goals}
      />
      <ApplySuggestionSlideout
        open={Boolean(applySuggestionFor)}
        suggestion={applySuggestionFor}
        onClose={() => setApplySuggestionFor(null)}
        onApply={handleApplySuggestion}
        flags={t}
      />

      {activatedAutomationId && (
        <ActivationToast
          kind={activatedAutomationId === "__suggestion_applied" ? "suggestion" : "automation"}
          onClose={() => setActivatedAutomationId(null)}
        />
      )}

      <TweaksPanel>
        <TweakSection label="Display" />
        <TweakToggle label='Show "Answers" subhead' value={t.showAnswers} onChange={(v) => setTweak("showAnswers", v)} />
        <TweakSection label="Demo state" />
        <TweakToggle
          label="Goals, empty state"
          value={t.emptyGoals}
          onChange={(v) => setTweak("emptyGoals", v)}
        />
        <TweakToggle
          label="Automations, empty state"
          value={t.emptyAutomations}
          onChange={(v) => setTweak("emptyAutomations", v)}
        />
        <TweakToggle
          label='"Product Questions" in first-run'
          value={t.firstRunMode}
          onChange={(v) => setTweak("firstRunMode", v)}
        />
        <TweakSection label="Designer notes" />
        <DesignerNotesTweaks
          show={showNotes}
          onToggle={setShowNotes}
          notes={dn.notes}
          screen={route.path}
          deleteNote={dn.deleteNote}
          resetNotes={dn.resetNotes}
        />
      </TweaksPanel>
      <DesignerNotesLayer
        show={showNotes}
        screen={route.path}
        notes={dn.notes}
        addNote={dn.addNote}
        updateNote={dn.updateNote}
        deleteNote={dn.deleteNote}
      />
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
    "aic-settings": "Customer AI, Settings",
    "air-settings": "Rep AI, Settings",
    "air-automations": "Rep AI, Copilot Modes",
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
          <Icon name="info" size={16} />
          <div style={{ marginTop: 6 }}>
            This destination is stubbed in the prototype.<br />
            The deep paths are <b>Goals → Goal Detail → Automation Build / Test / Deploy / Analyze</b>, plus <b>Performance</b> and <b>Building Blocks</b>.
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={() => navigate("goals")}>← Back to Goals</button>
          </div>
        </div>
      </div>
    </>
  );
};

const AutomationSettings = ({ automation, navigate }) => (
  <>
    <div className="card-row" style={{ marginBottom: 14 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Settings</h2>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--ink-50)" }}>
          Per-automation knobs that don't change between Build / Test / Deploy.
        </p>
      </div>
    </div>
    <div className="guidance-section">
      <div className="guidance-section-head">
        <h3><Icon name="tag" size={13} /> Display</h3>
      </div>
      <div className="field">
        <div className="field-label">Display name</div>
        <input className="text" defaultValue={automation.name} />
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <div className="field-label">Internal description</div>
        <textarea className="text" rows="2" defaultValue="Handles standard refunds, returns, and damage reports for retail orders. Owns the AI-side of refund-tickets goal."></textarea>
      </div>
    </div>
    <div className="guidance-section">
      <div className="guidance-section-head">
        <h3><Icon name="shield" size={13} /> Per-automation guardrails</h3>
        <div className="meta">Competitors, secrets, tone enforcement for this automation only</div>
      </div>
      <div className="tone-row">
        <span className="chip">Competitors: 4 names</span>
        <span className="chip">Secrets: API tokens, internal SKUs</span>
        <span className="chip">Tone: Friendly · open with acknowledgment</span>
        <button className="tone-pill"><Icon name="plus" size={11} /> Add</button>
      </div>
      <div className="field-hint" style={{ marginTop: 10 }}>
        <Icon name="info" size={12} style={{ verticalAlign: "middle" }} /> Shared guardrails (refund ceilings, PII rules) live in <a style={{ color: "var(--ink-100)", borderBottom: "1px solid var(--ink-30)", cursor: "pointer" }} onClick={() => navigate("blocks-guardrails")}>Building Blocks → Shared Guardrails</a>.
      </div>
    </div>
    <div className="guidance-section">
      <div className="guidance-section-head">
        <h3><Icon name="user" size={13} /> Verification</h3>
        <div className="meta">How AI confirms customer identity before sensitive actions</div>
      </div>
      <div className="tone-row">
        <button className="tone-pill active">Order email + zip</button>
        <button className="tone-pill">SMS OTP</button>
        <button className="tone-pill">Loyalty number</button>
      </div>
    </div>
    <div className="guidance-section">
      <div className="guidance-section-head">
        <h3><Icon name="clock" size={13} /> Business hours · Fallback</h3>
      </div>
      <div className="split-equal">
        <div>
          <div className="field-label">Business hours</div>
          <input className="text" defaultValue="Mon–Fri 6am–8pm PT · Sat 8am–4pm" />
        </div>
        <div>
          <div className="field-label">Outside-hours behavior</div>
          <select className="text">
            <option>Handle, mark for human review at start of day</option>
            <option>Hold and respond at open</option>
            <option>Reply with hours notice</option>
          </select>
        </div>
      </div>
    </div>
  </>
);

const ActivationToast = ({ kind, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast">
      <span className="ico-wrap"><Icon name="check" size={11} /></span>
      <div>
        {kind === "suggestion" ? (
          <>
            <b>Suggestion applied</b>
            <small>Procedure updated. A new draft version was saved to version history.</small>
          </>
        ) : (
          <>
            <b>You're live</b>
            <small>The automation is now handling matched conversations.</small>
          </>
        )}
      </div>
      <button onClick={onClose}><Icon name="x" size={12} /></button>
    </div>
  );
};

Object.assign(window, { App, NotFound, SimpleStub, AutomationSettings, ActivationToast });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
