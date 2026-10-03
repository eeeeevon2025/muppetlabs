import { useMemo } from 'react';

import { Anomaly } from '../types';
import { STUB_ANOMALIES } from '../data/anomalies';
import { STUB_MONITORS } from '../data/monitors';
import { buildReviewQueue } from '../data/reviewQueue';
import ReviewPanel, { ReviewFilter } from '../components/ReviewPanel/ReviewPanel';

interface Props {
  open: boolean;
  a: Anomaly | null;
  onClose: () => void;
}

// Anomaly investigation drawer — thin wrapper around ReviewPanel that provides
// an anomaly-scoped header and conversation filters.
const InvestigationDrawer = ({ open, a, onClose }: Props) => {
  const monitor = useMemo(() => (a ? STUB_MONITORS.find((m) => m.id === a.monitorId) : undefined), [a]);
  const queue = useMemo(() => (monitor ? buildReviewQueue(monitor.id) : []), [monitor]);

  if (!a || !monitor) return null;

  const linkedCriteria = STUB_ANOMALIES.filter(
    (x) => x.cat === 'criteria' && x.monitorKey === a.monitorKey && x.id !== a.id,
  );
  const linkedNames = linkedCriteria.map((x) => x.metric);
  const tripleFailCount = queue.filter((c) => (c.criteriaScores || []).filter((s) => !s.pass).length >= 2).length;
  const coFailureCount = linkedCriteria.length > 0 ? Math.max(1, Math.min(a.investigateCount, tripleFailCount)) : 0;

  const headerCustom = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1D23' }}>{a.metric}</span>
      <span style={{ width: 1, height: 12, background: '#dce0e9' }} />
      <a
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#005BD8',
          textDecoration: 'none',
          borderBottom: '1px dotted #BBD1FF',
          cursor: 'default',
        }}
      >
        {a.monitorName}
      </a>
      <span style={{ width: 1, height: 12, background: '#dce0e9' }} />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#5A6478',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Topic
      </span>
      <a
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#005BD8',
          textDecoration: 'none',
          borderBottom: '1px dotted #BBD1FF',
          cursor: 'default',
        }}
      >
        refund-denial
      </a>
    </div>
  );

  const customFilters: ReviewFilter[] = [
    ...(coFailureCount > 0
      ? [
          {
            id: 'co_fail',
            label: `Also failed ${linkedNames.join(', ')}`,
            count: coFailureCount,
            filterFn: (c: (typeof queue)[number]) => (c.criteriaScores || []).filter((s) => !s.pass).length >= 2,
          },
        ]
      : []),
    {
      id: 'kb',
      label: 'Cited outdated kb:refund-eligibility',
      count: 17,
      filterFn: (c: (typeof queue)[number]) => c.messages.some((m) => /policy|refund/i.test(m.text)),
    },
    {
      id: 'repeat',
      label: 'Repeat contact within 7d',
      count: 14,
      filterFn: (c: (typeof queue)[number]) => c.score < 60,
    },
  ];

  return (
    <ReviewPanel
      open={open}
      monitor={monitor}
      queue={queue}
      onClose={onClose}
      headerCustom={headerCustom}
      customFilters={customFilters}
      totalCountOverride={a.investigateCount}
      pageSize={5}
    />
  );
};

export default InvestigationDrawer;
