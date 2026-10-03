// =============================================================
// PerfSuggestions — ported from "Goals v5" InboxV2.
// Renders inside the Performance section's Suggestions sub-tab.
// Drives off window.K_DATA (loaded via hybrid/js/k_data.js).
// =============================================================

const _FF_SUG = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const C_SUG = {
  border:      '#dce0e9',
  surface:     '#ffffff',
  surfaceHi:   '#f9fafb',
  textPrimary: '#1A1D23',
  textSec:     '#5A6478',
  textMuted:   '#8A94A6',
  purple:      '#7c3aed',
  purpleLight: '#f5f3ff',
  purpleBor:   '#ddd6fe',
  green:       '#16a34a',
  greenBg:     '#f0fdf4',
  greenBor:    '#86efac',
  amber:       '#d97706',
  amberBg:     '#fffbeb',
  amberBor:    '#fcd34d',
  red:         '#dc2626',
  redBg:       '#fef2f2',
  redBor:      '#fecaca',
  blue:        '#2563eb',
  blueBg:      '#eff6ff',
  blueBor:     '#bfdbfe',
};

const btnPrimarySug   = { height:36, padding:'0 20px', borderRadius:8, border:'none', background:'#1C6EF2', color:'#fff', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', whiteSpace:'nowrap', fontFamily:_FF_SUG, display:'inline-flex', alignItems:'center', gap:6 };
const btnSecondarySug = { height:36, padding:'0 18px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', color:'#1A1D23', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', whiteSpace:'nowrap', fontFamily:_FF_SUG };

function _AiSparkIconSug({ color='rgba(255,255,255,0.9)', size=13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2.917 1.75v2.333M4.083 2.917H1.75M2.917 9.917v2.333M4.083 11.083H1.75M8.167 2.917l.857 2.174c.11.278.165.417.249.534.074.104.165.195.269.269.117.084.256.139.534.249L12.25 7l-2.174.857c-.278.11-.417.165-.534.249a1.167 1.167 0 0 0-.269.269c-.084.117-.139.256-.249.534L8.167 11.083l-.858-2.174c-.109-.278-.164-.417-.248-.534a1.167 1.167 0 0 0-.269-.269c-.117-.084-.256-.139-.534-.249L4.083 7l2.175-.857c.278-.11.417-.165.534-.249.104-.074.195-.165.269-.269.084-.117.139-.256.248-.534l.858-2.174Z"
        stroke={color} strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function _ChevronIconSug({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

// ── Procedure slide-in panel ─────────────────────────────────────────────────
function ProcedurePanelSug({ suggestion, onClose }) {
  const FF = _FF_SUG;
  const AiSparkIcon = _AiSparkIconSug;
  const [saved, setSaved] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const readOnly = suggestion.readOnly;
  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      suggestion.onApply?.();
      setSaved(false);
      onClose?.();
    }, 1200);
  }

  const allSteps = [
    { text: 'Read the customer request and use the vip_id to determine whether they qualify for a VIP coupon.', aiAdded: false },
    { text: 'Verify eligibility using any available customer or order data before making changes.', aiAdded: false },
    { text: 'Get related products from order history and recommend the top match.', aiAdded: true },
    { text: 'If the customer is interested, complete the product recommendation flow.', aiAdded: true },
    { text: 'If not interested or not eligible for recommendation, apply the appropriate coupon and confirm the action in your response.', aiAdded: false },
    { text: 'If not eligible for either, explain the decision clearly and provide the best available alternative.', aiAdded: false },
    { text: 'Ask whether the customer needs anything else once the main request is resolved.', aiAdded: false },
    { text: 'If the customer indicates they are finished, end the conversation with a polite goodbye.', aiAdded: false },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', zIndex:200, opacity:visible?1:0, transition:'opacity 0.2s' }}/>
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:560, background:'#fff', boxShadow:'-4px 0 32px rgba(0,0,0,0.12)', zIndex:201, display:'flex', flexDirection:'column', transform:visible?'translateX(0)':'translateX(100%)', transition:'transform 0.25s cubic-bezier(0.4,0,0.2,1)', fontFamily:FF }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #DCE0E9', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:11, color:'#8A94A6', marginBottom:4 }}>
              <span style={{ color:'#5B47E0', fontWeight:500 }}>VIP Customer Support</span>
              <span style={{ margin:'0 4px', color:'#8A94A6' }}>›</span>
              <span>Procedures</span>
            </div>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#1A1D23', margin:0, lineHeight:'28px' }}>{readOnly ? 'Change applied' : suggestion.action === 'Reverted' ? 'Re-apply change' : 'Edit procedure'}</h2>
          </div>
          <button onClick={onClose} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', fontSize:13, color:'#1A1D23', cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:6, fontFamily:FF, flexShrink:0 }}>✕ Close</button>
        </div>
        <div style={{ padding:'12px 20px', background: readOnly ? (suggestion.action === 'Reverted' ? '#fff7ed' : '#f0fdf4') : (suggestion.action === 'Reverted' ? '#fff7ed' : '#F5F3FF'), borderBottom:`1px solid ${readOnly ? (suggestion.action === 'Reverted' ? '#fed7aa' : '#86efac') : (suggestion.action === 'Reverted' ? '#fed7aa' : '#DDD6FE')}`, display:'flex', alignItems:'flex-start', gap:8, flexShrink:0 }}>
          {readOnly
            ? suggestion.action === 'Reverted'
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginTop:1,flexShrink:0}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginTop:1,flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>
            : suggestion.action === 'Reverted'
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginTop:1,flexShrink:0}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              : <AiSparkIcon color="#7C3AED" size={14}/>
          }
          <div>
            <div style={{ fontSize:13, fontWeight:600, color: readOnly ? (suggestion.action === 'Reverted' ? '#ea580c' : '#16a34a') : (suggestion.action === 'Reverted' ? '#ea580c' : '#7C3AED'), marginBottom:3 }}>
              {readOnly
                ? suggestion.action === 'Reverted'
                  ? 'Change reverted by ' + (suggestion.person || 'You') + ' · ' + suggestion.appliedAt
                  : 'Change applied by ' + (suggestion.person || 'You') + ' · ' + suggestion.appliedAt
                : suggestion.action === 'Reverted'
                  ? 'Previously reverted by ' + (suggestion.person || 'You') + ' · ' + suggestion.appliedAt
                  : 'AI suggested change'}
            </div>
            <div style={{ fontSize:13, color:'#5A6478', lineHeight:'18px' }}>{suggestion.changeSummary || 'Add an upsell step before coupon codes are applied, step 3 has been added and step 5 has been updated to reflect the new recommendation flow.'}</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 0' }}>
          <div style={{ fontSize:18, fontWeight:700, color:'#1A1D23', marginBottom:4 }}>Steps</div>
          <div style={{ fontSize:13, color:'#8A94A6', marginBottom:16, lineHeight:1.5 }}>Define the steps to execute this procedure. You can reference tools with @ mentions.</div>
          <div style={{ border:'1px solid #DCE0E9', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
            <div style={{ padding:'8px 12px', borderBottom:'1px solid #DCE0E9', display:'flex', alignItems:'center', gap:2, background:'#F9FAFB' }}>
              <button style={{ width:32, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:15, fontWeight:700, color:'#1A1D23', display:'flex', alignItems:'center', justifyContent:'center' }}>B</button>
              <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:14, fontStyle:'italic', color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>I</button>
              <div style={{ width:1, height:18, background:'#DCE0E9', margin:'0 6px' }}/>
              <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>@</button>
              <div style={{ width:1, height:18, background:'#DCE0E9', margin:'0 6px' }}/>
              <div style={{ flex:1 }}/>
            </div>
            <div style={{ padding:'16px', background:'#fff' }}>
              <ol style={{ margin:0, paddingLeft:22, display:'flex', flexDirection:'column', gap:12 }}>
                {allSteps.map((step, i) => (
                  <li key={i} style={{ fontSize:13, color:'#1A1D23', lineHeight:'20px', background: step.aiAdded ? 'rgba(124,58,237,0.06)' : 'transparent', borderRadius: step.aiAdded ? 6 : 0, padding: step.aiAdded ? '6px 10px' : '0', marginLeft: step.aiAdded ? -10 : 0 }}>
                    {step.text}
                    {step.aiAdded && (
                      <span style={{ fontSize:10, fontWeight:600, color:'#7C3AED', marginLeft:8, verticalAlign:'middle', background:'#F5F3FF', border:'1px solid #DDD6FE', borderRadius:4, padding:'1px 6px' }}>AI added</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div style={{ padding:'14px 20px 16px', borderTop:'1px solid #DCE0E9', background:'#fff', display:'flex', flexDirection:'column', gap:12, flexShrink:0 }}>
          <div style={{ padding:'10px 14px', border:'1px solid #DCE0E9', borderRadius:8, background:'#F9FAFB', fontSize:13, color:'#1A1D23', fontFamily:FF, lineHeight:1.45 }}>
            Applies immediately to all new conversations in VIP Customer Support.
          </div>
          {readOnly ? (
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', fontSize:14, color:'#1A1D23', cursor:'pointer', fontWeight:500, fontFamily:FF }}>Close</button>
              <button onClick={() => { setSaved(true); setTimeout(() => { suggestion.onRevert?.(); onClose(); setSaved(false); }, 1200); }} style={{ padding:'10px 20px', borderRadius:8, border:'none', background: saved ? '#16A34A' : '#DC2626', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', transition:'background 0.2s', fontFamily:FF, display:'flex', alignItems:'center', gap:6 }}>
                {saved ? '✓ Reverted' : (<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Revert</>)}
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', fontSize:14, color:'#1A1D23', cursor:'pointer', fontWeight:500, fontFamily:FF }}>Cancel</button>
              <button onClick={handleSave} style={{ padding:'10px 20px', borderRadius:8, border:'none', background: saved ? '#16A34A' : '#7C3AED', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', transition:'background 0.2s', fontFamily:FF }}>
                {saved ? '✓ Saved' : 'Save and apply'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── HistoryRow ───────────────────────────────────────────────────────────────
function HistoryRowSug({ s, isLast, C, onViewChange }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr 120px 100px 40px', gap:0, padding:'12px 16px', borderBottom: isLast ? 'none' : `1px solid ${C.border}`, alignItems:'center', position:'relative' }}>
      <span style={{ fontSize:12, color:C.textMuted }}>{s.appliedAt}</span>
      <span style={{ fontSize:13, fontWeight:500, color:C.textPrimary, paddingRight:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</span>
      <span style={{ fontSize:12, color:C.textSec }}>{s.person || 'You'}</span>
      <span style={{
        fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, display:'inline-flex', alignItems:'center', justifyContent:'center',
        background: s.action==='Applied' ? '#f0fdf4' : s.action==='Reverted' ? '#fff7ed' : '#fef2f2',
        border: `1px solid ${s.action==='Applied' ? '#86efac' : s.action==='Reverted' ? '#fed7aa' : '#fecaca'}`,
        color: s.action==='Applied' ? '#16a34a' : s.action==='Reverted' ? '#ea580c' : '#dc2626',
      }}>{s.action}</span>
      <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
        <button onClick={() => setMenuOpen(v => !v)} style={{ width:28, height:28, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textMuted }}
          onMouseEnter={e => e.currentTarget.style.background = C.surfaceHi}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>
        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:49 }}/>
            <div style={{ position:'absolute', top:'100%', right:0, marginTop:4, background:'#fff', border:`1px solid ${C.border}`, borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,0.1)', zIndex:50, minWidth:140, overflow:'hidden' }}>
              <button onClick={() => { setMenuOpen(false); onViewChange(s.action); }} style={{ width:'100%', padding:'9px 14px', textAlign:'left', background:'none', border:'none', fontSize:13, color:C.textPrimary, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}
                onMouseEnter={e => e.currentTarget.style.background = C.surfaceHi}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                View change
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── PerfSuggestions — main exported component ────────────────────────────────
const PerfSuggestions = ({ goal, onOpenGoal }) => {
  const C = C_SUG;
  const FF = _FF_SUG;
  const AiSparkIcon = _AiSparkIconSug;
  const ChevronIcon = _ChevronIconSug;
  const K = window.K_DATA || { suggestions: [], monitors: [], goals: [], flaggedConversations: [] };
  const { suggestions, monitors, goals: allGoals, flaggedConversations } = K;
  const monitorById = Object.fromEntries(monitors.map((m) => [m.id, m]));
  const goalById    = Object.fromEntries(allGoals.map((g) => [g.id, g]));

  const [dismissedIds, setDismissedIds]       = React.useState([]);
  const [procedurePanel, setProcedurePanel]   = React.useState(null);
  const [activeTab, setActiveTab]             = React.useState('suggestions');
  const [history, setHistory] = React.useState([
    { id: 'hist_1', title: 'Suggest an upsell before applying a coupon code',          changeSummary: 'Add an upsell step before coupon codes are applied, step 3 added, step 5 updated.', action: 'Applied',   person: 'Sarah K.', appliedAt: 'Mar 12, 9:14 AM' },
    { id: 'hist_2', title: 'Update KB article: shipping policy for international orders', changeSummary: 'KB article updated to reflect new 14-day international return window.',          action: 'Dismissed', person: 'You',      appliedAt: 'Feb 28, 2:05 PM' },
    { id: 'hist_3', title: 'Tighten escalation trigger: repeated failed payments',     changeSummary: 'Escalation threshold lowered from 3 to 2 failed attempts before handoff.',        action: 'Reverted',  person: 'You',      appliedAt: 'Jan 15, 11:30 AM' },
  ]);

  // Map K_DATA suggestions to card shape
  const mapped = suggestions.map((s) => {
    const monitor = monitorById[s.monitorId];
    const g       = goalById[s.goalIds?.[0]];
    return {
      id:             s.id,
      title:          s.title,
      procedureName:  s.type === 'procedure_edit' ? s.target : null,
      type:           s.typeLabel || s.type,
      isProcedure:    s.type === 'procedure_edit',
      changelog:      { updatedBy: 'AI Monitor', updatedAgo: s.createdAt },
      goal:           g?.name || null,
      goalId:         s.goalIds?.[0],
      monitorName:    monitor?.name || null,
      monitorId:      s.monitorId,
      priority:       s.priority,
      aiConfidence:   s.priority === 'high' ? 'High' : s.priority === 'medium' ? 'Medium' : 'Low',
      aiConfidencePct: s.priority === 'high' ? 82 : s.priority === 'medium' ? 67 : 51,
      cause:          s.rationale,
      evidence:       s.rationale,
      value:          s.impact || s.rationale,
      changeSummary:  s.title,
      before:         s.before || null,
      after:          s.after  || null,
      ctaScope:       s.type === 'procedure_edit'
        ? 'Applies to new conversations only. Existing conversations are not affected. You can revert this change from Procedures at any time.'
        : 'Saves a draft. No conversations are affected until you publish or apply it.',
      automation:     monitor ? { name: monitor.name, href: '#' } : null,
    };
  });

  // Optional: filter by goal when Suggestions sub-tab is opened in a goal-filtered context.
  // Only filter if the passed goal.id matches a K_DATA goal — otherwise show all.
  const goalMatches = goal && allGoals.some(g => g.id === goal.id);
  const filtered = goalMatches ? mapped.filter(s => s.goalId === goal.id) : mapped;
  const visible   = filtered.filter((s) => !dismissedIds.includes(s.id));

  // ── Suggestion card ────────────────────────────────────────────────────────
  function SuggestionCard({ s }) {
    const [open, setOpen] = React.useState(s.id === filtered[0]?.id);
    const [confirmDismiss, setConfirmDismiss] = React.useState(false);
    const [showConvoPopover, setShowConvoPopover] = React.useState(false);

    function handleApply() {
      setHistory(h => [{ ...s, appliedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), action: 'Applied', person: 'You' }, ...h]);
      setDismissedIds(ids => [...ids, s.id]);
    }

    const linkedConvos = flaggedConversations.filter(c => c.monitorId === s.monitorId).slice(0, 5);

    return (
      <div style={{ border:`1px solid ${C.border}`, borderRadius:10, background:C.surface, marginBottom:10, overflow:'hidden' }}>
        <div style={{ padding:'14px 16px 12px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div>
              {s.automation && s.procedureName && (
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:11, color:C.blue, fontWeight:500 }}>{s.monitorName || s.automation.name}</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize:11, color:C.textSec, fontWeight:500 }}>{s.procedureName}</span>
                </div>
              )}
              {!s.procedureName && s.monitorName && (
                <span style={{ fontSize:11, color:C.textMuted }}>{s.monitorName}</span>
              )}
            </div>
            <button onClick={() => setOpen((v) => !v)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:6, cursor:'pointer', padding:'4px 8px', color:C.textMuted, display:'flex', alignItems:'center', flexShrink:0, marginLeft:12 }}>
              <ChevronIcon open={open}/>
            </button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:C.surfaceHi, border:`1px solid ${C.border}`, color:C.textMuted, letterSpacing:'0.04em' }}>DRAFT, PENDING YOUR REVIEW</span>
          </div>

          <h2 style={{ fontSize:18, fontWeight:700, lineHeight:'22px', color:C.textPrimary, margin:'0 0 10px', fontFamily:FF }}>{s.title}</h2>

          <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
            {s.aiConfidence && (
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:9, fontWeight:600, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.04em' }}>Confidence</span>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:600,
                  background: s.aiConfidence==='High' ? C.greenBg : C.amberBg,
                  color:      s.aiConfidence==='High' ? C.green   : C.amber,
                  border:    `1px solid ${s.aiConfidence==='High' ? C.greenBor : C.amberBor}` }}>
                  {s.aiConfidence}{s.aiConfidencePct ? ` · ${s.aiConfidencePct}%` : ''}
                </span>
              </div>
            )}
            {s.goal && (
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:9, fontWeight:600, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.04em' }}>Goal</span>
                <a onClick={() => onOpenGoal && onOpenGoal(s.goalId)} style={{ fontSize:10, background:C.amberBg, color:C.amber, border:`1px solid ${C.amberBor}`, padding:'2px 8px', borderRadius:10, fontWeight:500, cursor: onOpenGoal ? 'pointer' : 'default', textDecoration:'none' }}>{s.goal}</a>
              </div>
            )}
            {s.changelog && (
              <span style={{ fontSize:10, color:C.textMuted, fontWeight:500, marginLeft:'auto' }}>Detected {s.changelog.updatedAgo}</span>
            )}
          </div>
        </div>

        {open && (
          <div style={{ padding:'16px', borderTop:`1px solid ${C.border}` }}>
            <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:C.textPrimary, margin:'0 0 6px', fontFamily:FF }}>Why this may matter</h3>
            <p style={{ fontSize:13, lineHeight:'20px', color:C.textSec, margin:'0 0 20px' }}>{s.value}</p>

            {s.evidence && (
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                  <AiSparkIcon color={C.purple} size={12}/>
                  <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:C.textPrimary, margin:0, fontFamily:FF }}>How this pattern was detected</h3>
                </div>
                <p style={{ fontSize:13, lineHeight:'20px', color:C.textSec, margin:'0 0 12px' }}>{s.evidence}</p>

                {linkedConvos.length > 0 && (
                  <div style={{ position:'relative', display:'inline-block' }}>
                    <div style={{ padding:'10px 14px', background:C.surfaceHi, border:`1px solid ${C.border}`, borderRadius:8, display:'inline-flex', flexDirection:'column', gap:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:'0.06em' }}>WE SAW</span>
                      <div style={{ fontSize:14, color:C.textPrimary, lineHeight:'20px' }}>
                        <button
                          onClick={() => setShowConvoPopover(v => !v)}
                          style={{ fontSize:14, fontWeight:700, color:C.blue, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:FF }}
                        >{linkedConvos.length} conversation{linkedConvos.length !== 1 ? 's' : ''}</button>
                        {' '}failing the same way
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginLeft:4, verticalAlign:'middle', color:C.textMuted }} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h8M9 5l3 3-3 3"/></svg>
                      </div>
                    </div>

                    {showConvoPopover && (
                      <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:100, background:'#fff', border:`1px solid ${C.border}`, borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', width:320, overflow:'hidden' }}>
                        <div style={{ padding:'10px 14px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <span style={{ fontSize:12, fontWeight:600, color:C.textPrimary }}>{linkedConvos.length} flagged conversation{linkedConvos.length !== 1 ? 's' : ''}</span>
                          <button onClick={() => setShowConvoPopover(false)} style={{ fontSize:11, color:C.textMuted, background:'none', border:'none', cursor:'pointer', padding:0 }}>✕</button>
                        </div>
                        {linkedConvos.map((c, i) => (
                          <div key={c.id} style={{ padding:'10px 14px', borderBottom: i < linkedConvos.length - 1 ? `1px solid ${C.border}` : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:600, color:C.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.customer}</div>
                              <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{c.customerCompany} · {c.timeAgo}</div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                              <span style={{ fontSize:12, fontWeight:700, color: c.score < 50 ? C.red : C.amber }}>{c.score}</span>
                              <span style={{ fontSize:10, color:C.textMuted, fontFamily:'monospace' }}>{c.id.replace('conv-','#')}</span>
                            </div>
                          </div>
                        ))}
                        <div style={{ padding:'8px 14px', background:C.surfaceHi, borderTop:`1px solid ${C.border}` }}>
                          <span style={{ fontSize:11, color:C.textMuted }}>AI-estimated scores · review as signals, not final judgments</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {s.before && s.after && (
              <div style={{ marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:C.textPrimary, margin:'0 0 6px', fontFamily:FF }}>What will change</h3>
                <p style={{ fontSize:13, lineHeight:'20px', color:C.textSec, margin:'0 0 12px' }}>{s.changeSummary}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[{ label:'Before', code:s.before, bg:'rgba(220,38,38,0.05)', border:C.redBor },
                    { label:'After',  code:s.after,  bg:'rgba(22,163,74,0.05)', border:C.greenBor }].map(({ label, code, bg, border }) => (
                    <div key={label}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textSec, marginBottom:6 }}>{label}</div>
                      <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:6, padding:'10px 12px', fontFamily:'monospace', fontSize:12, color:C.textSec, whiteSpace:'pre', lineHeight:1.7, overflowX:'auto' }}>{code}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!s.before && (
              <div style={{ marginBottom:20 }}>
                <h3 style={{ fontSize:16, fontWeight:700, lineHeight:'20px', color:C.textPrimary, margin:'0 0 6px', fontFamily:FF }}>What will change</h3>
                <p style={{ fontSize:13, lineHeight:'20px', color:C.textSec, margin:0 }}>{s.changeSummary}</p>
              </div>
            )}

            {confirmDismiss ? (
              <div style={{ padding:'10px 14px', background:C.surfaceHi, borderRadius:8, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <span style={{ fontSize:13, lineHeight:'20px', color:C.textSec }}>Dismiss this suggestion? You can restore it from the <a onClick={() => { setActiveTab('history'); setConfirmDismiss(false); }} style={{ color:C.purple, cursor:'pointer', fontWeight:500 }}>history tab</a>.</span>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => setConfirmDismiss(false)} style={btnSecondarySug}>Cancel</button>
                  <button onClick={() => {
                    setHistory(h => [{ ...s, appliedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), action: 'Dismissed', person: 'You' }, ...h]);
                    setDismissedIds((ids) => [...ids, s.id]); setConfirmDismiss(false); }} style={{ ...btnSecondarySug, color:C.red, borderColor:C.redBor }}>Yes, dismiss</button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:8 }}>
                <div style={{ fontSize:13, lineHeight:'20px', color:C.textMuted, flex:1 }}>{s.ctaScope}</div>
                <div style={{ display:'flex', gap:12, flexShrink:0, alignItems:'center' }}>
                  <a onClick={() => setConfirmDismiss(true)} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:13, fontWeight:500, color:C.red, cursor:'pointer', textDecoration:'none', whiteSpace:'nowrap' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Dismiss this
                  </a>
                  <button onClick={() => setProcedurePanel({ ...s, onApply: handleApply })} style={btnPrimarySug}>
                    <AiSparkIcon/>{s.isProcedure ? 'Edit Procedure' : 'Review change'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Tab pill styling, fits with hybrid prototype aesthetics ─────────────
  const tabBtn = (active) => ({
    padding: '8px 14px', borderRadius: 8, border: 'none',
    background: active ? '#1A1D23' : 'transparent',
    color: active ? '#fff' : C.textSec,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: FF, display: 'inline-flex', alignItems: 'center', gap: 6,
  });
  const tabCount = (active) => ({
    fontSize: 11, padding: '1px 7px', borderRadius: 99,
    background: active ? 'rgba(255,255,255,0.18)' : C.surfaceHi,
    color: active ? '#fff' : C.textMuted,
    border: active ? 'none' : `1px solid ${C.border}`,
  });

  return (
    <div style={{ fontFamily: FF }}>
      {/* Intro */}
      <p style={{ fontSize: 13, lineHeight: 1.55, color: C.textSec, margin: '0 0 16px', maxWidth: '72ch' }}>
        AI-drafted suggestions based on detected patterns in your conversation data. Each includes the evidence behind it and a confidence level.{' '}
        <strong style={{ color: C.textPrimary }}>Nothing changes until you review and apply it.</strong> All changes are reversible.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
        <button style={tabBtn(activeTab === 'suggestions')} onClick={() => setActiveTab('suggestions')}>
          Suggestions <span style={tabCount(activeTab === 'suggestions')}>{visible.length}</span>
        </button>
        <button style={tabBtn(activeTab === 'history')} onClick={() => setActiveTab('history')}>
          History <span style={tabCount(activeTab === 'history')}>{history.length}</span>
        </button>
      </div>

      {/* Suggestions tab */}
      {activeTab === 'suggestions' && (
        <div style={{ display:'flex', flexDirection:'column' }}>
          {visible.length === 0 && (
            <div style={{ padding: '40px 20px', border: `1px dashed ${C.border}`, borderRadius: 10, textAlign: 'center', background: C.surfaceHi }}>
              <div style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 999, background: '#fff', border: `1px solid ${C.border}`, alignItems: 'center', justifyContent: 'center', color: C.textMuted, marginBottom: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>All caught up</div>
              <div style={{ fontSize: 13, color: C.textSec }}>No pending suggestions. New ones appear here as monitors detect patterns worth investigating.</div>
            </div>
          )}
          {visible.map((s) => <SuggestionCard key={s.id} s={s}/>)}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div style={{ padding: '40px 20px', border: `1px dashed ${C.border}`, borderRadius: 10, textAlign: 'center', background: C.surfaceHi }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>No history yet</div>
              <div style={{ fontSize: 13, color: C.textSec }}>Applied and dismissed suggestions will appear here.</div>
            </div>
          ) : (
            <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:'visible', background:C.surface }}>
              <div style={{ display:'grid', gridTemplateColumns:'140px 1fr 120px 100px 40px', gap:0, background:C.surfaceHi, borderBottom:`1px solid ${C.border}`, padding:'8px 16px', borderRadius:'10px 10px 0 0' }}>
                {['Date','Suggestion','Person','Action',''].map(h => (
                  <span key={h} style={{ fontSize:11, fontWeight:600, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</span>
                ))}
              </div>
              {history.map((s, i) => (
                <HistoryRowSug key={i} s={s} isLast={i === history.length-1} C={C} onViewChange={(action) => setProcedurePanel({ ...s, readOnly: action === 'Applied',
                  onRevert: () => setHistory(h => h.map((r, ri) => ri === i ? { ...r, action: 'Reverted' } : r)),
                  onApply:  () => setHistory(h => h.map((r, ri) => ri === i ? { ...r, action: 'Applied', person: 'You', appliedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) } : r)),
                })} />
              ))}
            </div>
          )}
        </div>
      )}

      {procedurePanel && <ProcedurePanelSug suggestion={procedurePanel} onClose={() => setProcedurePanel(null)}/>}
    </div>
  );
};

Object.assign(window, { PerfSuggestions });
