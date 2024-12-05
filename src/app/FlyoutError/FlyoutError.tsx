import { Button } from '@patternfly/react-core';
import * as React from 'react';

interface FlyoutErrorProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

export const FlyoutError: React.FunctionComponent<FlyoutErrorProps> = ({
  subtitle,
  title,
  onClick,
}: FlyoutErrorProps) => {
  return (
    <>
      <div className="flyout-error">
        <div className="flyout-error-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {onClick && (
          <div className="flyout-error-action">
            <Button onClick={onClick}>Retry</Button>
          </div>
        )}
      </div>
    </>
  );
};
