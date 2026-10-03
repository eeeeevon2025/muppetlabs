// ============================================================
// Goals screens — home (with outcome summary) + detail page
// ============================================================

const GoalsHome = ({ goals, navigate, onNewGoal }) => {
  const [audience, setAudience] = useState("all");
  const [state, setState] = useState("all");

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
        crumbs={[{ label: "Goals" }]}
        title="Goals"
        answers={'"Did we hit the outcomes we declared?"'}
        actions={
          <>
            <button className="btn"><Icon name="book" size={14} /> Browse templates</button>
            <button className="btn brand" onClick={onNewGoal}>
              <Icon name="plus" size={14} /> Create goal
            </button>
          </>
        }
      />
      <div className="page-body">
        {/* Outcome summary header */}
        <div className="summary-row">
          <div className="summary-tile success">
            <div className="label">On track</div>
            <div className="value">{counts.onTrack}</div>
            <div className="sub">of {counts.total} goals</div>
          </div>
          <div className="summary-tile attention">
            <div className="label">Needs attention</div>
            <div className="value">{counts.atRisk}</div>
            <div className="sub">trending against target</div>
          </div>
          <div className="summary-tile">
            <div className="label">In testing</div>
            <div className="value">{goals.filter((g) => g.state === "testing").length}</div>
            <div className="sub">not yet live</div>
          </div>
          <div className="summary-tile">
            <div className="label">Avg deflectable</div>
            <div className="value">62%</div>
            <div className="sub">across all goals</div>
          </div>
        </div>

        {/* Filters */}
        <Toolbar>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-90)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Audience</span>
          <AudienceFilter value={audience} onChange={setAudience} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-90)", letterSpacing: "0.05em", textTransform: "uppercase", marginLeft: 14 }}>State</span>
          {window.MOCK.STATES.map((s) => (
            <Facet key={s.id} active={state === s.id} onClick={() => setState(s.id)}>
              {s.label}
            </Facet>
          ))}
        </Toolbar>

        {/* Goal cards */}
        <div className="goal-grid">
          {filtered.map((g) => (
            <GoalCard key={g.id} goal={g} onClick={() => navigate(`goal:${g.id}`)} />
          ))}
        </div>
      </div>
    </>
  );
};

