import { FlyoutError } from '@app/FlyoutError/FlyoutError';
import { FlyoutFooter } from '@app/FlyoutFooter/FlyoutFooter';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutStartScreen } from '@app/FlyoutStartScreen/FlyoutStartScreen';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { ErrorObject } from '@app/types/ErrorObject';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  FileUpload,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import * as React from 'react';

interface FlyoutFormProps {
  header: string;
  hideFlyout: () => void;
}

export const FlyoutForm: React.FunctionComponent<FlyoutFormProps> = ({ header, hideFlyout }: FlyoutFormProps) => {
  const [title, setTitle] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [model, setModel] = React.useState('');
  const [instructions, setInstructions] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [error, setError] = React.useState<ErrorObject>();
  const { nextStep, prevStep } = useFlyoutWizard();

  const llmConnectionId = '66edae13e03073de9ef24204'; // how do i get these
  const retrieverConnectionId = '66f3fbffd7e04770c03ee123';

  const handleFileInputChange = (_, file: File) => {
    setFilename(file.name);
  };

  const handleClear = () => {
    setFilename('');
    setIcon('');
  };
  const [isOpen, setIsOpen] = React.useState(false);

  const handleTitleChange = (_event, title: string) => {
    setTitle(title);
  };

  const handleDisplayNameChange = (_event, name: string) => {
    setDisplayName(name);
  };

  const handleModelChange = (_event, value: string | number | undefined) => {
    if (value && typeof value === 'string') {
      setModel(value);
      return;
    }
    setModel('');
  };

  const handleInstructionsChange = (_event, instructions: string) => {
    setInstructions(instructions);
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const createAssistant = async () => {
    const url =
      'https://quarkus-llm-router-composer-ai-apps.apps.cluster-sjbgj.sjbgj.sandbox2220.opentlc.com/admin/assistant';

    const payload = {
      name: title,
      displayName: displayName ?? title,
      description: instructions,
      llmConnectionId: llmConnectionId,
      retrieverConnectionId: retrieverConnectionId,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
      console.log('Assistant created successfully:', data);
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        setError({ title: 'Error creating assistant', body: error.message });
      } else {
        setError({ title: 'Error creating assistant', body: error as string });
      }
      console.error('Error creating assistant:', error);
    }
  };

  const onClick = async () => {
    const data = await createAssistant();
    console.log(data);
    if (data) {
      nextStep();
    }
  };

  return (
    <>
      <FlyoutHeader title={header} hideFlyout={hideFlyout} />
      <div className="flyout-form-container">
        {error ? (
          <FlyoutError title={error.title} subtitle={error.body} onClick={onClick} />
        ) : (
          <Form className="flyout-form">
            <FormGroup label="Name" isRequired fieldId="flyout-form-title">
              <TextInput
                type="text"
                id="flyout-form-title"
                name="flyout-form-title"
                value={title}
                onChange={handleTitleChange}
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>Describe what a user can do with your assistant</HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
            <FormGroup label="Display name" fieldId="flyout-form-display-name">
              <TextInput
                type="text"
                id="flyout-form-display-name"
                name="flyout-form-dusplay-name"
                value={displayName}
                onChange={handleDisplayNameChange}
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>Different name for the assistant, displayed in the UI</HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
            {/*<FormGroup label="Model" fieldId="flyout-form-model">
            <Dropdown
              id="flyout-form-model"
              className="assistant-selector-menu"
              isOpen={isOpen}
              onSelect={handleModelChange}
              onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
              ouiaId="BasicDropdown"
              shouldFocusToggleOnSelect
              onOpenChangeKeys={['Escape']}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
                  Choose a model
                </MenuToggle>
              )}
              popperProps={{ appendTo: 'inline' }}
            >
              <DropdownList>
                <DropdownItem key="one" value="one" isSelected={model === 'one'}>
                  one
                </DropdownItem>
                <DropdownItem key="two" value="two" isSelected={model === 'two'}>
                  two
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </FormGroup>*/}
            {/*<FormGroup label="Icon" fieldId="flyout-form-icon">
            <FileUpload
              className="flyout-form-fileupload"
              id="flyout-form-icon"
              value={icon}
              filename={filename}
              filenamePlaceholder="Drag and drop a file or upload one"
              onFileInputChange={handleFileInputChange}
              onClearClick={handleClear}
              browseButtonText="Upload"
            />
          </FormGroup>*/}
            <FormGroup fieldId="flyout-form-instructions" label="Custom instructions">
              <TextArea
                id="flyout-form-instructions"
                value={instructions}
                onChange={handleInstructionsChange}
                aria-label="Text area for custom instructions"
                resizeOrientation="vertical"
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>Describe what a user can do with your assistant</HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
          </Form>
        )}
      </div>
      {!error && (
        <FlyoutFooter
          isPrimaryButtonDisabled={title === ''}
          primaryButton="Create assistant"
          onPrimaryButtonClick={onClick}
          secondaryButton="Cancel"
          onSecondaryButtonClick={prevStep}
        />
      )}
    </>
  );
};
