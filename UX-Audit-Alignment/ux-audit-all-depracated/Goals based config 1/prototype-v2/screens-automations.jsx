// ============================================================
// Automations list, single destination, replaces AIC selector + Manage Automations
// ============================================================

const AutomationsList = ({ automations, navigate, onNewAutomation, onUseTemplate, onCloneAutomation, showAnswers, sectionLabel = "Customer AI", initialAudience = "all" }) => {
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState(initialAudience);
  const [state, setState] = useState("all");
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [rowMenuId, setRowMenuId] = useState(null);
  const newMenuRef = useRef(null);
  const bulkMenuRef = useRef(null);
  const rowMenuRef = useRef(null);

  // Click-outside for menus
  useEffect(() => {
    const onDoc = (e) => {
      if (newMenuOpen && newMenuRef.current && !newMenuRef.current.contains(e.target)) setNewMenuOpen(false);
      if (bulkMenuOpen && bulkMenuRef.current && !bulkMenuRef.current.contains(e.target)) setBulkMenuOpen(false);
      if (rowMenuId && rowMenuRef.current && !rowMenuRef.current.contains(e.target)) setRowMenuId(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [newMenuOpen, bulkMenuOpen, rowMenuId]);

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
        crumbs={[{ label: sectionLabel }, { label: "Automations" }]}
        title="Automations"
        answers={"AI automations do the work to reach your goals. Each one uses shared building blocks, procedures, knowledge, tools, and guardrails."}
        showAnswers={showAnswers}
        actions={
          <>
            <div className="menu-wrap" ref={newMenuRef}>
              <button className={`btn brand split ${newMenuOpen ? "active" : ""}`}>
                <span className="split-main" onClick={onNewAutomation}>
                  <Icon name="plus" size={14} /> New automation
                </span>
                <span className="split-divider"></span>
                <span className="split-caret" onClick={() => setNewMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={newMenuOpen}>
                  <Icon name="chevDown" size={11} />
                </span>
              </button>
              {newMenuOpen && (
                <div className="menu-pop right">
                  <button className="menu-item" onClick={() => { setNewMenuOpen(false); onNewAutomation(); }}>
                    <Icon name="plus" size={13} />
                    <span>
                      <span className="menu-item-title">From scratch</span>
                      <span className="menu-item-sub">Empty Build tab, set it up step by step</span>
                    </span>
                  </button>
                  <button className="menu-item" onClick={() => { setNewMenuOpen(false); onNewAutomation(); }}>
                    <Icon name="sparkles" size={13} />
                    <span>
                      <span className="menu-item-title">From template</span>
                      <span className="menu-item-sub">Refunds, tracking, FAQs, account, save renewals…</span>
                    </span>
                  </button>
                  <button className="menu-item" onClick={() => { setNewMenuOpen(false); }}>
                    <Icon name="rotate" size={13} />
                    <span>
                      <span className="menu-item-title">Duplicate existing</span>
                      <span className="menu-item-sub">Clone an automation's procedures, KB, tools, guardrails</span>
                    </span>
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item" onClick={() => { setNewMenuOpen(false); }}>
                    <Icon name="upload" size={13} />
                    <span>
                      <span className="menu-item-title">Import from CSV</span>
                      <span className="menu-item-sub">Bulk-create from a spreadsheet</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </>
        }
      />
      <div className="page-body">
        {automations.length === 0 ? (
          <AutomationsEmpty
            onNewAutomation={onNewAutomation}
            onUseTemplate={onUseTemplate}
            navigate={navigate}
          />
        ) : (
        <>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search automations…" />
          <Facet active={state === "all"} count={counts.all} onClick={() => setState("all")}>All</Facet>
          <Facet active={state === "live"} count={counts.live} onClick={() => setState("live")}>Live</Facet>
          <Facet active={state === "testing"} count={counts.testing} onClick={() => setState("testing")}>Testing</Facet>
          <Facet active={state === "attention"} count={counts.attention} onClick={() => setState("attention")}>Needs attention</Facet>
          <Facet active={state === "draft"} count={counts.draft} onClick={() => setState("draft")}>Draft</Facet>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-50)" }}>Sort: Recently modified ▾</span>
        </Toolbar>

        <div className="table">
          <div className="thead" style={{ gridTemplateColumns: "1.6fr 80px 130px 1.4fr 120px 60px" }}>
            <div className="cell">Automation</div>
            <div className="cell">Audience</div>
            <div className="cell">Status</div>
            <div className="cell">Goal it drives</div>
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
                  <span style={{ color: "var(--ink-50)", fontStyle: "italic", fontSize: 12 }}>No goals attached</span>
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
                <div className="menu-wrap" ref={rowMenuId === a.id ? rowMenuRef : null}>
                  <button
                    className={`btn ghost sm ${rowMenuId === a.id ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setRowMenuId(rowMenuId === a.id ? null : a.id); }}
                  >
                    <Icon name="moreV" size={14} />
                  </button>
                  {rowMenuId === a.id && (
                    <div className="menu-pop right" onClick={(e) => e.stopPropagation()}>
                      <button className="menu-item compact" onClick={() => { setRowMenuId(null); navigate(`automation:${a.id}:build`); }}>
                        <Icon name="edit" size={13} /> <span className="menu-item-title">Open in Build</span>
                      </button>
                      <button className="menu-item compact" onClick={() => { setRowMenuId(null); if (typeof onCloneAutomation === "function") onCloneAutomation(a); }}>
                        <Icon name="rotate" size={13} /> <span className="menu-item-title">Duplicate</span>
                      </button>
                      <button className="menu-item compact" onClick={() => setRowMenuId(null)}>
                        <Icon name="send" size={13} /> <span className="menu-item-title">Export config</span>
                      </button>
                      <div className="menu-divider"></div>
                      <button className="menu-item compact danger" onClick={() => setRowMenuId(null)}>
                        <Icon name="trash" size={13} /> <span className="menu-item-title">Archive</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
        )}
      </div>
    </>
  );
};

// ---------------------------------------------------------------
// Empty state, no automations yet
// Mirrors the goals empty state's hi-fi treatment, but tailored to
// the Build → Test → Deploy → Analyze lifecycle (the steps that
// used to live in the standalone AI Setup wizard).
// ---------------------------------------------------------------
const AUTOMATION_TEMPLATES = [
  {
    id: "tpl-refund",
    name: "Refund Order",
    description: "Process eligible refunds end-to-end; escalate damaged items.",
    audience: "AIC",
    accent: "amber",
    drives: ["Reduce refunds 20%"],
    procedures: 4,
    knowledge: 2,
    tools: 3,
  },
  {
    id: "tpl-wismo",
    name: "Order Tracking (WISMO)",
    description: "Look up carrier status, share ETA, file lost-package claims.",
    audience: "AIC",
    accent: "blue",
    drives: ["Auto-resolve tracking"],
    procedures: 3,
    knowledge: 1,
    tools: 2,
  },
  {
    id: "tpl-product",
    name: "Product Questions (Copilot)",
    description: "Suggest replies for product FAQs; hand off complex sizing.",
    audience: "AIR",
    accent: "violet",
    drives: ["Improve CSAT to 4.6"],
    procedures: 2,
    knowledge: 4,
    tools: 1,
  },
];

const AutomationsEmpty = ({ onNewAutomation, onUseTemplate, navigate }) => (
  <div className="aut-empty">
    {/* Hero, same visual language as goals empty */}
    <div className="aut-hero">
      <div className="aut-hero-glow"></div>
      <div className="aut-hero-stage">
        <div className="aut-hero-copy">
          <span className="aut-hero-eyebrow">
            <span className="aut-hero-eyebrow-dot"></span>
            No automations yet
          </span>
          <h2>
            Set up your first<br />
            AI automation.
          </h2>
          <p>
            Every automation moves through the same four steps. Start from
            scratch, a template, or a duplicate, you'll get to a tested,
            production-ready agent in under an hour.
          </p>
          <div className="aut-hero-cta">
            <button className="btn brand" onClick={onNewAutomation}>
              <Icon name="plus" size={13} /> New automation
            </button>
            <button className="btn ghost" onClick={() => navigate("blocks-procedures")}>
              Browse Building Blocks
            </button>
          </div>
          <div className="aut-hero-meta">
            <Icon name="clock" size={11} /> Typical first build · 45 minutes including testing
          </div>
        </div>

        {/* Four-step lifecycle preview, the steps that lived in the old wizard */}
        <div className="aut-hero-steps" aria-hidden="true">
          {[
            { n: "01", t: "Build",   sub: "Procedures, knowledge, tools, guardrails", icon: "code",     accent: "indigo" },
            { n: "02", t: "Test",    sub: "Run against eval suite; review failures",  icon: "play",     accent: "blue" },
            { n: "03", t: "Deploy",  sub: "Sandbox → staging → production",            icon: "rocket",   accent: "amber" },
            { n: "04", t: "Analyze", sub: "Monitors, anomalies, suggestions",          icon: "activity", accent: "green" },
          ].map((s) => (
            <div className={`aut-step accent-${s.accent}`} key={s.n}>
              <div className="aut-step-num">{s.n}</div>
              <div className="aut-step-icon"><Icon name={s.icon} size={14} /></div>
              <div className="aut-step-title">{s.t}</div>
              <div className="aut-step-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Suggested templates */}
    <div className="aut-section-head">
      <div>
        <h3>Start from a template</h3>
        <p>Each template ships with procedures, knowledge, and tools pre-attached. Open one and tune it before deploying.</p>
      </div>
      <span className="aut-suggested-meta">
        <Icon name="sparkles" size={11} /> Suggested from your <b>goals</b> and conversation history
      </span>
    </div>
    <div className="aut-templates">
      {AUTOMATION_TEMPLATES.map((tpl) => (
        <button key={tpl.id} className={`aut-template accent-${tpl.accent}`} onClick={() => (onUseTemplate ? onUseTemplate(tpl) : onNewAutomation())}>
          <div className="aut-tpl-accent"></div>
          <div className="aut-tpl-head">
            <span className="aut-tpl-audience">{tpl.audience === "AIC" ? "Customer AI" : "Rep AI"}</span>
            <span className="aut-tpl-status"><span className="aut-tpl-status-dot"></span> Ready to test</span>
          </div>
          <h4>{tpl.name}</h4>
          <p>{tpl.description}</p>
          <div className="aut-tpl-drives" title={`Goal: ${tpl.drives[0]} — this automation would roll up to this goal`}>
            <span style={{ fontSize: 11.5, color: "var(--ink-50)" }}>Drives</span>
            <span className="goal-pill-inline"><Icon name="target" size={10} /> {tpl.drives[0]}</span>
          </div>
          <div className="aut-tpl-stats">
            <div className="aut-tpl-stat">
              <div className="aut-tpl-stat-val">{tpl.procedures}</div>
              <div className="aut-tpl-stat-lbl">procedures</div>
            </div>
            <div className="aut-tpl-stat">
              <div className="aut-tpl-stat-val">{tpl.knowledge}</div>
              <div className="aut-tpl-stat-lbl">KB articles</div>
            </div>
            <div className="aut-tpl-stat">
              <div className="aut-tpl-stat-val">{tpl.tools}</div>
              <div className="aut-tpl-stat-lbl">tools</div>
            </div>
          </div>
          <div className="aut-tpl-cta">
            Use as starting point <Icon name="chevRight" size={11} />
          </div>
        </button>
      ))}
    </div>

    {/* Ways to start */}
    <div className="aut-section-head" style={{ marginTop: 36 }}>
      <div>
        <h3>Other ways to start</h3>
        <p>Every path lands you on the Build tab and walks you through setup.</p>
      </div>
    </div>
    <div className="aut-ways">
      <button className="aut-way" onClick={onNewAutomation}>
        <div className="aut-way-ico scratch"><Icon name="plus" size={16} /></div>
        <div className="aut-way-body">
          <h4>From scratch</h4>
          <p>Empty Build tab, bring your own procedures, KB, and tools.</p>
        </div>
      </button>
      <button className="aut-way" onClick={onNewAutomation}>
        <div className="aut-way-ico clone"><Icon name="rotate" size={16} /></div>
        <div className="aut-way-body">
          <h4>Duplicate existing</h4>
          <p>Clone an automation's procedures, KB, tools, and guardrails as a starting point.</p>
        </div>
      </button>
      <button className="aut-way" onClick={onNewAutomation}>
        <div className="aut-way-ico import"><Icon name="upload" size={16} /></div>
        <div className="aut-way-body">
          <h4>Import from CSV</h4>
          <p>Bulk-create from a spreadsheet, every row becomes a draft automation, ready for the wizard.</p>
        </div>
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------
// Automation shell, owns the tab bar + first-time mode stepper
// ---------------------------------------------------------------
const AutomationShell = ({ automation, tab, navigate, children, rightRail, showAnswers, onRenameAutomation }) => {
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
          { label: automation.audience === "AIR" ? "Rep AI" : "Customer AI" },
          { label: "Automations", onClick: () => navigate("automations") },
          { label: automation.name },
        ]}
        title={automation.name}
        answers={"Build, test, and deploy this automation."}
        showAnswers={showAnswers}
        onTitleChange={onRenameAutomation}
        titlePlaceholder="Untitled automation"
        actions={
          <>
            {automation.audience
              ? <AudienceChip audience={automation.audience} />
              : <span className="audience-unset" title="Choose who this AI is for to continue"><Icon name="warning" size={10} /> Audience not set</span>}
            <StatusPill status={automation.status} />
            <button className="btn ghost btn-icon"><Icon name="moreV" size={13} /></button>
          </>
        }
      />
      <div className="tabs">
        {tabs.map((t) => {
          const needsAudience = !automation.audience && (t.id === "test" || t.id === "deploy" || t.id === "analyze");
          const isLocked = needsAudience || (inFirstRun && stepOrder.indexOf(t.id) > currentIdx + 1 && t.id !== "settings" && t.id !== "analyze");
          const isActive = t.id === tab;
          return (
            <div
              key={t.id}
              className={`tab ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
              onClick={() => !isLocked && navigate(`automation:${automation.id}:${t.id}`)}
              title={needsAudience ? "Choose who this AI is for first" : isLocked ? "Complete the previous step first" : ""}
            >
              {t.label}
              {isLocked && <Icon name="lock" size={10} />}
            </div>
          );
        })}
      </div>

      <div className="page-body wide">
        {rightRail ? <div className="with-rail">
          <div>{children}</div>
          <RightRail automation={automation} shellTab={tab} navigate={navigate} />
        </div> : children}
      </div>
    </>
  );
};

// ---------------------------------------------------------------
// Right rail (Assistant + Test Console)
// ---------------------------------------------------------------
const RightRail = ({ automation, shellTab, navigate }) => {
  // Proactive, context-aware opening messages so the assistant offers help
  // tied to what the user is looking at, instead of waiting to be found.
  const buildOpening = () => {
    const msgs = [{ who: "ai", text: window.MOCK.ASSISTANT_INITIAL_MESSAGE }];
    if (shellTab === "test") {
      msgs.push({ who: "ai", text: "Looking at tests? I can explain why a category failed, or help you write a new test case. Two kinds of testing live here: the Test Console (try it live, nothing saved) and Test Cases (saved checks that score your AI). Ask me about either." });
    } else if ((automation.drives?.length || 0) === 0) {
      msgs.push({ who: "ai", text: "Heads up — this automation isn't tied to a goal yet, so its progress won't be tracked. Want me to help you attach one?" });
    } else if ((automation.attachedBlocks?.procedures || 0) === 0) {
      msgs.push({ who: "ai", text: "This automation has no procedures yet. Want me to draft a few from your scenarios so it actually does something?" });
    }
    return msgs;
  };

  const [tab, setTab] = useState("assistant");
  const [messages, setMessages] = useState(buildOpening);
  const [draft, setDraft] = useState("");
  const [channel, setChannel] = useState("Chat");
  const [savedCase, setSavedCase] = useState(false);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { who: "you", text }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { who: "ai", text: aiResponse(text) }]);
    }, 600);
  };

  // Bridge: any screen can summon the assistant with a pre-filled question
  // via window.dispatchEvent(new CustomEvent("assistant-ask", { detail: { prompt } }))
  useEffect(() => {
    const onAsk = (e) => {
      setTab("assistant");
      if (e.detail?.prompt) setDraft(e.detail.prompt);
    };
    window.addEventListener("assistant-ask", onAsk);
    return () => window.removeEventListener("assistant-ask", onAsk);
  }, []);

  // Suggested prompts adapt to the tab the user is on.
  const prompts = shellTab === "test"
    ? ["Why did Damaged Items fail?", "What's the difference between the Console and Test Cases?", "Add a test case for refunds over $250"]
    : ["Draft a refund procedure", "Make the tone more conversational", "Suggest a guardrail for high-value refunds"];

  const aiResponse = (msg) => {
    const t = msg.toLowerCase();
    if (t.includes("console") || (t.includes("difference") && t.includes("test"))) return "Good question — they're easy to mix up. The Test Console is a live sandbox: chat with your AI to feel it out, but nothing is saved or scored. Test Cases are saved checks that grade one specific moment in a conversation and gate your deploy. Run something good in the Console? Hit 'Save as test case' to turn it into a scored check.";
    if (t.includes("fail") || t.includes("damaged")) return "Damaged Items dropped because the 'Confirmed item condition' criterion only passed 42% of the time — the AI issued refunds without asking for a photo. Want me to add a step to the procedure that requests an image first?";
    if (t.includes("guardrail")) return "Good idea. Try a hard cap rule: if refund_amount > $250 and customer_tier != 'VIP', escalate. I can draft that as a Guardrail, say the word.";
    if (t.includes("tone")) return "Setting tone to a warmer, conversational register usually moves CSAT 0.2 to 0.4. Try Friendly with 'use the customer's name' enabled. I'll show a preview if you'd like.";
    if (t.includes("vip")) return "Got it. VIP coupon procedure exists, should I add a recommendation step before applying the code? That pattern correlates with +0.8 CSAT in similar accounts.";
    if (t.includes("goal") || t.includes("attach")) return "I can attach this automation to a goal so its progress shows up on the goal page. Which outcome should it drive — reducing refunds, faster replies, higher CSAT?";
    if (t.includes("test case") || t.includes("refunds over")) return "I'll draft a test case: input is a customer asking for a $300 refund on a 70-day-old order; expected behavior is the AI declines and escalates to a human. Add it to the Refund category?";
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
          <div className="rail-side-purpose">
            <Icon name="info" size={10} /> Stuck on anything on this tab? Ask here — I can draft it, explain it, or fix it.
          </div>
          <div className="rail-side-body">
            {messages.map((m, i) => (
              <div key={i} className={`assistant-msg ${m.who === "you" ? "you" : ""}`}>{m.text}</div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Try asking</div>
              {prompts.map((p) => (
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
          <div className="rail-side-purpose">
            <Icon name="info" size={10} /> <b>Try it live.</b> A sandbox chat — nothing here is saved or scored. To create a saved, scored check, use <b>Test Cases</b>.
          </div>
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
          <div className="rail-side-body" style={{ background: "var(--v2-paper-2)" }}>
            <div className="assistant-msg" style={{ background: "#fff" }}>
              <b>Test conversation</b><br />
              Send messages as if you were a customer. The AI responds using this automation's current draft. This is a sandbox — it won't change your scores.
            </div>
            <div className="assistant-msg you">Hi, I need a refund for order #88234, it arrived damaged.</div>
            <div className="assistant-msg">
              I'm sorry to hear about your order. Could you share a photo of the damage so I can process this quickly?
            </div>
          </div>
          {/* Bridge from the live sandbox to a saved, scored test case */}
          <div className="test-console-save">
            {savedCase ? (
              <span className="test-console-saved"><Icon name="check" size={12} /> Saved to Test Cases — it'll run on the next eval.</span>
            ) : (
              <button className="btn sm" onClick={() => setSavedCase(true)} title="Turn this sandbox chat into a saved, scored test case">
                <Icon name="plus" size={12} /> Save as test case
              </button>
            )}
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

// ---------------------------------------------------------------
// New automation modal — audience is chosen HERE, at creation, so it's
// not buried inside Build. Most paths (goal, template) skip this and
// inherit audience; this is the one-time ask for the generic path.
// ---------------------------------------------------------------
const NewAutomationModal = ({ open, onClose, onChoose }) => {
  if (!open) return null;
  return (
    <div className="onboarding-backdrop" onClick={onClose}>
      <div className="new-auto-modal" onClick={(e) => e.stopPropagation()}>
        <button className="new-auto-close" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
        <div className="new-auto-eyebrow">New automation · step 1</div>
        <h2>Who is this AI for?</h2>
        <p>Pick one to start. An automation either serves customers <b>or</b> assists reps — never both, because they're deployed differently. Choosing now keeps your setup focused.</p>
        <div className="audience-choice-opts">
          <button className="audience-choice-opt aic" onClick={() => onChoose("AIC")}>
            <span className="audience-choice-ico"><Icon name="sparkles" size={18} /></span>
            <span className="audience-choice-body">
              <span className="audience-choice-title">Customer AI</span>
              <span className="audience-choice-desc">Handles customer conversations end to end — replies, looks things up, takes actions, and escalates to a human when needed.</span>
            </span>
            <Icon name="chevRight" size={14} />
          </button>
          <button className="audience-choice-opt air" onClick={() => onChoose("AIR")}>
            <span className="audience-choice-ico"><Icon name="headset" size={18} /></span>
            <span className="audience-choice-body">
              <span className="audience-choice-title">Rep AI (Copilot)</span>
              <span className="audience-choice-desc">Assists a human rep — drafts replies, summarizes, and surfaces signals. The rep stays in control of every send.</span>
            </span>
            <Icon name="chevRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AutomationsList, AutomationShell, RightRail, NewAutomationModal });
