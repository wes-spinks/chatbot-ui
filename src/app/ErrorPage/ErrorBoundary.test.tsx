import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteError: jest.fn(),
  useNavigate: () => jest.fn,
  isRouteErrorResponse: jest.fn(),
}));

const mockedUseRouteError = useRouteError as jest.Mock;
const mockedIsRouteErrorResponse = isRouteErrorResponse as unknown as jest.Mock;
const MOCK_401 = { status: 401 };
const MOCK_403 = { status: 403 };
const MOCK_404 = { status: 404 };
const MOCK_500 = { status: 500 };
const MOCK_503 = { status: 503 };

const checkHome = () => {
  const home = screen.getByRole('link', { name: /Go back home/i });
  expect(home).toBeTruthy();
  expect(home).toHaveAttribute('href', '/');
};

const checkRetry = () => {
  const retry = screen.getByRole('button', { name: /Retry/i });
  expect(retry).toBeTruthy();
};

describe('Error boundary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render 401 correctly', () => {
    mockedIsRouteErrorResponse.mockReturnValueOnce(true);
    mockedUseRouteError.mockReturnValueOnce(MOCK_401);

    render(<ErrorBoundary />);
    expect(
      screen.getByText(
        'Accelerate innovation with a unified platform that transforms ideas into impactful AI solutions, from concept to deployment. Seamless integration, top-tier security, and full control over your data for fast, efficient AI development.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Sign in')).toBeTruthy();
  });
  it('should render 403 correctly', () => {
    mockedUseRouteError.mockReturnValueOnce(MOCK_403);
    mockedIsRouteErrorResponse.mockReturnValueOnce(true);
    render(<ErrorBoundary />);
    expect(screen.getByText('Error Code 403')).toBeTruthy();
    expect(screen.getByText('Access denied')).toBeTruthy();
    expect(
      screen.getByText(
        "You don't have permission to access this page. Please check your credentials or contact an administrator for assistance.",
      ),
    ).toBeTruthy();
    checkHome();
  });
  it('should render 404 correctly', () => {
    mockedUseRouteError.mockReturnValue(MOCK_404);
    mockedIsRouteErrorResponse.mockReturnValueOnce(true);
    render(<ErrorBoundary />);
    expect(screen.getByText('Error Code 404')).toBeTruthy();
    expect(screen.getByText('Page not found')).toBeTruthy();
    expect(
      screen.getByText("The page you're looking for doesn't exit or may have been moved. Let's get you back on track!"),
    ).toBeTruthy();
    checkHome();
  });
  it('should render 500 correctly', () => {
    mockedUseRouteError.mockReturnValue(MOCK_500);
    mockedIsRouteErrorResponse.mockReturnValueOnce(false);
    render(<ErrorBoundary />);
    expect(screen.getByText('Error Code 500')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(
      screen.getByText(
        "We're experiencing a server issue. Please try again later or contact support if the problem persists.",
      ),
    ).toBeTruthy();
    checkHome();
  });
  it('should render 503 correctly', () => {
    mockedUseRouteError.mockReturnValue(MOCK_503);
    mockedIsRouteErrorResponse.mockReturnValueOnce(true);
    render(<ErrorBoundary />);
    expect(screen.getByText('Error Code 503')).toBeTruthy();
    expect(screen.getByText('Service unavailable')).toBeTruthy();
    expect(
      screen.getByText(
        'Our servers are currently down for maintenance or experiencing high demand. Please check back later.',
      ),
    ).toBeTruthy();
    checkHome();
    checkRetry();
  });
});
