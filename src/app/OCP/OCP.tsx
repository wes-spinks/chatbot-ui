import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const OCP: React.FunctionComponent = () => (
  <BaseChatbot
    title="Red Hat OpenShift Container Platform"
    url="https://quarkus-llm-router-rhsaia-dev.apps.rhsaia.vg6c.p1.openshiftapps.com/assistant/chat/streaming"
    assistantName="default_ocp"
  />
);

export { OCP };
