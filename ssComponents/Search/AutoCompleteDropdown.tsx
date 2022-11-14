import React, {FC, useEffect, useState} from 'react';

import {FlexCol} from 'ssComponents/Flex';
import {
  SearchableDropdown,
  SearchableDropdownProps,
} from 'ssComponents/Search/SearchableDropdown';
import {useAutoComplete} from 'ssHooks/useAutoComplete';
import {useTrie} from 'ssHooks/useTrie';

export type DropdownRowProps<T> = {
  suggestion: T;
};
export type AutoCompleteDropdownProps<T> = {
  allSuggestions: T[];
  getSuggestionText?: (suggestion: any) => string;

  DropdownRow: FC<DropdownRowProps<T>>;
} & Omit<SearchableDropdownProps, 'DropdownComponent'>;
const AutoCompleteDropdown: FC<AutoCompleteDropdownProps<any>> = props => {
  const {
    clickOutsideId,
    placeholder,
    inputValue,
    setInputValue,
    allSuggestions,
    getSuggestionText = (suggestion: string) => suggestion,
    DropdownRow,
  } = props;

  const {autoComplete} = useAutoComplete(
    inputValue,
    allSuggestions,
    getSuggestionText,
  );

  const Dropdown: FC<{}> = () => (
    <FlexCol>
      {autoComplete.length > 0 ? (
        autoComplete.map((suggestion: any) => (
          <DropdownRow suggestion={suggestion} />
        ))
      ) : (
        // No suggestions
        <DropdownRow suggestion={inputValue} />
      )}
    </FlexCol>
  );

  return (
    <SearchableDropdown
      clickOutsideId={`${clickOutsideId}/autocomplete-dropdown`}
      placeholder={placeholder}
      inputValue={inputValue}
      setInputValue={setInputValue}
      DropdownComponent={Dropdown}
    />
  );
};

export default AutoCompleteDropdown;
