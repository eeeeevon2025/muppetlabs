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
      <div style={{ padding: "26px 36px 18px", borderBottom: `1px solid ${T.rule}` }}>
        <Eyebrow>Resources</Eyebrow>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 28,
          letterSpacing: "-0.015em", color: T.ink, margin: "6px 0 0", lineHeight: 1.15,
        }}>The shared library of building blocks goals attach.</h1>
        <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "6px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
          Procedures, knowledge, tools, guardrails, and computed fields don't belong to a single goal —
          they're owned globally and attached by many.
        </p>
      </div>
      <TabBar tabs={tabs} active={subtab} onChange={setSubtab}/>
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

const ProceduresList = () => {
  const items = ESCALATIONS_DETAIL.procedures;
  return (
    <div>
      <ResHeader title="Procedures" sub="Step-by-step playbooks the AI follows." action={<Btn kind="secondary" icon="plus" size="sm">New procedure</Btn>}/>
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
          authoring opens in M2 — until then, fields are created implicitly through monitor and goal config.
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

Object.assign(window, { Resources });
