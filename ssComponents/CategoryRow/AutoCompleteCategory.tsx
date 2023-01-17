import React, {FC, useCallback, useMemo, useRef} from 'react';
import {TextInput, Keyboard, View} from 'react-native';
import {useSelector} from 'react-redux';

import AutoCompleteDropdown, {
  AutoCompleteDropdownProps,
  DropdownRowProps,
} from 'ssComponents/Search/AutoCompleteDropdown';
import {TouchableOpacity} from 'react-native';
import {RootState} from 'ssRedux/index';
import DbCategoryRow from './DbCategoryRow';

export type AutoCompleteDecorationProps = {
  onSelectEntityId: (entityId: string) => void;
} & Omit<
  AutoCompleteDropdownProps<any>,
  'allSuggestions' | 'getSuggestionText' | 'DropdownRow'
>;
const AutoCompleteDecoration: FC<AutoCompleteDecorationProps> = props => {
  // PROPS
  const {placeholder, inputValue, setInputValue, onSelectEntityId} = props;

  // REDUX SELECTOR
  const {allDbInputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  // TEXT INPUT REF
  const textInputRef = useRef<TextInput>(null);

  // HANDLERS
  const handleSelectEntityId = (entityId: string) => {
    console.log('BEFFFFFFFFFFFFFFFFFFFFFFFFFFFOR');
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAFTER');
    if (textInputRef.current) {
      console.log('in');
      Keyboard.dismiss();
      textInputRef.current.blur();
    }
    onSelectEntityId(entityId);
  };

  const handleCommitInputName = (newInputName: string) => {
    setInputValue(newInputName);
  };
  const handleDeleteCategoryRow = () => {};

  const getSuggestionText = (input: string) => input;

  // console.log('AUTOCOMPLETECATEGORY RERENDERED');

  return (
    <AutoCompleteDropdown
      ref={textInputRef}
      placeholder={placeholder}
      allSuggestions={allDbInputs}
      getSuggestionText={getSuggestionText}
      inputValue={inputValue}
      setInputValue={handleCommitInputName}
      DropdownRow={DropdownRow(
        handleSelectEntityId,
        setInputValue,
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

export default AutoCompleteDecoration;
