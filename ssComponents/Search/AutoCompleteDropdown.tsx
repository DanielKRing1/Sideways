import React, {FC, useCallback, forwardRef, memo} from 'react';
import {TextInput} from 'react-native';

import {FlexCol} from 'ssComponents/Flex';
import {
  SearchableDropdown,
  SearchableDropdownProps,
} from 'ssComponents/Search/SearchableDropdown';
import {useAutoComplete} from 'ssHooks/useAutoComplete';

export type DropdownRowProps<T> = {
  suggestion: T;
};
export type AutoCompleteDropdownProps<T> = {
  allSuggestions: T[];
  getSuggestionText?: (suggestion: any) => string;

  DropdownRow: FC<DropdownRowProps<T>>;
} & Omit<SearchableDropdownProps, 'DropdownComponent'>;
const AutoCompleteDropdown = forwardRef<
  TextInput,
  AutoCompleteDropdownProps<any>
>((props, ref) => {
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

  return (
    <SearchableDropdown
      ref={ref}
      clickOutsideId={`${clickOutsideId}/autocomplete-dropdown`}
      placeholder={placeholder}
      inputValue={inputValue}
      setInputValue={setInputValue}
      DropdownComponent={() => (
        <Dropdown
          autoComplete={autoComplete}
          DropdownRow={DropdownRow}
          inputValue={inputValue}
        />
      )}
    />
  );
});

const Dropdown: FC<any> = ({autoComplete, DropdownRow, inputValue}) => {
  // console.log('DROPDOWN RERENDERED');

  return (
    <FlexCol>
      {autoComplete.length > 0 ? (
        autoComplete.map((suggestion: any) => (
          <DropdownRow key={suggestion} suggestion={suggestion} />
        ))
      ) : (
        // No suggestions
        <DropdownRow suggestion={inputValue} />
      )}
    </FlexCol>
  );
};

export default memo(AutoCompleteDropdown);
