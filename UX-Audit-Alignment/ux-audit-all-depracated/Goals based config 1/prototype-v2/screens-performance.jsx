// ============================================================
// Performance, cross-agent operational rollup
// Tabs: Monitors (default) / Suggestions / Anomalies
// Monitors + Anomalies modeled after the cursor-branch AI Monitoring
// design, but using our prototype's visual tokens.
// ============================================================

const PerformanceScreen = ({ navigate, onApplySuggestion, showAnswers }) => {
  const [subTab, setSubTab] = useState("monitors");
  const [audience, setAudience] = useState("all");

  return (
    <>
      <PageHeader
        title="Performance"
        answers={"Monitors watch how your AI is performing on each goal. When a monitor spots a problem or a drift in behavior, it shows up here with a suggestion to fix it."}
        showAnswers={showAnswers}
      />
      <div className="page-body">
        <div style={{ background: "var(--v2-paper-2)", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--v2-hairline-2)", marginBottom: 14, fontSize: 12, color: "var(--ink-70)" }}>
          <Icon name="info" size={12} style={{ verticalAlign: "middle", marginRight: 5, color: "var(--ink-50)" }} />
          This page rolls up <b style={{ color: "var(--ink-100)" }}>every automation, across all goals</b>. To see just one automation's results, open its <b style={{ color: "var(--ink-100)" }}>Analyze</b> tab.
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          <PerfTab id="monitors" active={subTab} onClick={setSubTab}>
            <Icon name="activity" size={12} /> Monitors
            <span style={{ marginLeft: 4, color: "var(--ink-50)", fontFamily: "var(--t-mono)" }}>6</span>
          </PerfTab>
          <PerfTab id="suggestions" active={subTab} onClick={setSubTab}>
            <Icon name="sparkles" size={12} /> Suggestions
            <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 600, padding: "0 5px", background: "var(--ai-bg)", color: "var(--ai-text)", borderRadius: 3, fontFamily: "var(--t-mono)" }}>{window.MOCK.SUGGESTIONS.length}</span>
          </PerfTab>
          <PerfTab id="anomalies" active={subTab} onClick={setSubTab}>
            <Icon name="warning" size={12} /> Anomalies
            <span style={{ marginLeft: 4, color: "var(--ink-50)", fontFamily: "var(--t-mono)" }}>3</span>
          </PerfTab>
        </div>

        {subTab === "monitors" && <MonitorsView navigate={navigate} />}
        {subTab === "suggestions" && (
          <>
            <div style={{ background: "var(--v2-paper-2)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--v2-hairline-2)", marginBottom: 14, fontSize: 12.5, color: "var(--ink-100)" }}>
              <Icon name="info" size={12} /> Suggestions come from detected patterns across your AI and human conversations. <b>Each one names a specific procedure, KB article, tool, or guardrail to update.</b> Apply, edit, or dismiss, never overwrites anything until you publish.
            </div>
            {window.MOCK.SUGGESTIONS.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onEdit={() => onApplySuggestion(s)} />
            ))}
          </>
        )}
        {subTab === "anomalies" && <AnomaliesView navigate={navigate} />}
      </div>
    </>
  );
};

const PerfTab = ({ id, active, onClick, children }) => (
  <div
    onClick={() => onClick(id)}
    style={{
      padding: "10px 14px",
      fontSize: 12.5, fontWeight: 500,
      color: active === id ? "var(--ink-100)" : "var(--ink-60)",
      cursor: "pointer",
      borderBottom: `2px solid ${active === id ? "var(--ink-100)" : "transparent"}`,
      marginBottom: -1,
      display: "inline-flex", alignItems: "center", gap: 6,
      whiteSpace: "nowrap",
      letterSpacing: "-0.005em",
    }}
  >{children}</div>
);

