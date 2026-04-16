interface FerrisWheelProps {
  size?: number;
}

export default function FerrisWheel({ size = 80 }: FerrisWheelProps) {
  const cabins = [
    { angle: 0, fill: '#FDF2F8', stroke: '#F9A8D4' },
    { angle: 45, fill: '#EFF6FF', stroke: '#93C5FD' },
    { angle: 90, fill: '#FFF7ED', stroke: '#FDBA74' },
    { angle: 135, fill: '#FEFCE8', stroke: '#FDE68A' },
    { angle: 180, fill: '#F0FDF4', stroke: '#86EFAC' },
    { angle: 225, fill: '#F5F3FF', stroke: '#C4B5FD' },
    { angle: 270, fill: '#FDF2F8', stroke: '#EC4899' },
    { angle: 315, fill: '#EFF6FF', stroke: '#93C5FD' },
  ];

  const r = 30;
  const cx = 40;
  const cy = 40;

  return (
    <div style={{ position: 'relative', width: size, height: size + 20 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        style={{ animation: 'spin-slow 20s linear infinite' }}
      >
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--cc-lavender)" strokeWidth="2" />
        {[0, 45, 90, 135].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + r * Math.cos(rad);
          const y1 = cy + r * Math.sin(rad);
          const x2 = cx - r * Math.cos(rad);
          const y2 = cy - r * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--cc-lavender)"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
        {cabins.map(({ angle, fill, stroke }) => {
          const rad = (angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <circle
              key={angle}
              cx={x} cy={y} r="5"
              fill={fill}
              stroke={stroke}
              strokeWidth="1"
            />
          );
        })}
        <circle cx={cx} cy={cy} r="3" fill="var(--cc-lavender-deep)" opacity="0.5" />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '20px solid var(--cc-lavender)',
          opacity: 0.7,
        }}
      />
    </div>
  );
}
