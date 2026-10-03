// ============================================================
// Designer notes — sticky annotations explaining "why things are
// where they are." Toggled from the Tweaks panel:
//   • useDesignerNotes()  — state + localStorage (seeded with authored notes)
//   • <DesignerNotesLayer> — renders stickies + click-to-place
//   • <DesignerNotesTweaks> — the panel UI (toggle, list, add, reset)
// The panel and the layer talk via a window "dn-add-sticky" event so
// they stay decoupled.
// ============================================================

const DN_KEY = "v2-designer-notes";

// Authored notes — short rationale, pinned to a screen + rough x/y (fractions).
const DN_SEED = [
  { id: "dn-goals-1", screen: "goals", x: 0.04, y: 0.10, label: "Goals lead the nav",
    text: "Goals sit first because the whole model is goals-first — every automation and monitor rolls up to one." },
  { id: "dn-goals-2", screen: "goals", x: 0.62, y: 0.72, label: "Floating assistant",
    text: "The assistant floats bottom-right so help is one tap away without crowding the goal list." },
  { id: "dn-automations-1", screen: "automations", x: 0.55, y: 0.04, label: "Audience at creation",
    text: "“New automation” asks who it's for up front, so the audience is decided once — not buried inside Build." },
  { id: "dn-automation-1", screen: "automation", x: 0.04, y: 0.30, label: "Build = assemble",
    text: "Build shows what the AI knows / does / sounds like — the shared building blocks, in plain language." },
  { id: "dn-automation-2", screen: "automation", x: 0.72, y: 0.30, label: "Assistant + Test Console",
    text: "The right rail pairs an assistant with a live Test Console so you can try and fix without leaving Build." },
  { id: "dn-performance-1", screen: "performance", x: 0.04, y: 0.16, label: "One rollup",
    text: "Performance rolls up every automation; a single automation's results live on its Analyze tab." },
  { id: "dn-all-1", screen: "all", x: 0.5, y: 0.04, label: "Goal chips are yellow",
    text: "Anywhere a feature rolls up to a goal, it shows a yellow chip so the link to the goal is always obvious." },
];

function useDesignerNotes() {
  const [notes, setNotes] = React.useState(() => {
    try { const s = window.localStorage.getItem(DN_KEY); if (s) return JSON.parse(s); } catch (e) {}
    return DN_SEED;
  });
  React.useEffect(() => {
    try { window.localStorage.setItem(DN_KEY, JSON.stringify(notes)); } catch (e) {}
  }, [notes]);
  const addNote = (n) => {
    const id = `dn-${Date.now()}`;
    setNotes((prev) => [...prev, { id, label: "", text: "", ...n }]);
    return id;
  };
  const updateNote = (id, patch) => setNotes((prev) => prev.map((x) => x.id === id ? { ...x, ...patch } : x));
  const deleteNote = (id) => setNotes((prev) => prev.filter((x) => x.id !== id));
  const resetNotes = () => setNotes(DN_SEED);
  return { notes, addNote, updateNote, deleteNote, resetNotes };
}

// ── The overlay layer ───────────────────────────────────────
function DesignerNotesLayer({ show, screen, notes, addNote, updateNote, deleteNote }) {
  const [placing, setPlacing] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);

  // The Tweaks panel asks us to start placing via this event.
  React.useEffect(() => {
    const onAsk = () => setPlacing(true);
    window.addEventListener("dn-add-sticky", onAsk);
    return () => window.removeEventListener("dn-add-sticky", onAsk);
  }, []);

  // While placing, the next click on the canvas drops a sticky there.
  React.useEffect(() => {
    if (!placing) return;
    const onClick = (e) => {
      if (e.target.closest(".dn-sticky, .dn-place-banner, .twk-panel, .twk-fab")) return;
      e.preventDefault(); e.stopPropagation();
      const x = Math.min(0.9, Math.max(0, e.clientX / window.innerWidth));
      const y = Math.min(0.92, Math.max(0, e.clientY / window.innerHeight));
      const id = addNote({ screen, x, y, text: "" });
      setEditingId(id);
      setPlacing(false);
    };
    document.addEventListener("click", onClick, true);
    const onEsc = (e) => { if (e.key === "Escape") setPlacing(false); };
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("click", onClick, true); document.removeEventListener("keydown", onEsc); };
  }, [placing, screen, addNote]);

  if (!show && !placing) return null;
  const visible = notes.filter((n) => !n.screen || n.screen === "all" || n.screen === screen);

  return (
    <>
      {placing && (
        <div className="dn-place-banner">
          <Icon name="edit" size={12} /> Click anywhere to drop a designer sticky
          <button onClick={() => setPlacing(false)}>Cancel</button>
        </div>
      )}
      {show && visible.map((n) => (
        <DNSticky
          key={n.id}
          note={n}
          editing={editingId === n.id}
          onEdit={() => setEditingId(n.id)}
          onBlur={() => setEditingId(null)}
          updateNote={updateNote}
          deleteNote={deleteNote}
        />
      ))}
    </>
  );
}

