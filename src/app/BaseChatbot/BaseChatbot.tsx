import * as React from 'react';
import {
  Chatbot,
  ChatbotContent,
  ChatbotDisplayMode,
  ChatbotFooter,
  ChatbotFootnote,
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotWelcomePrompt,
  Message,
  MessageBar,
  MessageBox,
  MessageProps,
} from '@patternfly/virtual-assistant';

interface Source {
  link: string;
}

export interface BaseChatbotProps {
  title: string;
  url: string;
  assistantName: string;
}

const BaseChatbot: React.FunctionComponent<BaseChatbotProps> = ({ title, url, assistantName }) => {
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState<string[]>([]);
  const [currentSources, setCurrentSources] = React.useState<Source[]>();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);

  // Auto-scrolls to the latest message
  React.useEffect(() => {
    // don't scroll the first load, but scroll if there's a current stream or a new source has popped up
    if (messages.length > 0 || currentMessage || currentSources) {
      scrollToBottomRef.current?.scrollIntoView();
    }
  }, [messages, currentMessage, currentSources]);

  async function fetchData(userMessage: string) {
    let isSource = false;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        assistantName,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Network response was not ok');
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
      return formattedSources;
    }

    return undefined;
  }

  const handleSend = async (input) => {
    setIsSendButtonDisabled(true);
    const newMessages = structuredClone(messages);
    if (currentMessage.length > 0) {
      const id = Date.now() + Math.random();
      newMessages.push({
        id: id.toString(),
        name: 'Chatbot',
        role: 'bot',
        content: currentMessage.join(''),
        ...(currentSources && { sources: { sources: currentSources } }),
      });
      setCurrentMessage([]);
      setCurrentSources(undefined);
    }
    newMessages.push({ id: '', name: 'You', role: 'user', content: input });
    setMessages(newMessages);

    await fetchData(input);
    const sources = await fetchData(input);
    setCurrentSources(sources);
    setIsSendButtonDisabled(false);
  };

  const displayMode = ChatbotDisplayMode.embedded;

  return (
    <Chatbot displayMode={displayMode}>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <ChatbotHeaderTitle>{title}</ChatbotHeaderTitle>
        </ChatbotHeaderMain>
      </ChatbotHeader>
      <ChatbotContent>
        <MessageBox>
          <ChatbotWelcomePrompt title="Hello, Chatbot User" description="How may I help you today?" />
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
          {currentMessage.length > 0 && (
            <Message
              name="Chatbot"
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
