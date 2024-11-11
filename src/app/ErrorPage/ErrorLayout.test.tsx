import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorLayout } from './ErrorLayout';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn,
}));

describe('Error layout', () => {
  it('should render correctly', () => {
    render(<ErrorLayout errorCode="500" body="Body" title="Title" />);
    expect(screen.getByText('Error Code 500')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    const button = screen.getByRole('link', { name: /Go back home/i });
    expect(button).toBeTruthy();
    expect(button).toHaveAttribute('href', '/');
  });
  it('should render retry button if hasRetry prop is passed in', () => {
    render(<ErrorLayout errorCode="500" body="Body" title="Title" hasRetry />);
    const button = screen.getByRole('button', { name: /Retry/i });
    expect(button).toBeTruthy();
  });
});
