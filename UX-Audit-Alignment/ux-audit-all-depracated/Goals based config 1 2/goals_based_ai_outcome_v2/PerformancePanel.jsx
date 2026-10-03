// Performance page — show the user's goals and monitors, current performance
// for AI and reps, and recommendations where there's a gap.

const PERFORMANCE_GOALS = [
  {
    id: "deflect",
    title: "Deflect common questions",
    audience: ["aic"],
    status: "on_track",
    summary: "AI is resolving routine refund and tracking questions before a rep ever sees them.",
    relatedMonitorIds: ["m_deflect"],
  },
  {
    id: "speed",
    title: "Speed up rep responses",
    audience: ["air"],
    status: "watch",
    summary: "Reps are accepting Copilot drafts, but first response time is creeping up on escalations.",
    relatedMonitorIds: ["m_frt"],
  },
  {
    id: "escalate",
    title: "Reduce unnecessary escalations",
    audience: ["aic"],
    status: "at_risk",
    summary: "Escalations on Returns spiked after the policy update — the AI hands off too early when confidence dips.",
    relatedMonitorIds: ["m_escalation"],
  },
  {
    id: "tracking",
    title: "Status & order tracking",
    audience: ["aic", "air"],
    status: "on_track",
    summary: "Tracking flows are solid — carrier lookups resolve in one turn for nearly all customers.",
    relatedMonitorIds: ["m_track_resolution", "m_csat_tracking"],
  },
];

const PERFORMANCE_MONITORS = [
  {
    id: "m_deflect",
    label: "AI Deflections on Returns & Refunds",
    metric: "Deflection rate",
    audience: ["aic"],
    target: { op: "gte", value: 80, unit: "%" },
    current: 84.2,
    delta: +3.6,
    series: [62, 64, 68, 71, 73, 74, 76, 78, 80, 82, 83, 84],
    status: "on_track",
  },
  {
    id: "m_csat",
    label: "AI CSAT",
    metric: "CSAT",
    audience: ["aic"],
    target: { op: "gte", value: 4.5, unit: "/5" },
    current: 4.32,
    delta: -0.05,
    series: [4.38, 4.40, 4.42, 4.41, 4.39, 4.40, 4.36, 4.34, 4.33, 4.33, 4.32, 4.32],
    status: "warning",
  },
  {
    id: "m_frt",
    label: "Human Rep FRT",
    metric: "First response",
    audience: ["air"],
    target: { op: "lt", value: 2, unit: "min" },
    current: 2.4,
    delta: +0.4,
    series: [1.8, 1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3, 2.4, 2.4],
    status: "at_risk",
  },
  {
    id: "m_escalation",
    label: "Unnecessary escalation rate",
    metric: "Escalation rate",
    audience: ["aic"],
    target: { op: "lt", value: 15, unit: "%" },
    current: 18.4,
    delta: +2.6,
    series: [12, 12.5, 13, 13.4, 14, 14.6, 15.4, 16.2, 17, 17.6, 18, 18.4],
    status: "at_risk",
  },
  {
    id: "m_track_resolution",
    label: "Order tracking resolution",
    metric: "One-turn resolution",
    audience: ["aic", "air"],
    target: { op: "gte", value: 90, unit: "%" },
    current: 92,
    delta: +1.4,
    series: [88, 88.5, 89, 89.4, 90, 90.6, 91, 91.2, 91.6, 91.8, 92, 92],
    status: "on_track",
  },
  {
    id: "m_csat_tracking",
    label: "CSAT on Tracking",
    metric: "CSAT",
    audience: ["aic", "air"],
    target: { op: "gte", value: 4.5, unit: "/5" },
    current: 4.6,
    delta: +0.05,
    series: [4.42, 4.45, 4.48, 4.5, 4.52, 4.54, 4.55, 4.56, 4.58, 4.59, 4.6, 4.6],
    status: "on_track",
  },
];

