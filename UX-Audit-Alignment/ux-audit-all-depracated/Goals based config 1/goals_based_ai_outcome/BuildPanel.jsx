// Build page for an AI Automation (Refund Order)
// - Flat-subsection layout (no card chrome per guidance block)
// - Unified Procedure Library: each procedure can be associated with any
//   combination of AI for Customers automations and AI for Reps agents.
//   The Procedures block shows the procedures attached to THIS automation,
//   with secondary chips for other associations.
// - Right-hand panel (Assistant / Test Console) is collapsible.

const CURRENT_AUTOMATION = { id: "aic-refund", label: "Refund Order", kind: "aic" };

// All possible association targets in the org.
// kind: "aic" = AI for Customers automation, "air" = AI for Reps agent
const ASSOC_TARGETS = [
  { id: "aic-refund",   label: "Refund Order",      kind: "aic" },
  { id: "aic-track",    label: "Order Tracking",    kind: "aic" },
  { id: "aic-returns",  label: "Returns",           kind: "aic" },
  { id: "aic-shipping", label: "Shipping Updates",  kind: "aic" },
];

// Umbrella scopes the user can pick (apply to ALL in a class)
const ASSOC_SCOPES = [
  { id: "all-aic", label: "All AI for Customers", kind: "aic" },
  { id: "all-air", label: "AI for Reps",          kind: "air" },
];

// Procedure library (org-wide). Each has an `associations` set of target/scope ids.
const INITIAL_LIBRARY = [
  {
    id: "p-convince",
    name: "Convincing Customer",
    description: "Empathy-first response when a customer threatens to cancel.",
    body: "When a customer threatens to cancel, lead with empathy and what we'll do differently — not the cancellation policy. Offer a one-time credit only after listening.",
    whenToUse: "When the customer threatens to cancel or expresses strong dissatisfaction with the service.",
    stepsHtml: `<ol><li>Acknowledge the customer's frustration with empathy before anything else.<ol><li>Mirror their concern in your own words so they feel heard.</li><li>Avoid quoting the cancellation policy at this stage.</li></ol></li><li>Ask one open question to understand the root cause.</li><li>Offer a concrete next step — a fix, an upgrade, or a one-time credit using <span data-mention="Goodwill Credit">@Goodwill Credit</span>.</li><li>Confirm the outcome and set a clear expectation for follow-up.</li></ol>`,
    associations: ["aic-refund", "all-air"],
  },
  {
    id: "p-main-refund",
    name: "Main Refund Procedure",
    description: "Verify, check eligibility, issue or offer alternative.",
    body: "1. Verify the order via order ID.\n2. Check refund eligibility against the Returns & Refunds Policy.\n3. If eligible, issue the refund and confirm timeline.\n4. If not, explain the specific reason and offer the closest alternative (store credit, partial refund, replacement).",
    whenToUse: "When the customer asks for a refund or expresses dissatisfaction with their order.",
    stepsHtml: `<ol><li>Ask open-ended questions to understand the specific reason for the refund request.<ol><li>If they mention product defects, ask them to describe the problem in detail.</li><li>If they mention a wrong item or size, confirm what they received vs. what they expected.</li></ol></li><li>Acknowledge their concern with empathy and thank them for explaining the situation.</li><li>Categorize their refund reason using <span data-mention="Refund Reason">@Refund Reason</span> to track the feedback.</li><li>Based on their issue, offer the most appropriate alternative solution:<ol><li>For wrong size or fit, offer a free exchange.</li><li>For defective items, offer a replacement at no cost with expedited shipping.</li></ol></li></ol>`,
    associations: ["aic-refund"],
  },
  {
    id: "p-verify-identity",
    name: "Verify Customer Identity",
    description: "Confirm identity before any account-level change.",
    body: "Before any account-level change, confirm at least two of: email on file, last 4 of payment method, recent order ID.",
    whenToUse: "Before any account-level change is made on behalf of the customer.",
    stepsHtml: `<ol><li>Greet the customer and explain that a quick identity check is required.</li><li>Ask for two of the following: email on file, last 4 of the payment method, recent order ID.</li><li>Compare the answers to the values on the account record.</li><li>If verification fails, escalate using <span data-mention="Escalate">@Escalate</span> instead of proceeding.</li></ol>`,
    associations: ["all-aic", "all-air"],
  },
  {
    id: "p-escalate",
    name: "Escalate to Specialist",
    description: "When to hand off to a human team lead.",
    body: "Hand off if: customer references legal/regulatory issues, asks for a manager twice, or sentiment drops to negative for 2 consecutive turns.",
    whenToUse: "When the conversation requires a human team lead — legal references, repeated manager requests, or sustained negative sentiment.",
    stepsHtml: `<ol><li>Summarize the conversation and the reason for escalation in one paragraph.</li><li>Tag the appropriate team lead using <span data-mention="Team Lead">@Team Lead</span>.</li><li>Set the conversation status to <em>Pending — Specialist</em> and let the customer know help is on the way.</li></ol>`,
    associations: ["all-air"],
  },
  {
    id: "p-tracking-lookup",
    name: "Tracking Lookup",
    description: "Fetch carrier status and write a single-line summary.",
    body: "Look up the order's tracking number, fetch latest carrier event, and reply with the event + ETA in one sentence.",
    whenToUse: "When the customer asks where their order is or for a delivery update.",
    stepsHtml: `<ol><li>Look up the order using <span data-mention="Order Lookup">@Order Lookup</span>.</li><li>Fetch the latest carrier event for the tracking number.</li><li>Reply with the most recent event and an estimated delivery window in one sentence.</li></ol>`,
    associations: ["aic-track", "aic-shipping"],
  },
  {
    id: "p-parking-tickets",
    name: "Tracking Parking Tickets",
    description: "Look up open parking tickets for a license plate and report status.",
    body: "1. Ask for the license plate and state.\n2. Query the parking authority for open tickets.\n3. Reply with each ticket's date, location, amount, and due date.\n4. Offer to start a dispute if the customer believes it was issued in error.",
    whenToUse: "When the customer asks about an open or recent parking ticket.",
    stepsHtml: `<ol><li>Ask for the license plate and state of registration.</li><li>Query the parking authority via <span data-mention="Parking Lookup">@Parking Lookup</span>.</li><li>Return each open ticket's date, location, amount, and due date.</li><li>Offer to file a dispute if the customer believes it was issued in error.</li></ol>`,
    associations: ["all-air"],
  },
];

