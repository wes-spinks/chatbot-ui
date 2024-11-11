import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BaseChatbot } from './BaseChatbot';
import { RouterProvider, createMemoryRouter, useLoaderData as useLoaderDataOriginal } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// fixme our version of node should have this
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: jest.fn(),
}));

const useLoaderData = useLoaderDataOriginal as jest.Mock;

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

describe('Base chatbot', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    useLoaderData.mockReturnValue({
      chatbots: [{ displayName: 'Test', name: 'test' }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<RouterProvider router={router} />);
    screen.getByText('Red Hat AI Assistant');
    screen.getByText('Hello, Chatbot User');
    screen.getByText('How may I help you today?');
    screen.getByText('Verify all information from this tool. LLMs make mistakes.');
  });
  it('should show alert when there is an unspecified error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ data: 'Hello World' }),
    });
    render(<RouterProvider router={router} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'test{enter}');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    screen.getByRole('heading', { name: /Danger alert: Error/i });
    expect(
      screen.getAllByText(
        /Test has encountered an error and is unable to answer your question. Use a different assistant or try again later./i,
      ),
    ).toHaveLength(2);
    screen.getByRole('button', { name: /Close Danger alert: alert: Error/i });
  });
  it('can dismiss alert', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ data: 'Hello World' }),
    });
    render(<RouterProvider router={router} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'test{enter}');
    screen.getByRole('heading', { name: /Danger alert: Error/i });
    const button = screen.getByRole('button', { name: /Close Danger alert: alert: Error/i });
    await userEvent.click(button);
    expect(screen.queryByRole('heading', { name: /Danger alert: Error/i })).toBeFalsy();
  });
  it('should handle sending messages', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ body: 'Hello world', status: 200, statusText: 'OK' }),
    });
    render(<RouterProvider router={router} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    const date = new Date();
    await userEvent.type(input, 'test{enter}');
    screen.getByRole('region', { name: /Message from user/i });
    screen.getByText(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
    screen.getByText('test');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
