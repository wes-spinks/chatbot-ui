import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { FlyoutHeader } from './FlyoutHeader';

describe('Flyout header', () => {
  it('should render correctly', async () => {
    const spy = jest.fn();
    render(<FlyoutHeader title="Test" hideFlyout={spy} />);
    const toggle = screen.getByRole('button', { name: /Close/i });
    await userEvent.click(toggle);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
