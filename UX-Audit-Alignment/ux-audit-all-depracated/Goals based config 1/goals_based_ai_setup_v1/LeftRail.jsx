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
      {/* Official Kustomer Kusty mark — yellow squircle + black Kusty face */}
      <button title="Kustomer" style={{
        width: 30, height: 30, borderRadius: 8, border: 0,
        background: "#F4CC10", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14, padding: 0,
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
      }}>
        <svg width="22" height="22" viewBox="0 0 489 489" xmlns="http://www.w3.org/2000/svg">
          <g fill="#1F242D">
            <path d="M327.365 290.420 L161.585 290.420 C159.183 290.420 156.969 291.661 155.762 293.735 C154.567 295.820 154.567 298.362 155.762 300.435 C156.969 302.556 186.243 352.482 244.521 352.482 C302.788 352.482 331.992 302.556 333.187 300.435 C334.300 298.362 334.300 295.820 333.082 293.735 C331.898 291.661 329.673 290.420 327.365 290.420 Z"/>
            <path d="M330.048 114.061 C337.709 114.061 343.800 107.829 343.800 100.203 C343.800 92.530 337.709 86.345 330.048 86.345 C297.435 86.345 271.031 112.808 271.031 145.315 L271.031 213.246 C271.031 220.872 277.216 227.057 284.877 227.057 L330.048 227.057 C337.709 227.057 343.800 220.872 343.800 213.246 L343.800 168.040 C343.800 160.368 337.709 154.182 330.048 154.182 L298.548 154.182 L298.548 145.315 C298.548 128.142 312.675 114.061 330.048 114.061 Z"/>
            <path d="M158.808 227.057 C151.147 227.057 145.044 220.872 145.044 213.246 L145.044 145.315 C145.044 112.808 171.460 86.345 204.072 86.345 C211.733 86.345 217.918 92.530 217.918 100.203 C217.918 107.829 211.733 114.061 204.072 114.061 C186.794 114.061 172.666 128.142 172.666 145.315 L172.666 154.182 L204.072 154.182 C211.733 154.182 217.918 160.368 217.918 168.040 L217.918 213.246 C217.918 220.872 211.733 227.057 204.072 227.057 L158.808 227.057 Z"/>
          </g>
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
