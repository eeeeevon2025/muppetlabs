// Goals screens — Goals home (dashboard-merged) and Goal detail.

function GoalsHome({ navigate, openModal, dismissBanner, bannerDismissed }) {
  const { goals, monitors, suggestions, fleetMetrics } = window.K_DATA;
  const monitorById = Object.fromEntries(monitors.map((m) => [m.id, m]));

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs">
            <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">Goals</span>
          </div>
          <h1 className="page__title">Goals</h1>
          <p className="page__subtitle">Goals track performance trends over time. They are <strong>observational</strong> — they help you see whether outcomes are moving in the right direction. Goals do not automatically change AI behavior. All changes to AI procedures require human review and approval.</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary"><IRefresh size={14}/>Refresh</button>
          <button className="btn btn--primary" onClick={() => navigate({ screen: 'newgoal' })}>
            <IPlus size={14}/>New goal
          </button>
        </div>
      </div>

      {!bannerDismissed && (
        <div className="loop-banner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge--warning"><span className="badge__dot"></span>NEW</span>
              <strong style={{ fontSize: 15, color: 'var(--gray-130)', letterSpacing: '-0.005em' }}>How AI Monitoring works</strong>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-105)', maxWidth: 720, lineHeight: 1.5 }}>
              You set goals. Monitors evaluate every conversation. When something drifts, you get a focused fix in your Inbox — not a generic alert.
            </div>
            <div className="loop-banner__steps">
              <div className="loop-banner__step"><strong>1. Set a goal</strong>Pick a Computed Field and a target.</div>
              <div className="loop-banner__step"><strong>2. Attach a monitor</strong>Score every conversation against criteria.</div>
              <div className="loop-banner__step"><strong>3. Get suggestions</strong>Drift triggers a concrete fix.</div>
              <div className="loop-banner__step"><strong>4. Apply &amp; track</strong>See the goal move.</div>
            </div>
          </div>
          <button className="btn btn--ghost" onClick={dismissBanner} aria-label="Dismiss">
            <IClose size={16}/>
          </button>
        </div>
      )}

      <div className="metric-grid">
        <Metric label="AI Resolution Rate" value={fleetMetrics.aiResolutionRate} unit="%" delta="+3 vs last month" deltaKind="up"/>
        <Metric label="Monitor Pass Rate" value={fleetMetrics.monitorPassRate} unit="%" delta="−4 vs last month" deltaKind="down"/>
        <Metric label="AI-CSAT (fleet avg)" value={fleetMetrics.aiCsat} unit="" delta="+0.2 vs last month" deltaKind="up" trend={fleetMetrics.aiCsatTrend}/>
        <Metric label="Anomalies (30d)" value={fleetMetrics.anomaliesLast30d} unit="" delta="3 active now" deltaKind="neutral"/>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 14px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--gray-130)' }}>{goals.length} active goals</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ghost btn--sm"><IFilter size={12}/>Filter</button>
          <select className="select" style={{ width: 160, fontSize: 12, padding: '5px 28px 5px 10px' }} defaultValue="recent">
            <option value="recent">Recently updated</option>
            <option value="progress">Most progress</option>
            <option value="risk">At risk first</option>
          </select>
        </div>
      </div>

      <div className="goal-grid">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} monitor={g.monitorIds.map((id) => monitorById[id])} onOpen={() => navigate({ screen: 'goal', id: g.id })}/>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, unit, delta, deltaKind, trend }) {
  return (
    <div className="metric">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="metric__label">{label}</div>
      </div>
      <div className="metric__value">{value}{unit && <sup>{unit}</sup>}</div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        {delta && <div className={'metric__delta metric__delta--' + deltaKind}>
          {deltaKind === 'up' && <ITrendUp size={11} stroke={2.5} style={{ marginRight: 3, marginBottom: -1 }}/>}
          {deltaKind === 'down' && <ITrendDown size={11} stroke={2.5} style={{ marginRight: 3, marginBottom: -1 }}/>}
          {delta}
        </div>}
        {trend && <div style={{ width: 70, height: 24 }}><Sparkline data={trend} color="var(--blue-60)" height={24}/></div>}
      </div>
    </div>
  );
}

