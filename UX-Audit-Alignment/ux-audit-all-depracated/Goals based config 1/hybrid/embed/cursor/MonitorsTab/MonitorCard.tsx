import { useEffect, useMemo, useRef, useState } from 'react';

import { type Monitor, type Goal, type Anomaly, type MonitorCriterion, type CriterionRubric } from '../types';
import { buildReviewQueue } from '../data/reviewQueue';
import ReviewPanel from '../components/ReviewPanel/ReviewPanel';
import { type RubricRef, seedRefsForCriterion } from '../data/rubricRefs';
import RubricRefEditor from '../components/RubricRefEditor';
import ButtonPrimary from 'komponentsV2/buttons/ButtonPrimary';
import ButtonText from 'komponentsV2/buttons/ButtonText';
import Icon from 'komponentsV2/icons/Icon';
import Pill from 'komponentsV2/pills/Pill';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const C = {
  border: '#dce0e9',
  red: '#dc2626',
  redBg: '#fef2f2',
  redBor: '#fecaca',
};

interface EditableCriterion extends MonitorCriterion {
  refs: RubricRef[];
}

const SEV_LABEL: Record<string, string> = {
  high: 'High',
  med: 'Medium',
  drift: 'Drift',
  pos: 'Positive',
};

interface Props {
  monitor: Monitor;
  goal: Goal | undefined;
  goals?: Goal[];
  hideLinkedGoal?: boolean;
  recommendedAnomaly?: Anomaly;
  anomalyByCriterion?: Record<string, Anomaly>;
  onViewAnomaly?: (anomalyId: string) => void;
}

