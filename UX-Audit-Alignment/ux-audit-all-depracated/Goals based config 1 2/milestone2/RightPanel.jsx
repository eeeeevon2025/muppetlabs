// Right-side panel that appears on Build (and Test) pages: Assistant + Test Console tabs.

const RightPanel = () => {
  const [tab, setTab] = React.useState("test");
  const [channel, setChannel] = React.useState("");

  return (
    <aside style={{
      width: 320,
      borderLeft: "1px solid #E8EAF0",
      background: "#fff",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      minHeight: 0,
    }}>
      {/* Tabs header */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid #E8EAF0",
        display: "flex", alignItems: "center", gap: 8,
        flexShrink: 0,
      }}>
        <PanelTab active={tab === "assistant"} onClick={() => setTab("assistant")}>
          <SparkleGlyph/> Assistant
        </PanelTab>
        <PanelTab active={tab === "test"} onClick={() => setTab("test")}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={tab === "test" ? "#0165E4" : "#5F6675"}><path d="M5 3l14 9-14 9z"/></svg>
          Test Console
        </PanelTab>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 22px" }}>
        {tab === "test" ? (
          <>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
              marginBottom: 8,
            }}>Test Channel</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#5F6675", marginBottom: 12 }}>
              Select a channel for your conversation with a test customer
            </div>
            <SelectField
              value={channel}
              onClick={() => setChannel(channel === "Email" ? "" : "Email")}
              placeholder="Select channel..."
            />
            <div style={{
              marginTop: 64, textAlign: "center",
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#9099AB",
            }}>
              Select a channel above to start testing
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#1F242D",
              marginBottom: 8,
            }}>Assistant</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#5F6675" }}>
              Get help configuring your AI Automation. Ask the Assistant to draft procedures, suggest knowledge sources, or explain how something works.
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

const PanelTab = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "6px 12px",
    border: 0,
    background: active ? "#EBF1FF" : "transparent",
    color: active ? "#0165E4" : "#5F6675",
    fontFamily: "var(--font-sans)",
    fontSize: 13, fontWeight: 600,
    borderRadius: 6,
    cursor: "pointer",
  }}>{children}</button>
);

Object.assign(window, { RightPanel });
