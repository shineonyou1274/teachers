# Claude Code에게 건네줄 프롬프트

아래 텍스트를 Claude Code에 그대로 붙여넣으세요.

---

## [Claude Code용 프롬프트 — 복사해서 사용]

```
이 프로젝트는 한국 교사 에니어그램 스터디를 위한 심리검사 통합 앱입니다.

# 자료 위치
- CLAUDE.md       → 전체 스펙, 채점 로직, 디자인 가이드
- data/enneagram.json   → 에니어그램 9유형 × 20문항 전체 + 교사 하위유형
- data/burnout.json     → 교사 소진 22문항 + 채점 기준 + 맞춤 조언
- data/other_tests.json → 빅5·HSP·ECR·갈등해결·ProQOL 문항 전체
- data/scoring.ts       → TypeScript 채점 함수 (역채점 포함)

# 먼저 할 일
1. CLAUDE.md 읽기
2. 데이터 파일 읽기
3. React + Vite 프로젝트 초기화
4. 에니어그램 + 교사 소진 검사 먼저 구현

# 핵심 요구사항
- 에니어그램: 9유형 × 20문항을 유형별 1페이지씩 (총 9페이지)
- 교사 소진: 22문항 자동 채점 → 5개 하위척도 결과 + 수준별 맞춤 조언
- 디자인: Pretendard 폰트, 따뜻한 크림 톤 (#FDF8F0), 테라코타 포인트 (#C4622D)
- Supabase 연동으로 그룹 결과 공유 기능 포함

CLAUDE.md와 data/ 폴더를 먼저 읽고 시작해주세요.
```

---

## 파일 구조 요약

```
teacher-psych-app/
├── CLAUDE.md                    ← Claude Code가 가장 먼저 읽을 파일
├── data/
│   ├── enneagram.json           ← 에니어그램 전체 데이터
│   ├── burnout.json             ← 교사 소진 + 조언
│   ├── other_tests.json         ← 빅5, HSP, ECR, 갈등해결, ProQOL
│   └── scoring.ts               ← 채점 함수 (TypeScript)
└── HOW_TO_USE_FOR_CLAUDE_CODE.md ← 이 파일
```

## 각 파일 용도

| 파일 | 내용 | Claude Code가 사용하는 방법 |
|------|------|--------------------------|
| `CLAUDE.md` | 전체 스펙, 앱 구조, 채점 로직 요약 | 프로젝트 컨텍스트 파악 |
| `enneagram.json` | 9유형 × 20문항 + 하위유형 교사 설명 | UI에 직접 import |
| `burnout.json` | 22문항 + 하위척도 + 수준별 조언 텍스트 | 채점 + 결과 화면 |
| `other_tests.json` | 나머지 5개 검사 | Phase 2에서 순차적으로 추가 |
| `scoring.ts` | 모든 역채점·합산 로직 | `src/utils/scoring.ts`로 복사 |

## 추가로 줄 수 있는 자료

- 교사 소진 원본 PDF (있으면 정연홍 2016 논문)
- 에니어그램 교사 속마음 PDF → 이미 data에 반영됨
- 에니어그램 자가진단지 PDF → 이미 data에 반영됨
- 비판적 의식 척도 PDF (KCI 논문) → other_tests에 추가 예정
