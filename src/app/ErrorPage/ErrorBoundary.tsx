import * as React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ErrorLayout } from './ErrorLayout';
import { LoginPage } from '@app/LoginPage/LoginPage';

const ErrorBoundary: React.FunctionComponent = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return <LoginPage />;
    }

    if (error.status === 403) {
      return (
        <ErrorLayout
          errorCode="403"
          title="Access denied"
          body="You don't have permission to access this page. Please check your credentials or contact an administrator for assistance."
        />
      );
    }

    if (error.status === 404) {
      return (
        <ErrorLayout
          errorCode="404"
          title="Page not found"
          body="The page you're looking for doesn't exit or may have been moved. Let's get you back on track!"
        />
      );
    }

    if (error.status === 503) {
      return (
        <ErrorLayout
          hasRetry
          errorCode="503"
          title="Service unavailable"
          body="Our servers are currently down for maintenance or experiencing high demand. Please check back later."
        />
      );
    }
  }

  if (typeof error === 'object' && error !== null && 'data' in error) {
    if (
      typeof error.data === 'object' &&
      error.data !== null &&
      'status' in error.data &&
      error.data.status === 'Misconfigured'
    ) {
      return <ErrorLayout title="App not configured" body="Please update your environment variables" hasHome={false} />;
    }
  }

  return (
    <ErrorLayout
      hasRetry
      errorCode="500"
      title="Something went wrong"
      body="We're experiencing a server issue. Please try again later or contact support if the problem persists."
    />
  );
};

export { ErrorBoundary };