const PERFORMANCE_RECOMMENDATIONS = [
  {
    id: "rec_csat",
    severity: "warning",
    title: "AI CSAT is 0.18 below your 4.5 target",
    cause: "Customers rating below 4 frequently mention the return-window explanation feels rushed. The Procedure jumps to alternatives too early.",
    actions: [
      { icon: "task", label: "Edit the Process Return or Refund procedure", target: "Build > Process Return or Refund" },
      { icon: "bookOpen", label: "Add returns-policy clarifications to your Knowledge Source", target: "Knowledge Sources > Returns Policy" },
    ],
    relatedGoals: ["deflect"],
  },
  {
    id: "rec_frt",
    severity: "fail",
    title: "Human Rep FRT exceeds 2 min target (avg 2.4 min)",
    cause: "Reps spend 38 sec on average reading thread context before replying. Most threads escalate after AI handoff without a summary attached.",
    actions: [
      { icon: "sparkles", label: "Turn on Thread summaries in Copilot", target: "AI for Reps > Settings" },
      { icon: "shield", label: "Tighten the Smart Escalation Handoff procedure to always attach a summary", target: "Build > Smart Escalation Handoff" },
    ],
    relatedGoals: ["speed", "escalate"],
  },
  {
    id: "rec_product_extend",
    severity: "ready",
    topic: "Product questions",
    from: "air",
    to: "aic",
    title: "Ready to extend Product questions to AI for Customers",
    cause: "AI for Reps handles 81% of Product question threads with 4.5 CSAT and 1.8 min AHT. The Procedure and Knowledge Source are solid — flip it on for customer-facing AI to deflect roughly 380 more conversations per month.",
    actions: [
      { icon: "sparkles", label: "Extend Product FAQ Procedure to AI for Customers", target: "Build > Answer Product FAQ from KB" },
      { icon: "task", label: "Review the procedure before deploying", target: "Build > Answer Product FAQ from KB" },
    ],
    relatedGoals: ["deflect"],
  },
  {
    id: "rec_shipping",
    severity: "warning",
    topic: "Shipping delays",
    from: "aic",
    to: "air",
    title: "Shipping delays are underperforming — bring reps in faster",
    cause: "62% of Shipping threads escalate to reps with 5.8 min AHT and 3.9 CSAT. Customers want resolution, not a tracking lookup. Add a goodwill credit procedure and route directly to a specialist team.",
    actions: [
      { icon: "task", label: "Add a Goodwill Credit procedure", target: "Build > New Procedure" },
      { icon: "shield", label: "Route Shipping delays to the Specialist team", target: "Set Goals > Escalation & handoff" },
    ],
    relatedGoals: ["escalate"],
  },
];

