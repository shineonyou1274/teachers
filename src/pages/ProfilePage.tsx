import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { getAllResults, isTestCompleted } from '../utils/storage';
import { getCurrentUser, verifyAICode, hasUsedAI, markAIUsed } from '../utils/auth';
import { TEST_REGISTRY } from '../data/testRegistry';
import { getAIInterpretation } from '../utils/claude';
import type {
  EnneagramResult, BurnoutResult, Big5Result, HSPResult,
  ECRResult, ConflictResult as CResult, ProQOLResult,
} from '../utils/scoring';

const ENNEAGRAM_NAMES: Record<number, string> = {
  1: '개혁가', 2: '조력자', 3: '성취자', 4: '예술가', 5: '탐구자',
  6: '충성가', 7: '낙천가', 8: '지도자', 9: '중재자',
};

const BURNOUT_LEVELS: Record<string, { label: string; color: string; emoji: string }> = {
  low: { label: '안정', color: '#059669', emoji: '💚' },
  mid: { label: '주의', color: '#F59E0B', emoji: '💛' },
  high: { label: '위험', color: '#EA580C', emoji: '🧡' },
  critical: { label: '심각', color: '#DC2626', emoji: '❤️‍🔥' },
};

const HSP_NAMES: Record<string, string> = { high: '난초형 🌺', mid: '튤립형 🌷', low: '민들레형 🌼' };

