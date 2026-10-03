// Top-level shell: dark rail + nav section + main content + save bar

const App = () => {
  const [activeRail, setActiveRail] = React.useState("ai");
  const [activeNav, setActiveNav] = React.useState("reps");
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

  const set = (patch) => {
    setState(s => ({ ...s, ...patch }));
    setDirty(true);
  };

  const onCancel = () => setDirty(false);
  const onSave = () => setDirty(false);

  const isAutomationPage = ["build", "test", "deploy", "analyze", "settings"].includes(activeNav);
  const isRepsAutomationPage = ["reps-build", "reps-analyze", "reps-settings"].includes(activeNav);

  const screenLabel = (
    activeNav === "reps" ? "01 AI for Reps · Copilot" :
    activeNav === "build" ? "02 AI for Customers · Refund Order · Build" :
    activeNav === "test"  ? "03 AI for Customers · Refund Order · Test" :
    activeNav === "reps-build" ? "04 AI for Reps · Copilot · Build" :
    activeNav === "reps-test"  ? "05 AI for Reps · Copilot · Test" :
    activeNav === "library"    ? "06 Procedures" :
    `${activeNav} page`
  );

  return (
    <div data-screen-label={screenLabel} style={{
      display: "flex", height: "100vh", width: "100vw",
      background: "#fff",
      fontFamily: "var(--font-sans)",
      color: "#1F242D",
    }}>
      <LeftRail active={activeRail} onNav={setActiveRail}/>

      <NavSection
        active={activeNav}
        onNav={(id) => { setActiveNav(id); setView("home"); }}
        expanded={refundExpanded}
        setExpanded={setRefundExpanded}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        {isAutomationPage ? (
          <AutomationLayout activeNav={activeNav} mode="customer"/>
        ) : isRepsAutomationPage ? (
          <AutomationLayout activeNav={activeNav.replace("reps-", "")} mode="reps"/>
        ) : (
          <RepsLayout
            activeNav={activeNav}
            view={view} setView={setView}
            tab={tab} setTab={setTab}
            state={state} set={set}
            dirty={dirty} onCancel={onCancel} onSave={onSave}
          />
        )}
      </div>
    </div>
  );
};

// ─── Build / Test / etc — shared layout for an Automation OR Copilot ─────

