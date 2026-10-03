// Main Copilot tab content (the long scrolling form)

const CopilotPanel = ({ state, set, onObserve }) => {
  const [drafts, setDrafts] = React.useState(
    "Use a warm, empathetic tone. Keep responses under 3 sentences. Always end with an offer to help further. Avoid corporate jargon."
  );
  const [expand, setExpand] = React.useState(
    "When expanding text, improve clarity and warmth without changing the core message. Add any missing context that would help the customer take next steps. Keep responses under 5 sentences. Avoid passive voice."
  );
  const [spelling, setSpelling] = React.useState(
    "Correct all spelling and grammar errors. Avoid contractions — use \"do not\" instead of \"don't\". Do not use slang or informal language. Preserve the original meaning exactly — do not add or remove information, only fix errors and style issues."
  );
  const [focus, setFocus] = React.useState(null);

  const agents = [
    {
      id: "customer-expert",
      name: "Customer Expert Agent",
      description: "Call this agent when you need data about a customer. This a...",
      klass: "Customer",
      model: "us.anthropic.clau...",
      color: "#3F8CFF",
      icon: "user",
      createdDate: "Apr 29, 2026", createdTime: "12:12 PM",
      modifiedDate: "Apr 29, 2026", modifiedTime: "12:12 PM",
    },
    {
      id: "general-knowledge",
      name: "General Knowledge Agent",
      description: "Use this agent when answering general support questions...",
      klass: "Customer",
      model: "us.anthropic.clau...",
      color: "#6E79E0",
      icon: "bookOpen",
      createdDate: "Apr 29, 2026", createdTime: "11:48 AM",
      modifiedDate: "Apr 29, 2026", modifiedTime: "11:48 AM",
    },
    {
      id: "task-expert",
      name: "Task Expert",
      description: "Call this tool when you need help with or information about al...",
      klass: "Kustomertask",
      model: "us.anthropic.clau...",
      color: "#3F8CFF",
      icon: "task",
      createdDate: "Apr 27, 2026", createdTime: "3:21 PM",
      modifiedDate: "Apr 29, 2026", modifiedTime: "12:12 PM",
    },
  ];

  const guidanceField = (label, helper, value, onChange, key) => (
    <div style={{ marginBottom: 8 }}>
      <SubSectionTitle sparkle>{label}</SubSectionTitle>
      <Description style={{ marginTop: 4, marginBottom: 8 }}>{helper}</Description>
      <TextArea
        value={value}
        onChange={onChange}
        focused={focus === key}
        onFocus={() => setFocus(key)}
        onBlur={() => setFocus(null)}
        rows={3}
      />
      <div style={{ marginTop: 4 }}>
        <AddLink>Add brand-specific guidance</AddLink>
      </div>
    </div>
  );

  return (
    <div>
      {/* Writing guidance */}
      <SectionTitle>Writing guidance</SectionTitle>
      <Description style={{ marginTop: 6, marginBottom: 24 }}>
        Set the brand voice and response guidelines for Copilot. This helps ensure that Copilot's responses align with your company's communication style.
      </Description>

      {guidanceField(
        "Write drafts",
        "Copilot will follow these instructions when generating replies that agents can send to customers.",
        drafts, setDrafts, "drafts",
      )}

      <div style={{ height: 16 }}/>

      {guidanceField(
        "Expand text",
        "Copilot will follow these instructions when improving replies in the editor.",
        expand, setExpand, "expand",
      )}

      <div style={{ height: 16 }}/>

      {guidanceField(
        "Fix spelling",
        "Copilot will follow these instructions when revising and correcting replies.",
        spelling, setSpelling, "spelling",
      )}

      <div style={{ height: 16 }}/>

      {/* Translations */}
      <div style={{ marginTop: 8 }}>
        <h3 style={{
          margin: 0, marginBottom: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 14, fontWeight: 700, color: "#1F242D",
        }}>Translations</h3>
        <Toggle
          on={state.translations}
          onChange={v => set({ translations: v })}
          label="Instantly translate messages sent between agents and customers."
        />

        {state.translations && (
          <div style={{ marginTop: 14, maxWidth: 620 }}>
            <label style={{
              display: "block",
              fontFamily: "var(--font-sans)",
              fontSize: 12, fontWeight: 600, color: "#1F242D",
              marginBottom: 4,
            }}>Exclude from translation</label>
            <Description style={{ fontSize: 12, marginBottom: 8 }}>
              Words or phrases Copilot should leave in their original language — brand names, product SKUs, technical terms.
            </Description>
            <ExclusionInput
              tags={state.translationExclusions}
              onChange={v => set({ translationExclusions: v })}
            />
          </div>
        )}
      </div>

      <div style={{ height: 80 }}/>
    </div>
  );
};