// ============================================================
// Monitors, card grid
// ============================================================
const MONITOR_DATA = [
  {
    id: "ai-csat",
    name: "AI-Generated CSAT",
    kind: "default",
    description: "Tracks CSAT scores returned by AI on completed customer conversations across all Customer AI automations.",
    audience: "AI Agents",
    goal: "Improve CSAT to 4.6",
    metric: { value: 4.4, unit: "/ 5", label: "Avg CSAT" },
    target: 4.5,
    trend7d: [4.20, 4.22, 4.28, 4.30, 4.32, 4.38, 4.40],
    trend30d: [4.10, 4.12, 4.15, 4.18, 4.20, 4.22, 4.25, 4.26, 4.28, 4.30, 4.30, 4.32, 4.34, 4.36, 4.36, 4.38, 4.38, 4.40, 4.40, 4.40, 4.42, 4.42, 4.42, 4.40, 4.40, 4.40, 4.40, 4.40, 4.40, 4.40],
    criteria: [
      { name: "Tone matched brand voice", weight: 35, pass: 92, essential: true },
      { name: "Issue resolved end-to-end", weight: 40, pass: 87, essential: true },
      { name: "Suggested next steps", weight: 25, pass: 78 },
    ],
    passing: 70,
  },
  {
    id: "refund-eligibility",
    name: "Refund eligibility check",
    kind: "custom",
    description: "Verifies that the AI confirmed eligibility before issuing a refund. Flags refunds processed without checking order age, payment method, or item condition.",
    audience: "AI Agents",
    goal: "Reduce refund tickets by 20%",
    metric: { value: 62, unit: "%", label: "Pass rate" },
    target: 80,
    trend7d: [72, 70, 68, 65, 64, 63, 62],
    trend30d: [80, 79, 78, 78, 76, 75, 75, 74, 72, 72, 70, 70, 69, 68, 67, 66, 66, 65, 64, 64, 63, 63, 62, 62, 62, 62, 62, 62, 62, 62],
    criteria: [
      { name: "Verified order age (< 60 days)", weight: 30, pass: 88, essential: true },
      { name: "Checked payment method valid", weight: 25, pass: 91 },
      { name: "Confirmed item condition", weight: 25, pass: 42, essential: true },
      { name: "Logged refund reason", weight: 20, pass: 54 },
    ],
    passing: 70,
  },
  {
    id: "tool-latency-order",
    name: "Tool latency · get_order",
    kind: "custom",
    description: "P95 latency for the get_order tool call. Above 3s, customer-facing AI conversations stall.",
    audience: "AI Agents",
    goal: "Auto-resolve order tracking",
    metric: { value: 4.2, unit: "s", label: "P95 latency" },
    target: 3.0,
    trend7d: [1.9, 2.1, 2.4, 3.0, 3.6, 4.0, 4.2],
    trend30d: [1.4, 1.5, 1.6, 1.6, 1.7, 1.8, 1.8, 1.9, 1.9, 2.0, 2.0, 2.1, 2.2, 2.2, 2.4, 2.4, 2.6, 2.8, 3.0, 3.0, 3.2, 3.3, 3.4, 3.6, 3.7, 3.8, 4.0, 4.0, 4.1, 4.2],
    criteria: [
      { name: "P95 < 3s", weight: 60, pass: 34, essential: true },
      { name: "Error rate < 1%", weight: 40, pass: 92 },
    ],
    passing: 80,
  },
  {
    id: "rep-frt",
    name: "First reply time · Team A",
    kind: "custom",
    description: "Median first reply time for human reps on Team A across all channels.",
    audience: "Human Reps",
    goal: "Cut first reply time to 90s",
    metric: { value: 94, unit: "s", label: "Median FRT" },
    target: 90,
    trend7d: [150, 140, 130, 120, 110, 100, 94],
    trend30d: [200, 195, 188, 180, 175, 170, 165, 160, 158, 155, 150, 148, 145, 140, 138, 135, 130, 128, 125, 122, 120, 118, 115, 112, 108, 104, 100, 98, 96, 94],
    criteria: [
      { name: "P50 < 90s", weight: 100, pass: 47, essential: true },
    ],
    passing: 90,
  },
  {
    id: "save-attempts",
    name: "Save attempts · Retention team",
    kind: "custom",
    description: "% of cancellation requests where the rep attempted a save offer (pause / discount / waitlist) before processing the cancel.",
    audience: "Human Reps",
    goal: "Save at-risk renewals 80%",
    metric: { value: 41, unit: "%", label: "Save attempt rate" },
    target: 60,
    trend7d: [55, 52, 48, 45, 43, 41, 41],
    trend30d: [62, 62, 60, 58, 58, 56, 55, 55, 54, 52, 52, 50, 50, 48, 48, 46, 45, 45, 44, 43, 43, 42, 42, 41, 41, 41, 41, 41, 41, 41],
    criteria: [
      { name: "Save offer presented", weight: 60, pass: 41, essential: true },
      { name: "Reason for cancel logged", weight: 40, pass: 78 },
    ],
    passing: 60,
  },
  {
    id: "customer-health",
    name: "Customer Health Score",
    kind: "default",
    description: "Composite signal of CSAT, repeat-contact rate, churn risk, and product usage. Used by AI for prioritization.",
    audience: "AI Agents",
    goal: null,
    metric: { value: 82, unit: "/ 100", label: "Avg health" },
    target: 80,
    trend7d: [78, 79, 80, 81, 82, 81, 82],
    trend30d: [70, 71, 72, 72, 73, 74, 74, 75, 75, 76, 77, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81, 81, 82, 82, 82, 82, 82, 82, 82, 82],
    criteria: [
      { name: "CSAT contribution", weight: 30, pass: 88 },
      { name: "Repeat contact rate", weight: 30, pass: 79 },
      { name: "Churn risk signal", weight: 25, pass: 81 },
      { name: "Product usage signal", weight: 15, pass: 76 },
    ],
    passing: 70,
  },
];

