import React, { useState } from 'react';
import { type Anomaly } from '../types';
import { ANOMALY_BY_ID } from '../data/anomalies';
import NeighborhoodHeatmap from '../components/NeighborhoodHeatmap/NeighborhoodHeatmap';
import ButtonText from 'komponentsV2/buttons/ButtonText';
import PopoverMenu from 'komponentsV2/popovers/PopoverMenu';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

export const sevTokens = (sev: Anomaly['sev']) => {
  if (sev === 'high') return { label: 'High', color: '#9E181E', bg: '#FFE8E9', border: '#FFAAAD' };
  if (sev === 'med') return { label: 'Medium', color: '#826F1C', bg: '#FFFDE5', border: '#FCED92' };
  if (sev === 'drift') return { label: 'Drift', color: '#5F6675', bg: '#F2F3F7', border: '#DCE0E9' };
  if (sev === 'pos') return { label: 'Positive', color: '#15803D', bg: '#E8F6EC', border: '#B7E0C1' };
  return { label: '\u2014', color: '#697182', bg: '#F2F3F7', border: '#DCE0E9' };
};

export const fmt = (v: number, unit: string) => {
  const n = Number.isInteger(v) ? v : v.toFixed(1);
  return unit ? `${n}${unit}` : `${n}`;
};

interface DetailPaneProps {
  a: Anomaly;
  onInvestigate: () => void;
  onTune: () => void;
  monitorCriteriaCount?: number;
}

const SNOOZE_DURATIONS = ['1 hour', '4 hours', '24 hours', '7 days', 'Until resolved'];

const DetailPane = ({ a, onInvestigate, onTune, monitorCriteriaCount }: DetailPaneProps) => {
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const sev = sevTokens(a.sev);
  const linked = a.linkedTo ? ANOMALY_BY_ID[a.linkedTo] : null;
  const crIndex = ({ c1: 0, c2: 1, c3: 0, c4: 2 } as Record<string, number>)[a.id] ?? 0;
  const crTotal = monitorCriteriaCount || 4;

  const stats: {
    lab: string;
    val: string;
    sub: string;
    highlight?: boolean;
    small?: boolean;
    onClick?: () => void;
  }[] = [
    { lab: 'Baseline', val: fmt(a.base, a.unit), sub: 'recent average' },
    {
      lab: 'Now',
      val: fmt(a.now, a.unit),
      sub: `${a.dir === 'up' ? '\u2191' : '\u2193'} outside \u00b1${fmt(a.variance, a.unit)} band`,
      highlight: true,
      onClick: a.investigateCount > 0 ? onInvestigate : undefined,
    },
    { lab: 'Threatens', val: a.goalLabel, sub: a.threatens, small: true },
  ];

  return (
    <div style={{ fontFamily: FF }}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--gray-30)',
          paddingBottom: 18,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginBottom: 10,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>
            {a.metric}{' '}
            <span
              style={{
                color: 'var(--gray-90)',
                fontWeight: 500,
                fontFamily: MONO,
              }}
            >
              ({crIndex + 1} of {crTotal})
            </span>
          </span>
          <span style={{ width: 1, height: 12, background: 'var(--gray-30)' }} />
          <a
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--blue-80)',
              textDecoration: 'none',
              borderBottom: '1px dotted var(--blue-25)',
            }}
          >
            {a.monitorName}
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <h2
            style={{
              margin: 0,
              flex: 1,
              fontSize: 22,
              fontWeight: 600,
              color: 'var(--gray-130)',
              letterSpacing: '-0.015em',
              lineHeight: 1.3,
            }}
          >
            {a.head}
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <PopoverMenu
              target={
                <ButtonText size="small" icon="alarm" onClick={() => setSnoozeOpen((o) => !o)}>
                  Snooze
                </ButtonText>
              }
              options={SNOOZE_DURATIONS.map((label) => ({
                label,
                onClick: () => setSnoozeOpen(false),
              }))}
              showPopover={snoozeOpen}
              onClose={() => setSnoozeOpen(false)}
              attachment="bottom right"
              targetAttachment="top right"
            />
            <ButtonText size="small" icon="sliders" onClick={onTune}>
              Tune sensitivity
            </ButtonText>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
          border: '1px solid var(--gray-30)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ background: 'var(--gray-30)', margin: '10px 0' }} />}
            <div style={{ padding: '10px 14px' }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--gray-90)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                }}
              >
                {s.lab}
              </div>
              <div
                onClick={s.onClick}
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: s.highlight ? sev.color : 'var(--gray-130)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  cursor: s.onClick ? 'pointer' : undefined,
                  textDecoration: s.onClick ? 'underline' : undefined,
                  textUnderlineOffset: s.onClick ? 3 : undefined,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--gray-90)',
                  marginTop: 3,
                  lineHeight: 1.4,
                }}
              >
                {s.sub}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Linked criteria callout */}
      {linked && linked.cat !== 'monitor' && (
        <div
          style={{
            padding: '16px 18px',
            borderRadius: 10,
            border: '1px solid var(--yellow-50)',
            background: 'var(--yellow-15)',
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--yellow-100)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            \u2194 Linked criteria cluster
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--gray-130)',
            }}
          >
            {linked.metric}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--gray-100)',
              marginTop: 6,
              lineHeight: 1.55,
            }}
          >
            {linked.head}
          </div>
        </div>
      )}

      {/* Heatmap */}
      <NeighborhoodHeatmap focal={a} focalOnly />

      {/* Footer */}
      {a.investigateCount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '14px 0 0',
            marginTop: 14,
            borderTop: '1px solid var(--gray-30)',
          }}
        >
          <button
            type="button"
            onClick={onInvestigate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              border: '1px solid #1C6EF2',
              borderRadius: 6,
              background: '#1C6EF2',
              font: '600 13px/18px Inter,sans-serif',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Review all affected conversations
            <span style={{ fontSize: 10 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailPane;
