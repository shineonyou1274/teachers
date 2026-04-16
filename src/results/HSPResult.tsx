import type { HSPResult as HResult } from '../utils/scoring';

const HSP_META: Record<'high' | 'mid' | 'low', {
  name: string; emoji: string; color: string; colorHex: string; bg: string;
  title: string; keywords: string[];
  interpretation: string; classroom: string;
  tips: Array<{ icon: string; text: string }>;
  growth: string;
}> = {
  high: {
    name: '난초형 (고감각)', emoji: '🌺', color: 'var(--cc-lavender-deep)', colorHex: '#7C3AED', bg: 'var(--cc-lavender-light)',
    title: '섬세한 감각의 교실 예술가',
    keywords: ['#섬세한관찰자', '#깊은공감', '#예술적감수성', '#분위기메이커'],
    interpretation: '선생님은 교실의 미묘한 분위기 변화를 누구보다 먼저 감지하는 섬세한 레이더를 가지고 계십니다. 학생의 작은 표정 변화에서 마음 상태를 읽어내고, 아름다운 수업 순간에 깊이 감동하는 풍부한 감수성의 소유자예요.\n\n다만 소란스러운 복도, 연이은 회의, 끊임없는 학생 요구 등 과도한 자극은 동료보다 빠르게 에너지를 소진시킵니다. 이것은 약점이 아니라 신경계의 특성이에요. 마치 고급 오디오 장비가 미세한 소리도 포착하듯, 선생님의 감각은 다른 교사가 놓치는 것을 잡아냅니다.',
    classroom: '선생님의 교실은 자연스럽게 따뜻하고 안전한 공간이 됩니다. 정서적 어려움을 겪는 학생들이 본능적으로 선생님에게 다가오는 것은 우연이 아니에요. 다만 수업 후 갑자기 찾아오는 피로감은 정상적인 반응입니다. 쉬는 시간의 진정한 휴식이 오후 수업의 질을 결정해요.',
    tips: [
      { icon: '🧘', text: '쉬는 시간에 2분간 눈 감고 심호흡 - 감각 리셋 시간 확보하기' },
      { icon: '🌿', text: '교실에 나만의 회복 코너 만들기 (작은 식물, 편안한 향)' },
      { icon: '🔇', text: '점심시간 최소 10분은 조용한 공간에서 혼자 보내기' },
      { icon: '📓', text: '주 1회 감각 다이어트 - 퇴근 후 자극 최소화 저녁 루틴' },
      { icon: '💧', text: '학생 상담 후 감정 털어내기 의식 - 손 씻으며 마음도 정리' },
    ],
    growth: '선생님의 섬세함은 위기에 처한 학생을 발견하는 초능력이에요. 핵심 성장 포인트는 죄책감 없이 자기 에너지를 보호하는 법을 배우는 것입니다.',
  },
  mid: {
    name: '튤립형 (중감각)', emoji: '🌷', color: 'var(--cc-pink-deep)', colorHex: '#EC4899', bg: 'var(--cc-pink-light)',
    title: '균형 잡힌 감각의 유연한 교사',
    keywords: ['#유연한감각', '#상황적응', '#균형잡힌에너지', '#실용적공감'],
    interpretation: '선생님은 균형 잡힌 신경계를 가지고 있어 대부분의 교실 상황을 무리 없이 소화합니다. 학생의 감정 변화에 적절히 반응하면서도 과도한 자극에 압도되지 않는 유연함이 큰 자산이에요.\n\n활발한 그룹 활동과 조용한 개별 작업 사이를 자유롭게 전환할 수 있고, 스트레스가 많은 날에도 비교적 빠르게 회복합니다. 이 균형감각은 교직이라는 다양한 상황이 요구되는 직업에서 특히 빛을 발해요.',
    classroom: '선생님은 교실의 분위기를 잘 읽고 자연스럽게 조절합니다. 소란스러운 순간에도 차분함을 유지하면서, 조용한 학생의 미묘한 변화도 놓치지 않아요. 이 균형이 모든 학생에게 공평한 관심을 줄 수 있게 합니다.',
    tips: [
      { icon: '🔄', text: '컨디션에 따라 수업 강도 조절하기 - 지친 날엔 차분한 활동 선택' },
      { icon: '📊', text: '자신의 에너지 패턴 파악하기 - 언제 민감하고 언제 강인한지' },
      { icon: '🤝', text: '고감각 동료의 필요를 이해하고, 회의 후 쉴 시간 배려하기' },
      { icon: '⚡', text: '에너지가 좋은 날엔 도전적 활동, 지친 날엔 난초형 셀프케어' },
    ],
    growth: '균형이 가장 큰 강점이지만, 스트레스가 서서히 쌓이는 것을 놓칠 수 있어요. 정기적으로 자기 상태를 체크하는 습관이 이 균형을 오래 유지하는 비결입니다.',
  },
  low: {
    name: '민들레형 (저감각)', emoji: '🌼', color: 'var(--cc-mint-deep)', colorHex: '#059669', bg: 'var(--cc-mint-light)',
    title: '강인한 에너지의 활동적 교사',
    keywords: ['#스트레스내성', '#에너지넘침', '#위기대처', '#활동적수업'],
    interpretation: '선생님은 자극적인 환경에서 오히려 활력을 얻는 강인한 신경계를 가지고 있습니다. 소란스러운 교실, 체험학습, 대규모 행사 등 다른 교사를 지치게 하는 상황에서 에너지가 올라가는 탁월한 회복력의 소유자예요.\n\n동료들이 힘든 상황에서 선생님에게 도움을 요청하는 것은 선생님의 이 강인함 때문입니다. 교직이라는 끊임없는 자극의 직업에서 이 특성은 진정한 선물이에요.',
    classroom: '역동적인 활동 기반 수업에서 빛을 발합니다. 체육대회, 축제, 현장학습 등 에너지가 필요한 순간이 선생님의 무대예요. 다만 기억하세요 - 선생님 반의 일부 학생은 난초형일 수 있어요. 그 아이들에게는 조용한 쉼의 시간이 필요합니다.',
    tips: [
      { icon: '🤫', text: '수업에 조용한 개별 활동 5분 넣기 - 민감한 학생을 위한 배려' },
      { icon: '👀', text: '조용한 학생의 비언어적 신호 의식적으로 관찰하기' },
      { icon: '💜', text: '고감각 동료가 혼자 시간을 원할 때 섭섭해하지 않기' },
      { icon: '🎵', text: '큰 소리나 빠른 진행이 부담스러운 학생에게 선택권 주기' },
    ],
    growth: '선생님의 성장 포인트는 자신과 다른 감각 유형의 학생과 동료를 이해하는 것입니다. 같은 환경도 사람마다 매우 다르게 경험한다는 인식이 더 깊은 교사가 되는 열쇠예요.',
  },
};

