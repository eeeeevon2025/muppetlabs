// Inbox — unified Suggestions + Anomalies + Alerts queue with per-conversation drill-down

function Inbox({ navigate, openConvo, highlight }) {
  const { suggestions, anomalies, monitors, goals } = window.K_DATA;
  const monitorById = Object.fromEntries(monitors.map((m) => [m.id, m]));
  const goalById = Object.fromEntries(goals.map((g) => [g.id, g]));

  const [tab, setTab] = useState('suggestions');
  const [filterPriority, setFilterPriority] = useState('all');

  // ── shape unified inbox items
  const sItems = suggestions.map((s) => ({ ...s, kind: 'suggestion' }));
  const aItems = anomalies.map((a) => ({ ...a, kind: 'anomaly' }));
  const visible = tab === 'suggestions' ? sItems : tab === 'anomalies' ? aItems : [...sItems, ...aItems];
  const filtered = filterPriority === 'all'
    ? visible
    : visible.filter((i) => (i.priority || i.severity) === filterPriority);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs">
            <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">Inbox</span>
          </div>
          <h1 className="page__title">Inbox</h1>
          <p className="page__subtitle">Things that need a decision: suggested fixes from monitors, anomalies the validation agent caught, and alerts from goals you've subscribed to. Reviewing the inbox daily is the fastest way to keep AI quality on target.</p>
        </div>
        <div className="page__actions">
          <button className="btn btn--secondary"><IFilter size={14}/>All workspaces</button>
        </div>
      </div>

      <div className="tabs">
        <button className={'tab' + (tab === 'suggestions' ? ' tab--active' : '')} onClick={() => setTab('suggestions')}>Suggestions <span className="tab__count">{sItems.length}</span></button>
        <button className={'tab' + (tab === 'anomalies' ? ' tab--active' : '')} onClick={() => setTab('anomalies')}>Anomalies <span className="tab__count">{aItems.length}</span></button>
        <button className={'tab' + (tab === 'all' ? ' tab--active' : '')} onClick={() => setTab('all')}>All <span className="tab__count">{sItems.length + aItems.length}</span></button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>Priority:</span>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button key={p} className={'btn btn--sm ' + (filterPriority === p ? 'btn--secondary' : 'btn--ghost')} onClick={() => setFilterPriority(p)} style={{ textTransform: 'capitalize' }}>{p}</button>
          ))}
        </div>
      </div>

      <div className="col" style={{ gap: 14 }}>
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty__icon"><ICheckCircle size={20}/></div>
            <div className="empty__title">You're all caught up</div>
            <div className="empty__body">No {tab === 'all' ? 'items' : tab} match your filters. New items appear here as monitors run and the validation agent finds anomalies.</div>
          </div>
        )}
        {filtered.map((it) =>
          it.kind === 'suggestion'
            ? <SuggestionCard key={it.id} sug={it} monitor={monitorById[it.monitorId]} goal={goalById[it.goalIds[0]]} highlighted={highlight === it.id} navigate={navigate}/>
            : <AnomalyCard key={it.id} anom={it} navigate={navigate} openConvo={openConvo}/>
        )}
      </div>
    </div>
  );
}

