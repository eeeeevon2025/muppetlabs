// App shell: Kustomer global sidebar + AI Monitoring secondary nav.

// SVG icon paths — matched pixel-for-pixel to the Main nav light mode reference
const NAV_ICONS = {
  home:     <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  sparkles: <><path d="M9.94 14.34a1.5 1.5 0 0 0-1.09 1.09L8 18l-.85-2.57a1.5 1.5 0 0 0-1.09-1.09L3.5 13.5l2.57-.85a1.5 1.5 0 0 0 1.09-1.09L8 9l.85 2.57a1.5 1.5 0 0 0 1.09 1.09l2.57.85z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/></>,
  inbox:    <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
  lists:    <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none"/></>,
  pie:      <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
  grid:     <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  sliders:  <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
  search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  book:     <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
  panel:    <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  beaker:   <><path d="M9 3h6"/><path d="M10 3v8L4 21h16L14 11V3"/></>,
};

function NavItem({ iconKey, label, active, count, children }) {
  return (
    <button
      title={label}
      style={{
        position: 'relative',
        width: 36, height: 36, borderRadius: 8, border: 0,
        background: active ? 'var(--gray-25)' : 'transparent',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--gray-120)' : 'var(--gray-95)',
        transition: 'background 0.1s, color 0.1s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-25)'; e.currentTarget.style.color = 'var(--gray-120)'; }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-95)'; } else { e.currentTarget.style.background = 'var(--gray-25)'; }}}
    >
      {children || (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {NAV_ICONS[iconKey]}
        </svg>
      )}
      {count != null && (
        <span style={{
          position: 'absolute', top: -2, right: -2,
          minWidth: 16, height: 16, padding: '0 4px',
          borderRadius: 999, background: 'var(--blue-70)', color: '#fff',
          fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
        }}>{count}</span>
      )}
    </button>
  );
}

