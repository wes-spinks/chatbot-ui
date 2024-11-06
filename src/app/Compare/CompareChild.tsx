import * as React from 'react';
import {
  Chatbot,
  ChatbotAlert,
  ChatbotContent,
  ChatbotDisplayMode,
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotWelcomePrompt,
  Message,
  MessageBox,
  MessageProps,
} from '@patternfly/virtual-assistant';
import { CannedChatbot } from '../types/CannedChatbot';
import { HeaderDropdown } from '@app/HeaderDropdown/HeaderDropdown';
import { ERROR_TITLE, getId } from '@app/utils/utils';
import { useChildStatus } from './ChildStatusProvider';
interface Source {
  link: string;
}

interface CompareChildProps {
  chatbot: CannedChatbot;
  allChatbots: CannedChatbot[];
  setIsSendButtonDisabled: (bool: boolean) => void;
  controller?: AbortController;
  setController: (controller: AbortController | undefined) => void;
  input?: string;
  hasNewInput: boolean;
  setChatbot: (value: CannedChatbot) => void;
  setSearchParams: (_event, value: string, order: string) => void;
  order: string;
}

const CompareChild: React.FunctionComponent<CompareChildProps> = ({
  chatbot,
  allChatbots,
  setIsSendButtonDisabled,
  controller,
  setController,
  input,
  hasNewInput,
  setChatbot,
  setSearchParams,
  order,
}: CompareChildProps) => {
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [currentChatbot, setCurrentChatbot] = React.useState<CannedChatbot>(chatbot);
  const [currentDate, setCurrentDate] = React.useState<Date>();
  const [currentMessage, setCurrentMessage] = React.useState<string[]>([]);
  const [currentSources, setCurrentSources] = React.useState<Source[]>();
  const [error, setError] = React.useState<{ title: string; body: string }>();
  const [announcement, setAnnouncement] = React.useState<string>();
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);
  const { updateStatus } = useChildStatus();
  const url = process.env.REACT_APP_ROUTER_URL ?? '';
  const displayMode = ChatbotDisplayMode.embedded;

  const handleSend = async (input: string) => {
    setIsSendButtonDisabled(true);
    const date = new Date();
    const newMessages = structuredClone(messages);
    // when a new message comes in, we add the last streaming message to the array and reset it
    if (currentMessage.length > 0) {
      newMessages.push({
        id: getId(),
        name: currentChatbot?.displayName,
        role: 'bot',
        content: currentMessage.join(''),
        ...(currentSources && { sources: { sources: currentSources } }),
        timestamp: currentDate
          ? `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
          : `${date?.toLocaleDateString()} ${date?.toLocaleTimeString()}`,
      });
      setCurrentMessage([]);
      setCurrentSources(undefined);
    }
    newMessages.push({
      id: getId(),
      name: 'You',
      role: 'user',
      content: input,
      timestamp: `${date?.toLocaleDateString()} ${date?.toLocaleTimeString()}`,
    });
    setMessages(newMessages);
    setCurrentDate(date);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from You: ${input}. Message from Chatbot is loading.`);

    // sources come in last; we display them once they come in
    const sources = await fetchData(input);
    if (sources) {
      setCurrentSources(sources);
    }
    // make announcement to assistive devices that new message has been added
    currentMessage.length > 0 && setAnnouncement(`Message from Chatbot: ${currentMessage.join('')}`);
    setIsSendButtonDisabled(false);
    // this is used to control state of stop button
    updateStatus(order === 'first' ? 'child1' : 'child2', { isMessageStreaming: false });
  };

  React.useEffect(() => {
    if (input) {
      handleSend(input);
    }
  }, [hasNewInput]);

  // Auto-scrolls to the latest message
  React.useEffect(() => {
    // don't scroll the first load, but scroll if there's a current stream or a new source has popped up
    if (messages.length > 0 || currentMessage || currentSources) {
      scrollToBottomRef.current?.scrollIntoView();
    }
  }, [messages, currentMessage, currentSources]);

  const ERROR_BODY = {
    'Error: 404': `${currentChatbot?.displayName} is currently unavailable. Use a different assistant or try again later.`,
    'Error: 500': `${currentChatbot?.displayName} has encountered an error and is unable to answer your question. Use a different assistant or try again later.`,
    'Error: Other': `${currentChatbot?.displayName} has encountered an error and is unable to answer your question. Use a different assistant or try again later.`,
  };

  const handleError = (e) => {
    console.error(e);
    const title = ERROR_TITLE;
    const body = ERROR_BODY;
    let newError;
    if (title && body) {
      newError = { title: ERROR_TITLE[e], body: ERROR_BODY[e] };
    } else {
      newError = { title: 'Error', body: e.message };
    }
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
      updateStatus(order === 'first' ? 'child1' : 'child2', { isMessageStreaming: true });

      // start reading the streaming message
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

        // if we see sources at the end of the stream
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
          updateStatus(order === 'first' ? 'child1' : 'child2', { isMessageStreaming: false });
        }
      }
      return undefined;
    } finally {
      setController(undefined);
    }
  }

  // for chatbot selector dropdown
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
    setChatbot(value);
    setSearchParams(_event, value.name, order);
    updateStatus(order === 'first' ? 'child1' : 'child2', {
      isMessageStreaming: false,
    });
  };

  return (
    <Chatbot displayMode={displayMode}>
      <ChatbotHeader className="compare-header">
        <ChatbotHeaderMain>
          <HeaderDropdown selectedChatbot={chatbot} chatbots={allChatbots} onSelect={onSelect} />
        </ChatbotHeaderMain>
      </ChatbotHeader>
      <ChatbotContent>
        <MessageBox ariaLabel={`Scrollable message log for ${chatbot.displayName}`} announcement={announcement}>
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
              timestamp={`${currentDate?.toLocaleDateString()} ${currentDate?.toLocaleTimeString()}`}
            />
          )}
          <div ref={scrollToBottomRef}></div>
        </MessageBox>
      </ChatbotContent>
    </Chatbot>
  );
};

export { CompareChild as CompareChatbot };
