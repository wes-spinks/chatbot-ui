import { Brand, Button } from '@patternfly/react-core';
import * as React from 'react';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';

const LoginPage: React.FunctionComponent = () => {
  return (
    <div className="login-page">
      <div className="show-light">
        <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
      </div>
      <div className="show-dark">
        <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
      </div>
      <div className="login-page__text">
        Accelerate innovation with a unified platform that transforms ideas into impactful AI solutions, from concept to
        deployment. Seamless integration, top-tier security, and full control over your data for fast, efficient AI
        development.
      </div>
      <div className="login-page__button">
        <Button>Sign in</Button>
      </div>
    </div>
  );
};

export { LoginPage };
