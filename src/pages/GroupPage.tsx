import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Legend, PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import { getCurrentUser } from '../utils/auth';
import { getAllResults } from '../utils/storage';
import {
  shareAllResults, fetchAllShared,
  type SharedResult,
} from '../utils/supabase';
import type {
  EnneagramResult, BurnoutResult, Big5Result, HSPResult,
  ECRResult, ConflictResult as CResult, ProQOLResult,
} from '../utils/scoring';

const ENNEAGRAM_NAMES: Record<number, string> = {
  1: '개혁가', 2: '조력자', 3: '성취자', 4: '예술가', 5: '탐구자',
  6: '충성가', 7: '낙천가', 8: '지도자', 9: '중재자',
};

const COLORS = ['#EC4899', '#8B5CF6', '#3B82F6', '#059669', '#F97316', '#EF4444', '#14B8A6', '#F59E0B', '#6366F1'];

type MemberData = Record<string, Record<string, unknown>>;

export default function GroupPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [shared, setShared] = useState<SharedResult[]>([]);
  const [members, setMembers] = useState<MemberData>({});
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState<'radar' | 'enneagram' | 'conflict' | 'burnout'>('radar');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const loadShared = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await fetchAllShared();
      setShared(rows);
      // Group by nickname
      const grouped: MemberData = {};
      rows.forEach(r => {
        if (!grouped[r.nickname]) grouped[r.nickname] = {};
        grouped[r.nickname][r.test_id] = r.result_data;
      });
      setMembers(grouped);
      setSelectedMembers(Object.keys(grouped));
    } catch {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadShared(); }, [loadShared]);

  const handleShare = async () => {
    const nickname = user?.nickname;
    if (!nickname) {
      setError('로그인 후 공유할 수 있습니다.');
      return;
    }
    const results = getAllResults();
    if (Object.keys(results).length === 0) {
      setError('공유할 검사 결과가 없습니다.');
      return;
    }
    try {
      setSharing(true);
      setError('');
      await shareAllResults(nickname, results);
      setSuccess('결과가 공유되었습니다!');
      await loadShared();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('공유에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSharing(false);
    }
  };

  const toggleMember = (name: string) => {
    setSelectedMembers(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name],
    );
  };

  const memberNames = Object.keys(members);
  const activeMemberNames = memberNames.filter(n => selectedMembers.includes(n));

  return (
    <div style={{ animation: 'slide-up 0.6s ease-out' }}>
      {/* Hero */}
      <div style={{
        background: 'var(--cc-card)', borderRadius: 24, padding: '28px 20px',
        boxShadow: 'var(--cc-shadow)', border: '1.5px solid var(--cc-border)',
        textAlign: 'center', marginBottom: 16,
      }}>
        <div style={{ fontSize: 48, animation: 'bounce-gentle 2.5s ease-in-out infinite' }}>🎪</div>
        <div className="text-gradient" style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>
          그룹 비교
        </div>
        <div style={{ fontSize: 13, color: 'var(--cc-text-sub)', marginTop: 4 }}>
          스터디 그룹원의 심리검사 결과를 함께 비교해요
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          disabled={sharing || !user || user.role === 'guest'}
          style={{
            marginTop: 16, padding: '10px 24px', borderRadius: 24, border: 'none',
            background: sharing ? 'var(--cc-border)' : 'var(--cc-gradient-btn)',
            color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', opacity: (!user || user.role === 'guest') ? 0.5 : 1,
          }}
        >
          {sharing ? '공유 중...' : '📤 내 결과 공유하기'}
        </button>
        {(!user || user.role === 'guest') && (
          <div style={{ fontSize: 11, color: 'var(--cc-text-sub)', marginTop: 6 }}>
            가입 후 공유할 수 있어요
          </div>
        )}
      </div>

      {/* Status messages */}
      {error && (
        <div style={{ background: '#FEE2E2', color: '#DC2626', borderRadius: 12, padding: '10px 14px', fontSize: 12, marginBottom: 12 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#D1FAE5', color: '#059669', borderRadius: 12, padding: '10px 14px', fontSize: 12, marginBottom: 12 }}>
          ✅ {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--cc-text-sub)', fontSize: 14 }}>
          불러오는 중...
        </div>
      ) : memberNames.length === 0 ? (
        <div style={{
          background: 'var(--cc-card)', borderRadius: 20, padding: '32px 20px',
          textAlign: 'center', border: '1px solid var(--cc-border)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>아직 공유된 결과가 없어요</div>
          <div style={{ fontSize: 12, color: 'var(--cc-text-sub)', lineHeight: 1.6 }}>
            "내 결과 공유하기" 버튼을 눌러<br />첫 번째로 공유해보세요!
          </div>
        </div>
      ) : (
        <>
          {/* Member chips */}
          <div style={{
            background: 'var(--cc-card)', borderRadius: 16, padding: '14px 14px',
            border: '1px solid var(--cc-border)', marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
              👥 공유 멤버 ({memberNames.length}명)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {memberNames.map((name, i) => {
                const active = selectedMembers.includes(name);
                return (
                  <button key={name} onClick={() => toggleMember(name)} style={{
                    padding: '5px 12px', borderRadius: 14, border: 'none',
                    background: active ? COLORS[i % COLORS.length] : 'var(--cc-bg)',
                    color: active ? 'white' : 'var(--cc-text-sub)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab switch */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
            {([
              { key: 'radar' as const, label: '📊 종합 비교' },
              { key: 'enneagram' as const, label: '🎡 에니어그램' },
              { key: 'conflict' as const, label: '🎯 갈등해결' },
              { key: 'burnout' as const, label: '🎠 소진' },
            ]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '8px 14px', borderRadius: 20, border: 'none', whiteSpace: 'nowrap',
                background: tab === t.key ? 'var(--cc-gradient-btn)' : 'var(--cc-card)',
                color: tab === t.key ? 'white' : 'var(--cc-text-sub)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: tab === t.key ? 'none' : 'var(--cc-shadow-soft)',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Chart area */}
          {tab === 'radar' && <RadarComparison members={members} selected={activeMemberNames} />}
          {tab === 'enneagram' && <EnneagramDistribution members={members} selected={activeMemberNames} />}
          {tab === 'conflict' && <ConflictComparison members={members} selected={activeMemberNames} />}
          {tab === 'burnout' && <BurnoutComparison members={members} selected={activeMemberNames} />}
        </>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '16px 0 20px' }}>
        <button onClick={() => navigate('/profile')} style={{
          padding: '10px 20px', borderRadius: 20, border: '1px solid var(--cc-border)',
          background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          🎪 내 프로파일
        </button>
        <button onClick={() => navigate('/')} style={{
          padding: '10px 20px', borderRadius: 20, border: '1px solid var(--cc-border)',
          background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          🏠 홈
        </button>
      </div>
    </div>
  );
}

// ── Radar Comparison ──

function RadarComparison({ members, selected }: { members: MemberData; selected: string[] }) {
  // Build comparative radar: Big5 5 factors for each member
  const factors = ['외향성', '친화성', '성실성', '개방성'];
  const hasData = selected.some(name => members[name]?.big5);

  if (!hasData) {
    return <EmptyChart message="Big5 검사를 공유한 멤버가 없습니다." />;
  }

  const chartData = factors.map(f => {
    const point: Record<string, unknown> = { name: f };
    selected.forEach(name => {
      const big5 = members[name]?.big5 as Big5Result | undefined;
      if (big5?.detailed) {
        const val = f === '정서안정' && big5.detailed['신경증']
          ? 100 - big5.detailed['신경증'].pct
          : big5.detailed[f]?.pct || 0;
        point[name] = Math.round(val);
      }
    });
    return point;
  });

  // Add emotional stability
  chartData.push((() => {
    const point: Record<string, unknown> = { name: '정서안정' };
    selected.forEach(name => {
      const big5 = members[name]?.big5 as Big5Result | undefined;
      if (big5?.detailed?.['신경증']) {
        point[name] = Math.round(100 - big5.detailed['신경증'].pct);
      }
    });
    return point;
  })());

  return (
    <ChartCard title="Big5 성격 비교">
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="var(--cc-border)" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--cc-text)' }} />
            {selected.map((name, i) => (
              <Radar
                key={name}
                name={name}
                dataKey={name}
                stroke={COLORS[Object.keys(members).indexOf(name) % COLORS.length]}
                fill={COLORS[Object.keys(members).indexOf(name) % COLORS.length]}
                fillOpacity={0.08}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ── Enneagram Distribution ──

function EnneagramDistribution({ members, selected }: { members: MemberData; selected: string[] }) {
  const typeCounts: Record<number, number> = {};
  const memberTypes: Array<{ name: string; type: number }> = [];

  selected.forEach(name => {
    const enn = members[name]?.enneagram as EnneagramResult | undefined;
    if (enn) {
      typeCounts[enn.primary] = (typeCounts[enn.primary] || 0) + 1;
      memberTypes.push({ name, type: enn.primary });
    }
  });

  if (memberTypes.length === 0) {
    return <EmptyChart message="에니어그램 검사를 공유한 멤버가 없습니다." />;
  }

  const pieData = Object.entries(typeCounts)
    .map(([type, count]) => ({
      name: `${type}번 ${ENNEAGRAM_NAMES[Number(type)]}`,
      value: count,
      type: Number(type),
    }))
    .sort((a, b) => a.type - b.type);

  return (
    <ChartCard title="에니어그램 유형 분포">
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
              labelLine={false}
              style={{ fontSize: 10 }}
            >
              {pieData.map((entry, i) => (
                <Cell key={entry.type} fill={COLORS[(entry.type - 1) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Member list */}
      <div style={{ marginTop: 12 }}>
        {memberTypes.map(({ name, type }) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
            borderBottom: '1px solid var(--cc-border)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: COLORS[(type - 1) % COLORS.length], flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{name}</span>
            <span style={{ fontSize: 11, color: 'var(--cc-text-sub)' }}>
              {type}번 {ENNEAGRAM_NAMES[type]}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ── Conflict Style Comparison ──

function ConflictComparison({ members, selected }: { members: MemberData; selected: string[] }) {
  const styles = ['경쟁', '회피', '타협', '협력', '수용'];
  const hasData = selected.some(name => members[name]?.conflict);

  if (!hasData) {
    return <EmptyChart message="갈등해결 스타일 검사를 공유한 멤버가 없습니다." />;
  }

  const chartData = styles.map(s => {
    const point: Record<string, unknown> = { name: s };
    selected.forEach(name => {
      const con = members[name]?.conflict as CResult | undefined;
      if (con?.styles) {
        point[name] = Number((con.styles[s] || 0).toFixed(1));
      }
    });
    return point;
  });

  return (
    <ChartCard title="갈등해결 스타일 비교">
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="var(--cc-border)" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--cc-text)' }} />
            {selected.map((name) => (
              <Radar
                key={name}
                name={name}
                dataKey={name}
                stroke={COLORS[Object.keys(members).indexOf(name) % COLORS.length]}
                fill={COLORS[Object.keys(members).indexOf(name) % COLORS.length]}
                fillOpacity={0.08}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Primary style list */}
      <div style={{ marginTop: 12 }}>
        {selected.map(name => {
          const con = members[name]?.conflict as CResult | undefined;
          if (!con) return null;
          return (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              borderBottom: '1px solid var(--cc-border)',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: COLORS[Object.keys(members).indexOf(name) % COLORS.length], flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{name}</span>
              <span style={{ fontSize: 11, color: 'var(--cc-text-sub)' }}>주 스타일: {con.primary}</span>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// ── Burnout Comparison ──

function BurnoutComparison({ members, selected }: { members: MemberData; selected: string[] }) {
  const hasData = selected.some(name => members[name]?.burnout);

  if (!hasData) {
    return <EmptyChart message="소진 검사를 공유한 멤버가 없습니다." />;
  }

  const LEVEL_COLORS: Record<string, string> = {
    low: '#059669', mid: '#F59E0B', high: '#EA580C', critical: '#DC2626',
  };
  const LEVEL_LABELS: Record<string, string> = {
    low: '안정', mid: '주의', high: '위험', critical: '심각',
  };

  return (
    <ChartCard title="소진 수준 비교">
      {selected.map(name => {
        const bur = members[name]?.burnout as BurnoutResult | undefined;
        if (!bur) return null;
        const color = LEVEL_COLORS[bur.overallLevel] || '#999';
        return (
          <div key={name} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: COLORS[Object.keys(members).indexOf(name) % COLORS.length], flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color, padding: '2px 8px', borderRadius: 10, background: `${color}15` }}>
                {LEVEL_LABELS[bur.overallLevel]} ({Math.round(bur.totalPct * 100)}%)
              </span>
            </div>
            <div style={{ height: 10, background: 'var(--cc-bg)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${bur.totalPct * 100}%`, borderRadius: 10,
                background: color, transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
        );
      })}

      {/* HSP + ECR + ProQOL quick comparison */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--cc-border)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>📋 추가 비교</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--cc-border)' }}>
                <th style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 700 }}>멤버</th>
                <th style={{ textAlign: 'center', padding: '4px 4px', fontWeight: 700 }}>HSP</th>
                <th style={{ textAlign: 'center', padding: '4px 4px', fontWeight: 700 }}>애착</th>
                <th style={{ textAlign: 'center', padding: '4px 4px', fontWeight: 700 }}>공감만족</th>
              </tr>
            </thead>
            <tbody>
              {selected.map(name => {
                const hsp = members[name]?.hsp as HSPResult | undefined;
                const ecr = members[name]?.ecr as ECRResult | undefined;
                const pro = members[name]?.proqol as ProQOLResult | undefined;
                return (
                  <tr key={name} style={{ borderBottom: '1px solid var(--cc-border)' }}>
                    <td style={{ padding: '6px', fontWeight: 600 }}>{name}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--cc-text-sub)' }}>
                      {hsp ? (hsp.level === 'high' ? '난초🌺' : hsp.level === 'mid' ? '튤립🌷' : '민들레🌼') : '-'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--cc-text-sub)' }}>
                      {ecr?.type || '-'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', color: 'var(--cc-text-sub)' }}>
                      {pro ? `${pro.cs}점` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ChartCard>
  );
}

// ── Shared components ──

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
      boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)', marginBottom: 12,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div style={{
      background: 'var(--cc-card)', borderRadius: 20, padding: '32px 20px',
      textAlign: 'center', border: '1px solid var(--cc-border)', marginBottom: 12,
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
      <div style={{ fontSize: 12, color: 'var(--cc-text-sub)' }}>{message}</div>
    </div>
  );
}
