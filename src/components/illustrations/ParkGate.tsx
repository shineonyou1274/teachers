import FerrisWheel from './FerrisWheel';

const FLAG_COLORS = [
  'var(--cc-pink)', 'var(--cc-sky)', 'var(--cc-lemon)',
  'var(--cc-lavender)', 'var(--cc-mint)', 'var(--cc-peach)',
];

const LIGHT_COLORS = [
  'var(--cc-lemon)', 'var(--cc-pink)', 'var(--cc-sky)',
  'var(--cc-mint)', 'var(--cc-lavender)',
];

export default function ParkGate() {
  return (
    <div style={{ position: 'relative', width: 320, height: 200, margin: '0 auto 20px' }}>
      {/* Arch */}
      <div
        style={{
          width: 280,
          height: 140,
          border: '4px solid var(--cc-pink)',
          borderBottom: 'none',
          borderRadius: '140px 140px 0 0',
          margin: '0 auto',
          position: 'relative',
          background: 'linear-gradient(180deg, var(--cc-pink-light) 0%, transparent 100%)',
        }}
      >
        {/* Pillars */}
        {['left', 'right'].map(side => (
          <div
            key={side}
            style={{
              position: 'absolute',
              bottom: 0,
              [side === 'left' ? 'left' : 'right']: -4,
              width: 8,
              height: 50,
              background: 'linear-gradient(180deg, var(--cc-pink), var(--cc-peach))',
              borderRadius: 4,
            }}
          />
        ))}

        {/* Bunting flags */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 220,
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 22,
                background: FLAG_COLORS[i % FLAG_COLORS.length],
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                animation: `wave-flag 2s ease-in-out infinite`,
                animationDelay: i % 2 === 0 ? '0s' : '-1s',
              }}
            />
          ))}
        </div>

        {/* Lights */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 14,
          }}
        >
          {LIGHT_COLORS.map((color, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: color,
                animation: `gate-lights 1.5s ease-in-out infinite`,
                animationDelay: `${-i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* WELCOME text */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--cc-pink-deep)',
            letterSpacing: 4,
            whiteSpace: 'nowrap',
          }}
        >
          WELCOME
        </div>
      </div>

      {/* Ferris wheel */}
      <div style={{ position: 'absolute', right: -10, bottom: 10 }}>
        <FerrisWheel size={80} />
      </div>
    </div>
  );
}
