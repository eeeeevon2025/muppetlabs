// Monitors screens — list + detail with per-criterion drill-down

function MonitorsList({ navigate, openModal }) {
  const { monitors, computedFields } = window.K_DATA;
  const customCount = monitors.filter((m) => !m.isDefault).length;
  const customLimit = 1;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs">
            <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">Quality Monitors</span>
          </div>
          <h1 className="page__title">Quality Monitors</h1>
          <p className="page__subtitle">Monitors produce AI-estimated quality scores for closed conversations based on criteria you define. Scores are probabilistic estimates — not objective truth. They surface patterns and candidates for human review.</p>
        </div>
        <div className="page__actions">
          <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>
            <strong style={{ color: 'var(--gray-115)' }}>{customCount} of {customLimit}</strong> custom monitors used <Hint label="M1 Beta caps custom monitors at 1 per workspace. Contact your account team to expand."/>
          </span>
          <button className="btn btn--primary" disabled={customCount >= customLimit} onClick={() => navigate({ screen: 'newmonitor' })}>
            <IPlus size={14}/>New monitor
          </button>
        </div>
      </div>

      <div className="card card--flush">
        <div className="list-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px 80px 24px', background: 'var(--gray-15)', cursor: 'default', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray-90)', padding: '10px 16px' }}>
          <div>Monitor</div>
          <div>Goals fed</div>
          <div>Writes to</div>
          <div>30d trend</div>
          <div>Pass rate</div>
          <div></div>
        </div>
        {monitors.map((m) => {
          const goalsCount = m.goalIds.length;
          const breached = m.passRate < m.threshold;
          return (
            <div key={m.id} className="list-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px 80px 24px' }} onClick={() => navigate({ screen: 'monitor', id: m.id })}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: m.kind === 'air' ? 'var(--purple-15, #ECE7FE)' : 'var(--blue-15)', color: m.kind === 'air' ? 'var(--purple-90, #4D2DAA)' : 'var(--blue-90)', display: 'grid', placeItems: 'center' }}>
                    {m.kind === 'air' ? <IUsers size={13}/> : <IRobot size={13}/>}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>
                      {m.name}
                      {m.isDefault && <span className="badge badge--neutral" style={{ marginLeft: 8, fontSize: 10 }}>Default</span>}
                      {breached && <span className="badge badge--danger" style={{ marginLeft: 6, fontSize: 10 }}>Review recommended</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{m.description}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12 }}>
                {goalsCount === 0
                  ? <span style={{ color: 'var(--gray-90)' }}>—</span>
                  : <span style={{ color: 'var(--gray-105)' }}>{goalsCount} goal{goalsCount > 1 ? 's' : ''}</span>}
              </div>
              <div><span className="cf-tag" style={{ fontSize: 10 }}>{m.writesField}</span></div>
              <div style={{ height: 28 }}><Sparkline data={m.trend} color={breached ? 'var(--red-70)' : 'var(--green-70)'} height={28}/></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: breached ? 'var(--red-90)' : 'var(--green-90)' }}>{m.passRate}%</div>
                <div style={{ fontSize: 11, color: 'var(--gray-90)' }}>vs {m.threshold}%</div>
              </div>
              <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────── Monitor detail
function MonitorDetail({ id, navigate, openConvo }) {
  const { monitors, goals, suggestions, flaggedConversations } = window.K_DATA;
  const m = monitors.find((x) => x.id === id);
  const linkedGoals = goals.filter((g) => g.monitorIds.includes(id));
  const monitorSuggestions = suggestions.filter((s) => s.monitorId === id);
  const flagged = flaggedConversations.filter((c) => c.monitorId === id);
  const [tab, setTab] = useState('criteria');
  const [alertingOpen, setAlertingOpen] = useState(m?.alerting?.enabled || false);
  const [alertingCadence, setAlertingCadence] = useState(m?.alerting?.cadence || 'daily');

  if (!m) return null;

  return (
    <div className="page">
      <div className="crumbs">
        <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
        <span className="crumbs__sep">/</span>
        <a onClick={() => navigate({ screen: 'monitors' })}>Quality Monitors</a>
        <span className="crumbs__sep">/</span>
        <span className="crumbs__current">{m.name}</span>
      </div>
      <div className="page__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 className="page__title" style={{ margin: 0 }}>{m.name}</h1>
            {m.isDefault && <span className="badge badge--neutral">Default</span>}
            <span className={'badge ' + (m.passRate >= m.threshold ? 'badge--success' : 'badge--danger')}>
              <span className="badge__dot"></span>{m.passRate}% pass · target {m.threshold}%
            </span>
          </div>
          <p className="page__subtitle">{m.description}</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary"><ISettings size={14}/>Edit monitor</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="card__title">Est. pass rate · last 30 days <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--purple-80, #6D28D9)', background: 'var(--purple-10, #F5F3FF)', border: '1px solid var(--purple-30, #DDD6FE)', borderRadius: 4, padding: '1px 5px', marginLeft: 4, verticalAlign: 'middle', cursor: 'help' }} title="AI-estimated from conversation signals. Not a direct measurement.">AI-estimated</span></div>
          <div style={{ fontSize: 32, fontWeight: 600, color: m.passRate >= m.threshold ? 'var(--green-90)' : 'var(--red-90)', marginTop: 4, letterSpacing: '-0.02em' }}>{m.passRate}%</div>
          <div style={{ fontSize: 12, color: 'var(--gray-95)', marginBottom: 8 }}>{m.evals30d.toLocaleString()} AI-estimated scores</div>
          <Sparkline data={m.trend} color={m.passRate >= m.threshold ? 'var(--green-70)' : 'var(--red-70)'} height={48}/>
        </div>
        <div className="card">
          <div className="card__title">Writes to</div>
          <div className="cf-tag" style={{ marginTop: 8 }}>{m.writesField}</div>
          <hr className="hr"/>
          <div className="card__title" style={{ marginBottom: 8 }}>Goals fed</div>
          {linkedGoals.length === 0 ? <div style={{ fontSize: 12, color: 'var(--gray-90)' }}>No goals attached</div> : linkedGoals.map((g) => (
            <a key={g.id} onClick={() => navigate({ screen: 'goal', id: g.id })} style={{ display: 'block', fontSize: 13, color: 'var(--blue-80)', cursor: 'pointer', padding: '4px 0', textDecoration: 'none' }}>
              <ITarget size={11} style={{ marginRight: 4, marginBottom: -1 }}/>{g.name}
            </a>
          ))}
        </div>
        <div className="card">
          <div className="card__title">Context profile</div>
          <div style={{ fontSize: 12, color: 'var(--gray-95)', marginBottom: 8 }}>What the LLM evaluator sees</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {m.contextProfile.map((c) => (
              <span key={c} className="badge badge--neutral">{c}</span>
            ))}
          </div>
          <hr className="hr"/>
          <div style={{ fontSize: 12, color: 'var(--gray-95)' }}>
            <Hint label="When admins view conversations older than 30 days, raw transcripts may not be available due to retention policy.">Conversations retained 30 days</Hint>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={'tab' + (tab === 'criteria' ? ' tab--active' : '')} onClick={() => setTab('criteria')}>Criteria <span className="tab__count">{m.criteria.length}</span></button>
        <button className={'tab' + (tab === 'flagged' ? ' tab--active' : '')} onClick={() => setTab('flagged')}>Review candidates <span className="tab__count">{flagged.length}</span></button>
        <button className={'tab' + (tab === 'suggestions' ? ' tab--active' : '')} onClick={() => setTab('suggestions')}>Suggestions produced <span className="tab__count">{monitorSuggestions.length}</span></button>
        <button className={'tab' + (tab === 'alerting' ? ' tab--active' : '')} onClick={() => setTab('alerting')}>Alerting</button>
      </div>

      {tab === 'criteria' && (
        <div className="card card--flush">
          <div style={{ padding: 16, borderBottom: '1px solid var(--gray-30)' }}>
            <div className="card__title" style={{ marginBottom: 4 }}>How conversations are scored</div>
            <div className="card__subtitle">Each conversation receives an AI-estimated score based on these criteria. Scores are probabilistic — use them as signals for investigation, not final judgments. <strong>Essential</strong> criteria must pass for the conversation to pass overall.</div>
          </div>
          <div style={{ padding: '0 16px' }}>
            {m.criteria.map((c) => (
              <div key={c.name} className="criterion-row">
                <div>
                  <div className="criterion-row__name">
                    {c.name}
                    {c.essential && <span className="criterion-row__essential">Essential</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>Weight: {c.weight}% of total</div>
                </div>
                <div className="score-bar">
                  <div className={'score-bar__fill ' + (c.pass >= 70 ? 'score-bar__fill--pass' : 'score-bar__fill--fail')} style={{ width: c.pass + '%' }}></div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.pass >= 70 ? 'var(--green-90)' : 'var(--red-90)', textAlign: 'right' }}>{c.pass}%</div>
                <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'flagged' && (
        <div className="card card--flush">
          {flagged.length === 0
            ? <div style={{ padding: 32 }}><div className="empty-thin">No flagged conversations in the last 30 days. 🎉</div></div>
            : flagged.map((c) => (
              <div key={c.id} className="list-row" style={{ gridTemplateColumns: '1fr 2fr 1fr 80px 24px' }} onClick={() => openConvo(c.id)}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-130)' }}>{c.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{c.customerCompany} · {c.timeAgo}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-105)', lineHeight: 1.45 }}>{c.preview}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-95)', fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.score < 50 ? 'var(--red-70)' : 'var(--yellow-70)' }}></span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.score}</span>
                </div>
                <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="col" style={{ gap: 12 }}>
          {monitorSuggestions.length === 0
            ? <div className="empty"><div className="empty__title">No suggestions yet</div><div className="empty__body">When this monitor's pass rate breaches its target, suggestions will appear in your Inbox.</div></div>
            : monitorSuggestions.map((s) => (
              <div key={s.id} className="card list-row" style={{ gridTemplateColumns: '1fr auto auto', cursor: 'pointer', padding: 16, border: '1px solid var(--gray-30)' }} onClick={() => navigate({ screen: 'inbox', highlight: s.id })}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-130)' }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{s.typeLabel} · {s.target} · {s.createdAt}</div>
                </div>
                <span className={'badge ' + (s.priority === 'high' ? 'badge--danger' : s.priority === 'medium' ? 'badge--warning' : 'badge--neutral')}>{s.priority}</span>
                <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'alerting' && (
        <div className="card" style={{ maxWidth: 720 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-130)', marginBottom: 4 }}>Alert me when this monitor's pass rate drops below target</div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', maxWidth: 520, lineHeight: 1.5 }}>
                Receive alerts when the rolling pass rate breaches the {m.threshold}% target. Disabled by default to avoid notification fatigue.
              </div>
            </div>
            <div className={'toggle' + (alertingOpen ? ' toggle--on' : '')} onClick={() => setAlertingOpen(!alertingOpen)} role="switch" aria-checked={alertingOpen}></div>
          </div>
          {alertingOpen && (
            <>
              <hr className="hr"/>
              <div className="field">
                <label className="field__label"><IClock size={12}/>Cadence</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['hourly', 'daily', 'weekly'].map((c) => (
                    <label key={c} className={'check ' + (alertingCadence === c ? 'check--selected' : '')} style={{ flex: 1 }}>
                      <input type="radio" checked={alertingCadence === c} onChange={() => setAlertingCadence(c)}/>
                      <div>
                        <div className="check__title" style={{ textTransform: 'capitalize' }}>{c}</div>
                        <div className="check__desc">{c === 'hourly' ? 'Most responsive · highest volume' : c === 'daily' ? 'Recommended for most teams' : 'Quietest · weekly digest'}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field__label">Channels</label>
                <label className="check check--selected">
                  <input type="checkbox" defaultChecked/>
                  <div><div className="check__title"><IMail size={11} style={{ marginRight: 6, marginBottom: -1 }}/>Email</div><div className="check__desc">Sent to your Kustomer admin email.</div></div>
                </label>
                <label className="check check--selected" style={{ marginTop: 8 }}>
                  <input type="checkbox" defaultChecked/>
                  <div><div className="check__title"><IBell size={11} style={{ marginRight: 6, marginBottom: -1 }}/>In-app notification</div><div className="check__desc">Inbox badge + bell.</div></div>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { MonitorsList, MonitorDetail });
