// =============================================================
// Resources — Procedures, Knowledge, Tools, Guardrails, Computed Fields
// =============================================================

const Resources = ({ subtab, setSubtab }) => {
  const tabs = [
    { id: "procedures", label: "Procedures",      icon: "bookOpen" },
    { id: "knowledge",  label: "Knowledge Sources", icon: "folder" },
    { id: "tools",      label: "Tools",           icon: "wrench" },
    { id: "guardrails", label: "Guardrails",      icon: "shield" },
    { id: "computed",   label: "Computed Fields", icon: "sparkles" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ padding: "26px 36px 18px" }}>
        <h1 style={{
          fontFamily: "var(--font-sans)", fontWeight: 700,
          fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
          letterSpacing: "-0.01em", color: T.ink, margin: 0,
        }}>Resources</h1>
        <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "10px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
          Reusable building blocks every goal pulls from, procedures, knowledge, tools, guardrails, and computed fields.
          Owned globally, attached by many.
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 36px 60px" }}>
        {subtab === "procedures" && <ProceduresList/>}
        {subtab === "knowledge"  && <KnowledgeList/>}
        {subtab === "tools"      && <ToolsList/>}
        {subtab === "guardrails" && <GuardrailsList/>}
        {subtab === "computed"   && <ComputedFieldsList/>}
      </div>
    </div>
  );
};

const ResHeader = ({ title, sub, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
    <div>
      <H size="h3">{title}</H>
      <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "4px 0 0", lineHeight: "var(--leading-body)" }}>{sub}</p>
    </div>
    {action}
  </div>
);

// Plan-editing-lives-here banner
const PlanLivesHere = () => (
  <div style={{
    background: "linear-gradient(180deg, #FFFCE8 0%, #FFFFFF 100%)",
    border: "1px solid #F9E089", borderRadius: 12,
    padding: "12px 16px", marginBottom: 16,
    display: "flex", gap: 10, alignItems: "flex-start",
  }}>
    <Icon name="info" size={16} strokeWidth={2} style={{ color: "#6e5800", marginTop: 2 }}/>
    <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.55 }}>
      <b>Plan editing lives here.</b> Goals reference procedures, guardrails, and behaviors; they don't
      own them. Editing here updates every goal that attaches this resource.
    </div>
  </div>
);

const TOPIC_SUGGESTIONS = [
  { id: "tracking", name: "Order tracking",    sample: "Where is my order?",        volume: 24, avg: "3.2 min avg", deflectable: 78, automations: ["Order Tracking"] },
  { id: "returns",  name: "Returns & refunds", sample: "How do I return this?",     volume: 18, avg: "5.8 min avg", deflectable: 62, automations: ["Refund Order", "Returns"] },
  { id: "product",  name: "Product questions", sample: "Is this dishwasher safe?",  volume: 12, avg: "2.4 min avg", deflectable: 85, automations: ["Product FAQ"] },
  { id: "account",  name: "Account & login",   sample: "Can't log in to my account",volume:  9, avg: "4.1 min avg", deflectable: 45, automations: ["Account Help"] },
  { id: "shipping", name: "Shipping delays",   sample: "My order is late",          volume:  8, avg: "3.7 min avg", deflectable: 70, automations: ["Shipping Updates"] },
];

