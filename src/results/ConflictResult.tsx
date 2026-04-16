import type { ConflictResult as CResult } from '../utils/scoring';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

const CONFLICT_META: Record<string, {
  emoji: string; color: string; colorHex: string; bg: string;
  title: string; keywords: string[];
  interpretation: string; bestWhen: string; riskWhen: string;
  teacherScenario: string;
  tips: Array<{ icon: string; text: string }>;
  growth: string;
}> = {
  경쟁: {
    emoji: '🎯', color: 'var(--cc-pink-deep)', colorHex: '#EC4899', bg: 'var(--cc-pink-light)',
    title: '결단력 있는 교실 리더',
    keywords: ['#빠른판단', '#추진력', '#원칙주의', '#결단력'],
    interpretation: '선생님은 갈등 상황에서 자신의 입장을 분명히 하고 신속하게 해결책을 제시하는 추진력의 소유자입니다. 학교 현장에서 빠른 결정이 필요한 순간 - 안전 문제, 학생 간 심각한 갈등, 행정 마감 등 - 에서 큰 힘을 발휘해요.\n\n이 스타일은 교사로서 명확한 경계를 설정하고 학급 규칙을 일관되게 유지하는 데 탁월합니다. 학생들은 선생님의 결정에 예측 가능성을 느끼고, 이것이 오히려 심리적 안정감을 줄 수 있어요.',
    bestWhen: '안전 관련 문제가 발생했을 때, 시간 압박이 있는 행정 결정, 명확한 원칙이 필요한 학급 운영 상황에서 빛을 발합니다.',
    riskWhen: '학부모 상담이나 동료 교사와의 의견 차이에서 너무 빠르게 결론을 내리면, 상대가 "내 말을 듣지 않는다"고 느낄 수 있어요.',
    teacherScenario: '수업 중 두 학생이 심하게 다투고 있다면, 선생님은 즉시 개입하여 상황을 정리하고 명확한 행동 지침을 제시할 거예요. 이 빠른 대응이 교실 안전을 지키는 힘입니다.',
    tips: [
      { icon: '👂', text: '동료/학부모와 대화할 때 "먼저 3분 듣기" 규칙 적용해보기' },
      { icon: '🤔', text: '결정 전 "이 문제가 긴급한가, 중요한가?" 구분하는 습관' },
      { icon: '💬', text: '"내 생각은 이런데, 선생님 의견은요?" 질문으로 대화 열기' },
      { icon: '🌡️', text: '감정 온도가 높을 때는 "잠시 생각할 시간을 갖겠습니다" 활용' },
    ],
    growth: '선생님의 결단력은 위기 상황에서 빛나는 리더십입니다. 여기에 경청의 기술을 더하면, 학생과 동료 모두에게 신뢰받는 교사가 됩니다.',
  },
  회피: {
    emoji: '🎈', color: 'var(--cc-lavender-deep)', colorHex: '#8B5CF6', bg: 'var(--cc-lavender-light)',
    title: '신중한 평화의 수호자',
    keywords: ['#신중함', '#전략적보류', '#평화유지', '#관찰자시선'],
    interpretation: '선생님은 갈등을 피하는 것이 아니라, 상황을 신중하게 관찰하고 적절한 타이밍을 기다리는 전략가입니다. 모든 갈등이 즉시 해결되어야 하는 것은 아니라는 지혜를 가지고 계세요.\n\n학교에서는 감정이 격해진 학생에게 시간을 주거나, 동료 간 민감한 이슈에서 성급한 개입을 자제하는 등 "기다림의 가치"를 아는 교사예요. 다만 정말 중요한 문제까지 미루게 되면 오히려 갈등이 커질 수 있어요.',
    bestWhen: '감정이 격해진 직후(냉각 시간 필요), 사소한 의견 차이, 시간이 지나면 자연스럽게 해결될 문제에서 현명한 선택이에요.',
    riskWhen: '학생 간 지속적인 따돌림, 자신의 권리가 침해되는 상황, 동료와의 역할 경계 문제처럼 방치하면 악화되는 갈등에서는 주의가 필요해요.',
    teacherScenario: '학부모가 불만을 제기했을 때, 선생님은 즉각 반박하기보다 "말씀 감사합니다, 확인 후 연락드리겠습니다"라고 시간을 확보할 거예요. 이 전략적 보류가 더 나은 해결을 가져올 수 있어요.',
    tips: [
      { icon: '📝', text: '"이건 보류해도 되는 문제인가?" 체크리스트 만들어 판단 기준 세우기' },
      { icon: '⏰', text: '미룬 갈등에 "재확인 날짜"를 달력에 표시해두기' },
      { icon: '🗣️', text: '주 1회 작은 의견이라도 회의에서 먼저 발언하는 연습' },
      { icon: '💪', text: '"지금 말하지 않으면 더 커질까?" 자문하는 습관 기르기' },
    ],
    growth: '전략적 보류와 진짜 회피를 구분하는 것이 핵심입니다. "이 상황은 기다리는 게 맞아"와 "말하기 불편해서 피하는 거야"를 구분할 수 있다면, 신중함이 진정한 지혜가 됩니다.',
  },
  타협: {
    emoji: '🎠', color: 'var(--cc-peach-deep, #C4622D)', colorHex: '#F97316', bg: 'var(--cc-peach-light)',
    title: '실용적인 중재 전문가',
    keywords: ['#실용주의', '#효율적해결', '#윈윈전략', '#균형감각'],
    interpretation: '선생님은 "완벽한 해결"보다 "모두가 수용할 수 있는 해결"을 추구하는 실용적인 문제해결자입니다. 현실적인 제약 속에서 최선의 합의점을 찾는 능력이 뛰어나요.\n\n학교 현장은 이상과 현실 사이의 타협이 끊임없이 필요한 곳이에요. 수업 시수, 업무 분장, 행사 일정 등에서 선생님의 타협 능력은 조직을 원활하게 돌아가게 하는 윤활유 역할을 합니다.',
    bestWhen: '시간 제약이 있는 업무 분장 논의, 학부모와의 현실적 합의, 동료 간 의견 조율이 필요한 회의에서 가장 효과적이에요.',
    riskWhen: '학생 인권이나 안전처럼 원칙을 지켜야 하는 상황, 또는 근본적인 문제 해결이 필요한 경우에 "적당한 타협"은 오히려 문제를 키울 수 있어요.',
    teacherScenario: '업무 분장 회의에서 아무도 맡고 싶지 않은 업무가 있을 때, 선생님은 "제가 A를 맡을 테니, B는 다른 분이 해주시면 어떨까요?"라는 현실적 제안을 할 거예요.',
    tips: [
      { icon: '⚖️', text: '"이것은 타협해도 되는 문제인가, 원칙을 지켜야 하는 문제인가?" 구분하기' },
      { icon: '🔍', text: '타협 전에 "양쪽이 정말 원하는 것"을 한 번 더 탐색해보기' },
      { icon: '📋', text: '타협안이 "임시방편"이 아닌 "지속 가능한 합의"인지 점검하기' },
      { icon: '🌱', text: '가끔은 시간을 들여 "협력" 모드로 더 깊은 해결책 찾아보기' },
    ],
    growth: '타협은 효율적이지만, 모든 문제가 50:50 분배로 해결되는 것은 아닙니다. 때로는 양쪽 모두 100%를 얻는 "협력적 해결"이 가능한지 한 번 더 고민해보세요.',
  },
  협력: {
    emoji: '🎡', color: 'var(--cc-mint-deep)', colorHex: '#22C55E', bg: 'var(--cc-mint-light)',
    title: '깊이 있는 최적 해결사',
    keywords: ['#깊은대화', '#창의적해결', '#모두의만족', '#시너지추구'],
    interpretation: '선생님은 갈등을 "해결해야 할 문제"가 아니라 "더 나은 방법을 찾는 기회"로 봅니다. 모든 당사자의 진짜 필요를 이해하고, 창의적인 해결책을 함께 만들어가는 것을 추구해요.\n\n이 접근법은 교사-학생 관계, 학부모 상담, 동료 협업에서 깊은 신뢰를 쌓는 토대가 됩니다. "왜 그렇게 생각하세요?"라는 질문으로 대화를 여는 선생님 덕분에, 주변 사람들은 진심으로 존중받는 느낌을 받아요.',
    bestWhen: '장기적인 동료 관계 구축, 학생의 반복적 행동 문제 근본 원인 탐색, 학부모와의 깊은 신뢰 관계가 필요할 때 가장 빛나요.',
    riskWhen: '당장 결정이 필요한 긴급 상황, 모든 작은 이슈에 깊은 대화를 시도하면 시간과 에너지가 부족해질 수 있어요.',
    teacherScenario: '학생이 수업 중 반복적으로 방해 행동을 할 때, 선생님은 방과 후 1:1 대화를 통해 "무엇이 힘들어서 그런 행동이 나오는 걸까?"라는 근본 원인을 함께 탐색할 거예요.',
    tips: [
      { icon: '⏱️', text: '"이 문제는 깊은 대화가 필요한가, 빠른 결정이 나은가?" 먼저 판단하기' },
      { icon: '🎯', text: '모든 갈등에 100% 에너지를 쏟지 말고 중요도에 따라 배분하기' },
      { icon: '📐', text: '협력적 해결의 "시간 상한선" 정하기 - 30분 넘으면 타협 모드로' },
      { icon: '💡', text: '작은 갈등은 타협으로, 큰 갈등은 협력으로 - 전략적 선택하기' },
    ],
    growth: '깊이 있는 해결을 추구하는 것은 교사의 가장 이상적인 모습이에요. 다만 모든 순간에 완벽한 합의를 추구하면 지칠 수 있으니, "에너지 투자 대비 효과"를 고려하는 현실 감각을 키워보세요.',
  },
  수용: {
    emoji: '🎪', color: 'var(--cc-sky-deep, #2563EB)', colorHex: '#3B82F6', bg: 'var(--cc-sky-light, #DBEAFE)',
    title: '따뜻한 관계 중심 교사',
    keywords: ['#관계우선', '#따뜻한배려', '#화합의힘', '#경청의달인'],
    interpretation: '선생님은 관계의 가치를 누구보다 잘 아는 교사입니다. 갈등 상황에서 "이기는 것"보다 "함께 하는 것"을 선택하는 따뜻한 마음의 소유자예요.\n\n학교에서 이 성향은 학생들에게 안전하고 수용적인 교실 분위기를 만들어줍니다. 동료 교사들도 선생님과 함께하면 편안함을 느끼고, 학부모들도 선생님의 경청하는 자세에 신뢰를 보내요. 다만 자신의 필요나 의견을 너무 자주 양보하면, 내면에 불만이 쌓일 수 있어요.',
    bestWhen: '관계 유지가 결과보다 중요한 상황, 상대가 강한 감정을 표출할 때 먼저 수용해주는 것, 사소한 의견 차이에서 분위기를 부드럽게 만들 때 효과적이에요.',
    riskWhen: '자신의 수업 철학이나 교육관이 위협받을 때, 부당한 업무가 반복적으로 전가될 때, 학생의 안전을 위해 단호해야 할 때는 수용이 오히려 해가 될 수 있어요.',
    teacherScenario: '동료가 "이 업무를 대신 맡아줄 수 있어요?"라고 부탁하면, 선생님은 관계를 생각해 수락할 가능성이 높아요. 한두 번은 괜찮지만, 패턴이 되면 번아웃의 원인이 됩니다.',
    tips: [
      { icon: '🪞', text: '"나는 정말 괜찮은 건가, 아니면 거절이 불편해서 수락한 건가?" 자문하기' },
      { icon: '🛡️', text: '"이번 한 번만"이 3번 이상 반복되면 패턴 점검하기' },
      { icon: '✋', text: '작은 것부터 연습: "생각해보고 답할게요" 한 박자 쉬기' },
      { icon: '📣', text: '주 1회 자신의 의견을 먼저 말하는 연습 - "저는 이렇게 생각해요"' },
    ],
    growth: '따뜻한 수용은 교실을 안전한 공간으로 만드는 힘이에요. 여기에 "건강한 자기 주장"을 더하면, 자신도 학생도 모두 지킬 수 있는 교사가 됩니다.',
  },
};

