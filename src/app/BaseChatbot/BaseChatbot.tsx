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
  ChatbotHeaderTitle,
  ChatbotWelcomePrompt,
  Message,
  MessageBar,
  MessageBox,
  MessageProps,
} from '@patternfly/virtual-assistant';
import { useLoaderData } from 'react-router-dom';
import { CannedChatbot } from '../types/CannedChatbot';
interface Source {
  link: string;
}

const getChatbot = (id: string) => {
  const url = process.env.REACT_APP_INFO_URL ?? '';
  return fetch(url)
    .then((res) => res.json())
    .then((data: CannedChatbot[]) => {
      const filteredChatbots = data.filter((chatbot) => chatbot.name === id);
      if (filteredChatbots.length > 0) {
        return {
          title: filteredChatbots[0].displayName,
          assistantName: filteredChatbots[0].name,
          id: filteredChatbots[0].id,
          llmConnection: filteredChatbots[0].llmConnection,
          retrieverConnection: filteredChatbots[0].retrieverConnection,
        };
      } else {
        throw new Response('Not Found', { status: 404 });
      }
    })
    .catch((e) => {
      throw new Response(e.message, { status: 404 });
    });
};

export async function loader({ params }) {
  const chatbot = await getChatbot(params.chatbotId);
  return { chatbot };
}

const BaseChatbot: React.FunctionComponent = () => {
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState<string[]>([]);
  const [currentSources, setCurrentSources] = React.useState<Source[]>();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string>();
  const [stopStream, setStopStream] = React.useState(false);
  const { chatbot } = useLoaderData();

  React.useEffect(() => {
    document.title = `PatternFly React Seed | ${chatbot.title}`;
    // React Router reuses base components so we need to reset manually whenever the chatbot changes
    setMessages([]);
    setCurrentMessage([]);
    setCurrentSources(undefined);
    setIsSendButtonDisabled(false);
    setError(undefined);
    setStopStream(true);
  }, [chatbot]);

  // Auto-scrolls to the latest message
  React.useEffect(() => {
    // don't scroll the first load, but scroll if there's a current stream or a new source has popped up
    if (messages.length > 0 || currentMessage || currentSources) {
      scrollToBottomRef.current?.scrollIntoView();
    }
  }, [messages, currentMessage, currentSources]);

  const url = process.env.REACT_APP_ROUTER_URL ?? '';

  async function fetchData(userMessage: string) {
    let isSource = false;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        assistantName: chatbot.assistantName,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done;
    const sources: string[] = [];

    while (!done || !stopStream) {
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

  const getId = () => {
    const date = Date.now() + Math.random();
    return date.toString();
  };

  const handleSend = async (input) => {
    setIsSendButtonDisabled(true);
    const newMessages = structuredClone(messages);
    if (currentMessage.length > 0) {
      newMessages.push({
        id: getId(),
        name: 'Chatbot',
        role: 'bot',
        content: currentMessage.join(''),
        ...(currentSources && { sources: { sources: currentSources } }),
      });
      setCurrentMessage([]);
      setCurrentSources(undefined);
    }
    newMessages.push({ id: getId(), name: 'You', role: 'user', content: input });
    setMessages(newMessages);

    const sources = await fetchData(input).catch((e) => {
      setError(e.message);
    });
    if (sources) {
      setCurrentSources(sources);
    }
    setIsSendButtonDisabled(false);
  };

  const displayMode = ChatbotDisplayMode.embedded;

  return (
    <Chatbot displayMode={displayMode}>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <ChatbotHeaderTitle>{chatbot.title}</ChatbotHeaderTitle>
        </ChatbotHeaderMain>
      </ChatbotHeader>
      <ChatbotContent>
        {error && (
          <ChatbotAlert
            variant="danger"
            // eslint-disable-next-line no-console
            onClose={() => {
              setError(undefined);
            }}
            title={error}
          />
        )}
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
