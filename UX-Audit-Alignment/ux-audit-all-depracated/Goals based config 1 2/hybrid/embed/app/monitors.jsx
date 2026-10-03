// Monitors — v3 UI adapted for v2 shell + live K_DATA

// ── Synthetic ground-truth review queue ────────────────────────────────────
// Mixes real flagged (failing) conversations with synthetic passing ones, so
// reviewers can label both directions: a "passing" conversation may still be
// a bad example, and a "failing" one may be a false flag.
function buildReviewQueue(m, flaggedForMonitor) {
  const passingTemplates = [
    {
      id: 'conv-8902', customer: 'Tara Wells', customerCompany: 'Northwind', score: 92, status: 'pass', timeAgo: '8 min ago',
      preview: 'Customer asked about return window. AI confirmed eligibility, offered prepaid label, closed cleanly.',
      criteriaScores: [
        { name: 'Customer\u2019s stated need was resolved in-conversation', weight: 35, score: 95, pass: true, essential: true, source: 'Outcome \u00b7 intent + closing message' },
        { name: 'AI response matched customer intent', weight: 20, score: 92, pass: true, source: 'Procedure: Intent Resolution \u00a72.1' },
        { name: 'Required disclosures present for returns', weight: 20, score: 90, pass: true, source: 'KB-RET-001' },
        { name: 'Closing follow-up offered before ending', weight: 25, score: 88, pass: true, source: 'Procedure: Conversation Close \u00a73.2' },
      ],
      messages: [
        { role: 'customer', text: 'Can I still return my order from last week?', time: '9:02am' },
        { role: 'ai', text: 'Yes — you\'re inside the 30-day window. Want me to email a prepaid return label?', time: '9:02am' },
        { role: 'customer', text: 'Yes please.', time: '9:03am' },
        { role: 'ai', text: 'Sent. You should see it in your inbox shortly. Anything else I can help with?', time: '9:03am' },
        { role: 'customer', text: 'Nope, thanks!', time: '9:04am' },
      ],
    },
    {
      id: 'conv-8895', customer: 'Marcus Reed', customerCompany: 'Wayne Co', score: 84, status: 'pass', timeAgo: '22 min ago',
      preview: 'Order tracking question — AI fetched status, gave ETA. Customer satisfied, no follow-up needed.',
      criteriaScores: [
        { name: 'Customer\u2019s stated need was resolved in-conversation', weight: 35, score: 88, pass: true, essential: true, source: 'Outcome \u00b7 intent + closing message' },
        { name: 'AI response matched customer intent', weight: 20, score: 90, pass: true, source: 'Procedure: Intent Resolution \u00a72.1' },
        { name: 'Required disclosures present for returns', weight: 20, score: 95, pass: true, source: 'KB-RET-001 \u00b7 not applicable here' },
        { name: 'Closing follow-up offered before ending', weight: 25, score: 62, pass: false, soft: true, rationale: 'Customer reply \u201cok\u201d not acknowledged before close \u2014 borderline.', source: 'Procedure: Conversation Close \u00a73.2' },
      ],
      messages: [
        { role: 'customer', text: 'Where\'s my package?', time: '11:14am' },
        { role: 'ai', text: 'Your order #4421 is out for delivery — ETA today between 2–6pm.', time: '11:14am' },
        { role: 'customer', text: 'ok', time: '11:15am' },
      ],
    },
    {
      id: 'conv-8888', customer: 'Lin Hayes', customerCompany: 'Stark Industries', score: 76, status: 'pass', timeAgo: '45 min ago',
      preview: 'Refund processed without confirming bank account on file — passed criteria but customer flagged later.',
      criteriaScores: [
        { name: 'Customer\u2019s stated need was resolved in-conversation', weight: 35, score: 84, pass: true, essential: true, source: 'Outcome \u00b7 intent + closing message' },
        { name: 'AI response matched customer intent', weight: 20, score: 80, pass: true, source: 'Procedure: Intent Resolution \u00a72.1' },
        { name: 'Refund issued only after verify_identity tool call', weight: 25, score: 38, pass: false, rationale: 'No verify_identity call before issuing refund \u2014 procedural breach despite passing overall.', source: 'Procedure: Refund Authorization \u00a71.4 \u00b7 tool: verify_identity' },
        { name: 'Closing follow-up offered before ending', weight: 20, score: 75, pass: true, source: 'Procedure: Conversation Close \u00a73.2' },
      ],
      messages: [
        { role: 'customer', text: 'Need a refund on order 8821', time: '10:21am' },
        { role: 'ai', text: 'Refund of $48.20 processed to your card ending in 4421.', time: '10:22am' },
        { role: 'customer', text: 'Wait, I changed cards last month.', time: '10:22am' },
      ],
    },
  ];
  // Promote real flagged conversations + augment with synthetic passing.
  const failing = (flaggedForMonitor || []).map(c => ({ ...c, status: 'fail' }));
  return [...failing.slice(0, 2), ...passingTemplates.slice(0, 3), ...failing.slice(2)];
}

