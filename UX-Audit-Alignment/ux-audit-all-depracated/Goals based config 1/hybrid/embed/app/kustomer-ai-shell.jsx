// Kustomer-AI-shaped shell — matches the screenshot's left rail + Kustomer AI
// subnav. Performance is expanded with "Monitoring" as the active child page.

(() => {
  const { useState } = React;
  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  // Icon set — minimal stroke-based glyphs
  const I = {
    home:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-3v-7H8v7H5a2 2 0 0 1-2-2z"/></svg>,
    sparkles:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7zM18 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>,
    inbox:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h5l1 2h6l1-2h5M5 4h14l2 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"/></svg>,
    search:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
    perf:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l5-6 4 4 4-7 5 9"/></svg>,
    headset:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3M4 14h3v5H4zM17 14h3v5h-3zM7 19a4 4 0 0 0 4 4h2"/></svg>,
    grid:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    gear:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3h0a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.5h0a1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8v0a1.65 1.65 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"/></svg>,
    bell:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg>,
    chevDown:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    chevRight:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>,
  };

  // Far-left icon rail — yellow K logo on top, icon list, then bottom utilities
  function LeftRail() {
    const items = [
      { key: 'home', icon: I.home },
      { key: 'kustomerAi', icon: I.sparkles, active: true },
      { key: 'inbox', icon: I.inbox },
      { key: 'search', icon: I.search },
      { key: 'perf', icon: I.perf },
      { key: 'headset', icon: I.headset },
      { key: 'grid', icon: I.grid, dot: true },
      { key: 'gear', icon: I.gear },
    ];
    return (
      <div style={{
        width: 48, flexShrink: 0,
        background: '#fff', borderRight: '1px solid var(--gray-30)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '12px 0', gap: 4,
      }}>
        {/* Yellow K logo */}
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: '#FBE044',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 18, color: '#1A1D23',
          marginBottom: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1A1D23"><circle cx="9" cy="12" r="2.5"/><circle cx="15" cy="12" r="2.5"/><path d="M5 4v16M19 4v16" stroke="#1A1D23" strokeWidth="1.5"/></svg>
        </div>
        {items.map(it => (
          <button key={it.key} style={{
            width: 36, height: 36, borderRadius: 6,
            background: it.active ? 'var(--gray-15)' : 'transparent',
            border: 'none', cursor: 'pointer',
            color: it.active ? 'var(--gray-130)' : 'var(--gray-95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}
            onMouseEnter={e => { if (!it.active) e.currentTarget.style.background = 'var(--gray-15)'; }}
            onMouseLeave={e => { if (!it.active) e.currentTarget.style.background = 'transparent'; }}
          >
            {it.icon}
            {it.dot && <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: 999, background: 'var(--blue-70)' }}/>}
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <button style={{ width: 36, height: 36, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.search}</button>
        <button style={{ width: 36, height: 36, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray-85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.bell}</button>
      </div>
    );
  }

  // Kustomer AI subnav column
  function KustomerAISubnav({ active }) {
    const [airOpen, setAirOpen] = useState(true);
    const [perfOpen, setPerfOpen] = useState(true);

    const navItem = (key, label, opts = {}) => {
      const { isActive, isChild, onClick, icon } = opts;
      return (
        <button
          key={key}
          onClick={onClick}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', textAlign: 'left',
            padding: isChild ? '6px 12px 6px 36px' : '6px 12px',
            borderRadius: 6,
            background: isActive ? 'var(--gray-25)' : 'transparent',
            border: 'none', cursor: 'pointer',
            fontFamily: FF, fontSize: 13,
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--gray-130)' : 'var(--gray-115)',
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--gray-15)'; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
        >
          {icon && <span style={{ display: 'inline-flex', color: isActive ? 'var(--gray-130)' : 'var(--gray-95)' }}>{icon}</span>}
          <span style={{ flex: 1 }}>{label}</span>
        </button>
      );
    };

    return (
      <div style={{
        width: 240, flexShrink: 0,
        background: '#fff', borderRight: '1px solid var(--gray-30)',
        display: 'flex', flexDirection: 'column',
        padding: '14px 12px', overflow: 'hidden auto',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-130)', padding: '6px 12px 12px', letterSpacing: '-0.005em' }}>Kustomer AI</div>

        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 12px 4px' }}>AI for Customers</div>

        {/* AIR Comp dropdown */}
        <button
          onClick={() => setAirOpen(!airOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px 6px 10px', marginTop: 2,
            border: '1px solid var(--gray-30)', borderRadius: 6,
            background: '#fff', cursor: 'pointer', fontFamily: FF,
          }}
        >
          <span style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--blue-70)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3.5"/></svg>
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-130)', flex: 1, textAlign: 'left' }}>AIR Comp</span>
          <span style={{ color: 'var(--gray-90)' }}>{I.chevDown}</span>
        </button>

        {airOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 4 }}>
            {[
              { label: 'Build', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9l-4 4-2-2-4 4M14 9h4M14 9v4"/></svg> },
              { label: 'Test',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 12h6"/></svg> },
              { label: 'Deploy', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v10M8 7l4-4 4 4M5 21h14"/></svg> },
              { label: 'Analyze', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l5-6 4 4 4-7 5 9"/></svg> },
              { label: 'Settings', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2.5"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5 2 2 0 1 1-4 0 1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3 2 2 0 1 1-2.8-2.8 1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1 2 2 0 1 1 0-4 1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8 2 2 0 1 1 2.8-2.8 1.65 1.65 0 0 0 1.8.3 1.65 1.65 0 0 0 1-1.5 2 2 0 1 1 4 0 1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3 2 2 0 1 1 2.8 2.8 1.65 1.65 0 0 0-.3 1.8 1.65 1.65 0 0 0 1.5 1 2 2 0 1 1 0 4 1.65 1.65 0 0 0-1.5 1z"/></svg> },
            ].map(s => navItem(s.label, s.label, { isChild: true, icon: s.icon }))}
          </div>
        )}

        <div style={{ marginTop: 6 }}>
          {navItem('manage', 'Manage Automations', { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg> })}
        </div>

        {/* Performance — expanded with Monitoring as child */}
        <button
          onClick={() => setPerfOpen(!perfOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', textAlign: 'left',
            padding: '6px 12px',
            borderRadius: 6,
            background: 'transparent',
            border: 'none', cursor: 'pointer',
            fontFamily: FF, fontSize: 13, fontWeight: 500,
            color: 'var(--gray-115)',
            marginTop: 1,
          }}
        >
          <span style={{ display: 'inline-flex', color: 'var(--gray-95)' }}>{I.perf}</span>
          <span style={{ flex: 1 }}>Performance</span>
          <span style={{ color: 'var(--gray-90)', transform: perfOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.12s' }}>{I.chevRight}</span>
        </button>

        {perfOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
            {navItem('monitoring', 'Monitoring', { isChild: true, isActive: active === 'monitoring' })}
            {navItem('reports', 'Reports', { isChild: true })}
          </div>
        )}

        <div style={{ height: 1, background: 'var(--gray-25)', margin: '12px 8px' }}/>

        {navItem('kb', 'Knowledge Sources', { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg> })}
        {navItem('mcp', 'MCP Servers', { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="6"/><rect x="3" y="14" width="18" height="6"/><circle cx="7" cy="7" r="0.5"/><circle cx="7" cy="17" r="0.5"/></svg> })}
        {navItem('reps', 'Reps', { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v-3a8 8 0 0 1 16 0v3M4 14h3v5H4zM17 14h3v5h-3z"/></svg> })}
        {navItem('tools', 'Tools', { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 7l3-3 4 4-3 3M14 7l-9 9-2 5 5-2 9-9M14 7l3 3"/></svg> })}
      </div>
    );
  }

  function KustomerAIShell({ children, active = 'monitoring' }) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#fff' }}>
        <LeftRail/>
        <KustomerAISubnav active={active}/>
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
          {children}
        </div>
      </div>
    );
  }

  window.KustomerAIShell = KustomerAIShell;
})();
