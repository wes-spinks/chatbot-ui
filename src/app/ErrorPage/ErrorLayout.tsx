import * as React from 'react';
import { Brand, Button } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';

interface ErrorLayoutProps {
  hasRetry?: boolean;
  title: string;
  body: string;
  errorCode?: string;
  hasHome?: boolean;
}
const ErrorLayout: React.FunctionComponent<ErrorLayoutProps> = ({
  hasRetry,
  title,
  body,
  errorCode,
  hasHome = true,
}) => {
  const supportLink = process.env.SUPPORT_LINK ?? '';
  const navigate = useNavigate();

  const handleReload = () => {
    navigate(0);
  };

  return (
    <div className="error-page">
      <div className="error-page__main-layout">
        <div className="error-page__image">
          <div className="show-light">
            <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
          </div>
          <div className="show-dark">
            <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
          </div>
        </div>
        <div className="error-page__text-and-buttons">
          <div className="error-page__text">
            {errorCode && <span className="error-page__error-code">Error Code {errorCode}</span>}
            <h1>{title}</h1>
            <p>{body}</p>
          </div>
          <div className="error-page__buttons">
            {hasRetry && (
              <Button onClick={handleReload} size="sm">
                Retry
              </Button>
            )}
            {hasHome && (
              <Button component="a" href="/" size="sm" variant="secondary">
                Go back home
              </Button>
            )}
            {supportLink && (
              <Button component="a" href={supportLink} size="sm" variant="secondary">
                Contact support
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ErrorLayout };
