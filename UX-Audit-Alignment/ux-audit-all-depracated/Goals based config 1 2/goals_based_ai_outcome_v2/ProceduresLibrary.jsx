// Procedures Library — common place to manage procedures, listed under Resources.
// Rows expand to reveal the same Name / When to Use / Steps editor used on the
// AI for Customers Build page and the AI for Reps Copilot page.

const ALL_AUTOMATIONS = [
  { id: "aic-refund",   label: "Refund Order",      kind: "aic" },
  { id: "aic-track",    label: "Order Tracking",    kind: "aic" },
  { id: "aic-returns",  label: "Returns",           kind: "aic" },
  { id: "aic-shipping", label: "Shipping Updates",  kind: "aic" },
];

const PROC_SCOPES = [
  { id: "all-aic", label: "All AI for Customers", kind: "aic" },
  { id: "all-air", label: "AI for Reps",          kind: "air" },
];

const lookupProcAssoc = (id) =>
  PROC_SCOPES.find(s => s.id === id) || ALL_AUTOMATIONS.find(t => t.id === id);

const ProcChip = ({ id }) => {
  const t = lookupProcAssoc(id);
  if (!t) return null;
  const isScope = id.startsWith("all-");
  const palettes = {
    aic: { bg: "#EBF1FF", fg: "#0E3280", border: "#CBDCFF", dot: "#0165E4", solid: "#0E3280" },
    air: { bg: "#EFEDFF", fg: "#3D46A8", border: "#D9D5FF", dot: "#6E79E0", solid: "#3D46A8" },
  };
  const p = palettes[t.kind] || palettes.aic;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px",
      background: isScope ? p.solid : p.bg,
      color: isScope ? "#fff" : p.fg,
      border: isScope ? "0" : `1px solid ${p.border}`,
      borderRadius: 999,
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {!isScope && <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.dot }}/>}
      {t.label}
    </span>
  );
};

const ProceduresLibrary = () => {
  const [items, setItems] = React.useState(window.INITIAL_LIBRARY || []);
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [expandedId, setExpandedId] = React.useState(null);

  const filtered = items
    .filter(p => filter === "all"
      ? true
      : filter === "aic"
        ? p.associations.some(a => a.startsWith("aic-") || a === "all-aic")
        : p.associations.some(a => a === "all-air"))
    .filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description||"").toLowerCase().includes(q.toLowerCase()));

  const update = (id, patch) =>
    setItems(list => list.map(x => x.id === id ? { ...x, ...patch } : x));

  const remove = (id) =>
    setItems(list => list.filter(x => x.id !== id));

  return (
    <div data-screen-label="Procedures Library">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SectionTitle helpIcon>Procedures</SectionTitle>
          <Description style={{ marginTop: 10, maxWidth: 720 }}>
            A shared library of step-by-step playbooks. Attach each procedure to one or more AI for Customers automations or to AI for Reps. Edits here flow everywhere it's used.
          </Description>
        </div>
        <button style={{
          padding: "9px 16px", border: 0,
          background: "#0165E4", color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <RailIcon name="plus" size={14} strokeWidth={2.2}/> New Procedure
        </button>
      </div>

      <div style={{ marginTop: 22, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9099AB" }}>
            <RailIcon name="search" size={14} strokeWidth={2}/>
          </span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search procedures…"
            style={{
              width: "100%", padding: "9px 12px 9px 32px",
              border: "1px solid #DCE0E9", borderRadius: 6,
              fontFamily: "var(--font-sans)", fontSize: 13,
              outline: "none", background: "#fff", boxSizing: "border-box",
            }}/>
        </div>
        <div style={{ display: "inline-flex", gap: 4, padding: 3, background: "#F2F3F7", borderRadius: 999 }}>
          {[
            { id: "all", label: "All" },
            { id: "aic", label: "AI for Customers" },
            { id: "air", label: "AI for Reps" },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: "6px 12px", border: 0,
              background: filter === t.id ? "#fff" : "transparent",
              color: filter === t.id ? "#1F242D" : "#5F6675",
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              borderRadius: 999, cursor: "pointer",
              boxShadow: filter === t.id ? "0 1px 2px rgba(31,42,46,0.08)" : "none",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18, border: "1px solid #E8EAF0", borderRadius: 8, background: "#fff", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "minmax(180px, 1fr) minmax(220px, 1.6fr) minmax(160px, 1.2fr) 48px",
          gap: 20, padding: "10px 16px",
          background: "#FAFBFD", borderBottom: "1px solid #E8EAF0",
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          <div>Procedure</div>
          <div>Description</div>
          <div>Used by</div>
          <div></div>
        </div>
        {filtered.map((p, i) => {
          const open = expandedId === p.id;
          return (
            <div key={p.id} style={{ borderTop: i === 0 ? "0" : "1px solid #F0F2F6" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "minmax(180px, 1fr) minmax(220px, 1.6fr) minmax(160px, 1.2fr) 48px",
                gap: 20, padding: "12px 16px",
                alignItems: "center",
                cursor: "pointer",
                background: open ? "#FAFBFD" : "transparent",
              }}
                onClick={() => setExpandedId(open ? null : p.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span style={{
                    color: "#697182", display: "inline-flex",
                    transform: open ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 140ms",
                    flexShrink: 0,
                  }}>
                    <RailIcon name="chevronDown" size={14} strokeWidth={2.2}/>
                  </span>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{p.name}</div>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", lineHeight: 1.45 }}>{p.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {p.associations.map(a => <ProcChip key={a} id={a}/>)}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={iconBtnStyle} title="Delete"
                    onClick={e => { e.stopPropagation(); remove(p.id); }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#CD1D2B"; e.currentTarget.style.background = "#FFF4F4"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#9099AB"; e.currentTarget.style.background = "transparent"; }}>
                    <RailIcon name="trash" size={14} strokeWidth={1.7}/>
                  </button>
                </div>
              </div>
              {open && (
                <div style={{ padding: "4px 16px 22px 40px", background: "#FAFBFD", borderTop: "1px solid #F0F2F6", display: "flex", flexDirection: "column", gap: 18 }}>
                  <ProcField label="Name" required helper="A unique name for this procedure">
                    <input value={p.name} onChange={e => update(p.id, { name: e.target.value })}
                      style={procInputStyle}/>
                  </ProcField>
                  <ProcField label="When to Use" required helper="Describe when this procedure should be used">
                    <textarea value={p.whenToUse || ""} onChange={e => update(p.id, { whenToUse: e.target.value })} rows={2}
                      style={{ ...procInputStyle, resize: "vertical", lineHeight: 1.5 }}/>
                  </ProcField>
                  <ProcField label="Steps" helper="Define the steps to execute this procedure. You can reference tools that the AI Automation should use with @ mentions.">
                    <RichStepsEditor html={p.stepsHtml || legacyBodyToHtml(p.body)}
                      onChange={v => update(p.id, { stepsHtml: v })}/>
                  </ProcField>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182" }}>
            No procedures match your filter.
          </div>
        )}
      </div>
    </div>
  );
};

const iconBtnStyle = {
  width: 28, height: 28, border: 0, background: "transparent",
  color: "#9099AB", cursor: "pointer", borderRadius: 6,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

Object.assign(window, { ProceduresLibrary });
