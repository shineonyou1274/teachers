import type { ProQOLResult as PResult } from '../utils/scoring';

const LEVEL_LABELS = { low: '낮음', mid: '보통', high: '높음' };

type Level = 'low' | 'mid' | 'high';

const SUBSCALE_INFO: Record<'cs' | 'bo' | 'sts', {
  name: string; emoji: string; color: string; colorHex: string; bg: string; arcColor: string;
  desc: string;
  levels: Record<Level, {
    title: string;
    interpretation: string;
    tips: Array<{ icon: string; text: string }>;
  }>;
}> = {
  cs: {
    name: '공감만족', emoji: '💚', color: 'var(--cc-mint-deep)', colorHex: '#059669', bg: 'var(--cc-mint-light)', arcColor: '#86EFAC',
    desc: '타인을 돕는 일에서 얻는 긍정적 에너지',
    levels: {
      high: {
        title: '돌봄의 기쁨이 가득한 상태',
        interpretation: '선생님은 학생을 가르치고 돌보는 일에서 깊은 보람과 에너지를 얻고 있습니다. 교직을 "소명"으로 느끼며, 학생의 성장이 곧 자신의 행복이에요. 이 높은 공감만족은 번아웃으로부터 보호하는 강력한 방패 역할을 합니다.',
        tips: [
          { icon: '📔', text: '보람 있는 순간을 기록하기 - 힘든 날 꺼내볼 감사 일기' },
          { icon: '🔄', text: '이 에너지를 동료에게도 나누기 - 작은 격려가 큰 힘이 돼요' },
          { icon: '⚠️', text: '공감만족이 높아도 자기 돌봄을 잊지 마세요 - 기쁨도 에너지를 씁니다' },
        ],
      },
      mid: {
        title: '안정적인 직무 만족 상태',
        interpretation: '교직에서 적당한 만족을 느끼고 있지만, 특별한 보람을 느끼는 순간이 예전보다 줄었을 수 있어요. 이것은 자연스러운 상태이며, 의식적으로 보람의 순간을 알아차리는 연습이 도움이 됩니다.',
        tips: [
          { icon: '🔍', text: '이번 주 가장 보람 있었던 순간 1가지 떠올려보기' },
          { icon: '🌟', text: '학생의 작은 변화에 주목하기 - 간과하기 쉬운 성장의 순간들' },
          { icon: '🤝', text: '동료와 좋은 경험 공유하기 - 말하면서 보람이 되살아나요' },
        ],
      },
      low: {
        title: '돌봄의 의미를 재발견할 시간',
        interpretation: '현재 교직에서 보람을 느끼기 어려운 상태예요. 이것은 선생님이 나쁜 교사라는 뜻이 아니라, 마음의 에너지가 바닥나고 있다는 신호입니다. 과도한 업무, 지지 부족, 반복되는 어려움이 원인일 수 있어요. 지금은 자기 자신을 돌보는 것이 최우선입니다.',
        tips: [
          { icon: '🧭', text: '처음 교사가 되고 싶었던 이유를 떠올려보기' },
          { icon: '💬', text: '신뢰할 수 있는 동료나 전문가와 솔직한 대화 나누기' },
          { icon: '🌿', text: '퇴근 후 완전한 쉼의 시간 확보하기 - 일 관련 생각 내려놓기' },
          { icon: '📅', text: '작은 것부터 - 이번 주 하나의 수업만 즐겁게 준비해보기' },
        ],
      },
    },
  },
  bo: {
    name: '번아웃', emoji: '🔥', color: 'var(--cc-peach-deep)', colorHex: '#EA580C', bg: 'var(--cc-peach-light)', arcColor: '#FDBA74',
    desc: '업무 과부하로 인한 소진과 피로감',
    levels: {
      high: {
        title: '심각한 소진 상태 — 즉각적 돌봄 필요',
        interpretation: '선생님의 번아웃 수준이 높습니다. 만성적인 피로, 무력감, 냉소적 태도가 나타날 수 있어요. 이것은 선생님의 의지력이 약해서가 아니라, 너무 오래 너무 많은 것을 감당해왔기 때문입니다. 지금 당장 무언가를 내려놓는 것이 필요해요.',
        tips: [
          { icon: '🚨', text: '"아무것도 하고 싶지 않다"는 정상적인 반응 - 자신을 탓하지 마세요' },
          { icon: '✂️', text: '이번 주 포기할 수 있는 업무 1가지를 찾아 과감히 내려놓기' },
          { icon: '🏥', text: '동료 교사, 관리자, 또는 전문 상담사에게 현재 상태 솔직히 말하기' },
          { icon: '😴', text: '수면, 식사, 운동 등 기본적인 생활 리듬부터 점검하기' },
          { icon: '📵', text: '퇴근 후 업무 메신저 알림 끄기 - 경계 설정이 생존 전략입니다' },
        ],
      },
      mid: {
        title: '경고등이 켜진 상태',
        interpretation: '번아웃의 초기 징후가 나타나고 있어요. 아직은 관리 가능한 수준이지만, 지금 개입하지 않으면 악화될 수 있습니다. "좀 피곤하지만 괜찮아"라는 생각이 든다면, 그것 자체가 번아웃의 신호일 수 있어요.',
        tips: [
          { icon: '📊', text: '현재 업무량 점검 - "꼭 해야 하는 것" vs "하면 좋은 것" 구분하기' },
          { icon: '🛑', text: '새로운 업무 요청에 "생각해보겠습니다" 한 박자 쉬기' },
          { icon: '🌅', text: '주 2회 이상 칼퇴근 실천하기 - 완벽하지 않아도 괜찮아요' },
          { icon: '🎯', text: '에너지를 채우는 활동(취미, 운동, 사교) 주간 일정에 넣기' },
        ],
      },
      low: {
        title: '건강한 에너지 관리 상태',
        interpretation: '번아웃 수준이 낮아 건강한 상태를 유지하고 있어요. 업무와 휴식 사이의 균형을 잘 잡고 있으며, 자기 돌봄의 습관이 잘 자리잡혀 있을 가능성이 높습니다. 현재의 좋은 패턴을 유지하세요.',
        tips: [
          { icon: '🔄', text: '현재의 에너지 관리 비결을 동료와 나누기' },
          { icon: '📝', text: '번아웃 수준이 낮은 비결이 무엇인지 스스로 기록해두기' },
          { icon: '👀', text: '주변에 지쳐보이는 동료에게 먼저 안부 묻기' },
        ],
      },
    },
  },
  sts: {
    name: '이차외상', emoji: '💜', color: 'var(--cc-lavender-deep)', colorHex: '#7C3AED', bg: 'var(--cc-lavender-light)', arcColor: '#C4B5FD',
    desc: '타인의 외상 경험에 노출되어 겪는 간접 트라우마',
    levels: {
      high: {
        title: '공감의 부작용 — 전문 도움 권장',
        interpretation: '학생이나 동료의 고통스러운 경험이 선생님의 마음에도 깊은 영향을 미치고 있어요. 퇴근 후에도 학생의 어려운 상황이 떠오르거나, 잠을 설치거나, 감정적으로 예민해지는 것은 이차외상의 대표적 증상입니다. 이것은 공감 능력이 높은 교사에게 자연스럽게 나타나는 현상이지만, 방치하면 심각한 심리적 어려움으로 이어질 수 있어요.',
        tips: [
          { icon: '🏥', text: '전문 심리 상담을 적극적으로 고려하세요 - 당신의 마음도 돌봄이 필요해요' },
          { icon: '🧱', text: '"학생의 아픔은 학생의 것, 나의 역할은 돕는 것" 경계 연습' },
          { icon: '🚿', text: '퇴근 전 "감정 내려놓기" 의식 만들기 - 손 씻기, 옷 갈아입기 등' },
          { icon: '📵', text: '어려운 상담 후 바로 다음 업무 하지 말기 - 5분 산책 또는 심호흡' },
          { icon: '👥', text: '비슷한 경험을 하는 동료와 정기적 사례 나눔 모임 만들기' },
        ],
      },
      mid: {
        title: '간헐적 정서적 파급 상태',
        interpretation: '가끔 학생의 어려움이 마음에 남아 영향을 줍니다. 특정 사건이나 학생 상담 후 감정적으로 힘든 순간이 있지만, 대체로 회복 가능한 수준이에요. 지금부터 감정 경계 설정 연습을 시작하면 이차외상이 깊어지는 것을 예방할 수 있습니다.',
        tips: [
          { icon: '📓', text: '힘든 상담 후 간단히 감정 기록하기 - 써 내려놓는 것만으로 도움' },
          { icon: '🧘', text: '퇴근 전 3분 마음챙김 호흡으로 감정 리셋하기' },
          { icon: '🤝', text: '어려운 사례는 혼자 안고 있지 말고 동료나 전문가와 나누기' },
          { icon: '🌿', text: '주말에 자연 속에서 시간 보내기 - 정서 회복에 효과적' },
        ],
      },
      low: {
        title: '건강한 정서적 경계 유지 상태',
        interpretation: '학생의 어려움에 공감하면서도 건강한 정서적 경계를 유지하고 있어요. 타인의 고통이 자신의 마음에 과도하게 침투하지 않도록 자연스럽게 조절하는 능력이 있습니다. 이 건강한 경계가 장기적으로 교직을 지속할 수 있는 힘이에요.',
        tips: [
          { icon: '✅', text: '현재의 건강한 경계를 유지하되, 공감은 계속 키워가기' },
          { icon: '👂', text: '때로는 학생의 이야기에 더 깊이 귀 기울여보기' },
          { icon: '🤲', text: '어려운 상황의 동료에게 정서적 지지를 제공하기' },
        ],
      },
    },
  },
};

