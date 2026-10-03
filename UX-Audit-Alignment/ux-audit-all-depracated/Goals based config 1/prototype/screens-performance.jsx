// ============================================================
// Performance — cross-agent operational rollup
// ============================================================

const PerformanceScreen = ({ navigate, onApplySuggestion }) => {
  const [subTab, setSubTab] = useState("suggestions");
  const [audience, setAudience] = useState("all");

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Performance" }]}
        title="Performance"
        answers={'"How are our agents performing right now?" (AI + human)'}
        actions={
          <>
            <button className="btn"><Icon name="filter" size={13} /></button>
          </>
        }
      />
      <div className="page-body">
        {/* Top facets */}
        <Toolbar>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-90)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Audience</span>
          <AudienceFilter value={audience} onChange={setAudience} />
        </Toolbar>

        {/* Sub-tabs: Monitors / Suggestions / Anomalies (AI-only) */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--gray-30)", marginBottom: 18 }}>
          <PerfTab id="monitors" active={subTab} onClick={setSubTab}>
            <Icon name="activity" size={12} /> Monitors
            <span className="count" style={{ marginLeft: 4, color: "var(--gray-90)" }}>8</span>
          </PerfTab>
          <PerfTab id="suggestions" active={subTab} onClick={setSubTab}>
            <Icon name="sparkles" size={12} /> Suggestions
            <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 700, padding: "1px 6px", background: "var(--blue-15)", color: "var(--blue-95)", borderRadius: 999 }}>{window.MOCK.SUGGESTIONS.length}</span>
          </PerfTab>
          <PerfTab id="anomalies" active={subTab} onClick={setSubTab}>
            <Icon name="warning" size={12} /> Anomalies
            <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, padding: "1px 5px", background: "var(--gray-25)", color: "var(--gray-90)", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>AI only</span>
          </PerfTab>
        </div>

        {subTab === "monitors" && <MonitorsView navigate={navigate} />}
        {subTab === "suggestions" && (
          <>
            <div style={{ background: "var(--blue-10)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--blue-25)", marginBottom: 14, fontSize: 12.5, color: "var(--blue-95)" }}>
              <Icon name="info" size={12} /> Suggestions come from detected patterns across your AI and human conversations. <b>Each one names a specific procedure, KB article, tool, or guardrail to update.</b> Apply, edit, or dismiss — never overwrites anything until you publish.
            </div>
            {window.MOCK.SUGGESTIONS.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onEdit={() => onApplySuggestion(s)} />
            ))}
          </>
        )}
        {subTab === "anomalies" && (
          <>
            <div style={{ background: "var(--blue-10)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--blue-25)", marginBottom: 14, fontSize: 12.5, color: "var(--blue-95)" }}>
              <Icon name="info" size={12} /> <b>AI-only.</b> Anomalies come from the Validation Agent and detect AI behavior drift. Human-rep degradation surfaces in <a style={{ color: "var(--blue-95)", textDecoration: "underline", cursor: "pointer" }} onClick={() => setSubTab("monitors")}>Monitors</a>.
            </div>
            <AnomaliesView />
          </>
        )}
      </div>
    </>
  );
};

const PerfTab = ({ id, active, onClick, children }) => (
  <div
    onClick={() => onClick(id)}
    style={{
      padding: "10px 14px",
      fontSize: 13, fontWeight: 500,
      color: active === id ? "var(--gray-120)" : "var(--gray-95)",
      cursor: "pointer",
      borderBottom: `2px solid ${active === id ? "var(--gray-120)" : "transparent"}`,
      marginBottom: -1,
      display: "inline-flex", alignItems: "center", gap: 6,
    }}
  >{children}</div>
);

