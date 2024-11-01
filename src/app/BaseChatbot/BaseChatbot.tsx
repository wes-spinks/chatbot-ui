import * as React from 'react';
import {
  Chatbot,
  ChatbotAlert,
  ChatbotContent,
  ChatbotDisplayMode,
  ChatbotFooter,
  ChatbotFootnote,
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotWelcomePrompt,
  Message,
  MessageBar,
  MessageBox,
  MessageProps,
} from '@patternfly/virtual-assistant';
import { useLoaderData } from 'react-router-dom';
import { CannedChatbot } from '../types/CannedChatbot';
import { HeaderDropdown } from '@app/HeaderDropdown/HeaderDropdown';
import { ERROR_TITLE, getId } from '@app/utils/utils';
import { Button } from '@patternfly/react-core';
interface Source {
  link: string;
}

const BaseChatbot: React.FunctionComponent = () => {
  const { chatbots } = useLoaderData() as { chatbots: CannedChatbot[] };
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState<string[]>([]);
  const [currentSources, setCurrentSources] = React.useState<Source[]>();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<{ title: string; body: string }>();
  const [announcement, setAnnouncement] = React.useState<string>();
  const [currentChatbot, setCurrentChatbot] = React.useState<CannedChatbot>(chatbots[0]);
  const [controller, setController] = React.useState<AbortController>();

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | ${currentChatbot?.name}`;
  }, []);

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | ${currentChatbot?.name}`;
  }, [currentChatbot]);

  React.useEffect(() => {
    document.title = `Red Hat Composer AI Studio | ${currentChatbot?.name}${announcement ? ` - ${announcement}` : ''}`;
  }, [announcement]);

  // Auto-scrolls to the latest message
  React.useEffect(() => {
    // don't scroll the first load, but scroll if there's a current stream or a new source has popped up
    if (messages.length > 0 || currentMessage || currentSources) {
      scrollToBottomRef.current?.scrollIntoView();
    }
  }, [messages, currentMessage, currentSources]);

  const url = process.env.REACT_APP_ROUTER_URL ?? '';

  const ERROR_BODY = {
    'Error: 404': `${currentChatbot?.displayName} is currently unavailable. Use a different assistant or try again later.`,
    'Error: 500': `${currentChatbot?.displayName} has encountered an error and is unable to answer your question. Use a different assistant or try again later.`,
    'Error: Other': `${currentChatbot?.displayName} has encountered an error and is unable to answer your question. Use a different assistant or try again later.`,
  };

  const handleError = (e) => {
    const newError = { title: ERROR_TITLE[e], body: ERROR_BODY[e] };
    setError(newError);
    // make announcement to assistive devices that there was an error
    setAnnouncement(`Error: ${newError.title} ${newError.body}`);
  };

  // fixme this is getting too large; we should refactor
  async function fetchData(userMessage: string) {
    if (controller) {
      controller.abort();
    }

    const newController = new AbortController();
    setController(newController);

    try {
      let isSource = false;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          assistantName: currentChatbot?.name,
        }),
        signal: newController?.signal,
      });

      if (!response.ok || !response.body) {
        switch (response.status) {
          case 500:
            throw new Error('500');
          case 404:
            throw new Error('404');
          default:
            throw new Error('Other');
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done;
      const sources: string[] = [];

      while (!done) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        if (chunk.includes('Sources used to generate this content')) {
          sources.push(chunk);
          isSource = true;
        } else {
          if (isSource) {
            sources.push(chunk);
          } else {
            setCurrentMessage((prevData) => [...prevData, chunk]);
          }
        }
      }

      if (sources) {
        const sourceLinks = sources.join('').split('Sources used to generate this content:\n')[1];
        const sourceLinksArr = sourceLinks.split('\n').filter((source) => source !== '');
        const formattedSources: Source[] = [];
        sourceLinksArr.forEach((source) => formattedSources.push({ link: source }));
        setController(newController);
        return formattedSources;
      }

      return undefined;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          handleError(error);
        }
      }
      return undefined;
    } finally {
      setController(undefined);
    }
  }

  const handleSend = async (input: string) => {
    setIsSendButtonDisabled(true);
    const newMessages = structuredClone(messages);
    if (currentMessage.length > 0) {
      newMessages.push({
        id: getId(),
        name: currentChatbot?.displayName,
        role: 'bot',
        content: currentMessage.join(''),
        ...(currentSources && { sources: { sources: currentSources } }),
      });
      setCurrentMessage([]);
      setCurrentSources(undefined);
    }
    newMessages.push({ id: getId(), name: 'You', role: 'user', content: input });
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from You: ${input}. Message from Chatbot is loading.`);

    const sources = await fetchData(input);
    if (sources) {
      setCurrentSources(sources);
    }
    // make announcement to assistive devices that new message has been added
    currentMessage.length > 0 && setAnnouncement(`Message from Chatbot: ${currentMessage.join('')}`);
    setIsSendButtonDisabled(false);
  };

  const displayMode = ChatbotDisplayMode.embedded;

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: CannedChatbot) => {
    if (controller) {
      controller.abort();
    }
    setController(undefined);
    setCurrentChatbot(value);
    setMessages([]);
    setCurrentMessage([]);
    setCurrentSources(undefined);
    setError(undefined);
    setAnnouncement(undefined);
    setIsSendButtonDisabled(false);
  };

  return (
    <Chatbot displayMode={displayMode}>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <HeaderDropdown selectedChatbot={currentChatbot} chatbots={chatbots} onSelect={onSelect} />
        </ChatbotHeaderMain>
        {chatbots.length >= 2 && (
          <Button component="a" href={`/compare?assistants=${chatbots[0].name}%2C${chatbots[1].name}`}>
            Compare
          </Button>
        )}
      </ChatbotHeader>
      <ChatbotContent>
        <MessageBox announcement={announcement}>
          {error && (
            <ChatbotAlert
              variant="danger"
              // eslint-disable-next-line no-console
              onClose={() => {
                setError(undefined);
              }}
              title={error.title}
            >
              {error.body}
            </ChatbotAlert>
          )}
          <ChatbotWelcomePrompt title="Hello, Chatbot User" description="How may I help you today?" />
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
          {currentMessage.length > 0 && (
            <Message
              name={currentChatbot?.displayName}
              key="currentMessage"
              role="bot"
              content={currentMessage.join('')}
              {...(currentSources && { sources: { sources: currentSources } })}
            />
          )}
          <div ref={scrollToBottomRef}></div>
        </MessageBox>
      </ChatbotContent>
      <ChatbotFooter>
        <MessageBar
          onSendMessage={handleSend}
          hasMicrophoneButton
          hasAttachButton={false}
          isSendButtonDisabled={isSendButtonDisabled}
        />
        <ChatbotFootnote label="Verify all information from this tool. LLMs make mistakes." />
      </ChatbotFooter>
    </Chatbot>
  );
};

export { BaseChatbot };
