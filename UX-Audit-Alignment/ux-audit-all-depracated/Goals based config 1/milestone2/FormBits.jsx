// Reusable form bits

const SectionTitle = ({ children, helpIcon }) => (
  <h2 style={{
    margin: 0,
    fontFamily: "var(--font-sans)",
    fontSize: 18, fontWeight: 700, color: "#1F242D",
    display: "flex", alignItems: "center", gap: 6,
    letterSpacing: "-0.005em",
  }}>
    {children}
    {helpIcon && (
      <span style={{ color: "#9099AB", display: "inline-flex" }}>
        <RailIcon name="info" size={15} strokeWidth={1.8}/>
      </span>
    )}
  </h2>
);

const SubSectionTitle = ({ children, sparkle }) => (
  <h3 style={{
    margin: 0,
    fontFamily: "var(--font-sans)",
    fontSize: 14, fontWeight: 700, color: "#1F242D",
    display: "flex", alignItems: "center", gap: 6,
  }}>
    {sparkle && <SparkleGlyph/>}
    {children}
  </h3>
);

const SparkleGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3F8CFF"/>
        <stop offset="60%" stopColor="#6E79E0"/>
        <stop offset="100%" stopColor="#B31DF0"/>
      </linearGradient>
    </defs>
    <path d="M12 3 L13.5 9 L19 10.5 L13.5 12 L12 18 L10.5 12 L5 10.5 L10.5 9 Z"
          fill="url(#sparkleGrad)"/>
    <path d="M19 4 L19.7 6 L21.5 6.7 L19.7 7.4 L19 9.4 L18.3 7.4 L16.5 6.7 L18.3 6 Z"
          fill="url(#sparkleGrad)"/>
  </svg>
);

const Description = ({ children, style }) => (
  <p style={{
    margin: 0,
    fontFamily: "var(--font-sans)",
    fontSize: 13, lineHeight: 1.5, color: "#5F6675",
    maxWidth: 720,
    ...style,
  }}>{children}</p>
);

// Toggle switch
const Toggle = ({ on, onChange, label }) => (
  <label style={{
    display: "inline-flex", alignItems: "center", gap: 10,
    cursor: "pointer", userSelect: "none",
  }}>
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 32, height: 18, borderRadius: 999, border: 0,
        background: on ? "#0165E4" : "#B3BBCB",
        position: "relative",
        cursor: "pointer",
        padding: 0,
        transition: "background 160ms var(--ease-standard)",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 2, left: on ? 16 : 2,
        width: 14, height: 14, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
        transition: "left 160ms var(--ease-standard)",
      }}/>
    </button>
    {label && (
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#1F242D" }}>
        {label}
      </span>
    )}
  </label>
);

// Outline (periwinkle/blue) button
const OutlineBtn = ({ children, icon, onClick, size = "md" }) => {
  const padding = size === "sm" ? "6px 12px" : "8px 14px";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding,
        border: "1px solid #BBD1FF",
        background: "#fff",
        color: "#0165E4",
        fontFamily: "var(--font-sans)",
        fontSize: 13, fontWeight: 600,
        borderRadius: 6,
        cursor: "pointer",
        transition: "all 140ms var(--ease-standard)",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#EBF1FF"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
    >
      {icon}
      {children}
    </button>
  );
};

// Link-style "+ Add" button
const AddLink = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 0",
      border: 0, background: "transparent",
      color: "#0165E4",
      fontFamily: "var(--font-sans)",
      fontSize: 13, fontWeight: 500,
      cursor: "pointer",
    }}
  >
    <RailIcon name="plus" size={14} strokeWidth={2}/>
    {children}
  </button>
);

// Select / dropdown (styled like the screenshot)
const SelectField = ({ value, onClick, placeholder }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      width: "100%",
      padding: "9px 12px",
      border: "1px solid #DCE0E9",
      background: "#fff",
      color: value ? "#1F242D" : "#9099AB",
      fontFamily: "var(--font-sans)",
      fontSize: 13, fontWeight: 500,
      borderRadius: 4,
      cursor: "pointer",
      textAlign: "left",
    }}
  >
    <span>{value || placeholder}</span>
    <RailIcon name="chevronDown" size={14} strokeWidth={2}/>
  </button>
);

// Textarea
const TextArea = ({ value, onChange, focused, onFocus, onBlur, rows = 3 }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    onFocus={onFocus}
    onBlur={onBlur}
    rows={rows}
    style={{
      width: "100%",
      padding: "10px 12px",
      border: focused ? "1px solid #3F8CFF" : "1px solid #DCE0E9",
      background: "#fff",
      color: "#1F242D",
      fontFamily: "var(--font-sans)",
      fontSize: 13, lineHeight: 1.5,
      borderRadius: 4,
      resize: "vertical",
      outline: focused ? "3px solid rgba(63,140,255,0.18)" : "none",
      boxSizing: "border-box",
      transition: "border-color 140ms, outline 140ms",
    }}
  />
);

// Tab pill (Copilot / Summaries and Signals)
const Tabs = ({ items, active, onChange }) => (
  <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
    {items.map(it => {
      const isActive = active === it.id;
      return (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          style={{
            padding: "6px 14px",
            border: 0,
            background: isActive ? "#1F242D" : "transparent",
            color: isActive ? "#fff" : "#1F242D",
            fontFamily: "var(--font-sans)",
            fontSize: 13, fontWeight: 600,
            borderRadius: 999,
            cursor: "pointer",
            transition: "all 140ms var(--ease-standard)",
          }}
        >
          {it.label}
        </button>
      );
    })}
  </div>
);

Object.assign(window, {
  SectionTitle, SubSectionTitle, SparkleGlyph, Description,
  Toggle, OutlineBtn, AddLink, SelectField, TextArea, Tabs,
});
