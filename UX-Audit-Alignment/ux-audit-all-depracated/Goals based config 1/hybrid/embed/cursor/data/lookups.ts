import { Anomaly, AnomalySeverity } from '../types';
import { STUB_ANOMALIES } from './anomalies';

const SEV_RANK: Record<AnomalySeverity, number> = {
  high: 0,
  med: 1,
  drift: 2,
  pos: 3,
};

export const ANOMALY_BY_CRITERION: Record<string, Anomaly> = STUB_ANOMALIES.reduce(
  (acc, a) => {
    if (a.cat === 'criteria') acc[a.metric] = a;
    return acc;
  },
  {} as Record<string, Anomaly>,
);

export const ANOMALIES_BY_MONITOR_ID: Record<string, Anomaly[]> = STUB_ANOMALIES.reduce(
  (acc, a) => {
    if (!a.monitorId) return acc;
    (acc[a.monitorId] = acc[a.monitorId] || []).push(a);
    return acc;
  },
  {} as Record<string, Anomaly[]>,
);

export const getRecommendedAnomalyForMonitor = (monitorId: string): Anomaly | undefined => {
  const all = ANOMALIES_BY_MONITOR_ID[monitorId] || [];
  // Prefer criteria anomalies (they appear on the Anomalies tab as rows
  // the user can scroll to). Then sort by severity, then by absolute deviation
  // so the most-deviant anomaly wins as the lead.
  const criteria = all.filter((a) => a.cat === 'criteria');
  const pool = criteria.length ? criteria : all;
  return [...pool].sort((a, b) => {
    const s = SEV_RANK[a.sev] - SEV_RANK[b.sev];
    if (s !== 0) return s;
    const da = Math.abs(a.now - a.base);
    const db = Math.abs(b.now - b.base);
    return db - da;
  })[0];
};
