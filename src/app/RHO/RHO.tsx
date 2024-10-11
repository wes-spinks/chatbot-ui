import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const RHO: React.FunctionComponent = () => (
  <BaseChatbot
    title="RHO 2025 FAQ"
    url="https://quarkus-llm-router-rhsaia-dev.apps.rhsaia.vg6c.p1.openshiftapps.com/assistant/chat/streaming"
    assistantName="default_rho_2025_faq"
  />
);

export { RHO };