const PROQOL_LEVELS: Record<string, string> = { low: '낮음', mid: '보통', high: '높음' };

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const results = getAllResults();
  const completedCount = TEST_REGISTRY.filter(t => isTestCompleted(t.id)).length;
  const [tab, setTab] = useState<'overview' | 'radar'>('overview');
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const nickname = user?.nickname || 'guest';
  const aiUsed = hasUsedAI(nickname);

  const enn = results.enneagram as EnneagramResult | undefined;
  const bur = results.burnout as BurnoutResult | undefined;
  const big = results.big5 as Big5Result | undefined;
  const hsp = results.hsp as HSPResult | undefined;
  const ecr = results.ecr as ECRResult | undefined;
  const con = results.conflict as CResult | undefined;
  const pro = results.proqol as ProQOLResult | undefined;

  // Build radar data for overview
  const radarData = [];
  if (enn) radarData.push({ name: '에니어그램', value: Math.round((enn.scores[enn.primary] / 100) * 100) });
  if (bur) radarData.push({ name: '소진(역)', value: Math.round((1 - bur.totalPct) * 100) });
  if (big) {
    const avgPct = Object.values(big.detailed || {}).reduce((s, f) => s + f.pct, 0) / 5;
    radarData.push({ name: 'Big5', value: Math.round(avgPct) });
  }
  if (hsp) radarData.push({ name: '감각민감', value: Math.round(((hsp.average - 1) / 6) * 100) });
  if (ecr) radarData.push({ name: '애착안정', value: Math.round((1 - ((ecr.anxiety - 1) / 6 + (ecr.avoidance - 1) / 6) / 2) * 100) });
  if (con) {
    const maxStyle = Math.max(...Object.values(con.styles));
    radarData.push({ name: '갈등해결', value: Math.round((maxStyle / 5) * 100) });
  }
  if (pro) radarData.push({ name: '공감만족', value: Math.round((pro.cs / 50) * 100) });

  if (completedCount === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40, animation: 'slide-up 0.6s ease-out' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎪</div>
        <h2 className="text-gradient" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
          통합 프로파일
        </h2>
        <p style={{ color: 'var(--cc-text-sub)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          아직 완료한 검사가 없어요!<br />검사를 완료하면 종합 분석을 볼 수 있습니다.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 28px', borderRadius: 24, border: 'none',
            background: 'var(--cc-gradient-btn)', color: 'white',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          🎠 검사하러 가기
        </button>
      </div>
    );
  }

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
          {user?.nickname || '게스트'}님의 마음 지도
        </div>
        <div style={{ fontSize: 13, color: 'var(--cc-text-sub)', marginTop: 4 }}>
          {completedCount}/7개 검사 완료
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
          {TEST_REGISTRY.map(t => {
            const done = isTestCompleted(t.id);
            return (
              <div key={t.id} title={t.name} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? 'var(--cc-gradient-btn)' : 'var(--cc-bg)',
                border: done ? 'none' : '1.5px solid var(--cc-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13,
              }}>
                {done ? <span style={{ filter: 'brightness(10)' }}>{t.icon}</span> : <span style={{ opacity: 0.3 }}>{t.icon}</span>}
              </div>
            );
          })}
        </div>

        {/* Tab switch */}
        {radarData.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
            {(['overview', 'radar'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '6px 16px', borderRadius: 20, border: 'none',
                background: tab === t ? 'var(--cc-gradient-btn)' : 'var(--cc-bg)',
                color: tab === t ? 'white' : 'var(--cc-text-sub)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {t === 'overview' ? '📋 요약' : '📊 레이더'}
              </button>
            ))}
          </div>
        )}

        {/* Radar chart */}
        {tab === 'radar' && radarData.length >= 3 && (
          <div style={{ marginTop: 16, height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--cc-border)" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--cc-text)' }} />
                <Radar
                  dataKey="value"
                  stroke="var(--cc-pink-deep)"
                  fill="var(--cc-pink)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Individual result summary cards */}
      {tab === 'overview' && (
        <>
          {/* Enneagram */}
          {enn && (
            <ProfileCard
              icon="🎡" title="에니어그램" color="#EC4899"
              onClick={() => navigate('/result/enneagram')}
            >
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                {enn.primary}번 {ENNEAGRAM_NAMES[enn.primary]}
              </div>
              <div style={{ fontSize: 12, color: 'var(--cc-text-sub)' }}>
                날개: {enn.wing}번 {ENNEAGRAM_NAMES[enn.wing]} · Top3: {enn.top3.map(t => `${t}번`).join(', ')}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                {enn.top3.map(t => (
                  <MiniBar key={t} label={`${t}번`} value={enn.scores[t]} max={100} color="#EC4899" />
                ))}
              </div>
            </ProfileCard>
          )}

          {/* Burnout */}
          {bur && (() => {
            const lv = BURNOUT_LEVELS[bur.overallLevel];
            return (
              <ProfileCard
                icon="🎠" title="교사 소진" color={lv.color}
                onClick={() => navigate('/result/burnout')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{lv.emoji}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: lv.color }}>{lv.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--cc-text-sub)' }}>
                    ({Math.round(bur.totalPct * 100)}%)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {Object.entries(bur.subscales).map(([name, sub]) => (
                    <MiniBar key={name} label={name.replace('감', '')} value={Math.round(sub.pct * 100)} max={100} color={lv.color} />
                  ))}
                </div>
              </ProfileCard>
            );
          })()}

          {/* Big5 */}
          {big && (
            <ProfileCard
              icon="🎨" title="빅5 성격" color="#3B82F6"
              onClick={() => navigate('/result/big5')}
            >
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                {big.profileName}
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Object.entries(big.detailed || {}).map(([name, f]) => {
                  const displayName = name === '신경증' ? '정서안정' : name;
                  const displayPct = name === '신경증' ? 100 - f.pct : f.pct;
                  return (
                    <MiniBar key={name} label={displayName} value={displayPct} max={100} color="#3B82F6" />
                  );
                })}
              </div>
            </ProfileCard>
          )}

          {/* HSP */}
          {hsp && (
            <ProfileCard
              icon="🍭" title="감각 민감도" color="#7C3AED"
              onClick={() => navigate('/result/hsp')}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>
                {HSP_NAMES[hsp.level]}
              </div>
              <div style={{ fontSize: 12, color: 'var(--cc-text-sub)' }}>
                평균 {hsp.average.toFixed(2)} / 7.00
              </div>
              <div style={{
                height: 8, background: 'var(--cc-bg)', borderRadius: 8, marginTop: 8, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${((hsp.average - 1) / 6) * 100}%`, borderRadius: 8,
                  background: 'linear-gradient(90deg, #059669, #EC4899, #7C3AED)',
                }} />
              </div>
            </ProfileCard>
          )}

          {/* ECR */}
          {ecr && (
            <ProfileCard
              icon="🎪" title="애착 유형" color="#059669"
              onClick={() => navigate('/result/ecr')}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', marginBottom: 4 }}>
                {ecr.type}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--cc-text-sub)', marginBottom: 2 }}>불안</div>
                  <div style={{ height: 6, background: 'var(--cc-bg)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((ecr.anxiety - 1) / 6) * 100}%`, borderRadius: 6, background: '#EC4899' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--cc-text-sub)', marginTop: 2 }}>{ecr.anxiety.toFixed(1)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--cc-text-sub)', marginBottom: 2 }}>회피</div>
                  <div style={{ height: 6, background: 'var(--cc-bg)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((ecr.avoidance - 1) / 6) * 100}%`, borderRadius: 6, background: '#8B5CF6' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--cc-text-sub)', marginTop: 2 }}>{ecr.avoidance.toFixed(1)}</div>
                </div>
              </div>
            </ProfileCard>
          )}

          {/* Conflict */}
          {con && (
            <ProfileCard
              icon="🎯" title="갈등해결 스타일" color="#F97316"
              onClick={() => navigate('/result/conflict')}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#F97316', marginBottom: 8 }}>
                주 스타일: {con.primary}
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Object.entries(con.styles)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, score]) => (
                    <MiniBar key={name} label={name} value={Math.round((score / 5) * 100)} max={100} color="#F97316" />
                  ))}
              </div>
            </ProfileCard>
          )}

          {/* ProQOL */}
          {pro && (
            <ProfileCard
              icon="🎈" title="공감피로/만족" color="#7C3AED"
              onClick={() => navigate('/result/proqol')}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([
                  { key: 'cs' as const, name: '공감만족', color: '#059669', good: 'high' },
                  { key: 'bo' as const, name: '번아웃', color: '#EA580C', good: 'low' },
                  { key: 'sts' as const, name: '이차외상', color: '#7C3AED', good: 'low' },
                ]).map(item => {
                  const score = pro[item.key];
                  const level = pro[`${item.key}Level`];
                  return (
                    <div key={item.key} style={{
                      flex: 1, minWidth: 80, textAlign: 'center', padding: '8px 4px',
                      background: 'var(--cc-bg)', borderRadius: 10,
                    }}>
                      <div style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>{item.name}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{score}</div>
                      <div style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>{PROQOL_LEVELS[level]}</div>
                    </div>
                  );
                })}
              </div>
            </ProfileCard>
          )}

          {/* Incomplete tests */}
          {completedCount < 7 && (
            <div style={{
              background: 'var(--cc-bg)', borderRadius: 16, padding: '16px',
              textAlign: 'center', marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                📝 아직 완료하지 않은 검사
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {TEST_REGISTRY.filter(t => !isTestCompleted(t.id)).map(t => (
                  <button key={t.id} onClick={() => navigate(`/test/${t.id}`)} style={{
                    padding: '6px 12px', borderRadius: 14, border: '1px solid var(--cc-border)',
                    background: 'white', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', color: 'var(--cc-text)',
                  }}>
                    {t.icon} {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Cross-analysis insight (when 3+ tests done) */}
      {completedCount >= 3 && (
        <div style={{
          background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
          boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)',
          marginBottom: 12, borderLeft: '4px solid var(--cc-pink-deep)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>💡 종합 인사이트</div>
          {generateInsights(enn, bur, big, hsp, ecr, con, pro).map((insight, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, padding: '8px 0',
              borderBottom: i < 2 ? '1px solid var(--cc-border)' : 'none',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.emoji}</span>
              <span style={{ fontSize: 12, lineHeight: 1.7 }}>{insight.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Interpretation */}
      {completedCount >= 2 && (
        <div style={{
          background: 'var(--cc-card)', borderRadius: 20, padding: '20px 16px',
          boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>AI 종합 코칭</div>
              <div style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>Claude가 검사 결과를 통합 분석합니다</div>
            </div>
          </div>

          {!aiText && !aiLoading && (
            aiUsed ? (
              <div style={{
                textAlign: 'center', padding: '14px', background: 'var(--cc-bg)',
                borderRadius: 14, fontSize: 12, color: 'var(--cc-text-sub)',
              }}>
                ✅ AI 분석을 이미 사용했습니다 (1인 1회 제한)
              </div>
            ) : (
              <button
                onClick={() => setShowCodeModal(true)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 16, border: 'none',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ✨ AI 종합 분석 받기
              </button>
            )
          )}

          {aiLoading && (
            <div style={{
              textAlign: 'center', padding: '20px 0', color: 'var(--cc-text-sub)', fontSize: 13,
            }}>
              <div style={{ fontSize: 24, animation: 'bounce-gentle 1.5s ease-in-out infinite', marginBottom: 8 }}>🤖</div>
              분석 중... 잠시만 기다려주세요
            </div>
          )}

          {aiError && (
            <div style={{
              background: '#FEE2E2', color: '#DC2626', borderRadius: 12,
              padding: '10px 14px', fontSize: 12, marginTop: 8,
            }}>
              ⚠️ {aiError}
              <button
                onClick={() => { setAiError(''); }}
                style={{
                  marginLeft: 8, padding: '2px 8px', borderRadius: 8, border: '1px solid #DC2626',
                  background: 'white', color: '#DC2626', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                다시 시도
              </button>
            </div>
          )}

          {aiText && (
            <div style={{ marginTop: 4 }}>
              {aiText.split('\n').map((line, i) => {
                if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
                // Bold headers
                const boldMatch = line.match(/^\*\*(.+?)\*\*/);
                if (boldMatch) {
                  return (
                    <div key={i} style={{ fontSize: 13, fontWeight: 800, color: 'var(--cc-pink-deep)', marginTop: 12, marginBottom: 4 }}>
                      {line.replace(/\*\*/g, '')}
                    </div>
                  );
                }
                // Numbered items
                if (/^\d+\./.test(line.trim())) {
                  return (
                    <div key={i} style={{ fontSize: 13, fontWeight: 700, marginTop: 10, marginBottom: 2 }}>
                      {line.replace(/\*\*/g, '')}
                    </div>
                  );
                }
                // Bullet points
                if (/^[-•▸]/.test(line.trim())) {
                  return (
                    <div key={i} style={{ fontSize: 12, lineHeight: 1.7, paddingLeft: 8, color: 'var(--cc-text)' }}>
                      {line.replace(/\*\*/g, '')}
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--cc-text)' }}>
                    {line.replace(/\*\*/g, '')}
                  </div>
                );
              })}

            </div>
          )}
        </div>
      )}

      {/* AI Code Modal */}
      {showCodeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 20,
        }}>
          <div style={{
            background: 'white', borderRadius: 20, padding: '28px 24px',
            maxWidth: 340, width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔑</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>AI 분석 코드 입력</div>
            <div style={{ fontSize: 12, color: 'var(--cc-text-sub)', marginBottom: 16, lineHeight: 1.6 }}>
              선생님께 안내된 코드를 입력해주세요.<br />1인 1회만 사용 가능합니다.
            </div>
            <input
              type="password"
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value); setCodeError(''); }}
              placeholder="코드 입력"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12,
                border: codeError ? '2px solid #DC2626' : '1.5px solid var(--cc-border)',
                fontSize: 14, textAlign: 'center', fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (verifyAICode(codeInput)) {
                    setShowCodeModal(false);
                    setCodeInput('');
                    setAiLoading(true);
                    setAiError('');
                    getAIInterpretation(results as any)
                      .then(text => { setAiText(text); markAIUsed(nickname); })
                      .catch((err: any) => setAiError(err.message || 'AI 분석에 실패했습니다.'))
                      .finally(() => setAiLoading(false));
                  } else {
                    setCodeError('코드가 맞지 않습니다.');
                  }
                }
              }}
              autoFocus
            />
            {codeError && (
              <div style={{ color: '#DC2626', fontSize: 11, marginTop: 6 }}>{codeError}</div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                onClick={() => { setShowCodeModal(false); setCodeInput(''); setCodeError(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12,
                  border: '1px solid var(--cc-border)', background: 'white',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (verifyAICode(codeInput)) {
                    setShowCodeModal(false);
                    setCodeInput('');
                    setAiLoading(true);
                    setAiError('');
                    getAIInterpretation(results as any)
                      .then(text => { setAiText(text); markAIUsed(nickname); })
                      .catch((err: any) => setAiError(err.message || 'AI 분석에 실패했습니다.'))
                      .finally(() => setAiLoading(false));
                  } else {
                    setCodeError('코드가 맞지 않습니다.');
                  }
                }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Home button */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0 20px' }}>
        <button
          onClick={() => navigate('/group')}
          style={{
            padding: '12px 20px', borderRadius: 24,
            border: '1px solid var(--cc-border)', background: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          👥 그룹 비교
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 20px', borderRadius: 24,
            border: '1px solid var(--cc-border)', background: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          🏠 홈으로
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ──

function ProfileCard({ icon, title, color, onClick, children }: {
  icon: string; title: string; color: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--cc-card)', borderRadius: 20, padding: '16px',
        boxShadow: 'var(--cc-shadow-soft)', border: '1px solid var(--cc-border)',
        marginBottom: 10, borderLeft: `4px solid ${color}`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--cc-text-sub)' }}>상세보기 →</span>
      </div>
      {children}
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 50 }}>
      <div style={{ fontSize: 9, color: 'var(--cc-text-sub)', marginBottom: 2, textAlign: 'center' }}>{label}</div>
      <div style={{ height: 6, background: 'var(--cc-bg)', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(value / max) * 100}%`, borderRadius: 6, background: color, opacity: 0.7 }} />
      </div>
      <div style={{ fontSize: 9, color: 'var(--cc-text-sub)', textAlign: 'center', marginTop: 1 }}>{value}</div>
    </div>
  );
}

// ── Cross-analysis insights ──

function generateInsights(
  enn?: EnneagramResult, bur?: BurnoutResult, big?: Big5Result,
  hsp?: HSPResult, ecr?: ECRResult, con?: CResult, pro?: ProQOLResult,
): Array<{ emoji: string; text: string }> {
  const insights: Array<{ emoji: string; text: string }> = [];

  // HSP + Burnout connection
  if (hsp && bur) {
    if (hsp.level === 'high' && (bur.overallLevel === 'high' || bur.overallLevel === 'critical')) {
      insights.push({
        emoji: '🌺',
        text: '높은 감각 민감도와 높은 소진이 함께 나타나고 있어요. 민감한 신경계가 자극 과부하로 더 빨리 소진되고 있을 수 있습니다. 감각 셀프케어가 소진 예방의 핵심이에요.',
      });
    } else if (hsp.level === 'high' && bur.overallLevel === 'low') {
      insights.push({
        emoji: '✨',
        text: '높은 감각 민감도에도 불구하고 소진 수준이 낮아요. 자기 돌봄을 잘 하고 계신 증거입니다. 현재의 에너지 관리 방식을 유지하세요!',
      });
    }
  }

  // ECR + Conflict connection
  if (ecr && con) {
    if (ecr.type === '몰두형' && con.primary === '수용') {
      insights.push({
        emoji: '💝',
        text: '관계에 대한 높은 열망(몰두형)과 수용적 갈등 스타일이 결합되어 있어요. 관계를 위해 자신을 과하게 양보하는 패턴이 있을 수 있습니다. 건강한 자기 주장을 연습해보세요.',
      });
    } else if ((ecr.type === '무시-회피형' || ecr.type === '두려운-회피형') && con.primary === '회피') {
      insights.push({
        emoji: '🛡️',
        text: '회피적 애착 패턴과 갈등 회피 스타일이 함께 나타나고 있어요. 안전한 관계에서 작은 갈등을 시도해보는 연습이 관계 성장의 열쇠가 될 수 있어요.',
      });
    }
  }

  // ProQOL + Burnout connection
  if (pro && bur) {
    if (pro.boLevel === 'high' && (bur.overallLevel === 'high' || bur.overallLevel === 'critical')) {
      insights.push({
        emoji: '🆘',
        text: '교사 소진 검사와 ProQOL 모두에서 높은 번아웃이 확인됩니다. 두 검사가 일관되게 소진을 보여주고 있으므로, 전문적 도움을 적극적으로 고려해주세요.',
      });
    } else if (pro.csLevel === 'high' && bur.overallLevel === 'low') {
      insights.push({
        emoji: '🌈',
        text: '높은 공감만족과 낮은 소진 — 교사로서 가장 건강한 상태입니다! 학생을 돕는 기쁨이 에너지를 잘 충전해주고 있어요.',
      });
    }
  }

  // Big5 + Enneagram connection
  if (big && enn) {
    const detail = big.detailed || {};
    if (detail['외향성']?.level === 'H' && [2, 3, 7].includes(enn.primary)) {
      insights.push({
        emoji: '🎪',
        text: `높은 외향성과 에니어그램 ${enn.primary}번(${ENNEAGRAM_NAMES[enn.primary]})이 시너지를 이루고 있어요. 사람들과의 에너지 교류가 선생님의 큰 강점입니다.`,
      });
    }
    if (detail['성실성']?.level === 'H' && [1, 3, 6].includes(enn.primary)) {
      insights.push({
        emoji: '📋',
        text: `높은 성실성과 에니어그램 ${enn.primary}번(${ENNEAGRAM_NAMES[enn.primary]})의 조합이에요. 체계적이고 책임감 있는 교사 모습이 돋보이지만, 완벽주의 경향을 경계하세요.`,
      });
    }
  }

  // General summary if few specific insights
  if (insights.length === 0) {
    if (bur && bur.overallLevel === 'low') {
      insights.push({ emoji: '💚', text: '전반적으로 건강한 상태를 유지하고 계세요. 현재의 균형을 소중히 지켜주세요!' });
    } else {
      insights.push({ emoji: '🧭', text: '더 많은 검사를 완료하면 검사 간 연결 패턴을 분석해드립니다. 7개 모두 완료하면 가장 풍부한 인사이트를 얻을 수 있어요.' });
    }
  }

  return insights.slice(0, 3);
}
