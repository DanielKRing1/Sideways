import React, {FC} from 'react';

import MyTextInput from 'ssComponents/ReactNative/MyTextInput';

type SearchInputProps = {
  searchInput: string;
  setSearchInput: (newSearchInput: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitSearchInput: () => void;
};
const SearchInput: FC<SearchInputProps> = props => {
  const {searchInput, setSearchInput, onFocus, onBlur, onSubmitSearchInput} =
    props;

  return (
    <MyTextInput
      placeholder={'Add an input...'}
      value={searchInput}
      onChangeText={setSearchInput}
      onSubmitEditing={onSubmitSearchInput}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};

export default SearchInput;
