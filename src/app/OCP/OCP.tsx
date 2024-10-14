import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const OCP: React.FunctionComponent = () => (
  <BaseChatbot
    title="Red Hat OpenShift Container Platform"
    // TODO: Throw exception if REACT_APP_ROUTER_URL is not set
    url={process.env.REACT_APP_ROUTER_URL ?? ''}
    assistantName="default_ocp"
  />
);

export { OCP };
