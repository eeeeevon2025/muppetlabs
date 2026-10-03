// ─── Kustomer AI Monitoring — Revised Prototype (v3, light mode) ────────────
// Changes from v2:
//  • Light mode token swap (Kustomer light palette)
//  • No all-caps labels anywhere
//  • Operational state cards: Healthy / Warning / Degraded
//  • Dashboard: single dominant system-health bar, then goal progress, then secondary metrics
//  • Removed decorative "Goals drive everything" purple banners
//  • Monitor modal: 3-section progressive disclosure
//  • Suggestion cards: traceability first, actions only after expand
//  • AddGoal: form-first, templates as secondary "Start from template" option
//  • Sidebar label: "AI Monitoring" (matches spec)
//  • MiniChart: kept but text redundancy removed
//  • GoalDetailModal: sentence-case, status badge at top

const { useState } = React;

// ── Light token palette (Kustomer) ───────────────────────────────────────────
const D = {
  // backgrounds
  bg:        '#f4f5f7',   // page
  surface:   '#ffffff',   // card / panel
  surfaceHi: '#f9fafb',   // elevated surface / input bg
  border:    '#dce0e9',   // standard border
  borderSub: '#e8ebf0',   // subtle separator

  // text
  textPrimary:   '#1A1D23',
  textSecondary: '#5A6478',
  textMuted:     '#8A94A6',

  // accent
  purple:      '#7c3aed',
  purpleLight: '#f5f3ff',
  purpleBorder:'#ddd6fe',

  // status
  green:       '#16a34a',
  greenBg:     '#f0fdf4',
  greenBorder: '#86efac',

  amber:       '#d97706',
  amberBg:     '#fffbeb',
  amberBorder: '#fcd34d',

  red:         '#dc2626',
  redBg:       '#fef2f2',
  redBorder:   '#fecaca',

  blue:        '#2563eb',
  blueBg:      '#eff6ff',
  blueBorder:  '#bfdbfe',
};

// ── Operational state helper ──────────────────────────────────────────────────
function stateProps(passRate, sampleSize) {
  const n = parseInt(passRate);
  // Low confidence state — not enough data regardless of score
  if (sampleSize !== undefined && sampleSize < 50) {
    return { label: 'Low confidence', color: D.textMuted, bg: D.surfaceHi, border: D.border, lowConf: true };
  }
  if (n >= 85) return { label: 'Healthy',          color: D.green,      bg: D.greenBg,   border: D.greenBorder,  severity: 1 };
  if (n >= 70) return { label: 'Needs attention',  color: D.blue,       bg: D.blueBg,    border: D.blueBorder,   severity: 2 };
  if (n >= 60) return { label: 'Warning',          color: D.amber,      bg: D.amberBg,   border: D.amberBorder,  severity: 3 };
  if (n >= 45) return { label: 'Degraded',         color: D.red,        bg: D.redBg,     border: D.redBorder,    severity: 4 };
  return              { label: 'Critical',         color: '#b91c1c',    bg: '#fef2f2',   border: '#fca5a5',      severity: 5 };
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const HomeIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const SparkleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.8L12 17.4l-6 4.6 2.4-7.8L2 9.6h7.6z"/></svg>
const MonitorIcon = ({ size=18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
const InboxIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
const SearchIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PieIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>
const ActivityIcon= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const GridIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const SettingsIcon= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const BellIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const HelpIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const ChevronIcon = ({ open }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="9 18 15 12 9 6"/></svg>

// ── Mini sparkline ────────────────────────────────────────────────────────────
function MiniChart({ trend = 'up', color = D.green, width = 80, height = 28 }) {
  const pts = trend === 'up'
    ? [[0,24],[10,22],[20,20],[30,18],[40,16],[50,13],[60,10],[70,7],[80,4]]
    : trend === 'flat'
    ? [[0,14],[10,12],[20,13],[30,14],[40,13],[50,14],[60,12],[70,13],[80,14]]
    : [[0,4],[10,6],[20,9],[30,12],[40,15],[50,17],[60,20],[70,22],[80,24]]
  const d = pts.map((p,i) => `${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 80 28`}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Shared button styles ──────────────────────────────────────────────────────
// Kustomer button specs (from onboarding CSS / design system)
// Primary   .btnp : padding:9px 20px; border-radius:8px; bg:#1C6EF2; color:#fff;     font:Inter 600 14px/20px
// Secondary .btns : padding:9px 18px; border-radius:8px; bg:#fff;    border:#DCE0E9; font:Inter 600 14px/20px; color:#1A1D23
// Ghost     .btng : padding:7px 14px; border-radius:6px; color:#1C6EF2; bg:blueLight; border:blueBorder
const btnPrimary   = { padding:'9px 20px', borderRadius:8, border:'none', background:'#1C6EF2', color:'#fff', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', whiteSpace:'nowrap', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }
const btnSecondary = { padding:'9px 18px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', color:'#1A1D23', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', whiteSpace:'nowrap', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }
const btnGhost     = { padding:'7px 14px', borderRadius:6, border:'1px solid #BFDBFE', background:'#EFF6FF', color:'#1C6EF2', fontSize:13, fontWeight:600, lineHeight:'20px', cursor:'pointer', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }

// ── Section label (replaces all-caps) ────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontSize:11, fontWeight:600, color:D.textMuted, letterSpacing:'0.04em', marginBottom:10 }}>{children}</div>
)

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ label, color, bg, border }) => (
  <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:bg, border:`1px solid ${border}`, color, whiteSpace:'nowrap' }}>{label}</span>
)

// ── Modal shell ───────────────────────────────────────────────────────────────
function ModalShell({ title, subtitle, onClose, children, width=560 }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:D.surface, borderRadius:12, width, maxHeight:'90vh', overflow:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.5)', border:`1px solid ${D.border}` }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${D.border}`, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:D.textPrimary }}>{title}</div>
            {subtitle && <div style={{ fontSize:12, color:D.textMuted, marginTop:2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={btnGhost}>✕</button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  )
}

// ── Form field ────────────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:600, color:D.textSecondary, display:'block', marginBottom:hint?2:4 }}>{label}</label>
      {hint && <div style={{ fontSize:11, color:D.textMuted, marginBottom:4 }}>{hint}</div>}
      {children}
    </div>
  )
}
const inputStyle = { width:'100%', padding:'8px 10px', border:`1px solid ${D.border}`, borderRadius:6, fontSize:13, color:D.textPrimary, background:D.surfaceHi, boxSizing:'border-box', outline:'none' }
const selectStyle = { ...inputStyle, cursor:'pointer' }

// ── Collapsible section (for modal progressive disclosure) ────────────────────
function Collapsible({ title, hint, defaultOpen=false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ border:`1px solid ${D.border}`, borderRadius:8, marginBottom:10, overflow:'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', background:D.surfaceHi }}>
        <div>
          <span style={{ fontSize:13, fontWeight:600, color:D.textPrimary }}>{title}</span>
          {hint && <span style={{ fontSize:11, color:D.textMuted, marginLeft:8 }}>{hint}</span>}
        </div>
        <ChevronIcon open={open}/>
      </div>
      {open && <div style={{ padding:'14px', borderTop:`1px solid ${D.border}` }}>{children}</div>}
    </div>
  )
}

// ── MODAL: Add Goal ───────────────────────────────────────────────────────────
function AddGoalModal({ onClose }) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')

  const templates = [
    { label:'Increase CSAT', field:'AI-Generated CSAT', target:'4.5', dir:'Higher is better', desc:'Track AI conversation quality using automated CSAT scoring.' },
    { label:'Improve Customer Sentiment', field:'Customer Health Score', target:'85', dir:'Higher is better', desc:'Improve the rolling Customer Health Score across all active customers.' },
    { label:'Improve Net Retention', field:'Churn Risk Score', target:'20', dir:'Lower is better', desc:'Reduce churn risk score across your customer base.' },
    { label:'Increase Average Order Value', field:'Avg Order Value', target:'120', dir:'Higher is better', desc:'Grow AOV by identifying upsell opportunities during AI-assisted conversations.' },
    { label:'Reduce Handle Time', field:'Avg Handle Time', target:'3', dir:'Lower is better', desc:'Decrease average handle time by improving AI resolution quality.' },
  ]

  function applyTemplate(t) {
    setName(t.label)
    setDescription(t.desc)
    setTarget(t.target)
    setShowTemplates(false)
  }

  return (
    <ModalShell title="New goal" subtitle="Define a measurable target tied to a computed field." onClose={onClose} width={500}>
      {showTemplates ? (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:12, fontWeight:600, color:D.textSecondary }}>Start from a template</span>
            <button onClick={() => setShowTemplates(false)} style={{ ...btnGhost, fontSize:12 }}>← Back to form</button>
          </div>
          {templates.map(t => (
            <div key={t.label} onClick={() => applyTemplate(t)} style={{ padding:'10px 12px', border:`1px solid ${D.border}`, borderRadius:8, marginBottom:6, cursor:'pointer', background:D.surfaceHi }}>
              <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary, marginBottom:2 }}>{t.label}</div>
              <div style={{ fontSize:11, color:D.textMuted }}>{t.dir} · {t.field} · target {t.target}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ marginBottom:16, display:'flex', justifyContent:'flex-end' }}>
            <button onClick={() => setShowTemplates(true)} style={{ fontSize:12, color:D.purple, background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>Start from a template →</button>
          </div>
          <Field label="Goal name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Increase CSAT" style={inputStyle}/></Field>
          <Field label="Description"><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder="What are you trying to achieve?" style={{ ...inputStyle, resize:'vertical' }}/></Field>
          <Field label="Computed field" hint="The metric this goal tracks.">
            <select style={selectStyle}><option>AI-Generated CSAT</option><option>Customer Health Score</option><option>Churn Risk Score</option><option>Avg Order Value</option></select>
          </Field>
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:12, fontWeight:600, color:D.textSecondary, display:'block', marginBottom:4 }}>Target value</label>
              <input value={target} onChange={e=>setTarget(e.target.value)} style={inputStyle}/>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:12, fontWeight:600, color:D.textSecondary, display:'block', marginBottom:4 }}>Direction</label>
              <select style={selectStyle}><option>Higher is better</option><option>Lower is better</option></select>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <button onClick={onClose} style={btnSecondary}>Cancel</button>
            <button onClick={onClose} style={btnPrimary}>Add goal</button>
          </div>
        </>
      )}
    </ModalShell>
  )
}

