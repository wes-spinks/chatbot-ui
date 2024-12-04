import { FlyoutError } from '@app/FlyoutError/FlyoutError';
import { FlyoutFooter } from '@app/FlyoutFooter/FlyoutFooter';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutLoading } from '@app/FlyoutLoading/FlyoutLoading';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { ErrorObject } from '@app/types/ErrorObject';
import { ERROR_TITLE } from '@app/utils/utils';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
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

interface RetrieverAPIResponse {
  id: string;
  description: string;
  name: string;
  connectionEntity: { contentRetrieverType: string; metadataFields: string[] };
}

interface LLMAPIResponse {
  id: string;
  description: string;
  name: string;
}
interface FlyoutFormProps {
  header: string;
  hideFlyout: () => void;
}

export const FlyoutForm: React.FunctionComponent<FlyoutFormProps> = ({ header, hideFlyout }: FlyoutFormProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadedFormFields, setLoadedFormFields] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState<ErrorObject>();
  const [retrieverConnections, setRetrieverConnections] = React.useState<RetrieverAPIResponse[]>([]);
  const [selectedRetriever, setSelectedRetriever] = React.useState<RetrieverAPIResponse>();
  const [llms, setLLMs] = React.useState<LLMAPIResponse[]>([]);
  const [isRetrieverDropdownOpen, setIsRetrieverDropdownOpen] = React.useState(false);
  const [isLLMDropdownOpen, setIsLLMDropdownOpen] = React.useState(false);
  const [selectedLLM, setSelectedLLM] = React.useState<LLMAPIResponse>();
  const { nextStep, prevStep } = useFlyoutWizard();

  const ERROR_BODY = {
    'Error: 404': `Service is currently unavailable. Click retry or try again later.`,
    'Error: 500': `Service has encountered an error. Click retry or try again later.`,
    'Error: Other': `Service has encountered an error. Click retry or try again later.`,
  };

  const handleError = (e) => {
    console.error(e);
    const title = ERROR_TITLE[e];
    const body = ERROR_BODY[e];
    let newError;
    if (title && body) {
      newError = { title: ERROR_TITLE[e], body: ERROR_BODY[e] };
    } else {
      if ('message' in e) {
        newError = { title: 'Error', body: e.message };
      } else {
        newError = { title: 'Error', body: e };
      }
    }
    setError(newError);
  };

  const getRetrieverConnections = async () => {
    const url = process.env.REACT_APP_RETRIEVER_URL ?? '';

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const data = await response.json();
      setRetrieverConnections(data);
      setIsLoading(false);
      setLoadedFormFields(true);
    } catch (error) {
      console.error('Error loading data', error);
      handleError(error);
      setIsLoading(false);
    }
  };

  const getLLMs = async () => {
    const url = process.env.REACT_APP_LLM_URL ?? '';

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const data = await response.json();
      setLLMs(data);
      setIsLoading(false);
      setLoadedFormFields(true);
    } catch (error) {
      console.error('Error loading data', error);
      handleError(error);
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    await getRetrieverConnections();
    await getLLMs();
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleTitleChange = (_event, title: string) => {
    setTitle(title);
  };

  const handleDisplayNameChange = (_event, name: string) => {
    setDisplayName(name);
  };

  const handleRetrieverChange = (_event, value) => {
    setSelectedRetriever(value);
    setIsRetrieverDropdownOpen(false);
  };

  const handleLLMChange = (_event, value) => {
    setSelectedLLM(value);
    setIsLLMDropdownOpen(false);
  };

  const handleDescriptionChange = (_event, newDescription: string) => {
    setDescription(newDescription);
  };

  const onRetrieverToggleClick = () => {
    setIsRetrieverDropdownOpen(!isRetrieverDropdownOpen);
  };

  const onLLMToggleClick = () => {
    setIsLLMDropdownOpen(!isLLMDropdownOpen);
  };

  const createAssistant = async () => {
    const url = process.env.REACT_APP_INFO_URL ?? '';

    const payload = {
      name: title,
      displayName: displayName ?? title,
      description: description,
      llmConnectionId: selectedLLM?.id,
      retrieverConnectionId: selectedRetriever?.id,
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
        throw new Error(`${response.status}`);
      }

      const data = await response.json();
      return data;
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
    setError(undefined);
    if (loadedFormFields && title !== '' && selectedLLM && selectedRetriever) {
      const data = await createAssistant();
      if (data) {
        nextStep();
      }
    } else {
      loadData();
    }
  };

  return isLoading ? (
    <FlyoutLoading />
  ) : (
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
                  <HelperTextItem>Different name for the assistant, if desired, to display in the UI</HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
            <FormGroup isRequired label="Retriever ID" fieldId="flyout-form-model">
              <Dropdown
                isOpen={isRetrieverDropdownOpen}
                onSelect={handleRetrieverChange}
                onOpenChange={(isOpen: boolean) => setIsRetrieverDropdownOpen(isOpen)}
                ouiaId="RetrieverIdDropdown"
                shouldFocusToggleOnSelect
                onOpenChangeKeys={['Escape']}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={onRetrieverToggleClick} isExpanded={isRetrieverDropdownOpen}>
                    {selectedRetriever ? selectedRetriever.description : 'Choose a retriever ID'}
                  </MenuToggle>
                )}
                popperProps={{ appendTo: 'inline' }}
              >
                <DropdownList>
                  {retrieverConnections.map((connection) => (
                    <DropdownItem
                      key={connection.id}
                      value={connection}
                      isSelected={connection.id === selectedRetriever?.id}
                    >
                      {connection.description}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </FormGroup>
            <FormGroup isRequired label="LLM ID" fieldId="flyout-form-model">
              <Dropdown
                isOpen={isLLMDropdownOpen}
                onSelect={handleLLMChange}
                onOpenChange={(isOpen: boolean) => setIsLLMDropdownOpen(isOpen)}
                ouiaId="LLMIDDropdown"
                shouldFocusToggleOnSelect
                onOpenChangeKeys={['Escape']}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={onLLMToggleClick} isExpanded={isLLMDropdownOpen}>
                    {selectedLLM ? selectedLLM.description : 'Choose an LLM ID'}
                  </MenuToggle>
                )}
                popperProps={{ appendTo: 'inline' }}
              >
                <DropdownList>
                  {llms.map((connection) => (
                    <DropdownItem key={connection.id} value={connection} isSelected={connection.id === selectedLLM?.id}>
                      {connection.description}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </FormGroup>
            <FormGroup fieldId="flyout-form-instructions" label="Description">
              <TextArea
                id="flyout-form-instructions"
                value={description}
                onChange={handleDescriptionChange}
                aria-label="Text area for assistant description"
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
          isPrimaryButtonDisabled={title === '' || !selectedLLM || !selectedRetriever}
          primaryButton="Create assistant"
          onPrimaryButtonClick={onClick}
          secondaryButton="Cancel"
          onSecondaryButtonClick={prevStep}
        />
      )}
    </>
  );
};