const BuildPanel = ({ onDirty }) => {
  const [library, setLibrary] = React.useState(INITIAL_LIBRARY);
  const [knowledge, setKnowledge] = React.useState([{ id: "kb1", name: "default" }]);
  const [procExpanded, setProcExpanded] = React.useState({});
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [tone, setTone] = React.useState("custom");
  const [customTone, setCustomTone] = React.useState(
    "Warm and direct. Acknowledge frustration first, then give the next concrete step in one short sentence. Avoid jargon, never apologize twice."
  );

  const setAndDirty = (fn) => { onDirty && onDirty(); fn(); };

  // Procedures attached to THIS automation = library items whose associations
  // include this automation OR the umbrella scope it belongs to.
  const attachedProcedures = library.filter(p =>
    p.associations.includes(CURRENT_AUTOMATION.id) ||
    (CURRENT_AUTOMATION.kind === "aic" && p.associations.includes("all-aic")) ||
    (CURRENT_AUTOMATION.kind === "air" && p.associations.includes("all-air"))
  );

  const detachProcedure = (procId) => {
    setAndDirty(() => {
      setLibrary(libs => libs.map(p => {
        if (p.id !== procId) return p;
        // Remove this automation id; if previously inherited via umbrella scope,
        // also drop the umbrella so the change sticks for this automation.
        return {
          ...p,
          associations: p.associations.filter(a =>
            a !== CURRENT_AUTOMATION.id &&
            !(CURRENT_AUTOMATION.kind === "aic" && a === "all-aic") &&
            !(CURRENT_AUTOMATION.kind === "air" && a === "all-air")
          ),
        };
      }));
    });
  };

  const attachExisting = (procId) => {
    setAndDirty(() => {
      setLibrary(libs => libs.map(p =>
        p.id === procId && !p.associations.includes(CURRENT_AUTOMATION.id)
          ? { ...p, associations: [...p.associations, CURRENT_AUTOMATION.id] }
          : p
      ));
    });
  };

  const updateProcedure = (procId, patch) => {
    setAndDirty(() => {
      setLibrary(libs => libs.map(p => p.id === procId ? { ...p, ...patch } : p));
    });
  };

  const createProcedure = (data) => {
    const newProc = {
      id: "p-" + Math.random().toString(36).slice(2, 8),
      name: data.name,
      description: data.description,
      body: data.body,
      associations: data.associations.includes(CURRENT_AUTOMATION.id)
        ? data.associations
        : [...data.associations, CURRENT_AUTOMATION.id],
    };
    setAndDirty(() => setLibrary(libs => [...libs, newProc]));
  };

  return (
    <div>
      <SectionTitle helpIcon>Build your AI Automation</SectionTitle>
      <Description style={{ marginTop: 10, maxWidth: 760 }}>
        Configure a simple AI automation with ease. Define which conversation
        topics should be handled by AI, and then configure AI to handle those
        conversations. If you need complex workflows with multiple AI Agents or
        full control, try our{" "}
        <a href="#" onClick={e => e.preventDefault()} style={{ color: "#0165E4", fontWeight: 600, textDecoration: "none" }}>
          Advanced Builder
        </a>.
      </Description>

      <div style={{
        marginTop: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingBottom: 16,
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <SparkleGlyph/>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "#1F242D" }}>
            Guidance
          </span>
        </div>
        <AddLink>Add Guidance</AddLink>
      </div>

      <Description style={{ marginBottom: 4 }}>
        Add knowledge sources, procedures, and other relevant instructions to
        ensure your AI Automation has the appropriate information to help your
        customers.
      </Description>

      {/* Knowledge Sources */}
      <GuidanceBlock
        title="Knowledge Sources"
        description="Choose the knowledge sources the agent can use. Branded conversations use matching knowledge bases and matching or unbranded data sources; otherwise all selected sources are used."
        onDelete={() => {}}
      >
        <KnowledgeSelect
          items={knowledge}
          onRemove={(id) => setAndDirty(() => setKnowledge(ks => ks.filter(x => x.id !== id)))}
        />
      </GuidanceBlock>

      {/* Procedures — pulled from shared library */}
      <GuidanceBlock
        title="Procedures"
        description="Step-by-step instructions for handling conversations. Procedures live in your shared Procedure Library and can be attached to one or more AI Agents and Automations."
        onDelete={() => {}}
        action={
          <AddLink onClick={() => setPickerOpen(true)}>Add Procedure</AddLink>
        }
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {attachedProcedures.length === 0 ? (
            <div style={{
              padding: "16px 14px",
              border: "1px dashed #DCE0E9",
              borderRadius: 8,
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182",
              textAlign: "center",
            }}>
              No procedures yet. <button onClick={() => setPickerOpen(true)} style={{ border: 0, background: "transparent", color: "#0165E4", fontWeight: 600, cursor: "pointer", padding: 0, font: "inherit" }}>Add one from your library</button> or create new.
            </div>
          ) : attachedProcedures.map(p => (
            <ProcedureRow
              key={p.id}
              proc={p}
              expanded={!!procExpanded[p.id]}
              onToggle={() => setProcExpanded(s => ({ ...s, [p.id]: !s[p.id] }))}
              onDetach={() => detachProcedure(p.id)}
              onChange={(updated) => updateProcedure(p.id, updated)}
            />
          ))}
        </div>
      </GuidanceBlock>

      {/* Response Tone */}
      <GuidanceBlock
        title="Response Tone"
        description="Define the personality and communication style for your AI"
        onDelete={() => {}}
        last
      >
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
          color: "#1F242D", marginBottom: 10,
        }}>Tone of voice</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: tone === "custom" ? 14 : 0 }}>
          {[
            { id: "friendly",     label: "Friendly" },
            { id: "professional", label: "Professional" },
            { id: "casual",       label: "Casual" },
            { id: "matter",       label: "Matter of Fact" },
            { id: "custom",       label: "Custom" },
          ].map(t => (
            <TonePill key={t.id} label={t.label} active={tone === t.id}
              onClick={() => setAndDirty(() => setTone(t.id))}/>
          ))}
        </div>
        {tone === "custom" && (
          <TextArea value={customTone} onChange={v => setAndDirty(() => setCustomTone(v))} rows={3}/>
        )}
      </GuidanceBlock>

      {pickerOpen && (
        <ProcedurePicker
          library={library}
          alreadyAttachedIds={attachedProcedures.map(p => p.id)}
          onClose={() => setPickerOpen(false)}
          onAttach={(id) => { attachExisting(id); }}
          onCreate={(data) => { createProcedure(data); setPickerOpen(false); }}
        />
      )}
    </div>
  );
};

