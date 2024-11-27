import { FlyoutFooter } from '@app/FlyoutFooter/FlyoutFooter';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutLoading } from '@app/FlyoutLoading/FlyoutLoading';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { CannedChatbot } from '@app/types/CannedChatbot';
import { Label, Menu, MenuContent, MenuItem, MenuList, SearchInput } from '@patternfly/react-core';
import * as React from 'react';

interface FlyoutListProps {
  typeWordPlural: string;
  buttonText: string;
  hideFlyout: () => void;
  onFooterButtonClick?: () => void;
  title: string;
}
export const FlyoutList: React.FunctionComponent<FlyoutListProps> = ({
  typeWordPlural,
  buttonText,
  hideFlyout,
  onFooterButtonClick,
  title,
}: FlyoutListProps) => {
  const [items, setItems] = React.useState<CannedChatbot[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<CannedChatbot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { nextStep, prevStep } = useFlyoutWizard();
  const header = (
    <div className="title-with-label">
      {title} <Label variant="outline">{items.length}</Label>
    </div>
  );

  const getAssistants = async () => {
    const url = process.env.REACT_APP_INFO_URL ?? '';

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Assistants', data);
      setItems(data);
      setFilteredItems(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading assistants', error);
      setIsLoading(false);
    }
  };

  const loadAssistants = async () => {
    const data = await getAssistants();
    console.log(data);
  };

  React.useEffect(() => {
    loadAssistants();
  }, []);

  const buildMenu = () => {
    return (
      <MenuList>
        {filteredItems.map((item) => (
          <MenuItem className="pf-chatbot__menu-item" itemId={item.name} key={item.name}>
            {item.displayName}
          </MenuItem>
        ))}
      </MenuList>
    );
  };

  const onSelectActiveItem = () => {};
  const activeItemId = '1';

  const findMatchingItems = (targetValue: string) => {
    const matchingElements = items.filter((item) => item.displayName.toLowerCase().includes(targetValue.toLowerCase()));

    console.log(matchingElements);
    return matchingElements;
  };

  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setFilteredItems(items);
      return;
    }
    const newItems = findMatchingItems(value);
    setFilteredItems(newItems);
  };

  return (
    <>
      <FlyoutHeader title={header} hideFlyout={hideFlyout} />
      {isLoading ? (
        <FlyoutLoading />
      ) : (
        <div className="flyout-list">
          <SearchInput
            aria-label={`Search ${typeWordPlural}`}
            onChange={(_event, value) => handleTextInputChange(value)}
            placeholder={`Search ${typeWordPlural}...`}
          />
          <Menu className="flyout-list-menu" isPlain onSelect={onSelectActiveItem} activeItemId={activeItemId}>
            <MenuContent>
              {filteredItems.length > 0 ? (
                buildMenu()
              ) : (
                <MenuList>
                  <MenuItem key="no-items">No results found</MenuItem>
                </MenuList>
              )}
            </MenuContent>{' '}
          </Menu>
        </div>
      )}
      <FlyoutFooter primaryButton={buttonText} onPrimaryButtonClick={onFooterButtonClick ?? nextStep} />
    </>
  );
};
