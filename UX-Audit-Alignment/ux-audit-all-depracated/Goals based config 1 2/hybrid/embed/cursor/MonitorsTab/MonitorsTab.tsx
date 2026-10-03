import { useCallback, useMemo, useRef, useState } from 'react';

import { STUB_GOALS, STUB_MONITORS } from '../data/monitors';
import { Monitor } from '../types';
import { ANOMALY_BY_CRITERION, getRecommendedAnomalyForMonitor } from '../data/lookups';
import MonitorCard from './MonitorCard';
import ButtonPrimary from 'komponentsV2/buttons/ButtonPrimary';
import InputSearch from 'komponentsV2/forms/InputSearch';
import useElementWidth from '../components/Drawer/useElementWidth';

interface Props {
  onViewAnomaly?: (anomalyId: string) => void;
  onStartCreate?: () => void;
}

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const C = {
  border: '#dce0e9',
  surface: '#ffffff',
  textPrimary: '#1A1D23',
  textSec: '#5A6478',
  textMuted: '#8A94A6',
};

// Grip handle SVG — 6 dots in a 2×3 grid
const GripIcon = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ display: 'block' }}>
    {[0, 4].map((cx) =>
      [1, 5, 9].map((cy) => <circle key={`${cx}-${cy}`} cx={cx + 2} cy={cy + 1} r={1.2} fill="#C1C7D4" />),
    )}
  </svg>
);