// AI-detected patterns: clustered failures or unusually high passing.
// Pull anomaly → pattern mapping from window.K_ANOMALIES_BY_MONITOR_ID
// (exported by v4-anomalies.jsx). Falls back to hand-authored defaults when
// the anomaly layer isn't loaded.
function buildPatternSuggestions(m) {
  // ── Anomaly-derived patterns ──
  const anomMap = window.K_ANOMALIES_BY_MONITOR_ID;
  if (anomMap && anomMap[m.id] && anomMap[m.id].length) {
    // Conversation IDs we actually have in K_DATA, keyed by monitor.
    const convIdsByMonitor = {
      mon_csat: ['conv-8821', 'conv-8801'],
      mon_proc: ['conv-8819', 'conv-8814'],
      mon_esc:  [],
      mon_rep:  [],
    };
    return anomMap[m.id].map((a) => ({
      id: 'pat_' + a.id,
      anomalyId: a.id,
      kind: a.sev === 'pos' ? 'unusual_pass' : 'clustered_fail',
      severity: a.sev === 'high' ? 'high' : 'medium',
      title: a.metric + ' · ' + a.head,
      body: a.why,
      ask: a.cat === 'criteria' ? 'Label as bad examples to teach the scorer.' : 'Open anomaly to see the cluster.',
      affects: a.cat === 'criteria' ? a.metric : (m.criteria?.[0]?.name || '—'),
      convoIds: convIdsByMonitor[m.id] || [],
    }));
  }

  // ── Fallback: hand-authored when anomaly layer not loaded ──
  if (m.id === 'mon_csat') {
    return [
      {
        id: 'pat_1', kind: 'clustered_fail', severity: 'high',
        title: '4 of last 12 failures share root cause',
        body: 'AI offered coupon or discount before confirming intent.',
        ask: 'Label as bad examples.',
        affects: 'Need resolution',
        convoIds: ['conv-8821','conv-8801','conv-8794','conv-8782'],
      },
    ];
  }
  if (m.id === 'mon_proc') {
    return [
      {
        id: 'pat_3', kind: 'clustered_fail', severity: 'high',
        title: '3 procedure failures cluster on stale tool data',
        body: 'Tool called with cached customer ID, returning wrong order.',
        ask: 'Label as bad examples.',
        affects: 'Tool use accuracy',
        convoIds: ['conv-8819','conv-8814','conv-8809'],
      },
    ];
  }
  return [
    {
      id: 'pat_default', kind: 'clustered_fail', severity: 'medium',
      title: 'Recent failures cluster on the same criterion',
      body: 'The last few flagged conversations failed the same essential criterion.',
      ask: 'Label to refine the scorer.',
      affects: m.criteria?.[0]?.name || '—',
      convoIds: ['conv-8788','conv-8776','conv-8761'],
    },
  ];
}

