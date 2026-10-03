// v2 reframed shell + Goals home + screens.
// Key changes:
// - Sidebar nav demoted: Goals is primary; Inbox is alerts; everything else lives in Settings drawer
// - Goals home leads with narrative summary + observe/investigate/understand/resolve loop
// - Goal cards have inline "Why this number?" explanation
// - Goal creation is a single picker (no wizard) — monitor + field auto-generated
// - Suggestion cards show traceability chain
// - Every screen has a clear "next action"

const { useState: useState2, useMemo: useMemo2 } = React;

// ───────────────────────── Shell v2 ─────────────────────────
function ShellV2({ route, navigate, counts }) {
  const items = [
  { key: 'goals', icon: <IGoal />, label: 'Goals', sub: 'What we\'re tracking', count: counts.goals },
  { key: 'inbox', icon: <IAlert />, label: 'Alerts', sub: 'Suggestions & anomalies', count: counts.inbox, alert: counts.inbox > 0 }];

  const isAIM = ['goals', 'inbox', 'goal', 'convo', 'newgoal', 'settings'].includes(route.screen);
  // Reusable nav button matching design system light-mode sidebar exactly
  const SideBtn = ({ label, active, badge, children }) =>
  <button title={label} style={{
    position: 'relative', width: 36, height: 36, borderRadius: 8, border: 0,
    background: active ? 'var(--gray-25)' : 'transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: active ? 'var(--gray-120)' : 'var(--gray-95)',
    transition: 'background 0.1s, color 0.1s'
  }}
  onMouseEnter={(e) => {e.currentTarget.style.background = 'var(--gray-25)';e.currentTarget.style.color = 'var(--gray-120)';}}
  onMouseLeave={(e) => {if (!active) {e.currentTarget.style.background = 'transparent';e.currentTarget.style.color = 'var(--gray-95)';}}}>
      {children}
      {badge != null &&
    <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--blue-70)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{badge}</span>
    }
    </button>;


  // Inline SVG icons at 18px strokeWidth 1.7 — exact design system spec
  const Ico = ({ d, children }) =>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children || <path d={d} />}
    </svg>;


  return (
    <>
      <nav style={{ width: 56, background: '#fff', borderRight: '1px solid var(--gray-30)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 4, flexShrink: 0 }} aria-label="Kustomer global navigation">

        {/* Kusty mark — exact SVG from design system */}
        <div style={{ marginBottom: 14, flexShrink: 0, cursor: 'pointer' }} title="Kustomer">
          <svg width="32" height="32" viewBox="0 0 200 191" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', borderRadius: 8 }}>
            <path d="M100.83 190.657C17.2068 190.657 0 152.408 0 95.5804C0 38.7529 16.414 0 100.83 0C185.247 0 200.011 39.1064 200.011 96.2876C200.011 153.469 184.454 190.657 100.83 190.657Z" fill="#FBEC2A" />
            <path d="M99.8234 138.115C80.613 138.115 64.9919 122.066 64.9919 102.341V82.7449H73.5632V102.341C73.5632 117.341 85.3487 129.544 99.8234 129.544C114.298 129.544 126.084 117.341 126.084 102.341V82.7449H134.655V102.341C134.655 122.066 119.034 138.115 99.8234 138.115Z" fill="#292929" />
            <path d="M89.0988 65.3129C87.6203 61.6058 84.0846 59.2165 80.099 59.2165C76.1134 59.2165 72.5884 61.6165 71.0992 65.3129L63.6422 62.3236C66.3528 55.5523 72.8134 51.1703 80.099 51.1703C87.3846 51.1703 93.8452 55.5416 96.5559 62.3236L89.0988 65.3129Z" fill="#292929" />
            <path d="M128.162 65.3129C126.673 61.6058 123.148 59.2165 119.163 59.2165C115.177 59.2165 111.652 61.6165 110.163 65.3129L102.706 62.3236C105.416 55.5523 111.877 51.1703 119.163 51.1703C126.448 51.1703 132.909 55.5416 135.619 62.3236L128.162 65.3129Z" fill="#292929" />
          </svg>
        </div>

        {/* Top nav — exact order matching screenshot:
                Home → Sparkles(AI) → Beaker(AI Monitoring, our section) → Inbox(customer tickets) → Lists/Search → Pie/Reports → Activity → Grid/Apps → Gear/Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {/* Home */}
          <SideBtn label="Home">
            <Ico><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Ico>
          </SideBtn>
          {/* Sparkles — AI */}
          <SideBtn label="AI">
            <Ico><path d="M9.94 14.34a1.5 1.5 0 0 0-1.09 1.09L8 18l-.85-2.57a1.5 1.5 0 0 0-1.09-1.09L3.5 13.5l2.57-.85a1.5 1.5 0 0 0 1.09-1.09L8 9l.85 2.57a1.5 1.5 0 0 0 1.09 1.09l2.57.85z" /><path d="M20 3v4M22 5h-4M4 17v2M5 18H3" /></Ico>
          </SideBtn>
          {/* Beaker — AI Monitoring (our section, active) */}
          <SideBtn label="AI Monitoring" active={isAIM}>
            <Ico><path d="M9 3h6" /><path d="M10 3v8L4 21h16L14 11V3" /></Ico>
          </SideBtn>
          {/* Inbox — customer support tickets */}
          <SideBtn label="Customer Inbox" badge={4}>
            <Ico><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></Ico>
          </SideBtn>
          {/* Lists / Search */}
          <SideBtn label="Lists">
            <Ico><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none" /></Ico>
          </SideBtn>
          {/* Pie / Reports */}
          <SideBtn label="Reports">
            <Ico><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></Ico>
          </SideBtn>
          {/* Activity */}
          <SideBtn label="Activity">
            <Ico><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Ico>
          </SideBtn>
          {/* Grid / Apps */}
          <SideBtn label="Apps">
            <Ico><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Ico>
          </SideBtn>
          {/* Gear / Settings */}
          <SideBtn label="Settings">
            <Ico><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Ico>
          </SideBtn>
        </div>

        {/* Bottom utility — exact order from screenshot: Search → Book → Panel/screen → Bell → Help(?) → YD avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <SideBtn label="Search">
            <Ico><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ico>
          </SideBtn>
          <SideBtn label="Knowledge base">
            <Ico><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Ico>
          </SideBtn>
          {/* Panel / screen */}
          <SideBtn label="Panel">
            <Ico><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></Ico>
          </SideBtn>
          <SideBtn label="Notifications">
            <Ico><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ico>
          </SideBtn>
          <SideBtn label="Help">
            <Ico><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></Ico>
          </SideBtn>
          {/* Avatar — YD initials + green online dot, matches screenshot */}
          <div style={{ position: 'relative', marginTop: 4, cursor: 'pointer' }} title="Your profile">
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F4CC10', color: '#1F242D', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>YD</div>
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#16A36B', border: '2px solid #fff' }}></span>
          </div>
        </div>
      </nav>

      <aside className="subnav" aria-label="AI Monitoring">
        <div className="subnav__header">
          <div className="subnav__eyebrow">AI Quality</div>
          <div className="subnav__title">Goals &amp; Monitoring<span className="subnav__beta">M1 BETA</span></div>
        </div>
        <div className="subnav__list">
          {items.map((it) =>
          <button key={it.key}
          className={'subnav__link' + (route.screen === it.key || it.key === 'goals' && route.screen === 'goal' ? ' subnav__link--active' : '')}
          onClick={() => navigate({ screen: it.key })}
          style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px', gap: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                {it.icon}
                <span>{it.label}</span>
                {it.count != null && <span className={'subnav__count' + (it.alert ? ' subnav__count--alert' : '')} style={{ marginLeft: 'auto' }}>{it.count}</span>}
              </span>
              <span style={{ fontSize: 11, color: 'var(--gray-90)', marginLeft: 26, fontWeight: 400 }}>{it.sub}</span>
            </button>
          )}
          <div className="subnav__group">Configuration</div>
          <button className={'subnav__link' + (route.screen === 'settings' ? ' subnav__link--active' : '')} onClick={() => navigate({ screen: 'settings' })}>
            <ISettings size={14} />
            <span>Scoring &amp; fields</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gray-85)' }}>Advanced</span>
          </button>
        </div>
        <div className="subnav__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <IInfo size={12} /> M1 Beta
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            Currently tracking {counts.goals} goals across {counts.monitors} scorers.
          </div>
        </div>
      </aside>
    </>);

}