// Cross-subscale interaction patterns
function getInteractionNote(csLevel: Level, boLevel: Level, stsLevel: Level): {
  emoji: string; title: string; message: string; color: string;
} {
  // Ideal state
  if (csLevel === 'high' && boLevel === 'low' && stsLevel === 'low') {
    return {
      emoji: '🌈', title: '이상적인 돌봄 상태',
      color: '#059669',
      message: '높은 공감만족과 낮은 소진/외상 — 교사로서 가장 건강하고 충만한 상태입니다. 학생을 돕는 기쁨이 에너지를 채워주고, 적절한 경계가 마음을 보호하고 있어요. 이 상태를 유지하기 위해 현재의 생활 패턴과 자기 돌봄 습관을 소중히 지켜주세요.',
    };
  }

  // High CS + High BO: passionate but burning out
  if (csLevel === 'high' && (boLevel === 'high' || boLevel === 'mid')) {
    return {
      emoji: '🕯️', title: '열정적이지만 지쳐가는 상태',
      color: '#EA580C',
      message: '학생을 위한 열정은 넘치지만 몸과 마음이 따라가지 못하고 있어요. "보람 있으니까 괜찮아"라는 생각이 오히려 번아웃을 가속화할 수 있습니다. 열정은 유지하되, 반드시 자기 돌봄을 병행해야 합니다. 지치면 도울 수도 없다는 것을 기억하세요.',
    };
  }

  // Low CS + High BO: danger zone
  if (csLevel === 'low' && boLevel === 'high') {
    return {
      emoji: '🆘', title: '위험 신호 — 전문적 도움이 필요합니다',
      color: '#DC2626',
      message: '보람은 느끼지 못하면서 소진은 심한 상태입니다. 이것은 가장 위험한 조합이에요. 지금 당장 무언가를 바꿔야 합니다. 혼자 해결하려 하지 마시고, 관리자나 전문 상담사에게 현재 상태를 솔직히 이야기해주세요. 선생님의 마음 건강이 학생의 교육보다 먼저입니다.',
    };
  }

  // High BO + High STS: double burden
  if (boLevel === 'high' && stsLevel === 'high') {
    return {
      emoji: '⛑️', title: '이중 부담 — 소진과 외상이 겹친 상태',
      color: '#DC2626',
      message: '업무 소진과 이차외상이 동시에 높아 마음의 여유가 거의 없는 상태입니다. 이 두 가지가 겹치면 서로를 악화시키는 악순환이 생길 수 있어요. 가장 중요한 것은 "지금 당장 줄일 수 있는 것"을 찾는 것입니다. 전문 상담을 적극 권합니다.',
    };
  }

  // High STS only
  if (stsLevel === 'high' && boLevel !== 'high') {
    return {
      emoji: '💧', title: '공감의 무게가 마음에 남는 상태',
      color: '#7C3AED',
      message: '번아웃 수준은 관리 가능하지만, 학생의 어려운 이야기가 마음에 깊이 남고 있어요. 공감 능력이 높은 선생님이 겪는 자연스러운 현상이지만, 장기화되면 번아웃으로 이어질 수 있습니다. 감정적 경계 설정과 정기적인 정서 해독이 필요해요.',
    };
  }

  // Low CS + mid/low BO
  if (csLevel === 'low' && boLevel !== 'high') {
    return {
      emoji: '🔋', title: '동기 충전이 필요한 상태',
      color: '#F59E0B',
      message: '심각하게 지친 것은 아니지만, 교직에서 보람이나 의미를 찾기 어려운 시기예요. 일상의 반복, 인정 부족, 또는 개인적 상황이 원인일 수 있습니다. 처음 교사가 되고 싶었던 마음을 떠올려보고, 작은 변화(새로운 수업 방법, 동료 스터디 등)를 시도해보세요.',
    };
  }

  // Generally okay state
  return {
    emoji: '☀️', title: '안정적인 돌봄 상태',
    color: '#059669',
    message: '전반적으로 건강한 상태를 유지하고 있어요. 교직의 기쁨과 어려움 사이에서 균형을 잡고 있습니다. 현재의 균형을 유지하면서, 각 영역별 세부 조언을 참고해 더 나은 상태를 만들어가세요.',
  };
}

