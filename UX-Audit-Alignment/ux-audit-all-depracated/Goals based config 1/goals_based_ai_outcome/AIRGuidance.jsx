// Knowledge Sources + Procedures sections for AI for Reps.
// Uses the same flat-subsection visual language as BuildPanel,
// but scoped to the "all-air" association.

const AIR_CONTEXT = { id: "all-air", label: "AI for Reps", kind: "air" };

const AIRGuidance = ({ onDirty }) => {
  const [knowledge, setKnowledge] = React.useState([
    { id: "k-handbook",  label: "Rep Handbook" },
    { id: "k-policies",  label: "Policies & Procedures KB" },
  ]);

  // Seeded from the org-wide procedure library, filtered to procedures
  // associated with AI for Reps. State is local for the prototype.
  const seedAirProcedures = (window.INITIAL_LIBRARY || []).filter(p =>
    p.associations.includes(AIR_CONTEXT.id)
  );
  const [attached, setAttached] = React.useState(seedAirProcedures);
  const [expanded, setExpanded] = React.useState({});
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const setAndDirty = (fn) => { onDirty && onDirty(); fn(); };

  const detach = (id) => setAndDirty(() =>
    setAttached(list => list.filter(p => p.id !== id)));

  const attach = (proc) => setAndDirty(() => {
    setAttached(list => list.some(p => p.id === proc.id) ? list : [...list, proc]);
    setPickerOpen(false);
  });

  const createNew = (data) => setAndDirty(() => {
    const newProc = {
      id: `p-air-${Date.now()}`,
      name: data.name,
      description: data.description,
      body: data.body,
      associations: [AIR_CONTEXT.id],
    };
    setAttached(list => [...list, newProc]);
    setPickerOpen(false);
  });

  return (
    <>
      {/* Knowledge Sources */}
      <GuidanceBlock
        title="Knowledge Sources"
        description="Choose the knowledge sources Copilot can use when drafting replies and answering rep questions."
        onDelete={() => {}}
      >
        <KnowledgeSelect
          items={knowledge}
          onRemove={(id) => setAndDirty(() => setKnowledge(ks => ks.filter(x => x.id !== id)))}
        />
      </GuidanceBlock>

      {/* Procedures */}
      <GuidanceBlock
        title="Procedures"
        description="Step-by-step instructions Copilot follows when assisting reps. Procedures live in your shared Procedure Library and can be attached to one or more Automations or AI for Reps."
        onDelete={() => {}}
        last
        action={<AddLink onClick={() => setPickerOpen(true)}>Add Procedure</AddLink>}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {attached.length === 0 ? (
            <div style={{
              padding: "16px 14px",
              border: "1px dashed #DCE0E9",
              borderRadius: 8,
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182",
              textAlign: "center",
            }}>
              No procedures yet. <button onClick={() => setPickerOpen(true)} style={{ border: 0, background: "transparent", color: "#0165E4", fontWeight: 600, cursor: "pointer", padding: 0, font: "inherit" }}>Add one from your library</button> or create new.
            </div>
          ) : attached.map(p => (
            <ProcedureRow
              key={p.id}
              proc={p}
              expanded={!!expanded[p.id]}
              onToggle={() => setExpanded(s => ({ ...s, [p.id]: !s[p.id] }))}
              onDetach={() => detach(p.id)}
              onChange={(updated) => setAndDirty(() => setAttached(list => list.map(x => x.id === p.id ? updated : x)))}
            />
          ))}
        </div>
      </GuidanceBlock>

      {pickerOpen && (
        <AIRProcedurePicker
          library={window.INITIAL_LIBRARY || []}
          alreadyAttachedIds={attached.map(p => p.id)}
          onClose={() => setPickerOpen(false)}
          onAttach={attach}
          onCreate={createNew}
        />
      )}
    </>
  );
};

