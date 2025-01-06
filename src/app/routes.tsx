import * as React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { chatbotLoader } from '@app/utils/utils';
import { ComparePage } from './Compare/ComparePage';
import { ErrorBoundary } from './ErrorPage/ErrorBoundary';
import { LoginPage } from '@app/LoginPage/LoginPage';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

// used for navigation panel
const routes: AppRouteConfig[] = [{ path: '/', label: 'Home', title: 'Red Hat Composer AI Studio | Home' }];

// used for actual routing
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <BaseChatbot />,
        loader: chatbotLoader,
      },
      {
        path: 'compare',
        element: <ComparePage />,
        loader: chatbotLoader,
      },
      {
        path: 'signin',
        element: <LoginPage />,
        loader: chatbotLoader,
      },
    ],
  },
]);

const AppRoutes = (): React.ReactElement => <RouterProvider router={router} />;

export { AppRoutes, routes, router };
