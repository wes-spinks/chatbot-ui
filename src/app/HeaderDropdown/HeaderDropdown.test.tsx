import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeaderDropdown } from './HeaderDropdown';
import userEvent from '@testing-library/user-event';

const MOCK_CHATBOTS = [
  { name: 'test1', displayName: 'Test1' },
  { name: 'test2', displayName: 'Test2' },
];
describe('Header dropdown', () => {
  it('should render correctly', async () => {
    render(<HeaderDropdown chatbots={MOCK_CHATBOTS} onSelect={jest.fn} />);
    const toggle = screen.getByRole('button', { name: /Red Hat AI Assistant/i });
    await userEvent.click(toggle);
    expect(screen.getByRole('textbox', { name: /Search assistants.../i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Test1' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Test2' })).toBeTruthy();
  });
  it('should be able to select', async () => {
    const spy = jest.fn();
    render(<HeaderDropdown chatbots={MOCK_CHATBOTS} onSelect={spy} />);
    const toggle = screen.getByRole('button', { name: /Red Hat AI Assistant/i });
    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Test1' }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should be able to search', async () => {
    render(<HeaderDropdown chatbots={MOCK_CHATBOTS} onSelect={jest.fn} />);
    const toggle = screen.getByRole('button', { name: /Red Hat AI Assistant/i });
    await userEvent.click(toggle);
    const textbox = screen.getByRole('textbox', { name: /Search assistants.../i });
    expect(textbox).toBeTruthy();
    await userEvent.type(textbox, 'Test1');
    expect(screen.getByRole('menuitem', { name: 'Test1' })).toBeTruthy();
    expect(screen.queryByRole('menuitem', { name: 'Test2' })).toBeFalsy();
  });
  it('should be able to search and see no results', async () => {
    render(<HeaderDropdown chatbots={MOCK_CHATBOTS} onSelect={jest.fn} />);
    const toggle = screen.getByRole('button', { name: /Red Hat AI Assistant/i });
    await userEvent.click(toggle);
    const textbox = screen.getByRole('textbox', { name: /Search assistants.../i });
    expect(textbox).toBeTruthy();
    await userEvent.type(textbox, 'ffff');
    screen.getByRole('menuitem', { name: /No results found/i });
  });
  it('should be able to clear input field after search', async () => {
    render(<HeaderDropdown chatbots={MOCK_CHATBOTS} onSelect={jest.fn} />);
    const toggle = screen.getByRole('button', { name: /Red Hat AI Assistant/i });
    await userEvent.click(toggle);
    const textbox = screen.getByRole('textbox', { name: /Search assistants.../i });
    expect(textbox).toBeTruthy();
    await userEvent.type(textbox, 'f');
    screen.getByRole('menuitem', { name: /No results found/i });
    await userEvent.clear(textbox);
    expect(screen.getByRole('menuitem', { name: 'Test1' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Test2' })).toBeTruthy();
  });
});