function SuggestionCard({ sug, monitor, goal, highlighted, navigate }) {
  const [state, setState] = useState('pending'); // pending | applied | dismissed
  const toast = useToast();
  const [showDismiss, setShowDismiss] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [dismissNote, setDismissNote] = useState('');

  if (state === 'applied') {
    return (
      <div className="inbox-card" style={{ background: 'var(--green-15)', borderColor: 'var(--green-40)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ICheckCircle size={18} style={{ color: 'var(--green-90)' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-100)' }}>Applied — "{sug.target}"</div>
            <div style={{ fontSize: 12, color: 'var(--green-100)', opacity: 0.8 }}>The change is live. We'll track {goal?.name} for impact and surface a follow-up if needed.</div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => setState('pending')}>Undo</button>
        </div>
      </div>
    );
  }
  if (state === 'dismissed') return null;

  return (
    <div className="inbox-card" style={highlighted ? { borderColor: 'var(--blue-60)', boxShadow: '0 0 0 3px var(--blue-10)' } : null}>
      <div className="inbox-card__head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="inbox-card__meta" style={{ marginBottom: 6 }}>
            <span className={'badge ' + (sug.priority === 'high' ? 'badge--danger' : sug.priority === 'medium' ? 'badge--warning' : 'badge--neutral')}><span className="badge__dot"></span>{sug.priority}</span>
            <span className="badge badge--info"><IWand size={10}/>{sug.typeLabel}</span>
            {goal && <a onClick={() => navigate({ screen: 'goal', id: goal.id })} style={{ fontSize: 12, color: 'var(--blue-80)', cursor: 'pointer' }}><ITarget size={11} style={{ marginRight: 3, marginBottom: -1 }}/>{goal.name}</a>}
            {monitor && <a onClick={() => navigate({ screen: 'monitor', id: monitor.id })} style={{ fontSize: 12, color: 'var(--gray-95)', cursor: 'pointer' }}><IMonitor size={11} style={{ marginRight: 3, marginBottom: -1 }}/>{monitor.name}</a>}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-90)' }}>{sug.createdAt}</span>
          </div>
          <h3 className="inbox-card__title">{sug.target}</h3>
          <div style={{ fontSize: 12, color: 'var(--gray-95)' }}><strong style={{ color: 'var(--gray-110)', fontWeight: 500 }}>Suggested change:</strong> {sug.title}</div>
        </div>
      </div>

      <p className="inbox-card__rationale"><strong>Why we're suggesting this:</strong> {sug.rationale}</p>
      {sug.impact && <p className="inbox-card__rationale" style={{ color: 'var(--gray-95)' }}><strong style={{ color: 'var(--gray-110)' }}>Expected impact:</strong> {sug.impact}</p>}

      {sug.before && sug.after && (
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
      )}

      <div className="inbox-card__actions">
        <button className="btn btn--ghost btn--sm" onClick={() => setShowDismiss(true)}><IThumbDown size={12}/>Dismiss</button>
        <button className="btn btn--ghost btn--sm"><IExternal size={12}/>Open in editor</button>
        <button className="btn btn--primary btn--sm" onClick={() => { setState('applied'); toast?.('Suggestion applied. Watching for impact.', 'success'); }}>
          <ICheck size={12}/>Apply suggestion
        </button>
      </div>

      <Modal open={showDismiss} onClose={() => setShowDismiss(false)}>
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Dismiss this suggestion?</div>
          <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 16 }}>Telling us why helps Kustomer's models avoid suggesting this again.</div>
          <div className="field">
            <label className="field__label">Reason <span style={{ color: 'var(--red-90)' }}>*</span></label>
            <select className="select" value={dismissReason} onChange={(e) => setDismissReason(e.target.value)}>
              <option value="">Select a reason…</option>
              <option>Already handled outside Kustomer</option>
              <option>Conflicts with our policy</option>
              <option>Not high enough impact</option>
              <option>Suggestion is incorrect</option>
              <option>Will revisit later</option>
              <option>Other</option>
            </select>
          </div>
          <div className="field">
            <label className="field__label">Note (optional)</label>
            <textarea className="textarea" value={dismissNote} onChange={(e) => setDismissNote(e.target.value)} placeholder="What did we miss?"/>
          </div>
        </div>
        <div className="drawer__footer" style={{ borderTop: '1px solid var(--gray-30)' }}>
          <button className="btn btn--ghost" onClick={() => setShowDismiss(false)}>Cancel</button>
          <button className="btn btn--primary" disabled={!dismissReason} onClick={() => { setState('dismissed'); setShowDismiss(false); toast?.('Suggestion dismissed.', 'info'); }}>Dismiss</button>
        </div>
      </Modal>
    </div>
  );
}

