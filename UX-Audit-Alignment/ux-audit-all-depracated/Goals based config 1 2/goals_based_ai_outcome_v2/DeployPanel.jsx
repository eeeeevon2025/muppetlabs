// Deploy stage — final step in the Set Goals flow. Mirrors the Refund Order
// deploy screen the user shared: notes, conditions, smart routing, eval recap,
// version history.

const FIELD_OPTIONS = [
  { id: "conversation_channel", label: "Conversation · Channel",  type: "multi", options: ["Chat", "Email", "SMS", "Voice", "Instagram", "WhatsApp"] },
  { id: "conversation_brand",   label: "Conversation · Brand",    type: "multi", options: ["default", "Acme Outdoors", "Acme Pro"] },
  { id: "message_body",         label: "Message · Body",          type: "contains" },
  { id: "customer_locale",      label: "Customer · Locale",       type: "multi", options: ["en-US", "en-GB", "es-MX", "fr-FR"] },
  { id: "customer_vip",         label: "Customer · VIP",          type: "bool" },
];

const VERSION_HISTORY = [
  { v: 3, when: "03/04/2026 4:03 PM", by: "Amisha Sharma", email: "amisha.sharma@kustomer.com", note: "No deploy note" },
  { v: 2, when: "03/04/2026 3:42 PM", by: "Amisha Sharma", email: "amisha.sharma@kustomer.com", note: "No deploy note" },
  { v: 1, when: "03/01/2026 2:18 PM", by: "Amisha Sharma", email: "amisha.sharma@kustomer.com", note: "Initial deploy" },
];

