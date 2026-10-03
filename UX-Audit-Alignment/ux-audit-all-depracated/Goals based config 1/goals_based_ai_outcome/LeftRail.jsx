// Narrow icon rail on far left (dark)

const LeftRail = ({ active, onNav }) => {
  const top = [
    { id: "home",     icon: "home" },
    { id: "ai",       icon: "sparkles", active: true },
    { id: "inbox",    icon: "inbox", count: 1 },
    { id: "lists",    icon: "barChart" },
    { id: "pulse",    icon: "pulse" },
    { id: "reports",  icon: "chartLine" },
    { id: "apps",     icon: "grid", count: 2 },
    { id: "settings", icon: "cog" },
  ];
  const bottom = [
    { id: "search", icon: "search" },
    { id: "bell",   icon: "bell" },
    { id: "help",   icon: "help" },
  ];

  const Item = ({ it }) => {
    const isActive = active === it.id;
    return (
      <button
        onClick={() => onNav && onNav(it.id)}
        title={it.id}
        style={{
          position: "relative",
          width: 32, height: 32, borderRadius: 8, border: 0,
          background: isActive ? "#2C3641" : "transparent",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isActive ? "#fff" : "#A7B0C0",
          transition: "all 160ms var(--ease-standard)",
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#A7B0C0"; }}
      >
        <RailIcon name={it.icon} size={18} strokeWidth={1.7}/>
        {it.count != null && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            minWidth: 14, height: 14, padding: "0 3px",
            borderRadius: 999, background: "#3F8CFF", color: "#fff",
            fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #1F242D",
          }}>{it.count}</span>
        )}
      </button>
    );
  };

  return (
    <aside style={{
      width: 48, background: "#1F242D",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "10px 0", flexShrink: 0,
    }}>
      {/* Yellow K logo squircle */}
      <button style={{
        width: 28, height: 28, borderRadius: 8, border: 0,
        background: "#FFE81A", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14, padding: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F242D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 9 q2 -3 4 0"/>
          <path d="M13 9 q2 -3 4 0"/>
          <path d="M8 14 q4 5 8 0"/>
        </svg>
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {top.map(it => <Item key={it.id} it={it}/>)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {bottom.map(it => <Item key={it.id} it={it}/>)}
        <div style={{ marginTop: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#F4CC10", color: "#1F242D",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
          }}>AS</div>
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { LeftRail });