const MonitorsView = ({ navigate }) => {
  const [query, setQuery] = useState("");
  const [jumpId, setJumpId] = useState("");

  const filtered = MONITOR_DATA.filter((m) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.goal && m.goal.toLowerCase().includes(q)) ||
      m.criteria.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  // Jump-to scrolls to the card
  useEffect(() => {
    if (!jumpId) return;
    const el = document.getElementById(`mon-${jumpId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setJumpId("");
  }, [jumpId]);

  return (
    <div className="mon-page">
      {/* Header: title + description + Add monitoring */}
      <div className="mon-header">
        <div>
          <h2>Monitors</h2>
          <p>
            A monitor is a check that watches one part of your AI or human
            performance and scores it against quality criteria. Each monitor
            produces the <b>scorecard</b> you see on an automation's Analyze tab,
            and raises a suggestion when its score slips.
          </p>
        </div>
        <button className="btn brand">
          <Icon name="plus" size={12} /> Add monitoring
        </button>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="mon-empty">No monitors match "{query}".</div>
      ) : (
        <div className="mon-grid">
          {filtered.map((m) => <MonitorCard key={m.id} monitor={m} navigate={navigate} />)}
        </div>
      )}
    </div>
  );
};

// One monitor card with name, description, linked goal, trend, criteria
const MonitorCard = ({ monitor, navigate }) => {
  const [timeFilter, setTimeFilter] = useState("7d");
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const pts = timeFilter === "7d" ? monitor.trend7d : monitor.trend30d;
  const max = Math.max(...pts) * 1.08;
  const min = monitor.metric.unit === "/ 5" ? Math.min(...pts) * 0.92 : 0;
  const range = max - min || 1;

  const currentVal = pts[pts.length - 1];
  const eyebrowVal = monitor.metric.unit === "/ 100" || monitor.metric.unit === "%"
    ? Math.round(pts.reduce((a, b) => a + b, 0) / pts.length)
    : pts.reduce((a, b) => a + b, 0) / pts.length;
  const eyebrowDisplay = typeof eyebrowVal === "number"
    ? (Number.isInteger(eyebrowVal) ? eyebrowVal : eyebrowVal.toFixed(1))
    : eyebrowVal;

  // Bar color: purple by default, warning red when below target
  const aboveTarget = (v) => {
    // For latency / FRT, lower is better, flip the comparison
    const lowerIsBetter = monitor.metric.unit === "s";
    return lowerIsBetter ? v <= monitor.target : v >= monitor.target;
  };

  const totalWeight = monitor.criteria.reduce((a, c) => a + c.weight, 0);

  return (
    <div id={`mon-${monitor.id}`} className="mon-card">
      {/* Header */}
      <div className="mon-card-head">
        <div className="mon-card-title-row">
          <span className="mon-card-name">{monitor.name}</span>
          <span className={`mon-card-pill ${monitor.kind}`}>
            {monitor.kind === "default" ? "Default" : "Custom"}
          </span>
        </div>
        <button className="mon-card-edit">
          <Icon name="edit" size={11} /> Edit
        </button>
      </div>

      {/* Sub-header */}
      <div className="mon-card-sub">
        <p className="mon-card-desc">{monitor.description}</p>
        <div className="mon-card-meta-row">
          <span className="mon-card-meta-label">Linked goal:</span>
          {monitor.goal ? (
            <GoalChip name={monitor.goal} />
          ) : (
            <span className="mon-card-meta-empty">No goal linked</span>
          )}
        </div>
      </div>

      {/* Trend */}
      <div className="mon-card-trend">
        <div className="mon-card-trend-head">
          <div className="mon-card-trend-eyebrow">
            <span className="mon-card-trend-val">{eyebrowDisplay}{monitor.metric.unit}</span>
            <span className="mon-card-trend-label">{monitor.metric.label}</span>
          </div>
          <div className="mon-card-trend-toggle">
            {["7d", "30d"].map((f) => (
              <button
                key={f}
                className={`mon-card-trend-toggle-btn ${timeFilter === f ? "active" : ""}`}
                onClick={() => setTimeFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mon-card-chart" onMouseLeave={() => setHovered(null)}>
          <svg viewBox={`0 0 400 64`} preserveAspectRatio="none" style={{ width: "100%", height: 64 }}>
            <line x1="0" y1="58" x2="400" y2="58" stroke="var(--v2-hairline)" strokeWidth="1" />
            {pts.map((v, i) => {
              const slotW = 400 / pts.length;
              const barW = slotW * 0.65;
              const x = i * slotW + (slotW - barW) / 2;
              const ratio = (v - min) / range;
              const h = Math.max(2, ratio * 50);
              const y = 58 - h;
              const isLast = i === pts.length - 1;
              const isHovered = hovered === i;
              const fill = aboveTarget(v) ? "var(--mon-bar)" : "var(--mon-bar-below)";
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx="2"
                  fill={fill}
                  opacity={isHovered ? 1 : isLast ? 0.92 : 0.42}
                  onMouseEnter={() => setHovered(i)}
                />
              );
            })}
          </svg>
          {hovered != null && (() => {
            const v = pts[hovered];
            const pct = ((hovered + 0.5) / pts.length) * 100;
            return (
              <div className="mon-card-tooltip" style={{ left: `${pct}%` }}>
                {typeof v === "number" && !Number.isInteger(v) ? v.toFixed(2) : v}{monitor.metric.unit}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Criteria accordion */}
      <button
        className="mon-card-criteria-head"
        onClick={() => setCriteriaOpen((v) => !v)}
        aria-expanded={criteriaOpen}
      >
        <span>Monitor Criteria</span>
        <span className="mon-card-criteria-summary">
          {monitor.criteria.length} criteria · {monitor.passing}% passing target
        </span>
        <Icon name={criteriaOpen ? "chevDown" : "chevRight"} size={11} />
      </button>
      {criteriaOpen && (
        <div className="mon-card-criteria-body">
          {monitor.criteria.map((c, i) => (
            <div key={i} className="mon-criterion">
              <div className="mon-criterion-name">
                {c.name}
                {c.essential && <span className="mon-criterion-must">Must pass</span>}
              </div>
              <div className="mon-criterion-meta">
                <span className="mon-criterion-weight">Weight {c.weight}%</span>
                <span className={`mon-criterion-pass ${c.pass < monitor.passing ? "fail" : "ok"}`}>
                  {c.pass}% pass
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// Anomalies, today's suggestion + grid
// ============================================================
const ANOMALY_DATA = [
  {
    id: "anom-coupon-csat",
    title: "CSAT drops 0.8pt when VIP customers receive a coupon without product context",
    suggestion: true,
    monitor: "AI-Generated CSAT",
    automation: "All Customer AI",
    severity: "medium",
    sampleCount: 47,
    detectedAgo: "2 hours ago",
    detail: "33% of coupon requests come from customers who haven't reviewed related products. Adding a recommendation step before the coupon is applied could meaningfully increase satisfaction with minimal friction.",
    goal: "Improve CSAT to 4.6",
  },
  {
    id: "anom-refund-ceiling",
    title: "Granted refund $382 above the documented policy ceiling",
    monitor: "Refund eligibility check",
    automation: "Refund Order v3",
    severity: "high",
    sampleCount: 3,
    detectedAgo: "14h ago",
    detail: "AI exceeded the $250 refund ceiling on 3 conversations without escalating to a human. Policy doc was updated 2 weeks ago; procedure may not have re-indexed.",
    goal: "Reduce refund tickets by 20%",
  },
  {
    id: "anom-shipping-date",
    title: "Hallucinated shipping date when carrier API returned ambiguous status",
    monitor: "AI-Generated CSAT",
    automation: "Order Tracking v4",
    severity: "medium",
    sampleCount: 7,
    detectedAgo: "2d ago",
    detail: "When ups.com returned 'In transit' with no ETA, AI invented a specific delivery date in 7 conversations. Customers complained when the package didn't arrive then.",
    goal: "Auto-resolve order tracking",
  },
  {
    id: "anom-escalate-allowed",
    title: "Escalated when policy allowed auto-resolution",
    monitor: "Refund eligibility check",
    automation: "Damaged Items v1",
    severity: "low",
    sampleCount: 12,
    detectedAgo: "1d ago",
    detail: "AI escalated 12 conversations where the order value was under $200 and the damage description matched our auto-resolve criteria. Likely an over-cautious procedure step.",
    goal: "Reduce refund tickets by 20%",
  },
];

const AnomaliesView = ({ navigate }) => {
  const [range, setRange] = useState("7d");
  const [focusId, setFocusId] = useState(null);
  const todays = ANOMALY_DATA.find((a) => a.suggestion);
  const rest = ANOMALY_DATA.filter((a) => !a.suggestion);

  return (
    <div className="anom-page">
      <div className="anom-header">
        <div>
          <h2>Anomalies</h2>
          <p>An anomaly is an unusual pattern a monitor spotted in your AI or human conversations. (Inside a single automation's Analyze tab, AI anomalies are shown as <b>Drift</b>.)</p>
        </div>
        <div className="anom-range">
          {["24h", "7d", "30d"].map((r) => (
            <button
              key={r}
              className={`anom-range-btn ${range === r ? "active" : ""}`}
              onClick={() => setRange(r)}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* Today's suggestion banner */}
      {todays && (
        <div className="anom-todays">
          <div className="anom-todays-bar" />
          <div className="anom-todays-body">
            <div className="anom-todays-head">
              <span className="anom-todays-eyebrow">Today's suggestion</span>
              <span className="anom-todays-range">{range}</span>
            </div>
            <h3>{todays.title}</h3>
            <p>{todays.detail}</p>
            <div className="anom-todays-meta">
              <span className="anom-chip mon"><Icon name="activity" size={10} /> {todays.monitor}</span>
              <span className="anom-chip auto"><Icon name="bolt" size={10} /> {todays.automation}</span>
              {todays.goal && <GoalChip name={todays.goal} />}
              <span className="anom-chip when">{todays.sampleCount} conversations · {todays.detectedAgo}</span>
            </div>
            <div className="anom-todays-actions">
              <button className="btn ghost sm">Snooze</button>
              <button className="btn sm">Investigate</button>
              <button className="btn brand sm"><Icon name="sparkles" size={11} /> Implement suggestion</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of remaining anomalies */}
      <div className="anom-grid">
        {rest.map((a) => (
          <AnomalyCard
            key={a.id}
            anomaly={a}
            expanded={focusId === a.id}
            onToggle={() => setFocusId(focusId === a.id ? null : a.id)}
          />
        ))}
      </div>
    </div>
  );
};

const AnomalyCard = ({ anomaly, expanded, onToggle }) => (
  <div className={`anom-card sev-${anomaly.severity} ${expanded ? "expanded" : ""}`}>
    <div className="anom-card-bar" />
    <div className="anom-card-body">
      <div className="anom-card-head">
        <span className={`anom-sev sev-${anomaly.severity}`}>{anomaly.severity}</span>
        <span className="anom-card-when">{anomaly.detectedAgo}</span>
      </div>
      <h4 onClick={onToggle}>{anomaly.title}</h4>
      <div className="anom-card-meta">
        <span className="anom-chip mon"><Icon name="activity" size={10} /> {anomaly.monitor}</span>
        <span className="anom-chip auto"><Icon name="bolt" size={10} /> {anomaly.automation}</span>
        {anomaly.goal && <GoalChip name={anomaly.goal} />}
      </div>
      {expanded && (
        <div className="anom-card-detail">
          <p>{anomaly.detail}</p>
          <div className="anom-card-stat">{anomaly.sampleCount} conversation{anomaly.sampleCount !== 1 && "s"} affected</div>
          <div className="anom-card-actions">
            <button className="btn ghost sm">Snooze</button>
            <button className="btn sm">Drill into source</button>
            <button className="btn brand sm"><Icon name="sparkles" size={11} /> Create suggestion</button>
          </div>
        </div>
      )}
      <button className="anom-card-expand" onClick={onToggle}>
        <Icon name={expanded ? "chevUp" : "chevDown"} size={11} /> {expanded ? "Hide details" : "View details"}
      </button>
    </div>
  </div>
);

Object.assign(window, { PerformanceScreen, MonitorsView, MonitorCard, AnomaliesView, AnomalyCard });
