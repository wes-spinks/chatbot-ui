import { CompareChatbot } from '@app/Compare/CompareChatbot';
import { CannedChatbot } from '@app/types/CannedChatbot';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { ChatbotFooter, ChatbotFootnote, MessageBar } from '@patternfly/virtual-assistant';
import * as React from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

export const Compare: React.FunctionComponent = () => {
  const { chatbots } = useLoaderData() as { chatbots: CannedChatbot[] };
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [input, setInput] = React.useState<string>();
  const [hasNewInput, setHasNewInput] = React.useState(false);
  const [firstController, setFirstController] = React.useState<AbortController>();
  const [secondController, setSecondController] = React.useState<AbortController>();
  const [firstChatbot, setFirstChatbot] = React.useState<CannedChatbot>();
  const [secondChatbot, setSecondChatbot] = React.useState<CannedChatbot>();
  const [isSelected, setIsSelected] = React.useState('toggle-group-assistant-1');
  const [showFirstChatbot, setShowFirstChatbot] = React.useState(true);
  const [showSecondChatbot, setShowSecondChatbot] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const assistants = searchParams.get('assistants')?.split(',');
  const navigate = useNavigate();

  const handleToggleClick = (event) => {
    const id = event.currentTarget.id;
    setIsSelected(id);
    setShowSecondChatbot(!showSecondChatbot);
    setShowFirstChatbot(!showFirstChatbot);
  };

  const handleSend = (value: string) => {
    setInput(value);
    setHasNewInput(!hasNewInput);
  };

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | Compare`;
    if (assistants && assistants.length === 2) {
      const actualChatbots = chatbots.filter(
        (chatbot) => chatbot.name === assistants[0] || chatbot.name === assistants[1],
      );
      if (actualChatbots.length === 2) {
        setFirstChatbot(actualChatbots[0]);
        setSecondChatbot(actualChatbots[1]);
      } else {
        // assistants are not real
        navigate('/');
      }
    } else {
      // not enough assistants, or duplicate assistants
      navigate('/');
    }

    const updateChatbotVisibility = () => {
      if (window.innerWidth >= 901) {
        setShowFirstChatbot(true);
        setShowSecondChatbot(true);
      } else {
        setShowFirstChatbot(true);
        setShowSecondChatbot(false);
        setIsSelected('toggle-group-assistant-1');
      }
    };
    window.addEventListener('resize', updateChatbotVisibility);

    return () => {
      window.removeEventListener('resize', updateChatbotVisibility);
    };
  }, []);

  const changeSearchParams = (_event, value: string, order: string) => {
    if (order === 'first' && secondChatbot) {
      setSearchParams(`assistants=${value},${secondChatbot.name}`);
    }
    if (order === 'second' && firstChatbot) {
      setSearchParams(`assistants=${firstChatbot.name},${value}`);
    }
  };

  return (
    firstChatbot &&
    secondChatbot && (
      <div className="compare-container">
        <div className="compare-mobile-controls">
          <ToggleGroup aria-label="Select which assistant to display">
            <ToggleGroupItem
              className="compare-toggle"
              text="Assistant 1"
              buttonId="toggle-group-assistant-1"
              isSelected={isSelected === 'toggle-group-assistant-1'}
              onChange={handleToggleClick}
            />
            <ToggleGroupItem
              className="compare-toggle"
              text="Assistant 2"
              buttonId="toggle-group-assistant-2"
              isSelected={isSelected === 'toggle-group-assistant-2'}
              onChange={handleToggleClick}
            />
          </ToggleGroup>
        </div>
        <div className="compare">
          <div className={css('compare-item', !showFirstChatbot ? 'compare-item-hidden' : undefined)}>
            <CompareChatbot
              chatbot={firstChatbot}
              allChatbots={chatbots}
              controller={firstController}
              setController={setFirstController}
              setIsSendButtonDisabled={setIsSendButtonDisabled}
              input={input}
              setChatbot={setFirstChatbot}
              hasNewInput={hasNewInput}
              setSearchParams={changeSearchParams}
              order="first"
            />
          </div>
          <div className={css('compare-item', !showSecondChatbot ? 'compare-item-hidden' : undefined)}>
            <CompareChatbot
              chatbot={secondChatbot}
              allChatbots={chatbots}
              controller={secondController}
              setController={setSecondController}
              setIsSendButtonDisabled={setIsSendButtonDisabled}
              input={input}
              setChatbot={setSecondChatbot}
              hasNewInput={hasNewInput}
              setSearchParams={changeSearchParams}
              order="second"
            />
          </div>
        </div>
        <ChatbotFooter>
          <MessageBar
            onSendMessage={handleSend}
            hasMicrophoneButton
            hasAttachButton={false}
            isSendButtonDisabled={isSendButtonDisabled}
          />
          <ChatbotFootnote label="Verify all information from this tool. LLMs make mistakes." />
        </ChatbotFooter>
      </div>
    )
  );
};
