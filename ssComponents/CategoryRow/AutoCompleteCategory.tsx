import React, {FC, useMemo} from 'react';

import AutoCompleteDropdown, {
  AutoCompleteDropdownProps,
  DropdownRowProps,
} from 'ssComponents/Search/AutoCompleteDropdown';
import DecorationRow from './BaseCategoryRow';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'ssRedux/index';
import {
  DECORATION_ROW_TYPE,
  DecorationJson,
} from 'ssDatabase/api/userJson/category/types';

export type AutoCompleteDecorationProps<T> = {
  editable?: boolean;
  allEntityIds: string[];
  dRowType: DECORATION_ROW_TYPE;

  onSelectEntityId: (entityId: string) => void;
} & Omit<
  AutoCompleteDropdownProps<T>,
  'allEntityIds' | 'allSuggestions' | 'getSuggestionText' | 'DropdownRow'
>;
const AutoCompleteDecoration: FC<AutoCompleteDecorationProps<any>> = props => {
  // PROPS
  const {
    editable = true,
    clickOutsideId,
    placeholder,
    inputValue,
    setInputValue,
    dRowType,
    allEntityIds,
    onSelectEntityId,
  } = props;

  // REDUX SELECTOR
  const {fullDecorationMap, decorationsSignature} = useSelector(
    (state: RootState) => state.userJsonSlice.decorationSlice,
  );

  const decorationDict: DecorationJson = useMemo(
    () => fullDecorationMap[dRowType],
    [dRowType],
  );

  const DropdownRow: FC<DropdownRowProps<any>> = useMemo(
    () => props => {
      const entityId: string = props.suggestion;

      return (
        <TouchableOpacity onPress={() => onSelectEntityId(entityId)}>
          <DecorationRow
            editable={editable}
            dRowType={dRowType}
            entityId={entityId}
          />
        </TouchableOpacity>
      );
    },
    [editable, decorationDict, onSelectEntityId],
  );

  return (
    <AutoCompleteDropdown
      clickOutsideId={clickOutsideId}
      placeholder={placeholder}
      allSuggestions={allEntityIds}
      getSuggestionText={entityId => entityId}
      inputValue={inputValue}
      setInputValue={setInputValue}
      DropdownRow={DropdownRow}
    />
  );
};

export default AutoCompleteDecoration;