// ───────────────────────── Goals Home v2 ─────────────────────────
function GoalsHomeV2({ navigate, openConvo, openNewGoal, tweaks = {} }) {
  const { goals, monitors, suggestions, anomalies, flaggedConversations } = window.K_DATA;
  const monitorById = Object.fromEntries(monitors.map((m) => [m.id, m]));
  const inboxCount = suggestions.length + anomalies.length;
  const [showAll, setShowAll] = useState2(false);

  const cols = tweaks.goalColumns || 2;
  const compact = tweaks.density === 'compact';
  const showLoop = tweaks.showLoopStrip !== false;
  const showAlert = tweaks.showAlert !== false;

  return (
    <div className="page">
      <div className="page__header" style={{ marginBottom: 14 }}>
        <div>
          <h1 className="page__title">Goals</h1>
          <p className="page__subtitle" style={{ whiteSpace: "nowrap" }}>Set what good looks like. We'll watch every conversation, surface what's working, and tell you what to fix.</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--primary" onClick={openNewGoal}><IPlus size={14} />New goal</button>
        </div>
      </div>

      {/* Degradation alert banner */}
      {showAlert && <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        border: '1px solid var(--yellow-50)', borderRadius: 10,
        padding: '11px 18px', marginBottom: 16, background: 'white'
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'var(--yellow-100)',
          border: '1.5px solid var(--yellow-70)', borderRadius: 20,
          padding: '3px 10px', whiteSpace: 'nowrap', flexShrink: 0
        }}>1 monitor degraded</span>
        <span style={{ fontSize: 13, color: 'var(--gray-115)', flex: 1 }}>
          Procedure Adherence Monitor dropped below 65% threshold — 2 hours ago
        </span>
        <a onClick={() => navigate({ screen: 'settings' })} style={{
          fontSize: 13, fontWeight: 600, color: 'var(--blue-80)',
          cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4
        }}>View monitor <IChevronRight size={13} /></a>
        <span style={{ fontSize: 12, color: 'var(--gray-85)', whiteSpace: 'nowrap' }}>Last evaluated 4 min ago</span>
      </div>}

      {/* Loop strip — makes the operational model visible */}
      {showLoop && <div className="loop-strip" role="navigation" aria-label="Operational loop">
        <div className="loop-step loop-step--done" onClick={() => navigate({ screen: 'goals' })}>
          <div className="loop-step__dot"><ITarget size={14} stroke={2} /></div>
          <div>
            <div className="loop-step__label">1 · Observe</div>
            <div className="loop-step__title">Goals</div>
          </div>
          <div className="loop-step__count">{goals.length}</div>
        </div>
        <div className="loop-step loop-step--done">
          <div className="loop-step__dot"><IMonitor size={14} stroke={2} /></div>
          <div>
            <div className="loop-step__label">2 · Investigate</div>
            <div className="loop-step__title">Scoring on every conversation</div>
          </div>
          <div className="loop-step__count">{monitors.length}</div>
        </div>
        <div className={'loop-step ' + (inboxCount > 0 ? 'loop-step--active loop-step--alert' : '')} onClick={() => navigate({ screen: 'inbox' })}>
          <div className="loop-step__dot"><IWand size={14} stroke={2} /></div>
          <div>
            <div className="loop-step__label">3 · Understand</div>
            <div className="loop-step__title">Alerts &amp; suggestions</div>
          </div>
          <div className="loop-step__count">{inboxCount}</div>
        </div>
        <div className="loop-step">
          <div className="loop-step__dot"><ICheckCircle size={14} stroke={2} /></div>
          <div>
            <div className="loop-step__label">4 · Resolve</div>
            <div className="loop-step__title">Apply &amp; track impact</div>
          </div>

        </div>
      </div>}

      <div className="section-head">
        <div>
          <h3 className="section-head__title">Your goals <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--gray-90)', marginLeft: 6 }}>({goals.length})</span></h3>
          <div className="section-head__sub">Each goal automatically gets a scorer that watches every conversation.</div>
        </div>
        {goals.length > 4 &&
        <button className="btn btn--ghost btn--sm" onClick={() => setShowAll((g) => !g)}>
            {showAll ? 'Show less' : `Show all ${goals.length}`}
          </button>
        }
      </div>

      <div className="goal-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {(showAll ? goals : goals.slice(0, 4)).map((g) =>
        <GoalCardV2 key={g.id} goal={g} monitor={g.monitorIds.map((id) => monitorById[id])} onOpen={() => navigate({ screen: 'goal', id: g.id })} />
        )}
      </div>

      {!showAll && goals.length > 4 &&
      <button className="btn btn--ghost btn--sm" style={{ marginTop: 10, width: '100%', justifyContent: 'center', borderTop: '1px solid var(--gray-30)', borderRadius: 0, padding: '12px 0' }} onClick={() => setShowAll(true)}>
          Show {goals.length - 4} more goals <IChevronDown size={13} />
        </button>
      }

    </div>);

}

