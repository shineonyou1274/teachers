const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const ENNEAGRAM_NAMES: Record<number, string> = {
  1: '개혁가', 2: '조력자', 3: '성취자', 4: '예술가', 5: '탐구자',
  6: '충성가', 7: '낙천가', 8: '지도자', 9: '중재자',
};

const HSP_NAMES: Record<string, string> = { high: '난초형(고감각)', mid: '튤립형(중감각)', low: '민들레형(저감각)' };

const BURNOUT_LABELS: Record<string, string> = { low: '안정', mid: '주의', high: '위험', critical: '심각' };

const PROQOL_LABELS: Record<string, string> = { low: '낮음', mid: '보통', high: '높음' };

interface AllResults {
  enneagram?: { primary: number; wing: number; top3: number[]; scores: Record<number, number> };
  burnout?: { overallLevel: string; totalPct: number; subscales: Record<string, { pct: number; level: string }> };
  big5?: { profileName: string; detailed: Record<string, { pct: number; level: string }> };
  hsp?: { average: number; level: string };
  ecr?: { anxiety: number; avoidance: number; type: string };
  conflict?: { primary: string; styles: Record<string, number> };
  proqol?: { cs: number; bo: number; sts: number; csLevel: string; boLevel: string; stsLevel: string };
}

export function buildPrompt(results: AllResults): string {
  const parts: string[] = [];

  parts.push('당신은 교사 심리 코칭 전문가입니다. 아래는 한 교사의 7가지 심리검사 결과입니다. 이 교사의 성격, 교실 속 패턴, 대인관계 특성, 그리고 실용적인 성장 조언을 종합적으로 분석해주세요.\n');
  parts.push('응답은 다음 형식으로 작성해주세요:');
  parts.push('1. **종합 프로필 요약** (2-3문장)');
  parts.push('2. **교실에서의 강점** (3가지)');
  parts.push('3. **성장 포인트** (2-3가지, 구체적 행동 제안 포함)');
  parts.push('4. **동료 교사와의 관계 팁** (2가지)');
  parts.push('5. **이번 학기 셀프케어 처방** (3가지 구체적 실천 방법)\n');
  parts.push('한국어로, 따뜻하지만 전문적인 톤으로 작성해주세요. 각 검사 결과를 개별적으로 나열하지 말고, 서로 연결해서 통합적으로 해석해주세요.\n');
  parts.push('---\n');

  if (results.enneagram) {
    const e = results.enneagram;
    parts.push(`▸ 에니어그램: ${e.primary}번 ${ENNEAGRAM_NAMES[e.primary]} (날개: ${e.wing}번 ${ENNEAGRAM_NAMES[e.wing]})`);
    parts.push(`  Top3: ${e.top3.map(t => `${t}번 ${ENNEAGRAM_NAMES[t]}(${e.scores[t]}점)`).join(', ')}`);
  }

  if (results.burnout) {
    const b = results.burnout;
    parts.push(`▸ 교사 소진: 전체 ${BURNOUT_LABELS[b.overallLevel]} (${Math.round(b.totalPct * 100)}%)`);
    const subs = Object.entries(b.subscales)
      .sort((a, b) => b[1].pct - a[1].pct)
      .map(([name, s]) => `${name} ${Math.round(s.pct * 100)}%(${BURNOUT_LABELS[s.level] || s.level})`);
    parts.push(`  하위척도: ${subs.join(', ')}`);
  }

  if (results.big5) {
    const b = results.big5;
    parts.push(`▸ Big5 성격: ${b.profileName}`);
    if (b.detailed) {
      const factors = Object.entries(b.detailed).map(([name, f]) => {
        const displayName = name === '신경증' ? '정서안정성' : name;
        const displayPct = name === '신경증' ? 100 - f.pct : f.pct;
        return `${displayName} ${displayPct}%`;
      });
      parts.push(`  ${factors.join(', ')}`);
    }
  }

  if (results.hsp) {
    parts.push(`▸ 감각 민감도(HSP): ${HSP_NAMES[results.hsp.level]} (평균 ${results.hsp.average.toFixed(1)}/7)`);
  }

  if (results.ecr) {
    const e = results.ecr;
    parts.push(`▸ 성인 애착유형: ${e.type} (불안 ${e.anxiety.toFixed(1)}, 회피 ${e.avoidance.toFixed(1)})`);
  }

  if (results.conflict) {
    const c = results.conflict;
    const sorted = Object.entries(c.styles).sort((a, b) => b[1] - a[1]);
    parts.push(`▸ 갈등해결 스타일: 주 스타일 ${c.primary}`);
    parts.push(`  ${sorted.map(([name, score]) => `${name} ${score.toFixed(1)}`).join(', ')}`);
  }

  if (results.proqol) {
    const p = results.proqol;
    parts.push(`▸ ProQOL: 공감만족 ${p.cs}점(${PROQOL_LABELS[p.csLevel]}), 번아웃 ${p.bo}점(${PROQOL_LABELS[p.boLevel]}), 이차외상 ${p.sts}점(${PROQOL_LABELS[p.stsLevel]})`);
  }

  return parts.join('\n');
}

export async function getAIInterpretation(results: AllResults): Promise<string> {
  const prompt = buildPrompt(results);

  const res = await fetch(`${SUPABASE_URL}/functions/v1/claude-interpret`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API 요청 실패 (${res.status})`);
  }

  const data = await res.json();
  return data.interpretation;
}
