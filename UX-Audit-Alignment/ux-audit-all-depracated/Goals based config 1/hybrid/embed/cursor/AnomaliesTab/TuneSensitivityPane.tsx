import { useState } from 'react';

import { type Anomaly } from '../types';
import { BandChart, ClusterBandChart } from '../components/BandChart/BandChart';
import ButtonText from 'komponentsV2/buttons/ButtonText';

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

interface Props {
  a: Anomaly;
  onBack: () => void;
}

const TuneSensitivityPane = ({ a, onBack }: Props) => {
  const isMonitor = a.cat === 'monitor';
  const replay14 = a.hist || [];
  const recommendedVar = Math.max(1, Math.round(a.variance * 0.7 * 10) / 10);
  const recommendedThr = Math.max(a.base + 2, Math.round(a.base * 1.6));
  const recommendedClusterMin = 8;
  const recommendedWindow = 2;

  const [variance, setVariance] = useState(a.variance);
  const [threshold, setThreshold] = useState(recommendedThr);
  const [clusterMin, setClusterMin] = useState(recommendedClusterMin);
  const [windowDays, setWindowDays] = useState(recommendedWindow);

  const wouldAlert = isMonitor
    ? replay14.filter((v) => Math.abs(v - a.base) > variance).length
    : replay14.filter((v) => v >= threshold).length;

  const monitorDirty = variance !== recommendedVar;
  const criteriaDirty =
    threshold !== recommendedThr || clusterMin !== recommendedClusterMin || windowDays !== recommendedWindow;

  const verdictNote =
    wouldAlert === 0
      ? isMonitor
        ? "Probably too loose — would have missed today's drop."
        : "Too quiet — wouldn't have caught the drift."
      : wouldAlert > 5
        ? isMonitor
          ? "Probably too tight — that's alert fatigue."
          : 'Noisy — narrow the cluster rule.'
        : 'Feels balanced. Save it and watch tomorrow.';

  const labelStyle = {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--gray-90)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  };
  const cardStyle = {
    padding: '16px 18px',
    borderRadius: 10,
    border: '1px solid var(--gray-30)',
    background: '#fff',
  };

  return (
    <div style={{ fontFamily: FF }}>
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <ButtonText size="small" onClick={onBack} icon="chevron-left">
          {a.metric}
        </ButtonText>
        <span style={{ color: 'var(--gray-50)' }}>/</span>
        <span style={{ fontSize: 12, color: 'var(--gray-115)', fontWeight: 500 }}>Tune sensitivity</span>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--gray-30)',
          paddingBottom: 18,
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: 999,
                background: isMonitor ? 'var(--gray-150)' : 'var(--yellow-15)',
                color: isMonitor ? '#fff' : 'var(--yellow-100)',
                border: isMonitor ? 'none' : '1px solid var(--yellow-50)',
              }}
            >
              {isMonitor ? 'Monitor anomaly' : 'Criteria cluster'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--gray-95)' }}>{a.metric}</span>
          </div>
          <h2
            style={{
              margin: '4px 0 0',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--gray-130)',
              letterSpacing: '-0.015em',
            }}
          >
            {isMonitor ? 'Tune the variance band' : 'Tune the cluster threshold'}
          </h2>
          <div
            style={{
              fontSize: 13,
              color: 'var(--gray-95)',
              marginTop: 6,
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            {isMonitor ? (
              <>
                The band is <strong>baseline \u00b1 variance</strong>. Replays the last 14 days against your proposed
                setting.
              </>
            ) : (
              <>
                Two rules &mdash; <strong>fail-count threshold</strong> and <strong>cluster size</strong>. Both must
                trip to alert.
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              fontFamily: FF,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid transparent',
              background: 'transparent',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--gray-105)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onBack}
            style={{
              fontFamily: FF,
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--blue-70)',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Save band
          </button>
        </div>
      </div>

      {/* Replay chart */}
      <div style={{ ...cardStyle, padding: '14px 16px', marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 10,
          }}
        >
          <div>
            <div style={labelStyle}>14-day replay · proposed band shaded</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-95)',
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {isMonitor
                ? 'Red dots = days that would have alerted at the proposed band.'
                : 'Red bars = days over your proposed threshold.'}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              fontSize: 11,
              color: 'var(--gray-95)',
            }}
          >
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span
                style={{
                  width: 18,
                  height: 10,
                  background: 'rgba(252,237,146,0.35)',
                  border: '1px solid var(--yellow-100)',
                }}
              />
              proposed
            </span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span
                style={{
                  width: 18,
                  height: 10,
                  border: '1px dashed var(--gray-50)',
                }}
              />
              current
            </span>
          </div>
        </div>
        {isMonitor ? (
          <BandChart data={replay14} baseline={a.base} variance={a.variance} currentVar={variance} />
        ) : (
          <ClusterBandChart data={replay14} baseline={a.base} threshold={threshold} />
        )}
      </div>

      {/* Controls */}
      {isMonitor ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Variance band \u00b1</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                marginTop: 8,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--gray-130)',
                  letterSpacing: '-0.02em',
                }}
              >
                \u00b1{variance}
                {a.unit}
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>
                currently \u00b1{a.variance}
                {a.unit}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={variance}
              onChange={(e) => setVariance(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--blue-80)' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 11,
                color: 'var(--gray-90)',
              }}
            >
              <span>tighter (more alerts)</span>
              <span>looser (fewer alerts)</span>
            </div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: 'var(--yellow-15)',
              border: '1px solid var(--yellow-50)',
            }}
          >
            <div style={labelStyle}>Replay verdict</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--gray-130)',
                letterSpacing: '-0.02em',
                marginTop: 6,
                lineHeight: 1.1,
              }}
            >
              {wouldAlert} alert{wouldAlert === 1 ? '' : 's'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-100)',
                marginTop: 4,
              }}
            >
              over the last 14 days
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--yellow-110)',
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              {verdictNote}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Recommendation</div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--gray-115)',
                marginTop: 8,
                lineHeight: 1.55,
              }}
            >
              Today&rsquo;s drop was{' '}
              <strong>
                {Math.abs(a.now - a.base)}
                {a.unit}
              </strong>
              . To catch it earlier, try{' '}
              <strong style={{ color: 'var(--blue-90)' }}>
                \u00b1{recommendedVar}
                {a.unit}
              </strong>
              .
            </div>
            <button
              type="button"
              onClick={() => setVariance(recommendedVar)}
              disabled={!monitorDirty}
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 10px',
                borderRadius: 6,
                background: monitorDirty ? 'var(--blue-10)' : 'var(--gray-15)',
                border: `1px solid ${monitorDirty ? 'var(--blue-25)' : 'var(--gray-30)'}`,
                color: monitorDirty ? 'var(--blue-90)' : 'var(--gray-90)',
                cursor: monitorDirty ? 'pointer' : 'default',
                fontFamily: FF,
              }}
            >
              \u21bb Reset to recommended (\u00b1{recommendedVar}
              {a.unit})
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Rule 1 \u00b7 fail-count threshold</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-95)',
                marginTop: 4,
              }}
            >
              alert when daily failures of <strong>{a.metric}</strong> hit this number
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                marginTop: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--gray-130)',
                  letterSpacing: '-0.02em',
                }}
              >
                {'\u2265'} {threshold}/day
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>baseline ~{a.base}/day</span>
            </div>
            <input
              type="range"
              min={a.base}
              max={a.base + 30}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--blue-80)' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 11,
                color: 'var(--gray-90)',
              }}
            >
              <span>sensitive ({a.base}+)</span>
              <span>quiet ({a.base + 30})</span>
            </div>
          </div>
          <div style={{ ...cardStyle, background: 'var(--gray-10)' }}>
            <div style={labelStyle}>Rule 2 \u00b7 cluster size</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-95)',
                marginTop: 4,
              }}
            >
              only alert when these failures share a topic / pattern
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginTop: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--gray-130)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {'\u2265'} {clusterMin} convos
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={clusterMin}
                  onChange={(e) => setClusterMin(+e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--blue-80)',
                    marginTop: 6,
                  }}
                />
                <div style={{ ...labelStyle, marginTop: 4 }}>min cluster size</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--gray-130)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  within {windowDays}d
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={windowDays}
                  onChange={(e) => setWindowDays(+e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--blue-80)',
                    marginTop: 6,
                  }}
                />
                <div style={{ ...labelStyle, marginTop: 4 }}>rolling window</div>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                background: '#fff',
                border: '1px dashed var(--gray-50)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--gray-115)',
                lineHeight: 1.55,
              }}
            >
              Today&rsquo;s cluster: <strong>23 convos</strong> \u00b7 all billing/refund \u00b7 within 2 days \u2192
              would still alert.
            </div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: 'var(--yellow-15)',
              border: '1px solid var(--yellow-50)',
            }}
          >
            <div style={labelStyle}>Replay verdict</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--gray-130)',
                letterSpacing: '-0.02em',
                marginTop: 6,
                lineHeight: 1.1,
              }}
            >
              {wouldAlert} alert{wouldAlert === 1 ? '' : 's'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-100)',
                marginTop: 4,
              }}
            >
              past 14 days, both rules
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--yellow-110)',
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              {verdictNote}
            </div>
            <button
              type="button"
              onClick={() => {
                setThreshold(recommendedThr);
                setClusterMin(recommendedClusterMin);
                setWindowDays(recommendedWindow);
              }}
              disabled={!criteriaDirty}
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: 600,
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                background: criteriaDirty ? '#fff' : 'var(--gray-15)',
                border: `1px solid ${criteriaDirty ? 'var(--yellow-100)' : 'var(--gray-30)'}`,
                color: criteriaDirty ? 'var(--yellow-110)' : 'var(--gray-90)',
                cursor: criteriaDirty ? 'pointer' : 'default',
                fontFamily: FF,
              }}
            >
              \u21bb Reset to recommended
            </button>
            <div
              style={{
                fontSize: 11,
                color: 'var(--gray-90)',
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              {'\u2265'} {recommendedThr} fails {'\u00b7'} {recommendedClusterMin} convos {'\u00b7'} {recommendedWindow}
              d
            </div>
          </div>
        </div>
      )}

      {/* Downstream */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 10,
          border: '1px dashed var(--gray-40)',
          background: 'var(--gray-10)',
        }}
      >
        <div style={labelStyle}>What changes downstream</div>
        <div
          style={{
            display: 'flex',
            gap: 18,
            marginTop: 8,
            flexWrap: 'wrap',
            fontSize: 13,
            color: 'var(--gray-115)',
            lineHeight: 1.55,
          }}
        >
          <span>
            {'\u21b3'} Affects <strong>{a.threatens}</strong>
          </span>
          {!isMonitor && (
            <span>
              {'\u21b3'} Rule 2 changes apply to every check inside <strong>{a.monitorName}</strong>
            </span>
          )}
          <span style={{ color: 'var(--gray-95)' }}>
            {'\u21b3'} Edit logged in goal history. Old band kept for 30 days for comparison.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TuneSensitivityPane;
