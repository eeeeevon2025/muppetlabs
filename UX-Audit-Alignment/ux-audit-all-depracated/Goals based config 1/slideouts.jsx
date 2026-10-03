// ============================================================
// Slide-outs + onboarding modal
// ============================================================

// ---------------------------------------------------------------
// Generic slide-out chrome
// ---------------------------------------------------------------
const Slideout = ({ open, onClose, title, subtitle, footer, children, wide, bodyRef }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {if (e.key === "Escape") onClose();};
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
        <div className="slideout-body" ref={bodyRef}>{children}</div>
        {footer && <div className="slideout-foot">{footer}</div>}
      </div>
    </div>);

};

// ---------------------------------------------------------------
// Create Goal slide-out (with inline Company Profile capture on
// first run; collapsed strip on subsequent goals)
// ---------------------------------------------------------------

// Curated "Start from" templates, reuses the FR_SCENARIOS catalog from
// the first-run wizard so the two surfaces stay in sync.
const GOAL_TEMPLATES = [
{ id: "tpl-refunds", icon: "rotate", label: "Reduce refund tickets", blurb: "Deflect routine refund and return cases." },
{ id: "tpl-tracking", icon: "send", label: "Auto-resolve order tracking", blurb: "Handle \"where is my order?\" with shipment lookups." },
{ id: "tpl-faq", icon: "book", label: "Deflect product FAQs", blurb: "KB-answer sizing, materials, compatibility questions." },
{ id: "tpl-account", icon: "user", label: "Cut account escalations", blurb: "Identity, password recovery, account updates." },
{ id: "tpl-saves", icon: "shield", label: "Save at-risk renewals", blurb: "Detect cancel risk early; offer or hand off." },
{ id: "tpl-csat", icon: "sparkles", label: "Improve rep CSAT", blurb: "Copilot drafts, summaries, and signals for human reps." }];


const goalTemplateById = (id) => {
  // Source of truth for the actual goal shape: FR_SCENARIOS in screens-firstrun.jsx
  if (!window.FR_SCENARIOS) return null;
  const map = {
    "tpl-refunds": "refunds",
    "tpl-tracking": "tracking",
    "tpl-faq": "faq",
    "tpl-account": "account",
    "tpl-saves": "saves",
    "tpl-csat": "csat"
  };
  const scenarioId = map[id];
  const scenario = window.FR_SCENARIOS.find((s) => s.id === scenarioId);
  return scenario ? { ...scenario.goal, sourceLabel: scenario.label } : null;
};

