import { CannedChatbot } from '@app/types/CannedChatbot';
import { json } from 'react-router-dom';

/** Used in chatbots */
export const ERROR_TITLE = {
  'Error: 404': '404: Network error',
  'Error: 500': 'Server error',
  'Error: Other': 'Error',
};

export const getId = () => {
  const date = Date.now() + Math.random();
  return date.toString();
};

export const getChatbots = async () => {
  const url = process.env.REACT_APP_INFO_URL ?? '';
  if (url === '') {
    throw json({ status: 'Misconfigured' });
  }
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Accept-Language'
    }})
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      switch (res.status) {
        case 401:
          throw json({ status: 401 });
        case 403:
          throw json({ status: 403 });
        case 503:
          throw json({ status: 503 });
        default:
          throw json({ status: 500 });
      }
    })
    .then((data: CannedChatbot[]) => {
      return data;
    }).then(console.log);
};

export async function chatbotLoader() {
  const chatbots = await getChatbots();
  return { chatbots };
}
