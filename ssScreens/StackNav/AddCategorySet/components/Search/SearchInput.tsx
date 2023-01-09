import React, {forwardRef} from 'react';
import {TextInput} from 'react-native';

import MyTextInput from 'ssComponents/ReactNative/MyTextInput';

type SearchInputProps = {
  searchInput: string;
  setSearchInput: (newSearchInput: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitSearchInput: () => void;
};
const SearchInput = forwardRef<TextInput, SearchInputProps>((props, ref) => {
  const {searchInput, setSearchInput, onFocus, onBlur, onSubmitSearchInput} =
    props;

  return (
    <MyTextInput
      ref={ref}
      placeholder={'Add a category...'}
      value={searchInput}
      onChangeText={setSearchInput}
      onSubmitEditing={onSubmitSearchInput}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
});

export default SearchInput;