function MonitorsList({ navigate, openModal, openConvo }) {
  const { monitors, goals, flaggedConversations } = window.K_DATA;
  const ReviewPanel = window.ReviewPanel;
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


  // ── Rubric reference library — what \`/\` slash-commands resolve to ─────
  const REF_LIB = {
    kb: [
      { slug:'returns-policy',     label:'Returns policy' },
      { slug:'refund-eligibility', label:'Refund eligibility' },
      { slug:'shipping-faq',       label:'Shipping FAQ' },
      { slug:'billing-disputes',   label:'Billing disputes' },
      { slug:'sla-table',          label:'SLA response targets' },
    ],
    tool: [
      { slug:'order-lookup',       label:'Order lookup' },
      { slug:'refund-issue',       label:'Issue refund' },
      { slug:'ticket-status',      label:'Ticket status' },
      { slug:'customer-context',   label:'Customer context' },
      { slug:'kb-search',          label:'KB search' },
    ],
    procedure: [
      { slug:'escalation-path',    label:'Escalation path' },
      { slug:'vip-handoff',        label:'VIP handoff' },
      { slug:'fraud-flag',         label:'Fraud flag' },
      { slug:'compliance-check',   label:'Compliance check' },
      { slug:'first-response',     label:'First response procedure' },
    ],
  };
  const REF_TYPE_META = {
    kb:        { color:'#0E7C86', bg:'#E2F7F8', border:'#A5E1E5', label:'kb' },
    tool:      { color:'#6B3FA0', bg:'#F1ECFA', border:'#D6C5EE', label:'tool' },
    procedure: { color:'#9B5A00', bg:'#FFF4E0', border:'#FCE0B0', label:'procedure' },
  };
  // Seed example refs based on criterion name keywords
  function seedRefsForCriterion(c) {
    if (Array.isArray(c.refs)) return c.refs;
    const n = (c.name || '').toLowerCase();
    const out = [];
    if (/escalat|handoff|hand-off|transfer/.test(n))
      out.push({ type:'procedure', slug:'escalation-path' }, { type:'kb', slug:'sla-table' });
    else if (/refund|return|billing|charge/.test(n))
      out.push({ type:'tool', slug:'refund-issue' }, { type:'kb', slug:'refund-eligibility' });
    else if (/order|status|tracking|shipping/.test(n))
      out.push({ type:'tool', slug:'order-lookup' }, { type:'kb', slug:'shipping-faq' });
    else if (/ground|knowledge|kb|cite|source|accuracy/.test(n))
      out.push({ type:'tool', slug:'kb-search' }, { type:'kb', slug:'returns-policy' });
    else if (/proced|compli|policy|fraud/.test(n))
      out.push({ type:'procedure', slug:'compliance-check' });
    else if (/tone|empath|professional|greeting|closing/.test(n))
      out.push({ type:'procedure', slug:'first-response' });
    else if (/vip|priority|loyal/.test(n))
      out.push({ type:'procedure', slug:'vip-handoff' }, { type:'tool', slug:'customer-context' });
    return out;
  }

  function refMeta(r) {
    return { ...(REF_TYPE_META[r.type] || REF_TYPE_META.kb), info: (REF_LIB[r.type] || []).find(x => x.slug === r.slug) };
  }

  function RubricRefEditor({ refs, onChange }) {
    const [query, setQuery] = React.useState('');
    const [open, setOpen]   = React.useState(false);
    const inputRef = React.useRef(null);
    const containerRef = React.useRef(null);

    React.useEffect(() => {
      if (!open) return;
      function handleClick(e) {
        if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Parse query: '/kb:retu' → namespace='kb', filter='retu'
    const m = query.match(/^\/(kb|tool|procedure)?:?(.*)$/i);
    const ns = m && m[1] ? m[1].toLowerCase() : null;
    const filter = (m ? m[2] : query).toLowerCase().trim();
    const namespaces = ns ? [ns] : ['kb','tool','procedure'];

    const suggestions = [];
    namespaces.forEach(type => {
      (REF_LIB[type] || []).forEach(item => {
        if (refs.some(r => r.type === type && r.slug === item.slug)) return; // already linked
        const hay = (item.slug + ' ' + item.label).toLowerCase();
        if (!filter || hay.includes(filter)) suggestions.push({ type, ...item });
      });
    });
    const top = suggestions.slice(0, 6);

    function add(s) {
      onChange([...refs, { type:s.type, slug:s.slug }]);
      setQuery(''); setOpen(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    function remove(idx) { onChange(refs.filter((_,i)=>i!==idx)); }

    return (
      <div ref={containerRef} style={{ marginTop:8, paddingTop:8, borderTop:'1px dashed #E8EBF0' }}>
        <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:6 }}>
          <span style={{ font:'500 10px/14px Inter,sans-serif', color:'#8A94A6', textTransform:'uppercase', letterSpacing:0.4, marginRight:4 }}>Linked rubric</span>
          {refs.map((r, idx) => {
            const meta = refMeta(r);
            return (
              <span key={idx} style={{
                display:'inline-flex', alignItems:'center', gap:5, padding:'2px 4px 2px 8px',
                background: meta.bg, border:`1px solid ${meta.border}`, borderRadius:5,
                font:'600 11px/14px ui-monospace,SFMono-Regular,monospace', color: meta.color,
              }}>
                <span style={{ opacity:0.75 }}>/{meta.label}:</span>{r.slug}
                <button onClick={()=>remove(idx)} title="Remove" style={{
                  background:'transparent', border:'none', cursor:'pointer', padding:'0 3px',
                  color: meta.color, opacity:0.6, fontSize:13, lineHeight:1,
                }}>×</button>
              </span>
            );
          })}
          <div style={{ position:'relative' }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder={refs.length ? 'Type / to link…' : 'Type / to link a tool, KB, or procedure…'}
              style={{
                padding:'3px 8px', borderRadius:5, border:'1px dashed #DCE0E9',
                font:'500 11px/14px ui-monospace,SFMono-Regular,monospace',
                color:'#5A6478', outline:'none', background:'#fff', minWidth: refs.length ? 140 : 240,
                fontFamily:'ui-monospace,SFMono-Regular,monospace',
              }}
            />
            {open && (query.startsWith('/') || query === '') && (
              <div style={{
                position:'absolute', top:'calc(100% + 4px)', left:0, zIndex:50,
                minWidth:280, maxHeight:240, overflowY:'auto',
                background:'#fff', border:`1px solid ${C.border}`, borderRadius:6,
                boxShadow:'0 6px 22px rgba(15,18,25,0.14)', padding:4, fontFamily:FF,
              }}>
                {top.length === 0 ? (
                  <div style={{ padding:'8px 10px', font:'400 11px/16px Inter,sans-serif', color:'#8A94A6' }}>
                    No matches. Try <code style={{ color:'#1C6EF2' }}>/kb:</code>, <code style={{ color:'#1C6EF2' }}>/tool:</code>, or <code style={{ color:'#1C6EF2' }}>/procedure:</code>
                  </div>
                ) : top.map((s, i) => {
                  const meta = REF_TYPE_META[s.type];
                  return (
                    <button key={s.type+':'+s.slug} onClick={()=>add(s)} style={{
                      display:'flex', alignItems:'center', gap:8, width:'100%', padding:'6px 8px',
                      border:'none', background:'transparent', cursor:'pointer', textAlign:'left',
                      borderRadius:4, fontFamily:FF,
                    }}
                      onMouseEnter={e=>e.currentTarget.style.background='#F4F5F7'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <span style={{
                        font:'600 10px/14px Inter,sans-serif', color: meta.color, background: meta.bg,
                        border:`1px solid ${meta.border}`, borderRadius:4, padding:'1px 6px', minWidth:60, textAlign:'center',
                      }}>{meta.label}</span>
                      <span style={{ font:'600 12px/16px ui-monospace,SFMono-Regular,monospace', color:'#1A1D23' }}>{s.slug}</span>
                      <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6', marginLeft:'auto' }}>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function MonitorCard({ m }) {
    const [reviewOpen, setReviewOpen]     = React.useState(false);
    const [reviewVisible, setReviewVisible] = React.useState(false);
    const cardRef = React.useRef(null);
    const [narrow, setNarrow] = React.useState(false);
    React.useEffect(() => {
      if (!cardRef.current || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(entries => {
        for (const e of entries) setNarrow(e.contentRect.width < 500);
      });
      ro.observe(cardRef.current);
      return () => ro.disconnect();
    }, []);
    function openReview() { setReviewOpen(true); requestAnimationFrame(() => setReviewVisible(true)); }
    function closeReview() { setReviewVisible(false); setTimeout(() => setReviewOpen(false), 280); }

    // Single source of truth — edits apply live, no save button
    const [name, setName]             = React.useState(m.name);
    const [goalId, setGoalId]         = React.useState(m.goalIds?.[0] || '');
    const [threshold, setThreshold]   = React.useState(m.threshold);
    const [criteria, setCriteria]     = React.useState((m.criteria || []).map(c => ({ ...c, refs: seedRefsForCriterion(c) })));
    const [toast, setToast]           = React.useState(false);
    const [editing, setEditing]       = React.useState(false);

    const toastTimer = React.useRef(null);
    function flash() {
      setToast(true);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(false), 1800);
    }
    React.useEffect(() => () => clearTimeout(toastTimer.current), []);

    const flagged = flaggedConversations.filter(c => c.monitorId === m.id);
    const trend = m.trend || [];
    const trendDir = trend.length >= 2 ? (trend[trend.length-1] > trend[trend.length-2] ? 'up' : 'down') : null;
    const breached = m.passRate < threshold;
    const trendBaseline = trend.length >= 2
      ? trend.slice(0, trend.length - 1).reduce((s,v)=>s+v, 0) / (trend.length - 1)
      : m.passRate;
    const anomalyLevel = Math.max(0, Math.min(100, Math.round(trendBaseline - 8)));
    const anomalyBreached = m.passRate < anomalyLevel;
    const dotColor = breached ? C.red : C.blue;
    const totalWeight = criteria.reduce((s,c)=>s+(parseInt(c.weight)||0),0);
    const linkedGoal = goalById[goalId];

    // Inline editable name
    const nameInputStyle = {
      font:'700 16px/22px Inter,sans-serif', color:'#1A1D23',
      border:'1px solid transparent', borderRadius:6, padding:'2px 8px', margin:'-2px -8px',
      background:'transparent', outline:'none', minWidth:120, maxWidth:520, width:'100%',
      fontFamily:FF, transition:'border-color 0.12s, background 0.12s',
    };

    return (
      <div ref={cardRef} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:8, boxShadow:'0 2px 5px rgba(0,0,0,0.06)', overflow:'hidden', fontFamily:FF, marginBottom:14 }}>

        {/* Header — editable name + goal */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'14px 20px 12px', borderBottom:`1px solid ${C.border}`, gap:14 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:0, flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:dotColor, flexShrink:0 }}/>
              {editing ? (
                <input
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  onBlur={flash}
                  style={nameInputStyle}
                  onFocus={e=>{ e.currentTarget.style.borderColor='#DCE0E9'; e.currentTarget.style.background='#fff'; }}
                />
              ) : (
                <span style={{ font:'700 16px/22px Inter,sans-serif', color:'#1A1D23' }}>{name}</span>
              )}
              {m.isDefault
                ? <span style={{ font:'600 11px/14px Inter,sans-serif', color:'#5A6478', background:'#F4F5F7', border:'1px solid #DCE0E9', borderRadius:4, padding:'2px 7px', flexShrink:0 }}>Default</span>
                : <span style={{ font:'600 11px/14px Inter,sans-serif', color:'#1C6EF2', background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:4, padding:'2px 7px', flexShrink:0 }}>Custom</span>
              }
              <div style={{ flex:1 }}/>
              <button
                onClick={() => { if (editing) flash(); setEditing(v => !v); }}
                style={{
                  font:'600 12px/16px Inter,sans-serif',
                  color: editing ? '#fff' : '#1C6EF2',
                  background: editing ? '#1C6EF2' : '#EFF6FF',
                  border: editing ? '1px solid #1C6EF2' : '1px solid #BFDBFE',
                  borderRadius:6, padding:'5px 12px', cursor:'pointer',
                  display:'inline-flex', alignItems:'center', gap:5, flexShrink:0,
                }}
              >
                {editing
                  ? (<><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.5 2.5L9.5 3.5"/></svg>Done</>)
                  : (<><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 1.5l2 2-6 6-2.5.5.5-2.5z"/></svg>Edit</>)
                }
              </button>
            </div>
            {!window.K_HIDE_LINKED_GOAL && (
            <div style={{ display:'flex', alignItems:'center', gap:8, paddingLeft:18 }}>
              <span style={{ font:'400 11px/16px Inter,sans-serif', color:'#8A94A6', flexShrink:0 }}>Linked goal:</span>
              {editing ? (
                <select
                  value={goalId}
                  onChange={e=>{ setGoalId(e.target.value); flash(); }}
                  style={{
                    font:'600 12px/16px Inter,sans-serif', color: linkedGoal ? '#1C6EF2' : '#8A94A6',
                    background:'#fff', border:'1px solid #DCE0E9', borderRadius:4, padding:'2px 6px',
                    cursor:'pointer', outline:'none', fontFamily:FF, maxWidth:340,
                  }}
                >
                  <option value="">— No goal linked —</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              ) : (
                linkedGoal
                  ? <a style={{ font:'600 12px/16px Inter,sans-serif', color:'#1C6EF2', textDecoration:'none', cursor:'pointer' }}>{linkedGoal.name}</a>
                  : <span style={{ font:'400 12px/16px Inter,sans-serif', color:'#8A94A6' }}>No goal linked</span>
              )}
            </div>
            )}
          </div>
        </div>

        {/* Recommended anomaly — inline banner when monitor is below threshold */}
        {breached && !editing && (() => {
          const anomalies = (window.K_ANOMALIES_BY_MONITOR_ID || {})[m.id] || [];
          if (anomalies.length === 0) return null;
          const rank = { high: 3, med: 2, drift: 1, pos: 0 };
          const top = [...anomalies].filter(a => a.cat === 'criteria').sort((a,b) => (rank[b.sev]||0) - (rank[a.sev]||0))[0] || anomalies[0];
          if (!top) return null;
          const href = '#anomaly/' + top.id;
          const onJump = (e) => {
            window.K_PENDING_ANOMALY_ID = top.id;
            navigate({ screen: 'anomalies' });
          };
          return (
            <div style={{ padding:'10px 20px 0' }}>
              <a
                href={href}
                onClick={onJump}
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'4px 10px 4px 8px',
                  borderRadius:99,
                  background:'#FFFDE5', border:'1px solid #F9DF53',
                  textDecoration:'none', fontFamily:FF,
                  font:'500 12px/16px Inter,sans-serif',
                  color:'#6C5E1C',
                  maxWidth:'100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FEFAD2'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFDE5'; }}
              >
                <span style={{
                  flexShrink:0,
                  width:14, height:14, borderRadius:99,
                  background:'#F1C91E', color:'#3F3013',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  font:'700 9px/14px Inter,sans-serif',
                }}>!</span>
                <span style={{ fontWeight:700, color:'#6C5E1C', letterSpacing:0.2 }}>Start here:</span>
                <span style={{ color:'#1A1D23', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:280 }}>{top.metric}</span>
                <span style={{ color:'#6C5E1C', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0, flex:1 }}>· {top.head}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><polyline points="9 6 15 12 9 18"/></svg>
              </a>
            </div>
          );
        })()}

        {/* Metrics row — Pass rate + Threshold combined / 7-day trend */}
        <div style={{ display:'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1.4fr', borderBottom:`1px solid #F0F2F6` }}>
          <div style={{ display:'flex', flexDirection:'column', gap:8, padding:'14px 20px', borderRight: narrow ? 'none' : `1px solid ${C.border}`, borderBottom: narrow ? `1px solid ${C.border}` : 'none' }}>
            {!editing ? (
              <>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8 }}>
                  <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Pass rate</span>
                  <span style={{ font:'400 10px/14px Inter,sans-serif', color:'#8A94A6' }}>vs. {threshold}% threshold</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ font:'700 30px/34px Inter,sans-serif', color: breached ? C.red : '#1C6EF2' }}>{m.passRate}%</span>
                  <span style={{
                    font:'600 10px/14px Inter,sans-serif',
                    color: breached ? C.red : '#22A05B',
                    background: breached ? '#FEE6E6' : '#E6F4EC',
                    padding:'2px 6px', borderRadius:4,
                  }}>{breached ? 'Below' : 'Above threshold'}</span>
                </div>
                <div style={{ height:6, background:'#E8EBF0', borderRadius:3, position:'relative', marginTop:2 }} title={`${m.passRate}% passing · Threshold ${threshold}% · Anomaly ${anomalyLevel}%`}>
                  <div style={{ height:6, background: breached ? C.red : '#1C6EF2', borderRadius:3, width:`${m.passRate}%`, transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)' }}/>
                  {/* Anomaly threshold marker (dashed orange) */}
                  <div style={{ position:'absolute', top:-3, left:`${anomalyLevel}%`, width:0, height:12, borderLeft:'1.5px dashed #D97706' }}/>
                  <div style={{ position:'absolute', top:10, left:`${anomalyLevel}%`, transform:'translateX(-50%)', font:'600 9px/12px Inter,sans-serif', color:'#D97706', whiteSpace:'nowrap' }}>{anomalyLevel}%</div>
                  {/* Quality threshold marker (solid slate) */}
                  <div style={{ position:'absolute', top:-3, left:`${threshold}%`, width:2, height:12, background:'#5A6478', borderRadius:1 }}/>
                  <div style={{ position:'absolute', top:-14, left:`${threshold}%`, transform:'translateX(-50%)', font:'600 9px/12px Inter,sans-serif', color:'#5A6478', whiteSpace:'nowrap' }}>{threshold}%</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8 }}>
                  <span style={{ font:'600 12px/16px Inter,sans-serif', color:'#1A1D23' }}>Quality threshold</span>
                  <div style={{ display:'inline-flex', alignItems:'center', border:`1px solid ${C.border}`, borderRadius:5, background:'#fff', overflow:'hidden' }}>
                    <input
                      type="number" min="50" max="100" value={threshold}
                      onChange={e => setThreshold(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                      onBlur={e => { setThreshold(Math.max(50, Math.min(100, parseInt(e.target.value) || 50))); flash(); }}
                      style={{ width:48, padding:'4px 6px', border:'none', outline:'none', font:'700 16px/20px Inter,sans-serif', color:'#1A1D23', textAlign:'right', background:'transparent', fontFamily:FF, MozAppearance:'textfield' }}
                    />
                    <span style={{ font:'600 12px/20px Inter,sans-serif', color:'#8A94A6', paddingRight:8 }}>%</span>
                  </div>
                </div>
                <input
                  type="range" min="50" max="100" value={threshold}
                  onChange={e=>setThreshold(parseInt(e.target.value))}
                  onMouseUp={flash} onTouchEnd={flash} onKeyUp={flash}
                  style={{ width:'100%', accentColor:'#1C6EF2' }}
                />
                <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Score above this counts as passing.</span>
              </>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6, padding:'14px 20px' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:10 }}>
              <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>7-day trend</span>
              <span style={{ font:'600 11px/14px Inter,sans-serif', color: trendDir==='up' ? '#22A05B' : trendDir==='down' ? C.red : '#8A94A6' }}>
                {trendDir==='up' ? '↑ Up' : trendDir==='down' ? '↓ Down' : '→ Stable'}
              </span>
            </div>
            {(() => {
              if (trend.length < 2) return <div style={{ height:46, fontSize:11, color:'#8A94A6' }}>Not enough data</div>;
              const W = 240, H = 46, P = 4;
              const baseline = trend.slice(0, Math.max(1, trend.length - 1)).reduce((s,v)=>s+v, 0) / Math.max(1, trend.length - 1);
              const anomaly = baseline - 8;
              // Always include the anomaly threshold in the y-range, plus a little padding
              const min = Math.min(...trend, anomaly) - 3;
              const max = Math.max(...trend, anomaly) + 3;
              const span = Math.max(1, max - min);
              const x = i => P + (i * (W - 2*P)) / (trend.length - 1);
              const y = v => H - P - ((v - min) / span) * (H - 2*P);
              const pts = trend.map((v,i) => `${x(i)},${y(v)}`).join(' ');
              const anomalyY = y(anomaly); // anomaly threshold = baseline - 8pp
              const lastY = y(trend[trend.length-1]);
              const lastX = x(trend.length-1);
              const breachAnom = trend[trend.length-1] < (baseline - 8);
              return (
                <div>
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:'block' }}>
                    {/* Anomaly threshold dashed line */}
                    <line x1={P} x2={W-P} y1={anomalyY} y2={anomalyY} stroke="#D97706" strokeWidth="1" strokeDasharray="3 3" opacity="0.7"/>
                    {/* Trend line */}
                    <polyline points={pts} fill="none" stroke={breachAnom ? '#D9534F' : '#1C6EF2'} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
                    {/* Last point dot */}
                    <circle cx={lastX} cy={lastY} r="2.4" fill={breachAnom ? '#D9534F' : '#1C6EF2'}/>
                  </svg>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:4, font:'400 10px/14px Inter,sans-serif', color:'#8A94A6' }}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                      <span style={{ width:10, height:1.6, background:'#1C6EF2', display:'inline-block' }}/> Pass rate
                    </span>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                      <span style={{ width:10, height:0, borderTop:'1px dashed #D97706', display:'inline-block' }}/> Anomaly threshold
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Scoring criteria — always visible, editable */}
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, background:'#FAFBFC' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4, gap:10 }}>
            <span style={{ font:'600 13px/18px Inter,sans-serif', color:'#1A1D23' }}>Scoring criteria</span>
            {editing && (
              <span style={{
                display:'inline-flex', alignItems:'center', gap:6,
                font:'600 11px/16px Inter,sans-serif',
                padding:'2px 8px', borderRadius:999,
                background: totalWeight === 100 ? 'var(--green-15, #e8f6ec)' : 'var(--red-15, #FFE8E9)',
                border: '1px solid ' + (totalWeight === 100 ? 'var(--green-40, #B7E0C1)' : 'var(--red-30, #FFAAAD)'),
                color: totalWeight === 100 ? 'var(--green-95, #15803D)' : 'var(--red-90, #9E181E)',
              }}>
                {totalWeight === 100
                  ? <>✓ Weights total 100%</>
                  : <>⚠ Weights total {totalWeight}% — must equal 100%</>}
              </span>
            )}
          </div>
          <div style={{ font:'400 11px/16px Inter,sans-serif', color:'#5A6478', marginBottom:12 }}>What evaluation looks for. Weights determine each criterion's contribution — should sum to 100%.</div>

          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {criteria.map((c, idx) => editing ? (
              <div key={idx} style={{ padding:'10px 12px', background:'#fff', border:`1px solid ${C.border}`, borderRadius:7 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <input
                    value={c.name || ''}
                    onChange={e => setCriteria(p => p.map((x,i)=>i===idx?{...x, name:e.target.value}:x))}
                    onBlur={flash}
                    placeholder="Criterion name"
                    style={{
                      flex:1, minWidth:0, padding:'5px 8px', borderRadius:5, border:'1px solid #DCE0E9',
                      font:'600 12px/16px Inter,sans-serif', fontFamily:FF, color:'#1A1D23', outline:'none', background:'#fff',
                    }}
                  />
                  {window.K_ANOMALY_BY_CRITERION?.[c.name] && (
                    <span title="Active anomaly on this criterion" style={{ font:'600 10px/14px Inter,sans-serif', color:'#9E181E', background:'#FFE8E9', border:'1px solid #FFAAAD', borderRadius:4, padding:'1px 6px', flexShrink:0, letterSpacing:'0.03em' }}>Anomaly</span>
                  )}
                  <div style={{ display:'inline-flex', alignItems:'center', border:`1px solid ${C.border}`, borderRadius:4, background:'#fff', overflow:'hidden', flexShrink:0 }}>
                    <input
                      type="number" min="0" max="100" value={c.weight ?? 0}
                      onChange={e => {
                        const v = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setCriteria(p => p.map((x,i)=>i===idx?{...x, weight:v}:x));
                      }}
                      onBlur={e => {
                        const v = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                        setCriteria(p => p.map((x,i)=>i===idx?{...x, weight:v}:x));
                        flash();
                      }}
                      title="Weight"
                      style={{ width:42, padding:'4px 6px', border:'none', outline:'none', font:'600 12px/16px Inter,sans-serif', color:'#1A1D23', textAlign:'right', background:'transparent', fontFamily:FF, MozAppearance:'textfield' }}
                    />
                    <span style={{ font:'400 11px/16px Inter,sans-serif', color:'#8A94A6', paddingRight:6 }}>%</span>
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:5, font:'500 11px/14px Inter,sans-serif', color:'#5A6478', cursor:'pointer', paddingLeft:8, borderLeft:`1px solid ${C.border}`, flexShrink:0 }}>
                    <input
                      type="checkbox"
                      checked={!!c.essential}
                      onChange={e => { setCriteria(p => p.map((x,i)=>i===idx?{...x, essential:e.target.checked}:x)); flash(); }}
                      style={{ accentColor:'#1C6EF2' }}
                    />
                    Essential
                  </label>
                  <button
                    onClick={() => { setCriteria(p => p.filter((_,i)=>i!==idx)); flash(); }}
                    title="Remove criterion"
                    style={{ background:'none', border:'1px solid #DCE0E9', borderRadius:5, padding:'2px 7px', height:24, cursor:'pointer', color:'#8A94A6', fontSize:14, lineHeight:1, flexShrink:0 }}
                  >×</button>
                </div>
                <RubricRefEditor
                  refs={c.refs || []}
                  onChange={(next) => { setCriteria(p => p.map((x,i)=>i===idx?{...x, refs: next}:x)); flash(); }}
                />
              </div>
            ) : (
              <div key={idx} style={{ padding:'8px 12px', background:'#fff', border:`1px solid ${C.border}`, borderRadius:7 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0, flex:1 }}>
                    <span style={{ font:'600 12px/16px Inter,sans-serif', color:'#1A1D23', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name || 'Untitled criterion'}</span>
                    {c.essential && <span style={{ font:'600 10px/14px Inter,sans-serif', color:'#9B5A00', background:'#FFF4E0', border:'1px solid #FCE0B0', borderRadius:4, padding:'1px 6px', flexShrink:0 }}>Essential</span>}
                    {window.K_ANOMALY_BY_CRITERION?.[c.name] && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); window.K_PENDING_ANOMALY_ID = window.K_ANOMALY_BY_CRITERION[c.name]; navigate({ screen: 'anomalies' }); }}
                        title="Open anomaly detail"
                        style={{ font:'600 10px/14px Inter,sans-serif', color:'#9E181E', background:'#FFE8E9', border:'1px solid #FFAAAD', borderRadius:4, padding:'1px 7px 1px 6px', flexShrink:0, cursor:'pointer', letterSpacing:'0.03em', display:'inline-flex', alignItems:'center', gap:3, fontFamily:FF }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FFD0D2'; e.currentTarget.style.borderColor = '#FF9B9F'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FFE8E9'; e.currentTarget.style.borderColor = '#FFAAAD'; }}
                      >Anomaly <span aria-hidden="true" style={{ fontSize:9 }}>→</span></button>
                    )}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
                    <span style={{ font:'400 11px/14px Inter,sans-serif', color:'#8A94A6' }}>Weight {c.weight || 0}%</span>
                    <span style={{ font:'600 12px/14px Inter,sans-serif', color: (c.pass||0) >= 80 ? '#22A05B' : (c.pass||0) >= 65 ? '#D4A017' : C.red, minWidth:54, textAlign:'right' }}>
                      {c.pass != null ? `${c.pass}% pass` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editing && (
            <button
              onClick={() => { setCriteria(p => [...p, { name:'', weight:0, essential:false }]); flash(); }}
              style={{
                marginTop:8, padding:'8px 12px', borderRadius:6, border:`1px dashed ${C.border}`,
                background:'#fff', cursor:'pointer', font:'500 12px/16px Inter,sans-serif', color:'#5A6478', width:'100%', textAlign:'left', fontFamily:FF,
              }}
            >+ Add criterion</button>
          )}
        </div>

        {/* Review conversations CTA — hidden while editing */}
        {!editing && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px' }}>
          <span style={{ font:'600 13px/18px Inter,sans-serif', color:'#1A1D23' }}>Conversations</span>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={openReview} style={{ font:'600 13px/18px Inter,sans-serif', color:'#1C6EF2', background:'none', border:'none', cursor:'pointer', padding:0, display:'inline-flex', alignItems:'center', gap:5 }}>
              Review conversations
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3l3.5 2.5L4 8"/></svg>
            </button>
          </div>
        </div>
        )}

        {reviewOpen && <ReviewPanel m={m} flagged={flagged} visible={reviewVisible} onClose={closeReview} openConvo={openConvo} C={C} FF={FF}/>}

        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1A1D23', color:'#fff', font:'600 13px/20px Inter,sans-serif', padding:'10px 18px', borderRadius:8, zIndex:100, whiteSpace:'nowrap', boxShadow:'0 6px 20px rgba(15,18,25,0.22)' }}>
            ✓ Changes saved
          </div>
        )}
      </div>
    );
  }

  const defaultMonitors = monitors.filter(m => m.isDefault);
  const customMonitors  = monitors.filter(m => !m.isDefault);
  const atLimit = customMonitors.length >= 1;

  // ── Search + Jump-to (filter + scroll-to-card) ──────────────────────────
  const [query, setQuery]             = React.useState('');
  const [highlightId, setHighlightId] = React.useState(null);
  const highlightTimer = React.useRef(null);

  const q = query.trim().toLowerCase();
  const matchMonitor = (m) => {
    if (!q) return true;
    if ((m.name || '').toLowerCase().includes(q)) return true;
    if ((m.criteria || []).some(c => (c.name || '').toLowerCase().includes(q))) return true;
    const goal = goalById[(m.goalIds || [])[0]];
    if (goal && (goal.name || '').toLowerCase().includes(q)) return true;
    return false;
  };
  const visibleDefaults = defaultMonitors.filter(matchMonitor);
  const visibleCustoms  = customMonitors.filter(matchMonitor);
  const totalVisible    = visibleDefaults.length + visibleCustoms.length;

  function jumpTo(id) {
    if (!id) return;
    const el = document.getElementById('mon-' + id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightId(id);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightId(null), 2200);
  }
  React.useEffect(() => () => clearTimeout(highlightTimer.current), []);

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

              {/* 3. Linked goal */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Linked business outcome</label>
                <select value={linkedGoal} onChange={e=>setLinkedGoal(e.target.value)} style={{
                  width:'100%', padding:'9px 12px', borderRadius:6, border:`1px solid ${C.border}`,
                  fontSize:13, fontFamily:FF, color:C.textPrimary, outline:'none', height:36, background:'#fff',
                }}>
                  <option value="">— Don't link to a goal —</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:6, lineHeight:1.5 }}>Connects this monitor to a goal so signals contribute to that outcome.</div>
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
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>Score above this counts as passing for the pass-rate metric. Every conversation is scored and reviewable.</div>
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
            Monitors evaluate conversations against quality criteria to surface trends, flagged conversations, and review candidates across AI and human-assisted interactions.
          </p>
        </div>
        <div style={{ flexShrink:0 }}>
          <button onClick={openCreate} style={{ padding:'9px 16px', borderRadius:8, border:'none', background:'#1C6EF2', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, height:36 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3v8M3 7h8"/></svg>
            Add monitoring
          </button>
        </div>
      </div>

      {/* Filter bar — search + jump-to */}
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:14,
        background:'#fff', border:`1px solid ${C.border}`, borderRadius:8,
        position:'sticky', top:8, zIndex:10, boxShadow:'0 1px 2px rgba(15,18,25,0.04)',
      }}>
        <div style={{ position:'relative', flex:1, maxWidth:380 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#8A94A6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}>
            <circle cx="6" cy="6" r="4.5"/><path d="M9.2 9.2L12 12"/>
          </svg>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search monitors, criteria, or linked goals…"
            style={{
              width:'100%', padding:'7px 30px 7px 30px', borderRadius:6,
              border:`1px solid ${C.border}`, font:'400 13px/18px Inter,sans-serif', fontFamily:FF,
              color:'#1A1D23', outline:'none', background:'#fff', height:32,
            }}
          />
          {query && (
            <button onClick={()=>setQuery('')} title="Clear" style={{
              position:'absolute', right:6, top:'50%', transform:'translateY(-50%)',
              width:20, height:20, borderRadius:4, border:'none', background:'transparent',
              cursor:'pointer', color:'#8A94A6', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 2l6 6M8 2L2 8"/></svg>
            </button>
          )}
        </div>

        <div style={{ width:1, alignSelf:'stretch', background:C.border, margin:'0 2px' }}/>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ font:'500 12px/16px Inter,sans-serif', color:'#5A6478' }}>Jump to:</span>
          <select
            value=""
            onChange={e=>{ jumpTo(e.target.value); e.target.value=''; }}
            style={{
              padding:'6px 8px', borderRadius:6, border:`1px solid ${C.border}`,
              font:'500 12px/16px Inter,sans-serif', fontFamily:FF, color:'#1A1D23',
              background:'#fff', cursor:'pointer', outline:'none', height:32, minWidth:200,
            }}
          >
            <option value="">Select monitor…</option>
            {[...defaultMonitors, ...customMonitors].map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex:1 }}/>

        <span style={{ font:'500 12px/16px Inter,sans-serif', color:'#8A94A6' }}>
          {q ? `${totalVisible} of ${monitors.length} match` : `${monitors.length} monitors`}
        </span>
      </div>

      {/* All monitors */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
        {visibleDefaults.map(m => (
          <div key={m.id} id={`mon-${m.id}`} style={{ borderRadius:10, scrollMarginTop:80, transition:'box-shadow 0.4s ease, transform 0.4s ease', boxShadow: highlightId === m.id ? '0 0 0 3px rgba(28,110,242,0.45), 0 6px 18px rgba(28,110,242,0.18)' : 'none' }}>
            <MonitorCard m={m}/>
          </div>
        ))}
      </div>

      {/* Custom monitor */}
      <div>
        {visibleCustoms.length > 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {visibleCustoms.map(m => (
              <div key={m.id} id={`mon-${m.id}`} style={{ borderRadius:10, scrollMarginTop:80, transition:'box-shadow 0.4s ease', boxShadow: highlightId === m.id ? '0 0 0 3px rgba(28,110,242,0.45), 0 6px 18px rgba(28,110,242,0.18)' : 'none' }}>
                <MonitorCard m={m}/>
              </div>
            ))}
          </div>
        ) : q ? (
          <div style={{ padding:'24px 20px', border:`1px dashed ${C.border}`, borderRadius:10, background:C.surface, textAlign:'center', fontSize:13, color:C.textMuted }}>
            No monitors match “{query}”.
          </div>
        ) : (
          <div style={{ padding:'24px 20px', border:`1px dashed ${C.border}`, borderRadius:10, background:C.surface, textAlign:'center' }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>No custom monitor yet</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:14, lineHeight:1.5 }}>Add a monitor tailored to your business. Conversations are scored automatically — results are surfaced for your review.</div>
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

window.buildReviewQueue = buildReviewQueue;
window.buildPatternSuggestions = buildPatternSuggestions;
// Expose passing-conversation transcripts to the drawer (reads from buildReviewQueue templates).
window.lookupMonitorConv = function(id) {
  // Reuse the passing templates from buildReviewQueue by calling it with a stub monitor.
  const queue = buildReviewQueue({ id: '__lookup__', criteria: [] }, []);
  return queue.find(c => c.id === id) || null;
};
window.MonitorsList = MonitorsList;
window.MonitorDetail = MonitorDetail;
