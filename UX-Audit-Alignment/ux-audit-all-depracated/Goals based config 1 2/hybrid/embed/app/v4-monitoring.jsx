// ─── v4 layer: Monitors page with local Monitors/Anomalies tabs ──────────────
// One page. Two tabs. Switching tabs DOES NOT change the route — tab state is
// local to MonitoringHome. Deep-links from the subnav still work: clicking
// "Monitors" lands on the Monitors tab; clicking "Anomalies" lands on the
// Anomalies tab. After that, tab switching is local.

(() => {
  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  function MonitoringTabs({ active, onChange, counts }) {
    const tabs = [
      { key: 'monitors',  label: 'Monitors',  badge: counts?.monitorsNeedingReview, badgeColor: '#D97706' },
      { key: 'anomalies', label: 'Anomalies', badge: counts?.anomalies,             badgeColor: 'var(--blue-70)' },
    ];
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 4,
        borderBottom: '1px solid var(--gray-30)',
        margin: '0 24px 18px',
        padding: '0 0 0 2px',
      }}>
        {tabs.map(t => {
          const on = active === t.key;
          return (
            <button key={t.key} onClick={() => onChange(t.key)} style={{
              position: 'relative',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px 12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: FF,
              fontSize: 14,
              fontWeight: on ? 600 : 500,
              color: on ? 'var(--gray-130)' : 'var(--gray-95)',
              letterSpacing: '-0.005em',
              borderBottom: on ? '2px solid var(--blue-80)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 0.12s',
            }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.color = 'var(--gray-115)'; }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.color = 'var(--gray-95)'; }}
            >
              {t.label}
              {t.badge > 0 && (
                <span style={{
                  minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? t.badgeColor : 'var(--gray-25)',
                  color: on ? '#fff' : 'var(--gray-100)',
                  fontSize: 10, fontWeight: 700,
                  transition: 'background 0.12s, color 0.12s',
                }}>{t.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  function MonitoringHome({ navigate, openConvo, route }) {
    const { MonitorsList, AnomaliesV2, K_DATA } = window;
    // Local tab state — switching tabs does NOT navigate.
    // Seed once from the route so subnav deep-links land in the right tab.
    const initialTab = route.screen === 'anomalies' ? 'anomalies' : 'monitors';
    const [active, setActive] = React.useState(initialTab);
    // Keep tab in sync when something else navigates (e.g. the in-card
    // "Start here" banner sets route to 'anomalies' to deep-link an anomaly).
    React.useEffect(() => {
      if (route.screen === 'anomalies' && active !== 'anomalies') setActive('anomalies');
      else if (route.screen === 'monitors' && active !== 'monitors') setActive('monitors');
    }, [route.screen]);
    const counts = {
      monitorsNeedingReview: K_DATA.monitors.filter(m => m.passRate < m.threshold || m.breached).length,
      anomalies: K_DATA.anomalies.length,
    };

    return (
      <div style={{ fontFamily: FF }} data-screen-label={'03 Monitors · ' + active}>
        <MonitoringTabs active={active} onChange={setActive} counts={counts}/>
        {active === 'monitors'
          ? <MonitorsList navigate={navigate} openConvo={openConvo}/>
          : <AnomaliesV2 navigate={navigate}/>}
      </div>
    );
  }

  window.MonitoringHome = MonitoringHome;
})();