function GoalCardV2({ goal, monitor, onOpen }) {
  const m = monitor[0];
  const fmt = (v) => goal.unit === 'currency' ? '$' + v.toFixed(2) : goal.unit === 'percent' ? v + '%' : v.toFixed(v < 10 ? 1 : 0);
  const fillKind = goal.status === 'improving' ? 'good' : goal.status === 'stalled' || goal.status === 'declining' ? 'watch' : 'neutral';

  // Explanation copy keyed on data — humanizes the number
  let why,whyKind = 'good';
  if (goal.status === 'improving') {
    why = <>Up {goal.change7d} this week. {m ? <><strong>{m.passRate}%</strong> of conversations passed scoring</> : 'Trending toward target'}.</>;
    whyKind = 'good';
  } else if (goal.status === 'stalled') {
    why = <>Hasn't moved in 7 days. {m ? <><strong>{m.passRate}%</strong> pass rate is below the {m.threshold}% target</> : 'No recent improvement'}. New suggestions waiting in your Alerts.</>;
    whyKind = 'watch';
  } else if (goal.status === 'no_data') {
    why = <>No scorer attached yet — we can't measure this goal. Open the goal to add one in one click.</>;
    whyKind = 'watch';
  } else {
    why = <>{m ? <>Tracking via <strong>{m.name}</strong>. {m.evals30d.toLocaleString()} conversations scored.</> : 'Tracking quietly.'}</>;
  }

  return (
    <article className="gcard" onClick={onOpen} data-screen-label={'Goal: ' + goal.name}>
      <div className="gcard__head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="gcard__name">{goal.name}</h3>
          <div className="gcard__measuring">
            Measuring: <strong style={{ color: 'var(--gray-115)' }}>{goal.fieldLabel}</strong> · {goal.scope === 'all' ? 'all AI conversations' : 'Support agent only'}
          </div>
        </div>
        <GoalStatusBadge status={goal.status} />
      </div>

      <div className="gcard__progress">
        <div className="gcard__big">
          <div className="gcard__big-val">{fmt(goal.current)}</div>
          <div className="gcard__big-target">→ target {fmt(goal.target)}</div>
        </div>
        <div className="gcard__bar"><div className={'gcard__bar-fill gcard__bar-fill--' + fillKind} style={{ width: goal.pct + '%' }}></div></div>
      </div>

      <div className="gcard__why">
        <div className={'gcard__why-icon gcard__why-icon--' + whyKind}>
          {whyKind === 'watch' ? <IAlert size={11} /> : whyKind === 'good' ? <ITrendUp size={11} stroke={2.5} /> : <IInfo size={11} />}
        </div>
        <div>{why}</div>
      </div>

      <div className="gcard__foot">
        <span>{goal.onTrackBy ? <>On track by {goal.onTrackBy}</> : <>Last update: {goal.change7d === '—' ? 'awaiting data' : goal.change7d + ' this week'}</>}</span>
        <span className="gcard__cta">Open goal <IChevronRight size={11} /></span>
      </div>
    </article>);

}

