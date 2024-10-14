import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const RHO: React.FunctionComponent = () => (
  <BaseChatbot
    title="RHO 2025 FAQ"
    url={process.env.REACT_APP_ROUTER_URL ?? ''}
    assistantName="default_rho_2025_faq"
  />
);

export { RHO };
