import { lazy } from 'react';
import type React from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { AppLayout } from './app/components/layout/AppLayout';
import { AuthGuard } from './app/components/auth/AuthGuard';
import { RouteErrorBoundary } from './app/components/errors/RouteErrorBoundary';

// Lazy load page components to enable route-level code splitting
const Landing = lazy(() => import('./app/components/pages/Landing'));
const LoginPage = lazy(() => import('./app/components/auth/LoginPage'));
const Portal = lazy(() => import('./app/components/pages/Portal'));
const Dashboard = lazy(() => import('./app/components/pages/Dashboard'));
const QuickPropose = lazy(() => import('./app/components/pages/QuickPropose'));
const Builder = lazy(() => import('./app/components/pages/Builder'));
const Clients = lazy(() => import('./app/components/pages/Clients'));
const Scheduler = lazy(() => import('./app/components/pages/Scheduler'));
const Automations = lazy(() => import('./app/components/pages/Automations'));
const LeadForms = lazy(() => import('./app/components/pages/LeadForms'));
const Library = lazy(() => import('./app/components/pages/Library'));
const Projects = lazy(() => import('./app/components/pages/Projects'));
const Analytics = lazy(() => import('./app/components/pages/Analytics'));
const Inbox = lazy(() => import('./app/components/pages/Inbox'));
const Settings = lazy(() => import('./app/components/pages/Settings'));
const NexusAI = lazy(() => import('./app/components/pages/NexusAI'));

// Wrapper components to pass necessary props/callbacks with explicit return types
const LandingWrapper = (): React.JSX.Element => {
  const navigate = useNavigate();
  return <Landing onEnterApp={() => navigate('/dashboard')} />;
};

const DashboardWrapper = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <Dashboard
      onNavigate={(page) => {
        const target = page === 'automation' ? 'automations' : page;
        navigate(target === 'dashboard' ? '/dashboard' : `/dashboard/${target}`);
      }}
    />
  );
};

const QuickProposeWrapper = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <QuickPropose
      onNavigate={(page) => {
        const target = page === 'automation' ? 'automations' : page;
        navigate(target === 'dashboard' ? '/dashboard' : `/dashboard/${target}`);
      }}
    />
  );
};

const BuilderWrapper = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <Builder
      onNavigate={(page) => {
        const target = page === 'automation' ? 'automations' : page;
        navigate(target === 'dashboard' ? '/dashboard' : `/dashboard/${target}`);
      }}
    />
  );
};

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <LandingWrapper />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/p/:token',
    element: <Portal />,
    errorElement: <RouteErrorBoundary />,
  },
  // Protected Routes nested under /dashboard and wrapped in AuthGuard
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardWrapper />,
      },
      {
        path: 'quickpropose',
        element: <QuickProposeWrapper />,
      },
      {
        path: 'builder',
        element: <BuilderWrapper />,
      },
      {
        path: 'clients',
        element: <Clients />,
      },
      {
        path: 'portal',
        element: <Portal />,
      },
      {
        path: 'scheduler',
        element: <Scheduler />,
      },
      {
        path: 'automations',
        element: <Automations />,
      },
      {
        path: 'leadforms',
        element: <LeadForms />,
      },
      {
        path: 'library',
        element: <Library />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'inbox',
        element: <Inbox />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'nexusai',
        element: <NexusAI />,
      },
    ],
  },
  // Catch-all route
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
