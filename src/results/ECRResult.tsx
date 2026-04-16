import type { ECRResult as EResult } from '../utils/scoring';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const ECR_META: Record<string, {
  emoji: string; color: string; colorHex: string;
  title: string; keywords: string[];
  interpretation: string; classroom: string; relationship: string;
  tips: Array<{ icon: string; text: string }>;
  growth: string; reassurance: string;
}> = {
  '안정형': {
    emoji: '🎪', color: 'var(--cc-mint-deep)', colorHex: '#059669',
    title: '안정적인 관계의 든든한 교사',
    keywords: ['#신뢰의기반', '#편안한관계', '#건강한경계', '#안전기지'],
    interpretation: '선생님은 타인을 자연스럽게 신뢰하며, 가까운 관계를 편안하게 유지합니다. 학생들은 선생님 곁에서 안전함을 느끼고, 어려운 이야기도 편하게 꺼낼 수 있어요. 관계에서 친밀함과 자율성의 균형을 잘 맞추는 것이 선생님의 강점입니다.\n\n동료 교사와의 관계에서도 자연스럽게 협력하며, 도움을 요청하는 것도, 도움을 주는 것도 부담 없이 할 수 있어요. 비판을 받아도 자기 가치를 흔들리지 않는 내면의 안정감이 있습니다.',
    classroom: '선생님의 교실은 학생들에게 진정한 안전기지가 됩니다. 특히 가정환경이 불안정한 아이들에게 선생님의 일관된 따뜻함은 정서 조절을 배우는 중요한 모델이 돼요. 학생들이 실수해도 괜찮다는 분위기를 자연스럽게 만들어냅니다.',
    relationship: '학부모와 동료 교사와의 소통이 원만합니다. 전문적 경계를 자연스럽게 유지하면서도 따뜻한 관계를 맺어요.',
    tips: [
      { icon: '🌟', text: '안정 애착의 강점을 불안한 학생의 안전기지로 의도적으로 활용하기' },
      { icon: '🤝', text: '다양한 애착 스타일의 동료를 이해하고, 그들의 방식을 존중하기' },
      { icon: '🏫', text: '안정감 있는 학급 문화를 의식적으로 설계하기 (예측 가능한 루틴)' },
    ],
    growth: '안정형이라도 업무 스트레스가 극심할 때는 일시적으로 패턴이 변할 수 있어요. 자기 상태를 정기적으로 점검하는 것이 이 안정감을 오래 유지하는 비결입니다.',
    reassurance: '선생님은 학교 공동체의 정서적 닻 같은 존재예요. 그 안정감이 주변 사람들에게 조용하지만 강력한 영향을 미치고 있습니다.',
  },
  '몰두형': {
    emoji: '🎡', color: 'var(--cc-pink-deep)', colorHex: '#EC4899',
    title: '진심을 다하는 열정적인 교사',
    keywords: ['#깊은헌신', '#정서적교감', '#관계중심', '#열정'],
    interpretation: '선생님은 학생들을 향한 깊고 진실된 관심을 가지고 있습니다. 늦게까지 남아 학생을 돕고, 아이들의 안녕이 늘 마음에 걸리는 헌신적인 교사예요. 이 깊은 돌봄은 많은 아이들이 절실히 필요로 하는 것입니다.\n\n다만 학생이 기대만큼 반응하지 않을 때 상처받거나, 수업이 잘 안 됐을 때 지나치게 자책하는 경향이 있을 수 있어요. 관계에서 확인과 인정을 받고 싶은 마음은 인간적이고 자연스러운 것이지만, 자기 가치를 외부 반응에서 분리하는 연습이 도움이 됩니다.',
    classroom: '선생님은 학생들과 깊은 정서적 유대를 형성합니다. 많은 아이들이 이런 연결을 간절히 원해요. 다만 학생이 자연스럽게 독립해갈 때 그것을 거리감으로 오해하지 않는 것이 중요합니다.',
    relationship: '동료나 관리자와의 상호작용을 과잉 분석할 수 있어요. 교장의 한마디에 과도하게 걱정하거나, 가까운 동료에게 확인을 구하는 경향이 있을 수 있습니다.',
    tips: [
      { icon: '💬', text: '"이것은 나에 대한 것이 아니다" - 학생의 반응을 개인적으로 받아들이지 않는 연습' },
      { icon: '📓', text: '학생의 반응과 나의 가치를 분리하는 감정 일기 쓰기' },
      { icon: '🚪', text: '퇴근 후 교사 모드 OFF 의식 만들기 (옷 갈아입기, 산책 등)' },
      { icon: '🙋', text: '동료에게 솔직하게 도움을 요청하는 연습 - 약함이 아니라 지혜' },
      { icon: '💜', text: '감정적 경계 설정을 냉정함이 아닌 자기 돌봄으로 재정의하기' },
    ],
    growth: '선생님의 열정은 진정한 선물이에요. 성장의 핵심은 외부 인정이 없어도 자신이 충분하다는 것을 믿는 연습입니다.',
    reassurance: '선생님의 깊은 돌봄은 어떤 학생에게는 인생을 바꾸는 경험이 됩니다. 그 진심은 반드시 전해지고 있어요.',
  },
  '무시-회피형': {
    emoji: '🎯', color: 'var(--cc-sky-deep)', colorHex: '#3B82F6',
    title: '독립적이고 유능한 전문 교사',
    keywords: ['#자기충분감', '#전문성중심', '#독립적교수', '#냉철한판단'],
    interpretation: '선생님은 교실에 전문성과 유능함을 가져옵니다. 감정적 드라마에 휘말리지 않고 명확한 판단을 내릴 수 있으며, 독립적으로 업무를 처리하는 능력이 뛰어나요. 학생들은 선생님의 역량을 존경합니다.\n\n다만 이 독립성이 때로는 주변에 차갑다는 인상을 줄 수 있어요. 정서적 연결이 필요한 학생에게는 선생님이 멀게 느껴질 수 있고, 동료들은 선생님의 독립심을 냉담함으로 오해할 수 있습니다.',
    classroom: '수업은 체계적이고 내용 중심적입니다. 학생들은 선생님의 전문성을 존경해요. 정서적 교감이 필요한 순간에 작은 관심 표현을 더하면 수업의 깊이가 한층 더해질 거예요.',
    relationship: '동료와의 관계에서 전문적 경계를 선호합니다. 교무실 사교 활동보다 업무에 집중하는 편이에요. 학부모 상담은 효율적이고 요점 중심적입니다.',
    tips: [
      { icon: '💛', text: '하루에 한 번 학생에게 개인적 관심 표현하기 (이름 불러주기, 작은 칭찬)' },
      { icon: '☕', text: '동료에게 먼저 안부 묻기 - 작은 시도부터 천천히' },
      { icon: '🎭', text: '감정 표현이 전문성을 해치지 않는다는 것 기억하기' },
      { icon: '🔑', text: '학생의 정서적 접근을 귀찮음이 아닌 신뢰의 표현으로 재해석하기' },
    ],
    growth: '선생님의 유능함은 이미 검증된 강점입니다. 여기에 작은 감정적 연결을 더하면 교직 생활의 만족도가 크게 높아질 거예요.',
    reassurance: '독립성과 자기 충분감은 요구가 많은 교직에서 진정한 강점입니다. 선생님의 침착함이 위기 상황에서 얼마나 큰 힘이 되는지 기억하세요.',
  },
  '두려운-회피형': {
    emoji: '🎈', color: 'var(--cc-lavender-deep)', colorHex: '#7C3AED',
    title: '성찰하는 깊이 있는 교사',
    keywords: ['#깊은성찰', '#내면의힘', '#복잡한감수성', '#성장중'],
    interpretation: '선생님은 인간의 복잡성을 깊이 이해합니다. 의미 있는 연결을 원하면서도 거절이 두렵고, 이 내적 갈등이 때로는 지치게 만들어요. 하지만 바로 이 경험이 선생님을 특별하게 만듭니다 - 수줍고 위축된 학생의 마음을 누구보다 잘 이해할 수 있으니까요.\n\n선생님이 느끼는 관계의 어려움은 능력 부족이 아닙니다. 오히려 관계를 깊이 생각하고 진지하게 대하는 것의 반증이에요.',
    classroom: '내향적이거나 불안한 학생과 특별한 유대를 형성합니다. 그 학생들은 선생님에게서 동질감을 느끼거든요. 다만 갈등 상황이 발생하면 회피하고 싶은 충동이 강할 수 있고, 학부모 면담이 유독 긴장될 수 있습니다.',
    relationship: '동료와 가까워지고 싶으면서도 거리를 두게 됩니다. 회의에서 좋은 아이디어가 있어도 말하기를 주저할 수 있어요.',
    tips: [
      { icon: '⭐', text: '작은 성공 기록하기 - 학생이 웃은 순간, 수업이 잘 된 순간 매일 1개' },
      { icon: '👫', text: '신뢰할 수 있는 동료 1명과 정기적 대화 시간 만들기' },
      { icon: '🫂', text: '갈등 후 자기 비난 대신 "나는 최선을 다했다" 반복하기' },
      { icon: '🗣️', text: '회의에서 작은 의견이라도 하나 말하는 연습 시작하기' },
      { icon: '📖', text: '전문 상담을 통한 애착 패턴 탐색 고려하기 - 용기 있는 선택' },
    ],
    growth: '선생님은 이미 자기 인식이라는 가장 어려운 첫걸음을 내딛고 있어요. 안전한 애착으로의 여정에서 모든 작은 연결 시도가 용기 있는 행동입니다.',
    reassurance: '이 애착 패턴이 나쁜 교사라는 뜻은 절대 아닙니다. 오히려 많은 뛰어난 교사들이 바로 이 깊이 있는 성찰 능력 때문에 학생들의 마음을 터치할 수 있어요.',
  },
};

