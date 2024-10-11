import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const RHEL: React.FunctionComponent = () => (
  <BaseChatbot
    title="Red Hat Enterprise Linux"
    url="https://quarkus-llm-router-rhsaia-dev.apps.rhsaia.vg6c.p1.openshiftapps.com/assistant/chat/streaming"
    assistantName="default_rhel"
  />
);

export { RHEL };
