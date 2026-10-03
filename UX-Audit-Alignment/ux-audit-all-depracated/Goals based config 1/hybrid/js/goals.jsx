// =============================================================
// Goals area — Goals Home (list) + Goal Slide-out (the new IA spine)
// =============================================================

// ── Goals Home ──────────────────────────────────────────────
const GoalsHome = ({ goals, onOpenGoal, onStartWizard }) => {
  const [filter, setFilter] = React.useState("all");
  const [range, setRange] = React.useState("7d");

  const stats = {
    live: goals.filter(g => g.state === "live").length,
    attention: goals.filter(g => g.state === "attention").length,
    testing: goals.filter(g => g.state === "testing").length,
    draft: goals.filter(g => g.state === "draft" || g.state === "planned").length,
  };

  const filtered = goals.filter(g => {
    if (filter === "attention") return g.state === "attention";
    if (filter === "running")   return g.state === "live" || g.state === "limited";
    if (filter === "notlive")   return g.state === "draft" || g.state === "planned" || g.state === "testing";
    return true;
  });

  const QuickStat = ({ label, value, tone }) => (
    <div style={{
      background: tone === "danger" ? T.dangerBg : "#fff",
      border: `1px solid ${tone === "danger" ? "#F3C4C7" : T.rule}`,
      borderRadius: 12, padding: "14px 16px",
      display: "flex", alignItems: "baseline", gap: 10,
    }}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: T.ink, lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 12.5, color: T.ink3, fontWeight: 500 }}>{label}</div>
    </div>
  );

  const FilterChip = ({ id, label, count }) => {
    const on = filter === id;
    return (
      <button onClick={() => setFilter(id)} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 999,
        background: on ? T.ink : "#fff",
        color: on ? "#fff" : T.ink2,
        border: `1px solid ${on ? T.ink : T.rule}`,
        fontSize: "var(--text-body)", fontWeight: 600, cursor: "pointer",
        fontFamily: "var(--font-sans)",
      }}>{label}<span style={{ opacity: 0.7 }}>· {count}</span></button>
    );
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
      {/* Hero */}
      <div style={{
        padding: "32px 40px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: "var(--font-sans)", fontWeight: 700,
              fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
              letterSpacing: "-0.01em", color: T.ink, margin: 0,
            }}>Your goals</h1>
            <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "10px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
              Track how your AI is moving each outcome. Drill in to tune a goal,
              review suggestions, or set a new target.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Btn kind="secondary" icon="bookOpen">Browse templates</Btn>
            <Btn kind="ink" icon="sparkles" onClick={onStartWizard}>New goal</Btn>
          </div>
        </div>

        {/* Quick stats */}
      </div>

      {goals.length === 0 ? (
        <GoalsEmptyState onStartWizard={onStartWizard}/>
      ) : (
        <>
          {/* Filters */}
          <div style={{ padding: "18px 40px 8px", display: "flex", alignItems: "center", gap: 8 }}>
            <FilterChip id="all"       label="All"             count={goals.length}/>
            <FilterChip id="attention" label="Needs attention" count={stats.attention}/>
            <FilterChip id="running"   label="Running"         count={goals.filter(g => g.state === "live" || g.state === "limited").length}/>
            <FilterChip id="notlive"   label="Not yet live"    count={goals.filter(g => g.state === "draft" || g.state === "planned" || g.state === "testing").length}/>
            <div style={{ marginLeft: "auto" }}>
              <RangeToggle value={range} onChange={setRange}/>
            </div>
          </div>

          {/* Goal list */}
          <div style={{ padding: "10px 40px 60px", display: "grid", gap: 10 }}>
            {filtered.map(g => <GoalRow key={g.id} g={g} onClick={() => onOpenGoal(g.id)}/>)}
            <CreateGoalCard onClick={onStartWizard}/>
          </div>
        </>
      )}
    </div>
  );
};

