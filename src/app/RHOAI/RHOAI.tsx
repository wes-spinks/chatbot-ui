import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const RHOAI: React.FunctionComponent = () => (
  <BaseChatbot
    title="Red Hat OpenShift AI"
    url={process.env.REACT_APP_ROUTER_URL ?? ''}
    assistantName="default_rhoai"
  />
);

export { RHOAI };
