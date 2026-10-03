// Shared primitives for the Kustomer agent desktop UI kit.
// Relies on globals: React.

const KButton = ({ variant = "primary", size = "md", children, onClick, icon, disabled }) => {
  const base = {
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    border: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "all 180ms cubic-bezier(0.2,0.7,0.2,1)",
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 13, borderRadius: 8 },
    md: { padding: "9px 16px", fontSize: 14, borderRadius: 10 },
    lg: { padding: "12px 22px", fontSize: 15, borderRadius: 12 },
  };
  const variants = {
    primary: { background: "#FFE81A", color: "#1F2A2E" },
    ink:     { background: "#1F2A2E", color: "#fff" },
    outline: { background: "transparent", color: "#1F2A2E", boxShadow: "inset 0 0 0 1.5px #1F2A2E" },
    ghost:   { background: "transparent", color: "#1F2A2E" },
    peri:    { background: "#6E79E0", color: "#fff" },
    soft:    { background: "#F2F4F5", color: "#1F2A2E" },
  };
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {icon}{children}
    </button>
  );
};

const KBadge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#F2F4F5", fg: "#65707B", dot: "#9AA3AB" },
    success: { bg: "#E5F5EC", fg: "#0F7A4E", dot: "#16A36B" },
    warning: { bg: "#FBF0D7", fg: "#8A5A08", dot: "#E89B1F" },
    danger:  { bg: "#FBE6E3", fg: "#9A2A1F", dot: "#D84A3B" },
    info:    { bg: "#E4ECFD", fg: "#2B4AB8", dot: "#5B82F0" },
    vip:     { bg: "#FFE81A", fg: "#1F2A2E", dot: null },
    ai:      { bg: "#E2E5FF", fg: "#3D46A8", dot: "#6E79E0" },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, fontFamily: "var(--font-sans)",
      background: t.bg, color: t.fg,
    }}>
      {t.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dot }}/>}
      {children}
    </span>
  );
};

const KAvatar = ({ name, size = 32, color, online, src }) => {
  const initials = (name || "").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const palette = ["#6E79E0", "#1F2A2E", "#E89B1F", "#D84A3B", "#16A36B", "#65707B"];
  const hash = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = color || palette[hash % palette.length];
  return (
    <div style={{ position: "relative", flex: `0 0 ${size}px` }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: src ? `url(${src}) center/cover` : bg,
        color: "#fff", fontSize: size * 0.38, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-sans)",
      }}>
        {!src && initials}
      </div>
      {online && <span style={{
        position: "absolute", right: -1, bottom: -1,
        width: Math.max(8, size * 0.28), height: Math.max(8, size * 0.28), borderRadius: "50%",
        background: "#16A36B", boxShadow: "0 0 0 2px #fff",
      }}/>}
    </div>
  );
};

const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.75 }) => {
  const paths = {
    inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    phone: <path d="M22 16.92V21a1 1 0 0 1-1.11 1 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.18 4.11 1 1 0 0 1 4.18 3h4.09a1 1 0 0 1 1 .75 12.84 12.84 0 0 0 .7 2.81 1 1 0 0 1-.22 1.05L8.09 9.17a16 16 0 0 0 6 6l1.56-1.56a1 1 0 0 1 1.05-.22 12.84 12.84 0 0 0 2.81.7 1 1 0 0 1 .75 1z"/>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></>,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    settings: <><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
    sparkles: <><path d="M9.94 14.34a1.5 1.5 0 0 0-1.09 1.09L8 18l-.85-2.57a1.5 1.5 0 0 0-1.09-1.09L3.5 13.5l2.57-.85a1.5 1.5 0 0 0 1.09-1.09L8 9l.85 2.57a1.5 1.5 0 0 0 1.09 1.09l2.57.85z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    paperclip: <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>,
    tag: <><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    package: <><path d="M12 2 4 7v10l8 5 8-5V7z"/><path d="M12 22V12"/><path d="m4 7 8 5 8-5"/></>,
    check: <path d="M20 6 9 17l-5-5"/>,
    chevronDown: <path d="m6 9 6 6 6-6"/>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    menu: <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>,
    workflow: <><path d="M17 3h4v4"/><path d="M14 10 21 3"/><path d="M8 21H4a1 1 0 0 1-1-1v-4"/><path d="M3 16l7-7"/></>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    home: <><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></>,
    lists: <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>,
    barChart: <><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    help: <><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    sidePanel: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    chevronUp: <path d="m18 15-6-6-6 6"/>,
    reply: <><path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></>,
    note: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    signals: <><path d="M2 12h3l3-9 4 18 3-9h7"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
         style={{ flex: `0 0 ${size}px` }}>
      {paths[name] || paths.inbox}
    </svg>
  );
};

Object.assign(window, { KButton, KBadge, KAvatar, Icon });
