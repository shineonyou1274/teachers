import type { BurnoutResult as BResult } from '../utils/scoring';
import burnoutData from '../data/burnout.json';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

const LEVEL_COLORS: Record<string, string> = {
  low: 'var(--cc-mint-deep)',
  mid: 'var(--cc-peach-deep)',
  high: 'var(--cc-pink-deep)',
  critical: '#7C2D12',
};

const LEVEL_BG: Record<string, string> = {
  low: 'var(--cc-mint-light)',
  mid: 'var(--cc-peach-light)',
  high: 'var(--cc-pink-light)',
  critical: '#FFF7ED',
};

export default function BurnoutResult({ result }: { result: unknown }) {
  const r = result as BResult;
  const overall = (burnoutData as any).overallLevels[r.overallLevel];
  const subscalesMeta = (burnoutData as any).subscalesMeta;
  const adviceData = (burnoutData as any).advice;

  const radarData = Object.entries(r.subscales).map(([name, sub]) => ({
    name: name.replace('행정업무 부담감', '행정부담'),
    fullName: name,
    value: Math.round(sub.pct * 100),
    level: sub.level,
  }));

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Overall level */}
      <div
        style={{
          background: 'var(--cc-card)',
          borderRadius: 24,
          padding: '28px 24px',
          boxShadow: 'var(--cc-shadow)',
          border: '1.5px solid var(--cc-border)',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 48 }}>{overall?.emoji}</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: overall?.color,
            marginTop: 8,
          }}
        >
          소진 수준: {overall?.label}
        </div>
        <div style={{ fontSize: 13, color: 'var(--cc-text-sub)', marginTop: 4, lineHeight: 1.6 }}>
          {overall?.desc}
        </div>
        <div
          style={{
            marginTop: 16,
            padding: '10px 20px',
            background: overall?.bg || 'var(--cc-bg)',
            borderRadius: 12,
            fontSize: 13,
            color: overall?.color,
            fontWeight: 600,
          }}
        >
          총점: {r.total} / {r.totalMax} ({Math.round(r.totalPct * 100)}%)
        </div>

        {/* Radar chart */}
        <div style={{ marginTop: 24, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--cc-border)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--cc-text)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number, _: string, props: any) => [`${value}%`, props.payload.fullName]}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--cc-shadow)' }}
              />
              <Radar
                dataKey="value"
                stroke="var(--cc-pink-deep)"
                fill="var(--cc-pink)"
                fillOpacity={0.2}
                strokeWidth={2}
                animationDuration={1200}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscale details + advice */}
      {Object.entries(r.subscales)
        .sort((a, b) => b[1].pct - a[1].pct)
        .map(([name, sub]) => {
          const meta = subscalesMeta[name];
          const advice = adviceData[name]?.[sub.level];
          return (
            <div
              key={name}
              style={{
                background: 'var(--cc-card)',
                borderRadius: 16,
                padding: 18,
                boxShadow: 'var(--cc-shadow-soft)',
                border: '1px solid var(--cc-border)',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{meta?.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 11, color: 'var(--cc-text-sub)' }}>{meta?.desc}</div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: LEVEL_BG[sub.level],
                    color: LEVEL_COLORS[sub.level],
                  }}
                >
                  {meta?.levelLabels?.[sub.level] || sub.level}
                </span>
              </div>

              {/* Score bar */}
              <div style={{ height: 8, background: 'var(--cc-bg)', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${sub.pct * 100}%`,
                    borderRadius: 8,
                    background: meta?.color || 'var(--cc-pink)',
                    transition: 'width 1s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--cc-text-sub)', marginBottom: 8 }}>
                {sub.score} / {sub.maxScore} ({Math.round(sub.pct * 100)}%)
              </div>

              {/* Advice */}
              {advice && advice.actions && (
                <div style={{ background: 'var(--cc-bg)', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-pink-deep)', marginBottom: 6 }}>
                    🎪 맞춤 처방
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {advice.actions.map((action: string, i: number) => (
                      <li key={i} style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--cc-text)', marginBottom: 4 }}>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
