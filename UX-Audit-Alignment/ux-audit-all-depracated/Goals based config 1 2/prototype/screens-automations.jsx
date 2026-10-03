// ============================================================
// Automations list — single destination, replaces AIC selector + Manage Automations
// ============================================================

const AutomationsList = ({ automations, navigate, onNewAutomation }) => {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("all");
  const [state, setState] = useState("all");

  const filtered = automations.filter((a) => {
    if (audience !== "all" && a.audience !== audience) return false;
    if (state !== "all" && a.status !== state) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: automations.length,
    live: automations.filter((a) => a.status === "live").length,
    testing: automations.filter((a) => a.status === "testing").length,
    attention: automations.filter((a) => a.status === "attention").length,
    draft: automations.filter((a) => a.status === "draft").length,
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "AI for Customers" }, { label: "Automations" }]}
        title="Automations"
        answers={'"What AI automations are running, and how are they doing?"'}
        actions={
          <>
            <button className="btn"><Icon name="filter" size={14} /> Bulk</button>
            <button className="btn brand" onClick={onNewAutomation}>
              <Icon name="plus" size={14} /> New automation
            </button>
          </>
        }
      />
      <div className="page-body">
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search automations…" />
          <Facet active={state === "all"} count={counts.all} onClick={() => setState("all")}>All</Facet>
          <Facet active={state === "live"} count={counts.live} onClick={() => setState("live")}>Live</Facet>
          <Facet active={state === "testing"} count={counts.testing} onClick={() => setState("testing")}>Testing</Facet>
          <Facet active={state === "attention"} count={counts.attention} onClick={() => setState("attention")}>Needs attention</Facet>
          <Facet active={state === "draft"} count={counts.draft} onClick={() => setState("draft")}>Draft</Facet>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-90)" }}>Sort: Recently modified ▾</span>
        </Toolbar>

        <div className="table">
          <div className="thead" style={{ gridTemplateColumns: "1.6fr 80px 130px 1.4fr 120px 60px" }}>
            <div className="cell">Automation</div>
            <div className="cell">Audience</div>
            <div className="cell">Status</div>
            <div className="cell">Drives</div>
            <div className="cell">Modified</div>
            <div className="cell"></div>
          </div>
          {filtered.map((a) => (
            <div
              key={a.id}
              className="trow"
              style={{ gridTemplateColumns: "1.6fr 80px 130px 1.4fr 120px 60px" }}
              onClick={() => navigate(`automation:${a.id}:${a.firstRunMode ? "build" : "analyze"}`)}
            >
              <div className="cell">
                <b>{a.name}</b>
                <small>{a.type} · {a.version}{a.firstRunMode ? " · setting up" : ""}</small>
              </div>
              <div className="cell"><AudienceChip audience={a.audience} /></div>
              <div className="cell"><StatusPill status={a.status} /></div>
              <div className="cell">
                {a.drives.length === 0 ? (
                  <span style={{ color: "var(--gray-90)", fontStyle: "italic", fontSize: 12 }}>No goals attached</span>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {a.drives.map((g) => <GoalChip key={g} name={g} />)}
                  </div>
                )}
              </div>
              <div className="cell">
                {a.modified}
                <small>{a.modifiedBy}</small>
              </div>
              <div className="cell right">
                <button className="btn ghost sm" onClick={(e) => e.stopPropagation()}>
                  <Icon name="moreV" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------
// Automation shell — owns the tab bar + first-time mode stepper
// ---------------------------------------------------------------
const AutomationShell = ({ automation, tab, navigate, children, rightRail }) => {
  const inFirstRun = automation.firstRunMode;
  const stepOrder = ["build", "test", "deploy", "analyze"];
  const currentIdx = stepOrder.indexOf(tab);

  const tabs = [
    { id: "build", label: "Build" },
    { id: "test", label: "Test" },
    { id: "deploy", label: "Deploy" },
    { id: "analyze", label: "Analyze" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "AI for Customers" },
          { label: "Automations", onClick: () => navigate("automations") },
          { label: automation.name },
        ]}
        title={automation.name}
        answers={'"Is this specific automation behaving?"'}
        actions={
          <>
            <AudienceChip audience={automation.audience} />
            <StatusPill status={automation.status} />
            <button className="btn"><Icon name="moreV" size={14} /></button>
          </>
        }
      />
      <div className="tabs">
        {tabs.map((t) => {
          const isLocked = inFirstRun && stepOrder.indexOf(t.id) > currentIdx + 1 && t.id !== "settings";
          const isActive = t.id === tab;
          return (
            <div
              key={t.id}
              className={`tab ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
              onClick={() => !isLocked && navigate(`automation:${automation.id}:${t.id}`)}
              title={isLocked ? "Complete the previous step first" : ""}
            >
              {t.label}
              {isLocked && <Icon name="lock" size={11} />}
              {inFirstRun && isActive && <Icon name="play" size={10} />}
            </div>
          );
        })}
      </div>

      <div className="page-body wide">
        {inFirstRun && tab !== "settings" && (
          <div className="stepper">
            <div className="stepper-info">
              <Icon name="sparkles" size={12} style={{ verticalAlign: "middle" }} /> <b>First-time mode</b> · We'll walk you through Build → Test → Deploy.
            </div>
            <div className="stepper-flow">
              {stepOrder.map((id, i) => {
                const cls = i < currentIdx ? "done" : i === currentIdx ? "current" : "locked";
                const labels = { build: "Build", test: "Test", deploy: "Deploy", analyze: "Analyze" };
                return (
                  <React.Fragment key={id}>
                    {i > 0 && <span className="stepper-arrow">→</span>}
                    <span className={`stepper-step ${cls}`}>
                      <span className="stepper-dot">{cls === "done" ? <Icon name="check" size={9} /> : i + 1}</span>
                      {labels[id]}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {rightRail ? <div className="with-rail">
          <div>{children}</div>
          <RightRail automation={automation} />
        </div> : children}
      </div>
    </>
  );
};

// ---------------------------------------------------------------
// Right rail (Assistant + Test Console)
// ---------------------------------------------------------------
const RightRail = ({ automation }) => {
  const [tab, setTab] = useState("assistant");
  const [messages, setMessages] = useState([
    { who: "ai", text: window.MOCK.ASSISTANT_INITIAL_MESSAGE },
  ]);
  const [draft, setDraft] = useState("");
  const [channel, setChannel] = useState("Chat");

  const send = (text) => {
    if (!text.trim()) return;
    const next = [...messages, { who: "you", text }];
    setMessages(next);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { who: "ai", text: aiResponse(text) }]);
    }, 600);
  };

  const aiResponse = (msg) => {
    const t = msg.toLowerCase();
    if (t.includes("guardrail")) return "Good idea. Try a hard cap rule: if refund_amount > $250 and customer_tier != 'VIP', escalate. I can draft that as a Shared Guardrail — say the word.";
    if (t.includes("tone")) return "Setting tone to a warmer, conversational register usually moves CSAT 0.2–0.4. Try Friendly with 'use the customer's name' enabled. I'll show a preview if you'd like.";
    if (t.includes("vip")) return "Got it. VIP coupon procedure exists — should I add a recommendation step before applying the code? That pattern correlates with +0.8 CSAT in similar accounts.";
    return "Got it. I can draft that as part of the Build tab. Want me to add it to the procedures list above?";
  };

  return (
    <div className="rail-side">
      <div className="rail-side-tabs">
        <div className={`rail-side-tab ${tab === "assistant" ? "active" : ""}`} onClick={() => setTab("assistant")}>
          <Icon name="sparkles" size={11} /> Assistant
        </div>
        <div className={`rail-side-tab ${tab === "test" ? "active" : ""}`} onClick={() => setTab("test")}>
          <Icon name="play" size={11} /> Test Console
        </div>
      </div>

      {tab === "assistant" ? (
        <>
          <div className="rail-side-body">
            {messages.map((m, i) => (
              <div key={i} className={`assistant-msg ${m.who === "you" ? "you" : ""}`}>{m.text}</div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gray-90)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Try asking</div>
              {window.MOCK.RAIL_SUGGESTED_PROMPTS.map((p) => (
                <button key={p} className="assistant-prompt-chip" onClick={() => send(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="rail-side-input">
            <input
              type="text"
              placeholder="Ask the assistant…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(draft)}
            />
            <button className="btn primary sm" onClick={() => send(draft)}><Icon name="send" size={12} /></button>
          </div>
        </>
      ) : (
        <>
          <div className="test-console-channel">
            <span>Channel</span>
            <select className="text" value={channel} onChange={(e) => setChannel(e.target.value)} style={{ padding: "2px 8px", fontSize: 11.5, width: "auto" }}>
              <option>Chat</option>
              <option>Email</option>
              <option>SMS</option>
              <option>Instagram DM</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div className="rail-side-body" style={{ background: "var(--gray-15)" }}>
            <div className="assistant-msg" style={{ background: "#fff" }}>
              <b>Test conversation</b><br />
              Send messages as if you were a customer. The AI responds using this automation's current draft.
            </div>
            <div className="assistant-msg you">Hi, I need a refund for order #88234, it arrived damaged.</div>
            <div className="assistant-msg">
              I'm sorry to hear about your order. Could you share a photo of the damage so I can process this quickly?
            </div>
          </div>
          <div className="rail-side-input">
            <input type="text" placeholder="Send a test message…" />
            <button className="btn primary sm"><Icon name="send" size={12} /></button>
          </div>
        </>
      )}
    </div>
  );
};

Object.assign(window, { AutomationsList, AutomationShell, RightRail });
