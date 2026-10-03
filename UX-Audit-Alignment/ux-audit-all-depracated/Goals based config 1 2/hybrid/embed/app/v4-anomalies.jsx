// ─── v4 layer: Anomalies — two-altitude (monitor + criteria) + neighborhood ──
// Replaces window.AnomaliesV2 with a richer page that surfaces:
//  • Monitor anomalies (a monitor's headline metric moved)
//  • Criteria cluster anomalies (pass/fail signals inside a monitor drifting)
//  • A "story today" banner linking cause and symptom
//  • Detail view with hero stats, why-fired trace, linked anomaly,
//    14-day neighborhood heatmap (focal + linked + siblings + operational)
//  • Investigation view with pattern callouts and per-conversation rationales

(() => {
  const { useState, useMemo } = React;
  const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  const MONO = "'JetBrains Mono', ui-monospace, monospace";

  // ────────────────────────────── DATA ───────────────────────────────────────
  const ANOMALIES = [
    // ── Monitor anomalies ────────────────────────────────────────────────────
    { id: 'm1', cat: 'monitor', metric: 'AI CSAT pass rate',
      monitorName: 'AIC AI-CSAT Monitor', monitorKey: 'AI CSAT', monitorId: 'mon_csat',
      sev: 'high', base: 78, now: 71, unit: '%', dir: 'down', variance: 5,
      head: '7pt drop. Outside variance band for the first time in 6 weeks.',
      spark: [78, 79, 77, 78, 76, 73, 71, 71],
      hist: [78, 79, 78, 78, 79, 77, 78, 76, 73, 71, 71, 71, 71, 71],
      why: '62 of the last 220 conversations failed scoring vs the ~30/day baseline.',
      threatens: 'CSAT ≥ 4.5 goal',
      goalLabel: 'CSAT ≥ 4.5',
      linkedTo: 'c1',
      siblings: ['c1', 'c2', 'c4'],
      flaggedConvCount: 62,
      investigateCount: 23,
      firstSeen: '3 days ago' },

    { id: 'm2', cat: 'monitor', metric: 'Procedure Adherence pass rate',
      monitorName: 'Procedure Adherence Monitor', monitorKey: 'Procedure', monitorId: 'mon_proc',
      sev: 'med', base: 92, now: 87, unit: '%', dir: 'down', variance: 3,
      head: '5pt below baseline. Started after the May 4 policy update.',
      spark: [92, 93, 92, 91, 90, 89, 88, 87],
      hist: [92, 93, 92, 92, 93, 92, 91, 90, 89, 88, 88, 87, 87, 87],
      why: 'Agents citing the old refund window. Cluster forming on cited-correct-policy.',
      threatens: 'Procedure Adherence goal',
      goalLabel: 'Procedure ≥ 90%',
      linkedTo: 'c3',
      siblings: ['c3'],
      flaggedConvCount: 19,
      investigateCount: 14,
      firstSeen: '4 days ago' },

    { id: 'm3', cat: 'monitor', metric: 'Escalation Monitor rate',
      monitorName: 'Escalation Monitor', monitorKey: 'Escalation', monitorId: 'mon_esc',
      sev: 'med', base: 7.1, now: 8.4, unit: '%', dir: 'up', variance: 1.5,
      head: 'Climbing 3 days. Outside band.',
      spark: [7, 7.2, 7, 7.4, 7.8, 8.1, 8.4, 8.4],
      hist: [7, 7.1, 7, 7.2, 7, 7.4, 7.8, 8.1, 8.4, 8.4, 8.5, 8.5, 8.6, 8.6],
      why: 'Customers re-asking the same question 3+ turns before handoff.',
      threatens: 'Escalation ≤ 5% goal',
      goalLabel: 'Escalation ≤ 5%',
      linkedTo: null,
      siblings: [],
      flaggedConvCount: 18,
      investigateCount: 12,
      firstSeen: '3 days ago' },

    { id: 'm4', cat: 'monitor', metric: 'Repeat Contact rate',
      monitorName: 'Repeat Contact Monitor', monitorKey: 'Repeat', monitorId: 'mon_rep',
      sev: 'pos', base: 14.9, now: 11.2, unit: '%', dir: 'down', variance: 4,
      head: 'Below band — positive anomaly. Worth verifying it\'s not a sample bias.',
      spark: [14, 15, 14, 13, 12, 11.5, 11.2, 11.2],
      hist: [14.5, 15, 14, 15, 14, 13, 12, 11.5, 11.2, 11.2, 11.0, 11.0, 11.1, 11.1],
      why: 'New self-serve flow shipped Tuesday. Could also be sample-bias from holiday.',
      threatens: 'Repeat contact ≤ 12% goal',
      goalLabel: 'Repeat ≤ 12%',
      linkedTo: null,
      siblings: [],
      flaggedConvCount: 0,
      investigateCount: 0,
      firstSeen: '2 days ago' },

    // ── Criteria cluster anomalies ──────────────────────────────────────────
    { id: 'c1', cat: 'criteria', metric: 'Tone matched emotional state',
      monitorName: 'AIC AI-CSAT Monitor', monitorKey: 'AI CSAT', monitorId: 'mon_csat',
      sev: 'high', base: 5, now: 23, unit: ' fails', dir: 'up', variance: 3,
      head: '4.6× normal fail rate. Heating up 3 days before the headline.',
      spark: [5, 4, 6, 8, 12, 18, 23, 23],
      hist: [5, 4, 6, 5, 4, 6, 8, 12, 18, 23, 23, 23, 22, 23],
      why: 'All 23 are billing · refund denials with customer re-asking.',
      threatens: 'AI CSAT Monitor (weighted 15%)',
      goalLabel: 'CSAT ≥ 4.5',
      linkedTo: 'm1',
      flaggedConvCount: 23,
      investigateCount: 23,
      weight: 15,
      firstSeen: '3 days ago' },

    { id: 'c2', cat: 'criteria', metric: 'Customer confirmed problem solved',
      monitorName: 'AIC AI-CSAT Monitor', monitorKey: 'AI CSAT', monitorId: 'mon_csat',
      sev: 'med', base: 8, now: 14, unit: ' fails', dir: 'up', variance: 4,
      head: '1.8× typical. Same conversation set as Tone.',
      spark: [8, 9, 8, 10, 11, 13, 14, 14],
      hist: [8, 9, 8, 9, 8, 10, 11, 13, 14, 14, 14, 13, 14, 14],
      why: 'Single root cause with the Tone cluster — same 23 conversations.',
      threatens: 'AI CSAT Monitor (weighted 40%)',
      goalLabel: 'CSAT ≥ 4.5',
      linkedTo: 'm1',
      flaggedConvCount: 14,
      investigateCount: 14,
      weight: 40,
      firstSeen: '3 days ago' },

    { id: 'c3', cat: 'criteria', metric: 'Cited correct policy',
      monitorName: 'Procedure Adherence Monitor', monitorKey: 'Procedure', monitorId: 'mon_proc',
      sev: 'drift', base: 3, now: 6, unit: '% miss', dir: 'up', variance: 2,
      head: '7-day drift. Still inside variance band — but trending.',
      spark: [3, 3, 4, 4, 5, 5, 6, 6],
      hist: [3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6],
      why: 'Started right after the May 4 policy doc update. No alert yet.',
      threatens: 'Procedure Adherence (weighted 30%)',
      goalLabel: 'Procedure ≥ 90%',
      linkedTo: 'm2',
      flaggedConvCount: 14,
      investigateCount: 14,
      weight: 30,
      firstSeen: '7 days ago' },

    { id: 'c4', cat: 'criteria', metric: 'Acknowledged customer frustration',
      monitorName: 'AIC AI-CSAT Monitor', monitorKey: 'AI CSAT', monitorId: 'mon_csat',
      sev: 'med', base: 6, now: 11, unit: ' fails', dir: 'up', variance: 3,
      head: 'Same conversation set as Tone. Empathy gap widening.',
      spark: [6, 5, 6, 7, 8, 9, 11, 11],
      hist: [6, 5, 6, 6, 5, 6, 7, 8, 9, 11, 11, 10, 11, 11],
      why: 'Cluster sibling. Phrasing reads procedural, not warm.',
      threatens: 'AI CSAT Monitor (weighted 10%)',
      goalLabel: 'CSAT ≥ 4.5',
      linkedTo: 'm1',
      flaggedConvCount: 11,
      investigateCount: 11,
      weight: 10,
      firstSeen: '3 days ago' },
  ];
  const ANOM_BY_ID = Object.fromEntries(ANOMALIES.map(a => [a.id, a]));

  const DAYS = ['Apr 30', 'May 1', 'May 2', 'May 3', 'May 4', 'May 5',
                'May 6', 'May 7', 'May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'today'];

  const OPS_METRICS = {
    'AI CSAT':    { label: 'CSAT score (operational)',           sub: 'avg ticket CSAT, daily',    vals: [4.5, 4.5, 4.4, 4.5, 4.4, 4.4, 4.3, 4.3, 4.2, 4.2, 4.1, 4.0, 4.0, 3.9] },
    'Procedure':  { label: 'Refund-handling AHT (operational)',  sub: 'avg minutes, daily',        vals: [4.2, 4.3, 4.2, 4.4, 4.3, 4.5, 4.6, 4.8, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5] },
    'Escalation': { label: 'Tier-2 queue depth (operational)',   sub: 'avg open tickets, daily',   vals: [22, 21, 23, 22, 24, 25, 28, 31, 34, 36, 38, 40, 42, 45] },
    'Repeat':     { label: 'First-contact resolution',           sub: 'avg %, daily',              vals: [78, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 88] },
  };

  // ────────────────────────────── SEVERITY ───────────────────────────────────
  const sevTokens = (sev) => {
    if (sev === 'high')  return { label: 'High',   color: '#9E181E', bg: '#FFE8E9', border: '#FFAAAD' };
    if (sev === 'med')   return { label: 'Medium', color: '#826F1C', bg: '#FFFDE5', border: '#FCED92' };
    if (sev === 'drift') return { label: 'Drift',  color: '#5F6675', bg: '#F2F3F7', border: '#DCE0E9' };
    if (sev === 'pos')   return { label: 'Positive', color: '#15803D', bg: '#E8F6EC', border: '#B7E0C1' };
    return { label: '—', color: '#697182', bg: '#F2F3F7', border: '#DCE0E9' };
  };

  // ────────────────────────────── HELPERS ────────────────────────────────────
  const fmt = (v, unit) => {
    if (typeof v !== 'number') return v;
    const n = Number.isInteger(v) ? v : v.toFixed(1);
    return unit ? `${n}${unit}` : `${n}`;
  };

  const Spark = ({ data, w = 110, h = 32, color = '#005BD8', fill = true }) => {
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return [x, y];
    });
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
        {fill && <path d={d + ` L ${w} ${h} L 0 ${h} Z`} fill={color} opacity="0.10"/>}
        <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    );
  };

  const Pill = ({ children, tone = 'gray', style }) => {
    const tones = {
      gray:    { bg: 'var(--gray-15)',   border: '1px solid var(--gray-30)', color: 'var(--gray-115)' },
      red:     { bg: '#FFE8E9',          border: '1px solid #FFAAAD',        color: '#9E181E' },
      yellow:  { bg: 'var(--yellow-15)', border: '1px solid var(--yellow-50)', color: 'var(--yellow-100)' },
      blue:    { bg: 'var(--blue-10)',   border: '1px solid var(--blue-25)', color: 'var(--blue-90)' },
      green:   { bg: '#E8F6EC',          border: '1px solid #B7E0C1',        color: '#15803D' },
      ink:     { bg: 'var(--gray-150)',  border: '1px solid var(--gray-150)', color: '#fff' },
    };
    const t = tones[tone] || tones.gray;
    return <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 999,
      background: t.bg, border: t.border, color: t.color,
      whiteSpace: 'nowrap',
      ...(style || {}),
    }}>{children}</span>;
  };

  // ────────────────────────────── ANOMALY CARD ───────────────────────────────
  const AnomalyCard = ({ a, selected, onClick }) => {
    const sev = sevTokens(a.sev);
    const trendArrow = a.dir === 'up' ? '↑' : a.dir === 'down' ? '↓' : '·';
    const monitorData = window.K_DATA?.monitors?.find(m => m.id === a.monitorId);
    const criteriaList = monitorData?.criteria || [];
    let crIndex = criteriaList.findIndex(c => (c.name || '').trim().toLowerCase() === (a.metric || '').trim().toLowerCase());
    if (crIndex < 0) crIndex = ({ c1: 0, c2: 1, c3: 0, c4: 2 })[a.id] ?? 0;
    const crTotal = criteriaList.length || 4;
    return (
      <button
        onClick={onClick}
        style={{
          display: 'block', width: '100%', textAlign: 'left',
          padding: '14px 16px',
          borderRadius: 10,
          border: selected ? '1px solid var(--blue-50)' : '1px solid var(--gray-30)',
          background: selected ? '#F8FAFF' : '#fff',
          cursor: 'pointer',
          fontFamily: FF,
          boxShadow: selected ? '0 0 0 3px rgba(63,140,255,0.12)' : 'none',
          transition: 'background 0.12s, border-color 0.12s, box-shadow 0.12s',
        }}
        onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--gray-15)'; }}
        onMouseLeave={e => { if (!selected) e.currentTarget.style.background = '#fff'; }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-130)' }}>
            {a.metric} <span style={{ color: 'var(--gray-90)', fontWeight: 500, fontFamily: MONO }}>({crIndex + 1})</span>
          </span>
          <span style={{ width: 1, height: 12, background: 'var(--gray-30)' }}/>
          <a
            href={'Monitors.html#monitor/' + (a.monitorId || '')}
            target="_blank"
            rel="noopener"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue-80)', textDecoration: 'none', borderBottom: '1px dotted var(--blue-25)' }}
            onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--blue-80)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'var(--blue-25)'; }}
          >{a.monitorName}</a>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: sev.color }}/>
            {sev.label}
          </span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.005em', lineHeight: 1.35 }}>
            {a.head}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginTop: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: sev.color, letterSpacing: '-0.02em' }}>
              {fmt(a.now, a.unit)}
            </span>
            <span style={{ fontSize: 11, color: 'var(--gray-90)', fontFamily: MONO }}>
              {trendArrow} from {fmt(a.base, a.unit)} · {a.firstSeen || 'this week'}
            </span>
          </div>
        </div>
      </button>
    );
  };

  // ────────────────────────────── HEATMAP ────────────────────────────────────
  const heatStyle = (vals, i, dirHint) => {
    // Compute a per-row baseline from the first 6 days
    const base = vals.slice(0, 6).reduce((a, b) => a + b, 0) / 6 || 0.5;
    const v = vals[i];
    const ratio = (v - base) / Math.max(Math.abs(base), 0.5);
    const a = Math.abs(ratio);
    let bg = '#FAFBFE', color = 'var(--gray-115)';
    // For "miss" / "fail" rows, "up" = bad (red); for "good" rows, "up" = good (green)
    const upIsBad = dirHint !== 'good';
    if (a >= 0.10) {
      if ((ratio > 0 && upIsBad) || (ratio < 0 && !upIsBad)) {
        if (a > 1.5)       { bg = '#9E181E'; color = '#fff'; }
        else if (a > 0.6)  { bg = '#E21325'; color = '#fff'; }
        else if (a > 0.30) { bg = '#FFAAAD'; color = '#7A1518'; }
        else if (a > 0.15) { bg = '#FFD0D2'; color = '#7A1518'; }
        else               { bg = '#FFE8E9'; color = '#7A1518'; }
      } else {
        if (a > 0.30)      { bg = '#15803D'; color = '#fff'; }
        else if (a > 0.15) { bg = '#B7E0C1'; color = '#0F4C24'; }
        else               { bg = '#E8F6EC'; color = '#0F4C24'; }
      }
    }
    return { background: bg, color };
  };

  const NeighborhoodHeatmap = ({ focal, onJump, focalOnly }) => {
    // Build rows: focal + linked + siblings (other criteria in same monitor) + operational metric
    const rows = [];
    rows.push({ section: 'Focal', label: focal.metric, sub: focal.cat === 'monitor' ? 'monitor headline' : 'criterion', vals: focal.hist, focal: true, dirHint: focal.cat === 'monitor' && focal.dir === 'down' ? 'good' : 'bad' });

    if (!focalOnly && focal.linkedTo && ANOM_BY_ID[focal.linkedTo] && ANOM_BY_ID[focal.linkedTo].cat !== 'monitor') {
      const l = ANOM_BY_ID[focal.linkedTo];
      const linkedSection = l.cat === 'monitor' ? 'Linked monitor' : 'Linked criteria cluster';
      rows.push({ section: linkedSection, label: l.metric, sub: l.cat === 'monitor' ? 'monitor headline' : 'criterion', vals: l.hist, anomId: l.id, dirHint: l.cat === 'monitor' && l.dir === 'down' ? 'good' : 'bad' });
    }

    // Sibling criteria + operational — skipped in focalOnly mode
    if (!focalOnly) {
      const siblings = ANOMALIES.filter(x =>
      x.cat === 'criteria' &&
      x.monitorKey === focal.monitorKey &&
      x.id !== focal.id &&
      x.id !== focal.linkedTo
    );
    siblings.forEach(s => {
      rows.push({ section: 'Sibling criteria · ' + focal.monitorName, label: s.metric, sub: 'criterion · weight ' + (s.weight || '?') + '%', vals: s.hist, anomId: s.id, dirHint: 'bad' });
    });

    // Operational metric
    const op = OPS_METRICS[focal.monitorKey] || OPS_METRICS['AI CSAT'];
    const opDir = focal.monitorKey === 'Repeat' ? 'good' : focal.monitorKey === 'AI CSAT' ? 'good' : 'bad';
    rows.push({ section: 'Operational nearby', label: op.label, sub: op.sub, vals: op.vals, dirHint: opDir });
    }

    const sections = [...new Set(rows.map(r => r.section))];
    const colTpl = `260px repeat(${DAYS.length}, minmax(36px, 1fr))`;

    return (
      <div style={{ background: '#fff', border: '1px solid var(--gray-30)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: colTpl, fontFamily: FF }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', background: 'var(--gray-15)', borderBottom: '1px solid var(--gray-30)', borderRight: '1px solid var(--gray-30)', fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Metric / criterion
          </div>
          {DAYS.map((d, i) => (
            <div key={d} style={{
              padding: '8px 0', textAlign: 'center', background: 'var(--gray-15)',
              borderBottom: '1px solid var(--gray-30)', borderRight: i === DAYS.length - 1 ? 'none' : '1px solid var(--gray-25)',
              fontSize: 10, color: i === DAYS.length - 1 ? 'var(--gray-130)' : 'var(--gray-90)',
              fontWeight: i === DAYS.length - 1 ? 700 : 500, fontFamily: MONO,
            }}>{d}</div>
          ))}

          {sections.map(sec => (
            <React.Fragment key={sec}>
              <div style={{
                gridColumn: '1 / -1',
                padding: '8px 14px', background: 'var(--gray-150)', color: '#fff',
                fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                fontFamily: FF,
              }}>{sec}</div>
              {rows.filter(r => r.section === sec).map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    padding: '10px 14px',
                    background: r.focal ? 'var(--yellow-15)' : '#fff',
                    borderBottom: '1px solid var(--gray-25)',
                    borderRight: '1px solid var(--gray-30)',
                  }}>
                    {r.anomId && onJump ? (
                      <button
                        onClick={() => onJump(ANOM_BY_ID[r.anomId])}
                        style={{
                          background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left',
                          fontFamily: FF, fontSize: 13, fontWeight: 600, color: 'var(--blue-90)',
                          letterSpacing: '-0.005em', textDecoration: 'underline', textDecorationColor: 'var(--blue-25)',
                          textUnderlineOffset: 3,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.textDecorationColor = 'var(--blue-80)'; }}
                        onMouseLeave={e => { e.currentTarget.style.textDecorationColor = 'var(--blue-25)'; }}
                      >{r.label} →</button>
                    ) : (
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.005em' }}>{r.label}</div>
                    )}
                    <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--gray-85)', marginTop: 2, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{r.sub}</div>
                  </div>
                  {r.vals.map((v, j) => {
                    const st = heatStyle(r.vals, j, r.dirHint);
                    return (
                      <div key={j} style={{
                        ...st,
                        padding: '10px 0',
                        textAlign: 'center',
                        fontSize: 11, fontWeight: 600, fontFamily: MONO,
                        borderBottom: '1px solid var(--gray-25)',
                        borderRight: j === r.vals.length - 1 ? 'none' : '1px solid var(--gray-25)',
                      }}>
                        {typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(1)) : v}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // ────────────────────────────── INVESTIGATION DATA ─────────────────────────
  const CONVOS_BASE = [
    { id: 'C-8821', cust: 'Marisol P.',  topic: 'Refund denied · billing', dur: '14m', turns: 9,  sentiment: 'frustrated',
      failed: ['Tone matched emotional state', 'Acknowledged customer frustration', 'Customer confirmed problem solved'],
      rationale: 'Agent stayed procedural while customer escalated. No empathy lines for 6 consecutive turns.',
      excerpt: [
        { who: 'cust',  t: 'I\'ve asked three times. This is the THIRD time I\'m typing this out.' },
        { who: 'agent', t: 'Per our policy, refunds outside 30 days require manager approval. Please hold.' },
        { who: 'cust',  t: 'I don\'t care about the policy. I care that nobody is listening.' },
        { who: 'agent', t: 'I understand. Let me check the manager queue.' } ] },
    { id: 'C-8814', cust: 'Devon T.',    topic: 'Refund denied · billing', dur: '11m', turns: 7,  sentiment: 'frustrated',
      failed: ['Tone matched emotional state', 'Customer confirmed problem solved'],
      rationale: 'Customer asked the same question 3 times before agent reframed. Resolution unclear at close.',
      excerpt: [
        { who: 'cust',  t: 'So why was it denied? I just need to understand.' },
        { who: 'agent', t: 'It falls outside our policy window.' },
        { who: 'cust',  t: 'But why? What\'s the actual reason?' },
        { who: 'agent', t: 'The 30-day window has passed.' } ] },
    { id: 'C-8809', cust: 'Asha B.',     topic: 'Refund denied · billing', dur: '18m', turns: 12, sentiment: 'frustrated',
      failed: ['Tone matched emotional state', 'Acknowledged customer frustration'],
      rationale: 'Customer expressed frustration twice. Agent did not acknowledge either time.',
      excerpt: [
        { who: 'cust',  t: 'I\'m honestly so tired of this.' },
        { who: 'agent', t: 'I can look up your order if you give me the ID.' },
        { who: 'cust',  t: 'I already gave it to you twice.' },
        { who: 'agent', t: 'Apologies. Order #44219, correct?' } ] },
    { id: 'C-8803', cust: 'R. Mueller',  topic: 'Refund denied · billing', dur: '9m',  turns: 6,  sentiment: 'resigned',
      failed: ['Customer confirmed problem solved'],
      rationale: 'Conversation ended without explicit confirmation. Customer\'s last message: "whatever, fine."',
      excerpt: [
        { who: 'agent', t: 'So we\'ll process the credit instead. Is that acceptable?' },
        { who: 'cust',  t: 'whatever, fine.' },
        { who: 'agent', t: 'Great, all set! Anything else?' } ] },
    { id: 'C-8798', cust: 'Theo N.',     topic: 'Refund denied · billing', dur: '22m', turns: 14, sentiment: 'angry',
      failed: ['Tone matched emotional state', 'Acknowledged customer frustration', 'Customer confirmed problem solved'],
      rationale: 'Triple failure. Customer used emphatic language by turn 8. Agent stayed scripted.',
      excerpt: [
        { who: 'cust',  t: 'This is absurd. I\'ve been a customer for 4 years.' },
        { who: 'agent', t: 'I appreciate your loyalty. Per policy—' },
        { who: 'cust',  t: 'Stop saying "per policy."' } ] },
    { id: 'C-8794', cust: 'L. Okafor',   topic: 'Refund denied · billing', dur: '7m',  turns: 5,  sentiment: 'frustrated',
      failed: ['Tone matched emotional state'],
      rationale: 'Customer joked dryly; agent missed the cue and stayed formal.',
      excerpt: [
        { who: 'cust',  t: 'Great, another no. Wonderful.' },
        { who: 'agent', t: 'I have processed your request as denied per policy.' } ] },
    { id: 'C-8786', cust: 'J. Park',     topic: 'Refund denied · billing', dur: '13m', turns: 8,  sentiment: 'frustrated',
      failed: ['Acknowledged customer frustration', 'Customer confirmed problem solved'],
      rationale: 'Customer explicitly said "this is frustrating"; not acknowledged.',
      excerpt: [
        { who: 'cust',  t: 'This is frustrating to keep explaining.' },
        { who: 'agent', t: 'Could you provide your order ID once more?' } ] },
  ];
  const CONVOS_PAD = [
    ...CONVOS_BASE,
    { id: 'C-8779', cust: 'M. Chen',     topic: 'Refund denied · billing', dur: '10m', turns: 6,  sentiment: 'frustrated', failed: ['Tone matched emotional state'], rationale: '', excerpt: [] },
    { id: 'C-8771', cust: 'A. Singh',    topic: 'Refund denied · billing', dur: '15m', turns: 10, sentiment: 'frustrated', failed: ['Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8763', cust: 'P. Volkov',   topic: 'Refund denied · billing', dur: '8m',  turns: 5,  sentiment: 'resigned',   failed: ['Tone matched emotional state'], rationale: '', excerpt: [] },
    { id: 'C-8755', cust: 'S. Idris',    topic: 'Refund denied · billing', dur: '12m', turns: 7,  sentiment: 'frustrated', failed: ['Tone matched emotional state', 'Acknowledged customer frustration'], rationale: '', excerpt: [] },
    { id: 'C-8748', cust: 'D. Romero',   topic: 'Refund denied · billing', dur: '19m', turns: 11, sentiment: 'angry',      failed: ['Tone matched emotional state', 'Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8741', cust: 'F. Bauer',    topic: 'Refund denied · billing', dur: '6m',  turns: 4,  sentiment: 'resigned',   failed: ['Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8734', cust: 'Y. Tanaka',   topic: 'Refund denied · billing', dur: '14m', turns: 9,  sentiment: 'frustrated', failed: ['Acknowledged customer frustration'], rationale: '', excerpt: [] },
    { id: 'C-8727', cust: 'B. Adekoya',  topic: 'Refund denied · billing', dur: '17m', turns: 11, sentiment: 'frustrated', failed: ['Tone matched emotional state', 'Acknowledged customer frustration', 'Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8719', cust: 'C. Lefevre',  topic: 'Refund denied · billing', dur: '11m', turns: 7,  sentiment: 'frustrated', failed: ['Tone matched emotional state'], rationale: '', excerpt: [] },
    { id: 'C-8712', cust: 'N. Pavlova',  topic: 'Refund denied · billing', dur: '9m',  turns: 5,  sentiment: 'resigned',   failed: ['Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8704', cust: 'I. Ahmed',    topic: 'Refund denied · billing', dur: '13m', turns: 8,  sentiment: 'frustrated', failed: ['Tone matched emotional state', 'Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8697', cust: 'V. Sokolov',  topic: 'Refund denied · billing', dur: '21m', turns: 13, sentiment: 'angry',      failed: ['Tone matched emotional state', 'Acknowledged customer frustration'], rationale: '', excerpt: [] },
    { id: 'C-8689', cust: 'G. Hassan',   topic: 'Refund denied · billing', dur: '7m',  turns: 5,  sentiment: 'frustrated', failed: ['Tone matched emotional state'], rationale: '', excerpt: [] },
    { id: 'C-8682', cust: 'O. Nakamura', topic: 'Refund denied · billing', dur: '16m', turns: 10, sentiment: 'frustrated', failed: ['Acknowledged customer frustration', 'Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8674', cust: 'E. Costa',    topic: 'Refund denied · billing', dur: '12m', turns: 7,  sentiment: 'resigned',   failed: ['Customer confirmed problem solved'], rationale: '', excerpt: [] },
    { id: 'C-8666', cust: 'T. Larsen',   topic: 'Refund denied · billing', dur: '10m', turns: 6,  sentiment: 'frustrated', failed: ['Tone matched emotional state'], rationale: '', excerpt: [] },
  ];

  const SentimentDot = ({ s }) => {
    const c = s === 'angry' ? '#9E181E' : s === 'frustrated' ? '#C97B3F' : s === 'resigned' ? '#697182' : '#15803D';
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: c, border: '1px solid var(--gray-150)' }}/>;
  };

  // ────────────────────────────── DETAIL PANE ────────────────────────────────
  // ────────────────────────────── REPLAY CHARTS ─────────────────────────────
  const BandChart = ({ data, baseline, variance, currentVar, dir, w = 720, h = 200 }) => {
    const padX = 28, padY = 22;
    const W = w - padX * 2, H = h - padY * 2;
    const max = Math.max(...data, baseline + Math.max(variance, currentVar) + 4);
    const min = Math.min(...data, baseline - Math.max(variance, currentVar) - 4);
    const y = v => padY + H - ((v - min) / (max - min || 1)) * H;
    const x = i => padX + (W / (data.length - 1)) * i;
    const linePts = data.map((v, i) => [x(i), y(v)]);
    const linePath = linePts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const crossings = data.map((v, i) => Math.abs(v - baseline) > currentVar ? i : -1).filter(i => i >= 0);
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
        <rect x="0" y="0" width={w} height={h} fill="#FAFBFE"/>
        {/* Current band — dashed gray */}
        <rect x={padX} y={y(baseline + variance)} width={W} height={Math.max(0, y(baseline - variance) - y(baseline + variance))}
          fill="none" stroke="var(--gray-50)" strokeWidth="1" strokeDasharray="3 3"/>
        {/* Proposed band — soft yellow */}
        <rect x={padX} y={y(baseline + currentVar)} width={W} height={Math.max(0, y(baseline - currentVar) - y(baseline + currentVar))}
          fill="rgba(252,237,146,0.35)" stroke="var(--yellow-100)" strokeWidth="1"/>
        {/* Baseline */}
        <line x1={padX} y1={y(baseline)} x2={w - padX} y2={y(baseline)} stroke="var(--gray-90)" strokeWidth="1" strokeDasharray="2 4"/>
        <text x={w - padX} y={y(baseline) - 4} textAnchor="end" fontSize="10" fill="var(--gray-95)" fontFamily="Inter">baseline {baseline}</text>
        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--gray-130)" strokeWidth="1.6"/>
        {linePts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={crossings.includes(i) ? 4.5 : 2.5}
            fill={crossings.includes(i) ? '#9E181E' : '#fff'} stroke="var(--gray-130)" strokeWidth="1.4"/>
        ))}
        <text x={padX} y={padY - 8} fontSize="11" fill="var(--gray-115)" fontFamily="Inter" fontWeight="600">
          {crossings.length} day{crossings.length === 1 ? '' : 's'} would have alerted at ±{currentVar}
        </text>
      </svg>
    );
  };

  const ClusterBandChart = ({ data, baseline, threshold, w = 720, h = 200 }) => {
    const padX = 28, padY = 22;
    const W = w - padX * 2, H = h - padY * 2;
    const max = Math.max(...data, threshold + 5);
    const barW = W / data.length - 4;
    const y = v => padY + H - (v / (max || 1)) * H;
    const overCount = data.filter(v => v >= threshold).length;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
        <rect x="0" y="0" width={w} height={h} fill="#FAFBFE"/>
        {/* Above-threshold zone — soft yellow */}
        <rect x={padX} y={padY} width={W} height={Math.max(0, y(threshold) - padY)}
          fill="rgba(252,237,146,0.30)" stroke="var(--yellow-100)" strokeWidth="1" strokeDasharray="2 3"/>
        {/* Baseline */}
        <line x1={padX} y1={y(baseline)} x2={w - padX} y2={y(baseline)} stroke="var(--gray-90)" strokeWidth="1" strokeDasharray="2 4"/>
        <text x={w - padX} y={y(baseline) - 3} textAnchor="end" fontSize="10" fill="var(--gray-95)" fontFamily="Inter">baseline ~{baseline}/day</text>
        {/* Threshold */}
        <line x1={padX} y1={y(threshold)} x2={w - padX} y2={y(threshold)} stroke="var(--yellow-110)" strokeWidth="1.6"/>
        <text x={w - padX} y={y(threshold) - 4} textAnchor="end" fontSize="11" fill="var(--yellow-110)" fontFamily="Inter" fontWeight="600">threshold ≥ {threshold}/day</text>
        {/* Bars */}
        {data.map((v, i) => {
          const cx = padX + (W / data.length) * i + 2;
          const over = v >= threshold;
          return (
            <g key={i}>
              <rect x={cx} y={y(v)} width={barW} height={Math.max(0, padY + H - y(v))}
                fill={over ? '#9E181E' : 'var(--gray-25)'} stroke={over ? '#9E181E' : 'var(--gray-50)'} strokeWidth="1"/>
            </g>
          );
        })}
        <text x={padX} y={padY - 8} fontSize="11" fill="var(--gray-115)" fontFamily="Inter" fontWeight="600">
          {overCount} day{overCount === 1 ? '' : 's'} would have alerted at ≥ {threshold}
        </text>
      </svg>
    );
  };

  // ────────────────────────────── TUNE SENSITIVITY PANE ─────────────────────
  const TuneSensitivityPane = ({ a, onBack }) => {
    const isMonitor = a.cat === 'monitor';
    const replay14 = a.hist || [];
    const recommendedVar = Math.max(1, Math.round(a.variance * 0.7 * 10) / 10);
    const recommendedThr = Math.max(a.base + 2, Math.round(a.base * 1.6));
    const recommendedClusterMin = 8;
    const recommendedWindow = 2;

    const [variance, setVariance] = useState(a.variance);
    const [threshold, setThreshold] = useState(recommendedThr);
    const [clusterMin, setClusterMin] = useState(recommendedClusterMin);
    const [windowDays, setWindowDays] = useState(recommendedWindow);

    const wouldAlert = isMonitor
      ? replay14.filter(v => Math.abs(v - a.base) > variance).length
      : replay14.filter(v => v >= threshold).length;

    const monitorDirty = variance !== recommendedVar;
    const criteriaDirty = threshold !== recommendedThr || clusterMin !== recommendedClusterMin || windowDays !== recommendedWindow;
    const resetMonitor = () => setVariance(recommendedVar);
    const resetCriteria = () => { setThreshold(recommendedThr); setClusterMin(recommendedClusterMin); setWindowDays(recommendedWindow); };

    const verdictNote = wouldAlert === 0
      ? (isMonitor ? 'Probably too loose — would have missed today\u2019s drop.' : 'Too quiet — wouldn\u2019t have caught the drift.')
      : wouldAlert > 5
      ? (isMonitor ? 'Probably too tight — that\u2019s alert fatigue.' : 'Noisy — narrow the cluster rule.')
      : 'Feels balanced. Save it and watch tomorrow.';

    const labelStyle = { fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em' };
    const cardStyle = { padding: '16px 18px', borderRadius: 10, border: '1px solid var(--gray-30)', background: '#fff' };

    return (
      <div style={{ fontFamily: FF }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <button onClick={onBack} style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue-80)', background: 'none', border: 0, cursor: 'pointer', padding: 0, fontFamily: FF }}>← {a.metric}</button>
          <span style={{ color: 'var(--gray-50)' }}>/</span>
          <span style={{ fontSize: 12, color: 'var(--gray-115)', fontWeight: 500 }}>Tune sensitivity</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--gray-30)', paddingBottom: 18, marginBottom: 22 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <Pill tone={isMonitor ? 'ink' : 'yellow'}>{isMonitor ? 'Monitor anomaly' : 'Criteria cluster'}</Pill>
              <span style={{ fontSize: 11, color: 'var(--gray-95)' }}>{a.metric}</span>
            </div>
            <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>
              {isMonitor ? 'Tune the variance band' : 'Tune the cluster threshold'}
            </h2>
            <div style={{ fontSize: 13, color: 'var(--gray-95)', marginTop: 6, maxWidth: 720, lineHeight: 1.5 }}>
              {isMonitor
                ? <>The band is <strong>baseline ± variance</strong>. Replays the last 14 days against your proposed setting.</>
                : <>Two rules — <strong>fail-count threshold</strong> and <strong>cluster size</strong>. Both must trip to alert.</>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onBack} className="btn btn--ghost btn--sm" style={{ fontFamily: FF }}>Cancel</button>
            <button onClick={onBack} className="btn btn--primary btn--sm" style={{ fontFamily: FF }}>Save band</button>
          </div>
        </div>

        {/* Replay chart */}
        <div style={{ ...cardStyle, padding: '14px 16px', marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <div style={labelStyle}>14-day replay · proposed band shaded</div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4, lineHeight: 1.5 }}>
                {isMonitor ? 'Red dots = days that would have alerted at the proposed band.' : 'Red bars = days over your proposed threshold.'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 11, color: 'var(--gray-95)' }}>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 18, height: 10, background: 'rgba(252,237,146,0.35)', border: '1px solid var(--yellow-100)' }}/>proposed</span>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 18, height: 10, border: '1px dashed var(--gray-50)' }}/>current</span>
            </div>
          </div>
          {isMonitor
            ? <BandChart data={replay14} baseline={a.base} variance={a.variance} currentVar={variance} dir={a.dir}/>
            : <ClusterBandChart data={replay14} baseline={a.base} threshold={threshold}/>}
        </div>

        {/* Controls */}
        {isMonitor ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div style={cardStyle}>
              <div style={labelStyle}>Variance band ±</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em' }}>±{variance}{a.unit}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>currently ±{a.variance}{a.unit}</span>
              </div>
              <input type="range" min="1" max="12" step="0.5" value={variance} onChange={e => setVariance(+e.target.value)} style={{ width: '100%', accentColor: 'var(--blue-80)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--gray-90)' }}>
                <span>tighter (more alerts)</span>
                <span>looser (fewer alerts)</span>
              </div>
            </div>
            <div style={{ ...cardStyle, background: 'var(--yellow-15)', border: '1px solid var(--yellow-50)' }}>
              <div style={labelStyle}>Replay verdict</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.1 }}>{wouldAlert} alert{wouldAlert === 1 ? '' : 's'}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-100)', marginTop: 4 }}>over the last 14 days</div>
              <div style={{ fontSize: 12, color: 'var(--yellow-110)', marginTop: 12, lineHeight: 1.5 }}>{verdictNote}</div>
            </div>
            <div style={cardStyle}>
              <div style={labelStyle}>Recommendation</div>
              <div style={{ fontSize: 13, color: 'var(--gray-115)', marginTop: 8, lineHeight: 1.55 }}>
                Today’s drop was <strong>{Math.abs(a.now - a.base)}{a.unit}</strong>. To catch it earlier, try <strong style={{ color: 'var(--blue-90)' }}>±{recommendedVar}{a.unit}</strong>.
              </div>
              <button onClick={resetMonitor} disabled={!monitorDirty} style={{
                marginTop: 12, fontSize: 12, fontWeight: 600,
                padding: '6px 10px', borderRadius: 6,
                background: monitorDirty ? 'var(--blue-10)' : 'var(--gray-15)',
                border: '1px solid ' + (monitorDirty ? 'var(--blue-25)' : 'var(--gray-30)'),
                color: monitorDirty ? 'var(--blue-90)' : 'var(--gray-90)',
                cursor: monitorDirty ? 'pointer' : 'default', fontFamily: FF,
              }}>↻ Reset to recommended (±{recommendedVar}{a.unit})</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 14, marginBottom: 18 }}>
            <div style={cardStyle}>
              <div style={labelStyle}>Rule 1 · fail-count threshold</div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>alert when daily failures of <strong>{a.metric}</strong> hit this number</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em' }}>≥ {threshold}/day</span>
                <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>baseline ~{a.base}/day</span>
              </div>
              <input type="range" min={a.base} max={a.base + 30} step="1" value={threshold} onChange={e => setThreshold(+e.target.value)} style={{ width: '100%', accentColor: 'var(--blue-80)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--gray-90)' }}>
                <span>sensitive ({a.base}+)</span>
                <span>quiet ({a.base + 30})</span>
              </div>
            </div>
            <div style={{ ...cardStyle, background: 'var(--gray-10)' }}>
              <div style={labelStyle}>Rule 2 · cluster size</div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>only alert when these failures share a topic / pattern</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>≥ {clusterMin} convos</div>
                  <input type="range" min="3" max="20" step="1" value={clusterMin} onChange={e => setClusterMin(+e.target.value)} style={{ width: '100%', accentColor: 'var(--blue-80)', marginTop: 6 }}/>
                  <div style={{ ...labelStyle, marginTop: 4 }}>min cluster size</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>within {windowDays}d</div>
                  <input type="range" min="1" max="7" step="1" value={windowDays} onChange={e => setWindowDays(+e.target.value)} style={{ width: '100%', accentColor: 'var(--blue-80)', marginTop: 6 }}/>
                  <div style={{ ...labelStyle, marginTop: 4 }}>rolling window</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: '10px 12px', background: '#fff', border: '1px dashed var(--gray-50)', borderRadius: 8, fontSize: 12, color: 'var(--gray-115)', lineHeight: 1.55 }}>
                Today’s cluster: <strong>23 convos</strong> · all billing/refund · within 2 days → would still alert.
              </div>
            </div>
            <div style={{ ...cardStyle, background: 'var(--yellow-15)', border: '1px solid var(--yellow-50)' }}>
              <div style={labelStyle}>Replay verdict</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.1 }}>{wouldAlert} alert{wouldAlert === 1 ? '' : 's'}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-100)', marginTop: 4 }}>past 14 days, both rules</div>
              <div style={{ fontSize: 12, color: 'var(--yellow-110)', marginTop: 12, lineHeight: 1.5 }}>{verdictNote}</div>
              <button onClick={resetCriteria} disabled={!criteriaDirty} style={{
                marginTop: 12, fontSize: 12, fontWeight: 600, width: '100%',
                padding: '6px 10px', borderRadius: 6,
                background: criteriaDirty ? '#fff' : 'var(--gray-15)',
                border: '1px solid ' + (criteriaDirty ? 'var(--yellow-100)' : 'var(--gray-30)'),
                color: criteriaDirty ? 'var(--yellow-110)' : 'var(--gray-90)',
                cursor: criteriaDirty ? 'pointer' : 'default', fontFamily: FF,
              }}>↻ Reset to recommended</button>
              <div style={{ fontSize: 11, color: 'var(--gray-90)', marginTop: 6, lineHeight: 1.5 }}>≥ {recommendedThr} fails · {recommendedClusterMin} convos · {recommendedWindow}d</div>
            </div>
          </div>
        )}

        {/* What changes downstream */}
        <div style={{ padding: '14px 18px', borderRadius: 10, border: '1px dashed var(--gray-40)', background: 'var(--gray-10)' }}>
          <div style={labelStyle}>What changes downstream</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 8, flexWrap: 'wrap', fontSize: 13, color: 'var(--gray-115)', lineHeight: 1.55 }}>
            <span>↳ Affects <strong>{a.threatens}</strong></span>
            {!isMonitor && <span>↳ Rule 2 changes apply to every check inside <strong>{a.monitorName}</strong></span>}
            <span style={{ color: 'var(--gray-95)' }}>↳ Edit logged in goal history. Old band kept for 30 days for comparison.</span>
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────── DETAIL PANE ────────────────────────────────
  const DetailPane = ({ a, onBack, onInvestigate, onJump, onTune }) => {
    const sev = sevTokens(a.sev);
    const linked = a.linkedTo && ANOM_BY_ID[a.linkedTo];
    const monitorData = window.K_DATA?.monitors?.find(m => m.id === a.monitorId);
    const criteriaList = monitorData?.criteria || [];
    let crIndex = criteriaList.findIndex(c => (c.name || '').trim().toLowerCase() === (a.metric || '').trim().toLowerCase());
    if (crIndex < 0) crIndex = ({ c1: 0, c2: 1, c3: 0, c4: 2 })[a.id] ?? 0;
    const crTotal = criteriaList.length || 4;
    return (
      <div style={{ fontFamily: FF }}>
        {/* Header — metadata row → title → actions */}
        <div style={{ borderBottom: '1px solid var(--gray-30)', paddingBottom: 18, marginBottom: 22 }}>
          {/* Metadata row: criterion name (N of M) | Monitor link | severity */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>
              {a.metric} <span style={{ color: 'var(--gray-90)', fontWeight: 500, fontFamily: MONO }}>({crIndex + 1} of {crTotal})</span>
            </span>
            <span style={{ width: 1, height: 12, background: 'var(--gray-30)' }}/>
            <a
              href={'Monitors.html#monitor/' + (a.monitorId || '')}
              target="_blank"
              rel="noopener"
              style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue-80)', textDecoration: 'none', borderBottom: '1px dotted var(--blue-25)' }}
              onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--blue-80)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'var(--blue-25)'; }}
            >{a.monitorName}</a>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: sev.color }}/>
              {sev.label}
            </span>
          </div>
          {/* Title = failure description */}
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.015em', lineHeight: 1.3 }}>
            {a.head}
          </h2>
          {/* Actions below title — Investigate moves to card footer */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn btn--ghost btn--sm" style={{ fontFamily: FF }}>Snooze 24h</button>
            <button onClick={onTune} className="btn btn--ghost btn--sm" style={{ fontFamily: FF }}>Tune sensitivity</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { lab: 'Baseline',      val: fmt(a.base, a.unit),     sub: 'recent average' },
            { lab: 'Now',           val: fmt(a.now, a.unit),      sub: (a.dir === 'up' ? '↑' : a.dir === 'down' ? '↓' : '·') + ' outside ±' + fmt(a.variance, a.unit) + ' band', highlight: true },
            { lab: 'Threatens',     val: a.goalLabel,             sub: a.threatens, small: true },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              borderRadius: 10,
              border: s.highlight ? '1px solid var(--yellow-50)' : '1px solid var(--gray-30)',
              background: s.highlight ? 'var(--yellow-15)' : '#fff',
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.lab}</div>
              <div style={{
                fontSize: s.small ? 14 : 24, fontWeight: 700,
                color: s.highlight ? sev.color : 'var(--gray-130)',
                letterSpacing: '-0.015em', marginTop: 6, lineHeight: 1.15,
              }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-90)', marginTop: 4, lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Topic cluster — single-line breadcrumb */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18, padding: '10px 14px', borderRadius: 8, background: 'var(--gray-10)', border: '1px solid var(--gray-30)' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Topic cluster</span>
          <a href="#topic/billing" onClick={e => e.preventDefault()} style={{ fontSize: 13, fontWeight: 500, color: 'var(--blue-80)', textDecoration: 'none', borderBottom: '1px dotted var(--blue-25)' }}>Billing</a>
          <span style={{ color: 'var(--gray-85)', fontSize: 12 }}>›</span>
          <span style={{ fontSize: 13, color: 'var(--gray-115)' }}>Refunds</span>
          <span style={{ color: 'var(--gray-85)', fontSize: 12 }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>Denial</span>
        </div>
        {/* Linked (kept hidden when monitor) */}
        {linked && linked.cat !== 'monitor' && (
          <div style={{ padding: '16px 18px', borderRadius: 10, border: '1px solid var(--yellow-50)', background: 'var(--yellow-15)', marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--yellow-100)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>↔ Linked criteria cluster</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-130)' }}>{linked.metric}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-100)', marginTop: 6, lineHeight: 1.55 }}>{linked.head}</div>
          </div>
        )}

        {/* Heatmap — focal criterion only, no surrounding labels */}
        <NeighborhoodHeatmap focal={a} onJump={onJump} focalOnly/>

        {/* Footer: Investigate CTA — same pattern as monitor's "Review conversations" */}
        {a.investigateCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 0', marginTop: 14, borderTop: '1px solid var(--gray-30)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>Conversations</span>
            <button onClick={onInvestigate} style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-80)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: FF }}>
              Investigate {a.investigateCount} conversations
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3l3.5 2.5L4 8"/></svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  // ────────────────────────────── INVESTIGATION PANE ─────────────────────────
  const InvestigationPane = ({ a, onBack, hideHeader }) => {
    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState('C-8821');
    const tripleCount = CONVOS_PAD.filter(c => c.failed.length >= 3).length;
    const filtered = useMemo(() => {
      if (filter === 'all') return CONVOS_PAD;
      if (filter === 'triple') return CONVOS_PAD.filter(c => c.failed.length >= 3);
      return CONVOS_PAD.filter(c => c.failed.includes(filter));
    }, [filter]);
    const sel = CONVOS_PAD.find(c => c.id === selectedId) || CONVOS_PAD[0];

    return (
      <div style={{ fontFamily: FF }}>
        {!hideHeader && (<>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <button onClick={onBack} style={{ fontSize: 12, fontWeight: 500, color: 'var(--blue-80)', background: 'none', border: 0, cursor: 'pointer', padding: 0, fontFamily: FF }}>← {a.metric}</button>
          <span style={{ color: 'var(--gray-50)' }}>/</span>
          <span style={{ fontSize: 12, color: 'var(--gray-115)', fontWeight: 500 }}>Investigation</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--gray-30)', paddingBottom: 18, marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Investigation · {CONVOS_PAD.length} conversations</div>
            <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>What’s actually happening in these chats?</h2>
            <div style={{ fontSize: 13, color: 'var(--gray-95)', marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
              All {CONVOS_PAD.length} share the same anomaly window. Filter by which criterion failed; click any to read it.
            </div>
          </div>
        </div>
        </>)}

        {/* Pattern callout */}
        <div style={{ padding: '18px 20px', borderRadius: 10, border: '1px solid var(--yellow-50)', background: 'var(--yellow-15)', marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--yellow-110)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>What they have in common</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { val: '23 of 23', sub: <>same topic: <strong>refund denied · billing</strong></> },
              { val: tripleCount + ' of 23', sub: <>failed all <strong>3 empathy criteria</strong></> },
              { val: '19 of 23', sub: <>customer re-asked <strong>3+ times</strong></> },
              { val: '17 of 23', sub: <>contained the phrase <strong>“per policy”</strong></> },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-115)', marginTop: 4, lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--yellow-70)', fontSize: 13, color: 'var(--yellow-110)', lineHeight: 1.55, fontStyle: 'italic' }}>
            → Root-cause hypothesis: <strong style={{ fontStyle: 'normal' }}>refund-denial flow lacks an empathy step.</strong> Agents jump to policy citation when customer is already frustrated.
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--yellow-70)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--yellow-110)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Suggested next actions</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: '⟳', label: 'Update AI procedure', sub: 'add an empathy step before policy citation — fixes the root cause for all 23', primary: true },
                { icon: '✦', label: 'Draft macro: empathy bridge', sub: 'reusable response for refund denials — ships today, no model change' },
              ].map((s, i) => (
                <button key={i} style={{
                  flex: '1 1 280px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: s.primary ? '1px solid var(--yellow-100)' : '1px solid var(--yellow-70)',
                  background: s.primary ? 'var(--yellow-100)' : '#fff',
                  color: s.primary ? '#fff' : 'var(--gray-130)',
                  cursor: 'pointer', fontFamily: FF,
                  boxShadow: s.primary ? '0 1px 0 rgba(130,111,28,0.15)' : 'none',
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 24, height: 24, borderRadius: 6,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: s.primary ? 'rgba(255,255,255,0.18)' : 'var(--yellow-15)',
                    color: s.primary ? '#fff' : 'var(--yellow-110)',
                    fontSize: 14, fontWeight: 700,
                  }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.3 }}>{s.label}</div>
                    <div style={{ fontSize: 12, opacity: s.primary ? 0.88 : 0.72, marginTop: 4, lineHeight: 1.45 }}>{s.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Filter</span>
          {[
            ['all', `All ${CONVOS_PAD.length}`],
            ['triple', `Triple-failure (${tripleCount})`],
            ['Tone matched emotional state', 'Tone failed'],
            ['Acknowledged customer frustration', 'Empathy missed'],
            ['Customer confirmed problem solved', 'No confirmation'],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              fontSize: 11, fontWeight: 600,
              padding: '4px 10px', borderRadius: 999,
              border: filter === k ? '1px solid var(--blue-80)' : '1px solid var(--gray-30)',
              background: filter === k ? 'var(--blue-10)' : '#fff',
              color: filter === k ? 'var(--blue-90)' : 'var(--gray-115)',
              cursor: 'pointer', fontFamily: FF, letterSpacing: '0.02em',
            }}>{l}</button>
          ))}
        </div>

        {/* Two-pane */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 14 }}>
          <div style={{ border: '1px solid var(--gray-30)', borderRadius: 10, background: '#fff', overflow: 'hidden', maxHeight: 640, overflowY: 'auto' }}>
            {filtered.map((c, i) => (
              <button key={c.id} onClick={() => setSelectedId(c.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 14px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--gray-25)' : 'none',
                background: selectedId === c.id ? 'var(--blue-10)' : 'transparent',
                cursor: 'pointer', fontFamily: FF, border: 'none', borderLeft: selectedId === c.id ? '3px solid var(--blue-80)' : '3px solid transparent',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <SentimentDot s={c.sentiment}/>
                  <span style={{ fontSize: 11, fontFamily: MONO, color: 'var(--gray-95)' }}>{c.id}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>{c.cust}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: MONO, color: 'var(--gray-85)' }}>{c.dur} · {c.turns}t</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-95)', marginBottom: 8 }}>{c.topic}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {c.failed.map(f => (
                    <span key={f} style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', background: '#FFE8E9', border: '1px solid #FFAAAD', color: '#7A1518', borderRadius: 999, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {f === 'Tone matched emotional state' ? 'tone' : f === 'Acknowledged customer frustration' ? 'empathy' : 'no-confirm'}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div style={{ border: '1px solid var(--gray-30)', borderRadius: 10, background: '#fff', padding: '18px 22px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <SentimentDot s={sel.sentiment}/>
              <span style={{ fontSize: 11, fontFamily: MONO, color: 'var(--gray-95)' }}>{sel.id}</span>
              <span style={{ color: 'var(--gray-50)' }}>·</span>
              <span style={{ fontSize: 11, color: 'var(--gray-95)' }}>{sel.dur} · {sel.turns} turns · <span style={{ fontWeight: 600 }}>{sel.sentiment}</span></span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.01em' }}>{sel.cust}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 4 }}>{sel.topic}</div>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--gray-30)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Failed criteria · judge rationale</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sel.failed.map(f => (
                  <div key={f} style={{ padding: '8px 12px', borderRadius: 8, background: '#FFE8E9', border: '1px solid #FFAAAD', fontSize: 13, fontWeight: 500, color: '#7A1518' }}>
                    ✕ {f}
                  </div>
                ))}
              </div>
              {sel.rationale && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--gray-15)', border: '1px dashed var(--gray-30)', borderRadius: 8, fontSize: 13, color: 'var(--gray-115)', fontStyle: 'italic', lineHeight: 1.55 }}>
                  “{sel.rationale}”
                </div>
              )}
            </div>

            {sel.excerpt && sel.excerpt.length > 0 && (
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--gray-30)' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Conversation excerpt</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sel.excerpt.map((m, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: m.who === 'cust' ? '#9E181E' : 'var(--gray-95)', paddingTop: 8 }}>{m.who === 'cust' ? 'Customer' : 'Agent'}</span>
                      <div style={{
                        padding: '8px 12px', borderRadius: 8,
                        background: m.who === 'cust' ? '#FFF4F4' : 'var(--gray-15)',
                        border: '1px solid ' + (m.who === 'cust' ? '#FFD0D2' : 'var(--gray-30)'),
                        fontSize: 13, color: 'var(--gray-130)', lineHeight: 1.55,
                      }}>{m.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(!sel.excerpt || sel.excerpt.length === 0) && (
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed var(--gray-30)', fontSize: 13, color: 'var(--gray-90)', fontStyle: 'italic' }}>
                Transcript loads on demand.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ────────────────────────────── INVESTIGATION DRAWER ───────────────────────
  // Thin wrapper around the monitor's ReviewPanel — keeps the conversation /
  // criteria / labeling experience identical. Anomaly context replaces the
  // default header, and the "What they have in common" callout is injected at
  // the top of the body via extraBodyTop.
  const InvestigationDrawer = ({ a, onClose }) => {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
      if (a) {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
      } else {
        setVisible(false);
      }
    }, [a]);
    if (!a) return null;

    const monitor = window.K_DATA?.monitors?.find(m => m.id === a.monitorId);
    const flagged = (window.K_DATA?.flaggedConversations || []).filter(c => c.monitorId === a.monitorId);
    const tripleCount = CONVOS_PAD.filter(c => c.failed.length >= 3).length;

    // Color + font tokens matching the monitor's ReviewPanel
    const C = {
      border:'#dce0e9', surface:'#ffffff', surfaceHi:'#f9fafb',
      textPrimary:'#1A1D23', textSec:'#5A6478', textMuted:'#8A94A6',
    };

    const extraBodyTop = (
      <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--yellow-50)', background: 'var(--yellow-15)', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--yellow-110)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>What they have in common</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {coFailureCount > 0 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>{coFailureCount} of {a.investigateCount}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-115)', marginTop: 2, lineHeight: 1.45 }}>
                also failed <strong>{linkedNames.join(', ')}</strong>
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>17 of {a.investigateCount}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-115)', marginTop: 4, lineHeight: 1.45 }}>
              cited outdated rubric
              <div style={{ display:'flex', gap:4, marginTop:4 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, color:'#0E7C86', background:'#E2F7F8', border:'1px solid #A5E1E5', padding:'1px 6px', borderRadius:4, fontFamily:MONO }}>kb:refund-eligibility</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.015em' }}>14 of {a.investigateCount}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-115)', marginTop: 2, lineHeight: 1.45 }}>
              became <strong>repeat contacts</strong> within 7 days
            </div>
          </div>
        </div>
      </div>
    );

    // Linked criteria anomalies on the same monitor — used to surface co-failure
    const linkedCriteria = ANOMALIES.filter(x =>
      x.cat === 'criteria' && x.monitorKey === a.monitorKey && x.id !== a.id
    );
    const linkedNames = linkedCriteria.map(x => x.metric);
    const coFailureCount = linkedCriteria.length > 0 ? Math.max(1, Math.min(a.investigateCount, tripleCount)) : 0;

    const headerCustom = (
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <span style={{ fontSize:14, fontWeight:600, color:'#1A1D23' }}>{a.metric}</span>
        <span style={{ width:1, height:12, background:'#dce0e9' }}/>
        <a
          href={'#monitor/' + (a.monitorId || '')}
          target="_blank"
          rel="noopener"
          style={{ fontSize:13, fontWeight:500, color:'#005BD8', textDecoration:'none', borderBottom:'1px dotted #BBD1FF' }}
          onMouseEnter={e => { e.currentTarget.style.borderBottomColor = '#005BD8'; }}
          onMouseLeave={e => { e.currentTarget.style.borderBottomColor = '#BBD1FF'; }}
        >{a.monitorName}</a>
        <span style={{ width:1, height:12, background:'#dce0e9' }}/>
        <span style={{ fontSize:11, fontWeight:600, color:'#5A6478', textTransform:'uppercase', letterSpacing:0.4 }}>Topic</span>
        <a href="#topic/refund-denial" onClick={e => e.preventDefault()} style={{ fontSize:13, fontWeight:600, color:'#005BD8', textDecoration:'none', borderBottom:'1px dotted #BBD1FF' }}>refund-denial</a>
      </div>
    );

    const customFilters = [
      ...(coFailureCount > 0 ? [{
        id: 'co_fail',
        label: `Also failed ${linkedNames.join(', ')}`,
        count: coFailureCount,
        filterFn: c => (c.criteriaScores || []).filter(s => !s.pass).length >= 2,
      }] : []),
      { id: 'kb',     label: 'Cited outdated kb:refund-eligibility', count: 17,
        filterFn: c => (c.messages || []).some(m => /policy|refund/i.test(m.text || '')) },
      { id: 'repeat', label: 'Repeat contact within 7d',             count: 14,
        filterFn: c => c.score < 60 },
    ];

    if (!monitor) return null;
    return (
      <window.ReviewPanel
        m={monitor}
        flagged={flagged}
        visible={visible}
        onClose={onClose}
        openConvo={null}
        C={C}
        FF={FF}
        headerCustom={headerCustom}
        extraBodyTop={extraBodyTop}
        customFilters={customFilters}
        totalCountOverride={a.investigateCount}
        pageSize={5}
      />
    );
  };

  // ────────────────────────────── LIST PANE ──────────────────────────────────
  const ListPane = ({ navigate }) => {
    const criteriaAll = ANOMALIES.filter(a => a.cat === 'criteria');
    const [sevFilter, setSevFilter] = useState('all');
    const [selectedId, setSelectedId] = useState(null);
    const [mode, setMode] = useState('detail'); // 'detail' | 'tuning'
    const [investigatingId, setInvestigatingId] = useState(null);
    const [range, setRange] = useState('7d');
    const criteria = sevFilter === 'all' ? criteriaAll : criteriaAll.filter(a => a.sev === sevFilter);
    const sevCounts = {
      all:  criteriaAll.length,
      high: criteriaAll.filter(a => a.sev === 'high').length,
      med:  criteriaAll.filter(a => a.sev === 'med').length,
    };

    // Honor a pending "open this anomaly" intent set elsewhere (e.g. monitor criterion badge)
    React.useEffect(() => {
      if (window.K_PENDING_ANOMALY_ID) {
        const id = window.K_PENDING_ANOMALY_ID;
        window.K_PENDING_ANOMALY_ID = null;
        if (ANOM_BY_ID[id]) { setSelectedId(id); setMode('detail'); }
      }
    }, []);

    const counts = {
      total: criteriaAll.length,
      criteria: criteriaAll.length,
      linked: ANOMALIES.filter(a => a.linkedTo).length / 2 | 0,
      drift: ANOMALIES.filter(a => a.sev === 'drift').length,
    };

    return (
      <div style={{ fontFamily: FF }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--gray-30)', paddingBottom: 18, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Goals · Anomalies</div>
            <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em' }}>What's drifting?</h1>
            <div style={{ fontSize: 13, color: 'var(--gray-95)', marginTop: 6, maxWidth: 720, lineHeight: 1.5 }}>
              Two altitudes — <strong>monitor</strong> (the headline) and <strong>criteria</strong> (the signals inside). Click any card for its 14-day neighborhood.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', borderRadius: 6, border: '1px solid var(--gray-30)', overflow: 'hidden' }}>
              {['24h', '7d', '30d'].map((r, i, arr) => (
                <button key={r} onClick={() => setRange(r)} style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '6px 10px',
                  borderLeft: i ? '1px solid var(--gray-30)' : 'none',
                  background: range === r ? 'var(--gray-15)' : '#fff',
                  color: range === r ? 'var(--gray-130)' : 'var(--gray-95)',
                  cursor: 'pointer', border: 'none', fontFamily: FF,
                }}>{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Story banner */}
        <div style={{
          padding: '16px 20px', borderRadius: 10,
          background: 'var(--yellow-15)', border: '1px solid var(--yellow-50)',
          marginBottom: 22,
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0, marginTop: 2,
              width: 22, height: 22, borderRadius: 999,
              background: 'var(--yellow-70)', color: 'var(--yellow-115)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>!</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--yellow-110)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>The story today</div>
              <div style={{ fontSize: 14, color: 'var(--gray-130)', lineHeight: 1.55 }}>
                Three criteria — <strong>Tone</strong>, <strong>Acknowledged frustration</strong>, and <strong>Customer confirmed solved</strong> — have been heating up for 3 days on the same <a href="#topic/refund-denial" onClick={e => e.preventDefault()} style={{ color: 'var(--blue-80)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px dotted var(--blue-25)' }}>refund-denial topic</a> <span style={{ color: 'var(--gray-95)', fontFamily: MONO, fontSize: 13 }}>(23 conversations)</span>.
                <span style={{ color: 'var(--yellow-110)', fontWeight: 600 }}> 14 of those became <a href="#performance/repeat-contacts" onClick={e => e.preventDefault()} style={{ color: 'var(--yellow-110)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px dotted var(--yellow-70)' }}>repeat contacts</a> within 7 days</span> — the cluster is flowing back into the queue.
              </div>
            </div>
          </div>
        </div>

        {/* Severity filter chips */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-90)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>Severity</span>
          {[
            { k: 'all',  label: 'All' },
            { k: 'high', label: 'High' },
            { k: 'med',  label: 'Medium' },
          ].map(opt => {
            const on = sevFilter === opt.k;
            return (
              <button key={opt.k} onClick={() => setSevFilter(opt.k)} style={{
                fontSize: 11, fontWeight: 600,
                padding: '4px 10px', borderRadius: 999,
                border: on ? '1px solid var(--blue-80)' : '1px solid var(--gray-30)',
                background: on ? 'var(--blue-10)' : '#fff',
                color: on ? 'var(--blue-90)' : 'var(--gray-115)',
                cursor: 'pointer', fontFamily: FF, letterSpacing: '0.02em',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {opt.label}
                <span style={{ opacity: 0.7, fontSize: 10, fontFamily: MONO }}>{sevCounts[opt.k]}</span>
              </button>
            );
          })}
        </div>

        {/* Anomalies list — every card defaults to expanded full-width detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {criteria.map(a => {
            const isTuning = selectedId === a.id && mode === 'tuning';
            return (
              <div key={a.id} style={{
                padding: '20px 22px',
                borderRadius: 12,
                border: '1px solid var(--gray-30)',
                background: '#fff',
                boxShadow: '0 1px 2px rgba(15,18,25,0.04)',
              }}>
                {isTuning ? (
                  <TuneSensitivityPane a={a} onBack={() => { setSelectedId(null); setMode('detail'); }}/>
                ) : (
                  <DetailPane
                    a={a}
                    onBack={null}
                    onInvestigate={() => setInvestigatingId(a.id)}
                    onTune={() => { setSelectedId(a.id); setMode('tuning'); }}
                    onJump={null}
                    inline
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Hint footer */}
        <div style={{ marginTop: 22, padding: '14px 18px', borderRadius: 10, border: '1px dashed var(--gray-40)', background: 'var(--gray-10)', fontSize: 13, color: 'var(--gray-100)', lineHeight: 1.55 }}>
          Each anomaly opens with its 14-day neighborhood. Use <strong>Investigate</strong> for the conversation cluster, <strong>Tune sensitivity</strong> to adjust the band.
        </div>

        <InvestigationDrawer a={investigatingId ? ANOM_BY_ID[investigatingId] : null} onClose={() => setInvestigatingId(null)}/>
      </div>
    );
  };

  // ────────────────────────────── ROOT ───────────────────────────────────────
  function AnomaliesV4({ navigate }) {
    return (
      <div className="page" style={{ fontFamily: FF }}>
        <ListPane navigate={navigate}/>
      </div>
    );
  }

  // Build monitor-id → related anomalies map
  window.K_ANOMALIES_BY_MONITOR_ID = ANOMALIES.reduce((acc, a) => {
    if (!a.monitorId) return acc;
    (acc[a.monitorId] = acc[a.monitorId] || []).push(a);
    return acc;
  }, {});

  // ────────────────────────────── EXPORTS ────────────────────────────────────
  // Criterion name → anomaly id, for the Monitors page to look up
  window.K_ANOMALY_BY_CRITERION = {
    'Tone matched emotional state': 'c1',
    'Customer confirmed problem solved': 'c2',
    'Cited correct policy': 'c3',
    'Acknowledged customer frustration': 'c4',
  };

  // Anomalies grouped by monitorId for the Review panel to derive patterns from
  window.K_ANOMALIES_BY_MONITOR_ID = ANOMALIES.reduce((acc, a) => {
    if (!a.monitorId) return acc;
    (acc[a.monitorId] = acc[a.monitorId] || []).push(a);
    return acc;
  }, {});

  // Replace AnomaliesV2 with the new version. Goals v4.html resolves
  // window.AnomaliesV2 inside its mount() loop, so this assignment must
  // happen before mount runs (which it does — script tag order).
  window.AnomaliesV2 = AnomaliesV4;
})();
