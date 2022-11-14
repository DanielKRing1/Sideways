import React, {FC, useMemo} from 'react';

import AutoCompleteDropdown, {
  AutoCompleteDropdownProps,
  DropdownRowProps,
} from 'ssComponents/Search/AutoCompleteDropdown';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {RootState} from 'ssRedux/index';
import DbCategoryRow from './DbCategoryRow';

export type AutoCompleteDecorationProps = {
  editable?: boolean;

  onSelectEntityId: (entityId: string) => void;
} & Omit<
  AutoCompleteDropdownProps<any>,
  'allSuggestions' | 'getSuggestionText' | 'DropdownRow'
>;
const AutoCompleteDecoration: FC<AutoCompleteDecorationProps> = props => {
  // PROPS
  const {
    editable = true,
    clickOutsideId,
    placeholder,
    inputValue,
    setInputValue,
    onSelectEntityId,
  } = props;

  // REDUX SELECTOR
  const {userJsonSignature} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );
  const {allDbInputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  // HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    setInputValue(newInputName);
  };
  const handleDeleteCategoryRow = () => {};

  // DROPDOWN ROW
  const DropdownRow: FC<DropdownRowProps<any>> = useMemo(
    () => props => {
      const entityId: string = props.suggestion;

      return (
        <TouchableOpacity onPress={() => onSelectEntityId(entityId)}>
          <DbCategoryRow
            inputName={inputValue}
            onCommitInputName={handleCommitInputName}
            onDeleteCategoryRow={handleDeleteCategoryRow}
          />
        </TouchableOpacity>
      );
    },
    [editable, onSelectEntityId],
  );

  return (
    <AutoCompleteDropdown
      clickOutsideId={clickOutsideId}
      placeholder={placeholder}
      allSuggestions={allDbInputs}
      getSuggestionText={input => input}
      inputValue={inputValue}
      setInputValue={setInputValue}
      DropdownRow={DropdownRow}
    />
  );
};

export default AutoCompleteDecoration;
