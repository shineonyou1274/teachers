import Cloud from '../illustrations/Cloud';
import Balloon from '../illustrations/Balloon';

const SPARKLE_POSITIONS = [
  { top: '12%', left: '20%', delay: '0s', size: 6, color: 'var(--cc-lemon)' },
  { top: '35%', left: '85%', delay: '-1s', size: 4, color: 'var(--cc-pink)' },
  { top: '60%', left: '10%', delay: '-2s', size: 5, color: 'var(--cc-lavender)' },
  { top: '80%', left: '75%', delay: '-0.5s', size: 5, color: 'var(--cc-mint)' },
  { top: '45%', left: '50%', delay: '-1.5s', size: 4, color: 'var(--cc-peach)' },
];

export default function AnimatedBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Clouds */}
      <Cloud
        size={120}
        opacity={0.5}
        style={{
          position: 'absolute',
          top: '8%',
          animation: 'drift-right 45s linear infinite',
        }}
      />
      <Cloud
        size={90}
        opacity={0.35}
        style={{
          position: 'absolute',
          top: '22%',
          animation: 'drift-right-slow 65s linear infinite',
          animationDelay: '-20s',
        }}
      />
      <Cloud
        size={80}
        opacity={0.25}
        style={{
          position: 'absolute',
          top: '55%',
          animation: 'drift-right 55s linear infinite',
          animationDelay: '-35s',
        }}
      />

      {/* Balloons */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          animation: 'balloon-sway 6s ease-in-out infinite',
        }}
      >
        <Balloon color="var(--cc-pink)" style={{ position: 'absolute', left: 0, top: 0, animation: 'float-up-down 4s ease-in-out infinite' }} />
        <Balloon color="var(--cc-sky)" size={24} style={{ position: 'absolute', left: 20, top: -8, animation: 'float-up-down 4s ease-in-out infinite', animationDelay: '-1.2s' }} />
        <Balloon color="var(--cc-lemon)" size={22} style={{ position: 'absolute', left: 10, top: 8, animation: 'float-up-down 4s ease-in-out infinite', animationDelay: '-2.5s' }} />
        <Balloon color="var(--cc-lavender)" size={26} style={{ position: 'absolute', left: 32, top: 2, animation: 'float-up-down 4s ease-in-out infinite', animationDelay: '-0.6s' }} />
      </div>

      {/* Sparkles */}
      {SPARKLE_POSITIONS.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: s.color,
            borderRadius: '50%',
            animation: `twinkle 3s ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
