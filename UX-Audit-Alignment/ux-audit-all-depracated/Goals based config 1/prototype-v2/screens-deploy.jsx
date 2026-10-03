// ============================================================
// Deploy tab, cross-audience (AIC + AIR)
// ============================================================

const DeployScreen = ({ automation, navigate, onActivate, flags = {} }) => {
  const [deployNotes, setDeployNotes] = useState(
    automation.firstRunMode
      ? `Initial deployment of ${automation.name}. ${automation.drives.length > 0 ? `Drives: ${automation.drives.join(", ")}.` : ""} Damaged-item edge cases will route to human via auto-generated routing rule.`
      : "Add damaged items branch with human handoff. Refines refund eligibility wording."
  );
  const [smartRouting, setSmartRouting] = useState(
    "Order status, refunds, and tracking questions for customers in our standard tier. Defer billing escalations and customers with active legal escalation flags to a human."
  );
  const [copilotOn, setCopilotOn] = useState(true);
  const [copilotMode, setCopilotMode] = useState("essentials");
  const isAIR = automation.audience === "AIR";
  const isAIC = automation.audience === "AIC";

  // C-1 · Rollout-strategy state (only meaningful when activateSequence is on)
  const [environment, setEnvironment] = useState("sandbox");
  const [rolloutPct, setRolloutPct] = useState(5);
  const [holdback, setHoldback] = useState("vip-tier");

  // C-6 · Reviewer-approval state
  const [reviewer, setReviewer] = useState("");
  const [reviewState, setReviewState] = useState("none"); // none | pending | approved

  // Composite gate: can we activate?
  const reviewRequired = flags.reviewerApproval;
  const reviewSatisfied = !reviewRequired || reviewState === "approved";
  const sequenceComplete = !flags.activateSequence || (environment === "production" && rolloutPct === 100);
  const canActivate = reviewSatisfied;

  const requestReview = () => {
    if (!reviewer.trim()) return;
    setReviewState("pending");
    // simulate reviewer approving after a beat
    setTimeout(() => setReviewState("approved"), 1400);
  };

  const bumpRollout = () => {
    const ladder = [0, 1, 5, 25, 50, 100];
    const idx = ladder.indexOf(rolloutPct);
    if (idx >= 0 && idx < ladder.length - 1) setRolloutPct(ladder[idx + 1]);
  };

  return (
    <>
      <div className="card-row" style={{ marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Deploy your AI Automation</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-60)" }}>
            {isAIR
              ? "Configure where Copilot assists your reps, then activate."
              : <>Configure deployment conditions and deploy this automation to {automation.drives.length > 0 ? automation.drives.join(" + ") : "your customers"}.</>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn ghost">Save draft</button>
          {flags.reviewerApproval && reviewState === "pending" ? (
            <button className="btn" disabled>
              <Icon name="clock" size={13} /> Pending review…
            </button>
          ) : (
            <button
              className="btn success"
              disabled={!canActivate}
              onClick={onActivate}
              title={!canActivate ? "Reviewer approval required" : ""}
            >
              <Icon name="play" size={13} /> Activate
            </button>
          )}
        </div>
      </div>

      {/* C-1 · Rollout strategy (flag-gated) */}
      {flags.activateSequence && (
        <div className="guidance-section flag-c1">
          <div className="guidance-section-head">
            <h3><Icon name="rocket" size={13} /> Rollout strategy <span className="flag-pill">C-1</span></h3>
            <div className="meta">Environment, holdback, and percentage rollout</div>
          </div>
          <div className="rollout-grid">
            <div className="rollout-field">
              <div className="field-label">Environment</div>
              <div className="tone-row">
                {["sandbox", "staging", "production"].map((env) => (
                  <button key={env} className={`tone-pill ${environment === env ? "active" : ""}`} onClick={() => setEnvironment(env)}>
                    {env === "sandbox" && <Icon name="shield" size={11} />}
                    {env === "staging" && <Icon name="clock" size={11} />}
                    {env === "production" && <Icon name="globe" size={11} />}
                    {env.charAt(0).toUpperCase() + env.slice(1)}
                  </button>
                ))}
              </div>
              <div className="field-hint">
                {environment === "sandbox" && "No customers affected. Internal QA only."}
                {environment === "staging" && "Visible to staged accounts. Customer traffic mirrored, not served."}
                {environment === "production" && "Live customer traffic. Affects matched conversations."}
              </div>
            </div>

            <div className="rollout-field">
              <div className="field-label">Rollout percentage <span className="mono">{rolloutPct}%</span></div>
              <div className="rollout-ladder">
                {[0, 1, 5, 25, 50, 100].map((p) => (
                  <button key={p} className={`rollout-step ${rolloutPct === p ? "active" : ""} ${rolloutPct > p ? "done" : ""}`} onClick={() => setRolloutPct(p)}>
                    {p}%
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <div className="field-hint">Of matched conversations in {environment}.</div>
                {rolloutPct < 100 && (
                  <button className="btn ghost sm" onClick={bumpRollout}>
                    Advance to {[1, 5, 25, 50, 100][Math.max(0, [0, 1, 5, 25, 50, 100].indexOf(rolloutPct))]}% <Icon name="chevRight" size={11} />
                  </button>
                )}
              </div>
            </div>

            <div className="rollout-field">
              <div className="field-label">Holdback group <span style={{ fontWeight: 400, color: "var(--ink-50)" }}>— customers kept off the AI</span></div>
              <select className="text" value={holdback} onChange={(e) => setHoldback(e.target.value)}>
                <option value="vip-tier">VIP tier (excluded · ~1.2% of volume)</option>
                <option value="legal-flag">Active legal-escalation flag (excluded)</option>
                <option value="none">No holdback</option>
                <option value="custom">Custom segment…</option>
              </select>
              <div className="field-hint">Conversations matching the holdback continue to route to humans.</div>
            </div>
          </div>
        </div>
      )}

      {/* C-6 · Reviewer approval (flag-gated) */}
      {flags.reviewerApproval && (
        <div className="guidance-section flag-c6">
          <div className="guidance-section-head">
            <h3><Icon name="user" size={13} /> Reviewer approval <span className="flag-pill">C-6</span></h3>
            <div className="meta">Two-person rule for production activation</div>
          </div>
          <div className="reviewer-row">
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <div className="field-label">Assigned reviewer</div>
              <select className="text" value={reviewer} onChange={(e) => setReviewer(e.target.value)} disabled={reviewState !== "none"}>
                <option value="">Pick a reviewer with AI Reviewer role…</option>
                <option value="maria">Maria Chen · AI Reviewer</option>
                <option value="jordan">Jordan Patel · AI Reviewer</option>
                <option value="priya">Priya Singh · Org Admin</option>
              </select>
            </div>
            <div className="reviewer-state">
              {reviewState === "none" && (
                <button className="btn primary" disabled={!reviewer} onClick={requestReview}>
                  <Icon name="send" size={12} /> Request review
                </button>
              )}
              {reviewState === "pending" && (
                <span className="chip warn"><span className="spin"></span> Pending review</span>
              )}
              {reviewState === "approved" && (
                <span className="chip good"><Icon name="check" size={11} /> Approved by {reviewer}</span>
              )}
            </div>
          </div>
          {reviewState === "approved" && (
            <div className="field-hint" style={{ marginTop: 10 }}>
              Audit record created. Activation is now unlocked.
            </div>
          )}
        </div>
      )}

      {/* Active state banner */}
      {automation.status === "live" && (
        <div style={{ background: "var(--good-bg)", border: "1px solid var(--good-edge)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 12.5, color: "var(--good)", display: "flex", alignItems: "center", gap: 10 }}>
          <span className="status-pill live" style={{ background: "transparent", padding: 0 }}><span className="pulse"></span></span>
          <span><b>Active</b>, Last deployed by Amisha on May 19, 2026 at 3:42 PM</span>
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
      {isAIC && (
      <>
      <div className="audience-banner aic">
        <Icon name="sparkles" size={14} /> Customer AI
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
          <div className="meta">In plain words, tell the AI what to handle and what to send to a human</div>
        </div>
        <textarea className="text" rows="3" value={smartRouting} onChange={(e) => setSmartRouting(e.target.value)} />
        <div style={{ display: "flex", gap: 14, marginTop: 12, alignItems: "center", fontSize: 12.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "var(--good-bg)", color: "var(--good)", borderRadius: 999, fontWeight: 500 }}>
            <Icon name="check" size={12} /> Match → AI handles
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "var(--v2-paper-3)", color: "var(--ink-80)", borderRadius: 999, fontWeight: 500 }}>
            <Icon name="user" size={12} /> No match → Human agent
          </div>
        </div>
      </div>

      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Review Evaluations</h3>
          <div className="meta"><a style={{ color: "var(--ink-100)", cursor: "pointer", fontWeight: 500 }} onClick={() => navigate(`automation:${automation.id}:test`)}>Go to Test →</a></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={{ padding: "12px 14px", background: "var(--v2-paper-2)", borderRadius: 8, border: "1px solid var(--v2-hairline)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-50)", letterSpacing: 0.5, textTransform: "uppercase" }}>Categories</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--ink-100)" }}>6</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-50)" }}>5 passing, 1 failing</div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--v2-paper-2)", borderRadius: 8, border: "1px solid var(--v2-hairline)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-50)", letterSpacing: 0.5, textTransform: "uppercase" }}>Avg score</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "var(--good)" }}>67%</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-50)" }}>Last run 2h ago</div>
          </div>
          <div style={{ padding: "12px 14px", background: "var(--v2-paper-2)", borderRadius: 8, border: "1px solid var(--v2-hairline)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-50)", letterSpacing: 0.5, textTransform: "uppercase" }}>Failing</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bad)", marginTop: 4 }}>Damaged or Defective Items</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-50)" }}>23% pass rate</div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* AIR section banner */}
      {isAIR && (
      <>
      <div className="audience-banner air">
        <Icon name="headset" size={14} /> Rep AI (Copilot)
      </div>

      <div className="guidance-section">
        <div className="guidance-section-head">
          <h3>Copilot</h3>
          <div className="meta">Help your reps reply faster, summarize, surface signals</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-100)" }}>Turn on Copilot for this automation's conversations</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-50)", marginTop: 2 }}>Copilot assists the rep with drafts, summaries, and signals while they stay in control of every send.</div>
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
      </>
      )}

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
          <button className="btn success" disabled={!canActivate} onClick={onActivate}>
            <Icon name="play" size={13} /> {flags.activateSequence ? `Activate at ${rolloutPct}% in ${environment}` : "Activate & go live"}
          </button>
        ) : (
          <button className="btn success" disabled={!canActivate}>
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
      background: active ? "var(--accent-solid)" : "var(--v2-hairline-3)",
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
