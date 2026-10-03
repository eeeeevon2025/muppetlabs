// Test page — for an AI Automation. Shows test cases + side editor.

const TEST_CASES = [
  { id: "tc1", name: "Customer's Item is Broken", customer: "Moishe Latner", message: "The item I received is broken/damaged", lastModified: "Mar 4, 2026, 3:17 PM", score: 10 },
];

const TestPanel = () => {
  const [tab, setTab] = React.useState("cases");
  const [selected, setSelected] = React.useState(TEST_CASES[0].id);
  const [editing, setEditing] = React.useState(true);

  const tc = TEST_CASES.find(t => t.id === selected);

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Center column */}
      <div style={{ flex: 1, padding: "28px 36px", overflow: "auto", minWidth: 0 }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 14,
          }}>
            <h1 style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 22, fontWeight: 700, color: "#1F242D",
              letterSpacing: "-0.01em",
            }}>Defective Product</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button style={{
                padding: "8px 16px",
                border: 0,
                background: "#0165E4",
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 600,
                borderRadius: 6, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M5 3l14 9-14 9z"/></svg>
                Run evaluation
              </button>
              <button style={{
                width: 30, height: 30,
                border: "1px solid #E8EAF0", background: "#fff",
                color: "#5F6675",
                borderRadius: 6, cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
              </button>
            </div>
          </div>

          {/* Last completed run banner */}
          <div style={{
            background: "#F8F9FB",
            border: "1px solid #E8EAF0",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 18,
          }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#3F444F" }}>
              Last completed run on Mar 4, 2026, 3:32 PM. Score: <strong style={{ color: "#1F242D" }}>10%</strong>
              <span style={{ color: "#9099AB", marginLeft: 4, display: "inline-flex", verticalAlign: "middle" }}>
                <RailIcon name="info" size={13} strokeWidth={1.8}/>
              </span>
            </div>
            <a href="#" style={{ color: "#0165E4", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View results</a>
          </div>

          {/* Tabs row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", gap: 22, borderBottom: "1px solid transparent" }}>
              {["cases", "results"].map(t => {
                const active = tab === t;
                return (
                  <button key={t} onClick={() => setTab(t)}
                    style={{
                      padding: "8px 0",
                      border: 0, borderBottom: active ? "2px solid #0165E4" : "2px solid transparent",
                      background: "transparent",
                      color: active ? "#0165E4" : "#5F6675",
                      fontFamily: "var(--font-sans)",
                      fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >{t === "cases" ? "Test Cases" : "Results"}</button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                padding: "4px 10px", borderRadius: 999,
                background: "#EBF1FF", color: "#0165E4",
                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              }}>0/10 test cases</span>
              <OutlineBtn icon={<RailIcon name="plus" size={13} strokeWidth={2.2}/>} size="sm">Add test case</OutlineBtn>
            </div>
          </div>

          {/* Cases table */}
          {tab === "cases" && (
            <div style={{
              border: "1px solid #E8EAF0",
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}>
              {/* head */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 180px 80px 36px",
                padding: "10px 16px",
                background: "#F8F9FB",
                borderBottom: "1px solid #E8EAF0",
                fontFamily: "var(--font-sans)",
                fontSize: 12, fontWeight: 600, color: "#5F6675",
              }}>
                <div>Test cases</div>
                <div>Last modified</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  Score
                  <span style={{ color: "#9099AB", display: "inline-flex" }}>
                    <RailIcon name="info" size={12} strokeWidth={1.8}/>
                  </span>
                </div>
                <div/>
              </div>
              {TEST_CASES.map(t => (
                <div key={t.id}
                  onClick={() => setSelected(t.id)}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 180px 80px 36px",
                    padding: "14px 16px",
                    alignItems: "center",
                    background: selected === t.id ? "#F8F9FB" : "#fff",
                    cursor: "pointer",
                    borderBottom: "1px solid #E8EAF0",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{t.name}</div>
                    <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 12, color: "#5F6675" }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#FFB45C", color: "#fff",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700,
                      }}>ML</span>
                      <span>{t.customer}</span>
                      <em style={{ color: "#9099AB", fontStyle: "italic" }}>"{t.message.slice(0, 30)}…"</em>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#3F444F" }}>{t.lastModified}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D" }}>{t.score}%</div>
                  <div>
                    <button style={{
                      width: 26, height: 26, border: 0, background: "transparent",
                      color: "#9099AB", borderRadius: 4, cursor: "pointer",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                    </button>
                  </div>
                </div>
              ))}
              {TEST_CASES.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "#9099AB", fontSize: 13 }}>
                  No test cases yet.
                </div>
              )}
            </div>
          )}
          {tab === "results" && (
            <div style={{
              border: "1px solid #E8EAF0", borderRadius: 8,
              padding: 32, textAlign: "center", color: "#9099AB",
              fontFamily: "var(--font-sans)", fontSize: 13,
            }}>Run an evaluation to see results.</div>
          )}
        </div>
      </div>

      {/* Right editor panel */}
      {editing && tc && <TestCaseEditor tc={tc}/>}
    </div>
  );
};

const TestCaseEditor = ({ tc }) => {
  const [name, setName] = React.useState(tc.name);
  const [message, setMessage] = React.useState(tc.message);

  return (
    <aside style={{
      width: 380,
      borderLeft: "1px solid #E8EAF0",
      background: "#fff",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      minHeight: 0,
    }}>
      {/* header */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid #E8EAF0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 10px",
          border: "1px solid #E8EAF0", background: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          color: "#1F242D",
          borderRadius: 6, cursor: "pointer",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
          Edit test case
          <RailIcon name="chevronDown" size={13} strokeWidth={1.8}/>
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "18px 22px" }}>
        {/* Notice */}
        <div style={{
          background: "#EBF1FF",
          border: "1px solid #C5D8FA",
          borderRadius: 6,
          padding: "12px 14px",
          fontFamily: "var(--font-sans)",
          fontSize: 12, lineHeight: 1.5, color: "#0E2A66",
          marginBottom: 18,
        }}>
          Editing a test case will require re-running the evaluation to ensure updated results.
        </div>

        <FieldGroup label="Test case name" required>
          <TextField value={name} onChange={setName}/>
        </FieldGroup>

        <FieldGroup label="Customer" required>
          <SelectFieldStyled
            avatar="M"
            avatarColor="#FFB45C"
            value="Moishe Latner"
          />
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            color: "#0165E4", fontFamily: "var(--font-sans)",
            fontSize: 12, fontWeight: 500, textDecoration: "none",
            marginTop: 6,
          }}>Edit customer
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </a>
        </FieldGroup>

        <FieldGroup label="Test message" required>
          <TextArea value={message} onChange={setMessage} rows={3}/>
        </FieldGroup>

        <div style={{
          marginTop: 18, marginBottom: 14,
          fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
        }}>Assertions</div>

        <FieldGroup label="AI Agent calls" sub="Specify the AI Agents that should be called.">
          <ChipMultiField values={["Main Agent"]}/>
        </FieldGroup>

        <FieldGroup label="Tool calls" sub="Specify the tools that the AI Automation must call.">
          <SelectField placeholder="Select tools"/>
        </FieldGroup>

        <FieldGroup label={<>Expected response <span style={{ color: "#E5484D" }}>*</span> <span style={{ color: "#9099AB", display: "inline-flex", verticalAlign: "middle", marginLeft: 2 }}><RailIcon name="info" size={12} strokeWidth={1.8}/></span></>}>
          <TextArea value="The agent should apologize, gather order details, and offer a replacement or refund." onChange={() => {}} rows={3}/>
        </FieldGroup>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #E8EAF0",
        padding: "12px 18px",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D" }}>Test case preview</span>
          <a href="#" style={{ color: "#0165E4", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Run preview</a>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
          <button style={{
            padding: "8px 16px",
            background: "#F2F3F7", color: "#9099AB",
            border: 0,
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 6, cursor: "not-allowed",
          }}>Update test case</button>
          <button style={{
            padding: "8px 8px",
            background: "transparent", color: "#0165E4",
            border: 0,
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}>Cancel</button>
        </div>
      </div>
    </aside>
  );
};

const FieldGroup = ({ label, required, sub, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D",
      marginBottom: 4,
    }}>
      {label}{required && <span style={{ color: "#E5484D", marginLeft: 2 }}>*</span>}
    </div>
    {sub && (
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#5F6675", marginBottom: 8 }}>{sub}</div>
    )}
    {children}
  </div>
);

