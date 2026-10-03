import { useCallback, useMemo, useState } from 'react';

import { STUB_MONITORS, STUB_GOALS } from './data/monitors';
import { STUB_ANOMALIES } from './data/anomalies';
import MonitorsTab from './MonitorsTab/MonitorsTab';
import AnomaliesTab from './AnomaliesTab/AnomaliesTab';
import CreateMonitorPanel from './MonitorsTab/CreateMonitorPanel';
import Tabs from 'komponentsV2/navigation/tabs/Tabs';
import Tab from 'komponentsV2/navigation/tabs/Tab';
import styles from './monitoringPage.scss';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const MonitoringPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [focusAnomalyId, setFocusAnomalyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const counts = useMemo(() => {
    const monitorsNeedingReview = STUB_MONITORS.filter((m) => !!m.alerting?.enabled).length;
    return {
      monitorsNeedingReview,
      anomalies: STUB_ANOMALIES.filter((a) => a.cat === 'criteria').length,
    };
  }, []);

  const onViewAnomaly = useCallback((anomalyId: string) => {
    setFocusAnomalyId(anomalyId);
    setActiveTab(1);
  }, []);

  const consumeFocus = useCallback(() => setFocusAnomalyId(null), []);

  return (
    <div
      className={styles.monitoringPage}
      data-kt="kustomer-ai-monitoring"
      style={{ fontFamily: FF, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {creating ? (
        <CreateMonitorPanel
          open
          onClose={() => setCreating(false)}
          onBack={() => setCreating(false)}
          goals={STUB_GOALS}
          fullPage
        />
      ) : (
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabListContainerClassName={styles.tabNav}>
          <Tab title="Monitors" count={counts.monitorsNeedingReview || undefined}>
            <div className={styles.page}>
              <MonitorsTab onViewAnomaly={onViewAnomaly} onStartCreate={() => setCreating(true)} />
            </div>
          </Tab>
          <Tab title="Anomalies" count={counts.anomalies || undefined}>
            <div className={styles.page}>
              <AnomaliesTab focusAnomalyId={focusAnomalyId} onFocusConsumed={consumeFocus} />
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default MonitoringPage;
