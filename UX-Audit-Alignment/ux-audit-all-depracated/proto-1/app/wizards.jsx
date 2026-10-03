// Wizards — New Goal (2-step) and New/Edit Monitor (4-step left-rail)

function NewGoalModal({ open, onClose, onCreated, navigate }) {
  const { computedFields } = window.K_DATA;
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', field: '', target: '', direction: 'higher_is_better', scope: 'all' });
  const toast = useToast();

  const templates = [
    { id: 't_csat', name: 'Increase CSAT', desc: 'Track AI-generated CSAT and improve it over time.', icon: <ITrendUp size={18}/>, prefill: { field: 'ai_generated_csat', direction: 'higher_is_better', target: '4.5' } },
    { id: 't_health', name: 'Improve customer sentiment', desc: 'Lift the rolling Customer Health Score.', icon: <IUsers size={18}/>, prefill: { field: 'customer_health_score', direction: 'higher_is_better', target: '85' } },
    { id: 't_retention', name: 'Improve net retention', desc: 'Reduce churn risk for at-risk customers.', icon: <IBolt size={18}/>, prefill: { field: 'churn_risk_score', direction: 'lower_is_better', target: '20' } },
    { id: 't_cost', name: 'Reduce AI cost per conversation', desc: 'Lower cost-per-conversation by expanding AI handling.', icon: <ITrendDown size={18}/>, prefill: { field: 'cost_per_conversation', direction: 'lower_is_better', target: '2.50' } },
    { id: 't_custom', name: 'Start from scratch', desc: 'Build a custom goal against any Computed Field.', icon: <IPlus size={18}/>, prefill: {} },
  ];

  const pickTemplate = (t) => {
    setTemplate(t);
    setForm({ ...form, name: t.id === 't_custom' ? '' : t.name, ...t.prefill });
    setStep(2);
  };

  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="drawer__header">
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>
            New Goal · Step {step} of 2
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-130)' }}>
            {step === 1 ? 'What do you want to improve?' : 'Define your goal'}
          </div>
        </div>
        <button className="btn btn--ghost btn--icon" onClick={onClose}><IClose size={16}/></button>
      </div>
      <div style={{ padding: 24, overflow: 'auto', maxHeight: '60vh' }}>
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {templates.map((t) => (
              <button key={t.id} className="check" onClick={() => pickTemplate(t)} style={{ textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--blue-15)', color: 'var(--blue-80)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <div className="check__title">{t.name}</div>
                  <div className="check__desc">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="field">
              <label className="field__label">Goal name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Increase CSAT for VIP customers"/>
            </div>
            <div className="field">
              <label className="field__label">Description</label>
              <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What outcome are you tracking?"/>
            </div>
            <div className="field">
              <label className="field__label">
                Track which Computed Field?
                <Hint label="A Computed Field is a Kustomer-managed metric (per conversation, customer, or company) updated automatically by a Quality Monitor."/>
              </label>
              <select className="select" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })}>
                <option value="">Select a field…</option>
                {computedFields.map((cf) => (
                  <option key={cf.id} value={cf.key}>{cf.label} ({cf.scope})</option>
                ))}
              </select>
              <div className="field__hint">
                Don't see what you need? <a style={{ color: 'var(--blue-80)', cursor: 'pointer' }}>Create a new Computed Field</a> first.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label className="field__label">Direction</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <label className={'check ' + (form.direction === 'higher_is_better' ? 'check--selected' : '')} style={{ flex: 1 }}>
                    <input type="radio" checked={form.direction === 'higher_is_better'} onChange={() => setForm({ ...form, direction: 'higher_is_better' })}/>
                    <div><div className="check__title">Higher is better</div></div>
                  </label>
                  <label className={'check ' + (form.direction === 'lower_is_better' ? 'check--selected' : '')} style={{ flex: 1 }}>
                    <input type="radio" checked={form.direction === 'lower_is_better'} onChange={() => setForm({ ...form, direction: 'lower_is_better' })}/>
                    <div><div className="check__title">Lower is better</div></div>
                  </label>
                </div>
              </div>
              <div className="field">
                <label className="field__label">Target value</label>
                <input className="input" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="4.5"/>
                <div className="field__hint">The score you want this field to reach.</div>
              </div>
            </div>
            <div className="field">
              <label className="field__label">Scope (optional)</label>
              <select className="select" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}>
                <option value="all">All AI Agents</option>
                <option value="agent_support">Support Agent only</option>
                <option value="agent_sales">Sales Agent only</option>
              </select>
              <div className="field__hint">Limit this goal to a specific AI Agent's conversations.</div>
            </div>

            <div className="callout callout--info" style={{ marginTop: 16 }}>
              <div className="callout__title">Next: attach a monitor</div>
              <div className="callout__body">After saving, you can attach an existing monitor that scores <strong>{form.field || 'this field'}</strong>, or create a new one.</div>
            </div>
          </div>
        )}
      </div>
      <div className="drawer__footer" style={{ borderTop: '1px solid var(--gray-30)' }}>
        <button className="btn btn--ghost" onClick={step === 2 ? () => setStep(1) : onClose}>
          {step === 2 ? <><IChevronLeft size={12}/>Back</> : 'Cancel'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {step === 2 && (
            <button className="btn btn--primary" disabled={!form.name || !form.field || !form.target} onClick={() => { toast?.('Goal created', 'success'); onClose(); onCreated?.(); }}>
              <ICheck size={12}/>Create goal
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────── New/Edit monitor wizard ────
function NewMonitorModal({ open, onClose, goalId, navigate }) {
  const { goals, computedFields } = window.K_DATA;
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    description: '',
    kind: 'aic',
    goalId: goalId || '',
    writesField: '',
    contextProfile: ['messages', 'kb'],
    criteria: [
      { name: 'Need resolution', weight: 50, essential: true },
      { name: 'Tone & empathy', weight: 30, essential: false },
      { name: 'Response clarity', weight: 20, essential: false },
    ],
    threshold: 75,
    suggestionsEnabled: true,
    alerting: false,
  });
  const toast = useToast();
  const totalWeight = data.criteria.reduce((s, c) => s + Number(c.weight || 0), 0);

  const stepDefs = [
    { num: 1, label: 'What', hint: 'Name & purpose' },
    { num: 2, label: 'Who', hint: 'Conversations to score' },
    { num: 3, label: 'How', hint: 'Criteria & weights' },
    { num: 4, label: 'Actions', hint: 'Alerts & suggestions' },
  ];

  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="drawer__header">
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>New Quality Monitor</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-130)' }}>Define how to score conversations</div>
        </div>
        <button className="btn btn--ghost btn--icon" onClick={onClose}><IClose size={16}/></button>
      </div>
      <div className="wizard" style={{ flex: 1, minHeight: 480 }}>
        <div className="wizard__rail">
          {stepDefs.map((s) => (
            <button key={s.num} className={'wizard__step' + (step === s.num ? ' wizard__step--active' : (step > s.num ? ' wizard__step--done' : ''))} onClick={() => setStep(s.num)}>
              <span className="wizard__step-num">{step > s.num ? <ICheck size={12} stroke={2.5}/> : s.num}</span>
              <div>
                <div className="wizard__step-label">{s.label}</div>
                <div className="wizard__step-hint">{s.hint}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="wizard__body">
          {step === 1 && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>What is this monitor for?</div>
              <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 20 }}>Give your monitor a clear name. This is what shows up across goals and reports.</div>
              <div className="field">
                <label className="field__label">Name</label>
                <input className="input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="e.g. Procedure Adherence Monitor"/>
              </div>
              <div className="field">
                <label className="field__label">Description</label>
                <textarea className="textarea" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="What does this monitor evaluate?"/>
              </div>
              <div className="field">
                <label className="field__label">Monitor type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <label className={'check ' + (data.kind === 'aic' ? 'check--selected' : '')}>
                    <input type="radio" checked={data.kind === 'aic'} onChange={() => setData({ ...data, kind: 'aic' })}/>
                    <div><div className="check__title">AIC — AI conversations</div><div className="check__desc">Evaluates conversations handled by an AI Agent.</div></div>
                  </label>
                  <label className={'check ' + (data.kind === 'air' ? 'check--selected' : '')}>
                    <input type="radio" checked={data.kind === 'air'} onChange={() => setData({ ...data, kind: 'air' })}/>
                    <div><div className="check__title">AIR — Copilot conversations</div><div className="check__desc">Evaluates human-handled conversations using Copilot.</div></div>
                  </label>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Who and what gets scored?</div>
              <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 20 }}>Pick the goal this monitor feeds and what context the evaluator can see.</div>
              <div className="field">
                <label className="field__label">Feeds which goal?</label>
                <select className="select" value={data.goalId} onChange={(e) => setData({ ...data, goalId: e.target.value })}>
                  <option value="">Select a goal…</option>
                  {goals.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field__label">Writes score to <Hint label="A Computed Field is created or reused. The goal you selected will read from this field."/></label>
                <select className="select" value={data.writesField} onChange={(e) => setData({ ...data, writesField: e.target.value })}>
                  <option value="">Create new Computed Field…</option>
                  {computedFields.map((cf) => <option key={cf.id} value={cf.key}>{cf.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field__label">Context profile <Hint label="What the LLM evaluator sees when scoring each conversation."/></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { k: 'messages', t: 'Messages', d: 'Full transcript' },
                    { k: 'kb', t: 'Knowledge base', d: 'Cited articles' },
                    { k: 'traces', t: 'Tool traces', d: 'AI tool calls' },
                    { k: 'customer', t: 'Customer history', d: 'Last 30d' },
                    { k: 'copilot', t: 'Copilot suggestions', d: 'Accepted / rejected' },
                  ].map((opt) => {
                    const on = data.contextProfile.includes(opt.k);
                    return (
                      <label key={opt.k} className={'check ' + (on ? 'check--selected' : '')}>
                        <input type="checkbox" checked={on} onChange={() => setData({ ...data, contextProfile: on ? data.contextProfile.filter((x) => x !== opt.k) : [...data.contextProfile, opt.k] })}/>
                        <div><div className="check__title">{opt.t}</div><div className="check__desc">{opt.d}</div></div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>How is each conversation scored?</div>
              <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 20 }}>Define what the evaluator looks for. Weights determine how each criterion contributes; <strong>Essential</strong> means the conversation fails if this criterion fails — regardless of total score.</div>
              <div style={{ background: 'var(--gray-15)', border: '1px solid var(--gray-30)', borderRadius: 10, padding: 12 }}>
                {data.criteria.map((c, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px 28px', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: i ? '1px solid var(--gray-30)' : 'none' }}>
                    <input className="input" value={c.name} onChange={(e) => { const arr = [...data.criteria]; arr[i].name = e.target.value; setData({ ...data, criteria: arr }); }} placeholder="Criterion name"/>
                    <div>
                      <input className="input" type="number" value={c.weight} onChange={(e) => { const arr = [...data.criteria]; arr[i].weight = e.target.value; setData({ ...data, criteria: arr }); }} style={{ paddingRight: 24 }}/>
                    </div>
                    <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-115)' }}>
                      <input type="checkbox" checked={c.essential} onChange={(e) => { const arr = [...data.criteria]; arr[i].essential = e.target.checked; setData({ ...data, criteria: arr }); }}/>
                      Essential
                    </label>
                    <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setData({ ...data, criteria: data.criteria.filter((_, j) => j !== i) })}><ITrash size={12}/></button>
                  </div>
                ))}
                <button className="btn btn--ghost btn--sm" style={{ marginTop: 10 }} onClick={() => setData({ ...data, criteria: [...data.criteria, { name: '', weight: 0, essential: false }] })}><IPlus size={11}/>Add criterion</button>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: totalWeight === 100 ? 'var(--green-90)' : 'var(--yellow-100)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {totalWeight === 100 ? <ICheck size={12} stroke={2.5}/> : <IAlert size={12}/>} Total weight: {totalWeight}% {totalWeight !== 100 && '(must sum to 100)'}
              </div>
              <div className="field" style={{ marginTop: 20 }}>
                <label className="field__label">Pass threshold</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min="0" max="100" value={data.threshold} onChange={(e) => setData({ ...data, threshold: Number(e.target.value) })} style={{ flex: 1 }}/>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-130)', minWidth: 50, textAlign: 'right' }}>{data.threshold}%</div>
                </div>
                <div className="field__hint">Conversations scoring below this fail. Aggregated daily into pass-rate metrics.</div>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>What happens when things go wrong?</div>
              <div style={{ fontSize: 13, color: 'var(--gray-95)', marginBottom: 20 }}>Choose what this monitor does when its pass rate drops below threshold.</div>
              <label className={'check ' + (data.suggestionsEnabled ? 'check--selected' : '')} style={{ marginBottom: 10 }}>
                <input type="checkbox" checked={data.suggestionsEnabled} onChange={(e) => setData({ ...data, suggestionsEnabled: e.target.checked })}/>
                <div>
                  <div className="check__title"><IWand size={11} style={{ marginRight: 6, marginBottom: -1 }}/>Generate suggestions <span className="badge badge--info" style={{ marginLeft: 6 }}>Recommended</span></div>
                  <div className="check__desc">When pass rate falls, Kustomer's reasoning agent will analyze recent failures and propose concrete fixes (procedure tweaks, KB updates, etc.) in your Inbox.</div>
                </div>
              </label>
              <label className={'check ' + (data.alerting ? 'check--selected' : '')}>
                <input type="checkbox" checked={data.alerting} onChange={(e) => setData({ ...data, alerting: e.target.checked })}/>
                <div>
                  <div className="check__title"><IBell size={11} style={{ marginRight: 6, marginBottom: -1 }}/>Send alerts</div>
                  <div className="check__desc">Email + in-app notification when this monitor breaches threshold. You can configure cadence after creating the monitor.</div>
                </div>
              </label>

              <hr className="hr"/>
              <div style={{ background: 'var(--blue-10)', border: '1px solid var(--blue-30)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-100)', marginBottom: 6 }}>Review</div>
                <div style={{ fontSize: 12, color: 'var(--blue-100)', lineHeight: 1.6 }}>
                  Create monitor <strong>{data.name || '(unnamed)'}</strong> evaluating {data.kind === 'aic' ? 'AI' : 'Copilot'} conversations.
                  Score will be written to <strong>{data.writesField || 'a new Computed Field'}</strong> and feed goal <strong>{goals.find((g) => g.id === data.goalId)?.name || '(none selected)'}</strong>.
                  Threshold: {data.threshold}%. {data.criteria.length} criteria.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="drawer__footer" style={{ borderTop: '1px solid var(--gray-30)' }}>
        <button className="btn btn--ghost" onClick={step === 1 ? onClose : () => setStep(step - 1)}>
          {step === 1 ? 'Cancel' : <><IChevronLeft size={12}/>Back</>}
        </button>
        <div style={{ fontSize: 12, color: 'var(--gray-90)' }}>Step {step} of 4</div>
        {step < 4
          ? <button className="btn btn--primary" onClick={() => setStep(step + 1)}>Next<IChevronRight size={12}/></button>
          : <button className="btn btn--primary" onClick={() => { toast?.('Monitor created', 'success'); onClose(); }}><ICheck size={12}/>Create monitor</button>}
      </div>
    </Modal>
  );
}

