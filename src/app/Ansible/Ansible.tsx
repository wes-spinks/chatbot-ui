import * as React from 'react';
import { BaseChatbot } from '@app/BaseChatbot/BaseChatbot';
// TODO: This needs to be dynamic and not hard coded for each assistant
const Ansible: React.FunctionComponent = () => (
  <BaseChatbot
    title="Ansible"
    url={process.env.REACT_APP_ROUTER_URL ?? ''}
    assistantName="default_ansible"
  />
);

export { Ansible };