// ---------------------------------------------------------------
// TopicAnalysis, visual breakdown of conversation topics over the last
// 90 days, surfaced inline in the goal create flow so users can pick
// topics with volume / handle-time context in front of them.
// ---------------------------------------------------------------
const TopicAnalysis = ({ selected, onChange }) => {
  const topics = window.MOCK.TOPICS || [];
  // Ranked by volume desc
  const ranked = [...topics].sort((a, b) => (b.volume || 0) - (a.volume || 0));
  const totalCovered = ranked.reduce((s, t) => s + (t.volume || 0), 0);
  const maxVol = ranked[0]?.volume || 1;
  const totalConvos = 12481; // demo figure
  const selectedCount = ranked.filter((t) => selected.includes(t.id)).length;
  const selectedVol = ranked.filter((t) => selected.includes(t.id)).reduce((s, t) => s + (t.volume || 0), 0);
  const allSelected = ranked.length > 0 && selectedCount === ranked.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));else
    onChange([...selected, id]);
  };
  const toggleAll = () => {
    if (allSelected) onChange([]);else
    onChange(ranked.map((t) => t.id));
  };

  return (
    <div className="topic-analysis">
      <div className="topic-analysis-head">
        <div className="topic-analysis-stats">
          <span><b>{totalConvos.toLocaleString()}</b> conversations</span>
          <span className="dot"></span>
          <span><b>{ranked.length}</b> topics</span>
          <span className="dot"></span>
          <span><b>{totalCovered}%</b> classified</span>
        </div>
      </div>
      <table className="topic-analysis-table">
        <thead>
          <tr>
            <th className="topic-analysis-col-check" scope="col">
              <button
                type="button"
                className={`topic-analysis-check ${allSelected ? "all" : ""} ${someSelected ? "some" : ""}`}
                onClick={toggleAll}
                aria-label={allSelected ? "Deselect all topics" : "Select all topics"}
                aria-checked={allSelected ? "true" : someSelected ? "mixed" : "false"}
                role="checkbox">
                
                {allSelected ? <Icon name="check" size={10} /> : someSelected ? <span className="topic-analysis-check-dash"></span> : null}
              </button>
            </th>
            <th className="topic-analysis-col-name" scope="col">Topic</th>
            <th className="topic-analysis-col-vol" scope="col">Volume</th>
            <th className="topic-analysis-col-aht" scope="col" title="Average Handle Time">AHT</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((t) => {
            const pct = Math.round(t.volume / maxVol * 100);
            const isSel = selected.includes(t.id);
            return (
              <tr
                key={t.id}
                className={`topic-analysis-row ${isSel ? "selected" : ""}`}
                onClick={() => toggle(t.id)}
                aria-selected={isSel}>
                
                <td className="topic-analysis-col-check">
                  <span
                    className={`topic-analysis-check ${isSel ? "all" : ""}`}
                    role="checkbox"
                    aria-checked={isSel}>
                    
                    {isSel ? <Icon name="check" size={10} /> : null}
                  </span>
                </td>
                <td className="topic-analysis-col-name">{t.label}</td>
                <td className="topic-analysis-col-vol">
                  <span className="topic-analysis-bar-wrap">
                    <span className="topic-analysis-bar" style={{ width: `${pct}%` }}></span>
                  </span>
                  <span className="topic-analysis-vol mono">{t.volume}%</span>
                </td>
                <td className="topic-analysis-col-aht mono">{t.aht}</td>
              </tr>);

          })}
        </tbody>
      </table>
      <div className="topic-analysis-foot">
        <span>
          <Icon name="info" size={11} /> {selectedCount === 0 ?
          "Pick the topics you want to focus on. We'll weight them when drafting your goals." :
          <>{selectedCount} of {ranked.length} selected · covers <b>{selectedVol}%</b> of conversations.</>
          }
        </span>
      </div>
    </div>);

};

