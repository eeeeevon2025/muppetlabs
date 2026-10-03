// ============================================================
// Slide-outs + onboarding modal
// ============================================================

// ---------------------------------------------------------------
// Generic slide-out chrome
// ---------------------------------------------------------------
const Slideout = ({ open, onClose, title, subtitle, footer, children, wide }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="slideout-backdrop" onClick={onClose}>
      <div className={`slideout ${wide ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="slideout-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="slideout-close" onClick={onClose} title="Close (Esc)">
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="slideout-body">{children}</div>
        {footer && <div className="slideout-foot">{footer}</div>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// Create Goal slide-out (with inline Company Profile capture on
// first run; collapsed strip on subsequent goals)
// ---------------------------------------------------------------
const CreateGoalSlideout = ({ open, onClose, onSave, companyProfileSet }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("AIC");
  const [target, setTarget] = useState({ value: "", direction: "decrease", unit: "%", window: "90 days" });
  const [topics, setTopics] = useState([]);
  const [tone, setTone] = useState("Friendly");
  const [showCompany, setShowCompany] = useState(!companyProfileSet);
  const [company, setCompany] = useState(window.MOCK.COMPANY_PROFILE_DEFAULTS);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setName(""); setDescription(""); setAudience("AIC");
      setTarget({ value: "", direction: "decrease", unit: "%", window: "90 days" });
      setTopics([]); setTone("Friendly");
    }
  }, [open]);

  const canSave = name.trim().length > 0 && target.value !== "" && topics.length > 0;

  return (
    <Slideout
      open={open}
      onClose={onClose}
      title="Create a new goal"
      subtitle="Set the outcome. Kustomer drafts the procedures, monitors, and AI to drive it."
      wide
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!canSave} onClick={() => onSave({ name, description, audience, target, topics, tone, company: showCompany ? company : null })}>
            <Icon name="check" size={14} /> Save goal
          </button>
        </>
      }
    >
      {/* Inline Company Profile (first run) — yellow card */}
      {showCompany ? (
        <div className="company-card">
          <div className="company-card-head">
            <div>
              <h4>First, tell us about your company</h4>
              <p>Captured once, read everywhere — by AI Setup, monitors, and goal suggestions.</p>
            </div>
            <div className="stored">Stored in Settings → Company profile</div>
          </div>
          <div className="field-row">
            <div className="field" style={{ marginBottom: 12 }}>
              <div className="field-label">Company name <span className="req">*</span></div>
              <input className="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <div className="field-label">Industry <span className="req">*</span></div>
              <select className="text" value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })}>
                <option>Retail & E-commerce</option>
                <option>SaaS</option>
                <option>Travel & Hospitality</option>
                <option>Financial Services</option>
                <option>Healthcare</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <div className="field-label">Domain</div>
            <input className="text" value={company.domain} onChange={(e) => setCompany({ ...company, domain: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <div className="field-label">Channels you support</div>
            <div className="tone-row">
              {["Email", "Chat", "SMS", "Instagram", "Voice", "WhatsApp", "Facebook"].map((c) => {
                const active = company.channels.includes(c);
                return (
                  <button
                    key={c}
                    className={`tone-pill ${active ? "active" : ""}`}
                    onClick={() => setCompany({ ...company, channels: active ? company.channels.filter((x) => x !== c) : [...company.channels, c] })}
                  >{c}</button>
                );
              })}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="field-label">Short description</div>
            <textarea className="text" value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
            <div className="field-hint">We'll use this to draft topic-aware procedures.</div>
          </div>
        </div>
      ) : (
        <div className="company-card collapsed">
          <Icon name="check" size={16} />
          <div className="summary">
            <b>{company.name}</b> · {company.industry} · {company.brands} brands
            <small style={{ display: "block", color: "var(--gray-90)", marginTop: 2 }}>
              Channels: {company.channels.join(", ")}
            </small>
          </div>
          <button className="btn sm ghost" onClick={() => setShowCompany(true)}>
            <Icon name="edit" size={12} /> Edit in Settings
          </button>
        </div>
      )}

      {/* Goal */}
      <div className="field">
        <div className="field-label">Goal name <span className="req">*</span></div>
        <input className="text" placeholder="e.g. Reduce refund tickets by 20%" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="field">
        <div className="field-label">Short description</div>
        <textarea className="text" placeholder="What does success look like? Who does this help?" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="field">
        <div className="field-label">Audience</div>
        <div className="audience-grid">
          <button className={`audience-opt aic ${audience === "AIC" ? "active" : ""}`} onClick={() => setAudience("AIC")}>
            <div className="ico-wrap"><Icon name="sparkles" size={18} /></div>
            <div>
              <div className="ao-title">AI for Customers</div>
              <div className="ao-desc">Autonomous AI handles inbound customer conversations end-to-end.</div>
            </div>
          </button>
          <button className={`audience-opt air ${audience === "AIR" ? "active" : ""}`} onClick={() => setAudience("AIR")}>
            <div className="ico-wrap"><Icon name="headset" size={18} /></div>
            <div>
              <div className="ao-title">AI for Reps</div>
              <div className="ao-desc">Copilot helps your reps reply faster with drafts, summaries, and signals.</div>
            </div>
          </button>
        </div>
      </div>

      <div className="field">
        <div className="field-label">Target <span className="req">*</span></div>
        <div className="field-row" style={{ gridTemplateColumns: "1fr 1fr 1.4fr" }}>
          <select className="text" value={target.direction} onChange={(e) => setTarget({ ...target, direction: e.target.value })}>
            <option value="decrease">Decrease</option>
            <option value="increase">Increase</option>
          </select>
          <input className="text" placeholder="20" value={target.value} onChange={(e) => setTarget({ ...target, value: e.target.value })} />
          <select className="text" value={target.unit} onChange={(e) => setTarget({ ...target, unit: e.target.value })}>
            <option value="%">percent (%)</option>
            <option value="score">CSAT score (1-5)</option>
            <option value="seconds">seconds</option>
            <option value="$">dollars ($)</option>
            <option value="count">absolute count</option>
          </select>
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="field-label">Time window</div>
          <div className="tone-row">
            {["30 days", "60 days", "90 days", "Quarterly", "Annual"].map((w) => (
              <button key={w} className={`tone-pill ${target.window === w ? "active" : ""}`} onClick={() => setTarget({ ...target, window: w })}>{w}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="field">
        <div className="field-label">Topics this goal covers <span className="req">*</span></div>
        <div className="field-hint" style={{ marginBottom: 8 }}>Auto-detected from the last 90 days of conversations. Pick the topics this goal applies to.</div>
        <TopicMulti selected={topics} onChange={setTopics} />
      </div>

      <div className="field">
        <div className="field-label">Scenarios you want to automate</div>
        <div style={{ padding: "18px 20px", border: "1px dashed var(--gray-40)", borderRadius: 10, textAlign: "center", background: "var(--gray-15)" }}>
          <Icon name="upload" size={18} />
          <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--gray-95)" }}>
            Drop SOPs, call recordings, decision trees here — <a style={{ color: "var(--blue-90)", cursor: "pointer", fontWeight: 500 }}>browse files</a>
          </div>
          <div style={{ fontSize: 11, color: "var(--gray-80)", marginTop: 4 }}>The parser turns each into a draft procedure you can review.</div>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 0 }}>
        <div className="field-label">How should your AI sound?</div>
        <TonePicker value={tone} onChange={setTone} />
      </div>
    </Slideout>
  );
};

// ---------------------------------------------------------------
// First-run primer (onboarding) modal
// ---------------------------------------------------------------
const OnboardingModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="onboarding-backdrop" onClick={onClose}>
      <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to a goals-first Kustomer</h2>
        <p className="lede">
          Four short notes about the new primitives. ~30 seconds, then you're off. You can re-open this anytime from your avatar menu.
        </p>
        <div className="onboarding-cards">
          <div className="onboarding-card">
            <span className="n">0.1</span>
            <h4>Goals are the spine</h4>
            <p>Every AI automation, monitor, and workflow connects to a goal. Goals organize the platform around outcomes.</p>
            <div className="where">Lives in <b>Goals</b> (site rail)</div>
          </div>
          <div className="onboarding-card">
            <span className="n">0.2</span>
            <h4>Topics, auto-detected</h4>
            <p>The shared taxonomy of what customers ask about. Auto-detected from the last 90 days. Editable.</p>
            <div className="where">View: <b>Reporting → Topics</b><br />Manage: <b>Settings → Topics</b></div>
          </div>
          <div className="onboarding-card">
            <span className="n">0.3</span>
            <h4>Suggestions apply in place</h4>
            <p>When AI proposes a fix, it surfaces where the affected block lives. Apply, edit, or dismiss inline.</p>
            <div className="where">On every block + <b>Performance → Suggestions</b></div>
          </div>
          <div className="onboarding-card highlight">
            <span className="n">0.4</span>
            <h4>Company profile, captured inline</h4>
            <p>During your first goal, we'll ask about industry, channels, brands. Stored once, read everywhere.</p>
            <div className="where">Captured at <b>Goals → Create goal</b><br />Canonical home: <b>Settings → Company profile</b></div>
          </div>
        </div>
        <div className="onboarding-actions">
          <button className="btn ghost" onClick={onClose}>Skip</button>
          <button className="btn primary" onClick={onClose}>
            Got it, take me to Goals <Icon name="chevRight" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------
// Apply Suggestion slide-out — inline procedure / KB / tool / guardrail edit
// ---------------------------------------------------------------
const ApplySuggestionSlideout = ({ open, suggestion, onClose, onApply }) => {
  if (!suggestion) return null;
  const t = suggestion.target || { type: "procedure", label: "Procedure" };
  const typeLabel = { procedure: "Procedure", kb: "Knowledge Article", tool: "Tool", guardrail: "Guardrail", monitor: "Monitor", tone: "Tone Guidance" }[t.type] || "Block";
  const proc = window.MOCK.PROCEDURES.find((p) => p.id === t.id);

  return (
    <Slideout
      open={open}
      onClose={onClose}
      title={`Edit ${typeLabel}: ${t.label}`}
      subtitle="AI-proposed changes are highlighted. Tweak inline or apply as-is."
      wide
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onApply(suggestion)}>
            <Icon name="check" size={14} /> Save and apply
          </button>
        </>
      }
    >
      {/* Suggestion summary banner */}
      <div className="suggestion-evidence" style={{ marginBottom: 18 }}>
        <div className="saw">From suggestion</div>
        <div><b style={{ color: "var(--gray-120)" }}>{suggestion.title}</b> · Confidence{" "}
          <span className={`suggestion-confidence ${suggestion.confidenceLabel.toLowerCase()}`} style={{ fontSize: 10.5, padding: "1px 6px" }}>
            {suggestion.confidenceLabel} · {Math.round(suggestion.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Procedure body — for procedure type */}
      {t.type === "procedure" && proc && (
        <>
          <div className="field">
            <div className="field-label">Procedure name</div>
            <input className="text" defaultValue={proc.name} />
          </div>

          <div className="field">
            <div className="field-label">When to use this</div>
            <textarea className="text" defaultValue={proc.whenToUse} />
          </div>

          <div className="field">
            <div className="field-label">Steps</div>
            <div className="procedure-edit-block">
              {proc.steps.map((step, i) => (
                <div className="proc-step" key={i}>
                  <span style={{ color: "var(--gray-80)", marginRight: 6 }}>{i + 1}.</span>
                  {step}
                </div>
              ))}
              {/* AI-added step at position 2 */}
              <div className="proc-step ai-added">
                <span style={{ color: "var(--green-80)", marginRight: 6 }}>↻</span>
                Before applying the coupon, recommend related products from the customer's order history.
              </div>
              <div className="proc-step changed">
                <span style={{ color: "var(--yellow-110)", marginRight: 6 }}>↻</span>
                If customer declines the recommendation, apply coupon code as originally requested.
              </div>
            </div>
          </div>

          <div className="field">
            <div className="field-label">Associations</div>
            <div className="field-hint" style={{ marginBottom: 6 }}>This procedure applies to:</div>
            <div className="tone-row">
              <button className={`tone-pill ${proc.associations.allAIC ? "active" : ""}`}>All AI for Customers</button>
              <button className={`tone-pill ${proc.associations.allAIR ? "active" : ""}`}>All AI for Reps</button>
              {proc.associations.automations.map((a) => (
                <button key={a} className="tone-pill active">{window.MOCK.AUTOMATIONS.find((au) => au.id === a)?.name || a}</button>
              ))}
              <button className="tone-pill"><Icon name="plus" size={11} /> Add</button>
            </div>
            <div className="field-hint" style={{ marginTop: 8 }}>
              <Icon name="warning" size={12} /> Editing this procedure affects{" "}
              <b>{proc.associations.allAIC ? `all ${window.MOCK.AUTOMATIONS.filter((a) => a.audience === "AIC").length} AIC automations` : `${proc.associations.automations.length} automation${proc.associations.automations.length === 1 ? "" : "s"}`}</b>.
            </div>
          </div>
        </>
      )}

      {/* Diff preview for non-procedure types — falls back to before/after */}
      {t.type !== "procedure" && suggestion.before && suggestion.after && (
        <div>
          <div className="field-label" style={{ marginBottom: 10 }}>Proposed change</div>
          <div className="diff-grid">
            <div className="diff-card before"><div className="h">Before</div>{suggestion.before}</div>
            <div className="diff-card after"><div className="h">After</div>{suggestion.after}</div>
          </div>
        </div>
      )}

      <div style={{ background: "var(--gray-15)", padding: "10px 14px", borderRadius: 8, fontSize: 11.5, color: "var(--gray-95)", marginTop: 18 }}>
        <Icon name="info" size={12} style={{ verticalAlign: "middle" }} /> No conversations are affected until you click <b style={{ color: "var(--gray-120)" }}>Save and apply</b>.
      </div>
    </Slideout>
  );
};

Object.assign(window, { Slideout, CreateGoalSlideout, OnboardingModal, ApplySuggestionSlideout });
