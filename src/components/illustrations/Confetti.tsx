import { useEffect, useState } from 'react';

const COLORS = ['#F9A8D4', '#93C5FD', '#C4B5FD', '#86EFAC', '#FDBA74', '#FDE68A', '#EC4899'];

interface Piece {
  id: number;
  left: string;
  bg: string;
  w: number;
  h: number;
  dur: string;
  delay: string;
  round: boolean;
}

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const items: Piece[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bg: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: Math.random() * 8 + 6,
      h: Math.random() * 8 + 6,
      dur: `${Math.random() * 2 + 2}s`,
      delay: `${Math.random() * 0.5}s`,
      round: i % 2 === 0,
    }));
    setPieces(items);
    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: -10,
            left: p.left,
            width: p.w,
            height: p.h,
            background: p.bg,
            borderRadius: p.round ? '50%' : '2px',
            animation: `confetti-fall ${p.dur} ease-in forwards`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