const CreateGoalSlideout = ({ open, onClose, onSave, companyProfileSet, prefill, existingGoals = [] }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("AIC");
  const [target, setTarget] = useState({ value: "", direction: "decrease", unit: "%", window: "90 days" });
  const [topics, setTopics] = useState([]);
  const [tone, setTone] = useState("Friendly");
  const [showCompany, setShowCompany] = useState(!companyProfileSet);
  const [company, setCompany] = useState(window.MOCK.COMPANY_PROFILE_DEFAULTS);
  const [startedFrom, setStartedFrom] = useState(null); // {kind: 'template'|'clone', label}
  const [clonePickerOpen, setClonePickerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState("basics");
  const sectionRefs = {
    basics: useRef(null),
    audience: useRef(null),
    target: useRef(null),
    topics: useRef(null)
  };
  const scrollRootRef = useRef(null);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setName("");setDescription("");setAudience("AIC");
      setTarget({ value: "", direction: "decrease", unit: "%", window: "90 days" });
      setTopics([]);setTone("Friendly");
      setStartedFrom(null);setClonePickerOpen(false);
    }
  }, [open]);

  // Apply a template / clone (hydrate state, remember the source)
  const applyTemplate = (tpl) => {
    const goal = goalTemplateById(tpl.id);
    if (!goal) return;
    setName(goal.name || "");
    setDescription(goal.description || "");
    if (goal.audience) setAudience(goal.audience);
    if (goal.target) setTarget((t) => ({ ...t, ...goal.target, value: String(goal.target.value ?? "") }));
    if (goal.topics) setTopics(goal.topics);
    setStartedFrom({ kind: "template", label: tpl.label });
  };
  const cloneExisting = (g) => {
    setName(`${g.name} (copy)`);
    setDescription(g.description || "");
    if (g.audience) setAudience(g.audience);
    if (g.target) setTarget((t) => ({ ...t, ...g.target, value: String(g.target.value ?? "") }));
    // existingGoals carry topic labels; map back to ids if possible
    const topicIds = (g.topics || []).
    map((label) => window.MOCK.TOPICS.find((tp) => tp.label === label)?.id).
    filter(Boolean);
    setTopics(topicIds);
    setStartedFrom({ kind: "clone", label: g.name });
    setClonePickerOpen(false);
  };
  const clearStartedFrom = () => setStartedFrom(null);

  // Hydrate from prefill when slideout opens with a template
  useEffect(() => {
    if (!open || !prefill) return;
    if (prefill.name) setName(prefill.name);
    if (prefill.description) setDescription(prefill.description);
    if (prefill.audience) setAudience(prefill.audience);
    if (prefill.target) setTarget((t) => ({ ...t, ...prefill.target }));
    if (prefill.topics) setTopics(prefill.topics);
    if (prefill.tone) setTone(prefill.tone);
  }, [open, prefill]);

  const canSave = name.trim().length > 0 && target.value !== "" && topics.length > 0;

  // Step completion + click-to-jump scroll
  const steps = [
  { id: "basics", n: 1, label: "Basics", sub: "Name & description", done: name.trim().length > 0 },
  { id: "audience", n: 2, label: "Audience", sub: "Where the AI shows up", done: Boolean(audience) },
  { id: "target", n: 3, label: "Target", sub: "What to move, how much", done: target.value !== "" },
  { id: "topics", n: 4, label: "Topics", sub: "What it covers", done: topics.length > 0 }];

  const jumpTo = (id) => {
    setActiveStep(id);
    const el = sectionRefs[id]?.current;
    const root = scrollRootRef.current;
    if (!el || !root) return;
    const top = el.offsetTop - 12;
    root.scrollTo({ top, behavior: "smooth" });
  };
  // Sync active step on scroll
  useEffect(() => {
    if (!open) return;
    const root = scrollRootRef.current;
    if (!root) return;
    const onScroll = () => {
      const y = root.scrollTop + 60;
      let current = "basics";
      for (const s of steps) {
        const el = sectionRefs[s.id]?.current;
        if (el && el.offsetTop <= y) current = s.id;
      }
      setActiveStep(current);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [open, name, audience, target.value, topics.length]);

  return (
    <Slideout
      open={open}
      onClose={onClose}
      title="Create a goal"
      subtitle="Pick an outcome to move. We'll draft the AI, procedures, and monitors to drive it."
      wide
      bodyRef={scrollRootRef}
      footer={
      <>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!canSave} onClick={() => onSave({ name, description, audience, target, topics, tone, company: showCompany ? company : null })}>
            <Icon name="check" size={14} /> Save goal
          </button>
        </>
      }>
      
      {/* Clickable stepper, jumps to each section */}
      <div className="cg-stepper">
        {steps.map((s, i) =>
        <React.Fragment key={s.id}>
            <button
            type="button"
            className={`cg-step ${activeStep === s.id ? "active" : ""} ${s.done ? "done" : ""}`}
            onClick={() => jumpTo(s.id)}>
            
              <span className="cg-step-bullet">
                {s.done ? <Icon name="check" size={10} /> : s.n}
              </span>
              <span className="cg-step-body">
                <span className="cg-step-label">{s.label}{s.optional && <span className="cg-step-opt"> · optional</span>}</span>
                <span className="cg-step-sub">{s.sub}</span>
              </span>
            </button>
            {i < steps.length - 1 && <span className={`cg-step-rule ${steps[i].done ? "done" : ""}`}></span>}
          </React.Fragment>
        )}
      </div>
      {/* Start-from strip, shown when no name typed and no template applied yet */}
      {!startedFrom && name.trim().length === 0 &&
      <div className="goal-startfrom">
          <div className="goal-startfrom-head">
            <h4>Start from a template <span className="opt">, optional</span></h4>
            <p>Pick a common goal to pre-fill the form, or clone one you've already created. You can edit everything below.</p>
          </div>
          <div className="goal-tpl-grid">
            {GOAL_TEMPLATES.map((tpl) =>
          <button key={tpl.id} className="goal-tpl-card" onClick={() => applyTemplate(tpl)}>
                <span className="goal-tpl-ico"><Icon name={tpl.icon} size={14} /></span>
                <span className="goal-tpl-body">
                  <span className="goal-tpl-label">{tpl.label}</span>
                  <span className="goal-tpl-blurb">{tpl.blurb}</span>
                </span>
              </button>
          )}
          </div>
          {existingGoals.length > 0 &&
        <div className="goal-clone-row">
              <button
            className="btn ghost sm goal-clone-trigger"
            onClick={() => setClonePickerOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={clonePickerOpen}>
            
                <Icon name="rotate" size={12} /> Clone from existing goal
                <Icon name={clonePickerOpen ? "chevDown" : "chevRight"} size={11} />
              </button>
              {clonePickerOpen &&
          <div className="goal-clone-menu" role="listbox">
                  {existingGoals.map((g) =>
            <button key={g.id} className="goal-clone-item" onClick={() => cloneExisting(g)} role="option">
                      <span className="goal-clone-name">{g.name}</span>
                      <span className="goal-clone-meta">
                        <span className="mono">{g.target.direction === "decrease" ? "−" : "+"}{g.target.value}{g.target.unit === "%" ? "%" : ""}</span>
                        <span className="dot"></span>
                        <span>{g.audience}</span>
                      </span>
                    </button>
            )}
                </div>
          }
            </div>
        }
        </div>
      }

      {/* "Started from" breadcrumb when a template/clone was picked */}
      {startedFrom &&
      <div className="goal-startedfrom">
          <Icon name="sparkles" size={12} />
          <span>
            {startedFrom.kind === "template" ? "Started from template: " : "Cloned from: "}
            <b>{startedFrom.label}</b>
          </span>
          <button className="goal-startedfrom-clear" onClick={clearStartedFrom} title="Clear and start blank">
            <Icon name="x" size={11} />
          </button>
        </div>
      }

      {/* Inline Company Profile (first run), yellow card */}
      {showCompany ?
      <div className="company-card">
          <div className="company-card-head">
            <div>
              <h4>First, tell us about your company</h4>
              <p>Captured once, read everywhere, by AI Setup, monitors, and goal suggestions.</p>
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
                  onClick={() => setCompany({ ...company, channels: active ? company.channels.filter((x) => x !== c) : [...company.channels, c] })}>
                  {c}</button>);

            })}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="field-label">Short description</div>
            <textarea className="text" value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
            <div className="field-hint">We'll use this to draft topic-aware procedures.</div>
          </div>
        </div> :

      <div className="company-card collapsed">
          <Icon name="check" size={16} />
          <div className="summary">
            <b>{company.name}</b> · {company.industry} · {company.brands} brands
            <small style={{ display: "block", color: "var(--ink-50)", marginTop: 2 }}>
              Channels: {company.channels.join(", ")}
            </small>
          </div>
          <button className="btn sm ghost" onClick={() => setShowCompany(true)}>
            <Icon name="edit" size={12} /> Edit in Settings
          </button>
        </div>
      }

      {/* Goal, Step 1 Basics */}
      <div ref={sectionRefs.basics} className="cg-section" data-step="basics">
      <div className="field">
        <div className="field-label">Goal name <span className="req">*</span></div>
        <input className="text" placeholder="e.g. Reduce refund tickets by 20%" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="field">
        <div className="field-label">Short description</div>
        <textarea className="text" placeholder="What does success look like? Who does this help?" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      </div>

      {/* Step 2, Audience */}
      <div ref={sectionRefs.audience} className="cg-section" data-step="audience">
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
      </div>

      {/* Step 3, Target */}
      <div ref={sectionRefs.target} className="cg-section" data-step="target">
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
            {["30 days", "60 days", "90 days", "Quarterly", "Annual"].map((w) =>
              <button key={w} className={`tone-pill ${target.window === w ? "active" : ""}`} onClick={() => setTarget({ ...target, window: w })}>{w}</button>
              )}
          </div>
        </div>
      </div>
      </div>

      {/* Step 4, Topics */}
      <div ref={sectionRefs.topics} className="cg-section" data-step="topics">
      <div className="field">
        <div className="field-label">Topics this goal covers <span className="req">*</span></div>
        <div className="field-hint" style={{ marginBottom: 10 }}>Auto-detected from the last 90 days of conversations. Pick the topics this goal applies to.</div>
        <TopicAnalysis selected={topics} onChange={setTopics} />
        <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--ink-50)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>All topics</div>
        <div style={{ marginTop: 8 }}>
          <TopicMulti selected={topics} onChange={setTopics} />
        </div>
      </div>

      <div className="field" style={{ marginBottom: 0, marginTop: 18 }}>
        <div className="field-label">How should your AI sound?</div>
        <TonePicker value={tone} onChange={setTone} />
      </div>
      </div>
    </Slideout>);

};

