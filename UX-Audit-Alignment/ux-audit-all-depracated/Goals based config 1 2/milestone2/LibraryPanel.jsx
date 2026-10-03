// Library page — combined Procedures + Response Tones (shared across AI for Customers and Reps).

const LibraryPanel = () => {
  const [tab, setTab] = React.useState("procedures");
  const [query, setQuery] = React.useState("");

  const items = tab === "procedures" ? LIBRARY.procedures : LIBRARY.tones;
  const filtered = items.filter(it =>
    !query || it.name.toLowerCase().includes(query.toLowerCase()) || it.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1080 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <SectionTitle helpIcon>Procedures</SectionTitle>
        <button style={{
          padding: "8px 14px",
          background: "#0165E4", color: "#fff",
          border: 0,
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <RailIcon name="plus" size={14} strokeWidth={2.2}/>
          New {tab === "procedures" ? "Procedure" : "Tone"}
        </button>
      </div>
      <Description style={{ marginBottom: 22 }}>
        Reusable building blocks shared across AI for Customers and AI for Reps. Edit once, applied everywhere they're used.
      </Description>

      {/* Tabs row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #E8EAF0",
        marginBottom: 18,
      }}>
        <div style={{ display: "flex", gap: 22 }}>
          {[
            { id: "procedures", label: "Procedures", count: LIBRARY.procedures.length },
            { id: "tones",      label: "Response Tones", count: LIBRARY.tones.length },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: "10px 0",
                  border: 0, borderBottom: active ? "2px solid #0165E4" : "2px solid transparent",
                  background: "transparent",
                  color: active ? "#0165E4" : "#5F6675",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14, fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}
              >
                {t.label}
                <span style={{
                  padding: "1px 7px", borderRadius: 999,
                  background: active ? "#EBF1FF" : "#F2F3F7",
                  color: active ? "#0165E4" : "#5F6675",
                  fontSize: 11, fontWeight: 600,
                }}>{t.count}</span>
              </button>
            );
          })}
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{
            position: "absolute", left: 10, color: "#9099AB",
            display: "inline-flex", pointerEvents: "none",
          }}><RailIcon name="search" size={13} strokeWidth={2}/></span>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            style={{
              padding: "7px 10px 7px 30px",
              border: "1px solid #DCE0E9",
              fontFamily: "var(--font-sans)", fontSize: 13,
              borderRadius: 6, outline: "none",
              width: 220,
              marginBottom: 8,
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(it => <LibraryRow key={it.id} item={it} kind={tab}/>)}
        {filtered.length === 0 && (
          <div style={{
            padding: 40, textAlign: "center",
            border: "1px dashed #DCE0E9", borderRadius: 8,
            color: "#9099AB", fontFamily: "var(--font-sans)", fontSize: 13,
          }}>No matches.</div>
        )}
      </div>
    </div>
  );
};

const LibraryRow = ({ item, kind }) => (
  <div style={{
    border: "1px solid #E8EAF0",
    borderRadius: 8,
    padding: "16px 20px",
    background: "#fff",
    display: "grid", gridTemplateColumns: "1fr auto",
    gap: 16, alignItems: "start",
    transition: "border-color 140ms",
    cursor: "pointer",
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = "#BBD1FF"}
  onMouseLeave={e => e.currentTarget.style.borderColor = "#E8EAF0"}
  >
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <h4 style={{
          margin: 0, fontFamily: "var(--font-sans)",
          fontSize: 14, fontWeight: 700, color: "#1F242D",
        }}>{item.name}</h4>
        {item.usedIn.length === 0 && (
          <span style={{
            padding: "2px 8px", borderRadius: 999,
            background: "#FFF2D6", color: "#946400",
            fontSize: 11, fontWeight: 600,
          }}>Unused</span>
        )}
      </div>
      <p style={{
        margin: 0, fontFamily: "var(--font-sans)",
        fontSize: 13, lineHeight: 1.5, color: "#5F6675",
        marginBottom: 10,
      }}>{item.desc}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 11, color: "#9099AB",
          textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600,
          marginRight: 4,
        }}>Used in</span>
        {item.usedIn.length === 0 ? (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB" }}>—</span>
        ) : item.usedIn.map(loc => (
          <span key={loc} style={{
            padding: "2px 8px", borderRadius: 4,
            background: loc.startsWith("Reps") ? "#F0E8FF" : "#EBF1FF",
            color: loc.startsWith("Reps") ? "#5B2BB8" : "#0165E4",
            fontFamily: "var(--font-sans)",
            fontSize: 12, fontWeight: 600,
          }}>{loc}</span>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB" }}>Updated {item.updated}</span>
      <button style={{
        width: 28, height: 28, border: 0, background: "transparent",
        color: "#9099AB", borderRadius: 4, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
      </button>
    </div>
  </div>
);

Object.assign(window, { LibraryPanel });
