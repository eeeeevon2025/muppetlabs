// Step 2 of the goals-first flow.
// "Recommended plan for: <Goal>" — generated plan with matrix, monitors,
// scope & safety, enforcement, blast radius. The admin reviews, tunes, and
// approves before anything goes live.

const ToneChip = ({ tone, text }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: "2px 9px",
    background: tone.bg, color: tone.fg,
    fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
    letterSpacing: "0.04em", textTransform: "uppercase",
    borderRadius: 999, whiteSpace: "nowrap",
  }}>{text}</span>
);

// Plan-level section header.
const PlanSection = ({ letter, title, sub, right, children, accent = "#1F242D" }) => (
  <section style={{
    marginTop: 28,
    background: "#fff",
    border: "1px solid #E8EAF0",
    borderRadius: 14,
    overflow: "hidden",
  }}>
    <header style={{
      padding: "16px 20px 14px",
      borderBottom: "1px solid #E8EAF0",
      display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14,
      background: "#FAFBFD",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
        <span style={{
          width: 26, height: 26, borderRadius: 7,
          background: accent, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
          flexShrink: 0, marginTop: 1,
        }}>{letter}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700,
            color: "#1F242D", letterSpacing: "-0.005em",
          }}>{title}</div>
          {sub && <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182",
            marginTop: 3, lineHeight: 1.5,
          }}>{sub}</div>}
        </div>
      </div>
      {right}
    </header>
    <div style={{ padding: "18px 20px" }}>{children}</div>
  </section>
);