function GaugeArc({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = Math.min(score / max, 1);
  const r = 40;
  const strokeWidth = 8;
  const cx = 50;
  const cy = 50;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalArc = Math.PI;

  const bgX1 = cx + r * Math.cos(startAngle);
  const bgY1 = cy - r * Math.sin(startAngle);
  const bgX2 = cx + r * Math.cos(endAngle);
  const bgY2 = cy - r * Math.sin(endAngle);

  const dataAngle = startAngle - totalArc * pct;
  const dataX = cx + r * Math.cos(dataAngle);
  const dataY = cy - r * Math.sin(dataAngle);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <svg width="100" height="60" viewBox="0 0 100 60">
      <path
        d={`M ${bgX1},${bgY1} A ${r},${r} 0 1,1 ${bgX2},${bgY2}`}
        fill="none"
        stroke="var(--cc-border)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {pct > 0 && (
        <path
          d={`M ${bgX1},${bgY1} A ${r},${r} 0 ${largeArc},1 ${dataX},${dataY}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function ProQOLResult({ result }: { result: unknown }) {
  const r = result as PResult;
  const interaction = getInteractionNote(r.csLevel, r.boLevel, r.stsLevel);

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Hero card with gauges */}
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
        <div style={{ fontSize: 48, animation: 'bounce-gentle 2.5s ease-in-out infinite' }}>🍭</div>
        <div className="text-gradient" style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>
          돌봄 전문가의 마음 건강
        </div>
        <div style={{ fontSize: 13, color: 'var(--cc-text-sub)', marginTop: 4 }}>
          Professional Quality of Life
        </div>

        {/* 3 Gauges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          {(['cs', 'bo', 'sts'] as const).map(key => {
            const info = SUBSCALE_INFO[key];
            const score = r[key];
            const level = r[`${key}Level`];
            return (
              <div key={key} style={{ textAlign: 'center' }}>
                <GaugeArc score={score} max={50} color={info.arcColor} />
                <div style={{ fontSize: 13, fontWeight: 700, color: info.color, marginTop: 4 }}>
                  {info.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cc-text-sub)' }}>
                  {score}점 ({LEVEL_LABELS[level]})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interaction analysis card — most important insight */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)',
        marginBottom: 16, borderLeft: `4px solid ${interaction.color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{interaction.emoji}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: interaction.color }}>{interaction.title}</div>
            <div style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>3가지 하위척도 상호작용 분석</div>
          </div>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--cc-text)', margin: 0 }}>
          {interaction.message}
        </p>
      </div>

      {/* Individual subscale detail cards */}
      {(['cs', 'bo', 'sts'] as const).map(key => {
        const info = SUBSCALE_INFO[key];
        const score = r[key];
        const level = r[`${key}Level`];
        const levelData = info.levels[level];

        return (
          <div key={key} style={{ marginBottom: 12 }}>
            {/* Subscale header */}
            <div style={{
              background: info.bg, borderRadius: '20px 20px 0 0', padding: '16px 16px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{info.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: info.color, flex: 1 }}>{info.name}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: 'white', color: info.color,
                }}>
                  {score}점 · {LEVEL_LABELS[level]}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--cc-text-sub)', marginTop: 4 }}>{info.desc}</div>
            </div>

            {/* Interpretation */}
            <div style={{
              background: 'var(--cc-card)', borderRadius: '0 0 20px 20px',
              padding: '16px', border: '1px solid var(--cc-border)', borderTop: 'none',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: info.color, marginBottom: 6 }}>
                {levelData.title}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--cc-text)', margin: '0 0 14px 0' }}>
                {levelData.interpretation}
              </p>

              {/* Tips */}
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-text-sub)', marginBottom: 8 }}>
                💡 실천 가이드
              </div>
              {levelData.tips.map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0',
                  borderBottom: i < levelData.tips.length - 1 ? '1px solid var(--cc-border)' : 'none',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{tip.icon}</span>
                  <span style={{ fontSize: 12, lineHeight: 1.6 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Score reference */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 16, padding: '14px 16px',
        border: '1px solid var(--cc-border)', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-text-sub)', marginBottom: 8 }}>📏 ProQOL 점수 기준</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: '낮음', range: '22점 이하', color: '#059669' },
            { label: '보통', range: '23~41점', color: '#F59E0B' },
            { label: '높음', range: '42점 이상', color: '#DC2626' },
          ].map(item => (
            <div key={item.label} style={{
              flex: 1, minWidth: 80, textAlign: 'center', padding: '8px 4px',
              background: 'var(--cc-bg)', borderRadius: 10,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>{item.range}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--cc-text-sub)', marginTop: 8, lineHeight: 1.5 }}>
          * 공감만족은 높을수록 좋고, 번아웃·이차외상은 낮을수록 좋습니다.
        </div>
      </div>

      {/* Positive note */}
      <div style={{
        padding: '14px 16px', borderRadius: 16, background: 'var(--cc-bg)',
        fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.7, textAlign: 'center',
      }}>
        💡 교사는 돌봄 전문가입니다. 학생을 돌보기 위해서는 먼저 자신의 마음을 돌봐야 해요. 이 검사 결과를 통해 자신의 상태를 객관적으로 바라보고, 필요한 도움을 받을 수 있는 용기를 가지시길 바랍니다.
      </div>
    </div>
  );
}
