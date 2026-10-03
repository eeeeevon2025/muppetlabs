// ============================================================
// First-run wizard, Business info → Scenarios → AI suggestions
// → Confirm. Submits between steps simulate the AI think-pass.
// ============================================================

// ---------- Scenario catalog ----------
// Each scenario maps user intent → a draft goal the AI will propose.
const FR_SCENARIOS = [
  {
    id: "refunds",
    icon: "rotate",
    label: "Refunds & returns",
    desc: "Customers asking for money back or to return items.",
    audience: ["AIC"],
    volumePct: 18,
    why: "Returns & refunds drive 18% of your last-90-day ticket volume, the second-largest category.",
    goal: {
      name: "Reduce refund tickets by 20%",
      description: "Cut refund-related ticket volume by deflecting routine cases and pushing eligibility checks earlier.",
      audience: "AIC",
      target: { value: 20, direction: "decrease", unit: "%", window: "90 days" },
      topics: ["returns", "refund-order"],
    },
  },
  {
    id: "tracking",
    icon: "send",
    label: "Order tracking & shipping",
    desc: "\"Where is my order?\" / shipping delay questions.",
    audience: ["AIC"],
    volumePct: 32,
    why: "Order tracking is your single highest-volume scenario, 24% of tickets in the last 90 days. Highly automatable (92% deflectable).",
    goal: {
      name: "Auto-resolve order tracking",
      description: "Fully deflect routine \"where is my order?\" questions with shipment lookups.",
      audience: "AIC",
      target: { value: 50, direction: "decrease", unit: "%", window: "60 days" },
      topics: ["tracking", "shipping"],
    },
  },
  {
    id: "faq",
    icon: "book",
    label: "Product FAQs",
    desc: "Sizing, materials, compatibility, policies.",
    audience: ["AIC", "AIR"],
    volumePct: 12,
    why: "Product questions are highly KB-answerable (85% deflectable) and well-suited to deflection.",
    goal: {
      name: "Deflect product FAQs by 60%",
      description: "Use the knowledge base to answer common product questions before reaching a human.",
      audience: "AIC",
      target: { value: 60, direction: "decrease", unit: "%", window: "90 days" },
      topics: ["product"],
    },
  },
  {
    id: "account",
    icon: "user",
    label: "Account & login issues",
    desc: "Password resets, email changes, identity checks.",
    audience: ["AIC"],
    volumePct: 9,
    why: "Identity verification and password recovery follow predictable flows.",
    goal: {
      name: "Cut account-related escalations 35%",
      description: "Handle identity verification, password recovery, and account updates without rep handoff.",
      audience: "AIC",
      target: { value: 35, direction: "decrease", unit: "%", window: "90 days" },
      topics: ["account"],
    },
  },
  {
    id: "billing",
    icon: "tag",
    label: "Billing questions",
    desc: "Charges, invoices, subscription changes.",
    audience: ["AIC"],
    volumePct: 5,
    why: "Billing inquiries are predictable but sensitive, guardrails matter.",
    goal: {
      name: "Resolve billing tickets without escalation",
      description: "Handle invoice questions and standard subscription edits inline.",
      audience: "AIC",
      target: { value: 25, direction: "decrease", unit: "%", window: "90 days" },
      topics: ["billing"],
    },
  },
  {
    id: "saves",
    icon: "shield",
    label: "Save at-risk cancellations",
    desc: "Customers about to cancel a subscription.",
    audience: ["AIC", "AIR"],
    volumePct: 6,
    why: "Cancel intent is detectable early; offers + workflow lifts saves materially.",
    goal: {
      name: "Save at-risk renewals 80%",
      description: "Identify cancel risk early and convert to saves with offers or a retention rep handoff.",
      audience: "AIC+AIR",
      target: { value: 80, direction: "increase", unit: "%", window: "120 days" },
      topics: ["cancel-sub", "billing"],
    },
  },
  {
    id: "csat",
    icon: "sparkles",
    label: "Higher rep CSAT",
    desc: "Copilot draft replies, summaries, signals.",
    audience: ["AIR"],
    volumePct: null,
    why: "Copilot adoption correlates with +0.4 CSAT in similar deployments.",
    goal: {
      name: "Improve CSAT to 4.6",
      description: "Lift average customer satisfaction on rep-assisted conversations using draft replies and signals.",
      audience: "AIR",
      target: { value: 4.6, direction: "increase", unit: "score", window: "90 days" },
      topics: ["product", "account"],
    },
  },
  {
    id: "frt",
    icon: "clock",
    label: "Faster first-reply time",
    desc: "Cut the time customers wait for a first reply.",
    audience: ["AIR"],
    volumePct: null,
    why: "Suggestion-acceptance lift translates directly to FRT.",
    goal: {
      name: "Cut first-reply time to 90s",
      description: "Reduce average first-reply time across the human-rep team using Copilot drafts.",
      audience: "AIR",
      target: { value: 90, direction: "decrease", unit: "seconds", window: "60 days" },
      topics: ["product", "tracking"],
    },
  },
];

const FR_INDUSTRIES = [
  "Retail & E-commerce",
  "SaaS",
  "Travel & Hospitality",
  "Financial Services",
  "Telecommunications",
  "Healthcare",
  "Logistics & Shipping",
  "Other",
];

const FR_CHANNELS = ["Email", "Chat", "SMS", "Voice", "Instagram", "WhatsApp", "Facebook"];