function Shell({ route, navigate, counts }) {
  // Section nav config — keyed off route screens
  const subnavItems = [
    { key: 'goals', icon: <IGoal/>, label: 'Goals', count: counts.goals },
    { key: 'monitors', icon: <IMonitor/>, label: 'Quality Monitors', count: counts.monitors },
    { key: 'inbox', icon: <IAlert/>, label: 'Alerts', count: counts.inbox, alert: counts.inbox > 0 },
  ];
  const subnavSecondary = [
    { key: 'computed', icon: <IBolt/>, label: 'Computed Fields', count: counts.computed },
    { key: 'agents', icon: <IRobot/>, label: 'AI Agents', count: 2, disabled: true },
    { key: 'reports', icon: <IGrid/>, label: 'Reports', disabled: true },
  ];
  const isAIMonitoring = ['goals','monitors','inbox','computed','goal','monitor','convo','newgoal','newmonitor'].includes(route.screen);

  return (
    <>
      <nav className="sidebar" aria-label="Kustomer global navigation">

        {/* Kusty logo — yellow circle with smiley face, exactly as in screenshot */}
        <div style={{ marginBottom: 14, flexShrink: 0 }} title="Kustomer">
          <svg width="32" height="32" viewBox="0 0 200 191" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M100.83 190.657C17.2068 190.657 0 152.408 0 95.5804C0 38.7529 16.414 0 100.83 0C185.247 0 200.011 39.1064 200.011 96.2876C200.011 153.469 184.454 190.657 100.83 190.657Z" fill="#FBEC2A"/>
            <path d="M99.8234 138.115C80.613 138.115 64.9919 122.066 64.9919 102.341V82.7449H73.5632V102.341C73.5632 117.341 85.3487 129.544 99.8234 129.544C114.298 129.544 126.084 117.341 126.084 102.341V82.7449H134.655V102.341C134.655 122.066 119.034 138.115 99.8234 138.115Z" fill="#292929"/>
            <path d="M89.0988 65.3129C87.6203 61.6058 84.0846 59.2165 80.099 59.2165C76.1134 59.2165 72.5884 61.6165 71.0992 65.3129L63.6422 62.3236C66.3528 55.5523 72.8134 51.1703 80.099 51.1703C87.3846 51.1703 93.8452 55.5416 96.5559 62.3236L89.0988 65.3129Z" fill="#292929"/>
            <path d="M128.162 65.3129C126.673 61.6058 123.148 59.2165 119.163 59.2165C115.177 59.2165 111.652 61.6165 110.163 65.3129L102.706 62.3236C105.416 55.5523 111.877 51.1703 119.163 51.1703C126.448 51.1703 132.909 55.5416 135.619 62.3236L128.162 65.3129Z" fill="#292929"/>
          </svg>
        </div>

        {/* Top nav — matches screenshot exactly:
            home, sparkles(AI), beaker(AI Monitoring — our section, inserted right after AI),
            inbox(customer tickets), lists, pie, activity, grid, settings/gear */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <NavItem iconKey="home"     label="Home"/>
          <NavItem iconKey="sparkles" label="AI"/>
          <NavItem iconKey="beaker"   label="AI Monitoring" active={isAIMonitoring}/>
          <NavItem iconKey="inbox"    label="Customer Inbox"/>
          <NavItem iconKey="lists"    label="Search"/>
          <NavItem iconKey="pie"      label="Reports"/>
          <NavItem iconKey="activity" label="Activity"/>
          <NavItem iconKey="grid"     label="Apps"/>
          <NavItem iconKey="sliders"  label="Settings"/>
        </div>

        {/* Bottom utility row — matches screenshot exactly:
            search, book, panel/screen, bell, help(?), YD avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <NavItem iconKey="search"  label="Search"/>
          <NavItem iconKey="book"    label="Knowledge base"/>
          <NavItem iconKey="panel"   label="Panel"/>
          <NavItem iconKey="bell"    label="Notifications"/>
          {/* Help / ? icon */}
          <button title="Help" style={{ width: 36, height: 36, borderRadius: 8, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-95)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-25)'; e.currentTarget.style.color = 'var(--gray-120)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-95)'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
          {/* Avatar — YD initials + green online dot, matches screenshot */}
          <div style={{ position: 'relative', marginTop: 2, cursor: 'pointer' }} title="Your profile">
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F4CC10', color: '#1F242D', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>YD</div>
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#16A36B', border: '2px solid #fff' }}></span>
          </div>
        </div>
      </nav>

      <aside className="subnav" aria-label="AI Monitoring sections">
        <div className="subnav__header">
          <div className="subnav__eyebrow">Section</div>
          <div className="subnav__title">
            AI Monitoring
            <span className="subnav__beta">M1 BETA</span>
          </div>
        </div>
        <div className="subnav__list">
          {subnavItems.map((it) => (
            <button key={it.key}
              className={'subnav__link' + (route.screen === it.key || route.section === it.key ? ' subnav__link--active' : '')}
              onClick={() => navigate({ screen: it.key })}>
              {it.icon}
              <span>{it.label}</span>
              {it.count != null && <span className={'subnav__count' + (it.alert ? ' subnav__count--alert' : '')}>{it.count}</span>}
            </button>
          ))}
          <div className="subnav__group">Configuration</div>
          {subnavSecondary.map((it) => (
            <button key={it.key}
              disabled={it.disabled}
              className={'subnav__link' + (route.screen === it.key ? ' subnav__link--active' : '')}
              onClick={() => !it.disabled && navigate({ screen: it.key })}
              style={it.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : null}>
              {it.icon}
              <span>{it.label}</span>
              {it.count != null && <span className="subnav__count">{it.count}</span>}
              {it.disabled && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--gray-85)', fontWeight: 600, letterSpacing: '0.04em' }}>SOON</span>}
            </button>
          ))}
        </div>
        <div className="subnav__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <IInfo size={12}/> M1 Beta
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            Limits: 3 Computed Fields per object, 2 OOTB + 1 custom monitor.
          </div>
        </div>
      </aside>
    </>
  );
}

window.Shell = Shell;