export default function HSPResult({ result }: { result: unknown }) {
  const r = result as HResult;
  const meta = HSP_META[r.level];
  const pct = ((r.average - 1) / 6) * 100;

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Hero card with gauge */}
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
        <div style={{ fontSize: 22, fontWeight: 800, color: meta.color, marginTop: 8 }}>{meta.name}</div>
        <div style={{ fontSize: 14, color: 'var(--cc-text-sub)', marginTop: 4 }}>
          평균 점수: {r.average.toFixed(2)} / 7.00
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

        {/* Gauge */}
        <div style={{ margin: '24px auto', maxWidth: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--cc-text-sub)', marginBottom: 4 }}>
            <span>민들레 🌼</span>
            <span>튤립 🌷</span>
            <span>난초 🌺</span>
          </div>
          <div style={{ height: 14, background: 'var(--cc-bg)', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${pct}%`, borderRadius: 14,
              background: 'linear-gradient(90deg, var(--cc-mint), var(--cc-pink), var(--cc-lavender))',
              transition: 'width 1s ease',
            }} />
            <div style={{ position: 'absolute', left: '55%', top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', left: '71%', top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,0.1)' }} />
          </div>
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

      {/* Classroom card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cc-pink-light), var(--cc-sky-light, #DBEAFE))',
        borderRadius: 20, padding: '20px 16px', marginBottom: 12,
      }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-sky-deep)', marginBottom: 4 }}>🏫 교실에서</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta.classroom}</div>
        </div>
      </div>

      {/* Tips */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)', marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🌿 감각 셀프케어 팁</div>
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

      {/* Growth */}
      <div style={{
        background: meta.bg, borderRadius: 16, padding: '14px 16px',
        textAlign: 'center', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: meta.color, marginBottom: 4 }}>🌱 성장 포인트</div>
        <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta.growth}</div>
      </div>

      {/* Positive note */}
      <div style={{
        padding: '14px 16px', borderRadius: 16, background: 'var(--cc-bg)',
        fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.7, textAlign: 'center',
      }}>
        💡 감각 민감성은 좋고 나쁨이 아닙니다. 난초도 튤립도 민들레도 각자의 방식으로 아름답게 피어나듯, 선생님만의 감각으로 교실을 빛내주세요.
      </div>
    </div>
  );
}
