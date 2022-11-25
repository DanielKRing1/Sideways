import React, {FC} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from 'ssRedux/index';
import {useAutoComplete} from 'ssHooks/useAutoComplete';
import {FlatList} from 'react-native-gesture-handler';
import {
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';

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
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  // AUTOCOMPLETE
  const {autoComplete} = useAutoComplete(
    searchInput,
    allDbInputs,
    (input: string) => input,
  );

  return (
    <FlatList data={autoComplete} renderItem={renderItem(onSelectSuggestion)} />
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
        baseSize={DISPLAY_SIZE.sm}
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
