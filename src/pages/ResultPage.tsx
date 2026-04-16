import { useParams, useNavigate } from 'react-router-dom';
import { loadResult, clearTest } from '../utils/storage';
import { getTestMeta } from '../data/testRegistry';
import Confetti from '../components/illustrations/Confetti';
import { useState, useEffect } from 'react';
import EnneagramResult from '../results/EnneagramResult';
import BurnoutResult from '../results/BurnoutResult';
import Big5Result from '../results/Big5Result';
import HSPResult from '../results/HSPResult';
import ECRResult from '../results/ECRResult';
import ConflictResult from '../results/ConflictResult';
import ProQOLResult from '../results/ProQOLResult';

export default function ResultPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const meta = getTestMeta(testId || '');
  const result = loadResult(testId || '');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!meta || !result) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--cc-text-sub)', marginBottom: 16 }}>아직 검사를 완료하지 않았어요!</p>
        <button
          onClick={() => navigate(testId ? `/test/${testId}` : '/')}
          style={{
            padding: '10px 24px',
            borderRadius: 24,
            background: 'var(--cc-gradient-btn)',
            color: 'white',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          검사하러 가기
        </button>
      </div>
    );
  }

  const renderResult = () => {
    switch (testId) {
      case 'enneagram': return <EnneagramResult result={result} />;
      case 'burnout': return <BurnoutResult result={result} />;
      case 'big5': return <Big5Result result={result} />;
      case 'hsp': return <HSPResult result={result} />;
      case 'ecr': return <ECRResult result={result} />;
      case 'conflict': return <ConflictResult result={result} />;
      case 'proqol': return <ProQOLResult result={result} />;
      default: return <div>결과를 표시할 수 없습니다.</div>;
    }
  };

  return (
    <div style={{ animation: 'card-enter 0.6s ease-out' }}>
      {showConfetti && <Confetti />}
      {renderResult()}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            borderRadius: 24,
            background: 'var(--cc-bg)',
            color: 'var(--cc-text-sub)',
            border: '1.5px solid var(--cc-border)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🏠 홈으로
        </button>
        <button
          onClick={() => {
            if (testId) {
              clearTest(testId);
              navigate(`/test/${testId}`);
            }
          }}
          style={{
            padding: '10px 24px',
            borderRadius: 24,
            background: 'var(--cc-gradient-btn)',
            color: 'white',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔄 다시 검사하기
        </button>
      </div>
    </div>
  );
}