const PerformancePanel = () => {
  const [range, setRange] = React.useState("30d");

  return (
    <div data-screen-label="Performance" style={{
      flex: 1, overflow: "auto", padding: "40px 48px 80px", minWidth: 520, background: "#fff",
    }}>
      <div style={{ maxWidth: 1180 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 26 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 500,
              fontSize: 22, lineHeight: 1.2, color: "#1F242D",
              letterSpacing: "-0.005em",
            }}>Performance</div>
            <div style={{
              marginTop: 6,
              fontFamily: "var(--font-sans)", fontSize: 13.5, color: "#5F6675", lineHeight: 1.55,
              maxWidth: 720,
            }}>
              How your AI and reps are tracking against the goals and monitors you set during onboarding.
            </div>
          </div>
          {window.DateRangeFilter && (
            <window.DateRangeFilter value={range} onChange={setRange}/>
          )}
        </div>

        {/* Goals strip */}
        <SectionLabel>Your goals</SectionLabel>
        <div style={{
          display: "grid", gap: 10,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 32,
        }}>
          {PERFORMANCE_GOALS.map(g => (
            <GoalScoreCard key={g.id} goal={g}/>
          ))}
        </div>

        {/* Recommendations — surface gaps + topic-level moves up top */}
        <SectionLabel
          accessory={(() => {
            const gaps = PERFORMANCE_RECOMMENDATIONS.filter(r => r.severity === "warning" || r.severity === "fail").length;
            const ready = PERFORMANCE_RECOMMENDATIONS.filter(r => r.severity === "ready" || r.severity === "optimize").length;
            return (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {gaps > 0 && (
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "2px 8px",
                    background: "#FFF4E6", color: "#8A5A08",
                    fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                    borderRadius: 999, letterSpacing: "0.02em",
                  }}>{gaps} gap{gaps === 1 ? "" : "s"}</span>
                )}
                {ready > 0 && (
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "2px 8px",
                    background: "#E8F5EE", color: "#1F7A4B",
                    fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                    borderRadius: 999, letterSpacing: "0.02em",
                  }}>{ready} ready</span>
                )}
              </div>
            );
          })()}
        >Recommendations</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {PERFORMANCE_RECOMMENDATIONS.map(r => (
            <RecommendationCard key={r.id} rec={r}/>
          ))}
        </div>

        {/* Topics performance */}
        <SectionLabel
          accessory={<span style={{
            fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#697182",
          }}>Last 30 days</span>}
        >Topics performance</SectionLabel>
        <TopicsPerformanceTable/>
      </div>
    </div>
  );
};

const SectionLabel = ({ children, accessory }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    marginBottom: 12,
  }}>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
      letterSpacing: "-0.005em",
    }}>{children}</div>
    {accessory}
  </div>
);

// — Audience pill (inlined so this file doesn't depend on cross-file scope).
const PerfAudienceTag = ({ audience, size = "sm" }) => {
  const palette = audience === "air"
    ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" }
    : { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: size === "md" ? "2px 8px" : "1px 7px",
      background: palette.bg, color: palette.fg,
      fontFamily: "var(--font-sans)",
      fontSize: size === "md" ? 10.5 : 9.5,
      fontWeight: 700,
      letterSpacing: "0.02em",
      borderRadius: 999,
      whiteSpace: "nowrap",
    }}>{palette.label}</span>
  );
};

// — Score chip with color tone.
const ScoreChip = ({ score }) => {
  const palette = score >= 80
    ? { bg: "#E8F5EE", fg: "#1F7A4B" }
    : score >= 65
      ? { bg: "#FFF4E6", fg: "#8A5A08" }
      : { bg: "#FFEDED", fg: "#A8202A" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px",
      background: palette.bg, color: palette.fg,
      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
      borderRadius: 999,
    }}>{score}%</span>
  );
};

const TrendDelta = ({ delta, unit = "%" }) => {
  if (delta == null) return null;
  const up = delta >= 0;
  const palette = up ? { fg: "#1F7A4B" } : { fg: "#A8202A" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 700,
      color: palette.fg,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {up
          ? <path d="m6 15 6-6 6 6"/>
          : <path d="m6 9 6 6 6-6"/>}
      </svg>
      {up ? "+" : ""}{Number.isInteger(delta) ? delta : delta.toFixed(2)}{unit}
    </span>
  );
};

