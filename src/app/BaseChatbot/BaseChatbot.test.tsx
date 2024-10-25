import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BaseChatbot } from './BaseChatbot';
import { RouterProvider, createMemoryRouter, useLoaderData as useLoaderDataOriginal } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// fixes type problem
const useLoaderData = useLoaderDataOriginal as jest.Mock;

describe('Base chatbot', () => {
  it('should render correctly', () => {
    useLoaderData.mockReturnValue({
      chatbots: [{ displayName: 'Test assistant' }],
    });
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <BaseChatbot />,
        },
      ],
      {
        initialEntries: ['/'],
      },
    );
    render(<RouterProvider router={router} />);
    screen.getByText('Red Hat AI Assistant');
    screen.getByText('Hello, Chatbot User');
    screen.getByText('How may I help you today?');
    screen.getByText('Verify all information from this tool. LLMs make mistakes.');
  });
});
