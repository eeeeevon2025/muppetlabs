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
          <div className="subnav__title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-130)' }}>AI Monitoring</div>
          <div style={{ fontSize: 11, color: 'var(--gray-90)', marginTop: 3, lineHeight: 1.4 }}>Human-supervised · Review &amp; approve</div>
        </div>
        <div className="subnav__list">
          {[
          { key: 'goals', label: 'Goals' },
          { key: 'monitors', label: 'Monitors', reviewCount: counts.monitorsNeedingReview },
          { key: 'inbox', label: 'Suggestions & Alerts', count: counts.inbox },
          { key: 'anomalies', label: 'Anomalies', count: counts.anomalies || 0 }].
          map((it) =>
          <button key={it.key}
          className={'subnav__link' + (route.screen === it.key || it.key === 'goals' && route.screen === 'goal' ? ' subnav__link--active' : '')}
          onClick={() => navigate({ screen: it.key })}
          style={{ fontSize: 12, fontWeight: route.screen === it.key || it.key === 'goals' && route.screen === 'goal' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{it.label}</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {it.reviewCount > 0 && <span style={{ minWidth: 18, height: 18, borderRadius: '50%', background: '#D97706', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0 }}>{it.reviewCount}</span>}
                {it.count > 0 && <span style={{ minWidth: 18, height: 18, borderRadius: '50%', background: '#1C6EF2', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0 }}>{it.count}</span>}
              </div>
            </button>
          )}
        </div>
      </aside>
    </>);

}