// ---------------------------------------------------------------
// First-run primer (onboarding) modal
// Cards are clickable: each navigates to the destination it describes
// and dismisses the modal. The avatar/Tweaks "Replay primer" reopens it,
// so this surface doubles as per-concept re-entry.
// ---------------------------------------------------------------
const OnboardingModal = ({ open, onClose, navigate }) => {
  if (!open) return null;
  const goTo = (path) => {onClose();if (path) navigate(path);};
  return (
    <div className="onboarding-backdrop" onClick={onClose}>
      <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to a goals-first Kustomer</h2>
        <p className="lede">
          Four short notes about the new primitives. ~30 seconds, then you're off. Click a card to jump to where it lives. You can re-open this anytime from your avatar menu, the Tweaks panel, or the <Icon name="help" size={11} style={{ verticalAlign: "middle" }} /> button in the AI panel header.
        </p>
        <div className="onboarding-cards">
          <button className="onboarding-card clickable" onClick={() => goTo("goals")}>
            <span className="n">0.1</span>
            <h4>Goals are the spine</h4>
            <p>Every AI automation, monitor, and workflow connects to a goal. Goals organize the platform around outcomes.</p>
            <div className="where">Lives in <b>Goals</b> (site rail) <Icon name="chevRight" size={11} /></div>
          </button>
          <button className="onboarding-card clickable" onClick={() => goTo("reporting")}>
            <span className="n">0.2</span>
            <h4>Topics, auto-detected</h4>
            <p>The shared taxonomy of what customers ask about. Auto-detected from the last 90 days. Editable.</p>
            <div className="where">View: <b>Reporting → Topics</b> · Manage: <b>Settings → Topics</b> <Icon name="chevRight" size={11} /></div>
          </button>
          <button className="onboarding-card clickable" onClick={() => goTo("performance")}>
            <span className="n">0.3</span>
            <h4>Suggestions apply in place</h4>
            <p>When AI proposes a fix, it surfaces where the affected block lives. Apply, edit, or dismiss inline.</p>
            <div className="where">On every block + <b>Performance → Suggestions</b> <Icon name="chevRight" size={11} /></div>
          </button>
          <button className="onboarding-card clickable highlight" onClick={() => goTo("goals")}>
            <span className="n">0.4</span>
            <h4>Company profile, captured inline</h4>
            <p>During your first goal, we'll ask about industry, channels, brands. Stored once, read everywhere.</p>
            <div className="where">Captured at <b>Goals → Create goal</b> · Home: <b>Settings → Company profile</b> <Icon name="chevRight" size={11} /></div>
          </button>
        </div>
        <div className="onboarding-actions">
          <button className="btn ghost" onClick={onClose}>Skip</button>
          <button className="btn primary" onClick={onClose}>
            Got it, take me to Goals <Icon name="chevRight" size={13} />
          </button>
        </div>
      </div>
    </div>);

};

