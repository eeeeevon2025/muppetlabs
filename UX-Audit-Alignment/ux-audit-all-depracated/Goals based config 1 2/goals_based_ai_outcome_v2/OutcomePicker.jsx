// Step 1 of the goals-first flow.
// A focused page that asks one question: "What outcome do you want
// Kustomer AI to improve first?" — and surfaces 9 outcome cards grouped
// by family. Selecting a card calls `onSelect(outcomeId)`.

const SurfaceChip = ({ kind }) => {
  const palette = {
    aic:        { bg: "#EBF1FF", fg: "#0E3280" },
    air:        { bg: "#F5EBFD", fg: "#7B22A4" },
    monitors:   { bg: "#FAFBFD", fg: "#3F4654" },
    procedures: { bg: "#FAFBFD", fg: "#3F4654" },
    alerts:     { bg: "#FAFBFD", fg: "#3F4654" },
    approval:   { bg: "#FFF4E6", fg: "#8A5A08" },
    qa:         { bg: "#DBF5E0", fg: "#016A2A" },
    supervisor: { bg: "#FFE8E9", fg: "#CD1D2B" },
  };
  const p = palette[kind] || palette.monitors;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px",
      background: p.bg, color: p.fg,
      border: `1px solid ${p.bg === "#FAFBFD" ? "#E8EAF0" : "transparent"}`,
      fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
      letterSpacing: "0.02em",
      borderRadius: 999,
      whiteSpace: "nowrap",
    }}>{window.SURFACE_LABEL[kind] || kind}</span>
  );
};

const OutcomeCard = ({ outcome, onSelect }) => {
  const tone = window.FAMILY_TONE[outcome.family] || { bg: "#F2F3F7", fg: "#5F6675" };
  return (
    <button
      onClick={() => onSelect(outcome.id)}
      style={{
        textAlign: "left",
        padding: "20px 20px 18px",
        border: "1px solid #E8EAF0",
        background: "#fff",
        borderRadius: 14,
        cursor: "pointer",
        display: "flex", flexDirection: "column", gap: 14,
        transition: "all 160ms var(--ease-standard)",
        boxShadow: "0 1px 2px rgba(31,42,46,0.03)",
        height: "100%", minHeight: 280,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = outcome.accent;
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,42,46,0.06)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#E8EAF0";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(31,42,46,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Family chip + icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          padding: "3px 9px",
          background: tone.bg, color: tone.fg,
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: "0.04em", textTransform: "uppercase",
          borderRadius: 999,
        }}>{window.FAMILY_LABEL[outcome.family]}</span>
        <span style={{
          width: 34, height: 34, borderRadius: 10,
          background: outcome.accent + "12",
          color: outcome.accent,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <RailIcon name={outcome.icon} size={17} strokeWidth={1.8}/>
        </span>
      </div>

      {/* Title + one-liner */}
      <div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700,
          color: "#1F242D", letterSpacing: "-0.005em", marginBottom: 6,
          lineHeight: 1.3,
        }}>{outcome.title}</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182",
          lineHeight: 1.5,
        }}>{outcome.one_liner}</div>
      </div>

      {/* Affects surfaces */}
      <div style={{ marginTop: "auto" }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          color: "#9099AB", letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 6,
        }}>Affects</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {outcome.surfaces.map(s => <SurfaceChip key={s} kind={s}/>)}
        </div>
      </div>

      {/* Targets */}
      <div style={{
        paddingTop: 12, borderTop: "1px dashed #E8EAF0",
        display: "flex", flexDirection: "column", gap: 5,
      }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          color: "#9099AB", letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 2,
        }}>Suggested targets</div>
        {outcome.targets.map((t, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
            fontFamily: "var(--font-sans)", fontSize: 12,
          }}>
            <span style={{ color: "#3F4654" }}>{t.label}</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
              color: outcome.accent,
              background: outcome.accent + "10",
              padding: "1px 7px", borderRadius: 4, whiteSpace: "nowrap",
            }}>{t.op}</span>
          </div>
        ))}
      </div>

      {/* Select hint */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
        color: outcome.accent,
      }}>
        Choose this outcome
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  );
};

