// =============================================================
// Performance — the rich monitoring destination.
// Tabs: Dashboard · Quality Monitors · Suggestions · Anomalies · Reports
// Filterable by goal (from slide-out jump-links)
// =============================================================

const Performance = ({ subtab, setSubtab, goalFilter, setGoalFilter, goals, onOpenGoal }) => {
  const goal = goalFilter ? goals.find(g => g.id === goalFilter) : null;

  const tabs = [
    { id: "dashboard",   label: "Dashboard",      icon: "pieChart" },
    { id: "monitors",    label: "Quality Monitors", icon: "shield", badge: 3 },
    { id: "suggestions", label: "Suggestions",    icon: "sparkles", badge: 12 },
    { id: "anomalies",   label: "Anomalies",      icon: "alert",    badge: 4 },
    { id: "reports",     label: "Reports",        icon: "file" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Hero */}
      <div style={{ padding: "26px 36px 18px", borderBottom: `1px solid ${T.rule}` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
          <div>
            <Eyebrow>Performance</Eyebrow>
            <h1 style={{
              fontFamily: "var(--font-sans)", fontWeight: 700,
              fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
              letterSpacing: "-0.01em", color: T.ink, margin: "6px 0 0",
            }}>How is all our AI doing?</h1>
            <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "6px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
              The rich monitoring destination. Every M1 primitive — Quality Monitors, Suggestions,
              Anomalies, Reports — filterable by goal.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="secondary" icon="download" size="sm">Export</Btn>
            <Btn kind="secondary" icon="refresh"  size="sm">Refresh</Btn>
          </div>
        </div>

        {/* Goal filter chip */}
        {goal && (
          <div style={{
            marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 6px 5px 12px",
            background: "rgba(31,42,46,0.04)",
            border: `1px solid ${T.rule}`, borderRadius: 999,
            fontSize: 12.5, fontWeight: 600, color: T.ink,
          }}>
            <Icon name="target" size={12} strokeWidth={2}/>
            Filtered to: <span style={{ color: goal.familyColor }}>{goal.name}</span>
            <button onClick={() => setGoalFilter(null)} style={{
              width: 20, height: 20, borderRadius: 999, border: 0,
              background: "rgba(31,42,46,0.08)", color: T.ink3, cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}><Icon name="x" size={11} strokeWidth={2.4}/></button>
          </div>
        )}
      </div>

      {/* Sub-tabs */}
      <TabBar tabs={tabs} active={subtab} onChange={setSubtab}/>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 36px 60px" }}>
        {subtab === "dashboard"   && <PerfDashboard goal={goal}/>}
        {subtab === "monitors"    && <PerfMonitors goal={goal}/>}
        {subtab === "suggestions" && <PerfSuggestions goal={goal} onOpenGoal={onOpenGoal}/>}
        {subtab === "anomalies"   && <PerfAnomalies goal={goal}/>}
        {subtab === "reports"     && <PerfReports/>}
      </div>
    </div>
  );
};

// ── Dashboard — mimics live AI Performance screen ───────────
const PerfDashboard = ({ goal }) => (
  <div>
    {/* Filter bar */}
    <Card padding={14} style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <ChipFilter icon="clock" label="5/12 – 5/19"/>
      <ChipFilter icon="compass" label="Chicago — America"/>
      <ChipFilter label="Last updated: 5/14, 7:54 PM"/>
      <ChipFilter icon="bookmark" label="Saved Filters"/>
      <span style={{ marginLeft: "auto", fontSize: 12, color: T.ink3 }}>Showing data {goal ? `for ${goal.name}` : "across all goals"}</span>
    </Card>

    {/* Charts row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
      <ChartCard title="AI Conversation Engagements" rightLegend={[
        { label: "AI Conv Engaged · Chat", color: T.ink },
        { label: "AI Conv Engagement Rate · Chat", color: T.periDeep, dashed: true },
      ]}/>
      <ChartCard title="AI Escalations" rightLegend={[
        { label: "AI Escalated Convs · Chat", color: T.danger },
        { label: "AI Escalation Rate · Chat", color: T.warn, dashed: true },
      ]}/>
    </div>

    {/* Automation summary */}
    <Card padding={0} style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${T.rule}`, background: T.bgSoft }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>Automation Performance Summary</div>
        <div style={{ fontSize: 11.5, color: T.ink3 }}>1 of 1</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }}>
          <thead>
            <tr style={{ background: T.bgSoft }}>
              {["Automation Name","Version","AI Conv Engagement Rate","AI Resolution Rate","AI Escalation Rate","AI Error Rate"].map(h => (
                <th key={h} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.rule}`, textAlign: "left", fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Sub Summit Demo", version: 7, engage: "30%", res: "0%", esc: "83%", err: "0%" },
            ].map((r, i) => (
              <tr key={i}>
                <td style={tdSt}><span style={{ color: T.blue, fontWeight: 600 }}>{r.name}</span></td>
                <td style={tdSt}>{r.version}</td>
                <td style={tdSt}>{r.engage}</td>
                <td style={tdSt}>{r.res}</td>
                <td style={tdSt}>{r.esc}</td>
                <td style={tdSt}>{r.err}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const tdSt = { padding: "12px 14px", borderBottom: `1px solid ${T.rule}`, fontSize: 13, color: T.ink2 };

const ChipFilter = ({ icon, label }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 6,
    background: "rgba(31,42,46,0.04)", color: T.ink2,
    fontSize: 12, fontWeight: 500,
  }}>
    {icon && <Icon name={icon} size={11} strokeWidth={2}/>}
    {label}
  </span>
);

// ── Pretty fake chart card ──────────────────────────────────
const ChartCard = ({ title, rightLegend }) => {
  // Generate a fake series — 2 lines, 8 ticks
  const series1 = [4, 6, 5, 8, 7, 9, 6, 8];
  const series2 = [82, 90, 95, 100, 92, 88, 76, 70];
  const W = 320, H = 140, pad = 12;
  const max1 = 10, max2 = 100;
  const pts = (s, max) => s.map((v, i) => {
    const x = pad + (i / (s.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v / max) * (H - pad * 2));
    return [x, y];
  });
  const path = (s, max) => "M " + pts(s, max).map(p => p.join(",")).join(" L ");

  return (
    <Card padding={0}>
      <div style={{ padding: "14px 18px 8px", borderBottom: `1px solid ${T.rule}` }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{title}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, padding: 14 }}>
        <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: "100%", height: H + 30 }}>
          {/* gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
            <line key={i} x1={pad} x2={W - pad} y1={pad + y * (H - pad * 2)} y2={pad + y * (H - pad * 2)} stroke={T.rule} strokeDasharray="2 3"/>
          ))}
          {/* y axes */}
          <line x1={pad} x2={pad} y1={pad} y2={H - pad} stroke={T.ink5} strokeWidth="1"/>
          <line x1={W - pad} x2={W - pad} y1={pad} y2={H - pad} stroke={T.ink5} strokeWidth="1"/>
          {/* bars (series1) */}
          {pts(series1, max1).map(([x, y], i) => (
            <rect key={i} x={x - 6} y={y} width={12} height={H - pad - y}
              fill={rightLegend[0].color} opacity="0.85" rx="2"/>
          ))}
          {/* line (series2) */}
          <path d={path(series2, max2)} stroke={rightLegend[1].color} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
          {/* x labels */}
          {["May 12","13","14","15","16","17","18","19"].map((lab, i) => (
            <text key={i} x={pad + (i / 7) * (W - pad * 2)} y={H + 18}
              fontSize="9" fill={T.ink3} textAnchor="middle">{lab}</text>
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: T.ink3, minWidth: 110 }}>
          {rightLegend.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: l.dashed ? 14 : 12, height: 2,
                background: l.color,
                ...(l.dashed ? { background: "transparent", borderTop: `2px dashed ${l.color}`, height: 0 } : {})
              }}/>
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// ── Quality Monitors ────────────────────────────────────────
const PerfMonitors = ({ goal }) => {
  const monitors = [
    { name: "AIC AI-CSAT Monitor",   kind: "aic", thresh: 0.85, pass: "92%", trend: "stable", goals: 2, default: true },
    { name: "AIR Copilot Usage",     kind: "air", thresh: 0.80, pass: "88%", trend: "up",     goals: 3, default: true },
    { name: "Escalation Quality",    kind: "aic", thresh: 0.75, pass: "78%", trend: "down",   goals: 1, default: false },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <H size="h3">Quality Monitors</H>
          <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "4px 0 0", lineHeight: "var(--leading-body)" }}>
            Post-deployment evaluations that score live conversations. M1: 2 OOTB + 1 custom.
          </p>
        </div>
        <Btn kind="secondary" icon="plus" size="sm">New monitor</Btn>
      </div>

      <Card padding={0} style={{ overflow: "hidden" }}>
        {monitors.map((m, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1.8fr 100px 100px 110px 130px 80px",
            alignItems: "center", gap: 14, padding: "14px 18px",
            borderTop: i ? `1px solid ${T.rule}` : "none",
          }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, display: "flex", alignItems: "center", gap: 8 }}>
                {m.name}
                {m.default && <Chip tone="default">Default</Chip>}
              </div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 3 }}>Attached to {m.goals} goal{m.goals === 1 ? "" : "s"}</div>
            </div>
            <Chip tone={m.kind === "aic" ? "peri" : "yellow"}>{m.kind.toUpperCase()}</Chip>
            <div style={{ fontSize: 12.5, color: T.ink2 }}>≥ {Math.round(m.thresh * 100)}%</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, fontVariantNumeric: "tabular-nums" }}>{m.pass}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.ink2 }}>
              <Icon name={m.trend === "down" ? "trendDown" : "trendUp"} size={12} strokeWidth={2}
                style={{ color: m.trend === "down" ? T.danger : T.success }}/>
              {m.trend}
            </div>
            <Btn kind="ghost" size="sm" icon="edit">Edit</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ── Suggestions ─────────────────────────────────────────────