// ───────────────────────── Goals Home v2 ─────────────────────────
function GoalsHomeV2({ navigate, openConvo, openNewGoal, tweaks = {}, externalEditGoal, onExternalEditDone, pendingNewGoal, onPendingConsumed }) {
  const { monitors, suggestions, anomalies, flaggedConversations } = window.K_DATA;
  // Start with only 2 default goals — user can add 1 custom (max 3 total)
  const initialGoals = window.K_DATA.goals.filter((g) => g.isDefault);
  const [goals, setGoals] = useState2(initialGoals);

  // Add new goal at the top whenever the host pushes one in
  React.useEffect(() => {
    if (pendingNewGoal) {
      setGoals(gs => [pendingNewGoal, ...gs.filter(g => g.id !== pendingNewGoal.id)]);
      onPendingConsumed?.();
    }
  }, [pendingNewGoal]);
  const [confirmDelete, setConfirmDelete] = useState2(null);
  const [showNewGoalInline, setShowNewGoalInline] = useState2(false);
  const [editingGoal, setEditingGoal] = useState2(null);
  const [editName, setEditName]         = useState2('');
  const [editDesc, setEditDesc]         = useState2('');
  const [editTarget, setEditTarget]     = useState2('');
  const [editField, setEditField]       = useState2('');
  const [editDirection, setEditDirection] = useState2('higher_is_better');
  const [editShowDirection, setEditShowDirection] = useState2(false);
  const [editSaved, setEditSaved]       = useState2(false);
  const [editDirty, setEditDirty]       = useState2(false);

  // Handle edit triggered from GoalDetailV2
  React.useEffect(() => {
    if (externalEditGoal) { openEdit(externalEditGoal); onExternalEditDone?.(); }
  }, [externalEditGoal]); // true if numbers changed

  function openEdit(goal) {
    setEditingGoal(goal);
    setEditName(goal.name);
    setEditDesc(goal.description || '');
    setEditTarget(goal.target);
    setEditField(goal.fieldRef || '');
    setEditDirection(goal.direction || 'higher_is_better');
    setEditSaved(false);
    setEditDirty(false);
  }
  function closeEdit() { setEditingGoal(null); }
  function saveEdit() {
    setGoals(gs => gs.map(g => g.id === editingGoal.id ? {
      ...g,
      name: editName,
      description: editDesc,
      target: parseFloat(editTarget)||g.target,
      fieldRef: editField,
      fieldLabel: window.K_DATA.computedFields.find(cf => cf.key === editField)?.label || g.fieldLabel,
      direction: editDirection,
      pct: editDirty ? 0 : g.pct, // reset progress if numbers changed
      current: editDirty ? g.target : g.current, // reset current to show fresh start
    } : g));
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); closeEdit(); }, 1000);
  }
  const monitorById = Object.fromEntries(monitors.map((m) => [m.id, m]));
  const inboxCount = suggestions.length + anomalies.length;
  const [showAll, setShowAll] = useState2(false);
  const [showSuggestionsAll, setShowSuggestionsAll] = useState2(false);

  function handleDelete(id) {setConfirmDelete(id);}
  function confirmDeleteGoal() {
    setGoals((gs) => gs.filter((g) => g.id !== confirmDelete));
    setConfirmDelete(null);
    setShowNewGoalInline(true);
  }

  const cols = tweaks.goalColumns || 2;
  const compact = tweaks.density === 'compact';
  const showLoop = tweaks.showLoopStrip !== false;
  const showAlert = tweaks.showAlert !== false;
  const [alertDismissed, setAlertDismissed] = useState2(false);
  const [alertVisible, setAlertVisible] = useState2(false);

  React.useEffect(() => {
    if (showAlert && !alertDismissed) {
      // slight delay so the slide-in is visible on mount
      const t = setTimeout(() => setAlertVisible(true), 60);
      return () => clearTimeout(t);
    }
  }, [showAlert, alertDismissed]);

  function dismissAlert() {
    setAlertVisible(false);
    setTimeout(() => setAlertDismissed(true), 320);
  }

  return (
    <>
    {/* Flush top alert banner — slides in from top */}
    <div className="page">
      <div className="page__header" style={{ marginBottom: 14, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h1 className="page__title">Goals</h1>
          <p className="page__subtitle" style={{ whiteSpace: "normal", maxWidth: "100%" }}>Continuously monitored · human-supervised</p>
        </div>
        <div className="page__actions" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-115)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1F8A5B', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 600 }}>Live</span>
            <span style={{ color: 'var(--gray-85)' }}>· 4 min ago</span>
          </span>
          <button className="btn btn--primary" onClick={openNewGoal}><IPlus size={14}/>Add goal</button>
        </div>
      </div>

      {/* KPI tile row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { label: 'Active goals', value: String(goals.length), accent: false },
          { label: 'Suggestions pending', value: String(window.K_DATA.suggestions.length), accent: false },
          { label: 'Goals on track', value: `${goals.filter(g => g.status === 'improving' || g.status === 'on-track').length} / ${goals.length}`, valueColor: '#1F8A5B', accent: false },
          { label: 'Signals detected', value: String(window.K_DATA.anomalies.length), accent: true },
        ].map((tile, i) => (
          <div key={i} style={{
            background: tile.accent ? '#FEF6E7' : '#fff',
            border: tile.accent ? '1px solid #F4D58A' : '1px solid var(--gray-30)',
            borderRadius: 10,
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: 12, color: tile.accent ? '#9A7A1F' : 'var(--gray-100)', marginBottom: 6, fontWeight: 500 }}>{tile.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: tile.valueColor || 'var(--gray-130)', letterSpacing: '-0.01em' }}>{tile.value}</div>
          </div>
        ))}
      </div>

      {showAlert && !alertDismissed && (
        <div style={{
          position: 'relative',
          marginBottom: 16,
          background: '#FFFBF1',
          border: '1px solid #F4D58A',
          borderLeft: '3px solid #E89B2C',
          borderRadius: 8,
          padding: '14px 36px 14px 18px',
          fontSize: 13,
          lineHeight: '20px',
          color: 'var(--gray-130)',
          transform: alertVisible ? 'translateY(0)' : 'translateY(-6px)',
          opacity: alertVisible ? 1 : 0,
          transition: 'transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.24s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--gray-100)', textTransform: 'uppercase' }}>Recommended next action</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: '#FBE8C2', color: '#8A5A12' }}>Performance signal</span>
          </div>
          <div>
            Procedure adherence scores are declining in escalation workflows — possibly impacting CSAT.<br/>
            Suggested:{' '}
            <a onClick={() => navigate({ screen: 'monitor', id: 'mon_proc' })} style={{
              fontWeight: 600, color: 'var(--blue-80)',
              cursor: 'pointer',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>review the escalation handoff procedure</a>.
          </div>
          <button onClick={dismissAlert} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--gray-85)', padding: 4, opacity: 0.7, lineHeight: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          aria-label="Dismiss">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l6 6M9 3l-6 6" /></svg>
          </button>
        </div>
      )}

      {/* Degradation alert banner — removed from inline, now top banner */}
      {false && <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        border: '1px solid var(--yellow-50)', borderRadius: 10,
        padding: '11px 18px', marginBottom: 16, background: 'white'
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'var(--yellow-100)',
          border: '1.5px solid var(--yellow-70)', borderRadius: 20,
          padding: '3px 10px', whiteSpace: 'nowrap', flexShrink: 0
        }}>1 monitor needs review</span>
        <span style={{ fontSize: 13, color: 'var(--gray-115)', flex: 1 }}>
          Procedure Adherence Monitor est. pass rate declined below 65% — review recommended
        </span>
        <a onClick={() => navigate({ screen: 'settings' })} style={{
          fontSize: 13, fontWeight: 600, color: 'var(--blue-80)',
          cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4
        }}>View monitor <IChevronRight size={13} /></a>
        <span style={{ fontSize: 12, color: 'var(--gray-85)', whiteSpace: 'nowrap' }}>Last evaluated 4 min ago</span>
      </div>}

      {/* v5: How goals & monitors relate — explainer strip */}
      {window.K_V5_INTRO && window.K_V5 && window.K_V5.RelationshipStrip && (
        <window.K_V5.RelationshipStrip navigate={navigate} />
      )}

      {/* Loop strip — makes the operational model visible */}
      <div className="section-head">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="section-head__title">Your goals</h3>
            {goals.length < 3 && <button className="btn btn--primary btn--sm" onClick={openNewGoal}><IPlus size={12} />New goal</button>}
          </div>

        </div>
      </div>

      {/* Goals grid */}
      {(() => {
        const atLimit = goals.length >= 4;
        const defaultGoals = goals.filter((g) => g.isDefault);
        const customGoals = goals.filter((g) => !g.isDefault);
        return (
          <>
            {/* All goals in a flat grid */}
            <div className="goal-grid" style={{ marginBottom: atLimit ? 0 : 14 }}>
              {goals.map((g) => {
                const Card = window.GoalCardOverride || GoalCardV2;
                return (
                  <Card key={g.id} goal={g} monitor={g.monitorIds.map((id) => monitorById[id])} onOpen={() => navigate({ screen: 'goal', id: g.id })} onDelete={handleDelete} onEdit={openEdit} navigate={navigate} showSuggestions={showSuggestionsAll} onToggleSuggestions={() => setShowSuggestionsAll(v => !v)} />
                );
              })}
            </div>

            {/* Empty slot — shown when under the 3-goal limit */}
            {!atLimit &&
            <div className="goal-grid" style={{ marginTop: 0 }}>
                {Array.from({ length: 3 - goals.length }).map((_, i) =>
              <div key={i} style={{ border: '1px dashed var(--gray-35)', borderRadius: 14, padding: '24px 20px', background: 'var(--gray-10)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 120, cursor: 'pointer' }}
              onClick={() => {openNewGoal();setShowNewGoalInline(false);}}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <IPlus size={16} style={{ color: 'var(--blue-80)' }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-110)', marginBottom: 4 }}>Add a goal</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-90)' }}>{Math.max(0, 6 - goals.length)} slot{Math.max(0, 6 - goals.length) !== 1 ? 's' : ''} remaining</div>
                  </div>
              )}
              </div>
            }

            {/* Edit Goal slide-in panel */}
            {editingGoal && (
              <>
                <div onClick={closeEdit} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:200 }}/>
                <div style={{ position:'fixed', top:0, right:0, bottom:0, width:460, background:'#fff', boxShadow:'-4px 0 32px rgba(0,0,0,0.12)', zIndex:201, display:'flex', flexDirection:'column' }}>
                  <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--gray-30)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <h2 style={{ fontSize:18, fontWeight:700, color:'var(--gray-130)', margin:0 }}>Edit goal</h2>
                    <button onClick={closeEdit} style={{ background:'none', border:'1px solid var(--gray-30)', borderRadius:8, padding:'7px 14px', fontSize:13, color:'var(--gray-105)', cursor:'pointer' }}>✕ Close</button>
                  </div>
                  <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>

                    {/* Warning if numbers changed */}
                    {editDirty && (
                      <div style={{ padding:'10px 14px', background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:8, marginBottom:16, fontSize:13, color:'#92400e', lineHeight:1.5 }}>
                        <strong>⚠ Changing the target or field will reset this goal's progress.</strong> Historical data has already been collected. Saving will restart tracking from zero.
                      </div>
                    )}

                    <div className="field">
                      <label className="field__label">Goal name</label>
                      <input className="input" value={editName} onChange={e=>setEditName(e.target.value)}/>
                    </div>
                    <div className="field">
                      <label className="field__label">Description</label>
                      <textarea className="textarea" value={editDesc} onChange={e=>setEditDesc(e.target.value)} placeholder="What outcome are you tracking?" rows={3}/>
                    </div>
                    <div className="field">
                      <label className="field__label">Metric to track</label>
                      <select className="select" value={editField} onChange={e=>{
                        const newKey = e.target.value;
                        setEditField(newKey);
                        const cf = window.K_DATA.computedFields.find(c => c.key === newKey);
                        if (cf?.defaultDirection) setEditDirection(cf.defaultDirection);
                        setEditDirty(true);
                      }}>
                        <option value="">Select a field…</option>
                        {window.K_DATA.computedFields.map(cf => (
                          <option key={cf.id} value={cf.key}>{cf.label} ({cf.scope})</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="field__label">Target</label>
                      <input className="input" type="number" value={editTarget} onChange={e=>{ setEditTarget(e.target.value); setEditDirty(true); }}/>
                      <div style={{ marginTop:6, fontSize:12, color:'var(--gray-90)', display:'flex', alignItems:'center', gap:8 }}>
                        <span>{editDirection === 'lower_is_better' ? '↓ Lower is better' : '↑ Higher is better'}</span>
                        <span style={{ color:'var(--gray-60)' }}>·</span>
                        <a onClick={()=>setEditShowDirection(s=>!s)} style={{ color:'var(--blue-80)', cursor:'pointer', fontWeight:500 }}>{editShowDirection ? 'Hide' : 'Change'}</a>
                      </div>
                      {editShowDirection && (
                        <select className="select" style={{ marginTop:8 }} value={editDirection} onChange={e=>{ setEditDirection(e.target.value); setEditDirty(true); }}>
                          <option value="higher_is_better">Higher is better</option>
                          <option value="lower_is_better">Lower is better</option>
                        </select>
                      )}
                    </div>
                  </div>
                  <div style={{ padding:'16px 20px', borderTop:'1px solid var(--gray-30)', display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button onClick={closeEdit} style={{ height:36, padding:'0 18px', borderRadius:8, border:'1px solid var(--gray-30)', background:'#fff', fontSize:14, fontWeight:600, color:'var(--gray-105)', cursor:'pointer' }}>Cancel</button>
                    <button onClick={saveEdit} style={{ height:36, padding:'0 20px', borderRadius:8, border:'none', background:editSaved?'#16a34a':'#1C6EF2', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', transition:'background 0.2s' }}>{editSaved?'✓ Saved':'Save changes'}</button>
                  </div>
                </div>
              </>
            )}

            {/* Delete confirm modal */}
            {confirmDelete &&
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 380, width: '90%', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-130)', marginBottom: 8 }}>Remove this goal?</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 20, lineHeight: 1.5 }}>Removing a goal stops tracking for this outcome. Monitors and computed fields are not affected. You can add a new goal at any time.</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn--secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                    <button onClick={confirmDeleteGoal} style={{ background: 'var(--red-80, #dc2626)', color: '#fff', border: 'none', height: 36, padding: '0 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Remove goal</button>
                  </div>
                </div>
              </div>
            }
          </>);

      })()}

    </div>
    </>);

}

// Helper: opens ProcedurePanelShared from a K_DATA suggestion object
function ProcedurePanelFromGoal({ s, onClose }) {
  const PP = window.ProcedurePanelShared;
  if (!PP) return null;
  const suggestion = {
    title: s.title,
    changeSummary: s.title,
    isProcedure: s.type === 'procedure',
    before: s.before || null,
    after: s.after || null,
    monitorName: null,
    ctaScope: s.type === 'procedure'
      ? 'Applies to new conversations only. You can revert from Procedures at any time.'
      : 'Saves a draft. No conversations are affected until you publish or apply it.',
    onApply: () => {},
  };
  return <PP suggestion={suggestion} onClose={onClose} />;
}

function GoalCardV2({ goal, monitor, onOpen, onDelete, onEdit, navigate, showSuggestions, onToggleSuggestions }) {
  const m = monitor[0];
  const [menuOpen, setMenuOpen] = useState2(false);
  const [suggPanel, setSuggPanel] = useState2(null);
  const fmt = (v) => goal.unit === 'currency' ? '$' + v.toFixed(2) : goal.unit === 'percent' ? v + '%' : v.toFixed(v < 10 ? 1 : 0);

  // Get suggestions linked to this goal
  const goalSuggestions = window.K_DATA.suggestions.filter(s => s.goalIds && s.goalIds.includes(goal.id));
  const fillKind = goal.status === 'declining' ? 'watch' : goal.status === 'improving' ? 'good' : goal.status === 'stalled' ? 'watch' : 'neutral';

  const isDeclining = goal.status === 'declining';
  let why, whyKind = 'good';
  let nextStep = null;

  // Per-goal operational context — workflow-aware, not just metric-aware
  const operationalContext = {
    goal_csat: {
      improving: { why: <>Improving after recent escalation workflow updates. Coupon application conversations are the main drag at 3.4 / 5.</>, next: { label: 'Review coupon workflows', screen: 'inbox' } },
      stalled:   { why: <>No movement in billing conversations this week. Tone and follow-up scores are below threshold.</>, next: { label: 'Investigate billing conversations', screen: 'inbox' } },
      declining: { why: <>Declining in shipping escalations. Acknowledgement before handoff may be missing.</>, next: { label: 'Review shipping conversations', screen: 'inbox' } },
      default:   { why: <>{m ? <>{m.evals30d.toLocaleString()} conversations scored via <strong>{m.name}</strong>.</> : 'No scorer attached.'}</>, next: null },
    },
    goal_sentiment: {
      improving: { why: <>Trending upward in billing and account conversations. Copilot suggestion acceptance is up this week.</>, next: { label: 'Review suggestion queue', screen: 'inbox' } },
      stalled:   { why: <>Health score flat across at-risk accounts. Churn-risk routing may need adjustment.</>, next: { label: 'Investigate at-risk accounts', screen: 'inbox' } },
      declining: { why: <>Declining in enterprise accounts. Escalation workflows may not be routing to senior reps.</>, next: { label: 'Review escalation routing', screen: 'inbox' } },
      default:   { why: <>{m ? <>{m.evals30d.toLocaleString()} conversations scored via <strong>{m.name}</strong>.</> : 'No scorer attached.'}</>, next: null },
    },
    goal_retention: {
      improving: { why: <>At-risk customer routing improved after procedure update last week.</>, next: { label: 'Review retention workflows', screen: 'inbox' } },
      stalled:   { why: <>Churn risk unchanged. No scorer is attached to this goal yet.</>, next: { label: 'Set up scoring', screen: 'goal' } },
      declining: { why: <>Churn risk rising. Coupon workflows may be bypassing upsell recommendations.</>, next: { label: 'Investigate churn signals', screen: 'anomalies' } },
      default:   { why: <>No monitor attached — churn signals are not being scored.</>, next: { label: 'Set up scoring', screen: 'goal' } },
    },
  };

  const ctx = operationalContext[goal.id];
  if (ctx) {
    const state = ctx[goal.status] || ctx.default;
    why = state.why;
    whyKind = goal.status === 'declining' || goal.status === 'stalled' ? 'watch' : 'good';
    nextStep = state.next;
  } else {
    if (isDeclining) {
      why = <>Declining this week. {m ? <><strong>{m.passRate}%</strong> pass rate — check suggestions in Alerts.</> : 'Trending away from target.'}</>;
      whyKind = 'watch';
    } else if (goal.status === 'improving') {
      why = <>Improving this week. {m ? <><strong>{m.passRate}%</strong> of conversations passed scoring.</> : 'Trending toward target.'}</>;
      whyKind = 'good';
    } else if (goal.status === 'stalled') {
      why = <>No movement in 7 days. {m ? <><strong>{m.passRate}%</strong> pass rate is below the {m.threshold}% target.</> : 'No recent improvement.'}</>;
      whyKind = 'watch';
    } else {
      why = <>{m ? <>Tracking via <strong>{m.name}</strong>. {m.evals30d.toLocaleString()} conversations scored.</> : 'Tracking quietly.'}</>;
    }
  }

  // Compute on-track footer text
  const footerText = goal.onTrackBy
    ? <>On track · {goal.onTrackBy}</>
    : goal.change7d === '—'
      ? <>Awaiting data</>
      : <>{parseFloat(goal.change7d) < 0 ? 'Down' : 'Up'} {goal.change7d} this week</>;

  // Compute progress percentage (handles lower-is-better)
  const isLower = goal.direction === 'lower_is_better';
  const barPct = isLower
    ? Math.min(100, Math.max(0, Math.round((goal.target / goal.current) * 100)))
    : goal.pct;

  return (
    <article className="gcard gcard--v3" onClick={onOpen} data-screen-label={'Goal: ' + goal.name}
      style={{
        background: '#fff',
        border: '0.5px solid var(--gray-40)',
        borderRadius: 12,
        padding: '16px 18px 14px',
        boxShadow: 'none',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}>
      {/* Header row — Title + ⋯ */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1, lineHeight: 1.3 }}>{goal.name}</h3>
        <div style={{ position: 'relative', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMenuOpen((v) => !v)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-85)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
            </button>
            {menuOpen &&
            <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#fff', border: '1px solid var(--gray-30)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 140, overflow: 'hidden' }}>
                  <button onClick={() => {setMenuOpen(false); onOpen();}} style={{ width: '100%', padding: '9px 14px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: 'var(--gray-115)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-15)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View goal
                  </button>
                  <button onClick={() => {setMenuOpen(false); onEdit && onEdit(goal);}} style={{ width: '100%', padding: '9px 14px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: 'var(--gray-115)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-15)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Edit goal
                  </button>
                  <div style={{ height: 1, background: 'var(--gray-25)', margin: '0 8px' }} />
                  <button onClick={() => {setMenuOpen(false);onDelete && onDelete(goal.id);}} style={{ width: '100%', padding: '9px 14px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: 'var(--red-80, #dc2626)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--red-10, #fef2f2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                    Delete goal
                  </button>
                </div>
              </>
            }
          </div>
        </div>

      {/* Meta row — Default badge · Trending up · Human + AI (right) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <span style={{
          fontSize: 12, fontWeight: 500,
          padding: '2px 8px',
          border: '1px solid var(--gray-40)',
          borderRadius: 6,
          color: 'var(--gray-100)',
          background: 'transparent',
          lineHeight: 1.4,
        }}>{goal.isDefault ? 'Default' : 'Custom'}</span>
        <GoalStatusBadge status={goal.status} />
        {window.K_V4 && m && <window.K_V4.CalibrationBadge monitor={m}/>}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-85)' }}>Human + AI</span>
      </div>

      {/* Metric row — large value + → target */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(goal.current)}</span>
        <span style={{ fontSize: 13, color: 'var(--gray-85)' }}>→ target {fmt(goal.target)}</span>
      </div>

      {/* Progress bar with label */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--gray-85)', marginBottom: 6 }}>
          <span>Progress to target</span>
          <span>{barPct}%</span>
        </div>
        <div style={{ height: 3, background: 'var(--gray-25)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: barPct + '%',
            height: '100%',
            background: fillKind === 'good' ? 'var(--green-70)' : fillKind === 'watch' ? 'var(--yellow-70)' : 'var(--gray-70)',
          }} />
        </div>
      </div>

      {/* Insight row — top border, icon + text inline */}
      <div style={{ borderTop: '0.5px solid var(--gray-30)', marginTop: 16, paddingTop: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ flexShrink: 0, color: whyKind === 'watch' ? 'var(--yellow-80)' : 'var(--green-70)', display: 'flex', marginTop: 2 }}>
          {whyKind === 'watch' ? <IAlert size={14} /> : <ITrendUp size={14} stroke={2.5} />}
        </span>
        <div style={{ fontSize: 12, color: 'var(--gray-100)', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', alignSelf: 'flex-start' }}>{why}</div>
      </div>

      {/* Footer — Suggested improvements toggle */}
      <div onClick={(e) => { e.stopPropagation(); onToggleSuggestions(); }}
        style={{ borderTop: '1px solid var(--gray-30)', marginTop: 12, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-115)' }}>Suggested improvements</span>
          {!showSuggestions && (
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-95)' }}>
              {goalSuggestions.length > 0
                ? <>— {goalSuggestions.length} ready to review</>
                : <>— none right now</>}
            </span>
          )}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-90)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showSuggestions ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.18s' }}><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {/* Suggestions accordion content (expanded) */}
      {showSuggestions && (
        <div style={{ paddingTop: 8 }} onClick={(e) => e.stopPropagation()}>
          {goalSuggestions.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--gray-85)', padding: '6px 0 4px', lineHeight: 1.5 }}>
              No improvement opportunities right now. We'll surface these when this goal lags or a workflow pattern emerges.
            </div>
          ) : (
            <>
              {goalSuggestions.slice(0, 2).map(s => (
                <div key={s.id} onClick={e => { e.stopPropagation(); setSuggPanel(s); }} style={{ padding: '8px 10px', background: 'var(--gray-15)', border: '1px solid var(--gray-30)', borderRadius: 6, marginBottom: 6, cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--blue-10)'}
                  onMouseLeave={e => e.currentTarget.style.background='var(--gray-15)'}>
                  <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-130)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-90)' }}>{s.typeLabel} · {s.priority} priority</div>
                </div>
              ))}
              <a onClick={(e) => { e.stopPropagation(); navigate({ screen: 'inbox' }); }} style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-80)', cursor: 'pointer' }}>
                View all {goalSuggestions.length} suggestions →
              </a>
            </>
          )}
        </div>
      )}

      {suggPanel && window.ProcedurePanelShared && (
        <ProcedurePanelFromGoal s={suggPanel} onClose={() => setSuggPanel(null)} />
      )}
    </article>);

}

// ───────────────────────── Goal Detail v2 ─────────────────────────
// Inline rationale, scoring built into goal page (no separate "Monitors" nav)
function GoalDetailV2({ id, navigate, openConvo, openEdit }) {
  const { goals, monitors, suggestions, flaggedConversations } = window.K_DATA;
  const goal = goals.find((g) => g.id === id);
  if (!goal) return null;
  const goalMonitors = monitors.filter((m) => goal.monitorIds.includes(m.id));
  const goalSuggestions = suggestions.filter((s) => s.goalIds.includes(goal.id));
  const goalFlagged = flaggedConversations.filter((c) => goal.monitorIds.includes(c.monitorId));
  const m = goalMonitors[0];
  const [tab, setTab] = useState2('what-drives');
  const [scoringOpen, setScoringOpen] = useState2(false);
  const [calOpen, setCalOpen] = useState2(false);

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
          <button className="btn btn--secondary" onClick={() => openEdit && openEdit(goal)}><ISettings size={14} />Edit</button>
        </div>
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
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <a onClick={() => navigate({ screen: 'monitors', editMonitorId: m.id })} style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue-80)', cursor: 'pointer' }}>
                Edit on Monitors page →
              </a>
              <button className="btn btn--ghost btn--sm" onClick={() => setCalOpen(true)}>View calibration</button>
            </div>
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
      <>
      <div className="why-panel" style={{ marginBottom: 16 }}>
        <div className="why-panel__head"><IInfo size={13} />Summary</div>
        <div className="why-panel__body">{summary}</div>
      </div>
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
      </>
      }
      {tab === 'what-drives' && !goal.breakdown && (
        <>
          <div className="why-panel" style={{ marginBottom: 16 }}>
            <div className="why-panel__head"><IInfo size={13} />Summary</div>
            <div className="why-panel__body">{summary}</div>
          </div>
          <div className="empty-thin">Breakdown not available for this goal yet.</div>
        </>
      )}

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

      {calOpen && m && window.K_V4 && ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()}>
          <window.K_V4.CalibrationSheet monitor={m} onClose={() => setCalOpen(false)} />
        </div>,
        document.body
      )}
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
  const [expanded, setExpanded] = useState2(false);
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
      <div className="sug-card__chrome" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <span className={'badge ' + (sug.priority === 'high' ? 'badge--watch' : sug.priority === 'medium' ? 'badge--watch' : 'badge--neutral')}>
          <span className="badge__dot"></span>{sug.priority} priority
        </span>
        <span className="badge badge--info-soft">{sug.typeLabel}</span>
        {goal && <a onClick={(e) => { e.stopPropagation(); navigate({ screen: 'goal', id: goal.id }); }} style={{ fontSize: 12, color: 'var(--gray-105)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><ITarget size={11} />Helps: {goal.name}</a>}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-90)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {sug.createdAt}
          <IChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: 'var(--gray-95)' }} />
        </span>
      </div>

      <h3 className="sug-card__title" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>{sug.target}</h3>
      <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 2 }}>
        <strong style={{ color: 'var(--gray-115)', fontWeight: 500 }}>Suggested change:</strong> {sug.title}
      </div>

      {expanded && <>
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
      </>}
    </div>);

}


