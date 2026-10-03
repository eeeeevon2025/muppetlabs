// Top-level shell: dark rail + nav section + main content + save bar

const App = () => {
  const [activeRail, setActiveRail] = React.useState("ai");
  const [activeNav, setActiveNav] = React.useState("setup");
  const [refundExpanded, setRefundExpanded] = React.useState(true);
  const [tab, setTab] = React.useState("copilot");
  const [view, setView] = React.useState("home"); // "home" | "observe"

  const [state, setState] = React.useState({
    copilotOn: true,
    translations: true,
    translationExclusions: ["Kustomer", "Kusty", "AS-1024"],
    typeahead: true,
    suggestionsOn: true,
    suggestionsMode: "quality",
    summariesOn: true,
    sigSentiment: true,
    sigUrgency: true,
    sigIntent: false,
    sigChurn: false,
  });
  const [dirty, setDirty] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);

  const set = (patch) => {
    setState(s => ({ ...s, ...patch }));
    setDirty(true);
  };

  const onCancel = () => {
    setDirty(false);
  };
  const onSave = () => {
    setDirty(false);
  };

  return (
    <div data-screen-label="01 AI for Reps · Copilot" style={{
      display: "flex", height: "100vh", width: "100vw",
      background: "#fff",
      fontFamily: "var(--font-sans)",
      color: "#1F242D",
    }}>
      <LeftRail active={activeRail} onNav={setActiveRail}/>

      <NavSection
        active={activeNav}
        onNav={setActiveNav}
        expanded={refundExpanded}
        setExpanded={setRefundExpanded}
      />

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        {/* Top bar: breadcrumb (Build/Test only) */}
        {(activeNav === "build" || activeNav === "test") && (
        <div style={{
          height: 48, borderBottom: "1px solid #E8EAF0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px",
          background: "#fff",
          flexShrink: 0,
        }}>
          {activeNav === "build" || activeNav === "test" ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 8px",
                border: 0, background: "transparent",
                color: "#5F6675",
                fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 500,
                borderRadius: 4, cursor: "pointer",
              }}>AI Automations</button>
              <span style={{ color: "#B3BBCB", display: "inline-flex" }}>
                <RailIcon name="chevronRight" size={12} strokeWidth={2}/>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px" }}>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#3F8CFF",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "#fff",
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
                }}>Refund Order</span>
              </span>
              {activeNav === "test" ? (
                <span style={{
                  marginLeft: 8,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px",
                  background: "#FFF4E6",
                  border: "1px solid #FDE2B4",
                  color: "#8A5A08",
                  fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
                  borderRadius: 999,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4"/>
                    <path d="M12 16h.01"/>
                  </svg>
                  Not deployed
                </span>
              ) : (
                <span style={{
                  marginLeft: 8,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px",
                  background: "#F2F3F7",
                  color: "#5F6675",
                  fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
                  borderRadius: 999,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#16A36B",
                  }}/>
                  Deployed on 03/04/2026 4:03 PM
                </span>
              )}
              <button style={{
                width: 28, height: 28, border: 0, background: "transparent",
                color: "#697182", cursor: "pointer", borderRadius: 4,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <RailIcon name="more" size={16} strokeWidth={2}/>
              </button>
            </div>
          ) : <div/>}
        </div>
        )}

        {/* Scrollable content */}
        <div style={{
          flex: 1, display: "flex", minHeight: 0, minWidth: 0,
        }}>
        {activeNav === "setup" || activeNav === "setup-build" || activeNav === "setup-test" || activeNav === "setup-deploy" || activeNav === "setup-analyze" ? (
          <SetupPanel view={activeNav} onNav={setActiveNav}/>
        ) : activeNav === "build" ? (
          <>
            <div style={{ flex: 1, overflow: "auto", padding: "28px 36px", paddingBottom: dirty ? 80 : 28, minWidth: 520 }}>
              <div style={{ maxWidth: 760 }}>
                <BuildPanel onDirty={() => setDirty(true)}/>
              </div>
            </div>
            <TestConsole collapsed={rightCollapsed} onToggle={() => setRightCollapsed(c => !c)}/>
          </>
        ) : activeNav === "test" ? (
          <TestPanel rightCollapsed={rightCollapsed} onToggleRight={() => setRightCollapsed(c => !c)}/>
        ) : (
          <div style={{
            flex: 1, overflow: "auto",
            padding: "28px 36px",
            paddingBottom: dirty ? 80 : 28,
          }}>
          <div style={{ maxWidth: view === "observe" ? 1200 : 920 }}>
            {activeNav === "reps" && view === "observe" ? (
              <ObservePanel onBack={() => setView("home")}/>
            ) : activeNav === "reps" ? (
              <>
                <SectionTitle helpIcon>AI for Reps</SectionTitle>
                <Description style={{ marginTop: 8, marginBottom: 18 }}>
                  Configure AI for Reps to support your teams behind the scenes, or manage Summaries and Signals to provide context on customer history.
                </Description>

                <div style={{ marginBottom: 24 }}>
                  <Tabs
                    items={[
                      { id: "copilot",   label: "Copilot" },
                      { id: "summaries", label: "Summaries and Signals" },
                    ]}
                    active={tab}
                    onChange={setTab}
                  />
                </div>

                {tab === "copilot"
                  ? <CopilotPanel state={state} set={set} onObserve={() => setView("observe")}/>
                  : <SummariesPanel state={state} set={set}/>
                }
              </>
            ) : activeNav === "procedures" ? (
              <ProceduresLibrary/>
            ) : activeNav === "performance" ? (
              window.PerformancePanel ? <window.PerformancePanel/> : <EmptySection nav={activeNav}/>
            ) : (
              <EmptySection nav={activeNav}/>
            )}
          </div>
          </div>
        )}
        </div>

        {/* Save bar */}
        {dirty && view === "home" && (
          <div style={{
            position: "absolute",
            left: 0, right: activeNav === "build" ? (rightCollapsed ? 48 : 380) : activeNav === "test" ? (rightCollapsed ? 48 : 280) : 0, bottom: 0,
            background: "#fff",
            borderTop: "1px solid #E8EAF0",
            padding: "12px 28px",
            display: "flex", justifyContent: "flex-end", alignItems: "center",
            gap: 12,
            boxShadow: "0 -2px 8px rgba(31,42,46,0.04)",
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: "8px 16px",
                border: 0, background: "transparent",
                color: "#697182",
                fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 600,
                borderRadius: 6, cursor: "pointer",
              }}
            >Cancel</button>
            <button
              onClick={onSave}
              style={{
                padding: "8px 16px",
                border: 0,
                background: "#0165E4",
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 600,
                borderRadius: 6, cursor: "pointer",
              }}
            >Save Changes</button>
          </div>
        )}
        {!dirty && view === "home" && (
          <div style={{
            position: "absolute",
            left: 0, right: activeNav === "build" ? (rightCollapsed ? 48 : 380) : activeNav === "test" ? (rightCollapsed ? 48 : 280) : 0, bottom: 0,
            background: "#fff",
            borderTop: "1px solid #E8EAF0",
            padding: "12px 28px",
            display: "flex", justifyContent: "flex-end", alignItems: "center",
            gap: 12,
          }}>
            <span style={{ color: "#9099AB", fontSize: 13, fontWeight: 600, padding: "8px 16px" }}>Cancel</span>
            <span style={{
              padding: "8px 16px",
              background: "#F2F3F7",
              color: "#9099AB",
              fontSize: 13, fontWeight: 600,
              borderRadius: 6,
            }}>Save Changes</span>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptySection = ({ nav }) => {
  const labels = {
    knowledge: "Knowledge Sources",
    mcp: "MCP Servers",
    tools: "Tools",
    automations: "Manage Automations",
    performance: "Performance",
    build: "Build", test: "Test", deploy: "Deploy", analyze: "Analyze", settings: "Settings",
  };
  return (
    <div>
      <SectionTitle>{labels[nav] || nav}</SectionTitle>
      <Description style={{ marginTop: 10 }}>
        Placeholder — click Reps in the sidebar to return to the AI for Reps page.
      </Description>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
