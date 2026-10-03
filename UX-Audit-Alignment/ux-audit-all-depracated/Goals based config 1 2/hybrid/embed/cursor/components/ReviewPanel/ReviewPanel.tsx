import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { type Monitor, type ReviewConversation, type ReviewMessage } from '../../types';
import { REF_TYPE_META, type RubricRef, buildRefsByCriterion, findRefsForScoreName } from '../../data/rubricRefs';
import useViewportWidth from '../Drawer/useViewportWidth';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

const C = {
  border: '#dce0e9',
  textPrimary: '#1A1D23',
  textSec: '#5A6478',
  textMuted: '#8A94A6',
};

export interface ReviewFilter {
  id: string;
  label: string;
  count: number;
  filterFn: (c: ReviewConversation) => boolean;
}

interface Props {
  open: boolean;
  monitor: Monitor;
  queue: ReviewConversation[];
  onClose: () => void;
  // Optional override of the default header (eyebrow + title block)
  headerKicker?: string;
  headerTitle?: string;
  headerSub?: string;
  headerCustom?: ReactNode;
  // Anomaly investigation drawers inject a callout above the queue.
  extraBodyTop?: ReactNode;
  // Custom filter chips replace the default per-criterion pills.
  customFilters?: ReviewFilter[];
  // Override the displayed total count (e.g. "0 of 23 labeled" for an anomaly cluster).
  totalCountOverride?: number;
  pageSize?: number;
  // Optional callback when a reviewer clicks a conversation id — opens the
  // full conversation drawer in the host app. No-op when omitted.
  openConvo?: (id: string) => void;
}

type LabelKind = 'good' | 'bad' | 'skip';

const labelTone: Record<LabelKind, { fg: string; bg: string; bor: string }> = {
  good: { fg: '#16A34A', bg: '#F0FDF4', bor: '#86EFAC' },
  bad: { fg: '#DC2626', bg: '#FEF2F2', bor: '#FECACA' },
  skip: { fg: '#5A6478', bg: '#F4F5F7', bor: '#DCE0E9' },
};