const MonitorsTab = ({ onViewAnomaly, onStartCreate }: Props) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef);
  const cols = containerWidth >= 960 ? 2 : 1;
  const goalById = useMemo(() => Object.fromEntries(STUB_GOALS.map((g) => [g.id, g])), []);

  // Ordered monitor lists (local state so drag-reorder persists during session)
  const [defaultOrder, setDefaultOrder] = useState<Monitor[]>(() => STUB_MONITORS.filter((m) => m.isDefault));
  const [customOrder, setCustomOrder] = useState<Monitor[]>(() => STUB_MONITORS.filter((m) => !m.isDefault));

  // Drag state
  const dragSrc = useRef<{ list: 'default' | 'custom'; idx: number } | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  const reorder = useCallback((list: 'default' | 'custom', fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const setter = list === 'default' ? setDefaultOrder : setCustomOrder;
    setter((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  }, []);

  const q = query.trim().toLowerCase();
  const matches = (m: Monitor) => {
    if (!q) return true;
    if (m.name.toLowerCase().includes(q)) return true;
    if (m.criteria.some((c) => c.name.toLowerCase().includes(q))) return true;
    const goal = goalById[m.goalIds[0]];
    if (goal && goal.name.toLowerCase().includes(q)) return true;
    return false;
  };

  const defaults = defaultOrder.filter(matches);
  const customs = customOrder.filter(matches);
  const totalVisible = defaults.length + customs.length;

  return (
    <div ref={containerRef} style={{ fontFamily: FF }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 24,
              fontWeight: 600,
              color: '#161B25',
              letterSpacing: '-0.015em',
            }}
          >
            Monitors
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: C.textSec,
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Monitors evaluate conversations against quality criteria to surface trends, flagged conversations, and
            review candidates across AI and human-assisted interactions.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ButtonPrimary onClick={() => onStartCreate?.()} icon="plus" size="small">
            Add monitoring
          </ButtonPrimary>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          marginBottom: 14,
          background: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          position: 'sticky',
          top: 8,
          zIndex: 10,
          boxShadow: '0 1px 2px rgba(15,18,25,0.04)',
        }}
      >
        <div style={{ flex: 1, maxWidth: 380 }}>
          <InputSearch
            value={query}
            onChange={(val) => setQuery(val)}
            onClear={() => setQuery('')}
            placeholder="Search monitors, criteria, or linked goals…"
          />
        </div>

        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: C.border,
            margin: '0 2px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ font: '500 12px/16px Inter,sans-serif', color: '#5A6478' }}>Jump to:</span>
          <select
            value=""
            onChange={(e) => {
              const id = e.target.value;
              if (!id) return;
              const el = document.getElementById(`mon-${id}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              e.target.value = '';
            }}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              font: '500 12px/16px Inter,sans-serif',
              fontFamily: FF,
              color: '#1A1D23',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none',
              height: 32,
              minWidth: 200,
            }}
          >
            <option value="">{'Select monitor\u2026'}</option>
            {STUB_MONITORS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ font: '500 12px/16px Inter,sans-serif', color: '#8A94A6' }}>
          {q ? `${totalVisible} of ${STUB_MONITORS.length} match` : `${STUB_MONITORS.length} monitors`}
        </span>
      </div>

      {/* Default monitors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 14,
          marginBottom: 24,
        }}
      >
        {defaults.map((m, idx) => {
          const isOver = overKey === `default-${idx}`;
          return (
            <div
              key={m.id}
              id={`mon-${m.id}`}
              draggable
              onDragStart={(e) => {
                dragSrc.current = { list: 'default', idx };
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setOverKey(`default-${idx}`);
              }}
              onDragLeave={() => setOverKey(null)}
              onDrop={(e) => {
                e.preventDefault();
                setOverKey(null);
                if (dragSrc.current?.list === 'default') {
                  reorder('default', dragSrc.current.idx, idx);
                }
                dragSrc.current = null;
              }}
              onDragEnd={() => {
                setOverKey(null);
                dragSrc.current = null;
              }}
              style={{
                borderRadius: 10,
                scrollMarginTop: 80,
                minWidth: 0,
                position: 'relative',
                outline: isOver ? `2px dashed #1C6EF2` : '2px solid transparent',
                outlineOffset: 2,
                transition: 'outline-color 0.1s',
              }}
            >
              {/* Drag handle */}
              <div
                title="Drag to reorder"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: -18,
                  zIndex: 5,
                  cursor: 'grab',
                  padding: '4px 3px',
                  opacity: 0.5,
                }}
              >
                <GripIcon />
              </div>
              <MonitorCard
                monitor={m}
                goal={goalById[m.goalIds[0]]}
                goals={STUB_GOALS}
                hideLinkedGoal
                recommendedAnomaly={getRecommendedAnomalyForMonitor(m.id)}
                anomalyByCriterion={ANOMALY_BY_CRITERION}
                onViewAnomaly={onViewAnomaly}
              />
            </div>
          );
        })}
      </div>

      {/* Custom monitors / empty state */}
      <div>
        {customs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 14 }}>
            {customs.map((m, idx) => {
              const isOver = overKey === `custom-${idx}`;
              return (
                <div
                  key={m.id}
                  id={`mon-${m.id}`}
                  draggable
                  onDragStart={(e) => {
                    dragSrc.current = { list: 'custom', idx };
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    setOverKey(`custom-${idx}`);
                  }}
                  onDragLeave={() => setOverKey(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setOverKey(null);
                    if (dragSrc.current?.list === 'custom') {
                      reorder('custom', dragSrc.current.idx, idx);
                    }
                    dragSrc.current = null;
                  }}
                  onDragEnd={() => {
                    setOverKey(null);
                    dragSrc.current = null;
                  }}
                  style={{
                    borderRadius: 10,
                    scrollMarginTop: 80,
                    minWidth: 0,
                    position: 'relative',
                    outline: isOver ? `2px dashed #1C6EF2` : '2px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline-color 0.1s',
                  }}
                >
                  {/* Drag handle */}
                  <div
                    title="Drag to reorder"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: -18,
                      zIndex: 5,
                      cursor: 'grab',
                      padding: '4px 3px',
                      opacity: 0.5,
                    }}
                  >
                    <GripIcon />
                  </div>
                  <MonitorCard
                    monitor={m}
                    goal={goalById[m.goalIds[0]]}
                    goals={STUB_GOALS}
                    hideLinkedGoal
                    recommendedAnomaly={getRecommendedAnomalyForMonitor(m.id)}
                    anomalyByCriterion={ANOMALY_BY_CRITERION}
                    onViewAnomaly={onViewAnomaly}
                  />
                </div>
              );
            })}
          </div>
        ) : q ? (
          <div
            style={{
              padding: '24px 20px',
              border: `1px dashed ${C.border}`,
              borderRadius: 10,
              background: C.surface,
              textAlign: 'center',
              fontSize: 13,
              color: C.textMuted,
            }}
          >
            {'No monitors match \u201c'}
            {query}
            {'\u201d.'}
          </div>
        ) : (
          <div
            style={{
              padding: '24px 20px',
              border: `1px dashed ${C.border}`,
              borderRadius: 10,
              background: C.surface,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.textPrimary,
                marginBottom: 4,
              }}
            >
              No custom monitor yet
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.textMuted,
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              Add a monitor tailored to your business. Conversations are scored automatically &mdash; results are
              surfaced for your review.
            </div>
            <ButtonPrimary onClick={() => onStartCreate?.()} icon="plus" size="small">
              Add monitoring
            </ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorsTab;
