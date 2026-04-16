interface BalloonProps {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function Balloon({ color = 'var(--cc-pink)', size = 28, style }: BalloonProps) {
  const h = size * 1.2;
  return (
    <div
      style={{
        width: size,
        height: h,
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: h,
          background: color,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -size * 0.5,
          left: '50%',
          width: 1,
          height: size * 0.5,
          background: 'rgba(0,0,0,0.15)',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
}