// ── Empty state — no goals set up yet ───────────────────────
const GOAL_TEMPLATES = [
  { id: "deflect",  family: "Support efficiency",   familyColor: "#16A36B", name: "Reduce escalations",       sub: "Resolve repetitive issues before they reach a human.", icon: "shield" },
  { id: "csat",     family: "Customer experience",  familyColor: "#C28A12", name: "Improve CSAT",             sub: "Lift CSAT by reducing repeat contacts and slow replies.", icon: "checkCircle" },
  { id: "speed",    family: "Agent performance",    familyColor: "#D63A43", name: "Speed up rep responses",   sub: "Draft replies, summaries, and signals to help reps move faster.", icon: "bolt" },
  { id: "tracking", family: "Customer experience",  familyColor: "#C28A12", name: "Status & order tracking",  sub: "Look up orders, shipments, and returns end-to-end.", icon: "package" },
  { id: "upsell",   family: "Revenue",              familyColor: "#6E79E0", name: "Increase upsell revenue",  sub: "Surface qualified upsell moments to reps in-conversation.", icon: "dollar" },
  { id: "policy",   family: "Risk & compliance",    familyColor: "#1F242D", name: "Reduce policy violations", sub: "Prevent AI from making out-of-policy commitments.", icon: "lock" },
];