// ──────────────────────────────────────────── Computed Fields list ────
function ComputedFieldsList({ navigate }) {
  const { computedFields, monitors, goals } = window.K_DATA;
  const usageOfField = (key) => ({
    monitors: monitors.filter((m) => m.writesField === key).length,
    goals: goals.filter((g) => g.fieldRef === key).length,
  });

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs">
            <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">Computed Fields</span>
          </div>
          <h1 className="page__title">Computed Fields</h1>
          <p className="page__subtitle">Computed Fields are Kustomer-managed metrics on Conversations, Customers, or Companies. Quality Monitors write into them; goals read from them. Think of them as the connective tissue between scoring and outcomes.</p>
        </div>
        <div className="page__actions">
          <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>
            <strong style={{ color: 'var(--gray-115)' }}>{computedFields.length} of 9</strong> fields used (3 per object) <Hint label="M1 Beta caps Computed Fields at 3 per object class (Conversation, Customer, Company)."/>
          </span>
          <button className="btn btn--primary" disabled><IPlus size={14}/>New field</button>
        </div>
      </div>
      <div className="callout callout--info" style={{ marginBottom: 16 }}>
        <div className="callout__title">In M1 Beta, Computed Fields are read-only</div>
        <div className="callout__body">Default fields ship with Kustomer. Custom fields are created automatically when you build a Quality Monitor — choose "Create new Computed Field" in the monitor wizard.</div>
      </div>
      <div className="card card--flush">
        <div className="list-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px 100px 24px', background: 'var(--gray-15)', cursor: 'default', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray-90)', padding: '10px 16px' }}>
          <div>Field</div>
          <div>Scope</div>
          <div>Source</div>
          <div>Used by</div>
          <div>Current</div>
          <div></div>
        </div>
        {computedFields.map((cf) => {
          const u = usageOfField(cf.key);
          return (
            <div key={cf.id} className="list-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 100px 100px 24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="cf-tag">{cf.key}</span>
                  {cf.isDefault && <span className="badge badge--neutral" style={{ fontSize: 10 }}>Default</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>{cf.label} <span style={{ color: 'var(--gray-85)' }}>· {cf.range}</span></div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-105)' }}>{cf.scope}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-105)' }}>{cf.source}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-105)' }}>
                {u.monitors} monitor{u.monitors !== 1 ? 's' : ''}<br/>
                {u.goals} goal{u.goals !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-130)' }}>{cf.current}</div>
              <IChevronRight size={14} style={{ color: 'var(--gray-85)' }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { NewGoalModal, NewMonitorModal, ComputedFieldsList });
