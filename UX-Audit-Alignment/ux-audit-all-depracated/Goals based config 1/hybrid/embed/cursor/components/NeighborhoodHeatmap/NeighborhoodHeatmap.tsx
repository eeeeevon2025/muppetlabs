import { Fragment } from 'react';

import { Anomaly } from '../../types';
import { ANOMALY_BY_ID, ANOMALY_DAYS, OPS_METRICS, STUB_ANOMALIES } from '../../data/anomalies';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type DirHint = 'good' | 'bad';

interface HeatmapRow {
  section: string;
  label: string;
  sub: string;
  vals: number[];
  focal?: boolean;
  anomId?: string;
  dirHint: DirHint;
}

const heatStyle = (vals: number[], i: number, dirHint: DirHint): { background: string; color: string } => {
  const base = vals.slice(0, 6).reduce((a, b) => a + b, 0) / 6 || 0.5;
  const v = vals[i];
  const ratio = (v - base) / Math.max(Math.abs(base), 0.5);
  const a = Math.abs(ratio);
  let bg = '#FAFBFE';
  let color = 'var(--gray-115)';
  const upIsBad = dirHint !== 'good';
  if (a >= 0.1) {
    if ((ratio > 0 && upIsBad) || (ratio < 0 && !upIsBad)) {
      if (a > 1.5) {
        bg = '#9E181E';
        color = '#fff';
      } else if (a > 0.6) {
        bg = '#E21325';
        color = '#fff';
      } else if (a > 0.3) {
        bg = '#FFAAAD';
        color = '#7A1518';
      } else if (a > 0.15) {
        bg = '#FFD0D2';
        color = '#7A1518';
      } else {
        bg = '#FFE8E9';
        color = '#7A1518';
      }
    } else if (a > 0.3) {
      bg = '#15803D';
      color = '#fff';
    } else if (a > 0.15) {
      bg = '#B7E0C1';
      color = '#0F4C24';
    } else {
      bg = '#E8F6EC';
      color = '#0F4C24';
    }
  }
  return { background: bg, color };
};

interface NeighborhoodHeatmapProps {
  focal: Anomaly;
  onJump?: (a: Anomaly) => void;
  focalOnly?: boolean;
}

const NeighborhoodHeatmap = ({ focal, onJump, focalOnly }: NeighborhoodHeatmapProps) => {
  const rows: HeatmapRow[] = [];
  rows.push({
    section: 'Focal',
    label: focal.metric,
    sub: focal.cat === 'monitor' ? 'monitor headline' : 'criterion',
    vals: focal.hist,
    focal: true,
    dirHint: focal.cat === 'monitor' && focal.dir === 'down' ? 'good' : 'bad',
  });

  if (
    !focalOnly &&
    focal.linkedTo &&
    ANOMALY_BY_ID[focal.linkedTo] &&
    ANOMALY_BY_ID[focal.linkedTo].cat !== 'monitor'
  ) {
    const l = ANOMALY_BY_ID[focal.linkedTo];
    rows.push({
      section: l.cat === 'monitor' ? 'Linked monitor' : 'Linked criteria cluster',
      label: l.metric,
      sub: l.cat === 'monitor' ? 'monitor headline' : 'criterion',
      vals: l.hist,
      anomId: l.id,
      dirHint: l.cat === 'monitor' && l.dir === 'down' ? 'good' : 'bad',
    });
  }

  if (!focalOnly) {
    const siblings = STUB_ANOMALIES.filter(
      (x) => x.cat === 'criteria' && x.monitorKey === focal.monitorKey && x.id !== focal.id && x.id !== focal.linkedTo,
    );
    siblings.forEach((s) => {
      rows.push({
        section: `Sibling criteria \u00b7 ${focal.monitorName}`,
        label: s.metric,
        sub: `criterion \u00b7 weight ${s.weight ?? '?'}%`,
        vals: s.hist,
        anomId: s.id,
        dirHint: 'bad',
      });
    });

    const op = OPS_METRICS[focal.monitorKey] || OPS_METRICS['AI CSAT'];
    const opDir: DirHint = focal.monitorKey === 'Repeat' ? 'good' : focal.monitorKey === 'AI CSAT' ? 'good' : 'bad';
    rows.push({
      section: 'Operational nearby',
      label: op.label,
      sub: op.sub,
      vals: op.vals,
      dirHint: opDir,
    });
  }

  const sections = Array.from(new Set(rows.map((r) => r.section)));
  const colTpl = `260px repeat(${ANOMALY_DAYS.length}, minmax(36px, 1fr))`;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--gray-30)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: colTpl, fontFamily: FF }}>
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--gray-15)',
            borderBottom: '1px solid var(--gray-30)',
            borderRight: '1px solid var(--gray-30)',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--gray-90)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Metric / criterion
        </div>
        {ANOMALY_DAYS.map((d, i) => (
          <div
            key={d}
            style={{
              padding: '8px 0',
              textAlign: 'center',
              background: 'var(--gray-15)',
              borderBottom: '1px solid var(--gray-30)',
              borderRight: i === ANOMALY_DAYS.length - 1 ? 'none' : '1px solid var(--gray-25)',
              fontSize: 10,
              color: i === ANOMALY_DAYS.length - 1 ? 'var(--gray-130)' : 'var(--gray-90)',
              fontWeight: i === ANOMALY_DAYS.length - 1 ? 700 : 500,
              fontFamily: MONO,
            }}
          >
            {d}
          </div>
        ))}

        {sections.map((sec) => (
          <Fragment key={sec}>
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '8px 14px',
                background: 'var(--gray-150)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: FF,
              }}
            >
              {sec}
            </div>
            {rows
              .filter((r) => r.section === sec)
              .map((r, i) => (
                <Fragment key={`${sec}-${i}`}>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: r.focal ? 'var(--yellow-15)' : '#fff',
                      borderBottom: '1px solid var(--gray-25)',
                      borderRight: '1px solid var(--gray-30)',
                    }}
                  >
                    {r.anomId && onJump ? (
                      <button
                        type="button"
                        onClick={() => onJump(ANOMALY_BY_ID[r.anomId as string])}
                        style={{
                          background: 'none',
                          border: 0,
                          padding: 0,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: FF,
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--blue-90)',
                          letterSpacing: '-0.005em',
                          textDecoration: 'underline',
                          textDecorationColor: 'var(--blue-25)',
                          textUnderlineOffset: 3,
                        }}
                      >
                        {r.label} \u2192
                      </button>
                    ) : (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--gray-130)',
                          letterSpacing: '-0.005em',
                        }}
                      >
                        {r.label}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: 'var(--gray-85)',
                        marginTop: 2,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {r.sub}
                    </div>
                  </div>
                  {r.vals.map((v, j) => {
                    const st = heatStyle(r.vals, j, r.dirHint);
                    return (
                      <div
                        key={j}
                        style={{
                          ...st,
                          padding: '10px 0',
                          textAlign: 'center',
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: MONO,
                          borderBottom: '1px solid var(--gray-25)',
                          borderRight: j === r.vals.length - 1 ? 'none' : '1px solid var(--gray-25)',
                        }}
                      >
                        {typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(1)) : v}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default NeighborhoodHeatmap;