// ───────────────────────── Goal Detail v2 ─────────────────────────
// Inline rationale, scoring built into goal page (no separate "Monitors" nav)
function GoalDetailV2({ id, navigate, openConvo }) {
  const { goals, monitors, suggestions, flaggedConversations } = window.K_DATA;
  const goal = goals.find((g) => g.id === id);
  if (!goal) return null;
  const goalMonitors = monitors.filter((m) => goal.monitorIds.includes(m.id));
  const goalSuggestions = suggestions.filter((s) => s.goalIds.includes(goal.id));
  const goalFlagged = flaggedConversations.filter((c) => goal.monitorIds.includes(c.monitorId));
  const m = goalMonitors[0];
  const [tab, setTab] = useState2('what-drives');
  const [scoringOpen, setScoringOpen] = useState2(false);

  const fmt = (v) => goal.unit === 'currency' ? '$' + v.toFixed(2) : goal.unit === 'percent' ? v + '%' : v.toFixed(v < 10 ? 1 : 0);

  // Build narrative explanation
  let summary;
  if (goal.status === 'improving') {
    summary = <><strong>{goal.name}</strong> is improving. Current {goal.fieldLabel.toLowerCase()} is <strong>{fmt(goal.current)}</strong> — up {goal.change7d} this week. At the current pace, you'll hit your target of {fmt(goal.target)} by <strong>{goal.onTrackBy}</strong>. {m && <>The scorer behind this is passing <strong>{m.passRate}%</strong> of conversations against a {m.threshold}% target.</>}</>;
  } else if (goal.status === 'stalled') {
    summary = <><strong>{goal.name}</strong> has stalled. {goal.fieldLabel} sits at <strong>{fmt(goal.current)}</strong>, no movement in 7 days. {m && <>The scorer is passing only <strong>{m.passRate}%</strong> of conversations vs. the {m.threshold}% target.</>} {goalSuggestions.length > 0 && <>We've found <strong>{goalSuggestions.length} {goalSuggestions.length === 1 ? 'fix' : 'fixes'}</strong> that should help.</>}</>;
  } else if (goal.status === 'no_data') {
    summary = <><strong>{goal.name}</strong> doesn't have a scorer attached, so there's nothing to track yet. Use the recommended setup below to start measuring.</>;
  } else {
    summary = <>Tracking <strong>{goal.fieldLabel}</strong> across {goal.scope === 'all' ? 'all AI conversations' : 'Support agent conversations'}.</>;
  }

  return (
    <div className="page">
      <div className="crumbs">
        <a onClick={() => navigate({ screen: 'goals' })}>Goals</a>
        <span className="crumbs__sep">/</span>
        <span className="crumbs__current">{goal.name}</span>
      </div>
      <div className="page__header" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 className="page__title" style={{ margin: 0 }}>{goal.name}</h1>
            <GoalStatusBadge status={goal.status} />
          </div>
          <p className="page__subtitle">{goal.description}</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary"><ISettings size={14} />Edit</button>
        </div>
      </div>

      {/* The hero is the explanation, not the number */}
      <div className="why-panel">
        <div className="why-panel__head"><IInfo size={13} />Where this goal stands</div>
        <div className="why-panel__body">{summary}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 22 }}>
        <div className="card">
          <div className="card__title">Progress</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.02em', marginTop: 6 }}>
            {fmt(goal.current)} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--gray-90)' }}>/ {fmt(goal.target)}</span>
          </div>
          <div className="goal-card__progress" style={{ marginTop: 10 }}>
            <div className="goal-card__progress-fill" style={{ width: goal.pct + '%' }}></div>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-95)' }}>{goal.pct}% to goal · 7-day change <strong style={{ color: 'var(--gray-115)' }}>{goal.change7d}</strong></div>
        </div>
        <div className="card">
          <div className="card__title">Trend (30 days)</div>
          <div style={{ height: 80, marginTop: 8 }}>
            <Sparkline data={goal.trend} color="var(--blue-70)" height={80} />
          </div>
        </div>
        <div className="card">
          <div className="card__title">Setup</div>
          <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 6, lineHeight: 1.5 }}>
            {m ?
            <>Scored by <strong style={{ color: 'var(--gray-115)' }}>{m.name}</strong>, evaluating {m.evals30d.toLocaleString()} conversations / 30d.</> :
            <>No scorer attached. <a style={{ color: 'var(--blue-80)', cursor: 'pointer' }} onClick={() => setScoringOpen(true)}>Set up scoring</a> to start measuring.</>}
          </div>
          <hr className="hr" />
          <button className="btn btn--ghost btn--sm" onClick={() => setScoringOpen(!scoringOpen)} style={{ padding: 0 }}>
            <IChevronDown size={12} style={{ transform: scoringOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            {scoringOpen ? 'Hide' : 'Show'} scoring details
          </button>
        </div>
      </div>

      {scoringOpen && m &&
      <div className="card" style={{ marginBottom: 22 }}>
          <div className="card__title">How conversations are scored</div>
          <div className="card__subtitle" style={{ marginBottom: 14 }}>The {m.name} grades every {goal.scope === 'all' ? 'AI' : 'Support agent'} conversation against {m.criteria.length} criteria. <strong>Essential</strong> criteria must pass for the conversation to pass overall.</div>
          {m.criteria.map((c) =>
        <div key={c.name} className="criterion-row">
              <div>
                <div className="criterion-row__name">
                  {c.name}
                  {c.essential && <span className="criterion-row__essential">Essential</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>Weight: {c.weight}%</div>
              </div>
              <div className="score-bar"><div className={'score-bar__fill ' + (c.pass >= 70 ? 'score-bar__fill--pass' : 'score-bar__fill--fail')} style={{ width: c.pass + '%' }}></div></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.pass >= 70 ? 'var(--green-90)' : 'var(--red-90)', textAlign: 'right' }}>{c.pass}%</div>
              <span></span>
            </div>
        )}
          <hr className="hr" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--gray-95)' }}>
            <span>Threshold to pass: <strong style={{ color: 'var(--gray-115)' }}>{m.threshold}%</strong></span>
            <button className="btn btn--ghost btn--sm">Edit scorer</button>
          </div>
        </div>
      }

      {/* Tabs */}
      <div className="tabs">
        <button className={'tab' + (tab === 'what-drives' ? ' tab--active' : '')} onClick={() => setTab('what-drives')}>What's driving this</button>
        <button className={'tab' + (tab === 'suggestions' ? ' tab--active' : '')} onClick={() => setTab('suggestions')}>
          Suggestions <span className="tab__count">{goalSuggestions.length}</span>
        </button>
        <button className={'tab' + (tab === 'convos' ? ' tab--active' : '')} onClick={() => setTab('convos')}>
          Failed conversations <span className="tab__count">{goalFlagged.length}</span>
        </button>
      </div>

      {tab === 'what-drives' && goal.breakdown &&
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {['procedure', 'topic'].map((k) =>
        <div key={k} className="card">
              <div className="card__title" style={{ textTransform: 'capitalize' }}>By {k}</div>
              <div className="card__subtitle">Where this goal is winning and where it isn't.</div>
              <div style={{ marginTop: 10 }}>
                {goal.breakdown[k].map((row) => {
              const pct = goal.direction === 'higher_is_better' ?
              Math.min(100, row.value / goal.target * 100) :
              Math.min(100, goal.target / row.value * 100);
              const tone = row.value < goal.target * 0.85 ? 'var(--red-60)' : row.value < goal.target * 0.95 ? 'var(--yellow-70)' : 'var(--green-60)';
              return (
                <div key={row.name} className="bar-row">
                      <div className="bar-row__label">{row.name} <span style={{ color: 'var(--gray-85)', fontWeight: 400 }}>{row.share}%</span></div>
                      <div className="bar-row__bar"><div className="bar-row__bar-fill" style={{ width: pct + '%', background: tone }}></div></div>
                      <div className="bar-row__value">{row.value.toFixed(1)}</div>
                    </div>);

            })}
              </div>
            </div>
        )}
        </div>
      }
      {tab === 'what-drives' && !goal.breakdown && <div className="empty-thin">Breakdown not available for this goal yet.</div>}

      {tab === 'suggestions' && (
      goalSuggestions.length === 0 ?
      <div className="empty"><div className="empty__title">No suggestions right now</div><div className="empty__body">When this goal lags or a pattern of failures emerges, we'll surface concrete fixes here. You won't be flooded with noise.</div></div> :
      <div className="col" style={{ gap: 12 }}>
            {goalSuggestions.map((s) => <SuggestionCardV2 key={s.id} sug={s} navigate={navigate} openConvo={openConvo} />)}
          </div>)
      }

      {tab === 'convos' && (
      goalFlagged.length === 0 ?
      <div className="empty-thin">No failed conversations for this goal in the last 30 days. 🎉</div> :
      <div className="card card--flush">
            {goalFlagged.map((c) =>
        <div key={c.id} className="list-row" style={{ gridTemplateColumns: '1fr 2fr 100px 24px' }} onClick={() => openConvo(c.id)}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>{c.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{c.customerCompany} · {c.timeAgo}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-105)', lineHeight: 1.45 }}>{c.preview}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.score < 50 ? 'var(--red-70)' : 'var(--yellow-70)' }}></span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.score}</span>
                  <span style={{ fontSize: 11, color: 'var(--gray-85)' }}>/ 100</span>
                </div>
                <IChevronRight size={14} style={{ color: 'var(--gray-85)' }} />
              </div>
        )}
          </div>)
      }

      {/* Next action */}
      {goal.status === 'no_data' ?
      <div className="next-action">
          <div className="next-action__icon" style={{ background: 'var(--yellow-25)', color: 'var(--yellow-100)' }}><IBolt size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="next-action__title">Get this goal scoring</div>
            <div className="next-action__body">Attach a scorer and we'll start grading every conversation against your target. Takes about a minute.</div>
          </div>
          <button className="btn btn--primary btn--sm">Set up scoring</button>
        </div> :
      goalSuggestions.length > 0 ?
      <div className="next-action">
          <div className="next-action__icon"><IWand size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="next-action__title">{goalSuggestions.length} suggested fix{goalSuggestions.length > 1 ? 'es' : ''} ready to review</div>
            <div className="next-action__body">Each one is a concrete change with a before/after diff and proof from real conversations.</div>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => setTab('suggestions')}>Review suggestions</button>
        </div> :
      null}
    </div>);

}

