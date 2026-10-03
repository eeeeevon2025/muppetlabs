// Setup page — first-run intake.
// Left: form (company → topics → goals → knowledge → scenarios → escalation → voice)
// Right: live "What we'll generate" preview that updates as the form fills

const GOAL_OPTIONS = [
  { id: "deflect",    title: "Deflect common questions",     desc: "Answer FAQs directly so reps focus on harder cases.",          icon: "sparkles", audience: "aic" },
  { id: "speed",      title: "Speed up rep responses",       desc: "Draft replies and summarize threads in Copilot.",              icon: "bolt",     audience: "air" },
  { id: "escalate",   title: "Reduce unnecessary escalations", desc: "Verify identity, classify intent, route only when needed.",   icon: "shield",   audience: "aic" },
  { id: "tracking",   title: "Status & order tracking",      desc: "Look up orders, shipments, returns end-to-end.",                icon: "package",  audience: ["aic", "air"] },
];

// Small audience tag for goal cards — blue = AI for Customers, purple = AI for Reps.
const AudienceTag = ({ audience }) => {
  const palette = audience === "air"
    ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" }
    : { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "1px 7px",
      background: palette.bg, color: palette.fg,
      fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700,
      letterSpacing: "0.02em",
      borderRadius: 999,
      whiteSpace: "nowrap",
    }}>{palette.label}</span>
  );
};

// Mock conversation-history insights for an existing customer.
const TOPIC_OPTIONS = [
  { id: "tracking", label: "Order tracking",         volume: 24, sample: "“Where is my order?”",        handle: "3.2 min", deflectable: 78, suggested: ["Order Tracking"],      procedures: ["Tracking Lookup"] },
  { id: "returns",  label: "Returns & refunds",      volume: 18, sample: "“How do I return this?”",      handle: "5.8 min", deflectable: 62, suggested: ["Refund Order", "Returns"], procedures: ["Main Refund Procedure", "Convincing Customer"] },
  { id: "product",  label: "Product questions",      volume: 12, sample: "“Is this dishwasher safe?”",    handle: "2.4 min", deflectable: 85, suggested: ["Product FAQ"],          procedures: ["Answer FAQ from KB"] },
  { id: "account",  label: "Account & login",        volume:  9, sample: "“Can't log in to my account”",   handle: "4.1 min", deflectable: 45, suggested: ["Account Help"],         procedures: ["Verify Customer Identity"] },
  { id: "shipping", label: "Shipping delays",        volume:  8, sample: "“My order is late”",            handle: "3.7 min", deflectable: 70, suggested: ["Shipping Updates"],     procedures: ["Tracking Lookup"] },
];

const CHANNEL_OPTIONS = [
  { id: "email",    label: "Email",     icon: "mail" },
  { id: "chat",     label: "Chat",      icon: "chat" },
  { id: "sms",      label: "SMS",       icon: "phone" },
  { id: "voice",    label: "Voice",     icon: "phone" },
  { id: "instagram",label: "Instagram", icon: "tag" },
  { id: "whatsapp", label: "WhatsApp",  icon: "chat" },
];

const INDUSTRY_OPTIONS = [
  "Retail & E-commerce", "SaaS", "Travel & Hospitality", "Financial Services",
  "Telecommunications", "Healthcare", "Logistics & Shipping", "Other",
];

const SetupPanel = ({ view, onNav } = {}) => {
  // — Goals-first flow: a single selected business outcome drives the
  // generated plan. The legacy long-form fallback remains for compatibility.
  const [selectedOutcome, setSelectedOutcome] = React.useState(null);
  const onPickOutcome = (id) => {
    setSelectedOutcome(id);
    if (onNav) onNav("setup-build");
  };
  const onClearOutcome = () => {
    setSelectedOutcome(null);
    if (onNav) onNav("setup");
  };

  // "existing" = we have 90 days of conversation history; "new" = net-new
  // account. Toggleable at the top of the form so the demo shows both flows.
  const [accountType, setAccountType] = React.useState("existing");
  // What we already know from billing + the org record. User can edit anything.
  const AUTOFILL = {
    name: "Acme Outdoors",
    industry: "Retail & E-commerce",
    website: "acmeoutdoors.com",
    description: "Acme Outdoors sells outdoor and adventure gear direct-to-consumer through our online store and three flagship retail locations. We support customers across email, chat, SMS, and Instagram. Our most common customer questions are about order tracking, returns & exchanges, product sizing, and warranty claims on high-value gear.",
    brandsCount: 2,
  };
  const [company, setCompany] = React.useState({
    name: AUTOFILL.name,
    industry: AUTOFILL.industry,
    website: AUTOFILL.website,
    description: AUTOFILL.description,
  });
  // Track which auto-filled fields haven't been edited yet (kept for potential future use)
  const [autofilled, setAutofilled] = React.useState({
    name: true, industry: true, website: true, description: true, brandsCount: true,
  });
  const clearAutofill = (key) =>
    setAutofilled(prev => prev[key] ? { ...prev, [key]: false } : prev);
  const setCompanyField = (key, value) => {
    setCompany(prev => ({ ...prev, [key]: value }));
    clearAutofill(key);
  };
  const [topics, setTopics]   = React.useState(["tracking", "returns", "product"]);
  const [goals,    setGoals]  = React.useState([]);
  const [audience, setAudience] = React.useState(["aic", "air"]); // who we're configuring for
  const [customGoals, setCustomGoals] = React.useState([]); // [{ id, title, desc, audience }]
  const [knowledge, setKnowledge] = React.useState({ url: "", brandsCount: 2 });
  const [tone, setTone] = React.useState("");
  const [escalation, setEscalation] = React.useState({
    triggers: [],
    destination: "queue",     // "team" | "queue" | "unassigned"
    team: "",
    queue: "",
    messageType: "default",   // "default" | "custom"
    customMessage: "",
  });
  const [scenarios, setScenarios] = React.useState([]);
  const [monitors, setMonitors] = React.useState(() => deriveAutoMonitors({ goals: [], topics: [], audience: ["aic", "air"] }));
  const effectivelyGenerated = view === "setup-build";
  const onTestView = view === "setup-test";
  const onDeployView = view === "setup-deploy";
  const onAnalyzeView = view === "setup-analyze";
  const goToBuild = () => {
    if (onNav) onNav("setup-build");
  };
  const goToForm = () => {
    if (onNav) onNav("setup");
  };
  const goToTest = () => {
    if (onNav) onNav("setup-test");
  };
  const goToDeploy = () => {
    if (onNav) onNav("setup-deploy");
  };
  const goToAnalyze = () => {
    if (onNav) onNav("setup-analyze");
  };

  React.useEffect(() => {
    if (accountType === "new") setTopics([]);
    else setTopics(["tracking", "returns", "product"]);
  }, [accountType]);

  const toggle = (list, id) => list.includes(id) ? list.filter(x => x !== id) : [...list, id];

  const progress = (() => {
    let n = 0;
    if (company.name) n++;
    if (company.industry) n++;
    if (company.description.length > 40) n++;
    if (company.website) n++;
    if (goals.length) n++;
    if (knowledge.url) n++;
    if (tone) n++;
    if (escalation.triggers.length) n++;
    if (scenarios.length) n++;
    if (monitors.length) n++;
    if (accountType === "existing" && topics.length) n++;
    return Math.round((n / (accountType === "existing" ? 11 : 10)) * 100);
  })();

  const canGenerate = company.name && (goals.length > 0 || topics.length > 0);

  // Re-derive auto-monitors when the user's goals / topics / audience change.
  // Manually-added monitors (no `auto_` id prefix) are preserved.
  React.useEffect(() => {
    const auto = deriveAutoMonitors({ goals, topics, audience });
    setMonitors(prev => {
      const manual = prev.filter(m => !String(m.id).startsWith("auto_"));
      return [...auto, ...manual];
    });
  }, [goals.join(","), topics.join(","), audience.join(",")]);

  // Auto-number sections in render order.
  let _sec = 0;
  const N = () => String(++_sec);

  return (
    <div data-screen-label="00 AI Setup" style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Form column OR Generated panel OR Test & Evaluate OR Deploy OR Analyze */}
      {onAnalyzeView ? (
        window.AnalyzePanel ? <window.AnalyzePanel onBack={goToDeploy}/> : <div/>
      ) : onDeployView ? (
        window.DeployPanel ? <window.DeployPanel onBack={goToTest}/> : <div/>
      ) : onTestView ? (
        <TestEvaluatePanel
          goals={goals}
          topics={topics}
          onBack={goToBuild}
          onContinue={goToDeploy}
        />
      ) : effectivelyGenerated ? (
        <GeneratedPanel
          company={company}
          goals={goals}
          topics={topics}
          scenarios={scenarios}
          monitors={monitors}
          onEdit={goToForm}
          onSaveContinue={goToTest}
        />
      ) : (
      <div style={{ flex: 1, overflow: "auto", padding: "40px 48px 80px", minWidth: 520 }}>
        <div style={{ maxWidth: 700 }}>
          {/* Hero */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 12px 5px 8px",
            background: "#F5EBFD", border: "1px solid #EBD2FF",
            borderRadius: 999, marginBottom: 14,
          }}>
            <SparkleGlyph/>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#5E1D7D" }}>
              Goals-based setup
            </span>
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.005em",
            color: "#1F242D",
            marginBottom: 12,
            maxWidth: 580,
          }}>Tell us about your business. We'll set up your AI.</h1>
          <p style={{
            margin: 0, marginBottom: 28,
            fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55,
            color: "#5F6675", maxWidth: 580,
          }}>
            Answer a few questions about your company and what you want AI to do.
            We'll generate AI Automations, Procedures, and Copilot configuration that
            you can review and refine before going live.
          </p>

          {/* Account-type toggle removed */}

          {/* About — compact read-mode card with inline edit */}
          <SetupSection number={N()} title="About your company"
            sub="Pulled from your account profile. Edit anything that's off.">
            <CompanyCard
              company={company}
              brandsCount={knowledge.brandsCount}
              onCompanyChange={(c) => setCompany(c)}
              onBrandsChange={(n) => setKnowledge({ ...knowledge, brandsCount: n })}
              industryOptions={INDUSTRY_OPTIONS}
            />
          </SetupSection>

          {/* Channels section removed — we already know this from billing/install. */}

          {/* Who are we configuring AI for? */}
          <SetupSection number={N()} title="Who are you setting up Kustomer AI for?"
            sub="Pick one or both. You can always add the other later — we'll only show goals and procedures that apply.">
            <AudiencePicker value={audience} onChange={setAudience}/>
          </SetupSection>

          {/* Goals — filtered by audience */}
          {audience.length > 0 && (
          <SetupSection number={N()} title="What are your goals with Kustomer AI?"
            sub="Select all that apply. Each goal unlocks specific Automations and Procedures.">
            <GoalsGrid
              audience={audience}
              goals={goals}
              onToggle={(id) => setGoals(toggle(goals, id))}
              customGoals={customGoals}
              onAddCustom={(g) => setCustomGoals(list => [...list, g])}
              onRemoveCustom={(id) => {
                setCustomGoals(list => list.filter(x => x.id !== id));
                setGoals(list => list.filter(x => x !== id));
              }}
            />
          </SetupSection>
          )}

          {accountType === "existing" && (
            <SetupSection number={N()} title="Your top conversation topics"
              sub="From the last 90 days of conversations. Pick the topics you want AI to handle — we'll suggest the right Automations and Procedures for each.">
              <TopicGrid topics={TOPIC_OPTIONS} selected={topics}
                onToggle={(id) => setTopics(toggle(topics, id))}/>
            </SetupSection>
          )}

          {/* Monitors — moved up, right after topics */}
          <SetupSection number={N()} title="Performance monitors"
            sub="We auto-generated targets based on your topics and goals. Tweak the thresholds or remove anything that doesn't fit — we'll alert you when these drift.">
            <MonitorsEditor monitors={monitors} onChange={setMonitors}/>
          </SetupSection>

          {/* Scenarios to automate */}
          <SetupSection number={N()} title="Scenarios you want to automate"
            sub="Upload examples of the workflows you want AI to handle — call recordings, screenshots of past conversations, SOPs, decision trees, anything. We'll turn each into a draft Procedure you can review.">
            <ScenarioUploader scenarios={scenarios} onChange={setScenarios}/>
          </SetupSection>

          {/* Knowledge */}
          <SetupSection number={N()} title="Where does your AI learn from?" sub="Point us at the content you already have. We'll ingest and index it.">
            <Field label="Help center URL" hint="We'll crawl your public help articles.">
              <TextInput value={knowledge.url} onChange={v => setKnowledge({ ...knowledge, url: v })} placeholder="https://help.acme.com"/>
            </Field>
            <div style={{ height: 14 }}/>
            <div style={{
              border: "1px dashed #DCE0E9", borderRadius: 8,
              padding: "16px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              background: "#FAFBFD",
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D", marginBottom: 2 }}>
                  Upload policies, FAQs, runbooks
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182" }}>
                  PDF, DOCX, MD — up to 50 files
                </div>
              </div>
              <button style={{
                padding: "8px 14px",
                border: "1px solid #BBD1FF", background: "#fff", color: "#0165E4",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                borderRadius: 6, cursor: "pointer",
              }}>Choose files</button>
            </div>
          </SetupSection>

          {/* Voice */}
          <SetupSection number={N()} title="How should your AI sound?" sub="We'll match this tone across replies and rep-assist drafts." last>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { id: "friendly",     label: "Friendly" },
                { id: "professional", label: "Professional" },
                { id: "casual",       label: "Casual" },
                { id: "matter",       label: "Matter of Fact" },
                { id: "custom",       label: "Custom" },
              ].map(t => (
                <button key={t.id} onClick={() => setTone(t.id)} style={{
                  padding: "8px 18px",
                  border: tone === t.id ? "1px solid transparent" : "1px solid #DCE0E9",
                  background: tone === t.id ? "#0165E4" : "#fff",
                  color: tone === t.id ? "#fff" : "#1F242D",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                  borderRadius: 999, cursor: "pointer", transition: "all 140ms",
                  boxShadow: tone === t.id ? "0 1px 2px rgba(1,101,228,0.18)" : "none",
                }}>{t.label}</button>
              ))}
            </div>
          </SetupSection>

          {/* CTA row */}
          <div style={{ marginTop: 36, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={ghostBtn}>Skip & configure manually</button>
            <button onClick={goToBuild} disabled={!canGenerate} style={{
              padding: "11px 22px",
              border: 0,
              background: canGenerate ? "#0165E4" : "#DCE0E9",
              color: "#fff",
              fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
              borderRadius: 8, cursor: canGenerate ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: canGenerate ? "0 1px 2px rgba(1,101,228,0.25)" : "none",
            }}>
              <SparkleGlyph/>
              Generate my AI setup
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Right column — AI Setup Assistant */}
      <SetupAssistant
        company={company}
        topics={topics}
        goals={goals}
        knowledge={knowledge}
        tone={tone}
        escalation={escalation}
        scenarios={scenarios}
        monitors={monitors}
        view={view}
      />
    </div>
  );
};