function AnomalyCard({ anom, navigate, openConvo }) {
  return (
    <div className="inbox-card">
      <div className="inbox-card__head">
        <div style={{ flex: 1 }}>
          <div className="inbox-card__meta" style={{ marginBottom: 6 }}>
            <span className={'badge ' + (anom.severity === 'high' ? 'badge--danger' : 'badge--warning')}><span className="badge__dot"></span>{anom.severity}</span>
            <span className="badge badge--purple"><IAlert size={10}/>Anomaly · {anom.typeLabel}</span>
            <span style={{ fontSize: 12, color: 'var(--gray-95)' }}><IRobot size={11} style={{ marginRight: 3, marginBottom: -1 }}/>{anom.agentName}</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-90)' }}>{anom.detectedAt}</span>
          </div>
          <h3 className="inbox-card__title">{anom.summary}</h3>
        </div>
      </div>
      <p className="inbox-card__rationale">{anom.detail}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--gray-95)' }}>
        Detected by <strong style={{ color: 'var(--gray-115)' }}>{anom.source}</strong> · affects <strong style={{ color: 'var(--gray-115)' }}>{anom.affectedConvCount} conversations</strong>
      </div>
      <div className="inbox-card__actions">
        <button className="btn btn--ghost btn--sm"><IThumbDown size={12}/>Not an issue</button>
        <button className="btn btn--ghost btn--sm" onClick={() => openConvo('conv-8821')}><IConvo size={12}/>View conversations</button>
        {anom.relatedSuggestionId
          ? <button className="btn btn--primary btn--sm" style={{ marginLeft: 'auto' }} onClick={() => navigate({ screen: 'inbox', highlight: anom.relatedSuggestionId })}><IWand size={12}/>View related suggestion</button>
          : <button className="btn btn--secondary btn--sm" style={{ marginLeft: 'auto' }}><IExternal size={12}/>Open report</button>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────── Conversation drawer (JOB 5) ────
function ConversationDrawer({ id, onClose, navigate }) {
  const { flaggedConversations, monitors } = window.K_DATA;
  const c = flaggedConversations.find((x) => x.id === id);
  if (!c) return null;
  const monitor = monitors.find((m) => m.id === c.monitorId);
  const failedEssential = c.criteriaScores?.filter((s) => s.essential && !s.pass) || [];

  return (
    <Drawer open={!!id} onClose={onClose} wide>
      <div className="drawer__header">
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-90)', fontFamily: 'JetBrains Mono, monospace' }}>{c.id}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-130)', marginTop: 2 }}>{c.customer} · {c.customerCompany}</div>
          <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>Scored by {c.monitor} · {c.timeAgo}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><IClose size={16}/></button>
        </div>
      </div>
      <div className="drawer__body" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--gray-95)' }}>Overall score</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: c.score < 50 ? 'var(--red-90)' : 'var(--yellow-100)', letterSpacing: '-0.02em', marginTop: 4 }}>{c.score}<span style={{ fontSize: 16, color: 'var(--gray-90)', fontWeight: 400 }}>/100</span></div>
            <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>vs threshold {monitor?.threshold || 75}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--gray-95)' }}>Result</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: c.score < 50 ? 'var(--red-90)' : 'var(--yellow-100)', marginTop: 4 }}>
              ✗ Failed
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>Failed {failedEssential.length} essential criterion{failedEssential.length !== 1 ? 'a' : ''}</div>
          </div>
        </div>

        {failedEssential.length > 0 && (
          <div className="callout">
            <div className="callout__title">Why this conversation failed</div>
            <div className="callout__body">
              <strong>{failedEssential[0].name}</strong> is essential for this monitor and scored {failedEssential[0].score}. {failedEssential[0].rationale}
            </div>
          </div>
        )}

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-125)', marginBottom: 8 }}>Score by criterion</div>
        <div className="card card--flush" style={{ padding: 16, marginBottom: 20 }}>
          {c.criteriaScores.map((cs) => (
            <div key={cs.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-115)' }}>
                  {cs.name}
                  {cs.essential && <span className="criterion-row__essential">Essential</span>}
                  <span style={{ fontSize: 11, color: 'var(--gray-90)', marginLeft: 8, fontWeight: 400 }}>weight {cs.weight}%</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: cs.pass ? 'var(--green-90)' : 'var(--red-90)' }}>
                  {cs.pass ? '✓' : '✗'} {cs.score}
                </div>
              </div>
              <div className="score-bar"><div className={'score-bar__fill ' + (cs.pass ? 'score-bar__fill--pass' : 'score-bar__fill--fail')} style={{ width: cs.score + '%' }}></div></div>
              {cs.rationale && <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 6, lineHeight: 1.5, paddingLeft: 12, borderLeft: '2px solid ' + (cs.pass ? 'var(--green-30)' : 'var(--red-30)') }}>{cs.rationale}</div>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-125)', marginBottom: 8 }}>Transcript</div>
        <div className="card" style={{ padding: 12 }}>
          {c.messages?.map((msg, i) => (
            <div key={i} className={'msg msg--' + msg.role}>
              <div className="msg__role">{msg.role === 'ai' ? <><IRobot size={11} style={{ marginRight: 4, marginBottom: -1 }}/>AI</> : 'Customer'}</div>
              <div style={{ flex: 1 }}>{msg.text}</div>
              <div className="msg__time">{msg.time}</div>
            </div>
          )) || <div className="muted" style={{ padding: 8, fontSize: 13 }}>Transcript not available — older than 30-day retention window.</div>}
        </div>
      </div>
      <div className="drawer__footer">
        <div style={{ fontSize: 12, color: 'var(--gray-90)' }}>
          <Hint label="Conversation transcripts are retained for 30 days. After that, only the score and rationale are kept.">30-day retention applies</Hint>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ghost"><IFlag size={14}/>Flag for review</button>
          <button className="btn btn--secondary"><IExternal size={14}/>Open conversation</button>
          <button className="btn btn--primary" onClick={() => { onClose(); navigate({ screen: 'inbox' }); }}><IWand size={14}/>Generate suggestion</button>
        </div>
      </div>
    </Drawer>
  );
}

Object.assign(window, { Inbox, ConversationDrawer });
