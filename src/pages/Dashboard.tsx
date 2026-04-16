import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkGate from '../components/illustrations/ParkGate';
import TestCard from '../components/test/TestCard';
import { TEST_REGISTRY } from '../data/testRegistry';
import { getCurrentUser, isGuest, canGuestTakeTest, logout } from '../utils/auth';
import AuthModal from '../components/ui/AuthModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState<'signup' | 'admin' | null>(null);
  const user = getCurrentUser();
  const guest = isGuest();

  const handleAuthSuccess = () => {
    setAuthModal(null);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div style={{ animation: 'card-enter 0.8s ease-out' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <ParkGate />
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep), var(--cc-sky-deep))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 6,
          }}
        >
          나를 알아가는 마음 여행
        </h1>
        <p style={{ fontSize: 14, color: 'var(--cc-text-sub)', lineHeight: 1.6 }}>
          7가지 심리검사로 나의 마음을 탐험해보세요
          <br />
          모든 결과는 선생님의 힐링을 위해 준비되었습니다 ✨
        </p>
      </div>

      {/* User status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          padding: '12px 16px',
          background: 'var(--cc-card)',
          borderRadius: 16,
          boxShadow: 'var(--cc-shadow-soft)',
          border: '1px solid var(--cc-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>
            {user?.role === 'admin' ? '🔐' : user?.role === 'member' ? '🎪' : '👀'}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {user?.role === 'admin' ? '관리자' : user?.nickname || '게스트'}
          </span>
          {guest && (
            <span style={{ fontSize: 11, color: 'var(--cc-text-sub)', background: 'var(--cc-bg)', padding: '2px 8px', borderRadius: 10 }}>
              무료 체험 {canGuestTakeTest() ? '1회 가능' : '소진'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {guest ? (
            <>
              <button
                onClick={() => setAuthModal('signup')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: 'var(--cc-gradient-btn)',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                🎠 가입하기
              </button>
              <button
                onClick={() => setAuthModal('admin')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid var(--cc-border)',
                  background: 'white',
                  color: 'var(--cc-text-sub)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                🔐
              </button>
            </>
          ) : (
            <>
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    background: 'var(--cc-gradient-btn)',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  🔐 관리
                </button>
              )}
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid var(--cc-border)',
                  background: 'white',
                  color: 'var(--cc-text-sub)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick nav */}
      {!guest && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 14, border: '1px solid var(--cc-border)',
              background: 'var(--cc-card)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: 'var(--cc-shadow-soft)',
            }}
          >
            🎪 내 프로파일
          </button>
          <button
            onClick={() => navigate('/group')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 14, border: '1px solid var(--cc-border)',
              background: 'var(--cc-card)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: 'var(--cc-shadow-soft)',
            }}
          >
            👥 그룹 비교
          </button>
        </div>
      )}

      {/* Section title */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18, animation: 'bounce-gentle 3s ease-in-out infinite' }}>🎪</span>
        심리검사 놀이기구
      </div>

      {/* Bento grid - 2 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}
      >
        {TEST_REGISTRY.map((test, i) => (
          <TestCard key={test.id} test={test} index={i} />
        ))}
      </div>

      {/* Auth modal */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