// ---------------------------------------------------------------
// Apply Suggestion slide-out, inline procedure / KB / tool / guardrail edit
// ---------------------------------------------------------------
const ApplySuggestionSlideout = ({ open, suggestion, onClose, onApply, flags = {} }) => {
  const [evalState, setEvalState] = useState("idle"); // idle | running | passed | failed
  const [reviewer, setReviewer] = useState("");
  const [reviewState, setReviewState] = useState("none"); // none | pending | approved

  // Reset state whenever a new suggestion opens
  useEffect(() => {
    if (open) {setEvalState("idle");setReviewer("");setReviewState("none");}
  }, [open, suggestion]);

  if (!suggestion) return null;
  const t = suggestion.target || { type: "procedure", label: "Procedure" };
  const typeLabel = { procedure: "Procedure", kb: "Knowledge Article", tool: "Tool", guardrail: "Guardrail", monitor: "Monitor", tone: "Tone Guidance" }[t.type] || "Block";
  const proc = window.MOCK.PROCEDURES.find((p) => p.id === t.id);

  // Compute association count for shared-block gating
  const associationCount = proc ?
  (proc.associations.allAIC ? window.MOCK.AUTOMATIONS.filter((a) => a.audience === "AIC").length : 0) + (
  proc.associations.allAIR ? window.MOCK.AUTOMATIONS.filter((a) => a.audience === "AIR").length : 0) + (
  proc.associations.automations?.length || 0) :
  1;
  const isSharedBlock = associationCount > 3;

  // C-2 gating: shared blocks REQUIRE passing eval before apply
  const evalGateRequired = flags.previewAgainstEval && isSharedBlock;
  const evalSatisfied = !evalGateRequired || evalState === "passed";

  // C-6 gating: shared blocks REQUIRE reviewer approval before apply
  const reviewGateRequired = flags.reviewerApproval && isSharedBlock;
  const reviewSatisfied = !reviewGateRequired || reviewState === "approved";

  const canApply = evalSatisfied && reviewSatisfied;

  const runEval = () => {
    setEvalState("running");
    setTimeout(() => {
      // 80% chance to pass for the demo
      setEvalState(Math.random() < 0.8 ? "passed" : "failed");
    }, 1600);
  };

  const requestReview = () => {
    if (!reviewer.trim()) return;
    setReviewState("pending");
    setTimeout(() => setReviewState("approved"), 1400);
  };

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
          <button
          className="btn primary"
          disabled={!canApply}
          onClick={() => onApply(suggestion)}
          title={!canApply ?
          !evalSatisfied ? "Run eval and pass before applying to a shared block" :
          !reviewSatisfied ? "Reviewer approval required for shared-block edits" : "" :
          ""}>
          
            <Icon name="check" size={14} /> Save and apply
          </button>
        </>
      }>
      
      {/* Suggestion summary banner */}
      <div className="suggestion-evidence" style={{ marginBottom: 18 }}>
        <div className="saw">From suggestion</div>
        <div><b style={{ color: "var(--ink-100)" }}>{suggestion.title}</b> · Confidence{" "}
          <span className={`suggestion-confidence ${suggestion.confidenceLabel.toLowerCase()}`} style={{ fontSize: 10.5, padding: "1px 6px" }}>
            {suggestion.confidenceLabel} · {Math.round(suggestion.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* C-2 · Preview against eval suite (flag-gated, shared blocks only) */}
      {flags.previewAgainstEval && isSharedBlock &&
      <div className="eval-preview-card">
          <div className="eval-preview-head">
            <div>
              <h4>Preview against eval suite <span className="flag-pill">C-2</span></h4>
              <p>Shared block ({associationCount} associations), passing eval is required before apply.</p>
            </div>
            {evalState === "idle" &&
          <button className="btn primary sm" onClick={runEval}>
                <Icon name="play" size={11} /> Run eval
              </button>
          }
            {evalState === "running" &&
          <span className="chip warn"><span className="spin"></span> Running…</span>
          }
            {evalState === "passed" &&
          <span className="chip good"><Icon name="check" size={11} /> Passed</span>
          }
            {evalState === "failed" &&
          <span className="chip bad"><Icon name="x" size={11} /> Failed</span>
          }
          </div>
          {evalState !== "idle" &&
        <div className="eval-preview-bars">
              {[
          { name: "Standard Refunds", before: 89, after: evalState === "failed" ? 78 : 94 },
          { name: "Damaged Items", before: 23, after: evalState === "failed" ? 32 : 71 },
          { name: "Late Delivery", before: 76, after: evalState === "failed" ? 70 : 82 },
          { name: "Coupon Handling", before: 81, after: evalState === "failed" ? 67 : 88 }].
          map((cat) => {
            const delta = cat.after - cat.before;
            const good = delta >= 0;
            return (
              <div className="eval-bar" key={cat.name}>
                    <span className="eval-bar-name">{cat.name}</span>
                    <span className="eval-bar-before">{cat.before}%</span>
                    <span className="eval-bar-arrow">{good ? "↗" : "↘"}</span>
                    <span className="eval-bar-after">{cat.after}%</span>
                    <span className={`eval-bar-delta ${good ? "good" : "bad"}`}>
                      {good ? "+" : ""}{delta}
                    </span>
                  </div>);

          })}
            </div>
        }
          {evalState === "failed" &&
        <div className="eval-preview-fail">
              <Icon name="warning" size={12} /> Eval regressed. Tweak the diff or re-run.
            </div>
        }
        </div>
      }

      {/* C-6 · Reviewer approval (flag-gated, shared blocks only) */}
      {flags.reviewerApproval && isSharedBlock &&
      <div className="reviewer-card">
          <div className="reviewer-head">
            <div>
              <h4>Reviewer approval <span className="flag-pill">C-6</span></h4>
              <p>Two-person rule for shared blocks ({associationCount} associations).</p>
            </div>
          </div>
          <div className="reviewer-row">
            <select className="text" value={reviewer} onChange={(e) => setReviewer(e.target.value)} disabled={reviewState !== "none"}>
              <option value="">Pick a reviewer…</option>
              <option value="maria">Maria Chen · AI Reviewer</option>
              <option value="jordan">Jordan Patel · AI Reviewer</option>
              <option value="priya">Priya Singh · Org Admin</option>
            </select>
            {reviewState === "none" &&
          <button className="btn primary sm" disabled={!reviewer} onClick={requestReview}>
                <Icon name="send" size={11} /> Request review
              </button>
          }
            {reviewState === "pending" &&
          <span className="chip warn"><span className="spin"></span> Pending</span>
          }
            {reviewState === "approved" &&
          <span className="chip good"><Icon name="check" size={11} /> Approved</span>
          }
          </div>
        </div>
      }

      {/* Procedure body, for procedure type */}
      {t.type === "procedure" && proc &&
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
              {proc.steps.map((step, i) =>
            <div className="proc-step" key={i}>
                  <span style={{ color: "var(--ink-50)", marginRight: 6 }}>{i + 1}.</span>
                  {step}
                </div>
            )}
              {/* AI-added step at position 2 */}
              <div className="proc-step ai-added">
                <span style={{ color: "var(--good)", marginRight: 6 }}>↻</span>
                Before applying the coupon, recommend related products from the customer's order history.
              </div>
              <div className="proc-step changed">
                <span style={{ color: "var(--warn)", marginRight: 6 }}>↻</span>
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
              {proc.associations.automations.map((a) =>
            <button key={a} className="tone-pill active">{window.MOCK.AUTOMATIONS.find((au) => au.id === a)?.name || a}</button>
            )}
              <button className="tone-pill"><Icon name="plus" size={11} /> Add</button>
            </div>
            <div className="field-hint" style={{ marginTop: 8 }}>
              <Icon name="warning" size={12} /> Editing this procedure affects{" "}
              <b>{proc.associations.allAIC ? `all ${window.MOCK.AUTOMATIONS.filter((a) => a.audience === "AIC").length} AIC automations` : `${proc.associations.automations.length} automation${proc.associations.automations.length === 1 ? "" : "s"}`}</b>.
            </div>
          </div>
        </>
      }

      {/* Diff preview for non-procedure types, falls back to before/after */}
      {t.type !== "procedure" && suggestion.before && suggestion.after &&
      <div>
          <div className="field-label" style={{ marginBottom: 10 }}>Proposed change</div>
          <div className="diff-grid">
            <div className="diff-card before"><div className="h">Before</div>{suggestion.before}</div>
            <div className="diff-card after"><div className="h">After</div>{suggestion.after}</div>
          </div>
        </div>
      }

      <div style={{ background: "var(--v2-paper-2)", padding: "10px 14px", borderRadius: 8, fontSize: 11.5, color: "var(--ink-60)", marginTop: 18 }}>
        <Icon name="info" size={12} style={{ verticalAlign: "middle" }} /> No conversations are affected until you click <b style={{ color: "var(--ink-100)" }}>Save and apply</b>.
      </div>
    </Slideout>);

};

Object.assign(window, { Slideout, CreateGoalSlideout, OnboardingModal, ApplySuggestionSlideout, GOAL_TEMPLATES, TopicAnalysis });