// — Flat guidance subsection
const GuidanceBlock = ({ title, description, children, onDelete, action, last }) => (
  <div style={{ borderTop: "1px solid #E8EAF0", padding: "20px 0 22px", marginBottom: last ? 0 : 0 }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "#1F242D",
          marginBottom: 4, letterSpacing: "-0.005em",
        }}>{title}</div>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.5, color: "#697182",
          maxWidth: 640,
        }}>{description}</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
        {action}
        <button
          onClick={onDelete}
          style={{
            background: "transparent", border: 0, padding: 6, borderRadius: 6,
            color: "#9099AB", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "all 120ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#CD1D2B"; e.currentTarget.style.background = "#FFF4F4"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#9099AB"; e.currentTarget.style.background = "transparent"; }}
          aria-label={`Remove ${title}`}
        >
          <RailIcon name="trash" size={15} strokeWidth={1.7}/>
        </button>
      </div>
    </div>
    <div style={{ marginTop: 14 }}>{children}</div>
  </div>
);

const KnowledgeSelect = ({ items, onRemove }) => (
  <div role="combobox" tabIndex={0} style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", minHeight: 38, padding: "5px 10px 5px 8px",
    border: "1px solid #DCE0E9", background: "#fff", borderRadius: 6,
    cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)",
  }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
      {items.length === 0 && <span style={{ color: "#9099AB", fontSize: 13, padding: "4px 4px" }}>Select a knowledge source…</span>}
      {items.map(k => (
        <span key={k.id} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 6px 3px 8px", background: "#EDF1F8",
          border: "1px solid #DCE0E9", borderRadius: 999,
          fontSize: 12, fontWeight: 600, color: "#1F242D",
        }}>
          <span style={{
            width: 14, height: 14, borderRadius: "50%", background: "#3F8CFF",
            display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </span>
          {k.name}
          <button onClick={(e) => { e.stopPropagation(); onRemove(k.id); }}
            style={{ background: "transparent", border: 0, padding: 0, marginLeft: 2, color: "#697182", cursor: "pointer", display: "inline-flex" }}
            aria-label={`Remove ${k.name}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </span>
      ))}
    </div>
    <RailIcon name="chevronDown" size={14} strokeWidth={2} color="#697182"/>
  </div>
);

// — Procedure row: collapsed shows name; expanded shows the full editor
//   (Name, When to Use, Steps with a rich-text toolbar).
const ProcedureRow = ({ proc, expanded, onToggle, onDetach, onChange }) => {
  const update = (patch) => onChange && onChange({ ...proc, ...patch });
  return (
    <div style={{ borderTop: "1px solid #F0F2F6" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 0" }}>
        <button onClick={onToggle} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          flex: 1, border: 0, background: "transparent", cursor: "pointer",
          textAlign: "left", padding: 0, minWidth: 0,
        }}>
          <span style={{
            color: "#697182", display: "inline-flex",
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 140ms",
          }}>
            <RailIcon name="chevronDown" size={14} strokeWidth={2.2}/>
          </span>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1F242D",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{proc.name}</span>
        </button>
        <button onClick={onDetach} style={{
          background: "transparent", border: 0, padding: 6, borderRadius: 6,
          color: "#9099AB", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "#CD1D2B"; e.currentTarget.style.background = "#FFF4F4"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#9099AB"; e.currentTarget.style.background = "transparent"; }}
          aria-label={`Detach ${proc.name}`} title="Remove from this automation">
          <RailIcon name="trash" size={14} strokeWidth={1.7}/>
        </button>
      </div>
      {expanded && (
        <div style={{ padding: "4px 0 18px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <ProcField label="Name" required helper="A unique name for this procedure">
            <input value={proc.name} onChange={e => update({ name: e.target.value })}
              style={procInputStyle}/>
          </ProcField>
          <ProcField label="When to Use" required helper="Describe when this procedure should be used">
            <textarea value={proc.whenToUse || ""} onChange={e => update({ whenToUse: e.target.value })} rows={2}
              style={{ ...procInputStyle, resize: "vertical", lineHeight: 1.5 }}/>
          </ProcField>
          <ProcField label="Steps" helper="Define the steps to execute this procedure. You can reference tools that the AI Automation should use with @ mentions.">
            <RichStepsEditor html={proc.stepsHtml || legacyBodyToHtml(proc.body)}
              onChange={v => update({ stepsHtml: v })}/>
          </ProcField>
        </div>
      )}
    </div>
  );
};

const procInputStyle = {
  width: "100%", padding: "9px 12px",
  border: "1px solid #DCE0E9", borderRadius: 6,
  fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
  outline: "none", background: "#fff", boxSizing: "border-box",
};

const ProcField = ({ label, required, helper, children }) => (
  <div>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D", marginBottom: 2 }}>
      {label} {required && <span style={{ color: "#CD1D2B" }}>*</span>}
    </div>
    {helper && (
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginBottom: 8 }}>
        {helper}
      </div>
    )}
    {children}
  </div>
);

const legacyBodyToHtml = (body) => {
  if (!body) return "";
  const lines = body.split(/\n+/).map(l => l.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
  if (lines.length <= 1) return `<p>${body}</p>`;
  return `<ol>${lines.map(l => `<li>${l}</li>`).join("")}</ol>`;
};

const RichStepsEditor = ({ html, onChange }) => {
  const ref = React.useRef(null);
  const [fullscreen, setFullscreen] = React.useState(false);

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    if (ref.current) onChange && onChange(ref.current.innerHTML);
  };

  const ToolBtn = ({ icon, label, onClick, glyph }) => (
    <button onMouseDown={e => e.preventDefault()} onClick={onClick} title={label} style={{
      width: 30, height: 28, border: 0, background: "transparent",
      color: "#3F4654", cursor: "pointer", borderRadius: 4,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-sans)", fontSize: 13,
    }}
      onMouseEnter={e => e.currentTarget.style.background = "#EEF0F4"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      {glyph || <RailIcon name={icon} size={14} strokeWidth={1.9}/>}
    </button>
  );

  const Divider = () => (
    <span style={{ width: 1, alignSelf: "stretch", background: "#E8EAF0", margin: "4px 4px" }}/>
  );

  return (
    <div style={{
      border: "1px solid #DCE0E9", borderRadius: 8, overflow: "hidden",
      background: "#fff",
      ...(fullscreen ? {
        position: "fixed", inset: 24, zIndex: 1100,
        boxShadow: "0 20px 60px rgba(15,19,29,0.35)",
        display: "flex", flexDirection: "column",
      } : {}),
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 2,
        padding: 6,
        borderBottom: "1px solid #E8EAF0",
        background: "#FAFBFD",
      }}>
        <ToolBtn label="Bold" onClick={() => exec("bold")} glyph={<span style={{ fontWeight: 800 }}>B</span>}/>
        <ToolBtn label="Italic" onClick={() => exec("italic")} glyph={<span style={{ fontStyle: "italic", fontWeight: 600 }}>I</span>}/>
        <Divider/>
        <ToolBtn label="Mention tool" onClick={() => {
          document.execCommand("insertHTML", false,
            `<span data-mention="Tool" contenteditable="false" style="display:inline-block;padding:1px 8px;border-radius:4px;background:#E5EEFF;color:#0E3280;font-weight:600;font-size:12px;margin:0 2px;">@Tool</span>&nbsp;`);
          if (ref.current) onChange && onChange(ref.current.innerHTML);
        }} glyph={<span style={{ fontWeight: 700 }}>@</span>}/>
        <Divider/>
        <ToolBtn label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={() => setFullscreen(f => !f)} icon="maximize"
          glyph={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>}/>
        <Divider/>
        <ToolBtn label="Undo" onClick={() => exec("undo")}
          glyph={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-4"/></svg>}/>
        <ToolBtn label="Redo" onClick={() => exec("redo")}
          glyph={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h4"/></svg>}/>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={e => onChange && onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: html }}
        className="rich-steps"
        style={{
          padding: "12px 16px",
          minHeight: fullscreen ? "auto" : 220,
          flex: fullscreen ? 1 : "0 0 auto",
          overflow: "auto",
          fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6,
          color: "#1F242D", outline: "none",
        }}/>
    </div>
  );
};

// — Association chip (AIC = blue, AIR = purple/indigo, scopes = darker)
const lookupAssoc = (id) => ASSOC_TARGETS.find(t => t.id === id) || ASSOC_SCOPES.find(t => t.id === id);

const AssocChip = ({ id, onRemove, compact }) => {
  const t = lookupAssoc(id);
  if (!t) return null;
  const isScope = id.startsWith("all-");
  const palettes = {
    aic: { bg: "#EBF1FF", fg: "#0E3280", border: "#CBDCFF", dot: "#0165E4" },
    air: { bg: "#EFEDFF", fg: "#3D46A8", border: "#D9D5FF", dot: "#6E79E0" },
  };
  const p = palettes[t.kind] || palettes.aic;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: compact ? "2px 7px" : "3px 9px",
      background: isScope ? p.fg : p.bg,
      color: isScope ? "#fff" : p.fg,
      border: isScope ? "0" : `1px solid ${p.border}`,
      borderRadius: 999,
      fontFamily: "var(--font-sans)",
      fontSize: compact ? 10.5 : 11, fontWeight: 600,
      whiteSpace: "nowrap",
      letterSpacing: "0.005em",
    }}>
      {!isScope && <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.dot }}/>}
      {t.label}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: "transparent", border: 0, padding: 0, marginLeft: 2,
          color: "inherit", cursor: "pointer", opacity: 0.7,
          display: "inline-flex",
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      )}
    </span>
  );
};

const AssocChipGroup = ({ ids, max = 3, compact, onRemove }) => {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <span style={{ display: "inline-flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
      {shown.map(id => <AssocChip key={id} id={id} compact={compact} onRemove={onRemove ? () => onRemove(id) : undefined}/>)}
      {extra > 0 && (
        <span style={{
          padding: compact ? "2px 7px" : "3px 9px",
          background: "#F2F3F7", color: "#5F6675",
          borderRadius: 999, fontSize: compact ? 10.5 : 11, fontWeight: 600,
          fontFamily: "var(--font-sans)",
        }}>+{extra}</span>
      )}
    </span>
  );
};

// — Procedure picker modal
const ProcedurePicker = ({ library, alreadyAttachedIds, onClose, onAttach, onCreate }) => {
  const [mode, setMode] = React.useState("library"); // library | create
  const [q, setQ] = React.useState("");
  const [draft, setDraft] = React.useState({
    name: "", description: "", body: "", associations: [CURRENT_AUTOMATION.id],
  });

  const candidates = library
    .filter(p => !alreadyAttachedIds.includes(p.id))
    .filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description || "").toLowerCase().includes(q.toLowerCase()));

  const setDraftField = (patch) => setDraft(d => ({ ...d, ...patch }));
  const toggleDraftAssoc = (id) => setDraft(d => ({
    ...d,
    associations: d.associations.includes(id)
      ? d.associations.filter(x => x !== id)
      : [...d.associations, id],
  }));

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,20,28,0.45)",
      zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      animation: "kpFade 160ms var(--ease-standard)",
    }}>
      <style>{`@keyframes kpFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: "min(680px, 100%)",
        maxHeight: "calc(100vh - 48px)",
        background: "#fff", borderRadius: 12,
        boxShadow: "0 32px 80px rgba(31,42,46,0.20)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #E8EAF0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "#1F242D" }}>
              Add Procedure
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginTop: 2 }}>
              Procedures live in a shared library and can be reused across AI Agents and Automations.
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: 0, padding: 6, color: "#697182", cursor: "pointer",
            display: "inline-flex", borderRadius: 6,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Mode switch */}
        <div style={{ padding: "12px 20px 0", display: "flex", gap: 6, borderBottom: "1px solid #E8EAF0" }}>
          <PickerTab label="From library" active={mode === "library"} onClick={() => setMode("library")}/>
          <PickerTab label="Create new" active={mode === "create"} onClick={() => setMode("create")}/>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          {mode === "library" ? (
            <>
              <div style={{ position: "relative", marginBottom: 12 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9099AB" }}>
                  <RailIcon name="search" size={14} strokeWidth={2}/>
                </span>
                <input value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search the procedure library…"
                  style={{
                    width: "100%", padding: "9px 12px 9px 32px",
                    border: "1px solid #DCE0E9", borderRadius: 6,
                    fontFamily: "var(--font-sans)", fontSize: 13,
                    outline: "none", background: "#fff", boxSizing: "border-box",
                  }}/>
              </div>
              {candidates.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182" }}>
                  No more procedures to attach.{" "}
                  <button onClick={() => setMode("create")} style={{
                    border: 0, background: "transparent", color: "#0165E4",
                    fontWeight: 600, cursor: "pointer", padding: 0, font: "inherit",
                  }}>Create a new one</button>.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {candidates.map(p => (
                    <LibraryCard key={p.id} proc={p} onAttach={() => onAttach(p.id)}/>
                  ))}
                </div>
              )}
            </>
          ) : (
            <CreateProcedureForm
              draft={draft}
              setDraftField={setDraftField}
              toggleDraftAssoc={toggleDraftAssoc}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 20px", borderTop: "1px solid #E8EAF0", background: "#FAFBFD",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {mode === "library" ? (
            <>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182" }}>
                Click <strong style={{ color: "#1F242D" }}>Add</strong> on any procedure to attach it to <strong style={{ color: "#1F242D" }}>{CURRENT_AUTOMATION.label}</strong>.
              </span>
              <button onClick={onClose} style={{
                padding: "8px 16px", border: 0, background: "#1F242D", color: "#fff",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                borderRadius: 6, cursor: "pointer",
              }}>Done</button>
            </>
          ) : (
            <>
              <button onClick={() => setMode("library")} style={{
                padding: "8px 0", border: 0, background: "transparent", color: "#697182",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Back to library</button>
              <button
                disabled={!draft.name.trim()}
                onClick={() => onCreate(draft)}
                style={{
                  padding: "8px 16px", border: 0,
                  background: draft.name.trim() ? "#0165E4" : "#DCE0E9",
                  color: "#fff",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
                  borderRadius: 6, cursor: draft.name.trim() ? "pointer" : "not-allowed",
                }}>
                Create procedure
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PickerTab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "8px 14px",
    border: 0, background: "transparent",
    color: active ? "#1F242D" : "#697182",
    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
    cursor: "pointer",
    borderBottom: active ? "2px solid #0165E4" : "2px solid transparent",
    marginBottom: -1,
  }}>{label}</button>
);

const LibraryCard = ({ proc, onAttach }) => {
  const [added, setAdded] = React.useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: 12,
      border: "1px solid #E8EAF0", borderRadius: 8, background: "#fff",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D", marginBottom: 2 }}>
          {proc.name}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", lineHeight: 1.45, marginBottom: 6 }}>
          {proc.description}
        </div>
        <AssocChipGroup ids={proc.associations} compact max={4}/>
      </div>
      <button
        onClick={() => { onAttach(); setAdded(true); }}
        disabled={added}
        style={{
          flexShrink: 0,
          padding: "6px 12px",
          border: added ? "0" : "1px solid #BBD1FF",
          background: added ? "#E5F5EC" : "#fff",
          color: added ? "#017C32" : "#0165E4",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
          borderRadius: 6, cursor: added ? "default" : "pointer",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
        {added ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Added
          </>
        ) : (<>
          <RailIcon name="plus" size={12} strokeWidth={2.2}/> Add
        </>)}
      </button>
    </div>
  );
};

const CreateProcedureForm = ({ draft, setDraftField, toggleDraftAssoc }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <FormField label="Name" required>
      <input value={draft.name} onChange={e => setDraftField({ name: e.target.value })}
        placeholder="e.g. Issue store credit"
        style={inputStyle}/>
    </FormField>
    <FormField label="Description" hint="One-line summary visible in the library.">
      <input value={draft.description} onChange={e => setDraftField({ description: e.target.value })}
        placeholder="When and why to use this procedure."
        style={inputStyle}/>
    </FormField>
    <FormField label="Steps" hint="What the AI should do.">
      <textarea value={draft.body} onChange={e => setDraftField({ body: e.target.value })}
        rows={5} placeholder="1. ..."
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}/>
    </FormField>
    <FormField label="Where this procedure applies" hint="Attach to entire scopes or specific Agents and Automations. This procedure will be automatically added to the selected ones.">
      <AssociationPicker
        selected={draft.associations}
        onToggle={toggleDraftAssoc}
        lockedId={CURRENT_AUTOMATION.id}
      />
    </FormField>
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #DCE0E9", borderRadius: 6,
  fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D",
  outline: "none", background: "#fff", boxSizing: "border-box",
};

const FormField = ({ label, hint, required, children }) => (
  <div>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "#1F242D",
      marginBottom: 4, display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {label}{required && <span style={{ color: "#CD1D2B" }}>*</span>}
    </div>
    {hint && (
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginBottom: 6, lineHeight: 1.45 }}>
        {hint}
      </div>
    )}
    {children}
  </div>
);