// ── MODAL: Create Monitor — 4-step flow ───────────────────────────────────────
function EditMonitorModal({ onClose }) {
  const STEPS = [
    { id:'basics',    label:'Basics',    desc:'Name and scope' },
    { id:'criteria',  label:'Criteria',  desc:'What to evaluate' },
    { id:'threshold', label:'Threshold', desc:'Pass / fail rule' },
    { id:'output',    label:'Output',    desc:'Goals and suggestions' },
  ]
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [kind, setKind] = useState('AIC')
  const [threshold, setThreshold] = useState('70')
  const [sugOn, setSugOn] = useState(true)
  const [linkedGoal, setLinkedGoal] = useState('None')
  const [criteria, setCriteria] = useState([
    { id:1, name:'', weight:25, essential:false },
  ])
  const [ctx, setCtx] = useState({ messages:true, traces:true, kb:false, customer:false })
  const ctxOpts = [
    ['messages', 'Conversation messages',        'The full conversation transcript'],
    ['traces',   'Automation execution traces',  'Which tools and steps the AI ran'],
    ['kb',       'Relevant KB articles',         'Knowledge base content the AI used'],
    ['customer', 'Customer data',                'Customer profile and history'],
  ]

  const canAdvance = () => {
    if (step === 0) return name.trim().length > 0
    if (step === 1) return criteria.every(c => c.name.trim().length > 0)
    return true
  }

  const totalWeight = criteria.reduce((s, c) => s + (parseInt(c.weight) || 0), 0)

  function addCriterion() {
    setCriteria(cs => [...cs, { id:Date.now(), name:'', weight:Math.max(5, Math.floor((100 - totalWeight) / 2)), essential:false }])
  }
  function removeCriterion(id) {
    setCriteria(cs => cs.filter(c => c.id !== id))
  }
  function updateCriterion(id, field, value) {
    setCriteria(cs => cs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const stepTitles = ['Name your monitor', 'Define scoring criteria', 'Set pass threshold', 'Connect to goals']
  const stepSubtitles = [
    'Give it a clear name and choose which conversations it evaluates.',
    'Add the criteria you want the AI to evaluate. Each criterion needs a name and a weight.',
    'Set the minimum score a conversation needs to pass this monitor.',
    'Link this monitor to a goal and choose whether failures generate suggestions.',
  ]

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:D.surface, borderRadius:12, width:560, maxHeight:'90vh', overflow:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', border:`1px solid ${D.border}`, display:'flex', flexDirection:'column' }}>

        {/* ── Step progress header ── */}
        <div style={{ padding:'20px 24px 0' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:D.textPrimary }}>{stepTitles[step]}</div>
            <button onClick={onClose} style={btnGhost}>✕</button>
          </div>
          {/* Step indicator */}
          <div style={{ display:'flex', gap:0, marginBottom:20 }}>
            {STEPS.map((s, i) => {
              const done    = i < step
              const active  = i === step
              const pending = i > step
              return (
                <div key={s.id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
                  {/* Connector line */}
                  {i > 0 && (
                    <div style={{ position:'absolute', left:0, top:13, width:'50%', height:2, background: done ? D.purple : D.border }}/>
                  )}
                  {i < STEPS.length - 1 && (
                    <div style={{ position:'absolute', right:0, top:13, width:'50%', height:2, background: done ? D.purple : D.border }}/>
                  )}
                  {/* Step dot */}
                  <div style={{
                    width:26, height:26, borderRadius:'50%', zIndex:1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700,
                    background: done ? D.purple : active ? D.purple : D.surfaceHi,
                    color: done || active ? '#fff' : D.textMuted,
                    border: `2px solid ${done || active ? D.purple : D.border}`,
                    marginBottom:6,
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize:10, fontWeight: active ? 600 : 400, color: active ? D.purple : done ? D.textSecondary : D.textMuted, textAlign:'center' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
          <div style={{ fontSize:12, color:D.textMuted, marginBottom:4 }}>{stepSubtitles[step]}</div>
          <div style={{ height:1, background:D.border, margin:'12px 0' }}/>
        </div>

        {/* ── Step content ── */}
        <div style={{ padding:'0 24px', flex:1, overflowY:'auto' }}>

          {/* Step 1: Basics */}
          {step === 0 && (
            <div>
              <Field label="Monitor name" hint="Be specific — this will appear on cards and alerts.">
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Return request quality monitor" style={inputStyle} autoFocus/>
              </Field>
              <Field label="Description" hint="What does this monitor evaluate? One or two sentences.">
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} placeholder="Evaluates whether the AI correctly handles return requests and follows the returns procedure." style={{ ...inputStyle, resize:'vertical' }}/>
              </Field>
              <Field label="Which conversations to evaluate">
                <div style={{ display:'flex', gap:6 }}>
                  {[
                    { id:'AIC', label:'AI-handled',        sub:'Conversations resolved by AI' },
                    { id:'AIR', label:'Human-assisted',    sub:'Conversations where AI helped a rep' },
                    { id:'All', label:'All conversations', sub:'Both AI and human-assisted' },
                  ].map(k => (
                    <button key={k.id} onClick={() => setKind(k.id)} style={{ flex:1, padding:'8px 10px', borderRadius:8, fontSize:12, cursor:'pointer', textAlign:'left', background:kind===k.id ? D.purpleLight : D.surfaceHi, color:kind===k.id ? D.purple : D.textSecondary, border:`1px solid ${kind===k.id ? D.purpleBorder : D.border}`, fontWeight:kind===k.id?600:400 }}>
                      <div style={{ fontWeight:600, marginBottom:2 }}>{k.label}</div>
                      <div style={{ fontSize:10, color:kind===k.id ? D.purple : D.textMuted, fontWeight:400 }}>{k.sub}</div>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Context the AI judge will see" hint="What data is available when scoring each conversation.">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  {ctxOpts.map(([key, label, sub]) => (
                    <label key={key} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 10px', borderRadius:6, border:`1px solid ${ctx[key] ? D.purpleBorder : D.border}`, background:ctx[key] ? D.purpleLight : D.surfaceHi, cursor:'pointer' }}>
                      <input type="checkbox" checked={ctx[key]} onChange={e => setCtx(p=>({...p,[key]:e.target.checked}))} style={{ accentColor:D.purple, marginTop:1, flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:12, fontWeight:500, color:ctx[key] ? D.purple : D.textPrimary }}>{label}</div>
                        <div style={{ fontSize:10, color:D.textMuted, marginTop:1 }}>{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* Step 2: Criteria */}
          {step === 1 && (
            <div>
              <div style={{ fontSize:12, color:D.textMuted, marginBottom:14, lineHeight:1.6 }}>
                Each criterion is a question the AI will ask about every conversation. Weights determine how much each criterion counts toward the overall score. <strong>Weights must add up to 100%.</strong>
              </div>
              {criteria.map((c, i) => (
                <div key={c.id} style={{ padding:'12px', border:`1px solid ${D.border}`, borderRadius:8, marginBottom:8, background:D.surfaceHi }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:D.textMuted }}>Criterion {i + 1}</span>
                    {criteria.length > 1 && (
                      <button onClick={() => removeCriterion(c.id)} style={{ ...btnGhost, fontSize:12, color:D.textMuted }}>✕ Remove</button>
                    )}
                  </div>
                  <Field label="What to evaluate">
                    <input
                      value={c.name}
                      onChange={e => updateCriterion(c.id, 'name', e.target.value)}
                      placeholder="e.g. Did the AI follow the returns procedure?"
                      style={inputStyle}
                    />
                  </Field>
                  <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
                    <div style={{ flex:1 }}>
                      <label style={{ fontSize:12, fontWeight:600, color:D.textSecondary, display:'block', marginBottom:4 }}>Weight (%)</label>
                      <input
                        type="number" min="1" max="100"
                        value={c.weight}
                        onChange={e => updateCriterion(c.id, 'weight', parseInt(e.target.value) || 0)}
                        style={{ ...inputStyle, width:80 }}
                      />
                    </div>
                    <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:D.textSecondary, paddingBottom:10, cursor:'pointer' }}>
                      <input type="checkbox" checked={c.essential} onChange={e => updateCriterion(c.id, 'essential', e.target.checked)} style={{ accentColor:D.purple }}/>
                      Essential — failing this criterion fails the whole conversation
                    </label>
                  </div>
                </div>
              ))}
              {/* Weight total indicator */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', borderRadius:6, background: totalWeight === 100 ? D.greenBg : D.amberBg, border:`1px solid ${totalWeight === 100 ? D.greenBorder : D.amberBorder}`, marginBottom:10 }}>
                <span style={{ fontSize:12, color: totalWeight === 100 ? D.green : D.amber }}>
                  {totalWeight === 100 ? '✓ Weights add up to 100%' : `Weights total: ${totalWeight}% — must equal 100%`}
                </span>
                <span style={{ fontSize:12, fontWeight:700, color: totalWeight === 100 ? D.green : D.amber }}>{totalWeight} / 100</span>
              </div>
              {criteria.length < 6 && (
                <button onClick={addCriterion} style={{ fontSize:14, fontWeight:600, color:'#1C6EF2', background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:8, cursor:'pointer', padding:'9px 20px', width:'100%', marginBottom:4, lineHeight:'20px', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>+ Add another criterion</button>
              )}
            </div>
          )}

          {/* Step 3: Threshold */}
          {step === 2 && (
            <div>
              <Field label="Pass threshold" hint="A conversation passes this monitor if its weighted score meets or exceeds this value.">
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <input
                    type="number" min="1" max="100"
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    style={{ ...inputStyle, width:90, fontSize:22, fontWeight:700, textAlign:'center' }}
                  />
                  <span style={{ fontSize:20, color:D.textMuted }}>%</span>
                </div>
              </Field>
              {/* Visual threshold guide */}
              <div style={{ padding:'12px 14px', borderRadius:8, background:D.surfaceHi, border:`1px solid ${D.border}`, marginBottom:14 }}>
                <div style={{ fontSize:11, color:D.textMuted, marginBottom:10 }}>How {threshold}% threshold reads:</div>
                <div style={{ height:8, background:D.border, borderRadius:99, overflow:'hidden', marginBottom:6, position:'relative' }}>
                  <div style={{ height:'100%', width:`${threshold}%`, background:D.green, borderRadius:99 }}/>
                  <div style={{ position:'absolute', top:0, left:`${threshold}%`, width:2, height:'100%', background:D.textPrimary }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10 }}>
                  <span style={{ color:D.red }}>0% — always fails</span>
                  <span style={{ color:D.green, fontWeight:600 }}>≥{threshold}% passes</span>
                  <span style={{ color:D.textMuted }}>100%</span>
                </div>
              </div>
              <div style={{ padding:'10px 14px', background:D.blueBg, border:`1px solid ${D.blueBorder}`, borderRadius:8, fontSize:12, color:D.textSecondary, lineHeight:1.6 }}>
                <strong>Recommended starting point:</strong> 70%. You can adjust this after seeing how your conversations score in the first week.
              </div>
            </div>
          )}

          {/* Step 4: Output */}
          {step === 3 && (
            <div>
              <Field label="Link to a goal" hint="This monitor's results will contribute to goal progress tracking.">
                <select value={linkedGoal} onChange={e => setLinkedGoal(e.target.value)} style={selectStyle}>
                  <option>None</option>
                  <option>Increase AI-Generated CSAT</option>
                  <option>Improve Customer Sentiment</option>
                  <option>Increase Average Order Value</option>
                  <option>Increase AI Cost Savings</option>
                </select>
              </Field>
              <div style={{ padding:'12px 14px', background:D.surfaceHi, border:`1px solid ${D.border}`, borderRadius:8, marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary, marginBottom:2 }}>Generate suggestions on failure</div>
                    <div style={{ fontSize:11, color:D.textMuted, lineHeight:1.5 }}>When a conversation fails this monitor, the AI will propose a concrete fix to the linked procedure or KB article.</div>
                  </div>
                  <div onClick={() => setSugOn(!sugOn)} style={{ width:40, height:22, borderRadius:11, cursor:'pointer', position:'relative', flexShrink:0, marginLeft:16, background:sugOn?D.purple:D.border, transition:'background 0.2s' }}>
                    <div style={{ position:'absolute', top:2, left:sugOn?20:2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.18)' }}/>
                  </div>
                </div>
              </div>
              {/* Review summary before creating */}
              <div style={{ padding:'12px 14px', background:D.purpleLight, border:`1px solid ${D.purpleBorder}`, borderRadius:8 }}>
                <div style={{ fontSize:11, fontWeight:600, color:D.purple, marginBottom:8 }}>Review before creating</div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {[
                    ['Monitor name', name || '—'],
                    ['Scope',        kind === 'AIC' ? 'AI-handled conversations' : kind === 'AIR' ? 'Human-assisted conversations' : 'All conversations'],
                    ['Criteria',     `${criteria.length} criteria · total weight ${totalWeight}%`],
                    ['Pass threshold', `${threshold}%`],
                    ['Linked goal',  linkedGoal],
                    ['Suggestions',  sugOn ? 'On — AI will propose fixes on failure' : 'Off'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display:'flex', gap:8 }}>
                      <span style={{ fontSize:11, color:D.textMuted, width:110, flexShrink:0 }}>{label}</span>
                      <span style={{ fontSize:11, color:D.textPrimary, fontWeight:500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer: back / next / create ── */}
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${D.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button
            onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
            style={btnSecondary}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, color:D.textMuted }}>Step {step + 1} of {STEPS.length}</span>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canAdvance()}
                style={{ ...btnPrimary, opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'not-allowed' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onClose}
                disabled={totalWeight !== 100}
                style={{ ...btnPrimary, display:'inline-flex', alignItems:'center', gap:6, opacity: totalWeight !== 100 ? 0.4 : 1, cursor: totalWeight !== 100 ? 'not-allowed' : 'pointer' }}
              >
                <AiSparkIcon/>
                Create monitor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MODAL: Goal Detail ────────────────────────────────────────────────────────
function GoalDetailModal({ onClose, onViewSuggestions }) {
  const criteriaRows = [
    { label:'Upsell opportunity identified', pct:45 },
    { label:'Recommendation relevance to order history', pct:38 },
    { label:'Coupon-first behaviour avoided', pct:58 },
    { label:'Conversion attempt made', pct:42 },
  ]
  const blocking = [
    { label:'Coupon applied before upsell attempted', pct:34, color:D.red },
    { label:'Product recommendation skipped during order lookup', pct:28, color:D.red },
    { label:'No cross-sell triggered after cart retrieval', pct:22, color:D.amber },
  ]

  return (
    <ModalShell title="Increase Average Order Value" subtitle="Custom goal · In progress" onClose={onClose} width={620}>
      {/* Status + KPI */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <StatusBadge label="In progress" color={D.amber} bg={D.amberBg} border={D.amberBorder}/>
        <span style={{ fontSize:11, color:D.textMuted }}>73% to target · On track by ~Aug 2026</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:24, padding:'14px 16px', background:D.surfaceHi, borderRadius:8, marginBottom:16, border:`1px solid ${D.border}` }}>
        {[['Current','$87'],['Target','$120'],['Progress','73%']].map(([l,v]) => (
          <div key={l}><div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>{l}</div><div style={{ fontSize:26, fontWeight:700, color:D.textPrimary }}>{v}</div></div>
        ))}
        <div style={{ marginLeft:'auto' }}>
          <div style={{ fontSize:10, color:D.textMuted, marginBottom:4 }}>Last 7 weeks</div>
          <MiniChart trend="up" color={D.green} width={100} height={32}/>
        </div>
      </div>

      {/* Evaluation impact */}
      <SectionLabel>Evaluation impact on average order value</SectionLabel>
      {[{ name:'AOV & Upsell Performance Monitor', rate:'42% pass rate', pass:'$115', fail:'$72', impact:'+$43' },
        { name:'Knowledge Base Adherence Monitor', rate:'85% pass rate', pass:'$89', fail:'$83', impact:'+$6' }].map(e => (
        <div key={e.name} style={{ marginBottom:10, border:`1px solid ${D.border}`, borderRadius:8, padding:'10px 12px', background:D.surfaceHi }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:500, color:D.textPrimary }}>{e.name}</span>
            <span style={{ fontSize:10, background:D.amberBg, color:D.amber, border:`1px solid ${D.amberBorder}`, padding:'1px 6px', borderRadius:10, fontWeight:500 }}>{e.rate}</span>
          </div>
          <div style={{ display:'flex', gap:20 }}>
            {[['When passed',e.pass],['When failed',e.fail],['Potential impact',e.impact]].map(([l,v],i) => (
              <div key={l}><div style={{ fontSize:10, color:D.textMuted }}>{l}</div><div style={{ fontSize:15, fontWeight:700, color:i===2?D.green:D.textPrimary }}>{v}</div></div>
            ))}
          </div>
        </div>
      ))}

      {/* Criterion pass rates */}
      <SectionLabel style={{ marginTop:16 }}>Criterion pass rates — AOV & Upsell Performance</SectionLabel>
      {criteriaRows.map(r => (
        <div key={r.label} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <span style={{ fontSize:11, color:D.textSecondary, flex:1 }}>{r.label}</span>
          <div style={{ width:120, height:5, background:D.border, borderRadius:3, overflow:'hidden' }}>
            <div style={{ width:`${r.pct}%`, height:'100%', background:r.pct<50?D.red:D.amber, borderRadius:3 }}/>
          </div>
          <span style={{ fontSize:11, color:D.textMuted, width:30, textAlign:'right' }}>{r.pct}%</span>
        </div>
      ))}

      {/* Blocking */}
      <div style={{ marginTop:16 }}>
        <SectionLabel>What is blocking progress</SectionLabel>
        {blocking.map(b => (
          <div key={b.label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <span style={{ color:b.color, fontSize:10 }}>●</span>
            <span style={{ fontSize:12, color:D.textSecondary, flex:1 }}>{b.label}</span>
            <span style={{ fontSize:12, color:D.textMuted, fontWeight:500 }}>{b.pct}%</span>
          </div>
        ))}
        <div style={{ fontSize:11, color:D.textMuted, marginTop:8 }}>3 AI-generated suggestions are available to improve this goal.</div>
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:20 }}>
        <button onClick={onClose} style={btnSecondary}>Close</button>
        <button onClick={onViewSuggestions} style={btnPrimary}>View suggestions</button>
      </div>
    </ModalShell>
  )
}


// ── Pipeline flow component ───────────────────────────────────────────────────
// Shows the data flow: Conversation → Evaluation → Computed Fields → Goals → Actions
// Used in: Dashboard (as collapsible), onboarding, empty states
function PipelineFlow({ compact=false, setActiveTab=()=>{} }) {
  const ICON_GRAY = '#7C8596'
  const ChatIcon14   = () => <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M4.66667 6.41668H4.6725M7 6.41668H7.00583M9.33333 6.41668H9.33917M12.25 11.6667L10.3108 10.6971C10.1638 10.6236 10.0903 10.5868 10.0133 10.5609C9.94488 10.5379 9.87449 10.5213 9.80301 10.5113C9.72252 10.5 9.64035 10.5 9.47601 10.5H3.61667C2.96327 10.5 2.63657 10.5 2.38701 10.3729C2.16749 10.261 1.98901 10.0825 1.87716 9.863C1.75 9.61344 1.75 9.28674 1.75 8.63334V4.20001C1.75 3.54662 1.75 3.21992 1.87716 2.97035C1.98901 2.75083 2.16749 2.57235 2.38701 2.4605C2.63657 2.33334 2.96327 2.33334 3.61667 2.33334H10.3833C11.0367 2.33334 11.3634 2.33334 11.613 2.4605C11.8325 2.57235 12.011 2.75083 12.1228 2.97035C12.25 3.21992 12.25 3.54662 12.25 4.20001V11.6667Z" stroke={ICON_GRAY} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
  const SearchIcon14 = () => <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M9.21406 9.22312L12.25 12.25M10.5 6.125C10.5 8.54125 8.54125 10.5 6.125 10.5C3.70875 10.5 1.75 8.54125 1.75 6.125C1.75 3.70875 3.70875 1.75 6.125 1.75C8.54125 1.75 10.5 3.70875 10.5 6.125Z" stroke={ICON_GRAY} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
  const GoalsIcon14  = () => <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M12.25 7C12.25 9.89949 9.89949 12.25 7 12.25C4.1005 12.25 1.75 9.89949 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75M9.91667 7C9.91667 8.61083 8.61083 9.91667 7 9.91667C5.38917 9.91667 4.08333 8.61083 4.08333 7C4.08333 5.38917 5.38917 4.08333 7 4.08333M8.60876 5.45511L10.9182 5.69766L12.17 3.94504L10.6678 3.44429L10.167 1.94204L8.41442 3.19392L8.60876 5.45511ZM8.60876 5.45511L7.00001 6.99995" stroke={ICON_GRAY} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
  const SuggestionsIcon14 = () => <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M5.83333 9.67397V11.0831C5.83333 11.7274 6.35567 12.2498 7 12.2498C7.64433 12.2498 8.16667 11.7274 8.16667 11.0831L8.16667 9.67397M7 1.75V2.33333M10.7125 3.28752L10.3 3.7M3.28752 3.28752L3.7 3.7M2.33333 7H1.75M12.25 7H11.6667M9.91667 7C9.91667 8.61083 8.61083 9.91667 7 9.91667C5.38917 9.91667 4.08333 8.61083 4.08333 7C4.08333 5.38917 5.38917 4.08333 7 4.08333C8.61083 4.08333 9.91667 5.38917 9.91667 7Z" stroke={ICON_GRAY} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>

  const steps = [
    { icon:<ChatIcon14/>,   label:'Conversation ends',        sub:'AI-handled or human-assisted' },
    { icon:<SearchIcon14/>, label:'Monitor evaluates',        subBefore:'Based on ', subLinkLabel:'set criteria', subLink:() => setActiveTab('monitors') },
    { icon:<GoalsIcon14/>,  label:'Goals measure progress',   subBefore:'Toward your ', subLinkLabel:'business targets', subLink:() => setActiveTab('goals') },
    { icon:<SuggestionsIcon14/>, label:'Alerts & suggestions',     subBefore:'When quality drops or ', subLinkLabel:'patterns emerge', subLink:() => setActiveTab('suggestions') },
  ]
  if (compact) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:0, flexWrap:'nowrap', overflow:'hidden' }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', minWidth:0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:0 }}>
              <span style={{ fontSize:13 }}>{s.icon}</span>
              <span style={{ fontSize:10, color:D.textMuted, whiteSpace:'nowrap', marginTop:2 }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ fontSize:11, color:D.border, margin:'0 6px', flexShrink:0, marginBottom:12 }}>→</span>
            )}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div style={{ display:'flex', alignItems:'stretch', gap:0 }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display:'flex', alignItems:'stretch', flex:1 }}>
          <div style={{ flex:1, padding:'10px 12px', background:D.surface, border:`1px solid ${D.border}`, borderRadius:8, textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'flex-start' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:12, fontWeight:600, color:D.textPrimary, marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:11, color:D.textMuted, lineHeight:1.4 }}>
              {s.subLink
                ? <>{s.subBefore}<button onClick={s.subLink} style={{ background:'none', border:'none', padding:0, cursor:'pointer', color:'#1C6EF2', fontWeight:500, fontSize:11, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:2 }}>{s.subLinkLabel}</button></>
                : s.sub
              }
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px', flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M9 5l3 3-3 3" stroke={D.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
// ── TAB: Dashboard ────────────────────────────────────────────────────────────
function DashboardTab({ setActiveTab }) {
  const [showDetail, setShowDetail] = useState(false)

  // System health derived from monitor states
  const systemStatus = { label:'1 monitor degraded', color:D.amber, bg:D.amberBg, border:D.amberBorder }

  const anomalies = [
    { label:'Procedure adherence', count:11, color:D.red, pct:100 },
    { label:'Knowledge accuracy', count:7, color:D.amber, pct:64 },
    { label:'Guardrail violation', count:3, color:D.green, pct:27 },
    { label:'Tool misuse', count:2, color:D.blue, pct:18 },
  ]
  const flagged = [
    { id:'#conv-8821', monitor:'AIC AI-CSAT Monitor', score:'41%', time:'14 min ago', scoreColor:D.red },
    { id:'#conv-8819', monitor:'Procedure Adherence Monitor', score:'58%', time:'31 min ago', scoreColor:D.amber },
    { id:'#conv-8814', monitor:'AOV & Upsell Performance', score:'33%', time:'1 hr ago', scoreColor:D.red },
  ]

  const [showPipeline, setShowPipeline] = useState(true)

  return (
    <div>
      {/* ── How it works — collapsible, no outer box ── */}
      <div style={{ marginBottom:16 }}>
        <div onClick={() => setShowPipeline(v => !v)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', marginBottom: showPipeline ? 10 : 0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:D.textPrimary }}>How this works</div>
          <span style={{ fontSize:11, color:'#1C6EF2' }}>{showPipeline ? 'Hide' : 'Show'}</span>
        </div>
        {showPipeline && <PipelineFlow setActiveTab={setActiveTab}/>}
      </div>

      {/* ── Banner: single-line status strip (Kustomer banner spec: 1 message, 1 action) ── */}
      <div style={{ padding:'9px 14px', background:D.amberBg, border:`1px solid ${D.amberBorder}`, borderRadius:8, marginBottom:10, display:'flex', alignItems:'center', gap:10 }}>
        <StatusBadge label={systemStatus.label} color={systemStatus.color} bg:"transparent" border="none"/>
        <span style={{ fontSize:12, color:D.textSecondary, flex:1 }}>Procedure Adherence Monitor dropped below 65% threshold — 2 hours ago</span>
        <button onClick={() => setActiveTab('monitors')} style={{ fontSize:12, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', fontWeight:500, flexShrink:0 }}>View monitor →</button>
        <span style={{ fontSize:11, color:D.textMuted, flexShrink:0 }}>4 min ago</span>
      </div>

      {/* ── Alert card: diagnostic detail (scales to multiple degraded monitors) ── */}
      <div style={{ border:`1px solid ${D.amberBorder}`, borderRadius:8, background:D.surface, marginBottom:20, overflow:'hidden' }}>
        <div style={{ padding:'10px 14px', borderBottom:`1px solid ${D.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:D.amber, flexShrink:0 }}/>
            <span style={{ fontSize:12, fontWeight:600, color:D.textPrimary }}>Procedure Adherence Monitor</span>
            <span style={{ fontSize:10, color:D.textMuted }}>Degraded · 65% pass rate · threshold 70%</span>
          </div>
          <button onClick={() => setActiveTab('monitors')} style={{ fontSize:11, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', fontWeight:500, flexShrink:0 }}>Open monitor →</button>
        </div>
        <div style={{ padding:'10px 14px', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background:D.redBg, border:`1px solid ${D.redBorder}`, color:D.red, fontWeight:600 }}>↓ 12% this week</span>
          <span style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background:D.surfaceHi, border:`1px solid ${D.border}`, color:D.textSecondary }}>Most failures: escalation handling</span>
          <span style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background:D.surfaceHi, border:`1px solid ${D.border}`, color:D.textSecondary }}>Shipping conversations — 48% of failures</span>
          <span style={{ fontSize:11, color:D.textMuted, marginLeft:'auto' }}>Last evaluated 4 min ago</span>
        </div>
      </div>

      {/* ── Goal progress (primary content) ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:700, color:D.textPrimary }}>Goal progress</div>
          <button onClick={() => setActiveTab('goals')} style={{ fontSize:12, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer' }}>Manage goals →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {/* Improving */}
          <div style={{ border:`1px solid ${D.border}`, borderRadius:10, padding:16, background:D.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary }}>Increase Average Order Value</div>
              <StatusBadge label="Improving" color={D.green} bg={D.greenBg} border={D.greenBorder}/>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:16 }}>
                <div><div style={{ fontSize:10, color:D.textMuted }}>Current</div><div style={{ fontSize:20, fontWeight:700, color:D.textPrimary }}>$87</div></div>
                <div><div style={{ fontSize:10, color:D.textMuted }}>Target</div><div style={{ fontSize:20, fontWeight:700, color:D.textPrimary }}>$120</div></div>
              </div>
              <MiniChart trend="up" color={D.green}/>
            </div>
            <div style={{ marginTop:8, fontSize:11, color:D.textMuted }}>73% to target · +$2 last week · On track by Aug 2026</div>
            <button onClick={() => setShowDetail(true)} style={{ marginTop:10, fontSize:11, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:0 }}>View details →</button>
          </div>

          {/* Stalled */}
          <div style={{ border:`1px solid ${D.border}`, borderRadius:10, padding:16, background:D.surface }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary }}>Increase AI Cost Savings</div>
              <StatusBadge label="Stalled" color={D.red} bg={D.redBg} border={D.redBorder}/>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:16 }}>
                <div><div style={{ fontSize:10, color:D.textMuted }}>Current</div><div style={{ fontSize:20, fontWeight:700, color:D.textPrimary }}>$4.20</div></div>
                <div><div style={{ fontSize:10, color:D.textMuted }}>Target</div><div style={{ fontSize:20, fontWeight:700, color:D.textPrimary }}>$2.50</div></div>
              </div>
              <MiniChart trend="flat" color={D.textMuted}/>
            </div>
            <div style={{ marginTop:8, fontSize:11, color:D.textMuted }}>60% to target · Flat 2 weeks · Adding procedures would resume trajectory</div>
            <button style={{ marginTop:10, fontSize:11, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:0 }}>View details →</button>
          </div>
        </div>
      </div>

      {/* ── Secondary metrics row — 2 cols, Anomalies detected moved into its card ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {[['AI resolution rate','40%','Conversations fully resolved by AI'],['Monitor pass rate','72%','Across all active monitors']].map(([l,v,s]) => (
          <div key={l} style={{ border:`1px solid ${D.border}`, borderRadius:8, padding:'12px 14px', background:D.surface }}>
            <div style={{ fontSize:11, color:D.textMuted, marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:700, color:D.textPrimary, marginBottom:2 }}>{v}</div>
            <div style={{ fontSize:11, color:D.textMuted }}>{s}</div>
          </div>
        ))}
      </div>

      {/* ── Anomalies + Flagged (tertiary) ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ border:`1px solid ${D.border}`, borderRadius:10, padding:18, background:D.surface }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary }}>Anomalies by type</div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:24, fontWeight:700, color:D.textPrimary, lineHeight:1 }}>23</div>
              <div style={{ fontSize:10, color:D.textMuted, marginTop:2 }}>Last 30 days</div>
            </div>
          </div>
          {anomalies.map(a => (
            <div key={a.label} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <span style={{ fontSize:11, color:D.textSecondary, width:158 }}>{a.label}</span>
              <div style={{ flex:1, height:5, background:D.border, borderRadius:4, overflow:'hidden' }}>
                <div style={{ width:`${a.pct}%`, height:'100%', background:a.color, borderRadius:4 }}/>
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:D.textSecondary, width:20, textAlign:'right' }}>{a.count}</span>
            </div>
          ))}

        </div>
        <div style={{ border:`1px solid ${D.border}`, borderRadius:10, padding:18, background:D.surface }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary }}>Flagged conversations</div>
            <span style={{ fontSize:10, background:D.redBg, color:D.red, border:`1px solid ${D.redBorder}`, padding:'2px 8px', borderRadius:10, fontWeight:600 }}>3 need review</span>
          </div>
          {flagged.map(c => (
            <div key={c.id} style={{ padding:'8px 0', borderBottom:`1px solid ${D.border}` }}>
              {/* Row 1: conversation ID + quality score */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
                <span style={{ fontSize:12, fontWeight:600, color:D.purple, fontFamily:'monospace' }}>{c.id}</span>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:10, color:D.textMuted }}>Quality score</span>
                  <span style={{ fontSize:12, fontWeight:700, color:c.scoreColor }}>{c.score}</span>
                </div>
              </div>
              {/* Row 2: monitor name + time */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:D.textSecondary }}>{c.monitor}</span>
                <span style={{ fontSize:10, color:D.textMuted }}>{c.time}</span>
              </div>
            </div>
          ))}
          <button style={{ marginTop:10, fontSize:11, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:0 }}>View all flagged →</button>
        </div>
      </div>

      {showDetail && <GoalDetailModal onClose={() => setShowDetail(false)} onViewSuggestions={() => { setShowDetail(false); setActiveTab('suggestions') }}/>}
    </div>
  )
}

// ── AI spark icon (reusable) ──────────────────────────────────────────────────
const AiSparkIcon = ({ color='rgba(255,255,255,0.9)', size=13 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2.917 1.75v2.333M4.083 2.917H1.75M2.917 9.917v2.333M4.083 11.083H1.75M8.167 2.917l.857 2.174c.11.278.165.417.249.534.074.104.165.195.269.269.117.084.256.139.534.249L12.25 7l-2.174.857c-.278.11-.417.165-.534.249a1.167 1.167 0 0 0-.269.269c-.084.117-.139.256-.249.534L8.167 11.083l-.858-2.174c-.109-.278-.164-.417-.248-.534a1.167 1.167 0 0 0-.269-.269c-.117-.084-.256-.139-.534-.249L4.083 7l2.175-.857c.278-.11.417-.165.534-.249.104-.074.195-.165.269-.269.084-.117.139-.256.248-.534l.858-2.174Z"
      stroke={color} strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── TAB: Suggestions ──────────────────────────────────────────────────────────

// ── Procedure edit panel (slide-in from right) ───────────────────────────────
function ProcedurePanel({ suggestion, onClose }) {
  const steps = [
    'Read the customer request and use the vip_id to determine whether they qualify for a VIP coupon.',
    'Verify eligibility using any available customer or order data before making changes.',
    'Get related products from order history and recommend the top match.',
    'If the customer is interested, complete the product recommendation flow.',
    'If not interested or not eligible for recommendation, apply the appropriate coupon and confirm the action in your response.',
    'If not eligible for either, explain the decision clearly and provide the best available alternative.',
    'Ask whether the customer needs anything else once the main request is resolved.',
    'If the customer indicates they are finished, end the conversation with a polite goodbye.',
  ]
  const [name, setName] = useState('VIP Coupon Procedure')
  const [whenToUse, setWhenToUse] = useState('Use this procedure when a customer is a VIP and should receive a coupon or product recommendation before a discount is applied.')
  const [editedSteps, setEditedSteps] = useState(steps)
  const [saved, setSaved] = useState(false)

  // Animate in
  const [visible, setVisible] = useState(false)
  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  function handleSave() {
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1200)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', zIndex:200, transition:'opacity 0.2s', opacity: visible ? 1 : 0 }}
      />
      {/* Panel */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:560,
        background:'#fff', boxShadow:'-4px 0 32px rgba(0,0,0,0.12)',
        zIndex:201, display:'flex', flexDirection:'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      }}>

        {/* Header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #DCE0E9', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:11, color:'#8A94A6', marginBottom:2 }}>
              <span style={{ color:'#2563EB', fontWeight:500 }}>{suggestion.automation?.name || 'VIP Customer Support'}</span>
              <span style={{ margin:'0 4px' }}>›</span>
              <span>Procedures</span>
            </div>
            <h2 style={{ fontSize:18, fontWeight:700, lineHeight:'22px', color:'#1A1D23', margin:0 }}>Edit procedure</h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #DCE0E9', borderRadius:8, cursor:'pointer', padding:'9px 18px', fontSize:14, color:'#1A1D23', fontWeight:600, lineHeight:'20px', display:'flex', alignItems:'center', gap:4, fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
            ✕ Close
          </button>
        </div>

        {/* AI suggestion banner */}
        <div style={{ padding:'10px 20px', background:'#F5F3FF', borderBottom:'1px solid #DDD6FE', display:'flex', alignItems:'flex-start', gap:8, flexShrink:0 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ marginTop:1, flexShrink:0 }}>
            <path d="M2.917 1.75v2.333M4.083 2.917H1.75M2.917 9.917v2.333M4.083 11.083H1.75M8.167 2.917l.857 2.174c.11.278.165.417.249.534.074.104.165.195.269.269.117.084.256.139.534.249L12.25 7l-2.174.857c-.278.11-.417.165-.534.249a1.167 1.167 0 0 0-.269.269c-.084.117-.139.256-.249.534L8.167 11.083l-.858-2.174c-.109-.278-.164-.417-.248-.534a1.167 1.167 0 0 0-.269-.269c-.117-.084-.256-.139-.534-.249L4.083 7l2.175-.857c.278-.11.417-.165.534-.249.104-.074.195-.165.269-.269.084-.117.139-.256.248-.534l.858-2.174Z" stroke="#7C3AED" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:'#7C3AED', marginBottom:2 }}>AI suggested change</div>
            <div style={{ fontSize:12, color:'#5A6478', lineHeight:'18px' }}>{suggestion.title} — step 3 has been added and step 5 has been updated to reflect the new recommendation flow.</div>
          </div>
        </div>

        {/* Scrollable form body */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>

          {/* Name */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:14, fontWeight:700, lineHeight:'20px', color:'#1A1D23', display:'block', marginBottom:4 }}>
              Name <span style={{ color:'#DC2626' }}>*</span>
            </label>
            <div style={{ fontSize:13, color:'#8A94A6', marginBottom:8, lineHeight:'20px' }}>A unique name for this procedure</div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width:'100%', padding:'8px 10px', border:'1px solid #DCE0E9', borderRadius:6, fontSize:13, color:'#1A1D23', boxSizing:'border-box', outline:'none', lineHeight:'20px' }}
            />
          </div>

          {/* When to use */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:14, fontWeight:700, lineHeight:'20px', color:'#1A1D23', display:'block', marginBottom:4 }}>
              When to use <span style={{ color:'#DC2626' }}>*</span>
            </label>
            <div style={{ fontSize:13, color:'#8A94A6', marginBottom:8, lineHeight:'20px' }}>Describe when this procedure should be used</div>
            <textarea
              value={whenToUse}
              onChange={e => setWhenToUse(e.target.value)}
              rows={3}
              style={{ width:'100%', padding:'8px 10px', border:'1px solid #DCE0E9', borderRadius:6, fontSize:13, color:'#1A1D23', boxSizing:'border-box', resize:'vertical', outline:'none', lineHeight:'20px' }}
            />
          </div>

          {/* Steps */}
          <div>
            <div style={{ fontSize:14, fontWeight:700, lineHeight:'20px', color:'#1A1D23', marginBottom:4 }}>Steps</div>
            <div style={{ fontSize:13, color:'#8A94A6', marginBottom:12, lineHeight:'20px' }}>Define the steps to execute this procedure. You can reference tools with @ mentions.</div>
            <div style={{ border:'1px solid #DCE0E9', borderRadius:8, overflow:'hidden' }}>
              {/* Toolbar */}
              <div style={{ padding:'8px 12px', borderBottom:'1px solid #DCE0E9', display:'flex', alignItems:'center', gap:2, background:'#F9FAFB' }}>
                {['B','I'].map(t => (
                  <button key={t} style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:t==='B'?14:13, fontWeight:t==='B'?700:400, fontStyle:t==='I'?'italic':'normal', color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>{t}</button>
                ))}
                <div style={{ width:1, height:18, background:'#DCE0E9', margin:'0 6px' }}/>
                <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>@</button>
                <div style={{ width:1, height:18, background:'#DCE0E9', margin:'0 6px' }}/>
                <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </button>
                <div style={{ flex:1 }}/>
                {['↩','↪'].map(t => (
                  <button key={t} style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#8A94A6', display:'flex', alignItems:'center', justifyContent:'center' }}>{t}</button>
                ))}
              </div>
              {/* Step list */}
              <div style={{ padding:'12px', background:'#fff' }}>
                <ol style={{ margin:0, paddingLeft:20 }}>
                  {editedSteps.map((step, i) => (
                    <li key={i} style={{
                      fontSize:13, color:'#1A1D23', lineHeight:'20px', marginBottom:8, paddingLeft:4,
                      background: (i === 2 || i === 3) ? 'rgba(22,163,74,0.06)' : 'transparent',
                      borderRadius:4, padding: (i === 2 || i === 3) ? '2px 6px' : '2px 0',
                    }}>
                      {step}
                      {(i === 2 || i === 3) && (
                        <span style={{ fontSize:10, fontWeight:600, color:'#16A34A', marginLeft:6, verticalAlign:'middle', background:'#F0FDF4', border:'1px solid #86EFAC', borderRadius:4, padding:'1px 5px' }}>AI added</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — sticky save */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid #DCE0E9', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontSize:12, color:'#8A94A6' }}>Changes take effect on new conversations immediately.</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={onClose} style={{ padding:'9px 18px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', fontSize:14, color:'#1A1D23', cursor:'pointer', fontWeight:600, lineHeight:'20px', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>Cancel</button>
            <button onClick={handleSave} style={{ padding:'9px 20px', borderRadius:8, border:'none', background: saved ? '#16A34A' : '#1C6EF2', color:'#fff', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, transition:'background 0.2s', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
              {saved ? '✓ Saved' : 'Save procedure'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function SuggestionsTab() {
  const [dismissedIds, setDismissedIds] = useState([])
  const [showDismissed, setShowDismissed] = useState(false)
  const [procedurePanel, setProcedurePanel] = useState(null) // null | suggestion object

  const suggestions = [
    {
      id: 1,
      title: 'Add an upsell step before coupon codes are applied',
      procedureName: 'VIP Coupon Procedure',
      type: 'Procedure',
      changelog: { updatedBy: 'Sarah Chen', updatedAgo: '6 days ago' },
      goal: 'Increase Average Order Value',
      priority: 'High',
      aiConfidence: 'High',
      aiConfidencePct: 84,
      calibratedBy: 'Sarah Chen',
      calibratedAgo: '6 days ago',
      cause: 'The AI observed a pattern: product recommendations were skipped in 58% of coupon conversations',
      evidence: 'Based on 1,240 VIP coupon conversations over 14 days. Conversations where a recommendation ran first had 2.8× higher AOV. Confidence is high — the pattern held across 4 consecutive weeks.',
      value: 'Coupon conversations average $47 AOV vs. $134 when a product recommendation runs first. Affects 33% of all coupon requests with no extra friction for the customer.',
      changeSummary: 'Adds a product recommendation step to the coupon procedure. The AI will suggest relevant products before applying a discount — and only apply the coupon if the customer declines.',
      before: "IF customer in VIP AND requests coupon\n  → apply_coupon_code()",
      after: "IF customer in VIP AND requests coupon\n  → get_related_products(order_history)\n  → recommend_products(top_match)\n  IF customer declines\n    → apply_coupon_code()",
      ctaLabel: 'Update coupon procedure',
      ctaScope: 'Takes effect on new conversations immediately. You can revert this from Procedures.',
      automation: { name:'VIP Customer Support', href:'#automation-vip-support' },
    },
    {
      id: 2,
      title: 'Create a product recommendation playbook for reps',
      procedureName: null,
      type: 'KB Article',
      changelog: { updatedBy: 'Marcus Webb', updatedAgo: '2 days ago' },
      goal: 'Increase Average Order Value',
      priority: 'Medium',
      aiConfidence: 'Medium',
      aiConfidencePct: 67,
      calibratedBy: 'Marcus Webb',
      calibratedAgo: '2 days ago',
      cause: 'The AI detected a gap: reps handling escalations had lower upsell rates than AI-handled conversations',
      evidence: 'Based on 340 escalated conversations over 30 days. Human handoffs following AI coupon conversations had 41% lower AOV than AI-only resolutions. Sample size is moderate — pattern may strengthen with more data.',
      value: 'When conversations are handed off to a rep, the upsell opportunity the AI identified is currently lost. A shared playbook ensures reps can continue where the AI left off.',
      changeSummary: 'Creates a new internal KB article explaining how to read a customer\'s order history and identify upsell opportunities during handoff conversations.',
      ctaLabel: 'Create article',
      ctaScope: 'Saves a draft to your KB. No conversations are affected until the article is published.',
    },
    {
      id: 3,
      title: 'Show related products when a customer looks up an order',
      procedureName: 'Order Lookup Procedure',
      type: 'Procedure',
      changelog: { updatedBy: 'Sarah Chen', updatedAgo: '3 days ago' },
      goal: 'Increase Average Order Value',
      priority: 'Medium',
      cause: 'Your AI retrieved order details 22% of conversations without suggesting related products',
      value: 'Customers looking up orders are already engaged and purchase-minded. Surfacing related products at this moment adds revenue potential with no change to the core resolution flow.',
      changeSummary: 'Adds a related products lookup after every order retrieval. If matches are found, the AI surfaces the top 3 before responding with order status.',
      before: "WHEN customer asks about order\n  → get_order_details(order_id)\n  → respond_with_order_status()",
      after: "WHEN customer asks about order\n  → get_order_details(order_id)\n  → get_related_products(order_id)\n  IF related_products.length > 0\n    → suggest_related_products(top_3)\n  → respond_with_order_status()",
      aiConfidence: 'Medium',
      aiConfidencePct: 71,
      calibratedBy: 'Sarah Chen',
      calibratedAgo: '3 days ago',
      cause: 'The AI identified a recurring gap: order lookups completed without surfacing related products in 22% of conversations',
      evidence: 'Based on 880 order lookup conversations over 21 days. Conversations where related products were surfaced had 18% higher add-to-cart rate. Confidence is moderate — recommendation relevance varies by product category.',
      ctaLabel: 'Update order lookup procedure',
      ctaScope: 'Takes effect on new conversations immediately. You can revert this from Procedures.',
      automation: { name:'General Support Agent', href:'#automation-general-support' },
    },
  ]

  const priStyle = {
    High:   { color:D.red,   bg:D.redBg,   border:D.redBorder,   label:'High priority' },
    Medium: { color:D.amber, bg:D.amberBg, border:D.amberBorder, label:'Medium priority' },
    Low:    { color:D.textMuted, bg:D.surfaceHi, border:D.border, label:'Low priority' },
  }

  const visible = suggestions.filter(s => !dismissedIds.includes(s.id))
  const dismissed = suggestions.filter(s => dismissedIds.includes(s.id))

  // Changelog popup state lives outside card so it can overlay correctly
  function SuggestionCard({ s }) {
    const [open, setOpen] = useState(s.id === 1)
    const [confirmDismiss, setConfirmDismiss] = useState(false)
    const [showChangelog, setShowChangelog] = useState(false)

    return (
      <div style={{ border:`1px solid ${D.border}`, borderRadius:10, background:D.surface, marginBottom:10, overflow:'hidden', position:'relative' }}>

        {/* ── Header — breadcrumb, H2, subtitle, then pills ── */}
        <div style={{ padding:'14px 16px 12px', borderBottom:`1px solid ${D.border}` }}>

          {/* Row 1: Breadcrumb Automation > Procedure + chevron */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              {s.automation && s.procedureName && (
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <a href={s.automation.href} style={{ fontSize:11, color:D.blue, fontWeight:500, textDecoration:'none' }}>{s.automation.name}</a>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke={D.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize:11, color:D.textSecondary, fontWeight:500 }}>{s.procedureName}</span>
                </div>
              )}
            </div>
            <button onClick={() => setOpen(v => !v)} style={{ background:'none', border:`1px solid ${D.border}`, borderRadius:6, cursor:'pointer', padding:'4px 8px', color:D.textMuted, display:'flex', alignItems:'center', flexShrink:0, marginLeft:12 }}>
              <ChevronIcon open={open}/>
            </button>
          </div>

          {/* Row 2: H2 — suggestion/action title */}
          <h2 style={{ fontSize:18, fontWeight:700, lineHeight:'22px', color:D.textPrimary, margin:'0 0 10px' }}>{s.title}</h2>

          {/* Row 3: Confidence · Goal · Changelog pills */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            {s.aiConfidence && (
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:9, fontWeight:600, color:D.textMuted, textTransform:'uppercase', letterSpacing:'0.04em' }}>Confidence</span>
                <span style={{
                  fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:600,
                  background: s.aiConfidence === 'High' ? D.greenBg : D.amberBg,
                  color:       s.aiConfidence === 'High' ? D.green   : D.amber,
                  border:     `1px solid ${s.aiConfidence === 'High' ? D.greenBorder : D.amberBorder}`,
                }}>
                  {s.aiConfidence}{s.aiConfidencePct ? ` · ${s.aiConfidencePct}%` : ''}
                </span>
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:9, fontWeight:600, color:D.textMuted, textTransform:'uppercase', letterSpacing:'0.04em' }}>Goal</span>
              <span style={{ fontSize:10, background:D.amberBg, color:D.amber, border:`1px solid ${D.amberBorder}`, padding:'2px 8px', borderRadius:10, fontWeight:500 }}>{s.goal}</span>
            </div>
            {s.changelog && (
              <div style={{ position:'relative' }}>
                <button onClick={e => { e.stopPropagation(); setShowChangelog(v => !v) }} style={{ fontSize:10, color:D.purple, background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:500, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:2 }}>
                  Updated by {s.changelog.updatedBy} {s.changelog.updatedAgo}
                </button>
                {showChangelog && (
                  <div style={{ position:'absolute', top:'100%', left:0, marginTop:6, background:D.surface, border:`1px solid ${D.border}`, borderRadius:8, padding:'12px 14px', width:260, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', zIndex:50 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:D.textPrimary, marginBottom:8 }}>Change log</div>
                    {[
                      { who:s.changelog.updatedBy, what:'Suggestion generated by AI monitor', when:s.changelog.updatedAgo },
                      { who:'System',              what:'Monitor failure threshold crossed',  when:s.changelog.updatedAgo },
                    ].map((entry, i) => (
                      <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', background:D.border, marginTop:4, flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:11, color:D.textPrimary, fontWeight:500 }}>{entry.who}</div>
                          <div style={{ fontSize:10, color:D.textMuted }}>{entry.what} · {entry.when}</div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setShowChangelog(false)} style={{ fontSize:10, color:D.textMuted, background:'none', border:'none', cursor:'pointer', padding:0, marginTop:4 }}>Close</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Expanded body ── */}
        {open && (
          <div style={{ padding:'16px', borderTop:`1px solid ${D.border}` }}>

            {/* Why this matters — H3 + body, no box */}
            <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:'#1A1D23', margin:'0 0 6px' }}>Why this matters</h3>
            <p style={{ fontSize:13, fontWeight:400, lineHeight:'20px', color:'#5A6478', margin:'0 0 20px' }}>{s.value}</p>

            {/* How the AI identified this — H3 + body, no box */}
            {s.evidence && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                  <AiSparkIcon color={D.purple} size={12}/>
                  <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:'#1A1D23', margin:0 }}>How the AI identified this</h3>
                </div>
                {s.cause && <p style={{ fontSize:13, fontWeight:600, lineHeight:'20px', color:'#5A6478', margin:'0 0 4px' }}>{s.cause}.</p>}
                <p style={{ fontSize:13, fontWeight:400, lineHeight:'20px', color:'#5A6478', margin:0 }}>{s.evidence}</p>
              </div>
            )}

            {/* What will change — H3 + body + diff */}
            {s.before && s.after && (
              <div style={{ marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:'#1A1D23', margin:'0 0 6px' }}>What will change</h3>
                <p style={{ fontSize:13, fontWeight:400, lineHeight:'20px', color:'#5A6478', margin:'0 0 12px' }}>{s.changeSummary}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[
                    { label:'Before', code:s.before, bg:'rgba(220,38,38,0.05)', border:D.redBorder },
                    { label:'After',  code:s.after,  bg:'rgba(22,163,74,0.05)', border:D.greenBorder },
                  ].map(({ label, code, bg, border }) => (
                    <div key={label}>
                      <div style={{ fontSize:13, fontWeight:600, lineHeight:'20px', color:'#5A6478', marginBottom:6 }}>{label}</div>
                      <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:6, padding:'10px 12px', fontFamily:'monospace', fontSize:12, color:'#5A6478', whiteSpace:'pre', lineHeight:1.7, overflowX:'auto' }}>{code}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KB Article — no diff */}
            {!s.before && s.changeSummary && (
              <div style={{ marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:'#1A1D23', margin:'0 0 6px' }}>What will change</h3>
                <p style={{ fontSize:13, fontWeight:400, lineHeight:'20px', color:'#5A6478', margin:0 }}>{s.changeSummary}</p>
              </div>
            )}

            {/* Action area */}
            {confirmDismiss ? (
              <div style={{ padding:'10px 14px', background:D.surfaceHi, borderRadius:8, border:`1px solid ${D.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <span style={{ fontSize:13, lineHeight:'20px', color:'#5A6478' }}>Dismiss this suggestion? You can restore it from dismissed suggestions.</span>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => setConfirmDismiss(false)} style={btnSecondary}>Cancel</button>
                  <button onClick={() => { setDismissedIds(ids => [...ids, s.id]); setConfirmDismiss(false) }} style={{ ...btnSecondary, color:D.red, borderColor:D.redBorder }}>Yes, dismiss</button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:8 }}>
                <div style={{ fontSize:13, fontWeight:400, lineHeight:'20px', color:'#8A94A6', flex:1 }}>{s.ctaScope}</div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => setConfirmDismiss(true)} style={btnSecondary}>Dismiss</button>
                  <button
                    onClick={() => s.type === 'Procedure' ? setProcedurePanel(s) : null}
                    style={{ ...btnPrimary, display:'inline-flex', alignItems:'center', gap:6 }}
                  >
                    <AiSparkIcon/>
                    {s.ctaLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* ── Page intro ── */}
      <p style={{ fontSize:13, fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:'#5A6478', lineHeight:'20px', margin:'0 0 20px' }}>The AI identified these patterns from conversation data and drafted recommendations for your review. Each suggestion includes the evidence behind it and a confidence level. Nothing changes until you apply it.</p>

      {/* ── Suggestion cards ── */}
      {visible.map(s => <SuggestionCard key={s.id} s={s}/>)}

      {procedurePanel && <ProcedurePanel suggestion={procedurePanel} onClose={() => setProcedurePanel(null)}/>}

      {/* ── Dismissed recovery strip ── */}
      {dismissed.length > 0 && (
        <div style={{ marginTop:8, padding:'8px 14px', borderRadius:8, border:`1px solid ${D.border}`, background:D.surfaceHi, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:12, color:D.textMuted }}>{dismissed.length} dismissed suggestion{dismissed.length !== 1 ? 's' : ''}</span>
          <button onClick={() => setShowDismissed(v => !v)} style={{ fontSize:12, color:D.purple, background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>
            {showDismissed ? 'Hide' : 'Restore'}
          </button>
        </div>
      )}
      {showDismissed && dismissed.map(s => (
        <div key={s.id} style={{ marginTop:6, padding:'10px 14px', border:`1px solid ${D.border}`, borderRadius:8, background:D.surface, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, opacity:0.7 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:D.textPrimary }}>{s.title}</div>
            <div style={{ fontSize:11, color:D.textMuted, marginTop:2 }}>{s.type} · {s.goal}</div>
          </div>
          <button onClick={() => setDismissedIds(ids => ids.filter(id => id !== s.id))} style={{ ...btnSecondary, fontSize:11, flexShrink:0 }}>Restore</button>
        </div>
      ))}
    </div>
  )
}

// ── TAB: Goals — "Are we succeeding?" ────────────────────────────────────────
function GoalsTab() {
  const [showAdd, setShowAdd] = useState(false)

  const allGoals = [
    {
      name: 'Increase AI-Generated CSAT',
      current: 3.9, target: 4.5, unit: '/ 5', direction: 'up',
      trend: 'up', pct: 65, window: 'Last 30 days',
      eta: 'On track · est. Jul 2026',
      delta: '+0.3 this week', deltaPos: true,
      linkedMonitor: 'AIC AI-CSAT Monitor',
      isDefault: true,
      history: [3.4, 3.5, 3.6, 3.6, 3.7, 3.8, 3.9],
    },
    {
      name: 'Improve Customer Sentiment',
      current: 71, target: 85, unit: '/ 100', direction: 'up',
      trend: 'up', pct: 52, window: 'Last 30 days',
      eta: 'In progress · est. Sep 2026',
      delta: '+2 this week', deltaPos: true,
      linkedMonitor: 'AIC AI-CSAT Monitor',
      isDefault: true,
      history: [60, 62, 64, 65, 67, 69, 71],
    },
    {
      name: 'Increase Average Order Value',
      current: 87, target: 120, unit: '', prefix: '$', direction: 'up',
      trend: 'up', pct: 73, window: 'Last 7 weeks',
      eta: 'On track · est. Aug 2026',
      delta: '+$2 this week', deltaPos: true,
      linkedMonitor: 'AOV & Upsell Performance Monitor',
      isDefault: false,
      history: [74, 76, 79, 81, 83, 85, 87],
    },
    {
      name: 'Increase AI Cost Savings',
      current: 4.20, target: 2.50, unit: '', prefix: '$', direction: 'down',
      trend: 'flat', pct: 60, window: 'Last 7 weeks',
      eta: 'Stalled · no change in 2 weeks',
      delta: 'Flat', deltaPos: false,
      linkedMonitor: 'Procedure Adherence Monitor',
      isDefault: false,
      history: [5.10, 4.90, 4.70, 4.50, 4.30, 4.20, 4.20],
    },
  ]

  function SparkLine({ history, color, width=88, height=32 }) {
    const min = Math.min(...history)
    const max = Math.max(...history)
    const range = max - min || 1
    const pts = history.map((v, i) => {
      const x = (i / (history.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 6) - 3
      return [x, y]
    })
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  function GoalCard({ g }) {
    const isLower = g.direction === 'down'
    const succeeding = g.trend === 'flat' ? false : (isLower ? g.pct >= 60 : g.pct >= 70)
    const status = g.trend === 'flat'
      ? { label:'Stalled',     color:D.red,   bg:D.redBg,   border:D.redBorder }
      : succeeding
      ? { label:'On track',    color:D.green, bg:D.greenBg, border:D.greenBorder }
      : { label:'In progress', color:D.amber, bg:D.amberBg, border:D.amberBorder }
    const fmt = v => `${g.prefix || ''}${typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(2) : v}${g.unit ? ' ' + g.unit : ''}`

    return (
      <div style={{ border:`1px solid ${D.border}`, borderRadius:10, background:D.surface, overflow:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'14px 16px 10px', borderBottom:`1px solid ${D.border}` }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 }}>
  <h2 style={{ fontSize:18, fontWeight:700, lineHeight:'22px', color:D.textPrimary, flex:1, paddingRight:8, margin:0 }}>{g.name}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <StatusBadge {...status}/>
              <button style={{ fontSize:11, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:0 }}>Edit</button>
            </div>
          </div>
          <div style={{ fontSize:11, color:D.textMuted }}>{g.window}</div>
        </div>

        <div style={{ padding:'14px 16px' }}>
          {/* Current value — dominant */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Current</div>
              <div style={{ fontSize:30, fontWeight:700, color:D.textPrimary, lineHeight:1 }}>{fmt(g.current)}</div>
              <div style={{ fontSize:11, marginTop:5, color:g.deltaPos ? D.green : D.textMuted, fontWeight:500 }}>{g.delta}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Target</div>
              <div style={{ fontSize:20, fontWeight:700, color:D.textMuted, lineHeight:1 }}>{fmt(g.target)}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom:14 }}>
            <div style={{ height:8, background:D.surfaceHi, borderRadius:99, overflow:'hidden', border:`1px solid ${D.border}` }}>
              <div style={{ height:'100%', borderRadius:99, width:`${Math.min(g.pct, 100)}%`, background:status.color }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
              <span style={{ fontSize:11, color:status.color, fontWeight:600 }}>{g.pct}% to target</span>
              <span style={{ fontSize:11, color:D.textMuted }}>{g.eta}</span>
            </div>
          </div>

          {/* Trend sparkline */}
          <div style={{ paddingTop:12, borderTop:`1px solid ${D.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:10, color:D.textMuted, marginBottom:4 }}>Trend</div>
              <SparkLine history={g.history} color={status.color}/>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Monitor</div>
              <div style={{ fontSize:11, color:D.textSecondary }}>{g.linkedMonitor}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <p style={{ fontSize:12, color:D.textMuted, maxWidth:560, lineHeight:1.5, margin:0 }}>Track whether your AI is hitting its targets. Goals are <em>aspirational</em> — they answer "are we succeeding?" using trend data and progress toward defined outcomes.</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ ...btnPrimary, marginLeft:16 }}>+ Add goal</button>
      </div>
      <div style={{ marginBottom:22 }}>
        <SectionLabel>Default goals</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {allGoals.filter(g => g.isDefault).map(g => <GoalCard key={g.name} g={g}/>)}
        </div>
      </div>
      <div>
        <SectionLabel>Custom goals</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {allGoals.filter(g => !g.isDefault).map(g => <GoalCard key={g.name} g={g}/>)}
        </div>
      </div>
      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)}/>}
    </div>
  )
}

// ── TAB: Quality Monitors — "How are we judging quality?" ─────────────────────
function QualityMonitorsTab() {
  const [showEdit, setShowEdit] = useState(false)

  const monitors = [
    {
      name: 'AIC AI-CSAT Monitor',
      desc: 'Evaluates AI-handled conversations for resolution quality, accuracy, tone, and customer satisfaction signals.',
      availability: 'Available when AIC is enabled',
      passRate: 78, kind: 'AIC', isDefault: true,
      evaluated: 1240, flagged: 18, alerts: 0,
      confidence: 'high',
      calibratedBy: 'Sarah Chen', calibratedAgo: '6 days ago',
      delta: { dir:'up', change:'3%', cause:'tone improvements', segment:'Returns conversations up 9%' },
      rootCauses: [
        { label: 'Resolution quality', pct: 52, severity: 'warning' },
        { label: 'Unconfirmed closes', pct: 31, severity: 'warning' },
        { label: 'Tone on complaints',  pct: 17, severity: 'info' },
      ],
      criteria: [
        { name:'Resolution quality',            weight:30, passRate:71 },
        { name:'Accuracy',                      weight:30, passRate:84 },
        { name:'Tone',                          weight:25, passRate:88 },
        { name:'Customer satisfaction signals', weight:15, passRate:79 },
      ],
      recentFlagged: [
        { id:'#conv-8821', failedOn:'Resolution quality — customer asked twice, AI closed without confirming resolution', score:'41%', confidence:'high', ago:'14m ago' },
        { id:'#conv-8817', failedOn:'Tone — abrupt close on unresolved complaint without empathy signal',                score:'55%', confidence:'medium', ago:'1h ago' },
      ],
      linkedGoal: 'Increase AI-Generated CSAT',
    },
    {
      name: 'AIR Copilot Usage Monitor',
      desc: 'Evaluates human-assisted conversations for copilot adoption, suggestion acceptance, and quality impact.',
      availability: 'Available when AIR is enabled',
      passRate: 83, kind: 'AIR', isDefault: true,
      evaluated: 640, flagged: 9, alerts: 0,
      confidence: 'high',
      calibratedBy: 'Marcus Webb', calibratedAgo: '2 days ago',
      delta: { dir:'up', change:'5%', cause:'higher suggestion acceptance', segment:'Order support conversations up 11%' },
      rootCauses: [
        { label: 'Suggestion dismissals without reason', pct: 58, severity: 'warning' },
        { label: 'Negative CSAT after copilot use',      pct: 27, severity: 'info' },
        { label: 'Low adoption in billing channel',      pct: 15, severity: 'info' },
      ],
      criteria: [
        { name:'Copilot adoption',      weight:35, passRate:88 },
        { name:'Suggestion acceptance', weight:35, passRate:79 },
        { name:'Quality impact',        weight:30, passRate:83 },
      ],
      recentFlagged: [
        { id:'#conv-8831', failedOn:'Suggestion acceptance — rep dismissed 4 consecutive copilot suggestions without explanation', score:'52%', confidence:'high', ago:'2h ago' },
        { id:'#conv-8826', failedOn:'Quality impact — conversation resolved but CSAT signal negative post-copilot use',           score:'61%', confidence:'medium', ago:'3h ago' },
      ],
      linkedGoal: 'Improve Customer Sentiment',
    },
  ]

  const kindStyle = {
    AIC: { bg:D.blueBg,    color:D.blue,      border:D.blueBorder },
    AIR: { bg:D.greenBg,   color:D.green,     border:D.greenBorder },
    All: { bg:D.surfaceHi, color:D.textMuted, border:D.border },
  }

  function PassBar({ pct, color }) {
    return (
      <div style={{ height:5, background:D.surfaceHi, borderRadius:99, overflow:'hidden', border:`1px solid ${D.border}` }}>
        <div style={{ height:'100%', borderRadius:99, width:`${pct}%`, background:color }}/>
      </div>
    )
  }

  function MonitorCard({ m }) {
    const [showCriteria, setShowCriteria] = useState(false)
    const [showConvos, setShowConvos] = useState(false)
    const kc = kindStyle[m.kind]
    const sp = stateProps(m.passRate + '%', m.evaluated)
    const flaggedColor = m.flagged > 20 ? D.red : m.flagged > 5 ? D.amber : D.textPrimary

    // Single status sentence from delta — causality in one line
    const statusSentence = m.delta
      ? m.delta.dir === 'down'
        ? `Down ${m.delta.change} this week${m.delta.cause ? ` — most failures: ${m.delta.cause}` : ''}.${m.delta.segment ? ` ${m.delta.segment}.` : ''}`
        : `Up ${m.delta.change} this week${m.delta.cause ? ` — ${m.delta.cause}` : ''}.${m.delta.segment ? ` ${m.delta.segment}.` : ''}`
      : null
    const sentenceColor = m.delta?.dir === 'down' ? D.red : D.green

    // Weakest criterion — most actionable single callout
    const weakest = [...m.criteria].sort((a, b) => a.passRate - b.passRate)[0]

    return (
      <div style={{ border:`1px solid ${D.border}`, borderRadius:10, background:D.surface, overflow:'hidden' }}>

        {/* Layer 1 — Name + status dot, goal · availability on one line */}
        <div style={{ padding:'14px 16px 12px', borderBottom:`1px solid ${D.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:sp.color, flexShrink:0 }}/>
<h2 style={{ fontSize:18, fontWeight:700, lineHeight:'22px', color:D.textPrimary, margin:0 }}>{m.name}</h2>
            </div>
            <button onClick={() => setShowEdit(true)} style={{ fontSize:12, color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:500, flexShrink:0 }}>Edit</button>
          </div>
          <div style={{ fontSize:11, color:D.textMuted, paddingLeft:16 }}>
            {m.linkedGoal && <span style={{ color:D.purple, fontWeight:500 }}>{m.linkedGoal}</span>}
            {m.linkedGoal && m.availability && <span style={{ margin:'0 6px' }}>·</span>}
            {m.availability && <span>{m.availability}</span>}
          </div>
          {m.calibratedBy && (
            <div style={{ fontSize:11, color:D.textMuted, marginTop:3, paddingLeft:16 }}>
              Last calibrated by <span style={{ color:D.textSecondary, fontWeight:500 }}>{m.calibratedBy}</span> · {m.calibratedAgo}
            </div>
          )}
        </div>

        {/* Layer 2 — Pass rate: the dominant answer */}
        <div style={{ padding:'14px 16px 12px', borderBottom:`1px solid ${D.border}` }}>
          {/* Severity tier badge — 5-tier system */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:6, background:sp.bg, border:`1px solid ${sp.border}`, marginBottom:10 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:sp.color }}/>
            <span style={{ fontSize:11, fontWeight:600, color:sp.color }}>{sp.label}</span>
            {sp.lowConf && <span style={{ fontSize:10, color:D.textMuted, marginLeft:2 }}>— more data needed</span>}
          </div>

          {/* Pass rate + secondary counters */}
          <div style={{ display:'flex', alignItems:'flex-end', marginBottom:10 }}>
            <div style={{ flex:'none' }}>
              <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Pass rate</div>
              <div style={{ fontSize:32, fontWeight:700, color:sp.color, lineHeight:1 }}>{m.passRate}%</div>
            </div>
            <div style={{ display:'flex', gap:16, marginLeft:20, paddingBottom:3 }}>
              <div>
                <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Evaluated</div>
                <div style={{ fontSize:16, fontWeight:600, color:D.textPrimary }}>{m.evaluated.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Flagged</div>
                <div style={{ fontSize:16, fontWeight:600, color:flaggedColor }}>{m.flagged}</div>
              </div>
              {m.alerts > 0 && (
                <div>
                  <div style={{ fontSize:10, color:D.textMuted, marginBottom:2 }}>Alerts</div>
                  <div style={{ fontSize:16, fontWeight:600, color:D.red }}>{m.alerts}</div>
                </div>
              )}
            </div>
          </div>

          {/* Pass bar — dashed when low confidence */}
          <div style={{ marginBottom:8 }}>
            <div style={{ height:5, background:D.surfaceHi, borderRadius:99, overflow:'hidden', border:`1px solid ${D.border}`, ...(sp.lowConf ? { outline:'2px dashed ' + D.border, outlineOffset:1 } : {}) }}>
              <div style={{ height:'100%', borderRadius:99, width:`${m.passRate}%`, background: sp.lowConf ? D.textMuted : sp.color, opacity: sp.lowConf ? 0.4 : 1 }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:3 }}>
              <span style={{ fontSize:10, color:D.textMuted }}>Threshold: 70%</span>
              <span style={{ fontSize:10, color:sp.color, fontWeight:600 }}>{m.passRate}% passing</span>
            </div>
          </div>

          {/* Confidence indicator */}
          {m.confidence && !sp.lowConf && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, color:D.textMuted, marginBottom:8 }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke={D.green} strokeWidth="1.2"/>
                <path d="M4 6l1.5 1.5L8 4" stroke={D.green} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: m.confidence === 'high' ? D.green : D.amber }}>
                {m.confidence === 'high' ? 'High confidence' : 'Medium confidence'}
              </span>
              <span>· {m.evaluated.toLocaleString()} conversations scored</span>
            </div>
          )}

          {/* Single status sentence */}
          {statusSentence && (
            <div style={{ fontSize:11, color:sentenceColor, lineHeight:1.5, marginBottom:10 }}>
              {m.delta?.dir === 'down' ? '↓ ' : '↑ '}{statusSentence}
            </div>
          )}

          {/* Root cause clusters — ranked, visible by default */}
          {m.rootCauses && m.rootCauses.length > 0 && (
            <div style={{ marginBottom:4 }}>
              <div style={{ fontSize:10, fontWeight:600, color:D.textMuted, marginBottom:6 }}>Most common issue</div>
              {m.rootCauses.map((rc, i) => {
                const rcColor = rc.severity === 'warning' ? D.amber : D.textMuted
                const rcBg    = rc.severity === 'warning' ? D.amberBg : D.surfaceHi
                const rcBdr   = rc.severity === 'warning' ? D.amberBorder : D.border
                return (
                  <div key={rc.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 8px', borderRadius:6, background:rcBg, border:`1px solid ${rcBdr}`, marginBottom:4 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:rcColor, width:16, textAlign:'center', flexShrink:0 }}>#{i+1}</span>
                    <span style={{ fontSize:11, color:D.textSecondary, flex:1 }}>{rc.label}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:rcColor }}>{rc.pct}% of failures</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Weakest criterion callout */}
          <div style={{ padding:'7px 10px', background:D.surfaceHi, borderRadius:6, border:`1px solid ${D.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
            <span style={{ fontSize:11, color:D.textSecondary }}>
              Lowest: <span style={{ fontWeight:600, color:D.textPrimary }}>{weakest.name}</span>
            </span>
            <span style={{ fontSize:12, fontWeight:700, color: weakest.passRate < 65 ? D.red : D.amber }}>{weakest.passRate}%</span>
          </div>
        </div>

        {/* Layer 3 — Criteria breakdown: collapsed by default */}
        <div style={{ borderBottom:`1px solid ${D.border}` }}>
          <button
            onClick={() => setShowCriteria(v => !v)}
            style={{ width:'100%', padding:'9px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
          >
            <span style={{ fontSize:12, fontWeight:600, color:D.textSecondary }}>See scoring criteria</span>
            <span style={{ fontSize:11, color:D.textMuted, display:'flex', alignItems:'center', gap:4 }}>
              {m.criteria.length} criteria
              <ChevronIcon open={showCriteria}/>
            </span>
          </button>
          {showCriteria && (
            <div style={{ padding:'4px 16px 12px' }}>
              {m.criteria.map(c => {
                const cColor = c.passRate >= 80 ? D.green : c.passRate >= 65 ? D.amber : D.red
                return (
                  <div key={c.name} style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:12, color:D.textPrimary, fontWeight:500 }}>{c.name}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:11, color:D.textMuted }}>{c.weight}% weight</span>
                        <span style={{ fontSize:12, fontWeight:700, color:cColor, minWidth:34, textAlign:'right' }}>{c.passRate}%</span>
                      </div>
                    </div>
                    <PassBar pct={c.passRate} color={cColor}/>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Layer 4 — Recent failures: collapsed by default */}
        {m.recentFlagged && m.recentFlagged.length > 0 && (
          <div>
            <button
              onClick={() => setShowConvos(v => !v)}
              style={{ width:'100%', padding:'9px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
            >
              <span style={{ fontSize:12, fontWeight:600, color:D.textSecondary }}>Review flagged conversations</span>
              <span style={{ fontSize:11, color:D.textMuted, display:'flex', alignItems:'center', gap:4 }}>
                {m.recentFlagged.length} conversations
                <ChevronIcon open={showConvos}/>
              </span>
            </button>
            {showConvos && (
              <div style={{ padding:'4px 16px 12px' }}>
                {m.recentFlagged.map(c => (
                  <ConvRow key={c.id} c={c}/>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }


  // Conversation row with confidence badge + human override controls
  function ConvRow({ c }) {
    const [status, setStatus] = useState('pending') // pending | confirmed | false_positive
    if (status === 'false_positive') {
      return (
        <div style={{ padding:'7px 10px', borderRadius:6, background:D.surfaceHi, border:`1px solid ${D.border}`, marginBottom:6, display:'flex', alignItems:'center', gap:8, opacity:0.5 }}>
          <span style={{ fontSize:11, fontWeight:600, color:D.purple, fontFamily:'monospace' }}>{c.id}</span>
          <span style={{ fontSize:11, color:D.textMuted, flex:1 }}>Marked as false positive</span>
          <button onClick={() => setStatus('pending')} style={{ fontSize:10, color:D.purple, background:'none', border:'none', cursor:'pointer', padding:0 }}>Undo</button>
        </div>
      )
    }
    const confColor = c.confidence === 'high' ? D.green : c.confidence === 'medium' ? D.amber : D.textMuted
    const confLabel = c.confidence === 'high' ? 'High confidence' : c.confidence === 'medium' ? 'Medium confidence' : 'Low confidence'
    return (
      <div style={{ padding:'8px 10px', borderRadius:6, background: status === 'confirmed' ? '#f0fdf4' : D.surfaceHi, border:`1px solid ${status === 'confirmed' ? D.greenBorder : D.border}`, marginBottom:6 }}>
        {/* Row header: id, confidence badge, score, time */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
          <span style={{ fontSize:12, fontWeight:600, color:D.purple, fontFamily:'monospace', flexShrink:0 }}>{c.id}</span>
          {/* Confidence badge */}
          {c.confidence && (
            <span style={{ fontSize:9, fontWeight:600, color:confColor, background: c.confidence === 'high' ? D.greenBg : D.amberBg, border:`1px solid ${c.confidence === 'high' ? D.greenBorder : D.amberBorder}`, padding:'1px 5px', borderRadius:4 }}>{confLabel}</span>
          )}
          <span style={{ fontSize:11, fontWeight:700, color:D.red, marginLeft:'auto' }}>{c.score}</span>
          <span style={{ fontSize:10, color:D.textMuted }}>{c.ago}</span>
        </div>
        {/* Failure reason */}
        <div style={{ fontSize:11, color:D.textSecondary, lineHeight:1.5, marginBottom:8 }}>{c.failedOn}</div>
        {/* Override controls */}
        <div style={{ display:'flex', gap:6 }}>
          {status === 'pending' ? (
            <>
              <button onClick={() => setStatus('confirmed')} style={{ fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:5, border:`1px solid ${D.greenBorder}`, background:D.greenBg, color:D.green, cursor:'pointer' }}>Confirm issue</button>
              <button onClick={() => setStatus('false_positive')} style={{ fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:5, border:`1px solid ${D.border}`, background:D.surface, color:D.textMuted, cursor:'pointer' }}>Mark false positive</button>
            </>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:10, fontWeight:600, color:D.green }}>✓ Issue confirmed</span>
              <button onClick={() => setStatus('pending')} style={{ fontSize:10, color:D.textMuted, background:'none', border:'none', cursor:'pointer', padding:0 }}>Undo</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <p style={{ fontSize:12, color:D.textMuted, maxWidth:600, lineHeight:1.5, margin:0 }}>Quality monitors score every closed conversation against defined criteria. They are <em>diagnostic</em> — they surface patterns and flag conversations for operator review. AI scores are calibrated against human reviewers and can be overridden.</p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, marginTop:8, padding:'3px 10px', background:D.greenBg, border:`1px solid ${D.greenBorder}`, borderRadius:6 }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={D.green} strokeWidth="1.2"/><path d="M4 6l1.5 1.5L8 4" stroke={D.green} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize:11, color:D.green, fontWeight:500 }}>AI scores aligned with human reviewers 87% this month</span>
          </div>
        </div>
      </div>

      {/* Default monitors */}
      <div style={{ marginBottom:20 }}>
        <SectionLabel>Default monitors</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {monitors.filter(m => m.isDefault).map(m => <MonitorCard key={m.name} m={m}/>)}
        </div>
      </div>

      {/* Custom monitors — MVP cap: 1 */}
      {(() => {
        const custom = monitors.filter(m => !m.isDefault)
        const atLimit = custom.length >= 1
        return (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <SectionLabel style={{ margin:0 }}>Custom monitor</SectionLabel>
                <span style={{ fontSize:11, color: atLimit ? D.textMuted : D.green, background: atLimit ? D.surfaceHi : D.greenBg, border:`1px solid ${atLimit ? D.border : D.greenBorder}`, borderRadius:10, padding:'1px 8px', fontWeight:500 }}>
                  {custom.length} / 1 used
                </span>
              </div>
              {atLimit ? (
                <span style={{ fontSize:11, color:D.textMuted }}>
                  1 monitor limit reached ·{' '}
                  <span style={{ color:D.purple, cursor:'pointer', fontWeight:500 }}>Upgrade to add more</span>
                </span>
              ) : null}
            </div>
            {custom.length === 0 ? (
              <div style={{ padding:'24px 20px', border:`1px dashed ${D.border}`, borderRadius:10, background:D.surface, textAlign:'center' }}>
                <div style={{ fontSize:13, fontWeight:600, color:D.textPrimary, marginBottom:4 }}>No custom monitor yet</div>
                <div style={{ fontSize:12, color:D.textMuted, marginBottom:14 }}>Add one monitor tailored to your business. Evaluations will run automatically on new conversations.</div>
                <button onClick={() => setShowEdit(true)} style={btnPrimary}>+ Add monitor</button>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {custom.slice(0, 1).map(m => <MonitorCard key={m.name} m={m}/>)}
              </div>
            )}
          </div>
        )
      })()}

      {showEdit && <EditMonitorModal onClose={() => setShowEdit(false)}/>}
    </div>
  )
}

// ── Light mode nav tokens ────────────────────────────────────────────────────
// Source: Kustomer light color spec
// Nav-Background = Gray 20 (#f0f1f3), Nav-Icon = Gray 80 (#5a6478)
// Nav-Icon-Focus = Blue 70 (#1c6ef2), Nav-Background-Hover = Gray 30 (#e4e6eb)
// Nav-Count-Background = Blue 70, Nav-Count-Text = #fff
const NAV = {
  bg:         '#f0f1f3',
  bgActive:   '#e0e4f5',
  border:     '#dce0e9',
  icon:       '#5a6478',
  iconActive: '#1c6ef2',
  countBg:    '#1c6ef2',
  countText:  '#ffffff',
}

function NavIconBtn({ Icon, active, badge }) {
  return (
    <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{
        width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
        borderRadius:8, cursor:'pointer',
        color: active ? NAV.iconActive : NAV.icon,
        background: active ? NAV.bgActive : 'transparent',
      }}>
        <Icon/>
      </div>
      {badge && (
        <div style={{
          position:'absolute', top:0, right:-2,
          background: NAV.countBg, color: NAV.countText,
          borderRadius:10, fontSize:9, fontWeight:700,
          padding:'1px 4px', lineHeight:1.4, minWidth:16, textAlign:'center',
        }}>{badge}</div>
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id:'dashboard',   label:'Dashboard' },
    { id:'goals',       label:'Goals' },
    { id:'monitors',    label:'Monitors' },
    { id:'suggestions', label:'Suggestions' },
  ]
  return (
    <div style={{ display:'flex', height:'100vh' }}>
      {/* Icon strip — light mode */}
      <div style={{
        width:56, minWidth:56,
        background: '#ffffff',
        borderRight: `1px solid ${NAV.border}`,
        display:'flex', flexDirection:'column', alignItems:'center',
        paddingTop:12, paddingBottom:12, gap:4,
        height:'100vh', boxSizing:'border-box',
      }}>
        {/* Full Kusty logo */}
        <div style={{ marginBottom:8 }}>
          <svg width="32" height="32" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M129.056 248.941C22.0236 248.941 0 200.604 0 128.789C0 56.9736 21.0088 8 129.056 8C237.103 8 256 57.4204 256 129.682C256 201.944 236.088 248.941 129.056 248.941Z" fill="#FBEC2A"/>
            <path d="M128.129 183.843C103.671 183.843 83.7832 163.409 83.7832 138.296V113.347H94.696V138.296C94.696 157.394 109.701 172.93 128.129 172.93C146.558 172.93 161.563 157.394 161.563 138.296V113.347H172.476V138.296C172.476 163.409 152.587 183.843 128.129 183.843Z" fill="#292929"/>
            <path d="M114.473 91.1545C112.591 86.4346 108.089 83.3928 103.015 83.3928C97.9404 83.3928 93.4525 86.4482 91.5566 91.1545L82.0627 87.3483C85.5138 78.7275 93.739 73.1486 103.015 73.1486C112.291 73.1486 120.516 78.714 123.967 87.3483L114.473 91.1545Z" fill="#292929"/>
            <path d="M164.208 91.1545C162.312 86.4346 157.824 83.3928 152.75 83.3928C147.676 83.3928 143.188 86.4482 141.292 91.1545L131.798 87.3483C135.249 78.7275 143.475 73.1486 152.75 73.1486C162.026 73.1486 170.251 78.714 173.702 87.3483L164.208 91.1545Z" fill="#292929"/>
          </svg>
        </div>

        <NavIconBtn Icon={HomeIcon} active={false}/>
        {/* Active module indicator */}
        <div style={{
          width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
          borderRadius:8, background: NAV.bgActive, cursor:'pointer', color: NAV.iconActive,
        }}>
          <MonitorIcon/>
        </div>

        <NavIconBtn Icon={InboxIcon} active={false} badge="29"/>
        <div style={{ flex:1 }}/>
        <NavIconBtn Icon={PieIcon} active={false}/>
        <NavIconBtn Icon={ActivityIcon} active={false}/>
        <NavIconBtn Icon={GridIcon} active={false}/>
        <NavIconBtn Icon={SettingsIcon} active={false}/>
        <div style={{ height:16 }}/>
        <NavIconBtn Icon={SearchIcon} active={false}/>
        <NavIconBtn Icon={BellIcon} active={false}/>
        <NavIconBtn Icon={HelpIcon} active={false}/>
        <div style={{ marginTop:8, width:30, height:30, borderRadius:'50%', background:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', cursor:'pointer' }}>AS</div>
      </div>

      {/* Secondary sidebar */}
      <div style={{ width:184, minWidth:184, background:D.surface, borderRight:`1px solid ${D.border}`, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', boxSizing:'border-box' }}>
        <div style={{ padding:'14px 12px 12px', borderBottom:`1px solid ${D.border}` }}>
          <span style={{ fontWeight:700, fontSize:13, color:D.textPrimary }}>AI Monitoring</span>
        </div>
        <div style={{ padding:'8px 0', flex:1, overflow:'auto' }}>
          {navItems.map(item => {
            const active = activeTab === item.id
            return (
              <div key={item.id} onClick={() => setActiveTab(item.id)} style={{ padding:'7px 12px', display:'flex', alignItems:'center', cursor:'pointer', fontSize:12, fontWeight:active?600:400, color:active?D.purple:D.textMuted, background:active?D.purpleLight:'transparent', borderLeft:active?`2px solid ${D.purple}`:'2px solid transparent' }}>
                {item.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main content ──────────────────────────────────────────────────────────────
function MainContent({ activeTab, setActiveTab }) {
  const labels = { dashboard:'Dashboard', suggestions:'Suggestions', goals:'Goals', monitors:'Monitors' }
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, background:D.bg }}>
      <div style={{ padding:'14px 24px', borderBottom:`1px solid ${D.border}`, background:D.surface }}>
        <div style={{ fontSize:16, fontWeight:700, color:D.textPrimary }}>{labels[activeTab]}</div>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:24 }}>
        {activeTab==='dashboard'  && <DashboardTab setActiveTab={setActiveTab}/>}
        {activeTab==='suggestions'&& <SuggestionsTab/>}
        {activeTab==='goals'      && <GoalsTab/>}
        {activeTab==='monitors'   && <QualityMonitorsTab/>}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:D.bg, width:'100%', fontFamily:"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", WebkitFontSmoothing:'antialiased' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
      <MainContent activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  )
}