const OutcomePicker = ({ onSelect }) => {
  // Group by family for visual rhythm
  const families = ["efficiency", "cx", "revenue", "agent", "risk"];
  const grouped = families.map(f => ({
    family: f,
    label: window.FAMILY_LABEL[f],
    items: window.OUTCOMES.filter(o => o.family === f),
  })).filter(g => g.items.length);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "40px 48px 80px", minWidth: 520 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 12px 5px 8px",
          background: "#F5EBFD", border: "1px solid #EBD2FF",
          borderRadius: 999, marginBottom: 16,
        }}>
          <SparkleGlyph/>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "#5E1D7D" }}>
            Goals-based AI · Step 1 of 4
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: 36, lineHeight: 1.15, letterSpacing: "-0.015em",
          color: "#1F242D",
          marginBottom: 14, maxWidth: 720,
        }}>What outcome do you want Kustomer AI to improve first?</h1>

        <p style={{
          margin: 0, marginBottom: 24,
          fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.55,
          color: "#5F6675", maxWidth: 680,
        }}>
          Pick a business outcome — we'll recommend the AI behaviors, rep guidance,
          procedures, monitors, alerts, and reporting needed to support it. You
          review, tune, and approve before anything goes live.
        </p>

        {/* Before / after mental model */}
        <BeforeAfter/>

        {/* Family groups */}
        {grouped.map(group => (
          <div key={group.family} style={{ marginTop: 36 }}>
            <div style={{
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              marginBottom: 14,
            }}>
              <h2 style={{
                margin: 0,
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                color: "#5F6675", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>{group.label}</h2>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: 12, color: "#9099AB",
              }}>{group.items.length} outcome{group.items.length === 1 ? "" : "s"}</span>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
            }}>
              {group.items.map(o => (
                <OutcomeCard key={o.id} outcome={o} onSelect={onSelect}/>
              ))}
            </div>
          </div>
        ))}

        {/* Footnote */}
        <div style={{
          marginTop: 40,
          padding: "16px 20px",
          background: "#FAFBFD", border: "1px solid #E8EAF0",
          borderRadius: 12,
          display: "flex", gap: 14, alignItems: "flex-start",
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: "#fff", border: "1px solid #E8EAF0",
            color: "#0165E4",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <RailIcon name="shield" size={14} strokeWidth={1.9}/>
          </span>
          <div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
              color: "#1F242D", marginBottom: 3,
            }}>Nothing goes live without your approval</div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.5,
            }}>
              Selecting a goal drafts a plan. You review it, tune the enforcement
              level, see what will change, and decide what to deploy. Revenue and
              compliance plans always require human approval by default.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BeforeAfter = () => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 12, marginTop: 28, marginBottom: 8,
  }}>
    <div style={{
      padding: "14px 16px",
      background: "#FAFBFD", border: "1px solid #E8EAF0",
      borderRadius: 12, position: "relative",
    }}>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
        color: "#9099AB", letterSpacing: "0.06em", textTransform: "uppercase",
        marginBottom: 4,
      }}>Before</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#5F6675", lineHeight: 1.5 }}>
        Configure procedures, monitors, reports, alerts, and AI settings manually,
        one object at a time.
      </div>
    </div>
    <div style={{
      padding: "14px 16px",
      background: "#FFFDE5",
      border: "1px solid #FBE775",
      borderRadius: 12, position: "relative",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
        color: "#826F1C", letterSpacing: "0.06em", textTransform: "uppercase",
        marginBottom: 4,
      }}>
        <SparkleGlyph/> Now
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#403A1B", lineHeight: 1.5 }}>
        Choose a business outcome. Kustomer recommends the connected AI behaviors,
        rep guidance, monitors, alerts, and reporting needed to support it.
      </div>
    </div>
  </div>
);

Object.assign(window, { OutcomePicker });
