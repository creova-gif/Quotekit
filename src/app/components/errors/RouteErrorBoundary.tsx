import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '../ui/button';

export function RouteErrorBoundary(): React.JSX.Element {
  const error = useRouteError();
  let title = 'Something went wrong';
  let message = 'An unexpected error occurred in this workspace view.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-qk-bg font-sans" style={{ fontFamily: 'var(--qk-sans)' }}>
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 shadow-sm">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-qk-ink mb-2" style={{ fontFamily: 'var(--qk-serif)' }}>{title}</h1>
      <p className="text-sm text-qk-ink2 max-w-md mb-6 leading-relaxed">{message}</p>
      <Button onClick={() => window.location.reload()} className="bg-qk-blue hover:bg-qk-blue-d text-white font-semibold px-4 h-10 rounded-lg cursor-pointer">
        Reload Workspace
      </Button>
    </div>
  );
}
