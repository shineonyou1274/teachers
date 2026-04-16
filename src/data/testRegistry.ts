export interface TestMeta {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  questionCount: number;
  scaleMax: number;
  paginateBy: 'type' | number;
  color: string;
  colorVar: string;
}

export const TEST_REGISTRY: TestMeta[] = [
  {
    id: 'enneagram',
    name: '에니어그램 성격유형',
    subtitle: '9가지 유형 중 나는 어디에? 교사로서의 강점과 성장 포인트를 발견해요',
    icon: '🎡',
    questionCount: 180,
    scaleMax: 5,
    paginateBy: 'type',
    color: 'pink',
    colorVar: '--test-enneagram',
  },
  {
    id: 'burnout',
    name: '교사 소진 검사',
    subtitle: '나의 에너지 배터리는 얼마나 남았을까? 소진 영역별 맞춤 처방을 받아보세요',
    icon: '🎠',
    questionCount: 22,
    scaleMax: 5,
    paginateBy: 11,
    color: 'orange',
    colorVar: '--test-burnout',
  },
  {
    id: 'big5',
    name: '빅5 성격검사',
    subtitle: '외향성, 친화성, 성실성, 신경증, 개방성 다섯 가지 성격 차원을 탐색해요',
    icon: '🎨',
    questionCount: 10,
    scaleMax: 5,
    paginateBy: 10,
    color: 'blue',
    colorVar: '--test-big5',
  },
  {
    id: 'hsp',
    name: '고감각인(HSP) 검사',
    subtitle: '나는 난초형? 튤립형? 민들레형? 감각 민감도를 알아보세요',
    icon: '🍭',
    questionCount: 18,
    scaleMax: 7,
    paginateBy: 9,
    color: 'purple',
    colorVar: '--test-hsp',
  },
  {
    id: 'ecr',
    name: '성인 애착유형',
    subtitle: '안정형, 몰두형, 무시형, 두려움형 — 나의 관계 패턴은?',
    icon: '🎪',
    questionCount: 14,
    scaleMax: 7,
    paginateBy: 7,
    color: 'green',
    colorVar: '--test-ecr',
  },
  {
    id: 'conflict',
    name: '갈등해결 스타일',
    subtitle: '경쟁, 회피, 타협, 협력, 수용 — 나만의 갈등 대처법을 확인해요',
    icon: '🎯',
    questionCount: 15,
    scaleMax: 5,
    paginateBy: 15,
    color: 'yellow',
    colorVar: '--test-conflict',
  },
  {
    id: 'proqol',
    name: '공감피로/만족 (ProQOL)',
    subtitle: '공감만족, 번아웃, 이차외상 — 돌봄 전문가의 마음 건강 체크',
    icon: '🎈',
    questionCount: 30,
    scaleMax: 5,
    paginateBy: 10,
    color: 'rose',
    colorVar: '--test-proqol',
  },
];

export function getTestMeta(testId: string): TestMeta | undefined {
  return TEST_REGISTRY.find(t => t.id === testId);
}
