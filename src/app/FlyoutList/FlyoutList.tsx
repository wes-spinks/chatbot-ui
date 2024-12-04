import { useAppData } from '@app/AppData/AppDataContext';
import { FlyoutError } from '@app/FlyoutError/FlyoutError';
import { FlyoutFooter } from '@app/FlyoutFooter/FlyoutFooter';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutLoading } from '@app/FlyoutLoading/FlyoutLoading';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { CannedChatbot } from '@app/types/CannedChatbot';
import { ErrorObject } from '@app/types/ErrorObject';
import { Label, Menu, MenuContent, MenuItem, MenuList, SearchInput } from '@patternfly/react-core';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const [error, setError] = React.useState<ErrorObject>();
  const [items, setItems] = React.useState<CannedChatbot[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<CannedChatbot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { nextStep } = useFlyoutWizard();
  const location = useLocation();
  const navigate = useNavigate();
  const { flyoutMenuSelectedChatbot, updateFlyoutMenuSelectedChatbot, chatbots } = useAppData();

  const header = (
    <div className="title-with-label">
      {title} <Label variant="outline">{items.length}</Label>
    </div>
  );

  const getAssistants = async () => {
    setItems(chatbots);
    setFilteredItems(chatbots);
    setIsLoading(false);
  };

  const loadAssistants = async () => {
    await getAssistants();
  };

  React.useEffect(() => {
    loadAssistants();
  }, []);

  const buildMenu = () => {
    return (
      <MenuList>
        {filteredItems.map((item) => (
          <MenuItem
            className="pf-chatbot__menu-item"
            itemId={item.name}
            key={item.name}
            isSelected={item.name === flyoutMenuSelectedChatbot?.name}
            description={item.description}
          >
            {item.displayName ?? item.name}
          </MenuItem>
        ))}
      </MenuList>
    );
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value) => {
    if (filteredItems.length > 0) {
      const newChatbot = items.filter((item) => item.name === value)[0];
      updateFlyoutMenuSelectedChatbot(newChatbot);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const findMatchingItems = (targetValue: string) => {
    const matchingElements = items.filter((item) => {
      const name = item.displayName ?? item.name;
      return name.toLowerCase().includes(targetValue.toLowerCase());
    });
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

  const onClick = () => {
    setError(undefined);
    loadAssistants();
  };

  return error ? (
    <FlyoutError title={error.title} subtitle={error.body} onClick={onClick} />
  ) : (
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
          <Menu className="flyout-list-menu" isPlain onSelect={onSelect}>
            <MenuContent>
              {filteredItems.length > 0 ? (
                buildMenu()
              ) : (
                <MenuList>
                  <MenuItem key="no-items">No results found</MenuItem>
                </MenuList>
              )}
            </MenuContent>
          </Menu>
        </div>
      )}
      <FlyoutFooter primaryButton={buttonText} onPrimaryButtonClick={onFooterButtonClick ?? nextStep} />
    </>
  );
};
