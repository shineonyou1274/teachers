import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getTestMeta } from '../data/testRegistry';
import { saveAnswers, loadAnswers, saveResult } from '../utils/storage';
import {
  scoreEnneagram, scoreBurnout, scoreBig5,
  scoreHSP, scoreECR, scoreConflict, scoreProQOL,
} from '../utils/scoring';
import type { AnswerMap } from '../utils/scoring';
import { isGuest, addGuestCompletedTest, canGuestTakeTest } from '../utils/auth';
import AuthModal from '../components/ui/AuthModal';
import enneagramData from '../data/enneagram.json';
import burnoutData from '../data/burnout.json';
import otherTests from '../data/other_tests.json';

const SCORE_FNS: Record<string, (a: AnswerMap) => unknown> = {
  enneagram: scoreEnneagram,
  burnout: scoreBurnout,
  big5: scoreBig5,
  hsp: scoreHSP,
  ecr: scoreECR,
  conflict: scoreConflict,
  proqol: scoreProQOL,
};

interface QuestionItem {
  key: string;
  text: string;
  pageLabel?: string;
}

function getQuestions(testId: string): { pages: QuestionItem[][]; scaleMax: number; scaleLabels: [string, string] } {
  if (testId === 'enneagram') {
    const types = (enneagramData as any).types;
    const pages: QuestionItem[][] = types.map((t: any) =>
      t.items.map((item: any, idx: number) => ({
        key: `e${t.id}_${idx}`,
        text: typeof item === 'string' ? item : item.text,
        pageLabel: `유형 ${t.id} / 9`,
      }))
    );
    return { pages, scaleMax: 5, scaleLabels: ['전혀 아니다', '매우 그렇다'] };
  }

  if (testId === 'burnout') {
    const items = (burnoutData as any).items;
    const all: QuestionItem[] = items.map((item: any) => ({
      key: `b${item.id}`,
      text: item.text,
    }));
    const pageSize = 11;
    const pages: QuestionItem[][] = [];
    for (let i = 0; i < all.length; i += pageSize) {
      pages.push(all.slice(i, i + pageSize));
    }
    return { pages, scaleMax: 5, scaleLabels: ['전혀 아니다', '매우 그렇다'] };
  }

  // Other tests
  const testData = (otherTests as any)[testId];
  if (!testData) return { pages: [[]], scaleMax: 5, scaleLabels: ['전혀 아니다', '매우 그렇다'] };

  const meta = getTestMeta(testId);
  const items = testData.items;
  const all: QuestionItem[] = items.map((item: any) => ({
    key: `${testId}_${item.id}`,
    text: item.text,
  }));

  const pageSize = meta?.paginateBy === 'type' ? all.length : (meta?.paginateBy || 10);
  const pages: QuestionItem[][] = [];
  for (let i = 0; i < all.length; i += pageSize) {
    pages.push(all.slice(i, i + pageSize));
  }

  const scaleMax = meta?.scaleMax || 5;
  const scaleLabels: [string, string] = scaleMax === 7
    ? ['전혀 아니다', '매우 그렇다']
    : ['전혀 아니다', '매우 그렇다'];

  return { pages, scaleMax, scaleLabels };
}

