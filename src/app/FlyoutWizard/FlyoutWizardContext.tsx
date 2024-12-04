import * as React from 'react';

interface FlyoutWizardContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reloadList: boolean;
  setReloadList: (bool: boolean) => void;
}

const FlyoutWizardContext = React.createContext<FlyoutWizardContextType | undefined>(undefined);

export const FlyoutWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [reloadList, setReloadList] = React.useState(false);
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const goToStep = (step: number) => setCurrentStep(step);

  return (
    <FlyoutWizardContext.Provider value={{ currentStep, nextStep, prevStep, goToStep, reloadList, setReloadList }}>
      {children}
    </FlyoutWizardContext.Provider>
  );
};

export const useFlyoutWizard = () => {
  const context = React.useContext(FlyoutWizardContext);
  if (!context) {
    throw new Error('useFlyoutWizard must be used within a FlyoutWizardProvider');
  }
  return context;
};
