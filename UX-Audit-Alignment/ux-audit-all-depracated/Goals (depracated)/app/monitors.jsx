// Monitors — v3 UI adapted for v2 shell + live K_DATA

function MonitorsList({ navigate, openModal, editMonitorId }) {
  const { monitors, goals, flaggedConversations } = window.K_DATA;
  const goalById = Object.fromEntries(goals.map((g) => [g.id, g]));
  const [showEdit, setShowEdit] = React.useState(false);

  const C = {
    border:'#dce0e9', surface:'#ffffff', surfaceHi:'#f9fafb',
    textPrimary:'#1A1D23', textSec:'#5A6478', textMuted:'#8A94A6',
    purple:'#7c3aed', purpleLight:'#f5f3ff', purpleBor:'#ddd6fe',
    green:'#16a34a', greenBg:'#f0fdf4', greenBor:'#86efac',
    amber:'#d97706', amberBg:'#fffbeb', amberBor:'#fcd34d',
    red:'#dc2626', redBg:'#fef2f2', redBor:'#fecaca',
    blue:'#2563eb', blueBg:'#eff6ff', blueBor:'#bfdbfe',
  };
  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  function stateProps(passRate) {
    const n = parseInt(passRate);
    if (n >= 85) return { label:'Within target range', color:C.green,  bg:C.greenBg,  border:C.greenBor };
    if (n >= 70) return { label:'Review recommended',  color:C.blue,   bg:C.blueBg,   border:C.blueBor  };
    if (n >= 60) return { label:'Needs attention',     color:C.amber,  bg:C.amberBg,  border:C.amberBor };
    if (n >= 45) return { label:'Significant decline', color:C.red,    bg:C.redBg,    border:C.redBor   };
    return             { label:'Urgent review needed', color:'#b91c1c',bg:'#fef2f2',  border:'#fca5a5'  };
  }

  const ChevronIcon = ({ open }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.2s' }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );

  function PassBar({ pct, color }) {
    return (
      <div style={{ height:5, background:C.surfaceHi, borderRadius:99, overflow:'hidden', border:`1px solid ${C.border}` }}>
        <div style={{ height:'100%', borderRadius:99, width:`${pct}%`, background:color }}/>
      </div>
    );
  }

  function ConvRow({ c }) {
    const [status, setStatus] = React.useState('pending');
    if (status === 'false_positive') return (
      <div style={{ padding:'7px 10px', borderRadius:6, background:C.surfaceHi, border:`1px solid ${C.border}`, marginBottom:6, display:'flex', alignItems:'center', gap:8, opacity:0.5 }}>
        <span style={{ fontSize:11, fontWeight:600, color:C.purple, fontFamily:'monospace' }}>{c.id}</span>
        <span style={{ fontSize:11, color:C.textMuted, flex:1 }}>Not flagged as an issue</span>
        <button onClick={() => setStatus('pending')} style={{ fontSize:10, color:C.purple, background:'none', border:'none', cursor:'pointer', padding:0 }}>Undo</button>
      </div>
    );
    const confColor = c.confidence === 'high' ? C.green : C.amber;
    return (
      <div style={{ padding:'8px 10px', borderRadius:6, background:status==='confirmed'?C.greenBg:C.surfaceHi, border:`1px solid ${status==='confirmed'?C.greenBor:C.border}`, marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
          <span style={{ fontSize:12, fontWeight:600, color:C.purple, fontFamily:'monospace', flexShrink:0 }}>{c.id}</span>
          <span style={{ fontSize:9, fontWeight:600, color:confColor, background:c.confidence==='high'?C.greenBg:C.amberBg, border:`1px solid ${c.confidence==='high'?C.greenBor:C.amberBor}`, padding:'1px 5px', borderRadius:4 }}>High confidence</span>
          <span style={{ fontSize:11, fontWeight:700, color:C.red, marginLeft:'auto' }}>{c.score}</span>
          <span style={{ fontSize:10, color:C.textMuted }}>{c.timeAgo}</span>
        </div>
        <div style={{ fontSize:11, color:C.textSec, lineHeight:1.5, marginBottom:8 }}>Possible issue: {c.preview}</div>
        <div style={{ display:'flex', gap:6 }}>
          {status === 'pending' ? (
            <>
              <button onClick={() => setStatus('confirmed')} style={{ fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:5, border:`1px solid ${C.greenBor}`, background:C.greenBg, color:C.green, cursor:'pointer' }}>Worth reviewing</button>
              <button onClick={() => setStatus('false_positive')} style={{ fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:5, border:`1px solid ${C.border}`, background:C.surface, color:C.textMuted, cursor:'pointer' }}>No action needed</button>
            </>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:10, fontWeight:600, color:C.green }}>✓ Marked for review</span>
              <button onClick={() => setStatus('pending')} style={{ fontSize:10, color:C.textMuted, background:'none', border:'none', cursor:'pointer', padding:0 }}>Undo</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function MonitorCard({ m, autoEdit }) {
    const [showCriteria, setShowCriteria] = React.useState(false);
    const [showConvos, setShowConvos]     = React.useState(false);
    const [editOpen, setEditOpen]         = React.useState(false);
    const [panelVisible, setPanelVisible] = React.useState(false);

    // Editable form state
    const [editName, setEditName]         = React.useState(m.name);
    const [editDesc, setEditDesc]         = React.useState(m.description || '');
    const [editGoalId, setEditGoalId]     = React.useState(m.goalIds?.[0] || '');
    const [editThreshold, setEditThreshold] = React.useState(m.threshold);
    const [editConvOnly, setEditConvOnly] = React.useState(m.kind === 'aic');
    const [editCriteria, setEditCriteria] = React.useState((m.criteria || []).map(c => ({ ...c })));
    const [editAlertEnabled, setEditAlertEnabled] = React.useState(m.alerting?.enabled !== false);
    const [editCadence, setEditCadence]   = React.useState(m.alerting?.cadence || 'daily');
    const [editChannels, setEditChannels] = React.useState(m.alerting?.channels || []);
    const [editSuggestions, setEditSuggestions] = React.useState(m.suggestionsEnabled !== false);

    // Saved (display) state
    const [savedName, setSavedName]       = React.useState(m.name);
    const [savedGoalId, setSavedGoalId]   = React.useState(m.goalIds?.[0] || '');
    const [savedThreshold, setSavedThreshold] = React.useState(m.threshold);
    const [toast, setToast]               = React.useState(false);

    const savedGoal = goalById[savedGoalId]?.name || '';
    function openPanel() {
      setEditName(savedName);
      setEditDesc(m.description || '');
      setEditGoalId(savedGoalId);
      setEditThreshold(savedThreshold);
      setEditConvOnly(m.kind === 'aic');
      setEditCriteria((m.criteria || []).map(c => ({ ...c })));
      setEditAlertEnabled(m.alerting?.enabled !== false);
      setEditCadence(m.alerting?.cadence || 'daily');
      setEditChannels([...(m.alerting?.channels || [])]);
      setEditSuggestions(m.suggestionsEnabled !== false);
      setEditOpen(true);
      requestAnimationFrame(() => setPanelVisible(true));
    }
    function closePanel() {
      setPanelVisible(false);
      setTimeout(() => setEditOpen(false), 280);
    }

    React.useEffect(() => {
      if (autoEdit) openPanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoEdit]);

    const flagged = flaggedConversations.filter(c => c.monitorId === m.id);
    const trend = m.trend || [];
    const trendDir = trend.length >= 2 ? (trend[trend.length-1] > trend[trend.length-2] ? 'up' : 'down') : null;
    const breached = m.passRate < savedThreshold;
    const dotColor = breached ? C.red : C.blue;

    function saveEdit() {
      setSavedName(editName);
      setSavedGoalId(editGoalId);
      setSavedThreshold(parseInt(editThreshold)||m.threshold);
      closePanel();
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    }
    function cancelEdit() {
      setEditName(savedName); setEditGoalId(savedGoalId); setEditThreshold(savedThreshold);
      closePanel();
    }

    const btnPrimary   = { font:'600 13px/20px Inter,sans-serif', color:'#fff', background:'#1C6EF2', border:'none', borderRadius:6, padding:'7px 16px', cursor:'pointer' };
    const btnSecondary = { font:'600 13px/20px Inter,sans-serif', color:'#5A6478', background:'#fff', border:'1px solid #DCE0E9', borderRadius:6, padding:'7px 16px', cursor:'pointer' };

    return (
      <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:8, boxShadow:'0 2px 5px rgba(0,0,0,0.06)', overflow:'hidden', fontFamily:FF, marginBottom:14 }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'16px 20px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:dotColor, flexShrink:0 }}/>
              <span style={{ font:'700 16px/20px Inter,sans-serif', color:'#1A1D23' }}>{savedName}</span>
              {m.isDefault
                ? <span style={{ font:'600 11px/14px Inter,sans-serif', color:'#5A6478', background:'#F4F5F7', border:'1px solid #DCE0E9', borderRadius:4, padding:'2px 7px' }}>Default</span>
                : <span style={{ font:'600 11px/14px Inter,sans-serif', color:'#1C6EF2', background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:4, padding:'2px 7px' }}>Custom</span>
              }
            </div>
            {savedGoal ? (
              <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'500 11px/14px Inter,sans-serif', color:'#1B3D8F', background:'#EEF4FF', border:'1px solid #DCE6FF', borderRadius:99, padding:'2px 8px 2px 7px', whiteSpace:'nowrap', flexShrink:0 }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="2.5" cy="2.5" r="1.4"/><circle cx="6.5" cy="6.5" r="1.4"/><path d="M3.5 3.5l2 2" strokeLinecap="round"/></svg>
                  Powers goal
                </span>
                <a onClick={() => navigate && navigate({ screen:'goal', id:savedGoalId })} style={{ font:'600 12px/16px Inter,sans-serif', color:'#1C6EF2', textDecoration:'none', cursor:'pointer', whiteSpace:'nowrap' }}>{savedGoal}</a>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'500 11px/14px Inter,sans-serif', color:'#5A6478', background:'#F4F5F7', border:'1px solid #DCE0E9', borderRadius:99, padding:'2px 8px 2px 7px', whiteSpace:'nowrap', flexShrink:0 }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="4.5" cy="4.5" r="3"/></svg>
                  Standalone
                </span>
                <span style={{ font:'400 12px/16px Inter,sans-serif', color:'#8A94A6' }}>Not linked to a goal · {m.purpose === 'compliance' ? 'compliance watchdog' : m.purpose === 'observability' ? 'operational signal' : 'monitor only'}</span>
              </div>
            )}
          </div>
          <button onClick={openPanel} style={{ font:'600 13px/18px Inter,sans-serif', color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>Edit</button>
        </div>

        {/* Edit panel — slide-out right rail */}
        {editOpen && (
          <>
            <div onClick={cancelEdit} style={{
              position:'fixed', inset:0, background:'rgba(15,18,25,0.32)', zIndex:200,
              opacity: panelVisible ? 1 : 0, transition:'opacity 0.24s ease',
            }}/>
            <div style={{
              position:'fixed', top:0, right:0, bottom:0, width:560, maxWidth:'92vw',
              background:'#fff', boxShadow:'-8px 0 32px rgba(15,18,25,0.18)',
              zIndex:201, display:'flex', flexDirection:'column',
              transform: panelVisible ? 'translateX(0)' : 'translateX(100%)',
              transition:'transform 0.32s cubic-bezier(0.22,1,0.36,1)',
              fontFamily:FF,
            }}>
              {/* Header */}
              <div style={{ padding:'18px 22px 14px', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, letterSpacing:0.4, textTransform:'uppercase', marginBottom:4 }}>Edit monitor</div>
                    <h2 style={{ fontSize:20, fontWeight:700, color:C.textPrimary, margin:0, lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{savedName}</h2>
                    <div style={{ fontSize:13, color:C.textSec, marginTop:6, lineHeight:1.5 }}>
                      Update configuration, evaluation thresholds, and weighted scoring criteria.
                    </div>
                  </div>
                  <button onClick={cancelEdit} style={{ background:'none', border:'none', cursor:'pointer', padding:6, color:C.textMuted, height:32, width:32, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ flex:1, overflowY:'auto', padding:'18px 22px 24px' }}>
                {/* Name */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Monitor name</label>
                  <input value={editName} onChange={e=>setEditName(e.target.value)} style={{
                    width:'100%', padding:'9px 12px', borderRadius:6, border:`1px solid ${C.border}`,
                    fontSize:13, fontFamily:FF, color:C.textPrimary, outline:'none', height:36, boxSizing:'border-box',
                  }}/>
                </div>

                {/* Linked goal */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Linked business outcome</label>
                  <select value={editGoalId} onChange={e=>setEditGoalId(e.target.value)} style={{
                    width:'100%', padding:'9px 12px', borderRadius:6, border:`1px solid ${C.border}`,
                    fontSize:13, fontFamily:FF, color:C.textPrimary, outline:'none', height:36, background:'#fff',
                  }}>
                    <option value="">— Don't link to a goal —</option>
                    {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                {/* Coverage */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Coverage</label>
                  <div style={{ display:'inline-flex', borderRadius:6, border:`1px solid ${C.border}`, overflow:'hidden' }}>
                    {[
                      { id:false, label:'AI + human-assisted' },
                      { id:true,  label:'AI-handled only' },
                    ].map(o => (
                      <button key={String(o.id)} onClick={()=>setEditConvOnly(o.id)} style={{
                        padding:'8px 14px', border:'none', cursor:'pointer', fontFamily:FF,
                        background: editConvOnly===o.id ? '#1C6EF2' : '#fff',
                        color: editConvOnly===o.id ? '#fff' : C.textSec,
                        fontSize:12, fontWeight:600, height:34,
                      }}>{o.label}</button>
                    ))}
                  </div>
                </div>

                {/* Threshold */}
                <div style={{ marginBottom:22 }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Quality threshold</label>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <input type="range" min="50" max="100" value={editThreshold} onChange={e=>setEditThreshold(parseInt(e.target.value))} style={{ flex:1 }}/>
                    <span style={{ fontSize:13, fontWeight:600, color:C.textPrimary, minWidth:38, textAlign:'right' }}>{editThreshold}%</span>
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>Conversations scoring below this trigger review.</div>
                </div>

                {/* Scoring criteria */}
                <div style={{ marginTop:22, paddingTop:18, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>Scoring criteria</div>
                    <div style={{ fontSize:11, color: (editCriteria.reduce((s,c)=>s+(parseInt(c.weight)||0),0) === 100) ? '#22A05B' : '#D9534F', fontWeight:600 }}>
                      Total weight: {editCriteria.reduce((s,c)=>s+(parseInt(c.weight)||0),0)}%
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:C.textSec, marginBottom:12, lineHeight:1.5 }}>Define what evaluation looks for. Weights determine how much each criterion contributes — should sum to 100%.</div>

                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {editCriteria.map((c, idx) => (
                      <div key={idx} style={{ padding:'12px 14px', background:'#FAFBFC', border:`1px solid ${C.border}`, borderRadius:8 }}>
                        <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                          <input value={c.name || ''} onChange={e => setEditCriteria(p => p.map((x,i)=>i===idx?{...x, name:e.target.value}:x))} placeholder="Criterion name" style={{
                            flex:1, padding:'7px 10px', borderRadius:6, border:`1px solid ${C.border}`,
                            fontSize:13, fontFamily:FF, color:C.textPrimary, outline:'none', height:34, background:'#fff',
                          }}/>
                          <button onClick={() => setEditCriteria(p => p.filter((_,i)=>i!==idx))} title="Remove" style={{
                            background:'none', border:`1px solid ${C.border}`, borderRadius:6, padding:'0 8px', height:34,
                            cursor:'pointer', color:C.textMuted, fontSize:14,
                          }}>×</button>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
                          <span style={{ fontSize:11, color:C.textMuted, fontWeight:600, minWidth:50 }}>Weight</span>
                          <input type="range" min="0" max="100" value={c.weight || 0} onChange={e => setEditCriteria(p => p.map((x,i)=>i===idx?{...x, weight:parseInt(e.target.value)}:x))} style={{ flex:1 }}/>
                          <span style={{ fontSize:13, fontWeight:600, color:C.textPrimary, minWidth:38, textAlign:'right' }}>{c.weight || 0}%</span>
                          <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:C.textSec, cursor:'pointer', marginLeft:8 }}>
                            <input type="checkbox" checked={!!c.essential} onChange={e => setEditCriteria(p => p.map((x,i)=>i===idx?{...x, essential:e.target.checked}:x))}/>
                            Essential
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setEditCriteria(p => [...p, { name:'', weight:0, essential:false }])} style={{
                    marginTop:10, padding:'9px 12px', borderRadius:6, border:`1px dashed ${C.border}`,
                    background:'#fff', cursor:'pointer', fontSize:12, color:C.textSec, width:'100%', textAlign:'left', fontFamily:FF,
                  }}>+ Add criterion</button>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding:'14px 22px', borderTop:`1px solid ${C.border}`, background:'#fff', display:'flex', justifyContent:'flex-end', gap:8 }}>
                <button onClick={cancelEdit} style={{ padding:'8px 16px', borderRadius:6, border:`1px solid ${C.border}`, background:'#fff', fontSize:13, fontWeight:600, color:C.textSec, cursor:'pointer', fontFamily:FF, height:36 }}>Cancel</button>
                <button onClick={saveEdit} style={{ padding:'8px 16px', borderRadius:6, border:'none', background:'#1C6EF2', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:FF, height:36 }}>Save changes</button>
              </div>
            </div>
          </>
        )}

        {/* Metrics row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:`1px solid #F0F2F6` }}>
          <div style={{ display:'flex', flexDirection:'column', gap:3, padding:'14px 20px', borderRight:`1px solid ${C.border}` }}>
            <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Pass rate</span>
            <span style={{ font:'700 30px/36px Inter,sans-serif', color:'#1C6EF2' }}>{m.passRate}%</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3, padding:'14px 20px', borderRight:`1px solid ${C.border}` }}>
            <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Human reviewers</span>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#22A05B" strokeWidth="1.3"/><path d="M4 7l2.5 2.5L10 5" stroke="#22A05B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ font:'600 13px/18px Inter,sans-serif', color:'#22A05B' }}>87% agreed</span>
            </div>
            <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#5A6478' }}>High confidence · this period</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3, padding:'14px 20px' }}>
            <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Trend</span>
            <span style={{ font:'600 13px/18px Inter,sans-serif', color: trendDir==='up' ? '#22A05B' : trendDir==='down' ? C.red : C.textMuted, marginTop:2 }}>
              {trendDir==='up' ? '↑ Trending up' : trendDir==='down' ? '↓ Trending down' : '→ Stable'}
            </span>
            <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#5A6478' }}>Last 7 days</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding:'10px 20px 12px' }}>
          <div style={{ height:4, background:'#E8EBF0', borderRadius:2, position:'relative', marginBottom:6 }}>
            <div style={{ height:4, background:'#1C6EF2', borderRadius:2, width:`${m.passRate}%`, transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)' }}/>
            <div style={{ position:'absolute', top:-3, left:`${savedThreshold}%`, width:2, height:10, background:'#B0B8C8', borderRadius:1 }}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Threshold: {savedThreshold}%</span>
            <span style={{ font:'600 11px/14px Inter,sans-serif', color:'#1C6EF2' }}>{m.passRate}% passing</span>
          </div>
        </div>

        {/* Accordion rows */}
        <div style={{ borderTop:`1px solid ${C.border}` }}>

          {/* Criteria */}
          <div>
            <div onClick={() => setShowCriteria(v=>!v)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 20px', borderBottom:`1px solid ${C.border}`, cursor:'pointer', transition:'background 0.1s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#F8F9FB'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ font:'600 13px/18px Inter,sans-serif', color:'#1A1D23' }}>See scoring criteria</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ font:'400 12px/18px Inter,sans-serif', color:'#8A94A6' }}>{(m.criteria||[]).length} criteria</span>
                <svg style={{ color:'#B0B8C8', transition:'transform 0.18s', transform: showCriteria?'rotate(90deg)':'rotate(0deg)' }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            {showCriteria && (
              <div style={{ background:'#FAFBFC', borderBottom:`1px solid ${C.border}`, padding:'4px 20px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #E8EBF0', marginBottom:10 }}>
                  <span style={{ font:'400 12px/16px Inter,sans-serif', color:'#8A94A6' }}>Total evaluated this period</span>
                  <span style={{ font:'600 12px/16px Inter,sans-serif', color:'#1A1D23' }}>{(m.evals30d||0).toLocaleString()} conversations</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {(m.criteria||[]).map(c => {
                    const cColor = c.pass >= 80 ? '#22A05B' : c.pass >= 65 ? '#D4A017' : C.red;
                    return (
                      <div key={c.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ font:'400 12px/16px Inter,sans-serif', color:'#5A6478' }}>{c.name}</span>
                        <span style={{ font:'600 12px/16px Inter,sans-serif', color:cColor }}>{c.pass}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Conversations */}
          <div>
            <div onClick={() => setShowConvos(v=>!v)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 20px', cursor:'pointer', transition:'background 0.1s', borderBottom: showConvos ? `1px solid ${C.border}` : 'none' }}
              onMouseEnter={e=>e.currentTarget.style.background='#F8F9FB'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ font:'600 13px/18px Inter,sans-serif', color:'#1A1D23' }}>Review low-scoring conversations</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ font:'400 12px/18px Inter,sans-serif', color:'#8A94A6' }}>{flagged.length} conversations</span>
                <svg style={{ color:'#B0B8C8', transition:'transform 0.18s', transform: showConvos?'rotate(90deg)':'rotate(0deg)' }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            {showConvos && flagged.length > 0 && (
              <div style={{ background:'#FAFBFC', padding:'4px 20px 14px' }}>
                {flagged.map((c, i) => (
                  <div key={c.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom: i < flagged.length-1 ? '1px solid #E8EBF0' : 'none' }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                      <span style={{ font:'600 12px/16px Inter,sans-serif', color:'#1C6EF2', cursor:'pointer' }}>{c.id} — {c.customer}</span>
                      <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>{c.customerCompany} · {c.timeAgo}</span>
                    </div>
                    <span style={{ font:'700 13px/18px Inter,sans-serif', color:'#C53030' }}>{c.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1A1D23', color:'#fff', font:'600 13px/20px Inter,sans-serif', padding:'10px 18px', borderRadius:8, zIndex:100, whiteSpace:'nowrap' }}>
            Changes saved
          </div>
        )}
      </div>
    );
  }

  const linkedMonitors    = monitors.filter(m => (m.goalIds || []).length > 0);
  const standaloneMonitors = monitors.filter(m => (m.goalIds || []).length === 0);

  // ── Add monitoring slide-out ──────────────────────────────────────────────
  const [createOpen, setCreateOpen]     = React.useState(false);
  const [createVisible, setCreateVisible] = React.useState(false);
  function openCreate() { setCreateOpen(true); requestAnimationFrame(() => setCreateVisible(true)); }
  function closeCreate() { setCreateVisible(false); setTimeout(() => setCreateOpen(false), 280); }

  function CreateMonitorPanel() {
    const TEMPLATES = [
      { id:'esc',  title:'Escalation handling',     desc:'Identify when AI should hand off to a human and whether handoffs happen on time.', goalHint:'CSAT', threshold:85 },
      { id:'proc', title:'Procedure adherence',     desc:'Track whether AI follows defined procedures and uses the correct tools.',           goalHint:'Quality', threshold:90 },
      { id:'kb',   title:'Knowledge grounding',     desc:'Detect responses that aren\'t supported by approved knowledge sources.',             goalHint:'Accuracy', threshold:88 },
      { id:'res',  title:'AI-assisted resolution',  desc:'Monitor first-contact resolution quality on AI-handled conversations.',              goalHint:'Resolution', threshold:80 },
    ];
    const [tpl, setTpl]             = React.useState(null);
    const [name, setName]           = React.useState('');
    const [linkedGoal, setLinkedGoal] = React.useState(goals[0]?.id || '');
    const [coverage, setCoverage]   = React.useState('all'); // 'all' | 'ai_only'
    const [threshold, setThreshold] = React.useState(85);
    const [advanced, setAdvanced]   = React.useState(false);

    function pickTpl(t) {
      setTpl(t.id); setName(t.title); setThreshold(t.threshold);
    }

    return (
      <>
        {/* Scrim */}
        <div onClick={closeCreate} style={{
          position:'fixed', inset:0, background:'rgba(15,18,25,0.32)', zIndex:200,
          opacity: createVisible ? 1 : 0, transition:'opacity 0.24s ease',
        }}/>
        {/* Panel */}
        <div style={{
          position:'fixed', top:0, right:0, bottom:0, width:540, maxWidth:'92vw',
          background:'#fff', boxShadow:'-8px 0 32px rgba(15,18,25,0.18)',
          zIndex:201, display:'flex', flexDirection:'column',
          transform: createVisible ? 'translateX(0)' : 'translateX(100%)',
          transition:'transform 0.32s cubic-bezier(0.22,1,0.36,1)',
          fontFamily:FF,
        }}>
          {/* Header */}
          <div style={{ padding:'18px 22px 14px', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, letterSpacing:0.4, textTransform:'uppercase', marginBottom:4 }}>Operational monitoring</div>
                <h2 style={{ fontSize:20, fontWeight:700, color:C.textPrimary, margin:0, lineHeight:1.3 }}>Add monitoring</h2>
                <div style={{ fontSize:13, color:C.textSec, marginTop:6, lineHeight:1.5 }}>
                  Configure oversight for an AI workflow. Kustomer handles evaluation and surfaces signals for your review.
                </div>
              </div>
              <button onClick={closeCreate} style={{ background:'none', border:'none', cursor:'pointer', padding:6, color:C.textMuted, height:32, width:32, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
              </button>
            </div>
            {/* Trust strip */}
            <div style={{ marginTop:14, padding:'9px 12px', background:'#F5F8FF', border:`1px solid #DCE6FF`, borderRadius:6, fontSize:12, color:'#1B3D8F', lineHeight:1.5, display:'flex', gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1B3D8F" strokeWidth="1.4" style={{ flexShrink:0, marginTop:2 }}><circle cx="7" cy="7" r="5.5"/><path d="M7 4.5v3M7 9.2v.1"/></svg>
              <span>AI evaluations are calibrated against human review. Recommendations require approval — signals are operational guidance, not final judgments.</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex:1, overflowY:'auto', padding:'18px 22px 24px' }}>

            {/* 1. Pattern */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>Choose a monitoring pattern</div>
              <div style={{ fontSize:12, color:C.textSec, marginBottom:10, lineHeight:1.5 }}>The system already understands common operational patterns. Pick one to start, or build a custom monitor below.</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {TEMPLATES.map(t => {
                  const active = tpl === t.id;
                  return (
                    <button key={t.id} onClick={() => pickTpl(t)} style={{
                      textAlign:'left', padding:'12px 14px', borderRadius:8,
                      border:`1px solid ${active ? '#1C6EF2' : C.border}`,
                      background: active ? '#F5F8FF' : '#fff',
                      cursor:'pointer', fontFamily:FF,
                      boxShadow: active ? '0 0 0 3px rgba(28,110,242,0.12)' : 'none',
                      transition:'all 0.15s ease',
                    }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{t.title}</div>
                      <div style={{ fontSize:11, color:C.textSec, lineHeight:1.45 }}>{t.desc}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { setTpl('custom'); setName(''); }} style={{
                marginTop:8, padding:'9px 12px', borderRadius:6, border:`1px dashed ${C.border}`,
                background: tpl === 'custom' ? '#F8F9FB' : '#fff', cursor:'pointer',
                fontSize:12, color:C.textSec, width:'100%', textAlign:'left', fontFamily:FF,
              }}>+ Build a custom monitor</button>
            </div>

            {tpl && <>
              {/* 2. Name */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Monitor name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Escalation Handling Monitor" style={{
                  width:'100%', padding:'9px 12px', borderRadius:6, border:`1px solid ${C.border}`,
                  fontSize:13, fontFamily:FF, color:C.textPrimary, outline:'none', height:36, boxSizing:'border-box',
                }}/>
              </div>

              {/* 3. Purpose toggle — Power a goal OR Standalone */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>What's this monitor for?</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <button onClick={() => setLinkedGoal(goals[0]?.id || '')} style={{
                    textAlign:'left', padding:'11px 13px', borderRadius:8,
                    border:`1px solid ${linkedGoal ? '#1C6EF2' : C.border}`,
                    background: linkedGoal ? '#F5F8FF' : '#fff',
                    cursor:'pointer', fontFamily:FF,
                    boxShadow: linkedGoal ? '0 0 0 3px rgba(28,110,242,0.10)' : 'none',
                    transition:'all 0.15s ease',
                  }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:3 }}>Power a goal</div>
                    <div style={{ fontSize:11, color:C.textSec, lineHeight:1.4 }}>Scores feed a goal you're trying to hit.</div>
                  </button>
                  <button onClick={() => setLinkedGoal('')} style={{
                    textAlign:'left', padding:'11px 13px', borderRadius:8,
                    border:`1px solid ${!linkedGoal ? '#1C6EF2' : C.border}`,
                    background: !linkedGoal ? '#F5F8FF' : '#fff',
                    cursor:'pointer', fontFamily:FF,
                    boxShadow: !linkedGoal ? '0 0 0 3px rgba(28,110,242,0.10)' : 'none',
                    transition:'all 0.15s ease',
                  }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:3 }}>Just monitor (standalone)</div>
                    <div style={{ fontSize:11, color:C.textSec, lineHeight:1.4 }}>Flag issues only — no target, no goal.</div>
                  </button>
                </div>
                {linkedGoal ? (
                  <div style={{ marginTop:10 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:C.textSec, marginBottom:5 }}>Which goal does this monitor power?</label>
                    <select value={linkedGoal} onChange={e=>setLinkedGoal(e.target.value)} style={{
                      width:'100%', padding:'9px 12px', borderRadius:6, border:`1px solid ${C.border}`,
                      fontSize:13, fontFamily:FF, color:C.textPrimary, outline:'none', height:36, background:'#fff',
                    }}>
                      {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div style={{ marginTop:10, padding:'9px 12px', background:'#FAFBFC', border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.textSec, lineHeight:1.5 }}>
                    <strong style={{ color:C.textPrimary, fontWeight:600 }}>Standalone monitor.</strong> Good for compliance (PII, policy), operational signals (tool failures, drift), or research questions where you just need to know when something's off. You can attach it to a goal later.
                  </div>
                )}
              </div>

              {/* 4. Coverage */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Coverage</label>
                <div style={{ display:'inline-flex', borderRadius:6, border:`1px solid ${C.border}`, overflow:'hidden' }}>
                  {[
                    { id:'all',     label:'AI + human-assisted' },
                    { id:'ai_only', label:'AI-handled only' },
                  ].map(o => (
                    <button key={o.id} onClick={()=>setCoverage(o.id)} style={{
                      padding:'8px 14px', border:'none', cursor:'pointer', fontFamily:FF,
                      background: coverage===o.id ? '#1C6EF2' : '#fff',
                      color: coverage===o.id ? '#fff' : C.textSec,
                      fontSize:12, fontWeight:600, height:34,
                    }}>{o.label}</button>
                  ))}
                </div>
              </div>

              {/* 5. Advanced */}
              <div style={{ marginTop:18, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                <button onClick={()=>setAdvanced(v=>!v)} style={{
                  background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:FF,
                  fontSize:12, fontWeight:600, color:C.textSec, display:'flex', alignItems:'center', gap:6,
                }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ transform: advanced?'rotate(90deg)':'rotate(0deg)', transition:'transform 0.15s' }}><path d="M4 3l3.5 2.5L4 8" strokeLinecap="round"/></svg>
                  Edit evaluation details
                </button>
                {advanced && (
                  <div style={{ marginTop:12, padding:'14px 14px', background:'#FAFBFC', borderRadius:6, border:`1px solid ${C.border}` }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Quality threshold</label>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <input type="range" min="50" max="100" value={threshold} onChange={e=>setThreshold(parseInt(e.target.value))} style={{ flex:1 }}/>
                      <span style={{ fontSize:13, fontWeight:600, color:C.textPrimary, minWidth:38, textAlign:'right' }}>{threshold}%</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>Conversations scoring below this trigger review. Defaults are calibrated for typical workflows.</div>
                  </div>
                )}
              </div>
            </>}
          </div>

          {/* Footer */}
          <div style={{ padding:'14px 22px', borderTop:`1px solid ${C.border}`, background:'#fff', display:'flex', justifyContent:'flex-end', gap:8 }}>
            <button onClick={closeCreate} style={{ padding:'8px 16px', borderRadius:6, border:`1px solid ${C.border}`, background:'#fff', fontSize:13, fontWeight:600, color:C.textSec, cursor:'pointer', fontFamily:FF, height:36 }}>Cancel</button>
            <button onClick={closeCreate} disabled={!tpl || !name} style={{ padding:'8px 16px', borderRadius:6, border:'none', background: (!tpl || !name) ? '#A3B1CC' : '#1C6EF2', color:'#fff', fontSize:13, fontWeight:600, cursor: (!tpl || !name) ? 'not-allowed' : 'pointer', fontFamily:FF, height:36 }}>Add monitor</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="page" style={{ fontFamily:FF }}>
      <div className="page__header" style={{ marginBottom:12 }}>
        <div style={{ flex:1 }}>
          <h1 className="page__title">Monitors</h1>
          <p className="page__subtitle" style={{ lineHeight:1.6 }}>
            Monitors are AI scorers that watch conversations against criteria you define. A monitor can <strong style={{ color:'#1A1D23' }}>power a goal</strong> — contributing scores toward a target you’re trying to hit — or run on its own as a <strong style={{ color:'#1A1D23' }}>standalone watchdog</strong> (compliance, operations, research) where you just need to know when something’s off.
          </p>
        </div>
        <div style={{ flexShrink:0 }}>
          <button onClick={openCreate} style={{ padding:'9px 16px', borderRadius:8, border:'none', background:'#1C6EF2', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, height:36 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3v8M3 7h8"/></svg>
            Add monitoring
          </button>
        </div>
      </div>

      {/* Section: Powering a goal */}
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop:6, marginBottom:10 }}>
        <div>
          <div style={{ font:'600 13px/18px Inter,sans-serif', color:'#1A1D23' }}>Powering a goal <span style={{ color:'#8A94A6', fontWeight:500 }}>({linkedMonitors.length})</span></div>
          <div style={{ font:'400 12px/18px Inter,sans-serif', color:'#5A6478', marginTop:2 }}>Scores from these monitors roll up to a goal you're tracking.</div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
        {linkedMonitors.length > 0
          ? linkedMonitors.map(m => <MonitorCard key={m.id} m={m} autoEdit={editMonitorId === m.id}/>)
          : (
            <div style={{ padding:'18px 20px', border:`1px dashed ${C.border}`, borderRadius:10, background:C.surface }}>
              <div style={{ font:'400 12px/18px Inter,sans-serif', color:'#5A6478' }}>No monitors are linked to a goal yet. <a onClick={openCreate} style={{ color:'#1C6EF2', cursor:'pointer', fontWeight:600 }}>Add one</a> to start scoring conversations toward a target.</div>
            </div>
          )
        }
      </div>

      {/* Section: Standalone */}
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop:6, marginBottom:10 }}>
        <div>
          <div style={{ font:'600 13px/18px Inter,sans-serif', color:'#1A1D23' }}>Standalone <span style={{ color:'#8A94A6', fontWeight:500 }}>({standaloneMonitors.length})</span></div>
          <div style={{ font:'400 12px/18px Inter,sans-serif', color:'#5A6478', marginTop:2 }}>Not tied to a goal. Use these to keep an eye on something — compliance, errors, drift — without committing to a target.</div>
        </div>
      </div>
      <div>
        {standaloneMonitors.length > 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {standaloneMonitors.map(m => <MonitorCard key={m.id} m={m} autoEdit={editMonitorId === m.id}/>)}
          </div>
        ) : (
          <div style={{ padding:'24px 20px', border:`1px dashed ${C.border}`, borderRadius:10, background:C.surface, textAlign:'center' }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>No standalone monitors yet</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:14, lineHeight:1.5 }}>You don't need a goal to start watching something. Add a monitor that just flags issues — useful for compliance, tool failures, or research questions.</div>
            <button onClick={openCreate} style={{ padding:'9px 20px', borderRadius:8, border:'none', background:'#1C6EF2', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:FF }}>+ Add monitoring</button>
          </div>
        )}
      </div>
      {createOpen && <CreateMonitorPanel/>}
    </div>
  );
}

function MonitorDetail({ id, navigate, openConvo }) {
  const { monitors } = window.K_DATA;
  const m = monitors.find((x) => x.id === id);
  if (!m) return <div className="page"><div className="empty"><div className="empty__title">Monitor not found</div></div></div>;
  return (
    <div className="page">
      <div className="crumbs">
        <a onClick={() => navigate({ screen: 'monitors' })}>Monitors</a>
        <span className="crumbs__sep">/</span>
        <span className="crumbs__current">{m.name}</span>
      </div>
      <div className="page__header">
        <h1 className="page__title">{m.name}</h1>
      </div>
    </div>
  );
}

window.MonitorsList = MonitorsList;
window.MonitorDetail = MonitorDetail;
