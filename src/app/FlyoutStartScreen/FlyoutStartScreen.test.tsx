import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FlyoutStartScreen } from './FlyoutStartScreen';
import { FlyoutWizardProvider } from '@app/FlyoutWizard/FlyoutWizardContext';

describe('Flyout start screen', () => {
  it('should render correctly with subtitle', async () => {
    render(
      <FlyoutWizardProvider>
        <FlyoutStartScreen title="Test" header="Header" subtitle="I am a subtitle" hideFlyout={jest.fn()} />
      </FlyoutWizardProvider>,
    );
    expect(screen.getByText('I am a subtitle')).toBeTruthy();
  });
  it('should render correctly with primary button', async () => {
    render(
      <FlyoutWizardProvider>
        <FlyoutStartScreen title="Test" header="Header" primaryButtonText="Get started" hideFlyout={jest.fn()} />
      </FlyoutWizardProvider>,
    );
    expect(screen.getByRole('button', { name: /Get started/i })).toBeTruthy();
  });
  it('should render correctly with secondary button', async () => {
    render(
      <FlyoutWizardProvider>
        <FlyoutStartScreen title="Test" header="Header" secondaryButtonText="Learn more" hideFlyout={jest.fn()} />
      </FlyoutWizardProvider>,
    );
    expect(screen.getByRole('button', { name: /Learn more/i })).toBeTruthy();
    expect(screen.getByText('or')).toBeTruthy();
  });
});