const DeployPanel = ({ onBack }) => {
  const [notes, setNotes] = React.useState("");
  const [allRules, setAllRules] = React.useState([
    { id: "r_chan", field: "conversation_channel", op: "is_one_of", values: ["Chat"] },
  ]);
  const [anyRules, setAnyRules] = React.useState([
    { id: "r_body", field: "message_body", op: "contains", values: ["order"] },
  ]);
  const [routing, setRouting] = React.useState("Order status, refunds, and tracking. Defer billing escalations to a human.");
  const [copilot, setCopilot] = React.useState({
    enabled: true,
    proactive: true,
    mode: "full",   // "essentials" | "full"
    teams: "all",   // "all" or comma list (mock)
  });
  const setCopilotKey = (k, v) => setCopilot(c => ({ ...c, [k]: v }));
  const [deployed, setDeployed] = React.useState(false);

  const addRule = (setter) => {
    setter(list => [...list, { id: `r_${Date.now()}`, field: "message_body", op: "contains", values: [""] }]);
  };
  const removeRule = (setter, id) => setter(list => list.filter(r => r.id !== id));
  const updateRule = (setter, id, patch) => setter(list => list.map(r => r.id === id ? { ...r, ...patch } : r));

  const canDeploy = (allRules.length + anyRules.length) > 0;

  const onDeploy = () => {
    if (!canDeploy) return;
    setDeployed(true);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "40px 48px 100px", minWidth: 520, background: "#fff" }}>
      <div style={{ maxWidth: 1100 }}>
        {/* Step pill */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          padding: "4px 12px",
          background: "#EBF1FF", border: "1px solid #CBDCFF",
          color: "#0E3280",
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.02em",
          borderRadius: 999, marginBottom: 16,
        }}>Step 4 of 5</div>

        {/* Heading */}
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: 22, lineHeight: 1.2, color: "#1F242D",
          letterSpacing: "-0.005em",
          marginBottom: 6,
        }}>Deploy Your AI Automation</h1>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, color: "#5F6675", lineHeight: 1.55,
          maxWidth: 720, marginBottom: 30,
        }}>
          Configure deployment conditions and deploy your AI automation.
        </div>

        {/* === AI for Customers ============================================ */}
        <AudienceSectionBanner audience="aic" subtitle="Autonomous reply, deflection, and AI-led conversations."/>

        {/* Deploy Notes */}
        <DeploySectionHeader title="Deploy Notes" desc="Add optional notes describing the changes in this deployment."/>
        <div style={{ position: "relative", marginBottom: 36 }}>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value.slice(0, 1024))}
            placeholder="Describe what changed in this deployment..."
            rows={2}
            style={{
              width: "100%", padding: "8px 12px",
              border: "1px solid #DCE0E9", borderRadius: 8,
              fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5,
              color: "#1F242D", outline: "none", background: "#fff",
              boxSizing: "border-box", resize: "vertical",
              minHeight: 56,
            }}/>
          <div style={{
            position: "absolute", right: 10, bottom: 6,
            fontFamily: "var(--font-sans)", fontSize: 10.5, color: "#9099AB",
          }}>{1024 - notes.length}</div>
        </div>

        {/* Conditions */}
        <DeploySectionHeader
          title="Conditions"
          desc="The AI automation will respond to the conversations that match the following conditions. At least one condition must be included in order to deploy the automation."
        />
        <div style={{ marginBottom: 32 }}>
          <RuleGroup
            label="Matches ALL of the following"
            rules={allRules}
            onAdd={() => addRule(setAllRules)}
            onUpdate={(id, patch) => updateRule(setAllRules, id, patch)}
            onRemove={(id) => removeRule(setAllRules, id)}
          />
          <div style={{ height: 18 }}/>
          <RuleGroup
            label="Matches ANY of the following"
            rules={anyRules}
            onAdd={() => addRule(setAnyRules)}
            onUpdate={(id, patch) => updateRule(setAnyRules, id, patch)}
            onRemove={(id) => removeRule(setAnyRules, id)}
          />
        </div>

        {/* Smart Routing */}
        <DeploySectionHeader
          title="Smart Routing"
          desc="Define the conversations Kustomer AI should handle. If the conversation matches your rules, AI responds. If it doesn't match, it routes to a human agent. Smart Routing may ask follow-up questions up to three times if intent is unclear."
        />
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px",
            background: "#E8F5EE", color: "#1F7A4B",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
            borderRadius: 999,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1F7A4B" }}/>
            Match → AI handles
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px",
            background: "#F2F3F7", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
            borderRadius: 999,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9099AB" }}/>
            No match → Human agent
          </span>
        </div>
        <div style={{ position: "relative", marginBottom: 36 }}>
          <textarea
            value={routing}
            onChange={e => setRouting(e.target.value.slice(0, 1024))}
            rows={4}
            style={{
              width: "100%", padding: "12px 14px",
              border: "1px solid #DCE0E9", borderRadius: 8,
              fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.55,
              color: "#1F242D", outline: "none", background: "#fff",
              boxSizing: "border-box", resize: "vertical",
              minHeight: 96,
            }}/>
          <div style={{
            position: "absolute", right: 12, bottom: 8,
            fontFamily: "var(--font-sans)", fontSize: 11, color: "#9099AB",
          }}>{1024 - routing.length}</div>
        </div>

        {/* Review Evaluations */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <DeploySectionHeader
            title="Review Evaluations"
            desc="Review the latest evaluation scores and refine as needed. A score of 80% and above across all categories is recommended."
            noMargin
          />
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "6px 8px",
            border: 0, background: "transparent",
            color: "#0165E4",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            cursor: "pointer", flexShrink: 0,
          }}>
            Go to Test
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div style={{
          marginTop: 14, marginBottom: 36,
          border: "1px solid #E8EAF0", borderRadius: 8, background: "#fff", overflow: "hidden",
        }}>
          <div style={{
            padding: "10px 16px", background: "#FAFBFD",
            borderBottom: "1px solid #E8EAF0",
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
            color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>Test categories</div>
          <EvalSummaryRow label="Standard Refund Requests" cases={5} score={92} when="Just now"/>
          <EvalSummaryRow label="Damaged or Defective Items" cases={4} score={94} when="Just now"/>
          <EvalSummaryRow label="Late Delivery Refunds" cases={3} score={74} when="Just now" tone="warning"/>
          <EvalSummaryRow label="Order Tracking & Status" cases={6} score={96} when="Just now"/>
          <EvalSummaryRow label="Identity & Account Access" cases={4} score={41} when="Just now" tone="fail" isLast/>
        </div>

        {/* === AI for Reps ================================================= */}
        <AudienceSectionBanner audience="air" subtitle="Rep-facing assistance: Copilot, suggestions, and signals."/>

        <div style={{ marginBottom: 36 }}>
          {/* Turn on Copilot */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16,
                color: "#1F242D", marginBottom: 6,
              }}>Turn on Copilot</div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.55,
                maxWidth: 640, marginBottom: 12,
              }}>
                An AI assistant that leverages your organization's content, knowledge sources, and past
                conversations to help agents quickly answer inquiries and take action when needed.
              </div>
              <button style={{
                padding: "7px 14px",
                border: "1.5px solid #0165E4", background: "#fff",
                color: "#0165E4",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                borderRadius: 8, cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#EBF1FF"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                Observe Copilot
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingTop: 2 }}>
              <ToggleSwitch checked={copilot.enabled} onChange={v => setCopilotKey("enabled", v)}/>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D" }}>
                Turn on Copilot
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#E8EAF0", margin: "18px 0 18px" }}/>

          {/* Enable Proactive Suggestions */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, opacity: copilot.enabled ? 1 : 0.55 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15,
                color: "#1F242D", marginBottom: 6,
              }}>Enable Proactive Suggestions</div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.55,
                maxWidth: 640, marginBottom: 14,
              }}>
                Let Copilot proactively suggest replies and next-best actions to reps as they work through a conversation.
              </div>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 2 }}>
              <ToggleSwitch checked={copilot.proactive} disabled={!copilot.enabled} onChange={v => setCopilotKey("proactive", v)}/>
            </div>
          </div>

          {/* Mode picker — Essentials / Full Context */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            opacity: copilot.enabled && copilot.proactive ? 1 : 0.55,
            marginTop: 4,
          }}>
            <CopilotModeCard
              selected={copilot.mode === "essentials"}
              onSelect={() => setCopilotKey("mode", "essentials")}
              disabled={!copilot.enabled || !copilot.proactive}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2 4 14h7l-1 8 7-12h-7l1-8z"/></svg>
              )}
              title="Essentials"
              desc="Uses conversation, customer, and writing guidance as context. Faster, suggests replies only."
            />
            <CopilotModeCard
              selected={copilot.mode === "full"}
              onSelect={() => setCopilotKey("mode", "full")}
              disabled={!copilot.enabled || !copilot.proactive}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
              title="Full Context"
              desc="Uses your full Copilot configuration including AI Agents, Writing Guidance, and knowledge sources. Slower, suggests replies and actions."
            />
          </div>

          {/* Teams */}
          <div style={{ marginTop: 26, opacity: copilot.enabled ? 1 : 0.55 }}>
            <div style={{
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15,
              color: "#1F242D", marginBottom: 6,
            }}>Teams</div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.55,
              marginBottom: 10,
            }}>
              Choose which teams can use Copilot. If you don't select any, all teams will have access to Copilot.
            </div>
            <TeamsSelect value={copilot.teams} disabled={!copilot.enabled} onChange={v => setCopilotKey("teams", v)}/>
          </div>
        </div>

        {/* Version History */}
        <DeploySectionHeader
          title="Version History"
          desc="View and restore previous versions of your AI."
        />
        <div style={{
          marginTop: 14, marginBottom: 36,
          border: "1px solid #E8EAF0", borderRadius: 8, background: "#fff", overflow: "hidden",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 60px",
            gap: 16, padding: "10px 16px", background: "#FAFBFD",
            borderBottom: "1px solid #E8EAF0",
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
            color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            <div>Version</div>
            <div>Deployed</div>
            <div>Deployed By</div>
            <div>Deployment Note</div>
            <div></div>
          </div>
          {VERSION_HISTORY.map((v, i) => (
            <VersionRow key={v.v} version={v} isLast={i === VERSION_HISTORY.length - 1}/>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            border: "1px solid #DCE0E9", background: "#fff", color: "#5F6675",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            borderRadius: 8, cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Test & Evaluate
          </button>
          <button onClick={onDeploy} disabled={!canDeploy} style={{
            padding: "10px 24px",
            border: 0,
            background: deployed ? "#16A36B" : (canDeploy ? "#0165E4" : "#DCE0E9"),
            color: "#fff",
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600,
            borderRadius: 8,
            cursor: canDeploy ? "pointer" : "not-allowed",
            boxShadow: canDeploy ? "0 1px 2px rgba(1,101,228,0.25)" : "none",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            {deployed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            )}
            {deployed ? "Deployed" : "Deploy"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeploySectionHeader = ({ title, desc, noMargin }) => (
  <div style={{ marginBottom: noMargin ? 0 : 14 }}>
    <h2 style={{
      margin: 0,
      fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16,
      color: "#1F242D", marginBottom: 6,
    }}>{title}</h2>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.55,
      maxWidth: 760,
    }}>{desc}</div>
  </div>
);

const RuleGroup = ({ label, rules, onAdd, onUpdate, onRemove }) => (
  <div>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
      color: "#1F242D", marginBottom: 8,
    }}>{label}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rules.map(r => (
        <RuleRow key={r.id} rule={r}
          onUpdate={(patch) => onUpdate(r.id, patch)}
          onRemove={() => onRemove(r.id)}/>
      ))}
    </div>
    <button onClick={onAdd} style={{
      marginTop: 10,
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "5px 8px",
      border: 0, background: "transparent",
      color: "#0165E4",
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
      cursor: "pointer",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Add
    </button>
  </div>
);

const RuleRow = ({ rule, onUpdate, onRemove }) => {
  const fieldOpt = FIELD_OPTIONS.find(f => f.id === rule.field) || FIELD_OPTIONS[0];
  const [fieldText, op] = fieldOpt.label.split(" · ").length === 2
    ? fieldOpt.label.split(" · ")
    : [fieldOpt.label, ""];
  const opLabel = rule.op === "is_one_of" ? "Is One Of" :
                  rule.op === "is_not"    ? "Is Not"    :
                  rule.op === "contains"  ? "Contains"  :
                  rule.op === "equals"    ? "Equals"    : rule.op;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      padding: "8px 12px",
      border: "1px solid #DCE0E9", borderRadius: 8,
      background: "#fff",
    }}>
      <RuleSegment>
        {fieldText.split(" · ")[0]}
      </RuleSegment>
      {op && <RuleSegment subtle>{op}</RuleSegment>}
      <RuleSegment subtle>{opLabel}</RuleSegment>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {(rule.values || []).map((v, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 8px 3px 10px",
            background: "#F2F3F7", color: "#1F242D",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
            borderRadius: 6,
          }}>
            {v}
            <button onClick={() => onUpdate({ values: rule.values.filter((_, j) => j !== i) })} style={{
              display: "inline-flex", alignItems: "center",
              border: 0, background: "transparent", color: "#697182",
              cursor: "pointer", padding: 0,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
      <button onClick={onRemove} title="Remove rule" style={{
        width: 26, height: 26, borderRadius: 6,
        border: 0, background: "transparent", color: "#9099AB",
        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F2F3F7"; e.currentTarget.style.color = "#3F4654"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9099AB"; }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
};

const RuleSegment = ({ children, subtle }) => (
  <span style={{
    fontFamily: "var(--font-sans)", fontSize: 13,
    fontWeight: subtle ? 500 : 700,
    color: subtle ? "#697182" : "#1F242D",
  }}>{children}</span>
);

const EvalSummaryRow = ({ label, cases, score, when, tone, isLast }) => {
  const palette =
    tone === "fail"    ? { bg: "#FFEDED", fg: "#A8202A" } :
    tone === "warning" ? { bg: "#FFF4E6", fg: "#8A5A08" } :
                         { bg: "#E8F5EE", fg: "#1F7A4B" };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 100px 90px",
      gap: 16, padding: "11px 16px",
      borderTop: "1px solid #F0F2F6",
      alignItems: "center",
    }}>
      <div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
        }}>{label} <span style={{ color: "#9099AB", fontWeight: 500, fontSize: 12 }}>· {cases} test cases</span></div>
        <div style={{
          marginTop: 2,
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182",
        }}>Last run {when}</div>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182" }}/>
      <div style={{ textAlign: "right" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px",
          background: palette.bg, color: palette.fg,
          fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
          borderRadius: 999,
        }}>{score}%</span>
      </div>
    </div>
  );
};

const VersionRow = ({ version, isLast }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 60px",
    gap: 16, padding: "12px 16px",
    alignItems: "center",
    borderTop: "1px solid #F0F2F6",
  }}>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D",
    }}>{version.v}</div>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#3F4654" }}>{version.when}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        width: 24, height: 24, borderRadius: "50%",
        background: "#FFE0B2", color: "#8A5A08",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
        flexShrink: 0,
      }}>{version.by.split(" ").map(s => s[0]).join("").slice(0, 2)}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D" }}>{version.by}</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 11.5, color: "#697182",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{version.email}</div>
      </div>
    </div>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182",
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    }}>{version.note}</div>
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button title="Restore this version" style={{
        width: 28, height: 28, borderRadius: 6,
        border: 0, background: "transparent", color: "#697182",
        cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F2F3F7"; e.currentTarget.style.color = "#0165E4"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#697182"; }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
    </div>
  </div>
);

Object.assign(window, { DeployPanel });

// Section banner for the two audience areas on Deploy.
const AudienceSectionBanner = ({ audience, subtitle }) => {
  const palette = audience === "air"
    ? { bg: "#F5EBFD", border: "#EBD2FF", fg: "#5E1D7D", pillBg: "#7B22A4", label: "AI for Reps" }
    : { bg: "#EBF1FF", border: "#CBDCFF", fg: "#0E3280", pillBg: "#0165E4", label: "AI for Customers" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 14px",
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: 8,
      marginTop: 8, marginBottom: 22,
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center",
        padding: "3px 10px",
        background: palette.pillBg, color: "#fff",
        fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.02em",
        borderRadius: 999,
      }}>{palette.label}</span>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: palette.fg,
      }}>{subtitle}</span>
    </div>
  );
};