// — Sparkline SVG for monitor trend.
const Sparkline = ({ data, color = "#0165E4", height = 36, width = 120 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${(data.length - 1) * stepX},${height} L 0,${height} Z`;
  const lastX = (data.length - 1) * stepX;
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <path d={areaD} fill={color} opacity="0.12"/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lastX} cy={lastY} r="2.6" fill={color}/>
    </svg>
  );
};

// — Goal card (qualitative).
const GoalScoreCard = ({ goal }) => {
  const statusPalette = goal.status === "on_track"
    ? { bg: "#E8F5EE", fg: "#1F7A4B", label: "On track", bar: "#16A36B" }
    : goal.status === "watch"
      ? { bg: "#FFF4E6", fg: "#8A5A08", label: "Watch",      bar: "#C58A13" }
      : { bg: "#FFEDED", fg: "#A8202A", label: "Needs attention", bar: "#A8202A" };
  return (
    <div style={{
      padding: "14px 16px",
      border: "1px solid #E8EAF0", borderRadius: 10,
      background: "#fff",
      display: "flex", flexDirection: "column", gap: 10,
      position: "relative",
    }}>
      {/* Top accent stripe — status color */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: statusPalette.bar,
        borderTopLeftRadius: 10, borderTopRightRadius: 10,
      }}/>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {goal.audience.map(a => <PerfAudienceTag key={a} audience={a}/>)}
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          padding: "2px 9px",
          background: statusPalette.bg, color: statusPalette.fg,
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: "0.02em", borderRadius: 999,
          whiteSpace: "nowrap",
        }}>{statusPalette.label}</span>
      </div>

      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
        lineHeight: 1.35,
      }}>{goal.title}</div>

      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#5F6675", lineHeight: 1.5,
      }}>{goal.summary}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        {(goal.relatedMonitorIds || [])
          .map(id => PERFORMANCE_MONITORS.find(m => m.id === id))
          .filter(Boolean)
          .map(monitor => (
            <InlineMonitorStrip key={monitor.id} monitor={monitor}/>
          ))}
      </div>
    </div>
  );
};

// — Compact monitor strip embedded inside a goal card: target / value / trend / sparkline.
const InlineMonitorStrip = ({ monitor }) => {
  const sparkColor = monitor.status === "on_track" ? "#16A36B"
                   : monitor.status === "warning"  ? "#C58A13"
                   :                                  "#A8202A";

  const opLabel = monitor.target.op === "gte" ? "≥"
                : monitor.target.op === "gt"  ? ">"
                : monitor.target.op === "lt"  ? "<" : monitor.target.op;

  const unitTrail = monitor.target.unit === "%" ? "%"
                  : monitor.target.unit === "/5" ? " / 5"
                  : monitor.target.unit === "min" ? " min"
                  : monitor.target.unit;

  const displayCurrent = monitor.target.unit === "/5"
    ? monitor.current.toFixed(2)
    : monitor.target.unit === "min"
      ? monitor.current.toFixed(1)
      : monitor.current.toFixed(1);

  return (
    <div style={{
      padding: "10px 12px",
      background: "#FAFBFD",
      border: "1px solid #F0F2F6",
      borderRadius: 8,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#1F242D",
          lineHeight: 1.3,
        }}>{monitor.label}</div>
        <div style={{
          marginTop: 2,
          fontFamily: "var(--font-sans)", fontSize: 10.5, color: "#697182",
          letterSpacing: "0.02em",
        }}>
          Target {opLabel} {monitor.target.value}{unitTrail}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: 18, lineHeight: 1, color: "#1F242D", letterSpacing: "-0.005em",
          }}>{displayCurrent}<span style={{ fontSize: 11, color: "#697182", marginLeft: 2 }}>{unitTrail.trim()}</span></div>
          <TrendDelta
            delta={monitor.delta}
            unit={monitor.target.unit === "/5" ? "" : monitor.target.unit === "min" ? " min" : "%"}
          />
        </div>
        <Sparkline data={monitor.series} color={sparkColor} width={90} height={26}/>
      </div>
    </div>
  );
};

// — Monitor card with sparkline + target.
const MonitorPerformanceCard = ({ monitor }) => {
  const statusPalette = monitor.status === "on_track"
    ? { bg: "#E8F5EE", fg: "#1F7A4B", label: "On track" }
    : monitor.status === "warning"
      ? { bg: "#FFF4E6", fg: "#8A5A08", label: "Watch" }
      : { bg: "#FFEDED", fg: "#A8202A", label: "Off target" };

  const sparkColor = monitor.status === "on_track" ? "#16A36B"
                   : monitor.status === "warning"  ? "#C58A13"
                   :                                  "#A8202A";

  const opLabel = monitor.target.op === "gte" ? "≥"
                : monitor.target.op === "gt"  ? ">"
                : monitor.target.op === "lt"  ? "<" : monitor.target.op;

  const displayCurrent = monitor.target.unit === "/5"
    ? monitor.current.toFixed(2)
    : monitor.target.unit === "min"
      ? monitor.current.toFixed(1)
      : monitor.current.toFixed(1);

  const displayUnit = monitor.target.unit === "/5" ? " / 5"
                    : monitor.target.unit === "min" ? " min"
                    : "%";

  return (
    <div style={{
      padding: "16px 18px",
      border: "1px solid #E8EAF0", borderRadius: 10,
      background: "#fff",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap",
          }}>
            {monitor.audience.map(a => <PerfAudienceTag key={a} audience={a}/>)}
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
            lineHeight: 1.35,
          }}>{monitor.label}</div>
          <div style={{
            marginTop: 2,
            fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#697182",
          }}>
            Target {opLabel} {monitor.target.value}{monitor.target.unit === "%" ? "%" : monitor.target.unit === "/5" ? " / 5" : monitor.target.unit === "min" ? " min" : monitor.target.unit}
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px",
          background: statusPalette.bg, color: statusPalette.fg,
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0,
          letterSpacing: "0.02em",
        }}>{statusPalette.label}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: 28, lineHeight: 1, color: "#1F242D", letterSpacing: "-0.01em",
          }}>{displayCurrent}<span style={{ fontSize: 14, color: "#697182", marginLeft: 2 }}>{displayUnit.trim()}</span></div>
          <div style={{ marginTop: 6 }}>
            <TrendDelta
              delta={monitor.delta}
              unit={monitor.target.unit === "/5" ? "" : monitor.target.unit === "min" ? " min" : "%"}
            />
          </div>
        </div>
        <Sparkline data={monitor.series} color={sparkColor} width={120} height={40}/>
      </div>
    </div>
  );
};

// — Audience breakdown (AI for Customers vs AI for Reps).
const AudienceBreakdownCard = ({ audience, title, handled, handledShare, deflectRate, csatLabel, csatScore, frtLabel, frtScore, highlight, warning }) => {
  const palette = audience === "air"
    ? { fg: "#7B22A4", bg: "#F5EBFD", border: "#EBD2FF" }
    : { fg: "#0165E4", bg: "#EBF1FF", border: "#CBDCFF" };
  return (
    <div style={{
      padding: "16px 18px",
      border: "1px solid #E8EAF0", borderRadius: 10,
      background: "#fff",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PerfAudienceTag audience={audience} size="md"/>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
        }}>{title}</span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: 28, lineHeight: 1, color: "#1F242D", letterSpacing: "-0.01em",
        }}>{handled.toLocaleString()}</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
        }}>conversations handled · {handledShare}%</div>
      </div>

      <div style={{
        height: 6, borderRadius: 999, background: "#F2F3F7", overflow: "hidden",
        marginTop: -8,
      }}>
        <div style={{ height: "100%", width: `${handledShare}%`, background: palette.fg, borderRadius: 999 }}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {deflectRate != null && (
          <PerfStat label="Deflection rate" value={`${deflectRate}%`} score={deflectRate}/>
        )}
        {csatLabel && (
          <PerfStat label="CSAT" value={csatLabel} score={csatScore}/>
        )}
        {frtLabel && (
          <PerfStat label="First response time" value={frtLabel} score={frtScore}/>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {highlight && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 6,
            fontFamily: "var(--font-sans)", fontSize: 12, color: "#1F7A4B", lineHeight: 1.45,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
            {highlight}
          </div>
        )}
        {warning && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 6,
            fontFamily: "var(--font-sans)", fontSize: 12, color: "#8A5A08", lineHeight: 1.45,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 8v5"/>
              <path d="M12 17h.01"/>
            </svg>
            {warning}
          </div>
        )}
      </div>
    </div>
  );
};

const PerfStat = ({ label, value, score }) => {
  const tone = score == null ? null
             : score >= 80 ? "#1F7A4B"
             : score >= 65 ? "#8A5A08"
             :                "#A8202A";
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "#697182",
        textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700,
        color: tone || "#1F242D",
      }}>{value}</div>
    </div>
  );
};

// — Recommendation card.
const RecommendationCard = ({ rec }) => {
  const palette = rec.severity === "fail"
    ? { bg: "#FFEDED", border: "#F5C0C5", fg: "#A8202A", label: "Off target" }
    : rec.severity === "warning"
      ? { bg: "#FFF4E6", border: "#FDE2B4", fg: "#8A5A08", label: "Watch" }
      : rec.severity === "ready"
        ? { bg: "#E8F5EE", border: "#C5E5D2", fg: "#1F7A4B", label: "Ready" }
        :  { bg: "#EBF1FF", border: "#CBDCFF", fg: "#0E3280", label: "Optimize" };

  const Icon = rec.severity === "ready" ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>
  ) : rec.severity === "optimize" ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2 4 14h7l-1 8 7-12h-7l1-8z"/></svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  );

  const fromPalette = rec.from === "air" ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" }
                    : rec.from === "aic" ? { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" } : null;
  const toPalette   = rec.to   === "air" ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" }
                    : rec.to   === "aic" ? { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" } : null;

  const goalNames = (rec.relatedGoals || [])
    .map(id => (PERFORMANCE_GOALS.find(g => g.id === id) || {}).title)
    .filter(Boolean);
  return (
    <div style={{
      padding: "16px 18px",
      border: "1px solid #E8EAF0", borderRadius: 10,
      background: "#fff",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: palette.bg, color: palette.fg,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${palette.border}`,
        }}>
          {Icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {(rec.topic || (fromPalette && toPalette)) && (
            <div style={{
              display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 6,
            }}>
              {rec.topic && (
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "2px 8px",
                  background: "#F2F3F7", color: "#3F4654",
                  fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
                  letterSpacing: "0.02em", borderRadius: 999,
                }}>{rec.topic}</span>
              )}
              {fromPalette && toPalette && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", padding: "1px 7px",
                    background: fromPalette.bg, color: fromPalette.fg,
                    fontFamily: "var(--font-sans)", fontWeight: 700, borderRadius: 999, fontSize: 9.5,
                    letterSpacing: "0.02em",
                  }}>{fromPalette.label}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9099AB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                  <span style={{
                    display: "inline-flex", alignItems: "center", padding: "1px 7px",
                    background: toPalette.bg, color: toPalette.fg,
                    fontFamily: "var(--font-sans)", fontWeight: 700, borderRadius: 999, fontSize: 9.5,
                    letterSpacing: "0.02em",
                  }}>{toPalette.label}</span>
                </span>
              )}
              <span style={{ flex: 1 }}/>
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "2px 9px",
                background: palette.bg, color: palette.fg,
                fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
                letterSpacing: "0.02em", borderRadius: 999,
                border: `1px solid ${palette.border}`,
              }}>{palette.label}</span>
            </div>
          )}
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
            marginBottom: 4,
          }}>{rec.title}</div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.5,
          }}>{rec.cause}</div>
          {goalNames.length > 0 && (
            <div style={{
              marginTop: 6,
              display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
              fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#697182",
            }}>
              <span>Related goal{goalNames.length > 1 ? "s" : ""}:</span>
              {goalNames.map(n => (
                <span key={n} style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "1px 7px",
                  background: "#F2F3F7", color: "#3F4654",
                  fontSize: 11, fontWeight: 600, borderRadius: 999,
                }}>{n}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{
        borderTop: "1px solid #F0F2F6",
        paddingTop: 10,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "#697182",
          textTransform: "uppercase", letterSpacing: "0.04em",
        }}>Suggested actions</div>
        {rec.actions.map((a, i) => (
          <button key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px",
            border: "1px solid #E8EAF0", background: "#fff",
            color: "#1F242D",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 8, cursor: "pointer",
            textAlign: "left", width: "100%",
            transition: "all 140ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FAFBFD"; e.currentTarget.style.borderColor = "#BBD1FF"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E8EAF0"; }}>
            <span style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background: "#EBF1FF", color: "#0165E4",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {a.icon === "task" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              ) : a.icon === "bookOpen" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              ) : a.icon === "sparkles" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              )}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div>{a.label}</div>
              <div style={{ fontSize: 11.5, color: "#697182", fontWeight: 500, marginTop: 1 }}>{a.target}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9099AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
};

// — Topic recommendation card: "this topic is doing X — do Y next" guidance.
const TopicRecommendationCard = ({ topic, from, to, kind, headline, detail, primaryAction, secondaryAction, stats }) => {
  const accent = kind === "warn"
    ? { bg: "#FFF4E6", border: "#FDE2B4", fg: "#8A5A08", icon: "warning", label: "Watch" }
    : kind === "expand"
      ? { bg: "#EBF1FF", border: "#CBDCFF", fg: "#0E3280", icon: "bolt",    label: "Optimize" }
      :  { bg: "#E8F5EE", border: "#C5E5D2", fg: "#1F7A4B", icon: "sparkle", label: "Ready" };

  const fromPalette = from === "air" ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" } : { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" };
  const toPalette   = to === "air"   ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" } : { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" };

  return (
    <div style={{
      padding: "16px 18px",
      border: "1px solid #E8EAF0", borderRadius: 10,
      background: "#fff",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {/* Header row: icon + headline + tone pill */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: accent.bg, color: accent.fg,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${accent.border}`,
        }}>
          {kind === "warn" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          ) : kind === "expand" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2 4 14h7l-1 8 7-12h-7l1-8z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>
          )}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 4,
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px",
              background: "#F2F3F7", color: "#3F4654",
              fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.02em", borderRadius: 999,
            }}>{topic}</span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontFamily: "var(--font-sans)", fontSize: 10.5, color: "#697182", fontWeight: 600,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", padding: "1px 7px",
                background: fromPalette.bg, color: fromPalette.fg,
                fontWeight: 700, borderRadius: 999, fontSize: 9.5,
              }}>{fromPalette.label}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9099AB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
              <span style={{
                display: "inline-flex", alignItems: "center", padding: "1px 7px",
                background: toPalette.bg, color: toPalette.fg,
                fontWeight: 700, borderRadius: 999, fontSize: 9.5,
              }}>{toPalette.label}</span>
            </span>
            <span style={{ flex: 1 }}/>
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 9px",
              background: accent.bg, color: accent.fg,
              fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.02em", borderRadius: 999,
              border: `1px solid ${accent.border}`,
            }}>{accent.label}</span>
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
            lineHeight: 1.35,
          }}>{headline}</div>
        </div>
      </div>

      {/* Detail */}
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#5F6675", lineHeight: 1.5,
        paddingLeft: 42,
      }}>{detail}</div>

      {/* Stats strip */}
      {stats && stats.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          gap: 12,
          padding: "10px 12px",
          background: "#FAFBFD", borderRadius: 8,
          marginLeft: 42,
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, color: "#697182",
                textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3,
              }}>{s.label}</div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
              }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, paddingLeft: 42 }}>
        <button style={{
          padding: "7px 14px",
          border: 0, background: "#0165E4", color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {primaryAction}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>
        {secondaryAction && (
          <button style={{
            padding: "7px 14px",
            border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600,
            borderRadius: 6, cursor: "pointer",
          }}>{secondaryAction}</button>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { PerformancePanel });

// — Topics performance table.
const PERFORMANCE_TOPICS = [
  {
    id: "tracking", label: "Order tracking",     volume: 1240,
    aiShare: 86, repShare: 14,
    csat: 4.6, csatTone: "good",
    aht: { ai: "1.4 min", rep: "3.1 min" },
  },
  {
    id: "returns",  label: "Returns & refunds",  volume:  962,
    aiShare: 72, repShare: 28,
    csat: 4.32, csatTone: "warn",
    aht: { ai: "2.9 min", rep: "5.4 min" },
  },
  {
    id: "product",  label: "Product questions",  volume:  618,
    aiShare: 81, repShare: 19,
    csat: 4.5, csatTone: "good",
    aht: { ai: "1.8 min", rep: "2.8 min" },
  },
  {
    id: "account",  label: "Account & login",    volume:  482,
    aiShare: 44, repShare: 56,
    csat: 4.1, csatTone: "warn",
    aht: { ai: "2.2 min", rep: "4.6 min" },
  },
  {
    id: "shipping", label: "Shipping delays",    volume:  402,
    aiShare: 38, repShare: 62,
    csat: 3.9, csatTone: "bad",
    aht: { ai: "2.4 min", rep: "5.8 min" },
  },
];

const TopicsPerformanceTable = () => (
  <div style={{
    border: "1px solid #E8EAF0", borderRadius: 10,
    background: "#fff", overflow: "hidden",
  }}>
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(200px, 1.4fr) minmax(180px, 1.4fr) minmax(170px, 1.1fr) 100px",
      gap: 16, padding: "10px 16px",
      background: "#FAFBFD", borderBottom: "1px solid #E8EAF0",
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
      color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
    }}>
      <div>Topic</div>
      <div>AI vs Rep handled</div>
      <div>AHT (AI · Rep)</div>
      <div>CSAT</div>
    </div>
    {PERFORMANCE_TOPICS.map((t, i) => (
      <TopicPerformanceRow key={t.id} topic={t} isFirst={i === 0}/>
    ))}
  </div>
);

const TopicPerformanceRow = ({ topic, isFirst }) => {
  const csatPalette = topic.csatTone === "good"
    ? { fg: "#1F7A4B" }
    : topic.csatTone === "warn"
      ? { fg: "#8A5A08" }
      : { fg: "#A8202A" };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(200px, 1.4fr) minmax(180px, 1.4fr) minmax(170px, 1.1fr) 100px",
      gap: 16, padding: "12px 16px",
      alignItems: "center",
      borderTop: isFirst ? 0 : "1px solid #F0F2F6",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
          lineHeight: 1.35,
        }}>{topic.label}</div>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: 4,
            display: "inline-flex", alignItems: "center", gap: 3,
            padding: 0, border: 0, background: "transparent",
            color: "#0165E4",
            fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
          See common questions
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
        <div style={{
          height: 8, borderRadius: 999, overflow: "hidden",
          background: "#F5EBFD",
          display: "flex",
        }}>
          <div style={{
            height: "100%", width: `${topic.aiShare}%`,
            background: "#0165E4",
          }}/>
          <div style={{
            height: "100%", width: `${topic.repShare}%`,
            background: "#7B22A4",
          }}/>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#697182",
          fontWeight: 600,
        }}>
          <span style={{ color: "#0165E4" }}>AI {topic.aiShare}%</span>
          <span style={{ color: "#7B22A4" }}>Reps {topic.repShare}%</span>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#3F4654",
        flexWrap: "wrap",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0165E4" }}/>
          {topic.aht.ai}
        </span>
        <span style={{ color: "#DCE0E9" }}>·</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7B22A4" }}/>
          {topic.aht.rep}
        </span>
      </div>

      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: csatPalette.fg,
      }}>{topic.csat.toFixed(topic.csat < 5 ? 2 : 0)} <span style={{ color: "#9099AB", fontSize: 11, fontWeight: 600 }}>/ 5</span></div>
    </div>
  );
};
