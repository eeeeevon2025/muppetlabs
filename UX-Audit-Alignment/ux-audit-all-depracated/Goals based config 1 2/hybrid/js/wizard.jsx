// =============================================================
// Get Started — 5-step wizard (lifted conceptually from Prototype A)
// Steps: Goal → Plan → Test → Deploy → Analyze
// Exits to the new goal's slide-out
// =============================================================

const WIZARD_GOALS = [
  { id: "deflect",  icon: "shield",   title: "Reduce escalations",          desc: "Resolve repetitive issues safely before they reach a human." },
  { id: "csat",     icon: "checkCircle", title: "Improve CSAT",              desc: "Lift CSAT by reducing repeat contacts and slow first responses." },
  { id: "speed",    icon: "bolt",     title: "Speed up rep responses",      desc: "Draft replies, summaries, and signals to help reps move faster." },
  { id: "tracking", icon: "package",  title: "Status & order tracking",     desc: "Look up orders, shipments, returns end-to-end." },
  { id: "upsell",   icon: "dollar",   title: "Increase upsell revenue",     desc: "Surface qualified upsell moments to reps in-conversation." },
  { id: "policy",   icon: "lock",     title: "Reduce policy violations",    desc: "Prevent AI from making out-of-policy commitments." },
];

const INDUSTRIES = ["Retail & E-commerce","SaaS","Travel & Hospitality","Financial Services","Telecommunications","Healthcare","Logistics & Shipping","Other"];
const TONES = ["Friendly","Professional","Casual","Matter of Fact","Custom"];