// ---------- The wizard ----------
const FirstRunWizard = ({ navigate, onSaveBatch, onOpenCustomSlideout, initialStep = 1 }) => {
  const [step, setStep] = useState(initialStep);
  const [generating, setGenerating] = useState(false);
  const [createdGoals, setCreatedGoals] = useState([]);

  // Step-1, company profile + scenarios upload
  const [company, setCompany] = useState(window.MOCK.COMPANY_PROFILE_DEFAULTS);
  const [uploads, setUploads] = useState([]);

  // Step-2, drafted goals + which are selected
  const [drafts, setDrafts] = useState([]);
  const [pickedDraftIds, setPickedDraftIds] = useState(new Set());

  // ----- step 1 validity -----
  const step1Valid =
    (company.name || "").trim().length > 0 &&
    (company.industry || "").trim().length > 0;

  // ----- Generate goal drafts -----
  // Drafts are derived from a representative cross-section of scenarios
  // (refunds, tracking, FAQ, retention), in production we'd cluster the
  // uploaded CSV + the org's conversation history; here we mock the 4
  // most common starter goals.
  const generateDrafts = () => {
    setGenerating(true);
    setTimeout(() => {
      const starterIds = ["refunds", "tracking", "faq", "renewals"];
      const generated = starterIds
        .map((id) => FR_SCENARIOS.find((s) => s.id === id))
        .filter(Boolean)
        .map((s) => ({
          id: `draft-${s.id}`,
          scenarioId: s.id,
          name: s.goal.name,
          description: s.goal.description,
          audience: s.goal.audience,
          target: s.goal.target,
          topics: s.goal.topics,
          why: s.why,
        }));
      setDrafts(generated);
      // Per goals-first design: do not preselect. Users opt in to each goal
      // by clicking the card, button count updates as they go.
      setPickedDraftIds(new Set());
      setGenerating(false);
      setStep(2);
    }, 1800);
  };

  // ----- Save batch and go to completion -----
  const commit = () => {
    const chosen = drafts.filter((d) => pickedDraftIds.has(d.id));
    const ids = onSaveBatch({ company, goals: chosen, uploads });
    setCreatedGoals(chosen.map((d, i) => ({ ...d, id: ids[i] })));
    setStep(3);
  };

  // ----- Header progress -----
  const steps = [
    { n: 1, label: "Your business" },
    { n: 2, label: "Drafted goals" },
    { n: 3, label: "Done" },
  ];

  return (
    <div className="fr-wrap">
      <div className="fr-topbar">
        <div className="fr-crumbs">
          <a onClick={() => navigate("goals")}>Goals</a>
          <span className="fr-crumbs-sep">›</span>
          <span className="fr-crumbs-current">Create goal</span>
        </div>
        <div className="fr-stepper">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <button
                className={`fr-stepper-step ${step === s.n ? "current" : ""} ${step > s.n ? "done" : ""}`}
                onClick={() => { if (step > s.n) setStep(s.n); }}
                disabled={step <= s.n}
                title={step > s.n ? "Jump back to this step" : ""}
              >
                <span className="n">{step > s.n ? <Icon name="check" size={11} /> : s.n}</span>
                <span className="label">{s.label}</span>
              </button>
              {i < steps.length - 1 && <span className="fr-stepper-line"></span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="fr-canvas">
        {step === 1 && !generating && (
          <FrStep1Combined
            company={company}
            setCompany={setCompany}
            uploads={uploads}
            setUploads={setUploads}
            valid={step1Valid}
            onContinue={generateDrafts}
            onSkip={() => navigate("goals")}
          />
        )}
        {step === 1 && generating && (
          <FrGenerating company={company} uploads={uploads} />
        )}
        {step === 2 && (
          <FrStep3
            drafts={drafts}
            picked={pickedDraftIds}
            setPicked={setPickedDraftIds}
            onBack={() => setStep(1)}
            onCommit={commit}
            onAddCustom={onOpenCustomSlideout}
            company={company}
            uploads={uploads}
            navigate={navigate}
          />
        )}
        {step === 3 && (
          <FrStep4
            company={company}
            createdGoals={createdGoals}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================
// Step 1, Combined: company profile + scenarios upload
// ============================================================
const FrStep1Combined = ({ company, setCompany, uploads, setUploads, valid, onContinue, onSkip }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [topicsOfInterest, setTopicsOfInterest] = useState([]);

  const addFiles = (fileList) => {
    const next = [];
    for (const f of fileList) {
      const type = detectUploadType(f);
      next.push({
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        type,
        status: "parsing",
      });
    }
    setUploads((prev) => [...prev, ...next]);
    next.forEach((nf, i) => {
      setTimeout(() => {
        setUploads((prev) => prev.map((u) => u.id === nf.id ? { ...u, status: "parsed" } : u));
      }, 700 + i * 250);
    });
  };
  const onBrowseChange = (e) => {
    if (e.target.files?.length) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) addFiles(Array.from(e.dataTransfer.files));
  };
  const addDemoFile = () => {
    const used = new Set(uploads.map((u) => u.name));
    const candidate = FR_DEMO_FILES.find((f) => !used.has(f.name)) || FR_DEMO_FILES[uploads.length % FR_DEMO_FILES.length];
    addFiles([{ name: candidate.name, size: candidate.size }]);
  };
  const removeUpload = (id) => setUploads((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="fr-step">
      <FrHeader
        eyebrow="Step 1 of 3"
        title="Tell us about your business"
        sub={<>We use this in two ways: to ground every AI response in your business, and to suggest the right goals for you on the next step. Edit anytime in <b>Settings → Company profile</b>.</>}
      />

      {/* Company profile */}
      <div className="fr-section">
        <div className="fr-section-head">
          <h3><Icon name="building" size={13} /> Company profile</h3>
          <div className="fr-section-meta">Required</div>
        </div>
        <div className="fr-card">
          <div className="fr-grid-2">
            <div className="field">
              <div className="field-label">Company name <span className="req">*</span></div>
              <input className="text" value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </div>
            <div className="field">
              <div className="field-label">Industry <span className="req">*</span></div>
              <select className="text" value={company.industry}
                onChange={(e) => setCompany({ ...company, industry: e.target.value })}>
                {FR_INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="fr-grid-2">
            <div className="field">
              <div className="field-label">Domain</div>
              <input className="text" value={company.domain}
                onChange={(e) => setCompany({ ...company, domain: e.target.value })}
                placeholder="acmeoutdoors.com" />
            </div>
            <div className="field">
              <div className="field-label">Number of brands</div>
              <input className="text" type="number" min="1" value={company.brands}
                onChange={(e) => setCompany({ ...company, brands: Number(e.target.value) || 1 })} />
            </div>
          </div>
          <div className="field">
            <div className="field-label">Channels you support</div>
            <div className="tone-row">
              {FR_CHANNELS.map((c) => {
                const active = company.channels.includes(c);
                return (
                  <button key={c}
                    className={`tone-pill ${active ? "active" : ""}`}
                    onClick={() => setCompany({
                      ...company,
                      channels: active
                        ? company.channels.filter((x) => x !== c)
                        : [...company.channels, c]
                    })}
                  >{c}</button>
                );
              })}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="field-label">Short description</div>
            <textarea className="text" rows="3" value={company.description}
              onChange={(e) => setCompany({ ...company, description: e.target.value })}></textarea>
            <div className="field-hint">A sentence about what your business does, our goal suggestions read this.</div>
          </div>
        </div>
      </div>

      {/* Topic analysis, auto-detected from last 90 days of conversations. */}
      <div className="fr-section">
        <div className="fr-section-head">
          <h3><Icon name="activity" size={13} /> What customers contact you about</h3>
          <div className="fr-section-meta">Last 90 days</div>
        </div>
        <div className="fr-card" style={{ padding: 14 }}>
          <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--ink-70)", lineHeight: 1.5 }}>
            A topic is a group of similar customer conversations, like "Order tracking" or "Returns &amp; refunds." Kustomer AI builds these automatically from your conversation history.
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--ink-70)", lineHeight: 1.5 }}>
            We've grouped your last 90 days of conversations into the topics below. Select the topics you care about most, and we'll suggest matching goals in the next step.
          </p>
          <TopicAnalysis selected={topicsOfInterest} onChange={setTopicsOfInterest} />
        </div>
      </div>

      <FrFooter
        left={<button className="btn ghost" onClick={onSkip}>Skip setup</button>}
        right={
          <button className="btn primary" disabled={!valid} onClick={onContinue}>
            <Icon name="sparkles" size={13} /> Generate suggested goals
          </button>
        }
        hint={!valid && "Add a company name and industry to continue."}
      />
    </div>
  );
};

// ============================================================
// Step 1, Tell us about your business (legacy, kept for reference, not routed)
// ============================================================
const FrStep1 = ({ company, setCompany, valid, onContinue, onSkip }) => {
  return (
    <div className="fr-step">
      <FrHeader
        eyebrow="Step 1 of 4"
        title="Tell us about your business"
        sub={<>This is captured once and read everywhere, by AI Setup, suggestion drafts, and your goal recommendations. Edit anytime in <b>Settings → Company profile</b>.</>}
      />

      <div className="fr-card">
        <div className="fr-grid-2">
          <div className="field">
            <div className="field-label">Company name <span className="req">*</span></div>
            <input className="text" value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })} />
          </div>
          <div className="field">
            <div className="field-label">Industry <span className="req">*</span></div>
            <select className="text" value={company.industry}
              onChange={(e) => setCompany({ ...company, industry: e.target.value })}>
              {FR_INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div className="fr-grid-2">
          <div className="field">
            <div className="field-label">Domain</div>
            <input className="text" value={company.domain}
              onChange={(e) => setCompany({ ...company, domain: e.target.value })}
              placeholder="acmeoutdoors.com" />
          </div>
          <div className="field">
            <div className="field-label">Number of brands</div>
            <input className="text" type="number" min="1" value={company.brands}
              onChange={(e) => setCompany({ ...company, brands: Number(e.target.value) || 1 })} />
          </div>
        </div>

        <div className="field">
          <div className="field-label">Support channels</div>
          <div className="field-hint" style={{ marginBottom: 8 }}>
            We'll wire AI for whichever channels you support today. You can add more later.
          </div>
          <div className="tone-row">
            {FR_CHANNELS.map((c) => {
              const active = company.channels.includes(c);
              return (
                <button key={c}
                  className={`tone-pill ${active ? "active" : ""}`}
                  onClick={() => setCompany({
                    ...company,
                    channels: active
                      ? company.channels.filter((x) => x !== c)
                      : [...company.channels, c]
                  })}>
                  {active && <Icon name="check" size={11} />} {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <div className="field-label">Short description</div>
          <div className="field-hint" style={{ marginBottom: 8 }}>
            One or two sentences about what you sell and who you serve. The AI uses this to draft topic-aware procedures.
          </div>
          <textarea className="text" rows="3" value={company.description}
            onChange={(e) => setCompany({ ...company, description: e.target.value })}></textarea>
        </div>
      </div>

      <FrFooter
        left={<button className="btn ghost" onClick={onSkip}>Skip setup</button>}
        right={
          <button className="btn primary" disabled={!valid} onClick={onContinue}>
            Continue <Icon name="chevRight" size={13} />
          </button>
        }
        hint={!valid && "Add a company name and industry to continue."}
      />
    </div>
  );
};

// ============================================================
// Step 2, Audience + scenarios you want to automate
// ============================================================
const FrStep2 = ({
  audience, setAudience,
  scenarios, scenarioIds, setScenarioIds,
  extraTopics, setExtraTopics,
  valid, onBack, onContinue,
  company, navigate,
}) => {
  const toggleScenario = (id) => {
    setScenarioIds(
      scenarioIds.includes(id)
        ? scenarioIds.filter((x) => x !== id)
        : [...scenarioIds, id]
    );
  };

  const selectedVolume = scenarios
    .filter((s) => scenarioIds.includes(s.id))
    .reduce((sum, s) => sum + (s.volumePct || 0), 0);

  return (
    <div className="fr-step">
      <FrHeader
        eyebrow="Step 1 of 3"
        title="What scenarios should Kustomer AI handle?"
        sub={<>Pick the customer conversations you want AI to take on. We'll use this, plus the last 90 days of conversations in <b>{company.name}</b>, to draft your first goals.</>}
      />

      {/* Audience picker */}
      <div className="fr-section">
        <div className="fr-section-head">
          <h3>Who are you setting up AI for?</h3>
        </div>
        <div className="fr-audience-grid">
          <button className={`fr-aud ${audience === "AIC" ? "active" : ""} aic`} onClick={() => setAudience("AIC")}>
            <div className="fr-aud-ico"><Icon name="sparkles" size={18} /></div>
            <div className="fr-aud-title">Customer AI</div>
            <div className="fr-aud-desc">Autonomous AI handles inbound customer conversations end-to-end.</div>
          </button>
          <button className={`fr-aud ${audience === "AIR" ? "active" : ""} air`} onClick={() => setAudience("AIR")}>
            <div className="fr-aud-ico"><Icon name="headset" size={18} /></div>
            <div className="fr-aud-title">Rep AI</div>
            <div className="fr-aud-desc">Copilot supports your team with drafts, summaries, signals.</div>
          </button>
          <button className={`fr-aud ${audience === "BOTH" ? "active" : ""} both`} onClick={() => setAudience("BOTH")}>
            <div className="fr-aud-ico"><Icon name="users" size={18} /></div>
            <div className="fr-aud-title">Both</div>
            <div className="fr-aud-desc">Start with customer-facing AI and a rep copilot together.</div>
          </button>
        </div>
      </div>

      {/* Scenarios */}
      <div className="fr-section">
        <div className="fr-section-head">
          <h3>Scenarios you want to automate</h3>
          <div className="fr-section-meta">
            <span className="muted">{scenarioIds.length} selected</span>
            {selectedVolume > 0 && (
              <>
                <span className="dot"></span>
                <span className="muted">~{selectedVolume}% of your 90-day volume</span>
              </>
            )}
          </div>
        </div>
        <div className="fr-scenario-grid">
          {scenarios.map((s) => {
            const active = scenarioIds.includes(s.id);
            return (
              <button key={s.id} className={`fr-scenario ${active ? "active" : ""}`} onClick={() => toggleScenario(s.id)}>
                <div className="fr-scenario-top">
                  <div className="fr-scenario-ico"><Icon name={s.icon} size={14} /></div>
                  <div className="fr-scenario-check">
                    {active ? <Icon name="check" size={12} /> : null}
                  </div>
                </div>
                <div className="fr-scenario-label">{s.label}</div>
                <div className="fr-scenario-desc">{s.desc}</div>
                <div className="fr-scenario-foot">
                  {s.audience.map((a) => <AudienceChip key={a} audience={a} />)}
                  {s.volumePct != null && (
                    <span className="fr-scenario-vol mono">{s.volumePct}% vol</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional: extra topics */}
      <div className="fr-section">
        <div className="fr-section-head">
          <h3>Topics from your last 90 days <span className="opt">, optional fine-tune</span></h3>
          <div className="fr-section-meta">
            <span className="muted">Auto-detected from conversation history.</span>
          </div>
        </div>
        <div className="topic-multi">
          {window.MOCK.TOPICS.map((t) => {
            const active = extraTopics.includes(t.id);
            return (
              <button
                key={t.id}
                className={`topic-opt ${active ? "active" : ""}`}
                onClick={() => setExtraTopics(active ? extraTopics.filter((x) => x !== t.id) : [...extraTopics, t.id])}
              >
                {active && <Icon name="check" size={11} />}
                {t.label}
                <span style={{ marginLeft: 6, color: "var(--ink-50)", fontSize: 10.5 }}>{t.volume}%</span>
              </button>
            );
          })}
        </div>
      </div>

      <FrFooter
        left={onBack ? <button className="btn ghost" onClick={onBack}><Icon name="chevLeft" size={13} /> Back</button> : <button className="btn ghost" onClick={() => navigate?.("goals")}>Skip setup</button>}
        right={
          <button className="btn primary" disabled={!valid} onClick={onContinue}>
            <Icon name="sparkles" size={13} /> Generate goal suggestions
          </button>
        }
        hint={!valid && "Pick at least one scenario to continue."}
      />
    </div>
  );
};

// ============================================================
// Step 3, Upload supporting materials
// ============================================================
const FR_UPLOAD_TYPES = [
  { id: "sop", label: "SOP / runbook", icon: "book", match: /sop|runbook|procedure|playbook|policy/i },
  { id: "recording", label: "Call recording", icon: "headset", match: /\.(mp3|wav|m4a|mp4|mov|webm)$/i },
  { id: "tree", label: "Decision tree", icon: "code", match: /tree|flow|decision|diagram/i },
  { id: "transcript", label: "Transcript", icon: "book", match: /transcript|chat|conversation/i },
  { id: "kb", label: "KB article", icon: "book", match: /kb|knowledge|faq|article/i },
  { id: "doc", label: "Document", icon: "book", match: /.*/ },
];

const detectUploadType = (file) => {
  const name = file.name || "";
  for (const t of FR_UPLOAD_TYPES) {
    if (t.match.test(name)) return t;
  }
  return FR_UPLOAD_TYPES[FR_UPLOAD_TYPES.length - 1];
};

const formatBytes = (b) => {
  if (b == null) return ",";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

const FR_DEMO_FILES = [
  { name: "Refund_SOP_v3.pdf", size: 184320 },
  { name: "WISMO_decision_tree.png", size: 92160 },
  { name: "Top-call-recording-Aug.mp3", size: 2_457_600 },
  { name: "Returns_policy_2026.docx", size: 73728 },
  { name: "Agent_macros_export.csv", size: 24576 },
];

// Scenarios CSV template, downloaded as a primer for the user to fill in
const SCENARIOS_CSV_TEMPLATE = [
  ["scenario_name", "trigger", "what_to_do", "what_to_say", "tools_or_macros", "edge_cases", "escalation_rule"],
  [
    "Refund, standard order",
    "Customer asks to return an item within 30 days and the order is unshipped or unopened.",
    "Verify order eligibility via Order Lookup; issue full refund; confirm refund timeline; log refund reason.",
    "Acknowledge, confirm eligibility, then: \"You're all set, your refund of {amount} is on its way, you'll see it in 3–5 business days.\"",
    "tool: refund.create; macro: Refund-Standard-Confirm",
    "Order older than 30 days → check loyalty tier exception. Multi-item order → ask which item(s).",
    "If the customer is upset OR refund > $500 OR loyalty tier = VIP, route to a human."
  ],
  [
    "Refund, damaged item",
    "Customer says item arrived damaged or defective.",
    "Apologize; ask for photos; create damage ticket; offer replace OR refund.",
    "\"I'm sorry the item came damaged, let me help. Could you share a photo so I can get this fixed?\"",
    "tool: damage.create_ticket; macro: Damage-Apology",
    "Customer can't take a photo → still file the claim with description. Multiple items damaged → file separately.",
    "Always route to human after first message if order value > $200."
  ],
  [
    "Order tracking, WISMO",
    "Customer asks where their order is.",
    "Look up order; share carrier tracking + ETA; flag if late.",
    "\"Your order #{order_id} is on the way, expected by {date}.\"",
    "tool: order.lookup; tool: shipping.track",
    "Order is late (>2 days past ETA) → offer goodwill credit. Tracking unavailable → file a missing-package claim.",
    "Customer says package is stolen → route to fraud team."
  ],
  [
    "Cancel subscription",
    "Customer requests to cancel a recurring subscription.",
    "Verify identity; offer save-offer (one pause OR discount); process cancellation if declined; confirm end-date.",
    "\"Got it. Before we cancel, would a 1-month pause help instead?\"",
    "tool: sub.cancel; tool: sub.pause; macro: Save-Offer-v2",
    "Customer mid-billing-cycle → pro-rate refund. Customer canceled before → don't re-offer save.",
    "Always escalate if customer mentions billing dispute or chargeback."
  ],
  [
    "Coupon / promo code",
    "Customer reports a promo code that won't apply.",
    "Check code validity; check cart eligibility; suggest alternative if expired.",
    "\"Looks like that code expired {date}. Here's an active 10% one you can use instead: WELCOME10.\"",
    "tool: promo.validate",
    "Code is valid but cart < minimum → tell them the threshold. Code is one-per-customer + already used → say so politely.",
    "Don't escalate; this is fully automatable."
  ],
];

const FR_CSV_FILENAME = "kustomer-scenarios-template.csv";
const FR_CSV_DOC_FILENAME = "kustomer-scenarios-instructions.md";
const FR_CSV_DOC = `# Scenarios CSV, how to fill it out

The scenarios CSV is the same document your team uses to train new agents. One row per scenario, one scenario per row. The columns match how Kustomer AI thinks about each interaction:

| Column | What goes here |
|---|---|
| **scenario_name** | Short name. "Refund, standard order," "Order tracking, WISMO." |
| **trigger** | Plain-language description of when this scenario fires. |
| **what_to_do** | The procedure. Tools to call, ticket fields to set, checks to make. |
| **what_to_say** | Verbatim language or a guide for tone + key phrases. |
| **tools_or_macros** | Any internal tools, macros, or workflows referenced. Free-form. |
| **edge_cases** | One-line edge cases the agent should handle differently. |
| **escalation_rule** | When to hand off to a human. |

## Tips

- One scenario per row. Don't combine "refund standard" and "refund damaged", they have different escalation rules.
- Edge cases can be a semicolon-separated list. Kustomer AI will turn each into a branch in the generated procedure.
- You can paste the entire SOP doc; the parser will split it into rows. But the CSV is the cleanest input.

## After you upload

Each row becomes a draft procedure attached to the scenario you picked in step 2. You'll review every draft on the next screen before anything goes live.
`;

const buildCsvString = (rows) =>
  rows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? "");
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");

const downloadBlob = (text, filename, mime = "text/csv") => {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

const FrStep3Upload = ({ uploads, setUploads, onBack, onGenerate, company, scenarioCount }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const addFiles = (fileList) => {
    const next = [];
    for (const f of fileList) {
      const type = detectUploadType(f);
      next.push({
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        type,
        status: "parsing",
      });
    }
    setUploads((prev) => [...prev, ...next]);
    // Simulate parsing finishing
    next.forEach((nf, i) => {
      setTimeout(() => {
        setUploads((prev) => prev.map((u) => u.id === nf.id ? { ...u, status: "parsed" } : u));
      }, 700 + i * 250);
    });
  };

  const onBrowseChange = (e) => {
    if (e.target.files && e.target.files.length) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addDemoFile = () => {
    // Pick a demo file we haven't added yet, otherwise just append one
    const used = new Set(uploads.map((u) => u.name));
    const candidate = FR_DEMO_FILES.find((f) => !used.has(f.name)) || FR_DEMO_FILES[uploads.length % FR_DEMO_FILES.length];
    addFiles([{ name: candidate.name, size: candidate.size }]);
  };

  const removeUpload = (id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const parsedCount = uploads.filter((u) => u.status === "parsed").length;
  const parsingCount = uploads.filter((u) => u.status === "parsing").length;

  return (
    <div className="fr-step">
      <FrHeader
        eyebrow="Step 3 of 4"
        title="Upload your scenarios document"
        sub={<>Most teams already have one, a CSV, Notion page, or SOP doc that lists every scenario reps handle and how. Drop it here and Kustomer AI will turn each row into a draft procedure for the <b>{scenarioCount}</b> scenario{scenarioCount === 1 ? "" : "s"} you picked. Don't have one? Download our template, fill it in, then come back.</>}
      />

      {/* Featured: Scenarios CSV card */}
      <div className="fr-scenarios-card">
        <div className="fr-scenarios-card-icon">
          <Icon name="book" size={26} />
        </div>
        <div className="fr-scenarios-card-body">
          <div className="fr-scenarios-card-eyebrow">Scenarios document · CSV</div>
          <h3>One row per scenario. One scenario per row.</h3>
          <p>
            Map your existing rep-training doc into the same shape Kustomer AI thinks in, <em>trigger</em>, <em>what to do</em>, <em>what to say</em>, <em>tools/macros</em>, <em>edge cases</em>, <em>escalation rule</em>. The CSV is the cleanest input; SOPs and decision trees also work below.
          </p>
          <div className="fr-scenarios-card-actions">
            <button
              className="btn primary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Icon name="upload" size={13} /> Upload scenarios CSV
            </button>
            <button
              className="btn ghost"
              onClick={(e) => {
                e.stopPropagation();
                downloadBlob(buildCsvString(SCENARIOS_CSV_TEMPLATE), FR_CSV_FILENAME, "text/csv");
              }}
            >
              <Icon name="download" size={13} /> Download CSV template
            </button>
            <button
              className="btn ghost small"
              onClick={(e) => {
                e.stopPropagation();
                downloadBlob(FR_CSV_DOC, FR_CSV_DOC_FILENAME, "text/markdown");
              }}
            >
              How to fill it out
            </button>
          </div>
          <div className="fr-scenarios-card-columns">
            {["scenario_name", "trigger", "what_to_do", "what_to_say", "tools_or_macros", "edge_cases", "escalation_rule"].map((c) => (
              <span key={c} className="fr-scenarios-col">{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="fr-section-label-row">
        <div className="fr-section-divider"></div>
        <span>Or attach supporting materials</span>
        <div className="fr-section-divider"></div>
      </div>

      <div className="fr-section">
        <div
          className={`fr-dropzone ${dragOver ? "drag" : ""} ${uploads.length ? "has-files" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={onBrowseChange}
          />
          <div className="fr-dropzone-ico"><Icon name="upload" size={22} /></div>
          <div className="fr-dropzone-title">
            {dragOver ? "Drop to upload" : "Drop SOPs, decision trees, recordings, or policy docs"}
          </div>
          <div className="fr-dropzone-sub">
            PDFs, DOCX, CSV, audio, video, images, links, the parser turns each into a draft procedure.
          </div>
          <div className="fr-dropzone-types">
            {FR_UPLOAD_TYPES.slice(0, 5).map((t) => (
              <span key={t.id} className="fr-dropzone-type">
                <Icon name={t.icon} size={11} /> {t.label}
              </span>
            ))}
          </div>
        </div>

        <div className="fr-upload-actions">
          <button className="btn ghost small" onClick={(e) => { e.stopPropagation(); addDemoFile(); }}>
            <Icon name="plus" size={12} /> Add a sample file (demo)
          </button>
          <span className="muted" style={{ fontSize: 11.5 }}>
            Or skip, we'll draft procedures from your conversation history alone.
          </span>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="fr-section">
          <div className="fr-section-head">
            <h3>Uploaded materials</h3>
            <div className="fr-section-meta">
              <span className="muted">{uploads.length} file{uploads.length === 1 ? "" : "s"}</span>
              {parsingCount > 0 && (<>
                <span className="dot"></span>
                <span className="muted">{parsingCount} parsing</span>
              </>)}
              {parsedCount > 0 && (<>
                <span className="dot"></span>
                <span className="muted">{parsedCount} ready</span>
              </>)}
            </div>
          </div>
          <ul className="fr-upload-list">
            {uploads.map((u) => (
              <li key={u.id} className={`fr-upload-row ${u.status}`}>
                <div className="fr-upload-ico"><Icon name={u.type.icon} size={14} /></div>
                <div className="fr-upload-main">
                  <div className="fr-upload-name">{u.name}</div>
                  <div className="fr-upload-meta">
                    <span className="fr-upload-type-chip">{u.type.label}</span>
                    <span className="dot"></span>
                    <span className="mono">{formatBytes(u.size)}</span>
                  </div>
                </div>
                <div className="fr-upload-status">
                  {u.status === "parsing" ? (
                    <span className="fr-upload-parsing"><span className="fr-spin"></span> Parsing…</span>
                  ) : (
                    <span className="fr-upload-parsed"><Icon name="check" size={11} /> Parsed</span>
                  )}
                </div>
                <button className="fr-upload-remove" onClick={() => removeUpload(u.id)} aria-label="Remove">
                  <Icon name="x" size={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FrFooter
        left={<button className="btn ghost" onClick={onBack}><Icon name="chevLeft" size={13} /> Back</button>}
        right={
          <button className="btn primary" onClick={onGenerate}>
            <Icon name="sparkles" size={13} /> Generate goal suggestions
          </button>
        }
        hint={uploads.length === 0 ? `Skipping uploads is fine, ${company.name}'s 90-day history alone gives us a great start.` : null}
      />
    </div>
  );
};

// ============================================================
// Generating state, between step 2 and step 3
// ============================================================
const FrGenerating = ({ company, scenarios = [], uploads = [] }) => {
  const lines = [
    `Reading the last 90 days of conversations from ${company.name}…`,
    scenarios.length > 0
      ? `Clustering ${scenarios.length} scenario${scenarios.length === 1 ? "" : "s"} from your selection…`
      : `Clustering high-volume scenarios from your conversation history…`,
    ...(uploads.length > 0 ? [`Parsing ${uploads.length} uploaded material${uploads.length === 1 ? "" : "s"} into draft procedures…`] : []),
    `Drafting outcome targets based on your industry…`,
    `Matching each goal to the right audience…`,
  ];
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / 1800) * 100);
      setProgress(pct);
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fr-step fr-step-generating">
      <FrHeader
        eyebrow="Generating"
        title="Drafting your goals…"
        sub="Reading your conversation history and matching it to common scenarios in your industry."
      />

      <div className="fr-generating-card">
        <div className="fr-gen-pulse"><Icon name="sparkles" size={20} /></div>
        <ul className="fr-gen-lines">
          {lines.map((line, i) => {
            const lineDone = progress > ((i + 1) / lines.length) * 100;
            const lineActive = progress > (i / lines.length) * 100;
            return (
              <li key={i} className={lineDone ? "done" : lineActive ? "active" : ""}>
                <span className="dot"></span>
                <span>{line}</span>
              </li>
            );
          })}
        </ul>
        <div className="fr-gen-bar"><div style={{ width: `${progress}%` }}></div></div>

        <div className="fr-gen-skeletons">
          {[0, 1, 2].map((i) => (
            <div className="fr-gen-skel" key={i}>
              <div className="sk sk-h"></div>
              <div className="sk sk-line"></div>
              <div className="sk sk-line short"></div>
              <div className="sk sk-pills">
                <div className="sk sk-pill"></div>
                <div className="sk sk-pill"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Step 3, AI-suggested goals
// ============================================================
const FrStep3 = ({ drafts, picked, setPicked, onBack, onCommit, onAddCustom, company, audience, uploads = [] }) => {
  const togglePicked = (id) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setPicked(next);
  };

  const pickedCount = picked.size;

  return (
    <div className="fr-step">
      <FrHeader
        eyebrow="Step 2 of 3"
        title="Here are your suggested goals"
        sub={<>Drafted from <b>{company.name}</b>'s last 90 days of conversations. Keep what fits, skip what doesn't. For each goal you keep, we'll set up the AI automation that drives it, and you can edit everything afterward.</>}
      />

      <div className="fr-section">
        <div className="fr-section-head">
          <h3>Suggested goals</h3>
          <div className="fr-section-meta">
            <span className="muted">{drafts.length} drafted</span>
            <span className="dot"></span>
            <span className="muted">{pickedCount} included</span>
          </div>
        </div>

        <div className="fr-draft-grid">
          {drafts.map((d) => {
            const isPicked = picked.has(d.id);
            const t = d.target;
            const targetStr = `${t.direction === "decrease" ? "−" : "+"}${t.value}${t.unit === "%" ? "%" : t.unit === "score" ? "pt" : t.unit === "seconds" ? "s" : ""}`;
            return (
              <div key={d.id} className={`fr-draft ${isPicked ? "picked" : ""}`}>
                <div className="fr-draft-head">
                  <label className="fr-check">
                    <input type="checkbox" checked={isPicked} onChange={() => togglePicked(d.id)} />
                    <span className="fr-check-box">{isPicked ? <Icon name="check" size={12} /> : null}</span>
                  </label>
                  <div className="fr-draft-title-wrap">
                    <div className="fr-draft-name">{d.name}</div>
                    <div className="fr-draft-meta">
                      <AudienceChip audience={d.audience} />
                      <span className="fr-draft-target mono">{targetStr}</span>
                      <span className="fr-draft-window">over {t.window}</span>
                    </div>
                  </div>
                </div>

                <p className="fr-draft-desc">{d.description}</p>

                <div className="fr-draft-topics">
                  <span className="fr-draft-topics-label" data-topic-help title="Auto-detected from your last 90 days of conversations. Manage in Settings → Topics.">
                    Topics
                    <span className="topic-help-icon" aria-hidden="true">?</span>
                  </span>
                  {d.topics.map((tid) => {
                    const topic = window.MOCK.TOPICS.find((x) => x.id === tid);
                    return <span key={tid} className="topic-chip">{topic ? topic.label : tid}</span>;
                  })}
                </div>

                <div className="fr-draft-why">
                  <Icon name="sparkles" size={11} />
                  <span>{d.why}</span>
                </div>
              </div>
            );
          })}

          {/* Add custom goal tile */}
          <button className="fr-draft fr-draft-add" onClick={onAddCustom}>
            <div className="fr-draft-add-ico"><Icon name="plus" size={18} /></div>
            <div className="fr-draft-add-title">Create a goal manually</div>
            <div className="fr-draft-add-desc">Open the full form to set name, target, topics, and tone yourself.</div>
          </button>
        </div>
      </div>

      <FrFooter
        left={<button className="btn ghost" onClick={onBack}><Icon name="chevLeft" size={13} /> Back</button>}
        right={
          <button className="btn primary" disabled={pickedCount === 0} onClick={onCommit}>
            <Icon name="check" size={13} /> {`Create ${pickedCount} ${pickedCount === 1 ? "goal" : "goals"}`}
          </button>
        }
        hint={pickedCount === 0 && "Include at least one goal or add a custom one to continue."}
      />
    </div>
  );
};

// ============================================================
// Step 4, Completion
// ============================================================
const FrStep4 = ({ company, createdGoals, navigate }) => {
  return (
    <div className="fr-step fr-step-done">
      <div className="fr-done-mark"><Icon name="check" size={28} /></div>
      <FrHeader
        eyebrow="You're set up"
        title={`${createdGoals.length} goal${createdGoals.length === 1 ? "" : "s"} created in ${company.name}`}
        sub="From here, Kustomer AI scaffolds the procedures, monitors, and automations to drive each goal. You'll review each one before anything goes live."
      />

      <div className="fr-done-list">
        {createdGoals.map((g) => (
          <button key={g.id} className="fr-done-row" onClick={() => navigate(`goal:${g.id}`)}>
            <div className="fr-done-row-main">
              <div className="fr-done-row-name">{g.name}</div>
              <div className="fr-done-row-meta">
                <AudienceChip audience={g.audience} />
                <span className="fr-done-row-draft">Draft</span>
                <span className="mono">{g.target.direction === "decrease" ? "−" : "+"}{g.target.value}{g.target.unit === "%" ? "%" : g.target.unit === "score" ? "pt" : g.target.unit === "seconds" ? "s" : ""}</span>
                <span className="dot"></span>
                <span>over {g.target.window}</span>
              </div>
            </div>
            <div className="fr-done-row-go">
              Open <Icon name="chevRight" size={12} />
            </div>
          </button>
        ))}
      </div>

      <div className="fr-done-next">
        <h4>What happens next</h4>
        <ol>
          <li>
            <b>Open a goal.</b>
            <p>Start with one goal to set up the procedures and automations it needs.</p>
          </li>
          <li>
            <b>Create or attach procedures and automations.</b>
            <p>Use AI suggestions as a starting point, then review, edit, and attach the ones you want to that goal.</p>
          </li>
          <li>
            <b>Review suggestions in context.</b>
            <p>Suggested changes will appear where they belong, in the procedure, knowledge base, tool, or guardrail.</p>
          </li>
          <li>
            <b>Edit goals anytime.</b>
            <p>Re-target, re-scope, pause, or retire a goal as priorities change.</p>
          </li>
        </ol>
      </div>

      <FrFooter
        left={<button className="btn ghost" onClick={() => navigate("goals")}>Replay onboarding</button>}
        right={
          <button className="btn primary" onClick={() => navigate("goals")}>
            Go to my Goals dashboard <Icon name="chevRight" size={13} />
          </button>
        }
      />
    </div>
  );
};

// ============================================================
// Shared: header + footer
// ============================================================
const FrHeader = ({ eyebrow, title, sub }) => (
  <div className="fr-header">
    {eyebrow && <div className="fr-eyebrow">{eyebrow}</div>}
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </div>
);

const FrFooter = ({ left, right, hint }) => (
  <div className="fr-footer">
    <div className="fr-footer-left">{left}</div>
    <div className="fr-footer-right">
      {hint && <span className="fr-footer-hint">{hint}</span>}
      {right}
    </div>
  </div>
);

Object.assign(window, {
  FirstRunWizard,
  FR_SCENARIOS,
  FrStep3Upload,
  buildCsvString,
  SCENARIOS_CSV_TEMPLATE,
  FR_CSV_FILENAME,
  FR_CSV_DOC,
  FR_CSV_DOC_FILENAME,
  downloadBlob,
});
