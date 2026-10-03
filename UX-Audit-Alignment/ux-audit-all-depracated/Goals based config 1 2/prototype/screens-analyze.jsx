// ============================================================
// Analyze tab — primary: Conversations table; sub-tabs: Scorecards / Drift / Suggestions
// ============================================================

const AnalyzeScreen = ({ automation, navigate, onApplySuggestion }) => {
  const [subTab, setSubTab] = useState("conversations");
  const [version, setVersion] = useState("v3 (current)");
  const [audience, setAudience] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");

  return (
    <>
      <div className="card-row" style={{ marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Analyze Performance</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--gray-95)" }}>
            Review what this automation actually did on conversations. Drill into a row for the full transcript and per-criterion scoring.
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--gray-30)", marginBottom: 14 }}>
        <SubTab id="conversations" active={subTab} onClick={setSubTab}>
          <Icon name="inbox" size={12} /> Conversations
          <span className="count" style={{ marginLeft: 4, color: "var(--gray-90)" }}>1,247</span>
        </SubTab>
        <SubTab id="scorecards" active={subTab} onClick={setSubTab}>
          <Icon name="activity" size={12} /> Scorecards
        </SubTab>
        <SubTab id="drift" active={subTab} onClick={setSubTab}>
          <Icon name="warning" size={12} /> Drift alerts
          <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 700, padding: "1px 6px", background: "var(--red-15)", color: "var(--red-80)", borderRadius: 999 }}>2</span>
        </SubTab>
        <SubTab id="suggestions" active={subTab} onClick={setSubTab}>
          <Icon name="sparkles" size={12} /> Suggestion queue
          <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 700, padding: "1px 6px", background: "var(--blue-15)", color: "var(--blue-95)", borderRadius: 999 }}>3</span>
        </SubTab>
        <div style={{ marginLeft: "auto", padding: "8px 0", fontSize: 11.5, color: "var(--gray-90)" }}>
          See across all automations →{" "}
          <a style={{ color: "var(--blue-90)", cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("performance")}>Performance</a>
        </div>
      </div>

      {subTab === "conversations" && (
        <>
          <Toolbar>
            <select className="text" value={version} onChange={(e) => setVersion(e.target.value)} style={{ width: "auto", padding: "6px 10px", fontSize: 12.5 }}>
              <option>v3 (current)</option>
              <option>v2</option>
              <option>v1</option>
            </select>
            <SearchInput value={search} onChange={setSearch} placeholder="Search subject or snippet…" />
            <Facet active={audience === "all"}><AudienceFilterAll audience={audience} setAudience={setAudience} /></Facet>
            <select className="text" value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ width: "auto", padding: "6px 10px", fontSize: 12.5 }}>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </Toolbar>

          <div className="card" style={{ padding: 0 }}>
            <div className="conv-row" style={{ background: "var(--gray-20)", minHeight: 38, padding: "8px 18px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--gray-90)", cursor: "default" }}>
              <div>Subject</div>
              <div>Customer</div>
              <div>Topics</div>
              <div>Time</div>
            </div>
            {window.MOCK.CONVERSATIONS.map((c) => (
              <div key={c.id} className="conv-row">
                <div>
                  <div className="subject">{c.subject}{c.flagged && <span style={{ marginLeft: 6, color: "var(--red-80)", fontSize: 10, fontWeight: 700 }}>● Flagged</span>}</div>
                  <span className="snippet">{c.snippet}</span>
                </div>
                <div className="customer">
                  {c.customer.name}
                  <small>Customer since {c.customer.since}</small>
                </div>
                <div className="topics">
                  {c.topics.map((t) => <span key={t} className="topic-chip" style={{ fontSize: 10.5, padding: "2px 7px" }}>{t}</span>)}
                </div>
                <div className="time">{c.when}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {subTab === "scorecards" && <ScorecardsView automation={automation} navigate={navigate} />}
      {subTab === "drift" && <DriftView />}
      {subTab === "suggestions" && (
        <div>
          {window.MOCK.SUGGESTIONS.slice(0, 3).map((s) => (
            <SuggestionCard key={s.id} suggestion={s} onEdit={() => onApplySuggestion(s)} />
          ))}
        </div>
      )}
    </>
  );
};

const SubTab = ({ id, active, onClick, children }) => (
  <div
    onClick={() => onClick(id)}
    style={{
      padding: "8px 12px",
      fontSize: 12.5, fontWeight: 500,
      color: active === id ? "var(--gray-120)" : "var(--gray-95)",
      cursor: "pointer",
      borderBottom: `2px solid ${active === id ? "var(--gray-120)" : "transparent"}`,
      marginBottom: -1,
      display: "inline-flex", alignItems: "center", gap: 6,
    }}
  >{children}</div>
);

const AudienceFilterAll = ({ audience, setAudience }) => {
  // Inline mini-filter — facet just renders nothing, used as a placeholder
  return null;
};

const ScorecardsView = ({ automation }) => {
  const scorecards = [
    { name: "Refund eligibility check", pass: 62, status: "attention", trend: "down" },
    { name: "Tone & empathy", pass: 84, status: "live", trend: "flat" },
    { name: "Resolution within 3 turns", pass: 71, status: "live", trend: "up" },
    { name: "Handoff appropriateness", pass: 88, status: "live", trend: "up" },
  ];
  return (
    <div className="card" style={{ padding: 0 }}>
      {scorecards.map((sc, i) => (
        <div key={sc.name} style={{ padding: "14px 18px", borderBottom: i < scorecards.length - 1 ? "1px solid var(--gray-25)" : "none", display: "grid", gridTemplateColumns: "1.4fr 130px 120px 120px", gap: 16, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600, color: "var(--gray-120)", fontSize: 13 }}>{sc.name}</div>
            <small style={{ color: "var(--gray-90)", fontSize: 11.5 }}>Last 30 days</small>
          </div>
          <div><StatusPill status={sc.status} /></div>
          <div style={{ fontSize: 20, fontWeight: 600, color: sc.pass >= 70 ? "var(--green-80)" : sc.pass >= 50 ? "var(--yellow-110)" : "var(--red-80)", fontVariantNumeric: "tabular-nums" }}>
            {sc.pass}%
          </div>
          <div style={{ height: 32, color: sc.trend === "up" ? "var(--green-70)" : sc.trend === "down" ? "var(--red-70)" : "var(--gray-80)" }}>
            <Sparkline points={sc.trend === "up" ? [62, 64, 66, 68, 70, 72, 73, 74] : sc.trend === "down" ? [72, 70, 68, 65, 64, 63, 62, 62] : [82, 84, 84, 83, 85, 84, 85, 84]} height={32} />
          </div>
        </div>
      ))}
    </div>
  );
};

const DriftView = () => {
  const drifts = [
    { severity: "high", pattern: "Refund eligibility check failing", desc: "Tone & empathy criterion failed in 16% of escalations over 24h. Up from 4% baseline.", when: "Detected 14h ago", goal: "Reduce refund tickets by 20%" },
    { severity: "medium", pattern: "Tool latency: get_order_details", desc: "Average response time 4.2s, p95 8.1s. Up from 1.8s baseline.", when: "Detected 2 days ago", goal: "Auto-resolve order tracking" },
  ];
  return (
    <>
      <div style={{ background: "var(--blue-10)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--blue-25)", marginBottom: 14, fontSize: 12.5, color: "var(--blue-95)" }}>
        <Icon name="info" size={12} /> <b>AI-only.</b> Drift alerts come from the Validation Agent and detect AI behavior anomalies. Human-rep degradation surfaces in <a style={{ color: "var(--blue-95)", textDecoration: "underline", cursor: "pointer" }}>Performance → Monitors</a>.
      </div>
      {drifts.map((d, i) => (
        <div key={i} className="card" style={{ marginBottom: 10 }}>
          <div className="card-row">
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className={`status-pill ${d.severity === "high" ? "attention" : "testing"}`}><span className="pulse"></span>{d.severity}</span>
                <span style={{ fontSize: 11.5, color: "var(--gray-90)" }}>{d.when}</span>
              </div>
              <h3 style={{ margin: "2px 0 6px" }}>{d.pattern}</h3>
              <p style={{ margin: 0, color: "var(--gray-105)", fontSize: 13 }}>{d.desc}</p>
              <div style={{ marginTop: 8 }}><GoalChip name={d.goal} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn ghost sm">Snooze</button>
              <button className="btn sm">Acknowledge</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

Object.assign(window, { AnalyzeScreen, ScorecardsView, DriftView });