const ReviewPanel = ({
  open,
  monitor,
  queue,
  onClose,
  headerKicker,
  headerTitle,
  headerSub,
  headerCustom,
  extraBodyTop,
  customFilters,
  totalCountOverride,
  pageSize = 5,
  openConvo,
}: Props) => {
  const vw = useViewportWidth();
  const drawerWidth = vw < 400 ? '100vw' : vw < 720 ? '90vw' : '67vw';
  const [visible, setVisible] = useState(false);

  // Animation toggle — slide in after mount, slide out before unmount.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setVisible(true), 10);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
    return undefined;
  }, [open]);

  const [labels, setLabels] = useState<Record<string, LabelKind>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeCriterion, setActiveCriterion] = useState<string | null>(null);
  const [activeCustomFilterId, setActiveCustomFilterId] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(pageSize);

  // Reset queue state whenever the panel reopens against a different monitor.
  useEffect(() => {
    if (!open) return;
    setLabels({});
    setCollapsed({});
    setActiveCriterion(null);
    setActiveCustomFilterId(null);
    setLoadedCount(pageSize);
  }, [open, monitor.id, pageSize]);

  // Per-criterion counts — used for the red filter pills (failed criteria).
  const criterionFailCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    monitor.criteria.forEach((cr) => {
      counts[cr.name] = queue.filter((c) => (c.criteriaScores || []).some((s) => s.name === cr.name && !s.pass)).length;
    });
    return counts;
  }, [monitor.criteria, queue]);

  // Map criterion name -> linked rubric refs (kb / tool / procedure chips).
  // Seeded from the monitor's criteria so the "With scoring" view shows the
  // same rubric chips that appear when editing the monitor.
  const refsByCriterion = useMemo(() => buildRefsByCriterion(monitor.criteria), [monitor.criteria]);

  const activeCustomFilter = (customFilters || []).find((f) => f.id === activeCustomFilterId);

  const visibleQueue = activeCustomFilter
    ? queue.filter(activeCustomFilter.filterFn)
    : activeCriterion
      ? queue.filter((c) => (c.criteriaScores || []).some((s) => s.name === activeCriterion && !s.pass))
      : queue;

  const totalForDisplay = activeCustomFilter
    ? activeCustomFilter.count
    : activeCriterion
      ? criterionFailCounts[activeCriterion] || visibleQueue.length
      : totalCountOverride != null
        ? totalCountOverride
        : visibleQueue.length;

  const displayedQueue = visibleQueue.slice(0, loadedCount);
  const hasMore = displayedQueue.length < visibleQueue.length || displayedQueue.length < totalForDisplay;

  const labeledCount = Object.keys(labels).filter((id) => visibleQueue.some((c) => c.id === id)).length;

  // Preserve scroll across label clicks (state changes remount card subtree).
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const restoreScroll = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (restoreScroll.current != null && bodyRef.current) {
      bodyRef.current.scrollTop = restoreScroll.current;
      restoreScroll.current = null;
    }
  });

  const setLabel = (id: string, kind: LabelKind) => {
    if (bodyRef.current) restoreScroll.current = bodyRef.current.scrollTop;
    setLabels((prev) => ({ ...prev, [id]: kind }));
  };

  const toggleCollapsed = (id: string) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,18,25,0.32)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 240ms ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: drawerWidth,
          background: '#fff',
          boxShadow: '-8px 0 32px rgba(15,18,25,0.18)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
          fontFamily: FF,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px 14px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              {headerCustom || (
                <>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {headerKicker || 'Review conversations \u00b7 ground truth'}
                  </div>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.textPrimary,
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {headerTitle || monitor.name}
                  </h2>
                  {headerSub && (
                    <div
                      style={{
                        fontSize: 12,
                        color: C.textSec,
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {headerSub}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                color: C.textMuted,
                height: 32,
                width: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 22px 24px',
            background: '#FAFBFC',
          }}
        >
          {extraBodyTop}

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textPrimary,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {activeCustomFilter || activeCriterion ? 'Filtered conversations' : 'Recent conversations'}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                {labeledCount} of {totalForDisplay} labeled
              </div>
            </div>

            {/* Filter pills */}
            {customFilters && customFilters.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <FilterPill
                  active={!activeCustomFilterId}
                  onClick={() => setActiveCustomFilterId(null)}
                  label="All"
                  count={totalCountOverride != null ? totalCountOverride : queue.length}
                />
                {customFilters.map((f) => (
                  <FilterPill
                    key={f.id}
                    active={activeCustomFilterId === f.id}
                    onClick={() => setActiveCustomFilterId(activeCustomFilterId === f.id ? null : f.id)}
                    label={f.label}
                    count={f.count}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <FilterPill
                  active={!activeCriterion}
                  onClick={() => setActiveCriterion(null)}
                  label="All recent"
                  count={queue.length}
                />
                {monitor.criteria.map((cr) => {
                  const failCount = criterionFailCounts[cr.name] || 0;
                  if (failCount === 0) return null;
                  const active = activeCriterion === cr.name;
                  return (
                    <button
                      key={cr.name}
                      type="button"
                      onClick={() => setActiveCriterion(active ? null : cr.name)}
                      title={cr.name}
                      style={{
                        font: '600 11px/14px Inter,sans-serif',
                        padding: '4px 10px',
                        borderRadius: 999,
                        cursor: 'pointer',
                        border: `1px solid ${active ? '#B91C1C' : '#FCA5A5'}`,
                        background: active ? '#B91C1C' : '#fff',
                        color: active ? '#fff' : '#B91C1C',
                        fontFamily: FF,
                        transition: 'all 0.12s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        maxWidth: 380,
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 999,
                          background: active ? '#fff' : '#B91C1C',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}
                      >
                        {cr.name}
                      </span>
                      <span style={{ opacity: 0.7 }}>{failCount}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {displayedQueue.map((c) => (
              <ConvCard
                key={c.id}
                c={c}
                expanded={!collapsed[c.id]}
                label={labels[c.id]}
                onToggle={() => toggleCollapsed(c.id)}
                onLabel={(kind) => setLabel(c.id, kind)}
                onOpenConvo={openConvo}
                refsByCriterion={refsByCriterion}
              />
            ))}

            {hasMore && (
              <button
                type="button"
                onClick={() => setLoadedCount((n) => n + pageSize)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: `1px dashed ${C.border}`,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: C.textSec,
                  fontFamily: FF,
                }}
              >
                Load more conversations ·{' '}
                {Math.min(
                  pageSize,
                  Math.max(0, totalForDisplay - displayedQueue.length, visibleQueue.length - displayedQueue.length),
                )}{' '}
                more
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: `1px solid ${C.border}`,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 12, color: C.textSec }}>
            {labeledCount > 0 ? (
              <>
                <span style={{ fontWeight: 600, color: C.textPrimary }}>{labeledCount}</span> example
                {labeledCount !== 1 ? 's' : ''} ready to apply
              </>
            ) : (
              <span style={{ color: C.textMuted }}>Label conversations to refine the scorer</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: `1px solid ${C.border}`,
                background: '#fff',
                fontSize: 13,
                fontWeight: 600,
                color: C.textSec,
                cursor: 'pointer',
                fontFamily: FF,
                height: 34,
              }}
            >
              Close
            </button>
            <button
              type="button"
              disabled={labeledCount === 0}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                background: labeledCount === 0 ? '#A3B1CC' : '#1C6EF2',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: labeledCount === 0 ? 'not-allowed' : 'pointer',
                fontFamily: FF,
                height: 34,
              }}
            >
              Apply {labeledCount > 0 ? `${labeledCount} label${labeledCount !== 1 ? 's' : ''}` : 'labels'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const FilterPill = ({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      font: '600 11px/14px Inter,sans-serif',
      padding: '4px 10px',
      borderRadius: 999,
      cursor: 'pointer',
      border: `1px solid ${active ? '#1C6EF2' : C.border}`,
      background: active ? '#1C6EF2' : '#fff',
      color: active ? '#fff' : C.textSec,
      fontFamily: FF,
      transition: 'all 0.12s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
    }}
  >
    {label}
    <span style={{ opacity: 0.7 }}>{count}</span>
  </button>
);

interface ConvCardProps {
  c: ReviewConversation;
  expanded: boolean;
  label: LabelKind | undefined;
  onToggle: () => void;
  onLabel: (kind: LabelKind) => void;
  onOpenConvo?: (id: string) => void;
  refsByCriterion: Record<string, RubricRef[]>;
}

const ConvCard = ({ c, expanded, label, onToggle, onLabel, onOpenConvo, refsByCriterion }: ConvCardProps) => {
  const [showAnnotated, setShowAnnotated] = useState(false);
  const passColor = c.status === 'pass' ? '#16A34A' : '#DC2626';
  const passBg = c.status === 'pass' ? '#F0FDF4' : '#FEF2F2';
  const passBor = c.status === 'pass' ? '#86EFAC' : '#FECACA';

  const labelStyle = (kind: LabelKind): React.CSSProperties => {
    const active = label === kind;
    const t = labelTone[kind];
    return {
      padding: '6px 12px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      fontFamily: FF,
      cursor: 'pointer',
      border: `1px solid ${active ? t.fg : t.bor}`,
      background: active ? t.bg : '#fff',
      color: active ? t.fg : C.textSec,
      flex: 1,
      transition: 'all 0.12s',
    };
  };

  return (
    <div
      style={{
        border: `1px solid ${label ? '#86EFAC' : C.border}`,
        borderRadius: 8,
        marginBottom: 10,
        background: '#fff',
        boxShadow: label ? '0 0 0 2px rgba(22,163,74,0.08)' : 'none',
        transition: 'all 0.15s',
        opacity: label === 'skip' ? 0.6 : 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px 10px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <button
            type="button"
            onClick={() => onOpenConvo?.(c.id)}
            disabled={!onOpenConvo}
            title={onOpenConvo ? `Open ${c.id}` : c.id}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: onOpenConvo ? 'pointer' : 'default',
              font: `600 12px/16px ${MONO}`,
              color: '#1C6EF2',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            {c.id}
          </button>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: passColor,
              background: passBg,
              border: `1px solid ${passBor}`,
              padding: '2px 6px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginLeft: 'auto',
            }}
          >
            {c.status === 'pass' ? `Pass \u00b7 ${c.score}/100` : `Fail \u00b7 ${c.score}/100`}
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
          <span style={{ color: C.textPrimary, fontWeight: 600 }}>{c.customer}</span> · {c.customerCompany} ·{' '}
          <span style={{ color: C.textMuted }}>{c.timeAgo}</span>
        </div>
      </div>

      {/* Criteria breakdown */}
      <div style={{ padding: '10px 14px 4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.textMuted,
            }}
          >
            Criteria
          </div>
          {(c.criteriaScores || []).length > 0 && (
            <div style={{ fontSize: 10, color: C.textMuted }}>Weighted contribution out of total weight</div>
          )}
        </div>
        {(c.criteriaScores || []).length === 0 ? (
          <div
            style={{
              padding: '10px 12px',
              background: '#FFFBEB',
              border: '1px dashed #FCD34D',
              borderRadius: 6,
              fontSize: 11,
              color: '#92400E',
              lineHeight: 1.5,
              marginBottom: 6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 3, color: '#78350F' }}>Per-criterion rationale expired</div>
            Detailed scores are retained for 30 days. After that, only the overall score and pass/fail outcome remain in
            long-term storage. This conversation scored <strong>{c.score}/100</strong> against the monitor — open the
            full conversation to review the messages directly.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {c.criteriaScores.map((cr) => (
              <div
                key={cr.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: cr.pass ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${cr.pass ? '#86EFAC' : '#FECACA'}`,
                    color: cr.pass ? '#16A34A' : '#DC2626',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {cr.pass ? '\u2713' : '\u2715'}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: C.textPrimary,
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {cr.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: cr.pass ? '#16A34A' : '#DC2626',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {((cr.score * cr.weight) / 100).toFixed(1)}
                  <span style={{ color: C.textMuted, fontWeight: 400 }}>/{cr.weight}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View conversation toggle + transcript */}
      <div style={{ padding: '8px 14px 12px' }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: FF,
            fontSize: 11,
            fontWeight: 600,
            color: '#1C6EF2',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {expanded ? 'Hide conversation' : 'View conversation'}
          <svg
            width={9}
            height={9}
            viewBox="0 0 9 9"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            style={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 150ms',
            }}
          >
            <path d="M3 2l3 2.5L3 7" strokeLinecap="round" />
          </svg>
        </button>

        {expanded && c.messages.length > 0 && (
          <ConversationView
            c={c}
            showAnnotated={showAnnotated}
            onToggleAnnotated={setShowAnnotated}
            onOpenConvo={onOpenConvo}
            refsByCriterion={refsByCriterion}
          />
        )}
      </div>

      {/* Label actions */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: `1px solid ${C.border}`,
          background: '#FAFBFC',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.textMuted,
            marginBottom: 6,
          }}
        >
          Mark as ground-truth example
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => onLabel('good')} style={labelStyle('good')}>
            ✓ Good example
          </button>
          <button type="button" onClick={() => onLabel('bad')} style={labelStyle('bad')}>
            ✕ False positive
          </button>
          <button type="button" onClick={() => onLabel('skip')} style={labelStyle('skip')}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConvViewProps {
  c: ReviewConversation;
  showAnnotated: boolean;
  onToggleAnnotated: (v: boolean) => void;
  onOpenConvo?: (id: string) => void;
  refsByCriterion: Record<string, RubricRef[]>;
}

// Per-criterion miss-pattern dictionary used by the "With scoring" view to
// map a failing criterion to the AI turn that most plausibly triggered the
// verdict — and to the customer re-ask that supplies context. Mirrors the
// PATTERNS / RE_ASK / categoriesFor logic in the source HTML's ReviewPanel.
const MISS_PATTERNS: Record<string, RegExp> = {
  resolution: /coupon|discount|voucher|store credit|replacement|gift card|instead/i,
  policy: /per (our )?policy|per process|policy (window|requires|states)|protocol|per our/i,
  verification: /already authenticated|already verified|no need to verify|account was already/i,
  tool: /prior session|cached|stale|earlier session|delivered|signature on file/i,
  closing: /anything else|all set|have a (great|good) day/i,
};
const RE_ASK = /actually|but|wait|already|asked|I said|I want|just (the )?refund|no, |third time|second time/i;

const categoriesFor = (criterionName: string): string[] => {
  const n = (criterionName || '').toLowerCase();
  if (/resolved|need|intent|outcome|solve/.test(n)) return ['resolution'];
  if (/tone|empathy|frustration|emotional/.test(n)) return ['policy'];
  if (/verif|identity|auth|disclosure/.test(n)) return ['verification', 'policy'];
  if (/tool|lookup|customer.id|session|stale/.test(n)) return ['tool', 'verification'];
  if (/close|follow.up|confirm|confirmation/.test(n)) return ['closing'];
  return ['resolution', 'policy'];
};

type TurnTagKind = 'matched' | 'missed' | 'context';
interface TurnTag {
  tag: TurnTagKind;
  cr: { name: string; score: number };
  refs: RubricRef[];
}

const buildTurnTags = (
  c: ReviewConversation,
  refsByCriterion: Record<string, RubricRef[]>,
): Record<number, TurnTag[]> => {
  const msgs = c.messages;
  const tagsByTurn: Record<number, TurnTag[]> = {};
  (c.criteriaScores || []).forEach((cr) => {
    // Resolve the monitor's linked rubric for this criterion. Tolerates name
    // drift between the monitor's criterion (e.g. with parentheticals) and the
    // shorter label stored on criteriaScores entries, then falls back to
    // seeding refs from the score name itself.
    const refs = findRefsForScoreName(refsByCriterion, cr.name);
    if (!cr.pass) {
      const cats = categoriesFor(cr.name);
      let aiMissIdx = -1;
      for (const cat of cats) {
        const pat = MISS_PATTERNS[cat];
        const idx = msgs.findIndex((mm) => mm.role === 'ai' && pat.test(mm.text || ''));
        if (idx >= 0) {
          aiMissIdx = idx;
          break;
        }
      }
      if (aiMissIdx < 0) aiMissIdx = msgs.findIndex((mm) => mm.role === 'ai');
      if (aiMissIdx >= 0) {
        (tagsByTurn[aiMissIdx] = tagsByTurn[aiMissIdx] || []).push({
          tag: 'missed',
          cr,
          refs,
        });
      }
      let custIdx = msgs.findIndex((mm, i) => i > aiMissIdx && mm.role === 'customer' && RE_ASK.test(mm.text || ''));
      if (custIdx < 0) custIdx = msgs.findIndex((mm) => mm.role === 'customer' && RE_ASK.test(mm.text || ''));
      if (custIdx < 0) custIdx = msgs.findIndex((mm) => mm.role === 'customer');
      if (custIdx >= 0 && custIdx !== aiMissIdx) {
        (tagsByTurn[custIdx] = tagsByTurn[custIdx] || []).push({
          tag: 'context',
          cr,
          refs,
        });
      }
    } else {
      const aiIdx = msgs.findIndex((mm) => mm.role === 'ai');
      if (aiIdx >= 0) {
        (tagsByTurn[aiIdx] = tagsByTurn[aiIdx] || []).push({
          tag: 'matched',
          cr,
          refs,
        });
      }
    }
  });
  return tagsByTurn;
};

const tagToneFor = (tag: TurnTagKind) => {
  if (tag === 'matched') return { fg: '#16A34A', bg: '#F0FDF4', bor: '#86EFAC' };
  if (tag === 'missed') return { fg: '#DC2626', bg: '#FEF2F2', bor: '#FECACA' };
  return { fg: '#B45309', bg: '#FFFBEB', bor: '#FCD34D' };
};

const roleLabel = (role: ReviewMessage['role']): string => {
  if (role === 'customer') return 'Customer';
  if (role === 'ai') return 'AI';
  if (role === 'tool') return 'Tool';
  return 'System';
};

const roleColor = (role: ReviewMessage['role']): string => {
  if (role === 'customer') return '#7C3AED';
  if (role === 'ai') return '#1C6EF2';
  return C.textMuted;
};

const ConversationView = ({ c, showAnnotated, onToggleAnnotated, onOpenConvo, refsByCriterion }: ConvViewProps) => {
  const messages: ReviewMessage[] = c.messages.slice(0, 5);
  const tagsByTurn = useMemo(() => buildTurnTags(c, refsByCriterion), [c, refsByCriterion]);

  return (
    <div
      style={{
        marginTop: 10,
        background: '#FAFBFC',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      {/* View-mode subtoggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 10px',
          borderBottom: `1px solid ${C.border}`,
          background: '#fff',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginRight: 8,
          }}
        >
          View
        </span>
        {[
          { k: false, label: 'Transcript' },
          { k: true, label: 'With scoring' },
        ].map((opt) => {
          const on = showAnnotated === opt.k;
          return (
            <button
              key={String(opt.k)}
              type="button"
              onClick={() => onToggleAnnotated(opt.k)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 999,
                cursor: 'pointer',
                border: `1px solid ${on ? '#1C6EF2' : C.border}`,
                background: on ? '#1C6EF2' : '#fff',
                color: on ? '#fff' : C.textSec,
                fontFamily: FF,
                marginRight: 4,
                transition: 'all 0.12s',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Turns */}
      <div
        style={{
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: showAnnotated ? 10 : 6,
        }}
      >
        {messages.map((m, i) => {
          const tags = tagsByTurn[i] || [];
          if (showAnnotated) {
            const leftBorder =
              tags.length === 0
                ? C.border
                : tags.some((t) => t.tag === 'missed')
                  ? '#FECACA'
                  : tags.some((t) => t.tag === 'matched')
                    ? '#86EFAC'
                    : '#FCD34D';
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: roleColor(m.role),
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    turn {i + 1} · {roleLabel(m.role)} · {m.time}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textPrimary,
                      lineHeight: 1.5,
                      marginTop: 2,
                      fontFamily: m.role === 'tool' ? MONO : FF,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    paddingLeft: 8,
                    borderLeft: `2px solid ${leftBorder}`,
                  }}
                >
                  {tags.length === 0 ? (
                    <span
                      style={{
                        fontSize: 10,
                        color: C.textMuted,
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                      }}
                    >
                      no scoring signal
                    </span>
                  ) : (
                    tags.map((t, ti) => {
                      const tone = tagToneFor(t.tag);
                      return (
                        <div
                          key={ti}
                          style={{
                            padding: '4px 6px',
                            borderRadius: 4,
                            background: tone.bg,
                            border: `1px solid ${tone.bor}`,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginBottom: 2,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                color: tone.fg,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {t.tag}
                            </span>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                color: tone.fg,
                                marginLeft: 'auto',
                                fontFamily: MONO,
                              }}
                            >
                              {t.cr.score}/100
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: C.textSec,
                              lineHeight: 1.4,
                            }}
                          >
                            {t.cr.name}
                          </div>
                          {t.refs.length > 0 && (
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 3,
                                marginTop: 4,
                              }}
                              title="Related guidance for this criterion"
                            >
                              {t.refs.map((r, ri) => {
                                const meta = REF_TYPE_META[r.type] || REF_TYPE_META.kb;
                                return (
                                  <span
                                    key={`${r.type}:${r.slug}:${ri}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '0 4px',
                                      background: meta.bg,
                                      border: `1px solid ${meta.border}`,
                                      borderRadius: 3,
                                      font: `600 9px/14px ${MONO}`,
                                      color: meta.color,
                                    }}
                                  >
                                    <span style={{ opacity: 0.75 }}>/{meta.label}:</span>
                                    {r.slug}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: roleColor(m.role),
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {roleLabel(m.role)} · {m.time}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textPrimary,
                  lineHeight: 1.5,
                  fontFamily: m.role === 'tool' ? MONO : FF,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {c.messages.length > 5 && (
          <div
            style={{
              paddingTop: 6,
              borderTop: `1px dashed ${C.border}`,
              marginTop: 2,
              fontSize: 11,
              color: C.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <span>
              {c.messages.length - 5} more turn
              {c.messages.length - 5 !== 1 ? 's' : ''} not shown
            </span>
            <button
              type="button"
              onClick={() => onOpenConvo?.(c.id)}
              disabled={!onOpenConvo}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: onOpenConvo ? 'pointer' : 'default',
                fontFamily: FF,
                fontSize: 11,
                fontWeight: 600,
                color: '#1C6EF2',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Go to full conversation
              <svg
                width={9}
                height={9}
                viewBox="0 0 9 9"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 1.5h4.5V6M7.5 1.5L4 5M3.5 2.5H2v5h5V6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPanel;
