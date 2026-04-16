import { useState } from 'react';
import type { Big5Result as B5Result, Big5Factor } from '../utils/scoring';
import { BIG5_PROFILES } from '../utils/scoring';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

// 양극 라벨 + 풍부한 교사 해석
const FACTOR_META: Record<string, {
  emoji: string; color: string; colorHex: string; colorLight: string;
  lowLabel: string; highLabel: string;
  high: { title: string; keywords: string[]; praise: string; interpretation: string };
  mid: { title: string; keywords: string[]; praise: string; interpretation: string };
  low: { title: string; keywords: string[]; praise: string; interpretation: string };
}> = {
  외향성: {
    emoji: '🎡', color: 'var(--cc-pink-deep)', colorHex: '#EC4899', colorLight: 'var(--cc-pink-light)',
    lowLabel: '차분함', highLabel: '활발함',
    high: {
      title: '에너자이저, 긍정 에너지 전파자',
      keywords: ['#활기찬수업', '#발표와토론', '#소통의왕', '#긍정파워'],
      praise: '선생님은 교실에 들어서는 것만으로도 분위기를 밝게 만드는 인간 비타민 같은 존재입니다. 넘치는 에너지와 열정이 학생들에게 고스란히 전달되어, 소극적인 아이도 참여하게 만들고 지루한 내용도 흥미진진하게 바꾸어 놓습니다.',
      interpretation: '역동적인 그룹 활동, 발표, 역할극 중심의 수업에서 강점을 발휘합니다. 선생님의 긍정적 에너지는 아이들의 참여를 이끌어내는 가장 강력한 동기부여예요.',
    },
    mid: {
      title: '유연한 소통 전문가',
      keywords: ['#상황맞춤', '#소통유연', '#균형잡힌교실'],
      praise: '선생님은 활발한 그룹 활동과 차분한 개별 활동을 상황에 맞게 전환할 줄 아는 유연한 소통 전문가입니다.',
      interpretation: '다양한 수업 형태를 자유롭게 오갈 수 있는 것이 큰 강점이에요. 학생들의 에너지 수준에 맞춰 수업 분위기를 조절해보세요.',
    },
    low: {
      title: '깊이 있는 관찰자, 일대일 멘토',
      keywords: ['#깊은경청', '#일대일소통', '#차분한교실', '#통찰력'],
      praise: '선생님은 시끌벅적한 분위기 속에서도 조용히 빛나는 한 아이의 눈빛을 발견하는 깊이 있는 관찰자입니다. 한 명 한 명과의 깊은 대화를 통해 아이의 내면을 들여다보고 맞춤형 지지를 해주는 진정한 멘토예요.',
      interpretation: '상담 활동, 개별 과제에 대한 심층 피드백, 소그룹 활동에서 강점이 극대화됩니다. 선생님의 깊이 있는 경청이 아이의 잠재력을 여는 문이 될 거예요.',
    },
  },
  친화성: {
    emoji: '🎠', color: 'var(--cc-mint-deep, #059669)', colorHex: '#059669', colorLight: 'var(--cc-mint-light, #D1FAE5)',
    lowLabel: '냉정함', highLabel: '다정함',
    high: {
      title: '따뜻한 우리 반 상담사',
      keywords: ['#공감능력', '#협동학습', '#배려', '#안전기지'],
      praise: '선생님의 교실은 아이들이 어떤 실수나 어려움을 겪어도 괜찮다고 말해주는 따뜻하고 안전한 기지입니다. 아이들의 마음을 먼저 읽어주고 공감해주는 따뜻함은 교실을 서로 보듬어주는 공동체로 만들어요.',
      interpretation: '또래 중재, 협동 학습, 인성 교육에서 그 어떤 교육 자료보다 강력한 힘을 발휘합니다. 아이들이 서로 돕고 배려하는 문화를 만들어주세요.',
    },
    mid: {
      title: '균형잡힌 관계 설계자',
      keywords: ['#공감과원칙', '#유연한관계', '#상황판단'],
      praise: '선생님은 학생에게 공감하면서도 필요할 때 원칙을 세울 줄 아는 균형잡힌 교육자입니다.',
      interpretation: '상황에 따라 따뜻함과 단호함을 적절히 조절하는 것이 강점이에요.',
    },
    low: {
      title: '원칙을 지키는 공정한 심판관',
      keywords: ['#객관적평가', '#논리적사고', '#원칙', '#성장의자극'],
      praise: '선생님은 감정에 휩쓸리기보다, 원칙과 기준에 따라 객관적으로 판단하는 공정한 심판관입니다. 때로는 쓴소리도 할 수 있는 단호함이 아이들이 한 단계 더 성장하도록 돕는 건강한 자극이 됩니다.',
      interpretation: '논리적 사고력을 키우는 토론 수업, 명확한 기준의 수행평가, 갈등 상황에서의 객관적 중재에서 강점이 드러나요.',
    },
  },
  성실성: {
    emoji: '🎯', color: 'var(--cc-sky-deep)', colorHex: '#3B82F6', colorLight: 'var(--cc-sky-light, #DBEAFE)',
    lowLabel: '느긋함', highLabel: '성실함',
    high: {
      title: '믿음직한 성장 네비게이터',
      keywords: ['#꼼꼼한피드백', '#책임감', '#공정함', '#계획의달인'],
      praise: '선생님은 아이들 한 명 한 명의 성장을 꼼꼼하게 계획하고, 목표를 향해 꾸준히 나아갈 수 있도록 돕는 믿음직한 네비게이터입니다. 철저한 수업 준비와 공정한 평가, 책임감 있는 모습은 아이들에게 노력의 가치를 몸소 보여줘요.',
      interpretation: '개별화된 피드백, 체계적인 학습 관리, 장기 프로젝트 지도에서 빛을 발합니다. 선생님의 성실한 모습을 보며 아이들은 자기 주도 학습의 중요성을 배우게 됩니다.',
    },
    mid: {
      title: '유연한 계획 실행가',
      keywords: ['#계획과유연', '#균형잡힌실행', '#적응력'],
      praise: '선생님은 계획을 세우되 상황에 따라 유연하게 조절할 줄 아는 실행력을 갖추고 있어요.',
      interpretation: '체계성과 즉흥성의 균형이 강점이에요. 수업 계획의 큰 틀은 유지하되, 학생 반응에 따라 변형하는 것이 잘 어울려요.',
    },
    low: {
      title: '유연한 상황 대처 전문가',
      keywords: ['#자율성존중', '#즉흥수업', '#유연한사고', '#위기대처'],
      praise: '선생님은 정해진 계획보다 아이들의 흥미와 필요에 따라 수업 방향을 유연하게 바꾸는 순발력의 대가입니다. 예기치 못한 상황도 즐거운 배움의 기회로 만들어버리는 마법 같은 능력이 있어요.',
      interpretation: '토론이 예상치 못한 방향으로 흘러갈 때, 아이들의 관심사에서 새로운 배움의 실마리를 찾아낼 때 큰 힘이 됩니다. 때로는 즉흥적인 활동이 가장 기억에 남는 수업이 될 수 있어요.',
    },
  },
  신경증: {
    emoji: '🎈', color: 'var(--cc-lavender-deep, #7C3AED)', colorHex: '#7C3AED', colorLight: 'var(--cc-lavender-light, #EDE9FE)',
    lowLabel: '예민함', highLabel: '무던함',
    // 주의: 신경증은 반전 표시하므로 high=정서안정성 높음=무던함, low=정서안정성 낮음=예민함
    high: {
      title: '폭풍 속의 평온한 등대',
      keywords: ['#침착함', '#위기대처능력', '#정서적안정감', '#스트레스관리'],
      praise: '교실이 아수라장이 되는 순간에도 선생님은 쉽게 평정심을 잃지 않는 강인한 등대와 같습니다. 침착하고 안정적인 태도는 혼란스러운 상황을 빠르게 정리하고, 아이들에게 괜찮다는 무언의 메시지를 전달해요.',
      interpretation: '예기치 못한 사건사고 대응, 갈등 중재, 압박감 높은 공개수업 진행 시 정서적 안정감이 모두에게 힘이 됩니다. 선생님의 침착함을 보며 아이들은 회복탄력성을 배우게 돼요.',
    },
    mid: {
      title: '균형잡힌 감정 조율사',
      keywords: ['#감정균형', '#공감과침착', '#상황적응'],
      praise: '선생님은 학생의 감정에 공감하면서도 자신의 정서를 안정적으로 유지할 줄 아는 조율 능력을 갖추고 있어요.',
      interpretation: '감정적 상황에서 공감과 침착함을 동시에 보여줄 수 있는 것이 강점이에요.',
    },
    low: {
      title: '섬세한 마음 스캐너',
      keywords: ['#세심한관찰', '#공감적지지', '#위기감지', '#안전제일'],
      praise: '선생님은 아이들의 작은 표정 변화에서도 마음 상태를 읽어내는 섬세한 레이더를 가지고 계십니다. 위험이나 갈등을 미리 감지하고 대처하는 능력은 선생님의 뛰어난 감수성 덕분이에요.',
      interpretation: '학기 초 학생 적응 지원, 학교 폭력 예방, 불안한 학생 상담에서 특히 중요합니다. 선생님의 예민함을 아이들을 지키는 힘으로 바라봐 주세요.',
    },
  },
  개방성: {
    emoji: '🎨', color: 'var(--cc-peach-deep, #EA580C)', colorHex: '#EA580C', colorLight: 'var(--cc-peach-light, #FFF7ED)',
    lowLabel: '완고함', highLabel: '유연함',
    high: {
      title: '창의적인 수업 탐험가',
      keywords: ['#프로젝트수업', '#예술적감각', '#질문의힘', '#창의융합'],
      praise: '선생님은 교실이라는 캔버스에 새로운 아이디어로 그림을 그리는 예술가와 같습니다. 틀에 박힌 수업보다 아이들의 호기심을 자극하는 다양한 활동을 시도하며, 지식을 생생한 경험으로 만들어주는 특별한 재능이 있어요.',
      interpretation: '프로젝트 기반 학습(PBL), 토론 수업, 창의적 체험 활동에서 엄청난 강점이 됩니다. 아이들이 정답 없는 질문에 도전하도록 격려해주세요. 선생님의 창의력이 아이들의 잠재력을 깨우는 열쇠가 될 거예요.',
    },
    mid: {
      title: '호기심과 안정의 균형자',
      keywords: ['#균형적탐구', '#열린마음', '#검증된혁신'],
      praise: '선생님은 새로운 것에 열린 마음을 가지면서도, 검증된 방법의 가치를 알고 있는 균형잡힌 교육자예요.',
      interpretation: '새로운 교수법을 조금씩 도입하면서도 안정적인 기본 틀을 유지하는 것이 잘 어울려요.',
    },
    low: {
      title: '안정적인 수업 설계자',
      keywords: ['#체계적수업', '#안정감', '#루틴의힘', '#신뢰'],
      praise: '선생님은 예측 가능하고 안정적인 수업 환경을 만들어 아이들에게 심리적 안정감을 주는 등대와 같은 분입니다. 검증된 교육 방법과 체계적인 커리큘럼으로 아이들이 흔들림 없이 학습 목표에 도달하도록 이끌어주세요.',
      interpretation: '기초 학력을 다지고, 명확한 규칙과 루틴으로 안정적인 학급 분위기를 만드는 데 탁월합니다. 예측 가능한 수업 구조는 불안감이 높은 아이들에게 특히 큰 도움이 돼요.',
    },
  },
};

