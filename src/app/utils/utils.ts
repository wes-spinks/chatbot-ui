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
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://chatbot-ui-cia-ocpai--runtime-int.apps.stc-ai-e1-dev.bpis.p1.openshiftapps.com'
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      switch (res.status) {
        case 302:
          console.log("Res?", res)
          return fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'https://chatbot-ui-cia-ocpai--runtime-int.apps.stc-ai-e1-dev.bpis.p1.openshiftapps.com'
            },
          })
          .then((resp) => {
            if (resp.ok) {
              console.log("Resp???", resp)
              return resp.json();
            }
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
    });
};

export async function chatbotLoader() {
  const chatbots = await getChatbots();
  return { chatbots };
}
