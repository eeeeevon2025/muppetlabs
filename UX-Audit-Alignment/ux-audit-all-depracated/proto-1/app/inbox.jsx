// Inbox — v3 Suggestions UI adapted for v2 shell + live K_DATA

function InboxV2({ navigate, openConvo, highlight }) {
  const { suggestions, anomalies, monitors, goals } = window.K_DATA;
  const monitorById = Object.fromEntries(monitors.map((m) => [m.id, m]));
  const goalById    = Object.fromEntries(goals.map((g) => [g.id, g]));

  const [dismissedIds, setDismissedIds] = React.useState([]);
  const [showDismissed, setShowDismissed] = React.useState(false);
  const [procedurePanel, setProcedurePanel] = React.useState(null);

  // ── colour tokens (mirrors v3 D object via CSS vars where possible) ──────
  const C = {
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
  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  const btnPrimary   = { padding:'9px 20px', borderRadius:8, border:'none', background:'#1C6EF2', color:'#fff', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', whiteSpace:'nowrap', fontFamily:FF, display:'inline-flex', alignItems:'center', gap:6 };
  const btnSecondary = { padding:'9px 18px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', color:'#1A1D23', fontSize:14, fontWeight:600, lineHeight:'20px', cursor:'pointer', whiteSpace:'nowrap', fontFamily:FF };

  const AiSparkIcon = ({ color='rgba(255,255,255,0.9)', size=13 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2.917 1.75v2.333M4.083 2.917H1.75M2.917 9.917v2.333M4.083 11.083H1.75M8.167 2.917l.857 2.174c.11.278.165.417.249.534.074.104.165.195.269.269.117.084.256.139.534.249L12.25 7l-2.174.857c-.278.11-.417.165-.534.249a1.167 1.167 0 0 0-.269.269c-.084.117-.139.256-.249.534L8.167 11.083l-.858-2.174c-.109-.278-.164-.417-.248-.534a1.167 1.167 0 0 0-.269-.269c-.117-.084-.256-.139-.534-.249L4.083 7l2.175-.857c.278-.11.417-.165.534-.249.104-.074.195-.165.269-.269.084-.117.139-.256.248-.534l.858-2.174Z"
        stroke={color} strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ChevronIcon = ({ open }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );

  // ── Map K_DATA suggestions to v3 card shape ───────────────────────────────
  const mapped = suggestions.map((s) => {
    const monitor = monitorById[s.monitorId];
    const goal    = goalById[s.goalIds?.[0]];
    return {
      id:             s.id,
      title:          s.title,
      procedureName:  s.type === 'procedure' ? s.target : null,
      type:           s.typeLabel || s.type,
      isProcedure:    s.type === 'procedure',
      changelog:      { updatedBy: 'AI Monitor', updatedAgo: s.createdAt },
      goal:           goal?.name || null,
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
      ctaScope:       s.type === 'procedure'
        ? 'Applies to new conversations only. Existing conversations are not affected. You can revert this change from Procedures at any time.'
        : 'Saves a draft. No conversations are affected until you publish or apply it.',
      automation:     monitor ? { name: monitor.name, href: '#' } : null,
      highlighted:    highlight === s.id,
    };
  });

  const visible   = mapped.filter((s) => !dismissedIds.includes(s.id));
  const dismissed = mapped.filter((s) =>  dismissedIds.includes(s.id));

  // ── Suggestion card ────────────────────────────────────────────────────────
  function SuggestionCard({ s }) {
    const [open, setOpen] = React.useState(s.highlighted || s.id === mapped[0]?.id);
    const [confirmDismiss, setConfirmDismiss] = React.useState(false);
    const [showChangelog, setShowChangelog] = React.useState(false);
    const [applied, setApplied] = React.useState(false);
    const [showConvoPopover, setShowConvoPopover] = React.useState(false);

    // Get flagged conversations linked to this suggestion's monitor
    const { flaggedConversations } = window.K_DATA;
    const linkedConvos = flaggedConversations.filter(c => c.monitorId === s.monitorId).slice(0, 5);

    if (applied) return (
      <div style={{ border:`1px solid ${C.greenBor}`, borderRadius:10, background:C.greenBg, padding:'14px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:10 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.green }}>Draft applied — "{s.title}"</div>
          <div style={{ fontSize:12, color:C.green, opacity:0.8 }}>Change is live for new conversations only. Existing conversations are not affected.</div>
        </div>
        <button onClick={() => setApplied(false)} style={{ fontSize:12, color:C.textMuted, background:'none', border:'none', cursor:'pointer' }}>Undo</button>
      </div>
    );

    return (
      <div style={{ border:`1px solid ${s.highlighted ? C.blue : C.border}`, borderRadius:10, background:C.surface, marginBottom:10, overflow:'hidden', boxShadow: s.highlighted ? `0 0 0 3px ${C.blueBg}` : 'none' }}>

        {/* Header */}
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

          {/* Draft badge */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:C.surfaceHi, border:`1px solid ${C.border}`, color:C.textMuted, letterSpacing:'0.04em' }}>DRAFT — PENDING YOUR REVIEW</span>
          </div>

          <h2 style={{ fontSize:18, fontWeight:700, lineHeight:'22px', color:C.textPrimary, margin:'0 0 10px', fontFamily:FF }}>{s.title}</h2>

          {/* Pills row */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
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
                <a onClick={() => navigate({ screen:'goal', id:s.goalId })} style={{ fontSize:10, background:C.amberBg, color:C.amber, border:`1px solid ${C.amberBor}`, padding:'2px 8px', borderRadius:10, fontWeight:500, cursor:'pointer', textDecoration:'none' }}>{s.goal}</a>
              </div>
            )}
            {s.changelog && (
              <div style={{ position:'relative' }}>
                <button onClick={(e) => { e.stopPropagation(); setShowChangelog((v) => !v); }} style={{ fontSize:10, color:C.purple, background:'none', border:'none', cursor:'pointer', padding:0, fontWeight:500, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:2 }}>
                  Detected {s.changelog.updatedAgo}
                </button>
                {showChangelog && (
                  <div style={{ position:'absolute', top:'100%', left:0, marginTop:6, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'12px 14px', width:260, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', zIndex:50 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>Detection log</div>
                    {[
                      { who:'AI Monitor', what:'Pattern detected from conversation data', when:s.changelog.updatedAgo },
                      { who:'System',    what:'Draft suggestion created for review',      when:s.changelog.updatedAgo },
                    ].map((entry, i) => (
                      <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', background:C.border, marginTop:4, flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:11, color:C.textPrimary, fontWeight:500 }}>{entry.who}</div>
                          <div style={{ fontSize:10, color:C.textMuted }}>{entry.what} · {entry.when}</div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setShowChangelog(false)} style={{ fontSize:10, color:C.textMuted, background:'none', border:'none', cursor:'pointer', padding:0, marginTop:4 }}>Close</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expanded body */}
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

                {/* WE SAW — clickable count popover */}
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

                    {/* Popover */}
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

            {/* Action area */}
            {confirmDismiss ? (
              <div style={{ padding:'10px 14px', background:C.surfaceHi, borderRadius:8, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <span style={{ fontSize:13, lineHeight:'20px', color:C.textSec }}>Dismiss this suggestion? You can restore it from dismissed suggestions.</span>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button onClick={() => setConfirmDismiss(false)} style={btnSecondary}>Cancel</button>
                  <button onClick={() => { setDismissedIds((ids) => [...ids, s.id]); setConfirmDismiss(false); }} style={{ ...btnSecondary, color:C.red, borderColor:C.redBor }}>Yes, dismiss</button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:8 }}>
                <div style={{ fontSize:13, lineHeight:'20px', color:C.textMuted, flex:1 }}>{s.ctaScope}</div>
                <div style={{ display:'flex', gap:12, flexShrink:0, alignItems:'center' }}>
                  <button onClick={() => setConfirmDismiss(true)} style={btnSecondary}>Dismiss</button>
                  <a onClick={() => setProcedurePanel(s)} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:13, fontWeight:500, color:C.blue, cursor:'pointer', textDecoration:'none', whiteSpace:'nowrap' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Open in editor
                  </a>
                  <button
                    onClick={() => setProcedurePanel(s)}
                    style={btnPrimary}>
                    <AiSparkIcon/>Apply this fix
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Procedure slide-in panel ───────────────────────────────────────────────
  function ProcedurePanel({ suggestion, onClose }) {
    const [saved, setSaved] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
    function handleSave() { setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 1200); }

    // Fixed step list matching the screenshot — steps 3 & 4 are AI-added
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

          {/* Header */}
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #DCE0E9', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
            <div>
              <div style={{ fontSize:11, color:'#8A94A6', marginBottom:4 }}>
                <span style={{ color:'#5B47E0', fontWeight:500 }}>VIP Customer Support</span>
                <span style={{ margin:'0 4px', color:'#8A94A6' }}>›</span>
                <span>Procedures</span>
              </div>
              <h2 style={{ fontSize:22, fontWeight:700, color:'#1A1D23', margin:0, lineHeight:'28px' }}>Edit procedure</h2>
            </div>
            <button onClick={onClose} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', fontSize:13, color:'#1A1D23', cursor:'pointer', fontWeight:500, display:'flex', alignItems:'center', gap:6, fontFamily:FF, flexShrink:0 }}>✕ Close</button>
          </div>

          {/* AI suggested change banner */}
          <div style={{ padding:'12px 20px', background:'#F5F3FF', borderBottom:'1px solid #DDD6FE', display:'flex', alignItems:'flex-start', gap:8, flexShrink:0 }}>
            <AiSparkIcon color="#7C3AED" size={14}/>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#7C3AED', marginBottom:3 }}>AI suggested change</div>
              <div style={{ fontSize:13, color:'#5A6478', lineHeight:'18px' }}>Add an upsell step before coupon codes are applied — step 3 has been added and step 5 has been updated to reflect the new recommendation flow.</div>
            </div>
          </div>

          {/* Scrollable body */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 0' }}>
            <div style={{ fontSize:18, fontWeight:700, color:'#1A1D23', marginBottom:4 }}>Steps</div>
            <div style={{ fontSize:13, color:'#8A94A6', marginBottom:16, lineHeight:1.5 }}>Define the steps to execute this procedure. You can reference tools with @ mentions.</div>

            {/* Editor toolbar */}
            <div style={{ border:'1px solid #DCE0E9', borderRadius:8, overflow:'hidden', marginBottom:20 }}>
              <div style={{ padding:'8px 12px', borderBottom:'1px solid #DCE0E9', display:'flex', alignItems:'center', gap:2, background:'#F9FAFB' }}>
                <button style={{ width:32, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:15, fontWeight:700, color:'#1A1D23', display:'flex', alignItems:'center', justifyContent:'center' }}>B</button>
                <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:14, fontStyle:'italic', color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>I</button>
                <div style={{ width:1, height:18, background:'#DCE0E9', margin:'0 6px' }}/>
                <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>@</button>
                <div style={{ width:1, height:18, background:'#DCE0E9', margin:'0 6px' }}/>
                <button style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', color:'#5A6478', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </button>
                <div style={{ flex:1 }}/>
                {['↩','↪'].map(t => <button key={t} style={{ width:28, height:28, borderRadius:4, border:'none', background:'none', cursor:'pointer', fontSize:14, color:'#8A94A6', display:'flex', alignItems:'center', justifyContent:'center' }}>{t}</button>)}
              </div>
              <div style={{ padding:'16px', background:'#fff' }}>
                <ol style={{ margin:0, paddingLeft:22, display:'flex', flexDirection:'column', gap:12 }}>
                  {allSteps.map((step, i) => (
                    <li key={i} style={{
                      fontSize:13, color:'#1A1D23', lineHeight:'20px',
                      background: step.aiAdded ? 'rgba(22,163,74,0.06)' : 'transparent',
                      borderRadius: step.aiAdded ? 6 : 0,
                      padding: step.aiAdded ? '6px 10px' : '0',
                      marginLeft: step.aiAdded ? -10 : 0,
                    }}>
                      {step.text}
                      {step.aiAdded && (
                        <span style={{ fontSize:10, fontWeight:600, color:'#16A34A', marginLeft:8, verticalAlign:'middle', background:'#F0FDF4', border:'1px solid #86EFAC', borderRadius:4, padding:'1px 6px' }}>AI added</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding:'16px 20px', borderTop:'1px solid #DCE0E9', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ fontSize:12, color:'#8A94A6', lineHeight:1.5, maxWidth:260 }}>Changes take effect on new conversations immediately.</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:8, border:'1px solid #DCE0E9', background:'#fff', fontSize:14, color:'#1A1D23', cursor:'pointer', fontWeight:500, fontFamily:FF }}>Cancel</button>
              <button onClick={handleSave} style={{ padding:'10px 20px', borderRadius:8, border:'none', background: saved ? '#16A34A' : '#7C3AED', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', transition:'background 0.2s', fontFamily:FF }}>
                {saved ? '✓ Saved' : 'Save procedure'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <div className="crumbs" style={{ display:'none' }}>
            <a onClick={() => navigate({ screen: 'goals' })}>AI Monitoring</a>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">Suggestions &amp; Alerts</span>
          </div>
          <h1 className="page__title">Suggestions &amp; Alerts</h1>
          <p className="page__subtitle">
            AI-drafted suggestions based on detected patterns in your conversation data. Each includes the evidence behind it and a confidence level.{' '}
            <strong>Nothing changes until you review and apply it.</strong> All changes are reversible.
          </p>
        </div>
      </div>

      {/* Suggestion cards */}
      <div style={{ display:'flex', flexDirection:'column' }}>
        {visible.length === 0 && (
          <div className="empty">
            <div className="empty__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <div className="empty__title">All caught up</div>
            <div className="empty__body">No pending suggestions. New ones appear here as monitors detect patterns worth investigating.</div>
          </div>
        )}
        {visible.map((s) => <SuggestionCard key={s.id} s={s}/>)}
      </div>

      {procedurePanel && <ProcedurePanel suggestion={procedurePanel} onClose={() => setProcedurePanel(null)}/>}

      {/* Dismissed strip */}
      {dismissed.length > 0 && (
        <div style={{ marginTop:8, padding:'8px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.surfaceHi, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:12, color:C.textMuted }}>{dismissed.length} dismissed suggestion{dismissed.length !== 1 ? 's' : ''}</span>
          <button onClick={() => setShowDismissed((v) => !v)} style={{ fontSize:12, color:C.purple, background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>{showDismissed ? 'Hide' : 'Restore'}</button>
        </div>
      )}
      {showDismissed && dismissed.map((s) => (
        <div key={s.id} style={{ marginTop:6, padding:'10px 14px', border:`1px solid ${C.border}`, borderRadius:8, background:C.surface, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, opacity:0.7 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:C.textPrimary }}>{s.title}</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{s.type} · {s.goal}</div>
          </div>
          <button onClick={() => setDismissedIds((ids) => ids.filter((id) => id !== s.id))} style={{ ...btnSecondary, fontSize:11, flexShrink:0 }}>Restore</button>
        </div>
      ))}
    </div>
  );
}

// Keep old Inbox name as alias so Goals.html shell reference still works
const Inbox = InboxV2;

// ── Conversation drawer (unchanged — still used by monitor detail) ────────────
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
          <h2 className="drawer__title">{c.customer}</h2>
          <div style={{ fontSize: 13, color: 'var(--gray-95)' }}>{c.customerCompany} · {c.timeAgo}</div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={onClose}><IClose size={14}/></button>
      </div>
      <div className="drawer__body">
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card__title">Monitor</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{monitor?.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-95)' }}>Est. quality score</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: c.score < 50 ? 'var(--red-90)' : 'var(--yellow-90)' }}>{c.score}</span>
          </div>
          {failedEssential.length > 0 && (
            <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--red-10)', borderRadius: 6, fontSize: 12, color: 'var(--red-90)' }}>
              Essential criterion not met: {failedEssential.map((s) => s.name).join(', ')}
            </div>
          )}
        </div>
        {c.criteriaScores && (
          <div className="card card--flush">
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-30)' }}>
              <div className="card__title">Criterion scores</div>
              <div style={{ fontSize: 11, color: 'var(--gray-85)', marginTop: 2 }}>AI-estimated · review as signals, not final judgments</div>
            </div>
            {c.criteriaScores.map((s) => (
              <div key={s.name} className="list-row" style={{ gridTemplateColumns: '1fr auto' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}{s.essential && <span className="criterion-row__essential" style={{ marginLeft: 6 }}>Essential</span>}</div>
                  {s.reason && <div style={{ fontSize: 12, color: 'var(--gray-90)', marginTop: 2 }}>{s.reason}</div>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: s.pass ? 'var(--green-90)' : 'var(--red-90)' }}>{s.pass ? 'Pass' : 'Did not pass'}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-90)' }}>
          <a onClick={() => { navigate({ screen: 'monitor', id: c.monitorId }); onClose(); }} style={{ color: 'var(--blue-80)', cursor: 'pointer' }}>View monitor →</a>
        </div>
      </div>
    </Drawer>
  );
}

window.InboxV2 = InboxV2;
window.ConversationDrawer = ConversationDrawer;

// ── AnomalyCard stub — used by v2.jsx ────────────────────────────────────────
function AnomalyCard({ anom, navigate, openConvo }) {
  const C = { border:'#dce0e9', surface:'#ffffff', surfaceHi:'#f9fafb', textPrimary:'#1A1D23', textSec:'#5A6478', textMuted:'#8A94A6', amber:'#d97706', amberBg:'#fffbeb', amberBor:'#fcd34d', red:'#dc2626', redBg:'#fef2f2', redBor:'#fecaca' };
  const sevColor = anom.severity === 'high' ? C.red : C.amber;
  const sevBg    = anom.severity === 'high' ? C.redBg : C.amberBg;
  const sevBor   = anom.severity === 'high' ? C.redBor : C.amberBor;
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:10, background:C.surface, marginBottom:10, overflow:'hidden' }}>
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:10, background:sevBg, border:`1px solid ${sevBor}`, color:sevColor }}>{anom.severity}</span>
        <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:10, background:C.surfaceHi, border:`1px solid ${C.border}`, color:C.textMuted }}>{anom.typeLabel}</span>
        <span style={{ marginLeft:'auto', fontSize:11, color:C.textMuted }}>{anom.detectedAt}</span>
      </div>
      <div style={{ padding:'14px 16px' }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>{anom.summary}</div>
        <p style={{ fontSize:13, color:C.textSec, lineHeight:1.5, margin:'0 0 12px' }}>{anom.detail}</p>
        <div style={{ fontSize:12, color:C.textMuted, marginBottom:12 }}>
          Detected by <strong style={{ color:C.textSec }}>{anom.source}</strong> · affects <strong style={{ color:C.textSec }}>{anom.affectedConvCount} conversations</strong>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ padding:'6px 14px', borderRadius:6, border:`1px solid ${C.border}`, background:C.surface, fontSize:12, cursor:'pointer', color:C.textSec }}>Not an issue</button>
          <button onClick={() => openConvo?.('conv-8821')} style={{ padding:'6px 14px', borderRadius:6, border:`1px solid ${C.border}`, background:C.surface, fontSize:12, cursor:'pointer', color:C.textSec }}>View conversations</button>
        </div>
      </div>
    </div>
  );
}
window.AnomalyCard = AnomalyCard;
