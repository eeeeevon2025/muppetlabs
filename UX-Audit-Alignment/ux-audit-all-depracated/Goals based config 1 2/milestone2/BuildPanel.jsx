// Build page — shared by AI for Customers (Refund Order) and AI for Reps (Copilot).
// Procedures + Response Tone are pickers into the shared LIBRARY.

const KB_OPTIONS = ["Help Center", "Past Conversations", "Product Docs", "Internal Wiki", "Returns Policy"];

const BuildPanel = ({ mode = "customer" }) => {
  const isReps = mode === "reps";

  const [kbSources, setKbSources] = React.useState(
    isReps ? ["Help Center", "Internal Wiki"] : ["Help Center", "Returns Policy"]
  );
  const [procedureIds, setProcedureIds] = React.useState(
    isReps ? ["pr1", "pr5", "pr6"] : ["pr1", "pr2", "pr3", "pr5"]
  );
  const [toneIds, setToneIds] = React.useState(isReps ? ["t1", "t3"] : ["t1"]);
  const [customGuidance, setCustomGuidance] = React.useState(
    isReps
      ? "When a rep is mid-conversation, prefer suggested replies over auto-actions. Surface relevant past tickets in the side panel."
      : "Try not to mess this up."
  );
  const [openProc, setOpenProc] = React.useState(null);
  const [openTone, setOpenTone] = React.useState(null);

  const procedures = LIBRARY.procedures.filter(p => procedureIds.includes(p.id));
  const tones      = LIBRARY.tones.filter(t => toneIds.includes(t.id));

  return (
    <div>
      <h1 style={{
        margin: 0, fontFamily: "var(--font-sans)",
        fontSize: 22, fontWeight: 700, color: "#1F242D",
        letterSpacing: "-0.01em",
      }}>{isReps ? "Build your AI Copilot" : "Build your AI Automation"}</h1>

      <Description style={{ marginTop: 8, marginBottom: 22 }}>
        {isReps
          ? <>Configure how Copilot supports your reps in the conversation view. Choose the knowledge sources, procedures, and response tones it can draw on. For full control, try our <a href="#" style={{ color: "#0165E4", textDecoration: "none", fontWeight: 600 }}>Advanced Builder</a>.</>
          : <>Configure a simple AI automation with ease. Define which conversation topics should be handled by AI, and then configure AI to handle those conversations. If you need complex workflows with multiple AI Agents or full control, try our <a href="#" style={{ color: "#0165E4", textDecoration: "none", fontWeight: 600 }}>Advanced Builder</a>.</>
        }
      </Description>

      {/* Guidance section header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <SubSectionTitle sparkle>Guidance</SubSectionTitle>
        <AddLink>Add Guidance</AddLink>
      </div>
      <Description style={{ marginBottom: 22 }}>
        Pull from your shared <a href="#" style={{ color: "#0165E4", textDecoration: "none", fontWeight: 600 }}>Procedures</a> and Response Tones, plus knowledge sources. Edits apply everywhere they're used.
      </Description>

      {/* Knowledge Sources */}
      <BuildBlock
        title="Knowledge Sources"
        description="Choose the knowledge sources the agent can reference when responding."
      >
        <MultiSelectField values={kbSources} options={KB_OPTIONS} onChange={setKbSources}/>
      </BuildBlock>

      {/* Procedures — library picker */}
      <BuildBlock
        title="Procedures"
        description={<>Step-by-step instructions for handling conversations. Shared across automations and Copilot.</>}
        rightAction={
          <LibraryPicker
            kind="procedure"
            items={LIBRARY.procedures}
            selected={procedureIds}
            onChange={setProcedureIds}
          />
        }
        hideTrash
      >
        {procedures.length === 0 ? (
          <EmptyLibraryState kind="procedure"/>
        ) : (
          <div>
            {procedures.map((p, i) => (
              <LibraryItemRow
                key={p.id}
                item={p}
                first={i === 0}
                open={openProc === p.id}
                onToggle={() => setOpenProc(openProc === p.id ? null : p.id)}
                onRemove={() => setProcedureIds(ids => ids.filter(id => id !== p.id))}
              />
            ))}
          </div>
        )}
      </BuildBlock>

      {/* Response Tones — library picker (multi) */}
      <BuildBlock
        title="Response Tones"
        description={<>Personality and communication style. {isReps && "Reps can switch tone per conversation."}</>}
        rightAction={
          <LibraryPicker
            kind="tone"
            items={LIBRARY.tones}
            selected={toneIds}
            onChange={setToneIds}
          />
        }
        hideTrash
      >
        {tones.length === 0 ? (
          <EmptyLibraryState kind="tone"/>
        ) : (
          <div>
            {tones.map((t, i) => (
              <LibraryItemRow
                key={t.id}
                item={t}
                first={i === 0}
                open={openTone === t.id}
                onToggle={() => setOpenTone(openTone === t.id ? null : t.id)}
                onRemove={() => setToneIds(ids => ids.filter(id => id !== t.id))}
              />
            ))}
          </div>
        )}
      </BuildBlock>

      {/* Custom Guidance — automation- or copilot-specific */}
      <BuildBlock
        title="Custom Guidance"
        description={<>Free-form instructions specific to this {isReps ? "Copilot" : "automation"}. Use <span style={{ background: "#F2F3F7", padding: "1px 5px", borderRadius: 3, fontFamily: "var(--font-mono, monospace)", fontSize: 12 }}>@</span> to reference tools.</>}
      >
        <RichTextArea value={customGuidance} onChange={setCustomGuidance}/>
      </BuildBlock>

      <div style={{ height: 80 }}/>
    </div>
  );
};

