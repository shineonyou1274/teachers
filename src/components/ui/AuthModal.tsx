import { useState } from 'react';
import { setCurrentUser, verifyAdminPassword } from '../../utils/auth';
import type { UserRole } from '../../utils/auth';

interface AuthModalProps {
  mode: 'signup' | 'admin';
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ mode, onClose, onSuccess }: AuthModalProps) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (mode === 'signup') {
      const trimmed = nickname.trim();
      if (!trimmed) { setError('닉네임을 입력해주세요'); return; }
      if (trimmed.length > 10) { setError('10자 이내로 입력해주세요'); return; }
      setCurrentUser({ nickname: trimmed, role: 'member' as UserRole });
      onSuccess();
    } else {
      if (verifyAdminPassword(password)) {
        setCurrentUser({ nickname: '관리자', role: 'admin' as UserRole });
        onSuccess();
      } else {
        setError('비밀번호가 틀립니다');
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(30, 27, 58, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fade-in 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--cc-card)',
          borderRadius: 24,
          padding: '32px 28px',
          width: '100%',
          maxWidth: 360,
          boxShadow: '0 20px 60px rgba(244, 114, 182, 0.25)',
          animation: 'slide-up 0.4s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>
            {mode === 'signup' ? '🎪' : '🔐'}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {mode === 'signup' ? '놀이동산 입장권' : '관리자 입장'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--cc-text-sub)', marginTop: 4 }}>
            {mode === 'signup'
              ? '닉네임을 정하면 모든 검사를 이용할 수 있어요!'
              : '관리자 비밀번호를 입력해주세요'}
          </div>
        </div>

        {mode === 'signup' ? (
          <input
            type="text"
            placeholder="닉네임 (예: 김선생)"
            value={nickname}
            onChange={e => { setNickname(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            maxLength={10}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 16,
              border: '2px solid var(--cc-border)',
              fontSize: 15,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: 'var(--cc-bg)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--cc-pink)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--cc-border)')}
            autoFocus
          />
        ) : (
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 16,
              border: '2px solid var(--cc-border)',
              fontSize: 15,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
              background: 'var(--cc-bg)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--cc-pink)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--cc-border)')}
            autoFocus
          />
        )}

        {error && (
          <div style={{ fontSize: 12, color: 'var(--cc-pink-deep)', marginTop: 8, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            marginTop: 16,
            padding: '14px',
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))',
            color: 'white',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {mode === 'signup' ? '🎠 입장하기' : '🔓 확인'}
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '10px',
            borderRadius: 12,
            border: 'none',
            background: 'transparent',
            color: 'var(--cc-text-sub)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
