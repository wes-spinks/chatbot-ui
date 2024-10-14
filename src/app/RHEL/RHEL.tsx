import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const RHEL: React.FunctionComponent = () => (
  <BaseChatbot
    title="Red Hat Enterprise Linux"
    url={process.env.REACT_APP_ROUTER_URL ?? ''}
    assistantName="default_rhel"
  />
);

export { RHEL };