const GoalsEmptyState = ({ onStartWizard }) => (
  <div style={{ padding: "32px 40px 80px" }}>
    {/* Lead-in card */}
    <div style={{
      border: `1px solid ${T.rule}`,
      borderRadius: 14,
      padding: "28px 28px 26px",
      background: "linear-gradient(180deg, #FFFCE8 0%, #FFFFFF 65%)",
      display: "flex", gap: 24, alignItems: "center",
      marginBottom: 28,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, flexShrink: 0,
        background: T.yellow, color: T.ink,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="sparkles" size={24} strokeWidth={2}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "var(--text-h2)", fontWeight: 700, color: T.ink, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          You don't have any goals yet.
        </div>
        <p style={{ fontSize: "var(--text-body)", color: T.ink2, margin: "6px 0 0", maxWidth: "62ch", lineHeight: "var(--leading-body)" }}>
          Pick a template below to scaffold a goal in seconds, Kustomer drafts the
          plan, procedures, and guardrails from your conversations. You review
          before anything goes live.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Btn kind="ink" icon="sparkles" onClick={onStartWizard}>Start AI Setup</Btn>
          <Btn kind="secondary" icon="bookOpen">Browse templates</Btn>
        </div>
      </div>
    </div>

    {/* Template grid */}
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      marginBottom: 12,
    }}>
      <div style={{
        fontSize: "var(--text-accent)", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase", color: T.ink3,
      }}>Start from a template</div>
      <div style={{ fontSize: "var(--text-value)", color: T.ink3 }}>
        Six common goals · customize anything later
      </div>
    </div>

    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
    }}>
      {GOAL_TEMPLATES.map(t => (
        <button key={t.id} onClick={onStartWizard} style={{
          textAlign: "left", padding: "18px 18px 16px",
          border: `1px solid ${T.rule}`, background: "#fff", borderRadius: 12,
          cursor: "pointer", fontFamily: "var(--font-sans)",
          transition: "border-color 140ms, box-shadow 140ms, transform 140ms",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = T.ink4;
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(31,42,46,0.06)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = T.rule;
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            display: "inline-block", fontSize: "var(--text-accent)", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: t.familyColor, marginBottom: 10,
          }}>{t.family}</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: T.bgSoft, color: T.ink,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={t.icon} size={15} strokeWidth={1.8}/>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "var(--text-h4)", fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{t.name}</div>
              <div style={{ fontSize: "var(--text-value)", color: T.ink3, marginTop: 4, lineHeight: 1.45 }}>{t.sub}</div>
            </div>
          </div>
          <div style={{
            marginTop: 14, paddingTop: 10, borderTop: `1px solid ${T.rule}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: "var(--text-accent)", color: T.ink3, fontWeight: 600,
          }}>
            <span>Use template</span>
            <Icon name="arrowRight" size={12} strokeWidth={2}/>
          </div>
        </button>
      ))}
    </div>

    {/* Footnote */}
    <div style={{
      marginTop: 28, padding: "14px 18px",
      border: `1px dashed ${T.rule}`, borderRadius: 10,
      display: "flex", alignItems: "center", gap: 10,
      fontSize: "var(--text-value)", color: T.ink3,
    }}>
      <Icon name="info" size={14} strokeWidth={2}/>
      <span>Nothing here is live yet. Goals stay in draft until you review and deploy.</span>
    </div>
  </div>
);

// ── Date-range segmented control ────────────────────────────
const RangeToggle = ({ value, onChange }) => {
  const opts = [
    { id: "24h", label: "24h" },
    { id: "7d",  label: "7d"  },
    { id: "30d", label: "30d" },
  ];
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      background: "#fff", border: `1px solid ${T.rule}`,
      borderRadius: 10, padding: 3, gap: 2,
    }}>
      {opts.map(o => {
        const on = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            padding: "5px 12px", borderRadius: 7, border: 0, cursor: "pointer",
            background: on ? "#F2F3F7" : "transparent",
            color: on ? T.ink : T.ink3,
            fontSize: 12.5, fontWeight: on ? 600 : 500, fontFamily: "var(--font-sans)",
          }}>{o.label}</button>
        );
      })}
    </div>
  );
};

const CreateGoalCard = ({ onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "18px 22px",
    background: "transparent",
    border: `1.5px dashed ${T.rule}`,
    borderRadius: 12, cursor: "pointer", fontFamily: "var(--font-sans)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    color: T.ink3, transition: "all 140ms",
  }}
  onMouseEnter={e => {
    e.currentTarget.style.borderColor = T.ink;
    e.currentTarget.style.background = "rgba(31,42,46,0.02)";
    e.currentTarget.style.color = T.ink;
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderColor = T.rule;
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = T.ink3;
  }}>
    <span style={{
      width: 28, height: 28, borderRadius: 999,
      background: T.yellow, color: T.ink,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon name="plus" size={15} strokeWidth={2.2}/>
    </span>
    <span style={{ fontSize: "var(--text-label)", fontWeight: 600 }}>
      Create a goal
    </span>
    <span style={{ fontSize: "var(--text-accent)", color: T.ink3 }}>
      · Kustomer drafts the plan; you review before going live
    </span>
  </button>
);

const GoalRow = ({ g, onClick }) => {
  const info = STATE_INFO[g.state];
  const tints = {
    live:      { bg: "#FFFFFF",                bd: T.rule },
    attention: { bg: "rgba(214,58,67,0.04)",   bd: "#F3C4C7" },
    testing:   { bg: "#FFFFFF",                bd: T.rule },
    limited:   { bg: "#FFFFFF",                bd: T.rule },
    default:   { bg: "#FFFFFF",                bd: T.rule },
  };
  const tint = tints[g.state] || tints.default;

  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", padding: "18px 22px",
      background: tint.bg, border: `1px solid ${tint.bd}`,
      borderRadius: 12, cursor: "pointer", fontFamily: "var(--font-sans)",
      display: "grid",
      gridTemplateColumns: "1.7fr 0.9fr 1.1fr 1.1fr 1.1fr",
      gap: 16, alignItems: "center",
      transition: "border-color 140ms, box-shadow 140ms",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(31,42,46,0.06)"; e.currentTarget.style.borderColor = T.ink4; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = tint.bd; }}
    >
      <div>
        <div style={{
          display: "inline-block", fontSize: "var(--text-accent)", fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: T.ink, marginBottom: 6,
        }}>{g.family}</div>
        <div style={{ fontSize: "var(--text-h3)", fontWeight: 700, color: T.ink, lineHeight: "var(--leading-h3)" }}>{g.name}</div>
        <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6 }}>
          <StatePill state={g.state} size="sm"/>
        </div>
      </div>

      <div>
        <div style={{ fontSize: "var(--text-accent)", fontWeight: 600, color: T.ink3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Target</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: "var(--text-h3)", fontWeight: 700, color: T.ink, marginTop: 4,
          fontVariantNumeric: "tabular-nums", lineHeight: "var(--leading-h3)",
        }}>{g.target.value}</div>
        <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{g.target.label}</div>
      </div>

      <div>
        <div style={{ fontSize: "var(--text-accent)", fontWeight: 600, color: T.ink3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Current</div>
        {g.delta ? (
          <>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Icon name={g.delta.dir === "down" ? "trendDown" : "trendUp"} size={14} strokeWidth={2.2}
                style={{ color: (g.state === "attention") ? T.danger : T.success }}/>
              <span style={{ fontSize: "var(--text-h3)", fontWeight: 700, color: T.ink, fontVariantNumeric: "tabular-nums", lineHeight: "var(--leading-h3)" }}>{g.delta.val}</span>
            </div>
            <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{g.delta.label}</div>
          </>
        ) : (
          <div style={{ fontSize: 12.5, color: T.ink4, fontStyle: "italic", marginTop: 6 }}>No data yet</div>
        )}
      </div>

      <div>
        <div style={{ fontSize: "var(--text-accent)", fontWeight: 600, color: T.ink3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Progress</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Progress value={g.progress} color={g.state === "attention" ? T.danger : g.state === "live" ? T.success : T.periDeep}/>
          </div>
          <div style={{ fontSize: "var(--text-label)", fontWeight: 600, color: T.ink, fontVariantNumeric: "tabular-nums" }}>{g.progress}%</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
        {g.suggestions > 0 ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 999,
            background: "rgba(251,236,42,0.25)", color: "#6e5800",
            fontSize: 12, fontWeight: 500,
          }}>
            <Icon name="sparkles" size={11} strokeWidth={2.4}/>{g.suggestions} suggestions
          </span>
        ) : <span style={{ fontSize: 12, color: T.ink4 }}>No suggestions</span>}
        <Icon name="chevronRight" size={16} strokeWidth={2} style={{ color: T.ink4 }}/>
      </div>
    </button>
  );
};

// ── Goal Slide-out ──────────────────────────────────────────
const GoalSlideout = ({ goal, onClose, onJump }) => {
  const [name, setName]                 = React.useState(goal.name);
  const [description, setDescription]   = React.useState(goal.sub);
  const [target, setTarget]             = React.useState(goal.target.value);
  const [direction, setDirection]       = React.useState("lower_is_better");
  const [unit, setUnit]                 = React.useState("percent");
  const [computedField, setComputedField] = React.useState("AI-Generated CSAT");
  const [monitor, setMonitor]           = React.useState("AIC AI-CSAT, +1 more");
  const [owner, setOwner]               = React.useState(goal.owner);
  const [alertsOn, setAlertsOn]         = React.useState(true);
  const [alertCadence, setAlertCadence] = React.useState("daily");

  const info = STATE_INFO[goal.state];
  const headerTint = goal.state === "attention" ? "rgba(214,58,67,0.06)"
                    : goal.state === "live"    ? "rgba(22,163,107,0.06)"
                    : goal.state === "testing" ? "rgba(110,121,224,0.06)"
                    : "rgba(31,42,46,0.03)";

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(16,18,24,0.32)",
        zIndex: 20, animation: "fade 200ms ease",
      }}/>
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%",
        width: 520, background: "#fff", zIndex: 21,
        boxShadow: "-12px 0 30px rgba(0,0,0,0.16)",
        display: "flex", flexDirection: "column",
        animation: "slidein 240ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <style>{`
          @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slidein { from { transform: translateX(100%); opacity: 0.4 } to { transform: translateX(0); opacity: 1 } }
        `}</style>

        {/* Status header, tinted by state */}
        <div style={{ padding: "18px 22px 20px", background: headerTint, borderBottom: `1px solid ${T.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={onClose} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "transparent", border: 0, padding: "4px 6px", borderRadius: 6,
              cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.ink3,
              fontFamily: "var(--font-sans)",
            }}>
              <Icon name="chevronLeft" size={13} strokeWidth={2}/> Goals · {goal.family}
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              <button title="Duplicate" style={iconBtn}><Icon name="folder" size={13} strokeWidth={1.9}/></button>
              <button title="Archive"   style={iconBtn}><Icon name="bookmark" size={13} strokeWidth={1.9}/></button>
              <button onClick={onClose} title="Close" style={iconBtn}><Icon name="x" size={13} strokeWidth={2}/></button>
            </div>
          </div>

          <h2 style={{
            margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700,
            fontSize: "var(--text-h1)", color: T.ink, letterSpacing: "-0.01em",
            lineHeight: "var(--leading-h1)",
          }}>{goal.name}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            <StatePill state={goal.state}/>
            {goal.delta && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 13, fontWeight: 700, color: T.ink,
                fontVariantNumeric: "tabular-nums",
              }}>
                <Icon name={goal.delta.dir === "down" ? "trendDown" : "trendUp"} size={13} strokeWidth={2.2}
                  style={{ color: goal.state === "attention" ? T.danger : T.success }}/>
                {goal.delta.val}
              </span>
            )}
            <span style={{ fontSize: 12, color: T.ink3 }}>{goal.delta?.label || "Setting up monitors"}</span>
          </div>

          {/* KPI band */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Progress to target ({goal.target.value})</div>
              <Progress value={goal.progress} color={goal.state === "attention" ? T.danger : goal.state === "live" ? T.success : T.periDeep} height={7}/>
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>{goal.progress}%, {goal.target.label}</div>
            </div>
            <Sparkline data={goal.spark} color={goal.state === "attention" ? T.danger : T.success} height={40} fill/>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Configuration section */}
          <SlideSection title="Configuration" sub="What we're tracking">
            <Field label="Name">         <Input value={name}        onChange={setName}/></Field>
            <Field label="Description">  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.rule}`, borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 13, color: T.ink, resize: "vertical" }}/></Field>
            <Field label="Target">       <Input value={target}      onChange={setTarget}/></Field>
            <Field label="Direction">    <Select value={direction}  onChange={setDirection} options={["lower_is_better","higher_is_better"]}/></Field>
            <Field label="Unit">         <Select value={unit}       onChange={setUnit} options={["percent","count","score","currency"]}/></Field>
            <Field label="Computed Field">
              <div style={{ display: "flex", gap: 6 }}>
                <Select value={computedField} onChange={setComputedField} options={["AI-Generated CSAT","Customer Health Score","Company Health Score"]}/>
                <button style={{ ...iconBtn, width: 32, height: 32 }} title="Open in Resources" onClick={() => onJump("resources","computed")}><Icon name="arrowRight" size={12} strokeWidth={2.2}/></button>
              </div>
            </Field>
            <Field label="Quality Monitor">
              <div style={{ display: "flex", gap: 6 }}>
                <Select value={monitor} onChange={setMonitor} options={["AIC AI-CSAT, +1 more","AIC AI-CSAT","Escalation Quality"]}/>
                <button style={{ ...iconBtn, width: 32, height: 32 }} title="See all monitors for this goal" onClick={() => onJump("performance","monitors")}><Icon name="arrowRight" size={12} strokeWidth={2.2}/></button>
              </div>
            </Field>
            <Field label="Owner">        <Input value={owner}       onChange={setOwner}/></Field>
          </SlideSection>

          {/* Alerts opt-in */}
          <SlideSection title="Alerts" sub="Get notified when this goal needs attention">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>Notify me</div>
                <div style={{ fontSize: 12, color: T.ink3 }}>One alert per monitor per delivery window.</div>
              </div>
              <Toggle on={alertsOn} onChange={setAlertsOn}/>
            </div>
            {alertsOn && (
              <>
                <Field label="Cadence">
                  <Select value={alertCadence} onChange={setAlertCadence} options={["hourly","daily"]}/>
                </Field>
                <Field label="Channels">
                  <div style={{ display: "flex", gap: 8 }}>
                    <Chip tone="default">📧 Email</Chip>
                    <Chip tone="default">🔔 In-app</Chip>
                  </div>
                </Field>
              </>
            )}
          </SlideSection>

          {/* Jump links */}
          <SlideSection title="Drill in" sub="Full data lives in Performance, filtered to this goal">
            <JumpRow icon="chartLine" label="See monitors for this goal"
              meta={`${ESCALATIONS_DETAIL.monitor.primary.length} primary`}
              onClick={() => onJump("performance", "monitors")}/>
            <JumpRow icon="sparkles"  label="See suggestions"
              meta={`${goal.suggestions} open`}
              tone={goal.suggestions > 0 ? "yellow" : "default"}
              onClick={() => onJump("performance", "suggestions")}/>
            <JumpRow icon="alert"     label="See anomalies & alerts"
              meta={goal.alerts > 0 ? `${goal.alerts} alert${goal.alerts === 1 ? "" : "s"}` : "0 today"}
              tone={goal.alerts > 0 ? "danger" : "default"}
              onClick={() => onJump("performance", "anomalies")}/>
            <JumpRow icon="file"      label="See trend report" meta="last 30d"
              onClick={() => onJump("performance", "reports")}/>
          </SlideSection>

          {/* Plan summary, explanatory + actionable */}
          <SlideSection title="Plan" sub="What the AI is doing to move this goal.">
            <div style={{ display: "grid", gap: 8 }}>
              <PlanRow
                icon="chat" tone="peri"
                title="Customer AI behaviors"
                count={goal.behaviors.cai}
                countLabel="active"
                desc="What the bot does on customer-facing channels."
                examples={["Answer order-tracking questions", "Escalate angry sentiment"]}
                actionLabel="View all"
                onAction={() => onJump("performance", "monitors")}
                m1ReadOnly
              />
              <PlanRow
                icon="headset" tone="yellow"
                title="Rep AI behaviors"
                count={goal.behaviors.rai}
                countLabel="active"
                desc="What Copilot does for human agents."
                examples={["Draft refund response", "Summarize before transfer"]}
                actionLabel="View all"
                onAction={() => onJump("performance", "monitors")}
                m1ReadOnly
              />
              <PlanRow
                icon="bookOpen" tone="default"
                title="Procedures"
                count={goal.procedures}
                countLabel="attached"
                desc="Step-by-step playbooks the AI follows."
                examples={["Refund order", "VIP handoff with context"]}
                actionLabel="Edit in Resources"
                onAction={() => onJump("resources", "procedures")}
              />
              <PlanRow
                icon="shield" tone="danger"
                title="Guardrails"
                count={goal.guardrails}
                countLabel="active"
                desc="Hard rules + thresholds that prevent off-policy behavior."
                examples={["Never auto-refund > $200", "Always escalate VIP"]}
                actionLabel="Edit in Resources"
                onAction={() => onJump("resources", "guardrails")}
              />
            </div>

            {/* Top-level action: suggest a change */}
            <div style={{
              marginTop: 12, padding: "10px 12px",
              background: "rgba(251,236,42,0.12)",
              border: "1px solid #F9E089", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: 999,
                background: "rgba(251,236,42,0.35)", color: "#6e5800",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}><Icon name="sparkles" size={13} strokeWidth={2.2}/></span>
              <div style={{ flex: 1, fontSize: 12.5, color: T.ink2, lineHeight: 1.45 }}>
                Want to change how this goal is achieved? Suggest a tweak, Kustomer will draft the diff for you to review.
              </div>
              <Btn kind="secondary" size="sm" icon="sparkles" onClick={() => onJump("performance", "suggestions")}>Suggest a change</Btn>
            </div>
          </SlideSection>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
          padding: "12px 20px", borderTop: `1px solid ${T.rule}`, background: "#fff",
        }}>
          <Btn kind="danger" icon="x" size="sm">Archive</Btn>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
            <Btn kind="ink" icon="check">Save changes</Btn>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Slide-out helpers ───────────────────────────────────────
const iconBtn = {
  width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.rule}`,
  background: "#fff", color: T.ink3, cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

