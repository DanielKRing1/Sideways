import React, {FC} from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from 'ssRedux/index';
import {useAutoComplete} from 'ssHooks/useAutoComplete';

import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import {DISPLAY_SIZE} from '../../../../../../../../global';

type SearchSuggestionsProps = {
  searchInput: string;
  onSelectSuggestion: (inputName: string) => void;
};
const SearchSuggestions: FC<SearchSuggestionsProps> = props => {
  const {searchInput, onSelectSuggestion} = props;

  // REDUX
  const {allDbInputs} = useSelector(
    (state: RootState) => state.fetched.cachedInputsOutputs,
  );

  // AUTOCOMPLETE
  const {autoComplete} = useAutoComplete(
    searchInput.toLocaleLowerCase(),
    allDbInputs,
    (input: string) => input.toLocaleLowerCase(),
  );

  console.log('SEARCHSUGGESTIONS-------------------------------------');
  console.log(allDbInputs);
  console.log(autoComplete);

  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      data={autoComplete}
      // TODO: Prevent duplicate inputs?
      keyExtractor={input => input}
      renderItem={itemInfo => (
        <SuggestionItem
          itemInfo={itemInfo}
          onSelectSuggestion={onSelectSuggestion}
        />
      )}
    />
  );
};

export default SearchSuggestions;

const renderItem =
  (onSelectSuggestion: (inputName: string) => void): ListRenderItem<string> =>
  itemInfo =>
    (
      <SuggestionItem
        itemInfo={itemInfo}
        onSelectSuggestion={onSelectSuggestion}
      />
    );

type SuggestionItemProps = {
  itemInfo: ListRenderItemInfo<string>;
  onSelectSuggestion: (inputName: string) => void;
};
const SuggestionItem: FC<SuggestionItemProps> = props => {
  const {itemInfo, onSelectSuggestion} = props;
  const inputName: string = itemInfo.item;

  // HANDLERS
  const selectInputName = () => onSelectSuggestion(inputName);

  // Not editable or deletable, so do nothing
  const handleCommitInputName = () => {};
  const handleDeleteCategoryRow = () => {};

  return (
    <TouchableOpacity onPress={selectInputName}>
      <MyPadding
        baseSize={DISPLAY_SIZE.xs}
        rightSize={DISPLAY_SIZE.sm}
        leftSize={DISPLAY_SIZE.sm}>
        <DbCategoryRow
          editable={false}
          deletable={false}
          inputName={inputName}
          onCommitInputName={handleCommitInputName}
          onDeleteCategoryRow={() => handleDeleteCategoryRow()}
        />
      </MyPadding>
    </TouchableOpacity>
  );
};
