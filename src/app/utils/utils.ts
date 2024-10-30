import { CannedChatbot } from '@app/types/CannedChatbot';

export const ERROR_TITLE = {
  'Error: 404': '404: Network error',
  'Error: 500': 'Server error',
  'Error: Other': 'Error',
};

export const getId = () => {
  const date = Date.now() + Math.random();
  return date.toString();
};

export const getChatbots = () => {
  const url = process.env.REACT_APP_INFO_URL ?? '';
  return fetch(url)
    .then((res) => res.json())
    .then((data: CannedChatbot[]) => {
      return data;
    })
    .catch((e) => {
      throw new Response(e.message, { status: 404 });
    });
};

export async function chatbotLoader() {
  const chatbots = await getChatbots();
  return { chatbots };
}
