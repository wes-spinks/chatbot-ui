import { CannedChatbot } from '@app/types/CannedChatbot';
import * as React from 'react';

interface AppDataContextType {
  flyoutMenuSelectedChatbot?: CannedChatbot;
  updateFlyoutMenuSelectedChatbot: (newChatbot: CannedChatbot) => void;
}

const AppDataContext = React.createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flyoutMenuSelectedChatbot, setFlyoutMenuSelectedChatbot] = React.useState<CannedChatbot>();

  const updateFlyoutMenuSelectedChatbot = (newChatbot: CannedChatbot) =>
    setFlyoutMenuSelectedChatbot((prev) => ({ ...prev, ...newChatbot }));

  return (
    <AppDataContext.Provider value={{ flyoutMenuSelectedChatbot, updateFlyoutMenuSelectedChatbot }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = React.useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within a AppDataProvider');
  }
  return context;
};