const MonitorsView = ({ navigate }) => {
  const monitors = [
    { name: "AI-Generated CSAT", owner: "AI", scope: "All AIC", value: 4.4, status: "live", trend: [4.2, 4.25, 4.3, 4.32, 4.35, 4.38, 4.4, 4.4], goal: "Improve CSAT to 4.6" },
    { name: "Refund eligibility check", owner: "AI", scope: "Refund Order v3", value: 62, status: "attention", trend: [72, 70, 68, 65, 64, 63, 62, 62], goal: "Reduce refund tickets by 20%" },
    { name: "Customer Health Score", owner: "AI", scope: "All customers", value: 82, status: "live", trend: [78, 79, 80, 81, 82, 81, 82, 82], goal: null },
    { name: "Tool latency: get_order", owner: "AI", scope: "Order Tracking", value: 4.2, status: "attention", trend: [1.8, 1.9, 2.1, 2.4, 3.0, 3.6, 4.0, 4.2], goal: "Auto-resolve order tracking", unit: "s" },
    { name: "First reply time", owner: "Human Reps", scope: "Team A", value: 94, status: "live", trend: [150, 140, 130, 120, 110, 100, 96, 94], goal: "Cut first reply time to 90s", unit: "s" },
    { name: "Save attempts", owner: "Human Reps", scope: "Retention team", value: 41, status: "attention", trend: [55, 52, 48, 45, 43, 41, 41, 41], goal: "Save at-risk renewals 80%" },
  ];
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: "10px 18px", background: "var(--gray-20)", borderBottom: "1px solid var(--gray-30)", display: "grid", gridTemplateColumns: "1.6fr 120px 1fr 110px 120px 130px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-90)", alignItems: "center" }}>
        <div>Monitor</div>
        <div>Owner</div>
        <div>Scope · Goal</div>
        <div>Value</div>
        <div>Trend</div>
        <div>Status</div>
      </div>
      {monitors.map((m, i) => (
        <div key={i} style={{ padding: "14px 18px", borderBottom: i < monitors.length - 1 ? "1px solid var(--gray-25)" : "none", display: "grid", gridTemplateColumns: "1.6fr 120px 1fr 110px 120px 130px", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => m.scope.includes("v") || m.scope === "Order Tracking" || m.scope === "All AIC" ? navigate("automation:refund-order:analyze") : null}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--gray-120)" }}>{m.name}</div>
          <div>
            <span className={`chip ${m.owner === "AI" ? "blue" : "gray"}`}>{m.owner}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--gray-105)" }}>
            <div>{m.scope}</div>
            {m.goal && <div style={{ marginTop: 3 }}><GoalChip name={m.goal} /></div>}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: m.status === "live" ? "var(--green-80)" : "var(--red-80)", fontVariantNumeric: "tabular-nums" }}>
            {m.value}{m.unit || ""}
          </div>
          <div style={{ height: 32, color: m.status === "live" ? "var(--green-70)" : "var(--red-70)" }}>
            <Sparkline points={m.trend} height={32} />
          </div>
          <div><StatusPill status={m.status} /></div>
        </div>
      ))}
    </div>
  );
};

const AnomaliesView = () => {
  const anomalies = [
    { severity: "high", source: "Validation Agent", auto: "Refund Order v3", pattern: "Off-script: granted refund > policy ceiling", count: 3, when: "14h ago", goal: "Reduce refund tickets by 20%" },
    { severity: "medium", source: "Validation Agent", auto: "Order Tracking v4", pattern: "Hallucinated shipping date", count: 7, when: "2d ago", goal: "Auto-resolve order tracking" },
    { severity: "medium", source: "Validation Agent", auto: "Damaged Items v1", pattern: "Escalated when policy allowed auto-resolution", count: 12, when: "1d ago", goal: "Reduce refund tickets by 20%" },
  ];
  return (
    <div className="card" style={{ padding: 0 }}>
      {anomalies.map((a, i) => (
        <div key={i} style={{ padding: "14px 18px", borderBottom: i < anomalies.length - 1 ? "1px solid var(--gray-25)" : "none" }}>
          <div className="card-row">
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className={`status-pill ${a.severity === "high" ? "attention" : "testing"}`}><span className="pulse"></span>{a.severity}</span>
                <span style={{ fontSize: 11.5, color: "var(--gray-90)" }}>{a.source} · {a.when}</span>
                <span className="chip blue" style={{ fontSize: 10.5 }}>{a.auto}</span>
              </div>
              <h3 style={{ margin: "2px 0 6px", fontSize: 14, fontWeight: 600 }}>{a.pattern}</h3>
              <div style={{ fontSize: 12, color: "var(--gray-105)" }}>{a.count} conversation{a.count !== 1 && "s"} · <GoalChip name={a.goal} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn ghost sm">Snooze</button>
              <button className="btn sm">Drill into source</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { PerformanceScreen, MonitorsView, AnomaliesView });