function DNSticky({ note, editing, onEdit, onBlur, updateNote, deleteNote }) {
  const ref = React.useRef(null);
  const drag = React.useRef(null);

  const onPointerDown = (e) => {
    if (editing || e.target.closest("textarea, button, input")) return;
    drag.current = { startX: e.clientX, startY: e.clientY, x: note.x, y: note.y, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = (e.clientX - drag.current.startX) / window.innerWidth;
    const dy = (e.clientY - drag.current.startY) / window.innerHeight;
    if (Math.abs(dx) + Math.abs(dy) > 0.002) drag.current.moved = true;
    updateNote(note.id, {
      x: Math.min(0.94, Math.max(0, drag.current.x + dx)),
      y: Math.min(0.94, Math.max(0, drag.current.y + dy)),
    });
  };
  const onPointerUp = () => { drag.current = null; };

  return (
    <div
      ref={ref}
      className={`dn-sticky ${editing ? "editing" : ""}`}
      style={{ left: `${note.x * 100}%`, top: `${note.y * 100}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="dn-sticky-head">
        <span className="dn-sticky-pin"><Icon name="sparkles" size={9} /> Designer note</span>
        <div className="dn-sticky-actions">
          {!editing && <button onClick={onEdit} title="Edit"><Icon name="edit" size={11} /></button>}
          <button onClick={() => deleteNote(note.id)} title="Delete"><Icon name="x" size={11} /></button>
        </div>
      </div>
      {editing ? (
        <>
          <input
            className="dn-sticky-label-input"
            placeholder="Label (optional)"
            value={note.label || ""}
            onChange={(e) => updateNote(note.id, { label: e.target.value })}
          />
          <textarea
            className="dn-sticky-text-input"
            autoFocus
            placeholder="Why is this here? One or two sentences…"
            value={note.text || ""}
            maxLength={180}
            onChange={(e) => updateNote(note.id, { text: e.target.value })}
            onBlur={onBlur}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onBlur(); }}
          />
        </>
      ) : (
        <>
          {note.label && <div className="dn-sticky-label">{note.label}</div>}
          <div className="dn-sticky-text">{note.text || <span className="dn-sticky-empty">Empty note — click ✎ to write</span>}</div>
        </>
      )}
    </div>
  );
}

// ── The Tweaks-panel section ────────────────────────────────
function DesignerNotesTweaks({ show, onToggle, notes, screen, deleteNote, resetNotes }) {
  const onScreen = notes.filter((n) => !n.screen || n.screen === "all" || n.screen === screen);
  return (
    <>
      <TweakToggle label="Show designer notes" value={show} onChange={onToggle} />
      <TweakButton onClick={() => { if (!show) onToggle(true); window.dispatchEvent(new CustomEvent("dn-add-sticky")); }}>
        + Add a sticky
      </TweakButton>
      <div className="dn-list">
        <div className="dn-list-head">{onScreen.length} note{onScreen.length === 1 ? "" : "s"} on this screen</div>
        {onScreen.length === 0 ? (
          <div className="dn-list-empty">No notes here yet. Add one to explain a design decision.</div>
        ) : (
          onScreen.map((n) => (
            <div key={n.id} className="dn-list-item">
              <div className="dn-list-item-body">
                {n.label && <div className="dn-list-item-label">{n.label}</div>}
                <div className="dn-list-item-text">{n.text || "(empty)"}</div>
                {n.screen === "all" && <span className="dn-list-item-scope">all screens</span>}
              </div>
              <button className="dn-list-item-del" onClick={() => deleteNote(n.id)} title="Delete"><Icon name="x" size={11} /></button>
            </div>
          ))
        )}
      </div>
      <TweakButton onClick={resetNotes}>Reset to authored notes</TweakButton>
    </>
  );
}

Object.assign(window, { useDesignerNotes, DesignerNotesLayer, DesignerNotesTweaks });