// — About-your-company compact card. Read-mode summary by default, inline edit on click.
const CompanyCard = ({ company, brandsCount, onCompanyChange, onBrandsChange, industryOptions }) => {
  const [editing, setEditing] = React.useState(false);
  const initial = (company.name || "?").trim().charAt(0).toUpperCase();
  const cleanUrl = (u) => (u || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

  if (!editing) {
    return (
      <div style={{
        position: "relative",
        background: "#fff",
        border: "1px solid #E8EAF0",
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        {/* Avatar */}
        <span style={{
          width: 44, height: 44, borderRadius: 10,
          background: "linear-gradient(135deg, #0165E4 0%, #6E79E0 100%)",
          color: "#fff",
          fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, letterSpacing: "-0.01em",
        }}>{initial}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + edit button row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700,
              color: "#1F242D", letterSpacing: "-0.005em",
            }}>{company.name || "Unnamed company"}</span>
            <button onClick={() => setEditing(true)} style={{
              marginLeft: "auto",
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 10px",
              border: "1px solid #DCE0E9", background: "#fff", color: "#3F4654",
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              borderRadius: 6, cursor: "pointer", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              <RailIcon name="pencilEdit" size={12} strokeWidth={1.9}/>
              Edit
            </button>
          </div>

          {/* Meta row */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 10px",
            fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#5F6675", marginBottom: 8,
          }}>
            {company.industry && <span>{company.industry}</span>}
            {company.industry && company.website && <MetaDot/>}
            {company.website && (
              <a href={`https://${cleanUrl(company.website)}`} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  color: "#0165E4", textDecoration: "none", fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                {cleanUrl(company.website)}
              </a>
            )}
            {company.website && <MetaDot/>}
            <span>{brandsCount === "5+" ? "5+ brands" : `${brandsCount} brand${brandsCount === 1 ? "" : "s"}`}</span>
          </div>

          {/* Description */}
          {company.description && (
            <p style={{
              margin: 0,
              fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.55,
              color: "#3F4654",
              display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3,
              overflow: "hidden",
            }}>{company.description}</p>
          )}
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div style={{
      background: "#FAFBFD",
      border: "1px solid #DCE0E9",
      borderRadius: 12,
      padding: "16px 18px",
    }}>
      <Row>
        <Field label="Company name" required>
          <TextInput value={company.name}
            onChange={v => onCompanyChange({ ...company, name: v })}
            placeholder="Acme Co."/>
        </Field>
        <Field label="Industry">
          <SelectInline
            options={industryOptions}
            value={company.industry}
            placeholder="Select industry"
            onSelect={v => onCompanyChange({ ...company, industry: v })}
          />
        </Field>
      </Row>
      <div style={{ height: 12 }}/>
      <Row>
        <Field label="Website">
          <TextInput value={company.website}
            onChange={v => onCompanyChange({ ...company, website: v })}
            placeholder="acme.com"/>
        </Field>
        <Field label="Brands">
          <div style={{ display: "inline-flex", gap: 6 }}>
            {[1, 2, 3, 4, "5+"].map(n => {
              const on = brandsCount === n;
              return (
                <button key={n} onClick={() => onBrandsChange(n)} style={{
                  minWidth: 38, padding: "8px 10px",
                  border: on ? "1.5px solid #0165E4" : "1px solid #DCE0E9",
                  background: on ? "#EBF1FF" : "#fff",
                  color: on ? "#0165E4" : "#1F242D",
                  borderRadius: 6,
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}>{n}</button>
              );
            })}
          </div>
        </Field>
      </Row>
      <div style={{ height: 12 }}/>
      <Field label="What your company does"
        hint="Grounds the AI in your actual business — products, customers, tone.">
        <TextAreaInput value={company.description}
          onChange={v => onCompanyChange({ ...company, description: v })}
          placeholder="Acme sells outdoor gear direct-to-consumer through our online store…"
          rows={5}/>
      </Field>
      <div style={{
        marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8,
      }}>
        <button onClick={() => setEditing(false)} style={{
          padding: "8px 16px",
          border: 0, background: "#1F242D", color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
        }}>Done</button>
      </div>
    </div>
  );
};

const MetaDot = () => (
  <span style={{
    width: 3, height: 3, borderRadius: "50%", background: "#B3BBCB",
    display: "inline-block",
  }}/>
);

// — Sections
const SetupSection = ({ number, title, sub, children, last }) => (
  <div style={{
    paddingTop: 28, paddingBottom: 28,
    borderTop: "1px solid #E8EAF0",
    marginBottom: last ? 0 : 0,
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
      <span style={{
        width: 26, height: 26, borderRadius: "50%",
        background: "#1F242D", color: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>{number}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 700, color: "#1F242D", letterSpacing: "-0.005em" }}>{title}</div>
        {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182", marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
      </div>
    </div>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>
);

const Field = ({ label, hint, required, badge, children }) => (
  <div>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D", marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
      {label}{required && <span style={{ color: "#CD1D2B" }}>*</span>}
      {badge === "ai" && <AutofilledBadge/>}
    </div>
    {hint && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginBottom: 6, lineHeight: 1.45 }}>{hint}</div>}
    {children}
  </div>
);

const AutofilledBadge = () => (
  <span title="We filled this in for you. Edit anytime." style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "1px 7px 1px 5px",
    background: "#F5EBFD", border: "1px solid #EBD2FF",
    borderRadius: 999,
    fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
    color: "#5E1D7D", letterSpacing: "0.02em",
    textTransform: "uppercase",
  }}>
    <SparkleGlyph/>
    Auto-filled
  </span>
);

const baseInputStyle = {
  width: "100%", padding: "10px 12px",
  border: "1px solid #DCE0E9", borderRadius: 6,
  fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
  outline: "none", background: "#fff", boxSizing: "border-box",
  transition: "border-color 140ms, box-shadow 140ms",
};

const TextInput = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={baseInputStyle}
    onFocus={e => { e.target.style.borderColor = "#3F8CFF"; e.target.style.boxShadow = "0 0 0 3px rgba(63,140,255,0.18)"; }}
    onBlur={e => { e.target.style.borderColor = "#DCE0E9"; e.target.style.boxShadow = "none"; }}/>
);

const TextAreaInput = ({ value, onChange, placeholder, rows }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ ...baseInputStyle, resize: "vertical", lineHeight: 1.5 }}
    onFocus={e => { e.target.style.borderColor = "#3F8CFF"; e.target.style.boxShadow = "0 0 0 3px rgba(63,140,255,0.18)"; }}
    onBlur={e => { e.target.style.borderColor = "#DCE0E9"; e.target.style.boxShadow = "none"; }}/>
);

