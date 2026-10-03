// ============================================================
// Icon set — simple SVG icons used across the prototype.
// ============================================================

const Icon = ({ name, size = 16 }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
  };

  switch (name) {
    case "target":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>;
    case "activity":
      return <svg {...props}><path d="M3 12h4l3-9 4 18 3-9h4" /></svg>;
    case "sparkles":
      return <svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" strokeWidth="1.4"/></svg>;
    case "headset":
      return <svg {...props}><path d="M4 14a8 8 0 0 1 16 0" /><path d="M4 14v3a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2z" /><path d="M20 14v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2z" /></svg>;
    case "building":
      return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M9 8h.01M9 12h.01M9 16h.01M15 8h.01M15 12h.01M15 16h.01"/></svg>;
    case "server":
      return <svg {...props}><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><circle cx="7" cy="7.5" r="0.8" fill="currentColor"/><circle cx="7" cy="16.5" r="0.8" fill="currentColor"/></svg>;
    case "bolt":
      return <svg {...props}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
    case "wand":
      return <svg {...props}><path d="M5 19l14-14"/><path d="M5 19l3 3"/><path d="M19 5l-2-2"/><path d="M9 15l3-3"/></svg>;
    case "home":
      return <svg {...props}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case "inbox":
      return <svg {...props}><path d="M3 12h6l2 3h2l2-3h6"/><path d="M3 12V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7"/><path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg>;
    case "pieChart":
      return <svg {...props}><path d="M21 12A9 9 0 1 1 12 3v9z"/></svg>;
    case "bell":
      return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0v5l1.5 3h-15L6 13V8z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
    case "moreH":
      return <svg {...props}><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></svg>;
    case "moreV":
      return <svg {...props}><circle cx="12" cy="6" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="18" r="1.4" fill="currentColor"/></svg>;
    case "user":
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "users":
      return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M2 19a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M14 17a5 5 0 0 1 8 0"/></svg>;
    case "chevDown":
      return <svg {...props}><path d="M6 9l6 6 6-6"/></svg>;
    case "chevRight":
      return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevLeft":
      return <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>;
    case "x":
      return <svg {...props}><path d="M6 6l12 12M18 6l-12 12"/></svg>;
    case "check":
      return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case "plus":
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "edit":
      return <svg {...props}><path d="M14 4l6 6-10 10H4v-6L14 4z"/></svg>;
    case "trash":
      return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7v13h12V7M10 11v6M14 11v6"/></svg>;
    case "play":
      return <svg {...props}><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>;
    case "pause":
      return <svg {...props}><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>;
    case "lock":
      return <svg {...props}><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case "send":
      return <svg {...props}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case "filter":
      return <svg {...props}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>;
    case "sliders":
      return <svg {...props}><path d="M4 6h13M4 12h7M4 18h10"/><circle cx="20" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>;
    case "book":
      return <svg {...props}><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>;
    case "tool":
      return <svg {...props}><path d="M14 4l6 6-10 10H4v-6z"/><path d="M14 4l3 3"/></svg>;
    case "code":
      return <svg {...props}><path d="M8 8l-5 4 5 4"/><path d="M16 8l5 4-5 4"/><path d="M14 4l-4 16"/></svg>;
    case "tag":
      return <svg {...props}><path d="M3 12l9-9 9 9-9 9z"/><circle cx="9" cy="9" r="1" fill="currentColor"/></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "upload":
      return <svg {...props}><path d="M12 4v12"/><path d="M7 9l5-5 5 5"/><path d="M4 20h16"/></svg>;
    case "drag":
      return <svg {...props}><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></svg>;
    case "warning":
      return <svg {...props}><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/></svg>;
    case "info":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.01"/></svg>;
    case "globe":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "rotate":
      return <svg {...props}><path d="M4 4v6h6"/><path d="M4 10A8 8 0 0 1 19 8"/><path d="M20 20v-6h-6"/><path d="M20 14a8 8 0 0 1-15 2"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>;
  }
};

window.Icon = Icon;
