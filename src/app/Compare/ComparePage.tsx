import * as React from 'react';
import { ChildStatusProvider } from './ChildStatusProvider';
import { CompareLayout } from './CompareLayout';

export const ComparePage: React.FunctionComponent = () => {
  return (
    <ChildStatusProvider>
      <CompareLayout />
    </ChildStatusProvider>
  );
};
