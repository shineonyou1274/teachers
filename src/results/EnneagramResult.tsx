import type { EnneagramResult as EResult } from '../utils/scoring';
import enneagramData from '../data/enneagram.json';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const COLORS = ['#EC4899', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#22C55E'];

export default function EnneagramResult({ result }: { result: unknown }) {
  const r = result as EResult;
  const types = (enneagramData as any).types;
  const primaryType = types.find((t: any) => t.id === r.primary);
  const wingType = types.find((t: any) => t.id === r.wing);

  const chartData = types.map((t: any) => ({
    name: `${t.id}`,
    fullName: `${t.id}번 ${t.name}`,
    score: r.scores[t.id] || 0,
    emoji: t.emoji,
  }));

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Hero */}
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
        <div style={{ fontSize: 56, animation: 'bounce-gentle 2.5s ease-in-out infinite' }}>
          {primaryType?.emoji}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginTop: 8,
          }}
        >
          {r.primary}번 유형: {primaryType?.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--cc-text-sub)', marginTop: 4 }}>
          날개: {r.wing}번 ({wingType?.name}) · {primaryType?.nickname}
        </div>

        {/* Bar chart */}
        <div style={{ marginTop: 24, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                formatter={((value: any, _: any, props: any) => [`${value}점`, props.payload.fullName]) as any}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--cc-shadow)' }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1200}>
                {chartData.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i]} opacity={r.top3.includes(i + 1) ? 1 : 0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 3 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {r.top3.map((typeId, i) => {
          const t = types.find((tt: any) => tt.id === typeId);
          return (
            <div
              key={typeId}
              style={{
                flex: 1,
                background: 'var(--cc-card)',
                borderRadius: 16,
                padding: 14,
                textAlign: 'center',
                boxShadow: 'var(--cc-shadow-soft)',
                border: i === 0 ? '2px solid var(--cc-pink)' : '1px solid var(--cc-border)',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--cc-text-sub)', marginBottom: 4 }}>
                {i === 0 ? '🥇 1위' : i === 1 ? '🥈 2위' : '🥉 3위'}
              </div>
              <div style={{ fontSize: 24 }}>{t?.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{t?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--cc-pink-deep)', fontWeight: 600 }}>
                {r.scores[typeId]}점
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail cards */}
      {primaryType && (
        <>
          <DetailCard
            title="🎠 교사로서의 강점"
            text={primaryType.teacherStrength}
            bg="linear-gradient(135deg, var(--cc-pink-light), var(--cc-lavender-light))"
            titleColor="var(--cc-pink-deep)"
          />
          <DetailCard
            title="🎈 성장 포인트"
            text={primaryType.teacherChallenge}
            bg="linear-gradient(135deg, var(--cc-sky-light), var(--cc-mint-light))"
            titleColor="var(--cc-sky-deep)"
          />
          <DetailCard
            title="🎯 선생님을 위한 팁"
            text={primaryType.tip}
            bg="linear-gradient(135deg, var(--cc-lemon-light), var(--cc-peach-light))"
            titleColor="var(--cc-peach-deep)"
          />
          <DetailCard
            title="🎪 학생 궁합"
            text={`좋은 궁합: ${primaryType.studentCompatibility.good}\n도전적 궁합: ${primaryType.studentCompatibility.bad}`}
            bg="linear-gradient(135deg, var(--cc-mint-light), var(--cc-sky-light))"
            titleColor="var(--cc-mint-deep)"
          />

          {/* Subtypes */}
          <div
            style={{
              background: 'var(--cc-card)',
              borderRadius: 20,
              padding: 20,
              boxShadow: 'var(--cc-shadow)',
              border: '1px solid var(--cc-border)',
              marginTop: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cc-lavender-deep)', marginBottom: 12 }}>
              🎡 3가지 하위유형
            </div>
            {primaryType.subtypes.map((st: any, i: number) => (
              <div
                key={i}
                style={{
                  background: 'var(--cc-bg)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: i < primaryType.subtypes.length - 1 ? 8 : 0,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{st.name}</div>
                <div style={{ fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.6 }}>{st.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DetailCard({ title, text, bg, titleColor }: { title: string; text: string; bg: string; titleColor: string }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: 18, marginTop: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: titleColor, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: 'var(--cc-text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{text}</div>
    </div>
  );
}
