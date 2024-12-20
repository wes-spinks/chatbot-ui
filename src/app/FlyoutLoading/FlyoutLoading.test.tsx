import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlyoutLoading } from './FlyoutLoading';

describe('Flyout loading', () => {
  it('should render correctly', async () => {
    render(<FlyoutLoading />);
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });
});
