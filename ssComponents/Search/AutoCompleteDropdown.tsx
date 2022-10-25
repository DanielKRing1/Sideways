import React, {FC, useEffect, useState} from 'react';

import {FlexCol} from 'ssComponents/Flex';
import {
  SearchableDropdown,
  SearchableDropdownProps,
} from 'ssComponents/Search/SearchableDropdown';
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
    allSuggestions: _allSuggestions,
    getSuggestionText = (suggestion: string) => suggestion,
    DropdownRow,
  } = props;

  const [allSuggestions, setAllSuggestions] = useState<string[]>([]);

  const {
    setValues: setTrieValues,
    search,
    autoComplete,
  } = useTrie<any>(getSuggestionText);

  // TRIE EFFECTS
  // 1. Set allSuggestions
  useEffect(() => {
    setAllSuggestions(_allSuggestions);
  }, [_allSuggestions]);

  // 2. Set up Trie
  useEffect(() => {
    setTrieValues(inputValue, allSuggestions);
  }, [allSuggestions]);

  // 3. Get autoComplete list, based on searched inputValue
  useEffect(() => {
    search(inputValue);
  }, [inputValue]);

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