export default function TestRunner() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const meta = getTestMeta(testId || '');
  const topRef = useRef<HTMLDivElement>(null);

  const { pages, scaleMax, scaleLabels } = getQuestions(testId || '');
  const totalQuestions = pages.flat().length;

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    return loadAnswers(testId || '') || {};
  });
  const [showSignup, setShowSignup] = useState(false);

  // Guest limit check
  const guestBlocked = isGuest() && !canGuestTakeTest();

  useEffect(() => {
    if (testId) saveAnswers(testId, answers);
  }, [answers, testId]);

  const currentQuestions = pages[currentPage] || [];
  const answeredCount = Object.keys(answers).length;
  const allCurrentAnswered = currentQuestions.every(q => answers[q.key] !== undefined);

  const pageLabel = currentQuestions[0]?.pageLabel;

  const handleAnswer = (key: string, value: number) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(p => p + 1);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // Complete
      const scoreFn = SCORE_FNS[testId || ''];
      if (scoreFn) {
        const result = scoreFn(answers);
        saveResult(testId || '', result);
        if (isGuest()) addGuestCompletedTest(testId || '');
      }
      navigate(`/result/${testId}`);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  if (!meta) {
    return <div style={{ textAlign: 'center', padding: 40 }}>검사를 찾을 수 없습니다.</div>;
  }

  if (guestBlocked) {
    return (
      <div style={{ textAlign: 'center', padding: 40, animation: 'card-enter 0.6s ease-out' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎪</div>
        <h2 className="text-gradient" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
          무료 체험이 끝났어요!
        </h2>
        <p style={{ fontSize: 14, color: 'var(--cc-text-sub)', lineHeight: 1.6, marginBottom: 20 }}>
          게스트는 1개 검사만 체험할 수 있어요
          <br />닉네임을 정하면 모든 검사를 이용할 수 있습니다
        </p>
        <button
          onClick={() => setShowSignup(true)}
          style={{
            padding: '12px 28px', borderRadius: 24, border: 'none',
            background: 'var(--cc-gradient-btn)', color: 'white',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          🎠 가입하고 계속하기
        </button>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 20px', borderRadius: 20, border: '1px solid var(--cc-border)',
              background: 'white', color: 'var(--cc-text-sub)',
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
        {showSignup && (
          <AuthModal mode="signup" onClose={() => setShowSignup(false)} onSuccess={() => { setShowSignup(false); window.location.reload(); }} />
        )}
      </div>
    );
  }

  return (
    <div ref={topRef} style={{ animation: 'card-enter 0.6s ease-out' }}>
      <div
        style={{
          background: 'var(--cc-card)',
          borderRadius: 24,
          padding: '24px 16px',
          boxShadow: 'var(--cc-shadow)',
          border: '1.5px solid var(--cc-border)',
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          {pageLabel && (
            <span
              style={{
                background: 'linear-gradient(135deg, var(--cc-pink-light), var(--cc-lavender-light))',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--cc-pink-deep)',
              }}
            >
              {pageLabel}
            </span>
          )}
          {!pageLabel && (
            <span
              style={{
                background: 'linear-gradient(135deg, var(--cc-pink-light), var(--cc-lavender-light))',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--cc-pink-deep)',
              }}
            >
              {meta.icon} {meta.name}
            </span>
          )}
          <span style={{ fontSize: 12, color: 'var(--cc-text-sub)', marginLeft: 'auto' }}>
            {currentPage + 1} / {pages.length} 페이지
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--cc-text-sub)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>검사 진행률</span>
            <span>{answeredCount} / {totalQuestions} 문항</span>
          </div>
          <div
            style={{
              height: 10,
              background: 'var(--cc-bg)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 10,
                background: 'linear-gradient(90deg, var(--cc-pink), var(--cc-lavender), var(--cc-sky))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
                width: `${(answeredCount / totalQuestions) * 100}%`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* Questions */}
        {currentQuestions.map((q, idx) => (
          <div
            key={q.key}
            style={{
              marginBottom: 16,
              padding: '14px 12px',
              background: answers[q.key] !== undefined ? 'var(--cc-pink-light)' : 'var(--cc-bg)',
              borderRadius: 16,
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cc-pink-deep)', marginBottom: 6 }}>
              문항 {currentPage * (currentQuestions.length) + idx + 1}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{q.text}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 4px' }}>
                <span style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>{scaleLabels[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--cc-text-sub)' }}>{scaleLabels[1]}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', width: '100%' }}>
                {Array.from({ length: scaleMax }, (_, i) => i + 1).map(val => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.key, val)}
                    style={{
                      width: scaleMax <= 5 ? 44 : 36,
                      height: 44,
                      borderRadius: 22,
                      border: answers[q.key] === val ? 'none' : '2px solid var(--cc-border)',
                      background: answers[q.key] === val
                        ? 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))'
                        : 'white',
                      color: answers[q.key] === val ? 'white' : 'var(--cc-text-sub)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: answers[q.key] === val ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: answers[q.key] === val ? '0 2px 12px rgba(236,72,153,0.3)' : 'none',
                    }}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Sticky bottom navigation */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(255,248,245,0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--cc-border)',
          padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          style={{
            flex: 1,
            padding: '14px 0',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 600,
            background: 'var(--cc-card)',
            color: 'var(--cc-text-sub)',
            border: '1.5px solid var(--cc-border)',
            opacity: currentPage === 0 ? 0.4 : 1,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          ← 이전
        </button>
        <button
          onClick={handleNext}
          disabled={!allCurrentAnswered}
          style={{
            flex: 2,
            padding: '14px 0',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            background: allCurrentAnswered
              ? 'linear-gradient(135deg, var(--cc-pink-deep), var(--cc-lavender-deep))'
              : '#e5e7eb',
            color: allCurrentAnswered ? 'white' : '#9ca3af',
            border: 'none',
            cursor: allCurrentAnswered ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          {currentPage < pages.length - 1
            ? '다음 →'
            : '🎪 검사 완료!'}
        </button>
      </div>
    </div>
  );
}
