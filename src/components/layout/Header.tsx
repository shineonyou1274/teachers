import { useNavigate, useLocation } from 'react-router-dom';
import CottonCandy from '../illustrations/CottonCandy';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 248, 245, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--cc-border)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {!isHome && (
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            padding: '4px 8px',
            borderRadius: 8,
            color: 'var(--cc-text-sub)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--cc-pink-light)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          ←
        </button>
      )}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <CottonCandy size={36} />
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          마음 쉼터
        </span>
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'var(--cc-text-sub)',
          marginLeft: 'auto',
        }}
      >
        교사 심리검사 배터리
      </span>
    </header>
  );
}
