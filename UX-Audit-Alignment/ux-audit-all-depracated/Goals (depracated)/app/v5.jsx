// ─── v5 layer: Goal ↔ Monitor relationship clarity ──────────────────────────
// Loaded ONLY by Goals v5.html. Adds:
//   1. RelationshipStrip — an explainer at the top of Goals home that names
//      the two primitives (Goal, Monitor) and how they connect (or don't).
//   2. GoalCardV5 — replaces GoalCardV2 via window.GoalCardOverride. Adds an
//      explicit "Scored by" attachment row so users see, on every card,
//      whether the goal is actually being measured by a monitor, by which
//      monitor, and the monitor's calibration. For goals with no monitor:
//      a clear "Not scored yet" affordance with a one-click attach CTA.
//
// The downstream monitors.jsx and v2.jsx have already been updated to make
// the goal↔monitor link explicit on the monitors side (Powering a goal vs
// Standalone sections, monitor-card header pills, create-panel toggle).

(() => {
  const {
    React, IPlus, IAlert, ITrendUp, IChevronRight, ITarget, IMonitor, ILink,
  } = window;
  const { useState } = React;

  // ── RelationshipStrip ───────────────────────────────────────────────────────
  function RelationshipStrip({ navigate }) {
    return (
      <div style={{
        marginBottom: 18,
        padding: '14px 18px',
        background: '#fff',
        border: '1px solid var(--gray-30)',
        borderRadius: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 32px 1fr 32px 1fr',
          gap: 10,
          alignItems: 'stretch',
        }}>
          {/* Goals */}
          <Concept
            icon={<ITarget size={15} stroke={1.9}/>}
            label="Goals"
            title="Outcomes you want to hit"
            body="A CSAT target. A churn-rate ceiling. Each goal has a number you're trying to move."
            tint="#1B3D8F"
            tintBg="#EEF4FF"
            tintBorder="#DCE6FF"
          />
          {/* Arrow / OR */}
          <Connector label="powered by"/>
          {/* Monitors */}
          <Concept
            icon={<IMonitor size={15} stroke={1.9}/>}
            label="Monitors"
            title="AI scorers watching conversations"
            body="A monitor grades conversations against criteria you define and writes a score."
            tint="#15803d"
            tintBg="#E8F6EC"
            tintBorder="#B7E0C1"
          />
          {/* Or ungrouped */}
          <Connector label="or"/>
          {/* Standalone */}
          <Concept
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>}
            label="Alone"
            title="Monitors don't need a goal"
            body="Use a standalone monitor as a watchdog — compliance, errors, drift — when there's no number to hit, just something to know."
            tint="#5A6478"
            tintBg="#F4F5F7"
            tintBorder="#DCE0E9"
          />
        </div>
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--gray-30)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 12, color: 'var(--gray-100)', lineHeight: 1.5,
        }}>
          <span>
            <strong style={{ color: 'var(--gray-130)', fontWeight: 600 }}>Goals page</strong> shows outcomes &amp; their scorers.{' '}
            <strong style={{ color: 'var(--gray-130)', fontWeight: 600 }}>Monitors page</strong> shows every scorer — including standalones.
          </span>
          <a onClick={() => navigate({ screen: 'monitors' })} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--blue-80)',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            See all monitors <IChevronRight size={12}/>
          </a>
        </div>
      </div>
    );
  }

  function Concept({ icon, label, title, body, tint, tintBg, tintBorder }) {
    return (
      <div style={{ minWidth: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: tint, background: tintBg, border: `1px solid ${tintBorder}`,
          borderRadius: 99, padding: '2px 9px 2px 7px',
          marginBottom: 8,
        }}>
          <span style={{ color: tint, display: 'inline-flex' }}>{icon}</span>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)', lineHeight: 1.35, letterSpacing: '-0.005em' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--gray-100)', lineHeight: 1.5, marginTop: 4 }}>{body}</div>
      </div>
    );
  }

  function Connector({ label }) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', paddingTop: 4,
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--gray-85)" strokeWidth="1.4" strokeLinecap="round">
          <path d="M3 10h14M13 6l4 4-4 4"/>
        </svg>
        <span style={{
          fontSize: 9, fontWeight: 600, color: 'var(--gray-90)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          marginTop: 4, whiteSpace: 'nowrap',
        }}>{label}</span>
      </div>
    );
  }

  // ── GoalCardV5 — explicit "Scored by" attachment ──────────────────────────
  // Same shape as GoalCardV2; renamed sections so a user reading the card
  // can answer in two seconds: is this goal scored, by what, and how
  // calibrated. For goals with no monitor: a clean affordance to attach one.
  function GoalCardV5({ goal, monitor, onOpen, onDelete, onEdit, navigate, showSuggestions, onToggleSuggestions }) {
    const m = monitor[0];
    const [menuOpen, setMenuOpen] = useState(false);
    const [suggPanel, setSuggPanel] = useState(null);
    const fmt = (v) => goal.unit === 'currency' ? '$' + v.toFixed(2) : goal.unit === 'percent' ? v + '%' : v.toFixed(v < 10 ? 1 : 0);

    const goalSuggestions = window.K_DATA.suggestions.filter(s => s.goalIds && s.goalIds.includes(goal.id));
    const fillKind = goal.status === 'declining' ? 'watch' : goal.status === 'improving' ? 'good' : goal.status === 'stalled' ? 'watch' : 'neutral';

    const isDeclining = goal.status === 'declining';
    let why, whyKind = 'good';

    if (isDeclining) {
      why = <>Declining this week. {m ? <><strong>{m.passRate}%</strong> pass rate — check suggestions in Alerts.</> : 'Trending away from target.'}</>;
      whyKind = 'watch';
    } else if (goal.status === 'improving') {
      why = <>Improving this week. {m ? <><strong>{m.passRate}%</strong> of conversations passed scoring.</> : 'Trending toward target.'}</>;
    } else if (goal.status === 'stalled') {
      why = <>No movement in 7 days. {m ? <><strong>{m.passRate}%</strong> pass rate is below the {m.threshold}% target.</> : 'No recent improvement.'}</>;
      whyKind = 'watch';
    } else {
      why = <>{m ? <>Tracking via <strong>{m.name}</strong>. {m.evals30d.toLocaleString()} conversations scored.</> : 'Tracking quietly.'}</>;
    }

    const isLower = goal.direction === 'lower_is_better';
    const barPct = isLower
      ? Math.min(100, Math.max(0, Math.round((goal.target / goal.current) * 100)))
      : goal.pct;

    const GoalStatusBadge = window.GoalStatusBadge;

    return (
      <article className="gcard gcard--v3" onClick={onOpen} data-screen-label={'Goal: ' + goal.name}
        style={{
          background: '#fff',
          border: '0.5px solid var(--gray-40)',
          borderRadius: 12,
          padding: '16px 18px 14px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 14,
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}>
        {/* Header — title + ⋯ */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1, lineHeight: 1.3 }}>{goal.name}</h3>
          <div style={{ position: 'relative', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setMenuOpen((v) => !v)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-85)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#fff', border: '1px solid var(--gray-30)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 140, overflow: 'hidden' }}>
                  <MenuItem onClick={() => { setMenuOpen(false); onOpen(); }}>View goal</MenuItem>
                  <MenuItem onClick={() => { setMenuOpen(false); onEdit && onEdit(goal); }}>Edit goal</MenuItem>
                  <div style={{ height: 1, background: 'var(--gray-25)', margin: '0 8px' }}/>
                  <MenuItem danger onClick={() => { setMenuOpen(false); onDelete && onDelete(goal.id); }}>Delete goal</MenuItem>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta — Default · status · scope */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 500, padding: '2px 8px',
            border: '1px solid var(--gray-40)', borderRadius: 6,
            color: 'var(--gray-100)', background: 'transparent', lineHeight: 1.4,
          }}>{goal.isDefault ? 'Default' : 'Custom'}</span>
          {GoalStatusBadge && <GoalStatusBadge status={goal.status} />}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-85)' }}>Human + AI</span>
        </div>

        {/* Metric */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-130)', letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(goal.current)}</span>
          <span style={{ fontSize: 13, color: 'var(--gray-85)' }}>→ target {fmt(goal.target)}</span>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--gray-85)', marginBottom: 6 }}>
            <span>Progress to target</span>
            <span>{barPct}%</span>
          </div>
          <div style={{ height: 3, background: 'var(--gray-25)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: barPct + '%', height: '100%',
              background: fillKind === 'good' ? 'var(--green-70)' : fillKind === 'watch' ? 'var(--yellow-70)' : 'var(--gray-70)',
            }}/>
          </div>
        </div>

        {/* ─── SCORED BY ROW — the v5 addition ──────────────────────────── */}
        <ScoredByRow monitor={m} navigate={navigate} onAttach={(e) => { e.stopPropagation(); onEdit && onEdit(goal); }}/>

        {/* Insight (why) */}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid var(--gray-30)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ flexShrink: 0, color: whyKind === 'watch' ? 'var(--yellow-80)' : 'var(--green-70)', display: 'flex', marginTop: 2 }}>
            {whyKind === 'watch' ? <IAlert size={14} /> : <ITrendUp size={14} stroke={2.5} />}
          </span>
          <div style={{ fontSize: 12, color: 'var(--gray-100)', lineHeight: 1.5, flex: 1 }}>{why}</div>
        </div>

        {/* Footer — suggestions */}
        <div onClick={(e) => { e.stopPropagation(); onToggleSuggestions(); }}
          style={{ borderTop: '1px solid var(--gray-30)', marginTop: 12, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-115)' }}>Suggested improvements</span>
            {!showSuggestions && (
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-95)' }}>
                {goalSuggestions.length > 0 ? <>— {goalSuggestions.length} ready to review</> : <>— none right now</>}
              </span>
            )}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-90)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showSuggestions ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.18s' }}><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        {showSuggestions && (
          <div style={{ paddingTop: 8 }} onClick={(e) => e.stopPropagation()}>
            {goalSuggestions.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--gray-85)', padding: '6px 0 4px', lineHeight: 1.5 }}>
                No improvement opportunities right now. We'll surface these when this goal lags or a workflow pattern emerges.
              </div>
            ) : (
              <>
                {goalSuggestions.slice(0, 2).map(s => (
                  <div key={s.id} onClick={e => { e.stopPropagation(); navigate({ screen: 'inbox', highlight: s.id }); }} style={{ padding: '8px 10px', background: 'var(--gray-15)', border: '1px solid var(--gray-30)', borderRadius: 6, marginBottom: 6, cursor: 'pointer' }}>
                    <div style={{ fontSize: 12, color: 'var(--gray-130)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-90)' }}>{s.typeLabel} · {s.priority} priority</div>
                  </div>
                ))}
                <a onClick={(e) => { e.stopPropagation(); navigate({ screen: 'inbox' }); }} style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-80)', cursor: 'pointer' }}>
                  View all {goalSuggestions.length} suggestions →
                </a>
              </>
            )}
          </div>
        )}

        {suggPanel && window.ProcedurePanelShared && window.ProcedurePanelFromGoal && (
          <window.ProcedurePanelFromGoal s={suggPanel} onClose={() => setSuggPanel(null)} />
        )}
      </article>
    );
  }

  function MenuItem({ onClick, danger, children }) {
    return (
      <button onClick={onClick} style={{
        width: '100%', padding: '9px 14px', textAlign: 'left',
        background: 'none', border: 'none', fontSize: 13,
        color: danger ? 'var(--red-80, #dc2626)' : 'var(--gray-115)',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = danger ? 'var(--red-10, #fef2f2)' : 'var(--gray-15)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >{children}</button>
    );
  }

  // ── ScoredByRow — the explicit goal↔monitor relationship strip ─────────
  function ScoredByRow({ monitor, navigate, onAttach }) {
    const cal = (monitor && window.K_V4) ? window.K_V4.getCalibration(monitor) : null;
    const drifting = cal && cal.status === 'drifting';

    if (!monitor) {
      // No scorer attached
      return (
        <div style={{
          marginTop: 14,
          padding: '10px 12px',
          border: '1px dashed var(--gray-40)',
          background: 'var(--gray-15)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', border: '1px dashed var(--gray-50)', color: 'var(--gray-95)',
            flexShrink: 0,
          }}>
            <ILink size={12}/>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-100)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Not scored yet</div>
            <div style={{ fontSize: 12, color: 'var(--gray-115)', marginTop: 2, lineHeight: 1.4 }}>
              No monitor is grading this goal. The number above comes from another source.
            </div>
          </div>
          <button onClick={onAttach} style={{
            flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '5px 10px', fontSize: 12, fontWeight: 600,
            background: '#fff', color: 'var(--blue-80)',
            border: '1px solid var(--blue-30, #cfd8f5)',
            borderRadius: 6, cursor: 'pointer',
          }}>
            <IPlus size={11}/> Attach scorer
          </button>
        </div>
      );
    }

    return (
      <div onClick={(e) => { e.stopPropagation(); navigate({ screen: 'monitor', id: monitor.id }); }}
        style={{
          marginTop: 14,
          padding: '10px 12px',
          border: drifting ? '1px solid var(--yellow-40, #f9dfa1)' : '1px solid var(--gray-30)',
          background: drifting ? 'var(--yellow-10, #fff8e6)' : '#fff',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'background 0.12s ease',
        }}
        onMouseEnter={(e) => { if (!drifting) e.currentTarget.style.background = 'var(--gray-15)'; }}
        onMouseLeave={(e) => { if (!drifting) e.currentTarget.style.background = '#fff'; }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: drifting ? 'var(--yellow-10, #fff8e6)' : 'var(--blue-10, #eef4ff)',
          color: drifting ? 'var(--yellow-100, #8a5a00)' : 'var(--blue-80)',
          border: drifting ? '1px solid var(--yellow-50, #f4d27a)' : '1px solid var(--blue-30, #cfd8f5)',
          flexShrink: 0,
        }}>
          <IMonitor size={12}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-100)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Scored by</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {monitor.name}
          </div>
        </div>
        {cal && (
          <div style={{
            flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 9px',
            borderRadius: 99,
            background: drifting ? '#fff' : 'var(--gray-15)',
            border: drifting ? '1px solid var(--yellow-50, #f4d27a)' : '1px solid var(--gray-30)',
            fontSize: 11, fontWeight: 600,
            color: drifting ? 'var(--yellow-100, #8a5a00)' : 'var(--gray-115)',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            whiteSpace: 'nowrap',
          }}>
            {drifting ? 'Drifting · ' : 'Calibrated · '}{cal.agreement}%
          </div>
        )}
        <IChevronRight size={13} stroke={2} color="var(--gray-85)"/>
      </div>
    );
  }

  // ── Wire it up ──────────────────────────────────────────────────────────
  window.K_V5 = { RelationshipStrip };
  window.K_V5_INTRO = true;
  window.GoalCardOverride = GoalCardV5;
})();
