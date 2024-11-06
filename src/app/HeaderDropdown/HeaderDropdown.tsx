import { CannedChatbot } from '@app/types/CannedChatbot';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuSearch,
  MenuSearchInput,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
} from '@patternfly/react-core';
import * as React from 'react';

interface HeaderDropdownProps {
  chatbots: CannedChatbot[];
  selectedChatbot?: CannedChatbot;
  onSelect: (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: CannedChatbot) => void;
}
export const HeaderDropdown: React.FunctionComponent<HeaderDropdownProps> = ({
  chatbots,
  selectedChatbot,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [visibleAssistants, setVisibleAssistants] = React.useState<CannedChatbot[]>(chatbots);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
    setVisibleAssistants(chatbots);
  };

  const findMatchingElements = (chatbots: CannedChatbot[], targetValue: string) => {
    const matchingElements = chatbots.filter((chatbot) =>
      chatbot.displayName.toLowerCase().includes(targetValue.toLowerCase()),
    );
    return matchingElements;
  };

  const onTextInputChange = (value: string) => {
    if (value === '') {
      setVisibleAssistants(chatbots);
      return;
    }
    const newVisibleAssistants = findMatchingElements(chatbots, value);
    setVisibleAssistants(newVisibleAssistants);
  };

  const handleSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: CannedChatbot) => {
    // don't do a select if they choose "no results found"
    if (value) {
      setIsOpen(false);
      onSelect(_event, value);
    }
  };

  return (
    <Dropdown
      className="assistant-selector-menu"
      isOpen={isOpen}
      // @ts-expect-error PatternFly limits us to strings or numbers; we need an object
      onSelect={handleSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      ouiaId="BasicDropdown"
      shouldFocusToggleOnSelect
      onOpenChangeKeys={['Escape']}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => {
        return (
          <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
            Red Hat AI Assistant
          </MenuToggle>
        );
      }}
      popperProps={{ appendTo: 'inline' }}
    >
      <MenuSearch>
        <MenuSearchInput>
          <SearchInput
            aria-label="Search assistants..."
            onChange={(_event, value) => onTextInputChange(value)}
            placeholder="Search assistants..."
          />
        </MenuSearchInput>
      </MenuSearch>
      <DropdownList>
        {visibleAssistants && visibleAssistants?.length > 0 ? (
          visibleAssistants?.map((chatbot) => (
            <DropdownItem
              key={chatbot.displayName}
              value={chatbot}
              isSelected={selectedChatbot?.displayName === chatbot.displayName}
            >
              {chatbot.displayName}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem key="no-items">No results found</DropdownItem>
        )}
      </DropdownList>
    </Dropdown>
  );
};