const PerfSuggestions = ({ goal, onOpenGoal }) => {
  const sugs = (goal ? ESCALATIONS_DETAIL.suggestions : [
    ...ESCALATIONS_DETAIL.suggestions.map(s => ({ ...s, goal: "Reduce escalations" })),
    { id: "x1", confidence: "high", title: "Update knowledge: return policy v4", body: "Help Center has a v4 of the return policy. Update the source so Customer AI quotes the right text.", impact: "Accuracy", goal: "Improve CSAT" },
    { id: "x2", confidence: "med",  title: "Add Rep AI behavior for backordered items", body: "Reps handle 84 backorder convos / week with no draft assist. A new behavior could deflect repeat asks.", impact: "−3 min AHT", goal: "Reduce reopen rate" },
  ]);

  const kpis = [
    { label: "Open",            value: sugs.length },
    { label: "High confidence", value: sugs.filter(s => s.confidence === "high").length },
    { label: "In test",         value: 2 },
    { label: "Accepted QTD",    value: 18 },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {kpis.map(k => (
          <Card key={k.label} padding={14}>
            <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: T.ink, marginTop: 4 }}>{k.value}</div>
          </Card>
        ))}
      </div>

      <Card padding={0} style={{ overflow: "hidden" }}>
        {sugs.map((s, i) => (
          <div key={s.id} style={{
            padding: "14px 18px", borderTop: i ? `1px solid ${T.rule}` : "none",
            display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
          }}>
            <Chip tone={s.confidence === "high" ? "yellow" : "default"}>
              {s.confidence} confidence
            </Chip>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 3 }}>
                {s.title}
                {!goal && s.goal && <span style={{ marginLeft: 8, fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>· {s.goal}</span>}
              </div>
              <div style={{ fontSize: 12.5, color: T.ink3, lineHeight: 1.5 }}>{s.body}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Chip tone="success" icon="trendUp">{s.impact}</Chip>
              <Btn kind="ghost"  size="sm">Dismiss</Btn>
              <Btn kind="secondary" size="sm" icon="flask">Test</Btn>
              <Btn kind="ink" size="sm" icon="check">Review</Btn>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ── Anomalies ───────────────────────────────────────────────
const PerfAnomalies = ({ goal }) => {
  const events = [
    { type: "procedure_non_adherence", desc: "Agent skipped step 3 (verify frustration)",      target: "Smart Handoff",        at: "12:04",  channel: "chat" },
    { type: "tool_misuse",             desc: "Order lookup called twice for same order",       target: "Order lookup",         at: "08:22",  channel: "chat" },
    { type: "kb_non_adherence",        desc: "AI quoted policy text from web search",          target: "Refund policy",        at: "07:11",  channel: "email" },
    { type: "procedure_non_adherence", desc: "Skipped VIP routing — Tier 1 account",           target: "VIP handoff",          at: "yest 18:55", channel: "voice" },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <H size="h3">Anomaly Detection</H>
          <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "4px 0 0", lineHeight: "var(--leading-body)" }}>
            Validation Agent events flagged when AI deviates from expected behavior at runtime.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn kind="secondary" size="sm">All types</Btn>
          <Btn kind="secondary" size="sm">Last 24h</Btn>
        </div>
      </div>
      <Card padding={0} style={{ overflow: "hidden" }}>
        {events.map((e, i) => (
          <div key={i} style={{
            padding: "14px 18px", borderTop: i ? `1px solid ${T.rule}` : "none",
            display: "grid", gridTemplateColumns: "26px 1fr auto auto", gap: 14, alignItems: "center",
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 999, background: T.dangerBg, color: T.danger,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}><Icon name="alert" size={13} strokeWidth={2}/></span>
            <div>
              <div style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 999,
                background: "rgba(31,42,46,0.04)", color: T.ink2,
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                marginBottom: 4,
              }}>{e.type}</div>
              <div style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>{e.desc}</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 3 }}>Target: {e.target} · Channel: {e.channel}</div>
            </div>
            <div style={{ fontSize: 11.5, color: T.ink3 }}>{e.at}</div>
            <Btn kind="ghost" size="sm" iconRight="arrowRight">Open</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ── Reports — OOTB from M1 spec ────────────────────────────
const PerfReports = () => {
  const reports = [
    { title: "AI-Generated CSAT",     scope: "all conversations", cadence: "rolling",      last: "live" },
    { title: "Customer Health Score", scope: "customer",           cadence: "daily",       last: "5 hr ago" },
    { title: "Company Health Score",  scope: "company",            cadence: "daily",       last: "5 hr ago" },
    { title: "Anomaly Detection",     scope: "Validation Agent",   cadence: "live",        last: "live" },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <H size="h3">Reports</H>
          <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "4px 0 0", lineHeight: "var(--leading-body)" }}>
            Out-of-the-box reports from the M1 spec. Goal-specific reports live in the goal's slide-out.
          </p>
        </div>
        <Btn kind="secondary" icon="plus" size="sm">New report</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {reports.map((r, i) => (
          <Card key={i} padding={18} onClick={() => {}}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8, background: T.bgSoft,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}><Icon name="file" size={15} strokeWidth={1.8}/></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{r.title}</div>
                <div style={{ fontSize: 12, color: T.ink3 }}>{r.scope} · {r.cadence}</div>
              </div>
              <Chip tone={r.last === "live" ? "success" : "default"}>{r.last}</Chip>
            </div>
            {/* Mini chart */}
            <div style={{ marginTop: 8 }}>
              <Sparkline data={[3, 4, 4, 5, 4, 5, 6, 7, 6, 7, 8, 8]} color={T.success} height={32}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { Performance });
