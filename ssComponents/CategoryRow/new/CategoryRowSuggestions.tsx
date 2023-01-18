import React, {FC, forwardRef, useCallback, useMemo, useRef} from 'react';
import {TextInput, Keyboard, View} from 'react-native';
import {useSelector} from 'react-redux';

import AutoCompleteDropdown, {
  AutoCompleteDropdownProps,
  DropdownRowProps,
} from 'ssComponents/Search/AutoCompleteDropdown';
import {TouchableOpacity} from 'react-native';
import {RootState} from 'ssRedux/index';
import DbCategoryRow from '../DbCategoryRow';

export type CategoryRowSuggestionsProps = {
  onSelectCategoryId: (categoryId: string) => void;
} & Omit<
  AutoCompleteDropdownProps<any>,
  'allSuggestions' | 'getSuggestionText' | 'DropdownRow'
>;
const CategoryRowSuggestions: FC<CategoryRowSuggestionsProps> = props => {
  // PROPS
  const {
    placeholder,
    value = '',
    onChangeText = () => {},
    onSelectCategoryId,
  } = props;

  // REDUX SELECTOR
  const {allDbInputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  // TEXT INPUT REF
  const textInputRef = useRef<TextInput>(null);

  // HANDLERS
  const handleSelectCategoyId = (categoryId: string) => {
    console.log('BEFFFFFFFFFFFFFFFFFFFFFFFFFFFOR');
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAFTER');
    if (textInputRef.current) {
      console.log('in');
      Keyboard.dismiss();
      textInputRef.current.blur();
    }
    onSelectCategoryId(categoryId);
  };

  const handleCommitInputName = (newInputName: string) => {
    onChangeText(newInputName);
  };
  const handleCommitCId = (newCId: string) => {};
  const handleDeleteCategoryRow = () => {};

  const getSuggestionText = (input: string) => input;

  // console.log('AUTOCOMPLETECATEGORY RERENDERED');

  return (
    <AutoCompleteDropdown
      {...props}
      allSuggestions={allDbInputs}
      getSuggestionText={getSuggestionText}
      onChangeText={handleCommitInputName}
      InputComponent={forwardRef(() => (
        <DbCategoryRow
          inputName={value}
          onCommitInputName={handleCommitInputName}
          onCommitCId={newCId => handleCommitCId(newCId)}
          onDeleteCategoryRow={handleDeleteCategoryRow}
        />
      ))}
      DropdownRow={DropdownRow(
        handleSelectCategoyId,
        onChangeText,
        handleDeleteCategoryRow,
      )}
    />
  );
};

// DROPDOWN ROW
const DropdownRow =
  (
    handleSelectEntityId: (entityId: string) => void,
    setInputValue: (newText: string) => void,
    handleDeleteCategoryRow: () => void,
  ): FC<DropdownRowProps<any>> =>
  props => {
    const entityId: string = props.suggestion;

    return (
      <TouchableOpacity onPress={() => handleSelectEntityId(entityId)}>
        <DbCategoryRow
          editable={false}
          inputName={entityId}
          onCommitInputName={setInputValue}
          onDeleteCategoryRow={handleDeleteCategoryRow}
        />
      </TouchableOpacity>
    );
  };

export default CategoryRowSuggestions;
