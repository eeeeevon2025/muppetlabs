
// ─── Kustomer AI QA — Claude Artifact ───────────────────────────────────────
// Paste this entire file into a Claude conversation to get a live prototype.

const { useState } = React;

// ── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const SparkleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.8L12 17.4l-6 4.6 2.4-7.8L2 9.6h7.6z"/></svg>
const AIQAIcon = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
const InboxIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const PieIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>
const ActivityIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const HelpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

// ── Mini Chart ───────────────────────────────────────────────────────────────
function MiniChart({ trend = 'up', color = '#10b981', width = 80, height = 32 }) {
  const pts = trend === 'up'
    ? [[0,28],[10,26],[20,24],[30,22],[40,20],[50,18],[60,15],[70,12],[80,8]]
    : trend === 'flat'
    ? [[0,18],[10,16],[20,17],[30,18],[40,17],[50,18],[60,16],[70,17],[80,18]]
    : [[0,8],[10,10],[20,13],[30,16],[40,19],[50,21],[60,24],[70,26],[80,28]]
  const d = pts.map((p,i) => `${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ')
  return <svg width={width} height={height} viewBox="0 0 80 32"><path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ── Modals ───────────────────────────────────────────────────────────────────
function AddGoalModal({ onClose }) {
  const [name, setName] = useState('Increase AOV')
  const [description, setDescription] = useState('Grow average order value by identifying upsell opportunities during AI-assisted conversations.')
  const [target, setTarget] = useState('120')
  const [selected, setSelected] = useState('Increase AOV')
  const examples = [
    { label: 'Increase CSAT', sub: '↑ AI-Generated CSAT · target 4.5 / 5' },
    { label: 'Improve Customer Sentiment', sub: '↑ Customer Health Score · target 85 / 100' },
    { label: 'Improve Net Retention', sub: '↓ Churn Risk Score · target < 20%' },
    { label: 'Increase AOV', sub: '↑ Average Order Value · target $120' },
    { label: 'Reduce Handle Time', sub: '↓ Avg Handle Time · target 3 min' },
    { label: 'Improve Agent Accuracy', sub: '↑ Suggestion Acceptance Rate · target 75%' },
  ]
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
      <div style={{ background:'#fff',borderRadius:12,width:540,maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding:'20px 24px',borderBottom:'1px solid #e5e7eb' }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#111827',marginBottom:12 }}>New Goal</div>
          <div style={{ fontSize:10,color:'#9ca3af',marginBottom:8 }}>Start from an example, or fill in your own below.</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
            {examples.map(g => (
              <button key={g.label} onClick={() => setSelected(g.label)} style={{ padding:'5px 10px',borderRadius:6,border:selected===g.label?'1px solid #7c3aed':'1px solid #e5e7eb',background:selected===g.label?'#f3f0ff':'#f9fafb',cursor:'pointer',fontSize:11,color:selected===g.label?'#7c3aed':'#374151',textAlign:'left' }}>
                <div style={{ fontWeight:500 }}>{g.label}</div>
                <div style={{ color:'#9ca3af',fontSize:10 }}>{g.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:'20px 24px' }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4 }}>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={{ width:'100%',padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,color:'#111827',boxSizing:'border-box' }}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4 }}>Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{ width:'100%',padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,color:'#111827',resize:'vertical',boxSizing:'border-box' }}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4 }}>Computed Field</label>
            <div style={{ padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,color:'#374151',background:'#f9fafb',display:'flex',justifyContent:'space-between' }}><span>AI-Generated CSAT</span><span style={{ color:'#9ca3af' }}>▾</span></div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4 }}>Target</label>
            <div style={{ display:'flex',gap:10 }}>
              <input value={target} onChange={e=>setTarget(e.target.value)} style={{ flex:1,padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13 }}/>
              <div style={{ flex:1,padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,color:'#374151',background:'#f9fafb',display:'flex',justifyContent:'space-between' }}><span>Higher is better</span><span style={{ color:'#9ca3af' }}>▾</span></div>
            </div>
          </div>
          <div style={{ display:'flex',justifyContent:'flex-end',gap:8 }}>
            <button onClick={onClose} style={{ padding:'8px 16px',borderRadius:6,border:'1px solid #d1d5db',background:'#fff',fontSize:13,cursor:'pointer',color:'#374151' }}>Cancel</button>
            <button onClick={onClose} style={{ padding:'8px 16px',borderRadius:6,border:'none',background:'#7c3aed',color:'#fff',fontSize:13,cursor:'pointer',fontWeight:500 }}>Add goal</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditMonitorModal({ onClose }) {
  const [tab, setTab] = useState('configuration')
  const [threshold, setThreshold] = useState('78')
  const [kind, setKind] = useState('AIC')
  const [sugOn, setSugOn] = useState(true)
  const [ctx, setCtx] = useState({ messages:true,traces:true,kb:true,customer:false,copilot:false })
  const ctxOpts = [['messages','Conversation messages'],['traces','Automation execution traces'],['kb','Relevant KB articles'],['customer','Customer data'],['copilot','Copilot messages (AIR)']]
  const criteria = ['Tone & empathy','Need resolution','Response clarity','Follow-up appropriateness']
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
      <div style={{ background:'#fff',borderRadius:12,width:600,maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontSize:13,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'0.05em' }}>EDIT QUALITY MONITOR</span>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#6b7280' }}>✕</button>
        </div>
        <div style={{ padding:'0 20px',display:'flex',borderBottom:'1px solid #e5e7eb' }}>
          {['configuration','results'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'10px 14px',fontSize:12,fontWeight:tab===t?600:400,color:tab===t?'#7c3aed':'#6b7280',background:'none',border:'none',borderBottom:tab===t?'2px solid #7c3aed':'2px solid transparent',cursor:'pointer',textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding:'20px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,fontSize:12,color:'#059669',background:'#ecfdf5',padding:'4px 10px',borderRadius:6 }}>✓ Active</div>
            <button style={{ padding:'5px 14px',border:'1px solid #d1d5db',borderRadius:6,fontSize:12,background:'#fff',cursor:'pointer',color:'#374151' }}>Pause</button>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4 }}>Name</label>
            <input defaultValue="AIC AI-CSAT Monitor" style={{ width:'100%',padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,boxSizing:'border-box' }}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4 }}>Description</label>
            <textarea defaultValue="Evaluates tone and whether the AI helped the customer meet their need, reducing the likelihood of repeat contact." rows={3} style={{ width:'100%',padding:'8px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13,resize:'vertical',boxSizing:'border-box' }}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:6 }}>Kind — Which conversations to evaluate</label>
            <div style={{ display:'flex',gap:8 }}>
              {['AIC','AIR','All'].map(k => (
                <button key={k} onClick={() => setKind(k)} style={{ padding:'6px 16px',borderRadius:6,fontSize:12,cursor:'pointer',fontWeight:kind===k?600:400,background:kind===k?'#7c3aed':'#f9fafb',color:kind===k?'#fff':'#374151',border:kind===k?'none':'1px solid #d1d5db' }}>
                  {k==='AIC'?'AIC — AI-handled':k==='AIR'?'AIR — Human-assisted':'All conversations'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12,fontWeight:500,color:'#374151',marginBottom:4 }}>Context Profile</div>
            <div style={{ fontSize:11,color:'#6b7280',marginBottom:8 }}>Choose what data the LLM judge receives when scoring each conversation.</div>
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {ctxOpts.map(([key,label]) => (
                <label key={key} style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:12,color:'#374151' }}>
                  <input type="checkbox" checked={ctx[key]} onChange={e => setCtx(p=>({...p,[key]:e.target.checked}))} style={{ accentColor:'#7c3aed' }}/>{label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12,fontWeight:500,color:'#374151',marginBottom:6 }}>Analysis</div>
            <div style={{ display:'flex',alignItems:'center',gap:6 }}>
              <label style={{ fontSize:12,color:'#374151' }}>Pass Threshold</label>
              <input value={threshold} onChange={e=>setThreshold(e.target.value)} style={{ width:70,padding:'6px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:13 }}/>
              <span style={{ fontSize:13,color:'#6b7280' }}>%</span>
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
              <div style={{ fontSize:12,fontWeight:500,color:'#374151' }}>Criteria</div>
              <button style={{ fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',fontWeight:500 }}>+ Add Criterion</button>
            </div>
            {criteria.map(c => (
              <div key={c} style={{ border:'1px solid #e5e7eb',borderRadius:6,marginBottom:6 }}>
                <div style={{ padding:'8px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer' }}>
                  <span style={{ fontSize:12,fontWeight:500,color:'#374151' }}>▸ {c}</span>
                  <button style={{ background:'none',border:'none',cursor:'pointer',fontSize:12,color:'#9ca3af' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:20,padding:12,background:'#fafafa',border:'1px solid #e5e7eb',borderRadius:8 }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:12,fontWeight:500,color:'#374151',marginBottom:2 }}>Generate suggestions on failure</div>
                <div style={{ fontSize:11,color:'#6b7280' }}>When this monitor fails, automatically create AI-generated improvement suggestions.</div>
              </div>
              <div onClick={() => setSugOn(!sugOn)} style={{ width:40,height:22,borderRadius:11,cursor:'pointer',position:'relative',flexShrink:0,background:sugOn?'#7c3aed':'#d1d5db',transition:'background 0.2s' }}>
                <div style={{ position:'absolute',top:2,left:sugOn?20:2,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
              </div>
            </div>
          </div>
          <div style={{ display:'flex',justifyContent:'flex-end',gap:8 }}>
            <button onClick={onClose} style={{ padding:'8px 16px',borderRadius:6,border:'1px solid #d1d5db',background:'#fff',fontSize:13,cursor:'pointer',color:'#374151' }}>Cancel</button>
            <button onClick={onClose} style={{ padding:'8px 16px',borderRadius:6,border:'none',background:'#7c3aed',color:'#fff',fontSize:13,cursor:'pointer',fontWeight:500 }}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoalDetailModal({ onClose, onViewSuggestions }) {
  const criteriaRows = [
    { label:'Upsell opportunity identified', pct:45 },
    { label:'Recommendation relevance to order history', pct:38 },
    { label:'Coupon-first behaviour avoided', pct:58 },
    { label:'Conversion attempt made', pct:42 },
  ]
  const blocking = [
    { label:'Coupon applied before upsell attempted', pct:34, color:'#ef4444' },
    { label:'Product recommendation skipped during order lookup', pct:28, color:'#ef4444' },
    { label:'No cross-sell triggered after cart retrieval', pct:22, color:'#f59e0b' },
  ]
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
      <div style={{ background:'#fff',borderRadius:12,width:620,maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding:'16px 20px',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontSize:13,fontWeight:700,color:'#111827',textTransform:'uppercase',letterSpacing:'0.05em' }}>INCREASE AVERAGE ORDER VALUE</span>
          <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#6b7280' }}>✕</button>
        </div>
        <div style={{ padding:'20px' }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8 }}>KPI PROGRESS</div>
            <div style={{ display:'flex',alignItems:'center',gap:24 }}>
              {[['Current','$87'],['Target','$120'],['Progress','73%']].map(([l,v]) => (
                <div key={l}><div style={{ fontSize:10,color:'#9ca3af' }}>{l}</div><div style={{ fontSize:28,fontWeight:700,color:'#111827' }}>{v}</div></div>
              ))}
              <div style={{ marginLeft:'auto',textAlign:'right' }}>
                <div style={{ fontSize:10,color:'#9ca3af',marginBottom:4 }}>Last 7 weeks</div>
                <MiniChart trend="up" color="#10b981" width={100} height={36}/>
              </div>
            </div>
            <p style={{ fontSize:12,color:'#6b7280',marginTop:8,lineHeight:1.5 }}>Grow AOV by identifying upsell opportunities during AI-assisted conversations, especially when customers request coupon codes or look up existing orders.</p>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10 }}>EVALUATION IMPACT ON AVERAGE ORDER VALUE</div>
            {[{ name:'AOV & Upsell Performance Monitor',rate:'42% pass rate',pass:'$115',fail:'$72',impact:'+$43' },
              { name:'Knowledge Base Adherence Monitor',rate:'85% pass rate',pass:'$89',fail:'$83',impact:'+$6' }].map(e => (
              <div key={e.name} style={{ marginBottom:12,border:'1px solid #e5e7eb',borderRadius:8,padding:12 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
                  <span style={{ fontSize:12,fontWeight:500,color:'#374151' }}>{e.name}</span>
                  <span style={{ fontSize:10,background:'#fef3c7',color:'#d97706',padding:'1px 6px',borderRadius:10,fontWeight:500 }}>{e.rate}</span>
                </div>
                <div style={{ display:'flex',gap:20 }}>
                  {[['When eval passed',e.pass],['When eval failed',e.fail],['Potential impact',e.impact]].map(([l,v],i) => (
                    <div key={l}><div style={{ fontSize:10,color:'#9ca3af' }}>{l}</div><div style={{ fontSize:16,fontWeight:700,color:i===2?'#059669':'#111827' }}>{v}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
              <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em' }}>CRITERION PASS RATES</div>
              <span style={{ fontSize:11,color:'#6b7280' }}>AOV & Upsell Performance</span>
            </div>
            {criteriaRows.map(r => (
              <div key={r.label} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
                <span style={{ fontSize:11,color:'#374151',flex:1 }}>{r.label}</span>
                <div style={{ width:120,height:6,background:'#f3f4f6',borderRadius:3,overflow:'hidden' }}><div style={{ width:`${r.pct}%`,height:'100%',background:'#ef4444',borderRadius:3 }}/></div>
                <span style={{ fontSize:11,color:'#6b7280',width:30,textAlign:'right' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8 }}>WHAT'S BLOCKING PROGRESS</div>
            {blocking.map(b => (
              <div key={b.label} style={{ display:'flex',alignItems:'center',gap:8,marginBottom:6 }}>
                <span style={{ color:b.color,fontSize:10 }}>●</span>
                <span style={{ fontSize:12,color:'#374151',flex:1 }}>{b.label}</span>
                <span style={{ fontSize:12,color:'#6b7280',fontWeight:500 }}>{b.pct}%</span>
              </div>
            ))}
            <p style={{ fontSize:11,color:'#9ca3af',marginTop:8 }}>3 AI-generated suggestions available to improve this goal.</p>
          </div>
          <div style={{ display:'flex',justifyContent:'flex-end',gap:8 }}>
            <button onClick={onViewSuggestions} style={{ padding:'8px 16px',borderRadius:6,border:'none',background:'#7c3aed',color:'#fff',fontSize:13,cursor:'pointer',fontWeight:500 }}>View suggestions</button>
            <button onClick={onClose} style={{ padding:'8px 16px',borderRadius:6,border:'1px solid #d1d5db',background:'#fff',fontSize:13,cursor:'pointer',color:'#374151' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Dashboard ───────────────────────────────────────────────────────────
function DashboardTab({ setActiveTab }) {
  const [showDetail, setShowDetail] = useState(false)
  const anomalies = [
    { label:'Procedure Adherence', count:11, color:'#ef4444', pct:100 },
    { label:'Knowledge Accuracy', count:7, color:'#f59e0b', pct:64 },
    { label:'Guardrail Violation', count:3, color:'#10b981', pct:27 },
    { label:'Tool Misuse', count:2, color:'#6366f1', pct:18 },
  ]
  const flagged = [
    { id:'#conv-8821', monitor:'AIC AI-CSAT Monitor', score:'41%', time:'14 min ago' },
    { id:'#conv-8819', monitor:'Procedure Adherence Monitor', score:'58%', time:'31 min ago' },
    { id:'#conv-8814', monitor:'AOV & Upsell Performance Monitor', score:'33%', time:'1 hr ago' },
  ]
  return (
    <div>
      <div style={{ background:'#f5f3ff',border:'1px solid #ede9fe',borderRadius:8,padding:'10px 14px',marginBottom:20,display:'flex',alignItems:'center',gap:8,fontSize:12,color:'#5b21b6' }}>
        <span style={{ fontSize:14 }}>🎯</span>
        <span><strong>Goals drive everything</strong> — monitoring thresholds, suggestion priority, and future AI configuration are all anchored to your declared outcomes.</span>
      </div>
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:12,color:'#6b7280',lineHeight:1.5,margin:0 }}>A live view of AI and rep performance across all monitors and goals. Spot degradation early and act before it impacts customers.</p>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12,fontWeight:600,color:'#374151',marginBottom:12 }}>Goal Progress</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
          {/* Improving */}
          <div style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:18,background:'#fff',borderLeft:'3px solid #f59e0b' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
              <div style={{ fontSize:13,fontWeight:600,color:'#111827' }}>Increase Average Order Value</div>
              <span style={{ fontSize:10,background:'#fef3c7',color:'#d97706',padding:'2px 8px',borderRadius:20,fontWeight:500,whiteSpace:'nowrap' }}>↑ Improving</span>
            </div>
            <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between' }}>
              <div style={{ display:'flex',gap:16 }}>
                <div><div style={{ fontSize:10,color:'#9ca3af' }}>Current</div><div style={{ fontSize:20,fontWeight:700,color:'#111827' }}>$87</div></div>
                <div><div style={{ fontSize:10,color:'#9ca3af' }}>Target</div><div style={{ fontSize:20,fontWeight:700,color:'#111827' }}>$120</div></div>
              </div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:10,color:'#9ca3af',marginBottom:2 }}>Last 7 weeks</div><MiniChart trend="up" color="#10b981"/></div>
            </div>
            <div style={{ marginTop:10,fontSize:11 }}><span style={{ color:'#6b7280' }}>73% to target</span><span style={{ color:'#10b981',marginLeft:12 }}>↑ +$2 last week</span></div>
            <div style={{ fontSize:11,color:'#9ca3af',marginTop:2 }}>At current rate, on track by ~Aug 2026</div>
            <button onClick={() => setShowDetail(true)} style={{ marginTop:12,fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',padding:0 }}>View details →</button>
          </div>
          {/* Stalled */}
          <div style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:18,background:'#fff',borderLeft:'3px solid #ef4444' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
              <div style={{ fontSize:13,fontWeight:600,color:'#111827' }}>Increase AI Cost Savings</div>
              <span style={{ fontSize:10,background:'#fef2f2',color:'#ef4444',padding:'2px 8px',borderRadius:20,fontWeight:500,whiteSpace:'nowrap' }}>! Stalled</span>
            </div>
            <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between' }}>
              <div style={{ display:'flex',gap:16 }}>
                <div><div style={{ fontSize:10,color:'#9ca3af' }}>Current</div><div style={{ fontSize:20,fontWeight:700,color:'#111827' }}>$4.20</div></div>
                <div><div style={{ fontSize:10,color:'#9ca3af' }}>Target</div><div style={{ fontSize:20,fontWeight:700,color:'#111827' }}>$2.50</div></div>
              </div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:10,color:'#9ca3af',marginBottom:2 }}>Last 7 weeks</div><MiniChart trend="flat" color="#9ca3af"/></div>
            </div>
            <div style={{ marginTop:10,fontSize:11 }}><span style={{ color:'#6b7280' }}>60% to target</span><span style={{ color:'#9ca3af',marginLeft:12 }}>→ Flat last 2 weeks</span></div>
            <div style={{ fontSize:11,color:'#9ca3af',marginTop:2 }}>Progress stalled — adding procedures would resume trajectory</div>
            <button style={{ marginTop:12,fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',padding:0 }}>View details →</button>
          </div>
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:16 }}>
        {[['AI Resolution Rate','40%','Conversations fully resolved by AI'],['Monitor Pass Rate','72%','Across all active monitors'],['Anomalies Detected','23','Last 30 days']].map(([l,v,s]) => (
          <div key={l} style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:16,background:'#fff' }}>
            <div style={{ fontSize:11,color:'#6b7280',marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:28,fontWeight:700,color:'#111827',marginBottom:2 }}>{v}</div>
            <div style={{ fontSize:11,color:'#9ca3af' }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ border:'1px solid #fef3c7',borderRadius:8,background:'#fffbeb',padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10 }}>
        <span style={{ fontSize:14 }}>⚠️</span>
        <div style={{ flex:1 }}><span style={{ fontSize:12,color:'#92400e',fontWeight:500 }}>Procedure Adherence Monitor pass rate dropped below 65% threshold</span><span style={{ fontSize:11,color:'#b45309',marginLeft:8 }}>— 2 hours ago</span></div>
        <button onClick={() => setActiveTab('monitors')} style={{ fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',whiteSpace:'nowrap' }}>View monitor →</button>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        <div style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:20,background:'#fff' }}>
          <div style={{ fontSize:13,fontWeight:600,color:'#111827',marginBottom:16 }}>Anomalies by Type</div>
          {anomalies.map(a => (
            <div key={a.label} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:12 }}>
              <span style={{ fontSize:12,color:'#374151',width:160 }}>{a.label}</span>
              <div style={{ flex:1,height:8,background:'#f3f4f6',borderRadius:4,overflow:'hidden' }}><div style={{ width:`${a.pct}%`,height:'100%',background:a.color,borderRadius:4 }}/></div>
              <span style={{ fontSize:12,fontWeight:600,color:'#374151',width:20,textAlign:'right' }}>{a.count}</span>
            </div>
          ))}
          <div style={{ fontSize:11,color:'#9ca3af',marginTop:8 }}>23 total anomalies in the last 30 days</div>
        </div>
        <div style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:20,background:'#fff' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
            <div style={{ fontSize:13,fontWeight:600,color:'#111827' }}>Flagged Conversations</div>
            <span style={{ fontSize:10,background:'#fef2f2',color:'#ef4444',padding:'2px 8px',borderRadius:10,fontWeight:600 }}>3 need review</span>
          </div>
          {flagged.map(c => (
            <div key={c.id} style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 0',borderBottom:'1px solid #f3f4f6' }}>
              <span style={{ fontSize:12,fontWeight:600,color:'#7c3aed',fontFamily:'monospace',whiteSpace:'nowrap' }}>{c.id}</span>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:11,color:'#374151',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.monitor}</div>
                <div style={{ fontSize:10,color:'#9ca3af' }}>{c.time}</div>
              </div>
              <span style={{ fontSize:11,fontWeight:600,color:'#ef4444',whiteSpace:'nowrap' }}>{c.score}</span>
            </div>
          ))}
          <button style={{ marginTop:12,fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',padding:0 }}>View all flagged →</button>
        </div>
      </div>
      {showDetail && <GoalDetailModal onClose={() => setShowDetail(false)} onViewSuggestions={() => { setShowDetail(false); setActiveTab('suggestions') }}/>}
    </div>
  )
}

// ── Tab: Suggestions ─────────────────────────────────────────────────────────
function SuggestionsTab() {
  const [goalFilter, setGoalFilter] = useState('All goals')
  const [priFilter, setPriFilter] = useState('All priorities')
  const suggestions = [
    { id:1, title:'Suggest an upsell before applying a coupon code', type:'Procedure', goal:'Increase Average Order Value', priority:'High', triggeredBy:'AOV & Upsell Performance Monitor failure', expanded:true,
      why:"33% of coupon requests come from customers who haven't reviewed related products. Adding a product recommendation step before the coupon is applied could meaningfully increase AOV with minimal friction.",
      before:"IF customer in VIP AND requests coupon\n  → apply_coupon_code()",
      after:"IF customer in VIP AND requests coupon\n  → get_related_products(order_history)\n  → recommend_products(top_match)\n  IF customer declines\n    → apply_coupon_code()",
      impact:"Conversations where a coupon was issued had an AOV of $47 vs. $134 for non-coupon sessions. The AOV & Upsell Monitor shows this step is being skipped in 58% of eligible conversations." },
    { id:2, title:'Add rep-facing knowledge article: product recommendation playbook', type:'KB Article', goal:'Increase Average Order Value', priority:'Medium', triggeredBy:'Knowledge Base Adherence Monitor failure', expanded:false, why:"Create an internal KB article for reps on how to identify upsell opportunities using a customer's order history, so human handoffs preserve the upsell context the AI gathered." },
    { id:3, title:'Update order lookup procedure to surface related products', type:'Procedure', goal:'Increase Average Order Value', priority:'Medium', triggeredBy:'Anomaly Detection — procedure non-adherence', expanded:false, why:"After retrieving a customer's order, automatically surfaces products frequently bought together with their most recent purchase — applicable to 22% of all conversations." },
  ]
  const priStyle = { High:{ bg:'#fef2f2',color:'#dc2626' }, Medium:{ bg:'#fffbeb',color:'#d97706' }, Low:{ bg:'#f9fafb',color:'#6b7280' } }

  function SuggestionCard({ s }) {
    const [open, setOpen] = useState(s.expanded)
    const [dismissed, setDismissed] = useState(false)
    if (dismissed) return null
    const ps = priStyle[s.priority]
    return (
      <div style={{ border:'1px solid #e5e7eb',borderRadius:10,background:'#fff',marginBottom:12,overflow:'hidden' }}>
        <div style={{ padding:'14px 16px',cursor:'pointer' }} onClick={() => setOpen(!open)}>
          <div style={{ display:'flex',alignItems:'flex-start',gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:600,color:'#111827',marginBottom:6 }}>{s.title}</div>
              <div style={{ display:'flex',gap:6,flexWrap:'wrap',alignItems:'center' }}>
                <span style={{ fontSize:10,background:ps.bg,color:ps.color,padding:'2px 8px',borderRadius:10,fontWeight:600 }}>● {s.priority} priority</span>
                <span style={{ fontSize:10,background:'#ede9fe',color:'#7c3aed',padding:'2px 8px',borderRadius:10,fontWeight:500 }}>{s.type}</span>
                <span style={{ fontSize:10,background:'#fef3c7',color:'#d97706',padding:'2px 8px',borderRadius:10,fontWeight:500 }}>{s.goal}</span>
              </div>
              <div style={{ fontSize:10,color:'#9ca3af',marginTop:5 }}>Triggered by: <span style={{ color:'#6b7280' }}>{s.triggeredBy}</span></div>
            </div>
            <span style={{ fontSize:11,color:'#9ca3af',whiteSpace:'nowrap' }}>{open?'Collapse':'View details'}</span>
          </div>
        </div>
        {open && (
          <div style={{ padding:'0 16px 16px',borderTop:'1px solid #f3f4f6' }}>
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6 }}>Why this matters</div>
              <p style={{ fontSize:12,color:'#374151',lineHeight:1.6 }}>{s.why}</p>
            </div>
            {s.impact && <p style={{ fontSize:12,color:'#374151',lineHeight:1.6,fontStyle:'italic',marginTop:8 }}>{s.impact}</p>}
            {s.before && s.after && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8 }}>Proposed change</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                  {[{ label:'Before',code:s.before,bg:'#fef2f2',border:'#fecaca' },{ label:'After',code:s.after,bg:'#f0fdf4',border:'#bbf7d0' }].map(({label,code,bg,border}) => (
                    <div key={label}><div style={{ fontSize:11,fontWeight:600,color:'#6b7280',marginBottom:4 }}>{label}</div><div style={{ background:bg,border:`1px solid ${border}`,borderRadius:6,padding:'10px 12px',fontFamily:'monospace',fontSize:11,color:'#374151',whiteSpace:'pre',lineHeight:1.6,overflowX:'auto' }}>{code}</div></div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display:'flex',justifyContent:'flex-end',gap:8,marginTop:16 }}>
              <button onClick={() => setDismissed(true)} style={{ padding:'6px 14px',borderRadius:6,border:'1px solid #d1d5db',background:'#fff',fontSize:12,cursor:'pointer',color:'#374151' }}>Dismiss</button>
              <button style={{ padding:'6px 14px',borderRadius:6,border:'none',background:'#7c3aed',color:'#fff',fontSize:12,cursor:'pointer',fontWeight:500 }}>Apply</button>
            </div>
          </div>
        )}
        {!open && (
          <div style={{ padding:'0 16px 12px',display:'flex',justifyContent:'flex-end',gap:8 }}>
            <button onClick={() => setDismissed(true)} style={{ padding:'5px 12px',borderRadius:6,border:'1px solid #d1d5db',background:'#fff',fontSize:11,cursor:'pointer',color:'#374151' }}>Dismiss</button>
            <button style={{ padding:'5px 12px',borderRadius:6,border:'none',background:'#7c3aed',color:'#fff',fontSize:11,cursor:'pointer',fontWeight:500 }}>Apply</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom:16 }}><p style={{ fontSize:12,color:'#6b7280',lineHeight:1.5,margin:0 }}>AI-generated recommendations triggered by Quality Monitor failures or Anomaly Detection events, tied to your declared goals.</p></div>
      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap' }}>
        <span style={{ fontSize:12,color:'#6b7280' }}>Filter by:</span>
        <select value={goalFilter} onChange={e=>setGoalFilter(e.target.value)} style={{ padding:'5px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:12,color:'#374151',background:'#fff',cursor:'pointer' }}>
          <option>All goals (3)</option><option>Increase Average Order Value</option><option>Increase AI Cost Savings</option>
        </select>
        <select value={priFilter} onChange={e=>setPriFilter(e.target.value)} style={{ padding:'5px 10px',border:'1px solid #d1d5db',borderRadius:6,fontSize:12,color:'#374151',background:'#fff',cursor:'pointer' }}>
          <option>All priorities</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
        <span style={{ fontSize:12,color:'#9ca3af' }}>3 results</span>
      </div>
      {suggestions.map(s => <SuggestionCard key={s.id} s={s}/>)}
    </div>
  )
}

// ── Tab: Goals ───────────────────────────────────────────────────────────────
function GoalsTab() {
  const [showAdd, setShowAdd] = useState(false)
  const defaultGoals = [
    { name:'Increase AI-Generated CSAT', description:'Track AI conversation quality using automated CSAT scoring. Target a 4.5/5 average across all AI-handled conversations.', current:'3.9', target:'4.5', trend:'up', linkedMonitor:'AIC AI-CSAT Monitor', pct:65, isDefault:true },
    { name:'Improve Customer Sentiment', description:'Improve the rolling Customer Health Score across all active customers, tracking sentiment, resolution patterns, and escalation rate.', current:'71', target:'85', trend:'up', linkedMonitor:'AIC AI-CSAT Monitor', pct:52, isDefault:true },
  ]
  const customGoals = [
    { name:'Increase Average Order Value', description:'Grow AOV by identifying upsell opportunities during AI-assisted conversations, especially when customers request coupon codes or look up existing orders.', current:'$87', target:'$120', trend:'up', linkedMonitor:'AOV & Upsell Performance Monitor', pct:73, isDefault:false },
    { name:'Increase AI Cost Savings', description:'Reduce cost-per-conversation by expanding AI handling to more use cases (refunds, exchanges) and reducing escalation rate from the current 60%.', current:'$4.20', target:'$2.50', trend:'down', linkedMonitor:'Procedure Adherence Monitor', pct:60, isDefault:false },
  ]
  function GoalCard({ g }) {
    return (
      <div style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:18,background:'#fff' }}>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8 }}>
          <div style={{ fontSize:13,fontWeight:600,color:'#111827',flex:1,paddingRight:8 }}>{g.name}</div>
          <div style={{ display:'flex',alignItems:'center',gap:6 }}>
            {g.isDefault && <span style={{ fontSize:9,background:'#f3f4f6',color:'#6b7280',padding:'2px 6px',borderRadius:10,fontWeight:500 }}>Default</span>}
            <span style={{ fontSize:10,background:'#fef3c7',color:'#d97706',padding:'2px 8px',borderRadius:20,fontWeight:500,whiteSpace:'nowrap' }}>⟳ In progress</span>
            <button style={{ fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',padding:0 }}>Edit</button>
          </div>
        </div>
        <p style={{ fontSize:12,color:'#6b7280',marginBottom:14,lineHeight:1.5 }}>{g.description}</p>
        <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between' }}>
          <div style={{ display:'flex',gap:18 }}>
            <div><div style={{ fontSize:10,color:'#9ca3af',marginBottom:2 }}>Current</div><div style={{ fontSize:18,fontWeight:700,color:'#111827' }}>{g.current}</div></div>
            <div><div style={{ fontSize:10,color:'#9ca3af',marginBottom:2 }}>Target</div><div style={{ fontSize:18,fontWeight:700,color:'#111827' }}>{g.target}</div></div>
          </div>
          <div style={{ textAlign:'right' }}><div style={{ fontSize:10,color:'#9ca3af',marginBottom:2 }}>Last 7 weeks</div><MiniChart trend={g.trend} color={g.trend==='up'?'#10b981':'#6366f1'}/></div>
        </div>
        <div style={{ marginTop:12,paddingTop:10,borderTop:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <span style={{ fontSize:11,color:'#9ca3af' }}>Linked monitor: <span style={{ color:'#6b7280' }}>{g.linkedMonitor}</span></span>
          <span style={{ fontSize:11,color:g.pct>=70?'#10b981':'#f59e0b',fontWeight:500 }}>{g.pct}% to target</span>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div style={{ background:'#f5f3ff',border:'1px solid #ede9fe',borderRadius:8,padding:'10px 14px',marginBottom:20,display:'flex',alignItems:'flex-start',gap:8,fontSize:12,color:'#5b21b6',lineHeight:1.5 }}>
        <span style={{ fontSize:14,marginTop:1 }}>🎯</span>
        <span><strong>Goals are the foundation of your Kustomer deployment</strong> — they drive monitoring thresholds, suggestion priority, and future AI configuration. Every monitor, suggestion, and alert is anchored to a declared outcome.</span>
      </div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
        <p style={{ fontSize:12,color:'#6b7280',maxWidth:560,lineHeight:1.5,margin:0 }}>Define what success looks like for your AI agents and reps. Goals set measurable targets and drive monitoring thresholds, suggestion priority, and future AI configuration.</p>
        <button onClick={() => setShowAdd(true)} style={{ background:'#7c3aed',color:'#fff',border:'none',padding:'8px 14px',borderRadius:6,fontSize:12,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap',marginLeft:16 }}>+ Add Goal</button>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10 }}>Default Goals — Pre-configured for every deployment</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16 }}>{defaultGoals.map(g => <GoalCard key={g.name} g={g}/>)}</div>
      </div>
      <div>
        <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10 }}>Custom Goals — Specific to this deployment</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16 }}>{customGoals.map(g => <GoalCard key={g.name} g={g}/>)}</div>
      </div>
      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)}/>}
    </div>
  )
}

// ── Tab: Quality Monitors ────────────────────────────────────────────────────
function QualityMonitorsTab() {
  const [showEdit, setShowEdit] = useState(false)
  const monitors = [
    { name:'AIC AI-CSAT Monitor', description:'Evaluates tone and whether the AI helped the customer meet their need, reducing the likelihood of repeat contact.', passRate:'78%', kind:'AIC', isDefault:true, criteria:['Tone & empathy','Need resolution','Response clarity','Follow-up appropriateness'], linkedGoal:'Increase AI-Generated CSAT' },
    { name:'Knowledge Base Adherence Monitor', description:'Ensures AI responses align with company policy and use accurate information from the knowledge base — no hallucinated facts or outdated procedures.', passRate:'88%', kind:'AIC', isDefault:false, criteria:['Policy accuracy','KB article citation','No hallucination'], linkedGoal:null },
    { name:'Procedure Adherence Monitor', description:'Checks that the AI used the correct tool calls and follows defined procedures for each use case — address changes, coupon eligibility, and escalation.', passRate:'64%', kind:'AIC', isDefault:false, criteria:['Correct tool calls','Address change validation','Handoff protocol','Escalation triggers'], linkedGoal:'Increase AI Cost Savings' },
    { name:'AOV & Upsell Performance Monitor', description:'Evaluates whether the AI identifies upsell opportunities during conversations, recommends relevant products, and avoids defaulting straight to coupon issuance.', passRate:'42%', kind:'AIC', isDefault:false, criteria:['Upsell opportunity identified','Recommendation relevance to order history','Coupon-first behaviour avoided','Conversion attempt made'], linkedGoal:'Increase Average Order Value' },
  ]
  const kindColor = { AIC:{ bg:'#eff6ff',color:'#1d4ed8' }, AIR:{ bg:'#f0fdf4',color:'#15803d' }, All:{ bg:'#f9fafb',color:'#6b7280' } }
  function MonitorCard({ m }) {
    const kc = kindColor[m.kind]
    return (
      <div style={{ border:'1px solid #e5e7eb',borderRadius:10,padding:18,background:'#fff' }}>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:6 }}>
          <div style={{ fontSize:13,fontWeight:600,color:'#111827',flex:1,paddingRight:8 }}>{m.name}</div>
          <div style={{ display:'flex',alignItems:'center',gap:5,flexShrink:0 }}>
            {m.isDefault && <span style={{ fontSize:9,background:'#f3f4f6',color:'#6b7280',padding:'2px 6px',borderRadius:10,fontWeight:500 }}>Default</span>}
            <span style={{ fontSize:9,background:kc.bg,color:kc.color,padding:'2px 6px',borderRadius:10,fontWeight:600 }}>{m.kind}</span>
            <span style={{ fontSize:10,background:'#ecfdf5',color:'#059669',padding:'2px 8px',borderRadius:20,fontWeight:500 }}>✓ Active</span>
            <button onClick={() => setShowEdit(true)} style={{ fontSize:11,color:'#7c3aed',background:'none',border:'none',cursor:'pointer',padding:0 }}>Edit</button>
          </div>
        </div>
        <p style={{ fontSize:11,color:'#6b7280',marginBottom:12,lineHeight:1.5 }}>{m.description}</p>
        <div style={{ display:'flex',gap:16,marginBottom:10 }}>
          <div><div style={{ fontSize:10,color:'#9ca3af' }}>Pass rate</div><div style={{ fontSize:16,fontWeight:700,color:'#111827' }}>{m.passRate}</div></div>
          <div><div style={{ fontSize:10,color:'#9ca3af' }}>{m.criteria.length} criteria</div></div>
        </div>
        <div style={{ display:'flex',flexWrap:'wrap',gap:4,marginBottom:m.linkedGoal?10:0 }}>
          {m.criteria.map(c => <span key={c} style={{ fontSize:10,background:'#f3f4f6',color:'#6b7280',padding:'2px 6px',borderRadius:4 }}>{c}</span>)}
        </div>
        {m.linkedGoal && <div style={{ marginTop:8,paddingTop:8,borderTop:'1px solid #f3f4f6',fontSize:11,color:'#9ca3af' }}>Linked goal: <span style={{ color:'#7c3aed' }}>{m.linkedGoal}</span></div>}
      </div>
    )
  }
  return (
    <div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <p style={{ fontSize:12,color:'#6b7280',maxWidth:600,lineHeight:1.5,margin:0 }}>Automatically score every AI-handled and human-assisted conversation against configurable criteria. Failures generate Suggestions and feed directly into goal progress tracking.</p>
        <button onClick={() => setShowEdit(true)} style={{ background:'#7c3aed',color:'#fff',border:'none',padding:'8px 14px',borderRadius:6,fontSize:12,fontWeight:500,cursor:'pointer',whiteSpace:'nowrap',marginLeft:16 }}>+ Add Monitor</button>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10 }}>Default Monitors — Active out of the box</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>{monitors.filter(m=>m.isDefault).map(m=><MonitorCard key={m.name} m={m}/>)}</div>
      </div>
      <div>
        <div style={{ fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10 }}>Custom Monitors</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>{monitors.filter(m=>!m.isDefault).map(m=><MonitorCard key={m.name} m={m}/>)}</div>
      </div>
      {showEdit && <EditMonitorModal onClose={() => setShowEdit(false)}/>}
    </div>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function NavIconBtn({ Icon, active, badge }) {
  return (
    <div style={{ position:'relative',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,cursor:'pointer',color:active?'#fff':'#6b7280',background:active?'#2d2f3a':'transparent' }}><Icon/></div>
      {badge && <div style={{ position:'absolute',top:0,right:-2,background:'#7c3aed',color:'#fff',borderRadius:10,fontSize:9,fontWeight:700,padding:'1px 4px',lineHeight:1.4,minWidth:16,textAlign:'center' }}>{badge}</div>}
    </div>
  )
}

function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id:'dashboard', label:'Dashboard' },
    { id:'suggestions', label:'Suggestions' },
    { id:'goals', label:'Goals' },
    { id:'monitors', label:'Quality Monitors' },
  ]
  return (
    <div style={{ display:'flex',height:'100vh' }}>
      {/* Dark icon strip */}
      <div style={{ width:56,minWidth:56,background:'#1e1f26',display:'flex',flexDirection:'column',alignItems:'center',paddingTop:12,paddingBottom:12,gap:4,height:'100vh',boxSizing:'border-box' }}>
        <div style={{ marginBottom:8 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#FFE234"/><circle cx="11.5" cy="13.5" r="1.8" fill="#1a1a1a"/><circle cx="20.5" cy="13.5" r="1.8" fill="#1a1a1a"/><path d="M11 19.5 Q16 24 21 19.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>
        </div>
        <NavIconBtn Icon={HomeIcon} active={false}/>
        <NavIconBtn Icon={SparkleIcon} active={false}/>
        <div style={{ width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'#7c3aed',cursor:'pointer',color:'#fff' }}><AIQAIcon/></div>
        <NavIconBtn Icon={InboxIcon} active={false} badge="29"/>
        <div style={{ flex:1 }}/>
        <NavIconBtn Icon={PieIcon} active={false}/>
        <NavIconBtn Icon={ActivityIcon} active={false}/>
        <NavIconBtn Icon={GridIcon} active={false}/>
        <NavIconBtn Icon={SettingsIcon} active={false}/>
        <div style={{ height:16 }}/>
        <NavIconBtn Icon={SearchIcon} active={false}/>
        <NavIconBtn Icon={BookIcon} active={false}/>
        <NavIconBtn Icon={BellIcon} active={false}/>
        <NavIconBtn Icon={HelpIcon} active={false}/>
        <div style={{ marginTop:8,width:30,height:30,borderRadius:'50%',background:'#4f46e5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',cursor:'pointer' }}>AS</div>
      </div>
      {/* AI QA secondary sidebar */}
      <div style={{ width:176,minWidth:176,background:'#fff',borderRight:'1px solid #e5e7eb',display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',boxSizing:'border-box' }}>
        <div style={{ padding:'14px 12px 12px',borderBottom:'1px solid #f0f0f0' }}>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:8 }}>
            <div style={{ width:20,height:20,background:'#7c3aed',borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center' }}><AIQAIcon size={12}/></div>
            <span style={{ fontWeight:700,fontSize:13,color:'#111827' }}>AI QA</span>
          </div>
          <div style={{ display:'inline-flex',alignItems:'center',gap:4,background:'#f3f0ff',border:'1px solid #ede9fe',borderRadius:20,padding:'2px 8px',fontSize:10,color:'#7c3aed',fontWeight:500 }}>🎯 Powered by Goals</div>
        </div>
        <div style={{ padding:'8px 0',flex:1,overflow:'auto' }}>
          {navItems.map(item => {
            const active = activeTab === item.id
            return (
              <div key={item.id} onClick={() => setActiveTab(item.id)} style={{ padding:'6px 12px',display:'flex',alignItems:'center',cursor:'pointer',fontSize:12,fontWeight:active?600:400,color:active?'#7c3aed':'#6b7280',background:active?'#f3f0ff':'transparent',borderLeft:active?'2px solid #7c3aed':'2px solid transparent' }}>
                {item.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main Content ─────────────────────────────────────────────────────────────
function MainContent({ activeTab, setActiveTab }) {
  const tabs = [
    { id:'dashboard', label:'Dashboard' },
    { id:'suggestions', label:'Suggestions' },
    { id:'goals', label:'Goals' },
    { id:'monitors', label:'Quality Monitors' },
  ]
  const label = tabs.find(t => t.id === activeTab)?.label ?? ''
  return (
    <div style={{ flex:1,display:'flex',flexDirection:'column',minWidth:0,background:'#fff' }}>
      <div style={{ padding:'18px 24px 16px',borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ fontSize:16,fontWeight:700,color:'#111827' }}>{label}</div>
      </div>
      <div style={{ flex:1,overflow:'auto',padding:'24px' }}>
        {activeTab==='dashboard' && <DashboardTab setActiveTab={setActiveTab}/>}
        {activeTab==='suggestions' && <SuggestionsTab/>}
        {activeTab==='goals' && <GoalsTab/>}
        {activeTab==='monitors' && <QualityMonitorsTab/>}
      </div>
    </div>
  )
}

// ── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  return (
    <div style={{ display:'flex',height:'100vh',overflow:'hidden',background:'#fff',width:'100%',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
      <MainContent activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  )
}