// Multi-select for associations. Groups: Scopes / AI for Customers / AI for Reps.
// `lockedId` cannot be deselected (it's the current context).
const AssociationPicker = ({ selected, onToggle, lockedId }) => {
  const aicTargets = ASSOC_TARGETS.filter(t => t.kind === "aic");

  return (
    <div style={{
      border: "1px solid #DCE0E9", borderRadius: 8, background: "#fff",
      padding: 12,
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <Group title="Scopes">
        {ASSOC_SCOPES.filter(s => s.kind === "aic").map(s => (
          <AssocOption key={s.id} target={s}
            selected={selected.includes(s.id)}
            locked={s.id === lockedId}
            onToggle={() => onToggle(s.id)}/>
        ))}
      </Group>
      <Group title="AI for Customers · Automations">
        {aicTargets.map(t => (
          <AssocOption key={t.id} target={t}
            selected={selected.includes(t.id)}
            locked={t.id === lockedId}
            onToggle={() => onToggle(t.id)}/>
        ))}
      </Group>
      <Group title="AI for Reps">
        {ASSOC_SCOPES.filter(s => s.kind === "air").map(s => (
          <AssocOption key={s.id} target={s}
            selected={selected.includes(s.id)}
            locked={s.id === lockedId}
            onToggle={() => onToggle(s.id)}/>
        ))}
      </Group>
    </div>
  );
};

const Group = ({ title, children }) => (
  <div>
    <div style={{
      fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
      color: "#697182", textTransform: "uppercase", letterSpacing: "0.05em",
      marginBottom: 8,
    }}>{title}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
  </div>
);

const AssocOption = ({ target, selected, locked, onToggle }) => {
  const isScope = target.id.startsWith("all-");
  const palettes = {
    aic: { active: "#0165E4", activeBg: "#EBF1FF", activeBorder: "#0165E4", idleFg: "#0E3280", idleBorder: "#CBDCFF" },
    air: { active: "#5A65D8", activeBg: "#EFEDFF", activeBorder: "#5A65D8", idleFg: "#3D46A8", idleBorder: "#D9D5FF" },
  };
  const p = palettes[target.kind] || palettes.aic;
  return (
    <button
      onClick={locked ? undefined : onToggle}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 11px 5px 9px",
        border: `1px solid ${selected ? p.activeBorder : p.idleBorder}`,
        background: selected ? (isScope ? p.active : p.activeBg) : "#fff",
        color: selected ? (isScope ? "#fff" : p.idleFg) : p.idleFg,
        fontFamily: "var(--font-sans)",
        fontSize: 12, fontWeight: 600,
        borderRadius: 999,
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.85 : 1,
        transition: "all 120ms",
      }}>
      <span style={{
        width: 14, height: 14, borderRadius: 4,
        border: `1.5px solid ${selected ? (isScope ? "#fff" : p.active) : "#B3BBCB"}`,
        background: selected ? (isScope ? "#fff" : p.active) : "transparent",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {selected && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={isScope ? p.active : "#fff"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        )}
      </span>
      {target.label}
      {locked && (
        <span style={{ fontSize: 10, color: "currentColor", opacity: 0.6 }}>(this)</span>
      )}
    </button>
  );
};

// — Tone pill
const TonePill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "8px 18px",
    border: active ? "1px solid transparent" : "1px solid #DCE0E9",
    background: active ? "#0165E4" : "#fff",
    color: active ? "#fff" : "#1F242D",
    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
    borderRadius: 999, cursor: "pointer",
    transition: "all 140ms var(--ease-standard)",
    boxShadow: active ? "0 1px 2px rgba(1,101,228,0.18)" : "none",
  }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F7F8FB"; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "#fff"; }}
  >{label}</button>
);