export default function ECRResult({ result }: { result: unknown }) {
  const r = result as EResult;
  const meta = ECR_META[r.type];
  const data = [{ x: r.avoidance, y: r.anxiety }];

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Hero card */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 24, padding: '28px 20px',
        boxShadow: 'var(--cc-shadow)', border: '1.5px solid var(--cc-border)',
        textAlign: 'center', marginBottom: 16,
      }}>
        <div style={{ fontSize: 48, animation: 'bounce-gentle 2.5s ease-in-out infinite' }}>{meta?.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: meta?.color, marginTop: 8 }}>{r.type}</div>
        <div style={{ fontSize: 14, color: 'var(--cc-text-sub)', marginTop: 4, marginBottom: 4 }}>
          {meta?.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--cc-text-sub)' }}>
          불안: {r.anxiety.toFixed(1)} · 회피: {r.avoidance.toFixed(1)}
        </div>

        {/* Keywords */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 14 }}>
          {meta?.keywords.map((kw, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 14,
              background: `${meta.colorHex}15`, color: meta.colorHex,
            }}>{kw}</span>
          ))}
        </div>

        {/* Scatter plot */}
        <div style={{ marginTop: 24, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cc-border)" />
              <XAxis type="number" dataKey="x" domain={[1, 7]} tick={{ fontSize: 10 }} name="회피">
                <Label value="회피 →" position="bottom" offset={10} style={{ fontSize: 11, fill: 'var(--cc-text-sub)' }} />
              </XAxis>
              <YAxis type="number" dataKey="y" domain={[1, 7]} tick={{ fontSize: 10 }} name="불안">
                <Label value="↑ 불안" angle={-90} position="left" offset={0} style={{ fontSize: 11, fill: 'var(--cc-text-sub)' }} />
              </YAxis>
              <ReferenceLine x={4} stroke="var(--cc-pink)" strokeDasharray="5 5" opacity={0.5} />
              <ReferenceLine y={4} stroke="var(--cc-pink)" strokeDasharray="5 5" opacity={0.5} />
              <Scatter data={data} fill={meta?.colorHex || '#EC4899'} r={8} animationDuration={1200} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant labels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {(['안정형', '몰두형', '무시-회피형', '두려운-회피형'] as const).map(type => (
            <div key={type} style={{
              padding: 8, borderRadius: 10, fontSize: 11,
              fontWeight: type === r.type ? 700 : 400,
              background: type === r.type ? ECR_META[type]?.color : 'var(--cc-bg)',
              color: type === r.type ? 'white' : 'var(--cc-text-sub)',
              opacity: type === r.type ? 1 : 0.6,
            }}>
              {ECR_META[type]?.emoji} {type}
            </div>
          ))}
        </div>
      </div>

      {/* Rich interpretation */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)',
        marginBottom: 12, borderLeft: `4px solid ${meta?.colorHex}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{meta?.title}</div>
        {meta?.interpretation.split('\n\n').map((p, i) => (
          <p key={i} style={{ fontSize: 13, lineHeight: 1.7, marginBottom: i === 0 ? 10 : 0 }}>{p}</p>
        ))}
      </div>

      {/* Classroom + Relationship cards */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cc-pink-light), var(--cc-sky-light, #DBEAFE))',
        borderRadius: 20, padding: '20px 16px', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-sky-deep)', marginBottom: 4 }}>🏫 교실에서</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta?.classroom}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-pink-deep)', marginBottom: 4 }}>🤝 동료·학부모 관계</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta?.relationship}</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)', marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>💪 관계 성장 팁</div>
        {meta?.tips.map((tip, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0',
            borderBottom: i < (meta?.tips.length ?? 0) - 1 ? '1px solid var(--cc-border)' : 'none',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.icon}</span>
            <span style={{ fontSize: 13, lineHeight: 1.6 }}>{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Growth + Reassurance */}
      <div style={{
        background: meta?.colorHex ? `${meta.colorHex}0D` : 'var(--cc-bg)',
        borderRadius: 16, padding: '14px 16px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: meta?.color, marginBottom: 4 }}>🌱 성장 포인트</div>
        <div style={{ fontSize: 13, lineHeight: 1.7 }}>{meta?.growth}</div>
      </div>

      <div style={{
        padding: '14px 16px', borderRadius: 16, background: 'var(--cc-bg)',
        fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.7, textAlign: 'center',
      }}>
        💡 {meta?.reassurance}
      </div>
    </div>
  );
}
