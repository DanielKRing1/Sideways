import React, {FC, useRef} from 'react';
import {TextInput, Keyboard} from 'react-native';
import {useSelector} from 'react-redux';

import AutoCompleteDropdown, {
  AutoCompleteDropdownProps,
  DropdownRowProps,
} from 'ssComponents/Search/AutoCompleteDropdown';
import {TouchableOpacity} from 'react-native';
import {RootState} from 'ssRedux/index';
import DbCategoryRow from '../DbCategoryRow';

export type AutoCompleteDecorationProps = {
  filterSuggestions?: (allSuggestions: string[]) => string[];
  onSelectEntityId: (entityId: string) => void;
} & Omit<
  AutoCompleteDropdownProps<any>,
  'allSuggestions' | 'getSuggestionText' | 'DropdownRow'
>;
const AutoCompleteDecoration: FC<AutoCompleteDecorationProps> = props => {
  // PROPS
  const {
    value = '',
    onChangeText = () => {},
    onSubmitEditing = () => {},
    filterSuggestions = (all: string[]) => all,
    onSelectEntityId,
  } = props;

  // REDUX SELECTOR
  const {allDbInputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  console.log('AUTOCOMPLETECATEGORY----------------------------');
  console.log(allDbInputs);

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

  // Add optional prop to handle preventing commiting a non-existant input name
  const handleCommitInputName = (newInputName: string) => {
    onChangeText(newInputName);
  };
  // Easier to handle if user cannot 'submit' text
  //    and can only 'select' text
  // const handleSubmitEditing = (
  //   e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  // ) => {
  //   if (value !== '' && new Set(allDbInputs).has(value)) onSubmitEditing(e);
  // };
  const handleCommitCId = (newCId: string) => {};
  const handleDeleteCategoryRow = () => {};

  const getSuggestionText = (input: string) => input;

  // console.log('AUTOCOMPLETECATEGORY RERENDERED');

  return (
    <AutoCompleteDropdown
      {...props}
      allSuggestions={filterSuggestions(allDbInputs)}
      getSuggestionText={getSuggestionText}
      onChangeText={handleCommitInputName}
      onSubmitEditing={onSubmitEditing}
      DropdownRow={DropdownRow(
        handleSelectEntityId,
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
          deletable={false}
          inputName={entityId}
          onCommitInputName={setInputValue}
          onDeleteCategoryRow={handleDeleteCategoryRow}
        />
      </TouchableOpacity>
    );
  };

export default AutoCompleteDecoration;
