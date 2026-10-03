// ============================================================
// Build tab — guidance sections, procedure picker
// ============================================================

const BuildScreen = ({ automation, navigate, onAdvance }) => {
  const procedures = window.MOCK.PROCEDURES.filter((p) =>
    p.associations.allAIC || p.associations.automations.includes(automation.id)
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tone, setTone] = useState("Friendly");

  return (
    <>
      {/* Goal-context strip */}
      {automation.drives.length > 0 && (
        <div style={{ background: "var(--blue-15)", border: "1px solid var(--blue-25)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Icon name="target" size={14} style={{ color: "var(--blue-95)" }} />
          <span style={{ fontSize: 12.5, color: "var(--blue-95)", fontWeight: 500 }}>This automation drives</span>
          {automation.drives.map((g) => <GoalChip key={g} name={g} />)}
          <span style={{ fontSize: 11.5, color: "var(--blue-90)", marginLeft: "auto" }}>
            Topics: {automation.topics.join(" · ")}
          </span>
        </div>
      )}

      {/* Knowledge Sources */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3><Icon name="book" size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--gray-95)" }} /> Knowledge Sources</h3>
          <div className="meta">{automation.attachedBlocks.kb} attached</div>
        </div>
        <div className="tone-row">
          <button className="tone-pill active">Help Center · acmeoutdoors.com</button>
          <button className="tone-pill active">Refund Policy v2024.pdf</button>
          <button className="tone-pill"><Icon name="plus" size={11} /> Attach knowledge</button>
        </div>
        <div className="field-hint" style={{ marginTop: 8 }}>Sources are indexed and used to ground AI answers. Edit content in <a style={{ color: "var(--blue-90)", cursor: "pointer" }}>Building Blocks → Knowledge Sources</a>.</div>
      </div>

      {/* Procedures */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3><Icon name="code" size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--gray-95)" }} /> Procedures</h3>
          <div className="meta">{procedures.length} active · 2 AI-drafted from your scenarios</div>
        </div>
        {procedures.map((p, i) => (
          <div key={p.id} className="procedure-row">
            <div className="drag"><Icon name="drag" size={14} /></div>
            <div>
              <div className="name">
                {p.name}
                {i === 1 && automation.firstRunMode && <span className="ai-added">AI added</span>}
              </div>
              <small>{p.whenToUse}</small>
            </div>
            <div className="assoc">
              {p.associations.allAIC ? "All AIC" : p.associations.automations.length === 1 ? "This automation" : `${p.associations.automations.length} automations`}
            </div>
            <button className="btn ghost sm"><Icon name="moreV" size={13} /></button>
          </div>
        ))}
        <div style={{ paddingTop: 12 }}>
          <button className="btn" onClick={() => setPickerOpen(true)}>
            <Icon name="plus" size={13} /> Add Procedure
          </button>
        </div>
      </div>

      {/* Tone */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3><Icon name="sparkles" size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--gray-95)" }} /> Response Tone</h3>
          <div className="meta">Applies to all replies + rep-assist drafts</div>
        </div>
        <TonePicker value={tone} onChange={setTone} />
      </div>

      {/* Add guidance */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button className="btn"><Icon name="plus" size={13} /> Add Guidance</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn ghost">Save draft</button>
          {automation.firstRunMode ? (
            <button className="btn primary" onClick={onAdvance}>
              Save & continue <Icon name="chevRight" size={13} />
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

        <div style={{ padding: "0 28px", display: "flex", gap: 4, borderBottom: "1px solid var(--gray-30)" }}>
          <div className={`tab ${tab === "library" ? "active" : ""}`} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderBottom: `2px solid ${tab === "library" ? "var(--gray-120)" : "transparent"}`, marginBottom: -1, color: tab === "library" ? "var(--gray-120)" : "var(--gray-95)" }} onClick={() => setTab("library")}>From library</div>
          <div className={`tab ${tab === "new" ? "active" : ""}`} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderBottom: `2px solid ${tab === "new" ? "var(--gray-120)" : "transparent"}`, marginBottom: -1, color: tab === "new" ? "var(--gray-120)" : "var(--gray-95)" }} onClick={() => setTab("new")}>Create new</div>
        </div>

        <div className="slideout-body">
          {tab === "library" ? (
            <>
              <SearchInput value={search} onChange={setSearch} placeholder="Search procedures…" />
              <div style={{ marginTop: 14 }}>
                {window.MOCK.PROCEDURES.map((p) => (
                  <div key={p.id} style={{ padding: "12px 14px", border: "1px solid var(--gray-30)", borderRadius: 8, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-120)", marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "var(--gray-95)" }}>{p.whenToUse}</div>
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
                  <button className="tone-pill">All AI for Customers</button>
                  <button className="tone-pill">All AI for Reps</button>
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