const SlideSection = ({ title, sub, children }) => (
  <section style={{ padding: "18px 22px", borderBottom: `1px solid ${T.rule}` }}>
    <div style={{ fontSize: "var(--text-accent)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.ink3 }}>{title}</div>
    {sub && <div style={{ fontSize: "var(--text-accent)", color: T.ink3, marginTop: 4, lineHeight: "var(--leading-accent)" }}>{sub}</div>}
    <div style={{ marginTop: 14, display: "grid", gap: 10 }}>{children}</div>
  </section>
);

const Field = ({ label, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "center" }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: T.ink3 }}>{label}</label>
    <div>{children}</div>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button onClick={() => onChange(!on)} style={{
    width: 36, height: 20, borderRadius: 999,
    background: on ? T.success : "#B3BBCB",
    border: 0, cursor: "pointer", position: "relative",
    transition: "background 140ms",
  }}>
    <span style={{
      position: "absolute", top: 2, left: on ? 18 : 2,
      width: 16, height: 16, borderRadius: 999, background: "#fff",
      transition: "left 140ms cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    }}/>
  </button>
);

const JumpRow = ({ icon, label, meta, tone = "default", onClick }) => {
  const tints = {
    yellow:  { fg: "#6e5800", bg: "rgba(251,236,42,0.18)" },
    danger:  { fg: T.danger, bg: T.dangerBg },
    default: { fg: T.ink2,   bg: "rgba(31,42,46,0.04)" },
  }[tone];
  return (
    <button onClick={onClick} style={{
      display: "grid", gridTemplateColumns: "26px 1fr auto auto",
      alignItems: "center", gap: 10, width: "100%",
      padding: "10px 12px", border: `1px solid ${T.rule}`,
      background: "#fff", borderRadius: 8, cursor: "pointer",
      fontFamily: "var(--font-sans)", textAlign: "left",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(31,42,46,0.03)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
    >
      <span style={{
        width: 26, height: 26, borderRadius: 8,
        background: tints.bg, color: tints.fg,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}><Icon name={icon} size={13} strokeWidth={1.9}/></span>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{label}</span>
      <span style={{ fontSize: 11.5, color: T.ink3 }}>{meta}</span>
      <Icon name="arrowRight" size={13} strokeWidth={2} style={{ color: T.ink4 }}/>
    </button>
  );
};

const PlanRefCard = ({ icon, tone, label, value, onClick }) => {
  const tints = {
    peri:    { fg: T.periDeep, bg: T.periSoft },
    yellow:  { fg: "#6e5800",  bg: "rgba(251,236,42,0.22)" },
    danger:  { fg: T.danger,   bg: T.dangerBg },
    default: { fg: T.ink2,     bg: "rgba(31,42,46,0.04)" },
  }[tone];
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", border: `1px solid ${T.rule}`,
      background: "#fff", borderRadius: 8,
      cursor: onClick ? "pointer" : "default", textAlign: "left", fontFamily: "var(--font-sans)",
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 8,
        background: tints.bg, color: tints.fg,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}><Icon name={icon} size={14} strokeWidth={1.9}/></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: T.ink3 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      </div>
      {onClick && <Icon name="arrowRight" size={12} strokeWidth={2} style={{ color: T.ink4 }}/>}
    </button>
  );
};

// ── New explanatory + actionable PlanRow ────────────────────
const PlanRow = ({ icon, tone, title, count, countLabel, desc, examples, actionLabel, onAction, m1ReadOnly }) => {
  const tints = {
    peri:    { fg: T.periDeep, bg: T.periSoft },
    yellow:  { fg: "#6e5800",  bg: "rgba(251,236,42,0.22)" },
    danger:  { fg: T.danger,   bg: T.dangerBg },
    default: { fg: T.ink2,     bg: "rgba(31,42,46,0.04)" },
  }[tone];
  return (
    <div style={{
      border: `1px solid ${T.rule}`, background: "#fff",
      borderRadius: 10, padding: "12px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          background: tints.bg, color: tints.fg, flexShrink: 0,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}><Icon name={icon} size={14} strokeWidth={1.9}/></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{title}</div>
            <div style={{ fontSize: 12, color: T.ink3, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
              <b style={{ color: T.ink }}>{count}</b> {countLabel}
            </div>
          </div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
            {examples.map((ex, i) => (
              <span key={i} style={{
                fontSize: 11.5, padding: "3px 8px", borderRadius: 999,
                background: "rgba(31,42,46,0.04)", color: T.ink2,
                fontFamily: "var(--font-sans)",
              }}>"{ex}"</span>
            ))}
            {count > examples.length && (
              <span style={{ fontSize: 11.5, padding: "3px 8px", color: T.ink3 }}>+ {count - examples.length} more</span>
            )}
          </div>
        </div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.rule}`,
      }}>
        {m1ReadOnly
          ? <span style={{ fontSize: 11, color: T.ink3, fontStyle: "italic" }}>Read-only in M1 · editing opens in M2</span>
          : <span style={{ fontSize: 11, color: T.ink3 }}>Shared library · edits affect every goal that attaches</span>
        }
        <button onClick={onAction} style={{
          padding: "5px 11px", borderRadius: 6, border: `1px solid ${T.rule}`,
          background: "#fff", color: T.ink, cursor: "pointer",
          fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = T.rule2; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
        >{actionLabel}<Icon name="arrowRight" size={11} strokeWidth={2.2}/></button>
      </div>
    </div>
  );
};

Object.assign(window, { GoalsHome, GoalSlideout, PlanRow });
