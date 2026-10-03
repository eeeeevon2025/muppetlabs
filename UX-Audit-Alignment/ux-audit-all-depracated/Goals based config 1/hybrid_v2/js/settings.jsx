// =============================================================
// Settings — only items from canonical doc OR Prototype A.
//   AI for Customers (canonical Settings > General sub-pages)
//   AI for Reps      (Prototype A's Copilot + Summaries tabs)
// =============================================================

const Settings = ({ subtab, setSubtab }) => {
  const tabs = [
    { id: "aic", label: "AI for Customers", icon: "chat" },
    { id: "air", label: "AI for Reps",      icon: "headset" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ padding: "26px 36px 18px", borderBottom: `1px solid ${T.rule}` }}>
        <Eyebrow>Settings</Eyebrow>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 28,
          letterSpacing: "-0.015em", color: T.ink, margin: "6px 0 0", lineHeight: 1.15,
        }}>Surface-level configuration.</h1>
        <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "6px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
          Settings that apply across every goal. Goals are the destinations; these are the surfaces.
        </p>
      </div>
      <TabBar tabs={tabs} active={subtab} onChange={setSubtab}/>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 36px 60px" }}>
        {subtab === "aic" && <SettingsAIC/>}
        {subtab === "air" && <SettingsAIR/>}
      </div>
    </div>
  );
};

// ── AI for Customers — 8 sub-pages from canonical Settings > General
const SettingsAIC = () => {
  const sections = [
    { id: "general",      title: "General AI Automation Settings", desc: "Core AI automation configuration: enable AIC, scope, and global defaults." },
    { id: "guardrails",   title: "Guardrails",                      desc: "Org-wide hard rules and thresholds that constrain all AI behavior." },
    { id: "handoff",      title: "Handoff",                         desc: "Rules for transferring conversations from AI to humans." },
    { id: "conversation", title: "Conversation Start",              desc: "Greetings, intent capture, and initial triage." },
    { id: "verification", title: "Verification",                    desc: "Identity verification and authentication." },
    { id: "abandonment",  title: "Abandonment",                     desc: "How AI handles dropped or stale conversations." },
    { id: "fallback",     title: "Fallback",                        desc: "What happens when AI can't resolve — defaults and timeouts." },
    { id: "hours",        title: "Business Hours",                  desc: "When AI is active vs handed off to scheduled queues." },
  ];
  return (
    <div style={{ maxWidth: 860 }}>
      <ResHeader title="AI for Customers" sub="From the canonical Settings > General page."
        action={<Btn kind="ink" icon="check" size="sm">Save</Btn>}/>
      <div style={{ display: "grid", gap: 10 }}>
        {sections.map(s => (
          <details key={s.id} style={{
            border: `1px solid ${T.rule}`, borderRadius: 10,
            background: "#fff", padding: 0,
          }}>
            <summary style={{
              listStyle: "none", padding: "14px 18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{s.title}</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{s.desc}</div>
              </div>
              <Icon name="chevronDown" size={14} strokeWidth={2} style={{ color: T.ink4 }}/>
            </summary>
            <div style={{
              padding: "12px 18px 18px", borderTop: `1px solid ${T.rule}`,
              fontSize: 12.5, color: T.ink3, fontStyle: "italic",
            }}>
              Placeholder — preserved from canonical Settings &gt; General.
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

// ── AI for Reps — Copilot + Summaries (from Prototype A)
const SettingsAIR = () => {
  const [tab, setTab] = React.useState("copilot");
  return (
    <div style={{ maxWidth: 860 }}>
      <ResHeader title="AI for Reps" sub="From Prototype A's AI for Reps page."
        action={<Btn kind="ink" icon="check" size="sm">Save</Btn>}/>
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${T.rule}`, marginBottom: 18 }}>
        {[
          { id: "copilot", label: "Copilot" },
          { id: "summaries", label: "Summaries and Signals" },
        ].map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "9px 14px", border: 0, background: "transparent",
              color: on ? T.ink : T.ink3, fontWeight: on ? 700 : 500,
              fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)",
              borderBottom: `2px solid ${on ? T.ink : "transparent"}`, marginBottom: -1,
            }}>{t.label}</button>
          );
        })}
      </div>

      {tab === "copilot" && (
        <div style={{ display: "grid", gap: 10 }}>
          <ToggleRow label="Copilot"            sub="Master toggle for all Copilot features." defaultOn/>
          <ToggleRow label="Proactive suggestions" sub="Surface next-best-action while reps reply." defaultOn>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <ModeButton label="Quality" on/>
              <ModeButton label="Speed"/>
            </div>
          </ToggleRow>
          <ToggleRow label="Draft replies"      sub="Generate full reply drafts that reps can edit before sending." defaultOn/>
          <ToggleRow label="Typeahead"          sub="Inline suggestions as the rep types." defaultOn/>
          <ToggleRow label="Translations"       sub="Translate inbound + outbound. Exclusions: Kustomer, Kusty, AS-1024." defaultOn/>
        </div>
      )}

      {tab === "summaries" && (
        <div style={{ display: "grid", gap: 10 }}>
          <ToggleRow label="Conversation summaries" sub="Auto-summarize threads at handoff and on close." defaultOn/>
          <ToggleRow label="Sentiment signal"  sub="Detect customer mood throughout the conversation." defaultOn/>
          <ToggleRow label="Urgency signal"    sub="Flag time-sensitive cases." defaultOn/>
          <ToggleRow label="Intent signal"     sub="Classify what the customer is trying to do."/>
          <ToggleRow label="Churn risk signal" sub="Flag customers at risk of churning."/>
        </div>
      )}
    </div>
  );
};

const ToggleRow = ({ label, sub, defaultOn, children }) => {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div style={{
      border: `1px solid ${T.rule}`, background: "#fff", borderRadius: 10,
      padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{label}</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{sub}</div>
        </div>
        <Toggle on={on} onChange={setOn}/>
      </div>
      {on && children}
    </div>
  );
};

const ModeButton = ({ label, on }) => (
  <button style={{
    padding: "6px 14px", borderRadius: 999,
    border: `1px solid ${on ? T.ink : T.rule}`,
    background: on ? T.ink : "#fff", color: on ? "#fff" : T.ink,
    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)",
  }}>{label}</button>
);

Object.assign(window, { Settings });
