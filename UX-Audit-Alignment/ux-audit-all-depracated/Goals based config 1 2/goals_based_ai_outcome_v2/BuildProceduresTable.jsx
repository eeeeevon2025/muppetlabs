// Build-stage procedures table — reuses the shared Procedures Library look:
// header + search + audience filter + 3-column table with expand-to-edit rows.

const BuildProceduresTable = ({ items, onUpdate, onRemove, onAdd, expandedId, onToggle }) => {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  const matchesFilter = (p) => {
    if (filter === "all") return true;
    const audOpt = window.GOAL_OPTIONS && window.GOAL_OPTIONS.find(g => g.id === p.goal);
    const aud = p.audience
      ? (Array.isArray(p.audience) ? p.audience : [p.audience])
      : audOpt
        ? (Array.isArray(audOpt.audience) ? audOpt.audience : [audOpt.audience])
        : [];
    return aud.includes(filter);
  };

  const filtered = items
    .filter(matchesFilter)
    .filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: 22, lineHeight: 1.2, color: "#1F242D",
            letterSpacing: "-0.005em",
          }}>
            Procedures
            <span title="A shared library of step-by-step playbooks." style={{
              color: "#9099AB", display: "inline-flex",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </span>
          </div>
          <div style={{
            marginTop: 6,
            fontFamily: "var(--font-sans)", fontSize: 13.5, color: "#5F6675", lineHeight: 1.55,
            maxWidth: 720,
          }}>
            Based on your goals, top topics and monitors, I'm creating the below procedures to cover the top scenarios.
          </div>
        </div>
        <button onClick={onAdd} style={{
          padding: "9px 16px", border: 0,
          background: "#0165E4", color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
          flexShrink: 0,
          boxShadow: "0 1px 2px rgba(1,101,228,0.25)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Procedure
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9099AB", display: "inline-flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-3.5-3.5"/>
            </svg>
          </span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search procedures…"
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

      {/* Table */}
      <div style={{
        marginTop: 16,
        border: "1px solid #E8EAF0", borderRadius: 8,
        background: "#fff", overflow: "hidden",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "minmax(200px, 1fr) minmax(220px, 1.4fr) minmax(170px, 1fr) minmax(150px, 0.9fr) 48px",
          gap: 20, padding: "10px 16px",
          background: "#FAFBFD", borderBottom: "1px solid #E8EAF0",
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          <div>Procedure</div>
          <div>Description</div>
          <div>Topics Covered</div>
          <div>Used By</div>
          <div></div>
        </div>
        {filtered.map((p, i) => (
          <BuildProcedureRow
            key={p.id}
            procedure={p}
            isFirst={i === 0}
            isOpen={expandedId === p.id}
            onToggle={() => onToggle(p.id)}
            onUpdate={(patch) => onUpdate(p.id, patch)}
            onRemove={() => onRemove(p.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182" }}>
            No procedures match your filter.
          </div>
        )}
      </div>
    </div>
  );
};

const BuildProcedureRow = ({ procedure, isFirst, isOpen, onToggle, onUpdate, onRemove }) => {
  // Prefer explicit per-procedure audience, fall back to the audience of the linked goal.
  const goalOption = (window.GOAL_OPTIONS || []).find(g => g.id === procedure.goal);
  const audiences = procedure.audience
    ? (Array.isArray(procedure.audience) ? procedure.audience : [procedure.audience])
    : goalOption
      ? (Array.isArray(goalOption.audience) ? goalOption.audience : [goalOption.audience])
      : [];
  const AudienceTag = window.AudienceTag;
  const ProcField = window.ProcField;
  const RichStepsEditor = window.RichStepsEditor;
  const procInputStyle = window.procInputStyle;

  return (
    <div style={{ borderTop: isFirst ? 0 : "1px solid #F0F2F6" }}>
      <div
        onClick={onToggle}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 1fr) minmax(220px, 1.4fr) minmax(170px, 1fr) minmax(150px, 0.9fr) 48px",
          gap: 20,
          padding: "14px 16px",
          alignItems: "center",
          cursor: "pointer",
          background: isOpen ? "#FAFBFD" : "transparent",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{
            color: "#697182", display: "inline-flex",
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 140ms",
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>{procedure.name}</div>
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.5 }}>
          {procedure.description || "—"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {(() => {
            const TOPIC_OPTIONS = window.TOPIC_OPTIONS || [];
            const procTopics = Array.isArray(procedure.topics)
              ? procedure.topics
              : (procedure.topic ? [procedure.topic] : []);
            if (procTopics.length === 0) {
              return <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB" }}>—</span>;
            }
            return procTopics.map(t => {
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {AudienceTag && audiences.map(a => <AudienceTag key={a} audience={a}/>)}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            title="Remove"
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: 0, background: "transparent", color: "#9099AB",
              cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#CD1D2B"; e.currentTarget.style.background = "#FFF4F4"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#9099AB"; e.currentTarget.style.background = "transparent"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && ProcField && RichStepsEditor && (
        <div style={{
          padding: "4px 18px 22px 40px",
          background: "#FAFBFD",
          borderTop: "1px solid #F0F2F6",
          display: "flex", flexDirection: "column", gap: 18,
        }}>
          <ProcField label="Name" required helper="A unique name for this procedure">
            <input
              value={procedure.name}
              onChange={e => onUpdate({ name: e.target.value })}
              style={procInputStyle}/>
          </ProcField>
          <ProcField label="Description" helper="A one-line summary used in the procedure list.">
            <input
              value={procedure.description || ""}
              onChange={e => onUpdate({ description: e.target.value })}
              style={procInputStyle}/>
          </ProcField>
          <ProcField label="When to Use" required helper="Describe when this procedure should be used">
            <textarea
              value={procedure.whenToUse || ""}
              onChange={e => onUpdate({ whenToUse: e.target.value })}
              rows={2}
              style={{ ...procInputStyle, resize: "vertical", lineHeight: 1.5 }}/>
          </ProcField>
          <ProcField label="Steps" helper="Define the steps to execute this procedure. You can reference tools that the AI Automation should use with @ mentions.">
            <RichStepsEditor
              html={procedure.stepsHtml || ""}
              onChange={v => onUpdate({ stepsHtml: v })}/>
          </ProcField>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { BuildProceduresTable, BuildProcedureRow });