const SelectInline = ({ options, value, onSelect, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{
        ...baseInputStyle,
        textAlign: "left", cursor: "pointer",
        color: value ? "#1F242D" : "#9099AB",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{value || placeholder}</span>
        <RailIcon name="chevronDown" size={14} strokeWidth={2} color="#697182"/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 6,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10,
          maxHeight: 260, overflow: "auto",
        }}>
          {options.map(o => (
            <button key={o} onClick={() => { onSelect(o); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "8px 12px",
              border: 0, background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ghostBtn = {
  padding: "11px 18px",
  border: 0, background: "transparent",
  color: "#5F6675",
  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
  borderRadius: 6, cursor: "pointer",
};

// — Scenario uploader
const SCENARIO_TYPE_META = {
  pdf:   { label: "PDF",   bg: "#FDECEC", fg: "#B12B2B", icon: "file"  },
  doc:   { label: "DOC",   bg: "#EBF1FF", fg: "#0E3280", icon: "file"  },
  image: { label: "IMG",   bg: "#EAF7EE", fg: "#16763C", icon: "image" },
  audio: { label: "AUDIO", bg: "#F5EBFD", fg: "#7B22A4", icon: "note"  },
  video: { label: "VIDEO", bg: "#FFF4E6", fg: "#8A5A08", icon: "note"  },
  text:  { label: "TXT",   bg: "#F2F3F7", fg: "#5F6675", icon: "note"  },
  other: { label: "FILE",  bg: "#F2F3F7", fg: "#5F6675", icon: "file"  },
};

const classifyScenarioFile = (file) => {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const mime = (file.type || "").toLowerCase();
  if (mime.startsWith("image/") || ["png","jpg","jpeg","gif","webp","heic","svg"].includes(ext)) return "image";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (mime.startsWith("audio/") || ["mp3","wav","m4a","ogg"].includes(ext)) return "audio";
  if (mime.startsWith("video/") || ["mp4","mov","webm"].includes(ext)) return "video";
  if (["doc","docx","rtf","odt"].includes(ext)) return "doc";
  if (["txt","md","csv"].includes(ext)) return "text";
  return "other";
};

const prettySize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const ScenarioUploader = ({ scenarios, onChange }) => {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef(null);

  const addFiles = (fileList) => {
    const next = Array.from(fileList || []).map((f, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      kind: classifyScenarioFile(f),
      title: "",
    }));
    if (!next.length) return;
    onChange([...scenarios, ...next]);
  };

  const remove = (id) => onChange(scenarios.filter(s => s.id !== id));
  const updateTitle = (id, title) =>
    onChange(scenarios.map(s => (s.id === id ? { ...s, title } : s)));

  const examples = [
    "Return for damaged item",
    "Reschedule a delivery",
    "Cancel & refund subscription",
    "Verify identity before changing email",
  ];

  return (
    <div>
      <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.rtf,image/*,audio/*,video/*"
        style={{ display: "none" }}
        onChange={e => { addFiles(e.target.files); e.target.value = ""; }}/>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        style={{
          border: dragging ? "1.5px dashed #0165E4" : "1.5px dashed #DCE0E9",
          background: dragging ? "#EBF1FF" : "#FAFBFD",
          borderRadius: 10,
          padding: "26px 22px",
          display: "flex", alignItems: "center", gap: 16,
          cursor: "pointer", transition: "all 140ms",
        }}>
        <span style={{
          width: 44, height: 44, borderRadius: 10,
          background: "#fff", border: "1px solid #E8EAF0",
          color: "#0165E4",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <RailIcon name="upload" size={20} strokeWidth={1.8}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
          }}>
            Drop scenarios here, or <span style={{ color: "#0165E4" }}>browse files</span>
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
            marginTop: 3, lineHeight: 1.45,
          }}>
            PDFs, screenshots, Word docs, transcripts, call recordings — up to 25 MB each.
          </div>
        </div>
      </div>

      {/* Example chips */}
      {scenarios.length === 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB", marginRight: 2 }}>
            Common scenarios:
          </span>
          {examples.map(e => (
            <span key={e} style={{
              padding: "3px 8px",
              background: "#F2F3F7", color: "#5F6675",
              border: "1px solid #E8EAF0",
              borderRadius: 999,
              fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
            }}>{e}</span>
          ))}
        </div>
      )}

      {/* Uploaded files */}
      {scenarios.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {scenarios.map(s => {
            const meta = SCENARIO_TYPE_META[s.kind] || SCENARIO_TYPE_META.other;
            return (
              <div key={s.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                background: "#fff", border: "1px solid #E8EAF0", borderRadius: 10,
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: meta.bg, color: meta.fg,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <RailIcon name={meta.icon} size={16} strokeWidth={1.8}/>
                </span>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 700, color: "#1F242D",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280,
                    }}>{s.name}</span>
                    <span style={{
                      padding: "1px 6px", borderRadius: 4,
                      background: meta.bg, color: meta.fg,
                      fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                    }}>{meta.label}</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#9099AB" }}>
                      {prettySize(s.size)}
                    </span>
                  </div>
                  <input
                    value={s.title}
                    onChange={e => updateTitle(s.id, e.target.value)}
                    placeholder="Optional: name this scenario (e.g. \u201CRefund a damaged item\u201D)"
                    style={{
                      width: "100%", padding: "5px 0",
                      border: 0, outline: "none", background: "transparent",
                      fontFamily: "var(--font-sans)", fontSize: 12, color: "#3F4654",
                      borderBottom: "1px dashed transparent",
                    }}
                    onFocus={e => e.target.style.borderBottomColor = "#DCE0E9"}
                    onBlur={e => e.target.style.borderBottomColor = "transparent"}
                  />
                </div>
                <button onClick={() => remove(s.id)} title="Remove" style={{
                  width: 30, height: 30, borderRadius: 6,
                  border: 0, background: "transparent", color: "#9099AB",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#FDECEC"; e.currentTarget.style.color = "#B12B2B"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9099AB"; }}>
                  <RailIcon name="trash" size={14} strokeWidth={1.8}/>
                </button>
              </div>
            );
          })}
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
            marginTop: 2, display: "flex", alignItems: "center", gap: 6,
          }}>
            <SparkleGlyph/>
            We'll draft <strong style={{ color: "#1F242D" }}>{scenarios.length}</strong>{" "}
            Procedure{scenarios.length === 1 ? "" : "s"} from these uploads. You can edit them before going live.
          </div>
        </div>
      )}
    </div>
  );
};

// — Monitor catalog: each entry knows which goals/topics/audiences make it relevant.
// Top 3 highest-scoring entries become the user's auto-suggested monitors.
const MONITOR_CATALOG = [
  // AI for Customers — deflection on specific topics
  {
    id: "auto_deflect_returns",
    when: { goals: ["deflect"], topics: ["returns"], audience: ["aic"] },
    monitor: { label: "AI Deflections on Returns & Refunds", metric: "Deflection rate", op: "gte", value: 80, unit: "%",   scope: "ai" },
  },
  {
    id: "auto_deflect_product",
    when: { goals: ["deflect"], topics: ["product"], audience: ["aic"] },
    monitor: { label: "AI Deflections on Product Questions", metric: "Deflection rate", op: "gte", value: 85, unit: "%",   scope: "ai" },
  },
  {
    id: "auto_deflect_account",
    when: { goals: ["deflect"], topics: ["account"], audience: ["aic"] },
    monitor: { label: "AI Deflections on Account & Login",   metric: "Deflection rate", op: "gte", value: 60, unit: "%",   scope: "ai" },
  },
  {
    id: "auto_tracking_resolution",
    when: { goals: ["tracking"], topics: ["tracking", "shipping"], audience: ["aic"] },
    monitor: { label: "Order Tracking Resolution rate",      metric: "Deflection rate", op: "gte", value: 90, unit: "%",   scope: "ai" },
  },
  // Escalation
  {
    id: "auto_escalation_rate",
    when: { goals: ["escalate"], topics: [], audience: ["aic"] },
    monitor: { label: "Unnecessary escalation rate",         metric: "Escalation rate", op: "lt",  value: 15, unit: "%",   scope: "ai" },
  },
  // CSAT — applies to any AIC selection
  {
    id: "auto_csat_ai",
    when: { goals: ["deflect", "tracking", "escalate"], topics: [], audience: ["aic"] },
    monitor: { label: "AI CSAT",                             metric: "CSAT",            op: "gte", value: 4.5, unit: "/5", scope: "ai" },
  },
  // AI for Reps — speed + assist
  {
    id: "auto_rep_frt",
    when: { goals: ["speed"], topics: [], audience: ["air"] },
    monitor: { label: "Human Rep FRT",                       metric: "First response",  op: "lt",  value: 2,   unit: "min", scope: "reps" },
  },
  {
    id: "auto_rep_aht",
    when: { goals: ["speed"], topics: [], audience: ["air"] },
    monitor: { label: "Rep AHT",                             metric: "Average handle time", op: "lt", value: 4, unit: "min", scope: "reps" },
  },
  {
    id: "auto_copilot_accept",
    when: { goals: ["speed"], topics: [], audience: ["air"] },
    monitor: { label: "Copilot suggestion accept rate",      metric: "Copilot acceptance", op: "gte", value: 60, unit: "%", scope: "reps" },
  },
];

const MAX_AUTO_MONITORS = 4;

const deriveAutoMonitors = ({ goals, topics, audience }) => {
  const goalSet = new Set(goals || []);
  const topicSet = new Set(topics || []);
  const audSet = new Set(audience || []);

  // Score every catalog item once.
  const scored = MONITOR_CATALOG
    .filter(item => item.when.audience.some(a => audSet.has(a)))
    .map(item => {
      const goalMatches = item.when.goals.filter(g => goalSet.has(g)).length;
      const topicMatches = item.when.topics.length === 0
        ? 0
        : item.when.topics.filter(t => topicSet.has(t)).length;
      if (item.when.goals.length > 0 && goalMatches === 0) return null;
      if (item.when.topics.length > 0 && topicMatches === 0) return null;
      const primaryGoal = item.when.goals.find(g => goalSet.has(g)) || "_none";
      return { item, score: goalMatches * 2 + topicMatches, primaryGoal };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  // Round-robin pick by primary goal so every selected goal gets at least one
  // monitor before any single goal claims a second slot.
  const picked = [];
  const usedIds = new Set();
  const byGoal = {};
  scored.forEach(s => {
    if (!byGoal[s.primaryGoal]) byGoal[s.primaryGoal] = [];
    byGoal[s.primaryGoal].push(s);
  });

  const goalOrder = [...goals.filter(g => byGoal[g]), ...Object.keys(byGoal).filter(k => !goalSet.has(k))];
  let added = true;
  while (added && picked.length < MAX_AUTO_MONITORS) {
    added = false;
    for (const g of goalOrder) {
      if (picked.length >= MAX_AUTO_MONITORS) break;
      const queue = byGoal[g] || [];
      while (queue.length) {
        const next = queue.shift();
        if (!usedIds.has(next.item.id)) {
          picked.push(next.item);
          usedIds.add(next.item.id);
          added = true;
          break;
        }
      }
    }
  }

  return picked.map(item => ({ id: item.id, ...item.monitor }));
};

// — Performance monitors editor
const MONITOR_PRESETS = [
  { metric: "Average handle time",       unit: "min", op: "lt",  scope: "reps" },
  { metric: "Deflection rate",           unit: "%",   op: "gte", scope: "ai"   },
  { metric: "CSAT",                      unit: "/5",  op: "gte", scope: "ai"   },
  { metric: "First response time",       unit: "min", op: "lt",  scope: "ai"   },
  { metric: "Escalations / 100 convos",  unit: "%",   op: "lt",  scope: "ai"   },
  { metric: "AI resolution rate",        unit: "%",   op: "gte", scope: "ai"   },
  { metric: "Reopen rate",               unit: "%",   op: "lt",  scope: "reps" },
  { metric: "Backlog (open conversations)", unit: "convos", op: "lt", scope: "reps" },
];

const OP_LABELS = {
  lt: "is less than",
  lte: "is at most",
  gte: "is at least",
  gt: "is more than",
  eq: "equals",
};

const MonitorsEditor = ({ monitors, onChange }) => {
  const update = (id, patch) =>
    onChange(monitors.map(m => m.id === id ? { ...m, ...patch } : m));
  const remove = (id) => onChange(monitors.filter(m => m.id !== id));
  const MAX_MONITORS = 6;
  const atLimit = monitors.length >= MAX_MONITORS;
  const add = () => {
    if (atLimit) return;
    const used = new Set(monitors.map(m => m.metric));
    const next = MONITOR_PRESETS.find(p => !used.has(p.metric)) || MONITOR_PRESETS[0];
    onChange([
      ...monitors,
      {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        label: next.metric,
        metric: next.metric,
        op: next.op,
        value: next.unit === "%" ? 80 : next.unit === "/5" ? 4.5 : next.unit === "min" ? 5 : 50,
        unit: next.unit,
        scope: next.scope,
      },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {monitors.map(m => (
        <MonitorRow key={m.id} monitor={m}
          onUpdate={(patch) => update(m.id, patch)}
          onRemove={() => remove(m.id)}/>
      ))}
      {monitors.length === 0 && (
        <div style={{
          padding: "16px 18px",
          border: "1px dashed #DCE0E9", borderRadius: 10,
          fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182",
          textAlign: "center",
        }}>
          No monitors yet. Add one to get alerted when a metric drifts.
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
        <button onClick={add} disabled={atLimit} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 14px",
          border: `1px dashed ${atLimit ? "#DCE0E9" : "#BBD1FF"}`,
          background: "#fff",
          color: atLimit ? "#9AA3B4" : "#0165E4",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          borderRadius: 8, cursor: atLimit ? "not-allowed" : "pointer",
        }}
          onMouseEnter={e => { if (atLimit) return; e.currentTarget.style.background = "#EBF1FF"; e.currentTarget.style.borderStyle = "solid"; }}
          onMouseLeave={e => { if (atLimit) return; e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderStyle = "dashed"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add monitor
        </button>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
        }}>
          {monitors.length} of {MAX_MONITORS} monitors{atLimit ? " — limit reached" : ""}
        </span>
      </div>
    </div>
  );
};

const MonitorRow = ({ monitor, onUpdate, onRemove }) => {
  const audience = monitor.scope === "ai" ? "aic" : "air";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px",
      background: "#fff",
      border: "1px solid #E8EAF0",
      borderRadius: 10,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 8,
        background: "#EBF1FF", color: "#0165E4",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <RailIcon name="chartLine" size={16} strokeWidth={1.8}/>
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <input
            value={monitor.label}
            onChange={e => onUpdate({ label: e.target.value })}
            style={{
              flex: "1 1 auto", minWidth: 140,
              padding: "3px 0",
              border: 0, outline: "none", background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
              borderBottom: "1px dashed transparent",
            }}
            onFocus={e => e.target.style.borderBottomColor = "#DCE0E9"}
            onBlur={e => e.target.style.borderBottomColor = "transparent"}
          />
          <AudienceTag audience={audience}/>
        </div>
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
          fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182",
        }}>
          <span>{monitor.metric}</span>
          <OpSelect value={monitor.op} onChange={op => onUpdate({ op })}/>
          <ValueInput value={monitor.value} unit={monitor.unit}
            onChange={value => onUpdate({ value })}/>
        </div>
      </div>
      <button onClick={onRemove} title="Remove" style={{
        width: 30, height: 30, borderRadius: 6,
        border: 0, background: "transparent", color: "#9099AB",
        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#FDECEC"; e.currentTarget.style.color = "#B12B2B"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9099AB"; }}>
        <RailIcon name="trash" size={14} strokeWidth={1.8}/>
      </button>
    </div>
  );
};

const OpSelect = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{
        padding: "2px 8px",
        border: "1px solid #DCE0E9", background: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#3F4654",
        borderRadius: 6, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        {OP_LABELS[value]}
        <RailIcon name="chevronDown" size={10} strokeWidth={2.2} color="#697182"/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 6,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10, minWidth: 130,
        }}>
          {Object.entries(OP_LABELS).map(([k, lbl]) => (
            <button key={k} onClick={() => { onChange(k); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "6px 10px",
              border: 0, background: k === value ? "#F2F3F7" : "transparent",
              fontFamily: "var(--font-sans)", fontSize: 12, color: "#1F242D",
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
              onMouseLeave={e => e.currentTarget.style.background = k === value ? "#F2F3F7" : "transparent"}>
              {lbl}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

const ValueInput = ({ value, unit, onChange }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: "2px 4px 2px 8px",
    border: "1px solid #DCE0E9", background: "#fff",
    borderRadius: 6,
  }}>
    <input
      type="number"
      value={value}
      step={unit === "/5" ? 0.1 : 1}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      style={{
        width: 50,
        border: 0, outline: "none", background: "transparent",
        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "#1F242D",
        padding: "1px 2px",
        MozAppearance: "textfield",
      }}
    />
    <span style={{
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "#697182",
      paddingRight: 6, paddingLeft: 2,
    }}>{unit}</span>
  </span>
);

// — Escalation & handoff setup
const TRIGGER_OPTIONS = [
  { id: "cant_answer", label: "When AI can't answer after trying",
    desc: "AI exhausts its procedures and KB without a confident answer.", icon: "shield" },
  { id: "asks_human",  label: "When the customer asks for a human",
    desc: "Detects phrases like \"talk to a person\" or \"speak with an agent\".", icon: "chat" },
  { id: "frustrated",  label: "When the customer seems frustrated or repeats themselves",
    desc: "Sentiment turns negative or the same question is asked twice.", icon: "bolt" },
  { id: "timeout",     label: "After a set amount of time with no resolution",
    desc: "Maps to abandonmentTimeout + silentEscalationConfig.", icon: "task" },
];

const TEAMS = ["Tier 1 Support", "Tier 2 Support", "Billing", "Returns & Refunds", "VIP / High-value", "Trust & Safety"];
const QUEUES = ["General Inbox", "Priority Queue", "Billing Queue", "VIP Queue", "After-hours Queue"];

const DEFAULT_HANDOFF_MESSAGE = "Let me connect you with a team member who can help.";

const EscalationSetup = ({ value, onChange }) => {
  const set = (patch) => onChange({ ...value, ...patch });
  const toggleTrigger = (id) => set({
    triggers: value.triggers.includes(id)
      ? value.triggers.filter(x => x !== id)
      : [...value.triggers, id],
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* A — Trigger */}
      <div>
        <SubLabel letter="A" title="The trigger"
          hint="When should AI hand off to a human rep? Pick all that apply."/>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {TRIGGER_OPTIONS.map(t => {
            const on = value.triggers.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggleTrigger(t.id)} style={{
                textAlign: "left",
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 14px",
                border: on ? "1.5px solid #0165E4" : "1px solid #E8EAF0",
                background: on ? "#F5F9FF" : "#fff",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 140ms",
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  border: on ? "1.5px solid #0165E4" : "1.5px solid #B3BBCB",
                  background: on ? "#0165E4" : "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  {on && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
                  }}>{t.label}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
                    marginTop: 2, lineHeight: 1.45,
                  }}>{t.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* B — Destination */}
      <div>
        <SubLabel letter="B" title="The destination"
          hint="Where should escalated conversations go?"/>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <DestinationRow
            active={value.destination === "team"}
            onSelect={() => set({ destination: "team" })}
            title="Assign to a specific team"
            desc="Pick a team that owns this kind of escalation."
            picker={value.destination === "team" && (
              <SelectInline
                options={TEAMS}
                value={value.team}
                placeholder="Select a team"
                onSelect={(v) => set({ team: v })}
              />
            )}
          />
          <DestinationRow
            active={value.destination === "queue"}
            onSelect={() => set({ destination: "queue" })}
            title="Put in a queue and wait for the next available rep"
            desc="The conversation drops into a shared queue with skill-based routing."
            picker={value.destination === "queue" && (
              <SelectInline
                options={QUEUES}
                value={value.queue}
                placeholder="Select a queue"
                onSelect={(v) => set({ queue: v })}
              />
            )}
          />
          <DestinationRow
            active={value.destination === "unassigned"}
            onSelect={() => set({ destination: "unassigned" })}
            title="Leave unassigned in the inbox"
            desc="Conversation sits in Unassigned until a rep picks it up."
          />
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: "var(--font-mono, var(--font-sans))", fontSize: 11, color: "#9099AB",
        }}>
          routingBehavior.type = <span style={{ color: "#5F6675", fontWeight: 600 }}>{
            value.destination === "team" ? "deterministic"
              : value.destination === "queue" ? "queue" : "unassign"
          }</span>
        </div>
      </div>

      {/* C — Customer experience */}
      <div>
        <SubLabel letter="C" title="The customer experience during handoff"
          hint="What should AI tell the customer when it hands off?"/>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <MessageOptionRow
            active={value.messageType === "default"}
            onSelect={() => set({ messageType: "default" })}
            title="Use a default message"
            preview={`"${DEFAULT_HANDOFF_MESSAGE}"`}
          />
          <MessageOptionRow
            active={value.messageType === "custom"}
            onSelect={() => set({ messageType: "custom" })}
            title="Write your own"
            preview="Write a tailored handoff message your customers will see."
          >
            {value.messageType === "custom" && (
              <textarea
                value={value.customMessage}
                onChange={e => set({ customMessage: e.target.value })}
                placeholder="Thanks for your patience — I'm passing you to a specialist on our team who'll be with you shortly."
                rows={3}
                style={{
                  width: "100%", marginTop: 10,
                  padding: "10px 12px",
                  border: "1px solid #DCE0E9", borderRadius: 6,
                  fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
                  outline: "none", background: "#fff",
                  resize: "vertical", lineHeight: 1.5,
                  boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "#3F8CFF"; e.target.style.boxShadow = "0 0 0 3px rgba(63,140,255,0.18)"; }}
                onBlur={e => { e.target.style.borderColor = "#DCE0E9"; e.target.style.boxShadow = "none"; }}
              />
            )}
          </MessageOptionRow>
        </div>
      </div>
    </div>
  );
};

const SubLabel = ({ letter, title, hint }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
    <span style={{
      width: 22, height: 22, borderRadius: 6,
      background: "#F2F3F7", color: "#3F4654",
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, marginTop: 1,
    }}>{letter}</span>
    <div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D" }}>{title}</div>
      {hint && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2, lineHeight: 1.45 }}>{hint}</div>}
    </div>
  </div>
);

const DestinationRow = ({ active, onSelect, title, desc, picker }) => (
  <div onClick={onSelect} style={{
    padding: "12px 14px",
    border: active ? "1.5px solid #0165E4" : "1px solid #E8EAF0",
    background: active ? "#F5F9FF" : "#fff",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 140ms",
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <RadioDot active={active}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2, lineHeight: 1.45 }}>{desc}</div>
        {picker && (
          <div onClick={e => e.stopPropagation()} style={{ marginTop: 10, maxWidth: 320 }}>
            {picker}
          </div>
        )}
      </div>
    </div>
  </div>
);

const MessageOptionRow = ({ active, onSelect, title, preview, children }) => (
  <div onClick={onSelect} style={{
    padding: "12px 14px",
    border: active ? "1.5px solid #0165E4" : "1px solid #E8EAF0",
    background: active ? "#F5F9FF" : "#fff",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 140ms",
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <RadioDot active={active}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{title}</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
          marginTop: 2, lineHeight: 1.5,
          fontStyle: preview.startsWith('"') ? "italic" : "normal",
        }}>{preview}</div>
        {children}
      </div>
    </div>
  </div>
);

const RadioDot = ({ active }) => (
  <span style={{
    width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
    border: active ? "1.5px solid #0165E4" : "1.5px solid #B3BBCB",
    background: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  }}>
    {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0165E4" }}/>}
  </span>
);

// — Generated panel: shown after user clicks "Generate my AI setup"
const GOAL_PALETTE = {
  deflect:  { bg: "#EBF1FF", fg: "#0165E4", label: "Deflect common questions" },
  speed:    { bg: "#FFF4E6", fg: "#8A5A08", label: "Speed up rep responses" },
  escalate: { bg: "#F5EBFD", fg: "#7B22A4", label: "Reduce unnecessary escalations" },
  tracking: { bg: "#E8F5EE", fg: "#1F7A4B", label: "Status & order tracking" },
};

const generateProcedures = ({ goals, topics }) => {
  // Procedure catalog → ordered by relevance. Each carries default copy that
  // matches the existing Procedure editor (name, description, whenToUse, stepsHtml).
  const all = [
    {
      id: "p_track", title: "Order Tracking Lookup", goal: "tracking", topic: "tracking", topics: ["tracking", "shipping"], audience: ["aic", "air"],
      description: "Fetch carrier status and write a single-line summary.",
      whenToUse: "When the customer asks where their order is, requests a shipping update, or reports a delayed package.",
      stepsHtml: `<ol><li>Look up the order using <span data-mention="Order Lookup">@Order Lookup</span>.</li><li>Fetch the latest carrier event for the tracking number.</li><li>Reply with the most recent event and an estimated delivery window in one sentence.</li><li>If the package is delayed beyond the carrier ETA, offer one of: reship, refund, or a goodwill credit using <span data-mention="Goodwill Credit">@Goodwill Credit</span>.</li></ol>`,
    },
    {
      id: "p_return", title: "Process Return or Refund", goal: "deflect", topic: "returns", topics: ["returns"], audience: ["aic", "air"],
      description: "Verify, check eligibility, issue or offer alternative.",
      whenToUse: "When the customer asks for a refund, return, or expresses dissatisfaction with their order.",
      stepsHtml: `<ol><li>Verify the order via order ID using <span data-mention="Order Lookup">@Order Lookup</span>.</li><li>Check refund eligibility against the Returns & Refunds Policy.<ol><li>If past the return window, explain the policy and offer the closest alternative.</li><li>If within window, continue to step 3.</li></ol></li><li>Categorize the refund reason with <span data-mention="Refund Reason">@Refund Reason</span>.</li><li>Issue the refund or send a prepaid return label, then confirm the timeline.</li></ol>`,
    },
    {
      id: "p_faq", title: "Answer Product FAQ from KB", goal: "deflect", topic: "product", topics: ["product"], audience: ["aic", "air"],
      description: "Search the help center and answer with a sourced KB link.",
      whenToUse: "When the customer asks a product question (specs, compatibility, care, availability) that the Knowledge Base can answer.",
      stepsHtml: `<ol><li>Search the indexed help center using <span data-mention="KB Search">@KB Search</span> with the customer's exact phrasing.</li><li>If a confident match is found, reply with the answer in 1–2 sentences and link the source article.</li><li>If no confident answer is found, ask one clarifying question before searching again.</li><li>If still unresolved after two passes, hand off using <span data-mention="Escalate">@Escalate</span>.</li></ol>`,
    },
    {
      id: "p_account", title: "Verify Identity & Account Help", goal: "escalate", topic: "account", topics: ["account"], audience: ["air"],
      description: "Confirm identity before any account-level change.",
      whenToUse: "Before any account-level change (password reset, email change, plan change) is made on behalf of the customer.",
      stepsHtml: `<ol><li>Greet the customer and explain that a quick identity check is required.</li><li>Ask for two of: email on file, last 4 of the payment method, recent order ID.</li><li>Compare the answers to values on the account record via <span data-mention="Account Lookup">@Account Lookup</span>.</li><li>If verification succeeds, make the requested change and confirm.</li><li>If verification fails, escalate using <span data-mention="Escalate">@Escalate</span> instead of proceeding.</li></ol>`,
    },
    {
      id: "p_handoff", title: "Smart Escalation Handoff", goal: "escalate", topic: null, topics: ["returns", "account", "shipping"], audience: ["aic", "air"],
      description: "Summarize and route to a human when AI hits its limit.",
      whenToUse: "When AI exhausts its procedures, when the customer asks for a human, or when sentiment drops to negative for two consecutive turns.",
      stepsHtml: `<ol><li>Summarize the conversation and the reason for escalation in one short paragraph.</li><li>Tag the appropriate team using <span data-mention="Team Lead">@Team Lead</span>.</li><li>Set the conversation status to <em>Pending — Specialist</em>.</li><li>Let the customer know a human will follow up and provide an expected response window.</li></ol>`,
    },
    {
      id: "p_assist", title: "Rep Draft Assist", goal: "speed", topic: null, topics: ["tracking", "returns", "product", "account", "shipping"], audience: ["air"],
      description: "Summarize the thread and draft a reply for the rep.",
      whenToUse: "When a rep opens a conversation and needs a suggested first reply or a summary of the thread so far.",
      stepsHtml: `<ol><li>Summarize the conversation so far in 2–3 bullets, surfacing intent and any unresolved questions.</li><li>Draft a reply in the brand voice using <span data-mention="Voice">@Voice</span> and the latest customer message as context.</li><li>Highlight any policy references the rep should double-check before sending.</li></ol>`,
    },
  ];
  const picked = goals && goals.length ? new Set(goals) : null;
  const pickedT = topics && topics.length ? new Set(topics) : null;
  const score = (p) => {
    let s = 0;
    if (picked && picked.has(p.goal))   s += 2;
    const procTopics = Array.isArray(p.topics) ? p.topics : (p.topic ? [p.topic] : []);
    if (pickedT && procTopics.some(t => pickedT.has(t))) s += 1;
    return s;
  };
  return [...all]
    .sort((a, b) => score(b) - score(a))
    .slice(0, 5)
    .map(p => ({ ...p, name: p.title }));
};

const GeneratedPanel = ({ company, goals, topics, scenarios, monitors, onEdit, onSaveContinue }) => {
  const [items, setItems] = React.useState(() => generateProcedures({ goals, topics }));
  const [expandedId, setExpandedId] = React.useState(null);
  const update = (id, patch) =>
    setItems(list => list.map(x => x.id === id ? { ...x, ...patch } : x));
  const remove = (id) =>
    setItems(list => list.filter(x => x.id !== id));
  const add = () => {
    const id = `p_new_${Date.now()}`;
    setItems(list => [...list, {
      id,
      name: "New procedure",
      goal: "deflect",
      description: "Describe what this procedure does in one line.",
      whenToUse: "Describe when this procedure should be used.",
      stepsHtml: "<ol><li></li></ol>",
    }]);
    setExpandedId(id);
  };
  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);
  const Table = window.BuildProceduresTable;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "40px 48px 80px", minWidth: 520, background: "#fff" }}>
      <div style={{ maxWidth: 1100 }}>
        {/* Step pill */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          padding: "4px 12px",
          background: "#EBF1FF", border: "1px solid #CBDCFF",
          color: "#0E3280",
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.02em",
          borderRadius: 999, marginBottom: 16,
        }}>Step 2 of 5</div>

        {Table ? (
          <Table
            items={items}
            expandedId={expandedId}
            onToggle={toggle}
            onUpdate={update}
            onRemove={remove}
            onAdd={add}
          />
        ) : (
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182" }}>
            Loading procedures…
          </div>
        )}

        {/* Actions */}
        <div style={{
          marginTop: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <button onClick={onEdit} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 8, cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Edit my answers
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{
              padding: "9px 16px",
              border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 8, cursor: "pointer",
            }}>Discard</button>
            <button onClick={onSaveContinue} style={{
              padding: "9px 18px",
              border: 0, background: "#0165E4", color: "#fff",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 8, cursor: "pointer",
              boxShadow: "0 1px 2px rgba(1,101,228,0.25)",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              Save & continue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// — Test & Evaluate: shown when user clicks Save & continue from Build
const TEST_CATEGORY_BANK = [
  { id: "refund_standard", name: "Standard Refund Requests",       caseCount: 5, goal: "deflect",  topic: "returns",  topics: ["returns"] },
  { id: "damaged",         name: "Damaged or Defective Items",     caseCount: 4, goal: "deflect",  topic: "returns",  topics: ["returns", "product"] },
  { id: "delivery_refund", name: "Late Delivery Refunds",          caseCount: 3, goal: "tracking", topic: "tracking", topics: ["tracking", "shipping", "returns"] },
  { id: "tracking",        name: "Order Tracking & Status",        caseCount: 6, goal: "tracking", topic: "tracking", topics: ["tracking", "shipping"] },
  { id: "product_faq",     name: "Product Questions",              caseCount: 5, goal: "deflect",  topic: "product",  topics: ["product"] },
  { id: "account_verify",  name: "Identity & Account Access",      caseCount: 4, goal: "escalate", topic: "account",  topics: ["account"] },
  { id: "escalation",      name: "Smart Escalation Handoff",       caseCount: 3, goal: "escalate", topic: null,       topics: ["returns", "account", "shipping"] },
  { id: "rep_assist",      name: "Rep Draft Assist",               caseCount: 4, goal: "speed",    topic: null,       topics: ["tracking", "returns", "product", "account", "shipping"] },
];

const buildTestCategories = ({ goals, topics }) => {
  const picked = new Set(goals || []);
  const pickedT = new Set(topics || []);
  const score = (c) =>
    (picked.has(c.goal) ? 2 : 0) + (c.topic && pickedT.has(c.topic) ? 1 : 0);
  return [...TEST_CATEGORY_BANK]
    .sort((a, b) => score(b) - score(a))
    .slice(0, 6);
};

const TestEvaluatePanel = ({ goals, topics, onBack, onContinue }) => {
  const categories = buildTestCategories({ goals, topics });
  const [results, setResults] = React.useState({});
  const [running, setRunning] = React.useState(false);

  const runAll = () => {
    if (running) return;
    setRunning(true);
    setResults({});
    categories.forEach((c, i) => {
      window.setTimeout(() => {
        // Mock outcomes — most pass, one warning, one fail.
        const verdict = i === 4 ? "warning" : i === 5 ? "fail" : "pass";
        const base = verdict === "pass" ? 0.92 : verdict === "warning" ? 0.74 : 0.41;
        const scoreVal = Math.round((base + (i % 3) * 0.012) * 100);
        setResults(r => ({ ...r, [c.id]: { verdict, score: scoreVal, ranAt: "Just now" } }));
        if (i === categories.length - 1) setRunning(false);
      }, 400 + i * 280);
    });
  };

  const passed = Object.values(results).filter(r => r.verdict === "pass").length;
  const warned = Object.values(results).filter(r => r.verdict === "warning").length;
  const failed = Object.values(results).filter(r => r.verdict === "fail").length;
  const completed = Object.keys(results).length;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "40px 48px 80px", minWidth: 520, background: "#fff" }}>
      <div style={{ maxWidth: 1100 }}>
        {/* Step pill */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          padding: "4px 12px",
          background: "#EBF1FF", border: "1px solid #CBDCFF",
          color: "#0E3280",
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.02em",
          borderRadius: 999, marginBottom: 16,
        }}>Step 3 of 5</div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-display)", fontWeight: 500,
              fontSize: 22, lineHeight: 1.2, color: "#1F242D",
              letterSpacing: "-0.005em",
            }}>Test Categories</div>
            <div style={{
              marginTop: 6,
              fontFamily: "var(--font-sans)", fontSize: 13.5, color: "#5F6675", lineHeight: 1.55,
              maxWidth: 720,
            }}>
              Run your AI against sample conversations grouped by scenario type. Each category is scored against your configured goals.
            </div>
          </div>
          <button onClick={runAll} disabled={running} style={{
            padding: "9px 16px",
            border: 0,
            background: running ? "#7DAEF7" : "#0165E4",
            color: "#fff",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 6, cursor: running ? "wait" : "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
            flexShrink: 0,
            boxShadow: "0 1px 2px rgba(1,101,228,0.25)",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            {running ? "Running…" : completed > 0 ? "Re-run All Tests" : "Run All Tests"}
          </button>
        </div>

        {/* Status line */}
        {completed > 0 && (
          <div style={{
            marginTop: 4, marginBottom: 4,
            fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
          }}>
            {passed} passed · {warned} warning{warned === 1 ? "" : "s"} · {failed} failed
            {completed < categories.length ? ` · running ${completed}/${categories.length}` : ""}
          </div>
        )}

        {/* Table */}
        <div style={{
          marginTop: 16,
          border: "1px solid #E8EAF0", borderRadius: 8,
          background: "#fff", overflow: "hidden",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 1.2fr) minmax(140px, 0.9fr) minmax(170px, 1.2fr) 100px 130px 110px",
            gap: 16, padding: "9px 16px",
            background: "#FAFBFD", borderBottom: "1px solid #E8EAF0",
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
            color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <div>Category name</div>
            <div>Used by</div>
            <div>Topics Covered</div>
            <div>Status</div>
            <div>Last run</div>
            <div>Score</div>
          </div>
          {categories.map((c, i) => (
            <SetupTestCategoryRow
              key={c.id}
              category={c}
              result={results[c.id]}
              running={running && !results[c.id]}
              isFirst={i === 0}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          marginTop: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 8, cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Build
          </button>
          <button onClick={completed >= categories.length ? onContinue : undefined} style={{
            padding: "9px 20px",
            border: 0, background: completed >= categories.length ? "#16A36B" : "#DCE0E9",
            color: "#fff",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 8,
            cursor: completed >= categories.length ? "pointer" : "not-allowed",
            boxShadow: completed >= categories.length ? "0 1px 2px rgba(22,163,107,0.25)" : "none",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            Continue to Deploy
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const SetupTestCategoryRow = ({ category, result, running, isFirst }) => {
  const goalOption = (window.GOAL_OPTIONS || GOAL_OPTIONS).find(g => g.id === category.goal);
  const audiences = goalOption
    ? (Array.isArray(goalOption.audience) ? goalOption.audience : [goalOption.audience])
    : [];
  const renderAudienceTag = (a) => {
    const palette = a === "air"
      ? { bg: "#F5EBFD", fg: "#7B22A4", label: "AI for Reps" }
      : { bg: "#EBF1FF", fg: "#0165E4", label: "AI for Customers" };
    return (
      <span key={a} style={{
        display: "inline-flex", alignItems: "center",
        padding: "1px 7px",
        background: palette.bg, color: palette.fg,
        fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700,
        letterSpacing: "0.02em",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}>{palette.label}</span>
    );
  };
  const verdictPalette = result
    ? result.verdict === "pass"
      ? { bg: "#E8F5EE", fg: "#1F7A4B", label: `Pass · ${result.score}%` }
      : result.verdict === "warning"
        ? { bg: "#FFF4E6", fg: "#8A5A08", label: `Warning · ${result.score}%` }
        : { bg: "#FFEDED", fg: "#A8202A", label: `Fail · ${result.score}%` }
    : null;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(180px, 1.2fr) minmax(140px, 0.9fr) minmax(170px, 1.2fr) 100px 130px 110px",
      gap: 16, padding: "12px 16px",
      alignItems: "center",
      borderTop: isFirst ? 0 : "1px solid #F0F2F6",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
          lineHeight: 1.35,
        }}>{category.name}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {audiences.map(renderAudienceTag)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {(() => {
          const TOPIC_OPTIONS = window.TOPIC_OPTIONS || [];
          const catTopics = Array.isArray(category.topics)
            ? category.topics
            : (category.topic ? [category.topic] : []);
          if (catTopics.length === 0) {
            return <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB" }}>—</span>;
          }
          return catTopics.map(t => {
            const opt = TOPIC_OPTIONS.find(o => o.id === t);
            const label = opt ? opt.label : t;
            return (
              <span key={t} style={{
                display: "inline-flex", alignItems: "center",
                padding: "2px 8px",
                background: "#F2F3F7", color: "#3F4654",
                fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600,
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}>{label}</span>
            );
          });
        })()}
      </div>
      <div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          padding: "3px 10px",
          background: "#EBF1FF", color: "#0165E4",
          fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 700,
          borderRadius: 999,
        }}>Current</span>
      </div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182",
      }}>
        {running ? "Running…" : result ? result.ranAt : "No prior runs"}
      </div>
      <div>
        {verdictPalette ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px",
            background: verdictPalette.bg, color: verdictPalette.fg,
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
            borderRadius: 999,
          }}>{verdictPalette.label}</span>
        ) : (
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#9099AB",
          }}>—</span>
        )}
      </div>
    </div>
  );
};

