// ============================================================
// Building Blocks, Procedures, Knowledge, Tools, Shared Guardrails
// ============================================================

// ---------------------------------------------------------------
// Overview — names all five blocks, defines each in one line, and
// frames them as the shared parts every AI Automation is built from.
// ---------------------------------------------------------------
const BlocksOverview = ({ navigate }) => {
  const blocks = [
    { id: "blocks-procedures", icon: "code",  name: "Procedures",       count: "8 procedures",
      desc: "Step-by-step instructions the AI follows to handle a situation." },
    { id: "blocks-knowledge",  icon: "book",  name: "Knowledge Sources", count: "5 sources",
      desc: "The content the AI reads to answer questions — help articles, policy PDFs." },
    { id: "blocks-tools",      icon: "tool",  name: "Tools",             count: "9 tools",
      desc: "Actions the AI can take in your other systems, like looking up an order." },
    { id: "blocks-guardrails", icon: "shield",name: "Guardrails",        count: "4 guardrails",
      desc: "Rules that set what the AI is never allowed to do." },
    { id: "blocks-scenarios",  icon: "book",  name: "Scenarios",         count: "12 scenarios",
      desc: "The situations your team handles and what to do — each becomes a draft procedure." },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Building Blocks" }]}
        title="Building Blocks"
        answers={"The shared, reusable parts every AI automation is built from. Set one up once and any automation can use it."}
      />
      <div className="page-body">
        <div style={{ background: "var(--v2-paper-2)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--v2-hairline-2)", marginBottom: 20, fontSize: 12.5, color: "var(--ink-80)", lineHeight: 1.5 }}>
          <Icon name="info" size={12} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--ink-50)" }} />
          Think of these as the parts bin for your AI. An <b style={{ color: "var(--ink-100)" }}>AI automation</b> is assembled from the blocks below — change a block here and every automation that uses it updates too.
        </div>

        <div className="blocks-overview-grid">
          {blocks.map((b) => (
            <button key={b.id} className="blocks-overview-card" onClick={() => navigate(b.id)}>
              <div className="blocks-overview-ico"><Icon name={b.icon} size={18} /></div>
              <div className="blocks-overview-body">
                <div className="blocks-overview-name-row">
                  <span className="blocks-overview-name">{b.name}</span>
                  <span className="blocks-overview-count">{b.count}</span>
                </div>
                <p className="blocks-overview-desc">{b.desc}</p>
              </div>
              <Icon name="chevRight" size={14} />
            </button>
          ))}
        </div>

        <div className="rep-footnote" style={{ marginTop: 18 }}>
          <Icon name="info" size={11} />
          <span>See where blocks are used on any automation's <b>Build</b> tab, under "What the AI knows / does".</span>
        </div>
      </div>
    </>
  );
};

