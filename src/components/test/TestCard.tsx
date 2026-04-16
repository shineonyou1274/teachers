import { useNavigate } from 'react-router-dom';
import type { TestMeta } from '../../data/testRegistry';
import { isTestCompleted, hasInProgressAnswers } from '../../utils/storage';

interface TestCardProps {
  test: TestMeta;
  index: number;
}

const COLOR_MAP: Record<string, string> = {
  pink: 'linear-gradient(135deg, var(--cc-pink), var(--cc-peach))',
  orange: 'linear-gradient(135deg, var(--cc-peach), var(--cc-lemon))',
  blue: 'linear-gradient(135deg, var(--cc-sky), var(--cc-lavender))',
  purple: 'linear-gradient(135deg, var(--cc-lavender), var(--cc-pink))',
  green: 'linear-gradient(135deg, var(--cc-mint), var(--cc-sky))',
  yellow: 'linear-gradient(135deg, var(--cc-lemon), var(--cc-peach))',
  rose: 'linear-gradient(135deg, var(--cc-pink), var(--cc-lavender))',
};

export default function TestCard({ test, index }: TestCardProps) {
  const navigate = useNavigate();
  const completed = isTestCompleted(test.id);
  const inProgress = hasInProgressAnswers(test.id);

  const handleClick = () => {
    if (completed) {
      navigate(`/result/${test.id}`);
    } else {
      navigate(`/test/${test.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--cc-card)',
        borderRadius: 18,
        padding: '16px 14px',
        boxShadow: 'var(--cc-shadow)',
        border: '1.5px solid var(--cc-border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        animation: `card-enter 0.6s ease-out both`,
        animationDelay: `${index * 0.05}s`,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--cc-shadow-hover)';
        e.currentTarget.style.borderColor = 'var(--cc-pink)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--cc-shadow)';
        e.currentTarget.style.borderColor = 'var(--cc-border)';
      }}
    >
      {/* Top color bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderRadius: '18px 18px 0 0',
          background: COLOR_MAP[test.color] || COLOR_MAP.pink,
        }}
      />

      {/* Icon + Badge row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div
          style={{
            fontSize: 28,
            display: 'inline-block',
            animation: `float-up-down 4s ease-in-out infinite`,
            animationDelay: `${-index * 0.7}s`,
          }}
        >
          {test.icon}
        </div>
        {completed ? (
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'var(--cc-pink-light)', color: 'var(--cc-pink-deep)' }}>
            ✓ 완료
          </span>
        ) : inProgress ? (
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'var(--cc-lemon-light)', color: 'var(--cc-lemon-deep)' }}>
            진행 중
          </span>
        ) : null}
      </div>

      {/* Name */}
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, lineHeight: 1.3 }}>{test.name}</div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 11,
          color: 'var(--cc-text-sub)',
          lineHeight: 1.4,
          marginBottom: 10,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {test.subtitle}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            color: 'var(--cc-text-sub)',
            background: 'var(--cc-bg)',
            padding: '2px 8px',
            borderRadius: 10,
          }}
        >
          {test.questionCount}문항
        </span>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 12px',
            background: completed
              ? 'linear-gradient(135deg, var(--cc-sky), var(--cc-lavender))'
              : 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {completed ? '결과 보기' : inProgress ? '이어하기' : '시작'}
        </button>
      </div>
    </div>
  );
}
