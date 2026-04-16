import type { CSSProperties } from 'react';

interface CloudProps {
  size?: number;
  opacity?: number;
  style?: CSSProperties;
  className?: string;
}

export default function Cloud({ size = 100, opacity = 0.5, style, className }: CloudProps) {
  const w = size;
  const h = size * 0.4;
  const bumpBig = size * 0.5;
  const bumpSmall = size * 0.36;

  return (
    <div className={className} style={{ opacity, ...style }}>
      <div
        style={{
          width: w,
          height: h,
          background: 'white',
          borderRadius: w / 2,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: bumpBig,
            height: bumpBig,
            background: 'white',
            borderRadius: '50%',
            top: -bumpBig * 0.5,
            left: w * 0.15,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: bumpSmall,
            height: bumpSmall,
            background: 'white',
            borderRadius: '50%',
            top: -bumpSmall * 0.5,
            left: w * 0.48,
          }}
        />
      </div>
    </div>
  );
}
