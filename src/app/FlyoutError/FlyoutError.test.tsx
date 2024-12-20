import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { FlyoutError } from './FlyoutError';

describe('Flyout errror', () => {
  it('should render correctly', async () => {
    render(<FlyoutError title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });
  it('should render correctly with subtitle', async () => {
    render(<FlyoutError title="Test" subtitle="Subtitle" />);
    expect(screen.getByText('Test')).toBeTruthy();
    expect(screen.getByText('Subtitle')).toBeTruthy();
  });
  it('should render correctly with button', async () => {
    const spy = jest.fn();
    render(<FlyoutError title="Test" onClick={spy} />);
    const toggle = screen.getByRole('button', { name: /Retry/i });
    await userEvent.click(toggle);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
