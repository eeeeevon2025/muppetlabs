// ============================================================
// Deploy tab — cross-audience (AIC + AIR)
// ============================================================

const DeployScreen = ({ automation, navigate, onActivate }) => {
  const [deployNotes, setDeployNotes] = useState(
    "Initial deployment of Refund Order automation. Handles standard refunds, late delivery, and tracking. Damaged items branch added with handoff to human."
  );
  const [smartRouting, setSmartRouting] = useState(
    "Order status, refunds, and tracking questions for customers in our standard tier. Defer billing escalations and customers with active legal escalation flags to a human."
  );
  const [copilotOn, setCopilotOn] = useState(true);
  const [copilotMode, setCopilotMode] = useState("essentials");
  const isAIR = automation.audience === "AIR";
  const isAIC = automation.audience === "AIC";

  return (
    <>
      <div className="card-row" style={{ marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Deploy your AI Automation</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--gray-95)" }}>
            Configure deployment conditions and deploy this automation to {automation.drives.length > 0 ? automation.drives.join(" + ") : "your customers"}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost">Save draft</button>
          <button className="btn success" onClick={onActivate}>
            <Icon name="play" size={13} /> Activate
          </button>
        </div>
      </div>

      {/* Active state banner */}
      {automation.status === "live" && (
        <div style={{ background: "var(--green-15)", border: "1px solid var(--green-20)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 12.5, color: "var(--green-95)", display: "flex", alignItems: "center", gap: 10 }}>
          <span className="status-pill live" style={{ background: "transparent", padding: 0 }}><span className="pulse"></span></span>
          <span><b>Active</b> — Last deployed by Amisha on May 19, 2026 at 3:42 PM</span>
        </div>
      )}

      {/* Deploy notes */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Deploy Notes</h3>
          <div className="meta">Describe what changes in this deployment</div>
        </div>
        <textarea className="text" rows="3" value={deployNotes} onChange={(e) => setDeployNotes(e.target.value)} />
      </div>

      {/* AIC section banner */}
      <div className="audience-banner aic">
        <Icon name="sparkles" size={14} /> AI for Customers
      </div>

      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Conditions</h3>
          <div className="meta">If a conversation matches, AI handles it</div>
        </div>

        <div className="rule-group">
          <div className="rule-group-head">Matches all of the following</div>
          <div className="rule">
            <select className="text"><option>Conversation Channel</option><option>Brand</option><option>Customer Tier</option><option>Locale</option></select>
            <select className="text"><option>is one of</option><option>is not</option></select>
            <input className="text" defaultValue="Chat, SMS" />
            <button className="x"><Icon name="x" size={13} /></button>
          </div>
          <div className="rule">
            <select className="text"><option>Brand</option><option>Channel</option></select>
            <select className="text"><option>is</option><option>is not</option></select>
            <input className="text" defaultValue="Acme Outdoors US" />
            <button className="x"><Icon name="x" size={13} /></button>
          </div>
          <button className="btn ghost sm"><Icon name="plus" size={12} /> Add rule</button>
        </div>

        <div className="rule-group">
          <div className="rule-group-head">Matches any of the following</div>
          <div className="rule">
            <select className="text"><option>Message Body</option><option>Customer Tags</option></select>
            <select className="text"><option>contains</option><option>does not contain</option></select>
            <input className="text" defaultValue="refund" />
            <button className="x"><Icon name="x" size={13} /></button>
          </div>
          <div className="rule">
            <select className="text"><option>Message Body</option></select>
            <select className="text"><option>contains</option></select>
            <input className="text" defaultValue="return" />
            <button className="x"><Icon name="x" size={13} /></button>
          </div>
          <button className="btn ghost sm"><Icon name="plus" size={12} /> Add rule</button>
        </div>
      </div>

      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Smart Routing</h3>
          <div className="meta">Natural-language guidance — what AI handles vs escalates</div>
        </div>
        <textarea className="text" rows="3" value={smartRouting} onChange={(e) => setSmartRouting(e.target.value)} />
        <div style={{ display: "flex", gap: 14, marginTop: 12, alignItems: "center", fontSize: 12.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "var(--green-15)", color: "var(--green-95)", borderRadius: 999, fontWeight: 500 }}>
            <Icon name="check" size={12} /> Match → AI handles
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "var(--gray-20)", color: "var(--gray-105)", borderRadius: 999, fontWeight: 500 }}>
            <Icon name="user" size={12} /> No match → Human agent
          </div>
        </div>
      </div>

      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Review Evaluations</h3>
          <div className="meta"><a style={{ color: "var(--blue-90)", cursor: "pointer", fontWeight: 500 }} onClick={() => navigate(`automation:${automation.id}:test`)}>Go to Test →</a></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={{ padding: "12px 14px", background: "var(--gray-15)", borderRadius: 8, border: "1px solid var(--gray-30)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gray-90)", letterSpacing: 0.5, textTransform: "uppercase" }}>Categories</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--gray-120)" }}>6</div>
            <div style={{ fontSize: 11.5, color: "var(--gray-90)" }}>5 passing, 1 failing</div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--gray-15)", borderRadius: 8, border: "1px solid var(--gray-30)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gray-90)", letterSpacing: 0.5, textTransform: "uppercase" }}>Avg score</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--green-80)" }}>67%</div>
            <div style={{ fontSize: 11.5, color: "var(--gray-90)" }}>Last run 2h ago</div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--gray-15)", borderRadius: 8, border: "1px solid var(--gray-30)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gray-90)", letterSpacing: 0.5, textTransform: "uppercase" }}>Failing</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--red-80)", marginTop: 4 }}>Damaged or Defective Items</div>
            <div style={{ fontSize: 11.5, color: "var(--gray-90)" }}>23% pass rate</div>
          </div>
        </div>
      </div>

      {/* AIR section banner */}
      <div className="audience-banner air">
        <Icon name="headset" size={14} /> AI for Reps (Copilot)
      </div>

      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Copilot</h3>
          <div className="meta">Help your reps reply faster, summarize, surface signals</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--gray-120)" }}>Turn on Copilot for this automation's conversations</div>
            <div style={{ fontSize: 11.5, color: "var(--gray-90)", marginTop: 2 }}>When AIC hands off to a human, Copilot assists the rep with drafts and summaries.</div>
          </div>
          <Toggle active={copilotOn} onChange={setCopilotOn} />
        </div>

        {copilotOn && (
          <>
            <div className="field-label">Mode</div>
            <div className="split-equal" style={{ marginTop: 6 }}>
              <button className={`audience-opt air ${copilotMode === "essentials" ? "active" : ""}`} style={{ flexDirection: "column", alignItems: "flex-start" }} onClick={() => setCopilotMode("essentials")}>
                <div className="ico-wrap"><Icon name="bolt" size={16} /></div>
                <div>
                  <div className="ao-title">Essentials</div>
                  <div className="ao-desc">Faster. Conversation + customer + writing guidance. Suggests replies only.</div>
                </div>
              </button>
              <button className={`audience-opt air ${copilotMode === "full" ? "active" : ""}`} style={{ flexDirection: "column", alignItems: "flex-start" }} onClick={() => setCopilotMode("full")}>
                <div className="ico-wrap"><Icon name="sparkles" size={16} /></div>
                <div>
                  <div className="ao-title">Full Context</div>
                  <div className="ao-desc">Slower. Full AI Agents + Writing Guidance + knowledge. Suggests replies AND actions.</div>
                </div>
              </button>
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <div className="field-label">Teams</div>
              <div className="tone-row">
                <button className="tone-pill active">All teams</button>
                <button className="tone-pill">Tier 1 Support</button>
                <button className="tone-pill">Returns Team</button>
                <button className="tone-pill"><Icon name="plus" size={11} /> Add team</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Version history */}
      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Version History</h3>
        </div>
        <div className="version-row current">
          <span className="v">v3 · current</span>
          <div className="note">Add damaged items branch with human handoff<small>Deployed by Amisha on May 19, 2026</small></div>
          <span className="status-pill live"><span className="pulse"></span>Live</span>
          <button className="btn ghost sm"><Icon name="moreV" size={13} /></button>
        </div>
        <div className="version-row">
          <span className="v">v2</span>
          <div className="note">Refine refund eligibility wording<small>Deployed by Amisha on May 12, 2026</small></div>
          <span className="chip">Archived</span>
          <button className="btn ghost sm"><Icon name="rotate" size={13} /></button>
        </div>
        <div className="version-row">
          <span className="v">v1</span>
          <div className="note">Initial deployment<small>Deployed by Priya on May 5, 2026</small></div>
          <span className="chip">Archived</span>
          <button className="btn ghost sm"><Icon name="rotate" size={13} /></button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 18 }}>
        <button className="btn ghost" onClick={() => navigate(`automation:${automation.id}:test`)}>
          <Icon name="chevLeft" size={13} /> Back to Test
        </button>
        {automation.firstRunMode ? (
          <button className="btn success" onClick={onActivate}>
            <Icon name="play" size={13} /> Activate & go live
          </button>
        ) : (
          <button className="btn success">
            <Icon name="play" size={13} /> Save & redeploy
          </button>
        )}
      </div>
    </>
  );
};

// Tiny toggle primitive
const Toggle = ({ active, onChange }) => (
  <button
    onClick={() => onChange(!active)}
    style={{
      width: 38, height: 22, borderRadius: 999,
      background: active ? "var(--blue-70)" : "var(--gray-50)",
      border: "none", cursor: "pointer",
      position: "relative", transition: "background 160ms",
    }}
  >
    <span style={{
      position: "absolute", left: active ? 18 : 2, top: 2,
      width: 18, height: 18, borderRadius: 999,
      background: "#fff", transition: "left 160ms",
      boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
    }} />
  </button>
);

Object.assign(window, { DeployScreen, Toggle });