// — Behaviour list cell (Customer AI / Rep AI)
const BehaviourList = ({ items, audience }) => {
  const palette = audience === "air"
    ? { bg: "#F5EBFD", fg: "#7B22A4", check: "#7B22A4" }
    : { bg: "#EBF1FF", fg: "#0165E4", check: "#0165E4" };
  return (
    <ul style={{
      margin: 0, padding: 0, listStyle: "none",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          fontFamily: "var(--font-sans)", fontSize: 13, color: "#3F4654", lineHeight: 1.5,
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
            background: palette.bg, color: palette.check,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

// — Responsibility matrix
const ResponsibilityMatrix = ({ matrix }) => {
  // Column accent palette — keyed by header keyword
  const colAccent = (col) => {
    const c = col.toLowerCase();
    if (c.includes("customer ai")) return { bg: "#EBF1FF", fg: "#0165E4" };
    if (c.includes("rep ai"))      return { bg: "#F5EBFD", fg: "#7B22A4" };
    if (c.includes("qa"))          return { bg: "#DBF5E0", fg: "#016A2A" };
    if (c.includes("supervisor"))  return { bg: "#FFE8E9", fg: "#CD1D2B" };
    if (c.includes("approval"))    return { bg: "#FFF4E6", fg: "#8A5A08" };
    if (c.includes("do not"))      return { bg: "#FFE8E9", fg: "#CD1D2B" };
    return { bg: "#FAFBFD", fg: "#3F4654" };
  };

  return (
    <div style={{ overflow: "auto", border: "1px solid #E8EAF0", borderRadius: 10 }}>
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontFamily: "var(--font-sans)", fontSize: 13,
        minWidth: 480,
      }}>
        <thead>
          <tr>
            <th style={{
              textAlign: "left",
              padding: "10px 14px",
              background: "#FAFBFD",
              borderBottom: "1px solid #E8EAF0",
              fontSize: 11, fontWeight: 700, color: "#5F6675",
              letterSpacing: "0.04em", textTransform: "uppercase",
              width: "30%",
            }}>Scenario</th>
            {matrix.cols.map((c, ci) => {
              const pal = colAccent(c);
              return (
                <th key={ci} style={{
                  padding: "10px 12px",
                  background: "#FAFBFD",
                  borderBottom: "1px solid #E8EAF0",
                  borderLeft: "1px solid #E8EAF0",
                  fontSize: 11, fontWeight: 700, color: pal.fg,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                }}>{c}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#FAFBFD" }}>
              <td style={{
                padding: "11px 14px",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                color: "#1F242D",
                borderBottom: ri === matrix.rows.length - 1 ? 0 : "1px solid #F2F3F7",
              }}>{row.label}</td>
              {row.marks.map((m, mi) => {
                const pal = colAccent(matrix.cols[mi]);
                const isDoNot = matrix.cols[mi].toLowerCase().includes("do not");
                return (
                  <td key={mi} style={{
                    padding: "10px 8px",
                    borderLeft: "1px solid #F2F3F7",
                    borderBottom: ri === matrix.rows.length - 1 ? 0 : "1px solid #F2F3F7",
                    textAlign: "center",
                  }}>
                    {m ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 22, height: 22, borderRadius: 6,
                        background: pal.bg, color: pal.fg,
                      }}>
                        {isDoNot ? (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12"/>
                          </svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5"/>
                          </svg>
                        )}
                      </span>
                    ) : (
                      <span style={{ color: "#DCE0E9" }}>—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// — Monitor row (primary vs guardrail)
const MonitorList = ({ items, kind }) => {
  const palette = kind === "primary"
    ? { bg: "#EAFBED", fg: "#016A2A", border: "#75D58A", label: "PRIMARY" }
    : { bg: "#FFF4E6", fg: "#8A5A08", border: "#FDE2B4", label: "GUARDRAIL" };
  return (
    <div style={{
      background: "#fff", border: `1px solid ${palette.border}`,
      borderRadius: 10, overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 14px",
        background: palette.bg,
        fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
        color: palette.fg, letterSpacing: "0.06em",
        borderBottom: `1px solid ${palette.border}`,
      }}>
        {palette.label} · {items.length} metric{items.length === 1 ? "" : "s"}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 14px",
            borderBottom: i === items.length - 1 ? 0 : "1px solid #F2F3F7",
            gap: 12,
          }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
            }}>{m.label}</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
              color: palette.fg, background: palette.bg,
              padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
            }}>{m.op === "always" ? "always" : m.op === "monitor" ? "monitor" : `${m.op === "gte" ? "≥" : m.op === "lt" ? "<" : m.op === "lte" ? "≤" : m.op === "gt" ? ">" : ""} ${m.value || ""}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// — Enforcement card per surface
const EnforcementCard = ({ row, value, onChange }) => {
  const meta = window.ENFORCEMENT[value] || window.ENFORCEMENT["recommend"];
  return (
    <div style={{
      padding: "12px 14px",
      background: "#fff",
      border: "1px solid #E8EAF0",
      borderRadius: 10,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        marginBottom: 6,
      }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
        }}>{row.surface}</div>
        <span style={{
          padding: "2px 9px",
          background: meta.bg, color: meta.fg,
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
          letterSpacing: "0.04em", textTransform: "uppercase",
          borderRadius: 999, whiteSpace: "nowrap",
        }}>{meta.label}</span>
      </div>
      {row.note && (
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", lineHeight: 1.5,
          marginBottom: 10,
        }}>{row.note}</div>
      )}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, padding: 3,
        background: "#F2F3F7", borderRadius: 8,
      }}>
        {Object.keys(window.ENFORCEMENT).map(level => {
          const on = value === level;
          const m = window.ENFORCEMENT[level];
          return (
            <button key={level} onClick={() => onChange(level)} style={{
              flex: "1 1 auto",
              padding: "5px 8px",
              border: 0,
              background: on ? "#fff" : "transparent",
              color: on ? m.fg : "#697182",
              fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
              borderRadius: 6, cursor: "pointer",
              boxShadow: on ? "0 1px 2px rgba(31,42,46,0.08)" : "none",
              whiteSpace: "nowrap",
            }}>{m.label}</button>
          );
        })}
      </div>
    </div>
  );
};

// — Tune chips (refine controls)
const TUNE_CHIPS = [
  { id: "conservative",   label: "Make this more conservative", icon: "shield" },
  { id: "automated",      label: "Make this more automated",    icon: "bolt" },
  { id: "exclude-refund", label: "Exclude refunds",             icon: "trash" },
  { id: "only-tracking",  label: "Include only order tracking", icon: "package" },
  { id: "approve-policy", label: "Require human approval for policy exceptions", icon: "shield" },
  { id: "reps-only",      label: "Start with AI for Reps only", icon: "sparkles" },
  { id: "customers-only", label: "Start with AI for Customers only", icon: "chat" },
  { id: "preview",        label: "Preview matching conversations", icon: "chat" },
  { id: "quality",        label: "Prioritize quality over speed", icon: "sparkles" },
  { id: "coaching",       label: "Prioritize rep coaching over automation", icon: "bookOpen" },
];

const TuneChips = ({ active, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {TUNE_CHIPS.map(c => {
      const on = active.includes(c.id);
      return (
        <button key={c.id} onClick={() => onToggle(c.id)} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px",
          border: on ? "1px solid #0165E4" : "1px solid #DCE0E9",
          background: on ? "#EBF1FF" : "#fff",
          color: on ? "#0165E4" : "#3F4654",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
          borderRadius: 999, cursor: "pointer",
          transition: "all 120ms",
        }}>
          {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
          {c.label}
        </button>
      );
    })}
  </div>
);

// — Scope & Safety
const ScopeSafety = ({ plan, outcome }) => {
  const ROWS = [
    { label: "Brands & channels",        value: "All brands · Email, Chat, SMS" },
    { label: "Topics included",          value: outcome.id === "increase-upsell" ? "Plans, add-ons, capacity, upgrades" : "Order tracking, returns, FAQs" },
    { label: "Topics excluded",          value: outcome.id === "increase-upsell" ? "Refund disputes, complaints, escalated" : "Refund disputes, identity changes" },
    { label: "Customer segments",        value: "All segments · VIP routed separately" },
    { label: "Confidence threshold",     value: "0.80 (recommended for this goal)" },
    { label: "Human approval required",  value: outcome.family === "revenue" || outcome.family === "risk" ? "Yes — for every revenue offer / regulated topic" : "On policy exceptions only" },
    { label: "Rollout mode",             value: "Draft → Test → Limited rollout → Live" },
  ];
  return (
    <>
      <div style={{
        padding: "10px 14px",
        background: outcome.family === "revenue" || outcome.family === "risk" ? "#FFF4E6" : "#EBF1FF",
        border: `1px solid ${outcome.family === "revenue" || outcome.family === "risk" ? "#FDE2B4" : "#CBDCFF"}`,
        color: outcome.family === "revenue" || outcome.family === "risk" ? "#8A5A08" : "#0E3280",
        fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.5,
        borderRadius: 8, marginBottom: 14,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>
          <RailIcon name="shield" size={14} strokeWidth={2}/>
        </span>
        <span>{plan.safety_note}</span>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 10,
      }}>
        {ROWS.map((r, i) => (
          <div key={i} style={{
            padding: "10px 12px",
            background: "#FAFBFD",
            border: "1px solid #E8EAF0",
            borderRadius: 8,
          }}>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 700,
              color: "#9099AB", letterSpacing: "0.06em", textTransform: "uppercase",
              marginBottom: 4,
            }}>{r.label}</div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#1F242D",
            }}>{r.value}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// — Blast radius / impact preview
const BlastRadius = ({ plan }) => {
  const STATUS = [
    { label: "What changes now",                value: "Nothing — everything below starts as draft",  tone: "neutral" },
    { label: "What remains draft",              value: "All AI behaviors and procedures until you deploy", tone: "info" },
    { label: "What needs testing",              value: "Plan must pass 10+ scenarios before Limited rollout", tone: "warn"  },
    { label: "What requires approval",          value: plan.safety_note.includes("Revenue") ? "Every revenue-driving offer" : "Policy exceptions and escalation overrides", tone: "warn" },
    { label: "What will never auto-change",     value: "Brand settings, billing, agent permissions, integrations", tone: "danger" },
  ];
  const tones = {
    neutral: { fg: "#3F4654", bg: "#FAFBFD", border: "#E8EAF0" },
    info:    { fg: "#0E3280", bg: "#EBF1FF", border: "#CBDCFF" },
    warn:    { fg: "#8A5A08", bg: "#FFF4E6", border: "#FDE2B4" },
    danger:  { fg: "#CD1D2B", bg: "#FFE8E9", border: "#FFD0D2" },
  };
  return (
    <>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
        marginBottom: 10,
      }}>This goal plan will create or update…</div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 8, marginBottom: 18,
      }}>
        {plan.blast_radius.map((b, i) => (
          <div key={i} style={{
            padding: "12px 14px",
            background: "#fff",
            border: "1px solid #E8EAF0",
            borderRadius: 10,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500,
              color: "#1F242D", letterSpacing: "-0.02em", lineHeight: 1,
            }}>{b.count}</span>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#3F4654", lineHeight: 1.4,
            }}>{b.kind}</span>
          </div>
        ))}
      </div>

      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 700, color: "#9099AB",
        letterSpacing: "0.06em", textTransform: "uppercase",
        marginBottom: 8,
      }}>Status &amp; gates</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {STATUS.map((s, i) => {
          const t = tones[s.tone];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "9px 12px",
              border: `1px solid ${t.border}`, background: t.bg,
              borderRadius: 8,
            }}>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                color: t.fg, letterSpacing: "0.02em", textTransform: "uppercase",
                minWidth: 168, flexShrink: 0,
              }}>{s.label}</span>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#1F242D",
              }}>{s.value}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// — Main page
const GoalPlan = ({ outcomeId, onChangeOutcome, onTest, onDeploy }) => {
  const outcome = window.getOutcome(outcomeId);
  const plan = window.getPlan(outcomeId);
  const [tune, setTune] = React.useState([]);
  const [enforcement, setEnforcement] = React.useState(() => {
    const map = {};
    plan.enforcement.forEach(e => {
      map[e.surface] = e.level;
    });
    return map;
  });

  const toggleTune = (id) =>
    setTune(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  const setLevel = (surface, level) =>
    setEnforcement(m => ({ ...m, [surface]: level }));

  if (!outcome) {
    return (
      <div style={{ padding: 40, color: "#697182" }}>
        Pick an outcome first.
      </div>
    );
  }

  const tone = window.FAMILY_TONE[outcome.family] || { bg: "#F2F3F7", fg: "#5F6675" };

  return (
    <div data-screen-label={`02 Goal Plan · ${outcome.title}`}
      style={{ flex: 1, overflow: "auto", padding: "32px 40px 120px", minWidth: 520 }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        {/* Breadcrumb back */}
        <button onClick={onChangeOutcome} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px 5px 8px",
          border: 0, background: "transparent",
          color: "#5F6675",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
          borderRadius: 6, cursor: "pointer", marginBottom: 14, marginLeft: -8,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F2F3F7"; e.currentTarget.style.color = "#1F242D"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5F6675"; }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Choose a different outcome
        </button>

        {/* Plan header */}
        <div style={{
          background: "#fff",
          border: "1px solid #E8EAF0",
          borderRadius: 14,
          padding: "22px 24px",
          boxShadow: "0 1px 2px rgba(31,42,46,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <ToneChip tone={tone} text={window.FAMILY_LABEL[outcome.family]}/>
            <ToneChip tone={{ bg: "#F5EBFD", fg: "#5E1D7D" }} text="Recommended plan"/>
            <ToneChip tone={{ bg: "#FAFBFD", fg: "#5F6675" }} text="Draft · not deployed"/>
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: 28, lineHeight: 1.2, letterSpacing: "-0.01em",
            color: "#1F242D", maxWidth: 720,
          }}>Recommended plan for: {outcome.title}</h1>
          <p style={{
            margin: "12px 0 0 0",
            fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.55,
            color: "#3F4654", maxWidth: 720,
          }}>{plan.summary}</p>

          {/* Targets row */}
          <div style={{
            marginTop: 18,
            display: "flex", flexWrap: "wrap", gap: 8,
          }}>
            {outcome.targets.map((t, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 10px 6px 12px",
                background: outcome.accent + "10",
                border: `1px solid ${outcome.accent}30`,
                borderRadius: 999,
              }}>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 12, color: "#1F242D",
                }}>{t.label}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                  color: outcome.accent,
                  padding: "1px 6px",
                  background: "#fff", borderRadius: 4,
                }}>{t.op}</span>
              </div>
            ))}
          </div>

          {/* Tune chips */}
          <div style={{
            marginTop: 20, paddingTop: 18,
            borderTop: "1px solid #F2F3F7",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10,
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 700,
                color: "#9099AB", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>Tune the plan</div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
              }}>{tune.length} adjustment{tune.length === 1 ? "" : "s"}</div>
            </div>
            <TuneChips active={tune} onToggle={toggleTune}/>
          </div>
        </div>

        {/* A. Responsibility matrix */}
        <PlanSection
          letter="A"
          title="Who handles what"
          sub="The same business goal can affect both customer-facing AI and rep-facing AI. This is what each surface owns."
          accent="#1F242D"
        >
          <ResponsibilityMatrix matrix={plan.matrix}/>
        </PlanSection>

        {/* B + C. Customer AI behavior & Rep AI behavior — side by side */}
        <PlanSection
          letter="B"
          title="AI behavior"
          sub="What the customer-facing chatbot handles directly, and what the rep assistant helps human agents do."
          accent="#1F242D"
        >
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}>
            <div style={{
              padding: "14px 16px",
              background: "#F6FAFF", border: "1px solid #CBDCFF",
              borderRadius: 10,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: "#0165E4", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}><RailIcon name="chat" size={12} strokeWidth={2}/></span>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#0E3280",
                }}>Customer AI</div>
              </div>
              <BehaviourList items={plan.customer_ai} audience="aic"/>
            </div>
            <div style={{
              padding: "14px 16px",
              background: "#FBF7FE", border: "1px solid #EBD2FF",
              borderRadius: 10,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: "#7B22A4", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}><RailIcon name="sparkles" size={12} strokeWidth={2}/></span>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#5E1D7D",
                }}>Rep AI</div>
              </div>
              <BehaviourList items={plan.rep_ai} audience="air"/>
            </div>
          </div>
        </PlanSection>

        {/* C. Procedures and guardrails */}
        <PlanSection
          letter="C"
          title="Procedures &amp; guardrails"
          sub="The procedures, policies, and restrictions that support this goal. Each becomes a reviewable Procedure object."
        >
          <ul style={{
            margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {plan.procedures.map((p, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px",
                background: "#FAFBFD",
                border: "1px solid #E8EAF0",
                borderRadius: 8,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: "#fff", border: "1px solid #DCE0E9",
                  color: "#5F6675",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
                }}>{i + 1}</span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D", flex: 1,
                }}>{p}</span>
                <span style={{
                  padding: "1px 8px",
                  background: "#F5EBFD", color: "#5E1D7D",
                  fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.04em", borderRadius: 999,
                }}>DRAFT</span>
              </li>
            ))}
          </ul>
        </PlanSection>

        {/* D. Monitors and evals */}
        <PlanSection
          letter="D"
          title="Monitors &amp; evals"
          sub="How we know the goal is working without creating new risk. Primary metrics track success; guardrails catch unintended damage."
        >
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}>
            <MonitorList items={plan.monitors.primary} kind="primary"/>
            <MonitorList items={plan.monitors.guardrail} kind="guardrail"/>
          </div>
        </PlanSection>

        {/* E. Alerts & reporting */}
        <PlanSection
          letter="E"
          title="Alerts &amp; reporting"
          sub="What admins will see after launch. Anything here can be muted or routed to a team."
        >
          <ul style={{
            margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {plan.alerts.map((a, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px",
                background: "#fff",
                border: "1px solid #E8EAF0",
                borderRadius: 8,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: "#FFF4E6", color: "#8A5A08",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <RailIcon name="bell" size={12} strokeWidth={1.9}/>
                </span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
                }}>{a}</span>
              </li>
            ))}
          </ul>
        </PlanSection>

        {/* F. Enforcement */}
        <PlanSection
          letter="F"
          title="Enforcement level per surface"
          sub="Business goals should not change AI behavior automatically without admin approval — especially for revenue, compliance, or customer trust."
        >
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 10,
          }}>
            {plan.enforcement.map((row, i) => (
              <EnforcementCard
                key={i}
                row={row}
                value={enforcement[row.surface] || row.level}
                onChange={(v) => setLevel(row.surface, v)}
              />
            ))}
          </div>
        </PlanSection>

        {/* G. Scope & safety */}
        <PlanSection
          letter="G"
          title="Scope &amp; safety"
          sub="Where this goal applies, what it explicitly avoids, and what stays in human hands."
        >
          <ScopeSafety plan={plan} outcome={outcome}/>
        </PlanSection>

        {/* H. Blast radius */}
        <PlanSection
          letter="H"
          title="Impact preview"
          sub="What gets created, what changes, what stays under your control before this goes anywhere near a live customer."
        >
          <BlastRadius plan={plan}/>
        </PlanSection>

        {/* Sticky bottom CTAs */}
        <div style={{
          marginTop: 32,
          padding: "16px 20px",
          background: "#fff",
          border: "1px solid #E8EAF0",
          borderRadius: 14,
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
          gap: 14,
        }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F4CC10" }}/>
            Plan is in draft. Test before deploying anywhere live.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button style={ghostCtaBtn}>Save as draft</button>
            <button style={ghostCtaBtn}>Start with rep coaching</button>
            <button style={ghostCtaBtn}>Start with customer automation</button>
            <button onClick={onTest} style={primaryCtaBtn}>
              <SparkleGlyph/>
              Test this goal plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const primaryCtaBtn = {
  padding: "10px 18px",
  border: 0,
  background: "#0165E4",
  color: "#fff",
  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
  borderRadius: 8, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
  boxShadow: "0 1px 2px rgba(1,101,228,0.25)",
};
const ghostCtaBtn = {
  padding: "10px 14px",
  border: "1px solid #DCE0E9", background: "#fff",
  color: "#3F4654",
  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
  borderRadius: 8, cursor: "pointer",
};

Object.assign(window, { GoalPlan });
