import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { router } from '../router';
import { AuthErrorScreen, AuthLoadingScreen } from './components/auth/AuthGuard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught global bootstrap error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      return <AuthErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default function App(): React.JSX.Element {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <Toaster position="bottom-right" />
        <Suspense fallback={<AuthLoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}