const GoalCard = ({ goal, onClick }) => {
  const trendCls = goal.trend === "up" ? "up" : goal.trend === "down" ? "down" : "flat";
  const deltaBad = (goal.target.direction === "decrease" && goal.deltaPct > 0) || (goal.target.direction === "increase" && goal.deltaPct < 0);
  return (
    <div className="goal-card" onClick={onClick}>
      <div className="goal-card-head">
        <h4>{goal.name}</h4>
        <AudienceChip audience={goal.audience} />
      </div>
      <div className="goal-card-meta">
        <StatusPill status={goal.state} />
        <span>{goal.owner}</span>
      </div>
      <div className={`goal-card-spark ${trendCls}`}>
        <Sparkline points={goal.points} height={44} />
      </div>
      <div className="goal-card-foot">
        <span className="goal-card-progress">
          {goal.target.direction === "decrease" ? "" : ""}{goal.deltaPct > 0 && goal.target.direction === "increase" ? "+" : ""}{goal.deltaPct}{goal.target.unit === "%" ? "%" : ""}
          <span className={`delta ${deltaBad ? "bad" : ""}`}>{goal.target.direction === "decrease" ? "↓" : "↑"} vs target</span>
        </span>
        <span className="goal-card-target">{goal.progress}% to target</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// Goal detail page
// ---------------------------------------------------------------
const GoalDetail = ({ goal, navigate, onApplySuggestion }) => {
  const targetDisplay =
    goal.target.direction === "decrease"
      ? `-${Math.abs(goal.target.value)}${goal.target.unit}`
      : `+${goal.target.value}${goal.target.unit}`;

  const deltaCls = ((goal.target.direction === "decrease" && goal.deltaPct < 0) || (goal.target.direction === "increase" && goal.deltaPct > 0)) ? "var(--green-70)" : "oklch(0.55 0.22 25)";

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Goals", onClick: () => navigate("goals") }, { label: goal.name }]}
        title={goal.name}
        answers={'"How is THIS goal doing?"'}
        actions={
          <>
            <button className="btn"><Icon name="edit" size={14} /> Edit goal</button>
            <button className="btn primary"><Icon name="plus" size={14} /> Attach AI automation</button>
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

        {/* Topic chips */}
        <div className="topic-strip">
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-90)", letterSpacing: "0.05em", textTransform: "uppercase", marginRight: 6 }}>Topics</span>
          {goal.topics.map((t) => <span className="topic-chip" key={t}>{t}</span>)}
          <span className="chip">Coverage: {goal.coverage.topics} topics · {goal.coverage.volume} of 90d volume</span>
          {goal.coverage.deflectable > 0 && <span className="chip green">{goal.coverage.deflectable}% AI-deflectable</span>}
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
            <div className="value">{goal.progress}<span style={{ fontSize: 18, color: "var(--gray-90)" }}>%</span></div>
            <div className="row">
              <div style={{ fontSize: 12.5, color: "var(--gray-95)" }}>Δ vs 30d ago</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: deltaCls }}>
                {goal.deltaPct > 0 ? "+" : ""}{goal.deltaPct}{goal.target.unit === "%" ? "%" : ""}
              </div>
            </div>
            <div className="progress"><div style={{ width: `${goal.progress}%` }}></div></div>
            <div className="row" style={{ fontSize: 11.5, color: "var(--gray-90)" }}>
              <div>Target {targetDisplay}</div>
              <div>over {goal.target.window}</div>
            </div>
          </div>
        </div>

        {/* Attached resources */}
        <div className="section-head">
          <h3>Attached resources</h3>
          <div className="head-actions">
            <button className="btn sm"><Icon name="plus" size={12} /> Attach</button>
          </div>
        </div>
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
          {goal.attached.monitors.map((m) => (
            <div key={m.name} className="attached-card" onClick={() => navigate("performance")}>
              <div className="type">Monitor</div>
              <div className="name">{m.name}</div>
              <div className="meta"><StatusPill status={m.status} /> · Pass rate {Math.round(m.score * 100)}%</div>
            </div>
          ))}
          {goal.attached.humanWorkflows.map((w) => (
            <div key={w.name} className="attached-card">
              <div className="type">Human workflow</div>
              <div className="name">{w.name}</div>
              <div className="meta">For edge cases routed off the AI</div>
            </div>
          ))}
          <div className="attached-card" onClick={() => navigate("blocks-procedures")}>
            <div className="type">Building blocks</div>
            <div className="name">
              {goal.attached.blocks.procedures} procedure{goal.attached.blocks.procedures !== 1 && "s"},
              {" "}{goal.attached.blocks.kb} KB,
              {" "}{goal.attached.blocks.tools} tool{goal.attached.blocks.tools !== 1 && "s"}
            </div>
            <div className="meta">Reusable across automations</div>
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
                <div key={i} style={{ display: "flex", padding: "10px 18px", borderBottom: i < goal.activity.length - 1 ? "1px solid var(--gray-25)" : "none", fontSize: 13, gap: 14 }}>
                  <span style={{ fontSize: 11.5, color: "var(--gray-90)", fontVariantNumeric: "tabular-nums", flex: "0 0 80px" }}>{a.when}</span>
                  <span style={{ color: "var(--gray-115)" }}>{a.what}</span>
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
                <button className="btn sm ghost" onClick={() => navigate("performance")}>See all →</button>
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
// Suggestion card — used on Goal detail + Performance > Suggestions
// ---------------------------------------------------------------
const SuggestionCard = ({ suggestion, onEdit, onDismiss }) => {
  const s = suggestion;
  const targetVerb = { procedure: "Edit Procedure", kb: "Edit KB Article", tool: "Edit Tool", guardrail: "Edit Guardrail", monitor: "Edit Monitor", tone: "Edit Tone Guidance" }[s.target.type] || "Apply";
  return (
    <div className="suggestion-card">
      <div className="suggestion-head">
        <div style={{ flex: 1 }}>
          <div className="suggestion-source">{s.source} · <span style={{ textTransform: "uppercase", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>{s.status === "draft" ? "Draft — pending your review" : s.status}</span></div>
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

Object.assign(window, { GoalsHome, GoalDetail, GoalCard, SuggestionCard });
