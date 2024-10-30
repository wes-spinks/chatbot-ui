import { CompareChatbot } from '@app/Compare/CompareChatbot';
import { CannedChatbot } from '@app/types/CannedChatbot';
import { ChatbotFooter, ChatbotFootnote, MessageBar } from '@patternfly/virtual-assistant';
import * as React from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';

export const Compare: React.FunctionComponent = () => {
  const { chatbots } = useLoaderData() as { chatbots: CannedChatbot[] };
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [input, setInput] = React.useState<string>();
  const [controller, setController] = React.useState<AbortController>();
  const [firstChatbot, setFirstChatbot] = React.useState<CannedChatbot>();
  const [secondChatbot, setSecondChatbot] = React.useState<CannedChatbot>();
  const [searchParams] = useSearchParams();
  const assistants = searchParams.get('assistants')?.split(',');

  const handleSend = (value: string) => {
    setInput(value);
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
        throw new Error('Not real assistants');
      }
    } else {
      throw new Error('Not enough assistants');
    }
  }, []);

  return (
    firstChatbot &&
    secondChatbot && (
      <>
        <div className="compare">
          <div className="compare-item">
            <CompareChatbot
              chatbot={firstChatbot}
              allChatbots={chatbots}
              controller={controller}
              setController={setController}
              setIsSendButtonDisabled={setIsSendButtonDisabled}
              input={input}
              setChatbot={setFirstChatbot}
            />
          </div>
          <div className="compare-item">
            <CompareChatbot
              chatbot={secondChatbot}
              allChatbots={chatbots}
              controller={controller}
              setController={setController}
              setIsSendButtonDisabled={setIsSendButtonDisabled}
              input={input}
              setChatbot={setSecondChatbot}
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
      </>
    )
  );
};
