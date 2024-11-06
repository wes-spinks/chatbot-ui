import * as React from 'react';

interface ChildStatus {
  isMessageStreaming: boolean;
}

interface StatusContextType {
  status: {
    child1: ChildStatus;
    child2: ChildStatus;
  };
  updateStatus: (child: 'child1' | 'child2', newStatus: Partial<ChildStatus>) => void;
}

const ChildStatusContext = React.createContext<StatusContextType | undefined>(undefined);

export const useChildStatus = () => {
  const context = React.useContext(ChildStatusContext);
  if (!context) throw new Error('useChildStatus must be used within a ChildStatusProvider');
  return context;
};

// Define the provider props
interface ChildStatusProviderProps {
  children: React.ReactNode;
}

export const ChildStatusProvider: React.FC<ChildStatusProviderProps> = ({ children }) => {
  const [status, setStatus] = React.useState<StatusContextType['status']>({
    child1: { isMessageStreaming: false },
    child2: { isMessageStreaming: false },
  });

  const updateStatus = (child: 'child1' | 'child2', newStatus: Partial<ChildStatus>) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [child]: { ...prevStatus[child], ...newStatus },
    }));
  };

  return <ChildStatusContext.Provider value={{ status, updateStatus }}>{children}</ChildStatusContext.Provider>;
};
