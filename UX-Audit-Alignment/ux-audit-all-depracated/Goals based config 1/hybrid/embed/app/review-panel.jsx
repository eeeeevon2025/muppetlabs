// Ground-truth review panel — slides in from right
// Shows AI-detected pattern suggestions on top, then a labeling queue
// where reviewers mark conversations as Good / Bad / Skip examples.
function truncate(s, n) { s = (s || '').replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function ReviewPanel({ m, flagged, visible, onClose, openConvo, C, FF, headerKicker, headerTitle, headerSub, headerCustom, extraBodyTop, initialPatternId, hidePatternFilters, customFilters, pageSize = 5, totalCountOverride }) {
  const queue = React.useMemo(() => window.buildReviewQueue(m, flagged), [m, flagged]);
  const patterns = React.useMemo(() => window.buildPatternSuggestions(m), [m]);
  const [labels, setLabels] = React.useState({}); // { [convId]: 'good' | 'bad' | 'skip' }
  const [collapsed, setCollapsed] = React.useState({}); // default: every conv expanded
  const [dismissed, setDismissed] = React.useState({});
  const [activePattern, setActivePattern] = React.useState(
    initialPatternId ? (patterns.find(p => p.id === initialPatternId) || null) : null
  );
  // Custom filter (when customFilters prop is supplied)
  const [activeCustomFilterId, setActiveCustomFilterId] = React.useState(null);
  const activeCustomFilter = (customFilters || []).find(f => f.id === activeCustomFilterId);

  // Pagination — show first N then "Load more"
  const [loadedCount, setLoadedCount] = React.useState(pageSize);
  React.useEffect(() => { setLoadedCount(pageSize); }, [activePattern, activeCustomFilterId, pageSize]);

  // Build synthetic stubs for pattern convoIds that aren't in the real queue.
  // Every conversation must carry per-criterion scores — even one-line stubs —
  // because everything is graded against the monitor's criteria, always.
  const queueById = React.useMemo(() => Object.fromEntries(queue.map(c => [c.id, c])), [queue]);
  function hashSeed(s) { let h = 2166136261; for (let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = (h*16777619)>>>0; } return h; }
  function stubForId(cid, p) {
    if (queueById[cid]) return queueById[cid];
    const isUnusualPass = p?.kind === 'unusual_pass';
    const affects = p?.affects || '';
    const seed = hashSeed(cid);
    const monitorCriteria = (m?.criteria || []);
    // Generate a per-criterion score for every criterion on the monitor.
    const criteriaScores = monitorCriteria.map((cr, i) => {
      const isAffected = affects && cr.name && (
        cr.name.toLowerCase().includes(affects.toLowerCase()) ||
        affects.toLowerCase().includes(cr.name.toLowerCase())
      );
      let score;
      if (isUnusualPass) {
        // Unusual passing: everything scoring high — that's the suspicion.
        score = 88 + ((seed >> (i*3)) & 0x7); // 88–95
      } else if (isAffected) {
        // The clustered-failure criterion fails low.
        score = 28 + ((seed >> (i*3)) & 0xF); // 28–43
      } else {
        // Other criteria still pass, mid-high.
        score = 70 + ((seed >> (i*3)) & 0x13); // 70–89
      }
      return {
        name: cr.name,
        weight: cr.weight,
        essential: !!cr.essential,
        score,
        pass: score >= 60,
        rationale: isAffected
          ? 'AI scorer detected this pattern in the conversation. Open to verify rationale.'
          : undefined,
      };
    });
    // Roll up to overall score using weights (or a flat avg if weights missing).
    const totalW = criteriaScores.reduce((a,c) => a + (c.weight||0), 0) || criteriaScores.length;
    const overall = criteriaScores.length === 0 ? (isUnusualPass ? 96 : 58)
      : Math.round(criteriaScores.reduce((a,c) => a + c.score * (c.weight || 1), 0) / totalW);
    const anyEssentialFail = criteriaScores.some(c => c.essential && !c.pass);
    return {
      id: cid,
      customer: '—',
      customerCompany: 'Pattern match',
      score: overall,
      status: (isUnusualPass ? true : !anyEssentialFail && overall >= 60) ? 'pass' : 'fail',
      timeAgo: 'recent',
      preview: p?.body || 'Flagged by AI pattern detection.',
      criteriaScores,
      messages: null,
    };
  }
  const visibleQueue = activeCustomFilter
    ? queue.filter(activeCustomFilter.filterFn || (() => true))
    : activePattern
      ? (activePattern.convoIds || []).map(cid => stubForId(cid, activePattern))
      : queue;
  // Total to display in counters (cluster size if overridden)
  const totalForDisplay = activeCustomFilter
    ? activeCustomFilter.count
    : activePattern
      ? (activePattern.convoIds || []).length
      : (totalCountOverride != null ? totalCountOverride : visibleQueue.length);
  const displayedQueue = visibleQueue.slice(0, loadedCount);
  const hasMore = displayedQueue.length < visibleQueue.length || displayedQueue.length < totalForDisplay;

  // Set of conv IDs tied to an active anomaly on this monitor.
  const anomalyConvIds = React.useMemo(() => {
    const set = new Set();
    (patterns || []).forEach(p => (p.convoIds || []).forEach(cid => set.add(cid)));
    return set;
  }, [patterns]);

  const labeledCount = Object.keys(labels).length;

  // Preserve scroll position when labeling — inline-defined ConvCard remounts on
  // every state change, which would otherwise jump scroll back to top.
  const bodyRef = React.useRef(null);
  const restoreScroll = React.useRef(null);
  React.useLayoutEffect(() => {
    if (restoreScroll.current != null && bodyRef.current) {
      bodyRef.current.scrollTop = restoreScroll.current;
      restoreScroll.current = null;
    }
  });

  function setLabel(id, kind) {
    if (bodyRef.current) restoreScroll.current = bodyRef.current.scrollTop;
    setLabels(p => ({ ...p, [id]: kind }));
  }

  // Clickable conv-id chip -> opens conversation drawer
  function ConvChip({ id, tone }) {
    return (
      <button
        onClick={() => openConvo && openConvo(id)}
        title={`Open ${id}`}
        style={{
          display:'inline-flex', alignItems:'center', gap:4,
          font:'600 11px/14px ui-monospace,Menlo,Consolas,monospace',
          color: tone?.fg || '#1C6EF2',
          background:'#fff',
          border:`1px solid ${tone?.bor || '#BFDBFE'}`,
          padding:'3px 7px', borderRadius:4, cursor:'pointer',
          transition:'background 0.12s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = tone?.bg || '#EFF6FF'}
        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
      >
        {id}
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 1.5h4.5V6M7.5 1.5L4 5M3.5 2.5H2v5h5V6"/></svg>
      </button>
    );
  }

  // ── Pattern suggestion bar ─────────────────────────────────────────────
  function PatternCard({ p }) {
    const tone = p.kind === 'unusual_pass'
      ? { fg:'#7C3AED', bg:'#F5F3FF', bor:'#DDD6FE', label:'Unusual passing' }
      : p.severity === 'high'
        ? { fg:'#B91C1C', bg:'#FEF2F2', bor:'#FCA5A5', label:'Clustered failure' }
        : { fg:'#B45309', bg:'#FFFBEB', bor:'#FCD34D', label:'Pattern detected' };
    return (
      <div style={{ padding:'8px 10px', borderRadius:7, border:`1px solid ${tone.bor}`, background:tone.bg, marginBottom:6, fontFamily:FF }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:0.4, textTransform:'uppercase', color:tone.fg, background:'#fff', border:`1px solid ${tone.bor}`, padding:'1px 5px', borderRadius:3, flexShrink:0 }}>{p.kind === 'unusual_pass' ? 'Unusual pass' : 'Anomaly'}</span>
          <span style={{ fontSize:12, fontWeight:600, color:C.textPrimary, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{p.title}</span>
          <span style={{ fontSize:11, color:C.textMuted, flexShrink:0 }}>{p.affects}</span>
        </div>
        {p.convoIds?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
            {p.convoIds.map(cid => <ConvChip key={cid} id={cid} tone={tone}/>)}
          </div>
        )}
      </div>
    );
  }

  // ── Conversation review card ──────────────────────────────────────────
  function ConvCard({ c }) {
    const expanded = !collapsed[c.id];
    const [showAnnotated, setShowAnnotated] = React.useState(false);
    const label = labels[c.id];
    const passColor = c.status === 'pass' ? '#16A34A' : '#DC2626';
    const passBg    = c.status === 'pass' ? '#F0FDF4' : '#FEF2F2';
    const passBor   = c.status === 'pass' ? '#86EFAC' : '#FECACA';

    const labelStyle = (kind) => {
      const active = label === kind;
      const colorMap = {
        good: { fg:'#16A34A', bg:'#F0FDF4', bor:'#86EFAC' },
        bad:  { fg:'#DC2626', bg:'#FEF2F2', bor:'#FECACA' },
        skip: { fg:'#5A6478', bg:'#F4F5F7', bor:'#DCE0E9' },
      };
      const t = colorMap[kind];
      return {
        padding:'6px 12px', borderRadius:6, fontSize:12, fontWeight:600, fontFamily:FF, cursor:'pointer',
        border:`1px solid ${active ? t.fg : t.bor}`,
        background: active ? t.bg : '#fff',
        color: active ? t.fg : C.textSec,
        flex:1, transition:'all 0.12s',
      };
    };

    return (
      <div style={{
        border:`1px solid ${label ? '#86EFAC' : C.border}`,
        borderRadius:8, marginBottom:10, background:'#fff',
        boxShadow: label ? '0 0 0 2px rgba(22,163,74,0.08)' : 'none',
        transition:'all 0.15s',
        opacity: label === 'skip' ? 0.6 : 1,
      }}>
        {/* Header */}
        <div style={{ padding:'12px 14px 10px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <button
              onClick={() => openConvo && openConvo(c.id)}
              title={`Open ${c.id}`}
              style={{ background:'none', border:'none', padding:0, cursor: openConvo ? 'pointer' : 'default', font:'600 12px/16px ui-monospace,Menlo,Consolas,monospace', color:'#1C6EF2', textDecoration:'underline', textUnderlineOffset:2, fontFamily:'ui-monospace,Menlo,Consolas,monospace' }}
            >{c.id}</button>
            <span style={{ fontSize:10, fontWeight:700, color:passColor, background:passBg, border:`1px solid ${passBor}`, padding:'2px 6px', borderRadius:4, textTransform:'uppercase', letterSpacing:0.3, marginLeft:'auto' }}>
              {c.status === 'pass' ? `Pass · ${c.score}/100` : `Fail · ${c.score}/100`}
            </span>
          </div>
          <div style={{ fontSize:12, color:C.textSec, lineHeight:1.5 }}>
            <span style={{ color:C.textPrimary, fontWeight:600 }}>{c.customer}</span> · {c.customerCompany} · <span style={{ color:C.textMuted }}>{c.timeAgo}</span>
          </div>
        </div>

        {/* Criteria breakdown */}
        <div style={{ padding:'10px 14px 4px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:0.4, textTransform:'uppercase', color:C.textMuted }}>Criteria</div>
            {(c.criteriaScores || []).length > 0 && (
              <div style={{ fontSize:10, color:C.textMuted }}>Each scored 0–100</div>
            )}
          </div>
          {(c.criteriaScores || []).length === 0 ? (
            <div style={{ padding:'10px 12px', background:'#FFFBEB', border:`1px dashed #FCD34D`, borderRadius:6, fontSize:11, color:'#92400E', lineHeight:1.5, marginBottom:6 }}>
              <div style={{ fontWeight:600, marginBottom:3, color:'#78350F' }}>Per-criterion rationale expired</div>
              Detailed scores are retained for 30 days. After that, only the overall score and pass/fail outcome remain in long-term storage. This conversation scored <strong>{c.score}/100</strong> against the monitor — open the full conversation to review the messages directly.
            </div>
          ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {(c.criteriaScores || []).map(cr => {
              const ok = cr.pass;
              return (
                <div key={cr.name} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:14, height:14, borderRadius:99, background: ok ? '#F0FDF4' : '#FEF2F2', border:`1px solid ${ok ? '#86EFAC' : '#FECACA'}`, color: ok ? '#16A34A' : '#DC2626', fontSize:10, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {ok ? '✓' : '×'}
                  </span>
                  <span style={{ fontSize:12, color:C.textPrimary, flex:1, lineHeight:1.4 }}>{cr.name}</span>
                  <span style={{ fontSize:11, fontWeight:600, color: ok ? '#16A34A' : '#DC2626' }}>{cr.score}<span style={{ color:C.textMuted, fontWeight:400 }}>/100</span></span>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Judge reasoning — removed; chronology view replaces it */}

        {/* View conversation toggle */}
        <div style={{ padding:'8px 14px 12px' }}>
          <button onClick={() => setCollapsed(p => ({ ...p, [c.id]: !p[c.id] }))} style={{
            background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:FF,
            fontSize:11, fontWeight:600, color:'#1C6EF2', display:'inline-flex', alignItems:'center', gap:5,
          }}>
            {expanded ? 'Hide conversation' : 'View conversation'}
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6"
              style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition:'transform 0.15s' }}>
              <path d="M3 2l3 2.5L3 7" strokeLinecap="round"/>
            </svg>
          </button>

          {expanded && c.messages && (() => {
            // Per-criterion miss-pattern dictionary. Picks the AI turn that
            // most plausibly triggered the verdict, not just the first one.
            const PATTERNS = {
              resolution:   /coupon|discount|voucher|store credit|replacement|gift card|instead/i,
              policy:       /per (our )?policy|per process|policy (window|requires|states)|protocol|per our/i,
              verification: /already authenticated|already verified|no need to verify|account was already/i,
              tool:         /prior session|cached|stale|earlier session|delivered|signature on file/i,
              closing:      /anything else|all set|have a (great|good) day/i,
            };
            const RE_ASK = /actually|but|wait|already|asked|I said|I want|just (the )?refund|no, |third time|second time/i;

            function categoriesFor(crName) {
              const n = (crName || '').toLowerCase();
              if (/resolved|need|intent|outcome|solve/.test(n)) return ['resolution'];
              if (/tone|empathy|frustration|emotional/.test(n)) return ['policy'];
              if (/verif|identity|auth|disclosure/.test(n))     return ['verification', 'policy'];
              if (/tool|lookup|customer.id|session|stale/.test(n)) return ['tool', 'verification'];
              if (/close|follow.up|confirm|confirmation/.test(n)) return ['closing'];
              return ['resolution', 'policy'];
            }

            const msgs = c.messages;
            const tagsByTurn = {};
            (c.criteriaScores || []).forEach(cr => {
              const ok = cr.pass;
              if (!ok) {
                // 1. Find the AI turn that most plausibly triggered the miss
                const cats = categoriesFor(cr.name);
                let aiMissIdx = -1;
                for (const cat of cats) {
                  const pat = PATTERNS[cat];
                  const idx = msgs.findIndex(mm => mm.role === 'ai' && pat.test(mm.text || ''));
                  if (idx >= 0) { aiMissIdx = idx; break; }
                }
                if (aiMissIdx < 0) aiMissIdx = msgs.findIndex(mm => mm.role === 'ai');
                if (aiMissIdx >= 0) {
                  (tagsByTurn[aiMissIdx] = tagsByTurn[aiMissIdx] || []).push({ tag:'missed', cr });
                }
                // 2. Customer context — prefer the next customer turn after the miss
                //    that contains re-ask / pushback phrasing
                let custIdx = msgs.findIndex((mm, i) => i > aiMissIdx && mm.role === 'customer' && RE_ASK.test(mm.text || ''));
                if (custIdx < 0) custIdx = msgs.findIndex(mm => mm.role === 'customer' && RE_ASK.test(mm.text || ''));
                if (custIdx < 0) custIdx = msgs.findIndex(mm => mm.role === 'customer');
                if (custIdx >= 0 && custIdx !== aiMissIdx) {
                  (tagsByTurn[custIdx] = tagsByTurn[custIdx] || []).push({ tag:'context', cr });
                }
              } else {
                const aiIdx = msgs.findIndex(mm => mm.role === 'ai');
                if (aiIdx >= 0) {
                  (tagsByTurn[aiIdx] = tagsByTurn[aiIdx] || []).push({ tag:'matched', cr });
                }
              }
            });
            const shown = msgs.slice(0, 5);
            return (
            <div style={{ marginTop:10, padding:0, background:'#FAFBFC', border:`1px solid ${C.border}`, borderRadius:6, overflow:'hidden' }}>
              {/* View-mode subtoggle */}
              <div style={{ display:'flex', alignItems:'center', gap:0, padding:'6px 10px', borderBottom:`1px solid ${C.border}`, background:'#fff' }}>
                <span style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:0.4, textTransform:'uppercase', marginRight:8 }}>View</span>
                {[
                  { k: false, label: 'Transcript' },
                  { k: true,  label: 'With scoring' },
                ].map(opt => {
                  const on = showAnnotated === opt.k;
                  return (
                    <button key={String(opt.k)} onClick={() => setShowAnnotated(opt.k)} style={{
                      fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:99, cursor:'pointer',
                      border:`1px solid ${on ? '#1C6EF2' : C.border}`,
                      background: on ? '#1C6EF2' : '#fff',
                      color: on ? '#fff' : C.textSec,
                      fontFamily:FF, marginRight:4, transition:'all 0.12s',
                    }}>{opt.label}</button>
                  );
                })}
                {/* "Scored against N criteria" hidden — already visible in the criteria list above */}
              </div>

              {/* Turns */}
              <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap: showAnnotated ? 10 : 6 }}>
                {shown.map((msg, i) => {
                  const tags = tagsByTurn[i] || [];
                  return showAnnotated ? (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 180px', gap:10, alignItems:'flex-start' }}>
                      <div>
                        <div style={{ fontSize:10, fontWeight:600, color: msg.role === 'customer' ? '#7C3AED' : '#1C6EF2', textTransform:'uppercase', letterSpacing:0.4 }}>
                          turn {i + 1} · {msg.role === 'customer' ? 'Customer' : 'AI'} · {msg.time}
                        </div>
                        <div style={{ fontSize:12, color:C.textPrimary, lineHeight:1.5, marginTop:2 }}>{msg.text}</div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:4, paddingLeft:8, borderLeft:`2px solid ${tags.length === 0 ? C.border : (tags.some(t => t.tag === 'missed') ? '#FECACA' : tags.some(t => t.tag === 'matched') ? '#86EFAC' : '#FCD34D')}` }}>
                        {tags.length === 0 ? (
                          <span style={{ fontSize:10, color:C.textMuted, fontStyle:'italic', lineHeight:1.4 }}>no scoring signal</span>
                        ) : tags.map((t, ti) => {
                          const tone = t.tag === 'matched' ? { fg:'#16A34A', bg:'#F0FDF4', bor:'#86EFAC' }
                            : t.tag === 'missed' ? { fg:'#DC2626', bg:'#FEF2F2', bor:'#FECACA' }
                            : { fg:'#B45309', bg:'#FFFBEB', bor:'#FCD34D' };
                          return (
                            <div key={ti} style={{ padding:'4px 6px', borderRadius:4, background:tone.bg, border:`1px solid ${tone.bor}` }}>
                              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:2 }}>
                                <span style={{ fontSize:9, fontWeight:700, color:tone.fg, textTransform:'uppercase', letterSpacing:0.3 }}>{t.tag}</span>
                                <span style={{ fontSize:9, fontWeight:600, color:tone.fg, marginLeft:'auto', fontFamily:'ui-monospace,Menlo,Consolas,monospace' }}>{t.cr.score}/100</span>
                              </div>
                              <div style={{ fontSize:10, color:C.textSec, lineHeight:1.4 }}>{t.cr.name}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div key={i} style={{ display:'flex', flexDirection:'column', gap:2 }}>
                      <div style={{ fontSize:10, fontWeight:600, color: msg.role === 'customer' ? '#7C3AED' : '#1C6EF2', textTransform:'uppercase', letterSpacing:0.4 }}>
                        {msg.role === 'customer' ? 'Customer' : 'AI'} · {msg.time}
                      </div>
                      <div style={{ fontSize:12, color:C.textPrimary, lineHeight:1.5 }}>{msg.text}</div>
                    </div>
                  );
                })}
                {c.messages.length > 5 && (
                  <div style={{ paddingTop:6, borderTop:`1px dashed ${C.border}`, marginTop:2, fontSize:11, color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                    <span>{c.messages.length - 5} more turn{c.messages.length - 5 !== 1 ? 's' : ''} not shown</span>
                    <button
                      onClick={() => openConvo && openConvo(c.id)}
                      style={{ background:'none', border:'none', padding:0, cursor: openConvo ? 'pointer' : 'default', fontFamily:FF, fontSize:11, fontWeight:600, color:'#1C6EF2', display:'inline-flex', alignItems:'center', gap:4 }}
                    >
                      Go to full conversation
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 1.5h4.5V6M7.5 1.5L4 5M3.5 2.5H2v5h5V6"/></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Rollup footer hidden — redundant with the score chip in the header */}
            </div>
            );
          })()}
          {expanded && !c.messages && (
            <div style={{ marginTop:10, padding:'10px 12px', background:'#FAFBFC', border:`1px solid ${C.border}`, borderRadius:6, fontSize:11, color:C.textMuted, lineHeight:1.5 }}>
              {c.preview}
            </div>
          )}
        </div>

        {/* Label actions */}
        <div style={{ padding:'10px 14px', borderTop:`1px solid ${C.border}`, background:'#FAFBFC', borderRadius:'0 0 8px 8px' }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:0.4, textTransform:'uppercase', color:C.textMuted, marginBottom:6 }}>
            Mark as ground-truth example
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => setLabel(c.id, 'good')} style={labelStyle('good')}>
              ✓ Good example
            </button>
            <button onClick={() => setLabel(c.id, 'bad')} style={labelStyle('bad')}>
              ✕ False positive
            </button>
            <button onClick={() => setLabel(c.id, 'skip')} style={labelStyle('skip')}>
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(15,18,25,0.32)', zIndex:200,
        opacity: visible ? 1 : 0, transition:'opacity 0.24s ease',
      }}/>
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:600, maxWidth:'94vw',
        background:'#fff', boxShadow:'-8px 0 32px rgba(15,18,25,0.18)',
        zIndex:201, display:'flex', flexDirection:'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.32s cubic-bezier(0.22,1,0.36,1)',
        fontFamily:FF,
      }}>
        {/* Header */}
        <div style={{ padding:'18px 22px 14px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
            <div style={{ minWidth:0, flex:1 }}>
              {headerCustom || (<>
                <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, letterSpacing:0.4, textTransform:'uppercase', marginBottom:4 }}>{headerKicker || 'Review conversations · ground truth'}</div>
                <h2 style={{ fontSize:18, fontWeight:700, color:C.textPrimary, margin:0, lineHeight:1.3 }}>{headerTitle || m.name}</h2>
                {headerSub && <div style={{ fontSize:12, color:C.textSec, marginTop:4, lineHeight:1.5 }}>{headerSub}</div>}
              </>)}
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:6, color:C.textMuted, height:32, width:32, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div ref={bodyRef} style={{ flex:1, overflowY:'auto', padding:'16px 22px 24px', background:'#FAFBFC' }}>

          {extraBodyTop}

          {/* AI pattern suggestions — disabled in favor of per-conversation Anomaly labels */}
          {false && patterns.filter(p => !dismissed[p.id]).length > 0 && (
            <div style={{ marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 1.5l1.3 3 3.2.4-2.4 2.2.7 3.2-2.8-1.6-2.8 1.6.7-3.2L1.9 4.9l3.2-.4z"/>
                </svg>
                <div style={{ fontSize:10, fontWeight:700, color:C.textPrimary, letterSpacing:0.4, textTransform:'uppercase' }}>Anomalies on this monitor</div>
                <span style={{ fontSize:10, color:C.textMuted, marginLeft:'auto' }}>Last 30 days</span>
              </div>
              {patterns.filter(p => !dismissed[p.id]).map(p => <PatternCard key={p.id} p={p}/>)}
            </div>
          )}

          {/* Queue */}
          <div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.textPrimary, letterSpacing:0.4, textTransform:'uppercase' }}>{activePattern ? 'Pattern conversations' : 'Recent conversations'}</div>
              <div style={{ fontSize:11, color:C.textMuted }}>
                {Object.keys(labels).filter(id => visibleQueue.some(c => c.id === id)).length} of {totalForDisplay} labeled
              </div>
            </div>

            {/* Filter pills */}
            {customFilters?.length > 0 ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                <button
                  onClick={() => setActiveCustomFilterId(null)}
                  style={{
                    font:'600 11px/14px Inter,sans-serif',
                    padding:'4px 10px', borderRadius:99, cursor:'pointer',
                    border:`1px solid ${!activeCustomFilterId ? '#1C6EF2' : C.border}`,
                    background: !activeCustomFilterId ? '#1C6EF2' : '#fff',
                    color: !activeCustomFilterId ? '#fff' : C.textSec,
                    fontFamily:FF, transition:'all 0.12s',
                  }}
                >All <span style={{ opacity:0.7, marginLeft:4 }}>{totalCountOverride != null ? totalCountOverride : queue.length}</span></button>
                {customFilters.map(f => {
                  const active = activeCustomFilterId === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveCustomFilterId(active ? null : f.id)}
                      style={{
                        font:'600 11px/14px Inter,sans-serif',
                        padding:'4px 10px', borderRadius:99, cursor:'pointer',
                        border:`1px solid ${active ? '#1C6EF2' : C.border}`,
                        background: active ? '#1C6EF2' : '#fff',
                        color: active ? '#fff' : C.textSec,
                        fontFamily:FF, transition:'all 0.12s',
                        display:'inline-flex', alignItems:'center', gap:5,
                      }}
                    >
                      {f.label}
                      <span style={{ opacity:0.7 }}>{f.count}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
            {/* Filter pills — All recent + one per pattern */}
            {!hidePatternFilters && patterns.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                {(() => {
                  const allActive = activePattern == null;
                  return (
                    <button
                      onClick={() => setActivePattern(null)}
                      style={{
                        font:'600 11px/14px Inter,sans-serif',
                        padding:'4px 10px', borderRadius:99, cursor:'pointer',
                        border:`1px solid ${allActive ? '#1C6EF2' : C.border}`,
                        background: allActive ? '#1C6EF2' : '#fff',
                        color: allActive ? '#fff' : C.textSec,
                        fontFamily:FF, transition:'all 0.12s',
                      }}
                    >All recent <span style={{ opacity:0.7, marginLeft:4 }}>{queue.length}</span></button>
                  );
                })()}
                {patterns.map(p => {
                  const active = activePattern?.id === p.id;
                  const tone = p.kind === 'unusual_pass'
                    ? { fg:'#7C3AED', bor:'#DDD6FE' }
                    : p.severity === 'high'
                      ? { fg:'#B91C1C', bor:'#FCA5A5' }
                      : { fg:'#B45309', bor:'#FCD34D' };
                  const count = (p.convoIds || []).length;
                  const shortLabel = p.kind === 'unusual_pass'
                    ? 'Unusual passing'
                    : p.affects || 'Pattern';
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActivePattern(active ? null : p)}
                      title={p.title}
                      style={{
                        font:'600 11px/14px Inter,sans-serif',
                        padding:'4px 10px', borderRadius:99, cursor:'pointer',
                        border:`1px solid ${active ? tone.fg : tone.bor}`,
                        background: active ? tone.fg : '#fff',
                        color: active ? '#fff' : tone.fg,
                        fontFamily:FF, transition:'all 0.12s',
                        display:'inline-flex', alignItems:'center', gap:5,
                      }}
                    >
                      <span style={{ width:5, height:5, borderRadius:99, background: active ? '#fff' : tone.fg }}/>
                      {shortLabel}
                      <span style={{ opacity:0.7 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {activePattern && (
              <div style={{ padding:'8px 12px', borderRadius:6, background:'#FAFBFC', border:`1px dashed ${C.border}`, fontSize:11, color:C.textSec, lineHeight:1.5, marginBottom:10 }}>
                Showing the {(activePattern.convoIds||[]).length} conversations clustered in this pattern. Label them to teach the scorer.
              </div>
            )}
              </>
            )}

            {displayedQueue.map(c => <ConvCard key={c.id} c={c}/>)}
            {hasMore && (
              <button
                onClick={() => setLoadedCount(n => n + pageSize)}
                style={{
                  width:'100%', padding:'10px 12px', borderRadius:6, border:`1px dashed ${C.border}`,
                  background:'#fff', cursor:'pointer', fontSize:12, color:C.textSec, fontFamily:FF,
                }}
              >Load more conversations · {Math.min(pageSize, Math.max(0, totalForDisplay - displayedQueue.length, visibleQueue.length - displayedQueue.length))} more</button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 22px', borderTop:`1px solid ${C.border}`, background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:12, color:C.textSec }}>
            {labeledCount > 0
              ? <><span style={{ fontWeight:600, color:C.textPrimary }}>{labeledCount}</span> example{labeledCount !== 1 ? 's' : ''} ready to apply</>
              : <span style={{ color:C.textMuted }}>Label conversations to refine the scorer</span>}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={onClose} style={{ padding:'8px 14px', borderRadius:6, border:`1px solid ${C.border}`, background:'#fff', fontSize:13, fontWeight:600, color:C.textSec, cursor:'pointer', fontFamily:FF, height:34 }}>Close</button>
            <button disabled={labeledCount === 0} style={{
              padding:'8px 14px', borderRadius:6, border:'none',
              background: labeledCount === 0 ? '#A3B1CC' : '#1C6EF2',
              color:'#fff', fontSize:13, fontWeight:600,
              cursor: labeledCount === 0 ? 'not-allowed' : 'pointer',
              fontFamily:FF, height:34,
            }}>Apply {labeledCount > 0 ? `${labeledCount} label${labeledCount !== 1 ? 's' : ''}` : 'labels'}</button>
          </div>
        </div>
      </div>
    </>
  );
}

window.ReviewPanel = ReviewPanel;
