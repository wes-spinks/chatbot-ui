import * as React from 'react';
import { useFlyoutWizard } from './FlyoutWizardContext';

export const FlyoutWizard: React.FC<{ steps: React.ReactNode[] }> = ({ steps }) => {
  const { currentStep, goToStep, setReloadList } = useFlyoutWizard();

  // loop back to first step when the number of steps run out
  if (currentStep >= steps.length) {
    goToStep(0);
    setReloadList(false);
    return <>{steps[0]}</>;
  }
  return <>{steps[currentStep]}</>;
};
