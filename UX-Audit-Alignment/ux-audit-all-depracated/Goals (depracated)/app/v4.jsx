// ─── v4 layer: Calibration trust + Rationale-first conversation drawer ────────
// Loaded ONLY by Goals v4.html. Adds two surfaces on top of v2:
//   1. CalibrationBadge on every goal card → opens CalibrationSheet
//   2. ConversationDrawerV4 (replaces window.ConversationDrawer) leads with
//      the scorer's reasoning, not the score number.

(() => {
  const { useState, useEffect } = React;
  const { Drawer, IInfo, IClose, IAlert, ICheck, ICheckCircle, IChevronDown } = window;

  // ── Calibration metadata ────────────────────────────────────────────────────
  // Derived deterministically from the monitor — pretend output of the
  // build/test/deploy loop. Each scorer has an agreement % against a
  // team-labeled set, plus a small history of disagreement cases.
  const CALIBRATION = {
    mon_csat: {
      agreement: 94,
      labeled: 142,
      lastCalibratedDays: 2,
      curatedExamples: 142,
      disagreementCount: 8,
      modelsCompared: 3,
      passes: 7, // refinement iterations
      status: 'calibrated',
      note: 'Three models reviewed each labeled conversation. Disagreements resolved by adding edge-case examples to the eval set.',
      drift7d: 0,
      recentDisagreements: [
        { id: 'cal-1', label: 'Did not pass', model: 'Passed', signal: 'Sarcastic "thank you" after handoff — model read as polite, labelers flagged frustration.', resolved: true },
        { id: 'cal-2', label: 'Passed', model: 'Did not pass', signal: 'Three-message back-and-forth about shipping — model read as need-not-met, labelers accepted.', resolved: true },
        { id: 'cal-3', label: 'Did not pass', model: 'Did not pass (low confidence)', signal: 'Customer pivoted topic mid-conversation; clarified after refinement.', resolved: true },
      ],
    },
    mon_air: {
      agreement: 91,
      labeled: 88,
      lastCalibratedDays: 5,
      curatedExamples: 88,
      disagreementCount: 6,
      modelsCompared: 3,
      passes: 5,
      status: 'calibrated',
      note: 'Calibrated against agent-reviewed copilot suggestions. Disagreement mostly on partial acceptance.',
      drift7d: -1,
      recentDisagreements: [
        { id: 'cal-4', label: 'Passed', model: 'Did not pass', signal: 'Agent edited copilot draft heavily but kept structure — clarified as accepted.', resolved: true },
        { id: 'cal-5', label: 'Did not pass', model: 'Passed', signal: 'Copilot suggested wrong KB article; agent ignored — added to eval set.', resolved: true },
      ],
    },
    mon_proc: {
      agreement: 78,
      labeled: 54,
      lastCalibratedDays: 12,
      curatedExamples: 54,
      disagreementCount: 14,
      modelsCompared: 3,
      passes: 3,
      status: 'drifting',
      note: 'Procedure changes shipped 8 days ago haven\'t been added to the labeled set. Agreement has dropped 6 points since the last calibration.',
      drift7d: -6,
      recentDisagreements: [
        { id: 'cal-6', label: 'Passed', model: 'Did not pass', signal: 'New address-change procedure introduced a verification step; scorer still expects old flow.', resolved: false },
        { id: 'cal-7', label: 'Passed', model: 'Did not pass', signal: 'Escalation handoff now uses a summary tool the scorer doesn\'t recognize.', resolved: false },
        { id: 'cal-8', label: 'Did not pass', model: 'Passed', signal: 'Tool call timing — scorer accepts late tool calls the team flags.', resolved: false },
      ],
    },
  };

  function getCalibration(monitor) {
    if (!monitor) return null;
    return CALIBRATION[monitor.id] || {
      agreement: 88,
      labeled: 60,
      lastCalibratedDays: 7,
      curatedExamples: 60,
      disagreementCount: 5,
      modelsCompared: 2,
      passes: 2,
      status: 'calibrated',
      note: 'Default calibration profile.',
      drift7d: 0,
      recentDisagreements: [],
    };
  }

  // ── Calibration badge ───────────────────────────────────────────────────────
  function CalibrationBadge({ monitor }) {
    const [open, setOpen] = useState(false);
    if (!monitor) return null;
    const cal = getCalibration(monitor);
    const drifting = cal.status === 'drifting';
    const accent = drifting ? 'var(--yellow-90, #b45309)' : 'var(--gray-115)';
    const trackColor = drifting ? 'var(--yellow-30, #fce8b3)' : 'var(--gray-30)';
    const fillColor  = drifting ? 'var(--yellow-80, #d97706)' : 'var(--green-80, #16a34a)';
    return (
      <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        title={drifting ? 'Scorer is drifting — open calibration' : 'Open scorer calibration'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '3px 6px 3px 8px',
          borderRadius: 6,
          border: 'none',
          background: 'transparent',
          color: accent,
          fontSize: 11,
          fontWeight: 500,
          fontFamily: 'Inter, system-ui, sans-serif',
          cursor: 'pointer',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-15)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ fontSize: 11, color: 'var(--gray-90)', fontWeight: 500 }}>
          {drifting ? 'Drifting' : 'Calibrated'}
        </span>
        <span style={{
          position: 'relative',
          width: 36, height: 4,
          borderRadius: 2,
          background: trackColor,
          overflow: 'hidden',
        }}>
          <span style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: cal.agreement + '%',
            background: fillColor,
            borderRadius: 2,
          }}/>
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 11, fontWeight: 600,
          color: accent,
          fontVariantNumeric: 'tabular-nums',
        }}>{cal.agreement}%</span>
      </button>
      {open && ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()}>
          <CalibrationSheet monitor={monitor} onClose={() => setOpen(false)}/>
        </div>,
        document.body
      )}
      </>
    );
  }

  // ── Calibration sheet (right-side drawer) ───────────────────────────────────
  function CalibrationSheet({ monitor, onClose }) {
    if (!monitor) return null;
    const cal = getCalibration(monitor);
    const drifting = cal.status === 'drifting';

    return (
      <Drawer open={!!monitor} onClose={onClose} wide>
        <div className="drawer__header" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gray-85)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Scorer calibration</div>
            <h2 className="drawer__title" style={{ marginTop: 4 }}>{monitor.name}</h2>
            <div style={{ fontSize: 13, color: 'var(--gray-95)', marginTop: 2, lineHeight: 1.5, maxWidth: 520 }}>{monitor.description}</div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onClose}><IClose size={14}/></button>
        </div>

        <div className="drawer__body" style={{ padding: '20px 24px' }}>
          {/* Hero stat */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20,
          }}>
            <div style={{
              padding: '20px 22px',
              borderRadius: 12,
              border: drifting ? '1px solid var(--yellow-50, #f4d27a)' : '1px solid var(--gray-30)',
              background: drifting ? 'var(--yellow-10, #fff8e6)' : '#fff',
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-90)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Agreement with team labels</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: drifting ? 'var(--yellow-110, #6b4500)' : 'var(--gray-130)' }}>{cal.agreement}<span style={{ fontSize: 22, fontWeight: 600 }}>%</span></span>
                {cal.drift7d !== 0 && (
                  <span style={{ fontSize: 12, fontWeight: 500, color: cal.drift7d < 0 ? 'var(--yellow-100, #8a5a00)' : 'var(--green-90)' }}>
                    {cal.drift7d > 0 ? '+' : ''}{cal.drift7d} pts / 7d
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 6, lineHeight: 1.5 }}>{drifting ? 'Scorer disagrees with team labels more often than usual.' : 'Scorer agrees with team labels at the target rate.'}</div>
            </div>
            <div style={{
              padding: '16px 18px',
              borderRadius: 12,
              border: '1px solid var(--gray-30)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-100)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Calibration inputs</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Stat label="Curated examples" value={cal.curatedExamples} />
                  <Stat label="Models compared" value={cal.modelsCompared} />
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--gray-25)' }}/>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-100)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Calibration history</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Stat label="Refinement passes" value={cal.passes} />
                  <Stat label="Last calibrated" value={cal.lastCalibratedDays === 0 ? 'today' : cal.lastCalibratedDays + 'd ago'} />
                </div>
              </div>
            </div>
          </div>

          {/* Build / Test / Deploy strip */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>How this scorer was built</SectionLabel>
            <BuildLoopStrip cal={cal} drifting={drifting} />
          </div>

          {/* Recent disagreements */}
          <div>
            <SectionLabel>
              Recent disagreements
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-90)', marginLeft: 8 }}>
                {cal.disagreementCount} flagged · {cal.recentDisagreements.filter(d => d.resolved).length} resolved
              </span>
            </SectionLabel>
            <div style={{ border: '1px solid var(--gray-30)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
              {cal.recentDisagreements.length === 0
                ? <div style={{ padding: 16, fontSize: 12, color: 'var(--gray-90)' }}>No disagreements logged.</div>
                : cal.recentDisagreements.map((d, i) => (
                    <div key={d.id} style={{
                      padding: '14px 16px',
                      borderBottom: i === cal.recentDisagreements.length - 1 ? 'none' : '1px solid var(--gray-25)',
                      display: 'grid',
                      gridTemplateColumns: '160px 1fr auto',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--gray-100)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: 'var(--gray-115)' }}/>
                          team: <strong style={{ color: 'var(--gray-130)' }}>{d.label}</strong>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: d.resolved ? 'var(--green-70)' : 'var(--yellow-70)' }}/>
                          model: <strong style={{ color: 'var(--gray-130)' }}>{d.model}</strong>
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-115)', lineHeight: 1.55 }}>{d.signal}</div>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: d.resolved ? 'var(--green-15, #e8f6ec)' : 'var(--yellow-10, #fff8e6)',
                        color: d.resolved ? 'var(--green-95, #15803d)' : 'var(--yellow-100, #8a5a00)',
                        border: '1px solid ' + (d.resolved ? 'var(--green-40, #b7e0c1)' : 'var(--yellow-50, #f4d27a)'),
                        whiteSpace: 'nowrap',
                      }}>{d.resolved ? 'Resolved' : 'Open'}</span>
                    </div>
                  ))}
            </div>
            {drifting && (
              <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--yellow-10, #fff8e6)', border: '1px solid var(--yellow-40, #f9dfa1)', borderRadius: 10, fontSize: 13, color: 'var(--yellow-110, #6b4500)', lineHeight: 1.55, display: 'flex', gap: 10 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}><IAlert size={14}/></span>
                <div>
                  <strong>Recalibration recommended.</strong> Add the {cal.disagreementCount - cal.recentDisagreements.filter(d => d.resolved).length} unresolved cases to the labeled set, then re-run agreement testing. Estimated 4 minutes.
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    );
  }

  function Stat({ label, value }) {
    return (
      <div>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--gray-90)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-130)', marginTop: 4, letterSpacing: '-0.01em' }}>{value}</div>
      </div>
    );
  }

  function SectionLabel({ children }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600, color: 'var(--gray-115)', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 12 }}>
        {children}
      </div>
    );
  }

  function BuildLoopStrip({ cal, drifting }) {
    const stages = [
      { key: 'build', label: 'Build', sub: cal.curatedExamples + ' examples', state: 'done' },
      { key: 'test',  label: 'Test',  sub: cal.modelsCompared + ' models · ' + cal.passes + ' passes', state: 'done' },
      { key: 'deploy', label: 'Deploy', sub: drifting ? 'drifting' : 'in production', state: drifting ? 'warn' : 'done' },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1px solid var(--gray-30)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
        {stages.map((s, i) => (
          <div key={s.key} style={{
            padding: '14px 16px',
            borderRight: i === stages.length - 1 ? 'none' : '1px solid var(--gray-25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            <span style={{
              flexShrink: 0,
              width: 22, height: 22, borderRadius: 999,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: s.state === 'warn' ? 'var(--yellow-10, #fff8e6)' : 'var(--green-15, #e8f6ec)',
              color: s.state === 'warn' ? 'var(--yellow-100, #8a5a00)' : 'var(--green-95, #15803d)',
              border: '1px solid ' + (s.state === 'warn' ? 'var(--yellow-50, #f4d27a)' : 'var(--green-40, #b7e0c1)'),
              fontSize: 11, fontWeight: 700,
              marginTop: 1,
            }}>
              {s.state === 'warn' ? '!' : <ICheck size={11} stroke={3}/>}
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)', letterSpacing: '-0.005em' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-95)', marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Rationale-first conversation drawer ─────────────────────────────────────
  function ConversationDrawerV4({ id, onClose, navigate }) {
    const { flaggedConversations, monitors } = window.K_DATA;
    const c = flaggedConversations.find((x) => x.id === id);
    const [showAllCriteria, setShowAllCriteria] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [calOpen, setCalOpen] = useState(null);

    if (!c) return null;
    const monitor = monitors.find((m) => m.id === c.monitorId);
    const cal = monitor ? getCalibration(monitor) : null;
    const failed = (c.criteriaScores || []).filter((s) => !s.pass);
    const passed = (c.criteriaScores || []).filter((s) => s.pass);
    const failedEssential = failed.filter((s) => s.essential);

    // Synthesize signals if rationales aren't all present
    const heroSignals = failed.length > 0
      ? failed.map((s) => ({
          name: s.name,
          essential: !!s.essential,
          rationale: s.rationale || 'Score ' + (s.score ?? '—') + '/100 — below pass threshold for this criterion.',
        }))
      : [{
          name: 'Below pass threshold',
          essential: false,
          rationale: 'Quality score of ' + c.score + ' fell below the configured threshold for ' + (monitor?.name || 'this scorer') + '.',
        }];

    return (
      <>
        <Drawer open={!!id && !calOpen} onClose={onClose} wide>
          <div className="drawer__header" style={{ alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--gray-85)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{c.id}</div>
              <h2 className="drawer__title">{c.customer}</h2>
              <div style={{ fontSize: 13, color: 'var(--gray-95)' }}>{c.customerCompany} · {c.timeAgo}</div>
            </div>
            <button className="btn btn--ghost btn--sm" onClick={onClose}><IClose size={14}/></button>
          </div>

          <div className="drawer__body" style={{ padding: '18px 24px' }}>

            {/* HERO: Why this was flagged ─────────────────────────────────────── */}
            <div style={{
              padding: '20px 22px',
              borderRadius: 12,
              border: '1px solid var(--gray-30)',
              background: 'linear-gradient(180deg, #fff 0%, var(--gray-15) 100%)',
              marginBottom: 18,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--gray-90)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 18, height: 18, borderRadius: 999,
                  background: failedEssential.length > 0 ? 'var(--red-10, #fef2f2)' : 'var(--yellow-10, #fff8e6)',
                  color: failedEssential.length > 0 ? 'var(--red-90, #b91c1c)' : 'var(--yellow-100, #8a5a00)',
                  border: '1px solid ' + (failedEssential.length > 0 ? 'var(--red-30, #fbb4b4)' : 'var(--yellow-40, #f9dfa1)'),
                }}>
                  <IAlert size={10}/>
                </span>
                Why the scorer flagged this
              </div>
              <h3 style={{
                margin: '10px 0 0',
                fontSize: 19, fontWeight: 600, color: 'var(--gray-130)',
                lineHeight: 1.4, letterSpacing: '-0.01em',
              }}>
                {failedEssential.length > 0
                  ? <>Essential criterion not met: <em style={{ fontStyle: 'normal', color: 'var(--red-90, #b91c1c)' }}>{failedEssential.map(s => s.name).join(', ')}</em></>
                  : failed.length > 0
                    ? <>{failed.length} of {(c.criteriaScores || []).length} criteria did not pass.</>
                    : <>Overall quality score below threshold.</>
                }
              </h3>

              {/* Per-signal rationales */}
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {heroSignals.map((s, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '14px 1fr',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      marginTop: 6,
                      width: 8, height: 8, borderRadius: 999,
                      background: s.essential ? 'var(--red-90, #b91c1c)' : 'var(--yellow-70, #d97706)',
                    }}/>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>
                        {s.name}
                        {s.essential && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, background: 'var(--red-10, #fef2f2)', color: 'var(--red-90, #b91c1c)', border: '1px solid var(--red-30, #fbb4b4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Essential</span>}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray-115)', lineHeight: 1.55, marginTop: 4 }}>
                        {s.rationale}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score chip — secondary, inline */}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--gray-25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--gray-100)' }}>
                  <span>Quality score <strong style={{ color: c.score < 50 ? 'var(--red-90, #b91c1c)' : 'var(--yellow-100, #8a5a00)', fontSize: 14, marginLeft: 4 }}>{c.score}</strong> / 100</span>
                  <span style={{ width: 1, height: 12, background: 'var(--gray-30)' }}/>
                  <span>{passed.length}/{(c.criteriaScores || []).length} criteria passed</span>
                </div>
                {monitor && cal && (
                  <button onClick={() => setCalOpen(monitor)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 9px 4px 7px',
                    borderRadius: 999,
                    border: cal.status === 'drifting' ? '1px solid var(--yellow-50, #f4d27a)' : '1px solid var(--gray-30)',
                    background: cal.status === 'drifting' ? 'var(--yellow-10, #fff8e6)' : '#fff',
                    color: cal.status === 'drifting' ? 'var(--yellow-100, #8a5a00)' : 'var(--gray-115)',
                    fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 12, height: 12, borderRadius: 999,
                      background: cal.status === 'drifting' ? 'var(--yellow-70, #d97706)' : 'var(--green-70, #16a34a)',
                      color: '#fff',
                    }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </span>
                    Scorer {cal.agreement}% agreement
                  </button>
                )}
              </div>
            </div>

            {/* Reviewer feedback — closes the loop on calibration */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', marginBottom: 18,
              border: '1px solid var(--gray-30)', borderRadius: 10, background: '#fff',
            }}>
              <div style={{ fontSize: 13, color: 'var(--gray-115)', fontWeight: 500, flex: 1 }}>
                Was the scorer's reasoning right?
              </div>
              <FeedbackBtn active={feedback === 'agree'}    onClick={() => setFeedback('agree')}    label="Agree"/>
              <FeedbackBtn active={feedback === 'partial'}  onClick={() => setFeedback('partial')}  label="Partly"/>
              <FeedbackBtn active={feedback === 'disagree'} onClick={() => setFeedback('disagree')} label="Disagree"/>
            </div>
            {feedback === 'disagree' && (
              <div style={{ marginTop: -10, marginBottom: 18, padding: '10px 14px', fontSize: 12, color: 'var(--gray-100)', background: 'var(--gray-15)', borderRadius: 8, border: '1px dashed var(--gray-30)' }}>
                Marked for review. This conversation will be added to the eval set on the next calibration pass.
              </div>
            )}

            {/* Conversation transcript */}
            {c.messages && c.messages.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <SectionLabel>Conversation</SectionLabel>
                <div style={{ border: '1px solid var(--gray-30)', borderRadius: 10, padding: '12px 14px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {c.messages.map((m, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 60px', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: m.role === 'ai' ? 'var(--blue-80)' : 'var(--gray-115)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{m.role === 'ai' ? 'Agent' : 'Customer'}</span>
                      <span style={{ fontSize: 13, color: 'var(--gray-130)', lineHeight: 1.55 }}>{m.text}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-85)', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{m.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full criterion table — collapsed by default */}
            {c.criteriaScores && c.criteriaScores.length > 0 && (
              <div>
                <button
                  onClick={() => setShowAllCriteria(!showAllCriteria)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: 0, background: 'none', border: 'none',
                    fontSize: 12, fontWeight: 600, color: 'var(--gray-100)',
                    cursor: 'pointer', letterSpacing: '0.02em', textTransform: 'uppercase',
                  }}>
                  <IChevronDown size={12} style={{ transform: showAllCriteria ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}/>
                  All criterion scores ({(c.criteriaScores || []).length})
                </button>
                {showAllCriteria && (
                  <div style={{ marginTop: 10, border: '1px solid var(--gray-30)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                    {c.criteriaScores.map((s, i) => (
                      <div key={s.name} style={{
                        padding: '11px 14px',
                        borderBottom: i === c.criteriaScores.length - 1 ? 'none' : '1px solid var(--gray-25)',
                        display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center',
                      }}>
                        <div style={{ fontSize: 13, color: 'var(--gray-130)' }}>
                          {s.name}
                          {s.essential && <span className="criterion-row__essential" style={{ marginLeft: 6 }}>Essential</span>}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: s.pass ? 'var(--green-90)' : 'var(--red-90)' }}>
                          {s.pass ? 'Pass' : 'Did not pass'} · {s.score}/100
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 20, fontSize: 12, color: 'var(--gray-90)' }}>
              <a onClick={() => { navigate({ screen: 'monitor', id: c.monitorId }); onClose(); }} style={{ color: 'var(--blue-80)', cursor: 'pointer' }}>View scorer →</a>
            </div>
          </div>
        </Drawer>

        {calOpen && <CalibrationSheet monitor={calOpen} onClose={() => setCalOpen(null)}/>}
      </>
    );
  }

  function FeedbackBtn({ active, onClick, label }) {
    return (
      <button onClick={onClick} style={{
        padding: '5px 11px', borderRadius: 999,
        border: active ? '1px solid var(--blue-80)' : '1px solid var(--gray-30)',
        background: active ? 'var(--blue-10, #eff5ff)' : '#fff',
        color: active ? 'var(--blue-90, #1d4ed8)' : 'var(--gray-115)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer',
      }}>{label}</button>
    );
  }

  // ── Wire the v4 layer into the global namespace ─────────────────────────────
  // GoalCardV2 (in v2.jsx) checks window.K_V4_BADGE; v4.html mounts the
  // CalibrationSheet at the app level and provides the open handler.
  window.K_V4 = {
    getCalibration,
    CalibrationBadge,
    CalibrationSheet,
  };

  // Replace the conversation drawer
  window.ConversationDrawer = ConversationDrawerV4;
})();