// — Right-hand panel: collapsible Assistant / Test Console
const TestConsole = ({ collapsed, onToggle }) => {
  const [tab, setTab] = React.useState("test");
  const [channel, setChannel] = React.useState("");
  const [brand, setBrand]     = React.useState("default");
  const [draft, setDraft]     = React.useState("");

  if (collapsed) {
    return (
      <aside style={{
        width: 48, flexShrink: 0,
        borderLeft: "1px solid #E8EAF0",
        background: "#fff",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, padding: "10px 0",
      }}>
        <button onClick={onToggle} title="Expand panel" style={collapsedBtn}>
          <RailIcon name="chevronLeft" size={16} strokeWidth={2}/>
        </button>
        <div style={{ width: 24, height: 1, background: "#E8EAF0", margin: "4px 0" }}/>
        <button onClick={() => { setTab("assistant"); onToggle(); }} title="Assistant" style={collapsedBtn}>
          <SparkleGlyph/>
        </button>
        <button onClick={() => { setTab("test"); onToggle(); }} title="Test Console" style={collapsedBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F6675" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside style={{
      width: 380, flexShrink: 0,
      borderLeft: "1px solid #E8EAF0",
      background: "#fff",
      display: "flex", flexDirection: "column",
      minHeight: 0,
    }}>
      {/* Tab header */}
      <div style={{
        height: 48, borderBottom: "1px solid #E8EAF0",
        display: "flex", alignItems: "center",
        padding: "0 12px 0 8px",
        gap: 6, flexShrink: 0,
      }}>
        <button onClick={onToggle} title="Collapse panel" style={{
          width: 28, height: 28, border: 0, background: "transparent",
          color: "#697182", cursor: "pointer", borderRadius: 6,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F2F3F7"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
          <RailIcon name="chevronRight" size={15} strokeWidth={2}/>
        </button>
        <RightTab icon={<SparkleGlyph/>} label="Assistant" active={tab === "assistant"} onClick={() => setTab("assistant")}/>
        <RightTab
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
          label="Test Console" active={tab === "test"} onClick={() => setTab("test")}/>
      </div>

      {tab === "test" ? (
        <>
          <div style={{ padding: "20px 20px 4px", flexShrink: 0 }}>
            <Field label="Test Channel" sub="Select a channel for your conversation with a test customer">
              <SelectField value={channel} onClick={() => setChannel("Email")} placeholder="Select channel..."/>
            </Field>
            <div style={{ height: 18 }}/>
            <Field label="Brand" sub="Select a brand for the test conversation">
              <SelectField value={brand} onClick={() => setBrand(brand === "default" ? "Kustomer Co." : "default")} placeholder="Select brand"/>
            </Field>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {!channel ? (
              <div style={{ margin: "auto", textAlign: "center", color: "#9099AB", padding: "30px 12px", maxWidth: 260 }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#697182", lineHeight: 1.5 }}>
                  Select a channel above to start testing
                </div>
              </div>
            ) : (
              <div style={{ color: "#9099AB", fontSize: 13, textAlign: "center", marginTop: 24 }}>
                Send a message to start the conversation.
              </div>
            )}
          </div>
          <div style={{
            padding: "12px 16px", borderTop: "1px solid #E8EAF0", background: "#fff",
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          }}>
            <input value={draft} onChange={e => setDraft(e.target.value)}
              placeholder={channel ? "Send a message…" : "Select a channel first…"}
              disabled={!channel}
              style={{
                flex: 1, padding: "9px 12px",
                border: "1px solid #DCE0E9", borderRadius: 999,
                fontFamily: "var(--font-sans)", fontSize: 13,
                outline: "none", background: channel ? "#F7F8FB" : "#F2F3F7",
                color: "#1F242D",
              }}/>
            <button style={{
              width: 32, height: 32, borderRadius: "50%", border: 0,
              background: draft && channel ? "#0165E4" : "#DCE0E9", color: "#fff",
              cursor: draft && channel ? "pointer" : "default",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 14-7-7 14-2-6z"/>
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            background: "#F7F4FF", border: "1px solid #EBD2FF", borderRadius: 10,
            padding: "12px 14px",
          }}>
            <span style={{ marginTop: 1 }}><SparkleGlyph/></span>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#1F242D", lineHeight: 1.55 }}>
              Hi! I can review your guidance, suggest procedures, or help you tighten the tone. What would you like to work on?
            </div>
          </div>
          <AssistantSuggest label="Suggest a procedure for refund disputes"/>
          <AssistantSuggest label="Review my response tone"/>
          <AssistantSuggest label="What knowledge sources am I missing?"/>
        </div>
      )}
    </aside>
  );
};

const collapsedBtn = {
  width: 32, height: 32, border: 0, background: "transparent",
  color: "#5F6675", cursor: "pointer", borderRadius: 6,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

const RightTab = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 14px", border: 0,
    background: active ? "#EBF1FF" : "transparent",
    color: active ? "#0165E4" : "#5F6675",
    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
    borderRadius: 999, cursor: "pointer", transition: "all 140ms",
  }}>{icon}{label}</button>
);

const Field = ({ label, sub, children }) => (
  <div>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1F242D", marginBottom: 4 }}>{label}</div>
    {sub && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#697182", marginBottom: 8, lineHeight: 1.45 }}>{sub}</div>}
    {children}
  </div>
);

const AssistantSuggest = ({ label }) => (
  <button style={{
    textAlign: "left", padding: "10px 12px",
    border: "1px solid #E8EAF0", background: "#fff",
    borderRadius: 8,
    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#1F242D",
    cursor: "pointer", transition: "all 140ms",
  }}
    onMouseEnter={e => { e.currentTarget.style.background = "#F7F8FB"; e.currentTarget.style.borderColor = "#DCE0E9"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E8EAF0"; }}
  >{label}</button>
);

Object.assign(window, {
  BuildPanel, TestConsole,
  GuidanceBlock, KnowledgeSelect, ProcedureRow,
  RichStepsEditor, ProcField, procInputStyle, legacyBodyToHtml,
  INITIAL_LIBRARY, AddLink,
});