const TextField = ({ value, onChange }) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <input value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: focus ? "1px solid #3F8CFF" : "1px solid #DCE0E9",
        outline: focus ? "3px solid rgba(63,140,255,0.18)" : "none",
        background: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
        borderRadius: 4,
        boxSizing: "border-box",
      }}/>
  );
};

const SelectFieldStyled = ({ avatar, avatarColor, value }) => (
  <button style={{
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", minHeight: 38, padding: "6px 12px",
    border: "1px solid #DCE0E9", background: "#fff",
    borderRadius: 4, cursor: "pointer", textAlign: "left",
  }}>
    <span style={{
      width: 22, height: 22, borderRadius: "50%",
      background: avatarColor, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
    }}>{avatar}</span>
    <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#1F242D" }}>{value}</span>
    <RailIcon name="chevronDown" size={14} strokeWidth={2}/>
  </button>
);

const ChipMultiField = ({ values }) => (
  <button style={{
    display: "flex", alignItems: "center", gap: 6,
    width: "100%", minHeight: 38, padding: "6px 10px",
    border: "1px solid #DCE0E9", background: "#fff",
    borderRadius: 4, cursor: "pointer", flexWrap: "wrap",
  }}>
    {values.map(v => (
      <span key={v} style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 4px 3px 8px",
        background: "#EBF1FF", color: "#0165E4",
        borderRadius: 4,
        fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
      }}>
        {v}
        <span style={{ width: 16, height: 16, color: "#0165E4", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </span>
      </span>
    ))}
    <span style={{ marginLeft: "auto", color: "#9099AB", display: "inline-flex" }}>
      <RailIcon name="chevronDown" size={14} strokeWidth={2}/>
    </span>
  </button>
);

Object.assign(window, { TestPanel });