// ── Page-style header band, matches Goals Home / Performance / etc. ──
const WizardHeader = ({ eyebrow, title, sub, action, gradient }) => (
  <div style={{
    padding: "26px 40px 18px",
    background: gradient ? "linear-gradient(180deg, #FFFCE8 0%, #FFFFFF 100%)" : "transparent",
  }}>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 style={{
          fontFamily: "var(--font-sans)", fontWeight: 700,
          fontSize: "var(--text-h1)", lineHeight: "var(--leading-h1)",
          letterSpacing: "-0.01em", color: T.ink, margin: eyebrow ? "6px 0 0" : 0,
        }}>{title}</h1>
        {sub && (
          <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "6px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>{sub}</p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  </div>
);

// ── Step header bar ─────────────────────────────────────────
const StepHeader = ({ step, furthest, onStep, onCancel }) => {
  const steps = [
    { id: "goal",    label: "1. Goal" },
    { id: "plan",    label: "2. Plan" },
    { id: "test",    label: "3. Test" },
    { id: "deploy",  label: "4. Deploy" },
    { id: "analyze", label: "5. Analyze" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 28px", borderBottom: `1px solid ${T.rule}`,
      background: "#fff", position: "sticky", top: 0, zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "linear-gradient(135deg, #FFFCE8, #FFF6B8)",
          border: "1px solid #F4CC10",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="wand" size={14} strokeWidth={2}/>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>Get Started</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {steps.map((s, i) => {
          const reached = steps.findIndex(x => x.id === furthest) >= i;
          const active = step === s.id;
          return (
            <React.Fragment key={s.id}>
              <button
                disabled={!reached}
                onClick={() => onStep(s.id)}
                style={{
                  padding: "5px 11px", borderRadius: 999, border: 0,
                  cursor: reached ? "pointer" : "default",
                  background: active ? T.ink : reached ? "rgba(31,42,46,0.06)" : "transparent",
                  color: active ? "#fff" : reached ? T.ink : T.ink4,
                  fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)",
                }}
              >{s.label}</button>
              {i < steps.length - 1 && (
                <div style={{ width: 16, height: 1, background: T.rule }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <button onClick={onCancel} style={{
        padding: "6px 12px", border: `1px solid ${T.rule}`,
        background: "#fff", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
        color: T.ink2, cursor: "pointer", fontFamily: "var(--font-sans)",
      }}>Cancel</button>
    </div>
  );
};

// ── Step 1: Goal — pick + intake ────────────────────────────
const StepGoal = ({ state, setState, onNext }) => {
  const update = patch => setState({ ...state, ...patch });
  const toggleGoal = id => {
    const goals = state.goals.includes(id) ? state.goals.filter(g => g !== id) : [...state.goals, id];
    update({ goals });
  };
  const Section = ({ num, title, sub, children }) => (
    <section style={{ borderTop: `1px solid ${T.rule}`, padding: "28px 0" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 999, background: T.ink,
          color: "#fff", fontSize: 12, fontWeight: 700,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>{num}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: "-0.005em" }}>{title}</h3>
          {sub && <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </section>
  );

  const canContinue = state.companyName;

  return (
    <>
      <div style={{ padding: "32px 40px 100px" }}>
      
      <Section num="1" title="About your company" sub="Pulled from your account profile. Edit anything that's off.">
        <div style={{
          background: T.bgSoft, border: `1px solid ${T.rule}`, borderRadius: 12, padding: "16px 18px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
        }}>
          <div>
            <Label>Company name</Label>
            <Input value={state.companyName} onChange={v => update({ companyName: v })} placeholder="Acme Inc"/>
          </div>
          <div>
            <Label>Industry</Label>
            <Select value={state.industry} onChange={v => update({ industry: v })} options={INDUSTRIES}/>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Label>Description</Label>
            <textarea
              value={state.companyDescription}
              onChange={e => update({ companyDescription: e.target.value })}
              placeholder="A short description of what your company does. Helps the AI choose the right tone, examples, and edge cases."
              rows={3}
              style={{
                width: "100%", padding: "10px 12px",
                border: `1px solid ${T.rule}`, borderRadius: 8,
                fontSize: "var(--text-body)", fontFamily: "var(--font-sans)",
                lineHeight: "var(--leading-body)", color: T.ink,
                background: "#fff", outline: "none", resize: "vertical",
                minHeight: 76,
              }}
            />
          </div>
        </div>
      </Section>

<Section num="2" title="Where should your AI show up?" sub="Pick one or both surfaces.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "cai", title: "AI for Customers", desc: "Autonomous AI handling inbound chats end-to-end.", tone: "peri" },
            { id: "rai", title: "AI for Reps",       desc: "Copilot drafts, summaries, signals.",             tone: "yellow" },
          ].map(o => {
            const on = state.audience.includes(o.id);
            return (
              <button key={o.id}
                onClick={() => update({ audience: on ? state.audience.filter(a => a !== o.id) : [...state.audience, o.id] })}
                style={{
                  textAlign: "left", padding: "14px 16px",
                  border: `1px solid ${on ? T.ink : T.rule}`,
                  background: on ? "rgba(31,42,46,0.03)" : "#fff",
                  borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-sans)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `1px solid ${on ? T.ink : T.rule}`,
                    background: on ? T.ink : "#fff",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {on && <Icon name="check" size={12} strokeWidth={3} style={{ color: "#fff" }}/>}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{o.title}</span>
                </div>
                <div style={{ fontSize: 12.5, color: T.ink3, marginTop: 6, lineHeight: 1.45 }}>{o.desc}</div>
              </button>
            );
          })}
        </div>
      </Section>


      <Section num="3" title="Scenarios you want to automate" sub="Upload examples of the workflows you want AI to handle, call recordings, screenshots of past conversations, SOPs, decision trees, anything. We'll turn each into a draft Procedure you can review.">
        <ScenarioUploader items={state.scenarios} onAdd={s => update({ scenarios: [...state.scenarios, s] })} onRemove={i => update({ scenarios: state.scenarios.filter((_, j) => j !== i) })}/>
      </Section>

      <Section num="4" title="Where does your AI learn from?" sub="Point us at the content you already have. We'll ingest and index it.">
        <Field label="Help center URL">
          <Input value={state.kbUrl} onChange={v => update({ kbUrl: v })} placeholder="https://help.acme.com"/>
          <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 4 }}>We'll crawl your public help articles.</div>
        </Field>
        <div style={{ marginTop: 14 }}>
          <Label>Upload additional sources</Label>
          <KnowledgeUploader items={state.knowledge} onAdd={s => update({ knowledge: [...state.knowledge, s] })} onRemove={i => update({ knowledge: state.knowledge.filter((_, j) => j !== i) })}/>
        </div>
      </Section>

      <Section num="5" title="How should your AI sound?">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TONES.map(t => {
            const on = state.tone === t;
            return (
              <button key={t}
                onClick={() => update({ tone: t })}
                style={{
                  padding: "8px 14px",
                  border: `1px solid ${on ? T.ink : T.rule}`,
                  background: on ? T.ink : "#fff",
                  color: on ? "#fff" : T.ink,
                  borderRadius: 999, cursor: "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)",
                }}>{t}</button>
            );
          })}
        </div>
      </Section>

      <div style={{
        display: "flex", justifyContent: "flex-end", gap: 10,
        marginTop: 32, paddingTop: 8,
      }}>
        <button onClick={onNext} disabled={!canContinue}
          style={{
            padding: "10px 18px", borderRadius: 999,
            background: canContinue ? T.ink : "rgba(31,42,46,0.12)",
            color: canContinue ? "#fff" : T.ink4,
            border: 0, cursor: canContinue ? "pointer" : "not-allowed",
            fontSize: 13.5, fontWeight: 700, fontFamily: "var(--font-sans)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
          <Icon name="sparkles" size={13} strokeWidth={2}/>
          Set up goals
        </button>
      </div>
    </div>
    </>
  );
};

// ── Simple form bits ────────────────────────────────────────
const Label = ({ children }) => (
  <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{children}</div>
);
const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{
      width: "100%", padding: "9px 12px",
      border: `1px solid ${T.rule}`, borderRadius: 8,
      fontSize: 13.5, fontFamily: "var(--font-sans)", color: T.ink,
      background: "#fff", outline: "none",
    }}/>
);
const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{
      width: "100%", padding: "9px 12px",
      border: `1px solid ${T.rule}`, borderRadius: 8,
      fontSize: 13.5, fontFamily: "var(--font-sans)", color: T.ink,
      background: "#fff", outline: "none", appearance: "menulist",
    }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

// ── Scenario uploader (dropzone + file list + common suggestions) ───
const COMMON_SCENARIOS = [
  "Return for damaged item",
  "Reschedule a delivery",
  "Cancel & refund subscription",
  "Verify identity before changing email",
];
// Cloud-up icon used by the scenario dropzone — mirrors the
// inline cloud-with-arrow glyph from the design reference.
const CloudUpIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.7"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 16.5a4.5 4.5 0 0 0-1.39-8.78A6 6 0 0 0 5 9.5 4.5 4.5 0 0 0 6.5 18"/>
    <path d="M12 12v8"/>
    <path d="M8 16l4-4 4 4"/>
  </svg>
);

const ScenarioUploader = ({ items, onAdd, onRemove }) => {
  const inputRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const handleFiles = (files) => {
    [...files].forEach(f => {
      onAdd({
        kind: "file",
        name: f.name,
        type: extType(f.name),
        size: humanSize(f.size),
      });
    });
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `1.5px dashed ${dragging ? T.periDeep : "#C7CDFF"}`,
          background: dragging ? "rgba(110,121,224,0.04)" : "#FCFAFF",
          borderRadius: 12, padding: "32px 24px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
          cursor: "pointer", transition: "all 140ms", textAlign: "center",
        }}
      >
        <span style={{
          width: 48, height: 48, borderRadius: 999,
          background: "#fff", border: `1px solid ${T.rule}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: T.ink, flexShrink: 0,
        }}>
          <CloudUpIcon/>
        </span>
        <div>
          <div style={{ fontSize: "var(--text-label)", fontWeight: 600, color: T.ink, lineHeight: "var(--leading-label)" }}>
            Drop a file or click to browse
          </div>
          <div style={{ fontSize: "var(--text-value)", color: T.ink3, marginTop: 4, lineHeight: "var(--leading-value)" }}>
            PDFs, screenshots, Word docs, transcripts, call recordings, up to 25 MB each.
          </div>
        </div>
        <input ref={inputRef} type="file" multiple style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.mp3,.mp4,.wav,.m4a,.txt"/>
      </div>

      {/* Footer link row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginTop: 10,
        fontSize: "var(--text-value)", color: T.ink3, lineHeight: "var(--leading-value)",
      }}>
        <Icon name="bookOpen" size={13} strokeWidth={1.8} style={{ color: T.ink3 }}/>
        <span>
          <a href="#" onClick={e => e.preventDefault()} style={{ color: T.ink2, textDecoration: "underline", fontWeight: 600 }}>Learn more</a>{" "}
          about uploading scenarios or{" "}
          <a href="#" onClick={e => e.preventDefault()} style={{ color: T.ink2, textDecoration: "underline", fontWeight: 600 }}>download a sample template</a>.
        </span>
      </div>

      {/* Uploaded files */}
      {items.length > 0 && (
        <div style={{ display: "grid", gap: 6, marginTop: 12 }}>
          {items.map((s, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto auto",
              gap: 10, alignItems: "center",
              padding: "8px 12px", background: "#fff",
              border: `1px solid ${T.rule}`, borderRadius: 8,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 5,
                background: typeColor(s.type), color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800, letterSpacing: "0.04em",
              }}>{s.type || "FILE"}</span>
              <span style={{ fontSize: 12.5, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
              <span style={{ fontSize: 11, color: T.ink3 }}>{s.size || ""}</span>
              <button onClick={() => onRemove(i)} style={{
                width: 22, height: 22, borderRadius: 5, border: 0,
                background: "transparent", color: T.ink3, cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }} title="Remove"><Icon name="x" size={12} strokeWidth={2.2}/></button>
            </div>
          ))}
        </div>
      )}

      {/* Common scenarios */}
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: T.ink3 }}>Common scenarios:</span>
        {COMMON_SCENARIOS.map(name => {
          const already = items.some(it => it.kind === "preset" && it.name === name);
          return (
            <button key={name}
              onClick={() => already ? null : onAdd({ kind: "preset", name, type: "DOC" })}
              disabled={already}
              style={{
                padding: "5px 11px", borderRadius: 999, border: 0, cursor: already ? "default" : "pointer",
                background: already ? "rgba(22,163,107,0.12)" : "rgba(31,42,46,0.05)",
                color: already ? T.success : T.ink2,
                fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
              {already && <Icon name="check" size={11} strokeWidth={2.6}/>}
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Knowledge uploader — minimal compact dropzone ───────────
const KnowledgeUploader = ({ items, onAdd, onRemove }) => {
  const inputRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const handleFiles = files => [...files].forEach(f => onAdd({ name: f.name, type: extType(f.name), size: humanSize(f.size) }));
  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          marginTop: 6,
          border: `1.5px dashed ${dragging ? T.ink : T.rule}`,
          background: dragging ? "rgba(31,42,46,0.02)" : "#fff",
          borderRadius: 10, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer", fontSize: 12.5, color: T.ink2,
        }}
      >
        <Icon name="folder" size={15} strokeWidth={1.8} style={{ color: T.ink3 }}/>
        <span><b>Drop files</b> (KB exports, FAQ docs, macros) <span style={{ color: T.ink3 }}>or </span>
          <span style={{ color: T.blue, fontWeight: 700 }}>browse</span></span>
        <input ref={inputRef} type="file" multiple style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)}/>
      </div>
      {items.length > 0 && (
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          {items.map((s, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto auto",
              gap: 10, alignItems: "center",
              padding: "7px 12px", background: "#fff",
              border: `1px solid ${T.rule}`, borderRadius: 8,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: 4,
                background: typeColor(s.type), color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 8.5, fontWeight: 800,
              }}>{s.type || "FILE"}</span>
              <span style={{ fontSize: 12.5, color: T.ink }}>{s.name}</span>
              <span style={{ fontSize: 11, color: T.ink3 }}>{s.size || ""}</span>
              <button onClick={() => onRemove(i)} style={{
                width: 20, height: 20, borderRadius: 4, border: 0,
                background: "transparent", color: T.ink3, cursor: "pointer",
              }} title="Remove"><Icon name="x" size={11} strokeWidth={2.2}/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// File-type helpers
const extType = (name) => {
  const e = (name.split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(e)) return "PDF";
  if (["doc","docx"].includes(e)) return "DOC";
  if (["png","jpg","jpeg","gif"].includes(e)) return "IMG";
  if (["mp3","wav","m4a"].includes(e)) return "AUD";
  if (["mp4","mov"].includes(e)) return "VID";
  if (["txt","md"].includes(e)) return "TXT";
  return e.slice(0,3).toUpperCase() || "FILE";
};
const typeColor = (t) => {
  const m = { PDF: "#E0413A", DOC: T.blue, IMG: T.success, AUD: T.warn, VID: "#7B22A4", TXT: T.ink3 };
  return m[t] || T.ink4;
};
const humanSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
};

// ── Step 2-5: Plan / Test / Deploy / Analyze (compact reviews) ─
const StepPlan = ({ state, onBack, onNext }) => {
  const selected = state.goals.map(id => WIZARD_GOALS.find(g => g.id === id)).filter(Boolean);
  const goalsLabel = selected.length === 0
    ? "your goal"
    : selected.length === 1
      ? selected[0].title
      : selected.length === 2
        ? `${selected[0].title} and ${selected[1].title}`
        : `${selected.length} goals`;
  return (
    <>
      <WizardHeader
        eyebrow="Step 2 of 5 · Recommended plan"
        title="Here's the plan we drafted"
        sub="Based on your answers, we'll wire up the following behaviors, procedures, and guardrails. Review, tweak inline, then continue to test."
      />
    <div style={{ padding: "24px 40px 100px" }}>
      {selected.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selected.map(g => (
            <span key={g.id} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(31,42,46,0.05)", color: T.ink2,
              fontSize: 12, fontWeight: 600,
            }}>
              <Icon name={g.icon} size={11} strokeWidth={2}/>{g.title}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
        <PlanCard tone="peri" title="Customer AI behaviors (6)" items={[
          "Answer order-tracking questions directly",
          "Auto-apologize for delays under 3 days",
          "Quote return policy from KB only, never improvise",
          "Collect order # + screenshots before handoff",
          "Escalate angry sentiment immediately",
          "Hand off VIP accounts with full context",
        ]}/>
        <PlanCard tone="yellow" title="Rep AI behaviors (4)" items={[
          "Draft refund response from order history",
          "Suggest next-best-action after first reply",
          "Coach on procedure adherence in real time",
          "Summarize before transfer",
        ]}/>
        <PlanCard tone="default" title="Procedures (7)" items={[
          "Refund order · Damaged item replacement · Wrong item received",
          "Order tracking lookup · VIP handoff with context · Dispute escalation",
          "Cancel within shipping cutoff",
        ]}/>
        <PlanCard tone="danger" title="Guardrails (5)" items={[
          "Never auto-refund > $200",
          "Always escalate VIP (Tier 1)",
          "CSAT after AI handle ≥ 4.2 / 5",
          "Repeat contact rate ≤ 8%",
          "Never quote policy from web search",
        ]}/>
      </div>

      <FooterBar>
        <Btn kind="ghost" icon="chevronLeft" onClick={onBack}>Edit answers</Btn>
        <Btn kind="ink" iconRight="arrowRight" onClick={onNext}>Run tests</Btn>
      </FooterBar>
    </div>
    </>
  );
};

const StepTest = ({ onBack, onNext }) => {
  const [running, setRunning] = React.useState(false);
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setPct(p => p >= 100 ? 100 : p + 8), 180);
    return () => clearInterval(t);
  }, [running]);
  const tests = [
    { name: "Order tracking, happy path",        status: pct > 12 ? "pass" : "pending" },
    { name: "Damaged item, replacement flow",    status: pct > 25 ? "pass" : "pending" },
    { name: "Refund > policy ceiling",            status: pct > 40 ? "pass" : "pending" },
    { name: "VIP escalation routing",             status: pct > 55 ? "pass" : "pending" },
    { name: "Angry sentiment, immediate escalate", status: pct > 70 ? "pass" : "pending" },
    { name: "Backorder, current plan",           status: pct >= 100 ? "fail" : "pending" },
    { name: "Cancel after shipping cutoff",       status: pct >= 100 ? "fail" : "pending" },
  ];
  const done = pct >= 100;
  return (
    <>
      <WizardHeader
        eyebrow="Step 3 of 5 · Test"
        title="Run tests against your plan"
        sub="We'll evaluate your plan against sample conversations grouped by scenario and flag where it needs work."
      />
    <div style={{ padding: "24px 40px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Btn kind={done ? "secondary" : "ink"} icon={running ? "pause" : "play"} onClick={() => { setRunning(true); }}>
          {!running ? "Run all tests" : done ? "Re-run" : "Running…"}
        </Btn>
        {running && <Progress value={pct} max={100} color={T.success}/>}
      </div>
      <Card padding={0} style={{ marginTop: 18, overflow: "hidden" }}>
        {tests.map((t, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "24px 1fr auto",
            alignItems: "center", gap: 12,
            padding: "12px 18px", borderTop: i ? `1px solid ${T.rule}` : "none",
            fontSize: 13,
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: 999,
              background: t.status === "pass" ? T.successBg : t.status === "fail" ? T.dangerBg : "rgba(31,42,46,0.06)",
              color: t.status === "pass" ? T.success : t.status === "fail" ? T.danger : T.ink4,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {t.status === "pass" ? <Icon name="check" size={11} strokeWidth={3}/>
               : t.status === "fail" ? <Icon name="x" size={11} strokeWidth={3}/>
               : <Icon name="clock" size={11} strokeWidth={2.2}/>}
            </span>
            <div style={{ color: T.ink2, fontWeight: 500 }}>{t.name}</div>
            <div style={{ fontSize: 11.5, color: T.ink3, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
              {t.status === "pending" ? "queued" : t.status}
            </div>
          </div>
        ))}
      </Card>
      <FooterBar>
        <Btn kind="ghost" icon="chevronLeft" onClick={onBack}>Back to plan</Btn>
        <Btn kind={done ? "ink" : "secondary"} iconRight="arrowRight" onClick={onNext} disabled={!done}>Continue to deploy</Btn>
      </FooterBar>
    </div>
    </>
  );
};

const StepDeploy = ({ state, setState, onBack, onNext }) => (
  <>
    <WizardHeader
      eyebrow="Step 4 of 5 · Deploy"
      title="Choose your rollout"
      sub="Start small and ramp up as your goal proves out."
    />
  <div style={{ padding: "24px 40px 100px" }}>
    <Card padding={20}>
      <Label>Audience</Label>
      <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
        {[
          { id: "shadow",  label: "Shadow mode",        desc: "Run silently in the background. No customer-visible changes." },
          { id: "limited", label: "Limited rollout",    desc: "10% of qualified conversations to start." },
          { id: "full",    label: "Full deployment",    desc: "100% of qualified conversations." },
        ].map(o => (
          <label key={o.id} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            padding: 12, border: `1px solid ${state.deploy === o.id ? T.ink : T.rule}`,
            background: state.deploy === o.id ? "rgba(31,42,46,0.03)" : "#fff",
            borderRadius: 10, cursor: "pointer",
          }}>
            <input type="radio" checked={state.deploy === o.id} onChange={() => setState({ ...state, deploy: o.id })}
              style={{ marginTop: 2 }}/>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{o.label}</div>
              <div style={{ fontSize: 12.5, color: T.ink3 }}>{o.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </Card>

    <Card padding={20} style={{ marginTop: 14 }}>
      <Label>Deploy notes (optional)</Label>
      <textarea placeholder="What changed? Anyone to ping?" style={{
        width: "100%", minHeight: 80, marginTop: 8, padding: 10,
        border: `1px solid ${T.rule}`, borderRadius: 8, resize: "vertical",
        fontFamily: "var(--font-sans)", fontSize: 13, color: T.ink,
      }}/>
    </Card>

    <FooterBar>
      <Btn kind="ghost" icon="chevronLeft" onClick={onBack}>Back to test</Btn>
      <Btn kind="ink" icon="rocket" onClick={onNext}>Deploy</Btn>
    </FooterBar>
  </div>
  </>
);

const StepAnalyze = ({ state, onComplete }) => (
  <>
    <WizardHeader
      eyebrow="Step 5 of 5 · Analyze"
      title="You're live"
      sub="Your goal is now monitoring conversations. Open the goal anytime to tune the plan, or jump into Performance to see live data."
    />
  <div style={{ padding: "24px 40px 100px" }}>
    <Card padding={24} style={{ background: "linear-gradient(180deg, #FFFCE8 0%, #FFFFFF 60%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 999, background: T.success, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 4px rgba(22,163,107,0.18)",
        }}>
          <Icon name="check" size={18} strokeWidth={2.5}/>
        </span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Reduce escalations</div>
          <div style={{ fontSize: 12.5, color: T.ink3 }}>v1 · deployed today · 10% rollout</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "10px 0" }}>
        <KPI label="Primary metric" value="," sub="Escalation rate · waiting for data"/>
        <KPI label="Quality monitor" value="AIC AI-CSAT" sub="Live · scoring every closed conversation"/>
        <KPI label="Alerts" value="On" sub="Daily · email + in-app"/>
      </div>
    </Card>

    <FooterBar>
      <Btn kind="ink" iconRight="arrowRight" onClick={onComplete}>Open my goal</Btn>
    </FooterBar>
  </div>
  </>
);

// ── Plan card + footer helpers ──────────────────────────────
const PlanCard = ({ tone, title, items }) => {
  const tones = {
    peri:    { bd: "#D8DDFF", bg: "#F2F4FF", fg: T.periDeep },
    yellow:  { bd: "#F9E089", bg: "#FFFCE8", fg: "#6e5800" },
    danger:  { bd: "#F3C4C7", bg: "#FDECEC", fg: T.danger },
    default: { bd: T.rule,    bg: "#fff",    fg: T.ink2 },
  }[tone];
  return (
    <div style={{
      border: `1px solid ${tones.bd}`, background: tones.bg, borderRadius: 12, padding: "16px 18px",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: tones.fg, marginBottom: 8 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: T.ink2, lineHeight: 1.65 }}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
};
const FooterBar = ({ children }) => (
  <div style={{
    display: "flex", justifyContent: "flex-end", gap: 10,
    marginTop: 32, paddingTop: 18, borderTop: `1px solid ${T.rule}`,
  }}>{children}</div>
);

// ── Wizard root ─────────────────────────────────────────────
const Wizard = ({ onCancel, onComplete }) => {
  const [step, setStep] = React.useState("goal");
  const [furthest, setFurthest] = React.useState("goal");
  const [state, setState] = React.useState({
    companyName: "Acme Inc", industry: "Retail & E-commerce",
    companyDescription: "Direct-to-consumer apparel and accessories. Customers reach out about order tracking, returns, sizing, and damaged-item replacements. Premium tone, fast resolution.",
    kbUrl: "",
    goals: ["deflect"], audience: ["cai", "rai"], tone: "Professional",
    scenarios: [], knowledge: [], deploy: "limited",
  });
  const order = ["goal", "plan", "test", "deploy", "analyze"];
  const advance = () => {
    const i = order.indexOf(step);
    const next = order[Math.min(order.length - 1, i + 1)];
    setStep(next);
    if (order.indexOf(next) > order.indexOf(furthest)) setFurthest(next);
  };
  const back = () => {
    const i = order.indexOf(step);
    setStep(order[Math.max(0, i - 1)]);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        padding: "26px 36px 18px",
        background: "#fff",
      }}>
        <h1 style={{
          fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "var(--text-h1)",
          letterSpacing: "-0.01em", color: T.ink, margin: 0, lineHeight: "var(--leading-h1)",
        }}>AI Setup</h1>
        <p style={{ fontSize: "var(--text-body)", color: T.ink3, margin: "10px 0 0", maxWidth: "70ch", lineHeight: "var(--leading-body)" }}>
          Walk through five quick steps to launch a new goal, pick the outcome, review the plan, test it, and roll it out.
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {step === "goal"    && <StepGoal    state={state} setState={setState} onNext={advance}/>}
        {step === "plan"    && <StepPlan    state={state} onBack={back} onNext={advance}/>}
        {step === "test"    && <StepTest    onBack={back} onNext={advance}/>}
        {step === "deploy"  && <StepDeploy  state={state} setState={setState} onBack={back} onNext={advance}/>}
        {step === "analyze" && <StepAnalyze state={state} onComplete={() => onComplete(state)}/>}
      </div>
    </div>
  );
};

Object.assign(window, { Wizard });
