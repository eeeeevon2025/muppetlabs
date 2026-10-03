// ============================================================
// Goals screens, home (with outcome summary) + detail page
// ============================================================

const GoalsHome = ({ goals, navigate, onNewGoal, onUseTemplate, onStartFirstRun, showAnswers, onCreateAutomation }) => {
  const [audience, setAudience] = useState("all");
  const [state, setState] = useState("all");

  const isEmpty = goals.length === 0;

  const filtered = goals.filter((g) => {
    if (audience !== "all" && !(g.audience === audience || g.audience === `${audience}+AIR` || g.audience === `AIC+${audience}`)) return false;
    if (state !== "all" && g.state !== state) return false;
    return true;
  });

  const counts = {
    onTrack: goals.filter((g) => g.deltaPct > 0 || (g.target.direction === "decrease" && g.deltaPct < 0)).length,
    atRisk: goals.filter((g) => g.state === "attention").length,
    draft: goals.filter((g) => g.state === "draft").length,
    total: goals.length,
  };

  return (
    <>
      <PageHeader
        title="Goals"
        answers={isEmpty ? "A goal is a measurable result you want, like fewer refunds or higher CSAT. You set the goal; AI automations do the work to reach it." : "A goal is a measurable result you want. Each one is driven by AI automations and tracked by monitors."}
        showAnswers={showAnswers}
        actions={
          <>
            <button className="btn"><Icon name="book" size={13} /> Templates</button>
            <button className="btn brand" onClick={onNewGoal}>
              <Icon name="plus" size={13} /> Create goal
            </button>
          </>
        }
      />
      <div className="page-body">
        {/* Outcome summary header, only shown when populated */}
        {!isEmpty && (
          <div className="summary-row">
            <div className="summary-tile success">
              <div className="label"><Icon name="check" size={11} /> On track</div>
              <div className="value">{counts.onTrack}<span className="unit">/ {counts.total}</span></div>
              <div className="sub">goals trending to target</div>
            </div>
            <div className="summary-tile attention">
              <div className="label"><Icon name="warning" size={11} /> Needs attention</div>
              <div className="value">{counts.atRisk}</div>
              <div className="sub">trending against target</div>
            </div>
            <div className="summary-tile">
              <div className="label"><Icon name="clock" size={11} /> In testing</div>
              <div className="value">{goals.filter((g) => g.state === "testing").length}</div>
              <div className="sub">not yet live</div>
            </div>
            <div className="summary-tile">
              <div className="label"><Icon name="sparkles" size={11} /> AI deflectable</div>
              <div className="value">62<span className="unit">%</span></div>
              <div className="sub">avg across all goals</div>
            </div>
          </div>
        )}

        {isEmpty ? (
          <GoalsEmpty onNewGoal={onNewGoal} onUseTemplate={onUseTemplate} onStartFirstRun={onStartFirstRun} />
        ) : (
          <>
            {/* Filters */}
            <Toolbar>
              <AudienceFilter value={audience} onChange={setAudience} />
              <span className="toolbar-label" style={{ marginLeft: 12 }}>State</span>
              {window.MOCK.STATES.map((s) => (
                <Facet key={s.id} active={state === s.id} onClick={() => setState(s.id)}>
                  {s.label}
                </Facet>
              ))}
            </Toolbar>

            {/* Goal cards */}
            <div className="goal-grid">
              {filtered.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onClick={() => navigate(`goal:${g.id}`)}
                  navigate={navigate}
                  onCreateAutomation={onCreateAutomation}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <GoalsAssistant onNewGoal={onNewGoal} navigate={navigate} goals={goals} />
    </>
  );
};

// ---------------------------------------------------------------
// Goals assistant — floating helper on the Goals home. Answers
// goal questions and can kick off goal creation.
// ---------------------------------------------------------------
const GoalsAssistant = ({ onNewGoal, navigate, goals = [] }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { who: "ai", text: "Hi — I can help with your goals. Ask which ones need attention, how they're tracking, or have me suggest a new one." },
  ]);
  const [draft, setDraft] = useState("");

  const respond = (msg) => {
    const t = msg.toLowerCase();
    if (t.includes("attention") || t.includes("risk")) return "Save at-risk renewals 80% is trending against target — its monitor (Save attempts) sits at 41% vs a 60% target. Open it to see the suggestions?";
    if (t.includes("suggest") || t.includes("new") || t.includes("create")) return "Based on your last 90 days, 'Reduce refund tickets by 20%' is your biggest opportunity — Returns & refunds is 27% of volume. Hit 'Create a goal' below and I'll pre-fill it.";
    if (t.includes("doing") || t.includes("track") || t.includes("how")) return "Most goals are trending to target. Order-tracking deflection is your strongest mover; renewal saves is the one to watch.";
    return "I can flag goals that need attention, summarize how they're tracking, or suggest a new goal. Which would help?";
  };
  const send = (text) => {
    if (!text.trim()) return;
    setOpen(true);
    setMessages((m) => [...m, { who: "you", text }]);
    setDraft("");
    setTimeout(() => setMessages((m) => [...m, { who: "ai", text: respond(text) }]), 500);
  };

  return (
    <div className="goals-assistant">
      {open && (
        <div className="goals-assistant-panel">
          <div className="goals-assistant-head">
            <span className="goals-assistant-title">
              <span className="goals-assistant-ico"><Icon name="sparkles" size={12} /></span> Goals assistant
            </span>
            <button className="goals-assistant-x" onClick={() => setOpen(false)} aria-label="Close"><Icon name="x" size={13} /></button>
          </div>
          <div className="goals-assistant-msgs">
            {messages.map((m, i) => (
              <div key={i} className={`assistant-msg ${m.who === "you" ? "you" : ""}`}>{m.text}</div>
            ))}
          </div>
          <div className="goals-assistant-prompts">
            {["Which goals need attention?", "How are my goals doing?", "Suggest a new goal"].map((p) => (
              <button key={p} className="assistant-prompt-chip" onClick={() => send(p)}>{p}</button>
            ))}
            <button className="assistant-prompt-chip" onClick={onNewGoal}><Icon name="plus" size={10} /> Create a goal</button>
          </div>
          <div className="goals-assistant-input">
            <input
              type="text"
              placeholder="Ask about your goals…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(draft)}
            />
            <button className="btn primary sm" onClick={() => send(draft)}><Icon name="send" size={12} /></button>
          </div>
        </div>
      )}
      <button className={`goals-assistant-fab ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)}>
        <Icon name={open ? "chevDown" : "sparkles"} size={16} />
        {!open && <span>Ask the assistant</span>}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------
// Empty state, no goals declared yet
// ---------------------------------------------------------------
const GOAL_TEMPLATES = [
  {
    id: "tpl-refund",
    name: "Reduce refund tickets by 20%",
    description: "Cut refund-related ticket volume across all channels.",
    audience: "AIC",
    accent: "amber",
    target: { value: 20, direction: "decrease", unit: "%", window: "90 days" },
    topics: ["returns", "refund-order"],
    why: "Returns + Refund order are 27% of your last 90d volume.",
    coverage: { topics: 2, volumePct: 27, deflectable: 78 },
    points: [62, 58, 60, 55, 52, 48, 46, 44, 42, 40, 38, 36],
  },
  {
    id: "tpl-tracking",
    name: "Auto-resolve order tracking",
    description: "Fully deflect routine \"where is my order?\" questions.",
    audience: "AIC",
    accent: "blue",
    target: { value: 50, direction: "decrease", unit: "%", window: "60 days" },
    topics: ["tracking", "shipping"],
    why: "Order tracking is your highest-volume topic, 24% of tickets.",
    coverage: { topics: 2, volumePct: 32, deflectable: 91 },
    points: [50, 48, 46, 44, 42, 40, 36, 33, 28, 26, 24, 22],
  },
  {
    id: "tpl-csat",
    name: "Improve CSAT to 4.6",
    description: "Lift average customer satisfaction on rep-assisted conversations.",
    audience: "AIR",
    accent: "violet",
    target: { value: 4.6, direction: "increase", unit: "score", window: "90 days" },
    topics: ["product", "account"],
    why: "Product + Account & login is where reps spend the most handle time.",
    coverage: { topics: 2, volumePct: 21, deflectable: 42 },
    points: [40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45, 46],
  },
];

const GoalsEmpty = ({ onNewGoal, onUseTemplate, onStartFirstRun }) => (
  <div className="goals-empty-v2">
    {/* Hero, one strong moment */}
    <div className="ge-hero">
      <div className="ge-hero-glow"></div>
      <div className="ge-hero-stage">
        <div className="ge-hero-copy">
          <span className="ge-hero-eyebrow">
            <span className="ge-hero-eyebrow-dot"></span>
            Goals-first · Acme Outdoors
          </span>
          <h2>
            Define the outcome,<br />
            the AI drives it.
          </h2>
          <p>
            Goals are the spine. Every automation, monitor, and improvement
            traces back to one. With a goal declared, the AI compounds toward
            something you can measure. Without one, it's just answering tickets.
          </p>
          <div className="ge-hero-cta">
            <button className="btn brand" onClick={onStartFirstRun}>
              <Icon name="sparkles" size={13} /> Set up your first goal
            </button>
          </div>
          <div className="ge-hero-meta">
            <Icon name="clock" size={11} /> ~6 minutes · pre-filled from your last 90 days
          </div>
        </div>

        {/* Visual loop, three nodes connected by directional links */}
        <div className="ge-hero-loop" aria-hidden="true">
          <div className="ge-loop-node n1">
            <div className="ge-loop-node-mark"><Icon name="target" size={14} /></div>
            <div className="ge-loop-node-num">01</div>
            <div className="ge-loop-node-title">Declare</div>
            <div className="ge-loop-node-sub">"Reduce refunds 20%"</div>
            <div className="ge-loop-node-spark">
              <Sparkline points={[50, 48, 46, 43, 40, 38, 36]} height={26} />
            </div>
          </div>
          <div className="ge-loop-link">
            <svg viewBox="0 0 60 8" preserveAspectRatio="none" width="100%" height="8">
              <path d="M0,4 L52,4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
              <path d="M48,1 L52,4 L48,7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div className="ge-loop-node n2">
            <div className="ge-loop-node-mark"><Icon name="bolt" size={14} /></div>
            <div className="ge-loop-node-num">02</div>
            <div className="ge-loop-node-title">Attach AI</div>
            <div className="ge-loop-node-sub">Automations + copilots</div>
            <div className="ge-loop-node-chips">
              <span className="ge-loop-chip">AIC</span>
              <span className="ge-loop-chip">AIR</span>
            </div>
          </div>
          <div className="ge-loop-link">
            <svg viewBox="0 0 60 8" preserveAspectRatio="none" width="100%" height="8">
              <path d="M0,4 L52,4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
              <path d="M48,1 L52,4 L48,7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div className="ge-loop-node n3">
            <div className="ge-loop-node-mark"><Icon name="activity" size={14} /></div>
            <div className="ge-loop-node-num">03</div>
            <div className="ge-loop-node-title">Tune</div>
            <div className="ge-loop-node-sub">Monitors → suggestions</div>
            <div className="ge-loop-node-tag">
              <Icon name="sparkles" size={10} /> +3 suggestions ready
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Suggested templates */}
    <div className="ge-section-head">
      <div>
        <h3>Suggested from your last 90 days</h3>
        <p>Each picks up where your volume is heaviest. Open one, tweak the target, save, that's it.</p>
      </div>
      <span className="ge-suggested-meta">
        <Icon name="sparkles" size={11} /> Drafted from <b>Acme Outdoors</b> · 12,847 conversations
      </span>
    </div>
    <div className="ge-templates">
      {GOAL_TEMPLATES.map((tpl) => (
        <button key={tpl.id} className={`ge-template accent-${tpl.accent}`} onClick={() => onUseTemplate(tpl)}>
          <div className="ge-tpl-accent"></div>
          <div className="ge-tpl-head">
            <span className="ge-tpl-audience">{tpl.audience === "AIC" ? "Customer AI" : "Rep AI"}</span>
            <span className="ge-tpl-target">
              {tpl.target.direction === "decrease" ? "↓" : "↑"}
              {" "}
              {tpl.target.value}{tpl.target.unit === "%" ? "%" : tpl.target.unit === "score" ? "pt" : ""}
              <span className="ge-tpl-target-window">in {tpl.target.window}</span>
            </span>
          </div>
          <h4>{tpl.name}</h4>
          <p>{tpl.description}</p>
          <div className="ge-tpl-spark">
            <Sparkline points={tpl.points} height={42} />
            <div className="ge-tpl-spark-end">target</div>
          </div>
          <div className="ge-tpl-stats">
            <div className="ge-tpl-stat">
              <div className="ge-tpl-stat-val">{tpl.coverage.volumePct}<span>%</span></div>
              <div className="ge-tpl-stat-lbl">of volume</div>
            </div>
            <div className="ge-tpl-stat">
              <div className="ge-tpl-stat-val">{tpl.coverage.topics}</div>
              <div className="ge-tpl-stat-lbl">topics</div>
            </div>
            <div className="ge-tpl-stat">
              <div className="ge-tpl-stat-val">{tpl.coverage.deflectable}<span>%</span></div>
              <div className="ge-tpl-stat-lbl">deflectable</div>
            </div>
          </div>
          <div className="ge-tpl-why">
            <Icon name="sparkles" size={11} /> {tpl.why}
          </div>
          <div className="ge-tpl-cta">
            Use this template <Icon name="chevRight" size={11} />
          </div>
        </button>
      ))}
    </div>

    {/* What goals unlock */}
    <div className="ge-section-head" style={{ marginTop: 36 }}>
      <div>
        <h3>What declaring a goal unlocks</h3>
        <p>Three platform behaviors that only work because goals are first-class.</p>
      </div>
    </div>
    <div className="ge-unlocks">
      <div className="ge-unlock">
        <div className="ge-unlock-icon outcome"><Icon name="activity" size={16} /></div>
        <div className="ge-unlock-body">
          <h4>Outcome dashboards</h4>
          <p>Trajectory, progress to target, Δ-vs-30d. Every goal shows whether the work is moving the number, not just whether the AI is on.</p>
        </div>
      </div>
      <div className="ge-unlock">
        <div className="ge-unlock-icon ai"><Icon name="bolt" size={16} /></div>
        <div className="ge-unlock-body">
          <h4>AI that drives outcomes</h4>
          <p>Each automation and copilot declares which goals it serves. Goals tell you which AI is paying for itself, and which is decorative.</p>
        </div>
      </div>
      <div className="ge-unlock">
        <div className="ge-unlock-icon tune"><Icon name="sparkles" size={16} /></div>
        <div className="ge-unlock-body">
          <h4>Improvement suggestions</h4>
          <p>Monitors watch for drift against your goal and propose changes to procedures, KB, tools, and guardrails, pre-scoped to apply in one click.</p>
        </div>
      </div>
    </div>

    {/* Quiet escape hatches */}
    <div className="ge-alt">
      <span>Or jump straight to:</span>
      <a onClick={onStartFirstRun}>Guided setup</a>
      <span className="dot"></span>
      <a onClick={onNewGoal}>Custom goal</a>
      <span className="dot"></span>
      <a onClick={onStartFirstRun}>Browse templates</a>
    </div>
  </div>
);

// Per-goal suggested automations, keyword-driven for the demo so any newly
// created goal still surfaces relevant suggestions.
const suggestedAutomationsForGoal = (goal) => {
  const name = (goal.name || "").toLowerCase();
  const topics = (goal.topics || []).join(" ").toLowerCase();
  const blob = `${name} ${topics}`;
  const sug = [];
  if (/refund|return|damage/i.test(blob)) {
    sug.push({ id: "sug-refund", name: "Refund Order", desc: "Process eligible refunds end-to-end; escalate damaged items.", audience: "AIC", icon: "rotate", est: "45 min build" });
    sug.push({ id: "sug-damage", name: "Damaged Items", desc: "Triage damage photos and route to claims, replace, or refund.", audience: "AIC", icon: "warning", est: "30 min build" });
  }
  if (/tracking|wismo|shipping|order/i.test(blob)) {
    sug.push({ id: "sug-wismo", name: "Order Tracking (WISMO)", desc: "Look up carrier status, share ETA, file lost-package claims.", audience: "AIC", icon: "activity", est: "30 min build" });
  }
  if (/csat|quality|satisfaction|rep/i.test(blob)) {
    sug.push({ id: "sug-copilot", name: "Rep Copilot, Tier 1", desc: "Suggest replies, summaries, and next steps for incoming tickets.", audience: "AIR", icon: "headset", est: "20 min build" });
    sug.push({ id: "sug-coach", name: "Coaching Mode", desc: "Real-time tone + policy adherence cues during rep replies.", audience: "AIR", icon: "sparkles", est: "25 min build" });
  }
  if (/cancel|renew|churn|save/i.test(blob)) {
    sug.push({ id: "sug-renewal", name: "Renewal Risk", desc: "Detect cancel intent and offer a save flow before processing.", audience: "AIC", icon: "bolt", est: "40 min build" });
  }
  if (/product|faq|spec|catalog/i.test(blob)) {
    sug.push({ id: "sug-product", name: "Product Questions", desc: "Match customer questions to the product spec sheet + KB.", audience: "AIC", icon: "book", est: "25 min build" });
  }
  if (/account|login|password|identity/i.test(blob)) {
    sug.push({ id: "sug-identity", name: "Identity & Account Access", desc: "Verify identity, reset credentials, route to security on flags.", audience: "AIC", icon: "shield", est: "30 min build" });
  }
  // Always include a "Start blank" fallback at the end so users have an off-ramp
  sug.push({ id: "sug-blank", name: "Start from scratch", desc: "Empty Build tab, bring your own procedures, KB, and tools.", audience: goal.audience || "AIC", icon: "plus", est: "Configure from blank", blank: true });
  // Cap to 3 unique suggestions + blank
  const out = [];
  const seen = new Set();
  for (const s of sug) { if (!seen.has(s.id) && out.length < 4) { seen.add(s.id); out.push(s); } }
  return out;
};

const GoalCard = ({ goal, onClick, navigate, onCreateAutomation }) => {
  const goingRight = (goal.target.direction === "decrease" && goal.deltaPct < 0) || (goal.target.direction === "increase" && goal.deltaPct > 0);
  const trendCls = !goingRight ? "down" : "up";
  const deltaBad = !goingRight && goal.state !== "draft" && goal.deltaPct !== 0;
  const sign = goal.deltaPct > 0 ? "+" : "";
  const unit = goal.target.unit === "%" ? "%" : goal.target.unit === "score" ? "pt" : goal.target.unit === "seconds" ? "s" : "";

  const [sugOpen, setSugOpen] = useState(false);
  const sugRef = useRef(null);
  const suggestions = suggestedAutomationsForGoal(goal);
  const automationCount = goal.attached?.automations?.length || 0;
  const monitors = goal.attached?.monitors || [];

  useEffect(() => {
    if (!sugOpen) return;
    const onDoc = (e) => { if (sugRef.current && !sugRef.current.contains(e.target)) setSugOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [sugOpen]);

  const pickSuggestion = (s, e) => {
    e?.stopPropagation();
    setSugOpen(false);
    onCreateAutomation?.({
      name: s.blank ? `${goal.name}` : s.name,
      audience: s.audience,
      drives: [goal.name],
      topics: goal.topics,
    });
  };

  return (
    <div className={`goal-card ${goal.state === "attention" ? "attention" : ""}`} onClick={onClick}>
      <div className="goal-card-head">
        <h4>{goal.name}</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {goal.isDefault && (
            <span
              className="goal-card-default-pill"
              title="Created automatically when AI was enabled. Edit or replace anytime."
            >Default</span>
          )}
          <AudienceChip audience={goal.audience} />
        </div>
      </div>
      <div className="goal-card-meta">
        <StatusPill status={goal.state} />
        <span className="dot"></span>
        <span>{goal.owner.split(" ")[0]}</span>
        <span className="dot"></span>
        <span>{goal.target.window}</span>
      </div>
      <div className="goal-card-foot">
        <div>
          <div className="goal-card-num">
            {goal.state === "draft" ? "," : (
              <>
                {goal.progress}<span className="unit">%</span>
              </>
            )}
          </div>
          <div className="goal-card-target">to target</div>
        </div>
        <div style={{ flex: 1, marginLeft: 12 }}>
          <div className={`goal-card-spark ${trendCls}`}>
            <Sparkline points={goal.points} height={38} />
          </div>
          <div className={`goal-card-delta ${deltaBad ? "bad" : ""}`} style={{ textAlign: "right" }}>
            {goal.state === "draft" ? "not started" : `${sign}${goal.deltaPct}${unit} vs 30d ago`}
          </div>
        </div>
      </div>
      <div className="goal-card-bar"><div style={{ width: `${goal.progress}%` }}></div></div>

      {/* Monitor links, empty state surfaces "Link a monitor" */}
      <div className="goal-card-monitors" onClick={(e) => e.stopPropagation()}>
        <span className="goal-card-monitors-label">
          <Icon name="activity" size={10} /> Monitor{monitors.length !== 1 ? "s" : ""}
        </span>
        {monitors.length > 0 ? (
          monitors.map((m) => (
            <a
              key={m.name}
              className={`goal-card-monitor-chip ${m.status}`}
              onClick={() => navigate?.("performance")}
              title={`Pass rate ${Math.round((m.score || 0) * 100)}%, open Performance`}
            >
              <span className={`goal-card-monitor-dot ${m.status}`}></span>
              {m.name}
            </a>
          ))
        ) : (
          <a
            className="goal-card-monitor-link"
            onClick={() => navigate?.("performance")}
            title="Open Performance to link an existing monitor"
          >
            <Icon name="plus" size={10} /> Link a monitor
          </a>
        )}
      </div>

      {/* Suggested automations, inline expansion (not popover) */}
      <div
        className={`goal-card-suggest ${automationCount === 0 ? "primary" : ""} ${sugOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="goal-card-suggest-trigger"
          onClick={(e) => { e.stopPropagation(); setSugOpen((v) => !v); }}
          aria-expanded={sugOpen}
        >
          <Icon name="sparkles" size={11} />
          <span>
            {automationCount === 0 ? (
              <>Suggested AI automations for this goal <b>· {suggestions.length - 1}</b></>
            ) : (
              <>
                {automationCount} AI automation{automationCount === 1 ? "" : "s"} driving this goal
                <span className="goal-card-suggest-sep">·</span>
                <span className="goal-card-suggest-more">Add another</span>
              </>
            )}
          </span>
          <Icon name={sugOpen ? "chevUp" : "chevDown"} size={10} />
        </button>
        {sugOpen && (
          <div className="goal-card-suggest-inline">
            <div className="goal-card-suggest-pop-list">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className={`goal-card-suggest-item ${s.blank ? "blank" : ""}`}
                  onClick={(e) => pickSuggestion(s, e)}
                >
                  <span className="goal-card-suggest-item-ico">
                    <Icon name={s.icon} size={13} />
                  </span>
                  <span className="goal-card-suggest-item-body">
                    <span className="goal-card-suggest-item-row">
                      <span className="goal-card-suggest-item-name">{s.name}</span>
                      <span className={`goal-card-suggest-item-aud ${s.audience.toLowerCase()}`}>
                        {s.audience === "AIR" ? "Rep AI" : "Customer AI"}
                      </span>
                    </span>
                    <span className="goal-card-suggest-item-desc">{s.desc}</span>
                    <span className="goal-card-suggest-item-meta">
                      <Icon name="clock" size={9} /> {s.est}
                    </span>
                  </span>
                  <Icon name="chevRight" size={10} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// Goal detail page
// ---------------------------------------------------------------
const GoalDetail = ({ goal, navigate, onApplySuggestion, showAnswers, onAttachAutomation }) => {
  const [attachOpen, setAttachOpen] = useState(false);

  // Direct attach, creates an Untitled automation with this goal pre-attached.
  // (No prefilled name; user renames inline on the automation page.)
  const directAttach = () => {
    setAttachOpen(false);
    onAttachAutomation?.(""); // empty name → automation defaults to "Untitled automation"
  };

  const targetDisplay =
    goal.target.direction === "decrease"
      ? `-${Math.abs(goal.target.value)}${goal.target.unit}`
      : `+${goal.target.value}${goal.target.unit}`;

  const deltaCls = ((goal.target.direction === "decrease" && goal.deltaPct < 0) || (goal.target.direction === "increase" && goal.deltaPct > 0)) ? "var(--good)" : "var(--bad)";

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Goals", onClick: () => navigate("goals") }, { label: goal.name }]}
        title={goal.name}
        answers={"How this goal is doing, plus the AI automations, topics, and monitors working on it."}
        showAnswers={showAnswers}
        actions={
          <>
            <button className="btn"><Icon name="edit" size={13} /> Edit</button>
            <button className="btn brand" onClick={directAttach}>
              <Icon name="plus" size={13} /> Add AI to drive this goal
            </button>
          </>
        }
      />
      <div className="page-body">
        {/* Meta row */}
        <div className="flex gap-3" style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <AudienceChip audience={goal.audience} />
          <StatusPill status={goal.state} />
          <span className="chip">Owner: {goal.owner}</span>
          <span className="chip">Target: {targetDisplay} over {goal.target.window}</span>
        </div>

        {/* Outcome / Target / Trajectory */}
        <div className="gd-head">
          <div className="gd-trajectory-card">
            <div className="row" style={{ marginBottom: 8 }}>
              <div className="title">Trajectory</div>
              <div className="flex gap-2">
                <button className="facet">7d</button>
                <button className="facet active">30d</button>
                <button className="facet">90d</button>
              </div>
            </div>
            <div className="chart" style={{ color: deltaCls }}>
              <Sparkline points={goal.points} height={120} />
            </div>
          </div>
          <div className="gd-target-card">
            <div className="title">Progress to target</div>
            <div className="value">{goal.progress}<span className="unit">%</span></div>
            <div className="row">
              <div style={{ fontSize: 11.5, color: "var(--ink-50)" }}>Δ vs 30d ago</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 500, color: deltaCls }}>
                {goal.deltaPct > 0 ? "+" : ""}{goal.deltaPct}{goal.target.unit === "%" ? "%" : ""}
              </div>
            </div>
            <div className="progress"><div style={{ width: `${goal.progress}%` }}></div></div>
            <div className="row" style={{ fontSize: 11, color: "var(--ink-50)" }}>
              <div>Target {targetDisplay}</div>
              <div>over {goal.target.window}</div>
            </div>
          </div>
        </div>

        {/* AI driving this goal */}
        <div className="section-head">
          <h3>AI driving this goal</h3>
          {goal.attached.automations.length > 0 && (
            <div className="head-actions">
              <button className="btn sm" onClick={directAttach}>
                <Icon name="plus" size={12} /> Add another
              </button>
            </div>
          )}
        </div>
        {goal.attached.automations.length === 0 ? (
          <button className="gd-attach-empty" onClick={directAttach}>
            <div className="gd-attach-empty-ico">
              <Icon name="plus" size={20} />
            </div>
            <div className="gd-attach-empty-body">
              <div className="gd-attach-empty-title">Set up AI to drive this goal</div>
              <div className="gd-attach-empty-sub">
                Add an AI automation and its trajectory starts moving. We'll draft the procedures, knowledge, and tools from the topics below for you to review.
              </div>
            </div>
            <Icon name="chevRight" size={14} />
          </button>
        ) : (
          <div className="attached-grid">
            {goal.attached.automations.map((a) => (
              <div key={a.name} className="attached-card" onClick={() => {
                const auto = window.MOCK.AUTOMATIONS.find((au) => au.name === a.name);
                if (auto) navigate(`automation:${auto.id}:analyze`);
              }}>
                <div className="type">AI automation</div>
                <div className="name">{a.name}</div>
                <div className="meta"><StatusPill status={a.status} /> · {a.version}</div>
              </div>
            ))}
          </div>
        )}

        {/* Topics this goal covers */}
        <div className="section-head" style={{ marginTop: 28 }}>
          <h3>Topics this goal covers</h3>
          <div className="head-actions">
            <a className="btn ghost sm" onClick={() => navigate("reporting")}>
              <Icon name="pieChart" size={11} /> Open Topics report
            </a>
          </div>
        </div>
        <div className="gd-topics-section">
          <p className="gd-topics-help">
            <Icon name="info" size={12} />
            <span>
              Topics are auto-detected groupings of customer conversations, like
              <em> "Refund order"</em> or <em>"Login &amp; account access"</em>. Kustomer AI
              clusters every closed conversation into a topic continuously, no manual tagging
              required. This goal tracks the topics below.
              <a onClick={(e) => { e.stopPropagation(); navigate("reporting"); }}> See the full Topics report →</a>
            </span>
          </p>
          <div className="gd-topics-chips">
            {goal.topics.map((t) => (
              <span className="gd-topic-chip" key={t}>
                <Icon name="book" size={10} /> {t}
              </span>
            ))}
          </div>
          <div className="gd-topics-coverage">
            <span className="gd-topics-coverage-item">
              <span className="label">Coverage</span>
              <span className="value">{goal.coverage.topics} topics</span>
            </span>
            <span className="gd-topics-coverage-divider"></span>
            <span className="gd-topics-coverage-item">
              <span className="label">Volume</span>
              <span className="value">{goal.coverage.volume === "," ? "" : goal.coverage.volume} of 90d</span>
            </span>
            {goal.coverage.deflectable > 0 && (
              <>
                <span className="gd-topics-coverage-divider"></span>
                <span className="gd-topics-coverage-item">
                  <span className="label">AI-deflectable</span>
                  <span className="value good">{goal.coverage.deflectable}%</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Activity */}
        {goal.activity.length > 0 && (
          <>
            <div className="section-head">
              <h3>Recent activity</h3>
            </div>
            <div className="card" style={{ padding: 0 }}>
              {goal.activity.map((a, i) => (
                <div key={i} style={{ display: "flex", padding: "10px 18px", borderBottom: i < goal.activity.length - 1 ? "1px solid var(--v2-hairline)" : "none", fontSize: 13, gap: 14 }}>
                  <span style={{ fontSize: 11.5, color: "var(--ink-50)", fontVariantNumeric: "tabular-nums", flex: "0 0 80px" }}>{a.when}</span>
                  <span style={{ color: "var(--ink-90)" }}>{a.what}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Apply-loop demo for refund goal */}
        {goal.id === "refund-20" && (
          <>
            <div className="section-head">
              <h3>Open suggestions for this goal</h3>
              <div className="head-actions">
                <button className="btn ghost sm" onClick={() => navigate("performance")}>See all <Icon name="chevRight" size={11} /></button>
              </div>
            </div>
            {window.MOCK.SUGGESTIONS.slice(0, 1).map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onEdit={() => onApplySuggestion(s)} />
            ))}
          </>
        )}
      </div>
    </>
  );
};

// ---------------------------------------------------------------
// Suggestion card, used on Goal detail + Performance > Suggestions
// ---------------------------------------------------------------
const SuggestionCard = ({ suggestion, onEdit, onDismiss }) => {
  const s = suggestion;
  const targetVerb = { procedure: "Edit Procedure", kb: "Edit KB Article", tool: "Edit Tool", guardrail: "Edit Guardrail", monitor: "Edit Monitor", tone: "Edit Tone Guidance" }[s.target.type] || "Apply";
  return (
    <div className="suggestion-card">
      <div className="suggestion-head">
        <div style={{ flex: 1 }}>
          <div className="suggestion-source">{s.source} · <span style={{ textTransform: "uppercase", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{s.status === "draft" ? "Draft, pending your review" : s.status}</span></div>
          <div className="suggestion-title">{s.title}</div>
          <div className="suggestion-meta">
            <span className="kv"><span className="k">Confidence</span><span className={`suggestion-confidence ${s.confidenceLabel.toLowerCase()}`}>{s.confidenceLabel} · {Math.round(s.confidence * 100)}%</span></span>
            <span className="kv"><span className="k">Goal</span><GoalChip name={s.goal} /></span>
          </div>
        </div>
        <div className="suggestion-detected">Detected {s.detectedAgo}</div>
      </div>

      {s.whyMatters && (
        <div className="suggestion-section">
          <h5>Why this may matter</h5>
          <p>{s.whyMatters}</p>
        </div>
      )}

      {s.patternDetected && (
        <div className="suggestion-section">
          <h5 className="ai">How this pattern was detected</h5>
          <p>{s.patternDetected}</p>
        </div>
      )}

      {s.evidence && (
        <div className="suggestion-evidence">
          <div className="saw">We saw</div>
          <div><a>{s.evidence.label}</a> failing the same way →</div>
        </div>
      )}

      {s.before && s.after && (
        <>
          <div className="suggestion-section">
            <h5>What will change</h5>
            <p>{s.title}</p>
          </div>
          <div className="diff-grid">
            <div className="diff-card before"><div className="h">Before</div>{s.before}</div>
            <div className="diff-card after"><div className="h">After</div>{s.after}</div>
          </div>
        </>
      )}

      <div className="suggestion-foot">
        <span className="saves">Saves a draft. No conversations are affected until you publish or apply it.</span>
        <div className="actions">
          <button className="btn ghost" onClick={onDismiss}><Icon name="x" size={13} /> Dismiss</button>
          <button className="btn primary" onClick={onEdit}>
            <Icon name="sparkles" size={13} /> {targetVerb}
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { GoalsHome, GoalDetail, GoalCard, SuggestionCard, GoalsEmpty });
