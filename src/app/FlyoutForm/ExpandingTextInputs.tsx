import * as React from 'react';
import { Button, TextInput } from '@patternfly/react-core';
import { CheckIcon, CloseIcon, PencilAltIcon } from '@patternfly/react-icons';

interface ExpandingTextInputsProps {
  handleInputChange: (newQuestion: string, index?: number) => void;
  values: string[];
  /** Unique id for expanding text inputs */
  fieldId: string;
  onDeleteValue: (index: number) => void;
  isDisabled?: boolean;
}

export const ExpandingTextInputs: React.FunctionComponent<ExpandingTextInputsProps> = ({
  values,
  handleInputChange,
  onDeleteValue,
  fieldId,
  isDisabled = false,
}: ExpandingTextInputsProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState<number>();
  const [editingInputValue, setEditingInputValue] = React.useState('');
  const handleClick = () => {
    handleInputChange(inputValue);
    setInputValue('');
    document.getElementById(`${fieldId}-text-input`)?.focus();
  };
  const onEdit = (index: number) => {
    setEditingInputValue(values[index] ?? '');
    setEditingIndex(index);
    document
      .getElementById(`${fieldId}-edit-text-input-${index}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    document.getElementById(`${fieldId}-edit-text-input-${index}`)?.focus();
  };

  return (
    <div className="expanding-text-inputs">
      <div className="expanding-text-inputs__row">
        <TextInput
          value={inputValue}
          type="text"
          id={`${fieldId}-text-input`}
          name={`${fieldId}-text-input`}
          onChange={(e, value) => {
            setInputValue(value);
          }}
          aria-label="Enter example question"
        />
        <Button isDisabled={inputValue === '' || isDisabled} variant="secondary" onClick={handleClick}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <section className="expanding-text-input__section" aria-label="Example questions" tabIndex={-1}>
          {values.map((value, index) => {
            return (
              <div key={index} className="expanding-text-inputs__row expanding-text-input__row-with-background">
                <div className={`expanding-text-inputs__row-value ${editingIndex === index ? '' : 'hidden'}`}>
                  <TextInput
                    value={editingInputValue}
                    type="text"
                    id={`${fieldId}-edit-text-input-${index}`}
                    name={`${fieldId}-edit-text-input-${index}`}
                    onChange={(e, value) => setEditingInputValue(value)}
                    tabIndex={editingIndex === index ? 0 : -1}
                    aria-label={`Edit example question ${value}`}
                  />
                </div>
                <div className={`expanding-text-inputs__row-value ${editingIndex === index ? 'hidden' : ''}`}>
                  {value}
                </div>
                <Button
                  tabIndex={editingIndex === index ? 0 : -1}
                  onClick={() => {
                    handleInputChange(editingInputValue, index);
                    setEditingIndex(undefined);
                    setEditingInputValue('');
                    document.getElementById(`${fieldId}-text-input`)?.focus();
                  }}
                  variant="plain"
                  className={editingIndex === index ? '' : 'hidden'}
                  aria-label={`${editingIndex === index ? `Save question ${editingInputValue}` : `Save question ${value}`}`}
                >
                  <CheckIcon />
                </Button>
                <Button
                  tabIndex={editingIndex === index ? -1 : 0}
                  variant="plain"
                  onClick={() => onEdit(index)}
                  className={editingIndex === index ? 'hidden' : ''}
                  aria-label={`Edit question ${value}`}
                >
                  <PencilAltIcon />
                </Button>
                <Button
                  variant="plain"
                  onClick={() => {
                    onDeleteValue(index);
                    document.getElementById(`${fieldId}-text-input`)?.focus();
                    if (editingIndex === index) {
                      setEditingIndex(undefined);
                    }
                  }}
                  aria-label={`Delete question ${value}`}
                >
                  <CloseIcon />
                </Button>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};