const AutomationLayout = ({ activeNav, mode }) => {
  const labels = { build: "Build", test: "Test", deploy: "Deploy", analyze: "Analyze", settings: "Settings" };
  const isReps = mode === "reps";

  return (
    <>
      {/* Breadcrumb bar */}
      <div style={{
        height: 48, borderBottom: "1px solid #E8EAF0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
        background: "#fff",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 13, color: "#5F6675" }}>
          <a href="#" style={{ color: "#5F6675", textDecoration: "none" }}>{isReps ? "AI for Reps" : "AI Automations"}</a>
          <RailIcon name="chevronRight" size={12} strokeWidth={2}/>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1F242D", fontWeight: 600 }}>
            <span style={{
              width: 16, height: 16, borderRadius: "50%",
              background: isReps ? "#7B5BD1" : "#3F8CFF", color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <RailIcon name={isReps ? "headset" : "refund"} size={10} strokeWidth={2.5}/>
            </span>
            {isReps ? "Copilot" : "Refund Order"}
          </span>
          {activeNav === "test" && !isReps && (
            <>
              <RailIcon name="chevronRight" size={12} strokeWidth={2}/>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1F242D", fontWeight: 600 }}>
                <RailIcon name="folder" size={12} strokeWidth={1.7}/>
                Defective Product
              </span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            padding: "4px 10px", borderRadius: 999,
            background: "#F2F3F7", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
          }}>{isReps ? "Active for all reps" : "Deployed on 03/04/2026 4:03 PM"}</span>
          <button style={{
            width: 30, height: 30, border: 0, background: "transparent",
            color: "#5F6675", borderRadius: 6, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {activeNav === "build" ? (
          <>
            <div style={{ flex: 1, overflow: "auto", padding: "28px 36px", minWidth: 520 }}>
              <div style={{ maxWidth: 760 }}>
                <BuildPanel key={mode} mode={mode}/>
              </div>
              <div style={{ height: 60 }}/>
            </div>
            <RightPanel/>
            <BuildSaveFooter/>
          </>
        ) : activeNav === "test" ? (
          <TestPanel/>
        ) : (
          <div style={{ flex: 1, padding: "28px 36px" }}>
            <SectionTitle>{labels[activeNav]}</SectionTitle>
            <Description style={{ marginTop: 10 }}>Placeholder — coming soon.</Description>
          </div>
        )}
      </div>
    </>
  );
};

const BuildSaveFooter = () => (
  <div style={{
    position: "absolute", left: 0, bottom: 0, right: 320,
    background: "#fff",
    borderTop: "1px solid #E8EAF0",
    padding: "12px 28px",
    display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12,
  }}>
    <span style={{
      padding: "8px 16px",
      background: "#F2F3F7", color: "#9099AB",
      fontSize: 13, fontWeight: 600,
      borderRadius: 6,
    }}>Save Changes</span>
  </div>
);

// ─── Reps page (Copilot home, Summaries, Library, etc) ──────────────

const RepsLayout = ({ activeNav, view, setView, tab, setTab, state, set, dirty, onCancel, onSave }) => (
  <>
    <div style={{
      height: 40, borderBottom: "1px solid #E8EAF0",
      display: "flex", alignItems: "center", justifyContent: "flex-end",
      padding: "0 20px",
      background: "#fff",
      flexShrink: 0,
    }}>
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 10px",
        border: 0, background: "transparent",
        color: "#5F6675",
        fontFamily: "var(--font-sans)",
        fontSize: 12, fontWeight: 500,
        borderRadius: 4, cursor: "pointer",
      }}>
        <RailIcon name="folder" size={14} strokeWidth={1.7}/>
        All Bookmarks
      </button>
    </div>

    <div style={{
      flex: 1, overflow: "auto",
      padding: "28px 36px",
      paddingBottom: dirty ? 80 : 28,
    }}>
      <div style={{ maxWidth: view === "observe" ? 1200 : 1080 }}>
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
        ) : activeNav === "library" ? (
          <LibraryPanel/>
        ) : (
          <EmptySection nav={activeNav}/>
        )}
      </div>
    </div>

    {activeNav === "reps" && (dirty && view === "home" ? (
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "#fff", borderTop: "1px solid #E8EAF0",
        padding: "12px 28px",
        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12,
        boxShadow: "0 -2px 8px rgba(31,42,46,0.04)",
      }}>
        <button onClick={onCancel} style={{
          padding: "8px 16px", border: 0, background: "transparent",
          color: "#697182", fontSize: 13, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
        }}>Cancel</button>
        <button onClick={onSave} style={{
          padding: "8px 16px", border: 0,
          background: "#0165E4", color: "#fff",
          fontSize: 13, fontWeight: 600,
          borderRadius: 6, cursor: "pointer",
        }}>Save Changes</button>
      </div>
    ) : view === "home" && (
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "#fff", borderTop: "1px solid #E8EAF0",
        padding: "12px 28px",
        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12,
      }}>
        <span style={{ color: "#9099AB", fontSize: 13, fontWeight: 600, padding: "8px 16px" }}>Cancel</span>
        <span style={{
          padding: "8px 16px",
          background: "#F2F3F7", color: "#9099AB",
          fontSize: 13, fontWeight: 600,
          borderRadius: 6,
        }}>Save Changes</span>
      </div>
    ))}
  </>
);

const EmptySection = ({ nav }) => {
  const labels = {
    knowledge: "Knowledge Sources",
    mcp: "MCP Servers",
    tools: "Tools",
    automations: "Manage Automations",
    performance: "Performance",
  };
  return (
    <div>
      <SectionTitle>{labels[nav] || nav}</SectionTitle>
      <Description style={{ marginTop: 10 }}>Placeholder — coming soon.</Description>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
