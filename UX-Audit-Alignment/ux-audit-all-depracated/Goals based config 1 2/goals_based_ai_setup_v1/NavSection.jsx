// Secondary navigation — three labelled sections

const NavSection = ({ active, onNav, expanded, setExpanded }) => {
  const subItems = [
    { id: "settings", icon: "cog",   label: "Settings" },
  ];

  const customerExtras = [
    { id: "automations", icon: "bolt",     label: "Manage Automations" },
  ];

  const repsItems = [
    { id: "reps", icon: "cog", label: "Settings" },
  ];

  const resourceItems = [
    { id: "knowledge", icon: "bookOpen", label: "Knowledge Sources" },
    { id: "mcp",       icon: "server",   label: "MCP Servers" },
    { id: "tools",     icon: "wrench",   label: "Tools" },
  ];

  const NavItem = ({ id, icon, label, indent = 0, isSubMenu = false }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => onNav(id)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: `7px ${10 + indent}px`,
          width: "100%",
          border: 0, background: isActive ? "#DBE7FF" : "transparent",
          color: isActive ? "#0165E4" : (isSubMenu ? "#697182" : "#1F242D"),
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          borderRadius: 6,
          cursor: "pointer",
          textAlign: "left",
          transition: "all 140ms var(--ease-standard)",
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F2F3F7"; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
      >
        <RailIcon name={icon} size={15} strokeWidth={1.7}/>
        <span>{label}</span>
      </button>
    );
  };

  const SectionLabel = ({ children, top = 18 }) => (
    <div style={{
      fontFamily: "var(--font-sans)",
      fontSize: 11, fontWeight: 700, color: "#5F6675",
      letterSpacing: "0.02em",
      marginTop: top, marginBottom: 6,
    }}>{children}</div>
  );

  return (
    <aside style={{
      width: 232, background: "#fff",
      borderRight: "1px solid #E8EAF0",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      overflow: "auto",
    }}>
      <div style={{ padding: "18px 16px 8px" }}>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14, fontWeight: 700, color: "#1F242D",
          marginBottom: 14,
        }}>Kustomer AI</div>

        {/* Set Goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 4 }}>
          <NavItem id="setup" icon="sparkles" label="Set Goals"/>
          <div style={{ marginLeft: 14, display: "flex", flexDirection: "column", gap: 2 }}>
            <NavItem id="setup-build" icon="chat" label="Build" indent={6} isSubMenu/>
            <NavItem id="setup-test" icon="flask" label="Test & Evaluate" indent={6} isSubMenu/>
            <NavItem id="setup-deploy" icon="rocket" label="Deploy" indent={6} isSubMenu/>
            <NavItem id="setup-analyze" icon="barChart" label="Analyze" indent={6} isSubMenu/>
          </div>
        </div>

        {/* Performance — top-level alongside Set Goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 4 }}>
          <NavItem id="performance" icon="chartLine" label="Performance"/>
        </div>

        {/* AI for Customers */}
        <SectionLabel>AI for Customers</SectionLabel>

        <div style={{ marginBottom: 4 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px",
              width: "100%",
              border: "1px solid #E8EAF0",
              background: "#fff",
              color: "#1F242D",
              fontFamily: "var(--font-sans)",
              fontSize: 13, fontWeight: 600,
              borderRadius: 6,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(31, 42, 46, 0.04)",
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "#3F8CFF", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <RailIcon name="refund" size={11} strokeWidth={2.5}/>
            </span>
            <span style={{ flex: 1, textAlign: "left" }}>Refund Order</span>
            <RailIcon name="chevronDown" size={14} strokeWidth={2}/>
          </button>

          {expanded && (
            <div style={{ marginTop: 4, marginLeft: 14, display: "flex", flexDirection: "column", gap: 2 }}>
              {subItems.map(it => (
                <NavItem key={it.id} {...it} indent={6} isSubMenu/>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          {customerExtras.map(it => <NavItem key={it.id} {...it}/>)}
        </div>

        {/* AI for Reps */}
        <SectionLabel>AI for Reps</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {repsItems.map(it => <NavItem key={it.id} {...it}/>)}
        </div>

        {/* Resources */}
        <SectionLabel>Resources</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {resourceItems.map(it => <NavItem key={it.id} {...it}/>)}
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { NavSection });
