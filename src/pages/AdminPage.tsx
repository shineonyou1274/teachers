import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMembers, getMemberCompletedTests, loadMemberResult, isAdmin } from '../utils/auth';
import { TEST_REGISTRY } from '../data/testRegistry';

export default function AdminPage() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  if (!isAdmin()) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <p style={{ color: 'var(--cc-text-sub)' }}>관리자 권한이 필요합니다</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 16, padding: '10px 24px', borderRadius: 24,
            background: 'var(--cc-gradient-btn)', color: 'white', border: 'none',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          홈으로
        </button>
      </div>
    );
  }

  const members = getAllMembers();
  const selectedResult = selectedMember && selectedTest
    ? loadMemberResult(selectedMember, selectedTest)
    : null;

  return (
    <div style={{ animation: 'card-enter 0.6s ease-out' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
        <h1 className="text-gradient" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          관리자 대시보드
        </h1>
        <p style={{ fontSize: 13, color: 'var(--cc-text-sub)' }}>
          전체 회원 {members.length}명
        </p>
      </div>

      {members.length === 0 ? (
        <div
          style={{
            background: 'var(--cc-card)',
            borderRadius: 20,
            padding: 32,
            textAlign: 'center',
            boxShadow: 'var(--cc-shadow)',
            border: '1px solid var(--cc-border)',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎪</div>
          <div style={{ fontSize: 14, color: 'var(--cc-text-sub)' }}>
            아직 가입한 회원이 없습니다
          </div>
        </div>
      ) : (
        <>
          {/* Members list */}
          <div
            style={{
              background: 'var(--cc-card)',
              borderRadius: 20,
              padding: 20,
              boxShadow: 'var(--cc-shadow)',
              border: '1px solid var(--cc-border)',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🎡</span> 회원 명단
            </div>

            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(7, 1fr)',
                gap: 4,
                marginBottom: 8,
                padding: '0 4px',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-text-sub)' }}>닉네임</div>
              {TEST_REGISTRY.map(t => (
                <div key={t.id} style={{ fontSize: 10, textAlign: 'center', color: 'var(--cc-text-sub)' }}>
                  {t.icon}
                </div>
              ))}
            </div>

            {/* Member rows */}
            {members.map(nickname => {
              const completed = getMemberCompletedTests(nickname);
              return (
                <div
                  key={nickname}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(7, 1fr)',
                    gap: 4,
                    padding: '10px 4px',
                    borderRadius: 12,
                    background: selectedMember === nickname ? 'var(--cc-pink-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid var(--cc-border)',
                  }}
                  onClick={() => setSelectedMember(selectedMember === nickname ? null : nickname)}
                  onMouseEnter={e => { if (selectedMember !== nickname) e.currentTarget.style.background = 'var(--cc-bg)'; }}
                  onMouseLeave={e => { if (selectedMember !== nickname) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    {nickname}
                  </div>
                  {TEST_REGISTRY.map(t => (
                    <div key={t.id} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {completed.includes(t.id) ? (
                        <span
                          style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'var(--cc-mint-light)', color: 'var(--cc-mint-deep)',
                            fontSize: 12, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={e => { e.stopPropagation(); setSelectedMember(nickname); setSelectedTest(t.id); }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span
                          style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'var(--cc-bg)', color: 'var(--cc-border)',
                            fontSize: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Selected member detail */}
          {selectedMember && (
            <div
              style={{
                background: 'var(--cc-card)',
                borderRadius: 20,
                padding: 20,
                boxShadow: 'var(--cc-shadow)',
                border: '1px solid var(--cc-border)',
                marginBottom: 16,
                animation: 'slide-up 0.3s ease-out',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                🎠 {selectedMember}님의 검사 현황
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TEST_REGISTRY.map(t => {
                  const done = getMemberCompletedTests(selectedMember).includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => done ? setSelectedTest(t.id) : undefined}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 12,
                        border: selectedTest === t.id ? '2px solid var(--cc-pink)' : '1px solid var(--cc-border)',
                        background: done
                          ? selectedTest === t.id ? 'var(--cc-pink-light)' : 'var(--cc-mint-light)'
                          : 'var(--cc-bg)',
                        color: done ? 'var(--cc-text)' : 'var(--cc-text-sub)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: done ? 'pointer' : 'default',
                        opacity: done ? 1 : 0.5,
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                    >
                      {t.icon} {t.name.split(' ')[0]}
                      {done && ' ✓'}
                    </button>
                  );
                })}
              </div>

              {/* Result preview */}
              {selectedResult && selectedTest && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: 'var(--cc-bg)',
                    borderRadius: 14,
                    animation: 'fade-in 0.3s ease-out',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cc-pink-deep)', marginBottom: 8 }}>
                    🎪 {TEST_REGISTRY.find(t => t.id === selectedTest)?.name} 결과
                  </div>
                  <pre
                    style={{
                      fontSize: 11,
                      color: 'var(--cc-text-sub)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: 300,
                      overflow: 'auto',
                      background: 'white',
                      padding: 12,
                      borderRadius: 10,
                    }}
                  >
                    {JSON.stringify(selectedResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