function GoalCard({ goal, monitor, onOpen }) {
  const fillKind = goal.status === 'no_data' ? 'warning' : goal.status === 'stalled' ? 'danger' : goal.pct > 70 ? 'success' : null;
  const formatVal = (v) => {
    if (goal.unit === 'currency') return '$' + v.toFixed(2);
    if (goal.unit === 'percent') return v + '%';
    return v.toFixed(goal.unit === 'score' && v < 10 ? 1 : 0);
  };
  return (
    <article className="goal-card" onClick={onOpen}>
      <div className="goal-card__head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="goal-card__name">{goal.name}</h3>
          <div className="goal-card__field">
            <span className="cf-tag">{goal.fieldRef}</span>
          </div>
        </div>
        <GoalStatusBadge status={goal.status}/>
      </div>

      <div>
        <div className="goal-card__values">
          <div className="goal-card__current">
            {formatVal(goal.current)}
            {goal.unit === 'score' && <sup>/ {formatVal(goal.target)}</sup>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--gray-90)', marginBottom: 2 }}>TARGET</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-115)' }}>{formatVal(goal.target)}</div>
          </div>
        </div>
        <div className="goal-card__progress">
          <div className={'goal-card__progress-fill' + (fillKind ? ' goal-card__progress-fill--' + fillKind : '')} style={{ width: goal.pct + '%' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--gray-90)' }}>
          <span>{goal.pct}% of the way to target</span>
          <span>7-day change: <strong style={{ color: 'var(--gray-115)' }}>{goal.change7d}</strong></span>
        </div>
      </div>

      <div style={{ height: 32 }}>
        <Sparkline data={goal.trend} color={goal.direction === 'higher_is_better' ? 'var(--green-70)' : 'var(--blue-70)'} height={32}/>
      </div>

      <div className="goal-card__footer">
        {monitor.length === 0 ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--yellow-100)', fontSize: 12 }}>
            <IAlert size={12}/> No monitor attached
          </span>
        ) : (
          <span className="linked-monitor">
            <ILink size={11}/>
            {monitor[0].name}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {goal.onTrackBy ? <>Est. {goal.onTrackBy} if trend continues <IChevronRight size={12}/></> : <>View details <IChevronRight size={12}/></>}
        </span>
      </div>
    </article>
  );
}