const ModeRow = ({ icon, label, desc, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      textAlign: "left",
      padding: "10px 12px",
      border: selected ? "1.5px solid #0165E4" : "1px solid #DCE0E9",
      background: selected ? "#F5F9FF" : "#fff",
      borderRadius: 6,
      cursor: "pointer",
      display: "flex", alignItems: "center", gap: 12,
      transition: "all 140ms var(--ease-standard)",
      outline: selected ? "3px solid rgba(63,140,255,0.12)" : "none",
      width: "100%",
    }}
  >
    <span style={{
      width: 16, height: 16, borderRadius: "50%",
      border: selected ? "5px solid #0165E4" : "1.5px solid #B3BBCB",
      background: "#fff",
      boxSizing: "border-box",
      transition: "all 140ms",
      flexShrink: 0,
    }}/>
    <span style={{
      width: 22, height: 22, borderRadius: 5,
      background: selected ? "#DBE7FF" : "#F2F3F7",
      color: selected ? "#0165E4" : "#5F6675",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <RailIcon name={icon} size={12} strokeWidth={1.8}/>
    </span>
    <span style={{
      fontFamily: "var(--font-sans)",
      fontSize: 13, fontWeight: 700,
      color: "#1F242D",
      flexShrink: 0,
    }}>{label}</span>
    <span style={{
      fontFamily: "var(--font-sans)",
      fontSize: 12, lineHeight: 1.4, color: "#5F6675",
    }}>{desc}</span>
  </button>
);

Object.assign(window, { CopilotPanel, ModeRow });

const ExclusionInput = ({ tags = [], onChange }) => {
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    if (tags.includes(v)) { setDraft(""); return; }
    onChange([...tags, v]);
    setDraft("");
  };
  const remove = (t) => onChange(tags.filter(x => x !== t));
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
      padding: "8px 10px",
      minHeight: 38,
      border: focused ? "1px solid #3F8CFF" : "1px solid #DCE0E9",
      outline: focused ? "3px solid rgba(63,140,255,0.18)" : "none",
      background: "#fff",
      borderRadius: 4,
      transition: "border-color 140ms, outline 140ms",
    }}>
      {tags.map(t => (
        <span key={t} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 4px 3px 8px",
          background: "#EBF1FF",
          color: "#0165E4",
          borderRadius: 4,
          fontFamily: "var(--font-sans)",
          fontSize: 12, fontWeight: 600,
        }}>
          {t}
          <button
            onClick={() => remove(t)}
            style={{
              width: 16, height: 16, border: 0, background: "transparent",
              color: "#0165E4", cursor: "pointer", padding: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              borderRadius: 3,
            }}
            title={`Remove ${t}`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); commit(); }}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); }
          else if (e.key === "Backspace" && !draft && tags.length) { onChange(tags.slice(0, -1)); }
        }}
        placeholder={tags.length ? "" : "Type a word and press Enter"}
        style={{
          flex: 1, minWidth: 140,
          border: 0, outline: "none",
          fontFamily: "var(--font-sans)",
          fontSize: 13, color: "#1F242D",
          background: "transparent",
          padding: "2px 0",
        }}
      />
    </div>
  );
};

Object.assign(window, { ExclusionInput });