const CopilotToggleRow = ({ title, desc, checked, onChange, disabled, isFirst }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 16,
    padding: "12px 16px",
    borderTop: isFirst ? 0 : "1px solid #F0F2F6",
    opacity: disabled ? 0.55 : 1,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
        marginBottom: 2,
      }}>{title}</div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.5,
      }}>{desc}</div>
    </div>
    <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled}/>
  </div>
);

const CopilotModeCard = ({ selected, onSelect, disabled, icon, title, desc }) => (
  <button
    onClick={() => !disabled && onSelect()}
    disabled={disabled}
    style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      textAlign: "left",
      padding: "12px 14px",
      border: selected ? "1.5px solid #0165E4" : "1px solid #E8EAF0",
      background: selected ? "#F5F9FF" : "#fff",
      borderRadius: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 140ms",
      width: "100%",
    }}>
    <span style={{
      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
      border: selected ? "5px solid #0165E4" : "1.5px solid #B3BBCB",
      background: "#fff",
      marginTop: 2,
    }}/>
    <span style={{
      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
      background: selected ? "#DBE7FF" : "#F2F3F7",
      color: selected ? "#0165E4" : "#5F6675",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      marginTop: 1,
    }}>{icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 700, color: "#1F242D",
        marginBottom: 2,
      }}>{title}</div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 12.5, color: "#697182", lineHeight: 1.5,
      }}>{desc}</div>
    </div>
  </button>
);

