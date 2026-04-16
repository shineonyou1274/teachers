/**
 * 교사 심리 배터리 — 채점 함수 모음
 * 모든 역채점은 이 파일에서 처리합니다.
 */

// ===== 타입 정의 =====

export type AnswerMap = Record<string, number>; // { "item_1": 3, "item_2": 5, ... }

export interface EnneagramResult {
  scores: Record<number, number>;          // { 1: 72, 2: 55, ... }
  ranked: Array<[number, number]>;         // [[1,72],[3,60],...] 내림차순
  primary: number;                         // 주유형 id
  wing: number;                            // 날개 id
  top3: number[];                          // [주유형, 2위, 3위]
}

export interface BurnoutSubscale {
  score: number;
  maxScore: number;
  pct: number;                             // 0~1
  level: 'low' | 'mid' | 'high';
}

export interface BurnoutResult {
  subscales: Record<string, BurnoutSubscale>;
  total: number;
  totalMax: number;
  totalPct: number;
  overallLevel: 'low' | 'mid' | 'high' | 'critical';
}

export interface Big5Factor {
  raw: number;          // 원점수 평균 (1-5)
  pct: number;          // 백분율 (0-100)
  level: 'H' | 'M' | 'L';
}

export interface Big5Result {
  factors: Record<string, number>;         // 요인별 평균 (1-5) — 하위 호환
  detailed: Record<string, Big5Factor>;    // 요인별 상세
  profileId: number;                       // 매칭된 프로필 번호
  profileName: string;                     // 프로필명
}

export interface HSPResult {
  average: number;                         // 전체 평균 (1-7)
  level: 'high' | 'mid' | 'low';
}

export interface ECRResult {
  anxiety: number;                         // 불안 차원 평균 (1-7)
  avoidance: number;                       // 회피 차원 평균 (1-7, 역채점 후)
  type: '안정형' | '몰두형' | '무시-회피형' | '두려운-회피형';
}

export interface ConflictResult {
  styles: Record<string, number>;          // 스타일별 평균 (1-5)
  primary: string;                         // 주된 갈등해결 스타일
}

export interface ProQOLResult {
  cs: number;   // 공감만족 합산 (10-50)
  bo: number;   // 번아웃 합산
  sts: number;  // 이차외상 합산
  csLevel: 'low' | 'mid' | 'high';
  boLevel: 'low' | 'mid' | 'high';
  stsLevel: 'low' | 'mid' | 'high';
}

// ===== 유틸리티 =====

