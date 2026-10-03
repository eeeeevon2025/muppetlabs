// =============================================================
// Improve — cross-goal Suggestions inbox, promoted to top-level.
// (Hybrid v2 · Action 3 from the prototype-comparison verdict)
// =============================================================

const Improve = ({ goals, onOpenGoal }) => {
  // Cross-goal suggestions pulled from per-goal ESCALATIONS_DETAIL +
  // a couple of cross-goal additions for demo realism.
  const items = [
    ...ESCALATIONS_DETAIL.suggestions.map(s => ({ ...s, goal: "Reduce escalations", goalId: "escalations" })),
    { id: "x1", confidence: "high", title: "Update knowledge: return policy v4",                     body: "Help Center has a v4 of the return policy. Update the source so Customer AI quotes the current text.",                              impact: "Accuracy",       goal: "Improve CSAT",       goalId: "csat"   },
    { id: "x2", confidence: "med",  title: "Add Rep AI behavior for backordered items",              body: "Reps handle 84 backorder convos / week with no draft assist. A new behavior could shave 2 min off AHT.",                            impact: "−3 min AHT",     goal: "Reduce reopen rate", goalId: "reopen" },
    { id: "x3", confidence: "med",  title: "Cross-sell at end of refund flow",                       body: "We see 12% conversion when a save-offer is surfaced after a refund. Add a Customer AI behavior to test on 10% of refund flows.", impact: "+8% revenue",   goal: "Increase upsell revenue 15%", goalId: "upsell" },
    { id: "x4", confidence: "low",  title: "Tighten guardrail: refund threshold $200 → $150",        body: "12 refunds last week landed above $200. Lowering the ceiling to $150 prevents 9 of 12 in shadow tests with no CSAT downside.",     impact: "−$1.4k risk/wk", goal: "Reduce policy violations", goalId: "policy" },
  ];

  const kpis = [
    { label: "Open suggestions",  value: items.length },
    { label: "High confidence",   value: items.filter(i => i.confidence === "high").length },
    { label: "In test",           value: 2 },
    { label: "Accepted QTD",      value: 18 },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
      {/* Hero */}
      <div style={{
        padding: "26px 40px 18px", borderBottom: `1px solid ${T.rule}`,
        background: "linear-gradient(180deg, #FFFCE8 0%, #FFFFFF 100%)",
      }}>
        <Eyebrow>Improve</Eyebrow>
        <h1 style={{
          fontFamily: "var(--font-sans)", fontWeight: 700,
          fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
          letterSpacing: "-0.01em", color: T.ink, margin: "6px 0 0",
        }}>Suggestions across every goal</h1>
        <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "6px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
          AI-proposed plan diffs from your live Quality Monitors and Anomaly Detection.
          Review, test, or apply each suggestion — Kustomer drafts the change for you.
        </p>
      </div>

      <div style={{ padding: "24px 40px 60px" }}>
        {/* KPI tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
          {kpis.map(k => (
            <Card key={k.label} padding={14}>
              <div style={{ fontSize: "var(--text-accent)", color: T.ink3, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 28, fontWeight: 700, color: T.ink, marginTop: 4, lineHeight: 1.1 }}>{k.value}</div>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 0 14px",
        }}>
          <Btn kind="secondary" size="sm">All goals</Btn>
          <Btn kind="secondary" size="sm">All confidence</Btn>
          <Btn kind="secondary" size="sm">Last 30 days</Btn>
          <div style={{ marginLeft: "auto" }}>
            <Btn kind="ghost" size="sm" icon="download">Export</Btn>
          </div>
        </div>

        {/* List */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          {items.map((s, i) => (
            <div key={s.id} style={{
              padding: "16px 20px", borderTop: i ? `1px solid ${T.rule}` : "none",
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center",
            }}>
              <Chip tone={s.confidence === "high" ? "yellow" : "default"}>{s.confidence} confidence</Chip>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>
                  {s.title}
                  <button onClick={() => onOpenGoal(s.goalId)} style={{
                    marginLeft: 10, padding: "2px 8px", borderRadius: 999,
                    border: `1px solid ${T.rule}`, background: "#fff", cursor: "pointer",
                    fontSize: 11, fontWeight: 500, color: T.ink3,
                    fontFamily: "var(--font-sans)",
                  }}>{s.goal}</button>
                </div>
                <div style={{ fontSize: 12.5, color: T.ink3, lineHeight: 1.5 }}>{s.body}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Chip tone="success" icon="trendUp">{s.impact}</Chip>
                <Btn kind="ghost" size="sm">Dismiss</Btn>
                <Btn kind="secondary" size="sm" icon="flask">Test</Btn>
                <Btn kind="ink" size="sm" icon="check">Review</Btn>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

Object.assign(window, { Improve });