const BlocksProcedures = ({ navigate }) => {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("all");

  const allProcs = [
    { id: "proc-process-refund", name: "Process Return or Refund", scope: "Refund Order", topics: ["Returns & refunds", "Refund order"], steps: 5, updated: "May 18", driver: "Reduce refund tickets by 20%" },
    { id: "proc-damaged", name: "Handle Damaged or Defective Item", scope: "2 automations", topics: ["Returns & refunds"], steps: 4, updated: "May 17", driver: "Reduce refund tickets by 20%" },
    { id: "proc-vip-coupon", name: "Apply Coupon (VIP)", scope: "All Customer AI", topics: ["Billing"], steps: 3, updated: "May 12", driver: null, broad: true },
    { id: "proc-cancel-sub", name: "Cancel Subscription", scope: "Cancel Subscription", topics: ["Cancel subscription"], steps: 6, updated: "May 10", driver: "Save at-risk renewals 80%" },
    { id: "proc-track", name: "Order Tracking Lookup", scope: "2 automations", topics: ["Order tracking"], steps: 3, updated: "May 9", driver: "Auto-resolve order tracking" },
    { id: "proc-shipping-int", name: "International Shipping FAQ", scope: "Order Tracking", topics: ["Order tracking", "Shipping delays"], steps: 4, updated: "May 8", driver: null },
    { id: "proc-account-rec", name: "Account Recovery Verification", scope: "Account Recovery", topics: ["Account & login"], steps: 5, updated: "May 5", driver: null },
    { id: "proc-escalation-rep", name: "Hand off with Customer Context", scope: "All Rep AI", topics: ["Product questions"], steps: 4, updated: "May 4", driver: "Improve CSAT to 4.6", broad: true },
  ];
  const filtered = allProcs.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Building Blocks" }, { label: "Procedures" }]}
        title="Procedures"
        answers={"Step-by-step instructions the AI follows to handle a situation. Procedures are a building block your AI automations share and reuse."}
        actions={
          <>
            <button className="btn"><Icon name="upload" size={13} /> Import</button>
            <button className="btn brand"><Icon name="plus" size={13} /> New procedure</button>
          </>
        }
      />
      <div className="page-body">
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search procedures…" />
          <Facet active={audience === "all"} count={allProcs.length} onClick={() => setAudience("all")}>All</Facet>
          <Facet active={audience === "AIC"} count={allProcs.filter(p=>p.scope.includes("Customers") || !p.scope.includes("Rep")).length} onClick={() => setAudience("AIC")}>Customer AI</Facet>
          <Facet active={audience === "AIR"} count={allProcs.filter(p=>p.scope.includes("Rep")).length} onClick={() => setAudience("AIR")}>Rep AI</Facet>
          <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-50)" }}>Sort: Recently updated</span>
        </Toolbar>

        <div className="table">
          <div className="thead" style={{ gridTemplateColumns: "1.8fr 1.2fr 1fr 60px 80px 40px" }}>
            <div className="cell">Procedure</div>
            <div className="cell">Scope · Associations</div>
            <div className="cell">Drives</div>
            <div className="cell">Steps</div>
            <div className="cell">Updated</div>
            <div className="cell"></div>
          </div>
          {filtered.map((p) => (
            <div key={p.id} className="trow" style={{ gridTemplateColumns: "1.8fr 1.2fr 1fr 60px 80px 40px" }}>
              <div className="cell">
                <b>{p.name}</b>
                <small>{p.topics.join(" · ")}</small>
              </div>
              <div className="cell">
                <span className={`chip ${p.broad ? "purple" : "gray"}`}>
                  {p.broad && <Icon name="globe" size={10} />}
                  {p.scope}
                </span>
              </div>
              <div className="cell">
                {p.driver ? <GoalChip name={p.driver} /> : <span style={{ color: "var(--ink-40)" }}></span>}
              </div>
              <div className="cell mono" style={{ color: "var(--ink-60)" }}>{p.steps}</div>
              <div className="cell" style={{ color: "var(--ink-50)" }}>{p.updated}</div>
              <div className="cell right">
                <button className="btn ghost btn-icon sm" onClick={(e) => e.stopPropagation()}>
                  <Icon name="moreV" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head"><h3>About procedures</h3></div>
        <div className="card">
          <p style={{ fontSize: 12.5, color: "var(--ink-70)", margin: 0, lineHeight: 1.6 }}>
            Procedures are step-by-step instructions the AI follows. Each procedure declares its associations, which automations or audiences it applies to. Editing a multi-scope procedure fires a blast-radius prompt so you know how many automations are affected. <a style={{ color: "var(--ink-100)", borderBottom: "1px solid var(--ink-30)", cursor: "pointer" }}>Learn more →</a>
          </p>
        </div>
      </div>
    </>
  );
};

const BlocksKnowledge = () => {
  const items = [
    { id: "kb-help-center", name: "Help Center · acmeoutdoors.com", type: "URL", indexed: "Just now", docs: 184, scope: "All AI" },
    { id: "kb-refund-policy", name: "Refund Policy 2024", type: "PDF", indexed: "May 18", docs: 1, scope: "Refund Order" },
    { id: "kb-shipping-int", name: "International Shipping Policies", type: "PDF", indexed: "Mar 1", docs: 1, scope: "Order Tracking", attention: "Last updated 2024" },
    { id: "kb-product-cat", name: "Product Catalog Specs", type: "Sheet", indexed: "May 14", docs: 1, scope: "All Customer AI" },
    { id: "kb-warranty", name: "Warranty Terms (2025)", type: "PDF", indexed: "May 10", docs: 1, scope: "Damaged Items" },
    { id: "kb-rep-sop", name: "Rep SOP, Escalation Etiquette", type: "Docx", indexed: "May 6", docs: 1, scope: "All Rep AI" },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Building Blocks" }, { label: "Knowledge Sources" }]}
        title="Knowledge Sources"
        answers={"The content the AI reads to answer questions, like help articles and policy PDFs. A building block your AI automations share."}
        actions={
          <>
            <button className="btn"><Icon name="upload" size={13} /> Upload file</button>
            <button className="btn brand"><Icon name="plus" size={13} /> Add source</button>
          </>
        }
      />
      <div className="page-body">
        <div className="table">
          <div className="thead" style={{ gridTemplateColumns: "1.6fr 80px 1.2fr 100px 110px 40px" }}>
            <div className="cell">Source</div>
            <div className="cell">Type</div>
            <div className="cell">Scope</div>
            <div className="cell">Documents</div>
            <div className="cell">Indexed</div>
            <div className="cell"></div>
          </div>
          {items.map((k) => (
            <div key={k.id} className="trow" style={{ gridTemplateColumns: "1.6fr 80px 1.2fr 100px 110px 40px" }}>
              <div className="cell">
                <b>{k.name}</b>
                {k.attention && <small style={{ color: "var(--warn)" }}>● {k.attention}</small>}
              </div>
              <div className="cell"><span className="chip">{k.type}</span></div>
              <div className="cell"><span className="chip gray">{k.scope}</span></div>
              <div className="cell mono">{k.docs}</div>
              <div className="cell" style={{ color: "var(--ink-50)" }}>{k.indexed}</div>
              <div className="cell right">
                <button className="btn ghost btn-icon sm"><Icon name="moreV" size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const BlocksTools = () => {
  const tools = [
    { id: "t-issue-refund", name: "issue_refund", purpose: "Issue a refund to the customer's original payment method", scope: "Refund Order", auth: "OAuth · Stripe", health: "live", calls: 1247, errRate: "0.4%" },
    { id: "t-lookup-order", name: "lookup_order", purpose: "Get order details by order ID or customer email", scope: "5 automations", auth: "API key", health: "live", calls: 8932, errRate: "0.1%" },
    { id: "t-loyalty", name: "lookup_loyalty", purpose: "Get customer loyalty tier + lifetime value", scope: "All Customer AI", auth: "OAuth", health: "live", calls: 2401, errRate: "0.3%", broad: true },
    { id: "t-coupon", name: "apply_coupon_code", purpose: "Apply a coupon to the customer's cart or order", scope: "Refund Order", auth: "API key", health: "live", calls: 423, errRate: "0.2%" },
    { id: "t-request-attachment", name: "request_attachments", purpose: "Ask the customer to send photos or files", scope: "Refund Order, Damaged Items", auth: ",", health: "live", calls: 167, errRate: "0%" },
    { id: "t-shipping-status", name: "get_shipping_status", purpose: "Fetch real-time shipping status from carrier", scope: "Order Tracking", auth: "OAuth · ShipStation", health: "attention", calls: 4521, errRate: "3.8%", attention: "Elevated latency · p95 8.1s" },
    { id: "t-escalate", name: "escalate_to_human", purpose: "Route the conversation to a human queue with context", scope: "All AI", auth: ",", health: "live", calls: 612, errRate: "0%", broad: true },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Building Blocks" }, { label: "Tools" }]}
        title="Tools"
        answers={"Actions the AI can take in your other systems, like looking up an order or starting a refund. A building block your AI automations share."}
        actions={
          <>
            <button className="btn"><Icon name="server" size={13} /> Connections</button>
            <button className="btn brand"><Icon name="plus" size={13} /> New tool</button>
          </>
        }
      />
      <div className="page-body">
        <div className="table">
          <div className="thead" style={{ gridTemplateColumns: "1.8fr 1.4fr 100px 110px 110px 40px" }}>
            <div className="cell">Tool</div>
            <div className="cell">Scope · Auth</div>
            <div className="cell">Calls (7d)</div>
            <div className="cell">Error rate</div>
            <div className="cell">Health</div>
            <div className="cell"></div>
          </div>
          {tools.map((t) => (
            <div key={t.id} className="trow" style={{ gridTemplateColumns: "1.8fr 1.4fr 100px 110px 110px 40px" }}>
              <div className="cell">
                <b className="mono">{t.name}</b>
                <small>{t.purpose}</small>
              </div>
              <div className="cell">
                <span className={`chip ${t.broad ? "purple" : "gray"}`}>
                  {t.broad && <Icon name="globe" size={10} />}
                  {t.scope}
                </span>
                <small style={{ display: "block", color: "var(--ink-50)", marginTop: 3 }}>{t.auth}</small>
              </div>
              <div className="cell mono">{t.calls.toLocaleString()}</div>
              <div className="cell mono" style={{ color: parseFloat(t.errRate) > 1 ? "var(--bad)" : "var(--ink-60)" }}>{t.errRate}</div>
              <div className="cell"><StatusPill status={t.health} /></div>
              <div className="cell right">
                <button className="btn ghost btn-icon sm"><Icon name="moreV" size={13} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head"><h3>About tools</h3></div>
        <div className="card">
          <p style={{ fontSize: 12.5, color: "var(--ink-70)", margin: 0, lineHeight: 1.6 }}>
            Tools are the AI's hands. When a procedure says "issue a refund," the AI calls a tool. Each tool declares which automations can call it. Tools with elevated error rates or latency surface here and in <a style={{ color: "var(--ink-100)", borderBottom: "1px solid var(--ink-30)", cursor: "pointer" }}>Performance → Monitors</a>.
          </p>
        </div>
      </div>
    </>
  );
};

const BlocksGuardrails = () => {
  const rails = [
    {
      id: "gr-refund-ceiling",
      name: "Refund ceiling",
      rule: "If refund_amount > $250 AND customer_tier ≠ VIP → require human approval",
      scope: "All Customer AI",
      type: "Hard limit",
      attached: 5,
      severity: "blocking",
      driver: "Reduce refund tickets by 20%",
    },
    {
      id: "gr-pii",
      name: "Never repeat PII",
      rule: "If message contains SSN, full card number, or password → redact in transcripts and never echo",
      scope: "All AI",
      type: "Privacy",
      attached: 8,
      severity: "blocking",
      driver: null,
      broad: true,
    },
    {
      id: "gr-escalation",
      name: "Auto-escalate on legal terms",
      rule: "If customer says 'lawyer', 'lawsuit', 'sue', 'attorney' → escalate to human immediately, no AI reply",
      scope: "All Customer AI",
      type: "Routing",
      attached: 5,
      severity: "blocking",
      driver: null,
    },
    {
      id: "gr-competitor",
      name: "No competitor mention",
      rule: "Don't volunteer mention of competing brands. If asked directly, deflect politely.",
      scope: "Refund Order, Damaged Items",
      type: "Content policy",
      attached: 2,
      severity: "advisory",
      driver: null,
    },
    {
      id: "gr-tone-empathy",
      name: "Open with acknowledgment",
      rule: "On all refund or damage conversations, open with acknowledgment of the customer's situation before troubleshooting.",
      scope: "Refund Order",
      type: "Tone",
      attached: 1,
      severity: "advisory",
      driver: "Improve CSAT to 4.6",
    },
  ];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Building Blocks" }, { label: "Guardrails" }]}
        title="Guardrails"
        answers={"Rules that set what the AI is never allowed to do. A building block your AI automations share."}
        actions={
          <>
            <button className="btn brand"><Icon name="plus" size={13} /> New guardrail</button>
          </>
        }
      />
      <div className="page-body">
        <div style={{ background: "var(--v2-paper-2)", border: "1px solid var(--v2-hairline)", borderRadius: "var(--r-3)", padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "var(--ink-70)" }}>
          <Icon name="info" size={12} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--ink-50)" }} />
          Shared guardrails live here. <b style={{ color: "var(--ink-100)" }}>Per-automation</b> guardrails (Competitors, Secrets, Tone) live on each automation's <a style={{ color: "var(--ink-100)", borderBottom: "1px solid var(--ink-30)", cursor: "pointer" }}>Settings</a>.
        </div>

        {rails.map((g) => (
          <div key={g.id} className="card" style={{ marginBottom: 8 }}>
            <div className="card-row" style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 14 }}>{g.name}</h3>
                  <span className={`chip ${g.severity === "blocking" ? "red" : "yellow"}`}>
                    <span className="chip dot"></span>
                    {g.severity === "blocking" ? "Blocking" : "Advisory"}
                  </span>
                  <span className="chip">{g.type}</span>
                  <span className={`chip ${g.broad ? "purple" : "gray"}`}>
                    {g.broad && <Icon name="globe" size={10} />}
                    {g.scope}
                  </span>
                </div>
                <p className="mono" style={{ margin: "4px 0 8px", fontSize: 11.5, color: "var(--ink-80)", letterSpacing: "-0.003em" }}>{g.rule}</p>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--ink-50)" }}>Attached to <b style={{ color: "var(--ink-100)" }}>{g.attached} automation{g.attached !== 1 ? "s" : ""}</b></span>
                  {g.driver && <>· <GoalChip name={g.driver} /></>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn ghost sm"><Icon name="edit" size={11} /> Edit</button>
                <button className="btn ghost btn-icon sm"><Icon name="moreV" size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// ============================================================
// Building Blocks, Scenarios (org-level)
// One scenarios document per org; rows attach to procedures /
// automations across the platform. Lives here, not in the wizard
// or in Goals, because scenarios are AI raw materials, not
// outcomes.
// ============================================================
const BlocksScenarios = ({ navigate }) => {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("all");

  // Mock scenarios sourced from a previously-uploaded CSV.
  const scenarios = [
    { id: "scn-refund-std",     name: "Refund, standard order",      trigger: "Customer asks to return an item within 30 days.",          attachedTo: ["Refund Order", "Refund Order v2"], audience: "AIC",  rowCount: 1, escalation: "Order value > $500 OR VIP tier" },
    { id: "scn-refund-damaged", name: "Refund, damaged item",         trigger: "Customer says item arrived damaged or defective.",         attachedTo: ["Refund Order"],                    audience: "AIC",  rowCount: 1, escalation: "Always escalate after first message if order > $200" },
    { id: "scn-tracking",       name: "Order tracking (WISMO)",        trigger: "Customer asks where their order is.",                       attachedTo: ["Order Tracking", "Order Tracking v2"], audience: "AIC", rowCount: 1, escalation: "Stolen package → fraud team" },
    { id: "scn-cancel-sub",     name: "Cancel subscription",           trigger: "Customer requests to cancel a recurring subscription.",    attachedTo: ["Save at-risk renewals"],           audience: "AIC",  rowCount: 1, escalation: "Billing dispute or chargeback" },
    { id: "scn-coupon",         name: "Coupon / promo code",           trigger: "Customer reports a promo code that won't apply.",          attachedTo: ["All Customer AI"],                          audience: "AIC",  rowCount: 1, escalation: "Fully automatable" },
    { id: "scn-product-q",      name: "Product question (sizing)",     trigger: "Customer asks about sizing, materials, compatibility.",    attachedTo: ["Product Questions"],                audience: "AIR",  rowCount: 1, escalation: "Complex sizing → human handoff" },
    { id: "scn-account-login",  name: "Account & login help",          trigger: "Customer cannot log in or wants to update account info.",  attachedTo: [],                                   audience: "AIC",  rowCount: 1, escalation: "Failed identity check → human" },
  ];

  const counts = {
    all: scenarios.length,
    AIC: scenarios.filter((s) => s.audience === "AIC").length,
    AIR: scenarios.filter((s) => s.audience === "AIR").length,
  };
  const filtered = scenarios.filter((s) => {
    if (audience !== "all" && s.audience !== audience) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Scenarios"
        answers="The situations your team handles and what to do in each one. Kustomer AI turns every scenario into a draft procedure you can review."
        actions={
          <>
            <button className="btn ghost"><Icon name="download" size={13} /> Export CSV</button>
            <button className="btn brand"><Icon name="upload" size={13} /> Re-upload</button>
          </>
        }
      />
      <div className="page-body wide">
        {/* Source-of-truth banner */}
        <div className="scn-source">
          <div className="scn-source-ico"><Icon name="book" size={18} /></div>
          <div className="scn-source-body">
            <div className="scn-source-eyebrow">Source · org-wide</div>
            <div className="scn-source-name">scenarios-acmeoutdoors-2026q2.csv</div>
            <div className="scn-source-meta">Uploaded May 20, 2026 · {scenarios.length} scenarios · {scenarios.reduce((a, s) => a + s.attachedTo.length, 0)} attachments across automations</div>
          </div>
          <div className="scn-source-actions">
            <a className="scn-source-link" onClick={() => alert("Download CSV template")}>
              <Icon name="download" size={11} /> Template
            </a>
          </div>
        </div>

        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search scenarios…" />
          <AudienceFilter value={audience} onChange={setAudience} counts={counts} />
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-50)" }}>
            Showing {filtered.length} of {scenarios.length}
          </span>
        </Toolbar>

        <div className="scn-list">
          {filtered.map((s) => (
            <div className="scn-row" key={s.id}>
              <div className="scn-row-main">
                <div className="scn-row-name">{s.name}</div>
                <div className="scn-row-trigger">{s.trigger}</div>
                <div className="scn-row-tags">
                  <span className="scn-tag escalation">
                    <Icon name="warning" size={10} /> Escalation: {s.escalation}
                  </span>
                </div>
              </div>
              <div className="scn-row-audience">
                <AudienceChip audience={s.audience} />
              </div>
              <div className="scn-row-attached">
                {s.attachedTo.length === 0 ? (
                  <span className="scn-row-empty">Not attached</span>
                ) : (
                  <div className="scn-row-attached-list">
                    {s.attachedTo.map((a) => (
                      <span key={a} className="scn-attached-chip">{a}</span>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn ghost sm">View row</button>
            </div>
          ))}
        </div>

        <div className="scn-foot">
          <Icon name="info" size={11} />
          Scenarios are org-wide. Each row can attach to one or many automations and procedures. Edit rows here, the change propagates everywhere it's referenced.
        </div>
      </div>
    </>
  );
};

Object.assign(window, { BlocksOverview, BlocksProcedures, BlocksKnowledge, BlocksTools, BlocksGuardrails, BlocksScenarios });