const LEVEL_COLORS = {
  H: { bg: '#DCFCE7', text: '#166534', label: '높음' },
  M: { bg: '#FEF9C3', text: '#854D0E', label: '보통' },
  L: { bg: '#FFE4E6', text: '#9F1239', label: '낮음' },
};

const KR_AVERAGES: Record<string, number> = {
  외향성: 55, 친화성: 62, 성실성: 58, 신경증: 48, 개방성: 56,
};

export default function Big5Result({ result }: { result: unknown }) {
  const r = result as B5Result;
  const [activeTab, setActiveTab] = useState<'radar' | 'spectrum'>('spectrum');

  const detailed = r.detailed || Object.fromEntries(
    Object.entries(r.factors).map(([k, v]) => {
      const pct = Math.round(((v - 1) / 4) * 100);
      return [k, { raw: v, pct, level: pct >= 70 ? 'H' : pct >= 40 ? 'M' : 'L' } as Big5Factor];
    })
  );

  const profile = BIG5_PROFILES.find(p => p.id === r.profileId) || BIG5_PROFILES[5];

  // 신경증 → 정서안정성 반전
  const displayData = Object.entries(detailed).map(([name, f]) => {
    const displayName = name === '신경증' ? '정서안정성' : name;
    const displayPct = name === '신경증' ? 100 - f.pct : f.pct;
    const displayLevel: 'H' | 'M' | 'L' = name === '신경증'
      ? (f.level === 'H' ? 'L' : f.level === 'L' ? 'H' : 'M')
      : f.level;
    return { name, displayName, ...f, displayPct, displayLevel };
  });

  const radarData = displayData.map(d => ({
    name: d.displayName,
    value: d.displayPct,
    avg: d.name === '신경증' ? 100 - (KR_AVERAGES[d.name] ?? 50) : (KR_AVERAGES[d.name] ?? 50),
  }));

  // 두드러진 특성 (67 이상 또는 33 이하)
  const prominent = displayData.filter(d => d.displayPct >= 67 || d.displayPct <= 33);
  // 없으면 가장 높은/낮은 것
  // prominent.length === 0 handled by highlightTraits fallback below
  const sorted = [...displayData].sort((a, b) => b.displayPct - a.displayPct);
  const highlightTraits = prominent.length > 0
    ? prominent
    : [sorted[0], sorted[sorted.length - 1]].filter((v, i, a) => a.indexOf(v) === i);

  // 모든 키워드 수집
  const allKeywords = highlightTraits.flatMap(d => {
    const meta = FACTOR_META[d.name];
    const interp = d.displayPct >= 67 ? meta.high : d.displayPct <= 33 ? meta.low : meta.mid;
    return interp.keywords;
  });

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Profile Card */}
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
        <div style={{ fontSize: 56, marginBottom: 8, animation: 'bounce-gentle 2.5s ease-in-out infinite' }}>
          {profile.emoji}
        </div>
        <div className="text-gradient" style={{ fontSize: 22, fontWeight: 800 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 14, color: 'var(--cc-text-sub)', marginTop: 4, lineHeight: 1.5 }}>
          {profile.subtitle}
        </div>

        {/* Level badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 16 }}>
          {displayData.map(d => {
            const lc = LEVEL_COLORS[d.displayLevel];
            return (
              <span key={d.name} style={{
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
                background: lc.bg, color: lc.text,
              }}>
                {d.displayName} {lc.label}
              </span>
            );
          })}
        </div>

        {/* Hashtag keywords */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 14 }}>
          {allKeywords.map((kw, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 14,
              background: 'linear-gradient(135deg, var(--cc-lavender-light, #EDE9FE), var(--cc-pink-light))',
              color: 'var(--cc-lavender-deep, #7C3AED)',
            }}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Visualization tabs */}
      <div
        style={{
          background: 'var(--cc-card)',
          borderRadius: 20,
          padding: '16px 16px 20px',
          boxShadow: 'var(--cc-shadow-soft)',
          border: '1px solid var(--cc-border)',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--cc-bg)', borderRadius: 12, padding: 3 }}>
          {(['spectrum', 'radar'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 700,
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? 'var(--cc-pink-deep)' : 'var(--cc-text-sub)',
                boxShadow: activeTab === tab ? 'var(--cc-shadow-soft)' : 'none',
                cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
              }}
            >
              {tab === 'spectrum' ? '🌈 성격 스펙트럼' : '📊 레이더 차트'}
            </button>
          ))}
        </div>

        {activeTab === 'spectrum' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {displayData.map(d => {
              const meta = FACTOR_META[d.name];
              const krAvg = d.name === '신경증' ? 100 - (KR_AVERAGES[d.name] ?? 50) : (KR_AVERAGES[d.name] ?? 50);
              return (
                <div key={d.name}>
                  <div style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
                    {meta.emoji} {d.displayName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--cc-text-sub)', minWidth: 36, textAlign: 'right' }}>
                      {meta.lowLabel}
                    </span>
                    <div style={{
                      flex: 1, height: 24, borderRadius: 12, position: 'relative',
                      background: `linear-gradient(to right, ${meta.colorHex}22, ${meta.colorHex}88)`,
                    }}>
                      {/* Center line */}
                      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.8)' }} />
                      {/* Korean avg dot */}
                      <div style={{
                        position: 'absolute', top: '50%', left: `${krAvg}%`,
                        width: 16, height: 16, borderRadius: '50%',
                        background: 'white', border: '2px solid #d1d5db',
                        transform: 'translate(-50%, -50%)',
                      }} />
                      {/* My score dot */}
                      <div style={{
                        position: 'absolute', top: '50%', left: `${d.displayPct}%`,
                        width: 22, height: 22, borderRadius: '50%',
                        background: meta.colorHex, border: '3px solid white',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 0 2px ${meta.colorHex}44`,
                        zIndex: 1,
                      }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--cc-text-sub)', minWidth: 36 }}>
                      {meta.highLabel}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 3, fontSize: 10, color: 'var(--cc-text-sub)' }}>
                    <span style={{ fontWeight: 700, color: meta.colorHex }}>{d.displayPct}%</span>
                    <span style={{ margin: '0 4px' }}>·</span>
                    <span>평균 {krAvg}%</span>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 4, fontSize: 10, color: 'var(--cc-text-sub)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#6B7280', display: 'inline-block' }} /> 내 점수
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'white', border: '2px solid #d1d5db', display: 'inline-block' }} /> 한국 평균
              </span>
            </div>
          </div>
        )}

        {activeTab === 'radar' && (
          <>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--cc-border)" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--cc-text)' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Tooltip
                    formatter={((value: any, name: any) => [`${value}%`, name === 'avg' ? '한국 평균' : '내 점수']) as any}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--cc-shadow)', fontSize: 12 }}
                  />
                  <Radar name="한국 평균" dataKey="avg" stroke="#d1d5db" fill="#d1d5db" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 4" />
                  <Radar name="내 점수" dataKey="value" stroke="var(--cc-sky-deep)" fill="var(--cc-sky)" fillOpacity={0.25} strokeWidth={2} animationDuration={1200} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--cc-sky-deep)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 3, background: 'var(--cc-sky-deep)', borderRadius: 2, display: 'inline-block' }} /> 내 점수
              </span>
              <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 3, background: '#d1d5db', borderRadius: 2, display: 'inline-block' }} /> 한국 평균
              </span>
            </div>
          </>
        )}
      </div>

      {/* Prominent trait interpretation cards */}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>✨ 나의 두드러진 강점</div>
      {highlightTraits.map((d, idx) => {
        const meta = FACTOR_META[d.name];
        const interp = d.displayPct >= 67 ? meta.high : d.displayPct <= 33 ? meta.low : meta.mid;

        return (
          <div
            key={d.name}
            style={{
              background: 'var(--cc-card)',
              borderRadius: 20,
              padding: '20px 16px',
              boxShadow: 'var(--cc-shadow-soft)',
              border: '1px solid var(--cc-border)',
              marginBottom: 12,
              borderLeft: `4px solid ${meta.colorHex}`,
              animation: `card-enter 0.6s ease-out both`,
              animationDelay: `${idx * 0.15}s`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{meta.emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{interp.title}</div>
                <div style={{ fontSize: 11, color: 'var(--cc-text-sub)' }}>
                  {d.displayName} {d.displayPct}%
                </div>
              </div>
            </div>

            {/* Praise */}
            <div style={{
              padding: '12px 14px', borderRadius: 14, marginBottom: 10,
              background: `${meta.colorHex}0D`,
              borderLeft: `3px solid ${meta.colorHex}44`,
              fontSize: 13, lineHeight: 1.7, color: 'var(--cc-text)',
            }}>
              {interp.praise}
            </div>

            {/* Interpretation */}
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--cc-text-sub)', paddingLeft: 2 }}>
              💡 {interp.interpretation}
            </div>
          </div>
        );
      })}

      {/* Profile detail card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--cc-pink-light), var(--cc-sky-light, #DBEAFE))',
          borderRadius: 20,
          padding: '20px 16px',
          marginBottom: 16,
          marginTop: 8,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>
          {profile.emoji} {profile.name} 교사의 특징
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-pink-deep)', marginBottom: 4 }}>💪 강점</div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>{profile.strength}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-sky-deep)', marginBottom: 4 }}>🏫 교실에서</div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>{profile.classroom}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-lavender-deep, #7C3AED)', marginBottom: 4 }}>🌱 성장 포인트</div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>{profile.growth}</div>
          </div>
        </div>
      </div>

      {/* Positive note */}
      <div style={{
        padding: '14px 16px', borderRadius: 16,
        background: 'var(--cc-bg)', fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.7,
        textAlign: 'center',
      }}>
        💡 Big5 성격은 좋고 나쁨이 없습니다. 각 차원의 양극 모두 고유한 강점이 있어요.
        <br />자신의 성향을 이해하고 교실에서 활용하는 것이 가장 중요합니다.
      </div>
    </div>
  );
}