// ─── Library item row (collapsible, used for Procedures & Tones) ───────

const LibraryItemRow = ({ item, first, open, onToggle, onRemove }) => (
  <div style={{ borderTop: first ? "1px solid #E8EAF0" : 0, borderBottom: "1px solid #E8EAF0" }}>
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 0",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "inline-block", transition: "transform 140ms", transform: open ? "rotate(90deg)" : "none", color: "#5F6675" }}>
        <RailIcon name="chevronRight" size={13} strokeWidth={2}/>
      </span>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: 13, fontWeight: 700, color: "#1F242D",
        flex: 1,
      }}>{item.name}</span>
      <span style={{
        padding: "2px 8px", borderRadius: 4,
        background: "#F2F3F7", color: "#5F6675",
        fontFamily: "var(--font-sans)",
        fontSize: 11, fontWeight: 600,
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        <RailIcon name="bookOpen" size={10} strokeWidth={1.7}/>
        Shared
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        title="Remove from this automation"
        style={{
          border: 0, background: "transparent", color: "#9099AB",
          padding: 4, cursor: "pointer", borderRadius: 4,
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#D14343"}
        onMouseLeave={e => e.currentTarget.style.color = "#9099AB"}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    {open && (
      <div style={{
        padding: "0 0 14px 22px",
        fontFamily: "var(--font-sans)",
        fontSize: 13, color: "#3F444F", lineHeight: 1.6,
      }}>
        {item.desc}
        <div style={{ marginTop: 10 }}>
          <a href="#" style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12, fontWeight: 600,
            color: "#0165E4", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            Edit
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
          </a>
        </div>
      </div>
    )}
  </div>
);

const EmptyLibraryState = ({ kind }) => (
  <div style={{
    padding: 18,
    border: "1px dashed #DCE0E9", borderRadius: 6,
    fontFamily: "var(--font-sans)", fontSize: 13, color: "#9099AB",
    textAlign: "center",
  }}>
    No {kind === "procedure" ? "procedures" : "tones"} added. Click <em>Add</em> above.
  </div>
);

// ─── Library picker dropdown — multi-select from library ───────

const LibraryPicker = ({ kind, items, selected, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "5px 10px", border: "1px solid #DCE0E9",
        background: "#fff",
        color: "#0165E4",
        fontFamily: "var(--font-sans)",
        fontSize: 12, fontWeight: 600,
        borderRadius: 4, cursor: "pointer",
      }}>
        <RailIcon name="plus" size={11} strokeWidth={2.4}/>
        Add
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0,
          width: 360,
          background: "#fff",
          border: "1px solid #E8EAF0",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(31,42,46,0.12)",
          zIndex: 50, padding: 6, maxHeight: 360, overflow: "auto",
        }}>
          <div style={{
            padding: "8px 10px 6px",
            fontFamily: "var(--font-sans)",
            fontSize: 11, fontWeight: 700, color: "#9099AB",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>Shared {kind === "procedure" ? "Procedures" : "Response Tones"}</div>
          {items.map(it => {
            const checked = selected.includes(it.id);
            return (
              <button key={it.id} onClick={() => toggle(it.id)} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                width: "100%", textAlign: "left",
                padding: "8px 10px", border: 0,
                background: checked ? "#EBF1FF" : "transparent",
                color: "#1F242D",
                cursor: "pointer", borderRadius: 4,
              }}
              onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { if (!checked) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  marginTop: 2,
                  width: 14, height: 14, borderRadius: 3,
                  border: checked ? "0" : "1.5px solid #B3BBCB",
                  background: checked ? "#0165E4" : "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{it.name}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
                    overflow: "hidden", textOverflow: "ellipsis",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  }}>{it.desc}</div>
                </span>
              </button>
            );
          })}
          <div style={{ borderTop: "1px solid #E8EAF0", marginTop: 4, padding: 4 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              width: "100%", padding: "8px 10px",
              border: 0, background: "transparent",
              color: "#0165E4",
              fontFamily: "var(--font-sans)",
              fontSize: 13, fontWeight: 600,
              borderRadius: 4, cursor: "pointer",
              textAlign: "left",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <RailIcon name="plus" size={12} strokeWidth={2.2}/>
              New {kind === "procedure" ? "Procedure" : "Tone"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Reusable Build sub-block ─────────────────────────────────

const BuildBlock = ({ title, description, children, rightAction, hideTrash }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
      <h4 style={{
        margin: 0, fontFamily: "var(--font-sans)",
        fontSize: 14, fontWeight: 700, color: "#1F242D",
      }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {rightAction}
        {!hideTrash && (
          <button style={{
            border: 0, background: "transparent", color: "#9099AB",
            padding: 4, cursor: "pointer", borderRadius: 4,
          }}>
            <RailIcon name="trash" size={14} strokeWidth={1.7}/>
          </button>
        )}
      </div>
    </div>
    <Description style={{ marginBottom: 12 }}>{description}</Description>
    {children}
  </div>
);

// ─── Multi-select field with chips (for Knowledge Sources) ─────────

const MultiSelectField = ({ values, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (opt) => {
    onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt]);
  };
  const remove = (opt) => onChange(values.filter(v => v !== opt));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          width: "100%", minHeight: 38,
          padding: "6px 10px",
          border: "1px solid #DCE0E9",
          background: "#fff",
          borderRadius: 4, cursor: "pointer",
          flexWrap: "wrap",
        }}
      >
        {values.length === 0 && (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#9099AB" }}>
            Select sources
          </span>
        )}
        {values.map(v => (
          <span key={v} style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 4px 3px 8px",
            background: "#EBF1FF",
            color: "#0165E4",
            borderRadius: 4,
            fontFamily: "var(--font-sans)",
            fontSize: 12, fontWeight: 600,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3F8CFF", marginRight: 2 }}/>
            {v}
            <span
              onClick={(e) => { e.stopPropagation(); remove(v); }}
              style={{
                width: 16, height: 16,
                color: "#0165E4", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                borderRadius: 3,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </span>
          </span>
        ))}
        <span style={{ marginLeft: "auto", color: "#9099AB", display: "inline-flex" }}>
          <RailIcon name="chevronDown" size={14} strokeWidth={2}/>
        </span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff",
          border: "1px solid #E8EAF0",
          borderRadius: 6,
          boxShadow: "0 6px 20px rgba(31,42,46,0.10)",
          zIndex: 50, padding: 4, maxHeight: 240, overflow: "auto",
        }}>
          {options.map(opt => {
            const checked = values.includes(opt);
            return (
              <button key={opt} onClick={() => toggle(opt)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", textAlign: "left",
                  padding: "7px 10px", border: 0,
                  background: checked ? "#EBF1FF" : "transparent",
                  color: "#1F242D",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: checked ? 600 : 500,
                  cursor: "pointer", borderRadius: 4,
                }}
                onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F2F3F7"; }}
                onMouseLeave={e => { if (!checked) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: 3,
                  border: checked ? "0" : "1.5px solid #B3BBCB",
                  background: checked ? "#0165E4" : "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Rich text area with toolbar ─────────────────────────────────

const RichTextArea = ({ value, onChange }) => {
  const [focused, setFocused] = React.useState(false);
  const tools = [
    { id: "b", node: <strong style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}>B</strong> },
    { id: "i", node: <em style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}>I</em> },
    { id: "h", node: <span style={{ fontWeight: 700 }}>T<span style={{ fontSize: 9 }}>↑</span></span> },
    { id: "list", node: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg> },
    { id: "at",   node: <span style={{ fontWeight: 700 }}>@</span> },
    { id: "fs",   node: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg> },
  ];
  return (
    <div style={{
      border: focused ? "1px solid #3F8CFF" : "1px solid #DCE0E9",
      outline: focused ? "3px solid rgba(63,140,255,0.18)" : "none",
      borderRadius: 4,
      background: "#fff",
      transition: "border-color 140ms, outline 140ms",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "6px 10px",
        borderBottom: "1px solid #E8EAF0",
        color: "#5F6675",
      }}>
        {tools.map((t, i) => (
          <React.Fragment key={t.id}>
            <button style={{
              width: 26, height: 26, border: 0, background: "transparent",
              color: "#5F6675", cursor: "pointer", borderRadius: 4,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-sans)", fontSize: 12,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#F2F3F7"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >{t.node}</button>
            {(i === 2 || i === 4) && <span style={{ width: 1, height: 14, background: "#DCE0E9", margin: "0 4px" }}/>}
          </React.Fragment>
        ))}
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={6}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 13, lineHeight: 1.5, color: "#1F242D",
          resize: "vertical",
          outline: "none",
          background: "transparent",
          boxSizing: "border-box",
          minHeight: 120,
        }}
      />
    </div>
  );
};

Object.assign(window, { BuildPanel, BuildBlock, MultiSelectField, RichTextArea });