const TeamsSelect = ({ value, disabled, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const options = [
    { id: "all", label: "All teams selected (default)" },
    { id: "tier1", label: "Tier 1 Support" },
    { id: "tier2", label: "Tier 2 Support" },
    { id: "vip", label: "VIP Concierge" },
  ];
  const current = options.find(o => o.id === value) || options[0];
  return (
    <div style={{ position: "relative", maxWidth: 420 }}>
      <button type="button" onClick={() => !disabled && setOpen(v => !v)} disabled={disabled}
        style={{
          width: "100%", padding: "10px 12px",
          border: "1px solid #DCE0E9", borderRadius: 8,
          background: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
        }}>
        <span>{current.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #DCE0E9", borderRadius: 8,
          boxShadow: "0 8px 24px rgba(31,42,46,0.10)",
          zIndex: 10, overflow: "hidden",
        }}>
          {options.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "9px 12px",
              border: 0,
              background: o.id === value ? "#EBF1FF" : "transparent",
              fontFamily: "var(--font-sans)", fontSize: 13,
              color: o.id === value ? "#0165E4" : "#1F242D",
              fontWeight: o.id === value ? 600 : 500,
              textAlign: "left", cursor: "pointer",
            }}
              onMouseEnter={e => { if (o.id !== value) e.currentTarget.style.background = "#F2F3F7"; }}
              onMouseLeave={e => { if (o.id !== value) e.currentTarget.style.background = "transparent"; }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    style={{
      width: 36, height: 20, flexShrink: 0,
      borderRadius: 999, border: 0,
      background: checked ? "#0165E4" : "#DCE0E9",
      cursor: disabled ? "not-allowed" : "pointer",
      position: "relative",
      transition: "background 140ms",
      padding: 0,
    }}
    aria-pressed={checked}
  >
    <span style={{
      position: "absolute",
      top: 2, left: checked ? 18 : 2,
      width: 16, height: 16, borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 2px rgba(31,42,46,0.18)",
      transition: "left 140ms",
    }}/>
  </button>
);