function GoalStatusBadge({ status }) {
  if (status === 'improving') return <span className="badge badge--success"><span className="badge__dot"></span>Trending up</span>;
  if (status === 'stalled') return <span className="badge badge--warning"><span className="badge__dot"></span>No recent change</span>;
  if (status === 'declining') return <span className="badge badge--danger"><span className="badge__dot"></span>Declining</span>;
  if (status === 'no_data') return <span className="badge badge--neutral"><span className="badge__dot"></span>Insufficient data</span>;
  return null;
}
// ──────────────────────────────────────────── Goal detail ────
function GoalDetail({ id, navigate, openConvo }) {
  const { goals, monitors, suggestions, flaggedConversations } = window.K_DATA;
  const goal = goals.find((g) => g.id === id);
  const goalMonitors = monitors.filter((m) => goal.monitorIds.includes(m.id));
  const goalSuggestions = suggestions.filter((s) => s.goalIds.includes(goal.id));
  const goalFlagged = flaggedConversations.filter((c) => goal.monitorIds.includes(c.monitorId));
  const [tab, setTab] = useState('procedure');

  if (!goal) return <div className="page"><div className="empty"><div className="empty__title">Goal not found</div></div></div>;

  return (
    <div className="page">
      <div className="crumbs">
        <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
        <span className="crumbs__sep">/</span>
        <a onClick={() => navigate({ screen: 'goals' })}>Goals</a>
        <span className="crumbs__sep">/</span>
        <span className="crumbs__current">{goal.name}</span>
      </div>
      <div className="page__header" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 className="page__title" style={{ margin: 0 }}>{goal.name}</h1>
            <GoalStatusBadge status={goal.status}/>
            {goal.isDefault && <span className="badge badge--neutral">Default</span>}
          </div>
          <p className="page__subtitle">{goal.description}</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary"><ISettings size={14}/>Edit goal</button>
          <button className="btn btn--secondary"><IExternal size={14}/>Open report</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="card__title">Progress</div>
          <div style={{ fontSize: 32, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.02em', marginTop: 8 }}>
            {goal.unit === 'currency' ? '$' : ''}{goal.current}{goal.unit === 'percent' ? '%' : ''} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--gray-90)' }}>/ {goal.unit === 'currency' ? '$' : ''}{goal.target}{goal.unit === 'percent' ? '%' : ''}</span>
          </div>
          <div className="goal-card__progress" style={{ marginTop: 10 }}>
            <div className="goal-card__progress-fill" style={{ width: goal.pct + '%' }}></div>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-95)' }}>
            {goal.onTrackBy ? <>On track to hit by <strong style={{ color: 'var(--gray-115)' }}>{goal.onTrackBy}</strong></> : 'Insufficient data to project'}
          </div>
        </div>
        <div className="card">
          <div className="card__title">Driven by</div>
          <div className="cf-tag" style={{ marginTop: 8 }}>{goal.fieldRef}</div>
          <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 6, lineHeight: 1.5 }}>
            {goal.fieldLabel} — a Computed Field {goalMonitors.length ? <>scored by <strong style={{ color: 'var(--gray-115)' }}>{goalMonitors[0].name}</strong></> : 'with no active scorer'}.
          </div>
          <hr className="hr"/>
          <div style={{ fontSize: 12, color: 'var(--gray-95)' }}>Scope</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-115)', marginTop: 2 }}>
            {goal.scope === 'all' ? 'All AI Agents' : 'Support agent only'}
          </div>
        </div>
        <div className="card">
          <div className="card__title">7-day trend</div>
          <div style={{ height: 80, marginTop: 8 }}>
            <Sparkline data={goal.trend} color="var(--blue-70)" height={80}/>
          </div>
        </div>
      </div>

      {/* Linked monitor + suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card card--flush">
          <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card__title">Linked monitors</div>
              <div className="card__subtitle">Monitors that score the {goal.fieldLabel}.</div>
            </div>
            <button className="btn btn--ghost btn--sm"><IPlus size={12}/>Attach</button>
          </div>
          {goalMonitors.length === 0 ? (
            <div style={{ padding: 16 }}>
              <div className="empty-thin">
                No monitor is currently scoring this goal. Attach one to start collecting data.
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn--primary btn--sm" onClick={() => navigate({ screen: 'newmonitor', goalId: goal.id })}><IPlus size={12}/>Create monitor</button>
                </div>
              </div>
            </div>
          ) : (
            goalMonitors.map((m) => (
              <div key={m.id} className="list-row" style={{ gridTemplateColumns: '1fr auto auto auto' }} onClick={() => navigate({ screen: 'monitor', id: m.id })}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{m.evals30d.toLocaleString()} evaluations · 30d</div>
                </div>
                <div style={{ width: 70, height: 28 }}><Sparkline data={m.trend} color={m.passRate > m.threshold ? 'var(--green-70)' : 'var(--red-70)'} height={28}/></div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: m.passRate > m.threshold ? 'var(--green-90)' : 'var(--red-90)' }}>{m.passRate}%</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-90)' }}>vs {m.threshold}% target</div>
                </div>
                <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
              </div>
            ))
          )}
        </div>

        <div className="card card--flush">
          <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card__title">Active suggestions</div>
              <div className="card__subtitle">Proposed by monitors when this goal lags.</div>
            </div>
            <button className="btn btn--ghost btn--sm" onClick={() => navigate({ screen: 'inbox' })}>View all <IChevronRight size={11}/></button>
          </div>
          {goalSuggestions.length === 0 ? (
            <div style={{ padding: 16 }}><div className="empty-thin">No active suggestions for this goal.</div></div>
          ) : (
            goalSuggestions.slice(0, 3).map((s) => (
              <div key={s.id} className="list-row" style={{ gridTemplateColumns: '1fr auto auto' }} onClick={() => navigate({ screen: 'inbox', highlight: s.id })}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{s.typeLabel} · {s.target} · {s.createdAt}</div>
                </div>
                <span className={'badge ' + (s.priority === 'high' ? 'badge--danger' : s.priority === 'medium' ? 'badge--warning' : 'badge--neutral')}>
                  {s.priority}
                </span>
                <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Breakdown tabs */}
      {goal.breakdown && (
        <div className="card card--flush">
          <div style={{ padding: '14px 16px 0' }}>
            <div className="card__title" style={{ marginBottom: 0 }}>What's driving this goal</div>
            <div className="card__subtitle">Score broken down by procedure and topic, weighted by conversation volume.</div>
          </div>
          <div style={{ padding: '8px 16px 0' }}>
            <div className="tabs">
              <button className={'tab' + (tab === 'procedure' ? ' tab--active' : '')} onClick={() => setTab('procedure')}>By procedure</button>
              <button className={'tab' + (tab === 'topic' ? ' tab--active' : '')} onClick={() => setTab('topic')}>By topic</button>
              <button className={'tab' + (tab === 'flagged' ? ' tab--active' : '')} onClick={() => setTab('flagged')}>
                Flagged conversations <span className="tab__count">{goalFlagged.length}</span>
              </button>
            </div>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            {tab !== 'flagged' && (
              <div>
                {goal.breakdown[tab].map((row) => {
                  const targetVal = goal.target;
                  const pct = goal.direction === 'higher_is_better'
                    ? Math.min(100, (row.value / targetVal) * 100)
                    : Math.min(100, (targetVal / row.value) * 100);
                  return (
                    <div key={row.name} className="bar-row">
                      <div className="bar-row__label">{row.name} <span style={{ color: 'var(--gray-85)', fontWeight: 400 }}>· {row.share}%</span></div>
                      <div className="bar-row__bar">
                        <div className="bar-row__bar-fill" style={{ width: pct + '%', background: row.value < targetVal * 0.85 ? 'var(--red-60)' : row.value < targetVal * 0.95 ? 'var(--yellow-70)' : 'var(--green-60)' }}></div>
                      </div>
                      <div className="bar-row__value">{row.value.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {tab === 'flagged' && (
              goalFlagged.length === 0
                ? <div className="empty-thin">No flagged conversations for this goal in the last 30 days.</div>
                : <div>
                  {goalFlagged.map((c) => (
                    <div key={c.id} className="list-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 80px 24px', padding: '12px 0' }} onClick={() => openConvo(c.id)}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>{c.customer}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{c.customerCompany}</div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-105)' }}>{c.preview}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-95)' }}>{c.monitor}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.score < 50 ? 'var(--red-70)' : 'var(--yellow-70)' }}></span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-115)' }}>{c.score}</span>
                      </div>
                      <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { GoalsHome, GoalDetail, GoalCard, GoalStatusBadge, Metric });