const MonitorCard = ({
  monitor,
  goal,
  goals,
  hideLinkedGoal,
  recommendedAnomaly,
  anomalyByCriterion,
  onViewAnomaly,
}: Props) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [rubricModalCriterionIdx, setRubricModalCriterionIdx] = useState<number | null>(null);
  const [rubricModalReadOnly, setRubricModalReadOnly] = useState(false);
  const [name, setName] = useState(monitor.name);
  const [description, setDescription] = useState(monitor.description ?? '');
  const [passingScore, setPassingScore] = useState<number | ''>(monitor.passingScore ?? '');
  const [criteria, setCriteria] = useState<EditableCriterion[]>(() =>
    monitor.criteria.map((c) => {
      const seeded = seedRefsForCriterion(c);
      const rubricRef: RubricRef[] = c.inlineRubric ? [{ type: 'rubric' as const, slug: c.inlineRubric.name }] : [];
      return { ...c, refs: [...rubricRef, ...seeded] };
    }),
  );
  const [goalId, setGoalId] = useState<string>(monitor.goalIds?.[0] || '');
  const [kind, setKind] = useState<Monitor['kind']>(monitor.kind);
  const [toast, setToast] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  const totalWeight = criteria.reduce((s, c) => s + (c.weight || 0), 0);

  const reviewQueue = useMemo(() => buildReviewQueue(monitor.id), [monitor.id]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (editing) setCriteriaOpen(true);
  }, [editing]);

  const flash = () => {
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 1800);
  };

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d'>('7d');
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [criteriaOpen, setCriteriaOpen] = useState(false);

  const hasAnomaly = !!recommendedAnomaly;
  const dotColor = hasAnomaly ? C.red : '#1C6EF2';

  // Compute the displayed trend slice
  const trendSlice = (() => {
    const t = monitor.trend;
    if (timeFilter === '7d') return t.slice(-7);
    return t;
  })();

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: FF,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '14px 20px 12px',
          borderBottom: `1px solid ${C.border}`,
          gap: 10,
        }}
      >
        {/* Title row — dot + name input/label + pill, always on one line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
            }}
          />
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={flash}
              style={{
                font: '700 16px/22px Inter,sans-serif',
                color: '#1A1D23',
                border: '1px solid #DCE0E9',
                borderRadius: 6,
                padding: '2px 8px',
                background: '#fff',
                outline: 'none',
                minWidth: 0,
                flex: 1,
                fontFamily: FF,
              }}
            />
          ) : (
            <span
              style={{
                font: '700 16px/22px Inter,sans-serif',
                color: '#1A1D23',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
          )}
          <Pill
            type={monitor.isDefault ? 'inactive' : 'info'}
            message={monitor.isDefault ? 'Default' : 'Custom'}
            removeIcon
          />
        </div>
        {/* Edit / Done button — always top-right, never wraps */}
        <button
          type="button"
          onClick={() => {
            if (editing) flash();
            setEditing((v) => !v);
          }}
          style={{
            font: '600 12px/16px Inter,sans-serif',
            color: editing ? '#fff' : '#1C6EF2',
            background: editing ? '#1C6EF2' : '#EFF6FF',
            border: editing ? '1px solid #1C6EF2' : '1px solid #BFDBFE',
            borderRadius: 6,
            padding: '5px 12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            flexShrink: 0,
            fontFamily: FF,
            alignSelf: 'flex-start',
          }}
        >
          {editing ? (
            <>
              <Icon type="check" size="xSmall" />
              Done
            </>
          ) : (
            <>
              <Icon type="pen" size="xSmall" />
              Edit
            </>
          )}
        </button>
      </div>
      {/* Sub-header content (description, who-to-monitor, linked goal) */}
      <div
        style={{
          padding: '0 20px 12px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* Description */}
        {editing ? (
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              flash();
            }}
            rows={2}
            placeholder="Describe what this monitor measures…"
            style={{
              display: 'block',
              width: '100%',
              marginTop: 8,
              padding: '6px 10px',
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              font: '400 12px/18px Inter,sans-serif',
              fontFamily: FF,
              color: '#1A1D23',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              background: '#fff',
            }}
          />
        ) : description ? (
          <div
            style={{
              font: '400 12px/18px Inter,sans-serif',
              color: '#5A6478',
              marginTop: 4,
              paddingLeft: 18,
            }}
          >
            {description}
          </div>
        ) : null}

        {editing && (
          <div style={{ display: 'flex', gap: 16, paddingLeft: 18, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', alignSelf: 'center' }}>Who to monitor</span>
            {(
              [
                { value: 'aic', label: 'AI Agents' },
                { value: 'air', label: 'Agents' },
                { value: 'both', label: 'Both' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1A1D23',
                  cursor: 'pointer',
                  fontFamily: FF,
                }}
              >
                <input
                  type="radio"
                  name={`monitor-kind-${monitor.id}`}
                  value={opt.value}
                  checked={kind === opt.value}
                  onChange={() => {
                    setKind(opt.value);
                    flash();
                  }}
                  style={{ accentColor: '#1C6EF2' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}

        {!hideLinkedGoal && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 18,
            }}
          >
            <span
              style={{
                font: '400 11px/16px Inter,sans-serif',
                color: '#8A94A6',
                flexShrink: 0,
              }}
            >
              Linked goal:
            </span>
            {editing && goals ? (
              <select
                value={goalId}
                onChange={(e) => {
                  setGoalId(e.target.value);
                  flash();
                }}
                style={{
                  font: '600 12px/16px Inter,sans-serif',
                  color: goalId ? '#1C6EF2' : '#8A94A6',
                  background: '#fff',
                  border: '1px solid #DCE0E9',
                  borderRadius: 4,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: FF,
                  maxWidth: 340,
                }}
              >
                <option value="">— No goal linked —</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            ) : goal ? (
              <a
                style={{
                  font: '600 12px/16px Inter,sans-serif',
                  color: '#1C6EF2',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {goal.name}
              </a>
            ) : (
              <span style={{ font: '400 12px/16px Inter,sans-serif', color: '#8A94A6' }}>No goal linked</span>
            )}
          </div>
        )}
      </div>

      {/* Recommended anomaly banner — shown when an anomaly exists and not editing */}
      {!editing && hasAnomaly && recommendedAnomaly && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 20px',
            background: '#FFF7E6',
            borderBottom: `1px solid #FCE0B0`,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              marginTop: 1,
              width: 20,
              height: 20,
              borderRadius: 999,
              background: '#F1C91E',
              color: '#584E1C',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                font: '600 10px/14px Inter,sans-serif',
                color: '#6C5E1C',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 4,
              }}
            >
              Needs attention
            </div>
            <div
              style={{
                font: '400 13px/18px Inter,sans-serif',
                color: '#1A1D23',
              }}
            >
              <strong>{recommendedAnomaly.metric}</strong>
              <span
                style={{
                  display: 'inline-block',
                  font: '600 10px/14px Inter,sans-serif',
                  color:
                    recommendedAnomaly.sev === 'high'
                      ? '#9E181E'
                      : recommendedAnomaly.sev === 'med'
                        ? '#9B5A00'
                        : recommendedAnomaly.sev === 'drift'
                          ? '#5F6675'
                          : '#22A05B',
                  background:
                    recommendedAnomaly.sev === 'high'
                      ? '#FFE8E9'
                      : recommendedAnomaly.sev === 'med'
                        ? '#FFF4E0'
                        : recommendedAnomaly.sev === 'drift'
                          ? '#F2F3F7'
                          : '#E6F4EC',
                  border:
                    recommendedAnomaly.sev === 'high'
                      ? '1px solid #FFAAAD'
                      : recommendedAnomaly.sev === 'med'
                        ? '1px solid #FCE0B0'
                        : recommendedAnomaly.sev === 'drift'
                          ? '1px solid #DCE0E9'
                          : '1px solid #B7E0C1',
                  borderRadius: 4,
                  padding: '1px 6px',
                  marginLeft: 8,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  verticalAlign: '2px',
                }}
              >
                {SEV_LABEL[recommendedAnomaly.sev] || recommendedAnomaly.sev}
              </span>
              <div
                style={{
                  font: '400 12px/18px Inter,sans-serif',
                  color: '#5A6478',
                  marginTop: 2,
                }}
              >
                {recommendedAnomaly.head}
              </div>
            </div>
          </div>
          <ButtonPrimary
            onClick={() => onViewAnomaly?.(recommendedAnomaly.id)}
            disabled={!onViewAnomaly}
            icon="arrow-right"
            size="small"
          >
            View anomaly
          </ButtonPrimary>
        </div>
      )}

      {/* Trend graph */}
      {!editing &&
        (() => {
          const pts = trendSlice;
          const W = 400;
          const H = 64;
          const PY = 6;
          const PX = 8;

          // Fixed y-axis floor per metric kind — prevents flatline on tight ranges
          const Y_FLOOR: Record<string, number> = {
            csat_avg: 2.5,
            qa_score: 50,
          };
          const yMin = Y_FLOOR[monitor.metricKind] ?? 0;
          const yMax = Math.max(...pts) + (monitor.metricKind === 'csat_avg' ? 0.1 : 2);
          const range = yMax - yMin || 1;
          const toY = (v: number) => H - PY - ((v - yMin) / range) * (H - PY * 2);
          const slotW = (W - PX * 2) / pts.length;
          const barW = slotW * 0.65;

          const currentVal = pts[pts.length - 1];
          const firstVal = pts[0];
          const trending = currentVal < firstVal ? 'down' : currentVal > firstVal ? 'up' : 'flat';
          const trendColor = trending === 'down' ? C.red : trending === 'up' ? '#22A05B' : '#8A94A6';

          // QA-score monitors show the slice average; others show the most recent value.
          const eyebrowVal =
            monitor.metricKind === 'qa_score'
              ? parseFloat((pts.reduce((a, b) => a + b, 0) / pts.length).toFixed(1))
              : currentVal;

          return (
            <div
              style={{
                padding: '12px 20px 0',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {/* Eyebrow row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ font: '700 18px/22px Inter,sans-serif', color: trendColor }}>
                    {eyebrowVal}
                    {monitor.metricUnit}
                  </span>
                  <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6' }}>
                    {monitor.metricLabel}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${C.border}`,
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  {(['7d', '30d'] as const).map((f, i) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setTimeFilter(f)}
                      style={{
                        padding: '3px 8px',
                        border: 'none',
                        borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
                        background: timeFilter === f ? '#1C6EF2' : '#fff',
                        color: timeFilter === f ? '#fff' : '#5A6478',
                        font: '600 10px/14px Inter,sans-serif',
                        fontFamily: FF,
                        cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG bar chart */}
              <div style={{ position: 'relative' }}>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  style={{ width: '100%', height: H, display: 'block', marginBottom: 4 }}
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoveredBarIdx(null)}
                >
                  {/* Baseline floor */}
                  <line x1={PX} y1={H - PY} x2={W - PX} y2={H - PY} stroke="#F0F2F6" strokeWidth={1} />
                  {/* Bars */}
                  {pts.map((v, i) => {
                    const isLast = i === pts.length - 1;
                    const isHovered = hoveredBarIdx === i;
                    const x = PX + i * slotW + (slotW - barW) / 2;
                    const barH = Math.max(1, toY(yMin) - toY(v));
                    const y = toY(v);
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx={2}
                        fill={trendColor}
                        opacity={isHovered ? 1 : isLast ? 0.85 : 0.35}
                        style={{ cursor: 'default' }}
                        onMouseEnter={() => setHoveredBarIdx(i)}
                      />
                    );
                  })}
                </svg>
                {/* Hover tooltip */}
                {hoveredBarIdx !== null &&
                  (() => {
                    const v = pts[hoveredBarIdx];
                    const pct = ((PX + hoveredBarIdx * slotW + slotW / 2) / W) * 100;
                    return (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: `${pct}%`,
                          transform: 'translateX(-50%)',
                          background: '#1A1D23',
                          color: '#fff',
                          font: '600 11px/14px Inter,sans-serif',
                          fontFamily: FF,
                          padding: '3px 7px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      >
                        {v}
                        {monitor.metricUnit}
                      </div>
                    );
                  })()}
              </div>
            </div>
          );
        })()}

      {/* Scoring criteria accordion */}
      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          background: '#FAFBFC',
        }}
      >
        {/* Accordion header — always visible */}
        <button
          type="button"
          onClick={() => setCriteriaOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: FF,
          }}
        >
          <span style={{ font: '600 13px/18px Inter,sans-serif', color: '#1A1D23', flex: 1 }}>Monitor Criteria</span>
          {!criteriaOpen &&
            (() => {
              const matchCount = anomalyByCriterion ? criteria.filter((c) => anomalyByCriterion[c.name]).length : 0;
              return matchCount > 0 ? (
                <span
                  style={{
                    font: '600 10px/14px Inter,sans-serif',
                    color: '#9E181E',
                    background: '#FFE8E9',
                    border: '1px solid #FFAAAD',
                    borderRadius: 10,
                    padding: '1px 7px',
                    flexShrink: 0,
                  }}
                >
                  {matchCount} anomal{matchCount === 1 ? 'y' : 'ies'}
                </span>
              ) : null;
            })()}
          {editing && (
            <Pill
              type={totalWeight === 100 ? 'success' : 'danger'}
              message={totalWeight === 100 ? '✓ Total weight: 100%' : `⚠ ${totalWeight}% — must equal 100%`}
              removeIcon
            />
          )}
          <span
            style={{
              font: '400 14px/1 Inter,sans-serif',
              color: '#8A94A6',
              flexShrink: 0,
              transform: criteriaOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s',
              display: 'inline-block',
            }}
          >
            ▾
          </span>
        </button>

        {/* Accordion body */}
        {criteriaOpen && (
          <div style={{ padding: '0 20px 14px' }}>
            <div
              style={{
                font: '400 11px/16px Inter,sans-serif',
                color: '#5A6478',
                marginBottom: 12,
              }}
            >
              Choose what the AI should evaluate in conversations. Each item contributes to the final score. Total
              weight must equal 100%.
            </div>

            {/* Passing score — edit mode only */}
            {editing && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  background: '#F4F5F7',
                  borderRadius: 7,
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    font: '600 11px/14px Inter,sans-serif',
                    color: '#5A6478',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Passing score (out of 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={passingScore}
                  onChange={(e) => {
                    const v = e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value)));
                    setPassingScore(v);
                    flash();
                  }}
                  style={{
                    width: 64,
                    padding: '4px 8px',
                    border: `1px solid ${C.border}`,
                    borderRadius: 5,
                    font: '400 12px/18px Inter,sans-serif',
                    fontFamily: FF,
                    color: '#1A1D23',
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <span
                  style={{
                    font: '400 11px/15px Inter,sans-serif',
                    color: '#8A94A6',
                  }}
                >
                  Conversations at or above this score count as passing.
                </span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {criteria.map((c, idx) =>
                editing ? (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      background: '#fff',
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        value={c.name || ''}
                        onChange={(e) =>
                          setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                        }
                        onBlur={flash}
                        placeholder="Criterion name"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '5px 8px',
                          borderRadius: 5,
                          border: '1px solid #DCE0E9',
                          font: '600 12px/16px Inter,sans-serif',
                          fontFamily: FF,
                          color: '#1A1D23',
                          outline: 'none',
                          background: '#fff',
                        }}
                      />
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          background: '#fff',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={c.weight ?? 0}
                          onChange={(e) => {
                            const v = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                            setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, weight: v } : x)));
                          }}
                          onBlur={(e) => {
                            const v = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
                            setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, weight: v } : x)));
                            flash();
                          }}
                          title="Weight"
                          style={{
                            width: 42,
                            padding: '4px 6px',
                            border: 'none',
                            outline: 'none',
                            font: '600 12px/16px Inter,sans-serif',
                            color: '#1A1D23',
                            textAlign: 'right',
                            background: 'transparent',
                            fontFamily: FF,
                          }}
                        />
                        <span
                          style={{
                            font: '400 11px/16px Inter,sans-serif',
                            color: '#8A94A6',
                            paddingRight: 6,
                          }}
                        >
                          %
                        </span>
                      </div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          font: '500 11px/14px Inter,sans-serif',
                          color: '#5A6478',
                          cursor: 'pointer',
                          paddingLeft: 8,
                          borderLeft: `1px solid ${C.border}`,
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!c.essential}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, essential: checked } : x)));
                            flash();
                          }}
                          style={{ accentColor: '#1C6EF2' }}
                        />
                        Must pass
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCriteria((prev) => prev.filter((_, i) => i !== idx));
                          flash();
                        }}
                        title="Remove criterion"
                        style={{
                          background: 'none',
                          border: '1px solid #DCE0E9',
                          borderRadius: 5,
                          padding: '2px 7px',
                          height: 24,
                          cursor: 'pointer',
                          color: '#8A94A6',
                          fontSize: 14,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <RubricRefEditor
                      refs={c.refs}
                      onChange={(next) => {
                        setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, refs: next } : x)));
                        flash();
                      }}
                      onWriteRubric={() => {
                        setRubricModalCriterionIdx(idx);
                        setRubricModalReadOnly(false);
                      }}
                      onClickRubricRef={() => {
                        setRubricModalCriterionIdx(idx);
                        setRubricModalReadOnly(true);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      background: '#fff',
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          font: '600 12px/16px Inter,sans-serif',
                          color: '#1A1D23',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.name || 'Untitled criterion'}
                      </span>
                      {c.essential && <Pill type="alert" message="Must pass" removeIcon />}
                      {anomalyByCriterion?.[c.name] && (
                        <button
                          type="button"
                          title="Open anomaly detail"
                          onClick={(e) => {
                            e.stopPropagation();
                            const a = anomalyByCriterion[c.name];
                            onViewAnomaly?.(a.id);
                          }}
                          disabled={!onViewAnomaly}
                          style={{
                            font: '600 10px/14px Inter,sans-serif',
                            color: '#9E181E',
                            background: '#FFE8E9',
                            border: '1px solid #FFAAAD',
                            borderRadius: 4,
                            padding: '1px 7px 1px 6px',
                            flexShrink: 0,
                            cursor: onViewAnomaly ? 'pointer' : 'default',
                            letterSpacing: '0.03em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontFamily: FF,
                          }}
                        >
                          Anomaly{' '}
                          <span aria-hidden="true" style={{ fontSize: 9 }}>
                            →
                          </span>
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                      <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6' }}>
                        Weight {c.weight || 0}%
                      </span>
                      <span
                        style={{
                          font: '600 12px/14px Inter,sans-serif',
                          color: c.pass >= 80 ? '#22A05B' : c.pass >= 65 ? '#D4A017' : C.red,
                          minWidth: 54,
                          textAlign: 'right',
                        }}
                      >
                        {c.pass != null ? `${c.pass}% pass` : '—'}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setCriteria((prev) => [
                    ...prev,
                    { name: '', weight: 0, essential: false, pass: 0, source: '', refs: [] },
                  ]);
                  flash();
                }}
                style={{
                  marginTop: 8,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px dashed ${C.border}`,
                  background: '#fff',
                  cursor: 'pointer',
                  font: '500 12px/16px Inter,sans-serif',
                  color: '#5A6478',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: FF,
                }}
              >
                + Add evaluation item
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit log collapsible content */}
      {monitor.editLog && monitor.editLog.length > 0 && showLog && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '10px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {monitor.editLog.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                <span style={{ color: '#8A94A6', flexShrink: 0, minWidth: 48 }}>{e.date}</span>
                <span style={{ color: '#5A6478', flexShrink: 0 }}>{e.who}</span>
                <span style={{ color: '#1A1D23' }}>{e.change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer — hidden while editing */}
      {!editing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {monitor.editLog && monitor.editLog.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowLog((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: '500 12px/16px Inter,sans-serif',
                color: '#5A6478',
                fontFamily: FF,
              }}
            >
              {showLog ? 'Hide edit log' : 'Edit log'} {'\u00b7'} {monitor.editLog.length}{' '}
              {monitor.editLog.length === 1 ? 'entry' : 'entries'}
            </button>
          ) : (
            <span />
          )}
          <ButtonText size="small" onClick={() => setReviewOpen(true)} icon="arrow-right">
            Review conversations
          </ButtonText>
        </div>
      )}

      <ReviewPanel open={reviewOpen} monitor={monitor} queue={reviewQueue} onClose={() => setReviewOpen(false)} />

      {rubricModalCriterionIdx !== null &&
        (() => {
          const rc = criteria[rubricModalCriterionIdx];
          const closeModal = () => {
            setRubricModalCriterionIdx(null);
            setRubricModalReadOnly(false);
          };
          return (
            <CustomRubricModal
              criterionName={rc?.name ?? ''}
              initialRubric={rc?.inlineRubric}
              initialBands={seedBandsFromCriterion(rc)}
              readOnly={rubricModalReadOnly}
              onClose={closeModal}
              onSave={(slug) => {
                setCriteria((prev) =>
                  prev.map((c, i) =>
                    i === rubricModalCriterionIdx ? { ...c, refs: [...c.refs, { type: 'rubric' as const, slug }] } : c,
                  ),
                );
                closeModal();
                flash();
              }}
            />
          );
        })()}

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1A1D23',
            color: '#fff',
            font: '600 13px/20px Inter,sans-serif',
            padding: '10px 18px',
            borderRadius: 8,
            zIndex: 100,
            whiteSpace: 'nowrap',
            boxShadow: '0 6px 20px rgba(15,18,25,0.22)',
          }}
        >
          ✓ Changes saved
        </div>
      )}
    </div>
  );
};

interface Band {
  lo: number;
  hi: number;
  text: string;
  passing: boolean;
}

/** Generate 4 bands pre-seeded from a criterion's baseline + criterionThreshold values. */
const seedBandsFromCriterion = (c: MonitorCriterion | undefined): Band[] | null => {
  if (!c || c.baseline == null || c.criterionThreshold == null) return null;
  const t = c.criterionThreshold;
  const b = c.baseline;
  const scale = b <= 5 ? 1.0 : 0; // /5 scale floor
  return [
    { lo: scale, hi: Math.round((t - 0.6) * 10) / 10, passing: false, text: '' },
    { lo: Math.round((t - 0.5) * 10) / 10, hi: Math.round((t - 0.1) * 10) / 10, passing: false, text: '' },
    { lo: t, hi: b, passing: true, text: '' },
    { lo: Math.round((b + 0.1) * 10) / 10, hi: b <= 5 ? 5.0 : 100, passing: true, text: '' },
  ];
};

interface CustomRubricModalProps {
  criterionName: string;
  initialRubric?: CriterionRubric;
  initialBands?: Band[] | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (rubricSlug: string) => void;
}

const BAND_PLACEHOLDERS = [
  'Describe what makes a conversation land in this range. What is clearly missing or wrong?',
  'Describe what a conversation in this range looks like. Some things are right but key elements are absent.',
  'Describe a mostly passing conversation in this range. What holds it back from full marks?',
  'Describe what a high-scoring conversation looks like. What does it get right?',
];

const DEFAULT_BANDS: Band[] = [
  { lo: 0, hi: 25, text: '', passing: false },
  { lo: 26, hi: 50, text: '', passing: false },
  { lo: 51, hi: 75, text: '', passing: false },
  { lo: 76, hi: 100, text: '', passing: true },
];

const bandColor = (passing: boolean, rank: 'low' | 'mid' | 'high') => {
  if (passing) return { color: '#22A05B', bg: '#F0FDF4', border: '#BBF7D0' };
  if (rank === 'low') return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
  if (rank === 'mid') return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
  return { color: '#5A6478', bg: '#F4F5F7', border: '#DCE0E9' };
};

const bandRank = (i: number, total: number): 'low' | 'mid' | 'high' => {
  if (i < total / 3) return 'low';
  if (i < (2 * total) / 3) return 'mid';
  return 'high';
};

const CustomRubricModal = ({
  criterionName,
  initialRubric,
  initialBands,
  readOnly = false,
  onClose,
  onSave,
}: CustomRubricModalProps) => {
  const [name, setName] = useState(initialRubric?.name ?? criterionName);
  const [bands, setBands] = useState<Band[]>(() => {
    if (initialRubric?.bands?.length) return initialRubric.bands as Band[];
    if (initialBands?.length) return initialBands;
    return DEFAULT_BANDS;
  });
  // readOnly starts locked; Edit button unlocks in-place without closing
  const [isEditing, setIsEditing] = useState(!readOnly);

  const updateBand = (i: number, patch: Partial<Band>) =>
    setBands((prev) => prev.map((b, j) => (j === i ? { ...b, ...patch } : b)));

  const addBand = () => {
    setBands((prev) => {
      const last = prev[prev.length - 1];
      const newLo = Math.min(last.hi + 1, 100);
      return [...prev, { lo: newLo, hi: 100, text: '', passing: false }];
    });
  };

  const removeBand = (i: number) => setBands((prev) => prev.filter((_, j) => j !== i));

  const passingCount = bands.filter((b) => b.passing).length;

  const handleSave = () => {
    const slug = `custom-${
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 32) || 'rubric'
    }`;
    onSave(slug);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15,18,25,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 16px 48px rgba(15,18,25,0.22)',
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: FF,
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <span style={{ font: '700 15px/20px Inter,sans-serif', color: '#1A1D23' }}>
            {isEditing ? 'Edit rubric' : name || 'Custom rubric'}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              font: '400 18px/1 Inter,sans-serif',
              color: '#8A94A6',
              padding: '2px 6px',
            }}
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Criterion name */}
          <div>
            <label
              style={{
                display: 'block',
                font: '600 11px/16px Inter,sans-serif',
                color: '#5A6478',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Criterion
            </label>
            {isEditing ? (
              <textarea
                value={name}
                onChange={(e) => setName(e.target.value)}
                rows={2}
                placeholder="Describe the criterion being evaluated…"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  font: '500 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#1A1D23',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <p style={{ margin: 0, font: '500 13px/18px Inter,sans-serif', color: '#1A1D23' }}>{name}</p>
            )}
          </div>

          {/* Score band descriptions */}
          <div>
            <label
              style={{
                display: 'block',
                font: '600 11px/16px Inter,sans-serif',
                color: '#5A6478',
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Score bands
            </label>
            {isEditing && (
              <p style={{ margin: '0 0 14px', font: '400 12px/16px Inter,sans-serif', color: '#8A94A6' }}>
                Explain why a conversation would score in each range. Check the bands that count as passing.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bands.map((band, i) => {
                const { color, bg, border } = bandColor(band.passing, bandRank(i, bands.length));
                const placeholder = BAND_PLACEHOLDERS[Math.min(i, BAND_PLACEHOLDERS.length - 1)];
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {/* Left: range + passing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, paddingTop: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {isEditing ? (
                          <>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={band.lo}
                              onChange={(e) =>
                                updateBand(i, { lo: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
                              }
                              style={{
                                width: 46,
                                padding: '4px 6px',
                                border: `1px solid ${border}`,
                                borderRadius: 4,
                                font: '700 11px/14px Inter,sans-serif',
                                fontFamily: FF,
                                color,
                                background: bg,
                                outline: 'none',
                                textAlign: 'center',
                              }}
                            />
                            <span style={{ font: '700 11px/14px Inter,sans-serif', color: '#8A94A6' }}>–</span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={band.hi}
                              onChange={(e) =>
                                updateBand(i, { hi: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
                              }
                              style={{
                                width: 46,
                                padding: '4px 6px',
                                border: `1px solid ${border}`,
                                borderRadius: 4,
                                font: '700 11px/14px Inter,sans-serif',
                                fontFamily: FF,
                                color,
                                background: bg,
                                outline: 'none',
                                textAlign: 'center',
                              }}
                            />
                          </>
                        ) : (
                          <span
                            style={{
                              font: '700 11px/14px Inter,sans-serif',
                              color,
                              background: bg,
                              border: `1px solid ${border}`,
                              borderRadius: 4,
                              padding: '3px 8px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {band.lo} – {band.hi}
                          </span>
                        )}
                      </div>
                      {isEditing ? (
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer',
                            font: '600 11px/14px Inter,sans-serif',
                            fontFamily: FF,
                            color: band.passing ? '#22A05B' : '#8A94A6',
                            userSelect: 'none',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={band.passing}
                            onChange={(e) => updateBand(i, { passing: e.target.checked })}
                            style={{ accentColor: '#22A05B', width: 13, height: 13 }}
                          />
                          Passing
                        </label>
                      ) : (
                        <span
                          style={{
                            font: '600 10px/14px Inter,sans-serif',
                            color: band.passing ? '#22A05B' : '#8A94A6',
                          }}
                        >
                          {band.passing ? '✓ Passing' : '✗ Failing'}
                        </span>
                      )}
                    </div>

                    {/* Band text */}
                    {isEditing ? (
                      <textarea
                        value={band.text}
                        onChange={(e) => updateBand(i, { text: e.target.value })}
                        rows={3}
                        placeholder={placeholder}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          font: '400 12px/18px Inter,sans-serif',
                          fontFamily: FF,
                          color: '#1A1D23',
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          flex: 1,
                          margin: 0,
                          font: '400 12px/18px Inter,sans-serif',
                          color: band.text ? '#1A1D23' : '#8A94A6',
                          fontStyle: band.text ? 'normal' : 'italic',
                          paddingTop: 2,
                        }}
                      >
                        {band.text || placeholder}
                      </p>
                    )}

                    {/* Remove button — edit only */}
                    {isEditing && bands.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBand(i)}
                        title="Remove band"
                        style={{
                          flexShrink: 0,
                          marginTop: 4,
                          padding: '3px 7px',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          background: '#fff',
                          font: '600 13px/16px Inter,sans-serif',
                          fontFamily: FF,
                          color: '#8A94A6',
                          cursor: 'pointer',
                          lineHeight: 1,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FEF2F2';
                          e.currentTarget.style.color = '#DC2626';
                          e.currentTarget.style.borderColor = '#FECACA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#8A94A6';
                          e.currentTarget.style.borderColor = C.border;
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add band — edit only */}
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={addBand}
                  style={{
                    marginTop: 10,
                    padding: '6px 12px',
                    border: `1px dashed ${C.border}`,
                    borderRadius: 6,
                    background: 'transparent',
                    font: '600 12px/16px Inter,sans-serif',
                    fontFamily: FF,
                    color: '#1C6EF2',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  + Add band
                </button>
                <p style={{ margin: '8px 0 0', font: '400 11px/16px Inter,sans-serif', color: '#8A94A6' }}>
                  Passing bands:{' '}
                  <strong style={{ color: passingCount > 0 ? '#22A05B' : '#DC2626' }}>{passingCount}</strong> of{' '}
                  {bands.length}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '14px 20px',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '7px 16px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  background: '#fff',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#5A6478',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '7px 16px',
                  border: '1px solid #1C6EF2',
                  borderRadius: 6,
                  background: '#EFF6FF',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#1C6EF2',
                  cursor: 'pointer',
                }}
              >
                Edit rubric
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (readOnly) {
                    // cancel edit — revert to initial values and go back to read-only
                    setName(initialRubric?.name ?? criterionName);
                    setBands(() => {
                      if (initialRubric?.bands?.length) return initialRubric.bands as Band[];
                      if (initialBands?.length) return initialBands;
                      return DEFAULT_BANDS;
                    });
                    setIsEditing(false);
                  } else {
                    onClose();
                  }
                }}
                style={{
                  padding: '7px 16px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  background: '#fff',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#5A6478',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '7px 16px',
                  border: '1px solid #1C6EF2',
                  borderRadius: 6,
                  background: '#1C6EF2',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Save rubric
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitorCard;
