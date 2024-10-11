import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';

const Ansible: React.FunctionComponent = () => (
  <BaseChatbot
    title="Ansible"
    url="https://quarkus-llm-router-rhsaia-dev.apps.rhsaia.vg6c.p1.openshiftapps.com/assistant/chat/streaming"
    assistantName="default_ansible"
  />
);

export { Ansible };