// Lightweight picker — library tab + create tab, scoped to AIR.
const AIRProcedurePicker = ({ library, alreadyAttachedIds, onClose, onAttach, onCreate }) => {
  const [mode, setMode] = React.useState("library");
  const [q, setQ] = React.useState("");
  const [draft, setDraft] = React.useState({ name: "", description: "", body: "" });

  const candidates = library.filter(p =>
    !alreadyAttachedIds.includes(p.id) &&
    (!q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description||"").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(15,19,29,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 10,
        width: "min(640px, 100%)", maxHeight: "82vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(15,19,29,0.30)",
      }}>
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid #E8EAF0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "#1F242D" }}>
            Add Procedure to AI for Reps
          </div>
          <button onClick={onClose} style={{
            border: 0, background: "transparent", cursor: "pointer", padding: 4,
            color: "#697182", display: "inline-flex",
          }} aria-label="Close">
            <RailIcon name="close" size={18} strokeWidth={2}/>
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, padding: "12px 22px 0" }}>
          {[
            { id: "library", label: "From Library" },
            { id: "create",  label: "Create New" },
          ].map(t => (
            <button key={t.id} onClick={() => setMode(t.id)} style={{
              padding: "7px 12px", border: 0,
              background: "transparent",
              color: mode === t.id ? "#0165E4" : "#5F6675",
              fontFamily: "var(--font-sans)", fontSize: 13,
              fontWeight: mode === t.id ? 700 : 600,
              borderBottom: mode === t.id ? "2px solid #0165E4" : "2px solid transparent",
              cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "16px 22px 22px" }}>
          {mode === "library" ? (
            <>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search procedures…"
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid #DCE0E9", borderRadius: 6,
                  fontFamily: "var(--font-sans)", fontSize: 13,
                  outline: "none", background: "#fff", boxSizing: "border-box",
                  marginBottom: 10,
                }}/>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {candidates.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182" }}>
                    No procedures available. Create a new one.
                  </div>
                ) : candidates.map(p => (
                  <button key={p.id} onClick={() => onAttach(p)} style={{
                    display: "block", width: "100%", textAlign: "left",
                    border: "1px solid #E8EAF0", background: "#fff",
                    borderRadius: 8, padding: "10px 12px", cursor: "pointer",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#0165E4"; e.currentTarget.style.background = "#F5F9FF"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8EAF0"; e.currentTarget.style.background = "#fff"; }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{p.name}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2 }}>{p.description}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { k: "name", label: "Name", placeholder: "e.g. Order Lookup" },
                { k: "description", label: "Description", placeholder: "Short summary of what this procedure does" },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#1F242D", display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input value={draft[f.k]} onChange={e => setDraft(d => ({ ...d, [f.k]: e.target.value }))} placeholder={f.placeholder}
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: "1px solid #DCE0E9", borderRadius: 6,
                      fontFamily: "var(--font-sans)", fontSize: 13,
                      outline: "none", background: "#fff", boxSizing: "border-box",
                    }}/>
                </div>
              ))}
              <div>
                <label style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#1F242D", display: "block", marginBottom: 4 }}>Steps</label>
                <textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} rows={6} placeholder="1. …&#10;2. …"
                  style={{
                    width: "100%", padding: "9px 12px",
                    border: "1px solid #DCE0E9", borderRadius: 6,
                    fontFamily: "var(--font-sans)", fontSize: 13,
                    outline: "none", background: "#fff", boxSizing: "border-box",
                    resize: "vertical", lineHeight: 1.5,
                  }}/>
              </div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
                padding: "8px 10px", background: "#F2F4F8", borderRadius: 6,
              }}>
                This procedure will be added to <strong style={{ color: "#1F242D" }}>AI for Reps</strong>. You can extend it to AI for Customers automations from the Procedures library.
              </div>
            </div>
          )}
        </div>

        {mode === "create" && (
          <div style={{ borderTop: "1px solid #E8EAF0", padding: "12px 22px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={onClose} style={{
              padding: "8px 14px", border: 0, background: "transparent",
              color: "#697182", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 6, cursor: "pointer",
            }}>Cancel</button>
            <button onClick={() => draft.name && onCreate(draft)} disabled={!draft.name} style={{
              padding: "8px 14px", border: 0,
              background: draft.name ? "#0165E4" : "#BFC6D2",
              color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
              borderRadius: 6, cursor: draft.name ? "pointer" : "not-allowed",
            }}>Create Procedure</button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { AIRGuidance });
