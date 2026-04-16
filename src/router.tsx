import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Dashboard /> },
      {
        path: '/test/:testId',
        lazy: () => import('./pages/TestRunner').then(m => ({ Component: m.default })),
      },
      {
        path: '/result/:testId',
        lazy: () => import('./pages/ResultPage').then(m => ({ Component: m.default })),
      },
      {
        path: '/profile',
        lazy: () => import('./pages/ProfilePage').then(m => ({ Component: m.default })),
      },
      {
        path: '/group',
        lazy: () => import('./pages/GroupPage').then(m => ({ Component: m.default })),
      },
      {
        path: '/admin',
        lazy: () => import('./pages/AdminPage').then(m => ({ Component: m.default })),
      },
    ],
  },
]);

export default router;
