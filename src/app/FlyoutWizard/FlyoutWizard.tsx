import * as React from 'react';
import { useFlyoutWizard } from './FlyoutWizardContext';

export const FlyoutWizard: React.FC<{ steps: React.ReactNode[] }> = ({ steps }) => {
  const { currentStep } = useFlyoutWizard();

  return <>{steps[currentStep]}</>;
};
