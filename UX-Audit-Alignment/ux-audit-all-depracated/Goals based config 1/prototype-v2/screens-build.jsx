// ============================================================
// Build tab, guidance sections, procedure picker
// ============================================================

const BuildScreen = ({ automation, navigate, onAdvance, goals = [], onAttachGoal, onSetAudience }) => {
  const [goalPickerOpen, setGoalPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const [scenarioUploadDismissed, setScenarioUploadDismissed] = useState(false);
  const [scenarioParsing, setScenarioParsing] = useState(false);
  const [scenarioFiles, setScenarioFiles] = useState([]);
  useEffect(() => {
    if (!goalPickerOpen) return;
    const onDoc = (e) => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setGoalPickerOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [goalPickerOpen]);

  const baseProcs = window.MOCK.PROCEDURES.filter((p) =>
    p.associations.allAIC || p.associations.automations.includes(automation.id)
  );
  // In first-run mode, show parser-drafted procedures inline.
  const aiDrafted = automation.firstRunMode ? [
    { id: "draft-pq-recommendation", name: "Match product question to spec sheet", whenToUse: "Customer asks about product features, dimensions, materials, or compatibility. Drafted from your uploaded Product Catalog.", associations: { allAIC: false, allAIR: false, automations: [automation.id] }, _aiAdded: true },
    { id: "draft-pq-restock", name: "Restock & availability questions", whenToUse: "Customer asks when an out-of-stock item will return. Drafted from your help center pages on availability.", associations: { allAIC: false, allAIR: false, automations: [automation.id] }, _aiAdded: true },
  ] : [];
  const procedures = [...aiDrafted, ...baseProcs];
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tone, setTone] = useState("Friendly");

  return (
    <>
      {/* Audience is chosen at creation (New automation modal / inherited from
          goal or template). It only appears HERE as a gate when, for some
          path, it wasn't set — you can't build meaningfully without it. */}
      {!automation.audience && (
        <div className="audience-choice">
          <div className="audience-choice-head">
            <div className="audience-choice-eyebrow">Choose first · required</div>
            <h3>Who is this AI for?</h3>
            <p>This automation doesn't have an audience yet. Pick one to unlock Test and Deploy — an automation serves customers <b>or</b> assists reps, not both.</p>
          </div>
          <div className="audience-choice-opts">
            <button className="audience-choice-opt aic" onClick={() => onSetAudience?.("AIC")}>
              <span className="audience-choice-ico"><Icon name="sparkles" size={18} /></span>
              <span className="audience-choice-body">
                <span className="audience-choice-title">Customer AI</span>
                <span className="audience-choice-desc">Handles customer conversations end to end — replies, looks things up, takes actions, and escalates to a human when needed.</span>
              </span>
              <Icon name="chevRight" size={14} />
            </button>
            <button className="audience-choice-opt air" onClick={() => onSetAudience?.("AIR")}>
              <span className="audience-choice-ico"><Icon name="headset" size={18} /></span>
              <span className="audience-choice-body">
                <span className="audience-choice-title">Rep AI (Copilot)</span>
                <span className="audience-choice-desc">Assists a human rep — drafts replies, summarizes, and surfaces signals. The rep stays in control of every send.</span>
              </span>
              <Icon name="chevRight" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Goal-context strip, always visible. Per IA: goals are the spine. */}
      {automation.drives.length > 0 ? (
        <div className="goal-context-strip">
          <Icon name="target" size={12} style={{ color: "var(--ink-50)" }} />
          <span>This automation drives</span>
          {automation.drives.map((g) => {
            const match = [...(goals || []), ...window.MOCK.GOALS].find((x) => x.name === g);
            return <GoalChip key={g} name={g} onClick={match ? () => navigate(`goal:${match.id}`) : undefined} />;
          })}
          {automation.topics?.length > 0 && (
            <span style={{ fontSize: 11, color: "var(--ink-50)", marginLeft: "auto" }}>
              Topics: <b>{automation.topics.join(" · ")}</b>
            </span>
          )}
        </div>
      ) : (
        <div className="goal-context-strip empty" ref={pickerRef}>
          <Icon name="target" size={12} style={{ color: "var(--warn)" }} />
          <span style={{ color: "var(--ink-80)" }}>
            <b style={{ color: "var(--ink-100)" }}>No goal attached.</b> Every automation should drive a measurable outcome.
          </span>
          <div className="goal-context-attach">
            <button
              className="btn primary sm"
              onClick={() => setGoalPickerOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={goalPickerOpen}
            >
              <Icon name="target" size={11} /> Attach a goal <Icon name="chevDown" size={10} />
            </button>
            {goalPickerOpen && (
              <div className="goal-context-picker" role="listbox">
                {goals.length === 0 ? (
                  <div className="goal-context-picker-empty">
                    No goals declared yet.<br />
                    <a onClick={() => { setGoalPickerOpen(false); navigate("goals"); }}>Go to Goals → Create one</a>
                  </div>
                ) : (
                  <>
                    <div className="goal-context-picker-head">Attach this automation to</div>
                    {goals.map((g) => (
                      <button
                        key={g.id}
                        className="goal-context-picker-item"
                        onClick={() => { setGoalPickerOpen(false); onAttachGoal?.(g.name); }}
                        role="option"
                      >
                        <Icon name="target" size={11} />
                        <span className="goal-context-picker-name">{g.name}</span>
                        <span className="goal-context-picker-meta">
                          {g.target?.direction === "decrease" ? "−" : "+"}{g.target?.value}{g.target?.unit === "%" ? "%" : ""}
                        </span>
                      </button>
                    ))}
                    <div className="goal-context-picker-foot">
                      <a onClick={() => { setGoalPickerOpen(false); navigate("goals"); }}>
                        <Icon name="plus" size={10} /> Create a new goal
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* First-run scenario upload, AI suggestion that turns SOPs / call
          recordings / decision trees into draft procedures. Surfaces only
          on a brand-new automation; dismissible. */}
      {automation.firstRunMode && !scenarioUploadDismissed && (
        <div className="scenario-upload-card">
          <button
            className="scenario-upload-dismiss"
            onClick={() => setScenarioUploadDismissed(true)}
            aria-label="Dismiss"
            title="Skip for now"
          >
            <Icon name="x" size={11} />
          </button>
          <div className="scenario-upload-eyebrow">
            <Icon name="sparkles" size={11} /> First-time setup · suggested by AI
          </div>
          <h4 className="scenario-upload-title">Start from your scenarios</h4>
          <p className="scenario-upload-sub">
            Drop SOPs, call recordings, or decision trees and Kustomer AI will draft procedures, KB entries, and tool calls below, you review every one before it ships.
          </p>
          {scenarioFiles.length === 0 ? (
            <label className="scenario-upload-drop">
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const names = [...(e.target.files || [])].map((f) => f.name);
                  if (names.length === 0) return;
                  setScenarioFiles(names);
                  setScenarioParsing(true);
                  setTimeout(() => setScenarioParsing(false), 1400);
                }}
              />
              <span className="scenario-upload-drop-ico"><Icon name="upload" size={16} /></span>
              <span className="scenario-upload-drop-body">
                <span className="scenario-upload-drop-title">Drop files or <span className="scenario-upload-browse">browse</span></span>
                <span className="scenario-upload-drop-types">PDF · DOCX · TXT · MP3 · MP4 · CSV</span>
              </span>
            </label>
          ) : (
            <div className="scenario-upload-filelist">
              {scenarioFiles.map((name) => (
                <div key={name} className="scenario-upload-file">
                  <Icon name="check" size={11} />
                  <span className="scenario-upload-file-name">{name}</span>
                  {scenarioParsing
                    ? <span className="scenario-upload-file-state parsing">Parsing…</span>
                    : <span className="scenario-upload-file-state done">2 procedures drafted</span>}
                </div>
              ))}
              <button
                className="scenario-upload-add"
                onClick={(e) => { e.preventDefault(); setScenarioFiles([]); }}
              >
                <Icon name="plus" size={11} /> Add more files
              </button>
            </div>
          )}
          <div className="scenario-upload-foot">
            <span className="scenario-upload-foot-meta">
              <Icon name="info" size={10} /> Drafts land below as <b>AI added</b> procedures, review, edit, or remove before activating.
            </span>
            <span className="scenario-upload-foot-links">
              <a
                className="scenario-upload-template"
                onClick={(e) => {
                  e.preventDefault();
                  window.downloadBlob?.(
                    window.buildCsvString?.(window.SCENARIOS_CSV_TEMPLATE) || "",
                    window.FR_CSV_FILENAME || "scenarios-template.csv",
                    "text/csv"
                  );
                }}
              >
                <Icon name="download" size={10} /> Download template
              </a>
              <a
                className="scenario-upload-skip"
                onClick={(e) => { e.preventDefault(); setScenarioUploadDismissed(true); }}
              >
                Skip, I'll add procedures manually
              </a>
            </span>
          </div>
        </div>
      )}

      {/* Knowledge Sources */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3><Icon name="book" size={13} /> What the AI knows</h3>
          <div className="meta">
            {automation.attachedBlocks.kb} knowledge source{automation.attachedBlocks.kb === 1 ? "" : "s"} attached
            <button className="ask-assistant-link" onClick={() => window.dispatchEvent(new CustomEvent("assistant-ask", { detail: { prompt: "What knowledge should this automation have?" } }))}>
              <Icon name="sparkles" size={10} /> Ask the assistant
            </button>
          </div>
        </div>
        <div className="tone-row">
          <button className="tone-pill attached">Help Center · acmeoutdoors.com</button>
          <button className="tone-pill attached">Refund Policy 2024.pdf</button>
          <button className="tone-pill"><Icon name="plus" size={11} /> Attach knowledge</button>
        </div>
        <div className="field-hint" style={{ marginTop: 8 }}>
          Edit source content in <a style={{ color: "var(--ink-100)", borderBottom: "1px solid var(--ink-30)", cursor: "pointer" }} onClick={() => navigate("blocks-knowledge")}>Building Blocks → Knowledge Sources</a>.
        </div>
      </div>

      {/* Procedures */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3><Icon name="code" size={13} /> What the AI does</h3>
          <div className="meta">
            {procedures.length} procedure{procedures.length === 1 ? "" : "s"}{automation.firstRunMode ? " · 2 drafted from your scenarios" : ""}
            <button className="ask-assistant-link" onClick={() => window.dispatchEvent(new CustomEvent("assistant-ask", { detail: { prompt: "Draft a procedure for this automation" } }))}>
              <Icon name="sparkles" size={10} /> Ask the assistant
            </button>
          </div>
        </div>
        {procedures.map((p, i) => (
          <div key={p.id} className="procedure-row">
            <div className="drag"><Icon name="drag" size={12} /></div>
            <div>
              <div className="name">
                {p.name}
                {p._aiAdded && <span className="ai-added">AI added</span>}
              </div>
              <small>{p.whenToUse}</small>
            </div>
            <div className="assoc">
              {p.associations.allAIC ? "All Customer AI" : p.associations.automations.length === 1 ? "This automation" : `${p.associations.automations.length} automations`}
            </div>
            <button className="btn ghost btn-icon sm"><Icon name="moreV" size={12} /></button>
          </div>
        ))}
        <div style={{ paddingTop: 10 }}>
          <button className="btn" onClick={() => setPickerOpen(true)}>
            <Icon name="plus" size={12} /> Add procedure
          </button>
        </div>
      </div>

      {/* Tone */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3><Icon name="sparkles" size={13} /> How the AI sounds</h3>
          <div className="meta">Applies to every reply and rep draft</div>
        </div>
        <TonePicker value={tone} onChange={setTone} />
      </div>

      {/* Add guidance */}
      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <button className="btn"><Icon name="plus" size={12} /> Add guidance</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button className="btn ghost">Save draft</button>
          {automation.firstRunMode ? (
            <button className="btn brand" onClick={onAdvance}>
              Save & continue <Icon name="chevRight" size={12} />
            </button>
          ) : (
            <button className="btn primary">Save</button>
          )}
        </div>
      </div>

      {/* Procedure picker modal */}
      <ProcedurePicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  );
};

// ---------------------------------------------------------------
// Procedure picker modal
// ---------------------------------------------------------------
const ProcedurePicker = ({ open, onClose }) => {
  const [tab, setTab] = useState("library");
  const [search, setSearch] = useState("");
  if (!open) return null;
  return (
    <div className="slideout-backdrop" onClick={onClose}>
      <div className="slideout" style={{ width: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="slideout-head">
          <div>
            <h2>Add Procedure</h2>
            <p>Attach a shared procedure from the library, or create a new one.</p>
          </div>
          <button className="slideout-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div style={{ padding: "0 28px", display: "flex", gap: 4, borderBottom: "1px solid var(--v2-hairline)" }}>
          <div className={`tab ${tab === "library" ? "active" : ""}`} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderBottom: `2px solid ${tab === "library" ? "var(--ink-100)" : "transparent"}`, marginBottom: -1, color: tab === "library" ? "var(--ink-100)" : "var(--ink-60)" }} onClick={() => setTab("library")}>From library</div>
          <div className={`tab ${tab === "new" ? "active" : ""}`} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderBottom: `2px solid ${tab === "new" ? "var(--ink-100)" : "transparent"}`, marginBottom: -1, color: tab === "new" ? "var(--ink-100)" : "var(--ink-60)" }} onClick={() => setTab("new")}>Create new</div>
        </div>

        <div className="slideout-body">
          {tab === "library" ? (
            <>
              <SearchInput value={search} onChange={setSearch} placeholder="Search procedures…" />
              <div style={{ marginTop: 14 }}>
                {window.MOCK.PROCEDURES.map((p) => (
                  <div key={p.id} style={{ padding: "12px 14px", border: "1px solid var(--v2-hairline)", borderRadius: 8, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-100)", marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-60)" }}>{p.whenToUse}</div>
                      <div style={{ marginTop: 4, display: "flex", gap: 4 }}>
                        {p.topics.map((t) => <span key={t} className="topic-chip" style={{ fontSize: 10.5, padding: "2px 7px" }}>{t}</span>)}
                      </div>
                    </div>
                    <button className="btn primary sm"><Icon name="plus" size={12} /> Attach</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="field">
                <div className="field-label">Procedure name <span className="req">*</span></div>
                <input className="text" placeholder="e.g. Process Subscription Cancellation" />
              </div>
              <div className="field">
                <div className="field-label">When to use this</div>
                <textarea className="text" placeholder="Describe when the AI should follow this procedure…" />
              </div>
              <div className="field">
                <div className="field-label">Steps</div>
                <textarea className="text" rows="6" placeholder="1. Verify customer identity..." />
              </div>
              <div className="field">
                <div className="field-label">Associations</div>
                <div className="field-hint" style={{ marginBottom: 6 }}>Which automations should this procedure apply to?</div>
                <div className="tone-row">
                  <button className="tone-pill">All Customer AI</button>
                  <button className="tone-pill">All Rep AI</button>
                  <button className="tone-pill active">This automation</button>
                  <button className="tone-pill"><Icon name="plus" size={11} /> Specific automations</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="slideout-foot">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary"><Icon name="check" size={13} /> {tab === "library" ? "Done" : "Create procedure"}</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BuildScreen, ProcedurePicker });