// — Right-side AI Setup Assistant (replaces the preview)
const SetupAssistant = ({ company, topics, goals, knowledge, tone, escalation, scenarios, monitors, view }) => {
  const goalLabels = (goals || []).map(g => (GOAL_OPTIONS.find(x => x.id === g) || {}).title).filter(Boolean);
  const topicLabels = (topics || []).map(t => (TOPIC_OPTIONS.find(x => x.id === t) || {}).label).filter(Boolean);

  const contextSummary = (() => {
    const parts = [];
    if (company?.name) parts.push(`Company: ${company.name}${company.industry ? ` (${company.industry})` : ""}`);
    if (company?.description) parts.push(`About: ${company.description}`);
    if (goalLabels.length) parts.push(`Goals: ${goalLabels.join(", ")}`);
    if (topicLabels.length) parts.push(`Top topics: ${topicLabels.join(", ")}`);
    if (knowledge?.url) parts.push(`Help center: ${knowledge.url}`);
    if (tone) parts.push(`Tone: ${tone}`);
    if (monitors?.length) parts.push(`Monitors: ${monitors.map(m => m.label).join(", ")}`);
    return parts.length ? parts.join("\n") : "Nothing filled in yet.";
  })();

  const greeting = view === "setup-test"
    ? "I'll watch the test runs and help you triage any failures. Ask me about any scenario."
    : view === "setup-build"
      ? "I drafted these procedures from your goals. Ask me to refine a step, change tone, or add a procedure."
      : "Hi! I'm your setup assistant. Ask me anything as you fill out the form — picking goals, drafting procedures, or what each section does.";

  const suggestions = view === "setup-test"
    ? ["Why did test 6 fail?", "Add 2 more edge cases", "Score against deflection goal"]
    : view === "setup-build"
      ? ["Add an exchange procedure", "Tighten the refund steps", "What's missing?"]
      : ["Suggest goals for my business", "What should escalate to a human?", "Draft a tone for my brand"];

  const [messages, setMessages] = React.useState([{ role: "assistant", text: greeting }]);
  // Reset greeting when the stage changes.
  React.useEffect(() => {
    setMessages([{ role: "assistant", text: greeting }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const ask = async (text) => {
    const userText = (text == null ? draft : text).trim();
    if (!userText || thinking) return;
    setDraft("");
    setMessages(m => [...m, { role: "user", text: userText }]);
    setThinking(true);
    try {
      const history = [...messages, { role: "user", text: userText }]
        .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
        .join("\n");
      const prompt = `You are a friendly setup assistant inside the Kustomer AI configuration page. Help the user pick goals, write procedures, or understand the setup. Reply in 1–3 short sentences. No markdown headings or bullets.

Current stage: ${view || "setup"}
Form state:
${contextSummary}

Conversation:
${history}
Assistant:`;
      const reply = await window.claude.complete(prompt);
      setMessages(m => [...m, { role: "assistant", text: (reply || "").trim() || "Got it — let me think about that one." }]);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", text: "I hit a snag reaching the model. Try again in a moment." }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <aside style={{
      width: 360, flexShrink: 0,
      borderLeft: "1px solid #E8EAF0",
      background: "#FAFBFD",
      display: "flex", flexDirection: "column",
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 18px 14px",
        borderBottom: "1px solid #E8EAF0",
        display: "flex", alignItems: "center", gap: 10,
        background: "#FAFBFD",
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: "#1F242D", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <SparkleGlyph/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>
            Setup Assistant
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontFamily: "var(--font-sans)", fontSize: 11, color: "#697182",
            marginTop: 1,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A36B" }}/>
            Ready
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, minHeight: 0, overflow: "auto",
        padding: "18px 16px 4px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {messages.map((m, i) => (
          <AssistantBubble key={i} role={m.role} text={m.text}/>
        ))}
        {thinking && (
          <AssistantBubble role="assistant" text="…"/>
        )}
      </div>

      {/* Suggestion chips */}
      <div style={{
        padding: "10px 14px 4px",
        display: "flex", flexWrap: "wrap", gap: 6,
      }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => ask(s)} disabled={thinking} style={{
            padding: "5px 10px",
            border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 500,
            borderRadius: 999, cursor: thinking ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); ask(); }} style={{
        padding: "10px 14px 16px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Ask the assistant…"
          disabled={thinking}
          style={{
            flex: 1, minWidth: 0,
            padding: "9px 12px",
            border: "1px solid #DCE0E9", borderRadius: 8,
            fontFamily: "var(--font-sans)", fontSize: 13,
            outline: "none", background: "#fff",
          }}
        />
        <button type="submit" disabled={thinking || !draft.trim()} style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          border: 0, background: draft.trim() && !thinking ? "#0165E4" : "#DCE0E9",
          color: "#fff", cursor: draft.trim() && !thinking ? "pointer" : "not-allowed",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
    </aside>
  );
};

const AssistantBubble = ({ role, text }) => {
  const isUser = role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
    }}>
      <div style={{
        maxWidth: "85%",
        padding: "9px 12px",
        background: isUser ? "#0165E4" : "#fff",
        color: isUser ? "#fff" : "#1F242D",
        border: isUser ? "0" : "1px solid #E8EAF0",
        borderRadius: 12,
        borderBottomRightRadius: isUser ? 4 : 12,
        borderBottomLeftRadius: isUser ? 12 : 4,
        fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>{text}</div>
    </div>
  );
};

// — Live preview panel
const SetupPreview = ({ company, topics, goals, knowledge, tone, escalation, scenarios, monitors, progress, generated, accountType }) => {
  // Goals + topics → planned outputs
  const planned = computePlan({ company, topics, goals, knowledge, tone, escalation, scenarios });

  return (
    <aside style={{
      width: 360, flexShrink: 0,
      borderLeft: "1px solid #E8EAF0",
      background: "#FAFBFD",
      display: "flex", flexDirection: "column",
      minHeight: 0,
      overflow: "auto",
    }}>
      <div style={{
        padding: "20px 22px 12px",
        position: "sticky", top: 0, background: "#FAFBFD", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <SparkleGlyph/>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>
            What we'll generate
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", lineHeight: 1.5 }}>
          {generated
            ? "Build ready. Review and tweak each item below."
            : accountType === "existing"
              ? "Based on your conversation history and answers."
              : "Updates as you fill in the form."}
        </div>
        {/* Progress */}
        <div style={{
          marginTop: 12,
          height: 4, borderRadius: 999, background: "#E8EAF0", overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: "linear-gradient(90deg, #3F8CFF, #6E79E0 80%, #B31DF0)",
            transition: "width 240ms var(--ease-standard)",
          }}/>
        </div>
      </div>

      <div style={{ padding: "8px 22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <PreviewCard
          icon="chat" tone="aic"
          title={`${planned.automations.length} AI Procedure${planned.automations.length === 1 ? "" : "s"}`}
          subtitle="AI for Customers — autonomous reply"
          items={planned.automations}
          empty="Pick goals like Status & order tracking or Deflect to unlock procedures."
        />
        <PreviewCard
          icon="bookOpen" tone="neutral"
          title={planned.knowledge.length > 0 ? "Knowledge Sources" : "No Knowledge Sources yet"}
          subtitle={knowledge.url || "Add a help center or upload docs."}
          items={planned.knowledge}
          empty="Add a help center URL to ingest articles."
        />
        <PreviewCard
          icon="sparkles" tone="air"
          title={planned.copilot ? "Copilot for Reps" : "Copilot for Reps (off)"}
          subtitle={planned.copilot ? "Suggestions, summaries, signals" : "Pick Speed up rep responses or Summarize."}
          items={planned.copilotItems}
        />
        <PreviewCard
          icon="globe" tone="air"
          title={planned.translations ? "Translations enabled" : "Translations (off)"}
          subtitle={planned.translations ? "Inbound & outbound, real-time" : "Pick Translate to turn this on."}
        />
        <PreviewCard
          icon="shield" tone="aic"
          title={planned.escalation.title}
          subtitle={planned.escalation.subtitle}
          items={planned.escalation.items}
          empty="Pick at least one handoff trigger to configure routing."
        />
        <PreviewCard
          icon="upload" tone="neutral"
          title={scenarios && scenarios.length
            ? `${scenarios.length} Scenario${scenarios.length === 1 ? "" : "s"} uploaded`
            : "Scenarios (none uploaded)"}
          subtitle={scenarios && scenarios.length
            ? "We'll draft a Procedure for each."
            : "Upload PDFs, screenshots, or docs to seed Procedures."}
          items={(scenarios || []).map(s => s.title || s.name)}
        />
        <PreviewCard
          icon="chartLine" tone="aic"
          title={monitors && monitors.length
            ? `${monitors.length} Performance monitor${monitors.length === 1 ? "" : "s"}`
            : "No monitors yet"}
          subtitle={monitors && monitors.length
            ? "We'll alert you when these drift."
            : "Add monitors to track KPIs over time."}
          items={(monitors || []).map(m =>
            `${m.label} ${OP_LABELS[m.op]} ${m.value}${m.unit === "convos" ? " convos" : m.unit}`
          )}
        />
        <PreviewCard
          icon="pencilEdit" tone="neutral"
          title="Tone of voice"
          subtitle={tone ? prettyTone(tone) : "Pick a tone in step 5."}
        />
      </div>
    </aside>
  );
};

const prettyTone = (id) => ({
  friendly: "Friendly", professional: "Professional",
  casual: "Casual", matter: "Matter of Fact", custom: "Custom",
}[id] || id);

const computePlan = ({ company, topics, goals, knowledge, tone, escalation, scenarios }) => {
  const auto = [];
  const procs = [];
  const copilotItems = [];

  // Topic-driven (existing customer) — each picked topic seeds Automations + Procedures
  (topics || []).forEach(tid => {
    const t = TOPIC_OPTIONS.find(x => x.id === tid);
    if (!t) return;
    t.suggested.forEach(a => auto.push(a));
    t.procedures.forEach(p => procs.push(p));
  });

  if (goals.includes("deflect")) {
    auto.push("FAQ Deflection");
    procs.push("Greeting & Triage", "Answer FAQ from KB");
  }
  if (goals.includes("tracking")) {
    auto.push("Order Tracking", "Returns");
    procs.push("Tracking Lookup", "Main Return Procedure");
  }
  if (goals.includes("escalate")) {
    procs.push("Verify Customer Identity", "Escalate to Specialist");
  }
  if (goals.includes("speed")) {
    copilotItems.push("Proactive Suggestions", "Draft replies");
  }
  if (goals.includes("summarize")) {
    copilotItems.push("Conversation summaries", "Customer signals");
  }

  // User-uploaded scenarios → draft Procedures
  (scenarios || []).forEach(s => {
    procs.push(`Draft: ${s.title || s.name.replace(/\.[^.]+$/, "")}`);
  });

  // Escalation summary
  const esc = escalation || { triggers: [], destination: "queue" };
  const triggerLabels = (esc.triggers || []).map(id => {
    const t = TRIGGER_OPTIONS.find(x => x.id === id);
    return t ? t.label.replace(/^When (the customer )?/, "").replace(/^After /, "After ") : id;
  });
  const destLabel =
    esc.destination === "team"       ? (esc.team  ? `Route to ${esc.team}` : "Route to a team (pick one)")
  : esc.destination === "queue"      ? (esc.queue ? `Queue: ${esc.queue}`  : "Send to a queue (pick one)")
  : esc.destination === "unassigned" ? "Leave unassigned in inbox"
  : null;
  const msgLabel =
    esc.messageType === "custom"
      ? (esc.customMessage ? "Custom handoff message" : "Custom message (write one)")
      : "Default handoff message";
  const escalationItems = [];
  if (triggerLabels.length) escalationItems.push(...triggerLabels.map(l => `Trigger: ${l[0].toUpperCase() + l.slice(1)}`));
  if (destLabel) escalationItems.push(destLabel);
  if (triggerLabels.length) escalationItems.push(msgLabel);

  return {
    automations: dedupe(auto),
    procedures:  dedupe(procs),
    knowledge:   knowledge.url ? [knowledge.url.replace(/^https?:\/\//, "")] : [],
    copilot:     goals.includes("speed") || goals.includes("summarize"),
    copilotItems: dedupe(copilotItems),
    translations: goals.includes("translate"),
    escalation: {
      title: triggerLabels.length
        ? `Escalation (${triggerLabels.length} trigger${triggerLabels.length === 1 ? "" : "s"})`
        : "Escalation rules",
      subtitle: triggerLabels.length
        ? "Triggers, routing & handoff message"
        : "Define when AI should hand off to a human.",
      items: escalationItems,
    },
  };
};

const dedupe = (arr) => Array.from(new Set(arr));

const PreviewCard = ({ icon, title, subtitle, items, empty, tone }) => {
  const palettes = {
    aic:     { bg: "#EBF1FF", fg: "#0165E4" },
    air:     { bg: "#F5EBFD", fg: "#7B22A4" },
    neutral: { bg: "#F2F3F7", fg: "#5F6675" },
  };
  const p = palettes[tone] || palettes.neutral;
  const hasItems = items && items.length > 0;
  return (
    <div style={{
      background: "#fff", border: "1px solid #E8EAF0", borderRadius: 10,
      padding: "12px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: hasItems ? 10 : 0 }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          background: p.bg, color: p.fg,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <RailIcon name={icon} size={14} strokeWidth={1.8}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{title}</div>
          {subtitle && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
      </div>
      {hasItems ? (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4, paddingLeft: 40 }}>
          {items.map((it, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              fontFamily: "var(--font-sans)", fontSize: 12, color: "#3F4654",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16A36B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              {it}
            </li>
          ))}
        </ul>
      ) : (
        empty && <div style={{
          paddingLeft: 40,
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB", lineHeight: 1.45, fontStyle: "italic",
        }}>{empty}</div>
      )}
    </div>
  );
};

// — Audience picker: lets the user choose AI for Customers, AI for Reps, or both.
const AudiencePicker = ({ value, onChange }) => {
  const opts = [
    {
      id: "aic", label: "AI for Customers",
      desc: "Autonomous AI handles inbound customer conversations end-to-end.",
      palette: { fg: "#0165E4", bg: "#EBF1FF", border: "#CBDCFF" },
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      id: "air", label: "AI for Reps",
      desc: "Copilot helps your reps reply faster with drafts, summaries, and signals.",
      palette: { fg: "#7B22A4", bg: "#F5EBFD", border: "#EBD2FF" },
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"/>
          <circle cx="9" cy="7" r="3"/>
          <path d="M16 11h6M19 8v6"/>
        </svg>
      ),
    },
  ];

  const toggle = (id) => onChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
      {opts.map(o => {
        const on = value.includes(o.id);
        return (
          <button key={o.id} onClick={() => toggle(o.id)} style={{
            textAlign: "left",
            padding: "16px",
            border: on ? `1.5px solid ${o.palette.fg}` : "1px solid #E8EAF0",
            background: on ? o.palette.bg : "#fff",
            borderRadius: 10,
            cursor: "pointer",
            display: "flex", alignItems: "flex-start", gap: 12,
            position: "relative",
            transition: "all 140ms",
          }}>
            <span style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: on ? "#fff" : "#F2F3F7",
              color: on ? o.palette.fg : "#5F6675",
              border: on ? `1px solid ${o.palette.border}` : "0",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{o.icon}</span>
            <div style={{ flex: 1, minWidth: 0, paddingRight: on ? 22 : 0 }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
                color: "#1F242D", marginBottom: 4,
              }}>{o.label}</div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.45,
                color: "#697182",
              }}>{o.desc}</div>
            </div>
            {on && (
              <span style={{
                position: "absolute", top: 12, right: 12,
                width: 18, height: 18, borderRadius: "50%",
                background: o.palette.fg, color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// — Goals grid: filtered by audience, with custom-goal support.
const GoalsGrid = ({ audience, goals, onToggle, customGoals, onAddCustom, onRemoveCustom }) => {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState({ title: "", desc: "", audience: audience[0] || "aic" });

  // Filter built-ins to only those whose audience overlaps the selection.
  const audSet = new Set(audience);
  const matches = (a) => {
    const arr = Array.isArray(a) ? a : [a];
    return arr.some(x => audSet.has(x));
  };
  const visible = GOAL_OPTIONS.filter(g => matches(g.audience));
  const visibleCustom = customGoals.filter(g => matches(g.audience));

  const renderCard = (g, { custom = false } = {}) => {
    const on = goals.includes(g.id);
    return (
      <button key={g.id} onClick={() => onToggle(g.id)} style={{
        textAlign: "left",
        padding: "14px 14px 14px 16px",
        border: on ? "1.5px solid #0165E4" : "1px solid #E8EAF0",
        background: on ? "#F5F9FF" : "#fff",
        borderRadius: 10,
        cursor: "pointer",
        display: "flex", alignItems: "flex-start", gap: 12,
        transition: "all 140ms",
        position: "relative",
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: on ? "#0165E4" : "#F2F3F7",
          color: on ? "#fff" : "#5F6675",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <RailIcon name={g.icon || "sparkles"} size={16} strokeWidth={1.8}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 4, flexWrap: "wrap",
            paddingRight: on || custom ? 24 : 0,
          }}>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
              color: "#1F242D",
            }}>{g.title}</div>
            {(Array.isArray(g.audience) ? g.audience : [g.audience]).map(a => (
              <AudienceTag key={a} audience={a}/>
            ))}
            {custom && (
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "1px 7px",
                background: "#F2F3F7", color: "#3F4654",
                fontFamily: "var(--font-sans)", fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.02em", borderRadius: 999,
              }}>Custom</span>
            )}
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12, lineHeight: 1.4,
            color: "#697182",
          }}>{g.desc}</div>
        </div>
        {custom && (
          <button
            onClick={e => { e.stopPropagation(); onRemoveCustom(g.id); }}
            title="Remove"
            style={{
              position: "absolute", top: 10, right: 10,
              width: 22, height: 22, borderRadius: 6,
              border: 0, background: "transparent", color: "#9099AB",
              cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#CD1D2B"; e.currentTarget.style.background = "#FFF4F4"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#9099AB"; e.currentTarget.style.background = "transparent"; }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
        {on && !custom && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            width: 18, height: 18, borderRadius: "50%",
            background: "#0165E4", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
        )}
      </button>
    );
  };

  const submitCustom = () => {
    if (!draft.title.trim()) return;
    const id = `custom_${Date.now()}`;
    onAddCustom({
      id,
      title: draft.title.trim(),
      desc: draft.desc.trim() || "Custom goal.",
      audience: draft.audience,
      icon: "sparkles",
    });
    onToggle(id);  // auto-select the new goal
    setDraft({ title: "", desc: "", audience: audience[0] || "aic" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {visible.map(g => renderCard(g))}
        {visibleCustom.map(g => renderCard(g, { custom: true }))}
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} style={{
          marginTop: 10,
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 14px",
          border: "1px dashed #BBD1FF", background: "#fff", color: "#0165E4",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          borderRadius: 8, cursor: "pointer",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#EBF1FF"; e.currentTarget.style.borderStyle = "solid"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderStyle = "dashed"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add a custom goal
        </button>
      ) : (
        <div style={{
          marginTop: 12,
          padding: "16px",
          border: "1px solid #CBDCFF", background: "#F5F9FF", borderRadius: 10,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
          }}>Add a custom goal</div>
          <input
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            placeholder="Goal title (e.g. Win back at-risk customers)"
            style={{
              width: "100%", padding: "9px 12px",
              border: "1px solid #DCE0E9", borderRadius: 6,
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
              outline: "none", background: "#fff", boxSizing: "border-box",
            }}/>
          <textarea
            value={draft.desc}
            onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))}
            placeholder="What should AI do for this goal? (e.g. Identify churn signals and proactively reach out.)"
            rows={2}
            style={{
              width: "100%", padding: "9px 12px",
              border: "1px solid #DCE0E9", borderRadius: 6,
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
              lineHeight: 1.5, resize: "vertical",
              outline: "none", background: "#fff", boxSizing: "border-box",
              minHeight: 56,
            }}/>
          {audience.length > 1 && (
            <div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 700,
                color: "#697182", textTransform: "uppercase", letterSpacing: "0.04em",
                marginBottom: 6,
              }}>Applies to</div>
              <div style={{ display: "inline-flex", gap: 4, padding: 3, background: "#fff", borderRadius: 999, border: "1px solid #E8EAF0" }}>
                {audience.map(a => (
                  <button key={a} onClick={() => setDraft(d => ({ ...d, audience: a }))} style={{
                    padding: "5px 11px", border: 0,
                    background: draft.audience === a ? (a === "air" ? "#F5EBFD" : "#EBF1FF") : "transparent",
                    color: draft.audience === a ? (a === "air" ? "#7B22A4" : "#0165E4") : "#5F6675",
                    fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
                    borderRadius: 999, cursor: "pointer",
                  }}>{a === "air" ? "AI for Reps" : "AI for Customers"}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => { setAdding(false); setDraft({ title: "", desc: "", audience: audience[0] || "aic" }); }} style={{
              padding: "7px 14px",
              border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 6, cursor: "pointer",
            }}>Cancel</button>
            <button onClick={submitCustom} disabled={!draft.title.trim()} style={{
              padding: "7px 14px",
              border: 0,
              background: draft.title.trim() ? "#0165E4" : "#DCE0E9",
              color: "#fff",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 6, cursor: draft.title.trim() ? "pointer" : "not-allowed",
            }}>Add goal</button>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { SetupPanel, GOAL_OPTIONS, TOPIC_OPTIONS, AudienceTag });

// — Account type toggle banner
const AccountTypeToggle = ({ value, onChange }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    padding: "12px 14px",
    background: value === "existing" ? "#EBF1FF" : "#FFFEF2",
    border: "1px solid " + (value === "existing" ? "#CBDCFF" : "#FDF1A4"),
    borderRadius: 10,
    marginBottom: 32,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        width: 26, height: 26, borderRadius: "50%",
        background: "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: value === "existing" ? "#0165E4" : "#8A5A08",
        flexShrink: 0,
      }}>
        <RailIcon name={value === "existing" ? "chartLine" : "sparkles"} size={14} strokeWidth={1.9}/>
      </span>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>
          {value === "existing"
            ? "We analyzed your last 90 days of conversations"
            : "You're brand new to Kustomer"}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 1 }}>
          {value === "existing"
            ? "We'll suggest topics to automate based on what your customers actually ask."
            : "We'll ask about your business and goals so we can scaffold your AI from scratch."}
        </div>
      </div>
    </div>
    <div style={{ display: "inline-flex", gap: 2, padding: 3, background: "#fff", borderRadius: 999, border: "1px solid #DCE0E9", flexShrink: 0 }}>
      {[
        { id: "new",      label: "New" },
        { id: "existing", label: "Existing" },
      ].map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: "5px 12px", border: 0,
          background: value === o.id ? "#1F242D" : "transparent",
          color: value === o.id ? "#fff" : "#5F6675",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
          borderRadius: 999, cursor: "pointer",
        }}>{o.label}</button>
      ))}
    </div>
  </div>
);

// — Topic grid for existing customers
const TopicGrid = ({ topics, selected, onToggle }) => {
  const totalSelected = selected.reduce((sum, id) => {
    const t = topics.find(x => x.id === id);
    return sum + (t ? t.volume : 0);
  }, 0);
  const avgDeflect = selected.length > 0 ? Math.round(
    selected.reduce((sum, id) => {
      const t = topics.find(x => x.id === id);
      return sum + (t ? t.deflectable : 0);
    }, 0) / selected.length
  ) : 0;

  return (
    <>
      {/* Summary band */}
      <div style={{
        display: "flex", gap: 16,
        padding: "12px 14px",
        background: "#FAFBFD", border: "1px solid #E8EAF0", borderRadius: 8,
        marginBottom: 12,
      }}>
        <Stat label="Topics selected" value={String(selected.length)} sub={`of ${topics.length}`}/>
        <StatDivider/>
        <Stat label="Conversation coverage" value={`${totalSelected}%`} sub="of last 90 days"/>
        <StatDivider/>
        <Stat label="Avg deflectable" value={avgDeflect ? `${avgDeflect}%` : "—"} sub="AI can fully handle"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
        {topics.map(t => {
          const on = selected.includes(t.id);
          return (
            <button key={t.id} onClick={() => onToggle(t.id)} style={{
              textAlign: "left",
              padding: "14px 14px 12px 14px",
              border: on ? "1.5px solid #0165E4" : "1px solid #E8EAF0",
              background: on ? "#F5F9FF" : "#fff",
              borderRadius: 10,
              cursor: "pointer",
              position: "relative",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
                  }}>{t.label}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
                    fontStyle: "italic", marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{t.sample}</div>
                </div>
                {on && (
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#0165E4", color: "#fff",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                )}
              </div>
              {/* Volume bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "#1F242D" }}>
                    {t.volume}% <span style={{ color: "#697182", fontWeight: 500 }}>of volume</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#697182" }}>
                    {t.handle} avg
                  </span>
                </div>
                <div style={{ height: 4, background: "#E8EAF0", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(100, t.volume * 3)}%`, height: "100%",
                    background: on ? "#0165E4" : "#B3BBCB",
                  }}/>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
                {t.suggested.map(s => (
                  <span key={s} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 7px",
                    background: on ? "#EBF1FF" : "#F2F3F7",
                    color: on ? "#0E3280" : "#5F6675",
                    border: on ? "1px solid #CBDCFF" : "1px solid transparent",
                    borderRadius: 999,
                    fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

const Stat = ({ label, value, sub }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
      color: "#697182", textTransform: "uppercase", letterSpacing: "0.04em",
      marginBottom: 2,
    }}>{label}</div>
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "#1F242D" }}>{value}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#9099AB" }}>{sub}</span>
    </div>
  </div>
);

const StatDivider = () => (
  <span style={{ width: 1, background: "#E8EAF0", alignSelf: "stretch" }}/>
);
