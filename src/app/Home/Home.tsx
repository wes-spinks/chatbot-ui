import * as React from 'react';
import { Brand, Bullseye } from '@patternfly/react-core';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';

const Home: React.FunctionComponent = () => {
  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | Home`;
  }, []);

  return (
    <Bullseye>
      <div className="show-light">
        <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
      </div>
      <div className="show-dark">
        <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
      </div>
    </Bullseye>
  );
};

export { Home };
