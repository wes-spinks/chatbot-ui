import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ExpandingTextInputs } from './ExpandingTextInputs';

const MOCK_VALUES = ['What is an apple?', 'What is a pear?'];
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

describe('Expanding text inputs', () => {
  it('should render correctly with no values', () => {
    render(<ExpandingTextInputs handleInputChange={jest.fn()} values={[]} fieldId="test" onDeleteValue={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: /Enter example question/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Add/i })).toBeTruthy();
    expect(screen.queryByRole('region', { name: /Example questions/i })).toBeFalsy();
  });
  it('should be able to input a value', async () => {
    const spy = jest.fn();
    render(<ExpandingTextInputs handleInputChange={spy} values={[]} fieldId="test" onDeleteValue={jest.fn()} />);
    const input = screen.getByRole('textbox', { name: /Enter example question/i }) as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'What is an apple?' } });
    expect(input.value).toBe('What is an apple?');
    await userEvent.click(screen.getByRole('button', { name: /Add/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should render correctly with some pre-filled values', () => {
    render(
      <ExpandingTextInputs
        handleInputChange={jest.fn()}
        values={MOCK_VALUES}
        fieldId="test"
        onDeleteValue={jest.fn()}
      />,
    );
    expect(screen.getByRole('textbox', { name: /Enter example question/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Add/i })).toBeTruthy();
    expect(screen.getByRole('region', { name: /Example questions/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Edit question What is an apple?/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Delete question What is an apple?/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Edit question What is a pear?/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Delete question What is a pear?/i })).toBeTruthy();
  });
  it('should be able to click edit button and see an input', async () => {
    render(
      <ExpandingTextInputs
        handleInputChange={jest.fn()}
        values={MOCK_VALUES}
        fieldId="test"
        onDeleteValue={jest.fn()}
      />,
    );
    const edit = screen.getByRole('button', { name: /Edit question What is an apple?/i });
    await userEvent.click(edit);
    expect(screen.getByRole('textbox', { name: /Edit example question What is an apple?/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Save question What is an apple?/i })).toBeTruthy();
  });
  it('should be able to delete a value', async () => {
    const spy = jest.fn();
    render(
      <ExpandingTextInputs handleInputChange={jest.fn()} values={MOCK_VALUES} fieldId="test" onDeleteValue={spy} />,
    );
    const btn = screen.getByRole('button', { name: /Delete question What is an apple?/i });
    await userEvent.click(btn);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /Edit example question What is an apple?/i })).toBeFalsy();
    expect(screen.queryByRole('button', { name: /Delete example question What is an apple?/i })).toBeFalsy();
  });
});