export default function ConflictResult({ result }: { result: unknown }) {
  const r = result as CResult;
  const primaryStyle = r.primary;
  const meta = CONFLICT_META[primaryStyle];

  const chartData = Object.entries(r.styles).map(([name, score]) => ({
    name,
    value: Math.round((score / 5) * 100),
    raw: score.toFixed(1),
  }));

  // Sort styles by score descending
  const sorted = Object.entries(r.styles).sort((a, b) => b[1] - a[1]);
  const secondary = sorted.length > 1 ? sorted[1] : null;

  // Flexibility score: how balanced are the 5 styles?
  const values = sorted.map(s => s[1]);
  const maxVal = values[0];
  const minVal = values[values.length - 1];
  const range = maxVal - minVal;
  const flexibility = range < 1.0 ? 'high' : range < 2.0 ? 'mid' : 'low';
  const flexMsg: Record<string, string> = {
    high: '선생님은 다양한 갈등해결 스타일을 골고루 사용할 수 있는 유연한 분입니다. 상황에 따라 적절한 전략을 선택하는 능력이 뛰어나요.',
    mid: '선생님은 주된 스타일이 있지만, 상황에 따라 다른 접근도 시도하는 적응력을 가지고 있어요. 덜 사용하는 스타일을 의식적으로 연습하면 더 다양한 상황에 대처할 수 있습니다.',
    low: '선생님은 하나의 스타일에 강하게 의존하는 경향이 있어요. 주 스타일이 빛나는 상황에서는 탁월하지만, 다른 접근이 필요한 순간에는 의식적으로 새로운 전략을 시도해보세요.',
  };

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Hero card with radar chart */}
      <div
        style={{
          background: 'var(--cc-card)',
          borderRadius: 24,
          padding: '28px 20px',
          boxShadow: 'var(--cc-shadow)',
          border: '1.5px solid var(--cc-border)',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 64, animation: 'bounce-gentle 2.5s ease-in-out infinite' }}>{meta.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: meta.color, marginTop: 8 }}>
          {primaryStyle}
        </div>
        <div style={{ fontSize: 14, color: 'var(--cc-text-sub)', marginTop: 4 }}>
          주 갈등해결 스타일 · {meta.title}
        </div>

        {/* Keywords */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 14 }}>
          {meta.keywords.map((kw, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 14,
              background: `${meta.colorHex}15`, color: meta.colorHex,
            }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Radar chart */}
        <div style={{ marginTop: 24, height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="var(--cc-border)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--cc-text)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number, _: string, props: any) => [`${props.payload.raw}점`, props.payload.name]}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--cc-shadow)' }}
              />
              <Radar
                dataKey="value"
                stroke={meta.colorHex}
                fill={meta.colorHex}
                fillOpacity={0.15}
                strokeWidth={2}
                animationDuration={1200}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rich interpretation */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)',
        marginBottom: 12, borderLeft: `4px solid ${meta.colorHex}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{meta.title}</div>
        {meta.interpretation.split('\n\n').map((p, i) => (
          <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--cc-text)', marginBottom: i === 0 ? 10 : 0 }}>{p}</p>
        ))}
      </div>

      {/* Best when / Risk when */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{
          flex: 1, background: 'var(--cc-mint-light)', borderRadius: 16, padding: '14px 12px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-mint-deep)', marginBottom: 6 }}>✅ 빛나는 순간</div>
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>{meta.bestWhen}</div>
        </div>
        <div style={{
          flex: 1, background: 'var(--cc-pink-light)', borderRadius: 16, padding: '14px 12px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-pink-deep)', marginBottom: 6 }}>⚠️ 주의할 순간</div>
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>{meta.riskWhen}</div>
        </div>
      </div>

      {/* Teacher scenario */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cc-peach-light), var(--cc-lemon-light))',
        borderRadius: 20, padding: '20px 16px', marginBottom: 12,
      }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-peach-deep, #C4622D)', marginBottom: 4 }}>🏫 교실 시나리오</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta.teacherScenario}</div>
        </div>
      </div>

      {/* Style score cards */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)', marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 5가지 스타일 점수</div>
        {sorted.map(([name, score], i) => {
          const info = CONFLICT_META[name];
          const pct = (score / 5) * 100;
          const isPrimary = name === primaryStyle;
          return (
            <div key={name} style={{
              padding: '10px 0',
              borderBottom: i < sorted.length - 1 ? '1px solid var(--cc-border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{info.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: isPrimary ? 800 : 600, flex: 1 }}>
                  {name}
                  {isPrimary && <span style={{ fontSize: 10, color: meta.colorHex, marginLeft: 6 }}>● 주 스타일</span>}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: info.colorHex }}>{score.toFixed(1)}</span>
              </div>
              <div style={{ height: 8, background: 'var(--cc-bg)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`, borderRadius: 8,
                  background: isPrimary ? info.colorHex : `${info.colorHex}60`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)', marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🛠️ {primaryStyle} 스타일 성장 팁</div>
        {meta.tips.map((tip, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
            borderBottom: i < meta.tips.length - 1 ? '1px solid var(--cc-border)' : 'none',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.icon}</span>
            <span style={{ fontSize: 13, lineHeight: 1.6 }}>{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Secondary style note */}
      {secondary && (
        <div style={{
          background: 'var(--cc-card)', borderRadius: 16, padding: '14px 16px',
          border: '1px solid var(--cc-border)', marginBottom: 12,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-text-sub)', marginBottom: 4 }}>
            {CONFLICT_META[secondary[0]].emoji} 보조 스타일: {secondary[0]}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--cc-text-sub)' }}>
            두 번째로 높은 점수의 스타일이에요. 주 스타일이 적합하지 않은 상황에서 자연스럽게 이 접근법을 사용하게 됩니다.
          </div>
        </div>
      )}

      {/* Growth */}
      <div style={{
        background: meta.bg, borderRadius: 16, padding: '14px 16px',
        textAlign: 'center', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: meta.color, marginBottom: 4 }}>🌱 성장 포인트</div>
        <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta.growth}</div>
      </div>

      {/* Flexibility analysis */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 16, padding: '16px',
        border: '1px solid var(--cc-border)', marginBottom: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
          🔄 갈등해결 유연성: {flexibility === 'high' ? '높음' : flexibility === 'mid' ? '보통' : '낮음'}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--cc-text-sub)' }}>{flexMsg[flexibility]}</div>
      </div>

      {/* Positive note */}
      <div style={{
        padding: '14px 16px', borderRadius: 16, background: 'var(--cc-bg)',
        fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.7, textAlign: 'center',
      }}>
        💡 갈등은 나쁜 것이 아니에요. 서로 다른 의견이 만나는 자연스러운 과정입니다. 어떤 스타일이든 적절한 상황에서 사용하면 모두 훌륭한 전략이 됩니다.
      </div>
    </div>
  );
}
