import { useEffect, useMemo, useRef, useState } from 'react';

import { ANOMALY_BY_ID, STUB_ANOMALIES } from '../data/anomalies';
import DetailPane from './DetailPane';
import TuneSensitivityPane from './TuneSensitivityPane';
import InvestigationDrawer from './InvestigationDrawer';

interface Props {
  focusAnomalyId?: string | null;
  onFocusConsumed?: () => void;
}

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type RangeKey = '24h' | '7d' | '30d';
const AnomaliesTab = ({ focusAnomalyId, onFocusConsumed }: Props) => {
  const criteriaAll = useMemo(() => STUB_ANOMALIES.filter((a) => a.cat === 'criteria'), []);
  const [range, setRange] = useState<RangeKey>('7d');
  const [tuningId, setTuningId] = useState<string | null>(null);
  const [investigatingId, setInvestigatingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimerRef = useRef<number | undefined>(undefined);

  // When a focus anomaly arrives from the Monitors tab scroll it into view and briefly highlight it.
  useEffect(() => {
    if (!focusAnomalyId) return;
    const target = ANOMALY_BY_ID[focusAnomalyId];
    if (!target) {
      onFocusConsumed?.();
      return;
    }
    const id = focusAnomalyId;
    const raf = window.requestAnimationFrame(() => {
      const el = document.getElementById(`anom-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightId(id);
        window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = window.setTimeout(() => setHighlightId(null), 1800);
      }
      onFocusConsumed?.();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [focusAnomalyId, onFocusConsumed]);

  useEffect(() => () => window.clearTimeout(highlightTimerRef.current), []);

  const criteria = criteriaAll;

  const investigating = investigatingId ? ANOMALY_BY_ID[investigatingId] : null;

  return (
    <div style={{ fontFamily: FF }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--gray-30)',
          paddingBottom: 18,
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 24,
              fontWeight: 600,
              color: '#161B25',
              letterSpacing: '-0.015em',
            }}
          >
            Anomalies
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--gray-95)',
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Anomalies are AI-detected patterns and trends in the monitors and their criterias.
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            borderRadius: 6,
            border: '1px solid var(--gray-30)',
            overflow: 'hidden',
          }}
        >
          {(['24h', '7d', '30d'] as const).map((r, i) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '6px 10px',
                borderLeft: i ? '1px solid var(--gray-30)' : 'none',
                background: range === r ? 'var(--gray-15)' : '#fff',
                color: range === r ? 'var(--gray-130)' : 'var(--gray-95)',
                cursor: 'pointer',
                border: 'none',
                fontFamily: FF,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Story today — digest card */}
      <div
        style={{
          borderRadius: 10,
          border: '1px solid var(--gray-30)',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(15,18,25,0.06)',
          overflow: 'hidden',
          marginBottom: 22,
          display: 'flex',
        }}
      >
        {/* Left accent bar */}
        <div style={{ width: 4, flexShrink: 0, background: 'var(--yellow-70, #f1c91e)' }} />

        <div style={{ flex: 1, padding: '16px 18px' }}>
          {/* Eyebrow row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--gray-90)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Today's signal
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--gray-90)',
                background: 'var(--gray-15)',
                border: '1px solid var(--gray-30)',
                borderRadius: 4,
                padding: '1px 7px',
              }}
            >
              {range}
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--gray-130)',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              marginBottom: 8,
            }}
          >
            3 criteria across 2 monitors degrading on the same topic for 3 days
          </div>

          {/* Body */}
          <div
            style={{
              fontSize: 13,
              color: 'var(--gray-100)',
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            In the <strong>Refund Procedure Adherence</strong> monitor, <strong>Tone</strong> (wt 30) and{' '}
            <strong>Acknowledged frustration</strong> (wt 25) are both below threshold. In <strong>AICSAT</strong>,{' '}
            <strong>Customer confirmed solved</strong> (wt 20) is also failing. All 3 cluster on the topic{' '}
            <span
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: 'var(--gray-95)',
                background: 'var(--gray-15)',
                border: '1px solid var(--gray-30)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              refund-denial
            </span>{' '}
            — 23 conversations affected over the last 3 days. <strong>Tone</strong> carries the highest weight and is
            the most actionable first step.
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => setInvestigatingId('c1')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 6,
              border: '1px solid #1C6EF2',
              background: '#1C6EF2',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FF,
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            Review 23 conversations
            <span style={{ fontSize: 10 }}>→</span>
          </button>
        </div>
      </div>

      {/* Anomaly list — always-expanded cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {criteria.map((a) => {
          const isTuning = tuningId === a.id;
          const isHighlighted = highlightId === a.id;
          return (
            <div
              key={a.id}
              id={`anom-${a.id}`}
              style={{
                padding: '20px 22px',
                borderRadius: 12,
                border: isHighlighted ? '1px solid var(--blue-80)' : '1px solid var(--gray-30)',
                background: '#fff',
                boxShadow: isHighlighted
                  ? '0 0 0 3px rgba(28,110,242,0.45), 0 6px 18px rgba(28,110,242,0.18)'
                  : '0 1px 2px rgba(15,18,25,0.04)',
                scrollMarginTop: 80,
                transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
              }}
            >
              {isTuning ? (
                <TuneSensitivityPane a={a} onBack={() => setTuningId(null)} />
              ) : (
                <DetailPane a={a} onInvestigate={() => setInvestigatingId(a.id)} onTune={() => setTuningId(a.id)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Hint footer */}
      <div
        style={{
          marginTop: 22,
          padding: '14px 18px',
          borderRadius: 10,
          border: '1px dashed var(--gray-40)',
          background: 'var(--gray-10)',
          fontSize: 13,
          color: 'var(--gray-100)',
          lineHeight: 1.55,
        }}
      >
        Each anomaly opens with its 14-day neighborhood. Use <strong>Investigate</strong> for the conversation cluster,{' '}
        <strong>Tune sensitivity</strong> to adjust the band.
      </div>

      <InvestigationDrawer open={!!investigating} a={investigating} onClose={() => setInvestigatingId(null)} />
    </div>
  );
};

export default AnomaliesTab;