function reverseScore(raw: number, maxScale: number = 5): number {
  return (maxScale + 1) - raw;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function proqolLevel(score: number): 'low' | 'mid' | 'high' {
  if (score <= 22) return 'low';
  if (score <= 41) return 'mid';
  return 'high';
}

// ===== 에니어그램 채점 =====

export function scoreEnneagram(answers: AnswerMap): EnneagramResult {
  const typeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const scores: Record<number, number> = {};

  typeIds.forEach(id => {
    let sum = 0;
    for (let i = 0; i < 20; i++) {
      sum += answers[`e${id}_${i}`] ?? 0;
    }
    scores[id] = sum;
  });

  // 내림차순 정렬
  const ranked = Object.entries(scores)
    .map(([k, v]) => [parseInt(k), v] as [number, number])
    .sort((a, b) => b[1] - a[1]);

  const primary = ranked[0][0];
  const primaryIdx = typeIds.indexOf(primary);

  // 날개: 인접 유형 중 점수가 높은 쪽
  const leftId = typeIds[(primaryIdx + 8) % 9];  // -1
  const rightId = typeIds[(primaryIdx + 1) % 9]; // +1
  const wing = scores[leftId] >= scores[rightId] ? leftId : rightId;

  return {
    scores,
    ranked,
    primary,
    wing,
    top3: ranked.slice(0, 3).map(([id]) => id),
  };
}

// ===== 교사 소진 채점 =====

const BURNOUT_SUBSCALES: Record<string, { items: number[]; reverseItems: number[]; maxScore: number }> = {
  교권위기감: { items: [1,2,3,4,5],       reverseItems: [],     maxScore: 25 },
  무능감:     { items: [6,7,8,9],         reverseItems: [6,7,8], maxScore: 20 },
  좌절감:     { items: [10,11,12,13],     reverseItems: [],     maxScore: 20 },
  '행정업무 부담감': { items: [14,15,16,17], reverseItems: [], maxScore: 20 },
  교직회의감: { items: [18,19,20,21,22],  reverseItems: [],     maxScore: 25 },
};

export function scoreBurnout(answers: AnswerMap): BurnoutResult {
  const subscales: Record<string, BurnoutSubscale> = {};
  let total = 0;

  Object.entries(BURNOUT_SUBSCALES).forEach(([key, { items, reverseItems, maxScore }]) => {
    let sum = 0;
    items.forEach(id => {
      const raw = answers[`b${id}`] ?? 1;
      sum += reverseItems.includes(id) ? reverseScore(raw, 5) : raw;
    });
    const pct = sum / maxScore;
    const level: 'low' | 'mid' | 'high' = pct <= 0.44 ? 'low' : pct <= 0.66 ? 'mid' : 'high';
    subscales[key] = { score: sum, maxScore, pct, level };
    total += sum;
  });

  const totalPct = total / 110;
  const overallLevel: BurnoutResult['overallLevel'] =
    totalPct <= 0.40 ? 'low' :
    totalPct <= 0.55 ? 'mid' :
    totalPct <= 0.72 ? 'high' : 'critical';

  return { subscales, total, totalMax: 110, totalPct, overallLevel };
}

// ===== 빅5 채점 =====

const BIG5_FACTORS: Record<string, { items: number[]; reverseItems: number[] }> = {
  외향성: { items: [1,6],  reverseItems: [1] },
  친화성: { items: [2,7],  reverseItems: [7] },
  성실성: { items: [3,8],  reverseItems: [3] },
  신경증: { items: [4,9],  reverseItems: [4] },
  개방성: { items: [5,10], reverseItems: [5] },
};

// 교사 프로필 10종 (Big5 패턴 기반)
export const BIG5_PROFILES: Array<{
  id: number; name: string; subtitle: string; emoji: string;
  pattern: Record<string, 'H' | 'M' | 'L'>;
  strength: string; classroom: string; growth: string;
}> = [
  { id: 1, name: '따뜻한 멘토형', subtitle: '공감과 배려로 이끄는 교사', emoji: '🌟',
    pattern: { 외향성: 'H', 친화성: 'H', 성실성: 'M', 정서안정성: 'M', 개방성: 'M' },
    strength: '학생과의 관계 형성, 공감 능력', classroom: '학생들이 편안하게 다가오는 분위기를 만들어요', growth: '감정 소모를 관리하는 경계 설정이 필요해요' },
  { id: 2, name: '체계적 설계자형', subtitle: '꼼꼼한 계획으로 수업을 디자인', emoji: '📐',
    pattern: { 외향성: 'M', 친화성: 'M', 성실성: 'H', 정서안정성: 'H', 개방성: 'M' },
    strength: '수업 설계, 평가 체계, 업무 정확성', classroom: '체계적이고 예측 가능한 학습 환경을 제공해요', growth: '즉흥적인 상황 대처에 유연성을 더해보세요' },
  { id: 3, name: '열정적 에너자이저형', subtitle: '교실에 활력을 불어넣는 교사', emoji: '🔥',
    pattern: { 외향성: 'H', 친화성: 'M', 성실성: 'M', 정서안정성: 'H', 개방성: 'H' },
    strength: '수업 동기 부여, 분위기 리더십', classroom: '에너지 넘치는 수업으로 학생 참여를 이끌어내요', growth: '조용한 학생들에게도 관심을 기울여보세요' },
  { id: 4, name: '창의적 탐험가형', subtitle: '새로운 시도를 즐기는 혁신 교사', emoji: '🚀',
    pattern: { 외향성: 'M', 친화성: 'M', 성실성: 'M', 정서안정성: 'M', 개방성: 'H' },
    strength: '창의적 수업, 융합 프로젝트, 새로운 교수법', classroom: '다양한 활동으로 학생의 호기심을 자극해요', growth: '기본기와 루틴의 가치도 놓치지 마세요' },
  { id: 5, name: '조용한 지지자형', subtitle: '묵묵히 곁에서 응원하는 교사', emoji: '🌿',
    pattern: { 외향성: 'L', 친화성: 'H', 성실성: 'H', 정서안정성: 'M', 개방성: 'M' },
    strength: '1:1 상담, 세심한 관찰, 꾸준한 지원', classroom: '소수의 학생과 깊은 유대를 형성해요', growth: '전체 학급 앞에서의 존재감을 키워보세요' },
  { id: 6, name: '균형잡힌 조율자형', subtitle: '다양한 역할을 유연하게 소화', emoji: '⚖️',
    pattern: { 외향성: 'M', 친화성: 'M', 성실성: 'M', 정서안정성: 'M', 개방성: 'M' },
    strength: '상황 적응력, 다양한 역할 수행', classroom: '학급의 필요에 따라 유연하게 대응해요', growth: '자신만의 뚜렷한 교육 철학을 세워보세요' },
  { id: 7, name: '분석적 전략가형', subtitle: '데이터와 논리로 교육하는 교사', emoji: '🔍',
    pattern: { 외향성: 'L', 친화성: 'L', 성실성: 'H', 정서안정성: 'H', 개방성: 'M' },
    strength: '논리적 수업 구성, 객관적 평가', classroom: '명확한 기준과 공정한 평가로 신뢰를 얻어요', growth: '학생의 감정적 필요에 좀 더 관심을 가져보세요' },
  { id: 8, name: '감성적 예술가형', subtitle: '감성과 미적 감각으로 수업하는 교사', emoji: '🎨',
    pattern: { 외향성: 'M', 친화성: 'H', 성실성: 'L', 정서안정성: 'L', 개방성: 'H' },
    strength: '감성적 수업, 예술 융합, 분위기 조성', classroom: '아름답고 감동적인 수업 경험을 만들어요', growth: '체계성과 일관성을 보완하면 더 좋아요' },
  { id: 9, name: '든든한 파수꾼형', subtitle: '책임감으로 학급을 지키는 교사', emoji: '🛡️',
    pattern: { 외향성: 'M', 친화성: 'M', 성실성: 'H', 정서안정성: 'H', 개방성: 'L' },
    strength: '학급 운영, 규칙 관리, 안정감 제공', classroom: '안전하고 예측 가능한 환경을 만들어요', growth: '새로운 교수법이나 활동도 시도해보세요' },
  { id: 10, name: '자유로운 촉진자형', subtitle: '학생 주도 학습을 이끄는 교사', emoji: '🦋',
    pattern: { 외향성: 'H', 친화성: 'M', 성실성: 'L', 정서안정성: 'M', 개방성: 'H' },
    strength: '학생 주도 활동, 토론 수업, 프로젝트', classroom: '학생이 스스로 탐구하도록 격려해요', growth: '구조와 마감 관리에 신경 써보세요' },
];

function matchBig5Profile(detailed: Record<string, Big5Factor>): { id: number; name: string } {
  // 신경증 → 정서안정성 변환
  const levels: Record<string, 'H' | 'M' | 'L'> = {};
  for (const [k, v] of Object.entries(detailed)) {
    if (k === '신경증') {
      // 반전: 높은 신경증 = 낮은 정서안정성
      levels['정서안정성'] = v.level === 'H' ? 'L' : v.level === 'L' ? 'H' : 'M';
    } else {
      levels[k] = v.level;
    }
  }

  const weights: Record<string, number> = { 개방성: 3, 성실성: 3, 외향성: 2, 친화성: 2, 정서안정성: 1 };
  let bestScore = -1;
  let bestProfile = BIG5_PROFILES[5]; // fallback: 균형잡힌 조율자형

  for (const profile of BIG5_PROFILES) {
    let score = 0;
    let total = 0;
    for (const [dim, w] of Object.entries(weights)) {
      total += w;
      if (levels[dim] === profile.pattern[dim]) score += w;
    }
    const similarity = score / total;
    if (similarity > bestScore) {
      bestScore = similarity;
      bestProfile = profile;
    }
  }

  return { id: bestProfile.id, name: bestProfile.name };
}

export function scoreBig5(answers: AnswerMap): Big5Result {
  const factors: Record<string, number> = {};
  const detailed: Record<string, Big5Factor> = {};

  Object.entries(BIG5_FACTORS).forEach(([factor, { items, reverseItems }]) => {
    const values = items.map(id => {
      const raw = answers[`big5_${id}`] ?? 3;
      return reverseItems.includes(id) ? reverseScore(raw, 5) : raw;
    });
    const rawAvg = avg(values);
    // BFI-K-10: 2문항, 1-5점 → 평균 1-5
    const pct = Math.round(((rawAvg - 1) / 4) * 100);
    const level: 'H' | 'M' | 'L' = pct >= 70 ? 'H' : pct >= 40 ? 'M' : 'L';

    factors[factor] = rawAvg;
    detailed[factor] = { raw: rawAvg, pct, level };
  });

  const profile = matchBig5Profile(detailed);
  return { factors, detailed, profileId: profile.id, profileName: profile.name };
}

// ===== HSP 채점 =====

export function scoreHSP(answers: AnswerMap): HSPResult {
  const values: number[] = [];
  for (let i = 1; i <= 18; i++) {
    values.push(answers[`hsp_${i}`] ?? 4);
  }
  const average = avg(values);
  const level: HSPResult['level'] =
    average >= 5.25 ? 'high' :
    average >= 4.31 ? 'mid' : 'low';

  return { average, level };
}

// ===== ECR 성인 애착 채점 =====

export function scoreECR(answers: AnswerMap): ECRResult {
  // 불안: 문항 1-7 (역채점 없음)
  const anxietyValues = Array.from({ length: 7 }, (_, i) =>
    answers[`ecr_${i + 1}`] ?? 4
  );
  const anxiety = avg(anxietyValues);

  // 회피: 문항 8-14 (전부 역채점, max=7)
  const avoidanceValues = Array.from({ length: 7 }, (_, i) =>
    reverseScore(answers[`ecr_${i + 8}`] ?? 4, 7)
  );
  const avoidance = avg(avoidanceValues);

  const cutoff = 4.0;
  const type: ECRResult['type'] =
    anxiety < cutoff && avoidance < cutoff ? '안정형' :
    anxiety >= cutoff && avoidance < cutoff ? '몰두형' :
    anxiety < cutoff && avoidance >= cutoff ? '무시-회피형' : '두려운-회피형';

  return { anxiety, avoidance, type };
}

// ===== 갈등해결 스타일 채점 =====

const CONFLICT_STYLES: Record<string, number[]> = {
  경쟁: [1,2,3],
  회피: [4,5,6],
  타협: [7,8,9],
  협력: [10,11,12],
  수용: [13,14,15],
};

export function scoreConflict(answers: AnswerMap): ConflictResult {
  const styles: Record<string, number> = {};

  Object.entries(CONFLICT_STYLES).forEach(([style, items]) => {
    const values = items.map(id => answers[`conflict_${id}`] ?? 3);
    styles[style] = avg(values);
  });

  const primary = Object.entries(styles).sort((a, b) => b[1] - a[1])[0][0];

  return { styles, primary };
}

// ===== ProQOL 채점 =====

const PROQOL_SUBSCALES = {
  cs:  { items: [3,6,12,16,18,20,22,24,27,30], reverseItems: [] },
  bo:  { items: [1,4,8,10,15,17,19,21,26,29],  reverseItems: [1,4,15,17,29] },
  sts: { items: [2,5,7,9,11,13,14,23,25,28],   reverseItems: [] },
};

export function scoreProQOL(answers: AnswerMap): ProQOLResult {
  const calc = (subscale: keyof typeof PROQOL_SUBSCALES) => {
    const { items, reverseItems } = PROQOL_SUBSCALES[subscale];
    return items.reduce((sum, id) => {
      const raw = answers[`proqol_${id}`] ?? 3;
      return sum + (reverseItems.includes(id) ? reverseScore(raw, 5) : raw);
    }, 0);
  };

  const cs = calc('cs');
  const bo = calc('bo');
  const sts = calc('sts');

  return {
    cs, bo, sts,
    csLevel: proqolLevel(cs),
    boLevel: proqolLevel(bo),
    stsLevel: proqolLevel(sts),
  };
}

// ===== Answer Key 생성 헬퍼 =====
// 각 검사의 answerMap key 형식:
//   에니어그램:  `e${typeId}_${itemIndex}`  예: "e1_0", "e9_19"
//   소진:       `b${itemId}`              예: "b1", "b22"
//   빅5:        `big5_${itemId}`          예: "big5_1"
//   HSP:        `hsp_${itemId}`           예: "hsp_1"
//   ECR:        `ecr_${itemId}`           예: "ecr_1"
//   갈등해결:   `conflict_${itemId}`      예: "conflict_1"
//   ProQOL:     `proqol_${itemId}`        예: "proqol_1"
