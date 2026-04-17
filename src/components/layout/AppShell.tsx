import { Outlet } from 'react-router-dom';
import Header from './Header';
import AnimatedBackground from './AnimatedBackground';

export default function AppShell() {
  return (
    <>
      <AnimatedBackground />
      <Header />
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 800,
          margin: '0 auto',
          padding: '24px 20px 80px',
          flex: 1,
        }}
      >
        <Outlet />
      </main>
      <footer
        style={{
          textAlign: 'center',
          padding: '32px 20px 80px',
          position: 'relative',
          zIndex: 0,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: 'var(--cc-text-sub)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span style={{ display: 'inline-block', animation: 'cotton-spin 4s ease-in-out infinite' }}>🍭</span>
          마음 쉼터 · 교사 힐링 심리검사
          <span style={{ display: 'inline-block', animation: 'cotton-spin 4s ease-in-out infinite' }}>🎠</span>
        </div>
      </footer>
    </>
  );
}
