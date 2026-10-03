interface BandChartProps {
  data: number[];
  baseline: number;
  variance: number;
  currentVar: number;
  w?: number;
  h?: number;
}

export const BandChart = ({ data, baseline, variance, currentVar, w = 720, h = 200 }: BandChartProps) => {
  const padX = 28;
  const padY = 22;
  const W = w - padX * 2;
  const H = h - padY * 2;
  const max = Math.max(...data, baseline + Math.max(variance, currentVar) + 4);
  const min = Math.min(...data, baseline - Math.max(variance, currentVar) - 4);
  const y = (v: number) => padY + H - ((v - min) / (max - min || 1)) * H;
  const x = (i: number) => padX + (W / (data.length - 1)) * i;
  const linePts = data.map((v, i) => [x(i), y(v)] as const);
  const linePath = linePts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const crossings = data.map((v, i) => (Math.abs(v - baseline) > currentVar ? i : -1)).filter((i) => i >= 0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <rect x={0} y={0} width={w} height={h} fill="#FAFBFE" />
      {/* Current band */}
      <rect
        x={padX}
        y={y(baseline + variance)}
        width={W}
        height={Math.max(0, y(baseline - variance) - y(baseline + variance))}
        fill="none"
        stroke="var(--gray-50)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Proposed band */}
      <rect
        x={padX}
        y={y(baseline + currentVar)}
        width={W}
        height={Math.max(0, y(baseline - currentVar) - y(baseline + currentVar))}
        fill="rgba(252,237,146,0.35)"
        stroke="var(--yellow-100)"
        strokeWidth="1"
      />
      {/* Baseline */}
      <line
        x1={padX}
        y1={y(baseline)}
        x2={w - padX}
        y2={y(baseline)}
        stroke="var(--gray-90)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <text x={w - padX} y={y(baseline) - 4} textAnchor="end" fontSize="10" fill="var(--gray-95)" fontFamily="Inter">
        baseline {baseline}
      </text>
      <path d={linePath} fill="none" stroke="var(--gray-130)" strokeWidth="1.6" />
      {linePts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={crossings.includes(i) ? 4.5 : 2.5}
          fill={crossings.includes(i) ? '#9E181E' : '#fff'}
          stroke="var(--gray-130)"
          strokeWidth="1.4"
        />
      ))}
      <text x={padX} y={padY - 8} fontSize="11" fill="var(--gray-115)" fontFamily="Inter" fontWeight="600">
        {crossings.length} day{crossings.length === 1 ? '' : 's'} would have alerted at \u00b1
        {currentVar}
      </text>
    </svg>
  );
};

interface ClusterBandChartProps {
  data: number[];
  baseline: number;
  threshold: number;
  w?: number;
  h?: number;
}

export const ClusterBandChart = ({ data, baseline, threshold, w = 720, h = 200 }: ClusterBandChartProps) => {
  const padX = 28;
  const padY = 22;
  const W = w - padX * 2;
  const H = h - padY * 2;
  const max = Math.max(...data, threshold + 5);
  const barW = W / data.length - 4;
  const y = (v: number) => padY + H - (v / (max || 1)) * H;
  const overCount = data.filter((v) => v >= threshold).length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <rect x={0} y={0} width={w} height={h} fill="#FAFBFE" />
      <rect
        x={padX}
        y={padY}
        width={W}
        height={Math.max(0, y(threshold) - padY)}
        fill="rgba(252,237,146,0.30)"
        stroke="var(--yellow-100)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <line
        x1={padX}
        y1={y(baseline)}
        x2={w - padX}
        y2={y(baseline)}
        stroke="var(--gray-90)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <text x={w - padX} y={y(baseline) - 3} textAnchor="end" fontSize="10" fill="var(--gray-95)" fontFamily="Inter">
        baseline ~{baseline}/day
      </text>
      <line x1={padX} y1={y(threshold)} x2={w - padX} y2={y(threshold)} stroke="var(--yellow-110)" strokeWidth="1.6" />
      <text
        x={w - padX}
        y={y(threshold) - 4}
        textAnchor="end"
        fontSize="11"
        fill="var(--yellow-110)"
        fontFamily="Inter"
        fontWeight="600"
      >
        threshold {'\u2265'} {threshold}/day
      </text>
      {data.map((v, i) => {
        const cx = padX + (W / data.length) * i + 2;
        const over = v >= threshold;
        return (
          <rect
            key={i}
            x={cx}
            y={y(v)}
            width={barW}
            height={Math.max(0, padY + H - y(v))}
            fill={over ? '#9E181E' : 'var(--gray-25)'}
            stroke={over ? '#9E181E' : 'var(--gray-50)'}
            strokeWidth="1"
          />
        );
      })}
      <text x={padX} y={padY - 8} fontSize="11" fill="var(--gray-115)" fontFamily="Inter" fontWeight="600">
        {overCount} day{overCount === 1 ? '' : 's'} would have alerted at {'\u2265'} {threshold}
      </text>
    </svg>
  );
};