const ProceduresList = () => {
  const items = ESCALATIONS_DETAIL.procedures;
  const [selectedTopics, setSelectedTopics] = React.useState([]);
  const toggle = id => setSelectedTopics(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const selectedSet  = TOPIC_SUGGESTIONS.filter(t => selectedTopics.includes(t.id));
  const coverage     = selectedSet.reduce((sum, t) => sum + t.volume, 0);
  const avgDeflect   = selectedSet.length
    ? Math.round(selectedSet.reduce((sum, t) => sum + t.deflectable, 0) / selectedSet.length)
    : null;

  return (
    <div>
      <ResHeader title="Procedures" sub="Step-by-step playbooks the AI follows." action={<Btn kind="ink" icon="plus" size="sm">New procedure</Btn>}/>

      {/* Suggested procedures from conversations */}
      <SuggestedProceduresPanel
        topics={TOPIC_SUGGESTIONS}
        selected={selectedTopics}
        onToggle={toggle}
        coverage={coverage}
        avgDeflect={avgDeflect}
      />

      <PlanLivesHere/>
      <Card padding={0} style={{ overflow: "hidden" }}>
        {items.map((p, i) => (
          <div key={p.id} style={{
            display: "grid", gridTemplateColumns: "1.5fr 0.8fr 1.5fr 0.6fr 80px",
            gap: 14, padding: "14px 18px", alignItems: "center",
            borderTop: i ? `1px solid ${T.rule}` : "none",
          }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{p.steps} steps · updated {p.updated}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {p.approval && <Chip tone="warn" icon="clock">Pending approval</Chip>}
            </div>
            <div style={{ fontSize: 12, color: T.ink3 }}>
              Shared with {p.attachedTo.length} goal{p.attachedTo.length === 1 ? "" : "s"}: {p.attachedTo.slice(0,2).join(", ")}
              {p.attachedTo.length > 2 && ` + ${p.attachedTo.length - 2}`}
            </div>
            <div></div>
            <Btn kind="ghost" size="sm" icon="edit">Edit</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
};

const KnowledgeList = () => {
  const items = [
    { name: "Test Bobs",                     type: "Sitemap",      status: "error",  docs: 4100 },
    { name: "Catawiki test 2",               type: "Public URLs",  status: "error",  docs: 1 },
    { name: "Catawiki test",                 type: "Public URLs",  status: "error",  docs: 1 },
    { name: "Spider Merch",                  type: "Public URLs",  status: "indexed", docs: 2 },
    { name: "Kustomer full site",            type: "Sitemap",      status: "error",  docs: 528 },
    { name: "Fi",                            type: "Zendesk",      status: "indexed", docs: 870 },
    { name: "Kustomer website2",             type: "Sitemap",      status: "indexed", docs: 15 },
  ];
  return (
    <div>
      <ResHeader title="Knowledge Sources" sub="Where the AI learns from. URLs, sitemaps, KBs, uploaded files."
        action={<Btn kind="secondary" icon="plus" size="sm">Add source</Btn>}/>
      <Card padding={0} style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${T.rule}`, display: "flex", gap: 10, background: T.bgSoft }}>
          <Icon name="search" size={13} strokeWidth={2} style={{ color: T.ink4 }}/>
          <input placeholder="Search sources…" style={{
            flex: 1, border: 0, background: "transparent", outline: 0,
            fontSize: 13, fontFamily: "var(--font-sans)",
          }}/>
          <Btn kind="secondary" size="sm">All status</Btn>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bgSoft }}>
              {["Source","Type","Status","Documents",""].map((h, i) => (
                <th key={i} style={{ ...tdSt, padding: "10px 18px", fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td style={tdSt}>{it.name}</td>
                <td style={tdSt}>{it.type}</td>
                <td style={tdSt}>
                  <Chip tone={it.status === "error" ? "danger" : "success"} icon={it.status === "error" ? "alert" : "check"}>
                    {it.status === "error" ? "Error" : "Indexed"}
                  </Chip>
                </td>
                <td style={{ ...tdSt, fontVariantNumeric: "tabular-nums" }}>{it.docs}</td>
                <td style={tdSt}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={iconBtnSm} title="Edit"><Icon name="edit" size={12} strokeWidth={1.9}/></button>
                    <button style={iconBtnSm} title="Refresh"><Icon name="refresh" size={12} strokeWidth={1.9}/></button>
                    <button style={iconBtnSm} title="Delete"><Icon name="x" size={12} strokeWidth={2.2}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const ToolsList = () => (
  <div>
    <ResHeader title="Tools" sub="Capabilities the AI can call." action={<Btn kind="secondary" icon="plus" size="sm">New tool</Btn>}/>
    <PlanLivesHere/>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {ESCALATIONS_DETAIL.tools.map(t => (
        <Card key={t.id} padding={16}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: T.bgSoft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="wrench" size={14} strokeWidth={1.8}/>
            </span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{t.name}</div>
              <div style={{ fontSize: 11.5, color: T.ink3 }}>{t.provider}</div>
            </div>
          </div>
          <Chip tone="default">Used by {t.usedBy} goals</Chip>
        </Card>
      ))}
    </div>
  </div>
);

const GuardrailsList = () => (
  <div>
    <ResHeader title="Guardrails" sub="Rules and thresholds protecting outcomes." action={<Btn kind="secondary" icon="plus" size="sm">New guardrail</Btn>}/>
    <PlanLivesHere/>
    <Card padding={0} style={{ overflow: "hidden" }}>
      {ESCALATIONS_DETAIL.guardrails.map((g, i) => (
        <div key={g.id} style={{
          display: "grid", gridTemplateColumns: "1.5fr 130px 100px 1fr",
          gap: 12, padding: "14px 18px", alignItems: "center",
          borderTop: i ? `1px solid ${T.rule}` : "none",
        }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{g.name}</div>
          <Chip tone={g.tone === "danger" ? "danger" : "warn"}>{g.metric}</Chip>
          <div style={{ fontSize: 12, color: T.ink3 }}>Trips: {g.trips}</div>
          <div style={{ fontSize: 12, color: T.ink3 }}>Attached to all goals</div>
        </div>
      ))}
    </Card>
  </div>
);

const ComputedFieldsList = () => {
  const fields = [
    { name: "AI-Generated CSAT",       scope: "Conversation", trigger: "kustomer.conversation.update:done", out: "ai_csat",                value: "1.0–5.0" },
    { name: "Customer Health Score",   scope: "Customer",     trigger: "rolling (90d)",                     out: "ai_customer_health",     value: "0–100" },
    { name: "Company Health Score",    scope: "Company",      trigger: "rolling (aggregate)",               out: "ai_company_health",      value: "0–100" },
  ];
  return (
    <div>
      <ResHeader title="Computed Fields"
        sub="AI-generated attributes written back to Conversation, Customer, and Company records. 3-per-Klass limit."/>
      <div style={{
        background: "rgba(110,121,224,0.08)", border: `1px solid ${T.peri}`,
        borderRadius: 10, padding: "12px 16px", marginBottom: 16,
        display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, color: T.ink2,
      }}>
        <Icon name="lock" size={14} strokeWidth={2} style={{ color: T.periDeep, marginTop: 2 }}/>
        <div>
          <b style={{ color: T.ink }}>Read-only in M1.</b> Three fields ship out of the box. Admin
          authoring opens in M2, until then, fields are created implicitly through monitor and goal config.
        </div>
      </div>
      <Card padding={0} style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bgSoft }}>
              {["Field","Scope","Trigger","Output key","Value range"].map((h, i) => (
                <th key={i} style={{ padding: "10px 18px", borderBottom: `1px solid ${T.rule}`, textAlign: "left", fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={i}>
                <td style={tdSt}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="sparkles" size={13} strokeWidth={2} style={{ color: T.periDeep }}/>
                    <span style={{ fontWeight: 700, color: T.ink }}>{f.name}</span>
                  </div>
                </td>
                <td style={tdSt}>{f.scope}</td>
                <td style={{ ...tdSt, fontFamily: "var(--font-mono)", fontSize: 11.5, color: T.ink3 }}>{f.trigger}</td>
                <td style={{ ...tdSt, fontFamily: "var(--font-mono)", fontSize: 11.5, color: T.ink3 }}>{f.out}</td>
                <td style={tdSt}>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const iconBtnSm = {
  width: 24, height: 24, borderRadius: 6, border: `1px solid ${T.rule}`,
  background: "#fff", color: T.ink3, cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ── Suggested procedures: pick topics → generate ────────────
const SuggestedProceduresPanel = ({ topics, selected, onToggle, coverage, avgDeflect }) => {
  return (
    <div style={{
      background: "linear-gradient(180deg, #FFFCE8 0%, #FFFFFF 100%)",
      border: "1px solid #F9E089",
      borderRadius: 14, padding: "22px 24px",
      marginBottom: 28,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 999,
          background: T.yellow, color: T.ink,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon name="sparkles" size={15} strokeWidth={2}/>
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0, fontSize: "var(--text-h3)", fontWeight: 700,
            color: T.ink, lineHeight: "var(--leading-h3)",
          }}>Suggested procedures from your conversations</h3>
          <p style={{
            margin: "4px 0 0", fontSize: "var(--text-body)", color: T.ink2,
            lineHeight: "var(--leading-body)", maxWidth: "72ch",
          }}>
            From the last 90 days. Pick the topics you want AI to handle, we'll draft procedures for each and attach them to the right goals.
          </p>
        </div>
        <Btn
          kind={selected.length ? "ink" : "secondary"}
          icon="sparkles"
          size="sm"
          style={selected.length ? undefined : { opacity: 0.55, cursor: "not-allowed" }}
        >
          Generate {selected.length || ""} procedure{selected.length === 1 ? "" : "s"}
        </Btn>
      </div>

      {/* Stats band */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        background: "#fff", border: `1px solid ${T.rule}`,
        borderRadius: 10, padding: "12px 18px", marginBottom: 16,
      }}>
        <StatBlock label="Topics selected" value={`${selected.length}`} sub={`of ${topics.length}`}/>
        <StatBlock label="Conversation coverage" value={`${coverage}%`} sub="of last 90 days" border/>
        <StatBlock label="Avg deflectable"
          value={avgDeflect != null ? `${avgDeflect}%` : ","}
          sub="AI can fully handle"
          border/>
      </div>

      {/* Topic cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {topics.map(t => {
          const on = selected.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => onToggle(t.id)}
              style={{
                textAlign: "left", padding: "14px 16px",
                border: `1px solid ${on ? T.ink : T.rule}`,
                background: on ? "rgba(31,42,46,0.03)" : "#fff",
                borderRadius: 10, cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "border-color 140ms, background 140ms",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{
                    fontSize: "var(--text-h4)", fontWeight: 700, color: T.ink,
                  }}>{t.name}</div>
                  <div style={{
                    fontSize: "var(--text-body)", color: T.ink3, fontStyle: "italic", marginTop: 2,
                  }}>"{t.sample}"</div>
                </div>
                <span style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: `1px solid ${on ? T.ink : T.rule}`,
                  background: on ? T.ink : "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  {on && <Icon name="check" size={11} strokeWidth={3} style={{ color: "#fff" }}/>}
                </span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontSize: "var(--text-value)", color: T.ink2, marginTop: 12, fontWeight: 600,
              }}>
                <span><b style={{ color: T.ink }}>{t.volume}%</b> of volume</span>
                <span style={{ color: T.ink3, fontWeight: 500 }}>{t.avg}</span>
              </div>
              {/* mini volume bar */}
              <div style={{
                width: "100%", height: 4, background: "rgba(31,42,46,0.07)",
                borderRadius: 999, overflow: "hidden", marginTop: 8,
              }}>
                <div style={{
                  width: `${Math.min(100, t.volume * 3)}%`,
                  height: "100%",
                  background: T.ink2,
                  borderRadius: 999,
                }}/>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {t.automations.map(a => (
                  <span key={a} style={{
                    fontSize: "var(--text-accent)", fontWeight: 600,
                    padding: "3px 10px", borderRadius: 999,
                    background: "rgba(31,42,46,0.05)", color: T.ink2,
                  }}>{a}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const StatBlock = ({ label, value, sub, border }) => (
  <div style={{
    paddingLeft: border ? 18 : 0,
    borderLeft: border ? `1px solid ${T.rule}` : "none",
  }}>
    <div style={{
      fontSize: "var(--text-accent)", fontWeight: 600,
      letterSpacing: "0.05em", textTransform: "uppercase",
      color: T.ink3, marginBottom: 4,
    }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{
        fontSize: 22, fontWeight: 700, color: T.ink,
        fontVariantNumeric: "tabular-nums", lineHeight: 1.1,
      }}>{value}</span>
      <span style={{ fontSize: "var(--text-value)", color: T.ink3 }}>{sub}</span>
    </div>
  </div>
);

Object.assign(window, { Resources });