// ───────────────────────── New Goal — single-step picker ─────────────────────────
function NewGoalQuickModal({ open, onClose, onCreated }) {
  const { computedFields } = window.K_DATA;
  const [picked, setPicked] = useState2(null);
  const [name, setName] = useState2('');
  const [desc, setDesc] = useState2('');
  const [field, setField] = useState2('');
  const [target, setTarget] = useState2('');
  const [direction, setDirection] = useState2('higher_is_better');
  const [showDirection, setShowDirection] = useState2(false);
  const [visible, setVisible] = useState2(false);
  const toast = useToast();

  React.useEffect(() => {
    if (open) { setTimeout(() => setVisible(true), 20); }
    else { setVisible(false); }
  }, [open]);

  const templates = [
    { id: 't_csat',      name: 'Increase CSAT',             sub: '↑ AI-Generated CSAT · target 4.5 / 5',   field: 'ai_generated_csat',          target: '4.5',  direction: 'higher_is_better', desc: 'Track AI-generated CSAT and improve it over time.' },
    { id: 't_health',    name: 'Improve Customer Sentiment', sub: '↑ Customer Health Score · target 85 / 100', field: 'customer_health_score',       target: '85',   direction: 'higher_is_better', desc: 'Lift the rolling Customer Health Score.' },
    { id: 't_retention', name: 'Improve Net Retention',      sub: '↓ Churn Risk Score · target < 20%',      field: 'churn_risk_score',            target: '20',   direction: 'lower_is_better',  desc: 'Reduce churn risk for at-risk customers.' },
    { id: 't_aov',       name: 'Increase AOV',               sub: '↑ Average Order Value · target $120',    field: 'cost_per_conversation',       target: '120',  direction: 'higher_is_better', desc: 'Grow average order value by identifying upsell opportunities during AI-assisted conversations.' },
    { id: 't_handle',    name: 'Reduce Handle Time',         sub: '↓ Avg Handle Time · target 3 min',       field: 'procedure_adherence_score',   target: '3',    direction: 'lower_is_better',  desc: 'Shorten average handle time through better AI routing.' },
    { id: 't_accuracy',  name: 'Improve Agent Accuracy',     sub: '↑ Suggestion Acceptance Rate · target 75%', field: 'procedure_adherence_score', target: '75',   direction: 'higher_is_better', desc: 'Increase agent acceptance of AI-generated suggestions.' },
  ];

  const pick = (t) => {
    setPicked(t);
    setName(t.name || '');
    setDesc(t.desc || '');
    setField(t.field || '');
    setTarget(t.target || t.defaultTarget || '');
    setDirection(t.direction || 'higher_is_better');
  };

  const reset = () => { setPicked(null); setName(''); setDesc(''); setField(''); setTarget(''); setDirection('higher_is_better'); setShowDirection(false); };

  const handleClose = () => { reset(); onClose(); };

  const create = () => {
    const cf = computedFields.find(c => c.key === field);
    const newGoal = {
      id: 'goal_' + Date.now(),
      name: name || 'Untitled goal',
      description: desc || '',
      fieldRef: field,
      fieldLabel: cf?.label || field,
      target: parseFloat(target) || 0,
      current: 0,
      unit: cf?.unit || 'score',
      direction: direction,
      status: 'no_data',
      pct: 0,
      monitorId: null,
      hasNoLinkedMonitor: true,
      isDefault: false,
      calibration: { state: 'pending', pct: 0 },
      trend: [0, 0, 0, 0, 0, 0, 0],
      isNew: true,
    };
    toast?.('Goal created. Scorer is warming up — first scores in ~10 min.', 'success');
    reset();
    onClose();
    onCreated?.(newGoal);
  };

  if (!open && !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
        zIndex: 200,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.28s ease',
      }} />
      {/* Slide-in panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520,
        background: '#fff', zIndex: 201,
        boxShadow: '-4px 0 40px rgba(0,0,0,0.14)',
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--gray-30)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-130)', marginBottom: 4 }}>New goal</div>
            <div style={{ fontSize: 13, color: 'var(--gray-90)' }}>Start from an example, or fill in your own below.</div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-85)', padding: 4, borderRadius: 6, marginTop: 2 }}>
            <IClose size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* AI Suggestions */}
          <div style={{ background: 'var(--blue-10)', border: '1px solid var(--blue-30)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue-80)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.94 14.34a1.5 1.5 0 0 0-1.09 1.09L8 18l-.85-2.57a1.5 1.5 0 0 0-1.09-1.09L3.5 13.5l2.57-.85a1.5 1.5 0 0 0 1.09-1.09L8 9l.85 2.57a1.5 1.5 0 0 0 1.09 1.09l2.57.85z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-80)' }}>Suggested for you</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'Reduce Escalation Rate', reason: 'Procedure Adherence Monitor flagged 18% of conversations escalating unnecessarily this month.', field: 'procedure_adherence_score', target: '90', direction: 'higher_is_better', desc: 'Reduce unnecessary escalations by improving AI adherence to resolution procedures.' },
                { name: 'Improve First Response Quality', reason: 'CSAT scores for first-contact resolutions are 12% below your fleet average.', field: 'ai_generated_csat', target: '4.2', direction: 'higher_is_better', desc: 'Improve the quality of first responses to increase first-contact resolution rate.' },
              ].map((sg, idx) => (
                <div key={idx} onClick={() => { pick({ ...sg, id: 't_ai_' + idx, sub: '↑ ' + sg.name + ' · target ' + sg.target, defaultTarget: sg.target }); }}
                  style={{ background: '#fff', border: `1.5px solid ${picked?.id === 't_ai_' + idx ? 'var(--blue-70)' : 'var(--blue-20)'}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer', transition: 'border-color 0.12s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: picked?.id === 't_ai_' + idx ? 'var(--blue-80)' : 'var(--gray-130)' }}>{sg.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--blue-70)', fontWeight: 500, background: 'var(--blue-15)', padding: '1px 7px', borderRadius: 10 }}>AI pick</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-90)', lineHeight: 1.4 }}>{sg.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Template picker */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-90)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Or start from a template</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {templates.map(t => (
              <button key={t.id} onClick={() => pick(t)} style={{
                textAlign: 'left', padding: '12px 14px',
                border: `1.5px solid ${picked?.id === t.id ? 'var(--blue-70)' : 'var(--gray-30)'}`,
                borderRadius: 10, background: picked?.id === t.id ? 'var(--blue-10)' : '#fff',
                cursor: 'pointer', transition: 'border-color 0.12s, background 0.12s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: picked?.id === t.id ? 'var(--blue-80)' : 'var(--gray-130)', marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-85)' }}>{t.sub}</div>
              </button>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--gray-30)', marginBottom: 20 }} />

          {/* Form */}
          <div className="field">
            <label className="field__label">Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Increase CSAT for VIP customers" />
          </div>
          <div className="field">
            <label className="field__label">Description</label>
            <textarea className="textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What outcome are you tracking?" rows={3} />
          </div>
          <div className="field">
            <label className="field__label">Metric to track</label>
            <select className="select" value={field} onChange={e => {
              const newKey = e.target.value;
              setField(newKey);
              const cf = computedFields.find(c => c.key === newKey);
              if (cf?.defaultDirection) setDirection(cf.defaultDirection);
            }}>
              <option value="">Select a field…</option>
              {computedFields.map(cf => (
                <option key={cf.id} value={cf.key}>{cf.label} ({cf.scope})</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label">Target</label>
            <input className="input" type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 4.5" />
            <div style={{ marginTop:6, fontSize:12, color:'var(--gray-90)', display:'flex', alignItems:'center', gap:8 }}>
              <span>{direction === 'lower_is_better' ? '↓ Lower is better' : '↑ Higher is better'}</span>
              <span style={{ color:'var(--gray-60)' }}>·</span>
              <a onClick={()=>setShowDirection(s=>!s)} style={{ color:'var(--blue-80)', cursor:'pointer', fontWeight:500 }}>{showDirection ? 'Hide' : 'Change'}</a>
            </div>
            {showDirection && (
              <select className="select" style={{ marginTop:8 }} value={direction} onChange={e => setDirection(e.target.value)}>
                <option value="higher_is_better">Higher is better</option>
                <option value="lower_is_better">Lower is better</option>
              </select>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--gray-30)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={handleClose} style={{ height: 36, padding: '0 18px', borderRadius: 8, border: '1px solid var(--gray-30)', background: '#fff', fontSize: 14, fontWeight: 600, color: 'var(--gray-105)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={create} disabled={!name || !target} style={{ height: 36, padding: '0 20px', borderRadius: 8, border: 'none', background: !name || !target ? 'var(--gray-40)' : '#1C6EF2', color: '#fff', fontSize: 14, fontWeight: 600, cursor: !name || !target ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}>Add goal</button>
        </div>
      </div>
    </>
  );

}

// ───────────────────────── Settings (advanced) ─────────────────────────
function SettingsV2({ navigate }) {
  const { computedFields, monitors } = window.K_DATA;
  return (
    <div className="page">
      <div className="page__header" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="crumbs"><a onClick={() => navigate({ screen: 'goals' })}>Goals</a><span className="crumbs__sep">/</span><span className="crumbs__current">Scoring &amp; fields</span></div>
          <h1 className="page__title">Scoring &amp; fields</h1>
          <p className="page__subtitle">Most teams never need to come here. This is the plumbing — the scorers and Computed Fields your goals are built on. Edit only when you need fine-grained control.</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--primary" onClick={() => navigate({ screen: 'newmonitor' })}><IPlus size={14}/>Create monitor</button>
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

function AnomaliesV2({ navigate }) {
  const { anomalies } = window.K_DATA;
  const [selected,      setSelected]      = useState2(null);
  const [filter,        setFilter]        = useState2('all');
  const [sort,          setSort]          = useState2('recency');
  const [statuses,      setStatuses]      = useState2({});
  const [dismissPanel,  setDismissPanel]  = useState2(null);
  const [dismissReason, setDismissReason] = useState2('');
  const [toast,         setToast]         = useState2(null);
  const [insightsDismissed, setInsightsDismissed] = useState2(false);
  const [procedurePanel, setProcedurePanel] = useState2(null);
  const [splitOpen, setSplitOpen] = useState2(null);
  const [splitChoice, setSplitChoice] = useState2({});
  React.useEffect(() => {
    if (!splitOpen) return;
    const onDoc = () => setSplitOpen(null);
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [splitOpen]);
  const [alertVisible, setAlertVisible] = useState2(false);
  const [alertDismissed, setAlertDismissed] = useState2(false);
  React.useEffect(() => {
    const t = setTimeout(() => setAlertVisible(true), 80);
    return () => clearTimeout(t);
  }, []);
  function dismissAnomalyAlert() {
    setAlertVisible(false);
    setTimeout(() => setAlertDismissed(true), 320);
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2400); }
  const getStatus = id => statuses[id] || 'pending';
  const setStatus = (id, s) => setStatuses(p => ({ ...p, [id]: s }));

  // ── Canonical anomaly data (M1 spec: type, description, trigger, affected resource, conv link, confidence, suggestion preview) ──
  const rich = [
    {
      id: 'anom_1', type: 'procedure_deviation',
      description: 'Coupon applied without completing order verification — unauthorized discount may have been issued.',
      affectedResource: 'Coupon Application Procedure · Step 2',
      monitor: 'Procedure Adherence Monitor',
      convRef: '#49812', convName: 'Maya Chen',
      convId: 'Coupon dispute with open return — customer requesting WELCOME20 override',
      detectedAt: '2 min ago', confidence: 41,
      suggestion: {
        target: 'Coupon Application Procedure',
        rationale: 'Add an order verification gate at Step 2 before apply_coupon() is called. This prevents coupons being issued when an open return is present.',
      },
    },
    {
      id: 'anom_2', type: 'kb_mismatch',
      description: 'Shipping window cited as 5–7 days — current international policy specifies 7–10 business days. Customer may have incorrect delivery expectations.',
      affectedResource: 'KB: International Shipping Policy (updated Mar 2026)',
      monitor: 'AIC AI-CSAT Monitor',
      convRef: '#49791', convName: 'James T.',
      convId: 'International order inquiry — shipping estimate to Germany',
      detectedAt: '34 min ago', confidence: 58,
      suggestion: {
        target: 'KB: International Shipping Policy',
        rationale: 'Mark pre-March policy as deprecated and ensure the March 2026 version is the active indexed document. Re-test with affected region queries.',
      },
    },
    {
      id: 'anom_3', type: 'tool_irregularity',
      description: 'Order lookup may have used a stale customer ID from a prior session after reset — another customer\'s data may have been returned.',
      affectedResource: 'order_lookup tool · session_id parameter',
      monitor: 'Procedure Adherence Monitor',
      convRef: '#49744', convName: 'Sam Lee',
      convId: 'Order status inquiry following account session timeout',
      detectedAt: '2 hours ago', confidence: 72,
      suggestion: {
        target: 'Session Management Procedure',
        rationale: 'Require re-authentication and a fresh customer_id before any tool call following a session reset. Add a guard step at the start of the procedure.',
      },
    },
  ];

  // Type config — left border color per type, label, badge style
  const typeConfig = {
    procedure_deviation: { label: 'Procedure deviation',   leftBorder: '#dc2626', badgeColor: '#7f1d1d', badgeBg: '#fef2f2', badgeBorder: '#fecaca' },
    kb_mismatch:         { label: 'KB mismatch',           leftBorder: '#d97706', badgeColor: '#78350f', badgeBg: '#fffbeb', badgeBorder: '#fcd34d' },
    boundary_deviation:  { label: 'Boundary deviation',    leftBorder: '#0d9488', badgeColor: '#134e4a', badgeBg: '#f0fdfa', badgeBorder: '#99f6e4' },
    tool_irregularity:   { label: 'Tool use irregularity', leftBorder: '#2563eb', badgeColor: '#1e3a8a', badgeBg: '#eff6ff', badgeBorder: '#bfdbfe' },
  };

  const statusConfig = {
    pending:   { label: 'Pending',   color: 'var(--gray-95)',  border: 'var(--gray-40)' },
    in_review: { label: 'In review', color: '#d97706',         border: '#fcd34d' },
    resolved:  { label: 'Resolved',  color: '#16a34a',         border: '#86efac' },
    dismissed: { label: 'Dismissed', color: 'var(--gray-80)',  border: 'var(--gray-30)' },
  };

  const confidenceLabel = (c) => c < 50
    ? 'Low — human verification required before acting'
    : c < 70
    ? 'Moderate — act with documentation'
    : 'High confidence — safe to act';
  const confidenceColor = (c) => c < 50 ? '#dc2626' : c < 70 ? '#d97706' : '#16a34a';

  const pendingCount  = rich.filter(a => getStatus(a.id) === 'pending').length;
  const inReviewCount = rich.filter(a => getStatus(a.id) === 'in_review').length;
  const resolvedCount = rich.filter(a => getStatus(a.id) === 'resolved').length;

  const filterTypes  = ['all', 'procedure_deviation', 'kb_mismatch', 'tool_irregularity', 'pending_review'];
  const filterLabels = { all: 'All', procedure_deviation: 'Procedure deviation', kb_mismatch: 'KB mismatch', tool_irregularity: 'Tool use', pending_review: 'Pending review' };

  const sorted = [...rich].sort((a, b) => {
    if (sort === 'confidence') return b.confidence - a.confidence;
    if (sort === 'type') return a.type.localeCompare(b.type);
    return 0; // recency = original order
  });


  const visible = sorted.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'pending_review') return getStatus(a.id) === 'pending';
    return a.type === filter;
  });

  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  return (
    <>
    {/* Flush top alert banner — slides in from top, matches Goals page */}
    {!alertDismissed && (
      <div style={{
        position: 'sticky', top: 12, zIndex: 100,
        margin: '12px 24px 0',
        transform: alertVisible ? 'translateY(0)' : 'translateY(-12px)',
        opacity: alertVisible ? 1 : 0,
        transition: 'transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.24s ease',
        background: '#FEFAD2',
        color: '#826F1C',
        borderRadius: 6,
        padding: '14px 18px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 13,
        lineHeight: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, paddingRight: 24 }}>
          <span style={{ width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A88715', flexShrink: 0 }}>
            <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" width="15" height="15">
              <path d="M7.5 1.5L14 13H1z" strokeLinejoin="round" />
              <path d="M7.5 6v3.2M7.5 11h.01" strokeLinecap="round" />
            </svg>
          </span>
          <span style={{ fontWeight: 500 }}>Validation Agent flagged {pendingCount} anomalies</span>
        </div>
        <div>
          Detected during AI execution. Human review required before action is taken.{' '}
          <a onClick={() => { const el = document.querySelector('[data-anomalies-list]'); if (el) { const r = el.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - 80, behavior: 'smooth' }); } }} style={{
            fontWeight: 700, color: 'inherit', cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>Review pending anomalies</a>
        </div>
        <button onClick={dismissAnomalyAlert} style={{
          position: 'absolute', top: 14, right: 14,
          background: 'transparent', border: 0, cursor: 'pointer',
          color: 'inherit', padding: 0, opacity: 0.7, lineHeight: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
        aria-label="Dismiss">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l6 6M9 3l-6 6" /></svg>
        </button>
      </div>
    )}
    <div className="page" style={{ fontFamily: FF }}>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1A1D23', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 8, zIndex: 1000, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="page__header">
        <div style={{ flex: 1 }}>
          <h1 className="page__title">Anomalies</h1>
        </div>
      </div>

      {/* KPI summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Pending review',     val: pendingCount,  sub: 'Requires human review' },
          { label: 'In review',          val: inReviewCount, sub: 'Under investigation' },
          { label: 'Resolved this week', val: resolvedCount, sub: 'No open signals' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', borderRadius: 8, background: '#fff', border: '1px solid var(--gray-30)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-90)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-130)', lineHeight: 1, marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-85)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Signals summary panel — full width, chart capped at 2/3 */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-30)', borderRadius: 10, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
          {/* Bar chart — 2/3 width to align with KPI grid */}
          <div style={{ flex: '0 0 calc(66.666% - 12px)', minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-130)', marginBottom: 14 }}>Signals by type <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-85)', marginLeft: 4 }}>last 30 days</span></div>
            {[
              { label: 'Procedure deviation',   count: 11, max: 11, color: '#dc2626' },
              { label: 'KB mismatch',           count: 7,  max: 11, color: '#d97706' },
              { label: 'Boundary deviation',    count: 3,  max: 11, color: '#0d9488' },
              { label: 'Tool use irregularity', count: 2,  max: 11, color: '#2563eb' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--gray-105)', width: 172, flexShrink: 0 }}>{r.label}</span>
                <div style={{ flex: 1, height: 7, background: 'var(--gray-20)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(r.count / r.max) * 100}%`, background: r.color, borderRadius: 4, transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-115)', width: 18, textAlign: 'right' }}>{r.count}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: 'var(--gray-80)', marginTop: 6 }}>23 signals detected in the last 30 days</div>
          </div>
          {/* Pattern observation — remaining 1/3 */}
          <div style={{ flex: 1, padding: '14px 16px', background: 'var(--gray-10)', border: '1px solid var(--gray-25)', borderRadius: 8, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-90)', marginBottom: 8, letterSpacing: '0.03em' }}>Pattern observation</div>
              <div style={{ fontSize: 13, color: 'var(--gray-115)', lineHeight: 1.55, marginBottom: 12 }}>
                Procedure deviations account for 48% of signals. 2 of 3 pending reviews involve the <strong>Procedure Adherence Monitor</strong> and the same order verification flow.
              </div>
            </div>
            <button onClick={() => navigate({ screen: 'inbox' })} style={{ fontSize: 12, fontWeight: 600, height: 36, padding: '0 14px', borderRadius: 6, border: '1px solid var(--gray-30)', background: '#fff', color: 'var(--blue-80)', cursor: 'pointer', fontFamily: FF, width: '100%' }}>
              View suggestions →
            </button>
          </div>
        </div>
      </div>

      {/* Filter tabs + sort inline */}
      <div style={{ marginBottom: 4 }} data-anomalies-list>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {filterTypes.map(f => {
              const count = f === 'all' ? rich.length
                : f === 'pending_review' ? rich.filter(a => getStatus(a.id) === 'pending').length
                : rich.filter(a => a.type === f).length;
              return (
                <button key={f} className={'tab' + (filter === f ? ' tab--active' : '')} onClick={() => setFilter(f)}>
                  {filterLabels[f]} <span className="tab__count">{count}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue-80)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-80)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF, outline: 'none', padding: '0 2px', appearance: 'none', WebkitAppearance: 'none' }}>
              <option value="recency">Recency</option>
              <option value="confidence">Pattern confidence</option>
              <option value="type">Anomaly type</option>
            </select>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--blue-80)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none', marginLeft: -2 }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      {/* Queue — table layout */}
      <div style={{ border: '1px solid var(--gray-30)', borderRadius: 10, overflow: 'hidden', background: '#fff', marginTop: 16 }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0,1fr) 90px 80px 18px', gap: 10, background: 'var(--gray-15)', borderBottom: '1px solid var(--gray-30)', padding: '7px 12px', alignItems: 'center' }}>
          {['Type', 'Description', 'Confidence', 'Status', ''].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-85)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="empty" style={{ padding: 40 }}>
            <div className="empty__title">No signals match this filter</div>
          </div>
        )}
        {visible.map((a, i) => {
          const tc = typeConfig[a.type] || typeConfig.procedure_deviation;
          const status = getStatus(a.id);
          const sconf = statusConfig[status];
          const isOpen = selected === a.id;
          const isDismissed = status === 'dismissed';
          const confColor = confidenceColor(a.confidence);

          return (
            <div key={a.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid var(--gray-30)' : 'none', opacity: isDismissed ? 0.45 : 1, transition: 'opacity 0.2s' }}>

              {/* Table row */}
              <div
                onClick={() => setSelected(isOpen ? null : a.id)}
                style={{ display: 'grid', gridTemplateColumns: '160px minmax(0,1fr) 90px 80px 18px', gap: 10, padding: '11px 12px', alignItems: 'center', cursor: 'pointer', maxWidth: '100%', background: isOpen ? '#f8faff' : 'transparent', transition: 'background 0.1s', borderLeft: `3px solid ${tc.leftBorder}` }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--gray-10)'; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Type badge */}
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: tc.badgeBg, border: `1px solid ${tc.badgeBorder}`, color: tc.badgeColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: '100%', justifySelf: 'start' }}>{tc.label}</span>

                {/* Description — single line truncated */}
                <div style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-130)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', maxWidth: '38ch' }}>{a.description}</div>
                </div>

                {/* Confidence */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: confColor }}>{a.confidence}%</div>
                </div>

                {/* Status */}
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 4px', borderRadius: 4, border: `1px solid ${sconf.border}`, color: sconf.color, background: 'transparent', whiteSpace: 'nowrap', textAlign: 'center' }}>{sconf.label}</span>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.18s', flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
              </div>

              {/* Expanded panel */}
              {isOpen && (
                <div style={{ background: '#f8faff', borderTop: '1px solid var(--gray-25)', padding: '0 20px 20px 16px' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 18, marginBottom: 0 }}>

                    {/* Left: description + trigger + conversation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-85)', marginBottom: 5, letterSpacing: '0.03em' }}>Deviation description</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-115)', lineHeight: 1.6 }}>{a.description}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-85)', marginBottom: 5, letterSpacing: '0.03em' }}>Affected resource</div>
                        <a onClick={e => { e.stopPropagation(); setProcedurePanel({ ...(a.suggestion || {}), title: a.affectedResource, target: a.affectedResource, changeSummary: a.suggestion?.rationale || '', onApply: () => { setStatus(a.id, 'resolved'); showToast('Suggestion applied'); setProcedurePanel(null); setSelected(null); } }); }} style={{ fontSize: 13, color: '#2563EB', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>{a.affectedResource}</a>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-85)', marginBottom: 5, letterSpacing: '0.03em' }}>Trigger source</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-115)' }}>{a.monitor}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-85)', marginBottom: 5, letterSpacing: '0.03em' }}>Originating conversation</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-115)', marginBottom: 4, lineHeight: 1.4 }}>{a.convId}</div>
                        <a onClick={e => { e.stopPropagation(); showToast('Opening conversation…'); }} style={{ fontSize: 12, color: 'var(--blue-80)', cursor: 'pointer', fontWeight: 500 }}>View conversation — {a.convName} →</a>
                      </div>
                    </div>

                    {/* Right: confidence + suggestion preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {/* Confidence */}
                      <div style={{ padding: '12px 14px', background: '#fff', border: '1px solid var(--gray-25)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-85)', marginBottom: 8, letterSpacing: '0.03em' }}>Pattern confidence</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <div style={{ flex: 1, height: 7, background: 'var(--gray-20)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${a.confidence}%`, background: confColor, borderRadius: 4, transition: 'width 0.4s' }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: confColor, flexShrink: 0 }}>{a.confidence}%</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--gray-90)', lineHeight: 1.45 }}>{confidenceLabel(a.confidence)}</div>
                      </div>

                      {/* Suggestion preview — read-only */}
                      <div style={{ padding: '12px 14px', background: '#fff', border: '1px solid #DDD6FE', borderRadius: 8, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.94 14.34a1.5 1.5 0 0 0-1.09 1.09L8 18l-.85-2.57a1.5 1.5 0 0 0-1.09-1.09L3.5 13.5l2.57-.85a1.5 1.5 0 0 0 1.09-1.09L8 9l.85 2.57a1.5 1.5 0 0 0 1.09 1.09l2.57.85z"/></svg>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.03em' }}>Suggestion available</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-115)', marginBottom: 4 }}>{a.suggestion.target}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-90)', lineHeight: 1.5, marginBottom: 10 }}>{a.suggestion.rationale}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-80)', marginBottom: 8, fontStyle: 'italic' }}>Review and apply changes in the Suggestions view.</div>
                        <button onClick={e => { e.stopPropagation(); setProcedurePanel({ ...a.suggestion, title: a.suggestion.target, changeSummary: a.suggestion.rationale, onApply: () => { setStatus(a.id, 'resolved'); showToast('Suggestion applied'); setSelected(null); } }); }} style={{ fontSize: 12, fontWeight: 600, height: 36, padding: '0 14px', borderRadius: 6, border: '1px solid #DDD6FE', background: '#F5F3FF', color: '#7C3AED', cursor: 'pointer', fontFamily: FF }}>Review suggestion →</button>
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                    {dismissPanel !== a.id && (
                      <button onClick={e => { e.stopPropagation(); setDismissPanel(a.id); setDismissReason(''); }} style={{ fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 2 }}>Dismiss</button>
                    )}
                    <div style={{ display: 'inline-flex', position: 'relative' }} onClick={e => e.stopPropagation()}>
                      {(() => {
                        const choice = splitChoice[a.id] || 'reviewed';
                        const label = choice === 'in_review' ? 'Mark as in review' : 'Mark as reviewed';
                        const onPrimary = () => {
                          if (choice === 'in_review') { setStatus(a.id, 'in_review'); showToast('Marked as in review'); }
                          else { setStatus(a.id, 'resolved'); showToast('Marked as reviewed'); setSelected(null); }
                        };
                        const disabled = choice === 'in_review' && status === 'in_review';
                        return (<>
                          <button onClick={onPrimary} disabled={disabled} className="btn btn--primary btn--sm" style={{ fontFamily: FF, borderTopRightRadius: 0, borderBottomRightRadius: 0, marginRight: 0 }}>{label}</button>
                          <button aria-label="More actions" onClick={() => setSplitOpen(splitOpen === a.id ? null : a.id)} className="btn btn--primary btn--sm" style={{ fontFamily: FF, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: '1.4px solid rgba(255,255,255,0.35)', padding: '0 8px', marginLeft: -1 }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 4l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          {splitOpen === a.id && (
                            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#fff', border: '1px solid var(--gray-30)', borderRadius: 8, padding: 4, minWidth: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50 }}>
                              {[
                                { key: 'reviewed', label: 'Mark as reviewed' },
                                { key: 'in_review', label: 'Mark as in review' },
                              ].map(opt => (
                                <button key={opt.key} onClick={() => { setSplitChoice(p => ({ ...p, [a.id]: opt.key })); setSplitOpen(null); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, fontFamily: FF, background: 'none', border: 0, borderRadius: 6, cursor: 'pointer', color: 'var(--gray-130)', fontWeight: choice === opt.key ? 600 : 400 }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-15)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                  <span style={{ width: 14, display: 'inline-flex', justifyContent: 'center', color: 'var(--gray-115)' }}>{choice === opt.key ? '✓' : ''}</span>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </>);
                      })()}
                    </div>
                  </div>

                  {/* Dismiss reason inline */}
                  {dismissPanel === a.id && (
                    <div style={{ padding: '12px 14px', background: '#fff', border: '1px solid var(--gray-30)', borderRadius: 8, marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-115)', flexShrink: 0 }}>Reason:</span>
                      <select value={dismissReason} onChange={e => setDismissReason(e.target.value)} style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--gray-30)', fontSize: 13, color: 'var(--gray-115)', fontFamily: FF, outline: 'none' }}>
                        <option value="">Select a reason…</option>
                        <option value="expected">Expected behavior — procedure was updated</option>
                        <option value="known">Known issue — already being addressed</option>
                        <option value="test">Test conversation — not production</option>
                        <option value="fp">False positive — behavior was correct</option>
                      </select>
                      <button onClick={e => { e.stopPropagation(); setDismissPanel(null); }} style={{ fontSize: 12, color: 'var(--gray-85)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF }}>Cancel</button>
                      <button onClick={e => { e.stopPropagation(); if (!dismissReason) { showToast('Select a reason first'); return; } setStatus(a.id, 'dismissed'); setDismissPanel(null); setSelected(null); showToast('Signal dismissed'); }} className="btn btn--primary btn--sm" style={{ fontFamily: FF }}>Confirm dismiss</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {procedurePanel && window.ProcedurePanelShared && <window.ProcedurePanelShared suggestion={procedurePanel} onClose={() => setProcedurePanel(null)}/>}
    </div>
    </>
  );
}

Object.assign(window, { ShellV2, GoalsHomeV2, GoalDetailV2, InboxV2, NewGoalQuickModal, SettingsV2, SuggestionCardV2, GoalCardV2, AnomaliesV2 });