// ───────────────────────── Suggestion card v2 with traceability ─────────────────────────
function SuggestionCardV2({ sug, navigate, openConvo }) {
  const { monitors, goals, flaggedConversations } = window.K_DATA;
  const monitor = monitors.find((m) => m.id === sug.monitorId);
  const goal = goals.find((g) => g.id === sug.goalIds[0]);
  const traceConvos = flaggedConversations.filter((c) => c.monitorId === sug.monitorId).slice(0, 3);
  const [state, setState] = useState2('pending');
  const [showDiff, setShowDiff] = useState2(false);
  const toast = useToast();

  if (state === 'applied') {
    return (
      <div className="sug-card" style={{ background: 'var(--green-15)', borderColor: 'var(--green-40)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ICheckCircle size={18} style={{ color: 'var(--green-90)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-100)' }}>Applied — "{sug.target}"</div>
            <div style={{ fontSize: 12, color: 'var(--green-100)', opacity: 0.8 }}>We're watching {goal?.name} for impact and will follow up if the change doesn't help.</div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => setState('pending')}>Undo</button>
        </div>
      </div>);

  }
  if (state === 'dismissed') return null;

  return (
    <div className="sug-card">
      <div className="sug-card__chrome">
        <span className={'badge ' + (sug.priority === 'high' ? 'badge--watch' : sug.priority === 'medium' ? 'badge--watch' : 'badge--neutral')}>
          <span className="badge__dot"></span>{sug.priority} priority
        </span>
        <span className="badge badge--info-soft">{sug.typeLabel}</span>
        {goal && <a onClick={() => navigate({ screen: 'goal', id: goal.id })} style={{ fontSize: 12, color: 'var(--gray-105)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><ITarget size={11} />Helps: {goal.name}</a>}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-90)' }}>{sug.createdAt}</span>
      </div>

      <h3 className="sug-card__title">{sug.target}</h3>
      <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 2 }}>
        <strong style={{ color: 'var(--gray-115)', fontWeight: 500 }}>Suggested change:</strong> {sug.title}
      </div>

      {/* Traceability — failed convos → pattern → fix */}
      <div className="trace">
        <div className="trace__step">
          <div className="trace__label">We saw</div>
          <div className="trace__value"><strong>{traceConvos.length || 23} conversations</strong> failing the same way</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {traceConvos.slice(0, 3).map((c) =>
            <button key={c.id} onClick={(e) => {e.stopPropagation();openConvo(c.id);}} style={{ fontSize: 10, padding: '2px 7px', border: '1px solid var(--gray-30)', borderRadius: 4, background: 'white', color: 'var(--gray-105)', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>{c.id.replace('conv-', '#')}</button>
            )}
          </div>
        </div>
        <div className="trace__step">
          <div className="trace__label">Common pattern</div>
          <div className="trace__value">{sug.target} — {sug.typeLabel.toLowerCase()} not optimal</div>
        </div>
        <div className="trace__step">
          <div className="trace__label">Proposed fix</div>
          <div className="trace__value"><strong>{sug.before && sug.after ? 'Procedure update' : 'Configuration change'}</strong></div>
        </div>
      </div>

      <p className="sug-card__rationale"><strong>Why we're suggesting this:</strong> {sug.rationale}</p>
      {sug.impact && <p className="sug-card__rationale" style={{ color: 'var(--gray-95)', marginTop: -8 }}><strong style={{ color: 'var(--gray-110)' }}>Expected impact:</strong> {sug.impact}</p>}

      {sug.before && sug.after &&
      <>
          <button className="sug-card__expand" onClick={() => setShowDiff(!showDiff)}>
            <IChevronDown size={12} style={{ transform: showDiff ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            {showDiff ? 'Hide' : 'See'} the exact change
          </button>
          {showDiff &&
        <div className="diff">
              <div className="diff__col">
                <div className="diff__label">Before</div>
                <pre className="diff__code diff__code--before">{sug.before}</pre>
              </div>
              <div className="diff__col">
                <div className="diff__label">After</div>
                <pre className="diff__code diff__code--after">{sug.after}</pre>
              </div>
            </div>
        }
        </>
      }

      <div className="inbox-card__actions" style={{ borderTop: '1px solid var(--gray-30)' }}>
        <button className="btn btn--ghost btn--sm" onClick={() => {setState('dismissed');toast?.('Dismissed', 'info');}}><IThumbDown size={12} />Not now</button>
        <button className="btn btn--ghost btn--sm">Open in editor <IExternal size={12} /></button>
        <button className="btn btn--primary btn--sm" style={{ marginLeft: 'auto' }} onClick={() => {setState('applied');toast?.('Applied. Watching for impact.', 'success');}}>
          <ICheck size={12} />Apply this fix
        </button>
      </div>
    </div>);

}

// ───────────────────────── Inbox v2 ─────────────────────────
function InboxV2({ navigate, openConvo, highlight }) {
  const { suggestions, anomalies, monitors } = window.K_DATA;
  const [tab, setTab] = useState2('all');
  const all = [...suggestions.map((s) => ({ ...s, kind: 'suggestion' })), ...anomalies.map((a) => ({ ...a, kind: 'anomaly' }))];
  const visible = tab === 'all' ? all : tab === 'sug' ? suggestions.map((s) => ({ ...s, kind: 'suggestion' })) : anomalies.map((a) => ({ ...a, kind: 'anomaly' }));

  // Compute rollup stats
  const totalEvals = monitors.reduce((s, m) => s + m.evals30d, 0);
  const avgPassRate = Math.round(monitors.reduce((s, m) => s + m.passRate, 0) / monitors.length);
  const actionableCount = suggestions.filter((s) => s.priority === 'high').length;

  // JOB 2: Coverage — how much of the AI estate is being evaluated
  // JOB 3: Health — are monitors passing / is something degrading
  // JOB 6: Action — what concrete fixes are ready to apply
  const rollupCards = [
  {
    label: 'Conversations scored',
    value: (totalEvals / 1000).toFixed(1) + 'k',
    sub: 'Last 30 days across all monitors',
    detail: 'Every AI conversation is automatically evaluated for quality, tone, and procedure adherence.',
    tone: 'neutral',
    icon: <IMonitor size={18} />
  },
  {
    label: 'Monitor pass rate',
    value: avgPassRate + '%',
    sub: avgPassRate >= 75 ? 'Healthy — above 75% target' : 'Below target — review failing criteria',
    detail: avgPassRate >= 75 ?
    'AI conversations are meeting quality thresholds. No urgent degradation detected.' :
    'Pass rate has slipped. Check which criteria are failing most often in the goal detail view.',
    tone: avgPassRate >= 75 ? 'good' : 'watch',
    icon: <ICheckCircle size={18} />
  },
  {
    label: 'High-priority fixes',
    value: actionableCount,
    sub: actionableCount > 0 ? 'Ready to apply — will improve goals' : 'Nothing urgent right now',
    detail: actionableCount > 0 ?
    `${actionableCount} suggested ${actionableCount === 1 ? 'change' : 'changes'} from the AI with before/after diffs and expected impact. Each one is linked to a goal.` :
    'The AI is monitoring for patterns. Suggestions appear here when a concrete fix is identified.',
    tone: actionableCount > 0 ? 'watch' : 'good',
    icon: <IWand size={18} />
  }];


  const toneStyles = {
    neutral: { bg: 'white', border: 'var(--gray-30)', icon: 'var(--gray-25)', iconColor: 'var(--gray-105)', val: 'var(--gray-130)', sub: 'var(--gray-95)' },
    good: { bg: 'white', border: 'var(--gray-30)', icon: 'var(--green-15)', iconColor: 'var(--green-90)', val: 'var(--gray-130)', sub: 'var(--green-90)' },
    watch: { bg: 'white', border: 'var(--gray-30)', icon: 'var(--yellow-25)', iconColor: 'var(--yellow-100)', val: 'var(--gray-130)', sub: 'var(--yellow-100)' }
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs">
            <a onClick={() => navigate({ screen: 'goals' })}>Goals</a>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">Alerts</span>
          </div>
          <h1 className="page__title">Alerts</h1>
          <p className="page__subtitle">Things that need a decision. Each item shows what we saw, why it matters, and what to do.</p>
        </div>
      </div>

      {/* 3-card rollup — Coverage → Health → Action */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {rollupCards.map((card) => {
          const s = toneStyles[card.tone];
          return (
            <div key={card.label} style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 14,
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--gray-95)', fontWeight: 500 }}>{card.label}</span>
                <span style={{ width: 32, height: 32, borderRadius: 8, background: s.icon, color: s.iconColor, display: 'grid', placeItems: 'center' }}>
                  {card.icon}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 36, fontWeight: 600, color: s.val, letterSpacing: '-0.025em', lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: 12, color: s.sub, marginTop: 5, fontWeight: 500 }}>{card.sub}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-90)', lineHeight: 1.55, borderTop: '1px solid var(--gray-25)', paddingTop: 10 }}>
                {card.detail}
              </div>
            </div>);

        })}
      </div>

      {/* Grouped sections + filter tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={'tab' + (tab === 'all' ? ' tab--active' : '')} onClick={() => setTab('all')}>All <span className="tab__count">{all.length}</span></button>
        <button className={'tab' + (tab === 'sug' ? ' tab--active' : '')} onClick={() => setTab('sug')}>Suggestions <span className="tab__count">{suggestions.length}</span></button>
        <button className={'tab' + (tab === 'anom' ? ' tab--active' : '')} onClick={() => setTab('anom')}>Anomalies <span className="tab__count">{anomalies.length}</span></button>
      </div>

      {tab === 'all' ?
      <>
          {suggestions.length > 0 &&
        <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-105)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested improvements</span>
                <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--gray-25)', color: 'var(--gray-95)', padding: '1px 7px', borderRadius: 10 }}>{suggestions.length}</span>
              </div>
              <div className="col" style={{ gap: 12, marginBottom: 28 }}>
                {suggestions.map((s) => <SuggestionCardV2 key={s.id} sug={s} navigate={navigate} openConvo={openConvo} />)}
              </div>
            </>
        }
          {anomalies.length > 0 &&
        <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-105)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Anomalies to investigate</span>
                <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--yellow-25)', color: 'var(--yellow-100)', padding: '1px 7px', borderRadius: 10 }}>{anomalies.length}</span>
              </div>
              <div className="col" style={{ gap: 12 }}>
                {anomalies.map((a) => <AnomalyCard key={a.id} anom={a} navigate={navigate} openConvo={openConvo} />)}
              </div>
            </>
        }
        </> :

      <div className="col" style={{ gap: 12 }}>
          {visible.map((it) =>
        it.kind === 'suggestion' ?
        <SuggestionCardV2 key={it.id} sug={it} navigate={navigate} openConvo={openConvo} /> :
        <AnomalyCard key={it.id} anom={it} navigate={navigate} openConvo={openConvo} />
        )}
        </div>
      }
    </div>);

}

// ───────────────────────── New Goal — single-step picker ─────────────────────────
function NewGoalQuickModal({ open, onClose, onCreated }) {
  const { computedFields } = window.K_DATA;
  const [picked, setPicked] = useState2(null);
  const [target, setTarget] = useState2('');
  const [advancedOpen, setAdvancedOpen] = useState2(false);
  const [scope, setScope] = useState2('all');
  const toast = useToast();

  const templates = [
  { id: 't_csat', name: 'Increase CSAT', desc: 'AI conversations should leave customers satisfied.', icon: <ITrendUp size={20} />, color: 'var(--green-15)', textColor: 'var(--green-100)', defaultTarget: '4.5', unit: 'score', field: 'ai_generated_csat' },
  { id: 't_health', name: 'Improve customer sentiment', desc: 'Lift the rolling Customer Health Score.', icon: <IUsers size={20} />, color: 'var(--blue-15)', textColor: 'var(--blue-100)', defaultTarget: '85', unit: 'score', field: 'customer_health_score' },
  { id: 't_retention', name: 'Reduce churn risk', desc: 'Catch at-risk customers earlier.', icon: <IBolt size={20} />, color: 'var(--purple-15, #ECE7FE)', textColor: 'var(--purple-100, #3A1F8C)', defaultTarget: '20', unit: 'percent', field: 'churn_risk_score' },
  { id: 't_cost', name: 'Lower AI cost', desc: 'Reduce cost-per-conversation.', icon: <ITrendDown size={20} />, color: 'var(--yellow-25)', textColor: 'var(--yellow-100)', defaultTarget: '2.50', unit: 'currency', field: 'cost_per_conversation' },
  { id: 't_proc', name: 'Procedure adherence', desc: 'Ensure AI follows your defined procedures.', icon: <IFlow size={20} />, color: 'var(--gray-25)', textColor: 'var(--gray-115)', defaultTarget: '85', unit: 'percent', field: 'procedure_adherence_score' },
  { id: 't_custom', name: 'Something else', desc: 'Track any Computed Field with custom criteria.', icon: <IPlus size={20} />, color: 'var(--gray-15)', textColor: 'var(--gray-105)', defaultTarget: '', unit: 'score', field: '' }];


  const pick = (t) => {setPicked(t);setTarget(t.defaultTarget);};
  const reset = () => {setPicked(null);setTarget('');setAdvancedOpen(false);};
  const create = () => {toast?.('Goal created. Scorer is warming up — first scores in ~10 min.', 'success');reset();onClose();onCreated?.();};

  return (
    <Modal open={open} onClose={() => {reset();onClose();}} wide>
      <div className="drawer__header">
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>New goal</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-130)' }}>{picked ? picked.name : 'What do you want to improve?'}</div>
        </div>
        <button className="btn btn--ghost btn--icon" onClick={() => {reset();onClose();}}><IClose size={16} /></button>
      </div>
      <div style={{ padding: 24, overflow: 'auto', maxHeight: '60vh' }}>
        {!picked &&
        <>
            <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 16, lineHeight: 1.5 }}>
              Pick a template. We'll create the scorer, attach it to the right Computed Field, and start grading conversations automatically.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {templates.map((t) =>
            <button key={t.id} className="check" onClick={() => pick(t)} style={{ textAlign: 'left', cursor: 'pointer', padding: 14 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: t.color, color: t.textColor, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div className="check__title">{t.name}</div>
                    <div className="check__desc">{t.desc}</div>
                  </div>
                </button>
            )}
            </div>
          </>
        }
        {picked &&
        <>
            <div className="why-panel" style={{ background: 'var(--green-15)', borderColor: 'var(--green-30)', borderLeftColor: 'var(--green-70)', marginBottom: 16 }}>
              <div className="why-panel__head" style={{ color: 'var(--green-100)' }}><IWand size={13} />What we'll set up for you</div>
              <div className="why-panel__body" style={{ color: 'var(--green-100)' }}>
                We'll create a Quality Monitor that scores every {scope === 'all' ? 'AI' : 'Support agent'} conversation against {picked.id === 't_csat' ? 'tone, need-resolution, clarity, and follow-up' : picked.id === 't_proc' ? 'tool usage, procedure steps, and escalation logic' : 'sensible defaults you can refine later'}. The score writes to the <strong>{picked.field || 'right Computed Field'}</strong>, which this goal tracks. You can edit any of this from the goal page.
              </div>
            </div>
            <div className="field">
              <label className="field__label">Target</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {picked.unit === 'currency' && <span style={{ fontSize: 14, color: 'var(--gray-105)' }}>$</span>}
                <input className="input" value={target} onChange={(e) => setTarget(e.target.value)} placeholder={picked.defaultTarget} style={{ flex: 1 }} />
                {picked.unit === 'percent' && <span style={{ fontSize: 14, color: 'var(--gray-105)' }}>%</span>}
                {picked.unit === 'score' && <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>/ 5.0</span>}
              </div>
              <div className="field__hint">{picked.id === 't_csat' ? 'Industry-leading is 4.5+' : picked.id === 't_cost' ? 'Lower is better' : 'You can adjust this anytime'}.</div>
            </div>

            <button className="advanced-toggle" onClick={() => setAdvancedOpen(!advancedOpen)}>
              <IChevronDown size={12} style={{ transform: advancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              Advanced options
            </button>
            {advancedOpen &&
          <div className="advanced-section">
                <div className="field">
                  <label className="field__label">Limit to</label>
                  <select className="select" value={scope} onChange={(e) => setScope(e.target.value)}>
                    <option value="all">All AI Agents</option>
                    <option value="agent_support">Support Agent only</option>
                    <option value="agent_sales">Sales Agent only</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field__label">Custom name</label>
                  <input className="input" placeholder={picked.name} defaultValue={picked.name} />
                </div>
                <div className="field__hint" style={{ marginTop: 4 }}>Once created, you can edit scoring criteria, weights, and alerting in the goal's "Setup" panel.</div>
              </div>
          }
          </>
        }
      </div>
      <div className="drawer__footer" style={{ borderTop: '1px solid var(--gray-30)' }}>
        {picked ?
        <><button className="btn btn--ghost" onClick={reset}><IChevronLeft size={12} />Back</button>
              <button className="btn btn--primary" disabled={!target} onClick={create}><ICheck size={12} />Create goal</button></> :
        <><span style={{ fontSize: 12, color: 'var(--gray-90)' }}>Setup takes ~1 minute. First scores arrive in 10–15 minutes.</span>
              <button className="btn btn--ghost" onClick={() => {reset();onClose();}}>Cancel</button></>}
      </div>
    </Modal>);

}

// ───────────────────────── Settings (advanced) ─────────────────────────
function SettingsV2({ navigate }) {
  const { computedFields, monitors } = window.K_DATA;
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs"><a onClick={() => navigate({ screen: 'goals' })}>Goals</a><span className="crumbs__sep">/</span><span className="crumbs__current">Scoring &amp; fields</span></div>
          <h1 className="page__title">Scoring &amp; fields</h1>
          <p className="page__subtitle">Most teams never need to come here. This is the plumbing — the scorers and Computed Fields your goals are built on. Edit only when you need fine-grained control.</p>
        </div>
      </div>

      <div className="why-panel callout--info" style={{ marginBottom: 16 }}>
        <div className="why-panel__head"><IInfo size={13} />You probably don't need to be here</div>
        <div className="why-panel__body">When you create a goal, we automatically create a scorer and Computed Field for you. Use this page only to fine-tune criteria, change weights, or audit how scoring works.</div>
      </div>

      <div className="section-head">
        <div>
          <h3 className="section-head__title">Scorers ({monitors.length})</h3>
          <div className="section-head__sub">Each scorer grades conversations against criteria, then writes to a Computed Field.</div>
        </div>
      </div>

      <div className="card card--flush" style={{ marginBottom: 24 }}>
        {monitors.map((m) =>
        <div key={m.id} className="list-row" style={{ gridTemplateColumns: '2fr 1fr 100px 80px 24px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>
                {m.name}
                {m.isDefault && <span className="badge badge--neutral" style={{ marginLeft: 8, fontSize: 10 }}>Default</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{m.description}</div>
            </div>
            <div><span className="cf-tag" style={{ fontSize: 10 }}>→ {m.writesField}</span></div>
            <div style={{ height: 28 }}><Sparkline data={m.trend} color={m.passRate >= m.threshold ? 'var(--green-70)' : 'var(--yellow-70)'} height={28} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: m.passRate >= m.threshold ? 'var(--green-90)' : 'var(--yellow-100)' }}>{m.passRate}%</div>
              <div style={{ fontSize: 11, color: 'var(--gray-90)' }}>vs {m.threshold}%</div>
            </div>
            <IChevronRight size={14} style={{ color: 'var(--gray-85)' }} />
          </div>
        )}
      </div>

      <div className="section-head">
        <div>
          <h3 className="section-head__title">Computed Fields ({computedFields.length})</h3>
          <div className="section-head__sub">Auto-managed by Kustomer. {computedFields.length} of 9 used (3 per object).</div>
        </div>
      </div>
      <div className="card card--flush">
        {computedFields.map((cf) =>
        <div key={cf.id} className="list-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 80px 24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="cf-tag">{cf.key}</span>
                {cf.isDefault && <span className="badge badge--neutral" style={{ fontSize: 10 }}>Default</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>{cf.label} · {cf.range}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-105)' }}>{cf.scope}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-105)' }}>{cf.source}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-130)' }}>{cf.current}</div>
            <IChevronRight size={14} style={{ color: 'var(--gray-85)' }} />
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, { ShellV2, GoalsHomeV2, GoalDetailV2, InboxV2, NewGoalQuickModal, SettingsV2, SuggestionCardV2, GoalCardV2 });