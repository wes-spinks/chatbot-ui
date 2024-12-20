import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { FlyoutFooter } from './FlyoutFooter';

describe('Flyout footer', () => {
  it('should render correctly', async () => {
    const spy = jest.fn();
    render(<FlyoutFooter primaryButton="New assistant" onPrimaryButtonClick={spy} />);
    const toggle = screen.getByRole('button', { name: /New assistant/i });
    await userEvent.click(toggle);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should disable primary button', async () => {
    render(<FlyoutFooter primaryButton="New assistant" onPrimaryButtonClick={jest.fn()} isPrimaryButtonDisabled />);
    expect(screen.getByRole('button', { name: /New assistant/i })).toBeDisabled();
  });
  it('should render second button', async () => {
    const spy = jest.fn();
    render(
      <FlyoutFooter
        primaryButton="Create assistant"
        onPrimaryButtonClick={jest.fn()}
        secondaryButton="Cancel"
        onSecondaryButtonClick={spy}
      />,
    );
    const toggle = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(toggle);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
